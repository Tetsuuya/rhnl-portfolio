export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
  location?: string | null;
  job_type?: string | null;
  key_achievements?: string[] | null;
  tech_stack?: string[] | null;
}

export const fallbackExperienceData: Experience[] = [
  {
    id: 1,
    company: 'Freelance & Independent Projects',
    role: 'Full-Stack Developer',
    duration: 'Jan 2024 - Present',
    location: 'Cagayan de Oro, Philippines (Remote)',
    job_type: 'Full-time',
    description: 'Developed modern, responsive web applications and booking systems using React.js, Next.js, and Supabase. Designed database schemas, implemented secure API endpoints, and set up Row Level Security (RLS) policies for portfolio projects.',
    key_achievements: [
      'Built and deployed dynamic e-commerce and booking platforms using Next.js and Tailwind CSS.',
      'Designed efficient database schemas in Supabase (PostgreSQL) and set up secure Row Level Security (RLS) policies.',
      'Optimized backend services resulting in significantly reduced load times for client websites.'
    ],
    tech_stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL']
  },
  {
    id: 2,
    company: 'Academic & Personal Ventures',
    role: 'Web Application Developer',
    duration: 'Jun 2022 - Dec 2023',
    location: 'Cagayan de Oro, Philippines (On-site)',
    job_type: 'Part-time',
    description: 'Built multiple database-driven projects including rental/reservation management apps, personal portfolios, and custom tools. Leveraged Python (Django, Flask, FastAPI) and SQL (PostgreSQL, MySQL) to build robust backends.',
    key_achievements: [
      'Developed multi-tenant rental management system using Django and PostgreSQL.',
      'Implemented custom API integrations for secure data retrieval and payment mockups.',
      'Authored clean, documented code and maintained project codebases via Git.'
    ],
    tech_stack: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'MySQL', 'Git']
  }
];
