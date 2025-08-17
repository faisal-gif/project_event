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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('type', ['event', 'competition']);
            $table->string('category');
            $table->string('location')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->decimal('price', 10, 2);
            $table->integer('quota');
            $table->integer('remainingQuota')->default(0);
            $table->integer('limit_ticket_user')->default(1);
            $table->string('image')->nullable();
            $table->boolean('is_headline')->default(false);
            $table->enum('status', ['valid', 'expired'])->default('valid');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
