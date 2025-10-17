<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'ssr' => fn () => Inertia::getShared('ssr'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => $request->session()->get('message'),
                'status' => $request->session()->get('status'),
                'checkout_url' => $request->session()->get('checkout_url'),
            ],
        ];
    }
}
