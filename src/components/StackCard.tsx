
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stack } from '@/types';
import { useRoadmap } from '@/contexts/RoadmapContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, ArrowUp, ArrowDown, CheckCircle2, Circle, Calendar } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StackModal from './StackModal';

interface StackCardProps {
  stack: Stack;
}

const StackCard: React.FC<StackCardProps> = ({ stack }) => {
  const { toggleStackStatus, toggleSubtopicStatus, deleteStack, moveStack } = useRoadmap();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const statusColors = {
    'not-started': 'text-roadmap-blue',
    'in-progress': 'text-roadmap-yellow',
    'completed': 'text-roadmap-green',
  };
  
  const statusIcons = {
    'not-started': <Circle className="h-5 w-5 text-roadmap-blue" />,
    'in-progress': <Circle className="h-5 w-5 text-roadmap-yellow" />,
    'completed': <CheckCircle2 className="h-5 w-5 text-roadmap-green" />,
  };
  
  const completedCount = stack.subtopics.filter(subtopic => subtopic.isCompleted).length;
  const progressPercentage = stack.subtopics.length > 0 
    ? Math.round((completedCount / stack.subtopics.length) * 100) 
    : 0;
  
  const lastUpdatedDate = new Date(stack.lastUpdated);
  const formattedDate = lastUpdatedDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const handleToggleStatus = () => {
    toggleStackStatus(stack.id);
  };
  
  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      deleteStack(stack.id);
    } else {
      setShowDeleteConfirm(true);
      // Auto hide after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }
  };
  
  const iconVariants = {
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.2, type: 'spring', stiffness: 300 }
    }
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={cardVariants}
      >
        <Card className={`stack-card ${stack.status === 'completed' ? 'achievement-animation' : ''} h-full`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <motion.div 
                  className="text-4xl float"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  {stack.icon}
                </motion.div>
                <div className="flex flex-col">
                  <CardTitle className="text-lg font-mono">{stack.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{stack.category}</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`rounded-full ${statusColors[stack.status]}`}
                      onClick={handleToggleStatus}
                    >
                      {statusIcons[stack.status]}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Status: {stack.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3 space-y-4">
            <p className="text-sm text-muted-foreground">{stack.description}</p>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span className="font-mono">{progressPercentage}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-1.5" 
                style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  '--progress-color': stack.status === 'not-started' 
                    ? 'hsl(var(--roadmap-blue))' 
                    : stack.status === 'in-progress' 
                      ? 'hsl(var(--roadmap-yellow))' 
                      : 'hsl(var(--roadmap-green))'
                } as React.CSSProperties } 
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-semibold">Subtopics</h4>
              <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1 hide-scrollbar">
                {stack.subtopics.map(subtopic => (
                  <motion.div 
                    key={subtopic.id} 
                    className="flex items-center text-sm p-1.5 hover:bg-accent/30 rounded cursor-pointer"
                    onClick={() => toggleSubtopicStatus(stack.id, subtopic.id)}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {subtopic.isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-roadmap-green mr-2 flex-shrink-0" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground mr-2 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${subtopic.isCompleted ? 'line-through opacity-70' : ''}`}>
                      {subtopic.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {stack.resources && stack.resources.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold mb-1.5">Resources</h4>
                <div className="flex flex-wrap gap-1.5">
                  {stack.resources.map((resource, index) => (
                    <div 
                      key={index} 
                      className="text-xs bg-accent/50 px-2 py-1 rounded-full font-mono"
                    >
                      {resource}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t pt-3 flex justify-between items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 opacity-70 hover:opacity-100"
                      onClick={() => moveStack(stack.id, 'up')}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Move Up</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 opacity-70 hover:opacity-100"
                      onClick={() => moveStack(stack.id, 'down')}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Move Down</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 opacity-70 hover:opacity-100"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Stack</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={showDeleteConfirm ? "destructive" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showDeleteConfirm ? "Confirm Delete" : "Delete Stack"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      
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

export default StackCard;
