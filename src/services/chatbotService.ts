interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const chatbotService = {
  /**
   * Sends a message to Groq API and gets a response
   */
  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const groqApiKey = getEnvVar('VITE_GROQ_API_KEY');

    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant for Rhenel Jhon Sajol\'s portfolio website. You help visitors learn about Rhenel, his skills, projects, and answer questions about his work. Be friendly, professional, and concise.',
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message,
      },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Fast and efficient model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Failed to get response: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  },
};

