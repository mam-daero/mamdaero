import React from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import NavClient from '@/components/navigation/NavClient';
import NavCounselor from '@/components/navigation/NavCounselor';
import Router from '@/Router';
import ScrollToTop from './components/ScrollToTop';
import AlarmConnect from './pages/alarm/AlarmConnect';
import toast, { Toaster } from 'react-hot-toast';

const routeBackgroundColors: { [key: string]: string } = {
  '/signup/counselor': 'bg-blue-50',
  '/supervision': 'bg-blue-50',
  '/supervision/:supervisionId': 'bg-blue-50',
  '/mycounsel/counselor/history': 'bg-blue-50',
  '/mycounsel/counselor/record': 'bg-blue-50',
  '/counselor/main': 'bg-blue-50',
  '/notice': 'bg-gray-50',
  '/notice/:noticeId': 'bg-gray-50',
};

function App() {
  const location = useLocation();
  const { isClient, isCounselor } = useAuthStore();

  function getBackgroundColor(pathname: string): string {
    if (pathname === '/') {
      return isCounselor() ? 'bg-blue-50' : 'bg-orange-50';
    }

    // 마이페이지 경로 처리
    if (pathname.startsWith('/mypage/')) {
      if (isCounselor()) {
        return 'bg-blue-50'; // 상담사 마이페이지
      } else if (isClient()) {
        return 'bg-orange-50'; // 내담자 마이페이지
      }
    }

    // 나의 상담 경로 처리
    if (pathname.startsWith('/mycounsel/')) {
      if (isCounselor()) {
        return 'bg-blue-50'; // 상담사 마이페이지
      } else if (isClient()) {
        return 'bg-orange-50'; // 내담자 마이페이지
      }
    }

    // 기타 경로 처리
    for (const [route, color] of Object.entries(routeBackgroundColors)) {
      if (pathname.startsWith(route)) {
        return color;
      }
    }

    return 'bg-orange-50';
  }

  const backgroundColor = getBackgroundColor(location.pathname);

  const renderNavigation = () => {
    if (isCounselor()) {
      return <NavCounselor />;
    } else {
      return <NavClient />;
    }
  };

  return (
    <div className="App grid grid-cols-8 min-h-screen">
      <div className="fixed flex min-h-screen col-span-1">{renderNavigation()}</div>
      <div className={`col-start-2 col-span-7 px-16 py-6 ${backgroundColor}`}>
        <ScrollToTop />
        <AlarmConnect />
        <Toaster position="bottom-right" reverseOrder={false} />
        <Router />
      </div>
    </div>
  );
}

export default App;
