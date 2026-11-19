import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
const steps = [
  ['node_modules/astro/bin/astro.mjs', ['build'], root],
  ['scripts/prepare-next.mjs', [], root],
  ['variants/next/node_modules/hexo/bin/hexo', ['generate', '--silent', '--config', '_config.yml,_config.tags.yml'], path.join(root, 'variants/next')],
  ['node_modules/pagefind/lib/runner/bin.cjs', ['--site', 'dist'], root],
];
for (const [script, args, cwd] of steps) {
  const result = spawnSync(process.execPath, [path.resolve(root, script), ...args], { cwd, stdio: 'inherit', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
  if (result.status !== 0) process.exit(result.status || 1);
}
