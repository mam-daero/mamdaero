import { FaEdit } from 'react-icons/fa';

interface ButtonProps {
  color: 'blue' | 'orange' | 'gray';
  onClick: () => void;
}

const EditButton = ({ color, onClick }: ButtonProps) => {
  const colorClasses = {
    blue: 'bg-blue-200 hover:bg-blue-300',
    orange: 'bg-orange-200 hover:bg-orange-300',
    gray: 'bg-gray-200 hover:bg-gray-300',
  };
  return (
    <div>
      <button onClick={onClick} className={`rounded-md ${colorClasses[color]}`}>
        <div className="flex font-bold text-sm items-center my-1 mx-3 gap-2">
          <FaEdit size={18} />
          수정하기
        </div>
      </button>
    </div>
  );
};

export default EditButton;
