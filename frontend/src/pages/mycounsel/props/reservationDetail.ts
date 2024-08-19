export interface Situation {
  situationName: string;
}

export interface Symptom {
  symptomName: string;
}

export interface Reservation {
  reservationId: number;
  counselorId: number;
  memberId: number;
  counselorName: string;
  memberName: string;
  itemName: string;
  itemFee: number;
  requirement: string;
  isDiaryShared: boolean;
  isTestShared: boolean;
  date: string;
  time: number; // 기존 시간
  formatTime: string; // 포맷팅한 시간
  status: string;
  canceledAt: string | null;
  canceler: string | null;
  situations: Situation[];
  symptoms: Symptom[];
  isReview: boolean;
}

// 시간을 2자리 문자열로 포맷팅
const formatTime = (time: number | undefined): string => {
  if (time === undefined) return '시간 미정';
  return `${time.toString().padStart(2, '0')}:00`;
};

// Reservation 객체를 변환
export const createReservation = (data: Omit<Reservation, 'formatTime'>): Reservation => {
  return {
    ...data,
    formatTime: formatTime(data.time),
  };
};
