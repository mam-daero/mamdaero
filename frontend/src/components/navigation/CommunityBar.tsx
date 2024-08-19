const CommunityBar = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row my-6 mx-4 lg:mx-16 justify-end items-center lg:items-end">
        <div className="hidden lg:block text-right text-gray-500">
          <div>털어놓고 싶은 고민이나 일상, 어떤 이야기든 자유롭게 나눌 수 있어요.</div>
          <div>맘대로의 회원들과 다양한 정보를 이야기를 공유해보세요.</div>
        </div>
        <div className="text-2xl lg:text-4xl font-bold mt-4 lg:mt-0 lg:ml-8 text-center lg:text-left">
          <span className="text-orange-500">맘대로</span> 커뮤니티
        </div>
      </div>
    </div>
  );
};

export default CommunityBar;
