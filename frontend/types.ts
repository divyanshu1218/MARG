

export interface Career {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  bookmarked: boolean;
  relatedCollegeIds?: number[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CareerPathNode {
  id: string;
  name: string;
  description: string;
  skills: string[];
  education: string[];
  children?: CareerPathNode[];
}

export interface College {
    id?: number;
    name: string;
    city: string;
    state: string;
    type: string;
    annualFees: number;
    website?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface AIRecommendation {
  conclusion: string;
  colleges: {
    nearby: College[];
    inState: College[];
    national: College[];
  };
  resources: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'website';
  }[];
}

export interface User {
  name: string;
  role: 'Student' | 'Teacher' | 'Parent';
}

export interface NewsNotification {
  category: 'EXAM' | 'ADMISSION' | 'SCHOLARSHIP' | 'DEADLINE' | 'RESOURCE' | 'OTHER';
  title: string;
  description: string;
  timestamp: string;
  url: string;
}