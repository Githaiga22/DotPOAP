import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { UserOnboarding } from "@/components/UserOnboarding";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />

      {/* Debug Connection Status - Remove in production */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-4">
          <ConnectionStatus />
          <UserOnboarding />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
