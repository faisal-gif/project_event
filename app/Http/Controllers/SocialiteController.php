<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider)
    {
        $socialUser = Socialite::driver($provider)->user();

        // Buat user baru jika belum ada, berdasarkan email
        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                'email_verified_at' => now(),
                'password' => bcrypt(Str::random(16)), // password acak
                'avatar' => $socialUser->getAvatar(),
            ]
        );

        Auth::login($user);

        return redirect()->intended(route('welcome'));
    }

    public function showCompleteRegistrationForm()
    {
        if (!session()->has('socialite_user')) {
            return Redirect::route('register');
        }

        $socialUser = session('socialite_user');

        return Inertia::render('Auth/CompleteSocialiteRegistration', [
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail(),
        ]);
    }

    public function processCompleteRegistration(Request $request)
    {
        if (!session()->has('socialite_user')) {
            return Redirect::route('register');
        }

        $socialUser = session('socialite_user');

        $request->validate([
            'phone_number' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail(),
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        session()->forget('socialite_user');

        Auth::login($user);

        return redirect()->intended(route('welcome'));
    }
}
