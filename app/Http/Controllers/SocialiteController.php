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
    public function redirectToLogin($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function handleLoginCallback($provider)
    {
        $socialUser = Socialite::driver($provider)->user();
        $user = User::where('email', $socialUser->getEmail())->first();

        if ($user) {
            Auth::login($user);
            return redirect()->intended(route('welcome'));
        }

        return Redirect::route('login')->withErrors(['email' => 'Your email is not registered.']);
    }

    public function redirectToRegister($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function handleRegisterCallback($provider)
    {
        $socialUser = Socialite::driver($provider)->user();

        // Check if user already exists
        $existingUser = User::where('email', $socialUser->getEmail())->first();
        if ($existingUser) {
            return Redirect::route('login')->withErrors(['email' => 'This email is already registered. Please login.']);
        }

        session(['socialite_user' => $socialUser]);

        return Redirect::route('socialite.register.complete');
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