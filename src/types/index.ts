
export type StackStatus = 'not-started' | 'in-progress' | 'completed';

export type SubTopic = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export interface Stack {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: StackStatus;
  category: string;
  subtopics: SubTopic[];
  resources?: string[];
  lastUpdated: string;
  notes?: string;
  repositoryUrl?: string;
}

export type Category = {
  id: string;
  name: string;
};

export type RoadmapViewMode = 'line' | 'list';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
}
