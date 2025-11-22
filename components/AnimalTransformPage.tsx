import React, { useState } from 'react';
import { generateAnimalImage } from '../services/animalService';
import { incrementUsage, canUse } from '../services/usageLimitService';
import ImagePanel from './ImagePanel';
import UsageLimitDisplay from './UsageLimitDisplay';
import { RefreshIcon, DownloadIcon } from './IconComponents';

const AnimalTransformPage: React.FC = () => {
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [animalName, setAnimalName] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const animals = [
    '강아지', '고양이', '햄스터', '토끼', '펭귄', '여우',
    '곰', '판다', '코끼리', '사자', '호랑이'
  ];

  const styles = [
    '지브리 스타일',
    '디즈니 2D 스타일',
    '픽사 3D 스타일',
    '산리오 스타일',
    '수채화 동화 스타일',
    '어드벤처 타임 스타일'
  ];

  const processFile = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSourceImageFile(file);
      setSourceImageUrl(URL.createObjectURL(file));
      setGeneratedImageUrl(null);
      setError(null);
    } else {
      setError('JPEG 또는 PNG 형식의 이미지 파일을 업로드해주세요.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileDrop = (file: File) => {
    processFile(file);
  };

  const handleGenerate = async () => {
    if (!sourceImageFile || !animalName || !selectedStyle) {
      setError('사진을 업로드하고 동물과 스타일을 선택해주세요.');
      return;
    }

    if (!canUse()) {
      setError('일일 사용 한도(20회)를 초과했습니다. 내일 다시 시도해주세요.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedImageUrl(null);

    try {
      const resultUrl = await generateAnimalImage(sourceImageFile, animalName, selectedStyle);
      incrementUsage();
      setGeneratedImageUrl(resultUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedImageUrl) return;

    const link = document.createElement('a');
    link.href = generatedImageUrl;

    const mimeType = generatedImageUrl.match(/data:(.*);base64,/)?.[1];
    const extension = mimeType ? mimeType.split('/')[1] : 'png';

    link.download = `animal_transform.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const AnimalButton: React.FC<{ animal: string }> = ({ animal }) => {
    const isSelected = animalName === animal;
    return (
      <button
        onClick={() => setAnimalName(animal)}
        className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-300 ${isSelected
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md transform scale-105'
            : 'bg-white text-gray-600 border border-gray-200 shadow-sm hover:border-pink-300 hover:bg-pink-50'
          }`}
        disabled={isLoading}
      >
        {animal}
      </button>
    );
  };

  const StyleButton: React.FC<{ style: string }> = ({ style }) => {
    const isSelected = selectedStyle === style;
    return (
      <button
        onClick={() => setSelectedStyle(style)}
        className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${isSelected
            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md transform scale-105'
            : 'bg-white text-gray-600 border border-gray-200 shadow-sm hover:border-purple-300 hover:bg-purple-50'
          }`}
        disabled={isLoading}
      >
        {style}
      </button>
    );
  };

  const isCreationDone = generatedImageUrl !== null;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          <span className="gradient-text">아기 동물 변신</span>
        </h1>
        <p className="text-gray-500 font-medium">우리 아이가 귀여운 동물 캐릭터가 된다면?</p>
      </div>

      <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="w-full space-y-6">
          <div className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-xl">
            <ImagePanel
              title="아이 사진 업로드"
              imageUrl={sourceImageUrl}
              onFileChange={handleFileChange}
              onFileDrop={handleFileDrop}
              inputId="animal-source-image-upload"
            />
          </div>
          <div className="glass-panel rounded-2xl p-5 text-center">
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              <span className="block mb-2 text-pink-500 font-bold">💡 사용 팁</span>
              정면을 바라보는 선명한 사진을 올려주세요.<br />
              얼굴이 잘 보일수록 더 정확한 결과가 나옵니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 py-4">
          <div className="w-full space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                동물 선택 🐾
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                {animals.map((animal) => (
                  <AnimalButton key={animal} animal={animal} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                스타일 선택 🎨
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {styles.map((style) => (
                  <StyleButton key={style} style={style} />
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="w-full bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center animate-pulse">
              {error}
            </div>
          )}

          <div className="w-full flex justify-center">
            <UsageLimitDisplay className="glass-button px-4 py-2 rounded-full text-sm font-medium text-gray-600" />
          </div>

          {isCreationDone ? (
            <div className="w-full space-y-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-500/20 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <RefreshIcon className="w-6 h-6" />
                다시 만들기
              </button>
              <button
                onClick={handleSave}
                className="w-full glass-button hover:bg-white/40 text-gray-800 font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <DownloadIcon className="w-6 h-6" />
                이미지 저장
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isLoading || !sourceImageFile || !animalName || !selectedStyle}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-500/20 transform hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  생성 중...
                </span>
              ) : '변신하기 ✨'}
            </button>
          )}

        </div>

        <div className="w-full">
          <div className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-xl h-full min-h-[400px] flex flex-col">
            <ImagePanel
              title="생성된 이미지"
              imageUrl={generatedImageUrl}
              isLoading={isLoading}
              inputId="animal-generated-image"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnimalTransformPage;
