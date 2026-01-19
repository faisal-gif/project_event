import FormAditionalQuestion from '@/Components/FormAditionalQuestion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react'
import { toast } from "sonner";
import TicketQr from './Partials/TicketQr';
import TicketForm from './Partials/TicketForm';
import Card from '@/Components/ui/Card';

function Show({ ticket }) {

    if (!ticket) {
        return (
            <div className="min-h-screen bg-base-100">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Tiket Tidak Ditemukan</h1>
                    <Link href={route('events.user.index')} className="btn btn-primary">
                        Kembali ke Daftar Event
                    </Link>
                </div>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'unused':
                return <div className="badge badge-success">VALID</div>;
            case 'used':
                return <div className="badge badge-warning">DIGUNAKAN</div>;
            case 'expired':
                return <div className="badge badge-error">KADALUARSA</div>;
            default:
                return <div className="badge badge-ghost">UNKNOWN</div>;
        }
    };

    const qrUrl = `/storage/${ticket.qr_image}`;
    const logoUrl = "/logo-times-event.png";

    const downloadQRCode = async () => {
        try {
            const loadImage = (src) =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = () => reject("Gagal load gambar: " + src);
                    img.src = src;
                });

            // Load QR + Logo bersamaan
            const qrImg = await loadImage(qrUrl);
            const logoImg = await loadImage(logoUrl);

            // Buat canvas
            const canvas = document.createElement("canvas");
            canvas.width = 420;
            canvas.height = 900;
            const ctx = canvas.getContext("2d");

            /* ============================
               BACKGROUND
            ============================ */
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "#f8fafc");
            gradient.addColorStop(1, "#e2e8f0");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Outer Card
            ctx.fillStyle = "white";
            ctx.roundRect(20, 20, 380, 860, 22);
            ctx.fill();

            /* ============================
               LOGO
            ============================ */
            ctx.drawImage(logoImg, 160, 40, 100, 100);

            /* ============================
              TITLE SECTION
            ============================ */
            ctx.fillStyle = "#0f172a";
            ctx.font = "bold 24px Inter";
            ctx.textAlign = "center";
            ctx.fillText("E - TICKET", 210, 170);

            ctx.fillStyle = "#475569";
            ctx.font = "16px Inter";
            ctx.fillText(ticket.event.title, 210, 195);

            /* ============================
               QR CODE BOX
            ============================ */
            ctx.fillStyle = "#f1f5f9";
            ctx.roundRect(60, 230, 300, 300, 16);
            ctx.fill();

            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 3;
            ctx.roundRect(60, 230, 300, 300, 16);
            ctx.stroke();

            ctx.drawImage(qrImg, 85, 255, 250, 250);

            /* ============================
               PERFORATION LINE (sobekan)
            ============================ */
            ctx.setLineDash([10, 10]);
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(40, 580);
            ctx.lineTo(380, 580);
            ctx.stroke();
            ctx.setLineDash([]);

            /* ============================
               TICKET DETAILS BOX
            ============================ */
            ctx.fillStyle = "#f8fafc";
            ctx.roundRect(40, 620, 340, 240, 16);
            ctx.fill();

            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 1.5;
            ctx.roundRect(40, 620, 340, 240, 16);
            ctx.stroke();

            ctx.textAlign = "left";
            ctx.fillStyle = "#0f172a";
            ctx.font = "bold 16px Inter";
            ctx.fillText("Detail Tiket", 55, 650);

            ctx.fillStyle = "#475569";
            ctx.font = "14px Inter";

            let y = 680;
            const lineGap = 32;

            const details = [
                ["Nama Pemegang", ticket.user.name],
                ["Email", ticket.user.email],
                ["Tanggal Pembelian", formatDate(ticket.transaction.paid_at)],
                ["Harga Satuan", formatPrice(ticket.transaction.ticket_type.price)],
                ["Quantity", ticket.quantity],
                ["Total", formatPrice(ticket.transaction.subtotal)],
            ];

            details.forEach(([label, value]) => {
                ctx.fillStyle = "#64748b";
                ctx.font = "13px Inter";
                ctx.fillText(label, 55, y);

                ctx.fillStyle = "#0f172a";
                ctx.font = "14px Inter";
                ctx.fillText(value, 200, y);

                y += lineGap;
            });


            const link = document.createElement("a");
            link.download = `e-ticket-${ticket.user.name.replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            toast.success("E-Ticket berhasil diunduh!");
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat gambar QR atau Logo!");
        }
    };



    return (
        <GuestLayout>
            <Head title="Detail Tiket" />
            <div className="container mx-auto px-4 max-w-2xl py-8">
                <div className="flex items-center justify-between mb-6">
                    <Link href={route('tickets.index')} className='link link-secondary'>
                        <ArrowLeft className="h-4 w-4 mr-2 inline" />
                        Kembali
                    </Link>
                    {/* <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button> */}
                </div>

                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Important Notes */}
                    <Card className="bg-base-200 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Penting untuk Diperhatikan
                        </h4>
                        {ticket.event.event_submission_fields && ticket.event.event_submission_fields.length > 0 ? (
                            <ul className="text-sm space-y-1 text-base-content/70">
                                <li>• Pastikan Anda mengisi semua data yang diperlukan pada form submission.</li>
                                <li>• Setelah data dikirim, status tiket akan berubah menjadi "Digunakan" dan tidak dapat diubah.</li>
                                <li>• Pengumuman lebih lanjut akan diinformasikan melalui sistem atau media sosial kami.</li>
                            </ul>
                        ) : (
                            <ul className="text-sm space-y-1 text-base-content/70">
                                <li>• Simpan tiket ini dengan baik sampai hari H.</li>
                                <li>• QR Code hanya dapat digunakan sekali untuk check-in.</li>
                                <li>• Bawa identitas diri yang sesuai dengan nama pemegang tiket.</li>
                            </ul>
                        )}

                    </Card>
                    {ticket.event.event_submission_fields && ticket.event.event_submission_fields.length > 0 ?
                        (
                            <TicketForm data={ticket} />
                        ) : (
                            <TicketQr data={ticket} />
                        )}
                </div>
            </div>
        </GuestLayout>

    )
}

export default Show