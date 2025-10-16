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

  const styles = [
    '지브리 스타일',
    '디즈니 스타일', 
    '픽사 스타일',
    '일러스트 스타일',
    '수채화 스타일',
    '만화 스타일'
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
    if (!sourceImageFile || !animalName.trim() || !selectedStyle) {
      setError('사진을 업로드하고 동물 이름과 스타일을 선택해주세요.');
      return;
    }

    if (!canUse()) {
      setError('일일 사용 한도(10회)를 초과했습니다. 내일 다시 시도해주세요.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedImageUrl(null);

    try {
      const resultUrl = await generateAnimalImage(sourceImageFile, animalName.trim(), selectedStyle);
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

  const StyleButton: React.FC<{ style: string }> = ({ style }) => {
    const isSelected = selectedStyle === style;
    return (
      <button
        onClick={() => setSelectedStyle(style)}
        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
          isSelected 
            ? 'bg-pink-400 text-white shadow-md' 
            : 'bg-white text-pink-500 border border-pink-200 hover:bg-pink-100'
        }`}
        disabled={isLoading}
      >
        {style}
      </button>
    );
  };
  
  const isCreationDone = generatedImageUrl !== null;

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col">
      <main className="flex-grow container mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-4">
        <div className="w-full">
          <ImagePanel
            title=""
            imageUrl={sourceImageUrl}
            onFileChange={handleFileChange}
            onFileDrop={handleFileDrop}
            inputId="animal-source-image-upload"
          />
          <div className="text-center mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
            <p className="text-sm text-pink-600 font-medium">사용 방법: 1. 아이의 정면 사진을 업로드하세요. 2. 옵션을 선택하세요. 3. '생성' 버튼을 누르고 잠시 기다려주세요.</p>
            <p className="text-xs mt-2 text-pink-500">본 결과는 AI에 의해 생성된 가상의 이미지이며 실제와 다를 수 있습니다.</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6 px-4">
            <div className="w-full space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        동물 이름
                    </label>
                    <input
                        type="text"
                        value={animalName}
                        onChange={(e) => setAnimalName(e.target.value)}
                        placeholder="예: 토끼, 강아지, 고양이..."
                        className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        스타일 선택
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {styles.map((style) => (
                            <StyleButton key={style} style={style} />
                        ))}
                    </div>
                </div>
            </div>
          
            {error && <p className="text-red-700 text-center bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
            
            <UsageLimitDisplay className="mb-4" />
          
            {isCreationDone ? (
                 <div className="w-full space-y-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <RefreshIcon className="w-6 h-6" />
                        다시 만들기
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-full bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <DownloadIcon className="w-6 h-6" />
                        이미지 저장
                    </button>
                 </div>
            ) : (
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !sourceImageFile || !animalName.trim() || !selectedStyle}
                    className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none transform hover:scale-105"
                >
                    {isLoading ? '생성 중...' : '만들기'}
                </button>
            )}

        </div>
        
        <div className="w-full">
          <ImagePanel
            title=""
            imageUrl={generatedImageUrl}
            isLoading={isLoading}
            inputId="animal-generated-image"
          />
        </div>
      </main>
    </div>
  );
};

export default AnimalTransformPage;
