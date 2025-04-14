
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmap } from '@/contexts/RoadmapContext';
import Header from '@/components/Header';
import LineView from '@/components/LineView';
import ListView from '@/components/ListView';
import ThemeColorPicker from '@/components/ThemeColorPicker';
import { useIsMobile } from '@/hooks/use-mobile';
import { Github, Maximize2, VolumeX, Music, List, GitBranch, Plus, Moon, Sun, ChevronsRight, ChevronsLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import StackModal from '@/components/StackModal';

const RoadmapContent = () => {
  const { stacks, viewMode, setViewMode, totalProgress, isDarkMode, toggleDarkMode } = useRoadmap();
  const isMobile = useIsMobile();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFocusModeToast, setShowFocusModeToast] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(true);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  const controlsVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.05
      } 
    },
    closed: { 
      x: "100%", 
      opacity: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    open: { 
      x: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    closed: { 
      x: 30, 
      opacity: 0, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
    // We would implement actual music playback here
    setShowFocusModeToast(true);
    setTimeout(() => setShowFocusModeToast(false), 3000);
  };
  
  const motivationalQuotes = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "A jornada de mil milhas começa com um passo.",
    "Aprenda como se fosse viver para sempre.",
    "Grandes desenvolvedores não nascem, são formados.",
    "Código é poesia escrita por engenheiros."
  ];
  
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setQuote(motivationalQuotes[randomIndex]);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header />
      
      <main className="flex-1 relative">
        {/* Controls Toggle Button */}
        <div className="absolute top-4 right-4 z-20">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full bg-background/50 backdrop-blur-md border border-primary/40 shadow-lg hover:shadow-primary/20 hover:bg-primary/5"
            onClick={() => setControlsOpen(!controlsOpen)}
          >
            {controlsOpen ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Controls Panel */}
        <AnimatePresence>
          {controlsOpen && (
            <motion.div 
              className="absolute top-16 right-4 flex flex-col gap-2 z-10"
              variants={controlsVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <TooltipProvider delayDuration={200}>
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full bg-background/50 backdrop-blur-md border-primary/40 shadow-lg hover:shadow-primary/20 hover:bg-primary/5" 
                        onClick={toggleDarkMode}
                      >
                        {isDarkMode ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <ThemeColorPicker />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full bg-background/50 backdrop-blur-md border-primary/40 shadow-lg hover:shadow-primary/20 hover:bg-primary/5" 
                        onClick={toggleFullscreen}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{isFullscreen ? 'Sair' : 'Entrar'} Modo Foco</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full bg-background/50 backdrop-blur-md border-primary/40 shadow-lg hover:shadow-primary/20 hover:bg-primary/5" 
                        onClick={toggleMusic}
                      >
                        {isMusicPlaying ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Music className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{isMusicPlaying ? 'Desativar' : 'Ativar'} Música de Foco</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-background/50 backdrop-blur-md border-primary/40 shadow-lg hover:shadow-primary/20 hover:bg-primary/5"
                        onClick={() => !isMobile && setViewMode(viewMode === 'line' ? 'list' : 'line')}
                      >
                        {viewMode === 'line' ? (
                          <List className="h-4 w-4" />
                        ) : (
                          <GitBranch className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Mudar para Visualização {viewMode === 'line' ? 'Lista' : 'Linha'}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="default" 
                        size="icon" 
                        className="rounded-full shadow-lg hover:shadow-primary/30"
                        onClick={() => setIsAddModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Adicionar Nova Stack</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Focus mode toast */}
        <AnimatePresence>
          {showFocusModeToast && (
            <motion.div 
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary/80 text-primary-foreground backdrop-blur-lg py-2 px-4 rounded-full shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm">{isMusicPlaying ? 'Música de foco ativada' : 'Música de foco desativada'}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Roadmap progress */}
        <div className="container mx-auto px-4 pt-6 pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Jornada para Maestria</h1>
              <p className="text-sm text-muted-foreground">
                Back-End Python + DevOps + ML
              </p>
            </div>
            
            <div className="flex flex-col w-full md:w-auto md:max-w-xs">
              <div className="flex justify-between text-xs mb-1">
                <span>Nível</span>
                <span className="font-mono">{totalProgress}%</span>
              </div>
              <div className="h-1.5 w-full md:w-40 bg-muted rounded-full overflow-hidden">
                <Progress value={totalProgress} className="h-full" />
              </div>
            </div>
          </div>
          
          {/* Motivational quote */}
          <div className="mb-6 border-l-2 border-primary/50 pl-4 py-1">
            <AnimatePresence mode="wait">
              <motion.p 
                key={quote}
                className="text-sm italic text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                "{quote}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Mobile tab view */}
        {isMobile && (
          <Tabs defaultValue={viewMode} className="px-4 py-2" onValueChange={(value) => setViewMode(value as 'line' | 'list')}>
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="line">Visão Linha</TabsTrigger>
              <TabsTrigger value="list">Visão Lista</TabsTrigger>
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
          <div className="py-2 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === 'line' && <LineView stacks={stacks} />}
                {viewMode === 'list' && <ListView stacks={stacks} />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>
      
      <footer className="border-t py-4 px-6 text-center text-xs text-muted-foreground flex items-center justify-center">
        <div className="flex items-center gap-1">
          <span>Jornada para Maestria</span>
          <span className="mx-2">•</span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github className="h-3.5 w-3.5" /> Ver no GitHub
          </a>
          <span className="mx-2">•</span>
          <span>Progresso: {stacks.filter(s => s.status === 'completed').length} / {stacks.length}</span>
        </div>
      </footer>
      
      <StackModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </motion.div>
  );
};

const Index = () => {
  return <RoadmapContent />;
};

export default Index;
