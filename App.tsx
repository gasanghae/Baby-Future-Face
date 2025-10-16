import React, { useState } from 'react';
import Navigation, { PageType } from './components/Navigation';
import FutureFacePage from './components/FutureFacePage';
import AnimalTransformPage from './components/AnimalTransformPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.FUTURE_FACE);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case PageType.FUTURE_FACE:
        return <FutureFacePage />;
      case PageType.ANIMAL_TRANSFORM:
        return <AnimalTransformPage />;
      default:
        return <FutureFacePage />;
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderCurrentPage()}
      
      <footer className="text-center mt-4 text-pink-500 pb-4">
        <p>사용 방법: 1. 아이의 정면 사진을 업로드하세요. 2. 옵션을 선택하세요. 3. '생성' 버튼을 누르고 잠시 기다려주세요.</p>
        <p className="text-xs mt-1 text-pink-400">본 결과는 AI에 의해 생성된 가상의 이미지이며 실제와 다를 수 있습니다.</p>
      </footer>
    </div>
  );
};

export default App;