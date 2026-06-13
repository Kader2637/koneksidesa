<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\KycVerification;
use App\Models\LoanRequest;
use App\Models\Ticket;
use App\Models\User;
use App\Models\VillageWithdrawal;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // ----------------------------------------------------
    // KYC Verifications
    // ----------------------------------------------------
    public function getPendingKycs()
    {
        $kycs = KycVerification::latest()->get()->map(function ($k) {
            return [
                'id' => $k->id,
                'umkm' => $k->umkm,
                'owner' => $k->owner,
                'nib' => $k->nib,
                'ktp' => $k->ktp,
                'status' => $k->status
            ];
        });
        return response()->json($kycs);
    }

    public function resolveKyc(Request $request, $id)
    {
        $request->validate(['decision' => 'required|in:Disetujui,Ditolak']);
        $kyc = KycVerification::findOrFail($id);
        $kyc->update(['status' => $request->decision]);

        // Send Notification to UMKM
        Notification::send(
            $kyc->user_id,
            "Verifikasi KYC " . $request->decision . " 🛡️",
            "Pengajuan verifikasi dokumen toko Anda telah " . strtolower($request->decision) . " oleh Administrator.",
            "kyc",
            "/umkm"
        );

        return response()->json(['message' => 'KYC status updated.', 'kyc' => $kyc]);
    }

    // ----------------------------------------------------
    // Campaigns Moderation
    // ----------------------------------------------------
    public function getPendingCampaigns()
    {
        $campaigns = Campaign::latest()->get()->map(function ($c) {
            return [
                'id' => $c->id,
                'title' => $c->title,
                'umkm' => $c->umkm,
                'target' => (int)$c->target,
                'roi' => $c->roi,
                'status' => $c->status
            ];
        });
        return response()->json($campaigns);
    }

    public function resolveCampaign(Request $request, $id)
    {
        $request->validate(['decision' => 'required|in:Aktif,Ditolak']);
        $campaign = Campaign::findOrFail($id);
        $campaign->update(['status' => $request->decision]);

        return response()->json(['message' => 'Campaign status updated.', 'campaign' => $campaign]);
    }

    // ----------------------------------------------------
    // User management
    // ----------------------------------------------------
    public function getUsersList()
    {
        $users = User::where('role', '!=', 'Admin')
            ->latest()
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'role' => $u->role,
                    'status' => $u->phone_number !== 'blocked' ? 'Aktif' : 'Diblokir',
                    'joined' => $u->created_at->format('d M Y')
                ];
            });
        return response()->json($users);
    }

    public function toggleUserStatus($id)
    {
        $user = User::findOrFail($id);
        if ($user->phone_number === 'blocked') {
            $user->update(['phone_number' => null]);
            $status = 'Aktif';
        } else {
            $user->update(['phone_number' => 'blocked']);
            $status = 'Diblokir';
        }

        return response()->json(['message' => 'User status updated.', 'status' => $status]);
    }

    // ----------------------------------------------------
    // Treasury & BUMDes Withdrawals
    // ----------------------------------------------------
    public function getTreasuryStats()
    {
        // For simplicity, store treasury balance dynamically in BUMDes account info or simple static/dynamic state
        // Let's compute dynamic treasury as a sum of cash
        $treasurySetting = DB::table('settings')->where('key', 'village_treasury')->first();
        $balance = $treasurySetting ? (float)$treasurySetting->value : 42500000.00;

        $withdrawals = VillageWithdrawal::latest()->get()->map(function ($w) {
            return [
                'id' => 'WD-' . str_pad($w->id, 4, '0', STR_PAD_LEFT),
                'date' => $w->created_at->format('d F Y'),
                'bank' => $w->bank,
                'amount' => (int)$w->amount,
                'status' => $w->status
            ];
        });

        return response()->json([
            'village_treasury' => $balance,
            'withdrawals' => $withdrawals
        ]);
    }

    public function addWithdrawal(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
        ]);

        $amount = (float)$request->amount;
        $treasurySetting = DB::table('settings')->where('key', 'village_treasury')->first();
        $balance = $treasurySetting ? (float)$treasurySetting->value : 42500000.00;

        if ($amount > $balance) {
            return response()->json(['message' => 'Saldo kas BUMDesa tidak mencukupi.'], 400);
        }

        $newBalance = $balance - $amount;
        DB::table('settings')->updateOrInsert(
            ['key' => 'village_treasury'],
            ['value' => $newBalance]
        );

        $withdrawal = VillageWithdrawal::create([
            'bank' => 'BUMDesa - BRI (1234xxxx)',
            'amount' => $amount,
            'status' => 'Diproses'
        ]);

        return response()->json([
            'message' => 'Penarikan kas diproses.',
            'village_treasury' => $newBalance,
            'withdrawal' => $withdrawal
        ]);
    }

    // ----------------------------------------------------
    // Support Tickets
    // ----------------------------------------------------
    public function getTickets()
    {
        $tickets = Ticket::with('user')->latest()->get()->map(function ($t) {
            return [
                'id' => 'TK-' . str_pad($t->id, 3, '0', STR_PAD_LEFT),
                'user' => $t->user->name ?? 'Warga',
                'subject' => $t->subject,
                'category' => $t->category,
                'status' => $t->status,
                'date' => $t->created_at->format('d M Y')
            ];
        });
        return response()->json($tickets);
    }

    public function resolveTicket($id)
    {
        $numericId = (int)str_replace('TK-', '', $id);
        $ticket = Ticket::findOrFail($numericId);
        $ticket->update(['status' => 'Selesai']);

        Notification::send(
            $ticket->user_id,
            "Keluhan Diselesaikan 🛠️",
            "Keluhan Anda mengenai '{$ticket->subject}' telah diselesaikan oleh tim dukungan.",
            "ticket",
            "/pembeli"
        );

        return response()->json(['message' => 'Ticket marked as resolved.']);
    }

    // ----------------------------------------------------
    // UMKM Loans (Helper for UMKM dashboard)
    // ----------------------------------------------------
    public function getUmkmLoans(Request $request)
    {
        $loans = LoanRequest::where('user_id', $request->user()->id)->latest()->get()->map(function ($l) {
            return [
                'id' => 'LN-' . str_pad($l->id, 4, '0', STR_PAD_LEFT),
                'amount' => (int)$l->amount,
                'tenor' => $l->tenor,
                'status' => $l->status,
                'paymentProgress' => $l->payment_progress
            ];
        });
        return response()->json($loans);
    }

    public function submitLoan(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100000',
            'tenor' => 'required|string',
        ]);

        $loan = LoanRequest::create([
            'user_id' => $request->user()->id,
            'amount' => $request->amount,
            'tenor' => $request->tenor,
            'status' => 'Pending',
            'payment_progress' => 0
        ]);

        return response()->json(['message' => 'Pengajuan pinjaman berhasil diajukan.', 'loan' => $loan]);
    }

    public function dashboardStats()
    {
        $totalUmkm = User::where('role', 'Mitra UMKM')->count();
        $totalInvestors = User::where('role', 'Investor')->count();
        $totalBuyers = User::where('role', 'Pembeli')->count();
        $totalProducts = Product::count();
        $totalTransactions = \App\Models\Order::where('status', 'completed')->count();
        $totalInvestments = Investment::where('status', 'Aktif')->count();
        
        $totalOrdersAmount = \App\Models\Order::where('status', '!=', 'cancelled')->sum('total_price') ?? 0.00;
        $totalInvestedAmount = Investment::where('status', 'Aktif')->sum('amount') ?? 0.00;

        return response()->json([
            'total_umkm' => $totalUmkm,
            'total_investors' => $totalInvestors,
            'total_buyers' => $totalBuyers,
            'total_products' => $totalProducts,
            'total_transactions' => $totalTransactions,
            'total_investments' => $totalInvestments,
            'total_orders_amount' => $totalOrdersAmount,
            'total_invested_amount' => $totalInvestedAmount,
            'chart_data' => [
                ['month' => 'Jan', 'transactions' => 12, 'investments' => 2],
                ['month' => 'Feb', 'transactions' => 19, 'investments' => 4],
                ['month' => 'Mar', 'transactions' => 15, 'investments' => 3],
                ['month' => 'Apr', 'transactions' => 22, 'investments' => 6],
                ['month' => 'Mei', 'transactions' => 30, 'investments' => 8],
                ['month' => 'Jun', 'transactions' => $totalTransactions, 'investments' => $totalInvestments]
            ]
        ]);
    }
}
