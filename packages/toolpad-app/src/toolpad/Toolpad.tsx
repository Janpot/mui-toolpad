import { Box, CssBaseline } from '@mui/material';
import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoSsr from '../components/NoSsr';
import AppEditor from './AppEditor';
import { ThemeProvider } from '../ThemeContext';
import ResourcesEditor from './ResourcesEditor';
import { CenteredSpinner, CenteredError } from '../components/CenteredSpinner';

function ErrorFallback({ error }: FallbackProps) {
  return <CenteredError error={error} />;
}

export interface ToolpadProps {
  basename: string;
}

export default function Toolpad({ basename }: ToolpadProps) {
  return (
    <NoSsr>
      <ThemeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* Container that allows children to size to it with height: 100% */}
        <Box sx={{ height: '1px', minHeight: '100vh' }}>
          <ErrorBoundary fallbackRender={ErrorFallback}>
            <React.Suspense fallback={<CenteredSpinner />}>
              <BrowserRouter basename={basename}>
                <Routes>
                  <Route path="/app/resources/*" element={<ResourcesEditor />} />
                  <Route path="/*" element={<AppEditor />} />
                </Routes>
              </BrowserRouter>
            </React.Suspense>
          </ErrorBoundary>
        </Box>
      </ThemeProvider>
    </NoSsr>
  );
}
