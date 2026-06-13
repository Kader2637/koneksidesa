<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Investment;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvestorController extends Controller
{
    public function getCampaigns()
    {
        $campaigns = Campaign::where('status', 'Aktif')->with('user.umkm')->latest()->get();
        return response()->json($campaigns);
    }

    public function invest(Request $request)
    {
        $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount' => 'required|numeric|min:1000',
        ]);

        $user = $request->user();
        $campaign = Campaign::findOrFail($request->campaign_id);
        $amount = (float) $request->amount;

        if ($user->wallet_balance < $amount) {
            return response()->json(['message' => 'Saldo dompet tidak mencukupi.'], 400);
        }

        $capacityLeft = $campaign->target - $campaign->current;
        if ($amount > $capacityLeft) {
            return response()->json(['message' => 'Jumlah investasi melebihi sisa kapasitas kampanye. Maksimal: ' . $capacityLeft], 400);
        }

        return DB::transaction(function () use ($user, $campaign, $amount) {
            // Deduct balance
            $user->decrement('wallet_balance', $amount);

            // Update campaign progress
            $campaign->increment('current', $amount);
            $newProgress = min(100, round(($campaign->current / $campaign->target) * 100));
            $campaign->update(['progress' => $newProgress]);

            // Create expected return
            $expectedReturn = $amount + ($amount * ($campaign->roi / 100));

            // Create holding / portfolio record
            $investment = Investment::create([
                'user_id' => $user->id,
                'pendanaan_id' => $campaign->id,
                'amount' => $amount,
                'expected_return' => $expectedReturn,
                'status' => 'Aktif',
            ]);

            Notification::send(
                $user->id,
                "Investasi Berhasil 📈",
                "Investasi sebesar Rp " . number_format($amount, 0, ',', '.') . " pada kampanye '{$campaign->title}' sukses disalurkan.",
                "investment",
                "/investor/portfolio"
            );

            return response()->json([
                'message' => 'Investasi berhasil disalurkan.',
                'investment' => $investment,
                'wallet_balance' => $user->wallet_balance
            ]);
        });
    }

    public function getPortfolio(Request $request)
    {
        $portfolio = Investment::where('user_id', $request->user()->id)
            ->with(['campaign.user.umkm', 'umkm.umkm'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->pendanaan_id,
                    'title' => $item->campaign->title ?? 'Pembiayaan Toko',
                    'umkm' => $item->campaign->user->umkm->name ?? $item->umkm->umkm->name ?? $item->campaign->umkm ?? 'Mitra Karya',
                    'invested' => (int) $item->amount,
                    'roi' => $item->campaign->roi ?? 12,
                    'expectedReturn' => (int) $item->expected_return,
                    'status' => $item->status
                ];
            });

        return response()->json($portfolio);
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
        ]);

        $user = $request->user();
        $amount = (float) $request->amount;

        $user->increment('wallet_balance', $amount);

        Notification::send(
            $user->id,
            "Top Up Saldo Sukses 💳",
            "Pengisian saldo dompet sebesar Rp " . number_format($amount, 0, ',', '.') . " telah berhasil.",
            "wallet",
            "/investor/wallet"
        );

        return response()->json([
            'message' => 'Top Up berhasil.',
            'wallet_balance' => $user->wallet_balance
        ]);
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
        ]);

        $user = $request->user();
        $amount = (float) $request->amount;

        if ($user->wallet_balance < $amount) {
            return response()->json(['message' => 'Saldo dompet tidak mencukupi untuk melakukan penarikan.'], 400);
        }

        $user->decrement('wallet_balance', $amount);

        Notification::send(
            $user->id,
            "Penarikan Saldo Berhasil 💸",
            "Penarikan dana sebesar Rp " . number_format($amount, 0, ',', '.') . " sukses diproses ke rekening Anda.",
            "wallet",
            "/investor/wallet"
        );

        return response()->json([
            'message' => 'Penarikan berhasil.',
            'wallet_balance' => $user->wallet_balance
        ]);
    }

    public function listInvestors()
    {
        $investors = \App\Models\User::where('role', 'Investor')->get(['id', 'name', 'email']);
        return response()->json($investors);
    }

    public function listUmkms()
    {
        $umkms = \App\Models\User::where('role', 'Mitra UMKM')
            ->with('umkm')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'user_id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'business_name' => $u->umkm->name ?? 'Toko Desa',
                    'owner' => $u->umkm->owner ?? $u->name,
                    'nib' => $u->umkm->nib ?? '',
                    'address' => $u->umkm->address ?? $u->address,
                    'description' => $u->umkm->description ?? 'Mitra Usaha Desa'
                ];
            });
        return response()->json($umkms);
    }

    public function submitPendanaan(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'business_name' => 'required|string',
            'description' => 'required|string',
            'purpose' => 'required|string',
            'target_amount' => 'required|numeric|min:1000',
            'tenor' => 'required|string',
            'investor_id' => 'required|exists:users,id',
            'proposal' => 'nullable|string',
            'roi' => 'required|numeric|min:1'
        ]);

        $user = $request->user();

        // Create campaign/pendanaan
        $pendanaan = Campaign::create([
            'user_id' => $user->id,
            'investor_id' => $request->investor_id,
            'title' => $request->title,
            'business_name' => $request->business_name,
            'description' => $request->description,
            'purpose' => $request->purpose,
            'target_amount' => $request->target_amount,
            'current_amount' => 0.00,
            'roi' => $request->roi,
            'tenor' => $request->tenor,
            'risk' => 'Rendah', // Default risk
            'proposal_path' => $request->proposal ?? '',
            'umkm' => $request->business_name, // keep compatibility with old fields
            'target' => $request->target_amount, // compatibility
            'status' => 'Pending'
        ]);

        // Notify investor
        Notification::send(
            $request->investor_id,
            "Pengajuan Pendanaan Baru 📊",
            "UMKM {$request->business_name} mengirimkan pengajuan pendanaan: '{$request->title}'.",
            "proposal",
            "/investor"
        );

        return response()->json([
            'message' => 'Pengajuan pendanaan berhasil dikirim.',
            'pendanaan' => $pendanaan
        ], 201);
    }

    public function resolvePendanaan(Request $request, $id)
    {
        $request->validate(['decision' => 'required|in:Diterima,Ditolak']);

        $pendanaan = Campaign::findOrFail($id);
        $investor = $request->user();

        if ($request->decision === 'Diterima') {
            $amount = $pendanaan->target_amount ?? $pendanaan->target ?? 0;
            if ($investor->wallet_balance < $amount) {
                return response()->json(['message' => 'Saldo dompet Anda tidak mencukupi untuk mendanai pengajuan ini.'], 400);
            }

            return DB::transaction(function () use ($pendanaan, $investor, $amount) {
                // Deduct investor wallet
                $investor->decrement('wallet_balance', $amount);

                // Add to UMKM wallet (associated user)
                if ($pendanaan->user_id) {
                    $umkmUser = User::find($pendanaan->user_id);
                    if ($umkmUser) {
                        $umkmUser->increment('wallet_balance', $amount);
                    }
                }

                $pendanaan->update([
                    'status' => 'Diterima',
                    'target_amount' => $amount,
                    'current_amount' => $amount,
                    'current' => $amount,
                    'progress' => 100
                ]);

                // Create investment holding
                $expectedReturn = $amount + ($amount * ($pendanaan->roi / 100));
                Investment::create([
                    'user_id' => $investor->id,
                    'umkm_id' => $pendanaan->user_id,
                    'pendanaan_id' => $pendanaan->id,
                    'amount' => $amount,
                    'expected_return' => $expectedReturn,
                    'status' => 'Aktif'
                ]);

                // Notify UMKM
                Notification::send(
                    $pendanaan->user_id,
                    "Pendanaan Diterima 🎉",
                    "Investor {$investor->name} menyetujui pengajuan pendanaan '{$pendanaan->title}' Anda. Dana telah ditambahkan ke dompet Anda.",
                    "investment",
                    "/umkm/pinjaman"
                );

                return response()->json(['message' => 'Pengajuan pendanaan berhasil disetujui.', 'pendanaan' => $pendanaan]);
            });
        } else {
            $pendanaan->update(['status' => 'Ditolak']);

            // Notify UMKM
            Notification::send(
                $pendanaan->user_id,
                "Pendanaan Ditolak ❌",
                "Investor {$investor->name} menolak pengajuan pendanaan '{$pendanaan->title}' Anda.",
                "proposal",
                "/umkm/pinjaman"
            );

            return response()->json(['message' => 'Pengajuan pendanaan ditolak.']);
        }
    }

    public function submitInvestasi(Request $request)
    {
        $request->validate([
            'umkm_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:1000',
            'message' => 'nullable|string',
            'tenor' => 'required|string',
            'roi' => 'required|numeric|min:1'
        ]);

        $investor = $request->user();
        $amount = (float) $request->amount;
        $roi = (float) $request->roi;

        if ($investor->wallet_balance < $amount) {
            return response()->json(['message' => 'Saldo dompet tidak mencukupi.'], 400);
        }

        // Create direct investment offer (Pending status)
        $investment = Investment::create([
            'user_id' => $investor->id,
            'umkm_id' => $request->umkm_id,
            'amount' => $amount,
            'expected_return' => $amount + ($amount * ($roi / 100)),
            'message' => $request->message,
            'tenor' => $request->tenor,
            'status' => 'Pending'
        ]);

        // Notify UMKM
        Notification::send(
            $request->umkm_id,
            "Penawaran Investasi Baru 💼",
            "Investor {$investor->name} mengajukan penawaran investasi sebesar Rp " . number_format($amount, 0, ',', '.') . " ke UMKM Anda.",
            "offer",
            "/umkm"
        );

        return response()->json([
            'message' => 'Penawaran investasi berhasil dikirim.',
            'investment' => $investment
        ], 201);
    }

    public function resolveInvestasi(Request $request, $id)
    {
        $request->validate(['decision' => 'required|in:Diterima,Ditolak']);

        $investment = Investment::findOrFail($id);
        $umkm = $request->user();

        if ($request->decision === 'Diterima') {
            $investor = User::find($investment->user_id);
            if (!$investor) {
                return response()->json(['message' => 'Investor not found.'], 404);
            }

            if ($investor->wallet_balance < $investment->amount) {
                return response()->json(['message' => 'Saldo dompet investor saat ini tidak mencukupi.'], 400);
            }

            return DB::transaction(function () use ($investment, $umkm, $investor) {
                // Deduct investor wallet
                $investor->decrement('wallet_balance', $investment->amount);

                // Add to UMKM wallet
                $umkm->increment('wallet_balance', $investment->amount);

                // Update investment to active status
                $investment->update(['status' => 'Aktif']);

                // Notify investor
                Notification::send(
                    $investment->user_id,
                    "Penawaran Investasi Diterima 🎉",
                    "UMKM {$umkm->name} menerima penawaran investasi Anda sebesar Rp " . number_format($investment->amount, 0, ',', '.') . ". Investasi kini aktif.",
                    "investment",
                    "/investor/portfolio"
                );

                return response()->json(['message' => 'Penawaran investasi disetujui dan berhasil dicairkan.']);
            });
        } else {
            $investment->update(['status' => 'Ditolak']);

            // Notify investor
            Notification::send(
                $investment->user_id,
                "Penawaran Investasi Ditolak ❌",
                "UMKM {$umkm->name} menolak penawaran investasi Anda sebesar Rp " . number_format($investment->amount, 0, ',', '.') . ".",
                "investment",
                "/investor"
            );

            return response()->json(['message' => 'Penawaran investasi ditolak.']);
        }
    }

    public function umkmPendanaans(Request $request)
    {
        $pendanaans = Campaign::where('user_id', $request->user()->id)
            ->with('investor')
            ->latest()
            ->get()
            ->map(function ($p) {
                return array_merge($p->toArray(), [
                    'target_amount' => $p->target_amount ?? $p->target,
                    'current_amount' => $p->current_amount ?? $p->current,
                ]);
            });
        return response()->json($pendanaans);
    }

    public function umkmInvestasis(Request $request)
    {
        $investasis = Investment::where('umkm_id', $request->user()->id)
            ->with('user')
            ->latest()
            ->get();
        return response()->json($investasis);
    }

    public function investorInvestasis(Request $request)
    {
        $investasis = Investment::where('user_id', $request->user()->id)
            ->with('umkm')
            ->latest()
            ->get();
        return response()->json($investasis);
    }

    public function investorPendanaans(Request $request)
    {
        $pendanaans = Campaign::where('investor_id', $request->user()->id)
            ->with('user.umkm')
            ->latest()
            ->get()
            ->map(function ($p) {
                return array_merge($p->toArray(), [
                    'target_amount' => $p->target_amount ?? $p->target,
                    'current_amount' => $p->current_amount ?? $p->current,
                ]);
            });
        return response()->json($pendanaans);
    }
}
