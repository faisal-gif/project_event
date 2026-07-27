<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // null = belum pernah mengajukan. Alur: pending -> approved/rejected.
            $table->enum('affiliate_status', ['pending', 'approved', 'rejected'])->nullable()->after('role');
            $table->timestamp('affiliate_requested_at')->nullable()->after('affiliate_status');
            $table->foreignId('affiliate_reviewed_by')->nullable()->after('affiliate_requested_at')->constrained('users')->nullOnDelete();
            $table->timestamp('affiliate_reviewed_at')->nullable()->after('affiliate_reviewed_by');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['affiliate_reviewed_by']);
            $table->dropColumn(['affiliate_status', 'affiliate_requested_at', 'affiliate_reviewed_by', 'affiliate_reviewed_at']);
        });
    }
};
