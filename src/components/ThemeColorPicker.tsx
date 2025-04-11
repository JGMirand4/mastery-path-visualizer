
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Paintbrush } from "lucide-react";
import { ThemeColors } from '@/types';
import { useRoadmap } from '@/contexts/RoadmapContext';
import { toast } from "@/components/ui/use-toast";

// Lista de temas predefinidos
const predefinedThemes: Array<{name: string, colors: ThemeColors}> = [
  {
    name: "Padrão",
    colors: {
      primary: "#10F3AF",
      secondary: "#6D28D9",
      background: "#0A0F1C",
    }
  },
  {
    name: "Oceano",
    colors: {
      primary: "#0EA5E9",
      secondary: "#2563EB",
      background: "#0F172A",
    }
  },
  {
    name: "Ambar",
    colors: {
      primary: "#F59E0B",
      secondary: "#D97706",
      background: "#18181B",
    }
  },
  {
    name: "Rosa",
    colors: {
      primary: "#EC4899",
      secondary: "#8B5CF6",
      background: "#0F1729",
    }
  }
];

const ThemeColorPicker: React.FC = () => {
  const { updateThemeColors, customColors } = useRoadmap();

  const applyTheme = (colors: ThemeColors) => {
    updateThemeColors(colors);
    toast({
      title: "Tema atualizado",
      description: "As cores do tema foram atualizadas com sucesso.",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/80 relative"
        >
          <Paintbrush className="h-4 w-4" />
          <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Escolha um tema</h4>
          <div className="grid grid-cols-2 gap-2">
            {predefinedThemes.map((theme) => (
              <Button
                key={theme.name}
                variant="outline"
                className="flex flex-col items-center justify-center h-16 gap-1 hover:border-primary transition-all"
                onClick={() => applyTheme(theme.colors)}
              >
                <div className="flex space-x-1">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
                </div>
                <span className="text-xs">{theme.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Cores personalizadas</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs" htmlFor="primary-color">Primária</label>
                <input
                  id="primary-color"
                  type="color"
                  className="w-full h-8 cursor-pointer rounded border"
                  value={customColors.primary}
                  onChange={(e) => {
                    updateThemeColors({
                      ...customColors,
                      primary: e.target.value
                    });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs" htmlFor="secondary-color">Secundária</label>
                <input
                  id="secondary-color"
                  type="color"
                  className="w-full h-8 cursor-pointer rounded border"
                  value={customColors.secondary}
                  onChange={(e) => {
                    updateThemeColors({
                      ...customColors,
                      secondary: e.target.value
                    });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs" htmlFor="background-color">Fundo</label>
                <input
                  id="background-color"
                  type="color"
                  className="w-full h-8 cursor-pointer rounded border"
                  value={customColors.background}
                  onChange={(e) => {
                    updateThemeColors({
                      ...customColors,
                      background: e.target.value
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColorPicker;
