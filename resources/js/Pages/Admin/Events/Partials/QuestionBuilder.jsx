import React from 'react';
import Card from '@/Components/ui/Card';
import { FileText, Plus, Trash2 } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const QuestionBuilder = ({ title, description, questions, setQuestions, error }) => {
    const addQuestion = () => {
        // Ubah default options menjadi array kosong
        setQuestions([...questions, { label: '', name: '', type: 'text', is_required: false, options: [] }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        
        // Jika tipe diubah menjadi select/checkbox dan options bukan array, inisialisasi dengan 1 array kosong
        if (field === 'type' && (value === 'select' || value === 'checkbox')) {
            if (!Array.isArray(newQuestions[index].options) || newQuestions[index].options.length === 0) {
                newQuestions[index].options = ['']; 
            }
        }

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

    // --- FUNGSI BARU UNTUK HANDLE OPTIONS DINAMIS ---
    const addOption = (questionIndex) => {
        const newQuestions = [...questions];
        if (!Array.isArray(newQuestions[questionIndex].options)) {
            newQuestions[questionIndex].options = [];
        }
        newQuestions[questionIndex].options.push('');
        setQuestions(newQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const removeOption = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
        setQuestions(newQuestions);
    };
    // ------------------------------------------------

    return (
        <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2"><FileText /> {title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
                
                {questions.map((q, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4 bg-white">
                        <div className="flex justify-between items-center border-b pb-2">
                            <p className="font-medium text-primary">Question {index + 1}</p>
                            <button type="button" onClick={() => removeQuestion(index)} className="btn btn-sm btn-error btn-ghost">
                                <Trash2 className="w-4 h-4 mr-1" /> Remove
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Label / Pertanyaan" />
                                <TextInput 
                                    value={q.label} 
                                    placeholder="Contoh: Ukuran Kaos"
                                    onChange={(e) => handleQuestionChange(index, 'label', e.target.value)} 
                                    className="w-full mt-1" 
                                />
                            </div>
                            <div>
                                <InputLabel value="Type" />
                                <select value={q.type} onChange={(e) => handleQuestionChange(index, 'type', e.target.value)} className="select select-bordered w-full mt-1">
                                    <option value="text">Text</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="file">File</option>
                                    <option value="image">Image</option>
                                    <option value="select">Select (Dropdown)</option>
                                    <option value="checkbox">Checkbox (Multiple Choice)</option>
                                    <option value="url">URL</option>
                                </select>
                            </div>
                        </div>

                        {/* RENDER DYNAMIC OPTIONS JIKA TIPE SELECT / CHECKBOX */}
                        {(q.type === 'select' || q.type === 'checkbox') && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                                <InputLabel value="Pilihan Jawaban (Options)" className="mb-2 font-semibold" />
                                
                                <div className="space-y-2">
                                    {(Array.isArray(q.options) ? q.options : []).map((opt, optIndex) => (
                                        <div key={optIndex} className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <TextInput 
                                                    value={opt} 
                                                    onChange={(e) => updateOption(index, optIndex, e.target.value)} 
                                                    className="w-full" 
                                                    placeholder={`Opsi ${optIndex + 1} (Misal: XL)`}
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeOption(index, optIndex)} 
                                                className="btn btn-square btn-sm btn-ghost text-error"
                                                disabled={(q.options || []).length <= 1} // Jangan izinkan hapus jika sisa 1
                                                title="Hapus Opsi"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <button 
                                    type="button" 
                                    onClick={() => addOption(index)} 
                                    className="btn btn-sm btn-outline btn-primary mt-3 font-normal"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Tambah Opsi Lainnya
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id={`required-${index}`}
                                checked={q.is_required} 
                                onChange={(e) => handleQuestionChange(index, 'is_required', e.target.checked)} 
                                className="checkbox checkbox-sm checkbox-primary" 
                            />
                            <label htmlFor={`required-${index}`} className="cursor-pointer text-sm font-medium">Wajib Diisi (Required)</label>
                        </div>
                    </div>
                ))}
                
                <div className="pt-2">
                    <button type="button" onClick={addQuestion} className="btn btn-primary w-full sm:w-auto">
                        <Plus className="w-5 h-5 mr-1" /> Add New Question
                    </button>
                </div>
                
                {/* Tampilkan error global untuk field ini jika ada */}
                {error && typeof error === 'string' && <InputError message={error} className="mt-2" />}
            </div>
        </Card>
    );
};

export default QuestionBuilder;