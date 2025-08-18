import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Award, Zap, Droplets, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroIllustration from "@/assets/hero-illustration.png";
import AnimatedHeroText from "@/components/AnimatedHeroText";

const HeroSection = () => {
  return (
    <>
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary-glow rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <AnimatedHeroText />

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              DotPoap brings Proof of Attendance Protocol (POAP) to the Polkadot ecosystem. 
              Mint unique NFT badges that commemorate your participation in events, hackathons, 
              and community gatherings.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group" asChild>
                <Link to="/events">
                  Explore Events
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/create">Create Event</Link>
              </Button>
              <Button variant="premium" size="lg" asChild>
                <Link to="/my-poaps">My POAPs</Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Event Proof</h3>
                  <p className="text-xs text-muted-foreground">Verify attendance</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Community</h3>
                  <p className="text-xs text-muted-foreground">Connect & engage</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Collectibles</h3>
                  <p className="text-xs text-muted-foreground">Unique NFT badges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroIllustration} 
                alt="DotPoap Community Illustration" 
                className="w-full h-auto max-w-lg mx-auto animate-float"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
          </div>
        </div>

        {/* Built with ink! Section */}
        <div className="text-center mt-16 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-elegant">
          <h2 className="text-2xl font-bold mb-2">
            Built with <span className="bg-gradient-primary bg-clip-text text-transparent">ink!</span> Smart Contracts
          </h2>
          <p className="text-muted-foreground">
            Powered by Polkadot's native smart contract platform for secure and efficient POAP issuance
          </p>
        </div>
      </div>
    </section>

    {/* Section 1: What is DotPoap? */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What is <span className="bg-gradient-primary bg-clip-text text-transparent">DotPoap</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how DotPoap works as both a protocol and platform for the Polkadot ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Box 1: Protocol */}
          <div className="p-8 rounded-2xl bg-card border border-border shadow-elegant hover:shadow-glow transition-smooth group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">DotPoap: A Protocol</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              DotPoap, short for Proof of Attendance on Polkadot, allows you to mint memories as digital mementos we call DotPoaps.
              Whether you're attending a Polkadot hackathon, a study jam, or a community meetup, DotPoaps help you celebrate and record your journey in Web3 — secured by ink! smart contracts on the Polkadot blockchain.
            </p>
          </div>

          {/* Box 2: Platform */}
          <div className="p-8 rounded-2xl bg-card border border-border shadow-elegant hover:shadow-glow transition-smooth group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">DotPoap: A Platform</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              All of your DotPoaps are stored in the DotPoap app, giving you a living gallery of your Web3 experiences.
              Built on Polkadot, the platform connects communities with events, achievements, and contributions — while enabling developers, builders, and ambassadors to create meaningful rewards for participation.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Section 2: How Does DotPoap Work? */}
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Does <span className="bg-gradient-primary bg-clip-text text-transparent">DotPoap</span> Work?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple three-step process to mint, drop, and connect through DotPoaps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1: Mint */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-smooth">
                <Zap className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                <span className="text-sm font-bold text-accent-foreground">1</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Mint</h3>
            <p className="text-muted-foreground leading-relaxed">
              Each DotPoap tells a story. Mint one to preserve the most important memories forever on the Polkadot blockchain — with words, images, and proofs that bring back the moment. It's as easy as filling out a form.
            </p>
          </div>

          {/* Step 2: Drop */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-smooth">
                <Droplets className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                <span className="text-sm font-bold text-accent-foreground">2</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Drop</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect collectors to shared history. When you drop a DotPoap, you give attendees, contributors, and winners a chance to own their experience. Organizers, ambassadors, or community leads can issue DotPoaps directly to collectors.
            </p>
          </div>

          {/* Step 3: Connect */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-smooth">
                <Link2 className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                <span className="text-sm font-bold text-accent-foreground">3</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Connect</h3>
            <p className="text-muted-foreground leading-relaxed">
              Make your memories live forever. After minting, DotPoaps unlock a variety of experiences — from joining exclusive community chats, to claiming rewards, to showcasing your Polkadot journey. Your DotPoaps keep the good times alive.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HeroSection;