import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Share2,
  Download,
  Settings,
  Eye,
  QrCode
} from 'lucide-react';
import { EventData } from '@/services/contractService';
import { QRCodeGenerator } from './QRCodeGenerator';

interface EventDashboardProps {
  event: EventData;
  className?: string;
}

export const EventDashboard: React.FC<EventDashboardProps> = ({ event, className }) => {
  const [mintingData, setMintingData] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);

  // Calculate event metrics
  const mintingProgress = (event.totalMinted / event.maxCapacity) * 100;
  const isEventActive = event.isActive;
  const isEventStarted = Date.now() > event.startTime * 1000;
  const isEventEnded = Date.now() > event.endTime * 1000;
  const daysUntilStart = Math.ceil((event.startTime * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
  const daysUntilEnd = Math.ceil((event.endTime * 1000 - Date.now()) / (1000 * 60 * 60 * 24));

  // Mock data for charts (in a real app, this would come from analytics)
  useEffect(() => {
    // Generate mock minting data over time
    const mockMintingData = [];
    const days = 7;
    for (let i = 0; i < days; i++) {
      mockMintingData.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        mints: Math.floor(Math.random() * 20) + 5,
        cumulative: Math.floor((i + 1) * (event.totalMinted / days))
      });
    }
    setMintingData(mockMintingData);

    // Generate hourly data for today
    const mockTimeData = [];
    for (let i = 0; i < 24; i++) {
      mockTimeData.push({
        hour: `${i}:00`,
        mints: Math.floor(Math.random() * 10)
      });
    }
    setTimeData(mockTimeData);
  }, [event.totalMinted]);

  const getEventStatus = () => {
    if (!isEventStarted) return { label: 'Upcoming', color: 'bg-blue-500' };
    if (isEventEnded) return { label: 'Ended', color: 'bg-gray-500' };
    if (isEventActive) return { label: 'Active', color: 'bg-green-500' };
    return { label: 'Paused', color: 'bg-yellow-500' };
  };

  const status = getEventStatus();

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
            <p className="text-muted-foreground mb-4">{event.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.startTime * 1000).toLocaleDateString()} - {new Date(event.endTime * 1000).toLocaleDateString()}
                </span>
              </div>
              <Badge className={`${status.color} text-white`}>
                {status.label}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">POAPs Minted</p>
                <p className="text-2xl font-bold">{event.totalMinted}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4">
              <Progress value={mintingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {mintingProgress.toFixed(1)}% of capacity
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                <p className="text-2xl font-bold">{event.maxCapacity}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {event.maxCapacity - event.totalMinted} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isEventStarted ? 'Days Until End' : 'Days Until Start'}
                </p>
                <p className="text-2xl font-bold">
                  {isEventStarted ? daysUntilEnd : daysUntilStart}
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {isEventEnded ? 'Event has ended' : isEventStarted ? 'Event in progress' : 'Event upcoming'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minting Rate</p>
                <p className="text-2xl font-bold">
                  {event.totalMinted > 0 ? '12%' : '0%'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              vs. similar events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Minting Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Minting Progress</CardTitle>
                <CardDescription>POAPs minted over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mintingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cumulative" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Minting Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
                <CardDescription>Hourly minting activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mints" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Mints</CardTitle>
              <CardDescription>Latest POAP minting activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">POAP #{1000 + i}</p>
                        <p className="text-sm text-muted-foreground">
                          Minted to 5G...{Math.random().toString(36).substr(2, 6)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 60)} minutes ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Minting Trends</CardTitle>
                <CardDescription>Weekly minting activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mintingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mints" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Avg. Time to Mint</span>
                  <span className="text-sm text-muted-foreground">2.3 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Peak Hour</span>
                  <span className="text-sm text-muted-foreground">14:00-15:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Bounce Rate</span>
                  <span className="text-sm text-muted-foreground">12%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <QRCodeGenerator event={event} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
              <CardDescription>Manage your event configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Event Status</p>
                  <p className="text-sm text-muted-foreground">Control event minting availability</p>
                </div>
                <Badge className={`${status.color} text-white`}>
                  {status.label}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Visibility</p>
                  <p className="text-sm text-muted-foreground">Show event in public listings</p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Public
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Minting Permissions</p>
                  <p className="text-sm text-muted-foreground">Who can mint POAPs for this event</p>
                </div>
                <Button variant="outline" size="sm">
                  Organizer Only
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
