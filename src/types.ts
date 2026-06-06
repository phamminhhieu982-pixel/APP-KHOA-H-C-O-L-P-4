export interface Badge {
  id: string;
  name: string;
  icon: string;
  desc: string;
  minPoints: number;
}

export interface ScienceModule {
  id: string;
  name: string;
  desc: string;
  color: string;
}

export interface QuizQuestion {
  q: string;
  a: string[];
  correct: number;
}

export interface PlanetDetail {
  dist: string;
  fact: string;
  color: string;
  size: number;
}

export interface PlanetDetailsMap {
  [key: string]: PlanetDetail;
}

export interface Student {
  id: string;
  name: string;
  points: number;
  progress: string;
  lastActive: string;
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}
