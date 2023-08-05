'use strict';

var React5 = require('react');
var useStorageState = require('@mui/toolpad-utils/hooks/useStorageState');
var material = require('@mui/material');
var EditIcon = require('@mui/icons-material/Edit');
var invariant = require('invariant');
var sucrase = require('sucrase');
var CloseIcon = require('@mui/icons-material/Close');
var ErrorOutlineIcon = require('@mui/icons-material/ErrorOutline');
var SaveIcon = require('@mui/icons-material/Save');
var path = require('path-browserify');
var lab = require('@mui/lab');
var SearchIcon = require('@mui/icons-material/Search');
var AddIcon = require('@mui/icons-material/Add');
var DeleteIcon = require('@mui/icons-material/Delete');
var strings = require('@mui/toolpad-utils/strings');
var events = require('@mui/toolpad-utils/events');
var useDebouncedHandler = require('@mui/toolpad-utils/hooks/useDebouncedHandler');
var superjson = require('superjson');
var z = require('zod');
var prettier = require('prettier/standalone');
var parserEstree = require('prettier/plugins/estree');
var parserBabel = require('prettier/plugins/babel');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React5__namespace = /*#__PURE__*/_interopNamespace(React5);
var useStorageState__default = /*#__PURE__*/_interopDefault(useStorageState);
var EditIcon__default = /*#__PURE__*/_interopDefault(EditIcon);
var invariant__default = /*#__PURE__*/_interopDefault(invariant);
var sucrase__namespace = /*#__PURE__*/_interopNamespace(sucrase);
var CloseIcon__default = /*#__PURE__*/_interopDefault(CloseIcon);
var ErrorOutlineIcon__default = /*#__PURE__*/_interopDefault(ErrorOutlineIcon);
var SaveIcon__default = /*#__PURE__*/_interopDefault(SaveIcon);
var path__namespace = /*#__PURE__*/_interopNamespace(path);
var SearchIcon__default = /*#__PURE__*/_interopDefault(SearchIcon);
var AddIcon__default = /*#__PURE__*/_interopDefault(AddIcon);
var DeleteIcon__default = /*#__PURE__*/_interopDefault(DeleteIcon);
var useDebouncedHandler__default = /*#__PURE__*/_interopDefault(useDebouncedHandler);
var superjson__namespace = /*#__PURE__*/_interopNamespace(superjson);
var z__namespace = /*#__PURE__*/_interopNamespace(z);
var prettier__namespace = /*#__PURE__*/_interopNamespace(prettier);
var parserEstree__default = /*#__PURE__*/_interopDefault(parserEstree);
var parserBabel__default = /*#__PURE__*/_interopDefault(parserBabel);

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
function decodeSegment(segment) {
  const decodedSegment = segment.replaceAll(/~0/g, "/").replaceAll(/~1/g, "~");
  if (!decodedSegment) {
    return decodedSegment;
  }
  const asNumber = Number(decodedSegment);
  return Number.isNaN(asNumber) ? decodedSegment : asNumber;
}
function encodeSegment(segment) {
  return String(segment).replaceAll("~", "~0").replaceAll("/", "~1");
}
function decode(pointer) {
  const [first, ...parts] = pointer.split("/");
  if (first !== "") {
    throw new Error(`Invalid JSON pointer "${pointer}"`);
  }
  return parts.map((segment) => decodeSegment(segment));
}
function encode(segments) {
  return ["", ...segments.map((segment) => encodeSegment(segment))].join("/");
}
function toExpression(name, pointer) {
  const segments = Array.isArray(pointer) ? pointer : decode(pointer);
  return `${name}${segments.map((segment) => {
    if (typeof segment === "string" && strings.isValidJsIdentifier(segment)) {
      return `.${segment}`;
    }
    return `[${JSON.stringify(segment)}]`;
  }).join("")}`;
}
function* generatePointerSuggestions(obj, options, prefix) {
  if (!options.filter || options.filter && options.filter(obj)) {
    yield prefix;
  }
  if (obj && typeof obj === "object") {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i += 1) {
        yield* generatePointerSuggestions(obj[i], options, [...prefix, i]);
      }
    } else {
      for (const key of Object.keys(obj)) {
        yield* generatePointerSuggestions(obj[key], options, [
          ...prefix,
          key
        ]);
      }
    }
  }
}
function* take(generator, max) {
  let i = 0;
  for (const item of generator) {
    if (i >= max) {
      return;
    }
    i += 1;
    yield item;
  }
}
function generateSuggestions(obj, options = {}) {
  const pointers = generatePointerSuggestions(obj, options, []);
  return Array.from(take(pointers, options.max ?? 1e3), (pointer) => ({
    pointer: encode(pointer),
    depth: pointer.length
  }));
}

// src/runtime/JsonPointerInput.tsx
function JsonPointerInput({
  target,
  value,
  onChange,
  filter,
  ...props
}) {
  const options = React5__namespace.useMemo(
    () => generateSuggestions(target, {
      filter
    }).map((suggestion) => suggestion.pointer),
    [target, filter]
  );
  return /* @__PURE__ */ React5__namespace.createElement(
    material.Autocomplete,
    {
      freeSolo: true,
      options,
      value,
      onChange: (event, newValue) => onChange(newValue ?? ""),
      renderInput: (params) => /* @__PURE__ */ React5__namespace.createElement(material.TextField, { ...props, ...params })
    }
  );
}

// src/runtime/probes.tsx
var probes_exports = {};
__export(probes_exports, {
  getSnapshot: () => getSnapshot,
  reset: () => reset,
  subscribe: () => subscribe,
  update: () => update,
  useProbe: () => useProbe,
  useProbeTarget: () => useProbeTarget,
  useProbes: () => useProbes
});
var values = /* @__PURE__ */ new Map();
var emitter = new events.Emitter();
function reset() {
  values.clear();
}
function update(key, value) {
  values.set(key, value);
  emitter.emit(key, null);
}
function subscribe(key, callback) {
  return emitter.subscribe(key, callback);
}
function getSnapshot(key) {
  return values.get(key);
}
var ProbeContext = React5__namespace.createContext(null);
function useProbeTarget(key, value) {
  const probeContext = React5__namespace.useContext(ProbeContext);
  React5__namespace.useEffect(() => {
    update(key, value);
  }, [probeContext, key, value]);
}
function useProbe(key) {
  const subscribeKey = React5__namespace.useCallback((cb) => subscribe(key, cb), [key]);
  const getKeySnapshot = React5__namespace.useCallback(() => getSnapshot(key), [key]);
  return React5__namespace.useSyncExternalStore(subscribeKey, getKeySnapshot);
}
function useProbes() {
  return React5__namespace.useContext(ProbeContext);
}

// src/runtime/DataGridFileEditor/ColumnsEditor.tsx
var COLUMN_TYPE_OPTIONS = {
  string: { label: "String" },
  number: { label: "Number" },
  boolean: { label: "Boolean" },
  date: { label: "Date" },
  datetime: { label: "DateTime" }
};
function getTypeLabel(type) {
  return type ? COLUMN_TYPE_OPTIONS[type].label : COLUMN_TYPE_OPTIONS.string.label;
}
function ColumnDefinitionEditor({
  columns,
  value,
  onChange,
  onDelete
}) {
  const rows = useProbe("rows");
  const fieldSuggestions = React5__namespace.useMemo(() => {
    const availableKeys = Object.keys(rows?.[0] ?? {});
    const definedKeys = new Set(columns.map((column) => column.field));
    return availableKeys.filter((key) => !definedKeys.has(key));
  }, [columns, rows]);
  return /* @__PURE__ */ React5__namespace.createElement(React5__namespace.Fragment, null, /* @__PURE__ */ React5__namespace.createElement(
    material.Autocomplete,
    {
      freeSolo: true,
      disableClearable: true,
      options: fieldSuggestions,
      value: value.field,
      onChange: (event, newValue) => onChange({ ...value, field: newValue }),
      renderInput: (params) => /* @__PURE__ */ React5__namespace.createElement(material.TextField, { ...params, label: "Field" })
    }
  ), /* @__PURE__ */ React5__namespace.createElement(
    JsonPointerInput,
    {
      label: "Value Selector",
      target: rows?.[0],
      value: value.valueSelector || encode([value.field]),
      onChange: (valueSelector) => onChange({ ...value, valueSelector }),
      helperText: /* @__PURE__ */ React5__namespace.createElement(React5__namespace.Fragment, null, "Valid ", /* @__PURE__ */ React5__namespace.createElement("a", { href: "https://datatracker.ietf.org/doc/html/rfc6901" }, "JSON Pointer"), " that references a (nested) property in the returned row.")
    }
  ), /* @__PURE__ */ React5__namespace.createElement(
    material.TextField,
    {
      label: "Type",
      select: true,
      value: value.type ?? "string",
      onChange: (event) => onChange({ ...value, type: event.target.value })
    },
    Object.keys(COLUMN_TYPE_OPTIONS).map((type) => /* @__PURE__ */ React5__namespace.createElement(material.MenuItem, { key: type, value: type }, getTypeLabel(type)))
  ), /* @__PURE__ */ React5__namespace.createElement(material.Button, { color: "error", startIcon: /* @__PURE__ */ React5__namespace.createElement(DeleteIcon__default.default, null), onClick: () => onDelete?.() }, "Remove column"));
}
function ColumnsDefinitionsEditor({ value, onChange }) {
  const [activeIndex, setActiveIndex] = React5__namespace.useState(0);
  const activeColumn = React5__namespace.useMemo(() => value[activeIndex], [activeIndex, value]);
  return /* @__PURE__ */ React5__namespace.createElement(material.Stack, { direction: "row", sx: { width: "100%", height: "100%" } }, /* @__PURE__ */ React5__namespace.createElement(material.Stack, { direction: "column", sx: { width: "25%" } }, /* @__PURE__ */ React5__namespace.createElement(
    material.Box,
    {
      sx: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        p: 1,
        gap: 1
      }
    },
    /* @__PURE__ */ React5__namespace.createElement(
      material.OutlinedInput,
      {
        fullWidth: true,
        endAdornment: /* @__PURE__ */ React5__namespace.createElement(material.InputAdornment, { position: "end" }, /* @__PURE__ */ React5__namespace.createElement(SearchIcon__default.default, null))
      }
    ),
    /* @__PURE__ */ React5__namespace.createElement(
      material.IconButton,
      {
        onClick: () => {
          onChange([...value, { field: "new" }]);
          setActiveIndex(value.length);
        }
      },
      /* @__PURE__ */ React5__namespace.createElement(AddIcon__default.default, null)
    )
  ), /* @__PURE__ */ React5__namespace.createElement(material.Box, { sx: { overflow: "auto" } }, /* @__PURE__ */ React5__namespace.createElement(material.List, null, value.map((column, i) => {
    return /* @__PURE__ */ React5__namespace.createElement(material.ListItem, { key: column.field, disablePadding: true }, /* @__PURE__ */ React5__namespace.createElement(material.ListItemButton, { selected: activeIndex === i, onClick: () => setActiveIndex(i) }, /* @__PURE__ */ React5__namespace.createElement(material.ListItemText, { secondary: getTypeLabel(column.type) }, column.field)));
  })))), /* @__PURE__ */ React5__namespace.createElement(material.Stack, { sx: { p: 2 } }, activeColumn ? /* @__PURE__ */ React5__namespace.createElement(
    ColumnDefinitionEditor,
    {
      columns: value,
      value: activeColumn,
      onChange: (newColumn) => {
        onChange(value.map((column, i) => i === activeIndex ? newColumn : column));
      },
      onDelete: () => {
        onChange(value.filter((_, i) => i !== activeIndex));
        setActiveIndex(0);
      }
    }
  ) : null));
}
function ColumnsEditor({ value, onChange }) {
  return /* @__PURE__ */ React5__namespace.createElement(material.Box, { sx: { width: "100%", height: "100%" } }, /* @__PURE__ */ React5__namespace.createElement(
    ColumnsDefinitionsEditor,
    {
      value: value.columns || [],
      onChange: (columns) => onChange({ ...value, columns })
    }
  ));
}
var DATA_KIND_OPTIONS = [
  {
    value: "property",
    label: "Property"
  },
  {
    value: "fetch",
    label: "Fetch from REST API"
  }
];
var FETCH_METHOD_OPTIONS = ["GET", "POST"];
function PropertyEditor({ providerSelectorInput, renderRowIdSelectorInput }) {
  const liveRows = useProbe("rows");
  return /* @__PURE__ */ React5__namespace.createElement(material.Stack, { sx: { width: "100%", height: "100%" }, direction: "row" }, /* @__PURE__ */ React5__namespace.createElement(material.Box, { sx: { flex: 1, p: 2 } }, providerSelectorInput, renderRowIdSelectorInput({ target: liveRows?.[0] }), /* @__PURE__ */ React5__namespace.createElement(material.Typography, null, "Pass the data through a ", /* @__PURE__ */ React5__namespace.createElement("code", null, "rows"), " property on your component.")), /* @__PURE__ */ React5__namespace.createElement(material.Box, { sx: { flex: 1 } }, "right"));
}
function useDebouncedInput(value, onChange, delay) {
  const [input, setInput] = React5__namespace.useState(value);
  React5__namespace.useEffect(() => {
    setInput(value);
  }, [value]);
  const debouncedOnChange = useDebouncedHandler__default.default(onChange, delay);
  const handleInputChange = React5__namespace.useCallback(
    (newValue) => {
      setInput(newValue);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange]
  );
  return [input, handleInputChange];
}
function rowSelectorFilter(value) {
  return Array.isArray(value) && (value.length <= 0 || value[0] && typeof value[0] === "object");
}
function rowIdSelectorFilter(value) {
  return typeof value === "string" || typeof value === "number";
}
function FetchEditor({
  providerSelectorInput,
  renderRowIdSelectorInput,
  value: valueProp,
  onChange: onChangeProp
}) {
  const [input, setInput] = useDebouncedInput(valueProp, onChangeProp, 300);
  const liveRows = useProbe("rows");
  const rawData = useProbe("fetch.rawData");
  return /* @__PURE__ */ React5__namespace.createElement(material.Stack, { sx: { width: "100%", height: "100%" }, direction: "row" }, /* @__PURE__ */ React5__namespace.createElement(material.Box, { sx: { flex: 1, height: "100%", p: 2, overflow: "auto" } }, providerSelectorInput, /* @__PURE__ */ React5__namespace.createElement(React5__namespace.Fragment, null, /* @__PURE__ */ React5__namespace.createElement(material.Stack, { direction: "row", sx: { gap: 1 } }, /* @__PURE__ */ React5__namespace.createElement(
    material.TextField,
    {
      select: true,
      sx: { width: "110px" },
      value: input.method ?? "GET",
      label: "Method",
      onChange: (event) => setInput({
        ...input,
        method: event.target.value
      })
    },
    FETCH_METHOD_OPTIONS.map((option) => /* @__PURE__ */ React5__namespace.createElement(material.MenuItem, { key: option, value: option }, option))
  ), /* @__PURE__ */ React5__namespace.createElement(
    material.TextField,
    {
      label: "URL",
      fullWidth: true,
      value: input.url || "/",
      onChange: (event) => setInput({ ...input, url: event.target.value })
    }
  )), /* @__PURE__ */ React5__namespace.createElement(
    JsonPointerInput,
    {
      label: "Rows Selector",
      target: rawData,
      filter: rowSelectorFilter,
      fullWidth: true,
      value: input.selector || "",
      onChange: (newValue) => setInput({ ...input, selector: newValue }),
      helperText: /* @__PURE__ */ React5__namespace.createElement(React5__namespace.Fragment, null, "Valid ", /* @__PURE__ */ React5__namespace.createElement("a", { href: "https://datatracker.ietf.org/doc/html/rfc6901" }, "JSON Pointer"), " that references a (nested) property in the returned data that represents the rows.")
    }
  ), renderRowIdSelectorInput({ target: liveRows?.[0] }))), /* @__PURE__ */ React5__namespace.createElement(material.Box, { sx: { flex: 1, height: "100%", overflow: "auto", px: 4 } }, /* @__PURE__ */ React5__namespace.createElement("pre", null, typeof liveRows === "undefined" ? "undefined" : JSON.stringify(liveRows, null, 2))));
}
function RowsSpecEditor({ value, onChange, renderRowIdSelectorInput }) {
  const providerSelectorInput = /* @__PURE__ */ React5__namespace.createElement(
    material.TextField,
    {
      select: true,
      value: value.kind ?? "property",
      label: "Data Provider",
      onChange: (event) => {
        const newKind = event.target.value;
        onChange({ kind: newKind });
      }
    },
    DATA_KIND_OPTIONS.map((option) => /* @__PURE__ */ React5__namespace.createElement(material.MenuItem, { key: option.value, value: option.value }, option.label))
  );
  switch (value.kind) {
    case "property":
      return /* @__PURE__ */ React5__namespace.createElement(
        PropertyEditor,
        {
          providerSelectorInput,
          renderRowIdSelectorInput,
          value,
          onChange
        }
      );
    case "fetch":
      return /* @__PURE__ */ React5__namespace.createElement(
        FetchEditor,
        {
          providerSelectorInput,
          renderRowIdSelectorInput,
          value,
          onChange
        }
      );
    default:
      return null;
  }
}
function RowsEditor({ value, onChange }) {
  const renderRowIdSelectorInput = ({ target } = {}) => /* @__PURE__ */ React5__namespace.createElement(
    JsonPointerInput,
    {
      label: "Row ID selector",
      value: value.rowIdSelector || "",
      filter: rowIdSelectorFilter,
      onChange: (newValue) => onChange({ ...value, rowIdSelector: newValue }),
      target,
      helperText: /* @__PURE__ */ React5__namespace.createElement(React5__namespace.Fragment, null, "Valid ", /* @__PURE__ */ React5__namespace.createElement("a", { href: "https://datatracker.ietf.org/doc/html/rfc6901" }, "JSON Pointer"), " that references a (nested) property in the rows, to be used as a unique identifier.")
    }
  );
  return /* @__PURE__ */ React5__namespace.createElement(
    RowsSpecEditor,
    {
      renderRowIdSelectorInput,
      value: value.rows || { kind: "property" },
      onChange: (rows) => onChange({ ...value, rows })
    }
  );
}

// src/runtime/DataGridFileEditor/DataGridFileEditor.tsx
function NumberField({ value, onChange, onBlur, ...props }) {
  const [input, setInput] = React5__namespace.useState(value);
  React5__namespace.useEffect(() => {
    setInput(value);
  }, [value]);
  const clearEventRef = React5__namespace.useRef(null);
  const handleChange = React5__namespace.useCallback(
    (event) => {
      const newValue = event.target.value;
      setInput(newValue);
      if (newValue) {
        onChange?.(event);
        clearEventRef.current = null;
      } else {
        clearEventRef.current = event;
      }
    },
    [onChange]
  );
  const handleBlur = React5__namespace.useCallback(
    (event) => {
      if (clearEventRef.current) {
        onChange?.(clearEventRef.current);
      }
      onBlur?.(event);
    },
    [onBlur, onChange]
  );
  return /* @__PURE__ */ React5__namespace.createElement(material.TextField, { type: "number", value: input, onChange: handleChange, onBlur: handleBlur, ...props });
}
var TabPanel = material.styled(lab.TabPanel)({ padding: 0, flex: 1, minHeight: 0 });
function DataGridFileEditor({
  value,
  onChange,
  source,
  commitButton
}) {
  const [activeTab, setActiveTab] = useStorageState__default.default("session", `activeTab`, "data");
  const handleSpecChange = React5__namespace.useCallback(
    (newSpec) => {
      if (value.spec !== newSpec) {
        onChange({
          ...value,
          spec: newSpec
        });
      }
    },
    [onChange, value]
  );
  const heightMode = value.spec?.heightMode || "fixed";
  return /* @__PURE__ */ React5__namespace.createElement(material.Box, { sx: { width: "100%", height: "100%", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React5__namespace.createElement(lab.TabContext, { value: activeTab }, /* @__PURE__ */ React5__namespace.createElement(
    material.Box,
    {
      sx: {
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "end"
      }
    },
    /* @__PURE__ */ React5__namespace.createElement(lab.TabList, { onChange: (_event, newValue) => setActiveTab(newValue) }, /* @__PURE__ */ React5__namespace.createElement(material.Tab, { label: "General", value: "general" }), /* @__PURE__ */ React5__namespace.createElement(material.Tab, { label: "Rows", value: "rows" }), /* @__PURE__ */ React5__namespace.createElement(material.Tab, { label: "Columns", value: "columns" }), /* @__PURE__ */ React5__namespace.createElement(material.Tab, { label: "Source", value: "source" })),
    commitButton
  ), /* @__PURE__ */ React5__namespace.createElement(TabPanel, { value: "general" }, /* @__PURE__ */ React5__namespace.createElement(material.Container, null, /* @__PURE__ */ React5__namespace.createElement(material.Box, null, /* @__PURE__ */ React5__namespace.createElement(material.FormControl, null, /* @__PURE__ */ React5__namespace.createElement(material.FormLabel, null, "Data Grid Height"), /* @__PURE__ */ React5__namespace.createElement(
    material.RadioGroup,
    {
      value: heightMode,
      onChange: (event, newHeightMode) => handleSpecChange({
        ...value.spec,
        heightMode: newHeightMode
      })
    },
    /* @__PURE__ */ React5__namespace.createElement(material.FormControlLabel, { value: "auto", control: /* @__PURE__ */ React5__namespace.createElement(material.Radio, null), label: "Auto height" }),
    /* @__PURE__ */ React5__namespace.createElement(
      material.FormControlLabel,
      {
        value: "container",
        control: /* @__PURE__ */ React5__namespace.createElement(material.Radio, null),
        label: "Adapt height to container"
      }
    ),
    /* @__PURE__ */ React5__namespace.createElement(material.FormControlLabel, { value: "fixed", control: /* @__PURE__ */ React5__namespace.createElement(material.Radio, null), label: "Fixed height" })
  ))), /* @__PURE__ */ React5__namespace.createElement(material.Box, null, /* @__PURE__ */ React5__namespace.createElement(
    NumberField,
    {
      label: "height",
      value: value.spec?.height ?? 400,
      disabled: heightMode !== "fixed",
      onChange: (event) => {
        handleSpecChange({
          ...value.spec,
          height: event.target.value ? Number(event.target.value) : void 0
        });
      }
    }
  )))), /* @__PURE__ */ React5__namespace.createElement(TabPanel, { value: "rows" }, /* @__PURE__ */ React5__namespace.createElement(RowsEditor, { value: value.spec || {}, onChange: handleSpecChange })), /* @__PURE__ */ React5__namespace.createElement(TabPanel, { value: "columns" }, /* @__PURE__ */ React5__namespace.createElement(ColumnsEditor, { value: value.spec ?? {}, onChange: handleSpecChange })), /* @__PURE__ */ React5__namespace.createElement(TabPanel, { value: "source" }, /* @__PURE__ */ React5__namespace.createElement(material.Container, { sx: { width: "100%", height: "100%", overflow: "auto", px: 4 } }, source ? source.files.map(([path5, { code }]) => /* @__PURE__ */ React5__namespace.createElement(material.Box, { key: path5 }, /* @__PURE__ */ React5__namespace.createElement(material.Typography, { variant: "h6" }, path5), /* @__PURE__ */ React5__namespace.createElement("pre", null, code))) : null))));
}
var theme_default = material.createTheme({
  components: {
    MuiList: {
      defaultProps: {
        dense: true
      },
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiListItem: {
      defaultProps: {
        dense: true
      }
    },
    MuiListItemButton: {
      defaultProps: {
        dense: true
      }
    },
    MuiIconButton: {
      defaultProps: {
        size: "small"
      }
    },
    MuiIcon: {
      defaultProps: {
        fontSize: "small"
      }
    },
    MuiSelect: {
      defaultProps: {
        size: "small"
      }
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        size: "small"
      }
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        margin: "dense"
      }
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small"
      }
    },
    MuiFormControl: {
      defaultProps: {
        size: "small",
        margin: "dense"
      }
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense"
      }
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true
      }
    },
    MuiAutocomplete: {
      defaultProps: {
        size: "small"
      }
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: "small"
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 0
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: 8,
          minHeight: 0
        }
      }
    },
    MuiToolbar: {
      defaultProps: {
        variant: "dense"
      }
    },
    MuiFilledInput: {
      defaultProps: {
        margin: "dense"
      }
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense"
      }
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense"
      }
    },
    MuiOutlinedInput: {
      defaultProps: {
        size: "small",
        margin: "dense"
      }
    },
    MuiFab: {
      defaultProps: {
        size: "small"
      }
    },
    MuiTable: {
      defaultProps: {
        size: "small"
      }
    }
  }
});
var requestIdSchema = z__namespace.union([z__namespace.string(), z__namespace.number(), z__namespace.null()]);
var rpcRequestSchema = z__namespace.object({
  jsonrpc: z__namespace.literal("2.0"),
  method: z__namespace.string(),
  params: z__namespace.array(z__namespace.any()),
  id: requestIdSchema
});
var rpcErrorSchema = z__namespace.object({
  code: z__namespace.number(),
  message: z__namespace.string(),
  data: z__namespace.any().optional()
});
var rpcErrorResponseSchema = z__namespace.object({
  jsonrpc: z__namespace.literal("2.0"),
  result: z__namespace.undefined(),
  error: rpcErrorSchema,
  id: requestIdSchema
});
var rpcSuccessResponseSchema = z__namespace.object({
  jsonrpc: z__namespace.literal("2.0"),
  result: z__namespace.any(),
  error: z__namespace.undefined(),
  id: requestIdSchema
});
var rpcResponseSchema = z__namespace.union([rpcErrorResponseSchema, rpcSuccessResponseSchema]);
z__namespace.union([
  z__namespace.object({
    request: rpcRequestSchema,
    response: z__namespace.undefined().optional()
  }),
  z__namespace.object({
    request: z__namespace.undefined().optional(),
    response: rpcResponseSchema
  })
]);

// src/shared/RpcClient.ts
var RpcClient = class {
  nextId = 0;
  ws;
  pendingRequests = /* @__PURE__ */ new Map();
  constructor(ws) {
    this.ws = ws;
    this.ws.addEventListener("message", (event) => {
      const message = rpcResponseSchema.parse(superjson__namespace.parse(event.data));
      const { id, result, error } = message;
      const pending = this.pendingRequests.get(id);
      if (!pending) {
        return;
      }
      clearTimeout(pending.timeout);
      this.pendingRequests.delete(id);
      if (error) {
        pending.reject(
          Object.assign(
            new Error(`${error.code ? `${error.code}: ` : ""}${error.message || "Unknown error"}`, {
              cause: error
            }),
            {
              code: error.code
            }
          )
        );
      } else {
        pending.resolve(result);
      }
    });
  }
  async call(method, params) {
    return new Promise((resolve2, reject) => {
      const id = this.nextId;
      this.nextId += 1;
      const message = superjson__namespace.stringify({
        jsonrpc: "2.0",
        method,
        params,
        id
      });
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timed out after 30 seconds`));
      }, 3e4);
      this.pendingRequests.set(id, { timeout, resolve: resolve2, reject });
      this.ws.send(message);
    });
  }
};

// src/runtime/server.tsx
var ServerContext = React5__namespace.createContext(null);
function ServerProvider({ wsUrl, children }) {
  const [client, setClient] = React5__namespace.useState(null);
  const [connectionStatus, setConnectionStatus] = React5__namespace.useState("connecting");
  React5__namespace.useEffect(() => {
    const ws = new WebSocket(wsUrl);
    setClient(new RpcClient(ws));
    const handleOpen = () => {
      setConnectionStatus("connected");
    };
    const handleClose = () => {
      setConnectionStatus("disconnected");
    };
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("close", handleClose);
    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("close", handleClose);
      ws.close();
    };
  }, [wsUrl]);
  const context = React5__namespace.useMemo(() => {
    return {
      connectionStatus,
      saveFile(name, file) {
        invariant__default.default(client, "client must be initialized");
        return client.call("saveFile", [name, file]);
      }
    };
  }, [client, connectionStatus]);
  return /* @__PURE__ */ React5__namespace.createElement(ServerContext.Provider, { value: context }, children);
}
function useServer() {
  const server = React5__namespace.useContext(ServerContext);
  invariant__default.default(server, "useServer must be used inside a ServerProvider");
  return server;
}
var DEFAULT_OPTIONS = {
  parser: "babel-ts",
  plugins: [parserBabel__default.default, parserEstree__default.default]
};
async function format2(code) {
  return prettier__namespace.format(code, DEFAULT_OPTIONS);
}

// src/shared/codeGeneration/utils.ts
function serializeObject(properties) {
  return `{${Object.entries(properties).map((entry) => entry.join(": ")).join(", ")}}`;
}
function serializeArray(items) {
  return `[${items.join(", ")}]`;
}
var Scope = class _Scope {
  constructor(parent) {
    this.parent = parent;
  }
  bindings = /* @__PURE__ */ new Set();
  generateUniqueName(base) {
    let i = 1;
    let suggestion = base;
    while (this.has(suggestion)) {
      suggestion = `${base}_${i}`;
      i += 1;
    }
    return suggestion;
  }
  allocate(name) {
    if (this.has(name)) {
      throw new Error(`Name ${name} is already allocated`);
    }
    if (!strings.isValidJsIdentifier(name)) {
      throw new Error(`Name ${name} is not a valid JS identifier`);
    }
    this.bindings.add(name);
  }
  allocateSuggestion(base = "_v") {
    const name = this.generateUniqueName(base);
    this.allocate(name);
    return name;
  }
  has(key) {
    if (key in this.bindings) {
      return true;
    }
    if (this.parent) {
      return this.parent.has(key);
    }
    return false;
  }
  fork() {
    return new _Scope(this);
  }
  isGlobal() {
    return !this.parent;
  }
};
var Imports = class {
  constructor(scope) {
    this.scope = scope;
    invariant__default.default(scope.isGlobal(), "Imports must be under a global scope");
  }
  imports = /* @__PURE__ */ new Map();
  addImport(id, importedName, localName) {
    this.scope.allocate(localName);
    let idImports = this.imports.get(id);
    if (!idImports) {
      idImports = /* @__PURE__ */ new Map();
      this.imports.set(id, idImports);
    }
    if (idImports.has(importedName)) {
      throw new Error(`Import ${importedName} already exists`);
    }
    idImports.set(importedName, localName);
  }
  useImport(id, importedName, localNameSuggestion = importedName) {
    let idImports = this.imports.get(id);
    if (!idImports) {
      idImports = /* @__PURE__ */ new Map();
      this.imports.set(id, idImports);
    }
    let localName = idImports.get(importedName);
    if (!localName) {
      localName = this.scope.generateUniqueName(localNameSuggestion);
      this.addImport(id, importedName, localName);
    }
    return localName;
  }
  print() {
    const importLines = [];
    for (const [id, idImports] of this.imports.entries()) {
      const namedImports = [];
      let defaultImport;
      for (const [importedName, localName] of idImports.entries()) {
        if (importedName === "*") {
          importLines.push(`import * as ${localName} from ${JSON.stringify(id)};`);
        } else if (importedName === "default") {
          defaultImport = importedName;
        } else if (importedName === localName) {
          namedImports.push(importedName);
        } else {
          namedImports.push(`${importedName} as ${localName}`);
        }
      }
      const specifiers = [];
      if (defaultImport) {
        specifiers.push(defaultImport);
      }
      if (namedImports.length > 0) {
        specifiers.push(`{ ${namedImports.join(", ")} }`);
      }
      if (specifiers.length > 0) {
        importLines.push(`import ${specifiers.join(", ")} from ${JSON.stringify(id)};`);
      }
    }
    return importLines.join("\n");
  }
  printDynamicImports() {
    const serializedEntries = Array.from(
      this.imports.keys(),
      (name) => serializeArray([JSON.stringify(name), `() => import(${JSON.stringify(name)})`])
    );
    return serializeArray(serializedEntries);
  }
};
function isValidFileNAme(base) {
  return /^[a-zA-Z][a-zA-Z0-9]*$/.test(base);
}
function getComponentNameFromInputFile(filePath) {
  const name = path__namespace.default.basename(filePath, ".yml");
  if (!isValidFileNAme(name)) {
    throw new Error(`Invalid file name ${JSON.stringify(name)}`);
  }
  return name;
}
function getOutputPathForInputFile(filePath, outDir = "/") {
  const ext = path__namespace.default.extname(filePath);
  const base = path__namespace.default.basename(filePath, ext);
  return path__namespace.default.join(outDir, path__namespace.default.dirname(filePath), base, "index.tsx");
}

// src/shared/codeGeneration/generateDataGridComponent.ts
async function generateDataGridComponent(filePath, file, options) {
  const name = getComponentNameFromInputFile(filePath);
  const globalScope = new Scope();
  const imports = new Imports(globalScope);
  imports.addImport("react", "*", "React");
  imports.addImport("@mui/x-data-grid-pro", "DataGridPro", "DataGridPro");
  imports.addImport("@mui/material", "Box", "Box");
  if (options.target !== "prod") {
    imports.addImport("@mui/toolpad-next/runtime", "*", "_runtime");
  }
  if (file.spec?.rows?.kind === "fetch") {
    globalScope.allocate("executeFetch");
  }
  globalScope.allocate("columns");
  globalScope.allocate("ErrorOverlay");
  globalScope.allocate("ErrorOverlayProps");
  const componentName = globalScope.allocateSuggestion(name);
  const componentPropsName = globalScope.allocateSuggestion(`${name}Props`);
  const { outDir = "/" } = options;
  const hasRowsProperty = (file.spec?.rows?.kind ?? "property") === "property";
  const columnDefs = file.spec?.columns?.map((column) => {
    const properties = {
      field: JSON.stringify(column.field)
    };
    if (column.type) {
      properties.type = JSON.stringify(column.type);
    }
    const defaultValueSelector = encode([column.field]);
    if (column.valueSelector && column.valueSelector !== defaultValueSelector) {
      properties.valueGetter = `({ row }) => ${toExpression(
        "row",
        column.valueSelector
      )}`;
    }
    return serializeObject(properties);
  }) || [];
  const code = `
    'use client';

    ${imports.print()}

    ${file.spec?.rows?.kind === "fetch" ? `
      async function executeFetch() {
        const response = await fetch(${JSON.stringify(file.spec.rows.url || "")}, { 
          method: ${JSON.stringify(file.spec.rows.method || "GET")} 
        });
      
        if (!response.ok) {
          throw new Error(\`Request failed with status \${response.status}\`);
        }
      
        const data = await response.json();

        const result = ${toExpression("data", file.spec.rows.selector || "")};

        ${options.target === "prod" ? "" : `_runtime.probes.update('fetch.rawData', data);`}

        return result
      }
    ` : ""}

    interface ErrorOverlayProps {
      error: Error;
    }

    function ErrorOverlay({ error }: ErrorOverlayProps) {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
          }}
        >
          {String(error.message || error)}
        </Box>
      )
    }

    class ErrorBoundary extends React.Component<{ children?: React.ReactNode }> {
      state: { error: Error | null } = { error: null };
    
      static getDerivedStateFromError(error: any) {
        return { error };
      }
    
      render() {
        return this.state.error ? (
          <ErrorOverlay error={this.state.error} />
        ) : (
          this.props.children
        );
      }
    }

    const columns = ${serializeArray(columnDefs)};

    export interface ${componentPropsName} {
      ${hasRowsProperty ? "rows: { id: string | number }[];" : ""}
    }

    function ${componentName}({ 
      ${!file.spec?.rows?.kind || file.spec?.rows?.kind === "property" ? "rows = [], loading = false, error" : ""}
    }: ${componentPropsName}) {

      ${file.spec?.rows?.kind === "fetch" ? `
              const [rows, setRows] = React.useState([]);
              const [error, setError] = React.useState()
              const [loading, setLoading] = React.useState(false)

              React.useEffect(() => {
                setLoading(true)
                executeFetch().then(setRows, setError).finally(() => setLoading(false));
              }, [])
            ` : ""}

      ${options.target === "prod" ? "" : `_runtime.probes.useProbeTarget('rows', rows);`}


      return (
        <Box sx={{ 
          position: 'relative', 
          width: '100%',
          ${file.spec?.heightMode === "container" ? 'height: "100%"' : ""}
          ${file.spec?.heightMode === "fixed" ? `height: ${file.spec?.height ?? 400}` : ""}
        }}>
          <ErrorBoundary>
            {error ? (
              <ErrorOverlay error={error} />
            ) : (
              <DataGridPro
                rows={rows}
                loading={loading}
                columns={columns}
                ${file.spec?.heightMode === "auto" ? "autoHeight" : ""}
                ${file.spec?.rowIdSelector ? `getRowId={(row) => ${toExpression(
    "row",
    file.spec.rowIdSelector || ""
  )}}` : ""}
              />
            )}
          </ErrorBoundary>
          ${options.target === "dev" ? `<_runtime.EditButton sx={{ position: 'absolute', bottom: 0, right: 0, mb: 2, mr: 2, zIndex: 1 }} />` : ""}
        </Box>
      )
    }

    ${componentName}.displayName = ${JSON.stringify(name)};

    export default ${options.target === "dev" ? `_runtime.withDevtool(${componentName}, ${serializeObject({
    filePath: JSON.stringify(filePath),
    file: JSON.stringify(file),
    wsUrl: JSON.stringify(options.wsUrl),
    dependencies: imports.printDynamicImports()
  })})` : componentName};
  `;
  const fileName = path__namespace.default.join(outDir, name, "index.tsx");
  const files = [[fileName, { code: await format2(code) }]];
  return { files };
}

// src/shared/codeGeneration/index.ts
async function generateComponent(filePath, file, config) {
  switch (file.kind) {
    case "DataGrid":
      return generateDataGridComponent(filePath, file, config);
    default:
      throw new Error(`No implementation yet for ${JSON.stringify(file.kind)}`);
  }
}
function ResizeHandle({ onResize, onCommitResize }) {
  const prevSize = React5__namespace.useRef(null);
  const [resizing, setResizing] = React5__namespace.useState(false);
  React5__namespace.useEffect(() => {
    const handleMouseMove = (event) => {
      if (prevSize.current !== null) {
        onResize?.(event.clientY - prevSize.current);
        prevSize.current = event.clientY;
      }
    };
    const handleMouseUp = (event) => {
      if (prevSize.current !== null) {
        onCommitResize?.(event.clientY - prevSize.current);
        prevSize.current = null;
      }
      setResizing(false);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onResize, onCommitResize]);
  return /* @__PURE__ */ React5__namespace.createElement(
    material.Box,
    {
      sx: {
        my: "-4px",
        width: "100%",
        height: "9px",
        cursor: "ns-resize",
        pointerEvents: "auto"
      },
      onMouseDown: (event) => {
        setResizing(true);
        prevSize.current = event.clientY;
      }
    },
    /* @__PURE__ */ React5__namespace.createElement(
      material.GlobalStyles,
      {
        styles: {
          body: resizing ? {
            userSelect: "none",
            cursor: "ns-resize",
            pointerEvents: "none"
          } : {}
        }
      }
    )
  );
}
function DevtoolHost({ children }) {
  const rootRef = React5__namespace.useRef(null);
  const [height, setHeight] = React5__namespace.useState(() => window.innerHeight / 2);
  const handleResize = (y) => {
    setHeight((prevHeight) => prevHeight - y);
  };
  return /* @__PURE__ */ React5__namespace.createElement(material.Portal, null, /* @__PURE__ */ React5__namespace.createElement(material.ThemeProvider, { theme: theme_default }, /* @__PURE__ */ React5__namespace.createElement(material.ScopedCssBaseline, null, /* @__PURE__ */ React5__namespace.createElement(
    material.Box,
    {
      ref: rootRef,
      className: "mui-fixed",
      sx: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height,
        borderTop: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        zIndex: 1
      }
    },
    /* @__PURE__ */ React5__namespace.createElement(material.GlobalStyles, { styles: { body: { marginBottom: `${height}px` } } }),
    /* @__PURE__ */ React5__namespace.createElement(ResizeHandle, { onResize: handleResize }),
    /* @__PURE__ */ React5__namespace.createElement(
      material.Box,
      {
        sx: {
          flex: 1,
          minHeight: 0,
          marginRight: "-1px",
          borderRight: 1,
          borderColor: "divider"
        }
      },
      children
    )
  ))));
}

// src/runtime/DevtoolOverlay.tsx
var CONNECTION_STATUS_DISPLAY = {
  connecting: { label: "Connecting", color: "info.main" },
  connected: { label: "Connected", color: "success.main" },
  disconnected: { label: "Disconnected", color: "error.main" }
};
function FileEditor({ commitButton, value, onChange, source }) {
  switch (value.kind) {
    case "DataGrid":
      return /* @__PURE__ */ React5__namespace.createElement(
        DataGridFileEditor,
        {
          value,
          onChange,
          source,
          commitButton
        }
      );
    default:
      return /* @__PURE__ */ React5__namespace.createElement(material.Typography, null, "Unknown file: ", value.kind);
  }
}
async function evaluate(files, entry, dependencies = /* @__PURE__ */ new Map()) {
  const cache = new Map(dependencies);
  const extensions = [".js", ".jsx", ".ts", ".tsx"];
  const resolveId = (importee, importer) => {
    if (importee.startsWith(".") || importee.startsWith("/")) {
      const resolved = path__namespace.resolve(path__namespace.dirname(importer), importee);
      if (files.has(resolved)) {
        return path__namespace.resolve(path__namespace.dirname(importer), importee);
      }
      for (const ext of extensions) {
        const resolvedWithExt = resolved + ext;
        if (files.has(resolvedWithExt)) {
          return resolvedWithExt;
        }
      }
    } else if (dependencies.has(importee)) {
      return importee;
    }
    throw new Error(`Could not resolve "${importee}" from "${importer}"`);
  };
  const createRequireFn = (importer) => (importee) => {
    const resolved = resolveId(importee, importer);
    const cached = cache.get(resolved);
    if (cached) {
      return cached.exports;
    }
    const mod = files.get(resolved);
    if (!mod) {
      throw new Error(`Can't find a module for "${importee}"`);
    }
    const compiled = sucrase__namespace.transform(mod.code, {
      transforms: ["imports", "typescript", "jsx"]
    });
    const fn = new Function("module", "exports", "require", compiled.code);
    const exportsObj = {};
    const moduleObj = { exports: exportsObj };
    const requireFn = createRequireFn(resolved);
    fn(moduleObj, exportsObj, requireFn);
    cache.set(resolved, moduleObj);
    return moduleObj.exports;
  };
  const requireEntry = createRequireFn("/");
  return requireEntry(entry);
}
function DevtoolOverlay({
  filePath,
  file,
  onComponentUpdate,
  onClose,
  onCommitted,
  dependencies
}) {
  const rootRef = React5__namespace.useRef(null);
  const name = getComponentNameFromInputFile(filePath);
  const [inputValue, setInputValue] = React5__namespace.useState(file);
  const { connectionStatus } = useServer();
  const [source, setSource] = React5__namespace.useState(void 0);
  React5__namespace.useEffect(() => {
    const outDir = "/";
    generateComponent(filePath, inputValue, { target: "prod", outDir }).then((result) => {
      setSource(result);
    }).catch((error) => {
      console.error(error);
      setSource(void 0);
    });
  }, [inputValue, filePath, dependencies, onComponentUpdate]);
  React5__namespace.useEffect(() => {
    const outDir = "/";
    generateComponent(filePath, inputValue, { target: "preview", outDir }).then(async (result) => {
      const resolvedDependencies = await Promise.all(
        dependencies.map(
          async ([k, v]) => [k, { exports: await v() }]
        )
      );
      const outputPath = getOutputPathForInputFile(filePath, outDir);
      const moduleExports = await evaluate(
        new Map(result.files),
        outputPath,
        new Map(resolvedDependencies)
      );
      const NewComponent = moduleExports?.default;
      invariant__default.default(
        typeof NewComponent === "function",
        `Compilation must result in a function as default export`
      );
      onComponentUpdate?.(NewComponent);
    }).catch((error) => {
      console.error(error);
    });
  }, [inputValue, filePath, dependencies, onComponentUpdate]);
  const server = useServer();
  const commitButton = /* @__PURE__ */ React5__namespace.createElement(material.Tooltip, { title: "Commit changes" }, /* @__PURE__ */ React5__namespace.createElement(
    material.IconButton,
    {
      sx: { m: 0.5 },
      onClick: () => {
        server.saveFile(name, inputValue).then(() => onCommitted?.());
      }
    },
    /* @__PURE__ */ React5__namespace.createElement(SaveIcon__default.default, null)
  ));
  return /* @__PURE__ */ React5__namespace.createElement(material.ThemeProvider, { theme: theme_default }, /* @__PURE__ */ React5__namespace.createElement(DevtoolHost, null, /* @__PURE__ */ React5__namespace.createElement(
    material.Box,
    {
      ref: rootRef,
      sx: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      }
    },
    /* @__PURE__ */ React5__namespace.createElement(
      material.Box,
      {
        sx: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
          pl: 2
        }
      },
      /* @__PURE__ */ React5__namespace.createElement(material.Typography, null, name, " (", file.kind, ")"),
      /* @__PURE__ */ React5__namespace.createElement(
        material.Box,
        {
          sx: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1
          }
        },
        /* @__PURE__ */ React5__namespace.createElement(
          material.Box,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              minWidth: 190,
              gap: 1
            }
          },
          /* @__PURE__ */ React5__namespace.createElement(material.Typography, null, "Status:"),
          /* @__PURE__ */ React5__namespace.createElement(
            material.Box,
            {
              sx: {
                display: "inline-block",
                borderRadius: "50%",
                width: 16,
                height: 16,
                backgroundColor: CONNECTION_STATUS_DISPLAY[connectionStatus].color
              }
            }
          ),
          /* @__PURE__ */ React5__namespace.createElement(material.Typography, null, CONNECTION_STATUS_DISPLAY[connectionStatus].label)
        ),
        /* @__PURE__ */ React5__namespace.createElement(material.IconButton, { size: "small", onClick: onClose }, /* @__PURE__ */ React5__namespace.createElement(CloseIcon__default.default, { fontSize: "inherit" }))
      )
    ),
    /* @__PURE__ */ React5__namespace.createElement(material.Box, { sx: { flex: 1, overflow: "hidden", position: "relative" } }, connectionStatus === "connected" ? /* @__PURE__ */ React5__namespace.createElement(
      FileEditor,
      {
        value: inputValue,
        onChange: setInputValue,
        source,
        commitButton
      }
    ) : /* @__PURE__ */ React5__namespace.createElement(
      material.Box,
      {
        sx: {
          position: "absolute",
          inset: "0 0 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          gap: 1
        }
      },
      connectionStatus === "disconnected" ? /* @__PURE__ */ React5__namespace.createElement(React5__namespace.Fragment, null, /* @__PURE__ */ React5__namespace.createElement(ErrorOutlineIcon__default.default, { color: "error" }), "Connection lost") : /* @__PURE__ */ React5__namespace.createElement(material.CircularProgress, null)
    ))
  )));
}
var CurrentComponentContext = React5__namespace.createContext(null);

// src/runtime/index.tsx
function useCurrentlyEditedComponentId() {
  const [currentEditedComponentId, setCurrentlyEditedComponentId] = useStorageState__default.default(
    "session",
    "currently-edited-component-id",
    null
  );
  const handleEditedComponentIdChange = React5__namespace.useCallback(
    (value) => {
      reset();
      setCurrentlyEditedComponentId(value);
    },
    [setCurrentlyEditedComponentId]
  );
  return [currentEditedComponentId, handleEditedComponentIdChange];
}
var nextId = 1;
function EditButton(props) {
  const [currentEditedComponentId, setCurrentlyEditedComponentId] = useCurrentlyEditedComponentId();
  const componentInfo = React5__namespace.useContext(CurrentComponentContext);
  invariant__default.default(componentInfo, `EditButton must be used inside a Component`);
  if (currentEditedComponentId === componentInfo.id) {
    return null;
  }
  return /* @__PURE__ */ React5__namespace.createElement(
    material.Button,
    {
      ...props,
      variant: "contained",
      color: "secondary",
      onClick: () => setCurrentlyEditedComponentId(componentInfo.id),
      startIcon: /* @__PURE__ */ React5__namespace.createElement(EditIcon__default.default, null)
    },
    "Edit"
  );
}
function withDevtool(Component, { filePath, file, wsUrl, dependencies }) {
  const name = getComponentNameFromInputFile(filePath);
  return function ComponentWithDevtool(props) {
    const [currentlyEditedComponentId, setCurrentlyEditedComponentId] = useCurrentlyEditedComponentId();
    const [id] = React5__namespace.useState(() => {
      const newId = `component-${nextId}`;
      nextId += 1;
      return newId;
    });
    const editing = currentlyEditedComponentId === id;
    const componentInfo = React5__namespace.useMemo(() => {
      return { id, name, file, props };
    }, [id, props]);
    const [RenderedComponent, setRenderedComponent] = React5__namespace.useState(
      () => Component
    );
    const handleComponentUpdate = React5__namespace.useCallback((NewComponent) => {
      setRenderedComponent(() => NewComponent);
    }, []);
    React5__namespace.useEffect(() => {
      if (!editing) {
        setRenderedComponent(() => Component);
      }
    }, [editing]);
    return /* @__PURE__ */ React5__namespace.createElement(CurrentComponentContext.Provider, { value: componentInfo }, editing ? /* @__PURE__ */ React5__namespace.createElement(ServerProvider, { wsUrl }, /* @__PURE__ */ React5__namespace.createElement(
      material.Box,
      {
        sx: {
          display: "contents",
          "> *": {
            outlineColor: (theme) => theme.palette.secondary.main,
            outlineStyle: "solid",
            outlineWidth: 2
          }
        }
      },
      /* @__PURE__ */ React5__namespace.createElement(RenderedComponent, { ...props })
    ), /* @__PURE__ */ React5__namespace.createElement(
      DevtoolOverlay,
      {
        filePath,
        file,
        dependencies,
        onClose: () => {
          setCurrentlyEditedComponentId(null);
        },
        onCommitted: () => {
          setCurrentlyEditedComponentId(null);
        },
        onComponentUpdate: handleComponentUpdate
      }
    )) : /* @__PURE__ */ React5__namespace.createElement(RenderedComponent, { ...props }));
  };
}

exports.EditButton = EditButton;
exports.probes = probes_exports;
exports.withDevtool = withDevtool;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map