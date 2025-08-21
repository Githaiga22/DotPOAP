import React from 'react';
import { usePolkadot } from '@/contexts/PolkadotContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, Clock, Zap, Globe } from 'lucide-react';

export const ConnectionStatus: React.FC = () => {
  const { 
    api, 
    isApiReady, 
    apiError, 
    connectionMetrics, 
    reconnectApi 
  } = usePolkadot();

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  const formatLatency = (latency: number | null) => {
    if (latency === null) return 'Unknown';
    if (latency < 0) return 'Error';
    return `${latency.toFixed(0)}ms`;
  };

  const getConnectionStatusColor = () => {
    if (!api || !isApiReady) return 'destructive';
    if (!connectionMetrics.isHealthy) return 'secondary';
    if (connectionMetrics.latency && connectionMetrics.latency > 1000) return 'secondary';
    return 'default';
  };

  const getConnectionStatusIcon = () => {
    if (!api || !isApiReady) return <WifiOff className="h-4 w-4" />;
    if (!connectionMetrics.isHealthy) return <WifiOff className="h-4 w-4" />;
    return <Wifi className="h-4 w-4" />;
  };

  const getConnectionStatusText = () => {
    if (!api) return 'Disconnected';
    if (!isApiReady) return 'Connecting...';
    if (!connectionMetrics.isHealthy) return 'Unhealthy';
    return 'Connected';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            {getConnectionStatusIcon()}
            Network Status
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={reconnectApi}
            disabled={!api}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={getConnectionStatusColor()}>
            {getConnectionStatusText()}
          </Badge>
        </div>

        {/* Current Endpoint */}
        {connectionMetrics.currentEndpoint && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Endpoint:
            </span>
            <span className="text-xs text-muted-foreground max-w-48 truncate">
              {connectionMetrics.currentEndpoint.replace('wss://', '')}
            </span>
          </div>
        )}

        {/* Latency */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Latency:
          </span>
          <span className="text-sm">
            {formatLatency(connectionMetrics.latency)}
          </span>
        </div>

        {/* Connection Time */}
        {connectionMetrics.connectionTime && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Connect Time:
            </span>
            <span className="text-sm">
              {connectionMetrics.connectionTime.toFixed(0)}ms
            </span>
          </div>
        )}

        {/* Last Connected */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Last Connected:</span>
          <span className="text-sm text-muted-foreground">
            {formatTime(connectionMetrics.lastConnected)}
          </span>
        </div>

        {/* Reconnect Count */}
        {connectionMetrics.reconnectCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reconnects:</span>
            <span className="text-sm text-muted-foreground">
              {connectionMetrics.reconnectCount}
            </span>
          </div>
        )}

        {/* Error Display */}
        {apiError && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">Error:</p>
            <p className="text-xs text-destructive/80 mt-1">{apiError}</p>
          </div>
        )}

        {/* Network Info */}
        {isApiReady && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground">
              Connected to <strong>Asset Hub Paseo</strong> testnet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
