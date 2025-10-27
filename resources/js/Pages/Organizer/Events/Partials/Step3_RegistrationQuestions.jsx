import React from 'react';
import Card from '@/Components/ui/Card';
import QuestionBuilder from './QuestionBuilder';

const Step3_RegistrationQuestions = ({ data, setData, errors }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="need_additional_questions" onChange={(e) => setData("need_additional_questions", e.target.checked)} className="checkbox" checked={data.need_additional_questions} />
                    <label htmlFor="need_additional_questions" className="text-lg font-medium cursor-pointer">Enable Additional Questions for Registration</label>
                </div>
                <p className="text-sm text-gray-500 mt-2">If enabled, users must answer these questions before they can complete a ticket purchase.</p>
            </Card>

            {data.need_additional_questions && (
                <QuestionBuilder
                    title="Registration Questions"
                    description="These questions will be asked during the ticket registration process."
                    questions={data.event_fields}
                    setQuestions={(questions) => setData('event_fields', questions)}
                    error={errors.event_fields}
                />
            )}
        </div>
    );
};

export default Step3_RegistrationQuestions;
