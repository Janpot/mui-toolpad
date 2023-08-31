import * as React from 'react';
import jsonToTs from 'json-to-ts';
import { Skeleton, styled, SxProps } from '@mui/material';
import { ScopeMeta } from '@mui/toolpad-core';
import * as monaco from 'monaco-editor';
import { truncate } from '@mui/toolpad-utils/strings';
import { WithControlledProp } from '../../../utils/types';
import lazyComponent from '../../../utils/lazyComponent';
import ElementContext from '../ElementContext';

const TypescriptEditor = lazyComponent(() => import('../../../components/TypescriptEditor'), {
  noSsr: true,
  fallback: <Skeleton variant="rectangular" height="100%" />,
});

const JsExpressionEditorRoot = styled('div')(({ theme }) => ({
  height: 150,
  border: `1px solid ${theme.palette.divider}`,
}));

export interface JsExpressionEditorProps extends WithControlledProp<string> {
  globalScope: Record<string, unknown>;
  globalScopeMeta: ScopeMeta;
  disabled?: boolean;
  autoFocus?: boolean;
  functionBody?: boolean;
  topLevelAwait?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  sx?: SxProps;
}

export function JsExpressionEditor({
  value,
  onChange,
  globalScope,
  globalScopeMeta,
  disabled,
  autoFocus,
  functionBody,
  topLevelAwait,
  onFocus,
  onBlur,
  sx,
}: JsExpressionEditorProps) {
  const element = React.useContext(ElementContext);

  const nodeName = element?.name;

  const extraLibs = React.useMemo(() => {
    const generatedTypes = jsonToTs(globalScope);

    const globalDeclarations = Object.keys(globalScope).map((key) => {
      const metaData = globalScopeMeta[key];

      const overrides: Record<string, string> = {};

      if (metaData?.kind === 'element') {
        const { props } = metaData;
        if (props) {
          for (const [prop, meta] of Object.entries(props)) {
            if (meta.tsType) {
              overrides[prop] = meta.tsType;
            }
          }
        }
      }

      const commentLines: string[] = [];

      if (metaData?.description) {
        commentLines.push(metaData.description);
      }

      if (typeof metaData?.deprecated === 'boolean') {
        commentLines.push('@deprecated');
      } else if (typeof metaData?.deprecated === 'string') {
        commentLines.push(`@deprecated ${metaData.deprecated}`);
      }

      const comment =
        commentLines.length > 0 ? ['/**', ...commentLines.map((line) => ` * ${line}`), ' */'] : [];

      const overridesType = `{ 
        ${Object.entries(overrides)
          .map(([propKey, propValue]) => {
            return `${propKey}: ${propValue.replaceAll(
              /\bThisComponent\b/g,
              () => `RootObject[${JSON.stringify(key)}]`,
            )}`;
          })
          .join('\n')} 
      }`;

      const globalType =
        typeof metaData?.tsType === 'string'
          ? metaData.tsType
          : `OverrideProps<RootObject[${JSON.stringify(key)}], ${overridesType}>;`;

      const declaration = `declare const ${key}: Expand<${globalType}>`;
      return [...comment, declaration].join('\n');
    });

    const content = `
      type OverrideProps<T, S extends Partial<Record<keyof T, unknown>>> = {
        [K in keyof T]:  S extends { [M in K]: any } ? S[K] : T[K]
      }

      // Pretty-print types on hover:
      // See https://github.com/microsoft/vscode/issues/94679#issuecomment-755194161
      type Expand<T> = T extends infer O ? { [K in keyof O]: Expand<O[K]> } : never;
      
      ${generatedTypes.join('\n')}

      ${globalDeclarations.join('\n')}

      ${nodeName ? `type ThisComponent = typeof ${nodeName}` : ''}
    `;

    return [{ content, filePath: 'global.d.ts' }];
  }, [globalScope, globalScopeMeta, nodeName]);

  const completionProvider = React.useMemo<monaco.languages.CompletionItemProvider>(() => {
    return {
      provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = Object.entries(globalScope).flatMap(
          ([globalVariable, globalObject]) => {
            if (typeof globalObject !== 'object' || !globalObject) {
              return [];
            }

            return Object.entries(globalObject).map(([property, propValue]) => {
              return {
                label: `${globalVariable}.${property}`,
                detail: truncate(JSON.stringify(propValue) || 'undefined', 40),
                insertText: `${globalVariable}.${property}`,
                kind: monaco.languages.CompletionItemKind.Variable,
                documentation: '',
                // To give it precedence over other default typescript completions:
                sortText: `\0\0${globalVariable}.${property}`,
                range,
              } satisfies monaco.languages.CompletionItem;
            });
          },
        );

        return {
          suggestions,
        };
      },
    };
  }, [globalScope]);

  return (
    <JsExpressionEditorRoot sx={sx}>
      <TypescriptEditor
        value={value}
        onChange={(code = '') => onChange(code)}
        disabled={disabled}
        extraLibs={extraLibs}
        functionBody={functionBody}
        topLevelAwait={topLevelAwait}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        completionProvider={completionProvider}
      />
    </JsExpressionEditorRoot>
  );
}
