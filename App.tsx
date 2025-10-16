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
    </div>
  );
};

export default App;