import * as React from 'react';
import { CacheProvider, createDataProvider } from '@toolpad/core/DataProvider';
import { DataGrid } from '@toolpad/core/DataGrid';
import Box from '@mui/material/Box';
import { NotificationsProvider } from '@toolpad/core/useNotifications';

let nextId = 1;
const getNextId = () => {
  const id = `id-${nextId}`;
  nextId += 1;
  return id;
};
let DATA = [
  { id: getNextId(), name: 'John' },
  { id: getNextId(), name: 'Jane' },
];

const myData = createDataProvider({
  async getMany() {
    return {
      rows: DATA,
    };
  },
  // preview-start
  async createOne(values) {
    const id = getNextId();
    const newItem = { ...values, id };
    DATA = [...DATA, newItem];
    return newItem;
  },
  // preview-end
  fields: {
    id: { label: 'ID' },
    name: { label: 'Name' },
  },
});

export default function CrudCreate() {
  return (
    <CacheProvider>
      <Box sx={{ height: 250, width: '100%' }}>
        <NotificationsProvider />
        <DataGrid dataProvider={myData} />
      </Box>
    </CacheProvider>
  );
}
