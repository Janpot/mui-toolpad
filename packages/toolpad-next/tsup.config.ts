import { defineConfig } from 'tsup';
import * as fs from 'fs/promises';
import path from 'path';
import type * as esbuild from 'esbuild';

function cleanFolderOnFailure(folder: string): esbuild.Plugin {
  return {
    name: 'clean-dist-on-failure',
    setup(build) {
      build.onEnd(async (result) => {
        if (result.errors.length > 0) {
          await fs.rm(folder, { recursive: true, force: true });
        }
      });
    },
  };
}

export default defineConfig([
  {
    entry: ['./src/cli/index.ts', './src/cli/prepare.ts'],
    outDir: 'dist/cli',
    silent: true,
    format: ['esm'],
    sourcemap: true,
    dts: false,
    esbuildPlugins: [cleanFolderOnFailure(path.resolve(__dirname, './dist/cli'))],
    async onSuccess() {
      // eslint-disable-next-line no-console
      console.log('cli: build successful');
    },
  },
  {
    entry: ['./src/runtime/index.tsx'],
    outDir: 'dist/runtime',
    silent: true,
    format: ['esm'],
    sourcemap: true,
    external: ['react', 'react-dom'],
    dts: true,
    esbuildPlugins: [cleanFolderOnFailure(path.resolve(__dirname, './dist/runtime'))],
    async onSuccess() {
      // eslint-disable-next-line no-console
      console.log('runtime: build successful');
    },
  },
]);
