import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Users, 
  Award, 
  MapPin, 
  TrendingUp,
  Globe,
  Clock,
  Zap
} from 'lucide-react';

interface EventsOverviewProps {
  events: any[];
  className?: string;
}

export const EventsOverview: React.FC<EventsOverviewProps> = ({ events, className }) => {
  // Calculate statistics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const ongoingEvents = events.filter(e => e.status === 'ongoing').length;
  const pastEvents = events.filter(e => e.status === 'past').length;
  
  const totalPoapsDistributed = events.reduce((sum, event) => sum + event.attendees, 0);
  const totalCapacity = events.reduce((sum, event) => sum + event.mintCap, 0);
  
  // Get unique countries and regions
  const uniqueCountries = [...new Set(events.map(e => e.country).filter(Boolean))];
  const uniqueRegions = [...new Set(events.map(e => e.region).filter(Boolean))];
  
  // Get most popular categories
  const categoryCount = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Calculate collection rate
  const collectionRate = totalCapacity > 0 ? (totalPoapsDistributed / totalCapacity) * 100 : 0;

  return (
    <div className={className}>
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex gap-1">
              <Badge variant="outline" className="text-xs">
                {upcomingEvents} upcoming
              </Badge>
              <Badge variant="outline" className="text-xs">
                {ongoingEvents} ongoing
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">POAPs Distributed</p>
                <p className="text-2xl font-bold">{totalPoapsDistributed.toLocaleString()}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {collectionRate.toFixed(1)}% collection rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Countries</p>
                <p className="text-2xl font-bold">{uniqueCountries.length}</p>
              </div>
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {uniqueRegions.length} regions covered
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold">{ongoingEvents}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Claiming POAPs now
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Event Status
            </CardTitle>
            <CardDescription>Distribution of events by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Upcoming</span>
              </div>
              <span className="text-sm font-medium">{upcomingEvents}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Ongoing</span>
              </div>
              <span className="text-sm font-medium">{ongoingEvents}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm">Past</span>
              </div>
              <span className="text-sm font-medium">{pastEvents}</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Categories
            </CardTitle>
            <CardDescription>Most common event types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCategories.map(([category, count], index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <span className="text-sm capitalize">{category}</span>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regional Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Regional Coverage
            </CardTitle>
            <CardDescription>Events across African regions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {uniqueRegions.slice(0, 5).map((region) => {
              const regionEvents = events.filter(e => e.region === region).length;
              return (
                <div key={region} className="flex items-center justify-between">
                  <span className="text-sm">{region}</span>
                  <Badge variant="outline" className="text-xs">
                    {regionEvents} events
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
          <CardDescription>Key metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900">Most Active Region</p>
              <p className="text-blue-700">
                {uniqueRegions.length > 0 ? 
                  uniqueRegions.reduce((a, b) => 
                    events.filter(e => e.region === a).length > events.filter(e => e.region === b).length ? a : b
                  ) : 'N/A'
                }
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="font-medium text-green-900">Average Collection Rate</p>
              <p className="text-green-700">{collectionRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="font-medium text-purple-900">Total Capacity</p>
              <p className="text-purple-700">{totalCapacity.toLocaleString()} POAPs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
