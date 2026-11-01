import { projectService } from './projectService';
import { experienceService } from './experienceService';
import { techStackService } from './techStackService';
import type { Project } from '../data/projects';
import type { Experience } from '../data/experience';
import type { TechItem } from '../data/techStack';

const EMAIL = 'sajol.rhenel123@gmail.com';
const GITHUB = 'https://github.com/Tetsuuya';
const LINKEDIN = 'https://www.linkedin.com/in/rhenel-jhon-sajol-360275324/';

const CATEGORY_LABELS: Record<string, string> = {
  Language: 'Languages',
  Framework: 'Frameworks',
  Database: 'Databases',
  'DevOps & Cloud Platforms': 'DevOps & Cloud',
  Tool: 'Tools',
  Design: 'Design',
};

interface PortfolioData {
  projects: Project[];
  experience: Experience[];
  techStack: TechItem[];
}

let portfolioDataPromise: Promise<PortfolioData> | null = null;

// Loaded once and reused, so answers always reflect the latest portfolio data
const loadPortfolioData = (): Promise<PortfolioData> => {
  if (!portfolioDataPromise) {
    portfolioDataPromise = Promise.all([
      projectService.fetchProjects().catch(() => []),
      experienceService.fetchExperience().catch(() => []),
      techStackService.fetchTechStack().catch(() => []),
    ]).then(([projects, experience, techStack]) => ({ projects, experience, techStack }));
  }
  return portfolioDataPromise;
};

const contactLine = `You can reach Rhenel at ${EMAIL} or through the **Contacts** page.`;

const describeProject = (p: Project) =>
  [
    `**${p.name}**: ${p.description}`,
    p.techStack?.length ? `- Built with: ${p.techStack.join(', ')}` : '',
    p.html_url ? `- Live demo: ${p.html_url}` : '',
    p.repo_url ? `- Code: ${p.repo_url}` : '',
  ].filter(Boolean).join('\n');

const answers = {
  greeting: () =>
    "Hi! 👋 I can tell you about Rhenel's **projects**, **tech stack**, **experience**, **availability**, or how to **get in touch**. What would you like to know?",

  thanks: () => `You're welcome! ${contactLine}`,

  availability: () =>
    `Yes! Rhenel is **open to full-time roles and freelance work**, and is based in Cagayan de Oro, Philippines (remote-friendly).\n\n${contactLine}`,

  contact: () =>
    `Here's how to reach Rhenel:\n- Email: ${EMAIL}\n- LinkedIn: ${LINKEDIN}\n- GitHub: ${GITHUB}\n\nOr send a message through the **Contacts** page.`,

  education: () =>
    'Rhenel is a **Computer Science student** at the University of Science and Technology of Southern Philippines (USTP) in Cagayan de Oro.',

  location: () =>
    'Rhenel is based in **Cagayan de Oro, Philippines** and is open to remote work.',

  resume: () => `For a résumé, email Rhenel at ${EMAIL} and one will be sent your way.`,

  projects: ({ projects }: PortfolioData) => {
    const featured = projects.filter((p) => p.featured);
    const list = (featured.length ? featured : projects).slice(0, 5);
    if (!list.length) return `Projects are loading right now. You can browse them on the **Projects** page.`;
    return `Here are some of Rhenel's featured projects:\n${list
      .map((p) => `- **${p.name}**: ${p.html_url}`)
      .join('\n')}\n\nAsk about any of them by name for details, or see everything on the **Projects** page.`;
  },

  experience: ({ experience }: PortfolioData) => {
    if (!experience.length) return 'You can see Rhenel’s work history on the **Experience** page.';
    return `Rhenel's experience:\n${experience
      .map((e) => `- **${e.role}** at ${e.company} (${e.duration})`)
      .join('\n')}\n\nThe full details are on the **Experience** page.`;
  },

  stack: ({ techStack }: PortfolioData) => {
    if (!techStack.length) return 'Rhenel works with React, Next.js, TypeScript, Django, FastAPI and Supabase.';
    const byCategory = techStack.reduce<Record<string, string[]>>((acc, t) => {
      (acc[t.category] ??= []).push(t.name);
      return acc;
    }, {});
    return `Rhenel's tech stack:\n${Object.entries(byCategory)
      .map(([cat, names]) => `- **${CATEGORY_LABELS[cat] ?? cat}**: ${names.join(', ')}`)
      .join('\n')}`;
  },

  fallback: () =>
    `I'm not sure about that one. I can answer questions about Rhenel's **projects**, **tech stack**, **experience**, **education**, or **availability**.\n\nFor anything else: ${EMAIL}`,
};

const matches = (text: string, words: string[]) => words.some((w) => new RegExp(`\\b${w}`, 'i').test(text));

export const chatbotService = {
  /**
   * Returns a preset answer for the visitor's question, filled in with live portfolio data
   */
  async sendMessage(message: string): Promise<string> {
    const text = message.toLowerCase();
    const data = await loadPortfolioData();

    // A specific project mentioned by name gets its own detailed answer
    const project = data.projects.find((p) => {
      const name = p.name.toLowerCase().split(/[-:(]/)[0].trim();
      return name.length > 2 && text.includes(name);
    });

    // Short pause so replies feel conversational rather than instant
    await new Promise((resolve) => setTimeout(resolve, 450));

    if (project) return describeProject(project);
    if (/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/.test(text.trim())) return answers.greeting();
    if (/\b(thanks?|thank you|ty)\b/.test(text)) return answers.thanks();
    if (matches(text, ['open to', 'available', 'availability', 'hire', 'hiring', 'freelance', 'full-time', 'full time', 'job'])) return answers.availability();
    if (matches(text, ['resume', 'résumé', 'cv'])) return answers.resume();
    if (matches(text, ['contact', 'email', 'reach', 'linkedin', 'github', 'message', 'call'])) return answers.contact();
    if (matches(text, ['experience', 'work history', 'worked', 'work at', 'work for', 'company', 'companies', 'role', 'intern', 'career'])) return answers.experience(data);
    if (matches(text, ['stack', 'tech', 'skill', 'language', 'framework', 'tool', 'database', 'know'])) return answers.stack(data);
    if (matches(text, ['project', 'portfolio', 'built', 'build', 'app', 'work', 'strongest', 'best'])) return answers.projects(data);
    if (matches(text, ['school', 'study', 'studies', 'university', 'college', 'education', 'student', 'degree', 'ustp'])) return answers.education();
    if (matches(text, ['where', 'location', 'based', 'remote', 'country', 'city'])) return answers.location();

    return answers.fallback();
  },
};
