import KakaoLogo from '@/assets/KakaoLogo.png';

const KakaoLoginButton = () => {
  const Click = () => {
    alert('KakaoButton');
  };
  return (
    <button
      onClick={Click}
      style={{ backgroundColor: '#FEE500' }}
      className="flex items-center justify-center w-12 h-12 rounded-full shadow-md"
    >
      <img src={KakaoLogo} alt="Kakao Logo" className="w-6 h-6" />
    </button>
  );
};

export default KakaoLoginButton;
