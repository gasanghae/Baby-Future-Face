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

const getStyleDetails = (style: string): string => {
  const styleDetails: { [key: string]: string } = {
    '지브리 스타일': '부드러운 수채화 질감, 자연광, 감성적인 자연 풍경, 따뜻한 색감, 부드러운 라인',
    '디즈니 2D 스타일': '선명한 톤, 둥근 라인, 반짝이는 눈, 동화풍 색감',
    '픽사 3D 스타일': '3D 질감, 말랑하고 입체적인 형태, 고품질 조명, 픽사 특유의 따뜻한 색감',
    '산리오 스타일': '파스텔 톤, 간단한 라인, 작은 눈·입, 아기자기하고 미니멀한 캐릭터',
    '수채화 동화 스타일': '부드러운 수채화 질감, 동화책 일러스트 느낌, 따뜻한 색조, 자연스러운 번짐 효과',
    '어드벤처 타임 스타일': '굵은 검정 외곽선, 단순한 점 눈, 플랫 컬러, 얇은 팔·다리, 기하학적 형태'
  };
  
  return styleDetails[style] || '';
};

export const generateAnimalImage = async (imageFile: File, animalName: string, style: string): Promise<string> => {
  try {
    const base64Data = await fileToBase64(imageFile);
    const mimeType = imageFile.type;

    const styleDetail = getStyleDetails(style);
    const basePrompt = `${style} 스타일의 일러스트, ${animalName} 캐릭터로 변신한 아기의 모습, 아기의 현재 얼굴 특징을 그대로 유지하며 자연스럽게 캐릭터화, ${animalName}의 귀, 표정, 털·질감·실루엣이 아기와 조화되도록 디자인, 포즈와 배경은 ${animalName} 특성과 잘 어울리는 환경으로 구성, 전체적으로 귀엽고 사랑스럽고 밝은 분위기, 선명한 고해상도 일러스트`;
    const prompt = styleDetail ? `${basePrompt}, 스타일 속성: ${styleDetail}` : basePrompt;
    
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
