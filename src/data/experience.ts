export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export const fallbackExperienceData: Experience[] = [
  {
    id: 1,
    company: 'Freelance & Independent Projects',
    role: 'Full-Stack Developer',
    duration: 'Jan 2024 - Present',
    description: 'Developed modern, responsive web applications and booking systems using React.js, Next.js, and Supabase. Designed database schemas, implemented secure API endpoints, and set up Row Level Security (RLS) policies for portfolio projects.'
  },
  {
    id: 2,
    company: 'Academic & Personal Ventures',
    role: 'Web Application Developer',
    duration: 'Jun 2022 - Dec 2023',
    description: 'Built multiple database-driven projects including rental/reservation management apps, personal portfolios, and custom tools. Leveraged Python (Django, Flask, FastAPI) and SQL (PostgreSQL, MySQL) to build robust backends.'
  }
];
