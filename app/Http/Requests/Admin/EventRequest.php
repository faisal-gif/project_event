<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Route is already gated by the 'admin' middleware.
        return true;
    }

    /**
     * Normalize comma-separated option strings into arrays before validation.
     */
    protected function prepareForValidation(): void
    {
        $eventFields = $this->input('event_fields', []);
        if (!empty($eventFields)) {
            foreach ($eventFields as $key => $field) {
                if (isset($field['options']) && is_string($field['options'])) {
                    $eventFields[$key]['options'] = array_map('trim', explode(',', $field['options']));
                }
            }
            $this->merge(['event_fields' => $eventFields]);
        }
    }

    public function rules(): array
    {
        // On update the event image is optional (keep the existing one); on create it is required.
        $imageRule = $this->route('event') ? 'nullable|image' : 'required|image';

        return [
            'image' => $imageRule,
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'category_id' => 'required|exists:category_events,id',
            'location_type' => 'required|in:online,offline,hybrid',
            'status' => 'required|in:valid,expired',
            'location_details' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'limit_ticket_user' => 'required|integer|min:1',
            'is_headline' => 'required|boolean',
            'ticket_types' => 'required|array|min:1',
            'ticket_types.*.id' => 'nullable',
            'ticket_types.*.name' => 'required|string|max:255',
            'ticket_types.*.price' => 'required|numeric|min:0',
            'ticket_types.*.quota' => 'required|integer|min:1',
            'ticket_types.*.purchase_date' => 'nullable|date',
            'ticket_types.*.end_purchase_date' => 'nullable|date|after_or_equal:purchase_date',
            'ticket_types.*.description' => 'required|string',
            'ticket_types.*.submission_rules' => 'nullable|array',
            'need_additional_questions' => 'boolean',
            'event_fields' => ['nullable', 'array'],
            'event_fields.*.label' => ['required_with:event_fields', 'string'],
            'event_fields.*.type' => ['required_with:event_fields', 'string', 'in:text,textarea,select,radio,checkbox,date,file,image,url'],
            'event_fields.*.is_required' => ['boolean'],
            'event_fields.*.options' => [
                'required_if:event_fields.*.type,select',
                'required_if:event_fields.*.type,radio',
                'required_if:event_fields.*.type,checkbox',
                'nullable',
                'array'
            ],
            'needs_submission' => 'boolean',
            'submission_fields' => ['nullable', 'array'],
            'submission_fields.*.label' => ['required_with:submission_fields', 'string'],
            'submission_fields.*.type' => ['required_with:submission_fields', 'string'],
            'submission_fields.*.options' => [
                'required_if:submission_fields.*.type,select',
                'required_if:submission_fields.*.type,checkbox',
                'nullable',
                'array'
            ],
            'submission_fields.*.is_required' => ['boolean'],

            // Affiliate
            'is_affiliate_enabled' => 'boolean',
            'affiliate_type' => 'required_if:is_affiliate_enabled,true|in:percentage,fixed|nullable',
            'affiliate_reward' => 'required_if:is_affiliate_enabled,true|numeric|min:0|nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul event tidak boleh kosong.',
            'title.max' => 'Judul event terlalu panjang, maksimal 255 karakter.',
            'status.required' => 'Status event harus dipilih.',
            'status.in' => 'Pilihan status tidak valid.',
            'description.required' => 'Deskripsi event wajib diisi.',
            'category_id.required' => 'Silakan pilih kategori event.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'end_date.after_or_equal' => 'Tanggal berakhir tidak boleh sebelum tanggal mulai.',
            'ticket_types.min' => 'Anda harus menambahkan minimal 1 jenis tiket.',
            'ticket_types.*.name.required' => 'Nama tiket wajib diisi.',
            'ticket_types.*.price.numeric' => 'Harga tiket harus berupa angka.',
            'ticket_types.*.quota.min' => 'Kuota tiket minimal adalah 1.',
            'ticket_types.*.end_purchase_date.after_or_equal' => 'Tanggal akhir penjualan tiket tidak boleh sebelum tanggal mulainya.',
            'event_fields.*.label.required_with' => 'Label pertanyaan tambahan wajib diisi.',
            'event_fields.*.type.in' => 'Tipe pertanyaan tambahan tidak valid.',
            'event_fields.*.options.required_if' => 'Opsi jawaban wajib diisi untuk tipe select, radio, atau checkbox.',

            // Affiliate
            'is_affiliate_enabled.boolean' => 'Pilihan program afiliasi harus berupa boolean.',
            'affiliate_type.required_if' => 'Tipe komisi wajib diisi jika program afiliasi diaktifkan.',
            'affiliate_type.in' => 'Tipe komisi tidak valid.',
            'affiliate_reward.required_if' => 'Besaran komisi wajib diisi jika program afiliasi diaktifkan.',
            'affiliate_reward.numeric' => 'Besaran komisi harus berupa angka.',
            'affiliate_reward.min' => 'Besaran komisi minimal adalah 0.',
        ];
    }
}
