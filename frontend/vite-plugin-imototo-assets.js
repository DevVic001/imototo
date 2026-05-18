import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const virtualId = 'virtual:imototo-assets';
const resolvedId = '\0' + virtualId;

function listImages(publicAssets, subfolder) {
  const dir = resolve(publicAssets, subfolder);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name) && !name.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((name) => `/assets/${subfolder}/${name}`);
}

function scan(publicDir) {
  const publicAssets = resolve(publicDir, 'assets');
  return {
    images: listImages(publicAssets, 'images'),
    fliers: listImages(publicAssets, 'fliers'),
  };
}

/** Discovers JPG/PNG in public/assets/images and public/assets/fliers at dev/build time */
export function imototoAssetsPlugin() {
  const publicDir = resolve(process.cwd(), 'public');
  let cached = scan(publicDir);

  return {
    name: 'imototo-assets',
    configureServer(server) {
      server.watcher.add(resolve(publicDir, 'assets/images'));
      server.watcher.add(resolve(publicDir, 'assets/fliers'));
      const refresh = () => {
        cached = scan(publicDir);
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    },
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) {
        cached = scan(publicDir);
        return `export default ${JSON.stringify(cached)}`;
      }
    },
  };
}
