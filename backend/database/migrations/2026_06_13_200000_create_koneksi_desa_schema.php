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
        // 1. Rename existing marketplace and investment tables to Indonesian
        if (Schema::hasTable('products') && !Schema::hasTable('produks')) {
            Schema::rename('products', 'produks');
        }
        if (Schema::hasTable('carts') && !Schema::hasTable('keranjangs')) {
            Schema::rename('carts', 'keranjangs');
        }
        if (Schema::hasTable('orders') && !Schema::hasTable('pesanans')) {
            Schema::rename('orders', 'pesanans');
        }
        if (Schema::hasTable('order_items') && !Schema::hasTable('detail_pesanans')) {
            Schema::rename('order_items', 'detail_pesanans');
        }
        if (Schema::hasTable('campaigns') && !Schema::hasTable('pendanaans')) {
            Schema::rename('campaigns', 'pendanaans');
        }
        if (Schema::hasTable('investments') && !Schema::hasTable('investasis')) {
            Schema::rename('investments', 'investasis');
        }

        // 2. Add columns to the renamed pendanaans table (formerly campaigns) for two-way funding
        Schema::table('pendanaans', function (Blueprint $table) {
            if (!Schema::hasColumn('pendanaans', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('pendanaans', 'investor_id')) {
                $table->foreignId('investor_id')->nullable()->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('pendanaans', 'business_name')) {
                $table->string('business_name')->nullable();
            }
            if (!Schema::hasColumn('pendanaans', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('pendanaans', 'purpose')) {
                $table->text('purpose')->nullable();
            }
            if (!Schema::hasColumn('pendanaans', 'proposal_path')) {
                $table->string('proposal_path')->nullable();
            }
        });

        // 3. Add columns to the renamed investasis table (formerly investments) for two-way funding
        Schema::table('investasis', function (Blueprint $table) {
            // Rename campaign_id to pendanaan_id in the renamed investasis table
            if (Schema::hasColumn('investasis', 'campaign_id') && !Schema::hasColumn('investasis', 'pendanaan_id')) {
                $table->renameColumn('campaign_id', 'pendanaan_id');
            }
            if (!Schema::hasColumn('investasis', 'umkm_id')) {
                $table->foreignId('umkm_id')->nullable()->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('investasis', 'message')) {
                $table->text('message')->nullable();
            }
            if (!Schema::hasColumn('investasis', 'tenor')) {
                $table->string('tenor')->nullable();
            }
        });

        // Drop NOT NULL constraint on pendanaan_id to allow direct investments without campaign
        DB::statement('ALTER TABLE investasis ALTER COLUMN pendanaan_id DROP NOT NULL');

        // 4. Create role-specific tables (umkms, investors, pembelis)
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('owner');
            $table->string('nib');
            $table->string('ktp');
            $table->string('address')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('Pending'); // Pending, Disetujui, Ditolak
            $table->timestamps();
        });

        Schema::create('investors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });

        Schema::create('pembelis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });

        // 5. Create kategoris table
        Schema::create('kategoris', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // Add kategori_id to produks table
        Schema::table('produks', function (Blueprint $table) {
            if (!Schema::hasColumn('produks', 'kategori_id')) {
                $table->foreignId('kategori_id')->nullable()->constrained('kategoris')->nullOnDelete();
            }
        });

        // 6. Create reviews table
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('produks')->cascadeOnDelete();
            $table->integer('rating');
            $table->text('review')->nullable();
            $table->timestamps();
        });

        // 7. Create payments table
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('pesanans')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('payment_method')->nullable();
            $table->string('transaction_status')->default('pending'); // pending, settlement, capture, expire, cancel, deny
            $table->string('midtrans_order_id')->nullable();
            $table->string('snap_token')->nullable();
            $table->string('snap_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('reviews');
        
        Schema::table('produks', function (Blueprint $table) {
            $table->dropColumn('kategori_id');
        });
        Schema::dropIfExists('kategoris');
        Schema::dropIfExists('pembelis');
        Schema::dropIfExists('investors');
        Schema::dropIfExists('umkms');

        // Revert columns in investasis (formerly investments)
        Schema::table('investasis', function (Blueprint $table) {
            if (Schema::hasColumn('investasis', 'pendanaan_id') && !Schema::hasColumn('investasis', 'campaign_id')) {
                $table->renameColumn('pendanaan_id', 'campaign_id');
            }
            $table->dropColumn(['umkm_id', 'message', 'tenor']);
        });

        // Revert columns in pendanaans (formerly campaigns)
        Schema::table('pendanaans', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'investor_id', 'business_name', 'description', 'purpose', 'proposal_path']);
        });

        // Revert Table renames
        if (Schema::hasTable('produks') && !Schema::hasTable('products')) {
            Schema::rename('produks', 'products');
        }
        if (Schema::hasTable('keranjangs') && !Schema::hasTable('carts')) {
            Schema::rename('keranjangs', 'carts');
        }
        if (Schema::hasTable('pesanans') && !Schema::hasTable('orders')) {
            Schema::rename('pesanans', 'orders');
        }
        if (Schema::hasTable('detail_pesanans') && !Schema::hasTable('order_items')) {
            Schema::rename('detail_pesanans', 'order_items');
        }
        if (Schema::hasTable('pendanaans') && !Schema::hasTable('campaigns')) {
            Schema::rename('pendanaans', 'campaigns');
        }
        if (Schema::hasTable('investasis') && !Schema::hasTable('investments')) {
            Schema::rename('investasis', 'investments');
        }
    }
};
