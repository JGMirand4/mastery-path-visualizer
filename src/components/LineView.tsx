
import { useRef, useEffect, useState } from 'react';
import { Stack } from '@/types';
import StackNode from './StackNode';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  if (isMobile) {
    return (
      <div className="relative min-h-[500px] px-4 py-6">
        {/* Vertical Line */}
        <div className={`vertical-timeline-line ${isDarkMode ? 'glow-line-animation' : ''}`}></div>
        
        {/* Nodes */}
        <div className="flex flex-col items-center gap-24 relative z-10 pb-12">
          {stacks.map((stack, index) => (
            <motion.div 
              key={stack.id} 
              className="w-full max-w-[180px]"
              initial="hidden"
              animate="visible"
              custom={index}
              variants={nodeVariants}
            >
              <div className="relative">
                {index !== stacks.length - 1 && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 h-24 w-0.5 bg-gradient-to-b from-primary/40 to-transparent"></div>
                )}
                <StackNode stack={stack} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Scroll controls */}
      <AnimatePresence>
        {scrollPosition > 50 && (
          <motion.div
            className="absolute left-4 top-1/2 z-20 transform -translate-y-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollTimeline('left')}
              className="rounded-full bg-card/30 backdrop-blur-md border-primary/40 shadow-lg hover:bg-primary/20 hover:border-primary/60 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
        
        {maxScroll - scrollPosition > 50 && (
          <motion.div
            className="absolute right-4 top-1/2 z-20 transform -translate-y-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollTimeline('right')}
              className="rounded-full bg-card/30 backdrop-blur-md border-primary/40 shadow-lg hover:bg-primary/20 hover:border-primary/60 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        ref={containerRef}
        className="overflow-x-auto pb-10 pt-16 px-12 min-h-[350px] hide-scrollbar"
        onScroll={updateScrollInfo}
      >
        <div className="relative min-w-max">
          {/* Horizontal Line */}
          <div className={`timeline-line ${isDarkMode ? 'glow-line-animation' : ''} h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent absolute top-1/2 left-0 right-0 transform -translate-y-1/2`}></div>
          
          {/* Nodes */}
          <div className="flex items-center gap-28 md:gap-36 relative z-10 px-16 pb-6">
            {stacks.map((stack, index) => (
              <motion.div 
                key={stack.id} 
                className="flex flex-col items-center"
                initial="hidden"
                animate="visible"
                custom={index}
                variants={nodeVariants}
              >
                <div className="relative">
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full w-[50px] h-[1px] bg-gradient-to-l from-primary/40 to-transparent"></div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full w-[50px] h-[1px] bg-gradient-to-r from-primary/40 to-transparent"></div>
                  <StackNode stack={stack} />
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Timeline markers */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-16">
            {[...Array(Math.ceil(stacks.length / 3))].map((_, i) => (
              <div 
                key={i} 
                className="h-3 w-1 bg-primary/30 rounded-full -mt-1.5"
                style={{ opacity: 0.3 + (i % 3) * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      {maxScroll > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3">
          <div className="bg-muted/20 h-1.5 rounded-full w-48 overflow-hidden backdrop-blur-sm">
            <motion.div 
              className="bg-primary h-full rounded-full"
              style={{ width: `${(scrollPosition / maxScroll) * 100}%` }}
              animate={{ opacity: [0.6, 0.9, 0.6], transition: { duration: 2, repeat: Infinity } }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LineView;
