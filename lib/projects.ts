export type ProjectCard = {
  slug: string;
  title: string;
  desc: string;
  tech: string[];
  color: string;
  visual: string;
  featured?: boolean;
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
  liveUrl?: string;
  githubUrl?: string;
};

export const PROJECTS: ProjectCard[] = [
  {
    slug: "auditflow",
    title: "AUDITFLOW",
    desc: "Compliance management platform — audits, evidence and workflows in one place.",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Supabase"],
    color: "bg-brand-blue",
    visual: "{ audit }",
    featured: true,
  },
  {
    slug: "creasy-eco",
    title: "CREASY ECO",
    desc: "Marketplace experiment for sustainable local products.",
    tech: ["React", "Node.js", "PostgreSQL"],
    color: "bg-brand-teal",
    visual: "< shop />",
  },
  {
    slug: "otflow",
    title: "OTFLOW",
    desc: "Overtime tracking for operations teams.",
    tech: ["Next.js", "Supabase"],
    color: "bg-brand-yellow",
    visual: "[ shifts ]",
  },
  {
    slug: "pixel-quest",
    title: "PIXEL QUEST",
    desc: "Tiny game prototype — player systems and world events.",
    tech: ["C#", "Unity"],
    color: "bg-brand-pink",
    visual: "► play",
  },
];

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  auditflow: {
    ...PROJECTS[0],
    tagline: "Compliance work without the spreadsheet chaos.",
    overview:
      "AuditFlow centralizes audits, evidence collection and follow-ups for teams that live in spreadsheets and email threads.",
    problem:
      "Compliance evidence was scattered across drives, chats and inboxes. Nobody knew what was done, what was missing, or who owned it.",
    solution:
      "A single workspace: structured audits, attachable evidence, clear ownership and status at a glance.",
    features: [
      "Audit workspace with structured checklists",
      "Evidence uploads with status tracking",
      "Role-based access and activity timeline",
      "Dashboard of open vs. closed items",
    ],
    architecture:
      "Next.js App Router frontend, Prisma over PostgreSQL for relational audit data, Supabase for auth and file storage. Server Actions handle mutations with Zod validation.",
    challenges:
      "Modeling flexible audit templates without turning the schema into soup. Solved with a template + response split and strict validation.",
    lessons:
      "Boring data modeling beats clever UI. Getting the audit/item/evidence relations right made every feature easier.",
    githubUrl: "https://github.com",
  },
  "creasy-eco": {
    ...PROJECTS[1],
    tagline: "A small marketplace with a green bias.",
    overview:
      "Creasy Eco is a marketplace experiment listing sustainable local products with simple seller onboarding.",
    problem:
      "Local eco sellers had no lightweight place to list products without marketplace fees and complexity.",
    solution:
      "A minimal catalog with seller profiles, product listings and inquiry flow — no heavy checkout to start.",
    features: ["Product catalog", "Seller profiles", "Inquiry flow"],
    architecture:
      "React frontend with a Node.js API and PostgreSQL. Focus on fast catalog reads and simple writes.",
    challenges: "Keeping seller onboarding under 2 minutes while still getting usable data.",
    lessons: "Launch with inquiry instead of full checkout; validate demand first.",
  },
  otflow: {
    ...PROJECTS[2],
    tagline: "Overtime, minus the paperwork.",
    overview:
      "OTFlow tracks overtime requests and approvals for operations teams.",
    problem:
      "Overtime was tracked on paper and chat messages — approvals got lost and payroll reconciliation hurt.",
    solution:
      "Submit, approve and review overtime in one feed with clear statuses.",
    features: ["OT request feed", "Approval states", "Monthly summary"],
    architecture: "Next.js + Supabase: auth, database and row-level security for team visibility.",
    challenges: "Designing states (pending/approved/rejected) that survive real-world exceptions.",
    lessons: "Status machines should be explicit from day one.",
  },
  "pixel-quest": {
    ...PROJECTS[3],
    tagline: "A tiny world to learn game systems.",
    overview:
      "Pixel Quest is a small prototype exploring player movement, world events and system feedback.",
    problem: "I wanted to understand game loops beyond tutorials.",
    solution: "Build a tiny playable loop: move, trigger events, get feedback.",
    features: ["Player controller", "World triggers", "Event feedback"],
    architecture: "Unity with C#: player, world and system scripts kept separate on purpose.",
    challenges: "Keeping scope tiny enough to finish.",
    lessons: "Finished small beats ambitious unfinished.",
  },
};

export function getProject(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS[slug];
}
