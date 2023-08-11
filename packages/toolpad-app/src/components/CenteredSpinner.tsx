import { CircularProgress, SxProps, styled } from '@mui/material';
import * as React from 'react';
import ErrorAlert from '../toolpad/AppEditor/PageEditor/ErrorAlert';

export const Centered = styled('div')({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export interface CenteredSpinnerProps {
  sx?: SxProps;
}

export function CenteredSpinner({ sx }: CenteredSpinnerProps) {
  return (
    <Centered sx={sx}>
      <CircularProgress />
    </Centered>
  );
}

export interface CenteredErrorProps {
  sx?: SxProps;
  error: Error;
}

export function CenteredError({ sx, error }: CenteredErrorProps) {
  return (
    <Centered sx={sx}>
      <ErrorAlert sx={{ m: 1 }} error={error} />
    </Centered>
  );
}
