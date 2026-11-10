import { ProjectItem, BrandKit, UserProfile, ClipItem } from '../types';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';

const DB_NAME = 'ClipForgeDB';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_MEDIA_BLOBS = 'media_blobs';
const STORE_BRAND_KITS = 'brand_kits';

const STORAGE_KEY_AUTH = 'clipforge_auth_user';
const STORAGE_KEY_SETTINGS = 'clipforge_user_settings';

// Open IndexedDB instance
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_MEDIA_BLOBS)) {
        db.createObjectStore(STORE_MEDIA_BLOBS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_BRAND_KITS)) {
        db.createObjectStore(STORE_BRAND_KITS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Default Brand Kits
export const DEFAULT_BRAND_KITS: BrandKit[] = [
  {
    id: 'brand-creator-pro',
    name: 'Creator Studio Pro',
    primaryColor: '#6366F1', // Indigo
    secondaryColor: '#F59E0B', // Amber
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    defaultCaptionPreset: 'bold-impact',
    watermarkPosition: 'top-right',
    watermarkOpacity: 0.85,
    introText: 'ClipForge Studio',
    outroText: 'Follow for more insights',
  },
  {
    id: 'brand-minimal-slate',
    name: 'Nordic Clean Slate',
    primaryColor: '#0F172A', // Slate 900
    secondaryColor: '#38BDF8', // Sky blue
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    defaultCaptionPreset: 'minimal-clean',
    watermarkPosition: 'bottom-left',
    watermarkOpacity: 0.7,
    introText: '',
    outroText: '',
  },
  {
    id: 'brand-podcast-noir',
    name: 'Deep Dive Podcast',
    primaryColor: '#18181B', // Zinc 900
    secondaryColor: '#06B6D4', // Cyan
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    defaultCaptionPreset: 'podcast-studio',
    watermarkPosition: 'top-left',
    watermarkOpacity: 0.9,
    introText: 'Official Podcast Cut',
    outroText: 'Full episode link in bio',
  },
];

// Helper to create starter projects from SAMPLE_VIDEOS if database is empty
async function seedDefaultProjectsIfEmpty(db: IDBDatabase) {
  const transaction = db.transaction(STORE_PROJECTS, 'readonly');
  const store = transaction.objectStore(STORE_PROJECTS);
  const countReq = store.count();

  return new Promise<void>((resolve) => {
    countReq.onsuccess = async () => {
      if (countReq.result === 0) {
        // Seed the 3 sample projects
        const writeTx = db.transaction(STORE_PROJECTS, 'readwrite');
        const writeStore = writeTx.objectStore(STORE_PROJECTS);

        SAMPLE_VIDEOS.forEach((sample, idx) => {
          const starterProject: ProjectItem = {
            id: `proj-${sample.id}`,
            title: sample.title,
            createdAt: new Date(Date.now() - (idx + 1) * 3600000 * 24).toISOString(),
            updatedAt: new Date(Date.now() - (idx + 1) * 3600000 * 4).toISOString(),
            status: 'completed',
            videoMeta: {
              fileName: `${sample.id}.mp4`,
              fileSize: 45 * 1024 * 1024,
              duration: sample.duration,
              width: 1920,
              height: 1080,
              isSample: true,
              sampleKey: sample.id,
            },
            transcript: sample.transcript,
            clips: sample.preconfiguredClips,
            selectedClipId: sample.preconfiguredClips[0]?.id,
            brandKitId: 'brand-creator-pro',
            generationOptions: {
              clipCount: sample.preconfiguredClips.length,
              durationTarget: '30',
              platform: 'TikTok',
              aspectRatio: '9:16',
              category: sample.category,
              language: 'English',
              captionStyle: 'bold-impact',
              instructions: 'Focus on high energy, actionable takeaways, and contrarian insights.',
            },
          };
          writeStore.put(starterProject);
        });

        // Seed default brand kits
        const brandTx = db.transaction(STORE_BRAND_KITS, 'readwrite');
        const brandStore = brandTx.objectStore(STORE_BRAND_KITS);
        DEFAULT_BRAND_KITS.forEach((kit) => brandStore.put(kit));

        writeTx.oncomplete = () => resolve();
      } else {
        resolve();
      }
    };
    countReq.onerror = () => resolve();
  });
}

export const StorageService = {
  // Projects
  async getAllProjects(): Promise<ProjectItem[]> {
    try {
      const db = await openDB();
      await seedDefaultProjectsIfEmpty(db);

      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_PROJECTS, 'readonly');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.getAll();

        req.onsuccess = () => {
          const projects = (req.result || []) as ProjectItem[];
          // Sort by updatedAt descending
          projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          resolve(projects);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('StorageService fallback to memory/empty on error:', e);
      return [];
    }
  },

  async getProject(id: string): Promise<ProjectItem | null> {
    try {
      const db = await openDB();
      await seedDefaultProjectsIfEmpty(db);

      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_PROJECTS, 'readonly');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('Error getting project:', e);
      return null;
    }
  },

  async saveProject(project: ProjectItem): Promise<void> {
    const db = await openDB();
    project.updatedAt = new Date().toISOString();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.put(project);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async deleteProject(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  // Media Blobs
  async saveMediaBlob(id: string, blob: Blob): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_MEDIA_BLOBS, 'readwrite');
        const store = tx.objectStore(STORE_MEDIA_BLOBS);
        const req = store.put({ id, blob, createdAt: Date.now() });

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('Could not store media blob in IndexedDB:', e);
    }
  },

  async getMediaBlob(id: string): Promise<Blob | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_MEDIA_BLOBS, 'readonly');
        const store = tx.objectStore(STORE_MEDIA_BLOBS);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result?.blob || null);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('Error fetching media blob:', e);
      return null;
    }
  },

  // Brand Kits
  async getAllBrandKits(): Promise<BrandKit[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_BRAND_KITS, 'readonly');
        const store = tx.objectStore(STORE_BRAND_KITS);
        const req = store.getAll();

        req.onsuccess = () => {
          const kits = (req.result || []) as BrandKit[];
          if (kits.length === 0) {
            resolve(DEFAULT_BRAND_KITS);
          } else {
            resolve(kits);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      return DEFAULT_BRAND_KITS;
    }
  },

  async saveBrandKit(kit: BrandKit): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BRAND_KITS, 'readwrite');
      const store = tx.objectStore(STORE_BRAND_KITS);
      const req = store.put(kit);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async deleteBrandKit(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BRAND_KITS, 'readwrite');
      const store = tx.objectStore(STORE_BRAND_KITS);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  // Auth User Session (Demo Mode)
  getUserProfile(): UserProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    // Default demo profile
    const defaultUser: UserProfile = {
      id: 'usr_demo_108',
      name: 'Alex Rivera',
      email: 'alex@creatorstudio.io',
      role: 'Creator',
      plan: 'Pro Plan',
      creditsTotal: 250,
      creditsUsed: 42,
      isDemoUser: true,
    };
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(defaultUser));
    return defaultUser;
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(profile));
  },

  clearUserProfile(): void {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  // User Settings
  getSettings(): { theme: 'dark' | 'light'; autoSmartReframing: boolean; defaultPlatform: string } {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      theme: 'dark',
      autoSmartReframing: true,
      defaultPlatform: 'TikTok',
    };
  },

  saveSettings(settings: any): void {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  },
};
