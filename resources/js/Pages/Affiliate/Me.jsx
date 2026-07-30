import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Card from '@/Components/ui/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import FlashAlert from '@/Components/FlashAlert';
import AffiliateTutorial from '@/Components/AffiliateTutorial';
import { formatRupiah } from '@/Utils/formatter';
import { CheckCircle2, Clock, XCircle, Share2, Copy, HelpCircle, FileDown } from 'lucide-react';

const STATUS = {
    pending: { label: 'Menunggu Persetujuan', cls: 'text-amber-600', Icon: Clock },
    approved: { label: 'Disetujui', cls: 'text-green-600', Icon: CheckCircle2 },
    rejected: { label: 'Ditolak', cls: 'text-red-600', Icon: XCircle },
};

const rewardLabel = (ev) => (ev.type === 'percentage' ? `${ev.reward}%` : formatRupiah(ev.reward));

function CopyLink({ url }) {
    const [ok, setOk] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(url);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
    };
    return (
        <button type="button" onClick={copy} className="btn btn-xs btn-outline shrink-0">
            <Copy className="w-3.5 h-3.5 mr-1" /> {ok ? 'Tersalin' : 'Salin link'}
        </button>
    );
}

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
                    <AffiliateTutorial />
                    <FlashAlert />

                    <Card className="bg-base-100 p-6 shadow-medium">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold">Program Affiliate</h2>
                            </div>
                            <div className="flex items-center gap-1">
                                <a
                                    href="/panduan-affiliate.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="btn btn-ghost btn-sm gap-1"
                                    title="Unduh panduan PDF"
                                >
                                    <FileDown className="w-4 h-4" /> PDF
                                </a>
                                <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new Event('open-affiliate-tutorial'))}
                                    className="btn btn-ghost btn-sm gap-1"
                                    title="Buka panduan"
                                >
                                    <HelpCircle className="w-4 h-4" /> Panduan
                                </button>
                            </div>
                        </div>

                        {!status && (
                            <div className="space-y-4">
                                <p className="text-sm text-base-content/70">
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
                            <p className="text-sm text-base-content/70">Pengajuan Anda sedang ditinjau. Kami akan memberi tahu bila sudah disetujui.</p>
                        )}

                        {status === 'rejected' && (
                            <div className="space-y-4">
                                <p className="text-sm text-base-content/70">Pengajuan Anda sebelumnya ditolak. Anda dapat mengajukan kembali.</p>
                                <PrimaryButton type="button" onClick={apply} disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Ajukan Ulang'}
                                </PrimaryButton>
                            </div>
                        )}
                    </Card>

                    {status === 'approved' && (
                        <>
                            <Card className="bg-base-100 p-6 shadow-medium">
                                <h3 className="font-semibold mb-1">Total Komisi (transaksi Paid)</h3>
                                <p className="text-2xl font-bold text-primary">{formatRupiah(affiliate.total_commission)}</p>
                            </Card>

                            {/* Rincian komisi yang sudah didapat, per event */}
                            {affiliate.per_event?.length > 0 && (
                                <Card className="bg-base-100 p-6 shadow-medium">
                                    <h3 className="font-semibold mb-3">Komisi per Event</h3>
                                    <div className="divide-y divide-base-200">
                                        {affiliate.per_event.map((row, i) => (
                                            <div key={i} className="flex items-center justify-between py-3 gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">{row.event}</p>
                                                    <p className="text-xs text-base-content/60">{row.tickets} tiket terjual · {row.count} transaksi</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="font-semibold text-primary">{formatRupiah(row.commission)}</p>
                                                    <p className="text-xs text-base-content/60">komisi</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            <Card className="bg-base-100 p-6 shadow-medium">
                                <h3 className="font-semibold mb-2">Kode Referral Anda</h3>
                                <p className="text-sm text-base-content/70 mb-3">
                                    Tambahkan <code className="px-1 bg-base-200 rounded">?ref={affiliate.ref_code}</code> di akhir link event mana pun yang mengaktifkan afiliasi. Atau langsung salin link per event di bawah.
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-base-200 rounded text-sm">?ref={affiliate.ref_code}</code>
                                    <button type="button" onClick={copyRef} className="btn btn-sm btn-outline">
                                        <Copy className="w-4 h-4 mr-1" /> {copied ? 'Tersalin' : 'Salin'}
                                    </button>
                                </div>
                            </Card>

                            {/* Event ber-afiliasi + komisi & link referral per event */}
                            <Card className="bg-base-100 p-6 shadow-medium">
                                <h3 className="font-semibold mb-1">Event yang Bisa Dipromosikan</h3>
                                <p className="text-sm text-base-content/60 mb-4">Bagikan link di bawah. Besaran komisi mengikuti pengaturan tiap event.</p>

                                {(!affiliate.available_events || affiliate.available_events.length === 0) ? (
                                    <p className="text-sm text-base-content/50">Belum ada event yang mengaktifkan program afiliasi.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {affiliate.available_events.map((ev, i) => (
                                            <div key={i} className="border border-base-200 rounded-xl p-3">
                                                <div className="flex items-center justify-between gap-2 mb-2">
                                                    <p className="font-medium truncate">{ev.title}</p>
                                                    <span className="badge badge-primary badge-outline shrink-0">Komisi {rewardLabel(ev)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <code className="flex-1 px-2 py-1.5 bg-base-200 rounded text-xs truncate">{ev.link}</code>
                                                    <CopyLink url={ev.link} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
