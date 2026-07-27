import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Wallet, Receipt, Ticket, Users, CalendarDays, TrendingUp, ArrowRight } from 'lucide-react';
import { formatRupiah, formatDateLong } from '@/Utils/formatter';

const TRX_BADGE = { PAID: 'badge-success', UNPAID: 'badge-warning', EXPIRED: 'badge-error' };
const ROLE_BADGE = { admin: 'badge-error', organizer: 'badge-primary', judge: 'badge-accent', user: 'badge-ghost' };

function Kpi({ icon: Icon, label, value, sub, color = 'text-primary', bg = 'bg-primary/10' }) {
    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body p-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{label}</span>
                    <div className={`w-9 h-9 rounded-full ${bg} ${color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-2xl font-bold mt-1">{value}</p>
                {sub && <p className="text-xs text-gray-500">{sub}</p>}
            </div>
        </div>
    );
}

function Bar({ label, value, total, cls }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="font-medium">{value} <span className="text-gray-400">({pct}%)</span></span>
            </div>
            <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
                <div className={`h-full ${cls}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function Dashboard({ stats, transactions, events, users_by_role, recent_transactions, top_events }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>

                    {/* KPI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Kpi icon={Wallet} label="Total Pendapatan" value={formatRupiah(stats.total_revenue)}
                            sub={`Bulan ini: ${formatRupiah(stats.revenue_this_month)}`} color="text-green-600" bg="bg-green-100" />
                        <Kpi icon={Receipt} label="Transaksi PAID" value={`${transactions.paid} / ${transactions.total}`}
                            sub="lunas dari total transaksi" />
                        <Kpi icon={Ticket} label="Tiket Terjual" value={stats.tickets_sold} sub="dari transaksi lunas"
                            color="text-amber-600" bg="bg-amber-100" />
                        <Kpi icon={Users} label="Total User" value={stats.users_count}
                            sub={`${stats.events_count} event terdaftar`} color="text-blue-600" bg="bg-blue-100" />
                    </div>

                    {/* Rincian */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="card bg-base-100 border border-base-200 shadow-sm">
                            <div className="card-body p-5">
                                <h3 className="font-semibold mb-3 flex items-center gap-2"><Receipt className="w-4 h-4 text-primary" /> Status Transaksi</h3>
                                <div className="space-y-3">
                                    <Bar label="PAID" value={transactions.paid} total={transactions.total} cls="bg-success" />
                                    <Bar label="UNPAID" value={transactions.unpaid} total={transactions.total} cls="bg-warning" />
                                    <Bar label="EXPIRED" value={transactions.expired} total={transactions.total} cls="bg-error" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 border border-base-200 shadow-sm">
                            <div className="card-body p-5">
                                <h3 className="font-semibold mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> Event & User</h3>
                                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                                    <div className="rounded-lg bg-base-200 p-3">
                                        <p className="text-xl font-bold text-success">{events.valid}</p>
                                        <p className="text-xs text-gray-500">Aktif</p>
                                    </div>
                                    <div className="rounded-lg bg-base-200 p-3">
                                        <p className="text-xl font-bold text-gray-500">{events.expired}</p>
                                        <p className="text-xs text-gray-500">Expired</p>
                                    </div>
                                    <div className="rounded-lg bg-base-200 p-3">
                                        <p className="text-xl font-bold text-primary">{events.upcoming}</p>
                                        <p className="text-xs text-gray-500">Mendatang</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(users_by_role || {}).map(([role, total]) => (
                                        <span key={role} className={`badge badge-outline capitalize ${ROLE_BADGE[role] || 'badge-ghost'}`}>{role}: {total}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Daftar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Transaksi terbaru */}
                        <div className="card bg-base-100 border border-base-200 shadow-sm lg:col-span-2">
                            <div className="card-body p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold">Transaksi Terbaru</h3>
                                    <Link href={route('admin.transactions.index')} className="text-sm text-primary flex items-center gap-1">
                                        Lihat semua <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr><th>User</th><th>Event</th><th className="text-right">Jumlah</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {recent_transactions.length === 0 && (
                                                <tr><td colSpan={4} className="text-center text-gray-400 py-4">Belum ada transaksi.</td></tr>
                                            )}
                                            {recent_transactions.map((t, i) => (
                                                <tr key={i}>
                                                    <td className="font-medium">{t.user}</td>
                                                    <td className="max-w-[160px] truncate">{t.event}</td>
                                                    <td className="text-right">{formatRupiah(t.subtotal)}</td>
                                                    <td><span className={`badge badge-sm ${TRX_BADGE[t.status] || 'badge-neutral'}`}>{t.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Top event */}
                        <div className="card bg-base-100 border border-base-200 shadow-sm">
                            <div className="card-body p-5">
                                <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Top Event</h3>
                                <div className="space-y-3">
                                    {top_events.length === 0 && <p className="text-sm text-gray-400">Belum ada penjualan.</p>}
                                    {top_events.map((e, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">{e.event}</p>
                                                <p className="text-xs text-gray-500">{e.tickets} tiket • {formatRupiah(e.revenue)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
