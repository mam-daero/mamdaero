import React from 'react';

interface ProgressBarProps {
  currentStep: 'input' | 'info' | 'complete';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { label: '상담사 인증', key: 'input' },
    { label: '상담사 정보 입력', key: 'info' },
    { label: '가입 완료', key: 'complete' },
  ];

  const getStepClassName = (stepKey: string) => {
    if (currentStep === stepKey) return 'step step-secondary font-bold w-40';
    if (
      steps.findIndex(step => step.key === stepKey) <
      steps.findIndex(step => step.key === currentStep)
    ) {
      return 'step step-secondary font-bold w-40';
    }
    return 'step font-bold w-40';
  };

  return (
    <div className="mb-8">
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
