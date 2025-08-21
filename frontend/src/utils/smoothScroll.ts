// Utility function for smooth scrolling to anchor links
export const smoothScrollToAnchor = (href: string) => {
  // Check if it's an anchor link (starts with #)
  if (href.startsWith('#')) {
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return true; // Indicates we handled the scroll
    }
  }
  return false; // Indicates normal navigation should proceed
};

// Hook for handling anchor link clicks
export const useAnchorNavigation = () => {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (smoothScrollToAnchor(href)) {
      e.preventDefault(); // Prevent default navigation for anchor links
    }
  };

  return { handleAnchorClick };
};
