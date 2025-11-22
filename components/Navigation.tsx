import React from 'react';

export enum PageType {
  FUTURE_FACE = 'future_face',
  ANIMAL_TRANSFORM = 'animal_transform'
}

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none">
      <div className="glass-panel rounded-full p-1.5 flex space-x-1 pointer-events-auto shadow-lg shadow-purple-500/5">
        <button
          onClick={() => onPageChange(PageType.FUTURE_FACE)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${currentPage === PageType.FUTURE_FACE
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md transform scale-105'
              : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
            }`}
        >
          <span className="text-lg">🧒</span>
          <span>미래 얼굴</span>
        </button>
        <button
          onClick={() => onPageChange(PageType.ANIMAL_TRANSFORM)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${currentPage === PageType.ANIMAL_TRANSFORM
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md transform scale-105'
              : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
            }`}
        >
          <span className="text-lg">🐰</span>
          <span>동물 변신</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
