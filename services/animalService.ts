import { GoogleGenAI, Modality } from "@google/genai";

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

export const generateAnimalImage = async (imageFile: File, animalName: string, style: string): Promise<string> => {
  try {
    const base64Data = await fileToBase64(imageFile);
    const mimeType = imageFile.type;

    const prompt = `귀여운 ${animalName}으로 변신한 아기 그려진 ${style}의 그림. 포즈와 배경은 ${animalName}과 어울리도록 바꿔. 꼭 얼굴은 닮도록 해야 해. 그림은 전체적으로 귀엽고 사랑스러운 분위기로 해.`;
    
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
            text: prompt,
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
    console.error('Error generating animal image:', error);
    throw new Error('이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};
