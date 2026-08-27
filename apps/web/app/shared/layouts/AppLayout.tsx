import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  Users,
  Dumbbell,
  Utensils,
  CreditCard,
  Package,
  Wrench,
  Calendar,
  MessageSquare,
  BarChart3,
  TrendingUp,
  User,
  Shield,
  Building2,
  Menu,
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useThemeStore } from '../../core/store/themeStore';
import { useAuthStore } from '../../core/store/authStore';
import { Button } from '../components/ui/button';
import { CommandPalette } from '../components/command/CommandPalette';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { SIDEBAR_MENU_CONFIG, ISidebarMenuItem } from '../../core/config/sidebarConfig';
import { toast } from 'sonner';

const ICONS_MAP: Record<string, React.ReactElement> = {
  dashboard: <Activity className="h-4 w-4" />,
  administration: <Shield className="h-4 w-4" />,
  'gym-management': <Building2 className="h-4 w-4" />,
  'member-management': <Users className="h-4 w-4" />,
  fitness: <Dumbbell className="h-4 w-4" />,
  nutrition: <Utensils className="h-4 w-4" />,
  crm: <Users className="h-4 w-4" />,
  finance: <CreditCard className="h-4 w-4" />,
  inventory: <Package className="h-4 w-4" />,
  equipment: <Wrench className="h-4 w-4" />,
  scheduling: <Calendar className="h-4 w-4" />,
  communication: <MessageSquare className="h-4 w-4" />,
  reports: <BarChart3 className="h-4 w-4" />,
  analytics: <TrendingUp className="h-4 w-4" />,
  profile: <User className="h-4 w-4" />,
};

export const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { mode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Automatically keep only the active route's parent menu open
  useEffect(() => {
    const activeMenu = SIDEBAR_MENU_CONFIG.find(
      (m) =>
        location.pathname === '/' + m.id ||
        location.pathname.startsWith('/' + m.id + '/')
    );
    if (activeMenu) {
      setOpenMenuId(activeMenu.id);
    }
  }, [location.pathname]);

  const handleMenuClick = (menu: ISidebarMenuItem) => {
    const hasChildren = menu.children && menu.children.length > 0;

    if (hasChildren) {
      // Accordion: clicking toggles current menu; automatically closes all others
      if (openMenuId === menu.id) {
        setOpenMenuId(null);
      } else {
        setOpenMenuId(menu.id);
        if (
          location.pathname !== '/' + menu.id &&
          !location.pathname.startsWith('/' + menu.id + '/')
        ) {
          navigate(menu.path);
          setMobileOpen(false);
        }
      }
    } else {
      setOpenMenuId(menu.id);
      navigate(menu.path);
      setMobileOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <CommandPalette />

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Permanent Fixed Sidebar on Desktop; Responsive Slide Drawer on Mobile */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 border-b border-sidebar-border px-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary/30 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-xs tracking-tight text-foreground block truncate">GymFlow ERP</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider block font-semibold truncate">Enterprise SaaS</span>
            </div>
          </div>
        </div>

        {/* Navigation List with Single Accordion & Smooth Grid Transitions */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {SIDEBAR_MENU_CONFIG.filter((m) => m.id !== 'auth').map((menu: ISidebarMenuItem) => {
            const isParentActive =
              location.pathname === '/' + menu.id ||
              location.pathname.startsWith('/' + menu.id + '/');
            const icon = ICONS_MAP[menu.id] || <Activity className="h-4 w-4" />;
            const hasChildren = menu.children && menu.children.length > 0;
            const isExpanded = openMenuId === menu.id;

            return (
              <div key={menu.id} className="space-y-0.5">
                {/* Parent Menu Item Button */}
                <button
                  onClick={() => handleMenuClick(menu)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isParentActive && !hasChildren
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : isParentActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className={`shrink-0 transition-colors ${
                        isParentActive && !hasChildren
                          ? 'text-primary-foreground'
                          : isParentActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    >
                      {icon}
                    </div>
                    <span className="truncate text-left">{menu.title}</span>
                  </div>

                  {hasChildren && (
                    <div className="shrink-0 ml-1">
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform duration-300 ease-in-out ${
                          isExpanded ? 'rotate-90 text-primary font-bold' : 'rotate-0 text-muted-foreground'
                        }`}
                      />
                    </div>
                  )}
                </button>

                {/* Sub-menu Items: Smooth CSS Grid Expand/Collapse Animation */}
                {hasChildren && (
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pl-6 pr-1 space-y-0.5 border-l border-border/50 ml-4 my-1 py-0.5">
                        {menu.children!.map((sub) => {
                          const isSubActive =
                            location.pathname === sub.path ||
                            location.pathname.startsWith(sub.path + '/');

                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                navigate(sub.path);
                                setMobileOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all text-left truncate ${
                                isSubActive
                                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
                                  isSubActive ? 'bg-primary-foreground' : 'bg-muted-foreground/40'
                                }`}
                              />
                              <span className="truncate">{sub.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-colors text-left">
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">
                  {user ? user.firstName.charAt(0) : 'A'}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-semibold text-foreground truncate">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user ? user.role : 'SUPER_ADMIN'}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile/my-profile')}>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/administration/settings')}>Workspace Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate('/auth/login', { replace: true });
                }}
                className="text-destructive font-medium cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Sticky Top Header */}
        <header className="sticky top-0 z-40 h-14 px-4 sm:px-6 flex items-center justify-between gap-4 glass-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Quick Command Bar Trigger */}
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                document.dispatchEvent(event);
              }}
              className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/40 text-muted-foreground hover:bg-muted/80 text-xs transition-colors w-64 justify-between"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span>Search everything...</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                toast.success('Quick Create opened');
                navigate('/member-management/members/create');
              }}
              className="gap-1.5 shadow-sm shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Add</span>
            </Button>

            <Button variant="outline" size="icon" className="h-9 w-9 relative" onClick={() => toast.info('No new notifications')}>
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>

            <Button variant="outline" size="icon" className="h-9 w-9" onClick={toggleTheme}>
              {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Main Content Router View */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
