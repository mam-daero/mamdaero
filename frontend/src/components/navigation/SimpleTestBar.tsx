const SimpleTestBar: React.FC<{ testName: string }> = ({ testName }) => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row my-6 mx-4 lg:mx-16 justify-end items-center lg:items-end">
        <div className="hidden lg:block text-right text-gray-500">
          <div>재미로 하는 간단한 심리 테스트!</div>
          <div>그림 심리 테스트를 통해 나에 대해 알아보세요!</div>
        </div>
        <div className="text-2xl lg:text-4xl font-bold mt-4 lg:mt-0 lg:ml-8 text-center lg:text-left">
          <span className="text-orange-500">{testName}</span> 테스트
        </div>
      </div>
    </div>
  );
};

export default SimpleTestBar;
