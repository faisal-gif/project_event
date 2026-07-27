import React from 'react';
import { CheckCircle } from 'lucide-react';

const Stepper = ({ steps, currentStep, maxStep = currentStep, onStepClick }) => {
    return (
        <div className="mb-8">
            <p className="text-center text-sm font-medium text-primary mb-1">
                Langkah {currentStep} dari {steps.length}
            </p>
            {/* On mobile the per-step labels are hidden, so surface the active step name here. */}
            <p className="text-center text-base font-semibold mb-4 sm:hidden">
                {steps[currentStep - 1]}
            </p>
            <div className="flex items-center justify-center">
                <div className="flex items-center">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = currentStep > stepNumber;
                        const isActive = currentStep === stepNumber;
                        // Reachable steps (already validated) can be clicked to jump back/forward.
                        const isClickable = onStepClick && stepNumber <= maxStep && !isActive;

                        return (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => isClickable && onStepClick(stepNumber)}
                                        disabled={!isClickable}
                                        title={isClickable ? `Ke langkah: ${step}` : undefined}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold transition ${
                                            isCompleted ? 'bg-primary text-primary-content' :
                                            isActive ? 'bg-primary/20 text-primary border-2 border-primary' :
                                            'bg-base-200 text-base-content'
                                        } ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-primary/40' : 'cursor-default'}`}
                                    >
                                        {isCompleted ? <CheckCircle size={16} /> : stepNumber}
                                    </button>
                                    <p className={`mt-2 text-xs text-center font-medium hidden sm:block ${isActive ? 'text-primary' : 'text-base-content'}`}>
                                        {step}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-auto border-t-2 mx-2 sm:mx-4 ${isCompleted ? 'border-primary' : 'border-base-300'}`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Stepper;
