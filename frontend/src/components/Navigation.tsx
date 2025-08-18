import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import dotpoapLogo from "@/assets/dotpoap-logo.png";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavDropdown = ({ title, items }: { title: string; items: Array<{ label: string; href: string }> }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-primary">
          {title}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-card border border-border shadow-elegant">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link 
              to={item.href} 
              className="w-full cursor-pointer text-foreground hover:text-primary hover:bg-accent transition-smooth"
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className={cn("bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
            <img src={dotpoapLogo} alt="DotPoap" className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DotPoap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavDropdown
              title="About"
              items={[
                { label: "About DotPoap", href: "/about" },
                { label: "About POAP Inc.", href: "/about-poap" },
                { label: "Case Studies", href: "/case-studies" },
              ]}
            />
            <NavDropdown
              title="Issuers"
              items={[
                { label: "How to use DotPoap", href: "/how-to-use" },
                { label: "Enterprise Solutions", href: "/enterprise" },
                { label: "Packages & Pricing", href: "/pricing" },
                { label: "DotPoap.fun", href: "/dotpoap-fun" },
              ]}
            />
            <NavDropdown
              title="Collectors"
              items={[
                { label: "Collectors", href: "/collectors" },
                { label: "Gallery", href: "/gallery" },
                { label: "Collections", href: "/collections" },
                { label: "DotPoap.fun", href: "/dotpoap-fun" },
              ]}
            />
            <NavDropdown
              title="Builders"
              items={[
                { label: "Build with DotPoap", href: "/build" },
                { label: "Documentation", href: "/docs" },
              ]}
            />
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/create">Make a POAP</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <Link to="/about" className="text-foreground hover:text-primary transition-smooth">
                About
              </Link>
              <Link to="/how-to-use" className="text-foreground hover:text-primary transition-smooth">
                For Issuers
              </Link>
              <Link to="/collectors" className="text-foreground hover:text-primary transition-smooth">
                For Collectors
              </Link>
              <Link to="/build" className="text-foreground hover:text-primary transition-smooth">
                For Builders
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/create">Make a POAP</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;