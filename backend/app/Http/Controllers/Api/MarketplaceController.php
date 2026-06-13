<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

class MarketplaceController extends Controller
{
    // ----------------------------------------------------
    // Products Endpoints
    // ----------------------------------------------------
    public function publicProducts(Request $request)
    {
        $query = Product::where('status', 'approved')->with('seller.umkm');

        if ($request->has('category') && $request->category !== '' && $request->category !== 'Semua') {
            $categoryVal = $request->category;
            $query->where(function($q) use ($categoryVal) {
                $q->whereHas('category', function ($sq) use ($categoryVal) {
                    $sq->where('name', $categoryVal);
                })->orWhere('category', $categoryVal);
            });
        }

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->get();
        return response()->json($products);
    }

    public function publicProductDetail($id)
    {
        $product = Product::where('status', 'approved')->with('seller.umkm')->findOrFail($id);
        return response()->json($product);
    }

    public function getStores()
    {
        $stores = \App\Models\User::where('role', 'Mitra UMKM')
            ->has('umkm')
            ->with('umkm')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->umkm->name ?? $u->name,
                    'owner' => $u->umkm->owner ?? $u->name,
                    'address' => $u->umkm->address ?? $u->address,
                    'description' => $u->umkm->description ?? 'Mitra Usaha Desa',
                    'avatar' => $u->avatar ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80'
                ];
            });
        return response()->json($stores);
    }

    public function adminProducts()
    {
        $products = Product::latest()->get();
        return response()->json($products);
    }

    public function updateProductStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:approved,pending,rejected']);
        $product = Product::findOrFail($id);
        $product->update(['status' => $request->status]);
        return response()->json($product);
    }

    public function sellerProducts(Request $request)
    {
        $products = Product::where('seller_id', $request->user()->id)->latest()->get();
        return response()->json($products);
    }

    public function addProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category' => 'required|string',
            'image' => 'nullable|string',
            'desa' => 'nullable|string',
        ]);

        $categoryName = $request->get('category', 'Umum');
        $categoryObj = \App\Models\Kategori::firstOrCreate([
            'slug' => \Illuminate\Support\Str::slug($categoryName)
        ], [
            'name' => $categoryName
        ]);

        $validated['seller_id'] = $request->user()->id;
        $validated['kategori_id'] = $categoryObj->id;
        $validated['status'] = 'approved'; // Approved automatically for simplicity, can be moderated by admin

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully.']);
    }

    public function uploadProductImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/products'), $filename);
            $url = 'http://localhost:8000/uploads/products/' . $filename;
            
            return response()->json([
                'message' => 'Image uploaded successfully.',
                'url' => $url
            ]);
        }

        return response()->json(['message' => 'No image file uploaded.'], 400);
    }

    public function updateProduct(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category' => 'required|string',
            'image' => 'nullable|string',
            'desa' => 'nullable|string',
        ]);

        $product = Product::findOrFail($id);
        
        if ($product->seller_id !== $request->user()->id && $request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $categoryName = $request->get('category', 'Umum');
        $categoryObj = \App\Models\Kategori::firstOrCreate([
            'slug' => \Illuminate\Support\Str::slug($categoryName)
        ], [
            'name' => $categoryName
        ]);

        $validated['kategori_id'] = $categoryObj->id;

        $product->update($validated);
        return response()->json($product);
    }

    // ----------------------------------------------------
    // Cart Endpoints
    // ----------------------------------------------------
    public function getCart(Request $request)
    {
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with('product')
            ->get()
            ->map(function ($item) {
                if ($item->product) {
                    return [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => (int)$item->product->price,
                        'desa' => $item->product->desa ?? 'Desa Agro',
                        'img' => $item->product->image ?? 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
                        'rating' => (float)$item->product->rating,
                        'category' => $item->product->category,
                        'qty' => $item->quantity
                    ];
                }
                return null;
            })->filter();

        return response()->json(array_values($cartItems->toArray()));
    }

    public function addToCart(Request $request)
    {
        if (function_exists('opcache_reset')) {
            opcache_reset();
        }

        $request->validate([
            'product_id' => 'required|exists:produks,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $qty = $request->get('quantity', 1);

        $cart = Cart::where('user_id', $request->user()->id)
                    ->where('product_id', $request->product_id)
                    ->first();

        if ($cart) {
            $cart->increment('quantity', $qty);
            $cart->refresh();
        } else {
            $cart = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $qty
            ]);
        }

        return response()->json(['message' => 'Added to cart successfully.', 'cart' => $cart]);
    }

    public function updateCartQty(Request $request, $productId)
    {
        $request->validate([
            'delta' => 'required|integer'
        ]);

        $cart = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->firstOrFail();

        $newQty = $cart->quantity + $request->delta;
        if ($newQty <= 0) {
            $cart->delete();
            return response()->json(['message' => 'Item removed from cart.']);
        }

        $cart->update(['quantity' => $newQty]);
        return response()->json(['message' => 'Cart updated.', 'cart' => $cart]);
    }

    public function removeFromCart(Request $request, $productId)
    {
        Cart::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['message' => 'Item removed from cart.']);
    }

    public function clearCart(Request $request)
    {
        Cart::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Cart cleared.']);
    }

    // ----------------------------------------------------
    // Orders & Checkout Endpoints (with Midtrans Integration)
    // ----------------------------------------------------
    private function formatStatus($dbStatus)
    {
        $mapping = [
            'pending'   => 'Pending',
            'success'   => 'Diproses',
            'shipped'   => 'Dikirim',
            'completed' => 'Selesai',
            'cancelled' => 'Cancelled',
        ];
        return $mapping[$dbStatus] ?? 'Pending';
    }

    private function parseStatus($input)
    {
        $mapping = [
            'Pending'  => 'pending',
            'Diproses' => 'success',
            'Dikirim'   => 'shipped',
            'Selesai'  => 'completed',
            'Cancelled' => 'cancelled',
        ];
        return $mapping[$input] ?? 'pending';
    }

    public function getOrders(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'Pembeli') {
            $orders = Order::where('user_id', $user->id)->with('orderItems.product')->latest()->get();
        } elseif ($user->role === 'Mitra UMKM') {
            $productIds = Product::where('seller_id', $user->id)->pluck('id');
            $orders = Order::whereHas('orderItems', function ($q) use ($productIds) {
                $q->whereIn('product_id', $productIds);
            })->with(['user', 'orderItems' => function ($q) use ($productIds) {
                $q->whereIn('product_id', $productIds);
            }, 'orderItems.product'])->latest()->get();
        } else {
            $orders = Order::with(['user', 'orderItems.product'])->latest()->get();
        }

        $formatted = $orders->map(function ($item) {
            $items = collect($item->orderItems ?? []);
            $summaryParts = [];
            foreach ($items as $ot) {
                $summaryParts[] = ($ot->quantity) . ' x ' . ($ot->product->name ?? 'Produk');
            }

            $vaNumber = null;
            $midtransOrderId = null;
            $snapToken = null;
            $snapUrl = null;

            if (str_contains($item->transaction_id ?? '', '|')) {
                $parts = explode('|', $item->transaction_id);
                if (count($parts) >= 2 && (str_starts_with($parts[1], 'http') || str_contains($parts[1], 'midtrans.com'))) {
                    $snapToken = $parts[0] ?: null;
                    $snapUrl = $parts[1] ?: null;
                    $midtransOrderId = $parts[2] ?? null;
                    $vaNumber = $parts[3] ?? null;
                } else {
                    $vaNumber = $parts[0] ?: null;
                    $midtransOrderId = $parts[1] ?: null;
                }
            } else {
                $vaNumber = $item->transaction_id;
            }

            return [
                'id' => 'ORD-' . date('Y') . '-' . str_pad($item->id, 5, '0', STR_PAD_LEFT),
                'raw_id' => $item->id,
                'buyer' => $item->user->name ?? 'Pembeli',
                'product' => count($summaryParts) > 0 ? $items[0]->product->name ?? 'Produk' : 'Produk',
                'qty' => count($summaryParts) > 0 ? $items[0]->quantity : 0,
                'total' => (int)$item->total_price,
                'status' => $this->formatStatus($item->status),
                'date' => $item->created_at->toDateString(),
                'payment_method' => match($item->payment_type) {
                    'cod'    => 'COD — Bayar di Tempat',
                    'manual' => 'Transfer Bank (Manual)',
                    default  => 'Pembayaran Digital (Midtrans)',
                },
                'snap_token' => $snapToken,
                'snap_url' => $snapUrl,
                'midtrans_order_id' => $midtransOrderId
            ];
        });

        return response()->json($formatted);
    }

    public function checkout(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $user = $request->user();
            $paymentType = $request->get('payment_method', 'midtrans'); // cod, manual, midtrans

            $carts = Cart::where('user_id', $user->id)->with('product')->get();
            if ($carts->isEmpty()) {
                return response()->json(['message' => 'Cart is empty.'], 400);
            }

            $totalPrice = $carts->sum(fn($c) => $c->quantity * $c->product->price);

            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'payment_type' => $paymentType,
            ]);

            foreach ($carts as $cart) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cart->product_id,
                    'quantity' => $cart->quantity,
                    'price_at_sale' => $cart->product->price,
                ]);

                // Decrement stock
                $cart->product->decrement('stock', $cart->quantity);
            }

            // Clear Cart
            Cart::where('user_id', $user->id)->delete();

            // Dispatch notification to sellers
            $sellers = [];
            foreach ($order->orderItems as $item) {
                $sellerId = $item->product?->seller_id;
                if ($sellerId && !in_array($sellerId, $sellers)) {
                    $sellers[] = $sellerId;
                    Notification::send(
                        $sellerId,
                        "Pesanan Baru Masuk 🛒",
                        "Anda menerima pesanan baru dari {$user->name} untuk produk: " . ($item->product?->name ?? 'Produk'),
                        "order",
                        "/umkm/pesanan"
                    );
                }
            }

            if ($paymentType === 'cod') {
                $order->update([
                    'transaction_id' => 'COD-' . strtoupper(Str::random(8)),
                ]);

                // Create payment entry
                \App\Models\Payment::create([
                    'order_id' => $order->id,
                    'amount' => $totalPrice,
                    'payment_method' => 'cod',
                    'transaction_status' => 'pending',
                    'midtrans_order_id' => $order->transaction_id
                ]);

                return response()->json([
                    'message' => 'Pesanan COD berhasil dibuat.',
                    'order_id' => 'ORD-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                    'raw_id' => $order->id
                ], 201);
            }

            if ($paymentType === 'manual') {
                $order->update([
                    'transaction_id' => 'MAN-' . strtoupper(uniqid()),
                ]);

                // Create payment entry
                \App\Models\Payment::create([
                    'order_id' => $order->id,
                    'amount' => $totalPrice,
                    'payment_method' => 'manual',
                    'transaction_status' => 'pending',
                    'midtrans_order_id' => $order->transaction_id
                ]);

                return response()->json([
                    'message' => 'Pesanan transfer manual berhasil dibuat.',
                    'order_id' => 'ORD-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                    'raw_id' => $order->id
                ], 201);
            }

            // Midtrans snap token logic
            try {
                Config::$serverKey = config('midtrans.server_key') ?? env('MIDTRANS_SERVER_KEY');
                Config::$isProduction = config('midtrans.is_production') ?? false;
                Config::$isSanitized = config('midtrans.is_sanitized') ?? true;
                Config::$is3ds = config('midtrans.is_3ds') ?? true;
                Config::$curlOptions = [
                    CURLOPT_SSL_VERIFYHOST => 0,
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_HTTPHEADER => [
                        'X-Disable-SSL: true'
                    ]
                ];

                if (empty(Config::$serverKey)) {
                    throw new \Exception("Midtrans server key not set.");
                }

                $midtransOrderId = 'KD-' . $order->id . '-' . Str::random(5);
                
                $itemDetails = [];
                foreach ($order->orderItems as $item) {
                    $itemDetails[] = [
                        'id' => $item->product_id,
                        'price' => (int)$item->price_at_sale,
                        'quantity' => (int)$item->quantity,
                        'name' => substr($item->product->name, 0, 50),
                    ];
                }

                $params = [
                    'transaction_details' => [
                        'order_id' => $midtransOrderId,
                        'gross_amount' => (int) $totalPrice,
                    ],
                    'customer_details' => [
                        'first_name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone_number ?? '',
                    ],
                    'item_details' => $itemDetails,
                ];

                $snapResponse = Snap::createTransaction($params);
                $snapToken = $snapResponse->token;
                $snapUrl = $snapResponse->redirect_url;

                $order->update([
                    'transaction_id' => $snapToken . '|' . $snapUrl . '|' . $midtransOrderId,
                ]);

                // Create payment entry
                \App\Models\Payment::create([
                    'order_id' => $order->id,
                    'amount' => $totalPrice,
                    'payment_method' => 'midtrans',
                    'transaction_status' => 'pending',
                    'midtrans_order_id' => $midtransOrderId,
                    'snap_token' => $snapToken,
                    'snap_url' => $snapUrl
                ]);

                return response()->json([
                    'message' => 'Checkout success.',
                    'order_id' => 'ORD-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                    'raw_id' => $order->id,
                    'snap_token' => $snapToken,
                    'snap_url' => $snapUrl
                ], 201);

            } catch (\Throwable $e) {
                Log::error("Midtrans Snap Error: " . $e->getMessage());
                // Fallback to manual
                $order->update([
                    'payment_type' => 'manual',
                    'transaction_id' => 'MAN-' . strtoupper(uniqid())
                ]);

                \App\Models\Payment::create([
                    'order_id' => $order->id,
                    'amount' => $totalPrice,
                    'payment_method' => 'manual',
                    'transaction_status' => 'pending',
                    'midtrans_order_id' => $order->transaction_id
                ]);

                return response()->json([
                    'message' => 'Midtrans integration error, fallback to manual transfer.',
                    'order_id' => 'ORD-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                    'raw_id' => $order->id
                ], 201);
            }
        });
    }

    public function advanceOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $currentStatus = $order->status;
        $newStatus = $currentStatus;

        if ($currentStatus === 'pending') {
            $newStatus = 'success';
        } elseif ($currentStatus === 'success') {
            $newStatus = 'shipped';
        } elseif ($currentStatus === 'shipped') {
            $newStatus = 'completed';
        }

        $order->update(['status' => $newStatus]);

        // Send Notification
        Notification::send(
            $order->user_id,
            "Status Pesanan Diperbarui 📦",
            "Pesanan Anda #ORD-" . date('Y') . "-" . str_pad($order->id, 5, '0', STR_PAD_LEFT) . " kini berstatus: " . $this->formatStatus($newStatus),
            "order",
            "/pembeli/lacak"
        );

        return response()->json(['message' => 'Order status advanced.', 'status' => $this->formatStatus($newStatus)]);
    }

    public function checkStatus($id)
    {
        $order = Order::findOrFail($id);
        
        if ($order->payment_type !== 'midtrans' || !str_contains($order->transaction_id ?? '', '|')) {
            return response()->json([
                'message' => 'Order does not use digital payment.',
                'status' => $this->formatStatus($order->status)
            ]);
        }

        $parts = explode('|', $order->transaction_id);
        $midtransOrderId = $parts[2] ?? null;

        if (!$midtransOrderId) {
            return response()->json([
                'message' => 'Midtrans order ID not found.',
                'status' => $this->formatStatus($order->status)
            ]);
        }

        try {
            Config::$serverKey = config('midtrans.server_key') ?? env('MIDTRANS_SERVER_KEY');
            Config::$isProduction = config('midtrans.is_production') ?? false;
            Config::$curlOptions = [
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_HTTPHEADER => [
                    'X-Disable-SSL: true'
                ]
            ];

            $status = Transaction::status($midtransOrderId);
            $transaction = strtolower($status->transaction_status);

            $newStatus = 'pending';
            if ($transaction == 'settlement' || $transaction == 'success' || $transaction == 'capture') {
                $newStatus = 'success';
            } elseif ($transaction == 'deny' || $transaction == 'expire' || $transaction == 'cancel') {
                $newStatus = 'cancelled';
            }

            if ($newStatus !== $order->status) {
                if ($newStatus == 'cancelled' && $order->status == 'pending') {
                    // Restore stock
                    foreach ($order->orderItems as $item) {
                        $item->product->increment('stock', $item->quantity);
                    }
                }
                $order->update(['status' => $newStatus]);

                // Sync payments table status
                $payment = \App\Models\Payment::where('order_id', $order->id)->first();
                if ($payment) {
                    $payment->update(['transaction_status' => $transaction]);
                }
                
                Notification::send(
                    $order->user_id,
                    "Pembayaran Diperbarui 💳",
                    "Pesanan Anda #ORD-" . date('Y') . "-" . str_pad($order->id, 5, '0', STR_PAD_LEFT) . " diperbarui ke: " . $this->formatStatus($newStatus),
                    "order",
                    "/pembeli/lacak"
                );
            }

            return response()->json([
                'message' => 'Status synchronized.',
                'status' => $this->formatStatus($newStatus),
                'midtrans_status' => $transaction
            ]);

        } catch (\Exception $e) {
            Log::error("Status Sync Error: " . $e->getMessage());
            return response()->json([
                'message' => 'Midtrans connection issue: ' . $e->getMessage(),
                'status' => $this->formatStatus($order->status)
            ]);
        }
    }

    public function uploadManualProof(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'sender_name' => 'required|string',
            'bank_name' => 'required|string',
            'amount_paid' => 'required|numeric'
        ]);

        $orderId = $request->order_id;
        if (str_contains($orderId, '-')) {
            $parts = explode('-', $orderId);
            $orderId = (int)end($parts);
        }

        $order = Order::findOrFail($orderId);
        $order->update([
            'status' => 'success',
            'transaction_id' => 'MAN-TX-' . strtoupper(uniqid())
        ]);

        // Sync payment record
        $payment = \App\Models\Payment::where('order_id', $order->id)->first();
        if ($payment) {
            $payment->update([
                'transaction_status' => 'settlement',
                'payment_method' => 'manual'
            ]);
        } else {
            \App\Models\Payment::create([
                'order_id' => $order->id,
                'amount' => $order->total_price,
                'payment_method' => 'manual',
                'transaction_status' => 'settlement',
                'midtrans_order_id' => $order->transaction_id
            ]);
        }

        Notification::send(
            $order->user_id,
            "Pembayaran Transfer Diterima 💳",
            "Bukti pembayaran manual Anda untuk pesanan #ORD-" . date('Y') . "-" . str_pad($order->id, 5, '0', STR_PAD_LEFT) . " berhasil diverifikasi.",
            "order",
            "/pembeli/lacak"
        );

        return response()->json([
            'message' => 'Bukti pembayaran berhasil diunggah.',
            'order' => $order
        ]);
    }

    public function webhook(Request $request)
    {
        Config::$serverKey = config('midtrans.server_key') ?? env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = config('midtrans.is_production') ?? false;

        try {
            Log::info('Midtrans Webhook Call:', $request->all());

            $transactionStatus = strtolower($request->transaction_status);
            $type = $request->payment_type;
            $midtransOrderId = $request->order_id;
            $fraudStatus = $request->fraud_status;

            // Extract order ID
            $parts = explode('-', $midtransOrderId);
            $orderId = $parts[1] ?? $midtransOrderId;

            $order = Order::find($orderId);
            if (!$order) {
                return response()->json(['message' => 'Order not found.'], 404);
            }

            $newStatus = 'pending';

            if ($transactionStatus == 'capture') {
                if ($type == 'credit_card') {
                    $newStatus = ($fraudStatus == 'challenge') ? 'pending' : 'success';
                }
            } elseif ($transactionStatus == 'settlement' || $transactionStatus == 'success') {
                $newStatus = 'success';
            } elseif ($transactionStatus == 'pending') {
                $newStatus = 'pending';
            } elseif ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
                $newStatus = 'cancelled';
            }

            if ($newStatus == 'cancelled' && $order->status == 'pending') {
                foreach ($order->orderItems as $item) {
                    $item->product->increment('stock', $item->quantity);
                }
            }

            $order->update([
                'status' => $newStatus,
                'payment_type' => $type ?? $order->payment_type
            ]);

            // Sync payment record
            $payment = \App\Models\Payment::where('order_id', $order->id)->first();
            if ($payment) {
                $payment->update([
                    'transaction_status' => $transactionStatus,
                    'payment_method' => $type ?? $payment->payment_method
                ]);
            }

            Notification::send(
                $order->user_id,
                "Pembayaran Webhook Diperbarui 💳",
                "Pesanan Anda #ORD-" . date('Y') . "-" . str_pad($order->id, 5, '0', STR_PAD_LEFT) . " terupdate via sistem: " . $this->formatStatus($newStatus),
                "order",
                "/pembeli/lacak"
            );

            return response()->json(['message' => 'OK']);
        } catch (\Exception $e) {
            Log::error("Midtrans Webhook Handler Error: " . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function addReview(Request $request, $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);

        $product = Product::findOrFail($productId);
        $user = $request->user();

        $review = \App\Models\Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $request->rating,
            'review' => $request->review,
        ]);

        // Recalculate product rating
        $avgRating = \App\Models\Review::where('product_id', $product->id)->avg('rating');
        $product->update(['rating' => $avgRating]);

        return response()->json([
            'message' => 'Ulasan berhasil dikirim.',
            'review' => $review,
            'avg_rating' => $avgRating
        ], 201);
    }

    public function getProductReviews($productId)
    {
        $reviews = \App\Models\Review::where('product_id', $productId)
            ->with('user')
            ->latest()
            ->get();
        return response()->json($reviews);
    }

    public function publicStats()
    {
        $totalOrdersAmount = \DB::table('pesanans')->where('status', '!=', 'cancelled')->sum('total_price') ?? 0.00;
        $totalInvestedAmount = \DB::table('investasis')->where('status', 'Aktif')->sum('amount') ?? 0.00;
        
        $totalUmkm = \App\Models\User::where('role', 'Mitra UMKM')->count();
        $totalInvestors = \App\Models\User::where('role', 'Investor')->count();
        $totalBuyers = \App\Models\User::where('role', 'Pembeli')->count();
        
        return response()->json([
            'financial_circulation' => floatval($totalOrdersAmount) + floatval($totalInvestedAmount),
            'total_umkm' => $totalUmkm,
            'total_investors' => $totalInvestors,
            'total_buyers' => $totalBuyers,
            'chart_data' => [
                ['month' => 'Jan', 'val' => 30],
                ['month' => 'Feb', 'val' => 45],
                ['month' => 'Mar', 'val' => 40],
                ['month' => 'Apr', 'val' => 60],
                ['month' => 'Mei', 'val' => 80],
                ['month' => 'Jun', 'val' => min(100, 95 + ($totalOrdersAmount > 0 ? 5 : 0))]
            ],
            'sector_data' => [
                ['name' => 'Pertanian Makro', 'pct' => 45, 'color' => 'bg-emerald-500', 'border' => '#10b981'],
                ['name' => 'Kerajinan Kriya', 'pct' => 30, 'color' => 'bg-amber-500', 'border' => '#f59e0b'],
                ['name' => 'Kuliner Reseller', 'pct' => 20, 'color' => 'bg-blue-500', 'border' => '#3b82f6'],
                ['name' => 'Lainnya', 'pct' => 5, 'color' => 'bg-purple-500', 'border' => '#8b5cf6'],
            ]
        ]);
    }
}
