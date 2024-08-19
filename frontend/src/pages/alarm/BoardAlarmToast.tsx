import React from 'react';
import toast, { Toast } from 'react-hot-toast';

interface AlarmToastProps {
  t: Toast;
  comment: {
    message: string;
    content: string;
    createdAt: string;
  };
}

const formatDate = (isoDateString: string) => {
  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Intl.DateTimeFormat('ko-KR', options).format(date);
};

const AlarmToast: React.FC<AlarmToastProps> = ({ t, comment }) => {
  const formattedDate = formatDate(comment.createdAt);

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="mt-1 text-sm text-gray-500">{comment.message}</p>
            <p className="mt-1 text-sm text-gray-500 font-bold">{comment.content}</p>
            <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlarmToast;
