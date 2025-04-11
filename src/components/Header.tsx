
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { Sun, Moon, PlusCircle, User, Code, ChevronDown, ChevronUp, ChevronRight, Terminal, GitBranch } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import StackModal from "./StackModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { viewMode, setViewMode, isDarkMode, toggleDarkMode, totalProgress, stacks } = useRoadmap();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // For demonstration, we're using a fixed user name
  const userName = "John Doe";
  
  // Calculate statistics
  const completedCount = stacks.filter(s => s.status === 'completed').length;
  const inProgressCount = stacks.filter(s => s.status === 'in-progress').length;
  const notStartedCount = stacks.filter(s => s.status === 'not-started').length;
  
  // Random "level" calculation based on completed count
  const level = Math.floor(completedCount / 3) + 1;
  
  // Terminal animation
  const [terminalText, setTerminalText] = useState('');
  const fullTerminalText = `> Loading Dev Roadmap...\n> User: ${userName}\n> Level: ${level}\n> Progress: ${totalProgress}%\n> System ready.`;
  
  useEffect(() => {
    if (showStats) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < fullTerminalText.length) {
          setTerminalText(fullTerminalText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      
      return () => clearInterval(timer);
    } else {
      setTerminalText('');
    }
  }, [showStats, fullTerminalText]);
  
  return (
    <header className="border-b border-border/50 backdrop-blur-md bg-background/30 sticky top-0 z-30 py-3">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and title */}
          <div className="flex items-center">
            <motion.div 
              className="mr-2 p-1.5 bg-primary/10 rounded-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Code className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-mono font-bold bg-gradient-to-r from-roadmap-neon to-roadmap-violet bg-clip-text text-transparent neon-text">
              My Road to Mastery
            </h1>
          </div>
          
          {/* Middle section with progress */}
          <div className="flex flex-col items-center w-full md:w-auto">
            <div className="flex items-center mb-1 space-x-2">
              <Badge variant="outline" className="text-xs bg-muted/50 font-mono">
                <Terminal className="h-3 w-3 mr-1" /> DEV LEVEL {level}
              </Badge>
              <span className="text-xs font-bold text-primary">{totalProgress}%</span>
            </div>
            <div className="w-full md:w-56 h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary/80 to-secondary/80"
                initial={{ width: '0%' }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          
          {/* Right controls */}
          <div className="flex items-center space-x-4">
            {/* View toggle */}
            <div className="hidden md:flex space-x-2">
              <Button
                variant={viewMode === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('line')}
                className={viewMode === 'line' ? 'cyber-button' : ''}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Line View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'cyber-button' : ''}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                List View
              </Button>
            </div>
            
            {/* Stats toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowStats(!showStats)}
              className="hidden md:flex items-center gap-1.5"
            >
              Stats {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {/* Add new stack */}
            <Button 
              onClick={() => setIsModalOpen(true)}
              size="sm" 
              className="flex items-center gap-1 bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="h-4 w-4" /> 
              <span className="hidden sm:inline-block">New Stack</span>
            </Button>
            
            {/* Dark/light mode toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">{userName}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Export Progress</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile view toggle */}
        <div className="flex justify-center mt-4 md:hidden space-x-2">
          <Button
            variant={viewMode === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('line')}
            className="flex-1"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Line View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex-1"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
        
        {/* Stats terminal */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-black/60 border border-primary/20 rounded-lg font-mono text-xs text-green-400 overflow-hidden">
                <pre className="whitespace-pre-line">{terminalText}</pre>
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="bg-muted/20 p-2 rounded">
                    <div className="text-xs text-muted-foreground mb-1">Completed</div>
                    <div className="text-lg font-bold text-roadmap-green">{completedCount}</div>
                  </div>
                  <div className="bg-muted/20 p-2 rounded">
                    <div className="text-xs text-muted-foreground mb-1">In Progress</div>
                    <div className="text-lg font-bold text-roadmap-yellow">{inProgressCount}</div>
                  </div>
                  <div className="bg-muted/20 p-2 rounded">
                    <div className="text-xs text-muted-foreground mb-1">Not Started</div>
                    <div className="text-lg font-bold text-roadmap-blue">{notStartedCount}</div>
                  </div>
                  <div className="flex-1 flex items-end justify-end">
                    <Button variant="ghost" size="sm" className="text-primary/70 hover:text-primary">
                      <ChevronRight className="h-4 w-4 mr-2" /> View Detailed Stats
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <StackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;
