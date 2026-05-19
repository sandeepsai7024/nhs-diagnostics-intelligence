import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DEFAULT_MODEL = "gemini-flash-latest"; // Supported stable alias

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 503 || error.status === 429)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function getAiInsights(data: any) {
  try {
    const prompt = `
      You are an NHS Operational Analyst. Analyze the following diagnostic performance data and provide:
      1. An executive summary of current pressure.
      2. Identification of the primary pathology bottleneck.
      3. Three actionable recommendations for staffing and capacity optimization.
      4. A calculated risk score (0-100) for diagnostic delays across the region.

      DATA:
      ${JSON.stringify(data)}

      Format the response as JSON with the following structure:
      {
        "executiveSummary": string,
        "bottleneckAnalysis": string,
        "recommendations": string[],
        "riskScore": number,
        "criticalAlerts": string[]
      }
    `;

    const responseData = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              bottleneckAnalysis: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskScore: { type: Type.NUMBER },
              criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      return response.text;
    });

    return JSON.parse(responseData || '{}');
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      executiveSummary: "Unable to generate insights at this time.",
      bottleneckAnalysis: "Pathology backlog monitoring active.",
      recommendations: ["Review manual reporting protocols", "Audit lab turnaround times"],
      riskScore: 50,
      criticalAlerts: ["AI insight engine temporarily limited"]
    };
  }
}

export async function chatAssistant(message: string, context: any) {
    try {
        const responseData = await withRetry(async () => {
            const response = await ai.models.generateContent({
                model: DEFAULT_MODEL,
                contents: `
                    You are "Ask DNA", the NHS Diagnostics Intelligence Chat Assistant. 
                    You provide highly professional, operational healthcare intelligence.
                    Answer the user's question based on the provided dashboard context.
                    Be concise, authoritative, and data-driven.

                    CONTEXT:
                    ${JSON.stringify(context)}

                    USER: ${message}
                `,
                config: {
                    systemInstruction: "You are an NHS high-level operational director assistant."
                }
            });
            return response.text;
        });
        return responseData;
    } catch (error) {
        return "I'm having trouble connecting to the diagnostic database right now. Please try again in a moment.";
    }
}
