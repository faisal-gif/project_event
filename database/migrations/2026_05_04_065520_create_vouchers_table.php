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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->nullable()->constrained()->cascadeOnDelete(); // Null berarti berlaku untuk semua event
            $table->string('code')->unique();
            $table->enum('type', ['fixed', 'percent']); // Potongan harga (Rp) atau Persentase (%)
            $table->integer('value'); // Nominal potongan atau persen diskon
            $table->integer('max_discount')->nullable(); // Maksimal potongan (berguna untuk tipe percent)
            $table->integer('quota')->default(0); // Sisa kuota penggunaan
            $table->dateTime('valid_until')->nullable(); // Batas waktu penggunaan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
