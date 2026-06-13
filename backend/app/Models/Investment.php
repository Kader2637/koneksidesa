<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    use HasFactory;

    protected $table = 'investasis';
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function umkm()
    {
        return $this->belongsTo(User::class, 'umkm_id');
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'pendanaan_id');
    }

    public function roiPayments()
    {
        return $this->hasMany(RoiPayment::class, 'investment_id');
    }

    /**
     * Passively process all outstanding ROI payments.
     */
    public static function processPassivePayments()
    {
        $activeInvestments = self::where('status', 'Aktif')->with(['user', 'umkm'])->get();

        foreach ($activeInvestments as $inv) {
            $unpaidSchedules = RoiPayment::where('investment_id', $inv->id)
                ->where('status', '!=', 'Lunas')
                ->where('jatuh_tempo', '<=', now()->toDateString())
                ->get();

            foreach ($unpaidSchedules as $schedule) {
                $umkmUser = $inv->umkm;
                $investorUser = $inv->user;

                if (!$umkmUser || !$investorUser) {
                    continue;
                }

                // If UMKM has enough balance, pay automatically
                if ($umkmUser->wallet_balance >= $schedule->nominal) {
                    \Illuminate\Support\Facades\DB::transaction(function () use ($umkmUser, $investorUser, $schedule, $inv) {
                        // Deduct from UMKM
                        $umkmUser->decrement('wallet_balance', $schedule->nominal);

                        // Add to Investor
                        $investorUser->increment('wallet_balance', $schedule->nominal);

                        // Update schedule status to Lunas
                        $schedule->update([
                            'status' => 'Lunas',
                            'tanggal_bayar' => now(),
                            'metode_pembayaran' => 'Otomatis'
                        ]);

                        // Send notifications
                        Notification::send(
                            $umkmUser->id,
                            "Pembayaran ROI Otomatis Berhasil 📈",
                            "Pembayaran ROI bulan ke-{$schedule->bulan_ke} sebesar Rp " . number_format($schedule->nominal, 0, ',', '.') . " kepada Investor {$investorUser->name} sukses diproses.",
                            "investment",
                            "/umkm"
                        );

                        Notification::send(
                            $investorUser->id,
                            "Penerimaan ROI Otomatis 💰",
                            "Anda menerima pembayaran bagi hasil ROI bulan ke-{$schedule->bulan_ke} sebesar Rp " . number_format($schedule->nominal, 0, ',', '.') . " dari UMKM {$umkmUser->name}.",
                            "investment",
                            "/investor/portfolio"
                        );
                    });
                } else {
                    // Update schedule status to Menunggak
                    if ($schedule->status !== 'Menunggak') {
                        $schedule->update(['status' => 'Menunggak']);

                        // Send notifications about failure
                        Notification::send(
                            $umkmUser->id,
                            "Pembayaran ROI Terlambat ⚠️",
                            "Saldo dompet Anda tidak mencukupi untuk pembayaran ROI bulan ke-{$schedule->bulan_ke} sebesar Rp " . number_format($schedule->nominal, 0, ',', '.') . " kepada Investor {$investorUser->name}. Harap lakukan setoran manual.",
                            "investment",
                            "/umkm"
                        );

                        Notification::send(
                            $investorUser->id,
                            "Keterlambatan Pembayaran ROI ⚠️",
                            "Pembayaran ROI bulan ke-{$schedule->bulan_ke} sebesar Rp " . number_format($schedule->nominal, 0, ',', '.') . " dari UMKM {$umkmUser->name} mengalami keterlambatan.",
                            "investment",
                            "/investor/portfolio"
                        );
                    }
                }
            }
        }
    }

    /**
     * Generate ROI payment schedules.
     */
    public static function generateSchedules($investment, $roi, $tenorStr, $amount)
    {
        $months = 12;
        if (preg_match('/(\d+)/', $tenorStr, $matches)) {
            $months = (int)$matches[1];
        }

        $totalRoi = $amount * ($roi / 100);
        $monthlyNominal = $totalRoi / $months;

        for ($i = 1; $i <= $months; $i++) {
            $simulatedOmset = rand(15000000, 50000000);

            RoiPayment::create([
                'investment_id' => $investment->id,
                'bulan_ke' => $i,
                'jatuh_tempo' => now()->addMonths($i)->toDateString(),
                'omset' => $simulatedOmset,
                'nominal' => $monthlyNominal,
                'status' => 'Menunggu',
            ]);
        }
    }
}
