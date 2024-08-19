import React from 'react';

interface ProgressBarProps {
  currentStep: 'input' | 'complete';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { label: '정보 입력', key: 'input' },
    { label: '가입 완료', key: 'complete' },
  ];

  const getStepClassName = (stepKey: string) => {
    if (currentStep === stepKey) return 'step step-primary w-36 font-bold';
    if (
      steps.findIndex(step => step.key === stepKey) <
      steps.findIndex(step => step.key === currentStep)
    ) {
      return 'step step-primary font-bold w-36';
    }
    return 'step font-bold w-36';
  };

  return (
    <div className="mb-3">
      <ul className="steps steps-horizontal text-gray-600">
        {steps.map(step => (
          <li key={step.key} className={getStepClassName(step.key)}>
            {step.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressBar;
