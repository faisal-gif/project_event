import React from 'react';
import Card from '@/Components/ui/Card';
import { FileText } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const QuestionBuilder = ({ title, description, questions, setQuestions, error }) => {
    const addQuestion = () => {
        setQuestions([...questions, { label: '', name: '', type: 'text', is_required: false, options: '' }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        if (field === 'label') {
            newQuestions[index]['name'] = value.toLowerCase().replace(/\s+/g, '_');
        }
        setQuestions(newQuestions);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    return (
        <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><FileText /> {title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
                {questions.map((q, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="font-medium">Question {index + 1}</p>
                            <button type="button" onClick={() => removeQuestion(index)} className="btn btn-sm btn-error btn-outline">Remove</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Label" />
                                <TextInput value={q.label} onChange={(e) => handleQuestionChange(index, 'label', e.target.value)} className="w-full" />
                            </div>
                            <div>
                                <InputLabel value="Type" />
                                <select value={q.type} onChange={(e) => handleQuestionChange(index, 'type', e.target.value)} className="select select-bordered w-full">
                                    <option value="text">Text</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="file">File</option>
                                    <option value="image">Image</option>
                                    <option value="select">Select</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="url">URL</option>
                                </select>
                            </div>
                        </div>
                        {(q.type === 'select' || q.type === 'checkbox') && (
                            <div>
                                <InputLabel value="Options (comma-separated)" />
                                <TextInput value={q.options} onChange={(e) => handleQuestionChange(index, 'options', e.target.value)} className="w-full" />
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={q.is_required} onChange={(e) => handleQuestionChange(index, 'is_required', e.target.checked)} className="checkbox checkbox-sm" />
                            <label>Required</label>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addQuestion} className="btn btn-soft btn-primary">Add Question</button>
                <InputError message={error} />
            </div>
        </Card>
    );
};

export default QuestionBuilder;
