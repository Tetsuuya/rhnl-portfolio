import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

async function prerender() {
  const templatePath = toAbsolute('dist/index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found! Ensure client build runs first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const serverEntryPath = toAbsolute('dist/server/entry-server.js');

  if (!fs.existsSync(serverEntryPath)) {
    console.error('dist/server/entry-server.js not found! Ensure SSR build runs.');
    process.exit(1);
  }

  try {
    const { render } = await import(pathToFileURL(serverEntryPath).href);
    const { html: appHtml } = render();

    const finalHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    fs.writeFileSync(templatePath, finalHtml);
    console.log('✅ SSG Pre-rendering complete! Static HTML generated in dist/index.html');

    // Clean up temporary server bundle
    const serverDir = toAbsolute('dist/server');
    if (fs.existsSync(serverDir)) {
      fs.rmSync(serverDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error('Error during SSG pre-rendering:', err);
    process.exit(1);
  }
}

prerender();
