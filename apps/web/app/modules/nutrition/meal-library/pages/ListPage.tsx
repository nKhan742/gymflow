import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
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
  Utensils,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit2,
  Eye,
  Building2,
  Flame,
  Zap,
  Clock,
  Sparkles,
  Leaf,
  Coffee,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IMeal } from '../types';
import { useBranchStore } from '../../../../core/store/branchStore';

export const DEFAULT_MEALS: any[] = [];

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBranchId, getActiveBranch } = useBranchStore();
  const activeBranch = getActiveBranch();

  const [meals, setMeals] = useState<IMeal[]>(() => {
    try {
      const stored = localStorage.getItem('gymflow_custom_meals');
      const customList: IMeal[] = stored ? JSON.parse(stored) : [];
      const defaultIds = new Set(DEFAULT_MEALS.map((m) => m.id || m.code || ''));
      const newItems = customList.filter((m) => !defaultIds.has(m.id || m.code || ''));
      return [...newItems, ...DEFAULT_MEALS];
    } catch {
      return DEFAULT_MEALS;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMeals();
  }, [activeBranchId]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_meals');
      const customList: IMeal[] = stored ? JSON.parse(stored) : [];

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/meal-library', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const serverList = (json.success && Array.isArray(json.data) && json.data.length > 0)
          ? json.data
          : (json.data?.items?.length > 0 ? json.data.items : []);

        if (serverList.length > 0) {
          const map = new Map<string, IMeal>();
          DEFAULT_MEALS.forEach((m) => map.set(m.id || m.code || '', m));
          serverList.forEach((m: IMeal) => map.set(m.id || m.code || (m._id as string) || '', m));
          customList.forEach((m) => map.set(m.id || m.code || '', m));
          setMeals(Array.from(map.values()));
          return;
        }
      }

      const map = new Map<string, IMeal>();
      DEFAULT_MEALS.forEach((m) => map.set(m.id || m.code || '', m));
      customList.forEach((m) => map.set(m.id || m.code || '', m));
      setMeals(Array.from(map.values()));
    } catch {
      const stored = localStorage.getItem('gymflow_custom_meals');
      const customList: IMeal[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, IMeal>();
      DEFAULT_MEALS.forEach((m) => map.set(m.id || m.code || '', m));
      customList.forEach((m) => map.set(m.id || m.code || '', m));
      setMeals(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const filteredMeals = meals.filter((m) => {
    if (!activeBranchId || activeBranchId === 'ALL') return true;
    return m.branchId === 'ALL' || m.branchId === activeBranchId;
  });

  const highProteinCount = filteredMeals.filter((m) => m.proteinGrams >= 40).length;
  const veganCount = filteredMeals.filter((m) => m.dietaryType === 'VEGAN' || m.dietaryType === 'VEGETARIAN').length;
  const smoothieCount = filteredMeals.filter((m) => m.isSmoothieBarAvailable).length;

  const getDietaryBadge = (type: string) => {
    switch (type) {
      case 'HIGH_PROTEIN':
        return <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">⚡ High-Protein</Badge>;
      case 'KETO':
      case 'LOW_CARB':
        return <Badge variant="secondary" className="text-[10px] font-bold">🥑 Keto / Low-Carb</Badge>;
      case 'VEGAN':
        return <Badge variant="success" className="text-[10px] font-bold">🌱 100% Vegan</Badge>;
      case 'VEGETARIAN':
        return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px] font-bold">🥗 Vegetarian</Badge>;
      case 'MEDITERRANEAN':
        return <Badge variant="outline" className="text-blue-500 border-blue-500/30 text-[10px] font-bold">🐟 Mediterranean</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-bold">{type ? String(type).replace(/_/g, ' ') : 'Standard'}</Badge>;
    }
  };

  const columns: ColumnDef<IMeal>[] = [
    {
      accessorKey: 'code',
      header: 'Meal Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
          {row.getValue('code') || row.original.id}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Recipe & Details',
      cell: ({ row }) => {
        const meal = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80'}
              alt={meal.name}
              className="w-10 h-10 rounded-lg object-cover border border-border/80 shrink-0 bg-muted"
            />
            <div>
              <div
                onClick={() => navigate(`/nutrition/meal-library/${meal.id || meal._id}`)}
                className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-xs line-clamp-1"
              >
                {meal.name}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meal.prepTimeMinutes}m prep</span>
                <span>•</span>
                <span>{meal.mealCategory ? String(meal.mealCategory).replace(/_/g, ' ') : 'Meal'}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'dietaryType',
      header: 'Dietary Protocol',
      cell: ({ row }) => getDietaryBadge(row.original.dietaryType),
    },
    {
      accessorKey: 'calories',
      header: 'Calorie & Macro Profile',
      cell: ({ row }) => {
        const meal = row.original;
        const totalGrams = (meal.proteinGrams || 0) + (meal.carbsGrams || 0) + (meal.fatsGrams || 0) || 1;
        const pPercent = Math.round(((meal.proteinGrams || 0) / totalGrams) * 100);
        const cPercent = Math.round(((meal.carbsGrams || 0) / totalGrams) * 100);
        const fPercent = Math.round(((meal.fatsGrams || 0) / totalGrams) * 100);

        return (
          <div className="space-y-1.5 w-40">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-foreground flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" /> {meal.calories} kcal
              </span>
              <span className="text-muted-foreground text-[10px]">P:{meal.proteinGrams}g | C:{meal.carbsGrams}g | F:{meal.fatsGrams}g</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex">
              <div className="bg-primary h-full" style={{ width: `${pPercent}%` }} title={`Protein: ${pPercent}%`} />
              <div className="bg-amber-500 h-full" style={{ width: `${cPercent}%` }} title={`Carbs: ${cPercent}%`} />
              <div className="bg-rose-500 h-full" style={{ width: `${fPercent}%` }} title={`Fats: ${fPercent}%`} />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'isSmoothieBarAvailable',
      header: 'Fuel Bar Ready',
      cell: ({ row }) => (
        row.original.isSmoothieBarAvailable ? (
          <Badge variant="success" className="gap-1 text-[10px] font-bold">
            <Zap className="w-3 h-3" /> Smoothie Bar
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground text-[10px]">
            Kitchen Prep
          </Badge>
        )
      ),
    },
    {
      accessorKey: 'branchName',
      header: 'Branch Scope',
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1 text-[11px] font-medium border-border/80">
          <Building2 className="w-3 h-3 text-muted-foreground" />
          {row.getValue('branchName') || 'All Locations'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const mealId = row.original.id || row.original._id;
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate(`/nutrition/meal-library/${mealId}`)}
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>360° Recipe Hub</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/nutrition/meal-library/${mealId}/edit`)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit Meal Profile</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Meal Library"
        subtitle="Curated athletic whole-food recipes, macronutrient telemetry, and gym smoothie bar formula specifications."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMeals}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/nutrition/meal-library/create')}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Meal Recipe</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="TOTAL MASTER MEALS"
          value={`${filteredMeals.length} Recipes`}
          change="Full Macro Tested"
          trend="up"
          icon={<Utensils className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="HIGH-PROTEIN OPTIONS"
          value={`${highProteinCount} Recipes`}
          change="≥ 40g Protein"
          trend="up"
          icon={<Zap className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="PLANT-BASED / VEGAN"
          value={`${veganCount} Recipes`}
          change="100% Meatless"
          trend="up"
          icon={<Leaf className="h-4 w-4 text-emerald-500" />}
        />
        <MetricCard
          title="SMOOTHIE BAR READY"
          value={`${smoothieCount} Shakes`}
          change="Instant Blend POS"
          trend="up"
          icon={<Coffee className="h-4 w-4 text-amber-500" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredMeals}
        loading={loading}
        searchPlaceholder="Search recipe name, dietary protocol, ingredients..."
      />
    </PageContainer>
  );
};

