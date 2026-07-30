import React, { useMemo, useEffect } from 'react';
import Card from '@/Components/ui/Card';
import SecondaryButton from '@/Components/SecondaryButton';
import { Pencil, CheckCircle2, XCircle } from 'lucide-react';
import { formatRupiah, formatDateLong, formatTime } from '@/Utils/formatter';

const locationLabels = { online: 'Online', offline: 'Offline (Tatap Muka)', hybrid: 'Hybrid' };

const Row = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-1.5">
        <span className="text-sm text-base-content/60 sm:w-40 shrink-0">{label}</span>
        <span className="text-sm font-medium text-base-content break-words">{children || '-'}</span>
    </div>
);

const SectionHeader = ({ title, onEdit }) => (
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {onEdit && (
            <SecondaryButton type="button" onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-1" /> Ubah
            </SecondaryButton>
        )}
    </div>
);

const Flag = ({ on }) => on
    ? <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" /> Aktif</span>
    : <span className="inline-flex items-center gap-1 text-base-content/50"><XCircle className="w-4 h-4" /> Nonaktif</span>;

const EventReview = ({ data, category, onEdit, existingImageUrl = null }) => {
    const objectUrl = useMemo(
        () => (data.image instanceof File ? URL.createObjectURL(data.image) : null),
        [data.image]
    );
    useEffect(() => () => objectUrl && URL.revokeObjectURL(objectUrl), [objectUrl]);
    const imageUrl = objectUrl || existingImageUrl;

    const categoryName = category?.find((c) => c.id === data.category_id)?.name;

    return (
        <div className="space-y-6">
            <p className="text-sm text-base-content/60">
                Periksa kembali detail event Anda. Klik <b>Ubah</b> untuk memperbaiki bagian tertentu, lalu tekan <b>Buat Event</b> bila sudah benar.
            </p>

            {/* Step 1 - Detail Event */}
            <Card className="bg-base-100 p-6 shadow-medium">
                <SectionHeader title="Detail Event" onEdit={() => onEdit(1)} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        {imageUrl
                            ? <img src={imageUrl} alt="Thumbnail" className="w-full aspect-[3/4] object-cover rounded-lg border" />
                            : <div className="w-full aspect-[3/4] rounded-lg border border-dashed flex items-center justify-center text-sm text-base-content/50">Tanpa thumbnail</div>}
                    </div>
                    <div className="md:col-span-2 divide-y divide-gray-100">
                        <Row label="Judul">{data.title}</Row>
                        <Row label="Kategori">{categoryName}</Row>
                        {data.status !== undefined && (
                            <Row label="Status">{data.status === 'valid' ? 'Valid (Aktif & Terlihat)' : 'Expired (Draf / Tersembunyi)'}</Row>
                        )}
                        <Row label="Headline"><Flag on={data.is_headline} /></Row>
                        <Row label="Mulai">{data.start_date ? `${formatDateLong(data.start_date)} • ${formatTime(data.start_date)}` : '-'}</Row>
                        <Row label="Berakhir">{data.end_date ? `${formatDateLong(data.end_date)} • ${formatTime(data.end_date)}` : '-'}</Row>
                        <Row label="Tipe Lokasi">{locationLabels[data.location_type] || data.location_type}</Row>
                        <Row label="Detail Lokasi">{data.location_details}</Row>
                    </div>
                </div>
                {data.description && (
                    <div className="mt-4">
                        <p className="text-sm text-base-content/60 mb-1">Deskripsi</p>
                        <div className="prose prose-sm max-w-none border rounded-lg p-3" dangerouslySetInnerHTML={{ __html: data.description }} />
                    </div>
                )}
                {data.requirements && (
                    <div className="mt-4">
                        <p className="text-sm text-base-content/60 mb-1">Syarat & Ketentuan</p>
                        <div className="prose prose-sm max-w-none border rounded-lg p-3" dangerouslySetInnerHTML={{ __html: data.requirements }} />
                    </div>
                )}
            </Card>

            {/* Step 2 - Tiket */}
            <Card className="bg-base-100 p-6 shadow-medium">
                <SectionHeader title="Detail Tiket" onEdit={() => onEdit(2)} />
                <div className="space-y-3">
                    {data.ticket_types?.map((t, i) => (
                        <div key={i} className="border rounded-lg p-4">
                            <p className="font-semibold">{t.name || `Tiket #${i + 1}`} — {Number(t.price) > 0 ? formatRupiah(t.price) : 'Gratis'}</p>
                            <p className="text-sm text-base-content/70">Kuota: {t.quota || '-'} • Pembelian: {t.purchase_date ? formatDateLong(t.purchase_date) : '-'} s/d {t.end_purchase_date ? formatDateLong(t.end_purchase_date) : '-'}</p>
                        </div>
                    ))}
                </div>
                <Row label="Maks. tiket / pengguna">{data.limit_ticket_user}</Row>
            </Card>

            {/* Step 3 - Registrasi */}
            <Card className="bg-base-100 p-6 shadow-medium">
                <SectionHeader title="Pertanyaan Registrasi" onEdit={() => onEdit(3)} />
                <Row label="Pertanyaan tambahan"><Flag on={data.need_additional_questions} /></Row>
                {data.need_additional_questions && <Row label="Jumlah pertanyaan">{data.event_fields?.length || 0}</Row>}
            </Card>

            {/* Step 4 - Submisi */}
            <Card className="bg-base-100 p-6 shadow-medium">
                <SectionHeader title="Pertanyaan Submisi" onEdit={() => onEdit(4)} />
                <Row label="Submisi pasca-pembelian"><Flag on={data.needs_submission} /></Row>
                {data.needs_submission && <Row label="Jumlah field">{data.submission_fields?.length || 0}</Row>}
            </Card>

            {/* Step 5 - Afiliasi (admin only) */}
            {data.is_affiliate_enabled !== undefined && (
                <Card className="bg-base-100 p-6 shadow-medium">
                    <SectionHeader title="Program Afiliasi" onEdit={() => onEdit(5)} />
                    <Row label="Program afiliasi"><Flag on={data.is_affiliate_enabled} /></Row>
                    {data.is_affiliate_enabled && (
                        <Row label="Komisi">
                            {data.affiliate_type === 'percentage' ? `${data.affiliate_reward || 0}%` : formatRupiah(data.affiliate_reward)}
                        </Row>
                    )}
                </Card>
            )}
        </div>
    );
};

export default EventReview;
