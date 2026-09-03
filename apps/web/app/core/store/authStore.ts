import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { IUserProfile } from '../types/user.types';
import { toast } from 'sonner';

interface IAuthState {
  user: IUserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; pass: string }) => Promise<boolean>;
  logout: () => void;
  setAuth: (user: IUserProfile, token: string, refreshToken?: string) => void;
  refreshPermissions: () => Promise<void>;
  updateUserPermissions: (newPermissions: string[]) => void;
  setExactPermissions: (newPermissions: string[]) => void;
}

const getStoredUser = (): IUserProfile | null => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const initialToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
const initialUser = getStoredUser();

export const useAuthStore = create<IAuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken && !!initialUser,
  isLoading: false,

  login: async ({ email, pass }) => {
    set({ isLoading: true });
    try {
      const response = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.data) {
        const { user, tokens } = resData.data;
        if (user && user.role !== 'SUPER_ADMIN') {
          localStorage.removeItem('gymflow_platform_admin_session');
        }
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));

        set({
          user,
          token: tokens.accessToken,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success(`Welcome back, ${user.firstName || user.name || 'Admin'}!`);
        return true;
      } else {
        // Check if user was registered locally via Onboarding Hub
        const customUsersRaw = localStorage.getItem('gymflow_custom_admin_users');
        const customUsers = customUsersRaw ? JSON.parse(customUsersRaw) : [];
        const matched = customUsers.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());

        if (matched) {
          const userObj: IUserProfile = {
            id: matched.id || matched._id || 'usr_local',
            email: matched.email,
            firstName: matched.fullName?.split(' ')[0] || 'Admin',
            lastName: matched.fullName?.split(' ')[1] || 'User',
            role: (matched.role as any) || 'ADMIN',
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const token = `jwt_session_${Date.now()}`;
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userObj));

          set({
            user: userObj,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success(`Welcome back, ${userObj.firstName}!`);
          return true;
        }

        toast.error(resData?.message || 'Invalid credentials. Please check your email and password.');
        return false;
      }
    } catch (err) {
      // Offline fallback: check registered local users
      const customUsersRaw = localStorage.getItem('gymflow_custom_admin_users');
      const customUsers = customUsersRaw ? JSON.parse(customUsersRaw) : [];
      const matched = customUsers.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());

      if (matched) {
        const userObj: IUserProfile = {
          id: matched.id || matched._id || 'usr_local',
          email: matched.email,
          firstName: matched.fullName?.split(' ')[0] || 'Admin',
          lastName: matched.fullName?.split(' ')[1] || 'User',
          role: (matched.role as any) || 'ADMIN',
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const token = `jwt_session_${Date.now()}`;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userObj));

        set({
          user: userObj,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success(`Welcome back, ${userObj.firstName}!`);
        return true;
      }

      toast.error('Could not connect to authentication server. Please check your credentials.');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);

    // Call backend logout endpoint in background
    fetch('https://gymflow-api-2jdh.onrender.com/api/v1/auth/logout', { method: 'POST' }).catch(() => {});

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    toast.info('You have been logged out.');
  },

  setAuth: (user, token, refreshToken) => {
    if (user && (user.role as any) !== 'SUPER_ADMIN') {
      localStorage.removeItem('gymflow_platform_admin_session');
    }
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  refreshPermissions: async () => {
    const currentUser = useAuthStore.getState().user;
    const token = useAuthStore.getState().token || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!currentUser || !token) return;

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // 1. Fetch live roles from backend
      let rolePermissions: string[] = [];
      try {
        const rolesRes = await fetch('https://gymflow-api-2jdh.onrender.com/api/v1/administration/roles', { headers });
        if (rolesRes.ok) {
          const rolesJson = await rolesRes.json();
          const roleList = rolesJson.data?.items || (Array.isArray(rolesJson.data) ? rolesJson.data : []);
          const matchedRole = roleList.find(
            (r: any) =>
              (r.roleKey && r.roleKey.toUpperCase() === currentUser.role?.toUpperCase()) ||
              (r.code && r.code.toUpperCase() === currentUser.role?.toUpperCase()) ||
              (r.name && r.name.toUpperCase() === currentUser.role?.toUpperCase())
          );
          if (matchedRole) {
            rolePermissions = matchedRole.permissionsList || matchedRole.permissions || [];
          }
        }
      } catch {}

      // 2. Fetch live user document
      let userCustomPermissions: string[] = [];
      if (currentUser.id) {
        try {
          const userRes = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/administration/users/${currentUser.id}`, { headers });
          if (userRes.ok) {
            const userJson = await userRes.json();
            if (userJson.data?.permissions && Array.isArray(userJson.data.permissions)) {
              userCustomPermissions = userJson.data.permissions;
            }
          }
        } catch {}
      }

      // Merge all permissions
      const allResolved = Array.from(new Set([
        ...(currentUser.permissions || []),
        ...rolePermissions,
        ...userCustomPermissions,
      ]));

      if (allResolved.length > 0) {
        const updatedUser: IUserProfile = {
          ...currentUser,
          permissions: allResolved,
        };
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
        useAuthStore.setState({ user: updatedUser });
      }
    } catch (err) {
      console.warn('[AuthStore] Could not refresh live permissions:', err);
    }
  },

  setExactPermissions: (newPermissions: string[]) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    const unique = Array.from(new Set(newPermissions));
    const updatedUser: IUserProfile = { ...currentUser, permissions: unique };
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
    useAuthStore.setState({ user: updatedUser });
  },

  updateUserPermissions: (newPermissions: string[]) => {
    useAuthStore.getState().setExactPermissions(newPermissions);
  },
}));
