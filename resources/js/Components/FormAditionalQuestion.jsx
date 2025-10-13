import { router, useForm } from '@inertiajs/react'
import React from 'react'

function FormAditionalQuestion({ ticket }) {

    const additional = ticket?.ticket_additional_questions ?? {}

    const { data: editData, setData: setEditData, processing, errors } = useForm({
        url: additional.url || '',
        prompt: additional.prompt || '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        router.post(route('ticket.additional', ticket),
            {
                ...editData,
            },
            {
                preserveScroll: true,
            })
    }
    return (
        <form onSubmit={handleSubmit} className="py-6">
            <div>
                <h2 className='font-semibold text-lg'>
                    Form Karya
                </h2>
            </div>
            <div className="space-y-2 py-2">
                <label htmlFor="url_karya" className="text-sm text-black/50">Url</label>
                <input
                    type='url'
                    id="url_karya"
                    placeholder="Isi Url Karya anda disini"
                    value={editData.url}
                    onChange={(e) => setEditData('url', e.target.value)}
                    className="input border-0 bg-secondary/50 focus:bg-white w-full"

                />
                {/* {errors.location_details && <div className="text-red-500 text-sm font-semibold mt-2">{errors.location_details}</div>} */}
            </div>
            <div className="space-y-2 py-2">
                <label htmlFor="promptDetail" className="text-sm text-black/50">Prompt</label>
                <textarea
                    id="locationDetail"
                    placeholder="Isi Prompt karya anda disini"
                    className="textarea border-0 bg-secondary/50 focus:bg-white w-full"
                    value={editData.prompt}
                    onChange={(e) => setEditData('prompt', e.target.value)}
                />
                {/* {errors.location_details && <div className="text-red-500 text-sm font-semibold mt-2">{errors.location_details}</div>} */}
            </div>
            <div className="space-y-2 py-2 flex justify-end">
                <button type='submit' className='btn btn-sm btn-primary'>
                    Simpan
                </button>
            </div>
        </form>
    )
}

export default FormAditionalQuestion