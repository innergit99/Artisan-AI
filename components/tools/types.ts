import { ToolType } from '../../types';

export interface ToolComponentProps {
  isDarkMode: boolean;
  onNavigate?: (tab: ToolType, prompt?: string) => void;
}

export interface ToolDefinition {
  id: ToolType;
  component: React.ComponentType<ToolComponentProps>;
  metadata: {
    title: string;
    description: string;
    icon: string;
    category: 'CORE' | 'CREATIVE' | 'UTILITY';
  };
}

export interface ToolState {
  isLoading: boolean;
  error: string | null;
  data: unknown;
}

export type ToolStatus = 'idle' | 'loading' | 'success' | 'error';
