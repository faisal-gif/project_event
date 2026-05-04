<?php

namespace App\Http\Controllers;

use App\Models\DetailPendaftar;
use App\Models\Event;
use App\Models\EventField;
use App\Models\EventFieldResponse;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\Transaction;
use App\Services\TicketService;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TransactionController extends Controller
{
    public function index()
    {
        $userId = auth()->user()->id;
        $transactions = Transaction::with('event')->where('user_id', $userId)->latest()->get();
        return Inertia::render('Users/Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function create(Request $request, TicketType $ticketType, TripayService $tripay)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:' . $ticketType->event->limit_ticket_user],
        ]);

        if ($ticketType->remaining_quota < $validated['quantity']) {
            return back()->with('error', 'Sorry, the remaining tickets are not enough.');
        }

        $ticketType->load('event.eventFields'); // Load event fields
        $channel = $ticketType->price > 0 ? $tripay->getPaymentChannel() : [];


        return Inertia::render('Users/Transaction/Create', [
            'ticketType' => $ticketType,
            'event' => $ticketType->event,
            'channel' => $channel,
            'quantity' => $validated['quantity'],
        ]);
    }

    public function store(Request $request, TicketType $ticketType, TripayService $tripay, TicketService $ticketServices)
    {
        $event = $ticketType->event->load('eventFields');
        $user = auth()->user();

        // 1. Aturan Validasi Utama
        $mainRules = [
            'quantity' => ['required', 'integer', 'min:1', 'max:' . $event->limit_ticket_user],
            'paymentMethod' => $ticketType->price > 0 ? 'required' : 'nullable',
            'name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'usia' => 'required|integer|min:0',
            'pekerjaan' => 'required|string|max:255',
            'terms' => 'accepted',
        ];

        // 2. Pesan Kustom Utama
        $customMessages = [
            'quantity.required' => 'Silakan tentukan jumlah tiket yang ingin dibeli.',
            'quantity.max' => "Maksimal pembelian untuk event ini adalah {$event->limit_ticket_user} tiket.",
            'name.required' => 'Nama lengkap sesuai KTP wajib diisi.',
            'email.required' => 'Alamat email aktif wajib diisi.',
            'email.email' => 'Format email yang Anda masukkan tidak valid.',
            'phone.required' => 'Nomor HP wajib diisi untuk pengiriman e-tiket.',
            'terms.accepted' => 'Anda harus menyetujui Syarat & Ketentuan yang berlaku.',
            'usia.required' => 'Informasi usia wajib diisi.',
            'pekerjaan.required' => 'Informasi pekerjaan wajib diisi.',
        ];

        // 3. Aturan & Pesan Dinamis untuk Event Fields
        $fieldRules = [];
        $fieldTypesMap = []; // Untuk mengingat tipe inputan demi Frontend React

        if ($event->need_additional_questions) {
            foreach ($event->eventFields as $field) {
                $rules = $field->is_required ? ['required'] : ['nullable'];
                $fieldTypesMap[$field->name] = $field->type;

                if ($field->is_required) {
                    $customMessages["field_responses.{$field->name}.required"] = "Bagian {$field->label} wajib diisi.";
                }

                if ($field->type === 'image') {
                    $rules[] = 'image';
                    $rules[] = 'max:2048';
                    $customMessages["field_responses.{$field->name}.image"] = "File {$field->label} harus berupa gambar (jpg, jpeg, png).";
                    $customMessages["field_responses.{$field->name}.max"] = "Ukuran gambar {$field->label} tidak boleh lebih dari 2MB.";
                } elseif ($field->type === 'file') {
                    $rules[] = 'file';
                    $rules[] = 'max:5120';
                    $customMessages["field_responses.{$field->name}.max"] = "Ukuran file {$field->label} tidak boleh lebih dari 5MB.";
                }

                $fieldRules['field_responses.' . $field->name] = $rules;
            }
        }

        // 4. Jalankan Validasi
        $validated = $request->validate(
            array_merge($mainRules, $fieldRules),
            $customMessages
        );

        if ($ticketType->remaining_quota < $validated['quantity']) {
            return back()->with('error', 'Maaf, sisa kuota tiket tidak mencukupi.');
        }

        // 5. Proses Upload dan Strukturisasi JSON (Agar Modal Frontend Tidak Error)
        $rawResponses = $validated['field_responses'] ?? [];
        if ($request->hasFile('field_responses')) {
            foreach ($request->file('field_responses') as $fieldName => $file) {
                $path = $file->store("uploads/event_responses/{$event->slug}/{$fieldName}", 'public');
                $rawResponses[$fieldName] = $path;
            }
        }

        $structuredResponses = [];
        foreach ($rawResponses as $fieldName => $fieldValue) {
            if (is_array($fieldValue)) {
                $fieldValue = implode(', ', $fieldValue);
            }
            $structuredResponses[] = [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'field_name' => $fieldName,
                'field_type' => $fieldTypesMap[$fieldName] ?? 'text',
                'field_value' => $fieldValue,
            ];
        }

        // ====================================================================
        // 6. LOGIKA AFILIASI (Menghitung Komisi Promotor)
        // ====================================================================
        $totalPrice = $ticketType->price * $validated['quantity'];

        // Ambil ID Promotor dari Session (Diasumsikan kamu sudah set session saat user klik link refferal)
        $promoterId = session('referral_id');
        $commissionEarned = 0;

        // Cek jika event mengizinkan afiliasi, ada promoter, dan promoter BUKAN pembeli itu sendiri
        if ($event->is_affiliate_enabled && $promoterId && $promoterId != $user->id) {
            if ($event->affiliate_type === 'percentage') {
                $commissionEarned = ($event->affiliate_reward / 100) * $totalPrice;
            } elseif ($event->affiliate_type === 'fixed') {
                // Jika fixed, kita kalikan dengan jumlah tiket yang dibeli
                $commissionEarned = $event->affiliate_reward * $validated['quantity'];
            }
        } else {
            // Reset jika ternyata tidak valid
            $promoterId = null;
        }
        // ====================================================================

        try {
            $trx = DB::transaction(function () use ($ticketType, $user, $validated, $tripay, $ticketServices, $structuredResponses, $promoterId, $commissionEarned) {

                $detailPendaftar = DetailPendaftar::create([
                    'nama' => $validated['name'],
                    'email' => $validated['email'],
                    'no_hp' => $validated['phone'],
                    'usia' => $validated['usia'],
                    'pekerjaan' => $validated['pekerjaan'],
                    'terms_and_condition' => $validated['terms'],
                ]);

                if ($ticketType->price == 0) {
                    // TRANSAKSI GRATIS
                    $transaction = Transaction::create([
                        'user_id'             => $user->id,
                        'event_id'            => $ticketType->event->id,
                        'ticket_type_id'      => $ticketType->id,
                        'detail_pendaftar_id' => $detailPendaftar->id,
                        'reference'           => 'TICKET-' . \Illuminate\Support\Str::random(6) . '-' . time(),
                        'payment_method'      => 'FREE',
                        'amount'              => 0,
                        'quantity'            => $validated['quantity'],
                        'subtotal'            => 0,
                        'tripay_fee'          => 0,
                        'status'              => 'PAID',
                        'checkout_url'        => null,
                        'field_responses'     => json_encode($structuredResponses),

                        // Kolom Afiliasi
                        'promoter_id'         => $promoterId,
                        'commission_earned'   => $commissionEarned,
                    ]);

                    $ticketServices->issueTicket($transaction);
                } else {
                    // TRANSAKSI BERBAYAR (Tripay)
                    $result = $tripay->createTransaction($ticketType, $user, $validated);

                    if (!isset($result['success']) || !$result['success']) {
                        throw new \Exception('Gagal membuat transaksi: ' . ($result['message'] ?? 'Kesalahan tidak diketahui'));
                    }

                    $transaction = Transaction::create([
                        'user_id'             => $user->id,
                        'event_id'            => $ticketType->event->id,
                        'ticket_type_id'      => $ticketType->id,
                        'detail_pendaftar_id' => $detailPendaftar->id,
                        'reference'           => $result['data']['reference'],
                        'payment_method'      => $result['data']['payment_method'],
                        'amount'              => $ticketType->price,
                        'quantity'            => $validated['quantity'],
                        'subtotal'            => $result['data']['amount'],
                        'tripay_fee'          => $result['data']['total_fee'],
                        'status'              => $result['data']['status'],
                        'checkout_url'        => $result['data']['checkout_url'],
                        'field_responses'     => json_encode($structuredResponses),

                        // Kolom Afiliasi
                        'promoter_id'         => $promoterId,
                        'commission_earned'   => $commissionEarned,
                    ]);
                }
                return $transaction;
            });

            // 7. Hapus session referral setelah transaksi sukses tercatat
            if (session()->has('referral_id')) {
                session()->forget('referral_id');
            }

            return redirect()->route('transactions.status', ['tripay_reference' => $trx->reference])
                ->with('checkout_url', $trx->checkout_url);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function status(Request $request)
    {
        $trx = Transaction::where('reference', $request->tripay_reference)->firstOrFail();
        $trx->load('event', 'ticketType');

        $ticket = Ticket::where('transaction_id', $trx->id)->first();

        return Inertia::render('Users/Transaction/Status', [
            'trx' => $trx,
            'event' => $trx->event,
            'ticket' => $ticket,
        ]);
    }


    public function adminIndex()
    {
        $transactions = Transaction::with(['event', 'user'])->latest()->get();
        return Inertia::render('Admin/Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }
}
