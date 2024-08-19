import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

interface RoleBasedProtectedRouteProps {
  allowedRoles: string[];
}

const RoleBasedProtectedRoute: React.FC<RoleBasedProtectedRouteProps> = ({
  allowedRoles = ['내담자', '상담사', '관리자'],
}) => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!role || !allowedRoles.some(allowedRole => role.includes(allowedRole))) {
    // 역할이 없거나 허용된 역할이 아닌 경우 접근 거부 페이지로 리다이렉트
    return <Navigate to="/unauthorized" replace />;
  }

  // 인증되고 올바른 역할을 가진 사용자는 접근 허용
  return <Outlet />;
};

export default RoleBasedProtectedRoute;
