<!DOCTYPE html>
<html>

<head>
    <title>Invoice Pembayaran</title>
</head>

<body>
    <h2>Halo, {{ $emailData->user->name }}!</h2>
    <p>Terima kasih telah melakukan pembayaran.</p>

    <table border="1" cellpadding="10" cellspacing="0">
        <tr>
            <td><strong>No. Referensi</strong></td>
            <td>{{ $emailData->reference }}</td>
        </tr>
        <tr>
            <td><strong>Event</strong></td>
            <td>{{ $emailData->event->title }}</td>
        </tr>
        <tr>
            <td><strong>Jumlah Bayar</strong></td>
            <td>Rp {{ number_format($emailData->subtotal, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td><strong>Status</strong></td>
            <td>LUNAS</td>
        </tr>
    </table>
    <p>
        Silahkan cek tiket anda di <a href="https://event.times.co.id/">event.times.co.id</a>
    </p>
    
</body>

</html>
