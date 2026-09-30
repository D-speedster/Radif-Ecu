import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; description: string }[];
}

export default function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={stepNumber} className="flex flex-col items-center flex-1">
                {/* دایره شماره */}
                <div
                  className="relative z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: isCompleted || isCurrent ? '#252525' : '#F5F5F5',
                    borderColor: isCompleted || isCurrent ? '#252525' : '#CFCFCF',
                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#FFFFFF' }} />
                  ) : (
                    <span
                      className="text-sm md:text-base font-bold"
                      style={{
                        color: isCurrent ? '#FFFFFF' : '#7D7D7D'
                      }}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>

                {/* عنوان و توضیح */}
                <div className="mt-2 text-center hidden md:block">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: isCurrent ? '#252525' : '#7D7D7D'
                    }}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#7D7D7D' }}>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* خط اتصال */}
        <div className="absolute top-5 md:top-6 right-0 left-0 h-0.5 -z-10" style={{ backgroundColor: '#E0E0E0' }}>
          <div
            className="h-full transition-all duration-500"
            style={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              backgroundColor: '#252525'
            }}
          ></div>
        </div>
      </div>

      {/* عنوان موبایل */}
      <div className="md:hidden text-center mt-4">
        <p className="font-medium" style={{ color: '#252525' }}>{steps[currentStep - 1].title}</p>
        <p className="text-sm" style={{ color: '#545454' }}>{steps[currentStep - 1].description}</p>
      </div>
    </div>
  );
}
