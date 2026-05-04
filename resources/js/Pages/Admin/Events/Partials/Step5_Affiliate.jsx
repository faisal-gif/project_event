import React from 'react';
import Card from '@/Components/ui/Card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Share2 } from 'lucide-react';

const Step5_Affiliate = ({ data, setData, errors }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-12 bg-base-100 p-6 shadow-medium">
                <div className="flex items-center space-x-2 mb-4">
                    <input 
                        type="checkbox" 
                        id="is_affiliate_enabled" 
                        onChange={(e) => setData("is_affiliate_enabled", e.target.checked)} 
                        className="checkbox checkbox-primary" 
                        checked={data.is_affiliate_enabled} 
                    />
                    <label htmlFor="is_affiliate_enabled" className="text-lg font-bold cursor-pointer flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-primary"/> Aktifkan Program Afiliasi (Komisi)
                    </label>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Beri komisi kepada user lain yang berhasil menjualkan tiket event Anda melalui link referral mereka.
                </p>

                {data.is_affiliate_enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <InputLabel value="Tipe Komisi" />
                            <select 
                                value={data.affiliate_type} 
                                onChange={(e) => setData('affiliate_type', e.target.value)} 
                                className="select select-bordered w-full mt-1"
                            >
                                <option value="percentage">Persentase dari Harga Tiket (%)</option>
                                <option value="fixed">Nominal Pasti (Rp)</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Besaran Komisi" />
                            <div className="flex items-center gap-2 mt-1">
                                {data.affiliate_type === 'fixed' && <span className="text-gray-500 font-medium font-mono">Rp</span>}
                                <TextInput 
                                    type="number" 
                                    min="1" 
                                    value={data.affiliate_reward} 
                                    onChange={(e) => setData('affiliate_reward', e.target.value)} 
                                    placeholder={data.affiliate_type === 'percentage' ? "Contoh: 10" : "Contoh: 15000"} 
                                    className="w-full" 
                                />
                                {data.affiliate_type === 'percentage' && <span className="text-gray-500 font-medium font-mono">%</span>}
                            </div>
                            <InputError message={errors.affiliate_reward} className="mt-2" />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Step5_Affiliate;