
import { useState } from 'react';
import { Stack } from '@/types';
import { useRoadmap } from '@/contexts/RoadmapContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, ArrowUp, ArrowDown, CheckCircle2, Circle, Calendar } from 'lucide-react';
import StackModal from './StackModal';

interface StackCardProps {
  stack: Stack;
}

const StackCard: React.FC<StackCardProps> = ({ stack }) => {
  const { toggleStackStatus, toggleSubtopicStatus, deleteStack, moveStack } = useRoadmap();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
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

  return (
    <>
      <Card className={`stack-card ${stack.status === 'completed' ? 'achievement-animation' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="text-4xl">{stack.icon}</div>
              <div className="flex flex-col">
                <CardTitle className="text-lg font-mono">{stack.title}</CardTitle>
                <CardDescription className="text-xs">{stack.category}</CardDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${statusColors[stack.status]}`}
              onClick={handleToggleStatus}
            >
              {statusIcons[stack.status]}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground mb-4">{stack.description}</p>
          
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          
          <div className="mt-4">
            <h4 className="text-xs font-semibold mb-2">Subtopics</h4>
            <div className="space-y-1">
              {stack.subtopics.map(subtopic => (
                <div 
                  key={subtopic.id} 
                  className="flex items-center text-sm p-1 hover:bg-accent/70 rounded cursor-pointer"
                  onClick={() => toggleSubtopicStatus(stack.id, subtopic.id)}
                >
                  {subtopic.isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-roadmap-green mr-2 flex-shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground mr-2 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${subtopic.isCompleted ? 'line-through opacity-70' : ''}`}>
                    {subtopic.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {stack.resources && stack.resources.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold mb-1">Resources</h4>
              <div className="flex flex-wrap gap-1">
                {stack.resources.map((resource, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-accent px-2 py-0.5 rounded-full"
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-3 flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>Updated {formattedDate}</span>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveStack(stack.id, 'up')}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => moveStack(stack.id, 'down')}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => deleteStack(stack.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
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
