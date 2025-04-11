
import { useState } from 'react';
import { RoadmapProvider, useRoadmap } from '@/contexts/RoadmapContext';
import Header from '@/components/Header';
import LineView from '@/components/LineView';
import ListView from '@/components/ListView';
import { useIsMobile } from '@/hooks/use-mobile';
import { GithubIcon, Maximize2, Music, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RoadmapContent = () => {
  const { stacks, viewMode } = useRoadmap();
  const isMobile = useIsMobile();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
    // Here you would implement actual music logic
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${isFullscreen ? 'bg-roadmap-dark' : ''}`}>
      <Header />
      
      <main className="flex-1 relative">
        {/* Focus mode controls */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={toggleMusic}
          >
            {isMusicPlaying ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Music className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Mobile tab view */}
        {isMobile && (
          <Tabs defaultValue={viewMode} className="px-4 py-6">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="line">Line View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="line" className="mt-0">
              <LineView stacks={stacks} />
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <ListView stacks={stacks} />
            </TabsContent>
          </Tabs>
        )}
        
        {/* Desktop view */}
        {!isMobile && (
          <div className="py-6 flex-1">
            {viewMode === 'line' && <LineView stacks={stacks} />}
            {viewMode === 'list' && <ListView stacks={stacks} />}
          </div>
        )}
      </main>
      
      <footer className="border-t py-4 px-6 text-center text-xs text-muted-foreground flex items-center justify-center">
        <div className="flex items-center gap-1">
          <span>My Road to Mastery</span>
          <span className="mx-2">•</span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <GithubIcon className="h-3.5 w-3.5" /> GitHub
          </a>
          <span className="mx-2">•</span>
          <span>Power Level: {stacks.filter(s => s.status === 'completed').length} / {stacks.length}</span>
        </div>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <RoadmapProvider>
      <RoadmapContent />
    </RoadmapProvider>
  );
};

export default Index;
