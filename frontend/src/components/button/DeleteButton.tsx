import { RiDeleteBin6Line } from 'react-icons/ri';

interface ButtonProps {
  onClick: () => void;
}
const DeleteButton = ({ onClick }: ButtonProps) => {
  return (
    <div>
      <button onClick={onClick} className="rounded-md bg-gray-200 hover:bg-gray-300">
        <div className="flex font-bold text-sm items-center my-1 mx-3 gap-2">
          <RiDeleteBin6Line size={18} />
          삭제하기
        </div>
      </button>
    </div>
  );
};

export default DeleteButton;
