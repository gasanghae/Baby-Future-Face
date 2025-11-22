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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-[100px] animate-float"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-pink-200/30 blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-blue-200/30 blur-[100px] animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

export default App;