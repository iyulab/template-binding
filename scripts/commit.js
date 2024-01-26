import fs from 'fs';
import { execSync } from 'child_process';

const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const version = packageJson.version;

execSync(`git add . && git commit -m "update: version ${version}" && git pull && git push`, { stdio: 'inherit' });