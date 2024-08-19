const CommunityBar = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row my-6 mx-4 lg:mx-16 justify-end items-center lg:items-end">
        <div className="hidden lg:block text-right text-gray-500">
          <div>맘대로의 안내 사항을 확인해주세요.</div>
        </div>
        <div className="text-2xl lg:text-4xl font-bold mt-4 lg:mt-0 lg:ml-8 text-center lg:text-left">
          <span className="text-gray-800">맘대로 공지사항</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityBar;
