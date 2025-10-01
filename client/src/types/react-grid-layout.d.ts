declare module 'react-grid-layout' {
  import { ReactNode } from 'react';

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  }

  export interface ResponsiveLayout {
    lg?: Layout[];
    md?: Layout[];
    sm?: Layout[];
    xs?: Layout[];
    xxs?: Layout[];
  }

  export interface ResponsiveProps {
    className?: string;
    style?: React.CSSProperties;
    width?: number;
    autoSize?: boolean;
    cols?: { [key: string]: number };
    breakpoints?: { [key: string]: number };
    layouts?: ResponsiveLayout;
    children?: ReactNode;
    onLayoutChange?: (layout: Layout[], layouts: ResponsiveLayout) => void;
    onBreakpointChange?: (breakpoint: string, cols: number) => void;
    onWidthChange?: (containerWidth: number, margin: [number, number], cols: number, containerPadding: [number, number]) => void;
    draggableHandle?: string;
    draggableCancel?: string;
    compactType?: 'vertical' | 'horizontal' | null;
    preventCollision?: boolean;
    useCSSTransforms?: boolean;
    transformScale?: number;
    allowOverlap?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    margin?: [number, number];
    containerPadding?: [number, number];
    rowHeight?: number;
    maxRows?: number;
    isBounded?: boolean;
  }

  export const Responsive: React.FC<ResponsiveProps>;
  export const WidthProvider: React.ComponentType<{ children: ReactNode }>;
}
