import { useLocation } from 'react-router-dom';

export const useNavActive = () => {
  const location = useLocation();

  return (path: string) => {
    if (location.pathname === '/counselor/main') {
      return false;
    }
    return location.pathname.startsWith(path);
  };
};
