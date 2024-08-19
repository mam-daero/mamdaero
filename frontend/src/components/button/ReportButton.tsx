import { RiAlarmWarningLine } from 'react-icons/ri';

interface ButtonProps {
  onClick: () => void;
}
const ReportButton = ({ onClick }: ButtonProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="rounded-md bg-gray-200 hover:bg-gray-300 whitespace-nowrap"
      >
        <div className="flex items-center px-3 py-1 gap-2">
          <RiAlarmWarningLine size={18} />
          <span className="font-bold text-sm">신고하기</span>
        </div>
      </button>
    </div>
  );
};

export default ReportButton;
