import React from 'react';
import { Card } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Star, Phone, Mail, Eye, Zap, GraduationCap } from 'lucide-react';
import { useCurrencyStore } from '../../../../core/store/currencyStore';
import { formatCurrency } from '../../../../core/helpers/formatters';
import { IStaff, StaffRole } from '../types';

interface StaffCardProps {
  staff: IStaff;
  onOpenDetail: (staff: IStaff) => void;
}

export const getRoleBadge = (role: StaffRole) => {
  switch (role) {
    case 'HEAD_COACH':
      return <Badge variant="warning" className="gap-1 font-semibold">👑 Head Coach</Badge>;
    case 'TRAINER':
      return <Badge variant="default" className="gap-1 font-semibold">🏋️ Trainer</Badge>;
    case 'NUTRITIONIST':
      return <Badge variant="success" className="gap-1 font-semibold">🥗 Nutritionist</Badge>;
    case 'GROUP_INSTRUCTOR':
      return <Badge variant="info" className="gap-1 font-semibold">🧘 Instructor</Badge>;
    case 'MANAGER':
      return <Badge variant="secondary" className="gap-1 font-semibold">💼 Manager</Badge>;
    case 'RECEPTIONIST':
      return <Badge variant="outline" className="gap-1 font-semibold">🛎️ Reception</Badge>;
    default:
      return <Badge variant="secondary" className="gap-1">Staff</Badge>;
  }
};

export const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'active':
      return (
        <Badge variant="success" className="gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
        </Badge>
      );
    case 'on_leave':
      return <Badge variant="warning" className="gap-1">🏖️ On Leave</Badge>;
    default:
      return <Badge variant="secondary" className="gap-1">Inactive</Badge>;
  }
};

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onOpenDetail }) => {
  const { currency } = useCurrencyStore();
  return (
    <Card className="border border-border/80 hover:border-primary/40 transition-all duration-200 hover:shadow-lg group relative overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={staff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={staff.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-border shadow-xs group-hover:scale-105 transition-transform"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-card ${
                  staff.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                  {staff.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {getRoleBadge(staff.role)}
                <span className="text-[11px] text-muted-foreground font-mono font-medium">{staff.code}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <Badge variant="warning" className="gap-1 font-bold">
              <Star className="w-3 h-3 fill-amber-500" /> {staff.rating || 5.0}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-medium mt-1">{staff.shift} Shift</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {staff.bio || 'Experienced fitness professional specializing in personalized progression.'}
        </p>

        <div className="mb-4">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-primary" /> Focus Areas
          </div>
          <div className="flex flex-wrap gap-1.5">
            {staff.specializations?.map((spec, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-muted border border-border/60 text-foreground text-[11px] font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {staff.certifications && staff.certifications.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-emerald-500" /> Credentials
            </div>
            <div className="flex flex-wrap gap-1.5">
              {staff.certifications.map((cert, i) => (
                <Badge key={i} variant="success" className="text-[10px] font-semibold px-2 py-0.5">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-muted/50 border border-border/80 text-center">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Rate</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(staff.hourlyRate || 65, currency)}/hr</div>
          </div>
          <div className="border-x border-border">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Clients</div>
            <div className="text-xs font-bold text-foreground">{staff.activeClientsCount || 0}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Reviews</div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{staff.reviewsCount || 0}</div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-3 bg-muted/20 border-t border-border/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${staff.phone}`}
            className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-xs"
            title={`Call ${staff.phone}`}
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
          <a
            href={`mailto:${staff.email}`}
            className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-xs"
            title={`Email ${staff.email}`}
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDetail(staff)}
            className="h-8 px-3 text-xs font-medium gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-primary" /> Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};

