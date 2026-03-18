// Allow SVG imports with ?react suffix for Vite + SVGR
// This tells TypeScript how to handle SVG imports as React components

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
