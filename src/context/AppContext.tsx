import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ProjectItem, BrandKit } from '../types';
import { StorageService, DEFAULT_BRAND_KITS } from '../services/storageService';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  user: UserProfile;
  loginAsDemo: (role?: 'Creator' | 'Pro' | 'Agency Admin') => void;
  logout: () => void;
  projects: ProjectItem[];
  refreshProjects: () => Promise<void>;
  brandKits: BrandKit[];
  activeBrandKit: BrandKit;
  setActiveBrandKitId: (id: string) => void;
  serverStatus: { status: string; hasGeminiKey: boolean };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<UserProfile>(StorageService.getUserProfile());
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [brandKits, setBrandKits] = useState<BrandKit[]>(DEFAULT_BRAND_KITS);
  const [activeBrandKitId, setActiveBrandKitId] = useState<string>('brand-creator-pro');
  const [serverStatus, setServerStatus] = useState<{ status: string; hasGeminiKey: boolean }>({
    status: 'checking',
    hasGeminiKey: true,
  });

  // Apply theme to document element
  useEffect(() => {
    const saved = StorageService.getSettings();
    const initialTheme = saved.theme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      StorageService.saveSettings({ ...StorageService.getSettings(), theme: next });
      return next;
    });
  };

  const refreshProjects = async () => {
    try {
      const list = await StorageService.getAllProjects();
      setProjects(list);
    } catch (e) {
      console.error('Failed to load projects:', e);
    }
  };

  const refreshBrandKits = async () => {
    try {
      const kits = await StorageService.getAllBrandKits();
      setBrandKits(kits);
    } catch (e) {
      console.error('Failed to load brand kits:', e);
    }
  };

  useEffect(() => {
    refreshProjects();
    refreshBrandKits();

    // Check server health
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerStatus(data))
      .catch(() => setServerStatus({ status: 'offline', hasGeminiKey: false }));
  }, []);

  const loginAsDemo = (role: 'Creator' | 'Pro' | 'Agency Admin' = 'Creator') => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: role === 'Agency Admin' ? 'Jordan Hayes' : 'Alex Rivera',
      email: role === 'Agency Admin' ? 'jordan@agencygroup.com' : 'alex@creatorstudio.io',
      role,
      plan: role === 'Agency Admin' ? 'Creator Suite' : 'Pro Plan',
      creditsTotal: role === 'Agency Admin' ? 1000 : 250,
      creditsUsed: 42,
      isDemoUser: true,
    };
    StorageService.saveUserProfile(newUser);
    setUser(newUser);
  };

  const logout = () => {
    const guestUser: UserProfile = {
      id: 'usr_guest',
      name: 'Guest User',
      email: 'guest@clipforge.ai',
      role: 'Creator',
      plan: 'Free Trial',
      creditsTotal: 30,
      creditsUsed: 0,
      isDemoUser: true,
    };
    StorageService.saveUserProfile(guestUser);
    setUser(guestUser);
  };

  const activeBrandKit =
    brandKits.find((k) => k.id === activeBrandKitId) || brandKits[0] || DEFAULT_BRAND_KITS[0];

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        loginAsDemo,
        logout,
        projects,
        refreshProjects,
        brandKits,
        activeBrandKit,
        setActiveBrandKitId,
        serverStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
