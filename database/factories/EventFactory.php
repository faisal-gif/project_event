<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
   public function definition(): array {
        $title = $this->faker->sentence(3);
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement(['event', 'competition']),
            'category' => $this->faker->randomElement(['Workshop', 'Webinar', 'Lomba']),
            'location' => 'Online',
            'start_date' => now()->addDays(rand(1, 30)),
            'end_date' => now()->addDays(rand(31, 60)),
            'price' => rand(10000, 50000),
            'quota' => 100,
            'remainingQuota' => 100,    
            'image' => 'https://picsum.photos/400/200',
            'is_published' => true,
            'created_by' => 1,
        ];
    }
}
