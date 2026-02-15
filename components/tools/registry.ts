import { ToolType } from '../../types';
import { ToolDefinition } from './types';
import PlaceholderTool from './PlaceholderTool';

const toolRegistry = new Map<ToolType, ToolDefinition>();

export function registerTool(tool: ToolDefinition): void {
  toolRegistry.set(tool.id, tool);
}

export function getTool(id: ToolType): ToolDefinition | undefined {
  return toolRegistry.get(id);
}

export function getAllTools(): ToolDefinition[] {
  return Array.from(toolRegistry.values());
}

export function unregisterTool(id: ToolType): boolean {
  return toolRegistry.delete(id);
}

export function isToolRegistered(id: ToolType): boolean {
  return toolRegistry.has(id);
}

export function getToolsByCategory(category: 'CORE' | 'CREATIVE' | 'UTILITY'): ToolDefinition[] {
  return getAllTools().filter(tool => tool.metadata.category === category);
}

export function initializeDefaultTools(): void {
  const defaultTools: ToolDefinition[] = [
    {
      id: ToolType.DASHBOARD,
      component: PlaceholderTool,
      metadata: {
        title: 'Dashboard',
        description: 'Main navigation hub',
        icon: 'layout-grid',
        category: 'CORE'
      }
    },
    {
      id: ToolType.TEXT_TO_IMAGE,
      component: PlaceholderTool,
      metadata: {
        title: 'Text to Image',
        description: 'Generate images from text prompts',
        icon: 'image',
        category: 'CREATIVE'
      }
    },
    {
      id: ToolType.MANUSCRIPT_DOCTOR,
      component: PlaceholderTool,
      metadata: {
        title: 'Manuscript Doctor',
        description: 'AI-powered manuscript editing',
        icon: 'file-edit',
        category: 'CORE'
      }
    },
    {
      id: ToolType.NICHE_RADAR,
      component: PlaceholderTool,
      metadata: {
        title: 'Niche Radar',
        description: 'Market intelligence and niche analysis',
        icon: 'target',
        category: 'CORE'
      }
    },
    {
      id: ToolType.COLORING_PAGES,
      component: PlaceholderTool,
      metadata: {
        title: 'Coloring Pages',
        description: 'Generate coloring book pages',
        icon: 'palette',
        category: 'CREATIVE'
      }
    },
    {
      id: ToolType.POD_MERCH,
      component: PlaceholderTool,
      metadata: {
        title: 'POD Merch',
        description: 'Print-on-demand merchandise design',
        icon: 'shirt',
        category: 'CREATIVE'
      }
    },
    {
      id: ToolType.LOGO_CREATOR,
      component: PlaceholderTool,
      metadata: {
        title: 'Logo Creator',
        description: 'Brand logo generation',
        icon: 'pen-tool',
        category: 'CREATIVE'
      }
    },
    {
      id: ToolType.TREND_INTELLIGENCE,
      component: PlaceholderTool,
      metadata: {
        title: 'Trend Intelligence',
        description: 'Market trend analysis',
        icon: 'trending-up',
        category: 'CORE'
      }
    },
    {
      id: ToolType.AMAZON_SEO,
      component: PlaceholderTool,
      metadata: {
        title: 'Amazon SEO',
        description: 'KDP listing optimization',
        icon: 'search',
        category: 'UTILITY'
      }
    },
    {
      id: ToolType.BAN_SHIELD,
      component: PlaceholderTool,
      metadata: {
        title: 'Ban Shield',
        description: 'Compliance and protection',
        icon: 'shield-check',
        category: 'UTILITY'
      }
    }
  ];

  defaultTools.forEach(tool => registerTool(tool));
}

export function clearRegistry(): void {
  toolRegistry.clear();
}
