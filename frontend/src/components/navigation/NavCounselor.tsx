import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useNavActive } from '@/hooks/useNavActive';
import useAuthStore from '@/stores/authStore';

import logo from '@/assets/MamdaeroLogo.svg';
import { LuBellRing } from 'react-icons/lu';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ProfileDropdown from '@/components/dropdown/ProfileDropdown';
import AlarmModal from '@/components/modal/AlarmModal';

const navStyle =
  'p-3 text-lg font-semibold hover:bg-gray-200 text-center transition-colors duration-300';
const navSubStyle =
  'py-2 px-6 text-base font-semibold hover:bg-gray-100 text-left transition-colors duration-300 text-center';
const activeStyle = 'bg-blue-100 border-l-4 border-blue-500 text-center';
const activeSubStyle = 'bg-gray-200';

const NavClient: React.FC = () => {
  const [isMyCounselOpen, setIsMyCounselOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuthStore();
  const isNavActive = useNavActive();

  const isMyCounselActive = isNavActive('/mycounsel/counselor');

  useEffect(() => {
    const shouldOpenMyCounsel = ['/mycounsel/cs', '/mycounsel/record'].some(path =>
      location.pathname.startsWith(path)
    );
    setIsMyCounselOpen(shouldOpenMyCounsel);
  }, [location]);

  const handleMyCounselClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isAuthenticated && accessToken) {
      useAuthStore.getState().getAccessToken();
      navigate('/mycounsel/cs');
    } else {
      navigate('/', { state: { from: '/mycounsel/cs' } });
    }
  };

  const handleMyRecordClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isAuthenticated && accessToken) {
      useAuthStore.getState().getAccessToken();
      navigate('/mycounsel/record');
    } else {
      navigate('/', { state: { from: '/mycounsel/record' } });
    }
  };

  const handleAlarmClick = () => {
    const modal = document.getElementById('alarm_modal') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
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
        to="/supervision"
        className={`${navStyle} ${isNavActive('/supervision') ? activeStyle : ''}`}
      >
        상담사 슈퍼비전
      </NavLink>
      <NavLink
        to="/community"
        className={`${navStyle} ${isNavActive('/community') ? activeStyle : ''}`}
      >
        커뮤니티
      </NavLink>
      <button
        onClick={() => setIsMyCounselOpen(!isMyCounselOpen)}
        className={`${navStyle} text-left ${isMyCounselOpen || isMyCounselActive ? activeSubStyle : ''}`}
      >
        {isMyCounselOpen ? (
          <div className="flex items-center justify-center space-x-3">
            <span>나의 상담</span> <FaChevronDown size={12} />
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <span>나의 상담</span> <FaChevronUp size={12} />
          </div>
        )}
      </button>
      {isMyCounselOpen && (
        <div className="flex flex-col mt-1 bg-gray-50">
          <>
            <NavLink
              to={'/mycounsel/cs'}
              className={`${navSubStyle} ${isNavActive('/mycounsel/cs') ? activeStyle : ''}`}
              onClick={handleMyCounselClick}
            >
              상담 내역
            </NavLink>
            <NavLink
              to={'/mycounsel/record'}
              className={`${navSubStyle} ${isNavActive('/mycounsel/record') ? activeStyle : ''}`}
              onClick={handleMyRecordClick}
            >
              상담 기록
            </NavLink>
          </>
        </div>
      )}
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
