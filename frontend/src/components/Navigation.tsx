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
import { WalletConnectButton } from "./WalletConnectButton";
import { useAnchorNavigation } from "@/utils/smoothScroll";

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleAnchorClick } = useAnchorNavigation();

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
              onClick={(e) => handleAnchorClick(e, item.href)}
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
            <Link to="/events" className="text-foreground hover:text-primary transition-smooth font-medium">
              Events
            </Link>
            <Link to="/my-poaps" className="text-foreground hover:text-primary transition-smooth font-medium">
              My POAPs
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth font-medium">
              About
            </Link>
            <Link to="/faq" className="text-foreground hover:text-primary transition-smooth font-medium">
              FAQ
            </Link>
            <NavDropdown
              title="Create"
              items={[
                { label: "Create Event", href: "/events?tab=create" },
                { label: "Connect Wallet", href: "/events?tab=wallet" },
                { label: "Browse Events", href: "/events" },
              ]}
            />
            <NavDropdown
              title="Learn"
              items={[
                { label: "How it Works", href: "/#how-it-works" },
                { label: "What is DotPOAP", href: "/#what-is-dotpoap" },
                { label: "Wallet Demo", href: "/wallet-demo" },
                { label: "Documentation", href: "https://github.com/robinsoncodes/DotPOAP" },
              ]}
            />
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <WalletConnectButton variant="outline" />
            <Button variant="hero" asChild>
              <Link to="/events?tab=create">Create Event</Link>
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
              <Link
                to="/events"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/my-poaps"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My POAPs
              </Link>
              <Link
                to="/events?tab=create"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create Event
              </Link>
              <Link
                to="/events?tab=wallet"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Connect Wallet
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/faq"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/wallet-demo"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wallet Demo
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <WalletConnectButton variant="outline" size="sm" className="w-full" />
                <Button variant="hero" size="sm" asChild>
                  <Link to="/events?tab=create">Create Event</Link>
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