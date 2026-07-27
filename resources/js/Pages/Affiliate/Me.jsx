import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Card from '@/Components/ui/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import FlashAlert from '@/Components/FlashAlert';
import { formatRupiah } from '@/Utils/formatter';
import { CheckCircle2, Clock, XCircle, Share2, Copy } from 'lucide-react';

const STATUS = {
    pending: { label: 'Menunggu Persetujuan', cls: 'text-amber-600', Icon: Clock },
    approved: { label: 'Disetujui', cls: 'text-green-600', Icon: CheckCircle2 },
    rejected: { label: 'Ditolak', cls: 'text-red-600', Icon: XCircle },
};

export default function Me({ affiliate }) {
    const { post, processing } = useForm();
    const [copied, setCopied] = useState(false);
    const status = affiliate.status; // null | pending | approved | rejected
    const s = status ? STATUS[status] : null;

    const apply = () => post(route('affiliate.apply'), { preserveScroll: true });

    const copyRef = () => {
        navigator.clipboard.writeText(`?ref=${affiliate.ref_code}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <GuestLayout>
            <Head title="Program Affiliate" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <FlashAlert />

                    <Card className="bg-base-100 p-6 shadow-medium">
                        <div className="flex items-center gap-2 mb-4">
                            <Share2 className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold">Program Affiliate</h2>
                        </div>

                        {!status && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Jadi affiliate untuk mendapat komisi dari setiap tiket yang terjual lewat link referral Anda.
                                    Ajukan diri Anda, lalu tunggu persetujuan admin atau penyelenggara.
                                </p>
                                <PrimaryButton type="button" onClick={apply} disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Ajukan jadi Affiliate'}
                                </PrimaryButton>
                            </div>
                        )}

                        {status && (
                            <div className="flex items-center gap-2 mb-2">
                                <s.Icon className={`w-5 h-5 ${s.cls}`} />
                                <span className={`font-medium ${s.cls}`}>{s.label}</span>
                            </div>
                        )}

                        {status === 'pending' && (
                            <p className="text-sm text-gray-600">Pengajuan Anda sedang ditinjau. Kami akan memberi tahu bila sudah disetujui.</p>
                        )}

                        {status === 'rejected' && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Pengajuan Anda sebelumnya ditolak. Anda dapat mengajukan kembali.</p>
                                <PrimaryButton type="button" onClick={apply} disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Ajukan Ulang'}
                                </PrimaryButton>
                            </div>
                        )}
                    </Card>

                    {status === 'approved' && (
                        <>
                            <Card className="bg-base-100 p-6 shadow-medium">
                                <h3 className="font-semibold mb-2">Kode Referral Anda</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Tambahkan <code className="px-1 bg-gray-100 rounded">?ref={affiliate.ref_code}</code> di akhir link event mana pun yang mengaktifkan afiliasi. Setiap tiket yang terjual lewat link itu memberi Anda komisi.
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm">?ref={affiliate.ref_code}</code>
                                    <button type="button" onClick={copyRef} className="btn btn-sm btn-outline">
                                        <Copy className="w-4 h-4 mr-1" /> {copied ? 'Tersalin' : 'Salin'}
                                    </button>
                                </div>
                            </Card>

                            <Card className="bg-base-100 p-6 shadow-medium">
                                <h3 className="font-semibold mb-1">Total Komisi (transaksi Paid)</h3>
                                <p className="text-2xl font-bold text-primary">{formatRupiah(affiliate.total_commission)}</p>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
