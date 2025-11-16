/// <reference types="vite/client" />

import type { UpdateStatus } from './types/models';

declare global {
  interface Window {
    electronAPI?: {
      // Application info
      getAppVersion: () => Promise<string>;
      getAppName: () => Promise<string>;
      
      // Menu actions
      onMenuAction: (callback: (action: string) => void) => void;
      removeMenuActionListener: () => void;
      
      // Update functionality
      checkForUpdates: () => Promise<{ success?: boolean; error?: string }>;
      downloadUpdate: () => Promise<{ success?: boolean; error?: string }>;
      installUpdate: () => Promise<{ success?: boolean; error?: string }>;
      
      // Update status listener
      onUpdateStatus: (callback: (status: UpdateStatus) => void) => void;
      removeUpdateStatusListener: () => void;
      
      // Platform information
      platform: string;
      isDev: boolean;
    };
  }
}
