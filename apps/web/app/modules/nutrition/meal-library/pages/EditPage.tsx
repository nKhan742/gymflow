import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '../../../../shared/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Utensils,
  Flame,
  Zap,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';
import { useBranchStore } from '../../../../core/store/branchStore';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { IMeal, DietaryClassification, MealCategory, IIngredient } from '../types';
import { DEFAULT_MEALS } from './ListPage';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [mealCategory, setMealCategory] = useState<MealCategory>('LUNCH');
  const [dietaryType, setDietaryType] = useState<DietaryClassification>('HIGH_PROTEIN');
  const [calories, setCalories] = useState('650');
  const [proteinGrams, setProteinGrams] = useState('50');
  const [carbsGrams, setCarbsGrams] = useState('45');
  const [fatsGrams, setFatsGrams] = useState('20');
  const [fiberGrams, setFiberGrams] = useState('8');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('20');
  const [servings, setServings] = useState('1');
  const [image, setImage] = useState('');
  const [glycemicIndex, setGlycemicIndex] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [isSmoothieBarAvailable, setIsSmoothieBarAvailable] = useState(false);
  const [branchId, setBranchId] = useState('ALL');
  const [description, setDescription] = useState('');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(['None']);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);

  const ALLERGEN_OPTIONS = ['Dairy', 'Eggs', 'Peanuts', 'Tree Nuts', 'Soy', 'Wheat / Gluten', 'Fish', 'Shellfish', 'Sesame', 'None'];

  const branchOptions = [
    { value: 'ALL', label: '🌐 All Gym Locations (HQ Kitchen Catalog)' },
    ...branches.map((b) => ({ value: b.id || (b._id as string), label: `🏢 ${b.name}` })),
  ];

  useEffect(() => {
    loadMeal();
  }, [id]);

  const loadMeal = () => {
    setFetching(true);
    let matched: IMeal | undefined;
    const stored = localStorage.getItem('gymflow_custom_meals');
    if (stored) {
      const list: IMeal[] = JSON.parse(stored);
      matched = list.find((m) => m.id === id || m._id === id || m.code === id);
    }
    if (!matched) {
      matched = DEFAULT_MEALS.find((m) => m.id === id || m.code === id);
    }

    if (matched) {
      setName(matched.name);
      setMealCategory(matched.mealCategory);
      setDietaryType(matched.dietaryType);
      setCalories(String(matched.calories));
      setProteinGrams(String(matched.proteinGrams));
      setCarbsGrams(String(matched.carbsGrams));
      setFatsGrams(String(matched.fatsGrams));
      setFiberGrams(String(matched.fiberGrams || 0));
      setPrepTimeMinutes(String(matched.prepTimeMinutes || 15));
      setServings(String(matched.servings || 1));
      setImage(matched.image || '');
      setGlycemicIndex(matched.glycemicIndex || 'LOW');
      setIsSmoothieBarAvailable(!!matched.isSmoothieBarAvailable);
      setBranchId(matched.branchId || 'ALL');
      setDescription(matched.description || '');
      setSelectedAllergens(matched.allergens || ['None']);
      setIngredients(matched.ingredients || []);
      setInstructions(matched.instructions || []);
    }
    setFetching(false);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: 'New Ingredient', amount: '100g', calories: 100, proteinGrams: 5, carbsGrams: 15, fatsGrams: 2 }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, 'Next recipe instruction step...']);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const toggleAllergen = (item: string) => {
    if (item === 'None') {
      setSelectedAllergens(['None']);
      return;
    }
    const filtered = selectedAllergens.filter((a) => a !== 'None');
    if (filtered.includes(item)) {
      const next = filtered.filter((a) => a !== item);
      setSelectedAllergens(next.length === 0 ? ['None'] : next);
    } else {
      setSelectedAllergens([...filtered, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const mealId = id || 'MEL-001';
    const payload: IMeal = {
      id: mealId,
      _id: mealId,
      code: mealId,
      name,
      mealCategory,
      dietaryType,
      calories: Number(calories) || 0,
      proteinGrams: Number(proteinGrams) || 0,
      carbsGrams: Number(carbsGrams) || 0,
      fatsGrams: Number(fatsGrams) || 0,
      fiberGrams: Number(fiberGrams) || 0,
      prepTimeMinutes: Number(prepTimeMinutes) || 15,
      servings: Number(servings) || 1,
      image,
      ingredients,
      instructions,
      allergens: selectedAllergens,
      glycemicIndex,
      isSmoothieBarAvailable,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '')?.replace('🌐 ', '') || 'All Locations',
      status: 'active',
      description,
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_meals');
      const customList: IMeal[] = stored ? JSON.parse(stored) : [];
      const filtered = customList.filter((m) => m.id !== mealId && m.code !== mealId);
      filtered.unshift(payload);
      localStorage.setItem('gymflow_custom_meals', JSON.stringify(filtered));

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/nutrition/meal-library/${mealId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      toast.success(`Meal recipe "${name}" updated successfully!`);
      navigate(`/nutrition/meal-library/${mealId}`);
    } catch {
      toast.error('Error updating meal recipe');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-muted-foreground text-sm">
          Loading recipe details...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Recipe: ${name || id}`}
        subtitle="Modify recipe macronutrient parameters, ingredient portions, and cooking directions."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/nutrition/meal-library/${id}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{loading ? 'Saving...' : 'Update Recipe'}</span>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Recipe Identity & Classification
            </CardTitle>
            <CardDescription className="text-xs">
              Primary recipe designation and category setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Meal Recipe Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Meal Category</label>
                <select
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value as MealCategory)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="BREAKFAST">🍳 Breakfast</option>
                  <option value="PRE_WORKOUT">⚡ Pre-Workout Fuel</option>
                  <option value="POST_WORKOUT">💪 Post-Workout Recovery</option>
                  <option value="LUNCH">🥗 Lunch</option>
                  <option value="DINNER">🥩 Dinner</option>
                  <option value="SNACK">🥜 Healthy Snack</option>
                  <option value="SMOOTHIE_SHAKE">🥤 Smoothie Bar Shake</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Dietary Classification</label>
                <select
                  value={dietaryType}
                  onChange={(e) => setDietaryType(e.target.value as DietaryClassification)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="HIGH_PROTEIN">⚡ High-Protein (≥40g)</option>
                  <option value="KETO">🥑 Ketogenic (High Fat/Low Carb)</option>
                  <option value="VEGAN">🌱 100% Vegan / Plant-Based</option>
                  <option value="VEGETARIAN">🧀 Vegetarian</option>
                  <option value="MEDITERRANEAN">🐟 Mediterranean</option>
                  <option value="PALEO">🥩 Paleo / Whole30</option>
                  <option value="LOW_CARB">📉 Low-Carb / Shred</option>
                  <option value="HALAL">🌙 Certified Halal</option>
                  <option value="GLUTEN_FREE">🌾 Gluten-Free</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Prep Time (Mins)</label>
                <Input
                  type="number"
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Servings Yield</label>
                <Input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Glycemic Index</label>
                <select
                  value={glycemicIndex}
                  onChange={(e) => setGlycemicIndex(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="LOW">🟢 Low GI (Steady Energy)</option>
                  <option value="MEDIUM">🟡 Medium GI (Balanced)</option>
                  <option value="HIGH">🔴 High GI (Fast Glycogen)</option>
                </select>
              </div>
            </div>

            <ImageUpload
              label="Food Presentation Photo"
              variant="thumbnail"
              value={image}
              onChange={setImage}
              helperText="Upload plate / recipe photo (PNG, JPG, WEBP up to 10MB)"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="pt-2 border-t border-border/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-foreground">Gym Smoothie Bar Product</div>
                <div className="text-[11px] text-muted-foreground">Is this item sold freshly blended at the front desk?</div>
              </div>
              <input
                type="checkbox"
                checked={isSmoothieBarAvailable}
                onChange={(e) => setIsSmoothieBarAvailable(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Macros & Ingredients */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              Macronutrient Profile & Components
            </CardTitle>
            <CardDescription className="text-xs">
              Calories, protein, carbohydrates, fats, and recipe ingredients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg border border-border/60">
              <div className="space-y-1 text-center">
                <label className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Total Kcal</label>
                <Input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="text-center font-mono font-bold text-sm h-8"
                  required
                />
              </div>

              <div className="space-y-1 text-center">
                <label className="text-[11px] font-bold text-primary">Protein (g)</label>
                <Input
                  type="number"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(e.target.value)}
                  className="text-center font-mono font-bold text-sm h-8"
                  required
                />
              </div>

              <div className="space-y-1 text-center">
                <label className="text-[11px] font-bold text-blue-500">Carbs (g)</label>
                <Input
                  type="number"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(e.target.value)}
                  className="text-center font-mono font-bold text-sm h-8"
                  required
                />
              </div>

              <div className="space-y-1 text-center">
                <label className="text-[11px] font-bold text-rose-500">Fats (g)</label>
                <Input
                  type="number"
                  value={fatsGrams}
                  onChange={(e) => setFatsGrams(e.target.value)}
                  className="text-center font-mono font-bold text-sm h-8"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Dietary Fiber (g)</label>
                <Input
                  type="number"
                  value={fiberGrams}
                  onChange={(e) => setFiberGrams(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Branch Scope</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {branchOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Allergen Declarations */}
            <div className="space-y-2 pt-2 border-t border-border/80">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Allergen Declarations
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALLERGEN_OPTIONS.map((allergen) => {
                  const isSelected = selectedAllergens.includes(allergen);
                  return (
                    <Badge
                      key={allergen}
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => toggleAllergen(allergen)}
                      className="cursor-pointer text-[11px] py-0.5 px-2.5 transition-all"
                    >
                      {allergen}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2 pt-2 border-t border-border/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Itemized Ingredients ({ingredients.length})</label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient} className="h-7 text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add Item
                </Button>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md text-xs border border-border/50">
                    <Input
                      value={ing.name}
                      onChange={(e) => {
                        const copy = [...ingredients];
                        copy[idx].name = e.target.value;
                        setIngredients(copy);
                      }}
                      className="h-7 text-xs flex-1"
                    />
                    <Input
                      value={ing.amount}
                      onChange={(e) => {
                        const copy = [...ingredients];
                        copy[idx].amount = e.target.value;
                        setIngredients(copy);
                      }}
                      className="h-7 text-xs w-24"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveIngredient(idx)}
                      disabled={ingredients.length <= 1}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Steps */}
            <div className="space-y-2 pt-2 border-t border-border/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Cooking Steps ({instructions.length})</label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddInstruction} className="h-7 text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add Step
                </Button>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {instructions.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md text-xs border border-border/50">
                    <span className="font-mono text-xs font-bold text-primary w-5 shrink-0">{idx + 1}.</span>
                    <Input
                      value={step}
                      onChange={(e) => {
                        const copy = [...instructions];
                        copy[idx] = e.target.value;
                        setInstructions(copy);
                      }}
                      className="h-7 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveInstruction(idx)}
                      disabled={instructions.length <= 1}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
};

