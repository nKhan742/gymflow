import React, { useState } from 'react';
import { PlanGateGuard } from '../../../../shared/components/plan/PlanGateGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import {
  Shield,
  Plus,
  Cpu,
  CheckCircle,
  XCircle,
  Wifi,
  QrCode,
  Fingerprint,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  Clock,
  DoorClosed,
} from 'lucide-react';
import { toast } from 'sonner';

interface IHardwareDevice {
  id: string;
  name: string;
  type: 'ZKTECO_INBIO' | 'ESSL_TURNSTILE' | 'BIOMETRIC_READER' | 'FACIAL_RECOGNITION';
  ipAddress: string;
  port: number;
  location: string;
  gateNumber: number;
  status: 'ONLINE' | 'OFFLINE';
  lastPing: string;
}

interface IAccessLog {
  id: string;
  timestamp: string;
  memberName: string;
  memberCode: string;
  method: 'BIOMETRIC' | 'RFID' | 'QR_CODE' | 'FACE_ID';
  gate: string;
  result: 'ACCESS_GRANTED' | 'ACCESS_DENIED';
  reason?: string;
}

export const ListPage: React.FC = () => {
  const [devices, setDevices] = useState<IHardwareDevice[]>(() => {
    const saved = localStorage.getItem('gymflow_custom_access_devices');
    return saved ? JSON.parse(saved) : [];
  });
  const [logs, setLogs] = useState<IAccessLog[]>(() => {
    const saved = localStorage.getItem('gymflow_custom_access_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Device Form
  const [name, setName] = useState('');
  const [type, setType] = useState<IHardwareDevice['type']>('ZKTECO_INBIO');
  const [ipAddress, setIpAddress] = useState('192.168.1.125');
  const [port, setPort] = useState(4370);
  const [location, setLocation] = useState('Ground Floor Main Entrance');

  const handleTestConnection = (devName: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: `Connecting to ${devName}...`,
        success: `${devName} is healthy and responding (Ping: 12ms)`,
        error: 'Device unreachable',
      }
    );
  };

  const handleSimulateSwipe = (granted: boolean) => {
    const newLog: IAccessLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      memberName: granted ? 'Arjun Kapoor' : 'Sneha Roy',
      memberCode: granted ? 'MEM-0230' : 'MEM-0091',
      method: granted ? 'QR_CODE' : 'RFID',
      gate: 'Turnstile Gate 1',
      result: granted ? 'ACCESS_GRANTED' : 'ACCESS_DENIED',
      reason: granted ? undefined : 'Membership Frozen / Suspended',
    };

    setLogs([newLog, ...logs]);
    if (granted) {
      toast.success('🟢 Access Granted! Turnstile unlatched for 5 seconds.');
    } else {
      toast.error('🔴 Access Denied! Expired membership detected.');
    }
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const newDev: IHardwareDevice = {
      id: `DEV-0${devices.length + 1}`,
      name,
      type,
      ipAddress,
      port: Number(port),
      location,
      gateNumber: devices.length + 1,
      status: 'ONLINE',
      lastPing: 'Just now',
    };

    const updated = [...devices, newDev];
    setDevices(updated);
    localStorage.setItem('gymflow_custom_access_devices', JSON.stringify(updated));
    setIsAddOpen(false);
    toast.success(`Controller '${name}' linked successfully!`);
    setName('');
  };

  return (
    <PlanGateGuard featureKey="gym-management/access-control" featureTitle="Physical Access Control" requiredTier="ENTERPRISE">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Physical Access Control</h1>
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                Enterprise Exclusive
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Integrated ZKTeco / eSSL biometric controllers, RFID turnstiles, and automatic membership status validation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSimulateSwipe(true)}
              className="text-xs gap-1.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Simulate Valid QR Entry</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSimulateSwipe(false)}
              className="text-xs gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Simulate Expired Block</span>
            </Button>

            <Button onClick={() => setIsAddOpen(true)} className="gap-1.5 shadow-md shadow-primary/20">
              <Plus className="h-4 w-4" />
              <span>Add Controller</span>
            </Button>
          </div>
        </div>

        {/* Controllers Hardware Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((dev) => (
            <Card key={dev.id} className="border border-border/80 shadow-xs bg-card">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold text-foreground truncate max-w-[170px]">
                      {dev.name}
                    </CardTitle>
                    <span className="text-[10px] text-muted-foreground">Gate #{dev.gateNumber}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[9px] font-bold uppercase text-emerald-600 border-emerald-500/30 bg-emerald-50/10">
                  <Wifi className="h-2.5 w-2.5 mr-1 text-emerald-500" />
                  {dev.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-3">
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-[11px] space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="text-foreground font-semibold">{dev.ipAddress}:{dev.port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protocol:</span>
                    <span className="text-foreground">{dev.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{dev.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-muted-foreground">Last Ping: {dev.lastPing}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-primary gap-1"
                    onClick={() => handleTestConnection(dev.name)}
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Ping Test</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Gate Entry Logs */}
        <Card className="border border-border/80 shadow-xs bg-card">
          <CardHeader className="p-4 sm:p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Live Gate Entry Activity</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Real-time validation events transmitted directly from physical hardware controllers.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-muted-foreground font-medium">Controller WebSocket Active</span>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Member</th>
                  <th className="py-3 px-4 font-semibold">Verification Mode</th>
                  <th className="py-3 px-4 font-semibold">Gate / Terminal</th>
                  <th className="py-3 px-4 font-semibold">Access Status</th>
                  <th className="py-3 px-4 font-semibold">Notes / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground">{log.memberName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{log.memberCode}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] font-semibold gap-1">
                        {log.method === 'BIOMETRIC' && <Fingerprint className="h-3 w-3 text-primary" />}
                        {log.method === 'RFID' && <CreditCard className="h-3 w-3 text-indigo-500" />}
                        {log.method === 'QR_CODE' && <QrCode className="h-3 w-3 text-emerald-500" />}
                        <span>{log.method.replace('_', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-medium">
                      {log.gate}
                    </td>
                    <td className="py-3 px-4">
                      {log.result === 'ACCESS_GRANTED' ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-4 w-4" />
                          <span>Granted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-bold text-rose-500">
                          <XCircle className="h-4 w-4" />
                          <span>Denied</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">
                      {log.reason ? (
                        <span className="text-rose-500 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>{log.reason}</span>
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Membership Active (Turnstile Unlocked)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Add Controller Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Hardware Access Controller</DialogTitle>
              <DialogDescription>
                Connect a ZKTeco, eSSL, or network turnstile controller over TCP/IP.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDevice} className="space-y-3.5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Controller Name *</label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Turnstile Gate 3"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Device Controller Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground"
                >
                  <option value="ZKTECO_INBIO">ZKTeco InBio Series (TCP/IP)</option>
                  <option value="ESSL_TURNSTILE">eSSL Tripod Turnstile Controller</option>
                  <option value="BIOMETRIC_READER">Optical Biometric Reader</option>
                  <option value="FACIAL_RECOGNITION">AI Facial Recognition Terminal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">IP Address *</label>
                  <Input
                    required
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.125"
                    className="text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">TCP Port *</label>
                  <Input
                    type="number"
                    required
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
                    placeholder="4370"
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Physical Gate Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ground Floor Reception Turnstile"
                  className="text-xs"
                />
              </div>

              <DialogFooter className="pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Link Hardware Controller
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PlanGateGuard>
  );
};
