import { GoogleGenAI, Modality } from "@google/genai";
import { Gender } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove the data URL prefix
    };
    reader.onerror = error => reject(error);
  });
};

const professions = [
  '운동선수', '의사', '교사', '아이돌', '만화가', '경찰', '요리사', 
  '변호사', 'IT전문가', '군인', '디자이너', '간호사', '사업가'
];

export const generateFutureImage = async (imageFile: File, gender: Gender): Promise<string> => {
  try {
    const base64Data = await fileToBase64(imageFile);
    const mimeType = imageFile.type;

    const genderPrompt = gender === Gender.MALE ? '남자' : '여자';
    const randomProfession = professions[Math.floor(Math.random() * professions.length)];
    
    const finalPrompt = `${genderPrompt} 20대의 모습, ${randomProfession} 전문가 스타일, 아시아 한국인, 아이의 현재 얼굴 특징을 자연스럽게 성인으로 성장시킨 얼굴, 상반신이 보이는 인물 사진, 직업을 보여주는 자연스러운 복장과 소품, 직업 분위기를 암시하는 현실적인 배경(예: ${randomProfession}이 일하는 환경), 아이폰 15 Pro로 촬영한 것 같은 사실적인 포트레이트, 밝고 자연스러운 조명, 얕은 심도, 자연스러운 보케, 선명한 눈동자, 리얼 피부 질감, 과하지 않은 자연 리터칭, 고해상도 사진 스타일`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const generatedBase64 = part.inlineData.data;
        const generatedMimeType = part.inlineData.mimeType;
        return `data:${generatedMimeType};base64,${generatedBase64}`;
      }
    }

    throw new Error('AI가 이미지를 생성하지 못했습니다. 다른 사진으로 시도해보세요.');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};