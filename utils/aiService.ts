import axios from 'axios';

// Use environment variable for API key
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

export interface AiResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Generate AI wellness insights based on user's check-in data
 * Uses Google Gemini API to analyze mood patterns and provide recommendations
 */
export const generateWellnessInsight = async (
  mood: number,
  journal: string,
  userGoal: string,
  previousMoods: number[]
): Promise<AiResponse> => {
  if (!GEMINI_API_KEY) {
    return {
      text: 'API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.',
      success: false,
      error: 'Missing API key',
    };
  }

  try {
    const moodTrend = previousMoods.length > 0 
      ? `Average mood: ${(previousMoods.reduce((a, b) => a + b, 0) / previousMoods.length).toFixed(1)}/10`
      : 'No previous data';

    const prompt = `You are a compassionate mental wellness advisor. Based on the following user check-in, provide a brief, empathetic wellness insight (2-3 sentences max):

Current Mood: ${mood}/10
Journal Entry: "${journal}"
User's Wellness Goal: ${userGoal}
${moodTrend}

Provide a supportive insight or recommendation without medical diagnosis. Keep it concise and actionable.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        params: {
          key: GEMINI_API_KEY,
        },
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        text: 'Unable to generate insight. Please try again.',
        success: false,
      };
    }

    return {
      text,
      success: true,
    };
  } catch (error) {
    console.error('Error generating wellness insight:', error);
    return {
      text: 'Failed to generate insight. Please check your internet connection and try again.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Analyze mood patterns and trends
 * Provides insights about mood trajectory
 */
export const analyzeMoodPatterns = async (
  checkIns: Array<{ date: string; mood: number }>,
  userName: string
): Promise<AiResponse> => {
  if (!GEMINI_API_KEY) {
    return {
      text: 'API key not configured.',
      success: false,
      error: 'Missing API key',
    };
  }

  if (checkIns.length < 2) {
    return {
      text: 'Not enough data yet. Keep logging your mood to see patterns!',
      success: true,
    };
  }

  try {
    const moodData = checkIns
      .slice(0, 10)
      .map(ci => `${ci.date}: ${ci.mood}/10`)
      .join('\n');

    const prompt = `Analyze the following mood tracking data for ${userName} and provide 2-3 sentence insights about mood patterns and trends:

${moodData}

Be encouraging and offer one small actionable suggestion to improve wellbeing.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        params: {
          key: GEMINI_API_KEY,
        },
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      text: text || 'Unable to analyze patterns.',
      success: !!text,
    };
  } catch (error) {
    console.error('Error analyzing mood patterns:', error);
    return {
      text: 'Failed to analyze patterns. Please try again later.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
