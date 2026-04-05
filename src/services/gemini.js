import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `당신은 초당대학교(Chodang University) 사회복지학과 성인학습자 상담 지원 AI입니다.
당신의 임무는 교수님의 거친 상담 메모를 대학 통합정보시스템에 즉시 입력 가능한 전문적인 사회복지 상담 보고서로 변환하는 것입니다.
현재 당신은 최신 'Gemini 2.5 Flash' 엔진을 기반으로 작동하고 있습니다.

주요 지침:
1. 반드시 [상담내용]과 [향후계획] 두 섹션으로만 출력하세요.
2. 성인학습자의 특성(직장 병행, 가족 부양, 학업 의지 등)을 고려한 공감적인 어조를 유지하세요.
3. 사회복지 실천론에 기반한 전문 용어(예: 라포 형성, 학업 효능감, 지지 체계 등)를 적절히 사용하세요.
4. 모든 문장은 (~함, ~임, ~함)과 같은 공적인 종결 어미를 사용하세요.
5. 학생의 개인적인 사정이나 어려움을 대학 시스템 양식에 맞게 정제하여 기록하세요.`,
});

export const getGeminiResponse = async (chatHistory) => {
  try {
    const chat = model.startChat({
      history: chatHistory.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const lastMessage = chatHistory[chatHistory.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
