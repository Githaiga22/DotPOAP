import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  Clock, 
  User,
  CheckCircle,
  ExternalLink,
  QrCode,
  Share2
} from 'lucide-react';

interface EventDetailModalProps {
  event: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaimPoap?: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  open,
  onOpenChange,
  onClaimPoap
}) => {
  if (!event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "ongoing": return "bg-green-500/10 text-green-600 border-green-200";
      case "past": return "bg-gray-500/10 text-gray-600 border-gray-200";
      default: return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "conference": return "bg-purple-500/10 text-purple-600";
      case "workshop": return "bg-blue-500/10 text-blue-600";
      case "meetup": return "bg-green-500/10 text-green-600";
      case "hackathon": return "bg-orange-500/10 text-orange-600";
      case "bootcamp": return "bg-red-500/10 text-red-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canClaimPoap = event.status === 'ongoing' && event.attendees < event.mintCap;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{event.title}</DialogTitle>
              <DialogDescription className="text-base">
                {event.description}
              </DialogDescription>
            </div>
            <div className="flex gap-2 ml-4">
              <Badge className={getStatusColor(event.status)}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
              <Badge variant="outline" className={getCategoryColor(event.category)}>
                {event.category}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-sm opacity-90">{event.location}</p>
              </div>
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  
                  {event.endDate && event.endDate !== event.date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">End Date</p>
                        <p className="text-sm text-muted-foreground">{formatDate(event.endDate)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Organizer</p>
                      <p className="text-sm text-muted-foreground">{event.organizer}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Agenda */}
            {event.agenda && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.agenda.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* POAP Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  POAP Design
                </CardTitle>
                <CardDescription>
                  Collectible badge for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden border border-border mb-4">
                  <img
                    src={event.poapDesign}
                    alt={`${event.title} POAP`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop";
                    }}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <p>Unique collectible for {event.title}</p>
                </div>
              </CardContent>
            </Card>

            {/* Collection Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collection Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">POAPs Collected</span>
                  <span className="text-sm text-muted-foreground">
                    {event.attendees}/{event.mintCap}
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.attendees / event.mintCap) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{((event.attendees / event.mintCap) * 100).toFixed(1)}% collected</span>
                  <span>{event.mintCap - event.attendees} remaining</span>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{event.collectionPeriod}</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {canClaimPoap ? (
                <Button onClick={onClaimPoap} className="w-full" size="lg">
                  <Award className="h-4 w-4 mr-2" />
                  Claim POAP
                </Button>
              ) : event.status === 'past' ? (
                <Button variant="outline" className="w-full" disabled>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Collection Closed
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <Clock className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
            </div>

            {/* Event Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Event Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event ID</span>
                  <span>#{event.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span>{event.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country</span>
                  <span>{event.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{event.category}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
