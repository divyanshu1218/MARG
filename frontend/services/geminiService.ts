import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, AIRecommendation, College, NewsNotification } from '../types';
import { COLLEGES_DATA } from "../constants";

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getAI = () => {
  if (!ai) {
    const apiKey =
      import.meta.env?.VITE_GEMINI_API_KEY ??
      (typeof process !== "undefined"
        ? process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY
        : undefined);

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }

    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const startChat = async (): Promise<void> => {
  const aiInstance = getAI();
  chat = aiInstance.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are MARG AI. MARG stands for Mentorship & Academic Roadmap Guide. Your goal is to be a helpful, supportive, and insightful career guide for students.
Your primary function is to act as a conversational navigator for the MARG platform and to answer career-related questions.

NAVIGATION:
- The user can ask you to go to different pages like the career explorer, quiz, or dashboards.
- When a user asks to navigate, your response should simply be a brief, natural confirmation. For example, if the user says "show me design careers", a good response is "Of course, let's explore careers in Design." The application itself handles the navigation; your role is to provide the conversational text.
- You MUST NOT use phrases like "Navigating you to..." or "Here is the page...". Just confirm their request in a friendly, conversational way.

TONE:
- Your tone should be encouraging, professional, and friendly.
- Keep responses concise and easy to understand.
- Use formatting like bullet points to make information easy to read.`,
    },
  });
};

export const sendMessageToAI = async (message: string, history: ChatMessage[]): Promise<string> => {
  try {
    if (!chat) {
      await startChat();
    }
    if (!chat) {
        throw new Error("Chat not initialized");
    }

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    
    const finishReason = result.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        console.warn(`Chat generation stopped for reason: ${finishReason}`);
        return `I'm sorry, my response was interrupted. Reason: ${finishReason}.`;
    }

    const responseText = result.text;
    if (responseText) {
        return responseText;
    }
    
    return "I'm sorry, I couldn't formulate a response. Please try asking in a different way.";
  } catch (error) {
    console.error("Error sending message to AI:", error);
    return "I'm sorry, but I'm having trouble connecting right now. Please try again later.";
  }
};

export const getCareerDetails = async (careerTitle: string): Promise<string> => {
  try {
    const aiInstance = getAI();
    const prompt = `Provide a concise overview for a student interested in a career as a "${careerTitle}". Include these sections:
- **Description:** A brief, engaging summary of the role.
- **Key Responsibilities:** 3-4 bullet points.
- **Skills Needed:** 3-4 essential skills.
- **Education Path:** Typical degrees or certifications.
- **Salary Range:** A general estimate for entry-level to experienced.
- **Future Outlook:** A brief comment on job growth potential.
- **Suggested Resources:** A bulleted list of 1-2 high-quality, relevant external resources (like a specific, reputable article, an insightful video, or a professional organization website). Please format these using markdown links like "[Resource Title](URL)".

Keep the language encouraging and easy to understand. Use markdown for formatting, including bolding for headers.`;

    const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        console.warn(`AI generation for "${careerTitle}" stopped for reason: ${finishReason}`);
        return `I was unable to generate the full details. Reason: ${finishReason}. Please try again.`;
    }

    const responseText = response.text;
    if (responseText) {
        return responseText;
    }

    return "Sorry, I received an unexpected response from the AI. I couldn't get the details for this career.";
  } catch (error) {
      console.error(`Error getting details for ${careerTitle}:`, error);
      throw new Error("Failed to fetch career details from AI.");
  }
};

export const getQuizRecommendations = async (
    stage: string,
    city: string,
    answers: { [key: number]: string }
): Promise<AIRecommendation> => {
    try {
        const aiInstance = getAI();

        const answersString = Object.entries(answers)
            .map(([questionId, answer]) => `Question ${questionId}: "${answer}"`)
            .join('\n');

        const prompt = `Act as an expert career counselor for an Indian student. The student is at the "${stage}" educational stage and lives in "${city}".

Student's Quiz Answers:
${answersString}

Your task is to generate a personalized career recommendation report. Your response MUST be a valid JSON object following the provided schema. The report must contain:

1.  A concise, encouraging, and stage-appropriate "conclusion" (2-3 sentences) summarizing a potential career path that aligns with their answers.
2.  A list of "colleges" from the provided list, categorized by proximity to the student's city ("${city}").
    - "nearby": 1-2 colleges from the list located in "${city}".
    - "inState": 1-2 colleges from the list in the same state as "${city}", but not in the city itself.
    - "national": 2-3 top national colleges from the list outside the student's home state.
    Ensure your selections are relevant to the recommended career path.
3.  A list of 3-4 helpful "resources" (like specific YouTube videos, reputable websites, or insightful articles) that are relevant to the student's stage and recommended path.

Here is the complete list of available colleges to choose from for your recommendations:
${JSON.stringify(COLLEGES_DATA, null, 2)}
`;

        const collegeSchema = {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.NUMBER },
                name: { type: Type.STRING },
                city: { type: Type.STRING },
                state: { type: Type.STRING },
                type: { type: Type.STRING },
                annualFees: { type: Type.NUMBER }
            },
            required: ["id", "name", "city", "state", "type", "annualFees"]
        };

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                conclusion: {
                    type: Type.STRING,
                    description: "A summary of the recommended career path for the student."
                },
                colleges: {
                    type: Type.OBJECT,
                    description: "Tiered list of recommended colleges based on proximity.",
                    properties: {
                        nearby: { type: Type.ARRAY, items: collegeSchema },
                        inState: { type: Type.ARRAY, items: collegeSchema },
                        national: { type: Type.ARRAY, items: collegeSchema }
                    },
                     required: ["nearby", "inState", "national"]
                },
                resources: {
                    type: Type.ARRAY,
                    description: "A list of helpful online resources.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            url: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['video', 'article', 'website'] }
                        },
                         required: ["title", "url", "type"]
                    }
                }
            },
             required: ["conclusion", "colleges", "resources"]
        };

        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
             throw new Error(`AI generation stopped unexpectedly. Reason: ${finishReason}`);
        }

        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("Received an empty response from the AI.");
        }
        
        try {
            return JSON.parse(jsonText.trim()) as AIRecommendation;
        } catch (e) {
            console.error("Failed to parse JSON from AI response:", jsonText);
            throw new Error("The AI returned a malformed recommendation. Please try again.");
        }

    } catch (error) {
        console.error("Error getting quiz recommendations:", error);
        if (error instanceof Error) {
            throw error; // Re-throw the original error if it's already an Error instance
        }
        throw new Error("Failed to fetch quiz recommendations from AI.");
    }
};

export const findColleges = async (
    careerTitle: string,
    budget: string,
    location: string,
    collegeType: string
): Promise<College[]> => {
    try {
        const aiInstance = getAI();

        const budgetDescription = budget.trim() === '' ? 'any budget' : `a budget described as: "${budget}"`;
        const locationDescription = location.trim() === '' ? 'any location in India' : `a location like: "${location}"`;
        const typeDescription = collegeType.trim() === '' ? 'any college type' : `a college type like: "${collegeType}"`;

        const prompt = `
            You are an expert college recommender for an Indian student.
            The student is interested in a career as a "${careerTitle}".
            
            Your primary directive is to use Google Search to find real-time, up-to-the-minute information on up to 10 colleges in India suitable for this career. Your response must be based *only* on the most current search results. Under no circumstances should you use any cached, pre-existing, or static knowledge you may have. The results MUST reflect the state of college admissions and fees as of today. This is a critical requirement.

            Intelligently filter your search based on the student's preferences:
            - Budget: ${budgetDescription}
            - Location: ${locationDescription}
            - College Type: ${typeDescription}

            You MUST respond ONLY with a valid JSON array of college objects that match the specified criteria. Do not include any text, explanations, or markdown formatting like \`\`\`json outside of the JSON array itself.
            For each college object, include these keys: "name", "city", "state", "type", "annualFees". If you can find it, also include a "website" key with the official URL.

            **Crucial Interpretation Instructions:**
            1.  **Location:** Your matching must be flexible. Be tolerant of common spelling mistakes (e.g., 'maharastra' for 'Maharashtra'), abbreviations ('MH' for Maharashtra, 'UP' for Uttar Pradesh, 'blr' for 'Bengaluru'), and alternate or historical names ('Bombay' for 'Mumbai', 'bangalore' vs 'Bengaluru'). A search for a state should include major cities within that state.
            2.  **Budget:** Interpret a wide range of colloquial and numeric terms.
                - "cheap", "affordable", "low cost", "under 2 lakhs", "less than 200000" means annual fees <= 200000.
                - "mid-range", "2 to 5 lakhs", "average fees" means annual fees are between 200001 and 500000.
                - "expensive", "premium", "high fees", "above 5 lakhs" means annual fees > 500000.
                If no term is provided, consider all budgets.
            3.  **College Type:** Interpret common variations like "govt" as "Government", "pvt" as "Private", etc.

            If you cannot find any matching colleges, you MUST return an empty array [].
        `;

        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            return [];
        }

        const sanitizedJsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        
        try {
            return JSON.parse(sanitizedJsonText) as College[];
        } catch (e) {
            console.error("Failed to parse JSON from AI response:", sanitizedJsonText);
            throw new Error("The AI returned a malformed college list. Please try again.");
        }

    } catch (error) {
        console.error("Error finding colleges:", error);
        if (error instanceof Error) throw error;
        throw new Error("Failed to fetch college recommendations from AI.");
    }
};


export const getRealtimeNews = async (): Promise<NewsNotification[]> => {
  try {
    const aiInstance = getAI();
    const prompt = `
      You are an AI assistant for MARG, an Indian career guidance platform.
      Your task is to find the 4 most recent and important news updates and resources for students in India.
      Focus on these categories: EXAM, ADMISSION, SCHOLARSHIP, DEADLINE, RESOURCE.
      A 'RESOURCE' could be a helpful guide, a new online tool, or an important educational website.
      Use Google Search to get the latest information.
      For each item, provide a title, a short description (1-2 sentences), a relative timestamp (e.g., "Posted 2 hours ago"), and the source URL.
      Your response MUST be a valid JSON array of objects. Do not include any text, explanations, or markdown formatting like \`\`\`json outside of the JSON array itself.
      The JSON format for each object should be:
      {
        "category": "EXAM" | "ADMISSION" | "SCHOLARSHIP" | "DEADLINE" | "RESOURCE",
        "title": "...",
        "description": "...",
        "timestamp": "...",
        "url": "..."
      }
    `;

    const response: GenerateContentResponse = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const jsonText = response.text.trim();
    const sanitizedJsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    try {
      return JSON.parse(sanitizedJsonText) as NewsNotification[];
    } catch (e) {
      console.error("Failed to parse JSON from AI response:", sanitizedJsonText, e);
      throw new Error("The AI returned a malformed news list.");
    }

  } catch (error) {
    console.error("Error getting real-time news:", error);
    throw new Error("Failed to fetch news from AI.");
  }
};