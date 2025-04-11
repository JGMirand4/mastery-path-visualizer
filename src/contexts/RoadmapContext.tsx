
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Stack, StackStatus, Category, RoadmapViewMode } from '@/types';
import { toast } from "@/components/ui/use-toast";

interface RoadmapContextType {
  stacks: Stack[];
  categories: Category[];
  viewMode: RoadmapViewMode;
  isDarkMode: boolean;
  totalProgress: number;
  addStack: (stack: Omit<Stack, 'id' | 'lastUpdated'>) => void;
  updateStack: (stack: Stack) => void;
  deleteStack: (id: string) => void;
  moveStack: (id: string, direction: 'up' | 'down') => void;
  toggleStackStatus: (id: string) => void;
  toggleSubtopicStatus: (stackId: string, subtopicId: string) => void;
  setViewMode: (mode: RoadmapViewMode) => void;
  toggleDarkMode: () => void;
  filterStacks: (query: string, status?: StackStatus, category?: string) => Stack[];
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Fundamentals' },
  { id: '2', name: 'Front-End' },
  { id: '3', name: 'Back-End' },
  { id: '4', name: 'DevOps' },
  { id: '5', name: 'Mobile' },
  { id: '6', name: 'AI/ML' },
];

const initialStacks: Stack[] = [
  {
    id: '1',
    icon: '🐍',
    title: 'Python',
    description: 'Master Python programming language fundamentals',
    status: 'in-progress',
    category: 'Fundamentals',
    subtopics: [
      { id: 's1-1', title: 'Basic Syntax', isCompleted: true },
      { id: 's1-2', title: 'Data Structures', isCompleted: true },
      { id: 's1-3', title: 'OOP in Python', isCompleted: false },
      { id: 's1-4', title: 'Python Packages', isCompleted: false }
    ],
    resources: ['docs.python.org', 'realpython.com'],
    lastUpdated: new Date().toISOString(),
    notes: 'Working through "Python Crash Course" book'
  },
  {
    id: '2',
    icon: '⚛️',
    title: 'React',
    description: 'Learn React for building interactive UIs',
    status: 'not-started',
    category: 'Front-End',
    subtopics: [
      { id: 's2-1', title: 'JSX Syntax', isCompleted: false },
      { id: 's2-2', title: 'Component Lifecycle', isCompleted: false },
      { id: 's2-3', title: 'Hooks', isCompleted: false },
      { id: 's2-4', title: 'State Management', isCompleted: false }
    ],
    resources: ['reactjs.org', 'egghead.io/react'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    icon: '⚡',
    title: 'FastAPI',
    description: 'Building APIs with FastAPI framework',
    status: 'not-started',
    category: 'Back-End',
    subtopics: [
      { id: 's3-1', title: 'Routes & Endpoints', isCompleted: false },
      { id: 's3-2', title: 'Data Validation', isCompleted: false },
      { id: 's3-3', title: 'Database Integration', isCompleted: false },
      { id: 's3-4', title: 'Authentication', isCompleted: false }
    ],
    resources: ['fastapi.tiangolo.com'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    icon: '🐳',
    title: 'Docker',
    description: 'Learn containerization with Docker',
    status: 'not-started',
    category: 'DevOps',
    subtopics: [
      { id: 's4-1', title: 'Docker Basics', isCompleted: false },
      { id: 's4-2', title: 'Dockerfile', isCompleted: false },
      { id: 's4-3', title: 'Docker Compose', isCompleted: false },
      { id: 's4-4', title: 'Docker Swarm', isCompleted: false }
    ],
    resources: ['docs.docker.com'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    icon: '🧠',
    title: 'Machine Learning',
    description: 'Learn ML fundamentals and techniques',
    status: 'completed',
    category: 'AI/ML',
    subtopics: [
      { id: 's5-1', title: 'Linear Regression', isCompleted: true },
      { id: 's5-2', title: 'Decision Trees', isCompleted: true },
      { id: 's5-3', title: 'Neural Networks', isCompleted: true },
      { id: 's5-4', title: 'Model Evaluation', isCompleted: true }
    ],
    resources: ['coursera.org/ml', 'kaggle.com'],
    lastUpdated: new Date().toISOString(),
    notes: 'Completed Stanford ML course',
    repositoryUrl: 'https://github.com/username/ml-projects'
  }
];

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  if (saved === null) return defaultValue;
  return JSON.parse(saved) as T;
};

const saveToLocalStorage = <T,>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

interface RoadmapProviderProps {
  children: ReactNode;
}

export const RoadmapProvider = ({ children }: RoadmapProviderProps) => {
  const [stacks, setStacks] = useState<Stack[]>(() => 
    loadFromLocalStorage('roadmapStacks', initialStacks)
  );
  
  const [categories, setCategories] = useState<Category[]>(() => 
    loadFromLocalStorage('roadmapCategories', defaultCategories)
  );
  
  const [viewMode, setViewMode] = useState<RoadmapViewMode>(() => 
    loadFromLocalStorage('roadmapViewMode', 'line')
  );
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    loadFromLocalStorage('darkMode', true)
  );

  // Calculate total progress
  const totalProgress = stacks.length > 0
    ? Math.round((stacks.filter(s => s.status === 'completed').length / stacks.length) * 100)
    : 0;

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('roadmapStacks', stacks);
    saveToLocalStorage('roadmapCategories', categories);
    saveToLocalStorage('roadmapViewMode', viewMode);
    saveToLocalStorage('darkMode', isDarkMode);
    
    // Apply dark/light mode to document
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [stacks, categories, viewMode, isDarkMode]);

  const addStack = (stackData: Omit<Stack, 'id' | 'lastUpdated'>) => {
    const newStack: Stack = {
      ...stackData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    setStacks([...stacks, newStack]);
    toast({
      title: "Stack Added",
      description: `${stackData.title} has been added to your roadmap.`,
    });
  };

  const updateStack = (updatedStack: Stack) => {
    setStacks(stacks.map(stack => 
      stack.id === updatedStack.id 
        ? { ...updatedStack, lastUpdated: new Date().toISOString() } 
        : stack
    ));
    toast({
      title: "Stack Updated",
      description: `${updatedStack.title} has been updated.`,
    });
  };

  const deleteStack = (id: string) => {
    const stackToDelete = stacks.find(stack => stack.id === id);
    setStacks(stacks.filter(stack => stack.id !== id));
    if (stackToDelete) {
      toast({
        title: "Stack Deleted",
        description: `${stackToDelete.title} has been removed from your roadmap.`,
        variant: "destructive",
      });
    }
  };

  const moveStack = (id: string, direction: 'up' | 'down') => {
    const index = stacks.findIndex(stack => stack.id === id);
    if (index === -1) return;

    const newStacks = [...stacks];
    if (direction === 'up' && index > 0) {
      [newStacks[index], newStacks[index - 1]] = [newStacks[index - 1], newStacks[index]];
      setStacks(newStacks);
    } else if (direction === 'down' && index < stacks.length - 1) {
      [newStacks[index], newStacks[index + 1]] = [newStacks[index + 1], newStacks[index]];
      setStacks(newStacks);
    }
  };

  const toggleStackStatus = (id: string) => {
    setStacks(stacks.map(stack => {
      if (stack.id !== id) return stack;

      let newStatus: StackStatus;
      switch (stack.status) {
        case 'not-started':
          newStatus = 'in-progress';
          break;
        case 'in-progress':
          newStatus = 'completed';
          break;
        case 'completed':
          newStatus = 'not-started';
          break;
        default:
          newStatus = 'not-started';
      }

      return { ...stack, status: newStatus, lastUpdated: new Date().toISOString() };
    }));
  };

  const toggleSubtopicStatus = (stackId: string, subtopicId: string) => {
    setStacks(stacks.map(stack => {
      if (stack.id !== stackId) return stack;

      const updatedSubtopics = stack.subtopics.map(subtopic => {
        if (subtopic.id !== subtopicId) return subtopic;
        return { ...subtopic, isCompleted: !subtopic.isCompleted };
      });

      // Check if all subtopics are completed to update stack status
      const allCompleted = updatedSubtopics.every(subtopic => subtopic.isCompleted);
      const someCompleted = updatedSubtopics.some(subtopic => subtopic.isCompleted);
      
      let newStatus = stack.status;
      if (allCompleted) {
        newStatus = 'completed';
      } else if (someCompleted) {
        newStatus = 'in-progress';
      }

      return { 
        ...stack, 
        subtopics: updatedSubtopics,
        status: newStatus,
        lastUpdated: new Date().toISOString()
      };
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const filterStacks = (query: string, status?: StackStatus, category?: string): Stack[] => {
    return stacks.filter(stack => {
      const matchesQuery = query === '' || 
        stack.title.toLowerCase().includes(query.toLowerCase()) ||
        stack.description.toLowerCase().includes(query.toLowerCase());
        
      const matchesStatus = !status || stack.status === status;
      const matchesCategory = !category || stack.category === category;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  };

  const value = {
    stacks,
    categories,
    viewMode,
    isDarkMode,
    totalProgress,
    addStack,
    updateStack,
    deleteStack,
    moveStack,
    toggleStackStatus,
    toggleSubtopicStatus,
    setViewMode,
    toggleDarkMode,
    filterStacks,
  };

  return (
    <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>
  );
};
