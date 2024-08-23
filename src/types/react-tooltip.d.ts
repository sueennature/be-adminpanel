// src/react-tooltip.d.ts
declare module 'react-tooltip' {
  import { FC } from 'react';

  // Assuming Tooltip is a functional component with specific props
  export const Tooltip: FC<TooltipProps>;

  // Define TooltipProps interface according to the library documentation
  interface TooltipProps {
    content: React.ReactNode;
    place?: 'top' | 'right' | 'bottom' | 'left';
    type?: 'dark' | 'light' | 'success' | 'warning' | 'error';
    effect?: 'float' | 'solid';
    multiline?: boolean;
    html?: boolean;
    // Add other props as needed based on the library documentation
  }
}

