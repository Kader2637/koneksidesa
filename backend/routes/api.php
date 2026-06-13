<?php

if (function_exists('opcache_reset')) {
    opcache_reset();
}

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MarketplaceController;
use App\Http\Controllers\Api\InvestorController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/bazar-products', [MarketplaceController::class, 'publicProducts']);
Route::get('/bazar-products/{id}', [MarketplaceController::class, 'publicProductDetail']);
Route::get('/bazar-stores', [MarketplaceController::class, 'getStores']);
Route::get('/bazar-campaigns', [InvestorController::class, 'getCampaigns']);
Route::get('/products/{productId}/reviews', [MarketplaceController::class, 'getProductReviews']);
Route::post('/midtrans/webhook', [MarketplaceController::class, 'webhook']);
Route::get('/public-stats', [MarketplaceController::class, 'publicStats']);





/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth profile & logout
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::post('/auth/profile/update', [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/search', [MarketplaceController::class, 'search']);

    // Notifications
    Route::get('/notifications', function (\Illuminate\Http\Request $request) {
        $notifications = \App\Models\Notification::where('user_id', $request->user()->id)
            ->latest()
            ->get();
        return response()->json($notifications);
    });
    
    Route::post('/notifications/read-all', function (\Illuminate\Http\Request $request) {
        \App\Models\Notification::where('user_id', $request->user()->id)->update(['read' => true]);
        return response()->json(['message' => 'All notifications marked as read.']);
    });

    // ----------------------------------------------------
    // Role: Pembeli (Buyer)
    // ----------------------------------------------------
    Route::middleware('role:Pembeli,Admin')->group(function () {
        Route::get('/carts', [MarketplaceController::class, 'getCart']);
        Route::post('/carts', [MarketplaceController::class, 'addToCart']);
        Route::put('/carts/{productId}', [MarketplaceController::class, 'updateCartQty']);
        Route::delete('/carts/{productId}', [MarketplaceController::class, 'removeFromCart']);
        Route::delete('/carts', [MarketplaceController::class, 'clearCart']);
        
        Route::post('/orders', [MarketplaceController::class, 'checkout']);
        Route::get('/orders', [MarketplaceController::class, 'getOrders']);
        Route::get('/orders/{id}/check-status', [MarketplaceController::class, 'checkStatus']);
        Route::put('/orders/{id}/complete', [MarketplaceController::class, 'completeOrder']);
        Route::post('/payments/upload', [MarketplaceController::class, 'uploadManualProof']);
        Route::post('/products/{productId}/reviews', [MarketplaceController::class, 'addReview']);
    });

    // ----------------------------------------------------
    // Role: Mitra UMKM (Seller)
    // ----------------------------------------------------
    Route::middleware('role:Mitra UMKM,Admin')->group(function () {
        Route::get('/umkm/products', [MarketplaceController::class, 'sellerProducts']);
        Route::post('/umkm/products', [MarketplaceController::class, 'addProduct']);
        Route::post('/umkm/products/upload', [MarketplaceController::class, 'uploadProductImage']);
        Route::put('/umkm/products/{id}', [MarketplaceController::class, 'updateProduct']);
        Route::delete('/umkm/products/{id}', [MarketplaceController::class, 'deleteProduct']);
        
        Route::get('/umkm/orders', [MarketplaceController::class, 'getOrders']);
        Route::get('/umkm/finance-stats', [MarketplaceController::class, 'getUmkmFinanceStats']);
        Route::put('/umkm/orders/{id}/status', [MarketplaceController::class, 'advanceOrderStatus']);
        
        Route::get('/umkm/loans', [AdminController::class, 'getUmkmLoans']);
        Route::post('/umkm/loans', [AdminController::class, 'submitLoan']);

        // Two-way funding
        Route::get('/umkm/investors', [InvestorController::class, 'listInvestors']);
        Route::post('/umkm/pendanaan', [InvestorController::class, 'submitPendanaan']);
        Route::get('/umkm/pendanaan', [InvestorController::class, 'umkmPendanaans']);
        Route::get('/umkm/investasi', [InvestorController::class, 'umkmInvestasis']);
        Route::post('/umkm/investasi/{id}/resolve', [InvestorController::class, 'resolveInvestasi']);
        Route::post('/umkm/roi-payment/{id}/pay', [InvestorController::class, 'payRoiManual']);
    });

    // ----------------------------------------------------
    // Role: Investor
    // ----------------------------------------------------
    Route::middleware('role:Investor,Admin')->group(function () {
        Route::get('/investor/campaigns', [InvestorController::class, 'getCampaigns']);
        Route::post('/investor/invest', [InvestorController::class, 'invest']);
        Route::get('/investor/portfolio', [InvestorController::class, 'getPortfolio']);
        Route::post('/investor/wallet/deposit', [InvestorController::class, 'deposit']);
        Route::post('/investor/wallet/withdraw', [InvestorController::class, 'withdraw']);

        // Two-way funding
        Route::get('/investor/umkms', [InvestorController::class, 'listUmkms']);
        Route::post('/investor/investasi', [InvestorController::class, 'submitInvestasi']);
        Route::get('/investor/investasi', [InvestorController::class, 'investorInvestasis']);
        Route::get('/investor/pendanaan', [InvestorController::class, 'investorPendanaans']);
        Route::post('/investor/pendanaan/{id}/resolve', [InvestorController::class, 'resolvePendanaan']);
    });

    // ----------------------------------------------------
    // Role: Admin
    // ----------------------------------------------------
    Route::middleware('role:Admin')->group(function () {
        Route::get('/admin/dashboard-stats', [AdminController::class, 'dashboardStats']);
        Route::get('/admin/products', [MarketplaceController::class, 'adminProducts']);
        Route::put('/admin/products/{id}/status', [MarketplaceController::class, 'updateProductStatus']);
        Route::delete('/admin/products/{id}', [MarketplaceController::class, 'deleteProduct']);
        Route::get('/admin/kyc', [AdminController::class, 'getPendingKycs']);
        Route::post('/admin/kyc/{id}/resolve', [AdminController::class, 'resolveKyc']);
        
        Route::get('/admin/campaigns', [AdminController::class, 'getPendingCampaigns']);
        Route::post('/admin/campaigns/{id}/resolve', [AdminController::class, 'resolveCampaign']);
        
        Route::get('/admin/users', [AdminController::class, 'getUsersList']);
        Route::post('/admin/users/{id}/toggle', [AdminController::class, 'toggleUserStatus']);
        
        Route::get('/admin/treasury', [AdminController::class, 'getTreasuryStats']);
        Route::post('/admin/treasury/withdraw', [AdminController::class, 'addWithdrawal']);
        
        Route::get('/admin/tickets', [AdminController::class, 'getTickets']);
        Route::post('/admin/tickets/{id}/resolve', [AdminController::class, 'resolveTicket']);
    });
});
