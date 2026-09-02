import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { Plus, Download, UserCheck, ShieldCheck, Eye, Edit, Trash2, Clock, Phone, Mail, MessageSquare, CheckCircle2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IVisitor } from '../types';
import { toast } from 'sonner';

export const DEFAULT_VISITORS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchStore();
  const [visitors, setVisitors] = useState<IVisitor[]>([]);

  useEffect(() => {
    loadVisitors();
  }, [activeBranchId]);

  const loadVisitors = async () => {
    try {
      const stored = localStorage.getItem('gymflow_custom_visitors');
      const customVisitors: IVisitor[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/crm/visitors', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedVisitors: IVisitor[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedVisitors = json.data.items;
        }
      }

      const combined = [...customVisitors];
      const allSources = fetchedVisitors.length > 0 ? fetchedVisitors : DEFAULT_VISITORS;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setVisitors(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_visitors');
      const customVisitors: IVisitor[] = stored ? JSON.parse(stored) : [];
      const combined = [...customVisitors];
      for (const item of DEFAULT_VISITORS) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setVisitors(combined);
    }
  };

  const handleCompleteTour = (id: string, name: string) => {
    const updated = visitors.map((v) => {
      if ((v.id || v._id) === id) {
        return {
          ...v,
          status: 'COMPLETED' as IVisitor['status'],
          checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return v;
    });
    setVisitors(updated);

    const stored = localStorage.getItem('gymflow_custom_visitors');
    if (stored) {
      const customList: IVisitor[] = JSON.parse(stored);
      const updatedCustom = customList.map((v) => {
        if ((v.id || v._id) === id) {
          return {
            ...v,
            status: 'COMPLETED' as IVisitor['status'],
            checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return v;
      });
      localStorage.setItem('gymflow_custom_visitors', JSON.stringify(updatedCustom));
    }

    toast.success(`Campus visit completed for ${name}!`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = visitors.filter((v) => (v.id || v._id) !== id);
    setVisitors(updated);

    const stored = localStorage.getItem('gymflow_custom_visitors');
    if (stored) {
      const customList: IVisitor[] = JSON.parse(stored);
      const filtered = customList.filter((v) => (v.id || v._id) !== id);
      localStorage.setItem('gymflow_custom_visitors', JSON.stringify(filtered));
    }

    toast.success(`Visitor log for "${name}" deleted`);
  };

  const handleConvertToLead = (visitor: IVisitor) => {
    toast.success(`Enrolling visitor "${visitor.visitorName}" into Sales Pipeline...`);
    navigate('/crm/leads/create', {
      state: {
        prefill: {
          name: visitor.visitorName,
          email: visitor.email,
          phone: visitor.phone,
          avatarUrl: visitor.avatarUrl,
          source: 'WALK_IN',
        },
      },
    });
  };

  // Telemetry
  const totalGuests = visitors.length;
  const activeNow = visitors.filter((v) => v.status === 'CHECKED_IN').length;
  const toursHosted = visitors.filter((v) => v.purpose === 'CAMPUS_TOUR').length;
  const signedWaivers = visitors.filter((v) => v.waiverSigned).length;

  const columns: ColumnDef<IVisitor>[] = [
    {
      accessorKey: 'visitorName',
      header: 'Guest Dossier',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border shrink-0">
              <AvatarImage src={row.original.avatarUrl} alt={row.original.visitorName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {row.original.visitorName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <button
                type="button"
                onClick={() => navigate(`/crm/visitors/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.visitorName}
              </button>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                <span className="font-semibold text-primary">{row.original.badgeNumber}</span>
                <span>•</span>
                <span className="truncate">{row.original.email}</span>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Rapid Contact',
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="text-xs font-mono text-foreground flex items-center gap-1">
            <Phone className="h-3 w-3 text-primary shrink-0" /> {row.original.phone}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 gap-1"
            onClick={() => {
              const cleanPhone = (row.original.phone || '').replace(/[^0-9]/g, '');
              window.open(`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(row.original.visitorName)}%2C%20welcome%20to%20GymFlow!`, '_blank');
            }}
          >
            <MessageSquare className="h-3 w-3" />
            <span>WhatsApp</span>
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'purpose',
      header: 'Purpose',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-semibold bg-muted/40 whitespace-nowrap">
          {row.original.purpose?.replace(/_/g, ' ') || 'TOUR'}
        </Badge>
      ),
    },
    {
      accessorKey: 'hostStaff',
      header: 'Host Staff',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground truncate block">
          {row.original.hostStaff}
        </span>
      ),
    },
    {
      accessorKey: 'checkInTime',
      header: 'Time & Campus',
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-mono font-medium text-foreground block flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" /> {row.original.checkInTime}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            {row.original.branchName || 'PD Vihar'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'waiverSigned',
      header: 'Waiver',
      cell: ({ row }) => (
        <Badge
          className={
            row.original.waiverSigned
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold gap-1'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-semibold'
          }
        >
          {row.original.waiverSigned ? '✓ Signed' : 'Pending'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === 'CHECKED_IN'
                ? 'success'
                : s === 'COMPLETED'
                ? 'secondary'
                : 'destructive'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ') || 'ACTIVE'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        const isCheckedIn = row.original.status === 'CHECKED_IN';
        return (
          <div className="flex items-center gap-1.5">
            {isCheckedIn && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[10px] gap-1 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 border-blue-500/30 font-semibold"
                onClick={() => handleCompleteTour(id || '', row.original.visitorName)}
                title="Mark Visit Completed"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Finish</span>
              </Button>
            )}
            <Button
              size="sm"
              className="h-7 px-2 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
              onClick={() => handleConvertToLead(row.original)}
              title="Add to Prospect Pipeline"
            >
              <UserPlus className="h-3 w-3" />
              <span>To Lead</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/visitors/${id}`)}
              title="View Visitor Log"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/crm/visitors/${id}/edit`)}
              title="Edit Visitor Entry"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.visitorName)}
              title="Delete Visitor"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Visitor Registration & Campus Tours"
        subtitle="Manage front-desk guest intake, digital liability waivers, and sales tour assignments."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Name,Badge,Email,Phone,Purpose,Host,Status,Waiver\n' + visitors.map((v) => `"${v.visitorName}","${v.badgeNumber}","${v.email}","${v.phone}","${v.purpose}","${v.hostStaff}","${v.status}",${v.waiverSigned}`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `visitors-log-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Visitor logs exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/crm/visitors/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Check-In Visitor</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL GUESTS LOGGED"
          value={`${totalGuests}`}
          change="+15% this week"
          trend="up"
          timeframe="Campus Foot-Traffic"
          icon={<UserCheck className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="ON PREMISES NOW"
          value={`${activeNow}`}
          change="Currently touring facility"
          trend="up"
          timeframe="Active Floor Badges"
          icon={<Clock className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="FACILITY TOURS HOSTED"
          value={`${toursHosted}`}
          change="Coach & Staff lead"
          trend="up"
          timeframe="Prospect Walkthroughs"
          icon={<Eye className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="DIGITAL WAIVER RATE"
          value={`${totalGuests > 0 ? Math.round((signedWaivers / totalGuests) * 100) : 100}%`}
          change="100% Policy compliant"
          trend="up"
          timeframe="Safety Verification"
          icon={<ShieldCheck className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={visitors}
        searchPlaceholder="Search visitors by name, badge #, host staff, phone..."
      />
    </PageContainer>
  );
};
