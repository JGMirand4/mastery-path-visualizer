
import { useState } from 'react';
import { Stack } from '@/types';
import { useRoadmap } from '@/contexts/RoadmapContext';
import { Button } from '@/components/ui/button';
import { Check, Edit, Trash2, ArrowUp, ArrowDown, CheckCircle2, Circle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import StackModal from './StackModal';
import { motion } from 'framer-motion';

interface StackNodeProps {
  stack: Stack;
}

const StackNode: React.FC<StackNodeProps> = ({ stack }) => {
  const { toggleStackStatus, toggleSubtopicStatus, deleteStack, moveStack, isDarkMode } = useRoadmap();
  const [isHovered, setIsHovered] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const statusColors = {
    'not-started': 'text-roadmap-blue',
    'in-progress': 'text-roadmap-yellow',
    'completed': 'text-roadmap-green',
  };
  
  const statusBgColors = {
    'not-started': 'bg-roadmap-blue/20',
    'in-progress': 'bg-roadmap-yellow/20',
    'completed': 'bg-roadmap-green/20',
  };

  // Node glowing effect based on status
  const nodeGlowClasses = {
    'not-started': isDarkMode ? 'glow-blue-sm' : 'shadow-sm',
    'in-progress': isDarkMode ? 'glow-yellow-sm' : 'shadow-sm',
    'completed': isDarkMode ? 'glow-green-sm' : 'shadow-sm',
  };
  
  const completedCount = stack.subtopics.filter(subtopic => subtopic.isCompleted).length;
  const progressPercentage = stack.subtopics.length > 0 
    ? Math.round((completedCount / stack.subtopics.length) * 100) 
    : 0;
  
  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStackStatus(stack.id);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
    setShowPopover(false);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteStack(stack.id);
    setShowPopover(false);
  };
  
  const handleMoveClick = (e: React.MouseEvent, direction: 'up' | 'down') => {
    e.stopPropagation();
    moveStack(stack.id, direction);
    setShowPopover(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <Popover open={showPopover} onOpenChange={setShowPopover}>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <motion.div 
                  className={`stack-node ${stack.status} ${nodeGlowClasses[stack.status]} backdrop-blur-sm ${isDarkMode ? 'border-white/10' : 'border-black/10'} ${stack.status === 'completed' ? 'achievement-animation' : ''}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => setShowPopover(true)}
                  role="button"
                  tabIndex={0}
                  whileHover={{ 
                    scale: 1.05, 
                    transition: { duration: 0.2 }
                  }}
                  animate={isHovered ? { 
                    boxShadow: [
                      `0 0 10px 0 rgba(var(--${stack.status === 'completed' ? 'green' : stack.status === 'in-progress' ? 'yellow' : 'blue'}-rgb), 0.3)`,
                      `0 0 16px 2px rgba(var(--${stack.status === 'completed' ? 'green' : stack.status === 'in-progress' ? 'yellow' : 'blue'}-rgb), 0.5)`,
                      `0 0 10px 0 rgba(var(--${stack.status === 'completed' ? 'green' : stack.status === 'in-progress' ? 'yellow' : 'blue'}-rgb), 0.3)`
                    ],
                    transition: { duration: 1.5, repeat: Infinity }
                  } : {}}
                >
                  <div className={`text-4xl mb-2 ${isHovered ? 'animate-pulse' : ''}`}>{stack.icon}</div>
                  <h3 className="text-sm font-mono font-bold whitespace-nowrap">{stack.title}</h3>
                  <div className={`mt-1 text-xs px-2 py-0.5 rounded-full ${statusBgColors[stack.status]} ${statusColors[stack.status]}`}>
                    {stack.status === 'not-started' && 'Not Started'}
                    {stack.status === 'in-progress' && 'In Progress'}
                    {stack.status === 'completed' && 'Completed'}
                  </div>
                </motion.div>
              </PopoverTrigger>
            </TooltipTrigger>
            
            <TooltipContent side="top" className="max-w-xs">
              <div className="p-2">
                <h4 className="font-bold">{stack.title}</h4>
                <p className="text-sm">{stack.description}</p>
                <div className="mt-2">
                  <h5 className="text-xs font-bold">Subtopics:</h5>
                  <ul className="text-xs">
                    {stack.subtopics.map(subtopic => (
                      <li key={subtopic.id} className="flex items-center">
                        {subtopic.isCompleted ? (
                          <CheckCircle2 className="h-3 w-3 text-roadmap-green mr-1" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground mr-1" />
                        )}
                        {subtopic.title}
                      </li>
                    ))}
                  </ul>
                </div>
                {stack.resources && stack.resources.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-bold">Resources:</h5>
                    <ul className="text-xs list-disc list-inside">
                      {stack.resources.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TooltipContent>
            
            <PopoverContent className="w-72 p-0">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{stack.title}</h3>
                  <div className={`text-2xl`}>{stack.icon}</div>
                </div>
                <p className="text-sm text-muted-foreground">{stack.description}</p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${statusBgColors[stack.status]}`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 max-h-60 overflow-auto">
                <h4 className="font-semibold text-sm mb-2">Subtopics</h4>
                <ul className="space-y-1">
                  {stack.subtopics.map(subtopic => (
                    <li 
                      key={subtopic.id} 
                      className="flex items-center text-sm p-1 hover:bg-accent rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubtopicStatus(stack.id, subtopic.id);
                      }}
                    >
                      {subtopic.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-roadmap-green mr-2" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground mr-2" />
                      )}
                      <span className={subtopic.isCompleted ? 'line-through opacity-70' : ''}>
                        {subtopic.title}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {stack.notes && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-1">Notes</h4>
                    <p className="text-xs bg-muted p-2 rounded">{stack.notes}</p>
                  </div>
                )}
                
                {stack.repositoryUrl && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-1">Repository</h4>
                    <a 
                      href={stack.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline block truncate"
                    >
                      {stack.repositoryUrl}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t bg-muted/50 flex flex-wrap gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={handleToggleStatus}
                  className="hover:bg-primary/10"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Update Status
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={handleEditClick}
                  className="hover:bg-primary/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                
                <div className="flex ml-auto gap-1">
                  <Button 
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => handleMoveClick(e, 'up')}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => handleMoveClick(e, 'down')}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </Tooltip>
      </TooltipProvider>
      
      {isEditModalOpen && (
        <StackModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          editStack={stack}
        />
      )}
    </>
  );
};

export default StackNode;
