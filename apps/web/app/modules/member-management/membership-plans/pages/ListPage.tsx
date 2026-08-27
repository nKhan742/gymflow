import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Card, CardContent } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  ShieldCheck,
  Plus,
  Check,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  CreditCard,
  Crown,
  Eye,
  Edit2,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';

interface IMembershipPlanItem {
  id: string;
  _id?: string;
  name: string;
  code?: string;
  description?: string;
  tier: string;
  price: number;
  currency: string;
  billingCycle: string;
  initiationFee: number;
  accessHours: string;
  multiBranch: boolean;
  inclusions: string[];
  maxFreezeDays: number;
  popular?: boolean;
  status: string;
}

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<IMembershipPlanItem[]>([]);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('http://localhost:5000/api/v1/member-management/membership-plans', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPlans(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setLoading(false);
  };

  const columns: ColumnDef<IMembershipPlanItem>[] = [
    {
      accessorKey: 'code',
      header: 'Plan Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code') || 'PLAN-001'}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Plan Tier Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.popular && <Crown className="h-4 w-4 text-amber-500 shrink-0" />}
          <span className="font-semibold text-sm text-foreground truncate">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Pricing & Cadence',
      cell: ({ row }) => (
        <div>
          <span className="font-extrabold text-sm text-foreground font-mono">
            ${row.getValue('price')}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            / {row.original.billingCycle?.toLowerCase()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'accessHours',
      header: 'Access Level',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-normal">
          {row.original.accessHours}
        </Badge>
      ),
    },
    {
      accessorKey: 'maxFreezeDays',
      header: 'Freeze Allowance',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.maxFreezeDays ? `${row.original.maxFreezeDays} days / yr` : 'No Freeze'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'} className="text-xs capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/member-management/members/create`)}
            className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 transition-all"
            title="Assign this plan to a new member"
          >
            <span>Assign</span>
          </button>
          <button
            onClick={() => navigate(`/member-management/membership-plans/${row.original.id || row.original.code}`)}
            className="h-7 w-7 rounded-lg border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shadow-xs"
            title="View Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Membership Plans & Subscription Tiers"
        subtitle="Configure all membership packages, pricing tiers, facility access hours, and gym perks."
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
              <button
                onClick={() => setViewMode('CARDS')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'CARDS'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'TABLE'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Data Table View"
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => {
                toast.info('Plan Creator Opened');
                navigate('/member-management/membership-plans/create');
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Create Plan</span>
            </Button>
          </div>
        }
      />

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Membership Plans"
          value={`${plans.length}`}
          change="6 Published Tiers"
          trend="up"
          timeframe="All locations"
          icon={<Crown className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="Top Subscribed Tier"
          value="VIP Platinum"
          change="48% of Members"
          trend="up"
          timeframe="Highest grossing"
          icon={<Sparkles className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Average Plan Value"
          value="$780"
          change="+14.2% YoY"
          trend="up"
          timeframe="Annualized ARPU"
          icon={<CreditCard className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      {/* View Content */}
      {viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <Card
              key={plan.id || plan.code}
              className={`border transition-all flex flex-col justify-between relative overflow-hidden ${
                plan.popular
                  ? 'border-primary/60 shadow-lg shadow-primary/10 ring-1 ring-primary/30'
                  : 'border-border/80 bg-card hover:border-border hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-l from-primary to-purple-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <CardContent className="p-6 space-y-5">
                {/* Plan Header */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-base text-foreground tracking-tight">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-foreground font-mono">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      / {plan.billingCycle?.toLowerCase()}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {plan.code}
                  </Badge>
                </div>

                {/* Key Telemetry Badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{plan.accessHours}</span>
                  </span>
                  {plan.multiBranch && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Multi-Branch Access</span>
                    </span>
                  )}
                  {plan.maxFreezeDays > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-amber-500" />
                      <span>{plan.maxFreezeDays}d Freeze Allowance</span>
                    </span>
                  )}
                </div>

                {/* Inclusions Checklist */}
                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Plan Entitlements:
                  </p>
                  <ul className="space-y-1.5 text-xs text-foreground">
                    {(plan.inclusions || []).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="h-4 w-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                        <span className="text-muted-foreground leading-tight">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-border flex items-center gap-2">
                  <Button
                    onClick={() => navigate('/member-management/members/create')}
                    className="flex-1 gap-1.5 text-xs shadow-xs"
                    size="sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Assign to Member</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/member-management/membership-plans/${plan.id || plan.code}`)}
                    className="text-xs px-2.5"
                    title="View details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={plans}
          searchPlaceholder="Search plans by name, code, tier..."
        />
      )}
    </PageContainer>
  );
};
