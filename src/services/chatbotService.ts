import { projectService } from './projectService';
import { experienceService } from './experienceService';
import { techStackService } from './techStackService';

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

// Only the most recent turns are sent, to keep requests small and fast
const MAX_HISTORY = 10;

const PROFILE = `Name: Rhenel Jhon Sajol
Role: Full-Stack Developer
Education: Computer Science student, University of Science and Technology of Southern Philippines (USTP)
Location: Cagayan de Oro, Philippines (open to remote work)
Availability: Open to full-time roles and freelance work
Email: sajol.rhenel123@gmail.com
GitHub: https://github.com/Tetsuuya
LinkedIn: https://www.linkedin.com/in/rhenel-jhon-sajol-360275324/
Contact form: the "Contacts" page of this website`;

let portfolioContextPromise: Promise<string> | null = null;

// Builds a plain-text snapshot of the portfolio data so answers are grounded in real facts
const loadPortfolioContext = (): Promise<string> => {
  if (!portfolioContextPromise) {
    portfolioContextPromise = Promise.all([
      projectService.fetchProjects().catch(() => []),
      experienceService.fetchExperience().catch(() => []),
      techStackService.fetchTechStack().catch(() => []),
    ]).then(([projects, experience, techStack]) => {
      const projectLines = projects.map((p) =>
        [
          `- ${p.name}${p.featured ? ' (featured)' : ''}: ${p.description}`,
          p.techStack?.length ? `  Tech: ${p.techStack.join(', ')}` : '',
          p.html_url ? `  Live demo: ${p.html_url}` : '',
          p.repo_url ? `  Code: ${p.repo_url}` : '',
        ].filter(Boolean).join('\n')
      );

      const experienceLines = experience.map((e) =>
        [
          `- ${e.role} at ${e.company} (${e.duration})${e.location ? `, ${e.location}` : ''}`,
          `  ${e.description}`,
          ...(e.key_achievements ?? []).map((a) => `  * ${a}`),
          e.tech_stack?.length ? `  Tech: ${e.tech_stack.join(', ')}` : '',
        ].filter(Boolean).join('\n')
      );

      const techByCategory = techStack.reduce<Record<string, string[]>>((acc, t) => {
        (acc[t.category] ??= []).push(t.name);
        return acc;
      }, {});
      const techLines = Object.entries(techByCategory).map(
        ([category, names]) => `- ${category}: ${names.join(', ')}`
      );

      return [
        `PROFILE\n${PROFILE}`,
        `PROJECTS\n${projectLines.join('\n')}`,
        `EXPERIENCE\n${experienceLines.join('\n')}`,
        `TECH STACK\n${techLines.join('\n')}`,
      ].join('\n\n');
    });
  }
  return portfolioContextPromise;
};

export const chatbotService = {
  /**
   * Sends a message to Groq API and gets a response grounded in the portfolio data
   */
  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const groqApiKey = getEnvVar('VITE_GROQ_API_KEY');
    const portfolioContext = await loadPortfolioContext();

    const messages = [
      {
        role: 'system',
        content: `You are the assistant on Rhenel Jhon Sajol's portfolio website. Visitors are often recruiters and hiring managers.

Rules:
- Answer only using the PORTFOLIO DATA below. If something isn't covered, say you don't know and suggest contacting Rhenel directly at sajol.rhenel123@gmail.com.
- Never invent projects, employers, dates, metrics or skills.
- Be warm, confident and concise: 2-5 short sentences, or a short bullet list when listing things.
- Refer to Rhenel by name.
- When relevant, include live demo or code links, and end hiring-related answers by pointing to the email or the Contacts page.
- Use simple Markdown only: **bold**, bullet lists starting with "- ", and plain URLs.

PORTFOLIO DATA
${portfolioContext}`,
      },
      ...conversationHistory.slice(-MAX_HISTORY),
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
        temperature: 0.3,
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
