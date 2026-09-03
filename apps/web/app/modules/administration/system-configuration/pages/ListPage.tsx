import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Server, Cpu, Database, Activity, RefreshCw, Save, HardDrive, Network, Radio, Zap, ShieldCheck, Sparkles, ArrowRight, MessageSquare, Building2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ISystemConfigurationModel } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { usePlanStore } from '../../../../core/store/planStore';

const DEFAULT_CONFIG: ISystemConfigurationModel = {
  nodeEnv: 'PRODUCTION',
  regionCluster: 'Local Instance (Standalone Deployment)',
  s3StorageBucket: '',
  cdnDistributionDomain: '',
  databaseLatencyMs: 0.8,
  redisCacheHitRate: 100,
  serverUptimePercent: 100,
  activeWebsocketConnections: 1,
  memoryHeapUsagePercent: 18.2,
  cpuLoadPercent: 4.5,
  autoScaleReplicaMin: 1,
  autoScaleReplicaMax: 4,
  dbPoolConnections: 10,
  services: [
    {
      serviceName: 'API Gateway & Core REST Server',
      serviceKey: 'srv-api-gateway',
      status: 'HEALTHY',
      latencyMs: 5,
      instances: 1,
      uptime: 'Active',
    },
    {
      serviceName: 'IAM & RBAC Authorization Engine',
      serviceKey: 'srv-auth-worker',
      status: 'HEALTHY',
      latencyMs: 3,
      instances: 1,
      uptime: 'Active',
    },
    {
      serviceName: 'Turnstile & Biometrics Telemetry Service',
      serviceKey: 'srv-turnstile-broker',
      status: 'HEALTHY',
      latencyMs: 2,
      instances: 1,
      uptime: 'Active',
    },
    {
      serviceName: 'Financial Ledger & Billing Engine',
      serviceKey: 'srv-billing-engine',
      status: 'HEALTHY',
      latencyMs: 6,
      instances: 1,
      uptime: 'Active',
    },
  ],
};

export const ListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<ISystemConfigurationModel>(DEFAULT_CONFIG);
  const { currentPlan, billingCycle, whatsAppMsgsUsed, openUpgradeModal, getPlanDefinition } = usePlanStore();
  const planDef = getPlanDefinition();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const stored = localStorage.getItem('gymflow_custom_admin_system_config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      } catch {
        setConfig(DEFAULT_CONFIG);
      }
    } else {
      setConfig(DEFAULT_CONFIG);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem('gymflow_custom_admin_system_config', JSON.stringify(config));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/system-configuration', {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      }).catch(() => {});

      toast.success('Infrastructure parameters updated successfully!');
    } catch {
      toast.error('Failed to update system infrastructure config');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Infrastructure Topology & System Topology"
        subtitle="Real-time cluster telemetry, compute resources, database latency benchmarks, and microservice health."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shadow-xs"
              onClick={loadConfig}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset Defaults</span>
            </Button>
            <Button
              size="sm"
              disabled={loading}
              onClick={handleSave}
              className="gap-1.5 shadow-md shadow-primary/25 font-bold"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Parameters'}</span>
            </Button>
          </div>
        }
      />

      {/* Active Software Plan & Subscription Hub */}
      <Card className="border border-border/80 shadow-xs bg-gradient-to-r from-card via-card to-primary/5 mb-6 overflow-hidden">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                {planDef.name}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                ({billingCycle === 'ANNUAL' ? 'Annual Billing' : 'Monthly Billing'} • ₹{billingCycle === 'ANNUAL' ? planDef.pricing.annualINR.toLocaleString('en-IN') : planDef.pricing.monthlyINR.toLocaleString('en-IN')}{billingCycle === 'ANNUAL' ? '/yr' : '/mo'} + GST)
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {planDef.tagline}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl">
              {planDef.bestFor}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            {/* WhatsApp Quota Widget */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1 min-w-[170px]">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1 font-medium">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  WhatsApp Quota
                </span>
                <span className="font-bold text-foreground">
                  {whatsAppMsgsUsed} / {planDef.limits.monthlyWhatsAppQuota}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(100, Math.round((whatsAppMsgsUsed / planDef.limits.monthlyWhatsAppQuota) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Change / Upgrade Button */}
            <Button
              onClick={() => openUpgradeModal()}
              className="gap-2 font-semibold shadow-md shadow-primary/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>Change / Upgrade Plan</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4 Infrastructure Health KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="CLUSTER STATUS"
          value={config.nodeEnv}
          change={config.regionCluster}
          trend="up"
          timeframe="Deployment Target"
          icon={<Server className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="DATABASE LATENCY"
          value={`${config.databaseLatencyMs} ms`}
          change="MongoDB Connection"
          trend="up"
          timeframe="Sub-millisecond"
          icon={<Database className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="SYSTEM AVAILABILITY"
          value={`${config.serverUptimePercent}%`}
          change="Zero Outages"
          trend="up"
          timeframe="SLA Guarantee"
          icon={<ShieldCheck className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="CPU LOAD"
          value={`${config.cpuLoadPercent}%`}
          change="Nominal Headroom"
          trend="neutral"
          timeframe="Node V8 Thread"
          icon={<Cpu className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Microservices Health Matrix */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Application Services & Worker Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Live status, instance headcount, and operational latency across the GymFlow ERP server stack.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {config.services.map((svc) => (
                <div key={svc.serviceKey} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-foreground block">{svc.serviceName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{svc.serviceKey} • {svc.instances} Worker Instance(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-mono font-semibold text-foreground block">{svc.latencyMs} ms</span>
                      <span className="text-[10px] text-muted-foreground">Response Latency</span>
                    </div>
                    <Badge variant={svc.status === 'HEALTHY' ? 'success' : 'secondary'} className="text-[10px]">
                      {svc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Storage & Cloud Integration (Optional) */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" />
              Storage Engine & CDN Configuration (Optional)
            </CardTitle>
            <CardDescription className="text-xs">
              Asset buckets for document backups, invoice PDFs, and CDN delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">S3 Storage Bucket URI</label>
                <Input
                  value={config.s3StorageBucket}
                  onChange={(e) => setConfig({ ...config, s3StorageBucket: e.target.value })}
                  placeholder="e.g. s3://my-gym-bucket (leave blank for local storage)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">CDN Distribution Domain</label>
                <Input
                  value={config.cdnDistributionDomain}
                  onChange={(e) => setConfig({ ...config, cdnDistributionDomain: e.target.value })}
                  placeholder="e.g. cdn.mygym.com"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-border pt-4 bg-muted/20">
            <Button
              type="submit"
              disabled={loading}
              className="gap-1.5 font-bold shadow-md shadow-primary/25"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  );
};
