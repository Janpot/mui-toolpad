import * as React from 'react';
import { CacheProvider, createDataProvider } from '@toolpad/core/DataProvider';
import { DataGrid } from '@toolpad/core/DataGrid';
import Box from '@mui/material/Box';
import { DialogProvider } from '@toolpad/core/useDialogs';

const myData = createDataProvider({
  async getMany() {
    return {
      rows: [
        { id: '1', name: 'John' },
        { id: '2', name: 'Jane' },
      ],
    };
  },
  fields: {
    id: { label: 'ID' },
    name: { label: 'Name' },
  },
});

export default function OverrideColumns() {
  return (
    <DialogProvider>
      <CacheProvider>
        <Box sx={{ height: 250, width: '100%' }}>
          {/* preview-start */}
          <DataGrid
            dataProvider={myData}
            columns={[
              // renders header name from data provider
              { field: 'id' },
              // overrides header name from data provider
              { field: 'name', headerName: 'First name' },
              // adds a new column
              { field: 'greeting', valueGetter: (_, row) => `Hi, ${row.name}` },
            ]}
          />
          {/* preview-end */}
        </Box>
      </CacheProvider>
    </DialogProvider>
  );
}