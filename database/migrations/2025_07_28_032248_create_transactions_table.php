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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->foreignId('detail_pendaftar_id')->constrained()->onDelete('cascade');
            $table->string('reference')->unique();
            $table->string('payment_method');
            $table->integer('amount');
            $table->integer('quantity');
            $table->integer('subtotal');
            $table->integer('tripay_fee')->default(0);
            $table->enum('status', ['UNPAID', 'PAID', 'EXPIRED'])->default('UNPAID');
            $table->text('checkout_url');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
