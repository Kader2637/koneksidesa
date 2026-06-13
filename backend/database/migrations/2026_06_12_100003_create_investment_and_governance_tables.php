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
        Schema::create('kyc_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('umkm');
            $table->string('owner');
            $table->string('nib');
            $table->string('ktp');
            $table->string('status')->default('Pending'); // Pending, Disetujui, Ditolak
            $table->timestamps();
        });

        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('umkm');
            $table->decimal('target', 15, 2);
            $table->decimal('current', 15, 2)->default(0.00);
            $table->integer('progress')->default(0);
            $table->integer('roi');
            $table->string('tenor');
            $table->string('risk'); // Sangat Rendah, Rendah, Sedang
            $table->string('image')->nullable();
            $table->string('status')->default('Pending'); // Pending, Aktif, Ditolak
            $table->timestamps();
        });

        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->decimal('expected_return', 15, 2);
            $table->string('status')->default('Aktif'); // Aktif, Selesai
            $table->timestamps();
        });

        Schema::create('loan_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('tenor');
            $table->string('status')->default('Pending'); // Pending, Aktif
            $table->integer('payment_progress')->default(0);
            $table->timestamps();
        });

        Schema::create('village_withdrawals', function (Blueprint $table) {
            $table->id();
            $table->string('bank');
            $table->decimal('amount', 15, 2);
            $table->string('status')->default('Diproses'); // Berhasil, Diproses
            $table->timestamps();
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('subject');
            $table->string('category'); // Teknis, Transaksi, Lainnya
            $table->string('status')->default('Terbuka'); // Terbuka, Selesai
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('info');
            $table->string('url')->nullable();
            $table->boolean('read')->default(false);
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('village_withdrawals');
        Schema::dropIfExists('loan_requests');
        Schema::dropIfExists('investments');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('kyc_verifications');
    }
};
