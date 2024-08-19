interface ButtonProps {
  label: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  user: 'counselor' | 'client' | 'common';
}
const Button = ({ label, onClick, user }: ButtonProps) => {
  const userClasses = {
    counselor: 'bg-blue-200 hover:bg-blue-300',
    client: 'bg-orange-200 hover:bg-orange-300 transition',
    common: 'bg-gray-200 hover:bg-gray-300',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full w-20 h-7 text-sm font-bold ${userClasses[user]}`}
    >
      {label}
    </button>
  );
};

export default Button;
