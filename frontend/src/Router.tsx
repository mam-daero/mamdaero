import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/ProtectedRoute';
import MainPage from '@/pages/main/MainPage';
import MainPageClient from '@/pages/main/MainPageClient';
import MainPageCounselor from '@/pages/main/MainPageCounselor';
import MainPageAdmin from './pages/main/MainPageAdmin';
import SignUpChoose from '@/pages/signup/SignUpChoose';
import SignUpClient from '@/pages/signup/SignUpClient';
import SignUpCounselor from '@/pages/signup/SignUpCounselor';
import SignUpCounselorInfo from '@/components/input/SignUpCounselorInfo';
import SelfTestListPage from '@/pages/selftest/SelfTestListPage';
import UnrestPage from '@/pages/selftest/UnrestPage';
import UnrestResultPage from '@/pages/selftest/UnrestResultPage';
import StressPage from '@/pages/selftest/StressPage';
import StressResultPage from '@/pages/selftest/StressResultPage';
import DepressedPage from '@/pages/selftest/DepressedPage';
import DepressedResultPage from '@/pages/selftest/DepressedResultPage';
import PTSDPage from '@/pages/selftest/PTSDPage';
import PTSDResultPage from '@/pages/selftest/PTSDResultPage';
import BipolarPage from '@/pages/selftest/BipolarPage';
import BipolarResultPage from '@/pages/selftest/BipolarResultPage';
import CounselorListPage from '@/pages/counselor/CounselorListPage';
import CounselorDetailPage from '@/pages/counselor/CounselorDetailPage';
import CounselorReservePage from '@/pages/counselor/CounselorReservePage';
import CommunityListPage from '@/pages/community/CommunityListPage';
import CommunityDetailPage from '@/pages/community/CommunityDetailPage';
import CommunityWritePostPage from '@/pages/community/CommunityWritePostPage';
import CommunityEditPostPage from './pages/community/CommunityEditPostPage';
import SupervisionListPage from '@/pages/supervision/SupervisionListPage';
import SupervisionDetailPage from '@/pages/supervision/SupervisionDetailPage';
import SupervisionWritePostPage from '@/pages/supervision/SupervisionWritePostPage';
import SupervisionEditPostPage from '@/pages/supervision/SupervisionEditPostPage';
import NoticeListPage from '@/pages/notice/NoticeListPage';
import NoticeDetailPage from '@/pages/notice/NoticeDetailPage';
import NoticeWritePostPage from '@/pages/notice/NoticeWritePostPage';
import NoticeEditPostPage from '@/pages/notice/NoticeEditPostPage';
import ClientMyPage from '@/pages/mypage/ClientMyPage';
import CounselorMyPage from '@/pages/mypage/CounselorMyPage';
import CounselorManageProductPage from '@/pages/mypage/CounselorManageProductPage';
import CounselorManageTimePage from '@/pages/mypage/CounselorManageTimePage';
import CounselorManageExcludePage from '@/pages/mypage/CounselorManageExcludePage';
import EmotionDiaryPage from '@/pages/emotiondiary/EmotionDiaryPage';
import CounselHistory from '@/pages/mycounsel/counselor/CounselHistory';
import CounselRecordList from '@/pages/mycounsel/counselor/CounselRecordList';
import CounselRecordDetail from '@/pages/mycounsel/counselor/CounselRecordDetail';
import ClientHistory from '@/pages/mycounsel/client/ClientHistory';
import ClientFaceChat from '@/pages/mycounsel/client/ClientFaceChat';
import CounselorFaceChat from '@/pages/mycounsel/counselor/CounselorFaceChat';
import PostitPage from '@/pages/postit/PostitPage';
import UnauthoriziedPage from '@/pages/UnauthoriziedPage';
import SimpleTestListPage from '@/pages/simpletest/SimpleTestListPage';
import useAuthStore from '@/stores/authStore';
import BernardTestPage from './pages/simpletest/BernardTestPage';
import HTPTestPage from './pages/simpletest/HTPTestPage';
import { FaceChat2 } from './pages/mycounsel/faceChat/FaceChat2';
import FindPasswordPage from './pages/findpassword/FindPasswordPage';
import { ClientFaceChat2 } from './pages/mycounsel/client/ClientFaceChat2';
import { CounselorFaceChat2 } from './pages/mycounsel/counselor/CounselorFaceChat2';

const Router = () => {
  const { isCounselor, isClient, isAdmin, isAuthenticated, getEmail } = useAuthStore();

  const getHomePageElement = () => {
    if (isAuthenticated && isCounselor()) {
      return <MainPageCounselor />;
    } else if (isAuthenticated && isClient()) {
      return <MainPageClient />;
    } else if (isAuthenticated && isAdmin()) {
      return <MainPageAdmin />;
    }
    return <MainPage />;
  };

  const getMemberId = () => {
    const email = getEmail();
    return email ? email.split('@')[0] : 'unknown';
  };
  return (
    <Routes>
      {/* Main Routes  */}
      <Route path="/" element={getHomePageElement()} />

      {/* SignUp Routes */}
      <Route path="/signup/choose" element={<SignUpChoose />} />
      <Route path="/signup/client/*" element={<SignUpClient />} />
      <Route path="/signup/counselor/*" element={<SignUpCounselor />} />

      {/* Counselor Routes */}
      <Route path="/counselor" element={<CounselorListPage />} />
      <Route path="/counselor/:counselorId" element={<CounselorDetailPage />} />
      <Route path="/counselor/:counselorId/reservation" element={<CounselorReservePage />} />

      {/* Self Test Routes */}
      <Route path="/selftest" element={<SelfTestListPage />} />
      <Route path="/selftest/unrest" element={<UnrestPage />} />
      <Route path="/selftest/unrest/result" element={<UnrestResultPage />} />
      <Route path="/selftest/stress" element={<StressPage />} />
      <Route path="/selftest/stress/result" element={<StressResultPage />} />
      <Route path="/selftest/depressed" element={<DepressedPage />} />
      <Route path="/selftest/depressed/result" element={<DepressedResultPage />} />
      <Route path="/selftest/ptsd" element={<PTSDPage />} />
      <Route path="/selftest/ptsd/result" element={<PTSDResultPage />} />
      <Route path="/selftest/bipolar" element={<BipolarPage />} />
      <Route path="/selftest/bipolar/result" element={<BipolarResultPage />} />

      {/* Community Routes */}
      <Route path="/community" element={<CommunityListPage />} />
      <Route path="/community/:communityId" element={<CommunityDetailPage />} />
      <Route path="/community/write/post" element={<CommunityWritePostPage />} />
      <Route path="/community/edit/:communityId" element={<CommunityEditPostPage />} />

      {/* Supervision Routes */}
      <Route element={<ProtectedRoute allowedRoles={['상담사']} />}>
        <Route path="/supervision" element={<SupervisionListPage />} />
        <Route path="/supervision/:supervisionId" element={<SupervisionDetailPage />} />
        <Route path="/supervision/write/post" element={<SupervisionWritePostPage />} />
        <Route path="/supervision/edit/:supervisionId" element={<SupervisionEditPostPage />} />
      </Route>

      {/* Notice Routes */}
      <Route path="/notice" element={<NoticeListPage />} />
      <Route path="/notice/:noticeId" element={<NoticeDetailPage />} />
      <Route path="/notice/write/post" element={<NoticeWritePostPage />} />
      <Route path="/notice/edit/:noticeId" element={<NoticeEditPostPage />} />

      {/* MyPage Routes */}
      <Route element={<ProtectedRoute allowedRoles={['내담자', '상담사']} />}>
        <Route
          path="/mypage/:memberId"
          element={isCounselor() ? <CounselorMyPage /> : <ClientMyPage />}
        />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['상담사']} />}>
        <Route path="/mypage/:memberId/product" element={<CounselorManageProductPage />} />
        <Route path="/mypage/:memberId/time" element={<CounselorManageTimePage />} />
        <Route path="/mypage/:memberId/exclude" element={<CounselorManageExcludePage />} />
      </Route>

      {/* EmotionDiary Routes */}
      <Route path="/emotiondiary" element={<EmotionDiaryPage />} />

      {/* MyCounsel Routes */}
      <Route path="/mycounsel/client/facechat2" element={<FaceChat2 />} />
      <Route element={<ProtectedRoute allowedRoles={['상담사']} />}>
        <Route path="/mycounsel/cs" element={<CounselHistory />} />
        <Route
          path="/mycounsel/:memberId/history/facechat/:counsultId/:clientId"
          element={<CounselorFaceChat />}
        />
        <Route
          path="/mycounsel/counselor/facechat/:reservationId"
          element={<CounselorFaceChat2 />}
        />

        <Route path="/mycounsel/record" element={<CounselRecordList />} />
        <Route path="/mycounsel/record/:clientId/*" element={<CounselRecordDetail />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['내담자']} />}>
        <Route path="/mycounsel" element={<ClientHistory />} />
        <Route path="/mycounsel/client/facechat/:reservationId" element={<ClientFaceChat2 />} />

        <Route
          path="/mycounsel/:memberId/history/facechat/:counsultId/:counselorId"
          element={<ClientFaceChat />}
        />
      </Route>

      {/* Postit Routes */}
      <Route path="/postit" element={<PostitPage />} />

      {/* Unauthorizied */}
      <Route path="/unauthorized" element={<UnauthoriziedPage />} />

      {/* SimpleTest Routes */}
      <Route path="/simpletest" element={<SimpleTestListPage />} />
      <Route path="/simpletest/bernard" element={<BernardTestPage />} />
      <Route path="/simpletest/htp" element={<HTPTestPage />} />

      {/* FindPassword Routes */}
      <Route path="find/password" element={<FindPasswordPage />} />
    </Routes>
  );
};

export default Router;
