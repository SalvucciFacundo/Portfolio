export interface Profile {
  id?: string;
  name: string;
  role: string;
  status?: string;
  location: string;
  motto: string;
  bio: string;
  education?: {
    degree: string;
    university: string;
  };
  avatarUrl?: string;
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
}
