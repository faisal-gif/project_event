<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TripayService
{
    /**
     * Create a new class instance.
     */

    protected $apiKey;
    protected $merchantCode;
    protected $privateKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.tripay.api_key');
        $this->merchantCode = config('services.tripay.merchant_code');
        $this->privateKey = config('services.tripay.private_key');
        $this->baseUrl = 'https://tripay.co.id/api';
    }

    public function getPaymentChannel()
    {

        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->get($this->baseUrl . '/merchant/payment-channel');


        return json_decode($response)->data;
    }

    public function createTransaction($ticketType, $user, $validated, $discount = 0)
    {
        $event = $ticketType->event;

        $ref = 'INV-' . $event->id . '-' . time();
        $amount = (int) number_format($ticketType->price, 0, '', '');
        $total = $amount * $validated['quantity'];
        $discount = (int) $discount;
        // Amount yang ditagih Tripay = harga kotor dikurangi diskon voucher.
        $net = max(0, $total - $discount);

        if ($discount > 0) {
            // Saat ada diskon, kirim satu order item bernilai net agar amount == sub_total (valid untuk Tripay).
            $orderItems = [[
                'sku'         => 'TICKET-' . $ticketType->id,
                'name'        => $event->title . ' - ' . $ticketType->name . ' (x' . $validated['quantity'] . ', termasuk voucher)',
                'price'       => $net,
                'quantity'    => 1,
                'sub_total'   => $net,
                'image'       => $event->image,
                'description' => 'Pembelian tiket ' . $event->title . ' (diskon voucher ' . $discount . ')',
            ]];
        } else {
            $orderItems = [[
                'sku'         => 'TICKET-' . $ticketType->id,
                'name'        => $event->title . ' - ' . $ticketType->name,
                'price'       => $amount,
                'quantity'    => $validated['quantity'],
                'sub_total'   => $total,
                'image'       => $event->image,
                'description' => 'Pembelian tiket ' . $event->title,
            ]];
        }

        $payload = [
            'method'         => $validated['paymentMethod'], // atau gunakan inputan dari user
            'merchant_ref'   => $ref,
            'amount'         => $net,
            'customer_name'  => $user->name,
            'customer_email' => $user->email,
            'order_items'    => $orderItems,
            'callback_url'   => url('/users/tripay/callback'),
            'return_url'     => url('/users/transactions/status'),
            'expired_time'   => now()->addHours(24)->timestamp,
            'signature'      => hash_hmac('sha256', $this->merchantCode . $ref . $net, $this->privateKey)
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post($this->baseUrl . '/transaction/create', $payload);

        return $response->json();
    }
}
