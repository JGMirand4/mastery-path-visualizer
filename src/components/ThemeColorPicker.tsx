
import React, { useEffect } from 'react';
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
  },
  {
    name: "Verde",
    colors: {
      primary: "#10B981",
      secondary: "#047857",
      background: "#0F172A",
    }
  }
];

const ThemeColorPicker: React.FC = () => {
  const { updateThemeColors, customColors, isDarkMode } = useRoadmap();

  // Apply theme colors on component mount and when they change
  useEffect(() => {
    applyThemeToDOM(customColors);
  }, [customColors, isDarkMode]);

  const applyTheme = (colors: ThemeColors) => {
    updateThemeColors(colors);
    applyThemeToDOM(colors);
    toast({
      title: "Tema atualizado",
      description: "As cores do tema foram atualizadas com sucesso.",
    });
  };

  // Apply theme colors directly to DOM
  const applyThemeToDOM = (colors: ThemeColors) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const primaryHSL = hexToHSL(colors.primary);
    const secondaryHSL = hexToHSL(colors.secondary);
    const backgroundHSL = hexToHSL(colors.background);
    
    if (primaryHSL) {
      root.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
      
      // Convert hex to RGB for primary-rgb variable
      const primaryRGB = hexToRGB(colors.primary);
      if (primaryRGB) {
        root.style.setProperty('--primary-rgb', `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`);
      }
    }
    
    if (secondaryHSL) {
      root.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
      
      // Convert hex to RGB for secondary-rgb variable
      const secondaryRGB = hexToRGB(colors.secondary);
      if (secondaryRGB) {
        root.style.setProperty('--secondary-rgb', `${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}`);
      }
    }
    
    if (backgroundHSL && isDarkMode) {
      root.style.setProperty('--background', `${backgroundHSL.h} ${backgroundHSL.s}% ${backgroundHSL.l}%`);
    }
  };

  // Helper function to convert hex to RGB
  const hexToRGB = (hex: string): {r: number, g: number, b: number} | null => {
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = 0, g = 0, b = 0;
    if (hex.length === 3) {
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      return null; // Invalid hex
    }
    
    return { r, g, b };
  };

  // Helper function to convert hex to HSL
  const hexToHSL = (hex: string): {h: number, s: number, l: number} | null => {
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = 0, g = 0, b = 0;
    if (hex.length === 3) {
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    } else {
      return null; // Invalid hex
    }
    
    // Find the min and max values to calculate the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    // Convert to the correct ranges
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    const l_percent = Math.round(l * 100);
    
    return { h, s, l: l_percent };
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="btn-circle bg-background/50 backdrop-blur-sm hover:bg-accent/80 relative"
        >
          <Paintbrush className="h-4 w-4" />
          <div className="absolute -bottom-1 -right-1 flex gap-0.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: customColors.primary }}></div>
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: customColors.secondary }}></div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 glass-card" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Escolha um tema</h4>
          <div className="grid grid-cols-3 gap-2">
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
                  className="w-full h-8 cursor-pointer rounded border enhanced-input"
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
                  className="w-full h-8 cursor-pointer rounded border enhanced-input"
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
                  className="w-full h-8 cursor-pointer rounded border enhanced-input"
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
