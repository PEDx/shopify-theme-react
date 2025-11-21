import { build as viteBuild, defineConfig, mergeConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import type { UserConfig } from 'vite';
import { basename, extname, join } from 'path';
import type { Rollup } from 'vite';
import { createRequire } from 'module';
import { Script } from 'vm';
import { build_log, generate_release_liquid, get_liquid_comment, generate_build_banner, get_comment } from './utils.ts';
import { renderStaticApp } from './serverRenderer.ts';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const REACT_APP_FILENAME_PREFIX = 'react';
export const ENTRY_FILE_NAME = 'main.tsx';
export const OUTPUT_DIR = 'dist';

const get_build_config = (app_dir: string) => {
  const common_build_config = defineConfig({
    mode: 'production',
    plugins: [],
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        input: join(app_dir, ENTRY_FILE_NAME),
        external: ['react', 'react-dom', 'react-dom/client'],
      },
    },
  });

  const server_side_build_config = mergeConfig<UserConfig, UserConfig>(common_build_config, {
    build: {
      ssr: join(app_dir, ENTRY_FILE_NAME),
      ssrEmitAssets: false,
      minify: false,
      rollupOptions: {
        output: {
          format: 'commonjs',
          exports: 'named',
        },
      },
      write: false,
    },
  });

  const client_side_build_config = mergeConfig<UserConfig, UserConfig>(common_build_config, {
    plugins: [tailwindcss()],
    build: {
      ssrManifest: true,
      rollupOptions: {
        output: {
          format: 'umd',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-dom/client': 'ReactDOMClient',
          },
          entryFileNames: '[name].js',
        },
      },
      write: false,
    },
  });

  return {
    common_build_config,
    server_side_build_config,
    client_side_build_config,
  };
};

export const build = async (app_dir: string) => {
  const app_name = basename(app_dir);

  const { client_side_build_config, server_side_build_config } = get_build_config(app_dir);

  build_log('Building client-side bundle...');
  const client_side_bundle = (await viteBuild(client_side_build_config)) as Rollup.RollupOutput;

  const client_side_bundle_chunk_output = client_side_bundle.output.find((output) => output.type === 'chunk');

  const client_side_bundle_style_output = client_side_bundle.output.find(
    (output) => output.type === 'asset' && extname(output.fileName) === '.css',
  ) as Rollup.OutputAsset;

  const client_script = client_side_bundle_chunk_output?.code;
  const client_style = client_side_bundle_style_output?.source;

  build_log('Building server-side bundle...');
  const server_side_bundle = (await viteBuild(server_side_build_config)) as Rollup.RollupOutput;
  const server_side_build_chunk_output = server_side_bundle.output.find((output) => output.type === 'chunk');

  if (!server_side_build_chunk_output) return;
  global.require = createRequire(import.meta.url); // commonjs import for server side

  global.exports = {}; // custom exports for server side

  const script = new Script(`(() => {${server_side_build_chunk_output.code}return exports;})()`);
  const app: {
    default: {
      app: React.ReactNode;
      schema: Record<string, any>;
    };
  } = script.runInThisContext({ displayErrors: true });
  const html = await renderStaticApp(app.default.app);
  console.log(html);

  build_log('Build completed');

  const script_name = `${REACT_APP_FILENAME_PREFIX}-${app_name}.js`;
  const style_name = `${REACT_APP_FILENAME_PREFIX}-${app_name}.css`;
  const liquid_name = `${REACT_APP_FILENAME_PREFIX}-${app_name}.liquid`;

  const output_dir = join(app_dir, OUTPUT_DIR);
  if (!existsSync(output_dir)) {
    mkdirSync(output_dir, { recursive: true });
  }

  const banner = generate_build_banner();
  const build_banner = get_comment(banner);
  const liquid_comment = get_liquid_comment(banner);

  const script_file_name = join(output_dir, script_name);
  const style_file_name = join(output_dir, style_name);
  const liquid_file_name = join(output_dir, liquid_name);
  const schema = JSON.stringify(app.default.schema || {});

  const liquid_content = generate_release_liquid({ html, script_name, style_name, schema });

  writeFileSync(script_file_name, build_banner.concat(client_script as string));
  writeFileSync(style_file_name, build_banner.concat(client_style as string));
  writeFileSync(liquid_file_name, liquid_comment.concat(liquid_content));
};

build('src/project/sections/example');
