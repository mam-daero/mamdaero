import { useLocation } from 'react-router-dom';

export const useNavActive = () => {
  const location = useLocation();

  return (path: string) => {
    return location.pathname.startsWith(path);
  };
};
