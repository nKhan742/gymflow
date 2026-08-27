import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Dumbbell,
  Calendar,
  Settings,
  Search,
  PlusCircle,
  FileText,
  Building,
  UserPlus,
  Shield,
  Activity,
} from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl border-border bg-card shadow-2xl rounded-2xl">
        <Command className="w-full">
          <div className="flex items-center border-b border-border px-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
            <Command.Input
              placeholder="Type a command or search (e.g. Members, Invoices, Workouts)..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[340px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Quick Actions" className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/member-management/members/create'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add New Member</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/finance/invoices/create'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create Invoice</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/fitness/workout-plans/create'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                <Dumbbell className="h-4 w-4" />
                <span>Assign Workout Plan</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Navigation" className="text-xs font-semibold text-muted-foreground px-2 py-1.5 mt-2">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/dashboard/admin-dashboard'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/member-management/members'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Member Directory</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/finance/payments'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Payments & Billing</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/scheduling/calendar'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Schedule & Classes</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/administration/settings'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>System Settings</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
