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
        Schema::create('event_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->string('label'); 
            $table->string('name');
            $table->enum('type', ['text', 'textarea', 'file', 'select', 'checkbox', 'url']);
            $table->boolean('is_required')->default(false);
            $table->json('options')->nullable(); // kalau select/checkbox
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_fields');
    }
};
