<?php

namespace App\Http\Controllers;

use App\Models\CategoryEvents;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class EventController extends Controller
{

    public function index()
    {
        $events = Event::with('creator', 'category', 'ticketTypes')->latest()->get();
     
        return Inertia::render('Admin/Events/Index', ['events' => $events]);
    }

    public function create()
    {
        $category = CategoryEvents::all();
        return Inertia::render('Admin/Events/Create', [
            'category' => $category
        ]);
    }

    public function store(Request $request)
    {
        $eventFields = $request->input('event_fields', []);
        if (!empty($eventFields)) {
            foreach ($eventFields as $key => $field) {
                // Cek jika 'options' ada dan merupakan string
                if (isset($field['options']) && is_string($field['options'])) {
                    // Ubah string "M,L,XL" menjadi array ['M', 'L', 'XL']
                    $eventFields[$key]['options'] = array_map('trim', explode(',', $field['options']));
                }
            }
            // Gabungkan kembali data yang sudah diubah ke dalam request
            $request->merge(['event_fields' => $eventFields]);
        }


        $data = $this->validateEventData($request);


        $slug = Str::slug($request->title);
        $imagePath = $this->storeImage($request);

        $event = Event::create([
            'slug' => $slug,
            'image' => $imagePath,
            'title' => $data['title'],
            'description' => $data['description'],
            'requirements' => $data['requirements'],
            'category_id' => $data['category_id'],
            'location_type' => $data['location_type'],
            'location_details' => $data['location_details'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'created_by' => auth()->id(),
            'status' => 'valid',
            'is_headline' => $data['is_headline'],
            'limit_ticket_user' => $data['limit_ticket_user'],
            'need_additional_questions' => $data['need_additional_questions'] ?? false,
            'needs_submission' => $data['needs_submission'] ?? false,
        ]);


        $this->syncRelatedData($event, $data);

        return redirect()->route('admin.events.index')->with('success', 'Event created successfully.');
    }

    public function show(Event $event)
    {
        $event->load('tickets.user', 'tickets.detail_pendaftar', 'tickets.submission.submission_custom_fields', 'tickets.event_field_responses', 'category', 'ticketTypes', 'eventFields', 'eventSubmissionFields');
        return Inertia::render('Admin/Events/Show', ['event' => $event]);
    }

    public function edit(Event $event)
    {
        $category = CategoryEvents::all();
        $event->load('eventFields', 'eventSubmissionFields', 'ticketTypes');

        return Inertia::render('Admin/Events/Edit', ['event' => $event, 'category' => $category]);
    }

    public function update(Request $request, Event $event)
    {

        $eventFields = $request->input('event_fields', []);
        if (!empty($eventFields)) {
            foreach ($eventFields as $key => $field) {
                // Cek jika 'options' ada dan merupakan string
                if (isset($field['options']) && is_string($field['options'])) {
                    // Ubah string "M,L,XL" menjadi array ['M', 'L', 'XL']
                    $eventFields[$key]['options'] = array_map('trim', explode(',', $field['options']));
                }
            }
            // Gabungkan kembali data yang sudah diubah ke dalam request
            $request->merge(['event_fields' => $eventFields]);
        }

        $data = $this->validateEventData($request, $event);

        $updateData = [
            'title' => $data['title'],
            'description' => $data['description'],
            'requirements' => $data['requirements'],
            'category_id' => $data['category_id'],
            'location_type' => $data['location_type'],
            'location_details' => $data['location_details'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'is_headline' => $data['is_headline'],
            'limit_ticket_user' => $data['limit_ticket_user'],
            'need_additional_questions' => $data['need_additional_questions'] ?? false,
            'needs_submission' => $data['needs_submission'] ?? false,
        ];

        if ($request->title !== $event->title) {
            $updateData['slug'] = Str::slug($request->title);
        }

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($event->image);
            $updateData['image'] = $this->storeImage($request);
        }

        $event->update($updateData);


        $this->syncRelatedData($event, $data);

        return redirect()->route('admin.events.index')->with('success', 'Event updated successfully.');
    }

    private function validateEventData(Request $request, Event $event = null)
    {
        $imageRule = $event ? 'nullable|image' : 'required|image';

        // 1. Definisikan semua rules Anda
        $rules = [
            'image' => $imageRule,
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'category_id' => 'required|exists:category_events,id',
            'location_type' => 'required|in:online,offline,hybrid',
            'location_details' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'limit_ticket_user' => 'required|integer|min:1',
            'is_headline' => 'required|boolean',
            'ticket_types' => 'required|array|min:1',
            'ticket_types.*.name' => 'required|string|max:255',
            'ticket_types.*.price' => 'required|numeric|min:0',
            'ticket_types.*.quota' => 'required|integer|min:1',
            'ticket_types.*.purchase_date' => 'nullable|date',
            'ticket_types.*.end_purchase_date' => 'nullable|date|after_or_equal:purchase_date',
            'ticket_types.*.description' => 'required|string',
            'need_additional_questions' => 'boolean',
            'event_fields' => ['nullable', 'array'],
            'event_fields.*.label' => ['required_with:event_fields', 'string'],
            'event_fields.*.type' => ['required_with:event_fields', 'string', 'in:text,textarea,select,radio,checkbox,date,file,url'],
            'event_fields.*.is_required' => ['boolean'],
            'event_fields.*.options' => [
                'required_if:event_fields.*.type,select',
                'required_if:event_fields.*.type,radio',
                'required_if:event_fields.*.type,checkbox',
                'nullable',
                'array'
            ],
            'needs_submission' => 'boolean',
            'submission_fields' => ['nullable', 'array'],
            'submission_fields.*.label' => ['required_with:submission_fields', 'string'],
            'submission_fields.*.type' => ['required_with:submission_fields', 'string'],
            'submission_fields.*.options' => ['nullable', 'string'],
            'submission_fields.*.is_required' => ['boolean'],
        ];

        // 2. Definisikan pesan kustom Anda
        $messages = [
            'title.required' => 'Judul event tidak boleh kosong.',
            'title.max' => 'Judul event terlalu panjang, maksimal 255 karakter.',
            'description.required' => 'Deskripsi event wajib diisi.',
            'category_id.required' => 'Silakan pilih kategori event.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'end_date.after_or_equal' => 'Tanggal berakhir tidak boleh sebelum tanggal mulai.',
            'ticket_types.min' => 'Anda harus menambahkan minimal 1 jenis tiket.',

            // Contoh untuk array (menggunakan wildcard *)
            'ticket_types.*.name.required' => 'Nama tiket wajib diisi.',
            'ticket_types.*.price.numeric' => 'Harga tiket harus berupa angka.',
            'ticket_types.*.quota.min' => 'Kuota tiket minimal adalah 1.',
            'ticket_types.*.end_purchase_date.after_or_equal' => 'Tanggal akhir penjualan tiket tidak boleh sebelum tanggal mulainya.',

            // Contoh untuk event_fields
            'event_fields.*.label.required_with' => 'Label pertanyaan tambahan wajib diisi.',
            'event_fields.*.type.in' => 'Tipe pertanyaan tambahan tidak valid.',
            'event_fields.*.options.required_if' => 'Opsi jawaban wajib diisi untuk tipe select, radio, atau checkbox.',
        ];

        // 3. Masukkan $rules dan $messages ke method validate()
        return $request->validate($rules, $messages);
    }

    private function storeImage(Request $request)
    {
        $slug = Str::slug($request->title);
        $manager = new ImageManager(new Driver());
        $image = $manager->read($request->file('image'));
        $encode = $image->toWebp();
        $path = 'images/' . $slug . '-' . time() . '.webp';
        Storage::disk('public')->put($path, $encode);
        return $path;
    }

    private function syncRelatedData(Event $event, array $data)
    {
        // Sync Ticket Types
        $event->ticketTypes()->delete();
        if (!empty($data['ticket_types'])) {
            foreach ($data['ticket_types'] as $ticketType) {
                $event->ticketTypes()->create([
                    'name' => $ticketType['name'],
                    'price' => $ticketType['price'],
                    'quota' => $ticketType['quota'],
                    'remaining_quota' => $ticketType['quota'],
                    'description' => $ticketType['description'],
                    'purchase_date' => $ticketType['purchase_date'],
                    'end_purchase_date' => $ticketType['end_purchase_date'],
                ]);
            }
        }


        // Sync Event Fields
        $event->eventFields()->delete();
        if ($data['need_additional_questions'] && !empty($data['event_fields'])) {
            foreach ($data['event_fields'] as $field) {
                $event->eventFields()->create([
                    'label' => $field['label'],
                    'name' => Str::snake($field['label']),
                    'type' => $field['type'],
                    'is_required' => $field['is_required'] ?? false,
                    'options' => $field['options'],
                ]);
            }
        }

        // Sync Submission Fields
        $event->eventSubmissionFields()->delete();
        if ($data['needs_submission'] && !empty($data['submission_fields'])) {
            foreach ($data['submission_fields'] as $field) {
                $event->eventSubmissionFields()->create([
                    'label' => $field['label'],
                    'name' => Str::snake($field['label']),
                    'type' => $field['type'],
                    'is_required' => $field['is_required'] ?? false,
                    'options' => $field['options'] ?? null,
                ]);
            }
        }
    }

  
    public function userIndex()
    {
        $events = Event::with('creator')->latest()->get();
        return Inertia::render('Users/Events/Index', ['events' => $events]);
    }

    public function userShow(Event $event)
    {
        return Inertia::render('Users/Events/Show', ['event' => $event]);
    }

    public function validateStep(Request $request)
    {
        $step = $request->input('step');
        $rules = [];


        if ($step === 1) {
            $rules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category_id' => 'required|exists:category_events,id',
                'location_type' => 'required|in:online,offline,hybrid',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ];
        } elseif ($step === 2) {
            $rules = [
                'ticket_types' => 'required|array|min:1',
                'ticket_types.*.name' => 'required|string|max:255',
                'ticket_types.*.price' => 'required|numeric|min:0',
                'ticket_types.*.quota' => 'required|integer|min:1',
                'ticket_types.*.purchase_date' => 'nullable|date',
                'ticket_types.*.end_purchase_date' => 'nullable|date|after_or_equal:purchase_date',
                'ticket_types.*.description' => 'required|string',
                'limit_ticket_user' => 'required|integer|min:1',
            ];
        }


        $messages = [
            // Pesan untuk Step 1
            'title.required' => 'Judul event tidak boleh kosong.',
            'description.required' => 'Deskripsi event wajib diisi.',
            'category_id.required' => 'Silakan pilih kategori.',
            'start_date.required' => 'Tanggal mulai event wajib diisi',
            'end_date.required' => 'Tanggal berakhir event wajib diisi',
            'end_date.after_or_equal' => 'Tanggal berakhir tidak boleh kurang dari tanggal mulai.',

            // Pesan untuk Step 2
            'ticket_types.min' => 'Anda harus menambahkan minimal 1 jenis tiket.',
            'ticket_types.*.name.required' => 'Nama tiket wajib diisi.',
            'ticket_types.*.price.required' => 'Harga tiket wajib diisi.',
            'ticket_types.*.quota.required' => 'Quota tiket wajib diisi.',
            'ticket_types.*.purchase_date.required' => 'Tanggal awal pembelian tiket wajib diisi.',
            'ticket_types.*.end_purchase_date.required' => 'Tanggal akhir pembelian tiket wajib diisi.',
            'ticket_types.*.description.required' => 'Deskripsi tiket wajib diisi.',
            'ticket_types.*.price.numeric' => 'Harga tiket harus berupa angka.',
            'ticket_types.*.quota.min' => 'Kuota tiket minimal adalah 1.',


            'limit_ticket_user.min' => 'Batas tiket per pengguna minimal 1.',
        ];


        $validatedData = $request->validate($rules, $messages);

        return response()->json(['success' => true, 'data' => $validatedData]);
    }

    public function validateStepEdit(Request $request, Event $event)
    {
        $step = $request->input('step');
        $rules = [];


        if ($step === 1) {
            $rules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category_id' => 'required|exists:category_events,id',
                'location_type' => 'required|in:online,offline,hybrid',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ];
        } elseif ($step === 2) {
            $rules = [
                'ticket_types' => 'required|array|min:1',
                'ticket_types.*.name' => 'required|string|max:255',
                'ticket_types.*.price' => 'required|numeric|min:0',
                'ticket_types.*.quota' => 'required|integer|min:1',
                'ticket_types.*.purchase_date' => 'nullable|date',
                'ticket_types.*.end_purchase_date' => 'nullable|date|after_or_equal:purchase_date',
                'ticket_types.*.description' => 'required|string',
                'limit_ticket_user' => 'required|integer|min:1',
            ];
        }


        $messages = [
            // Pesan untuk Step 1
            'title.required' => 'Judul event tidak boleh kosong.',
            'description.required' => 'Deskripsi event wajib diisi.',
            'category_id.required' => 'Silakan pilih kategori.',
            'start_date.required' => 'Tanggal mulai event wajib diisi',
            'end_date.required' => 'Tanggal berakhir event wajib diisi',
            'end_date.after_or_equal' => 'Tanggal berakhir tidak boleh kurang dari tanggal mulai.',

            // Pesan untuk Step 2
            'ticket_types.min' => 'Anda harus menambahkan minimal 1 jenis tiket.',
            'ticket_types.*.name.required' => 'Nama tiket wajib diisi.',
            'ticket_types.*.price.required' => 'Harga tiket wajib diisi.',
            'ticket_types.*.quota.required' => 'Quota tiket wajib diisi.',
            'ticket_types.*.purchase_date.required' => 'Tanggal awal pembelian tiket wajib diisi.',
            'ticket_types.*.end_purchase_date.required' => 'Tanggal akhir pembelian tiket wajib diisi.',
            'ticket_types.*.description.required' => 'Deskripsi tiket wajib diisi.',
            'ticket_types.*.price.numeric' => 'Harga tiket harus berupa angka.',
            'ticket_types.*.quota.min' => 'Kuota tiket minimal adalah 1.',


            'limit_ticket_user.min' => 'Batas tiket per pengguna minimal 1.',
        ];


        $validatedData = $request->validate($rules, $messages);

        return response()->json(['success' => true, 'data' => $validatedData]);
    }
}
