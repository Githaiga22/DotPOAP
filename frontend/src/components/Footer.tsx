import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dotpoapLogo from "@/assets/dotpoap-logo.png";

const Footer = () => {
  const [poapsMinted, setPoapsMinted] = useState(7409166);
  const [issuers, setIssuers] = useState(45042);

  useEffect(() => {
    // Simulate live counter updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPoapsMinted(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
      if (Math.random() > 0.9) {
        setIssuers(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Live Counters */}
        <div className="text-center mb-12">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-2xl md:text-3xl font-bold text-primary">
                {poapsMinted.toLocaleString()}
              </span>
              <span className="text-muted-foreground">DotPoaps minted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-2xl md:text-3xl font-bold text-primary">
                {issuers.toLocaleString()}
              </span>
              <span className="text-muted-foreground">Issuers</span>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={dotpoapLogo} alt="DotPoap" className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DotPoap
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Proof of Attendance for the Polkadot ecosystem. Celebrate, collect, and verify your Web3 journey.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with ink! Smart Contracts on Polkadot
            </p>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth">
                  About DotPoap
                </Link>
              </li>
              <li>
                <Link to="/about-poap" className="text-muted-foreground hover:text-primary transition-smooth">
                  About POAP Inc.
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-muted-foreground hover:text-primary transition-smooth">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">For Creators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-to-use" className="text-muted-foreground hover:text-primary transition-smooth">
                  How to use DotPoap
                </Link>
              </li>
              <li>
                <Link to="/enterprise" className="text-muted-foreground hover:text-primary transition-smooth">
                  Enterprise Solutions
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-smooth">
                  Packages & Pricing
                </Link>
              </li>
              <li>
                <Link to="/build" className="text-muted-foreground hover:text-primary transition-smooth">
                  Build with DotPoap
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/collectors" className="text-muted-foreground hover:text-primary transition-smooth">
                  Collectors
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-muted-foreground hover:text-primary transition-smooth">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-muted-foreground hover:text-primary transition-smooth">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/dotpoap-fun" className="text-muted-foreground hover:text-primary transition-smooth">
                  DotPoap.fun
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 DotPoap. Built for the Polkadot community with ❤️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;