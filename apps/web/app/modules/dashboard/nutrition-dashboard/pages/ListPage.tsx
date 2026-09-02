import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { MetricCard } from '../../../../shared/components/cards/MetricCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import {
  Salad,
  Users,
  Flame,
  CheckCircle2,
  Calendar,
  Plus,
  Apple,
  Scale,
  Activity,
  Sparkles,
  AlertTriangle,
  Clock,
  HeartPulse,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IDietConsultationItem, IMealProtocolItem } from '../types';

export const DEFAULT_PROTOCOLS: any[] = [];


export const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<IDietConsultationItem[]>(() => {
    const saved = localStorage.getItem('gymflow_nutrition_consultations');
    return saved ? JSON.parse(saved) : [];
  });
  const [protocols, setProtocols] = useState<IMealProtocolItem[]>(() => {
    const saved = localStorage.getItem('gymflow_nutrition_protocols');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleStatus = (id: string) => {
    setConsultations(
      consultations.map((c) => {
        if (c.id === id) {
          const next = c.status === 'COMPLETED' ? 'CONFIRMED' : 'COMPLETED';
          toast.success(`Consultation #${id} marked as ${next}!`);
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Nutrition & Clinical Dietetics Hub"
        subtitle="Diet consultation appointments, macronutrient balancing, and automated meal protocol assignments."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/nutrition/meals')}
            >
              <Salad className="h-3.5 w-3.5" />
              <span>Meal Protocols</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/nutrition/assigned-diets')}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Assigned Diets</span>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => navigate('/nutrition/diet-plans/create')}
            >
              <Plus className="h-4 w-4" />
              <span>+ Create Diet Plan</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="ACTIVE DIET CLIENTS"
          value={`${protocols.length} Athletes`}
          change="Clinical Roster"
          trend="neutral"
          timeframe="Assigned"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="CALORIC ADHERENCE"
          value="100%"
          change="Baseline Target"
          trend="up"
          timeframe="Telemetry"
          icon={<HeartPulse className="h-5 w-5 text-emerald-500" />}
        />
        <MetricCard
          title="MACRO TARGET BALANCE"
          value="40P / 35C / 25F"
          change="Standard Athletic Split"
          trend="neutral"
          timeframe="Target"
          icon={<Scale className="h-5 w-5 text-amber-500" />}
        />
        <MetricCard
          title="CONSULTATIONS TODAY"
          value={`${consultations.length} Scheduled`}
          change="Dietitian Calendar"
          trend="neutral"
          timeframe="Today"
          icon={<Calendar className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* Two Column Layout: Today's Diet Consultations & Active Meal Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Diet Consultations (2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Today's Nutrition Consultations & Macro Reviews
              </CardTitle>
              <CardDescription>Target caloric intakes, micronutrient compliance, and allergy safeguarding.</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
              6 SESSIONS TODAY
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {consultations.map((item) => (
                <div key={item.id} className="py-3.5 flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-border shadow-2xs">
                      <AvatarImage src={item.clientAvatar} alt={item.clientName} />
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {item.clientName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-foreground">{item.clientName}</span>
                        <Badge variant="outline" className="text-[9px] font-bold">
                          {item.dietType}
                        </Badge>
                        <Badge
                          variant={
                            item.status === 'COMPLETED'
                              ? 'success'
                              : item.status === 'IN_PROGRESS'
                              ? 'default'
                              : 'outline'
                          }
                          className="text-[9px] font-bold"
                        >
                          {item.status === 'IN_PROGRESS' ? '🔥 IN CONSULT' : item.status}
                        </Badge>
                      </div>

                      {/* Macronutrient Pills */}
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                          🔥 {item.targetCalories} kcal
                        </span>
                        <span className="bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded font-bold">
                          🍗 {item.targetProteinGrams}g P
                        </span>
                        <span className="bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold">
                          🍚 {item.targetCarbsGrams}g C
                        </span>
                        <span className="bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded font-bold">
                          🥑 {item.targetFatGrams}g F
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{item.consultationTime}</span>
                        {item.allergies && (
                          <>
                            <span>•</span>
                            <span className="text-rose-500 font-semibold flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {item.allergies}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant={item.status === 'COMPLETED' ? 'outline' : 'default'}
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => toggleStatus(item.id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{item.status === 'COMPLETED' ? 'Completed' : 'Finish Consult'}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Meal Protocol Templates (1 Column) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Salad className="h-4 w-4 text-emerald-500" />
              Active Meal Protocols
            </CardTitle>
            <CardDescription>Standardized macronutrient clinical diet plans.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEFAULT_PROTOCOLS.map((prt) => (
              <div key={prt.id} className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">{prt.protocolName}</span>
                  <Badge variant="outline" className="text-[9px] font-bold">
                    {prt.categoryTag}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Target: <strong>{prt.avgCalorieTarget} kcal</strong></span>
                  <span className="text-primary font-bold">{prt.macroSplit}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>Assigned: <strong className="text-foreground">{prt.assignedClientsCount} Athletes</strong></span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] px-2 text-primary hover:text-primary"
                    onClick={() => {
                      toast.success(`Protocol "${prt.protocolName}" selected for client assignment!`);
                      navigate('/nutrition/assigned-diets');
                    }}
                  >
                    Quick Assign →
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
