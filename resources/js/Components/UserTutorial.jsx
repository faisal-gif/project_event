import { usePage } from '@inertiajs/react';
import StepTutorial from '@/Components/StepTutorial';
import { Search, Ticket, QrCode, Share2, PartyPopper } from 'lucide-react';

const steps = [
    { icon: PartyPopper, title: 'Selamat datang di TIMES Events!', desc: 'Panduan singkat cara membeli dan menggunakan tiket event. Cuma sebentar kok.' },
    { icon: Search, title: '1. Cari Event', desc: 'Buka menu "Event" untuk menjelajahi acara. Klik salah satu event untuk melihat detailnya.' },
    { icon: Ticket, title: '2. Beli & Bayar Tiket', desc: 'Di halaman detail event, pilih jenis tiket lalu lanjut checkout. Pembayaran diproses lewat metode yang tersedia.' },
    { icon: QrCode, title: '3. Lihat Tiket & QR', desc: 'Tiket dan status pembayaran ada di menu "Tiket & Transaksi". Tunjukkan QR code saat masuk acara.' },
    { icon: Share2, title: '4. Jadi Affiliate (opsional)', desc: 'Ingin dapat komisi? Ajukan jadi affiliate lewat menu "Affiliate", lalu bagikan link referral Anda.' },
];

// Onboarding pembeli (role user). Buka ulang: window.dispatchEvent(new Event('open-tutorial')).
export default function UserTutorial() {
    const user = usePage().props.auth?.user;
    return (
        <StepTutorial
            steps={steps}
            storageKey="buyer_tutorial_seen_v1"
            autoOpen={user?.role === 'user'}
            eventName="open-tutorial"
        />
    );
}
