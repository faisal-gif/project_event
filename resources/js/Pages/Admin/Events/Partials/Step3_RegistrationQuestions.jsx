import React from 'react';
import Card from '@/Components/ui/Card';
import QuestionBuilder from './QuestionBuilder';

const Step3_RegistrationQuestions = ({ data, setData, errors }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="need_additional_questions" onChange={(e) => setData("need_additional_questions", e.target.checked)} className="checkbox" checked={data.need_additional_questions} />
                    <label htmlFor="need_additional_questions" className="text-lg font-medium cursor-pointer">Aktifkan Pertanyaan Tambahan untuk Registrasi</label>
                </div>
                <p className="text-sm text-base-content/60 mt-2">Jika diaktifkan, peserta wajib menjawab pertanyaan ini sebelum menyelesaikan pembelian tiket.</p>
            </Card>

            {data.need_additional_questions && (
                <QuestionBuilder
                    title="Pertanyaan Registrasi"
                    description="Pertanyaan ini akan ditanyakan saat proses registrasi tiket."
                    questions={data.event_fields}
                    setQuestions={(questions) => setData('event_fields', questions)}
                    error={errors.event_fields}
                />
            )}
        </div>
    );
};

export default Step3_RegistrationQuestions;
