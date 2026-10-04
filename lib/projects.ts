export type ProjectCard = {
  slug: string;
  title: string;
  desc: string;
  tech: string[];
  color: string;
  visual: string;
  featured?: boolean;
  heroImage?: string;
  githubUrl?: string;
  liveUrl?: string;
};

export type ProjectDetail = ProjectCard & {
  tagline: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  architecture: string;
  challenges: string;
  lessons: string;
  gallery: string[];
  results: string[];
  liveUrl?: string;
  githubUrl?: string;
};
