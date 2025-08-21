import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Search, Filter, Award, Calendar, MapPin, ExternalLink, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { WalletConnection } from "@/components/WalletConnection";
import { usePolkadot } from "@/contexts/PolkadotContext";
import { useContract } from "@/hooks/useContract";

// Mock POAP data
const mockPoaps = [
  {
    id: 1,
    eventTitle: "Polkadot Decoded 2023",
    eventDate: "2023-06-28",
    eventLocation: "Copenhagen, Denmark",
    category: "Conference",
    role: "Attendee",
    mintDate: "2023-06-28",
    tokenId: "#42001",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=300&fit=crop",
    utilities: ["Discord Access", "Exclusive Swag"]
  },
  {
    id: 2,
    eventTitle: "ink! Workshop Berlin",
    eventDate: "2023-09-15",
    eventLocation: "Berlin, Germany",
    category: "Workshop",
    role: "Participant",
    mintDate: "2023-09-15",
    tokenId: "#15087",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop",
    utilities: ["Study Group Access"]
  },
  {
    id: 3,
    eventTitle: "Substrate Saturday #35",
    eventDate: "2023-08-12",
    eventLocation: "Online",
    category: "Meetup",
    role: "Speaker",
    mintDate: "2023-08-12",
    tokenId: "#8903",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=300&fit=crop",
    utilities: ["Mentorship Program", "Priority Event Access"]
  },
  {
    id: 4,
    eventTitle: "Polkadot Hackathon SF",
    eventDate: "2023-11-03",
    eventLocation: "San Francisco, CA",
    category: "Hackathon",
    role: "Winner",
    mintDate: "2023-11-03",
    tokenId: "#23451",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=300&fit=crop",
    utilities: ["Prize Claim", "Alumni Network", "Funding Opportunities"]
  }
];

const MyPoaps = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { isWalletConnected, selectedAccount } = usePolkadot();
  const { userPoaps, isLoading, loadUserPoaps } = useContract();

  // Load user POAPs when wallet is connected
  useEffect(() => {
    if (isWalletConnected && selectedAccount) {
      loadUserPoaps();
    }
  }, [isWalletConnected, selectedAccount, loadUserPoaps]);

  // Convert contract POAPs to display format
  const displayPoaps = userPoaps.map(poap => ({
    id: poap.id,
    eventTitle: `Event #${poap.eventId}`,
    eventDate: new Date(poap.mintedAt * 1000).toISOString().split('T')[0],
    eventLocation: "Polkadot Network",
    category: "Event",
    role: "Participant",
    mintDate: new Date(poap.mintedAt * 1000).toISOString().split('T')[0],
    tokenId: `#${poap.id}`,
    image: poap.tokenUri.startsWith('http') ? poap.tokenUri : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=300&fit=crop",
    utilities: ["DotPOAP Holder"],
    contractPoap: poap
  }));

  const filteredPoaps = displayPoaps.filter(poap => {
    const matchesSearch = poap.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poap.eventLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || poap.category.toLowerCase() === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "speaker": return "bg-purple-500/10 text-purple-600";
      case "winner": return "bg-yellow-500/10 text-yellow-600";
      case "participant": return "bg-blue-500/10 text-blue-600";
      case "attendee": return "bg-green-500/10 text-green-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your Polkadot wallet to view your DotPOAP collection
              </p>
              <WalletConnection />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              My DotPoaps
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your collection of proof of attendance badges
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              {userPoaps.length} DotPOAPs Collected
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your POAPs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="meetup">Meetup</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="hackathon">Hackathon</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadUserPoaps()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your POAPs...</p>
          </div>
        )}

        {/* POAPs Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoaps.map((poap) => (
            <Card key={poap.id} className="overflow-hidden group hover:shadow-elegant transition-smooth">
              <div className="relative overflow-hidden">
                <img 
                  src={poap.image} 
                  alt={poap.eventTitle}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 right-3 ${getRoleColor(poap.role)}`}>
                  {poap.role}
                </Badge>
                <Badge variant="secondary" className="absolute top-3 left-3">
                  {poap.tokenId}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                  {poap.eventTitle}
                </CardTitle>
                <CardDescription>
                  Minted on {new Date(poap.mintDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(poap.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{poap.eventLocation}</span>
                  </div>
                </div>

                {/* Utilities */}
                {poap.utilities.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Utilities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {poap.utilities.map((utility, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {utility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button variant="outline" className="w-full group">
                  View Details
                  <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPoaps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {userPoaps.length === 0 ? "No POAPs found. Attend events to start collecting!" : "No POAPs found matching your criteria."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyPoaps;