import { useLocation } from 'react-router';

export const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};
