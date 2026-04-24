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
        // 1. Tambah pengaturan komisi di tabel Event
        Schema::table('events', function (Blueprint $table) {
            $table->boolean('is_affiliate_enabled')->default(false)->after('status');
            $table->enum('affiliate_type', ['percentage', 'fixed'])->nullable()->after('is_affiliate_enabled');
            $table->decimal('affiliate_reward', 10, 2)->nullable()->after('affiliate_type');
        });

        // 2. Tambah pencatatan komisi di tabel Transactions
        Schema::table('transactions', function (Blueprint $table) {
            // ID user yang mempromosikan (yang punya link referral)
            $table->foreignId('promoter_id')->nullable()->constrained('users')->nullOnDelete()->after('user_id');
            // Jumlah komisi yang didapat dari transaksi ini
            $table->decimal('commission_earned', 10, 2)->default(0)->after('total_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['is_affiliate_enabled', 'affiliate_type', 'affiliate_reward']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['promoter_id']);
            $table->dropColumn(['promoter_id', 'commission_earned']);
        });
    }
};
