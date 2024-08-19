import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/button/Button';
import book from '@/assets/book2.png';
import useAuthStore from '@/stores/authStore';

interface ClientCardProps {
  clientName: string;
  clientId: string;
}

const ClientCard: React.FC<ClientCardProps> = ({ clientName, clientId }) => {
  const navigate = useNavigate();
  const { isCounselor, isClient, isAuthenticated, email } = useAuthStore();
  const memberId = email?.split('@')[0] || 'unknown';
  const handleViewRecord = () => {
    navigate(`/mycounsel/record/${clientId}`);
  };

  return (
    <div className="relative w-52 h-68 cursor-pointer" onClick={handleViewRecord}>
      <img src={book} alt="Book" className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex flex-col justify-start items-center pt-16">
        <div className="bg-white bg-opacity-75 rounded-md mb-2 px-8">
          <h2 className="text-2xl font-bold ">{clientName}</h2>
        </div>
        <div onClick={e => e.stopPropagation()}>
          <Button
            onClick={handleViewRecord}
            label="내역보기"
            size="sm"
            color="blue"
            textSize="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
