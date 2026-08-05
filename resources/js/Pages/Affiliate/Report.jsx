import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Wallet, Download, ChevronRight, CheckCircle2, FileText } from 'lucide-react';
import { formatRupiah, formatDate } from '@/Utils/formatter';
import FlashAlert from '@/Components/FlashAlert';

function RowStatus({ unpaid }) {
    return unpaid > 0 ? (
        <span className="badge badge-warning badge-outline whitespace-nowrap">Sisa {formatRupiah(unpaid)}</span>
    ) : (
        <span className="badge badge-success badge-outline gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Lunas</span>
    );
}

function PayoutHistory({ payouts }) {
    if (!payouts?.length) return null;
    return (
        <div className="px-4 py-3 border-t border-base-200">
            <p className="text-xs font-semibold text-base-content/60 mb-1.5">Riwayat Pembayaran</p>
            <ul className="text-xs space-y-1">
                {payouts.map((p, k) => (
                    <li key={k} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-base-content/70">{formatDate(p.paid_at)}</span>
                        <span className="font-semibold text-primary">{formatRupiah(p.amount)}</span>
                        {p.by && <span className="text-base-content/50">oleh {p.by}</span>}
                        {p.note && <span className="text-base-content/50">· {p.note}</span>}
                        <a href={p.proof_url} target="_blank" rel="noopener noreferrer" className="link link-primary inline-flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Bukti
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Report({ rows, total_commission, filters }) {
    const { auth } = usePage().props;
    const prefix = auth.user.role === 'admin' ? 'admin' : 'organizer';
    const cols = prefix === 'admin' ? 8 : 7;

    const [search, setSearch] = useState(filters?.search || '');
    const [eventOpt, setEventOpt] = useState(null);
    const [open, setOpen] = useState(() => new Set());
    const toggle = (i) =>
        setOpen((prev) => {
            const next = new Set(prev);
            next.has(i) ? next.delete(i) : next.add(i);
            return next;
        });

    // Modal pembayaran komisi (admin).
    const payModal = useRef();
    const [payRow, setPayRow] = useState(null);
    const payForm = useForm({ proof: null, note: '' });
    const openPay = (row) => {
        setPayRow(row);
        payForm.reset();
        payForm.clearErrors();
        payModal.current?.showModal();
    };
    const submitPay = (e) => {
        e.preventDefault();
        payForm.post(route('admin.affiliates.pay', [payRow.event_id, payRow.promoter_id]), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                payModal.current?.close();
                payForm.reset();
            },
        });
    };

    const isFirst = useRef(true);
    const searchTimer = useRef();
    const eventTimer = useRef();

    // Ambil daftar affiliate (promotor) dari server sesuai ketikan (maks 20), didebounce.
    const loadPromoters = (input) =>
        new Promise((resolve) => {
            clearTimeout(searchTimer.current);
            if (!input) {
                resolve([]);
                return;
            }
            searchTimer.current = setTimeout(() => {
                fetch(route(`${prefix}.affiliates.report.search`, { q: input }), { headers: { Accept: 'application/json' } })
                    .then((r) => r.json())
                    .then(resolve)
                    .catch(() => resolve([]));
            }, 300);
        });

    // Event yang punya komisi affiliate (untuk filter).
    const loadEvents = (input) =>
        new Promise((resolve) => {
            clearTimeout(eventTimer.current);
            eventTimer.current = setTimeout(() => {
                fetch(route(`${prefix}.affiliates.report.eventSearch`, { q: input }), { headers: { Accept: 'application/json' } })
                    .then((r) => r.json())
                    .then(resolve)
                    .catch(() => resolve([]));
            }, 250);
        });

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(
                route(`${prefix}.affiliates.report`),
                { search, event_id: eventOpt?.value || '' },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(t);
    }, [search, eventOpt]);

    return (
        <AuthenticatedLayout>
            <Head title="Komisi Affiliate" />

            <div className="py-10">
                <div className="mx-auto max-w-6xl px-4 lg:px-8">
                    <FlashAlert />
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-6 h-6 text-primary" />
                            <h1 className="font-bold text-2xl">Komisi Affiliate</h1>
                        </div>
                        <a
                            href={route(`${prefix}.affiliates.report.export`, { search: search || undefined, event_id: eventOpt?.value || undefined })}
                            target='_blank'
                            className="btn btn-success btn-sm text-white gap-1"
                        >
                            <Download className="w-4 h-4" /> Export Excel
                        </a>
                    </div>

                    {/* Tab nav — approval/pengajuan hanya untuk admin */}
                    {prefix === 'admin' && (
                        <div className="tabs tabs-boxed bg-base-200 w-fit mb-6">
                            <Link href={route('admin.affiliates.index')} className="tab">Pengajuan</Link>
                            <Link href={route('admin.affiliates.report')} className="tab tab-active">Komisi</Link>
                        </div>
                    )}

                    {/* Ringkasan total */}
                    <div className="card bg-primary/10 border border-primary/20 mb-4">
                        <div className="card-body py-4">
                            <p className="text-sm text-base-content/70">Total Komisi Terbayar</p>
                            <p className="text-2xl font-bold text-primary">{formatRupiah(total_commission)}</p>
                        </div>
                    </div>

                    {/* Filter: affiliate + event (AsyncSelect, server-side) */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="w-full sm:flex-1">
                            <AsyncSelect
                                cacheOptions
                                isClearable
                                loadOptions={loadPromoters}
                                onChange={(opt) => setSearch(opt ? opt.value : '')}
                                placeholder="Cari nama atau email affiliate..."
                                noOptionsMessage={({ inputValue }) => (inputValue ? 'Tidak ditemukan' : 'Ketik untuk mencari...')}
                                loadingMessage={() => 'Mencari...'}
                                styles={{ control: (base) => ({ ...base, minHeight: '3rem' }) }}
                            />
                        </div>
                        <div className="w-full sm:w-64">
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                isClearable
                                value={eventOpt}
                                loadOptions={loadEvents}
                                onChange={setEventOpt}
                                placeholder="Semua event"
                                noOptionsMessage={() => 'Tidak ada event'}
                                loadingMessage={() => 'Memuat...'}
                                styles={{ control: (base) => ({ ...base, minHeight: '3rem' }) }}
                            />
                        </div>
                    </div>

                    {/* Desktop: tabel */}
                    <div className="card bg-base-100 border border-base-200 shadow-sm hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="w-8"></th>
                                        <th>Event</th>
                                        <th>Affiliate</th>
                                        <th className="text-right">Tiket Terjual</th>
                                        <th className="text-right">Transaksi</th>
                                        <th className="text-right">Komisi</th>
                                        <th>Status</th>
                                        {prefix === 'admin' && <th className="text-right">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length === 0 && (
                                        <tr><td colSpan={cols} className="text-center text-base-content/50 py-8">Belum ada komisi affiliate.</td></tr>
                                    )}
                                    {rows.map((row, i) => (
                                        <Fragment key={i}>
                                            <tr className="hover cursor-pointer" onClick={() => toggle(i)}>
                                                <td>
                                                    <ChevronRight className={`w-4 h-4 transition-transform ${open.has(i) ? 'rotate-90' : ''}`} />
                                                </td>
                                                <td className="font-medium max-w-[220px] truncate">{row.event}</td>
                                                <td>
                                                    <div className="font-medium">{row.affiliate}</div>
                                                    <div className="text-xs text-base-content/60">{row.affiliate_email}</div>
                                                </td>
                                                <td className="text-right">{row.tickets}</td>
                                                <td className="text-right">{row.trx_count}</td>
                                                <td className="text-right font-semibold text-primary">{formatRupiah(row.commission)}</td>
                                                <td><RowStatus unpaid={row.unpaid} /></td>
                                                {prefix === 'admin' && (
                                                    <td className="text-right" onClick={(e) => e.stopPropagation()}>
                                                        {row.unpaid > 0 && (
                                                            <button type="button" onClick={() => openPay(row)} className="btn btn-xs btn-primary whitespace-nowrap">
                                                                <Wallet className="w-3.5 h-3.5 mr-1" /> Bayar
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                            {open.has(i) && (
                                                <tr className="bg-base-200/40">
                                                    <td colSpan={cols} className="p-0">
                                                        <table className="table table-sm">
                                                            <thead>
                                                                <tr>
                                                                    <th>Pembeli</th>
                                                                    <th>Jenis Tiket</th>
                                                                    <th className="text-right">Harga Tiket</th>
                                                                    <th className="text-right">Jumlah</th>
                                                                    <th className="text-right">Komisi/Tiket</th>
                                                                    <th className="text-right">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {row.details.map((d, j) => (
                                                                    <tr key={j}>
                                                                        <td>{d.buyer}</td>
                                                                        <td>{d.ticket_type}</td>
                                                                        <td className="text-right">{formatRupiah(d.price)}</td>
                                                                        <td className="text-right">{d.qty}</td>
                                                                        <td className="text-right text-primary">{formatRupiah(d.commission_per_ticket)}</td>
                                                                        <td className="text-right">
                                                                            {d.is_paid
                                                                                ? <span className="badge badge-success badge-xs">Lunas</span>
                                                                                : <span className="badge badge-ghost badge-xs">Belum</span>}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        <PayoutHistory payouts={row.payouts} />
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile: card */}
                    <div className="md:hidden space-y-3">
                        {rows.length === 0 && (
                            <div className="text-center text-base-content/50 py-8">Belum ada komisi affiliate.</div>
                        )}
                        {rows.map((row, i) => (
                            <div key={i} className="card bg-base-100 border border-base-200 shadow-sm">
                                <div className="card-body p-4 gap-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-semibold leading-snug truncate">{row.event}</p>
                                            <p className="text-xs text-base-content/60 truncate">{row.affiliate} · {row.affiliate_email}</p>
                                        </div>
                                        <RowStatus unpaid={row.unpaid} />
                                    </div>
                                    <div className="flex items-end justify-between gap-2">
                                        <p className="text-xs text-base-content/60">{row.tickets} tiket · {row.trx_count} transaksi</p>
                                        <p className="font-bold text-primary">{formatRupiah(row.commission)}</p>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <button type="button" onClick={() => toggle(i)} className="btn btn-xs btn-ghost flex-1">
                                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${open.has(i) ? 'rotate-90' : ''}`} />
                                            {open.has(i) ? 'Tutup' : 'Rincian'}
                                        </button>
                                        {prefix === 'admin' && row.unpaid > 0 && (
                                            <button type="button" onClick={() => openPay(row)} className="btn btn-xs btn-primary flex-1">
                                                <Wallet className="w-3.5 h-3.5 mr-1" /> Bayar
                                            </button>
                                        )}
                                    </div>
                                    {open.has(i) && (
                                        <div className="mt-1 border-t border-base-200 pt-2 space-y-2">
                                            {row.details.map((d, j) => (
                                                <div key={j} className="flex items-start justify-between gap-2 text-xs">
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{d.buyer}</p>
                                                        <p className="text-base-content/50">{d.ticket_type} · {d.qty}× {formatRupiah(d.price)}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-primary">{formatRupiah(d.commission_per_ticket)}/tiket</p>
                                                        {d.is_paid
                                                            ? <span className="badge badge-success badge-xs">Lunas</span>
                                                            : <span className="badge badge-ghost badge-xs">Belum</span>}
                                                    </div>
                                                </div>
                                            ))}
                                            <PayoutHistory payouts={row.payouts} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {prefix === 'admin' && (
                <dialog ref={payModal} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-1">Bayar Komisi</h3>
                        {payRow && (
                            <p className="text-sm text-base-content/70 mb-4">{payRow.affiliate} · {payRow.event}</p>
                        )}
                        <form onSubmit={submitPay} className="space-y-4">
                            <div>
                                <label className="label"><span className="label-text">Jumlah dibayar</span></label>
                                <input type="text" readOnly value={payRow ? formatRupiah(payRow.unpaid) : ''} className="input input-bordered w-full bg-base-200" />
                                <p className="text-xs text-base-content/50 mt-1">Melunasi seluruh komisi terutang event ini.</p>
                            </div>
                            <div>
                                <label className="label"><span className="label-text">Bukti transfer <span className="text-error">*</span></span></label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => payForm.setData('proof', e.target.files[0] || null)}
                                    className="file-input file-input-bordered w-full"
                                />
                                {payForm.errors.proof && <p className="text-xs text-error mt-1">{payForm.errors.proof}</p>}
                            </div>
                            <div>
                                <label className="label"><span className="label-text">Catatan (opsional)</span></label>
                                <textarea
                                    value={payForm.data.note}
                                    onChange={(e) => payForm.setData('note', e.target.value)}
                                    className="textarea textarea-bordered w-full"
                                    rows={2}
                                />
                                {payForm.errors.note && <p className="text-xs text-error mt-1">{payForm.errors.note}</p>}
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={() => payModal.current?.close()}>Batal</button>
                                <button type="submit" className="btn btn-primary" disabled={payForm.processing || !payForm.data.proof}>
                                    {payForm.processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop"><button>close</button></form>
                </dialog>
            )}
        </AuthenticatedLayout>
    );
}
