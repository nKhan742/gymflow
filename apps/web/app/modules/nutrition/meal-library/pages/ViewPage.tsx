import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  ArrowLeft,
  Edit2,
  Utensils,
  Flame,
  Zap,
  Clock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChefHat,
  HeartPulse,
  Leaf,
  Printer,
  Sparkles,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { IMeal } from '../types';
import { DEFAULT_MEALS } from './ListPage';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<IMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'analysis'>('ingredients');

  useEffect(() => {
    fetchMealDetails();
  }, [id]);

  const fetchMealDetails = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_meals');
      if (stored) {
        const list: IMeal[] = JSON.parse(stored);
        const match = list.find((m) => m.id === id || m._id === id || m.code === id);
        if (match) {
          setMeal(match);
          setLoading(false);
          return;
        }
      }

      const defaultMatch = DEFAULT_MEALS.find((m) => m.id === id || m.code === id);
      if (defaultMatch) {
        setMeal(defaultMatch);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/meal-library/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setMeal(json.data);
          setLoading(false);
          return;
        }
      }

      const fallback: IMeal = {
        id: id || 'MEL-CUSTOM-01',
        code: id || 'MEL-CUSTOM-01',
        name: id ? id.replace('MEL-', '').replace(/-/g, ' ') : 'Custom Athletic Meal',
        mealCategory: 'LUNCH',
        dietaryType: 'HIGH_PROTEIN',
        calories: 620,
        proteinGrams: 48,
        carbsGrams: 52,
        fatsGrams: 18,
        fiberGrams: 7,
        prepTimeMinutes: 20,
        servings: 1,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        ingredients: [
          { name: 'Lean Protein Cut', amount: '200g', calories: 340, proteinGrams: 44, carbsGrams: 0, fatsGrams: 6 },
          { name: 'Brown Jasmine Rice', amount: '180g', calories: 220, proteinGrams: 4, carbsGrams: 48, fatsGrams: 1 },
          { name: 'Steamed Broccoli Spears', amount: '100g', calories: 60, proteinGrams: 0, carbsGrams: 4, fatsGrams: 11 },
        ],
        instructions: [
          'Preheat skillet or grill to medium-high heat.',
          'Season protein evenly with sea salt and cracked pepper.',
          'Cook to internal temperature of 75°C.',
          'Plate with fluffy rice and steamed greens.',
        ],
        allergens: ['None'],
        glycemicIndex: 'LOW',
        isSmoothieBarAvailable: false,
        branchId: 'ALL',
        branchName: 'All Locations',
        status: 'active',
        description: 'Nutrient-rich performance meal loaded with clean micronutrients and complete amino acids.',
      };
      setMeal(fallback);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading || !meal) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-muted-foreground text-sm">
          Loading 360° Recipe Hub...
        </div>
      </PageContainer>
    );
  }

  const totalGrams = (meal.proteinGrams || 0) + (meal.carbsGrams || 0) + (meal.fatsGrams || 0) || 1;
  const pPercent = Math.round(((meal.proteinGrams || 0) / totalGrams) * 100);
  const cPercent = Math.round(((meal.carbsGrams || 0) / totalGrams) * 100);
  const fPercent = Math.round(((meal.fatsGrams || 0) / totalGrams) * 100);

  return (
    <PageContainer>
      <PageHeader
        title={meal.name}
        subtitle={`${meal.mealCategory ? String(meal.mealCategory).replace(/_/g, ' ') : 'Meal'} • ${meal.dietaryType ? String(meal.dietaryType).replace(/_/g, ' ') : 'Standard'} • ${meal.calories} kcal`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/nutrition/meal-library')}
              className="gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Library</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Recipe Card</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/nutrition/meal-library/${meal.id || meal._id}/edit`)}
              className="gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Recipe</span>
            </Button>
          </div>
        }
      />

      {/* Hero Presentation Card */}
      <Card className="mb-6 overflow-hidden border-border/80 shadow-sm">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-72 h-48 md:h-auto shrink-0 relative bg-muted">
            <img
              src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
              alt={meal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <Badge variant="default" className="bg-primary/90 text-primary-foreground font-mono text-[10px]">
                {meal.code || meal.id}
              </Badge>
            </div>
          </div>

          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 text-xs font-bold">
                  {meal.dietaryType ? String(meal.dietaryType).replace(/_/g, ' ') : 'Standard'}
                </Badge>
                <Badge variant="secondary" className="text-xs font-semibold">
                  {meal.mealCategory ? String(meal.mealCategory).replace(/_/g, ' ') : 'Meal'}
                </Badge>
                {meal.isSmoothieBarAvailable && (
                  <Badge variant="success" className="gap-1 text-xs font-bold">
                    <Zap className="w-3 h-3" /> Gym Fuel Bar Ready
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1 text-xs font-medium">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  {meal.branchName || 'All Locations'}
                </Badge>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1">{meal.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {meal.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/80">
              <div>
                <span className="text-[11px] text-muted-foreground block">Prep & Cook Time</span>
                <span className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> {meal.prepTimeMinutes} Mins
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Servings Yield</span>
                <span className="font-bold text-xs sm:text-sm text-foreground">
                  {meal.servings} Portion
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Glycemic Index</span>
                <span className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                  {meal.glycemicIndex || 'LOW'} GI
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Allergens Declared</span>
                <span className="font-bold text-xs sm:text-sm text-foreground">
                  {meal.allergens?.join(', ') || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Macro Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/80 shadow-sm bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">ENERGY DENSITY</span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {meal.calories} <span className="text-xs font-normal text-muted-foreground">kcal</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Per Single Portion</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">PROTEIN RATIO</span>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-primary">
              {meal.proteinGrams}g <span className="text-xs font-normal text-muted-foreground">({pPercent}%)</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Muscle Protein Synthesis</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">TOTAL CARBS</span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {meal.carbsGrams}g <span className="text-xs font-normal text-muted-foreground">({cPercent}%)</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Fiber: {meal.fiberGrams || 0}g</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm bg-rose-500/5 border-rose-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground">HEALTHY FATS</span>
              <HeartPulse className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
              {meal.fatsGrams}g <span className="text-xs font-normal text-muted-foreground">({fPercent}%)</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Lipids & Cell Support</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-6 overflow-x-auto">
        <Button
          variant={activeTab === 'ingredients' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('ingredients')}
          className="gap-2 text-xs"
        >
          <Utensils className="h-3.5 w-3.5" />
          <span>Ingredients & Grams ({meal.ingredients?.length || 0})</span>
        </Button>
        <Button
          variant={activeTab === 'instructions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('instructions')}
          className="gap-2 text-xs"
        >
          <ChefHat className="h-3.5 w-3.5" />
          <span>Preparation Guide ({meal.instructions?.length || 0} Steps)</span>
        </Button>
        <Button
          variant={activeTab === 'analysis' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analysis')}
          className="gap-2 text-xs"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Allergens & Macro Radar</span>
        </Button>
      </div>

      {/* Tab 1: Ingredients Breakdown */}
      {activeTab === 'ingredients' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Itemized Ingredients & Nutrient Weights
            </CardTitle>
            <CardDescription className="text-xs">
              Raw weight measurements and macro distribution for single batch preparation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/60">
              {meal.ingredients?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-foreground">{item.name}</div>
                      <div className="text-[11px] text-muted-foreground">Portion: <strong className="text-foreground">{item.amount}</strong></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-right">
                    <div>
                      <div className="font-bold text-amber-600 dark:text-amber-400">{item.calories} kcal</div>
                      <div className="text-[10px] text-muted-foreground">P:{item.proteinGrams}g | C:{item.carbsGrams}g | F:{item.fatsGrams}g</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Instructions */}
      {activeTab === 'instructions' && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-primary" />
              Culinary Preparation & Cooking Steps
            </CardTitle>
            <CardDescription className="text-xs">
              Follow sequentially for optimal texture, flavor profile, and nutrient preservation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {meal.instructions?.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {step}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Analysis & Allergens */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Allergen Safety Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Mandatory declarations for client dietary restrictions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {meal.allergens?.map((allergen) => (
                  <Badge key={allergen} variant={allergen === 'None' ? 'outline' : 'destructive'} className="text-xs font-semibold py-1 px-3">
                    {allergen}
                  </Badge>
                ))}
              </div>
              <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border/60">
                ⚠️ Prepared in a certified athletic commercial kitchen facility that handles whey protein, tree nuts, and eggs.
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Macro Distribution Summary
              </CardTitle>
              <CardDescription className="text-xs">
                Calculated caloric density ratio from protein, carbs, and fats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Protein ({pPercent}%)</span>
                  <span>{meal.proteinGrams}g</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${pPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Carbohydrates ({cPercent}%)</span>
                  <span>{meal.carbsGrams}g</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${cPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Fats ({fPercent}%)</span>
                  <span>{meal.fatsGrams}g</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${fPercent}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};

