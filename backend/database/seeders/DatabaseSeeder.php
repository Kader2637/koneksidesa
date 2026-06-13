<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Campaign;
use App\Models\KycVerification;
use App\Models\LoanRequest;
use App\Models\Ticket;
use App\Models\Investment;
use App\Models\VillageWithdrawal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ----------------------------------------------------
        // 1. Seed Users
        // ----------------------------------------------------
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@koneksidesa.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'phone_number' => '081234567890',
            'address' => 'Balai Desa KoneksiDesa',
        ]);

        $seller = User::create([
            'name' => 'Toko Karya Maju',
            'email' => 'umkm@koneksidesa.com',
            'password' => Hash::make('password'),
            'role' => 'Mitra UMKM',
            'phone_number' => '081234567891',
            'address' => 'Dusun Karya Maju',
        ]);

        \App\Models\Umkm::create([
            'user_id' => $seller->id,
            'name' => 'Toko Karya Maju',
            'owner' => 'Sugeng Riyadi',
            'nib' => 'NIB-88231264',
            'ktp' => '3301021980051201',
            'address' => 'Dusun Karya Maju',
            'description' => 'Kami memproduksi madu hutan murni berkualitas tinggi dan pangan olahan lokal khas desa.',
            'status' => 'Disetujui',
        ]);

        $seller2 = User::create([
            'name' => 'Kopi Harapan Jaya',
            'email' => 'umkm2@koneksidesa.com',
            'password' => Hash::make('password'),
            'role' => 'Mitra UMKM',
            'phone_number' => '081234567894',
            'address' => 'Desa Agro Rejo',
        ]);

        \App\Models\Umkm::create([
            'user_id' => $seller2->id,
            'name' => 'Kopi Harapan Jaya',
            'owner' => 'Budi Setiawan',
            'nib' => 'NIB-77231265',
            'ktp' => '3301021981061302',
            'address' => 'Desa Agro Rejo',
            'description' => 'Produsen kopi biji robusta asli pegunungan dan berbagai olahan minuman kopi bubuk khas desa.',
            'status' => 'Disetujui',
        ]);

        $seller3 = User::create([
            'name' => 'Sentra Kriya Sentosa',
            'email' => 'umkm3@koneksidesa.com',
            'password' => Hash::make('password'),
            'role' => 'Mitra UMKM',
            'phone_number' => '081234567895',
            'address' => 'Desa Sentra Kriya',
        ]);

        \App\Models\Umkm::create([
            'user_id' => $seller3->id,
            'name' => 'Sentra Kriya Sentosa',
            'owner' => 'Kartika Indah',
            'nib' => 'NIB-66231266',
            'ktp' => '3301021983081503',
            'address' => 'Desa Sentra Kriya',
            'description' => 'Pengrajin tas anyaman serat pandan alami, guci keramik dekoratif, serta produk kesenian lokal.',
            'status' => 'Disetujui',
        ]);

        $investor = User::create([
            'name' => 'Bambang Hermawan',
            'email' => 'investor@koneksidesa.com',
            'password' => Hash::make('password'),
            'role' => 'Investor',
            'phone_number' => '081234567892',
            'address' => 'Perumahan Lestari Blok C1',
            'wallet_balance' => 25000000.00, // Rp 25.000.000
        ]);

        $buyer = User::create([
            'name' => 'Budi Santoso',
            'email' => 'pembeli@koneksidesa.com',
            'password' => Hash::make('password'),
            'role' => 'Pembeli',
            'phone_number' => '081234567893',
            'address' => 'Dusun Agro Rejo RT 02 RW 01',
        ]);

        // ----------------------------------------------------
        // 2. Seed Products (Bazar items)
        // ----------------------------------------------------
        Product::create([
            'seller_id' => $seller2->id,
            'name' => 'Kopi Robusta Asli',
            'description' => 'Biji kopi robusta pilihan dari pegunungan desa, diproses secara tradisional.',
            'price' => 45000.00,
            'stock' => 120,
            'image' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
            'rating' => 4.90,
            'category' => 'Minuman',
            'desa' => 'Desa Agro Rejo',
            'status' => 'approved'
        ]);

        Product::create([
            'seller_id' => $seller3->id,
            'name' => 'Tas Anyam Pandan',
            'description' => 'Tas anyaman tangan dari serat daun pandan hutan asli, kuat dan ramah lingkungan.',
            'price' => 75000.00,
            'stock' => 45,
            'image' => 'https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80',
            'rating' => 5.00,
            'category' => 'Kerajinan',
            'desa' => 'Desa Karya Maju',
            'status' => 'approved'
        ]);

        Product::create([
            'seller_id' => $seller3->id,
            'name' => 'Keramik Hias Dekoratif',
            'description' => 'Guci keramik hias kecil bermotif tradisional desa.',
            'price' => 125000.00,
            'stock' => 15,
            'image' => 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600&q=80',
            'rating' => 4.80,
            'category' => 'Dekorasi',
            'desa' => 'Desa Sentra Kriya',
            'status' => 'approved'
        ]);

        Product::create([
            'seller_id' => $seller->id,
            'name' => 'Madu Hutan Liar',
            'description' => 'Madu hutan murni tanpa pemanis buatan langsung dipanen dari hutan lindung desa.',
            'price' => 60000.00,
            'stock' => 60,
            'image' => 'https://images.unsplash.com/photo-1549429402-99933e1ebfc6?w=600&q=80',
            'rating' => 4.90,
            'category' => 'Konsumsi',
            'desa' => 'Desa Tani Sari',
            'status' => 'approved'
        ]);

        // ----------------------------------------------------
        // 3. Seed Campaigns
        // ----------------------------------------------------
        $campaign1 = Campaign::create([
            'user_id' => $seller2->id,
            'title' => 'Modernisasi Alat Panen Kopi',
            'umkm' => 'Kopi Harapan Jaya',
            'business_name' => 'Kopi Harapan Jaya',
            'target' => 50000000.00,
            'current' => 42500000.00,
            'progress' => 85,
            'roi' => 15,
            'tenor' => '6 Bulan',
            'risk' => 'Rendah',
            'image' => 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&q=80',
            'status' => 'Aktif'
        ]);

        $campaign2 = Campaign::create([
            'user_id' => $seller3->id,
            'title' => 'Pembelian Bahan Baku Serat Pandan',
            'umkm' => 'Sentra Kriya Sentosa',
            'business_name' => 'Sentra Kriya Sentosa',
            'target' => 15000000.00,
            'current' => 15000000.00,
            'progress' => 100,
            'roi' => 11,
            'tenor' => '3 Bulan',
            'risk' => 'Sangat Rendah',
            'image' => 'https://images.unsplash.com/photo-1627308595229-7830f5c92f4e?w=600&q=80',
            'status' => 'Aktif'
        ]);

        $campaign3 = Campaign::create([
            'user_id' => $seller->id,
            'title' => 'Ekspansi Peternakan Lebah Madu',
            'umkm' => 'Toko Karya Maju',
            'business_name' => 'Toko Karya Maju',
            'target' => 25000000.00,
            'current' => 5000000.00,
            'progress' => 20,
            'roi' => 18,
            'tenor' => '12 Bulan',
            'risk' => 'Sedang',
            'image' => 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80',
            'status' => 'Aktif'
        ]);

        // ----------------------------------------------------
        // 4. Seed Investments
        // ----------------------------------------------------
        Investment::create([
            'user_id' => $investor->id,
            'umkm_id' => $seller3->id,
            'pendanaan_id' => $campaign2->id,
            'amount' => 5000000.00,
            'expected_return' => 5550000.00,
            'status' => 'Aktif'
        ]);

        // ----------------------------------------------------
        // 5. Seed Loan Requests (UMKM Pinjaman)
        // ----------------------------------------------------
        LoanRequest::create([
            'user_id' => $seller->id,
            'amount' => 15000000.00,
            'tenor' => '6 Bulan',
            'status' => 'Aktif',
            'payment_progress' => 42
        ]);

        // ----------------------------------------------------
        // 6. Seed KYC Verifications
        // ----------------------------------------------------
        KycVerification::create([
            'user_id' => $seller->id,
            'umkm' => 'Toko Karya Maju',
            'owner' => 'Sugeng Riyadi',
            'nib' => 'NIB-88231264',
            'ktp' => '3301021980051201',
            'status' => 'Pending'
        ]);

        KycVerification::create([
            'user_id' => $seller3->id,
            'umkm' => 'Sentra Kriya Sentosa',
            'owner' => 'Kartika Indah',
            'nib' => 'NIB-66231266',
            'ktp' => '3301021983081503',
            'status' => 'Pending'
        ]);

        // ----------------------------------------------------
        // 7. Seed Village Treasury & Settings
        // ----------------------------------------------------
        DB::table('settings')->insert([
            'key' => 'village_treasury',
            'value' => '42500000.00',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        VillageWithdrawal::create([
            'bank' => 'BUMDesa - BRI (1234xxxx)',
            'amount' => 15000000.00,
            'status' => 'Berhasil'
        ]);

        VillageWithdrawal::create([
            'bank' => 'BUMDesa - BRI (1234xxxx)',
            'amount' => 12500000.00,
            'status' => 'Berhasil'
        ]);

        // ----------------------------------------------------
        // 8. Seed Support Tickets
        // ----------------------------------------------------
        Ticket::create([
            'user_id' => $buyer->id,
            'subject' => 'Kesalahan transfer deposit',
            'category' => 'Transaksi',
            'status' => 'Terbuka'
        ]);

        Ticket::create([
            'user_id' => $seller->id,
            'subject' => 'Gagal upload gambar produk baru',
            'category' => 'Teknis',
            'status' => 'Selesai'
        ]);
    }
}
