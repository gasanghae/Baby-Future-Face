import React, { useState } from 'react';
import { Gender } from '../types';
import { generateFutureImage } from '../services/geminiService';
import { incrementUsage, canUse } from '../services/usageLimitService';
import ImagePanel from './ImagePanel';
import UsageLimitDisplay from './UsageLimitDisplay';
import { RefreshIcon, DownloadIcon } from './IconComponents';

const FutureFacePage: React.FC = () => {
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!sourceImageFile || !gender) {
      setError('사진을 업로드하고 성별을 선택해주세요.');
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
      const resultUrl = await generateFutureImage(sourceImageFile, gender);
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

    link.download = `ai_future_face.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const GenderButton: React.FC<{ value: Gender; label: string }> = ({ value, label }) => {
    const isSelected = gender === value;
    return (
      <button
        onClick={() => setGender(value)}
        className={`w-full py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
          isSelected 
            ? 'bg-pink-400 text-white shadow-lg transform scale-105 border-transparent' 
            : 'bg-white text-pink-500 border border-pink-200 hover:bg-pink-100'
        }`}
        disabled={isLoading}
      >
        {label}
      </button>
    );
  };
  
  const isCreationDone = generatedImageUrl !== null;

  return (
    <div className="p-2 sm:p-4 flex flex-col">
      <main className="container mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="w-full">
          <ImagePanel
            title=""
            imageUrl={sourceImageUrl}
            onFileChange={handleFileChange}
            onFileDrop={handleFileDrop}
            inputId="source-image-upload"
          />
          <div className="text-center mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
            <p className="text-sm text-pink-600 font-medium">사용 방법: 1. 아이의 정면 사진을 업로드하세요. 2. 옵션을 선택하세요. 3. '생성' 버튼을 누르고 잠시 기다려주세요.</p>
            <p className="text-xs mt-2 text-pink-500">본 결과는 AI에 의해 생성된 가상의 이미지이며 실제와 다를 수 있습니다.</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6 px-4">
            <div className="w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <GenderButton value={Gender.MALE} label="남자아이" />
                    <GenderButton value={Gender.FEMALE} label="여자아이" />
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
                    disabled={isLoading || !sourceImageFile || !gender}
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
            inputId="generated-image"
          />
        </div>
      </main>
    </div>
  );
};

export default FutureFacePage;
