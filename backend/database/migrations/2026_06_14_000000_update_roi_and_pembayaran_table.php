<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add `roi` column to `investasis` table
        Schema::table('investasis', function (Blueprint $table) {
            if (!Schema::hasColumn('investasis', 'roi')) {
                $table->integer('roi')->default(0);
            }
        });

        // 2. Create `pembayaran_rois` table
        if (!Schema::hasTable('pembayaran_rois')) {
            Schema::create('pembayaran_rois', function (Blueprint $table) {
                $table->id();
                $table->foreignId('investment_id')->constrained('investasis')->cascadeOnDelete();
                $table->integer('bulan_ke'); // Month index: 1, 2, ..., tenor (e.g. 12)
                $table->date('jatuh_tempo'); // Payout schedule date
                $table->decimal('omset', 15, 2)->default(0.00); // simulated monthly UMKM omset
                $table->decimal('nominal', 15, 2); // ROI share amount
                $table->timestamp('tanggal_bayar')->nullable();
                $table->string('status')->default('Menunggu'); // Menunggu, Lunas, Menunggak
                $table->string('metode_pembayaran')->nullable(); // Otomatis, Manual
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran_rois');

        Schema::table('investasis', function (Blueprint $table) {
            if (Schema::hasColumn('investasis', 'roi')) {
                $table->dropColumn('roi');
            }
        });
    }
};
