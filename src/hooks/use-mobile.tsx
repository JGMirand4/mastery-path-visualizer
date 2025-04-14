
import * as React from "react"

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [isLargerThan, setIsLargerThan] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsLargerThan(window.innerWidth >= BREAKPOINTS[breakpoint]);
    }
    
    // Check on mount
    checkBreakpoint();
    
    // Set up listener for screen size changes
    window.addEventListener("resize", checkBreakpoint);
    
    // Clean up
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpoint]);

  // Return true or false, never undefined after first render
  return isLargerThan === undefined ? false : isLargerThan;
}

export function useIsMobile() {
  const isMobile = !useBreakpoint('md');
  return isMobile;
}

export function useIsTablet() {
  const isLargerThanMobile = useBreakpoint('md');
  const isSmallerThanDesktop = !useBreakpoint('lg');
  
  return isLargerThanMobile && isSmallerThanDesktop;
}

export function useIsDesktop() {
  return useBreakpoint('lg');
}
