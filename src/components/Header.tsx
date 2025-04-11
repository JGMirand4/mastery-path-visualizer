
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRoadmap } from "@/contexts/RoadmapContext";
import { Sun, Moon, PlusCircle, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import StackModal from "./StackModal";

const Header = () => {
  const { viewMode, setViewMode, isDarkMode, toggleDarkMode, totalProgress } = useRoadmap();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // For demonstration, we're using a fixed user name
  const userName = "John Doe";
  
  return (
    <header className="border-b border-border py-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and title */}
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-mono font-bold bg-gradient-to-r from-roadmap-neon to-roadmap-violet bg-clip-text text-transparent">
              My Road to Mastery
            </h1>
          </div>
          
          {/* Middle section with progress */}
          <div className="flex flex-col items-center w-full md:w-auto">
            <div className="flex items-center mb-1 space-x-2">
              <span className="text-xs text-muted-foreground">Power Level:</span>
              <span className="text-xs font-bold text-primary">{totalProgress}%</span>
            </div>
            <Progress value={totalProgress} className="w-full md:w-56 h-2" />
          </div>
          
          {/* Right controls */}
          <div className="flex items-center space-x-4">
            {/* View toggle */}
            <div className="hidden md:flex space-x-2">
              <Button
                variant={viewMode === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('line')}
              >
                Line View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List View
              </Button>
            </div>
            
            {/* Add new stack */}
            <Button 
              onClick={() => setIsModalOpen(true)}
              size="sm" 
              className="flex items-center gap-1"
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
            
            {/* User avatar */}
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium">{userName}</span>
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
            Line View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex-1"
          >
            List View
          </Button>
        </div>
      </div>
      
      <StackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;
