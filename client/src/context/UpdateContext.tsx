import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UpdateStatus, UpdateSettings } from '../types/models';

interface UpdateContextType {
  updateStatus: UpdateStatus | null;
  updateSettings: UpdateSettings;
  isUpdateAvailable: boolean;
  isDownloading: boolean;
  isUpdateReady: boolean;
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  installUpdate: () => Promise<void>;
  setUpdateSettings: (settings: Partial<UpdateSettings>) => void;
  dismissUpdate: () => void;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

interface UpdateProviderProps {
  children: ReactNode;
}

const defaultSettings: UpdateSettings = {
  autoCheck: true,
  autoDownload: false,
  notifyOnUpdate: true,
  checkInterval: 24 // 24 hours
};

export function UpdateProvider({ children }: UpdateProviderProps) {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
  const [updateSettings, setUpdateSettings] = useState<UpdateSettings>(defaultSettings);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdateReady, setIsUpdateReady] = useState(false);

  // Check if we're in Electron environment
  const isElectron = typeof window !== 'undefined' && window.electronAPI;

  useEffect(() => {
    if (!isElectron) return;

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('updateSettings');
    if (savedSettings) {
      setUpdateSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    // Listen for update status changes
    const handleUpdateStatus = (status: UpdateStatus) => {
      console.log('Update status:', status);
      setUpdateStatus(status);

      switch (status.type) {
        case 'available':
          setIsUpdateAvailable(true);
          setIsDownloading(false);
          setIsUpdateReady(false);
          break;
        case 'not-available':
          setIsUpdateAvailable(false);
          setIsDownloading(false);
          setIsUpdateReady(false);
          break;
        case 'downloading':
          setIsUpdateAvailable(true);
          setIsDownloading(true);
          setIsUpdateReady(false);
          break;
        case 'downloaded':
          setIsUpdateAvailable(true);
          setIsDownloading(false);
          setIsUpdateReady(true);
          break;
        case 'error':
          setIsDownloading(false);
          break;
      }
    };

    window.electronAPI?.onUpdateStatus(handleUpdateStatus);

    // Auto-check for updates if enabled
    if (updateSettings.autoCheck) {
      checkForUpdates();
    }

    // Cleanup
    return () => {
      window.electronAPI?.removeUpdateStatusListener();
    };
  }, [isElectron]);

  const checkForUpdates = async () => {
    if (!isElectron || !window.electronAPI) {
      console.warn('Update check not available outside Electron');
      return;
    }

    try {
      await window.electronAPI.checkForUpdates();
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  };

  const downloadUpdate = async () => {
    if (!isElectron || !window.electronAPI) {
      console.warn('Update download not available outside Electron');
      return;
    }

    try {
      await window.electronAPI.downloadUpdate();
    } catch (error) {
      console.error('Failed to download update:', error);
    }
  };

  const installUpdate = async () => {
    if (!isElectron || !window.electronAPI) {
      console.warn('Update install not available outside Electron');
      return;
    }

    try {
      await window.electronAPI.installUpdate();
    } catch (error) {
      console.error('Failed to install update:', error);
    }
  };

  const handleUpdateSettings = (newSettings: Partial<UpdateSettings>) => {
    const updatedSettings = { ...updateSettings, ...newSettings };
    setUpdateSettings(updatedSettings);
    localStorage.setItem('updateSettings', JSON.stringify(updatedSettings));
  };

  const dismissUpdate = () => {
    setIsUpdateAvailable(false);
    setUpdateStatus(null);
  };

  const value: UpdateContextType = {
    updateStatus,
    updateSettings,
    isUpdateAvailable,
    isDownloading,
    isUpdateReady,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
    setUpdateSettings: handleUpdateSettings,
    dismissUpdate
  };

  return (
    <UpdateContext.Provider value={value}>
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdate() {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error('useUpdate must be used within an UpdateProvider');
  }
  return context;
}

export { UpdateContext };