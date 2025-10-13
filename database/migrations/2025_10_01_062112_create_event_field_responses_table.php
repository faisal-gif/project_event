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
        Schema::create('event_field_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_field_id')->constrained('event_fields')->cascadeOnDelete();
            $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
            $table->string('field_name');  // judul_karya
            $table->text('field_value')->nullable(); // bisa simpan text atau path file
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_field_responses');
    }
};
