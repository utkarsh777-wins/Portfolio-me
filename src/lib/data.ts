/** Set true after adding `public/resume.pdf`. The Contact menu already has the slot. */
export const HAS_RESUME = false;

export const PROFILE = {
  name: 'Utkarsh Kumar',
  title: 'AI / ML Engineer',
  email: 'utkarsh777wins@gmail.com',
  github: 'https://github.com/utkarsh777-wins',
  githubHandle: 'utkarsh777-wins',
  linkedin: 'https://www.linkedin.com/in/utkarsh777wins',
  linkedinHandle: 'utkarsh777wins',
  linkedinCerts: 'https://www.linkedin.com/in/utkarsh777wins/details/certifications/',
  live: 'https://portfolio-me-one-zeta.vercel.app',
  version: '1.3.2',
  cgpa: '8.44',
  school: 'Lovely Professional University',
  degree: 'B.Tech CSE (AI & ML)',
} as const;

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certificates', label: 'Certificates' },
] as const;

export const SKILLS = [
  { name: 'Python', tag: 'Language' },
  { name: 'C++', tag: 'Language' },
  { name: 'C', tag: 'Language' },
  { name: 'JavaScript', tag: 'Language' },
  { name: 'Java', tag: 'Language' },
  { name: 'HTML/CSS', tag: 'Web' },
  { name: 'React', tag: 'Web' },
  { name: 'Flutter/Dart', tag: 'Web' },
  { name: 'PostgreSQL', tag: 'Data' },
  { name: 'MongoDB', tag: 'Data' },
  { name: 'Firebase', tag: 'Data' },
  { name: 'ESP32', tag: 'Hardware' },
  { name: 'Flask', tag: 'Web' },
] as const;

export type Skill = (typeof SKILLS)[number];

export const PROJECTS = [
  {
    name: 'deskBuddy-v1',
    inProgress: true,
    description:
      'Ambient desk tutor on an ESP32 edge node. A finite-state machine reads sensors, drives expression and clock UI, and answers questions when you call its name or bring a hand within 5 cm. No tab switching — assistance stays at the desk.',
    tags: ['ESP32', 'C++', 'Flask', 'Sensors', 'FSM'],
    href: 'https://github.com/utkarsh777-wins/deskBuddy-v1',
    linkLabel: 'View on GitHub',
  },
  {
    name: 'Cherish',
    inProgress: false,
    description:
      'Flutter app that turns a camera shot of a class timetable into an on-device schedule. Hive stores the week locally; notifications fire before class. No accounts, no backend.',
    tags: ['Flutter', 'Dart', 'Hive'],
    href: null,
    linkLabel: null,
  },
  {
    name: 'Portfolio-me',
    inProgress: false,
    description:
      'This site. Editorial type, a gold neural net, and a theme-aware mark — built with Vite and React, deployed on Vercel.',
    tags: ['Vite', 'React', 'Vercel'],
    href: 'https://portfolio-me-one-zeta.vercel.app',
    linkLabel: 'Live site',
  },
] as const;

export const CERTIFICATES = [
  { name: 'C++', issuer: 'Udemy', date: 'Present' },
  { name: 'Oracle Certified Foundation Associate', issuer: 'Oracle', date: 'May 2026' },
  { name: 'DevOps', issuer: 'Infosys', date: 'Apr 2026' },
  { name: 'Java', issuer: 'upGrad', date: 'Feb 2026' },
] as const;
