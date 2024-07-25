import KakaoLogo from '@/assets/KakaoLogo.png';

const KakaoLoginButton = () => {
  const Click = () => {
    alert('KakaoButton');
  };
  return (
    <button
      onClick={Click}
      style={{ backgroundColor: '#FEE500' }}
      className="flex items-center justify-center w-10 h-10 rounded-full shadow-md"
    >
      <img src={KakaoLogo} alt="Kakao Logo" className="w-5 h-5" />
    </button>
  );
};

export default KakaoLoginButton;
