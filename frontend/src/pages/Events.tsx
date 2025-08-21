import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, MapPin, Search, Filter, Plus, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { WalletConnection } from "@/components/WalletConnection";
import { NetworkStatus } from "@/components/NetworkStatus";
import { CreateEventForm } from "@/components/CreateEventForm";
import { MintPoapDialog } from "@/components/MintPoapDialog";
import { useContract } from "@/hooks/useContract";
import { usePolkadot } from "@/contexts/PolkadotContext";
import { EventData } from "@/services/contractService";

// Mock event data
const mockEvents = [
  {
    id: 1,
    title: "Polkadot Decoded 2024",
    description: "The premier Polkadot conference bringing together developers, builders, and enthusiasts",
    date: "2024-07-11",
    location: "Brussels, Belgium",
    category: "Conference",
    attendees: 1200,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    status: "upcoming",
    mintCap: 1500
  },
  {
    id: 2,
    title: "Substrate Saturday #42",
    description: "Monthly community meetup for Substrate developers and enthusiasts",
    date: "2024-03-16",
    location: "Online",
    category: "Meetup",
    attendees: 85,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop",
    status: "past",
    mintCap: 100
  },
  {
    id: 3,
    title: "ink! Workshop Series",
    description: "Learn smart contract development on Polkadot with hands-on coding sessions",
    date: "2024-04-22",
    location: "Berlin, Germany",
    category: "Workshop",
    attendees: 65,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
    status: "past",
    mintCap: 80
  },
  {
    id: 4,
    title: "Polkadot Hackathon",
    description: "48-hour hackathon building the future of Web3 on Polkadot",
    date: "2024-05-10",
    location: "San Francisco, CA",
    category: "Hackathon",
    attendees: 234,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
    status: "ongoing",
    mintCap: 300
  }
];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get initial tab from URL params, default to "browse"
  const initialTab = searchParams.get("tab") || "browse";
  const [activeTab, setActiveTab] = useState(initialTab);

  const { isWalletConnected } = usePolkadot();
  const { events, isLoading, loadEvents, refreshData } = useContract();

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Update tab when URL params change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["browse", "create", "wallet"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    // Update URL without causing a page reload
    const newSearchParams = new URLSearchParams(searchParams);
    if (newTab === "browse") {
      newSearchParams.delete("tab"); // Remove tab param for default tab
    } else {
      newSearchParams.set("tab", newTab);
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  // Convert contract events to display format
  const displayEvents = events.map(event => ({
    id: event.id,
    title: event.name,
    description: event.description,
    date: new Date(event.startTime * 1000).toISOString().split('T')[0],
    endDate: new Date(event.endTime * 1000).toISOString().split('T')[0],
    location: "Polkadot Network", // Default since contract doesn't store location
    category: "Event", // Default category
    attendees: event.totalMinted,
    image: event.imageUri || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    status: event.isActive ?
      (Date.now() < event.endTime * 1000 ? "ongoing" : "past") :
      (Date.now() < event.startTime * 1000 ? "upcoming" : "past"),
    mintCap: event.maxCapacity,
    organizer: event.organizer,
    contractEvent: event // Store original contract data
  }));

  const filteredEvents = displayEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category.toLowerCase() === categoryFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500/10 text-blue-600";
      case "ongoing": return "bg-green-500/10 text-green-600";
      case "past": return "bg-gray-500/10 text-gray-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              DotPOAP Events
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore events, create new ones, and mint your proof of attendance on Polkadot
          </p>
        </div>

        {/* Tabs for Browse/Create */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="browse">Browse Events</TabsTrigger>
            <TabsTrigger value="create">Create Event</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-6">
                <WalletConnection />
                <NetworkStatus />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-8">
            <div className="max-w-2xl mx-auto">
              <CreateEventForm onSuccess={() => {
                handleTabChange("browse");
                refreshData();
              }} />
            </div>
          </TabsContent>

          <TabsContent value="browse" className="mt-8">

            {/* Filters */}
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
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
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            )}

            {/* Events Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden group hover:shadow-elegant transition-smooth">
                    <div className="relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop";
                        }}
                      />
                      <Badge className={`absolute top-3 right-3 ${getStatusColor(event.status)}`}>
                        {event.status}
                      </Badge>
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                          {event.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          Event #{event.id}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees}/{event.mintCap} POAPs minted</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Organizer:</span> {event.organizer.slice(0, 8)}...
                        </div>
                      </div>

                      {(event.status === "ongoing" || event.status === "past") && event.contractEvent ? (
                        <MintPoapDialog event={event.contractEvent} />
                      ) : (
                        <Button
                          className="w-full"
                          variant="secondary"
                          disabled={true}
                        >
                          {event.status === "upcoming" ? "Coming Soon" : "Event Ended"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {events.length === 0 ? "No events created yet." : "No events found matching your criteria."}
                </p>
                {events.length === 0 && (
                  <Button onClick={() => setActiveTab("create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Event
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Events;