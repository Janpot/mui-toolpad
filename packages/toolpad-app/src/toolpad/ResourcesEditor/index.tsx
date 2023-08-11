import * as React from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TextField,
  Toolbar,
} from '@mui/material';
import JavascriptIcon from '@mui/icons-material/Javascript';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import invariant from 'invariant';
import { Link, Outlet, Route, Routes, useParams } from 'react-router-dom';
import client from '../../api';
import SplitPane from '../../components/SplitPane';
import ToolpadShell from '../ToolpadShell';
import { ResourceMeta, Resource, LocalResource } from '../../types';
import ErrorAlert from '../AppEditor/PageEditor/ErrorAlert';
import { errorFrom } from '../../../../toolpad-utils/dist/errors';
import { CenteredError, CenteredSpinner } from '../../components/CenteredSpinner';
import { FileIntrospectionResult } from '../../server/functionsTypesWorker';

function getResourceKindDisplayName(resource: ResourceMeta) {
  switch (resource.kind) {
    case 'local':
      return 'Custom functions';
    default:
      return resource.kind;
  }
}

interface LoadingListItemProps {
  icon?: boolean;
  secondary?: boolean;
}

function LoadingListItem({ icon, secondary }: LoadingListItemProps) {
  return (
    <ListItem>
      {icon ? (
        <ListItemIcon>
          <Skeleton variant="circular" width={20} height={20} />
        </ListItemIcon>
      ) : null}
      <ListItemText secondary={secondary ? <Skeleton variant="text" /> : undefined}>
        <Skeleton variant="text" />
      </ListItemText>
    </ListItem>
  );
}

type FilteredListOptions<T> = {} & (T extends string
  ? { extractFields?: undefined }
  : { extractFields: (item: T) => Partial<Record<string, string>> });

function createListFilter<T>({ extractFields }: FilteredListOptions<T>) {
  const includes = (input: string, searchTerm: string) => {
    return input.toLowerCase().includes(searchTerm.toLowerCase());
  };
  return function useFilteredList(items: T[], searchTerm: string): { result: T[] } {
    const filterFn = React.useCallback(
      (item: T) => {
        if (!searchTerm) {
          return true;
        }
        if (typeof item === 'string') {
          return includes(item, searchTerm);
        }
        if (item && typeof item === 'object') {
          invariant(extractFields, 'extractFields must be provided');
          const fields = extractFields(item);

          return Object.values(fields).some((value) => {
            return value ? includes(value, searchTerm) : false;
          });
        }
        return false;
      },
      [searchTerm],
    );

    return React.useMemo(() => {
      return {
        result: searchTerm ? items.filter(filterFn) : items,
      };
    }, [filterFn, items, searchTerm]);
  };
}

const useFilteredList = createListFilter<ResourceMeta>({
  extractFields: (item) => ({ displayName: item.displayName }),
});

interface ResourcesNavigationPanelProps {}

function ResourcesNavigationPanel({}: ResourcesNavigationPanelProps) {
  const { data, isLoading, error } = client.useQuery('getResources', []);

  const [searchInput, setSearchInput] = React.useState('');

  const { result: filteredOptions } = useFilteredList(data?.resources ?? [], searchInput);

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{ px: 1, gap: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        disableGutters
        variant="dense"
      >
        <TextField
          fullWidth
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton>
          <AddIcon />
        </IconButton>
      </Toolbar>
      <List sx={{ flex: 1, minHeight: 0 }} disablePadding>
        {isLoading ? <LoadingListItem icon secondary /> : null}
        {error ? <ErrorAlert sx={{ m: 1 }} error={errorFrom(error)} /> : null}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((resource) => (
            <ListItem key={resource.id} disableGutters>
              <ListItemButton component={Link} to={`./${resource.id}`}>
                <ListItemIcon>
                  <JavascriptIcon fontSize="medium" />
                </ListItemIcon>

                <ListItemText secondary={getResourceKindDisplayName(resource)}>
                  {resource.displayName}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText>No resources</ListItemText>
          </ListItem>
        )}
      </List>
    </Box>
  );
}

function ResourcesEditorShell() {
  return (
    <ToolpadShell>
      <SplitPane
        sx={{ flex: 1, height: '100%' }}
        split="vertical"
        minSize={120}
        defaultSize={250}
        allowResize
      >
        <ResourcesNavigationPanel />
        <Box sx={{ height: '100%' }}>
          <Outlet />
        </Box>
      </SplitPane>
    </ToolpadShell>
  );
}

interface FunctionsNavigationsPanelProps {
  file: FileIntrospectionResult;
}

function FunctionsNavigationsPanel({ file }: FunctionsNavigationsPanelProps) {
  return <Box>hello</Box>;
}

interface LocalResourceEditorProps {
  resource: LocalResource;
}

function LocalResourceEditor({ resource }: LocalResourceEditorProps) {
  return (
    <SplitPane
      sx={{ height: '100%', width: '100%' }}
      split="vertical"
      minSize={120}
      defaultSize={250}
      allowResize
    >
      <FunctionsNavigationsPanel file={resource.file} />
      <Box sx={{ height: '100%' }}>
        <Outlet />
      </Box>
    </SplitPane>
  );
}

interface ResourceEditorProps {
  id: string;
}

function ResourceEditor({ id }: ResourceEditorProps) {
  const { data: resource, isLoading, error } = client.useQuery('getResource', [id]);

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return <CenteredError error={errorFrom(error)} />;
  }

  if (!resource) {
    return <CenteredError error={new Error(`Resource with id "${id}" not found`)} />;
  }

  switch (resource.kind) {
    case 'local':
      return <LocalResourceEditor resource={resource} />;
    default:
      return <CenteredError error={new Error(`Unknown resource kind "${resource.kind}"`)} />;
  }
}

function ResourceEditorRoute() {
  const params = useParams();
  invariant(params.id, 'id must be provided as a route parameter');
  return <ResourceEditor id={params.id} />;
}

export default function ResourcesEditor() {
  return (
    <Routes>
      <Route path="/" element={<ResourcesEditorShell />}>
        <Route path="/:id" element={<ResourceEditorRoute />} />
      </Route>
    </Routes>
  );
}
