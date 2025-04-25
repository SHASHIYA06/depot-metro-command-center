
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
  // Add the missing properties
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

// Create React context
const MobileMenuContext = React.createContext<MobileContextType>({
  isMobile: false,
  toggleMobileMenu: () => {},
  mobileMenuOpen: false,
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => {}
});

// Provider component
export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const toggleMobileMenu = React.useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const value = React.useMemo(() => ({
    isMobile,
    toggleMobileMenu,
    mobileMenuOpen,
    isMobileMenuOpen: mobileMenuOpen,
    setIsMobileMenuOpen: setMobileMenuOpen
  }), [isMobile, toggleMobileMenu, mobileMenuOpen]);

  return (
    <MobileMenuContext.Provider value={value}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export const useMobileMenuContext = () => {
  return React.useContext(MobileMenuContext);
};
