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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('Pembeli'); // Pembeli, Investor, Mitra UMKM, Admin
            $table->string('phone_number')->nullable();
            $table->string('avatar')->nullable();
            $table->string('address')->nullable();
            $table->decimal('wallet_balance', 15, 2)->default(0.00);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone_number', 'avatar', 'address', 'wallet_balance']);
        });
    }
};
