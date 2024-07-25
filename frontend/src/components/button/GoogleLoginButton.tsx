import GoogleLogo from '@/assets/GoogleLogo.png';

const GoogleLoginButton = () => {
  const Click = () => {
    alert('GoogleButton');
  };
  return (
    <button
      onClick={Click}
      className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
    >
      <img src={GoogleLogo} alt="Google Logo" className="w-6 h-6" />
    </button>
  );
};

export default GoogleLoginButton;
