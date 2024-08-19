import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

interface Client {
  id: number;
  name: string;
}

export interface ClientListResponse {
  data: Client[];
  totalPages: number;
}

const fetchClients = async (): Promise<ClientListResponse> => {
  const response = await axiosInstance.get<ClientListResponse>('c/client');
  return response.data;
};

const useClientList = (): UseQueryResult<ClientListResponse, Error> => {
  return useQuery<ClientListResponse, Error>({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useClientList;
