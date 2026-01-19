import FormAditionalQuestion from '@/Components/FormAditionalQuestion'
import Card from '@/Components/ui/Card'
import React from 'react'

function TicketForm({ data }) {
    return (
        <Card className="overflow-hidden bg-base-100 shadow-2xl p-8">
            {/* Conditional Rendering: Submission Form or QR Code */}
            {
                data.status === 'unused' ? (
                    <FormAditionalQuestion ticket={data} fields={data.event.event_submission_fields} />
                ) : (
                    <div className="text-center p-6 bg-base-200 rounded-lg flex flex-col items-center justify-center h-full">
                        <h3 className="text-xl font-semibold mb-4">Submission Selesai</h3>
                        <p className="text-base-content/70">
                            Anda telah menyelesaikan submission untuk event ini. Terima kasih.
                        </p>
                    </div>
                )
            }
        </Card>
    )
}

export default TicketForm