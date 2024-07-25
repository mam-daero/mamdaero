import GoogleLogo from '@/assets/GoogleLogo.png';

const GoogleLoginButton = () => {
  const Click = () => {
    alert('GoogleButton');
  };
  return (
    <button
      onClick={Click}
      className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
    >
      <img src={GoogleLogo} alt="Google Logo" className="w-5 h-5" />
    </button>
  );
};

export default GoogleLoginButton;
