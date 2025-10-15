<?php

namespace App\Http\Controllers;

use App\Models\CategoryEvents;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryEventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = CategoryEvents::all();
        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Category/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'icon' => 'required|string',
        ]);

        $slug = Str::slug($request->name);

        CategoryEvents::create([
            'name' => $request->name,
            'slug' => $slug,
            'icon' => $request->icon,
        ]);

        return redirect()->route('category.index')->with('success', 'Category created');
    }

    /**
     * Display the specified resource.
     */
    public function show(CategoryEvents $categoryEvents)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CategoryEvents $category)
    {
        return Inertia::render('Admin/Category/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CategoryEvents $category)
    {
        $data = $request->validate([
            'name' => 'required',
            'icon' => 'required|string',
        ]);

        $slug = Str::slug($request->name);

        $category->update([
            'name' => $request->name,
            'slug' => $slug,
            'icon' => $request->icon,
        ]);

        return redirect()->route('category.index')->with('success', 'Category updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategoryEvents $categoryEvents)
    {
        //
    }
}
