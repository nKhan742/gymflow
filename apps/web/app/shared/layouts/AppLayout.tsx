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
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { useThemeStore } from '../../core/store/themeStore';
import { useAuthStore } from '../../core/store/authStore';
import { useBranchStore } from '../../core/store/branchStore';
import { usePlatformAuthStore } from '../../core/store/platformAuthStore';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
import { filterSidebarMenuForUser, canAccessPath, getDefaultDashboardPath } from '../../core/guards/rbacGuard';
import { usePlanStore } from '../../core/store/planStore';
import { PlanUpgradeModal } from '../components/plan/PlanUpgradeModal';
import { TopProgressBar } from '../components/feedback/TopProgressBar';
import { toast } from 'sonner';
import { MapPin, Check, ChevronDown, Lock } from 'lucide-react';
import { realtimeService } from '../../core/notifications/realtimeService';

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
  const { isPlatformAuthenticated, platformUser } = usePlatformAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || isPlatformAuthenticated || platformUser?.isPlatformAdmin;
  const { activeBranchId, branches, setActiveBranchId, getActiveBranch, loadBranches } = useBranchStore();
  const { currentPlan, hasAccess, openUpgradeModal, getRequiredPlan } = usePlanStore();
  const activeBranch = getActiveBranch();
  const navigate = useNavigate();
  const location = useLocation();

  const isPathAuthorized = React.useMemo(() => {
    return canAccessPath(location.pathname, user?.role, user?.permissions);
  }, [location.pathname, user?.role, user?.permissions]);

  const authorizedMenuItems = React.useMemo(() => {
    return filterSidebarMenuForUser(
      SIDEBAR_MENU_CONFIG,
      user?.role,
      user?.permissions,
      isSuperAdmin
    );
  }, [user?.role, user?.permissions, isSuperAdmin]);

  const [platformNotifications, setPlatformNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    if (!isSuperAdmin) return;
    try {
      const res = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/platform/notifications');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPlatformNotifications(json.data);
          setUnreadCount(json.meta?.unreadCount || 0);
        }
      }
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/platform/notifications/read-all', { method: 'POST' });
      setUnreadCount(0);
      loadNotifications();
      toast.success('All notifications marked as read.');
    } catch {}
  };

  useEffect(() => {
    realtimeService.connect(user);
    if (user?.id) {
      useAuthStore.getState().refreshPermissions();
    }

    const unsubscribe = realtimeService.subscribe((event) => {
      setPlatformNotifications((prev) => [
        {
          _id: `live_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          title: event.title,
          message: event.message,
          type: event.notificationType,
          gymName: event.title,
          ownerName: event.message,
          read: false,
          createdAt: event.timestamp || new Date().toISOString(),
        },
        ...prev,
      ]);
      setUnreadCount((c) => c + 1);
    });

    if (isSuperAdmin) {
      loadNotifications();
    }

    return () => {
      unsubscribe();
      realtimeService.disconnect();
    };
  }, [user?.id, user?.email, user?.role, isSuperAdmin]);

  // Load live branches on mount so the active branch is always available
  useEffect(() => {
    if (!isSuperAdmin) {
      loadBranches();
    }
  }, [isSuperAdmin]);

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
        const targetPath = (menu.children && menu.children.length > 0) ? menu.children[0].path : menu.path;
        if (
          location.pathname !== '/' + menu.id &&
          !location.pathname.startsWith('/' + menu.id + '/')
        ) {
          navigate(targetPath);
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
      <TopProgressBar />
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
              <span className="font-bold text-xs tracking-tight text-foreground block truncate">{user?.gymName || 'GymFlow ERP'}</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider block font-semibold truncate flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 text-primary shrink-0" />
                <span>{activeBranch ? activeBranch.name : (branches.length > 0 ? branches[0].name : (user?.campusName || 'Main Campus'))}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List with Single Accordion & Smooth Grid Transitions */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {authorizedMenuItems.map((menu: ISidebarMenuItem) => {
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
                        {menu.children!
                          .filter((sub) => !sub.superAdminOnly || isSuperAdmin)
                          .map((sub) => {
                            const isSubActive =
                              location.pathname === sub.path ||
                              location.pathname.startsWith(sub.path + '/');
                            const isAllowed = hasAccess(sub.path);
                            const requiredTier = getRequiredPlan(sub.path);

                            return (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  navigate(sub.path);
                                  setMobileOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all text-left ${
                                  isSubActive
                                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
                                      isSubActive ? 'bg-primary-foreground' : 'bg-muted-foreground/40'
                                    }`}
                                  />
                                  <span className="truncate">{sub.title}</span>
                                </div>
                                {sub.superAdminOnly && (
                                  <span className="px-1 py-0.5 rounded text-[8px] font-black uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0 ml-1">
                                    ROOT
                                  </span>
                                )}
                                {!isAllowed && !sub.superAdminOnly && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0 ml-1">
                                    {requiredTier === 'ENTERPRISE' ? 'ENT' : 'PRO'}
                                  </span>
                                )}
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
                  <p className="text-[10px] text-muted-foreground truncate">{user ? user.role : 'ADMIN'}</p>
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
              className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/40 text-muted-foreground hover:bg-muted/80 text-xs transition-colors w-52 md:w-60 justify-between"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span>Search...</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Gym Branch Switcher - Reserved Exclusively for Gym Admins */}
            {isSuperAdmin ? (
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">Platform Console • Global Root</span>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background hover:bg-muted/60 text-xs font-semibold transition-all shadow-2xs group max-w-[210px] sm:max-w-[240px]">
                    <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate text-foreground font-semibold">
                      {activeBranch ? activeBranch.name : (branches.length > 0 ? branches[0].name : (user?.campusName || 'Main Facility'))}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0 group-hover:text-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                    Switch Active Gym Location
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Individual Branches list */}
                  {branches.length === 0 ? (
                    <DropdownMenuItem
                      onClick={() => {
                        loadBranches();
                        toast.info('Reloading branches from database...');
                      }}
                      className="flex items-center justify-between cursor-pointer text-xs py-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-foreground truncate">{user?.campusName || 'Main Facility'}</div>
                          <div className="text-[10px] text-muted-foreground">Primary Facility • Active</div>
                        </div>
                      </div>
                      <Check className="w-4 h-4 text-primary shrink-0 ml-2" />
                    </DropdownMenuItem>
                  ) : (
                    branches.map((b) => {
                      const isSelected = activeBranchId === b.id || activeBranchId === b._id || activeBranchId === b.name;
                      return (
                        <DropdownMenuItem
                          key={b.id || b._id}
                          onClick={() => {
                            setActiveBranchId(b.id || (b._id as string));
                            toast.success(`Switched active branch to ${b.name}`);
                          }}
                          className="flex items-center justify-between cursor-pointer text-xs py-2"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <div className="truncate">
                              <div className="font-semibold text-foreground truncate">{b.name}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {b.address?.city || 'Delhi'} • {b.code || 'BR-274'}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                        </DropdownMenuItem>
                      );
                    })
                  )}

                  <DropdownMenuSeparator />

                  {/* All Locations option */}
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveBranchId('ALL');
                      toast.success('Switched to Consolidated View (All Gyms)');
                    }}
                    className="flex items-center justify-between cursor-pointer text-xs py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <div>
                        <div className="font-semibold text-foreground">All Locations (Consolidated)</div>
                        <div className="text-[10px] text-muted-foreground">Network-wide telemetry</div>
                      </div>
                    </div>
                    {activeBranchId === 'ALL' && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/gym-management/branches')}
                    className="text-xs text-primary font-semibold cursor-pointer py-1.5 justify-center"
                  >
                    Manage All Gym Branches →
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Plan Tier Badge Button - Only for Gym Admins, Never Super Admin */}
            {isSuperAdmin ? (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                <span>Platform Owner</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openUpgradeModal()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{currentPlan === 'ENTERPRISE' ? 'Enterprise' : currentPlan === 'PROFESSIONAL' ? 'Professional' : 'Essential'} Plan</span>
              </button>
            )}

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

            {/* Real-time Enterprise Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 relative cursor-pointer">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-destructive text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-md">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 shadow-2xl rounded-2xl bg-card border border-border">
                <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      {isSuperAdmin ? 'Enterprise & Platform Alerts' : 'Live Notifications'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-black">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setUnreadCount(0);
                        toast.success('All notifications marked as read.');
                      }}
                      className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
                  {platformNotifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
                      <p className="font-semibold text-foreground">No alerts yet</p>
                      <p className="text-[11px]">You will receive live real-time notifications with audio chimes whenever permissions, assignments, or records update.</p>
                    </div>
                  ) : (
                    platformNotifications.map((notif, idx) => (
                      <div
                        key={notif._id || notif.id || idx}
                        className={`p-3.5 hover:bg-muted/50 transition-colors cursor-pointer space-y-1 ${!notif.read ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                            🔔 {notif.title || notif.gymName || 'System Alert'}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {notif.message || (notif.ownerName ? `Owner: ${notif.ownerName} (${notif.email})` : 'System event dispatched in real-time.')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                {isSuperAdmin && (
                  <div className="p-2 border-t border-border bg-muted/20 text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/administration/platform-tenants')}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      Go to Platform Tenants Console →
                    </button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="icon" className="h-9 w-9" onClick={toggleTheme}>
              {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Main Content Router View */}
        <main className="flex-1">
          {isPathAuthorized ? (
            <Outlet />
          ) : (
            <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-5 animate-in fade-in-50 duration-200">
              <div className="h-16 w-16 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center shadow-lg">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Access Restricted</h2>
                <p className="text-sm text-muted-foreground">
                  Your security clearance tier (<Badge variant="outline" className="font-mono text-xs font-bold text-destructive border-destructive/30">{user?.role || 'STAFF'}</Badge>) does not possess authorization to view <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">{location.pathname}</code>.
                </p>
                <p className="text-xs text-muted-foreground pt-1">
                  This operational domain is strictly enforced under role-based access control governance. Contact your facility Super Administrator if you require elevated privileges.
                </p>
              </div>
              <Button
                className="gap-2 font-semibold shadow-md cursor-pointer"
                onClick={() => navigate(getDefaultDashboardPath(user?.role), { replace: true })}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to {user?.role ? `${user.role} Dashboard` : 'Authorized Dashboard'}</span>
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Global Software Plan Upgrade Modal - Never rendered for Super Admin */}
      {!isSuperAdmin && <PlanUpgradeModal />}
    </div>
  );
};
