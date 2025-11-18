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
    <nav className="bg-white shadow-lg border-b border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8 py-4">
          <button
            onClick={() => onPageChange(PageType.FUTURE_FACE)}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
              currentPage === PageType.FUTURE_FACE
                ? 'bg-pink-400 text-white shadow-lg'
                : 'text-pink-500 hover:bg-pink-100'
            }`}
          >
            🧒 미래에서 만나는 우리아이
          </button>
          <button
            onClick={() => onPageChange(PageType.ANIMAL_TRANSFORM)}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
              currentPage === PageType.ANIMAL_TRANSFORM
                ? 'bg-pink-400 text-white shadow-lg'
                : 'text-pink-500 hover:bg-pink-100'
            }`}
          >
            🐰 아기 동물로 변신!
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
