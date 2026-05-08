<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentSuccessfulMail extends Mailable
{
    use Queueable, SerializesModels;


    public $emailData;
    /**
     * Create a new message instance.
     */
    public function __construct(Transaction $emailData)
    {
        $this->emailData = $emailData;
    }

   
    public function build()
    {
        return $this->subject('Pembayaran Berhasil - Invoice #' . $this->emailData->reference)
            ->view('emails.payment_success');
    }
}
