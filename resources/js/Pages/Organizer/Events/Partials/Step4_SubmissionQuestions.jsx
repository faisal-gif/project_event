import React from 'react';
import Card from '@/Components/ui/Card';
import QuestionBuilder from './QuestionBuilder';

const Step4_SubmissionQuestions = ({ data, setData, errors }) => {
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
                 <QuestionBuilder
                    title="Submission Fields"
                    description="Define the fields that participants need to fill out or upload for their submission."
                    questions={data.submission_fields}
                    setQuestions={(questions) => setData('submission_fields', questions)}
                    error={errors.submission_fields}
                />
            )}
        </div>
    );
};

export default Step4_SubmissionQuestions;
