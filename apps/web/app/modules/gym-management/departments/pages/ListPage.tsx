import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { DataTable } from '../../../../shared/components/table/DataTable';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../shared/components/ui/dropdown-menu';
import {
  Building2,
  Plus,
  Eye,
  Edit2,
  Users,
  DollarSign,
  Layers,
  MoreHorizontal,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { toast } from 'sonner';
import { useCurrencyStore } from '../../../../core/store/currencyStore';
import { formatCurrency } from '../../../../core/helpers/formatters';
import { IDepartment } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';
import { useLoadingStore } from '../../../../core/store/loadingStore';

export const DEFAULT_DEPARTMENTS: IDepartment[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currency } = useCurrencyStore();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const { startLoading, stopLoading } = useLoadingStore();
  const activeBranch = getActiveBranch();

  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDepartments();
  }, [activeBranchId]);

  const loadDepartments = async () => {
    setLoading(true);
    startLoading();
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/gym/departments', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setDepartments(items);
        localStorage.removeItem('gymflow_custom_gym_departments');
      } else {
        setDepartments([]);
      }
    } catch {
      setDepartments([]);
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const columns: ColumnDef<IDepartment>[] = [
    {
      accessorKey: 'name',
      header: 'Department',
      cell: ({ row }) => {
        const dept = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm hover:text-primary cursor-pointer" onClick={() => navigate(`/gym-management/departments/${dept.id}`)}>
                {dept.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{dept.code}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: 'managerName',
      header: 'Department Head',
      cell: ({ row }) => (
        <div className="text-xs">
          <p className="font-medium text-foreground">{row.original.headOfDepartment?.name || (row.original as any).managerName || 'Unassigned'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'headcount',
      header: 'Headcount',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-foreground">
          {row.original.headcount || 0} Staff
        </span>
      ),
    },
    {
      accessorKey: 'monthlyBudget',
      header: 'Monthly Budget',
      cell: ({ row }) => (
        <span className="text-xs font-mono font-medium text-foreground">
          {formatCurrency(row.original.monthlyBudget || 0, currency)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const dept = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/gym-management/departments/${dept.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(`/gym-management/departments/${dept.id}/edit`)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Derived metrics
  const totalDepts = departments.length;
  const totalHeadcount = departments.reduce((acc, d) => acc + (d.headcount || 0), 0);
  const totalBudget = departments.reduce((acc, d) => acc + (d.monthlyBudget || 0), 0);
  const totalActual = departments.reduce((acc, d) => acc + (d.actualSpend || 0), 0);

  return (
    <PageContainer>
      <PageHeader
        title="Departments"
        subtitle="Manage organizational business units, leadership assignments, operating budgets, and workforce allocation across your athletic clubs."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={loadDepartments}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-md shadow-primary/25"
              onClick={() => navigate('/gym-management/departments/create')}
            >
              <Plus className="h-4 w-4" />
              <span>Onboard Department</span>
            </Button>
          </>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Divisions"
          value={`${totalDepts} Business Units`}
          change="Operational"
          trend="up"
          timeframe={activeBranch ? activeBranch.name : 'Network Wide'}
          icon={<Layers className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Workforce"
          value={`${totalHeadcount} Staff & Coaches`}
          change="Assigned Headcount"
          trend="up"
          timeframe="Across divisions"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Monthly Department Budget"
          value={formatCurrency(totalBudget, currency)}
          change="Allocated"
          trend="neutral"
          timeframe="Payroll & Operations"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Budget Utilization"
          value={`${totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0}%`}
          change={`${formatCurrency(totalActual, currency)} spent`}
          trend="up"
          timeframe="Within monthly target"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Clean Table without outer wrapper */}
      <DataTable
        columns={columns}
        data={departments}
        loading={loading}
        searchPlaceholder="Search departments by name, code, manager, or category..."
      />
    </PageContainer>
  );
};
