import React, { useState, DragEvent } from 'react';
import { UploadIcon, SpinnerIcon } from './IconComponents';

interface ImagePanelProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDrop?: (file: File) => void;
  inputId: string;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ title, imageUrl, isLoading = false, onFileChange, onFileDrop, inputId }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFileDrop) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (onFileDrop && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };


  const content = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-pink-800">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <SpinnerIcon className="relative animate-spin h-14 w-14 mb-6 text-pink-500" />
          </div>
          <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">AI가 생성 중...</p>
          <p className="text-sm text-gray-500 mt-2 font-medium">잠시만 기다려주세요 ✨</p>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="relative w-full h-full group">
          <img src={imageUrl} alt="Generated or source image" className="w-full h-full object-cover rounded-2xl shadow-sm" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl"></div>
        </div>
      );
    }

    if (onFileChange) {
      return (
        <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center justify-center h-full text-gray-400 hover:text-pink-500 transition-all duration-300 group">
          <div className="w-20 h-20 mb-4 rounded-full bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors duration-300">
            <UploadIcon className="w-10 h-10 text-pink-300 group-hover:text-pink-500 transition-colors duration-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-600 group-hover:text-pink-600 transition-colors">사진 업로드</h3>
          <p className="mt-2 text-xs text-gray-400 font-medium bg-white/80 px-3 py-1 rounded-full border border-gray-100">
            클릭하거나 파일을 드래그하세요
          </p>
          <input id={inputId} type="file" className="hidden" accept="image/png, image/jpeg" onChange={onFileChange} />
        </label>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-300">
        <div className="w-20 h-20 mb-4 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-400">이미지 영역</h3>
        <p className="mt-1 text-sm text-gray-400">결과가 여기에 표시됩니다</p>
      </div>
    );
  };

  const borderColor = isDraggingOver ? 'border-pink-400 bg-pink-50' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/30';

  return (
    <div className="w-full">
      <div
        className={`bg-white/60 backdrop-blur-sm border-2 border-dashed ${borderColor} rounded-3xl aspect-[4/3] w-full p-4 flex flex-col items-center justify-center transition-all duration-300`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="w-full h-full flex items-center justify-center relative">
          {content()}
        </div>
      </div>
    </div>
  );
};

export default ImagePanel;
