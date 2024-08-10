import { Link } from 'react-router-dom';

const UnauthoriziedPage = () => {
  return (
    <div className=" flex flex-col justify-center items-center mt-10 space-y-10">
      <div className="text-3xl font-bold">권한이 없습니다. </div>
      <Link to="/">
        <button className="border bg-gray-300 rounded-lg font-bold p-3">홈으로 가기</button>
      </Link>
    </div>
  );
};

export default UnauthoriziedPage;
