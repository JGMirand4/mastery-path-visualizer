
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on mount
    checkIfMobile()
    
    // Set up listener for screen size changes
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Return true or false, never undefined after first render
  return isMobile === undefined ? false : isMobile
}
