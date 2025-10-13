import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isActive = currentStep === stepNumber;

                    return (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${
                                        isCompleted ? 'bg-primary text-primary-content' :
                                        isActive ? 'bg-primary/20 text-primary border-2 border-primary' :
                                        'bg-base-200 text-base-content'
                                    }`}
                                >
                                    {isCompleted ? <CheckCircle size={24} /> : stepNumber}
                                </div>
                                <p className={`mt-2 text-sm text-center font-medium ${isActive ? 'text-primary' : 'text-base-content'}`}>
                                    {step}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-auto border-t-2 mx-4 ${isCompleted ? 'border-primary' : 'border-base-300'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
