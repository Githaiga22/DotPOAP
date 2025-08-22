import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, MapPin, Search, Filter, Plus, Loader2, Award, Clock, Eye } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { WalletConnection } from "@/components/WalletConnection";
import { NetworkStatus } from "@/components/NetworkStatus";
import { CreateEventForm } from "@/components/CreateEventForm";
import { MintPoapDialog } from "@/components/MintPoapDialog";
import { EventDetailModal } from "@/components/EventDetailModal";
import { EventsOverview } from "@/components/EventsOverview";
import { useContract } from "@/hooks/useContract";
import { usePolkadot } from "@/contexts/PolkadotContext";
import { EventData } from "@/services/contractService";

// Enhanced mock event data showcasing African blockchain communities
const mockEvents = [
  // Past Events (POAPs distributed)
  {
    id: 1,
    title: "Kisumu ink! Builders Event",
    description: "A hands-on workshop introducing smart contract development with ink! to the vibrant Kisumu tech community. Participants learned to build and deploy their first Polkadot smart contracts while networking with local developers.",
    date: "2024-02-15",
    endDate: "2024-02-16",
    location: "Kisumu, Kenya 🇰🇪",
    category: "Workshop",
    attendees: 29,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
    status: "past",
    mintCap: 35,
    organizer: "Polkadot Kisumu Community",
    collectionPeriod: "Collection closed on February 20, 2024",
    agenda: ["ink! Smart Contract Fundamentals", "Hands-on Development Session", "Local Developer Networking", "Project Showcase"],
    poapDesign: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop",
    country: "Kenya",
    region: "East Africa"
  },
  {
    id: 2,
    title: "Nigeria Rust Bootcamp",
    description: "Intensive 3-day bootcamp covering Rust programming fundamentals and Substrate development. Designed for Nigerian developers looking to enter the Polkadot ecosystem with strong technical foundations.",
    date: "2024-01-20",
    endDate: "2024-01-22",
    location: "Lagos, Nigeria 🇳🇬",
    category: "Bootcamp",
    attendees: 47,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop",
    status: "past",
    mintCap: 50,
    organizer: "Nigeria Blockchain Community",
    collectionPeriod: "Collection closed on January 30, 2024",
    agenda: ["Rust Programming Basics", "Substrate Framework Introduction", "Building Your First Parachain", "Career Opportunities in Web3"],
    poapDesign: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=300&h=300&fit=crop",
    country: "Nigeria",
    region: "West Africa"
  },
  {
    id: 3,
    title: "Ghana Web3 Summit",
    description: "Ghana's premier Web3 conference bringing together entrepreneurs, developers, and investors to explore blockchain opportunities in West Africa. Featured keynotes from Polkadot ecosystem leaders.",
    date: "2024-03-08",
    endDate: "2024-03-09",
    location: "Accra, Ghana 🇬🇭",
    category: "Conference",
    attendees: 156,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    status: "past",
    mintCap: 200,
    organizer: "Ghana Blockchain Association",
    collectionPeriod: "Collection closed on March 15, 2024",
    agenda: ["Web3 in Africa Keynote", "DeFi Innovation Panel", "Polkadot Ecosystem Overview", "Startup Pitch Competition"],
    poapDesign: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=300&h=300&fit=crop",
    country: "Ghana",
    region: "West Africa"
  },

  // Ongoing Events (currently active)
  {
    id: 4,
    title: "Nairobi Frame Developer Meetup",
    description: "Monthly meetup for Polkadot Frame developers in Nairobi. This session focuses on runtime development best practices and building custom pallets for African use cases.",
    date: "2024-08-22",
    endDate: "2024-08-22",
    location: "Nairobi, Kenya 🇰🇪",
    category: "Meetup",
    attendees: 18,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
    status: "ongoing",
    mintCap: 25,
    organizer: "Nairobi Polkadot Developers",
    collectionPeriod: "Collection ends at midnight (EAT)",
    agenda: ["Frame Runtime Development", "Custom Pallet Workshop", "African DeFi Use Cases", "Community Project Updates"],
    poapDesign: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop",
    country: "Kenya",
    region: "East Africa"
  },
  {
    id: 5,
    title: "Tanzania Polkadot Hackathon",
    description: "48-hour hackathon challenging developers to build solutions addressing local challenges using Polkadot technology. Focus on financial inclusion, supply chain, and governance applications.",
    date: "2024-08-21",
    endDate: "2024-08-23",
    location: "Dar es Salaam, Tanzania 🇹🇿",
    category: "Hackathon",
    attendees: 34,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
    status: "ongoing",
    mintCap: 60,
    organizer: "Tanzania Tech Hub",
    collectionPeriod: "Collection ends August 25, 2024",
    agenda: ["Problem Statement Presentations", "Team Formation & Ideation", "Development Sprint", "Final Presentations & Judging"],
    poapDesign: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=300&h=300&fit=crop",
    country: "Tanzania",
    region: "East Africa"
  },

  // Upcoming Events
  {
    id: 6,
    title: "Uganda Blockchain Workshop",
    description: "Introduction to blockchain technology and Polkadot ecosystem for university students and young professionals in Uganda. Includes hands-on wallet setup and first transaction experience.",
    date: "2024-09-15",
    endDate: "2024-09-15",
    location: "Kampala, Uganda 🇺🇬",
    category: "Workshop",
    attendees: 0,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
    status: "upcoming",
    mintCap: 40,
    organizer: "Uganda Blockchain Society",
    collectionPeriod: "Collection starts September 15, 2024",
    agenda: ["Blockchain Fundamentals", "Polkadot Ecosystem Tour", "Wallet Setup Workshop", "First Transaction Experience"],
    poapDesign: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=300&h=300&fit=crop",
    country: "Uganda",
    region: "East Africa"
  },
  {
    id: 7,
    title: "Ethiopia Developer Conference",
    description: "Ethiopia's first major blockchain developer conference featuring international speakers and local talent. Showcasing how Polkadot technology can drive innovation in the Horn of Africa.",
    date: "2024-10-12",
    endDate: "2024-10-13",
    location: "Addis Ababa, Ethiopia 🇪🇹",
    category: "Conference",
    attendees: 0,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    status: "upcoming",
    mintCap: 150,
    organizer: "Ethiopia Tech Innovation Hub",
    collectionPeriod: "Collection starts October 12, 2024",
    agenda: ["Opening Keynote: Blockchain in Africa", "Technical Deep Dives", "Local Innovation Showcase", "Networking & Partnerships"],
    poapDesign: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop",
    country: "Ethiopia",
    region: "East Africa"
  },
  {
    id: 8,
    title: "Morocco Web3 Builders Meetup",
    description: "Bringing together Web3 builders and entrepreneurs in Morocco to explore opportunities in the MENA region. Focus on cross-border payments and digital identity solutions using Polkadot.",
    date: "2024-09-28",
    endDate: "2024-09-28",
    location: "Casablanca, Morocco 🇲🇦",
    category: "Meetup",
    attendees: 0,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
    status: "upcoming",
    mintCap: 30,
    organizer: "Morocco Blockchain Network",
    collectionPeriod: "Collection starts September 28, 2024",
    agenda: ["MENA Web3 Landscape", "Cross-border Payment Solutions", "Digital Identity on Polkadot", "Builder Networking"],
    poapDesign: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=300&h=300&fit=crop",
    country: "Morocco",
    region: "North Africa"
  },
  {
    id: 9,
    title: "South Africa DeFi Summit",
    description: "Exploring decentralized finance opportunities in South Africa with focus on Polkadot's DeFi ecosystem. Featuring local fintech leaders and international DeFi protocol founders.",
    date: "2024-11-05",
    endDate: "2024-11-06",
    location: "Cape Town, South Africa 🇿🇦",
    category: "Conference",
    attendees: 0,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    status: "upcoming",
    mintCap: 120,
    organizer: "South Africa DeFi Alliance",
    collectionPeriod: "Collection starts November 5, 2024",
    agenda: ["DeFi State of the Union", "Polkadot DeFi Protocols", "Regulatory Landscape", "Building DeFi for Africa"],
    poapDesign: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=300&h=300&fit=crop",
    country: "South Africa",
    region: "Southern Africa"
  },
  {
    id: 10,
    title: "Senegal Substrate Study Jam",
    description: "Intensive study session for developers interested in learning Substrate framework. Conducted in French and Wolof to serve the local Senegalese developer community effectively.",
    date: "2024-09-20",
    endDate: "2024-09-21",
    location: "Dakar, Senegal 🇸🇳",
    category: "Workshop",
    attendees: 0,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
    status: "upcoming",
    mintCap: 25,
    organizer: "Senegal Developers Circle",
    collectionPeriod: "Collection starts September 20, 2024",
    agenda: ["Substrate Architecture Overview", "Building Custom Chains", "Parachain Development", "Local Use Case Workshop"],
    poapDesign: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop",
    country: "Senegal",
    region: "West Africa"
  },
  {
    id: 11,
    title: "Rwanda Blockchain Innovation Lab",
    description: "Government-sponsored innovation lab exploring blockchain applications for Rwanda's digital transformation. Focus on e-governance, digital identity, and financial inclusion using Polkadot technology.",
    date: "2024-10-25",
    endDate: "2024-10-27",
    location: "Kigali, Rwanda 🇷🇼",
    category: "Workshop",
    attendees: 0,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
    status: "upcoming",
    mintCap: 35,
    organizer: "Rwanda ICT Chamber",
    collectionPeriod: "Collection starts October 25, 2024",
    agenda: ["Digital Rwanda Vision", "Blockchain for Governance", "Identity Solutions Workshop", "Innovation Showcase"],
    poapDesign: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=300&h=300&fit=crop",
    country: "Rwanda",
    region: "East Africa"
  }
];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

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

  // Combine mock events with contract events
  const contractEvents = events.map(event => ({
    id: event.id + 1000, // Offset to avoid ID conflicts
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
    contractEvent: event, // Store original contract data
    collectionPeriod: "Smart contract managed",
    agenda: ["Smart Contract Event"],
    poapDesign: event.imageUri || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop",
    country: "Global",
    region: "Polkadot Network"
  }));

  // Combine mock events with contract events
  const displayEvents = [...mockEvents, ...contractEvents];

  const filteredEvents = displayEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.country && event.country.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || event.category.toLowerCase() === categoryFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesRegion = regionFilter === "all" || (event.region && event.region.toLowerCase() === regionFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesStatus && matchesRegion;
  });

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleClaimPoap = () => {
    // Handle POAP claiming logic here
    console.log('Claiming POAP for event:', selectedEvent?.id);
    setIsEventModalOpen(false);
  };

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
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="browse">Browse Events</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="create">Create Event</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <EventsOverview events={displayEvents} />
          </TabsContent>

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
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events, locations, or countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
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

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="meetup">Meetup</SelectItem>
                      <SelectItem value="hackathon">Hackathon</SelectItem>
                      <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="east africa">East Africa</SelectItem>
                      <SelectItem value="west africa">West Africa</SelectItem>
                      <SelectItem value="north africa">North Africa</SelectItem>
                      <SelectItem value="southern africa">Southern Africa</SelectItem>
                      <SelectItem value="polkadot network">Polkadot Network</SelectItem>
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

              {/* Filter Summary */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing {filteredEvents.length} of {displayEvents.length} events</span>
                {(searchTerm || categoryFilter !== "all" || statusFilter !== "all" || regionFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                      setStatusFilter("all");
                      setRegionFilter("all");
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    Clear filters
                  </Button>
                )}
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
                  <Card
                    key={event.id}
                    className="overflow-hidden group hover:shadow-elegant transition-smooth cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop";
                        }}
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className={`${getStatusColor(event.status)}`}>
                          {event.status}
                        </Badge>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="text-xs">
                          {event.category}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" variant="secondary" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-smooth line-clamp-1">
                          {event.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          #{event.id}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(event.date).toLocaleDateString()}
                            {event.endDate && event.endDate !== event.date &&
                              ` - ${new Date(event.endDate).toLocaleDateString()}`
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 flex-shrink-0" />
                          <span>{event.attendees}/{event.mintCap} POAPs collected</span>
                        </div>
                        {event.organizer && (
                          <div className="text-xs">
                            <span className="font-medium">Organizer:</span> {
                              event.organizer.length > 20
                                ? `${event.organizer.slice(0, 20)}...`
                                : event.organizer
                            }
                          </div>
                        )}
                      </div>

                      {/* Collection Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Collection Progress</span>
                          <span>{Math.round((event.attendees / event.mintCap) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${(event.attendees / event.mintCap) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <div onClick={(e) => e.stopPropagation()}>
                        {event.contractEvent ? (
                          (event.status === "ongoing" || event.status === "past") ? (
                            <MintPoapDialog event={event.contractEvent} />
                          ) : (
                            <Button className="w-full" variant="secondary" disabled>
                              <Clock className="h-4 w-4 mr-2" />
                              {event.status === "upcoming" ? "Coming Soon" : "Event Ended"}
                            </Button>
                          )
                        ) : (
                          <Button
                            className="w-full"
                            variant={event.status === "ongoing" ? "default" : "secondary"}
                            disabled={event.status !== "ongoing"}
                          >
                            {event.status === "ongoing" ? (
                              <>
                                <Award className="h-4 w-4 mr-2" />
                                Claim POAP
                              </>
                            ) : event.status === "upcoming" ? (
                              <>
                                <Clock className="h-4 w-4 mr-2" />
                                Coming Soon
                              </>
                            ) : (
                              <>
                                <Award className="h-4 w-4 mr-2" />
                                Collection Closed
                              </>
                            )}
                          </Button>
                        )}
                      </div>
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

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        onClaimPoap={handleClaimPoap}
      />

      <Footer />
    </div>
  );
};

export default Events;