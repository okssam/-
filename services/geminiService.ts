import { GoogleGenAI, Type } from "@google/genai";
import type { ChecklistResponse, SubTask } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    big_task: { type: Type.STRING },
    context: {
      type: Type.OBJECT,
      properties: {
        role: { type: Type.STRING, nullable: true },
        deadline: { type: Type.STRING, nullable: true },
        location: { type: Type.STRING, nullable: true },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['role', 'deadline', 'location', 'tools']
    },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          emoji: { type: Type.STRING, description: "작업을 나타내는 단일 이모티콘입니다." },
          prep: { type: Type.ARRAY, items: { type: Type.STRING } },
          duration_min: { type: Type.INTEGER },
          priority: { type: Type.STRING },
          due: { type: Type.STRING, nullable: true },
          depends_on: { type: Type.ARRAY, items: { type: Type.STRING } },
          automation: { type: Type.ARRAY, items: { type: Type.STRING } },
          done_definition: { type: Type.STRING },
        },
        required: ['id', 'title', 'description', 'emoji', 'prep', 'duration_min', 'priority', 'due', 'depends_on', 'automation', 'done_definition']
      },
    },
    notes: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['big_task', 'context', 'checklist', 'notes']
};


const systemPrompt = `당신은 ‘할 일 분해 코치(Decomposer)’입니다. 입력된 큰일을 5~12개의 실행 가능한 소단위로 분해하고, 각 단계에 가장 적절한 이모지 하나를 emoji 필드에 추가하세요. 그리고 prep, duration_min, priority, due, depends_on, automation, done_definition을 포함한 JSON을 생성하세요. 한국어로 작성합니다. 야외/이동·강사·일정관리 규칙을 반영하고, 마지막에 검토/기록 단계 포함.`;

export const decomposeTask = async (bigTask: string): Promise<ChecklistResponse> => {
  const userPrompt = `큰일: ${bigTask}\n역할: null\n마감/기한: null\n장소: null\n사용 도구: []`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    let text = response.text.trim();
    
    // 마크다운 코드 블록 형식 처리 (```json ... ```)
    if (text.startsWith('```json')) {
      text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith('```')) {
      text = text.substring(3, text.length - 3).trim();
    }

    if (!text) {
        throw new Error("API 응답이 비어있습니다.");
    }
    
    const parsedJson = JSON.parse(text);
    return parsedJson as ChecklistResponse;

  } catch (error) {
    console.error("Gemini API 호출 또는 JSON 파싱 중 오류 발생:", error);
    if (error instanceof SyntaxError) {
      throw new Error("API로부터 유효하지 않은 형식의 응답을 받았습니다. 다시 시도해 주세요.");
    }
    throw new Error("작업을 분해하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};

const subTaskResponseSchema = {
    type: Type.OBJECT,
    properties: {
        sub_tasks: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "세분화된 작업 항목의 제목입니다." },
                },
                required: ['title']
            },
            description: "2개에서 5개 사이의 세분화된 작업 목록입니다."
        }
    },
    required: ['sub_tasks']
};

const subTaskSystemPrompt = `당신은 작업을 세분화하는 전문가입니다. 주어진 상위 작업을 2개에서 5개 사이의 더 작고 구체적이며 실행 가능한 하위 작업으로 나누세요. 응답은 'sub_tasks' 키를 가진 JSON 객체로만 해야 하며, 이 키의 값은 각 객체에 'title' 키가 있는 객체들의 배열입니다. 제목은 간결하게 한국어로 작성하세요.`;

export const decomposeSubTask = async (parentTask: { title: string; description: string }): Promise<SubTask[]> => {
    const userPrompt = `상위 작업 제목: ${parentTask.title}\n상위 작업 설명: ${parentTask.description}\n\n위 작업을 2-5개의 하위 작업으로 쪼개주세요.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: subTaskSystemPrompt,
                responseMimeType: 'application/json',
                responseSchema: subTaskResponseSchema,
            },
        });

        let text = response.text.trim();
        if (text.startsWith('```json')) {
            text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith('```')) {
            text = text.substring(3, text.length - 3).trim();
        }

        if (!text) {
            throw new Error("API 응답이 비어있습니다.");
        }

        const parsedJson = JSON.parse(text);
        return (parsedJson.sub_tasks || []) as SubTask[];
    } catch (error) {
        console.error("하위 작업 분해 중 오류 발생:", error);
        throw new Error("하위 작업을 분해하는 중 오류가 발생했습니다.");
    }
};