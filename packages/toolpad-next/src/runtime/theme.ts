import { createTheme } from '@mui/material';

export default createTheme({
  components: {
    MuiList: {
      defaultProps: {
        dense: true,
      },
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiListItemButton: {
      defaultProps: {
        dense: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiIcon: {
      defaultProps: {
        fontSize: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        margin: 'dense',
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
        margin: 'dense',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'small',
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 0,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: 8,
          minHeight: 0,
        },
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense',
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        size: 'small',
        margin: 'dense',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
  },
});
