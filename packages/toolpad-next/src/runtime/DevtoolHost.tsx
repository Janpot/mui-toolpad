import * as React from 'react';
import { Box, ThemeProvider, GlobalStyles } from '@mui/material';
import theme from './theme';

interface ResizeHandleProps {
  onResize?: (height: number) => void;
  onCommitResize?: (height: number) => void;
}

function ResizeHandle({ onResize, onCommitResize }: ResizeHandleProps) {
  const prevSize = React.useRef<number | null>(null);
  const [resizing, setResizing] = React.useState(false);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (prevSize.current !== null) {
        onResize?.(event.clientY - prevSize.current);
        prevSize.current = event.clientY;
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (prevSize.current !== null) {
        onCommitResize?.(event.clientY - prevSize.current);
        prevSize.current = null;
      }
      setResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize, onCommitResize]);

  return (
    <Box
      sx={{
        my: '-4px',
        width: '100%',
        height: '9px',
        cursor: 'ns-resize',
        pointerEvents: 'auto',
      }}
      onMouseDown={(event) => {
        setResizing(true);
        prevSize.current = event.clientY;
      }}
    >
      <GlobalStyles
        styles={{
          body: resizing
            ? {
                userSelect: 'none',
                cursor: 'ns-resize',
                pointerEvents: 'none',
              }
            : {},
        }}
      />
    </Box>
  );
}

export interface DevtoolHostProps {
  children?: React.ReactNode;
}

/**
 * Pure presentational component that defines the surface we use to render the devtools in
 */
export default function DevtoolHost({ children }: DevtoolHostProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(() => window.innerHeight / 2);

  const handleResize = (y: number) => {
    setHeight((prevHeight) => prevHeight - y);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ body: { marginBottom: `${height}px` } }} />
      <Box
        ref={rootRef}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <ResizeHandle onResize={handleResize} />
        <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
      </Box>
    </ThemeProvider>
  );
}

class ErrorBoundary extends React.Component<{ children?: React.ReactNode }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  render() {
    return this.state.error ? (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {String(this.state.error?.message || this.state.error)}
      </Box>
    ) : (
      this.props.children
    );
  }
}
