/// <reference types="vite/client" />
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { QuizConfig, QuizQuestion } from '../types';

// Load API key from Vite environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing VITE_GEMINI_API_KEY environment variable");
}

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: API_KEY
});

const modelId = 'gemini-2.5-flash';

// ---------------- CHAT ----------------

let chatSession = ai.chats.create({
  model: modelId,
  config: {
    systemInstruction: `Bạn là Cố vấn Phòng chống Bạo lực học đường (School Violence Prevention Advisor).

Bạn là một chuyên gia tâm lý học đường thân thiện, thấu cảm dành cho học sinh.

Nhiệm vụ:
- 🛡️ Giải thích và phòng tránh bạo lực học đường
- 🤝 Cách xử lý khi bị bắt nạt
- 💡 Cách giúp đỡ bạn bè bị bắt nạt
- 💙 Khuyến khích chia sẻ với giáo viên và người thân

Trả lời:
- ngắn gọn
- tích cực
- dễ hiểu
- dùng emoji 🛡️ 🤝 💡 💙`,
  },
});

export const sendMessageStream = async function* (message: string) {
  try {
    const result = await chatSession.sendMessageStream({ message });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const resetChatSession = () => {
  chatSession = ai.chats.create({
    model: modelId,
    config: {
      systemInstruction:
        "Bạn là Cố vấn Phòng chống Bạo lực học đường. Trả lời thân thiện, ngắn gọn, thấu cảm.",
    },
  });
};

// ---------------- QUIZ ----------------

const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "Nội dung câu hỏi",
      },

      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Danh sách lựa chọn",
      },

      correctAnswerIndex: {
        type: Type.INTEGER,
        description: "Chỉ số đáp án đúng",
      },

      explanation: {
        type: Type.STRING,
        description: "Giải thích đáp án",
      },
    },

    required: [
      "question",
      "options",
      "correctAnswerIndex",
      "explanation",
    ],
  },
};

export const generateQuiz = async (
  config: QuizConfig
): Promise<QuizQuestion[]> => {
  try {
    const typeDescription =
      config.type === "multiple-choice"
        ? "Trắc nghiệm (4 lựa chọn)"
        : "Đúng/Sai (2 lựa chọn: Đúng, Sai)";

    const prompt = `
Hãy tạo bộ câu hỏi về phòng chống bạo lực học đường.

Chủ đề: "${config.topic || "ngẫu nhiên"}"
Số câu: ${config.count}
Loại: ${typeDescription}
Ngôn ngữ: Tiếng Việt

Yêu cầu:
- thực tế
- mang tính giáo dục
- giúp học sinh biết cách xử lý tình huống bạo lực
`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,

      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data as QuizQuestion[];
    }

    throw new Error("No quiz returned from AI");

  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw error;
  }
};
