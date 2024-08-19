import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useNavActive } from '@/hooks/useNavActive';
import useAuthStore from '@/stores/authStore';

import logo from '@/assets/MamdaeroLogo.svg';
import { LuBellRing } from 'react-icons/lu';
import ProfileDropdown from '@/components/dropdown/ProfileDropdown';
import AlarmModal from '@/components/modal/AlarmModal';

const navStyle =
  'p-3 text-lg font-semibold hover:bg-gray-200 text-center transition-colors duration-300';
const activeStyle = 'bg-orange-100 border-l-4 border-orange-500';

const NavClient = () => {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuthStore();
  const isNavActive = useNavActive();
  const handleMyCounselClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isAuthenticated && accessToken) {
      // accessToken을 상태로 저장하고 mycounsel 페이지로 이동
      useAuthStore.getState().getAccessToken();
      navigate('/mycounsel');
    } else {
      alert('로그인이 필요합니다.');
      navigate('/', { state: { from: '/mycounsel' } });
    }
  };

  const handleAlarmClick = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
    } else {
      const modal = document.getElementById('alarm_modal') as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
      }
    }
  };

  return (
    <div className="flex flex-col w-1.5/12 h-screen bg-white text-gray-800 fixed shadow-lg">
      <div className="flex justify-center items-center">
        <NavLink to="/">
          <img
            src={logo}
            alt="로고"
            className="my-3 h-12 transition-transform transform hover:-translate-y-0.5"
          />
        </NavLink>
      </div>
      <NavLink
        to="/counselor"
        className={`${navStyle} ${isNavActive('/counselor') ? activeStyle : ''}`}
      >
        상담사 조회
      </NavLink>
      <NavLink to="/postit" className={`${navStyle} ${isNavActive('/postit') ? activeStyle : ''}`}>
        맘대로 포스트잇
      </NavLink>
      <NavLink
        to="/simpletest"
        className={`${navStyle} ${isNavActive('/simpletest') ? activeStyle : ''}`}
      >
        간단 심리 테스트
      </NavLink>
      <NavLink
        to="/selftest"
        className={`${navStyle} ${isNavActive('/selftest') ? activeStyle : ''}`}
      >
        자가 심리 검진
      </NavLink>
      <NavLink
        to="/community"
        className={`${navStyle} ${isNavActive('/community') ? activeStyle : ''}`}
      >
        커뮤니티
      </NavLink>
      <NavLink
        to="/emotiondiary"
        className={`${navStyle} ${isNavActive('/emotiondiary') ? activeStyle : ''}`}
      >
        감정 일기
      </NavLink>
      <NavLink
        to="/mycounsel"
        className={`${navStyle} ${isNavActive('/mycounsel') ? activeStyle : ''}`}
        onClick={handleMyCounselClick}
      >
        나의 상담
      </NavLink>
      <div className="flex justify-evenly mt-auto mb-5">
        {/* 공지사항 */}
        <Link to="/notice" className="font-bold">
          <div className="transition-transform transform hover:-translate-y-0.5">공지사항</div>
        </Link>
        {/* 알람 */}
        <div
          onClick={handleAlarmClick}
          className="transition-transform transform hover:-translate-y-0.5 cursor-pointer"
        >
          <LuBellRing size={24} />
        </div>
        <AlarmModal />
        {/* 마이페이지 */}
        <div className="transition-transform transform hover:-translate-y-0.5">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default NavClient;
