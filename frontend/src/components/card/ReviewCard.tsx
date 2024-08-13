import { FaStar } from 'react-icons/fa6';
interface ReviewCard {
  review: string;
  score: number;
}
const ReviewCard: React.FC<ReviewCard> = ({ review, score }) => {
  return (
    <div className="w-full p-4 bg-orange-100 rounded-md shadow-md">
      <div className="flex mb-1">
        <FaStar size={20} color="orange" />
        <div className="text-md font-bold mx-1">{score}</div>
      </div>
      <div>{review}</div>
    </div>
  );
};

export default ReviewCard;
