export interface Project {
  id: number;
  name: string;
  description: string;
  image?: string; // Path to project image in /public/images/projects/
  image_position?: string; // CSS object-position e.g. "center top", "50% 30%"
  techStack?: string[];
  html_url: string;       // Live demo URL
  repo_url?: string;      // GitHub repo URL (optional)
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  featured?: boolean;
}

export const projectsData: Project[] = [
  {
    id: 1,
    name: 'Kangina',
    description: 'A full-stack online restaurant platform with a TypeScript frontend, Django backend, Vercel deployment, and Neon database.',
    image: '/images/projects/Kangina.png',
    techStack: ['TypeScript', 'Django', 'Vercel', 'Neon'],
    html_url: 'https://kangina.vercel.app/',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-05-06T00:00:00Z',
    featured: true,
  },
  {
    id: 2,
    name: 'Hi-Lite Studio',
    description: 'Hi-Lite Studio is a studio web application, developed to manage the studio’s creative portfolio, client bookings, and internal administration. It provides a smooth and efficient experience for both clients and administrators, while prioritizing security and responsiveness.',
    image: '/images/projects/Hi-Lite Studio.png',
    techStack: ['React', 'TypeScript', 'Vercel', 'Supabase','Groq api', 'Brevo Api'],
    html_url: 'https://hi-lite-studio.vercel.app/',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-05-06T00:00:00Z',
    featured: true,
  },
  {
    id: 3,
    name: 'Spark',
    description: 'A web-based anonymous voice chat platform that connects random strangers in real-time voice conversations. Built with Next.js, TypeScript, FastAPI, and WebRTC.',
    image: '/images/projects/Spark.png',
    techStack: ['Next.js', 'TypeScript', 'FastAPI', 'WebRTC'],
    html_url: 'https://spark-frontend-blond.vercel.app/',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-05-06T00:00:00Z',
    featured: true,
  },
  {
    id: 4,
    name: 'Trailguide',
    description: 'Trail Guide is a conversational assistant for the University of Science and Technology of Southern Philippines. It helps students and staff find answers from the USTP handbook, campus map, and course offerings through a chat-based interface.',
    image: '/images/projects/Trailguide.png',
    techStack: ['React', 'Next.js', 'Groq api', 'Vercel', 'Supabase'],
    html_url: 'https://trail-guide.vercel.app/',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-05-06T00:00:00Z',
    featured: true,

  },
  {
      id: 5,
      name: 'Nava',
      description: 'A modern web application notetaking app built with Next.js and Tailwind CSS, deployed on Vercel. It offers a sleek and intuitive interface for users to create, organize, and manage their notes efficiently. ',
      image: '/images/projects/Nava.png',
      techStack: ['React','Next.js', 'Tailwind CSS', 'Vercel'],
      html_url: 'https://nava-eight.vercel.app/',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: ""
  },
  {
      id: 6,
      name: 'EHCo',
      description: 'An Audio Compressor using Adaptive Huffman with DCT and RLE Algorithms.',
      image: '/images/projects/EHCo.png',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'C++'],
      html_url: 'https://github.com/Tetsuuya/EHCo_Audio_Compression_System',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: ""
  },
  {
      id: 7,
      name: 'CalcMate',
      description: 'CalcMate* is a Python-based calculator with a graphical user interface (GUI) built using tkinter. It lets users input mathematical functions and perform numerical integration with ease.',
      image: '/images/projects/CalcMate.png',
      techStack: ['Python', 'tkinter'],
      html_url: 'https://github.com/Tetsuuya/CALC-ME',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: ""
  },
  {
      id: 8,
      name: 'AUTMATION IN DNA/RNA PATTERN VISUALIZER',
      description: 'A web application for visualizing DNA and RNA patterns and C++ for model and pattern validation, built with Next.js and fastAPI, deployed on Vercel.',
      image: '/images/projects/DNA&RNA visualizer.png',
      techStack: ['Next.js', 'fastAPI', 'Vercel', 'C++'],
      html_url: 'https://automata-simulator-web.vercel.app/',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: ""
  }
];

