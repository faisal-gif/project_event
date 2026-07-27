<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->role, fn ($query, $role) => $query->where('role', $role))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? '',
            ],
        ]);
    }

    /**
     * Pencarian user ringan untuk react-select AsyncSelect (JSON, dibatasi 20).
     */
    public function search(Request $request)
    {
        $q = $request->q;

        $users = User::query()
            ->when($q, function ($query, $q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('name', 'like', "%{$q}%")
                        ->orWhere('email', 'like', "%{$q}%");
                });
            })
            ->limit(20)
            ->get(['id', 'name', 'email']);

        // value = email (unik) agar bisa langsung memfilter tabel lewat param search.
        return response()->json(
            $users->map(fn ($u) => ['value' => $u->email, 'label' => "{$u->name} — {$u->email}"])
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $events = Event::select('id', 'title')->get();

        return Inertia::render('Admin/Users/Create', [
            'events' => $events
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:user,admin,organizer,judge',

            'event_ids' => 'required_if:role,judge|array',
            'event_ids.*' => 'exists:events,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        if ($request->role === 'judge' && $request->has('event_ids')) {
            // Method 'judgedEvents' adalah relasi yang kita buat di Model User sebelumnya
            $user->judgedEvents()->attach($request->event_ids);
        }

        return redirect()->route('admin.users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'events' => Event::select('id', 'title')->get(),
            'assignedEventIds' => $user->judgedEvents()->pluck('events.id'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:user,admin,organizer,judge',
            'event_ids' => 'required_if:role,judge|array',
            'event_ids.*' => 'exists:events,id',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) {
            $user->password = Hash::make($request->password);
        }
        $user->role = $request->role;
        $user->save();

        // Sinkronkan event juri sesuai role.
        if ($request->role === 'judge') {
            $user->judgedEvents()->sync($request->event_ids ?? []);
        } else {
            $user->judgedEvents()->detach();
        }

        return redirect()->route('admin.users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = \App\Models\User::findOrFail($id);
        $user->delete();

        return redirect()->route('admin.users.index');
    }
}
