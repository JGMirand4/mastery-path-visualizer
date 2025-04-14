
import { useRef, useEffect, useState } from 'react';
import { Stack } from '@/types';
import StackNode from './StackNode';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRoadmap } from '@/contexts/RoadmapContext';

interface LineViewProps {
  stacks: Stack[];
}

const LineView: React.FC<LineViewProps> = ({ stacks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const { isDarkMode } = useRoadmap();
  const [showGuides, setShowGuides] = useState(false);
  
  // Update scroll information
  const updateScrollInfo = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      setScrollPosition(container.scrollLeft);
      setMaxScroll(container.scrollWidth - container.clientWidth);
    }
  };
  
  // Scroll to the middle of the timeline on first render
  useEffect(() => {
    if (containerRef.current && !isMobile) {
      const containerWidth = containerRef.current.scrollWidth;
      containerRef.current.scrollLeft = (containerWidth / 2) - (window.innerWidth / 2);
      updateScrollInfo();
    }
  }, [isMobile, stacks]);
  
  // Listen for scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollInfo);
      window.addEventListener('resize', updateScrollInfo);
      
      return () => {
        container.removeEventListener('scroll', updateScrollInfo);
        window.removeEventListener('resize', updateScrollInfo);
      };
    }
  }, []);
  
  // Scroll left/right
  const scrollTimeline = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Animation variants
  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  // Circuit patterns for tech look
  const CircuitPattern = () => (
    <div className="absolute inset-0 opacity-20 pointer-events-none bg-tech-pattern" />
  );
  
  if (isMobile) {
    return (
      <div className="relative min-h-[500px] px-4 py-10 overflow-hidden">
        {/* Tech Background */}
        <CircuitPattern />
        
        {/* Vertical Line */}
        <div className={`vertical-timeline-line ${isDarkMode ? 'glow-line-animation' : ''}`}></div>
        
        {/* Nodes */}
        <div className="flex flex-col items-center gap-28 relative z-10 pb-16">
          {stacks.map((stack, index) => (
            <motion.div 
              key={stack.id} 
              className="w-full max-w-[180px]"
              initial="hidden"
              animate="visible"
              custom={index}
              variants={nodeVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative timeline-node">
                {index !== stacks.length - 1 && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 h-28 w-0.5 bg-gradient-to-b from-primary/60 to-transparent circuit-line"></div>
                )}
                <StackNode stack={stack} />
                
                {/* Tech-oriented status indicator */}
                <div 
                  className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center 
                    ${stack.status === 'completed' ? 'bg-roadmap-green/20 text-roadmap-green animate-tech-breathe' : 
                      stack.status === 'in-progress' ? 'bg-roadmap-yellow/20 text-roadmap-yellow' : 
                      'bg-roadmap-blue/20 text-roadmap-blue'}`}
                >
                  <span className="text-xs font-mono">{index + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile sequence guide */}
        <AnimatePresence>
          {showGuides && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-xl p-3 rounded-lg border border-primary/20 shadow-glow z-20"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-roadmap-blue"></div>
                <span className="text-xs">Não iniciado</span>
                
                <div className="h-2 w-2 rounded-full bg-roadmap-yellow ml-2"></div>
                <span className="text-xs">Em progresso</span>
                
                <div className="h-2 w-2 rounded-full bg-roadmap-green ml-2"></div>
                <span className="text-xs">Concluído</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGuides(!showGuides)}
          className="fixed bottom-4 right-4 z-20 rounded-full bg-card/30 backdrop-blur-md shadow-glow border-primary/20 text-xs"
        >
          {showGuides ? "Ocultar guia" : "Mostrar guia"}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-hidden">
      {/* Tech Background */}
      <CircuitPattern />
      
      {/* Scroll controls */}
      <AnimatePresence>
        {scrollPosition > 50 && (
          <motion.div
            className="absolute left-6 top-1/2 z-20 transform -translate-y-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollTimeline('left')}
              className="tech-control-btn"
            >
              <CircleChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
        
        {maxScroll - scrollPosition > 50 && (
          <motion.div
            className="absolute right-6 top-1/2 z-20 transform -translate-y-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollTimeline('right')}
              className="tech-control-btn"
            >
              <CircleChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        ref={containerRef}
        className="overflow-x-auto pb-10 pt-20 px-12 min-h-[480px] hide-scrollbar"
        onScroll={updateScrollInfo}
      >
        <div className="relative min-w-max">
          {/* Horizontal Line */}
          <div className={`timeline-line ${isDarkMode ? 'glow-line-animation' : ''}`}></div>
          
          {/* Nodes */}
          <div className="flex items-center gap-28 md:gap-48 relative z-10 px-16 pb-6">
            {stacks.map((stack, index) => (
              <motion.div 
                key={stack.id} 
                className="flex flex-col items-center"
                initial="hidden"
                animate="visible"
                custom={index}
                variants={nodeVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full w-[60px] h-[1px] bg-gradient-to-l from-primary/60 to-transparent"></div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full w-[60px] h-[1px] bg-gradient-to-r from-primary/60 to-transparent"></div>
                  <StackNode stack={stack} />
                  
                  {/* Enhanced tech status indicator */}
                  <div 
                    className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-lg border
                      ${stack.status === 'completed' 
                        ? 'border-roadmap-green/30 bg-roadmap-green/10 text-roadmap-green animate-tech-breathe' 
                        : stack.status === 'in-progress' 
                          ? 'border-roadmap-yellow/30 bg-roadmap-yellow/10 text-roadmap-yellow' 
                          : 'border-roadmap-blue/30 bg-roadmap-blue/10 text-roadmap-blue'}`}
                  >
                    <span className="text-sm font-mono">{index + 1}</span>
                  </div>
                </div>
                
                {/* Technology path label */}
                <div className="mt-8 py-1 px-3 rounded-full text-xs bg-background/40 backdrop-blur-md border border-primary/10 font-mono">
                  {stack.category}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Timeline markers with digital circuit look */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-16">
            {[...Array(Math.ceil(stacks.length / 3))].map((_, i) => (
              <div 
                key={i} 
                className={`h-3 w-1 bg-primary/30 rounded-full -mt-1.5 ${i % 2 === 0 ? 'animate-circuit-pulse' : ''}`}
                style={{ opacity: 0.3 + (i % 3) * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      {maxScroll > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3">
          <div className="bg-background/30 h-2 rounded-full w-56 overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div 
              className="bg-primary h-full rounded-full"
              style={{ width: `${(scrollPosition / maxScroll) * 100}%` }}
              animate={{ 
                boxShadow: ['0 0 5px 0 rgba(var(--primary-rgb), 0.5)', '0 0 15px 5px rgba(var(--primary-rgb), 0.7)', '0 0 5px 0 rgba(var(--primary-rgb), 0.5)'],
                transition: { duration: 2, repeat: Infinity } 
              }}
            />
          </div>
        </div>
      )}
      
      {/* Tech legend */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-background/40 backdrop-blur-xl py-1.5 px-4 rounded-full border border-primary/20 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-roadmap-blue"></div>
          <span>Não iniciado</span>
        </div>
        
        <div className="h-3 w-px bg-foreground/20"></div>
        
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-roadmap-yellow"></div>
          <span>Em progresso</span>
        </div>
        
        <div className="h-3 w-px bg-foreground/20"></div>
        
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-roadmap-green"></div>
          <span>Concluído</span>
        </div>
      </div>
    </div>
  );
};

export default LineView;
