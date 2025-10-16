import React, { useState } from 'react';
import { generateAnimalImage } from '../services/animalService';
import ImagePanel from './ImagePanel';
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
    setError(null);
    setIsLoading(true);
    setGeneratedImageUrl(null);

    try {
      const resultUrl = await generateAnimalImage(sourceImageFile, animalName.trim(), selectedStyle);
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
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        disabled={isLoading}
      >
        {style}
      </button>
    );
  };
  
  const isCreationDone = generatedImageUrl !== null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col">
      <header className="text-center my-8 sm:my-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          동물 캐릭터로 변신
        </h1>
        <p className="text-lg text-gray-300 mt-2">귀여운 동물로 변신한 우리 아이</p>
      </header>

      <main className="flex-grow container mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="w-full">
          <ImagePanel
            title="원본 사진"
            imageUrl={sourceImageUrl}
            onFileChange={handleFileChange}
            onFileDrop={handleFileDrop}
            inputId="animal-source-image-upload"
          />
        </div>

        <div className="flex flex-col items-center justify-center space-y-6 px-4">
            <div className="w-full space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        동물 이름
                    </label>
                    <input
                        type="text"
                        value={animalName}
                        onChange={(e) => setAnimalName(e.target.value)}
                        placeholder="예: 토끼, 강아지, 고양이..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        스타일 선택
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {styles.map((style) => (
                            <StyleButton key={style} style={style} />
                        ))}
                    </div>
                </div>
            </div>
          
            {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}
          
            {isCreationDone ? (
                 <div className="w-full space-y-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <RefreshIcon className="w-6 h-6" />
                        다시 만들기
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <DownloadIcon className="w-6 h-6" />
                        이미지 저장
                    </button>
                 </div>
            ) : (
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !sourceImageFile || !animalName.trim() || !selectedStyle}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none transform hover:scale-105"
                >
                    {isLoading ? '생성 중...' : '만들기'}
                </button>
            )}

        </div>
        
        <div className="w-full">
          <ImagePanel
            title="동물 변신 사진"
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
