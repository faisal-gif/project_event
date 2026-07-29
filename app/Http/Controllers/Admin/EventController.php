<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EventRequest;
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
    public function index(Request $request)
    {
        $events = Event::with('creator', 'category', 'ticketTypes')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhereHas('creator', fn ($c) => $c->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('category', fn ($c) => $c->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
            ],
        ]);
    }

    public function create()
    {
        $category = CategoryEvents::all();
        return Inertia::render('Admin/Events/Create', [
            'category' => $category
        ]);
    }

    public function store(EventRequest $request)
    {
        $data = $request->validated();

        $event = Event::create([
            'slug' => Str::slug($request->title),
            'image' => $this->storeImage($request),
            'title' => $data['title'],
            'description' => $data['description'],
            'requirements' => $data['requirements'],
            'category_id' => $data['category_id'],
            'location_type' => $data['location_type'],
            'location_details' => $data['location_details'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'created_by' => auth()->id(),
            'status' => $data['status'],
            'is_headline' => $data['is_headline'],
            'limit_ticket_user' => $data['limit_ticket_user'],
            'need_additional_questions' => $data['need_additional_questions'] ?? false,
            'needs_submission' => $data['needs_submission'] ?? false,
            'is_affiliate_enabled' => $data['is_affiliate_enabled'] ?? false,
            'affiliate_type' => $data['is_affiliate_enabled'] ? $data['affiliate_type'] : null,
            'affiliate_reward' => $data['is_affiliate_enabled'] ? $data['affiliate_reward'] : null,
        ]);

        $this->syncRelatedData($event, $data);

        return redirect()->route('admin.events.index')->with('success', 'Event created successfully.');
    }

    public function show(Event $event, Request $request)
    {
        // 1. Eager load hanya untuk relasi dasar/kecil yang menempel pada event
        $event->load('category', 'ticketTypes');

        // 2. Query Transaksi (Search & Paginate)
        $transactions = $event->transaction()
            ->with('user')
            ->when($request->search_transaction, function ($query, $search) {
                $query->where('reference', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->paginate(10, ['*'], 'transaction_page')
            ->withQueryString();

        // 3. Query Tiket (Search & Paginate)
        $tickets = $event->tickets()
            ->with(['user', 'ticket_type', 'detail_pendaftar'])
            ->when($request->search_ticket, function ($query, $search) {
                $query->where('ticket_code', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->paginate(10, ['*'], 'ticket_page')
            ->withQueryString();

        // ==========================================
        // FITUR BARU: Menghitung Ringkasan / Summary
        // ==========================================

        // A. Ringkasan Transaksi
        $totalTransactions = $event->transaction()->count();
        $paidTransactions = $event->transaction()->where('status', 'PAID')->count();
        // Total pendapatan yang sudah terbayar (PAID)
        $totalRevenue = (float) $event->transaction()->where('status', 'PAID')->sum('amount');

        // B. Ringkasan Tiket (Total & Per Tipe Tiket)
        $totalTickets = $event->tickets()->count();

        // Menghitung jumlah tiket dikelompokkan berdasarkan tipe
        $ticketsByType = $event->tickets()
            ->select('ticket_type_id', \DB::raw('count(*) as total'))
            ->groupBy('ticket_type_id')
            ->with('ticket_type:id,name') // Pastikan relasi ticket_type dimuat
            ->get()
            ->map(function ($ticket) {
                return [
                    'name' => $ticket->ticket_type ? $ticket->ticket_type->name : 'Tidak Diketahui',
                    'total' => $ticket->total,
                ];
            });

        // 4. Kirim ke Inertia
        return Inertia::render('Admin/Events/Show', [
            'event' => $event,
            'transactions' => $transactions,
            'tickets' => $tickets,
            // Kirim data summary ke Frontend
            'summary' => [
                'total_transactions' => $totalTransactions,
                'paid_transactions'  => $paidTransactions,
                'total_revenue'      => $totalRevenue,
                'total_tickets'      => $totalTickets,
                'tickets_by_type'    => $ticketsByType,
            ],
            'filters' => [
                'search_transaction' => $request->search_transaction ?? '',
                'search_ticket' => $request->search_ticket ?? '',
            ]
        ]);
    }

    public function edit(Event $event)
    {
        $category = CategoryEvents::all();
        $event->load('eventFields', 'eventSubmissionFields', 'ticketTypes');

        return Inertia::render('Admin/Events/Edit', ['event' => $event, 'category' => $category]);
    }

    public function update(EventRequest $request, Event $event)
    {
        $data = $request->validated();

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
            'is_affiliate_enabled' => $data['is_affiliate_enabled'] ?? false,
            'affiliate_type' => $data['is_affiliate_enabled'] ? $data['affiliate_type'] : null,
            'affiliate_reward' => $data['is_affiliate_enabled'] ? $data['affiliate_reward'] : null,
            'status' => $data['status'],
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
        // 1. Sync Ticket Types
        if (!empty($data['ticket_types'])) {
            $keepTicketIds = [];

            foreach ($data['ticket_types'] as $index => $ticketData) {
                $submissionRules = !empty($ticketData['submission_rules']) ? $ticketData['submission_rules'] : null;

                // MENCARI TIKET: Berdasarkan ID, atau jika tidak ada, cari berdasarkan Nama Tiket
                $match = [];
                if (!empty($ticketData['id'])) {
                    $match['id'] = $ticketData['id'];
                } else {
                    $match['name'] = $ticketData['name']; // Fallback
                }

                $ticket = $event->ticketTypes()->updateOrCreate(
                    $match,
                    [
                        'sort_order' => $index,
                        'name' => $ticketData['name'],
                        'price' => $ticketData['price'],
                        'quota' => $ticketData['quota'],
                        'remaining_quota' => $ticketData['quota'], // Jika update, pertimbangkan logika sisa kuota ini agar tidak mereset
                        'description' => $ticketData['description'],
                        'purchase_date' => $ticketData['purchase_date'],
                        'end_purchase_date' => $ticketData['end_purchase_date'],
                        'submission_rules' => $submissionRules,
                    ]
                );
                $keepTicketIds[] = $ticket->id;
            }

            // AMAN DARI PENGHAPUSAN: Jangan hapus tiket sembarangan jika sudah ada transaksi
            $event->ticketTypes()->whereNotIn('id', $keepTicketIds)->each(function ($ticket) {
                // Opsional: Cek apakah tiket sudah dibeli, jika belum baru hapus
                // if ($ticket->transactions()->count() == 0) { $ticket->delete(); }
                $ticket->delete();
            });
        }

        // 2. Sync Event Fields (Registration)
        $keepFieldIds = [];
        if (!empty($data['need_additional_questions']) && !empty($data['event_fields'])) {
            foreach ($data['event_fields'] as $field) {
                $options = $field['options'] ?? null;
                if (is_string($options) && !empty($options)) {
                    $options = array_map('trim', explode(',', $options));
                }

                // MENCARI FIELD: Berdasarkan ID, atau berdasarkan Name
                $match = [];
                if (!empty($field['id'])) {
                    $match['id'] = $field['id'];
                } else {
                    $match['name'] = Str::snake($field['label']); // Fallback
                }

                $f = $event->eventFields()->updateOrCreate(
                    $match,
                    [
                        'label' => $field['label'],
                        'name' => Str::snake($field['label']),
                        'type' => $field['type'],
                        'is_required' => $field['is_required'] ?? false,
                        'options' => $options,
                    ]
                );
                $keepFieldIds[] = $f->id;
            }
        }
        // Jangan hapus paksa jika tidak ingin jawaban user hilang (Sebaiknya gunakan SoftDeletes di database)
        $event->eventFields()->whereNotIn('id', $keepFieldIds)->delete();

        // 3. Sync Submission Fields
        $keepSubIds = [];
        if (!empty($data['needs_submission']) && !empty($data['submission_fields'])) {
            foreach ($data['submission_fields'] as $field) {
                $options = $field['options'] ?? null;
                if (is_string($options) && !empty($options)) {
                    $options = array_map('trim', explode(',', $options));
                }

                $match = [];
                if (!empty($field['id'])) {
                    $match['id'] = $field['id'];
                } else {
                    $match['name'] = Str::snake($field['label']); // Fallback
                }

                $s = $event->eventSubmissionFields()->updateOrCreate(
                    $match,
                    [
                        'label' => $field['label'],
                        'name' => Str::snake($field['label']),
                        'type' => $field['type'],
                        'is_required' => $field['is_required'] ?? false,
                        'options' => $options,
                    ]
                );
                $keepSubIds[] = $s->id;
            }
        }
        $event->eventSubmissionFields()->whereNotIn('id', $keepSubIds)->delete();
    }
}
