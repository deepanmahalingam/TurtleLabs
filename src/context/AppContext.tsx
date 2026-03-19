import React, { createContext, useContext, useState, ReactNode } from 'react';

export type WorksheetType = 'math' | 'coloring' | 'spot-difference' | 'dot-to-dot' | 'maze';
export type UserMode = 'kids' | 'teacher';

interface Worksheet {
  id: string;
  type: WorksheetType;
  title: string;
  prompt: string;
  data: any;
  createdAt: Date;
}

interface AppContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  worksheets: Worksheet[];
  addWorksheet: (worksheet: Worksheet) => void;
  currentWorksheet: Worksheet | null;
  setCurrentWorksheet: (worksheet: Worksheet | null) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UserMode>('kids');
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [currentWorksheet, setCurrentWorksheet] = useState<Worksheet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addWorksheet = (worksheet: Worksheet) => {
    setWorksheets(prev => [worksheet, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      mode, setMode,
      worksheets, addWorksheet,
      currentWorksheet, setCurrentWorksheet,
      isGenerating, setIsGenerating,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
