const SupervisionBar = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row my-6 mx-4 lg:mx-16 justify-end items-center lg:items-end">
        <div className="hidden lg:block text-right text-gray-500">
          <div>편안한 온라인 상담 슈퍼비전을 통해</div>
          <div>다양한 사례를 간접 경험하며 전문성 향상을 돕습니다.</div>
        </div>
        <div className="text-2xl lg:text-4xl font-bold mt-4 lg:mt-0 lg:ml-8 text-center lg:text-left">
          <span className="text-blue-500">슈퍼비전</span> 커뮤니티
        </div>
      </div>
    </div>
  );
};

export default SupervisionBar;
