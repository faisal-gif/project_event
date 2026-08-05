<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affiliate_payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promoter_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('proof_path');
            $table->text('note')->nullable();
            $table->timestamp('paid_at');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        // FK harus setelah tabel payout ada (kolom menunjuk ke sana).
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('payout_id')->nullable()->after('promoter_id')
                ->constrained('affiliate_payouts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('payout_id');
        });
        Schema::dropIfExists('affiliate_payouts');
    }
};
