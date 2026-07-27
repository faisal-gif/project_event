import StepTutorial from '@/Components/StepTutorial';
import { Share2, UserCheck, Link2, Wallet } from 'lucide-react';

const steps = [
    { icon: Share2, title: 'Program Affiliate', desc: 'Dapatkan komisi setiap kali ada tiket terjual lewat link referral Anda. Ikuti langkah singkat berikut.' },
    { icon: UserCheck, title: '1. Ajukan & Tunggu Persetujuan', desc: 'Klik "Ajukan jadi Affiliate". Pengajuan Anda akan ditinjau oleh admin atau penyelenggara. Statusnya bisa Anda pantau di halaman ini.' },
    { icon: Link2, title: '2. Bagikan Link Referral', desc: 'Setelah disetujui, Anda mendapat kode referral. Tambahkan ?ref=KODE di akhir link event lalu sebarkan ke teman atau media sosial.' },
    { icon: Wallet, title: '3. Kumpulkan Komisi', desc: 'Setiap tiket yang dibeli lewat link Anda (dan lunas) akan menambah komisi. Total komisi tampil di halaman ini.' },
];

// Onboarding affiliate. Buka ulang: window.dispatchEvent(new Event('open-affiliate-tutorial')).
export default function AffiliateTutorial() {
    return (
        <StepTutorial
            steps={steps}
            storageKey="affiliate_tutorial_seen_v1"
            autoOpen
            eventName="open-affiliate-tutorial"
        />
    );
}
