<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the enum column to add 'organizer'
        DB::statement("ALTER TABLE users CHANGE role role ENUM('user','admin','organizer') NOT NULL DEFAULT 'user'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the enum column back to its original state
        DB::statement("ALTER TABLE users CHANGE role role ENUM('user','admin') NOT NULL DEFAULT 'user'");
    }
};