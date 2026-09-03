import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Plus, Download, Dumbbell, CheckCircle2, AlertTriangle, DollarSign, Eye, Edit, Trash2, Tag, Wrench, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IEquipment } from '../types';
import { toast } from 'sonner';

export const DEFAULT_EQUIPMENT: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { activeBranchId } = useBranchStore();
  const [equipmentList, setEquipmentList] = useState<IEquipment[]>([]);

  useEffect(() => {
    loadEquipment();
  }, [activeBranchId]);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_equipment');
      const customList: IEquipment[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/equipment/equipment-list', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      let fetchedList: IEquipment[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.items) {
          fetchedList = json.data.items;
        }
      }

      const combined = [...customList];
      const allSources = fetchedList.length > 0 ? fetchedList : DEFAULT_EQUIPMENT;
      for (const item of allSources) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setEquipmentList(combined);
    } catch {
      const stored = localStorage.getItem('gymflow_custom_equipment');
      const customList: IEquipment[] = stored ? JSON.parse(stored) : [];
      const combined = [...customList];
      for (const item of DEFAULT_EQUIPMENT) {
        const id = item.id || item._id;
        if (!combined.some((c) => (c.id || c._id) === id)) {
          combined.push(item);
        }
      }
      setEquipmentList(combined);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: IEquipment['status']) => {
    const nextStatus: IEquipment['status'] =
      currentStatus === 'OPERATIONAL'
        ? 'MAINTENANCE_REQUIRED'
        : currentStatus === 'MAINTENANCE_REQUIRED'
        ? 'OUT_OF_SERVICE'
        : 'OPERATIONAL';

    const updated = equipmentList.map((e) => {
      if ((e.id || e._id) === id) {
        return { ...e, status: nextStatus };
      }
      return e;
    });
    setEquipmentList(updated);

    const stored = localStorage.getItem('gymflow_custom_equipment');
    if (stored) {
      const customList: IEquipment[] = JSON.parse(stored);
      const updatedCustom = customList.map((e) => {
        if ((e.id || e._id) === id) {
          return { ...e, status: nextStatus };
        }
        return e;
      });
      localStorage.setItem('gymflow_custom_equipment', JSON.stringify(updatedCustom));
    }

    toast.success(`Machine status updated to ${nextStatus}!`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = equipmentList.filter((e) => (e.id || e._id) !== id);
    setEquipmentList(updated);

    const stored = localStorage.getItem('gymflow_custom_equipment');
    if (stored) {
      const customList: IEquipment[] = JSON.parse(stored);
      const filtered = customList.filter((e) => (e.id || e._id) !== id);
      localStorage.setItem('gymflow_custom_equipment', JSON.stringify(filtered));
    }

    toast.success(`Equipment asset "${name}" removed from registry`);
  };

  // Telemetry metrics
  const totalAssets = equipmentList.length;
  const operationalCount = equipmentList.filter((e) => e.status === 'OPERATIONAL').length;
  const maintenanceCount = equipmentList.filter((e) => e.status === 'MAINTENANCE_REQUIRED' || e.status === 'OUT_OF_SERVICE').length;
  const totalValuation = equipmentList.reduce((acc, curr) => acc + (curr.purchasePrice || 0), 0);

  const columns: ColumnDef<IEquipment>[] = [
    {
      accessorKey: 'name',
      header: 'Equipment Machine',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-3">
            <div className="h-11 w-14 rounded-lg overflow-hidden border border-border shrink-0 bg-muted/40">
              <img
                src={row.original.photoUrl || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&auto=format&fit=crop&q=80'}
                alt={row.original.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="truncate">
              <button
                type="button"
                onClick={() => navigate(`/equipment/equipment-list/${id}`)}
                className="font-bold text-xs text-foreground block truncate hover:underline hover:text-primary text-left cursor-pointer"
              >
                {row.original.name}
              </button>
              <span className="text-[11px] text-muted-foreground block truncate">
                {row.original.brand} • {row.original.model}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'assetTag',
      header: 'Asset Tag',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-[10px] font-bold bg-muted/40 gap-1">
          <Tag className="w-3 h-3 text-primary" />
          {row.original.assetTag}
        </Badge>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-[10px] font-semibold">
          {row.original.category?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'zoneName',
      header: 'Floor Placement',
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <span className="text-xs font-medium text-foreground block truncate">
            {row.original.zoneName}
          </span>
          <span className="text-[10px] text-muted-foreground block truncate">
            {row.original.branchName || 'Main Facility'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'condition',
      header: 'Condition',
      cell: ({ row }) => {
        const c = row.original.condition;
        return (
          <Badge
            variant={
              c === 'EXCELLENT'
                ? 'success'
                : c === 'GOOD'
                ? 'default'
                : c === 'FAIR'
                ? 'warning'
                : 'destructive'
            }
            className="text-[10px] font-bold uppercase"
          >
            {c}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Operational State',
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === 'OPERATIONAL'
                ? 'success'
                : s === 'MAINTENANCE_REQUIRED'
                ? 'warning'
                : 'destructive'
            }
            className="text-[10px] font-semibold uppercase"
          >
            {s?.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id || row.original._id;
        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-1.5 text-[10px] text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/30 gap-1 font-semibold"
              onClick={() => handleToggleStatus(id || '', row.original.status)}
              title="Toggle State / Log Maintenance"
            >
              <Wrench className="h-3 w-3" />
              <span>Status</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/equipment/equipment-list/${id}`)}
              title="View 360° Machine Dossier"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigate(`/equipment/equipment-list/${id}/edit`)}
              title="Edit Equipment Asset"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-rose-500 hover:bg-rose-500/10 border-rose-500/30"
              onClick={() => handleDelete(id || '', row.original.name)}
              title="Delete Asset"
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
        title="Equipment Assets & Inventory Registry"
        subtitle="Manage gym machine telemetry, asset tags, warranty coverage, and real-time operational availability."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const csv = 'Name,AssetTag,Category,Brand,Model,Zone,Status,Condition,Valuation\n' + equipmentList.map((e) => `"${e.name}","${e.assetTag}","${e.category}","${e.brand}","${e.model}","${e.zoneName}","${e.status}","${e.condition}","$${e.purchasePrice}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `equipment-registry-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                toast.success('Equipment assets exported to CSV');
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/equipment/equipment-list/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Register Asset</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL ASSETS CATALOGED"
          value={`${totalAssets} Units`}
          change="+6 added this quarter"
          trend="up"
          timeframe="Fleet Registry"
          icon={<Dumbbell className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="OPERATIONAL MACHINES"
          value={`${operationalCount}`}
          change={`${totalAssets > 0 ? Math.round((operationalCount / totalAssets) * 100) : 100}% floor availability`}
          trend="up"
          timeframe="Ready for Member Use"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="MAINTENANCE REQUIRED"
          value={`${maintenanceCount}`}
          change={maintenanceCount > 0 ? 'Work order open' : 'All machines healthy'}
          trend={maintenanceCount > 0 ? 'down' : 'neutral'}
          timeframe="Inspection Queue"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="TOTAL FLEET VALUATION"
          value={`$${totalValuation.toLocaleString()}`}
          change="Insured capital assets"
          trend="up"
          timeframe="CapEx Portfolio"
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={equipmentList}
        loading={loading}
        searchPlaceholder="Search equipment by machine name, asset tag, brand, zone, status..."
      />
    </PageContainer>
  );
};
