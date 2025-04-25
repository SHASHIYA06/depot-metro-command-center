
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Add backward compatibility alias for existing code
export const useMobile = useIsMobile;

// For backward compatibility with any code expecting useMobileMenuContext
type MobileContextType = {
  isMobile: boolean;
  toggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

// Create a default context with no-op functions
const defaultMobileMenuContext: MobileContextType = {
  isMobile: false,
  toggleMobileMenu: () => {},
  mobileMenuOpen: false
};

export const useMobileMenuContext = () => {
  // Return the default context - this is a compatibility function
  // for any code that might be expecting the old context structure
  return defaultMobileMenuContext;
};
