import React from 'react';
import Card from '@/Components/ui/Card';
import QuestionBuilder from './QuestionBuilder';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

const Step4_SubmissionQuestions = ({ data, setData, errors }) => {
    // 1. Ambil HANYA field yang bertipe select atau checkbox
    const optionsFields = data.submission_fields.filter(
        (f) => f.type === 'checkbox' || f.type === 'select'
    );

    // 2. Fungsi handle perubahan limit yang lebih dinamis berdasarkan nama field
    const handleRuleChange = (ticketIndex, fieldName, value) => {
        const updatedTickets = [...data.ticket_types];
        
        // Ambil rule yang sudah ada, atau buat object kosong jika belum ada
        const currentRules = updatedTickets[ticketIndex].submission_rules || {};
        
        updatedTickets[ticketIndex].submission_rules = {
            ...currentRules,
            [fieldName]: value === '' ? null : parseInt(value), // Simpan berdasarkan nama field
        };
        
        setData('ticket_types', updatedTickets);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="needs_submission" onChange={(e) => setData("needs_submission", e.target.checked)} className="checkbox" checked={data.needs_submission} />
                    <label htmlFor="needs_submission" className="text-lg font-medium cursor-pointer">Enable Post-Purchase Submissions</label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Enable this if the event is a competition or requires participants to submit files/data after purchasing a ticket.</p>
            </Card>

            {data.needs_submission && (
                <>
                    <Card className="lg:col-span-12 bg-base-100 p-0 shadow-none border-none">
                        <QuestionBuilder
                            title="Submission Fields"
                            description="Define the fields that participants need to fill out or upload for their submission."
                            questions={data.submission_fields}
                            setQuestions={(questions) => setData('submission_fields', questions)}
                            error={errors.submission_fields}
                        />
                    </Card>

                    {/* RENDER LIMIT SETTINGS JIKA ADA FIELD OPTIONS */}
                    {optionsFields.length > 0 && (
                        <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium mt-4 border-l-4 border-primary">
                            <h3 className="text-lg font-semibold mb-2">Aturan Limit Pilihan</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Atur batas maksimal opsi yang bisa dipilih user untuk setiap pertanyaan <b>Checkbox/Select</b> berdasarkan tipe tiket mereka. Kosongkan jika tidak ada batasan.
                            </p>

                            <div className="space-y-6">
                                {data.ticket_types.map((ticket, tIndex) => (
                                    <div key={tIndex} className="bg-gray-50 p-4 rounded-lg border">
                                        <h4 className="text-base font-bold text-primary mb-4 border-b pb-2">
                                            Tiket: {ticket.name || `Tiket ${tIndex + 1}`}
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Looping semua field checkbox/select yang ada */}
                                            {optionsFields.map((field, fIndex) => {
                                                // Pastikan field punya name (dari QuestionBuilder)
                                                const fieldName = field.name || `field_${fIndex}`; 
                                                
                                                return (
                                                    <div key={fieldName} className="flex items-center justify-between bg-white p-3 rounded border">
                                                        <span className="text-sm font-medium">{field.label || 'Pertanyaan Tanpa Label'}</span>
                                                        <div className="flex items-center gap-2">
                                                            <TextInput
                                                                type="number"
                                                                min="1"
                                                                placeholder="Limit"
                                                                value={ticket.submission_rules?.[fieldName] || ''}
                                                                onChange={(e) => handleRuleChange(tIndex, fieldName, e.target.value)}
                                                                className="w-20 text-center"
                                                            />
                                                            <span className="text-xs text-gray-500">opsi</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default Step4_SubmissionQuestions;