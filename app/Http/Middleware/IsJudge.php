<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsJudge
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->role === 'judge') {
            return $next($request);
        }
        if (auth()->check() && auth()->user()->role === 'organizer') {
            return redirect('/organizer/dashboard');
        }
        if (auth()->check() && auth()->user()->role === 'user') {
            return redirect('/');
        }
        if (auth()->check() && auth()->user()->role === 'admin') {
            return redirect('/admin/dashboard');
        }

        return redirect('/login');
    }
}
