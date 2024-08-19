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
    if (currentStep === stepKey) return 'step step-secondary';
    if (
      steps.findIndex(step => step.key === stepKey) <
      steps.findIndex(step => step.key === currentStep)
    ) {
      return 'step step-secondary';
    }
    return 'step';
  };

  return (
    <div className="mb-8 text-gray-600">
      <ul className="steps steps-horizontal ">
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
