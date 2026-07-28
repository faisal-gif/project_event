<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CategoryEvents;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryEventsController extends Controller
{
    public function index()
    {
        $categories = CategoryEvents::all();
        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Category/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'icon' => 'required|string',
        ]);

        CategoryEvents::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon,
        ]);

        return redirect()->route('admin.category.index')->with('success', 'Category created');
    }

    public function edit(CategoryEvents $category)
    {
        return Inertia::render('Admin/Category/Edit', [
            'category' => $category
        ]);
    }

    public function update(Request $request, CategoryEvents $category)
    {
        $request->validate([
            'name' => 'required',
            'icon' => 'required|string',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon,
        ]);

        return redirect()->route('admin.category.index')->with('success', 'Category updated');
    }
}
