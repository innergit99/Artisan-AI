import React from 'react';
import { ToolType } from '../../types';
import { getTool, initializeDefaultTools } from './registry';
import { ToolComponentProps } from './types';
import PlaceholderTool from './PlaceholderTool';

initializeDefaultTools();

interface ToolRouterProps extends ToolComponentProps {
  activeTool: ToolType;
}

const ToolRouter: React.FC<ToolRouterProps> = ({ activeTool, isDarkMode, onNavigate }) => {
  const tool = getTool(activeTool);

  if (!tool) {
    return (
      <PlaceholderTool
        isDarkMode={isDarkMode}
        onNavigate={onNavigate}
      />
    );
  }

  const ToolComponent = tool.component;

  return (
    <ToolComponent
      isDarkMode={isDarkMode}
      onNavigate={onNavigate}
    />
  );
};

export default ToolRouter;
