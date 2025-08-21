import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Award, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">DotPOAP</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            DotPOAP brings Proof of Attendance Protocol to the Polkadot ecosystem, 
            enabling communities to create, distribute, and collect meaningful digital badges 
            that commemorate participation in events and achievements.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that every meaningful interaction in the Web3 space deserves recognition. 
                DotPOAP provides the infrastructure for communities to create lasting memories and 
                build stronger connections through verifiable proof of participation.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Built on Polkadot's robust infrastructure using ink! smart contracts, 
                DotPOAP ensures security, scalability, and interoperability across the ecosystem.
              </p>
              <Button variant="hero" asChild>
                <Link to="/events">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-primary opacity-20 rounded-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🎨</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DotPOAP?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fast & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built on Polkadot's secure and scalable infrastructure with ink! smart contracts
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Easy-to-use tools for creating and managing events with customizable POAPs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Collectible NFTs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Unique, verifiable digital badges that serve as proof of participation
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect communities and build stronger relationships through shared experiences
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              DotPOAP leverages the latest in blockchain technology to provide a seamless experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Polkadot Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure, scalable, and interoperable blockchain infrastructure that connects multiple chains
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ink! Smart Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Rust-based smart contracts that provide security, efficiency, and developer-friendly tools
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Hub Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Native integration with Polkadot's Asset Hub for seamless token management and transfers
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-muted/30 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the growing community of creators and collectors on DotPOAP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/events?tab=create">Create Your First Event</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/events">Explore Events</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
