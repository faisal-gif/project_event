<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organizer\EventRequest;
use App\Models\CategoryEvents;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class OrganizerEventController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'organizer') {
            abort(403, 'Unauthorized access.');
        }

        $events = Event::with('creator', 'category', 'ticketTypes')->where('created_by', $user->id)->latest()->get();
        return Inertia::render('Organizer/Events/Index', ['events' => $events]);
    }

    public function create()
    {
        $category = CategoryEvents::all();
        return Inertia::render('Organizer/Events/Create', [
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
            'status' => 'valid',
            'is_headline' => $data['is_headline'],
            'limit_ticket_user' => $data['limit_ticket_user'],
            'need_additional_questions' => $data['need_additional_questions'] ?? false,
            'needs_submission' => $data['needs_submission'] ?? false,
        ]);


        $this->syncRelatedData($event, $data);

        return redirect()->route('organizer.events.index')->with('success', 'Event created successfully.');
    }

    public function show(Event $event, Request $request)
    {
        // 1. Eager load hanya untuk relasi dasar/kecil yang menempel pada event
        $event->load('category', 'ticketTypes');
        $user = Auth::id();

        if ($event->created_by !== $user) {
            return redirect()->route('organizer.events.index')->with('success', 'Event ini bukan anda yang buat.');
        }

        // 2. Query Transaksi (Search & Paginate)
        $transactions = $event->transaction()
            ->with('user')
            ->when($request->search_transaction, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->paginate(10, ['*'], 'transaction_page')
            ->withQueryString();

        // 3. Query Tiket (Search, Filter Status, & Paginate)
        $tickets = $event->tickets()
            ->with(['user', 'ticket_type', 'detail_pendaftar'])
            ->when($request->search_ticket, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('ticket_code', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('detail_pendaftar', function ($dp) use ($search) {
                            $dp->where('nama', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->status_ticket, function ($query, $status) {
                $query->where('status', $status);
            })
            ->paginate(10, ['*'], 'ticket_page')
            ->withQueryString();

        // ==========================================
        // FITUR BARU: Menghitung Ringkasan / Summary
        // ==========================================

        // A. Ringkasan Transaksi
        $totalTransactions = $event->transaction()->count();
        $paidTransactions = $event->transaction()->where('status', 'PAID')->count();

        // B. Ringkasan Tiket (Total, Status, & Per Tipe Tiket)
        $totalTickets = $event->tickets()->count();

        // UPDATE: Hitung tiket berdasarkan status
        $usedTickets = $event->tickets()->where('status', 'used')->count();
        $unusedTickets = $event->tickets()->where('status', 'unused')->count();

        $ticketsByType = $event->tickets()
            ->select('ticket_type_id', \DB::raw('count(*) as total'))
            ->groupBy('ticket_type_id')
            ->with('ticket_type:id,name')
            ->get()
            ->map(function ($ticket) {
                return [
                    'name' => $ticket->ticket_type ? $ticket->ticket_type->name : 'Tidak Diketahui',
                    'total' => $ticket->total,
                ];
            });

        // 4. Kirim ke Inertia
        return Inertia::render('Organizer/Events/Show', [
            'event' => $event,
            'transactions' => $transactions,
            'tickets' => $tickets,
            'summary' => [
                'total_transactions' => $totalTransactions,
                'paid_transactions'  => $paidTransactions,
                'total_tickets'      => $totalTickets,
                'used_tickets'       => $usedTickets,       // UPDATE: Kirim ke Frontend
                'unused_tickets'     => $unusedTickets,     // UPDATE: Kirim ke Frontend
                'tickets_by_type'    => $ticketsByType,
            ],
            'filters' => [
                'search_transaction' => $request->search_transaction ?? '',
                'search_ticket'      => $request->search_ticket ?? '',
                'status_ticket'      => $request->status_ticket ?? '',
            ]
        ]);
    }

    public function edit(Event $event)
    {
        $category = CategoryEvents::all();
        $event->load('eventFields', 'eventSubmissionFields', 'ticketTypes');

        return Inertia::render('Organizer/Events/Edit', ['event' => $event, 'category' => $category]);
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

        return redirect()->route('organizer.events.index')->with('success', 'Event updated successfully.');
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


}
