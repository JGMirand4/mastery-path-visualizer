
import { useRef, useEffect } from 'react';
import { Stack } from '@/types';
import StackNode from './StackNode';
import { useIsMobile } from '@/hooks/use-mobile';

interface LineViewProps {
  stacks: Stack[];
}

const LineView: React.FC<LineViewProps> = ({ stacks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Scroll to the middle of the timeline on first render
  useEffect(() => {
    if (containerRef.current && !isMobile) {
      const containerWidth = containerRef.current.scrollWidth;
      containerRef.current.scrollLeft = (containerWidth / 2) - (window.innerWidth / 2);
    }
  }, [isMobile]);
  
  if (isMobile) {
    return (
      <div className="relative min-h-[500px] px-4 py-10">
        {/* Vertical Line */}
        <div className="vertical-timeline-line"></div>
        
        {/* Nodes */}
        <div className="flex flex-col items-center gap-32 relative z-10">
          {stacks.map((stack, index) => (
            <div key={stack.id} className="w-[130px]">
              <StackNode stack={stack} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="overflow-x-auto pb-6 pt-10 px-10 min-h-[300px] hide-scrollbar"
    >
      <div className="relative min-w-max">
        {/* Horizontal Line */}
        <div className="timeline-line"></div>
        
        {/* Nodes */}
        <div className="flex items-center gap-24 md:gap-32 relative z-10">
          {stacks.map((stack) => (
            <div key={stack.id} className="flex flex-col items-center">
              <StackNode stack={stack} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineView;
