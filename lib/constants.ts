export interface Project {
  id: string;
  year: string;
  title: string;
  icon?: string;
  role: string;
  desc: string;
  tags: string[];
  href: string | null;
  privacyHref?: string;
}

export interface StackItem {
  name: string;
  icon?: string;
  src?: string;
  mono?: string;
  level?: string;
}

export interface StackGroup {
  group: string;
  items: StackItem[];
}

export const PROJECTS: Project[] = [
  {
    id: 'P-001', year: '2026', title: 'KATARIBE',
    icon: '/assets/kataribe-icon.png',
    role: 'Solo Developer · Designer',
    desc: 'AI-guided historical-spot map app for iOS. SwiftUI client + AWS Lambda backend. AI character "Kunato" narrates landmarks via Bedrock; map shows nearby castles, shrines, and battlefields from your location.',
    tags: ['SWIFTUI', 'LAMBDA', 'BEDROCK', 'AI'],
    href: 'https://apps.apple.com/jp/app/kataribe-%E6%AD%B4%E5%8F%B2%E3%82%B9%E3%83%9D%E3%83%83%E3%83%88%E6%95%A3%E7%AD%96%E3%83%9E%E3%83%83%E3%83%97/id6759606727',
    privacyHref: 'https://noctan17.github.io/kataribe/privacy/',
  },
  {
    id: 'P-002', year: '2025', title: 'TexCrafter',
    role: 'Solo Developer · In Development',
    desc: 'A LaTeX editor for university students and researchers. Real-time preview, project management, and citation handling. Built with React on the front and Node.js on the back.',
    tags: ['REACT', 'NODE.JS', 'LATEX', 'WIP'],
    href: null,
  },
  {
    id: 'P-003', year: '2024', title: 'noctana-web',
    role: 'Solo Developer',
    desc: 'Personal portfolio site. React + Vite + Tailwind CSS, deployed on Firebase Hosting via GitHub Actions. Simple static site that introduces myself.',
    tags: ['REACT', 'VITE', 'TAILWIND', 'FIREBASE'],
    href: null,
  },
];

export const STACK: StackGroup[] = [
  { group: 'BACKEND', items: [
    { name: 'Python', icon: 'python', level: 'EXPERT' },
    { name: 'Java', icon: undefined, src: '/assets/icon-java.png' },
    { name: 'Scala', icon: 'scala' },
    { name: 'Node.js', icon: 'nodedotjs' },
    { name: 'PostgreSQL', icon: 'postgresql' },
  ]},
  { group: 'FRONTEND', items: [
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'React', icon: 'react' },
    { name: 'Next.js', icon: 'nextdotjs' },
    { name: 'Vue', icon: 'vuedotjs' },
    { name: 'Tailwind CSS', icon: 'tailwindcss' },
  ]},
  { group: 'CLOUD / INFRA', items: [
    { name: 'AWS', icon: undefined, src: '/assets/icon-aws.png', level: 'EXPERT' },
    { name: 'Snowflake', icon: 'snowflake' },
    { name: 'Terraform', icon: 'terraform' },
    { name: 'Docker', icon: 'docker' },
    { name: 'Linux', icon: 'linux' },
    { name: 'GitHub Actions', icon: 'githubactions' },
  ]},
];

export const HERO_NAME = 'NOCTANA';
export const HERO_ROLE = 'Full Stack Developer';
export const HERO_EFFECT: string = 'Motion Rush';
export const SHOW_SCANLINES = true;
export const SHOW_HUD = true;
export const SHOW_GRID = true;
