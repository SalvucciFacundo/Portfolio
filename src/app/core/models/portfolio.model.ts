export interface Profile {
  id?: string;
  name: string;
  role: string;
  status?: string;
  location: string;
  timezone?: string; // e.g. GMT-3
  availability?: string; // e.g. Remote / Full-time
  bio: string;
  education?: {
    degree: string;
    university: string;
  };
  languages?: { name: string; level: string }[];
  softSkills?: string[];
  avatarUrl?: string;
  certifications?: string[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface SkillGroup {
  id?: string;
  category: string;
  items: string[];
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  links: {
    github?: string;
    live?: string;
  };
  featured: boolean;
  order: number;
  role?: string;
  host?: string;
  exeName?: string;
}
