import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import {
  Flame,
  Dumbbell,
  Trophy,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  Droplets,
  Apple,
  Award,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IMemberProfileCard, ITodayWorkoutRoutine, IDailyNutritionGoal } from '../types';

const DEFAULT_NUTRITION: IDailyNutritionGoal = {
  caloriesCurrent: 0,
  calorieTarget: 2000,
  proteinCurrentGrams: 0,
  proteinTargetGrams: 150,
  carbsCurrentGrams: 0,
  carbsTargetGrams: 200,
  waterCurrentLiters: 0,
  waterTargetLiters: 3.0,
};

export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [member] = useState<any>(() => {
    const saved = localStorage.getItem('gymflow_member_profile');
    return saved ? JSON.parse(saved) : {
      memberId: 'MEM-001',
      memberCode: 'GF-NEW',
      memberName: 'Active Member',
      avatarUrl: '',
      homeCampus: 'Primary Campus',
      membershipTier: 'STANDARD',
      membershipStatus: 'ACTIVE',
      validUntil: 'Active',
      assignedCoachName: 'Assigned Coach',
      currentStreakDays: 0,
      monthlyVisitsCount: 0,
      monthlyVisitTarget: 20,
    };
  });
  const [exercises, setExercises] = useState<any[]>(() => {
    const saved = localStorage.getItem('gymflow_member_exercises');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleExercise = (id: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === id) {
          const next = !ex.completed;
          if (next) toast.success(`Completed ${ex.name}! 💪`);
          return { ...ex, completed: next };
        }
        return ex;
      })
    );
  };

  const completedCount = exercises.filter((e) => e.completed).length;

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome, ${member.memberName}`}
        subtitle={`Access Pass [${member.memberCode}] • ${member.homeCampus}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/personal-training/create')}
            >
              <Dumbbell className="h-3.5 w-3.5" />
              <span>Book PT Session</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/fitness/group-classes')}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Reserve Class</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => {
                toast.success('Digital Turnstile Key Activated! Present to scanner.');
              }}
            >
              <QrCode className="h-4 w-4" />
              <span>Turnstile Key</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="WORKOUT STREAK"
          value="0 Days 🔥"
          change="Get Started Today"
          trend="neutral"
          timeframe="Daily Consistency"
          icon={<Flame className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="MONTHLY VISITS"
          value="0 / 20 Visits"
          change="0% Monthly Target"
          trend="neutral"
          timeframe="Turnstile Scans"
          icon={<Trophy className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="PT SESSIONS BANK"
          value="0 Remaining"
          change="Package Balance"
          trend="neutral"
          timeframe="Personal Training"
          icon={<Dumbbell className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="CAMPUS RANKING"
          value="-- Leaderboard"
          change="Monthly Activity"
          trend="neutral"
          timeframe="XP Rank"
          icon={<Award className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Two Column Layout: Workout Routine & Digital Passport / Nutrition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout Routine (2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[10px] font-bold">
                  TODAY'S WORKOUT
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {exercises.length > 0 ? `${exercises.length * 12} Mins • Coach ${member.assignedCoachName || 'Staff Coach'}` : 'Rest Day / Unassigned'}
                </span>
              </div>
              <CardTitle className="text-base mt-1 flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                {exercises.length > 0 ? 'Active Assigned Training Plan' : 'No Workout Assigned for Today'}
              </CardTitle>
            </div>

            {exercises.length > 0 && (
              <div className="text-right">
                <span className="text-xs font-bold text-foreground font-mono block">
                  {completedCount} of {exercises.length} Sets Done
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {Math.round((completedCount / (exercises.length || 1)) * 100)}% Complete
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {exercises.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
                <p>No active workout routine currently assigned.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className={`py-3 flex items-center justify-between gap-3 transition-colors ${
                      ex.completed ? 'opacity-60 bg-muted/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExercise(ex.id)}
                        className={`h-6 w-6 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                          ex.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-border hover:border-primary text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <div className="space-y-0.5">
                        <span className={`text-xs font-bold block ${ex.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {idx + 1}. {ex.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                          <span>{ex.sets} Sets</span>
                          <span>•</span>
                          <span>{ex.reps}</span>
                          <span>•</span>
                          <span className="font-bold text-primary">{ex.weightTarget}</span>
                        </div>
                      </div>
                    </div>

                    <Badge variant={ex.completed ? 'success' : 'outline'} className="text-[9px] font-bold font-mono">
                      {ex.completed ? 'COMPLETED' : 'PENDING'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {exercises.length > 0 && (
            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => {
                  setExercises(exercises.map((e) => ({ ...e, completed: false })));
                  toast.info('Workout routine reset for a new session.');
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Routine</span>
              </Button>
              <Button
                size="sm"
                className="gap-1.5 shadow-sm text-xs"
                onClick={() => {
                  setExercises(exercises.map((e) => ({ ...e, completed: true })));
                  toast.success('Congratulations on completing today’s workout! 🎉 (+150 XP)');
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Finish Workout Session</span>
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Right Column: Digital NFC Passcard & Nutrition Targets */}
        <div className="space-y-6">
          {/* Digital NFC Entry Passcard */}
          <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-background to-muted/40 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
                  GymFlow Athlete Passport
                </span>
                <Badge variant="success" className="text-[9px] font-bold">
                  {member.membershipStatus || 'ACTIVE'}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2 flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>{member.memberName?.charAt(0) || 'M'}</AvatarFallback>
                </Avatar>
                <span>{member.memberName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2.5 bg-background/80 rounded-lg border border-border flex items-center justify-between font-mono text-xs">
                <span className="text-muted-foreground">Digital Key:</span>
                <span className="font-bold text-primary">{member.memberCode}</span>
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Tier: <strong className="text-foreground">{member.membershipTier}</strong></span>
                <span>Valid: {member.validUntil}</span>
              </div>
            </CardContent>
          </Card>

          {/* Daily Nutrition & Hydration Tracker */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Apple className="h-4 w-4 text-emerald-500" />
                Daily Nutrition Targets
              </CardTitle>
              <CardDescription>Target calories and macronutrient breakdown.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {/* Calories */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>🔥 Calories</span>
                  <span><strong>{DEFAULT_NUTRITION.caloriesCurrent}</strong> / {DEFAULT_NUTRITION.calorieTarget} kcal</span>
                </div>
                <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${(DEFAULT_NUTRITION.caloriesCurrent / DEFAULT_NUTRITION.calorieTarget) * 100}%` }}
                  />
                </div>
              </div>

              {/* Protein */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>🍗 Protein</span>
                  <span><strong>{DEFAULT_NUTRITION.proteinCurrentGrams}g</strong> / {DEFAULT_NUTRITION.proteinTargetGrams}g</span>
                </div>
                <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-blue-500"
                    style={{ width: `${(DEFAULT_NUTRITION.proteinCurrentGrams / DEFAULT_NUTRITION.proteinTargetGrams) * 100}%` }}
                  />
                </div>
              </div>

              {/* Water Hydration */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-cyan-500" /> Hydration
                  </span>
                  <span><strong>{DEFAULT_NUTRITION.waterCurrentLiters}L</strong> / {DEFAULT_NUTRITION.waterTargetLiters}L</span>
                </div>
                <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-cyan-500"
                    style={{ width: `${(DEFAULT_NUTRITION.waterCurrentLiters / DEFAULT_NUTRITION.waterTargetLiters) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
