
import { useRef, useEffect, useState } from 'react';
import { Stack } from '@/types';
import StackNode from './StackNode';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LineViewProps {
  stacks: Stack[];
}

const LineView: React.FC<LineViewProps> = ({ stacks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
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
      <div className="relative min-h-[500px] px-4 py-10">
        {/* Vertical Line */}
        <div className="vertical-timeline-line glow-line-animation"></div>
        
        {/* Nodes */}
        <div className="flex flex-col items-center gap-32 relative z-10">
          {stacks.map((stack, index) => (
            <motion.div 
              key={stack.id} 
              className="w-[130px]"
              initial="hidden"
              animate="visible"
              custom={index}
              variants={nodeVariants}
            >
              <StackNode stack={stack} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Scroll controls */}
      {scrollPosition > 50 && (
        <motion.div
          className="absolute left-4 top-1/2 z-20 transform -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollTimeline('left')}
            className="rounded-full bg-background/30 backdrop-blur-md border-primary/40 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
      
      {maxScroll - scrollPosition > 50 && (
        <motion.div
          className="absolute right-4 top-1/2 z-20 transform -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollTimeline('right')}
            className="rounded-full bg-background/30 backdrop-blur-md border-primary/40 shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
      
      <div 
        ref={containerRef}
        className="overflow-x-auto pb-6 pt-10 px-10 min-h-[300px] hide-scrollbar"
        onScroll={updateScrollInfo}
      >
        <div className="relative min-w-max">
          {/* Horizontal Line */}
          <div className="timeline-line glow-line-animation"></div>
          
          {/* Nodes */}
          <div className="flex items-center gap-24 md:gap-32 relative z-10">
            {stacks.map((stack, index) => (
              <motion.div 
                key={stack.id} 
                className="flex flex-col items-center"
                initial="hidden"
                animate="visible"
                custom={index}
                variants={nodeVariants}
              >
                <StackNode stack={stack} />
              </motion.div>
            ))}
          </div>
          
          {/* Timeline markers */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-16">
            {[...Array(Math.ceil(stacks.length / 5))].map((_, i) => (
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
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
          <div className="bg-muted/20 h-1 rounded-full w-40 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full"
              style={{ 
                width: `${(scrollPosition / maxScroll) * 100}%`,
                opacity: maxScroll > 0 ? 0.8 : 0 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LineView;
