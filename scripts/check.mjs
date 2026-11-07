/*
   ==================================================================
   ==   @ Halyt                                                    ==
   ==   @ author: Mai Quoc Viet                                    ==
   ==   @ project: halyt-team                                      ==
   ==   @ copyright: (c) 2026 Halyt. All rights reserved.          ==
   ==================================================================
*/
/**
 * Checks the profile README.md before pushing: image URLs map to files in this
 * repo, SVGs are well formed and self-contained, links answer, house style holds.
 * Usage: node scripts/check.mjs [--offline] [--preview]
 *   --offline  skip the network link checks
 *   --preview  also render light/dark previews through GitHub's markdown API
 *              into preview/ (HTML, plus PNG when Microsoft Edge is installed)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const README = join(ROOT, 'README.md');
const ASSETS = join(ROOT, 'assets');
const RAW = 'https://raw.githubusercontent.com/halyt-team/halyt-team/main/';
const SOFT_HOSTS = ['facebook.com', 'instagram.com', 'tiktok.com', 'youtube.com'];
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const args = new Set(process.argv.slice(2));
const errors = [];
const warnings = [];
const ok = (msg) => console.log(`  ok    ${msg}`);

/** Return every http(s) URL referenced by the README, de-duplicated. */
function collectUrls(text) {
  const found = text.match(/https?:\/\/[^\s"'<>)]+/g) ?? [];
  return [...new Set(found)];
}

/** Return null when the XML tags balance, otherwise a description of the first problem. */
function xmlProblem(svg) {
  const body = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/<\?[\s\S]*?\?>/g, '');
  const stack = [];
  for (const [, close, name, rest] of body.matchAll(/<(\/?)([A-Za-z][\w:-]*)([^>]*)>/g)) {
    if (rest.trimEnd().endsWith('/')) continue;
    if (!close) stack.push(name);
    else if (stack.pop() !== name) return `unexpected </${name}>`;
  }
  return stack.length ? `unclosed <${stack.at(-1)}>` : null;
}

/** Check that each raw.githubusercontent URL points at a file in this repo. */
function checkAssetUrls(urls) {
  for (const url of urls.filter((u) => u.startsWith('https://raw.githubusercontent.com/'))) {
    if (!url.startsWith(RAW)) {
      errors.push(`image URL is not on halyt-team/halyt-team@main: ${url}`);
      continue;
    }
    const local = join(ROOT, url.slice(RAW.length));
    if (existsSync(local)) ok(`image ${url.slice(RAW.length)}`);
    else errors.push(`image URL has no file in the repo: ${url}`);
  }
}

/** Check every SVG in assets/ is well formed and loads nothing from outside. */
function checkSvgs() {
  for (const name of readdirSync(ASSETS).filter((f) => f.endsWith('.svg'))) {
    const svg = readFileSync(join(ASSETS, name), 'utf8');
    const problem = xmlProblem(svg);
    if (problem) errors.push(`${name}: ${problem}`);
    else if (!/<svg[^>]*viewBox=/.test(svg)) errors.push(`${name}: <svg> has no viewBox`);
    else if (/(?:xlink:)?href="https?:|@import|url\(https?:/.test(svg))
      errors.push(`${name}: loads an external resource, which GitHub blocks inside <img>`);
    else ok(`svg ${name}`);
  }
}

/** Check house-style rules on the README text itself. */
function checkStyle(text) {
  if (text.includes('\u2014')) errors.push('README uses the long dash "\u2014"; write "-" instead');
  else ok('no long dashes');
  const pictures = text.match(/<picture>[\s\S]*?<\/picture>/g) ?? [];
  for (const p of pictures) {
    if (!/prefers-color-scheme: dark/.test(p) || !/<img [^>]*alt="[^"]+"/.test(p))
      errors.push('a <picture> lacks its dark <source> or an <img alt="...">');
  }
  if (pictures.length) ok(`${pictures.length} <picture> blocks with dark source and alt text`);
}

/** Fetch one URL and return its HTTP status, or 0 when unreachable. */
async function status(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (halyt-team profile link check)' },
        signal: AbortSignal.timeout(15000),
      });
      if (res.status < 400 || method === 'GET') return res.status;
    } catch {
      if (method === 'GET') return 0;
    }
  }
  return 0;
}

/** Check that the README's outbound links answer; social sites only warn. */
async function checkLinks(urls) {
  const targets = urls.filter((u) => !u.startsWith(RAW));
  const results = await Promise.all(targets.map(async (u) => [u, await status(u)]));
  for (const [url, code] of results) {
    if (code >= 200 && code < 400) ok(`${code} ${url}`);
    else if (SOFT_HOSTS.some((h) => new URL(url).hostname.endsWith(h)))
      warnings.push(`${code || 'no answer'} ${url} (social sites often block scripts; open it by hand)`);
    else errors.push(`${code || 'no answer'} ${url}`);
  }
}

/** Render the README with GitHub's markdown API into light/dark preview pages. */
async function preview(text) {
  const res = await fetch('https://api.github.com/markdown', {
    method: 'POST',
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'halyt-team-preview' },
    body: JSON.stringify({ mode: 'gfm', text }),
  });
  if (!res.ok) {
    errors.push(`GitHub markdown API answered ${res.status}`);
    return;
  }
  const html = await res.text();
  const dataUri = (file) =>
    `data:image/svg+xml;base64,${readFileSync(join(ASSETS, file)).toString('base64')}`;
  const out = join(ROOT, 'preview');
  mkdirSync(out, { recursive: true });
  for (const theme of ['light', 'dark']) {
    const body = html.replace(/https:\/\/raw\.githubusercontent\.com\/halyt-team\/halyt-team\/main\/assets\/([\w-]+)-(light|dark)\.svg/g,
      (_, name) => dataUri(`${name}-${theme}.svg`));
    const bg = theme === 'dark' ? '#0d1117' : '#ffffff';
    const page = `<!doctype html><html><head><meta charset="utf-8"><title>Profile preview (${theme})</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-${theme}.min.css">
<style>body{margin:0;background:${bg}}.markdown-body{box-sizing:border-box;max-width:896px;padding:32px;margin:0 auto}</style>
</head><body><article class="markdown-body">${body}</article></body></html>`;
    const file = join(out, `${theme}.html`);
    writeFileSync(file, page);
    ok(`preview/${theme}.html`);
    if (existsSync(EDGE)) {
      const png = join(out, `${theme}.png`);
      try {
        execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=896,2000',
          `--screenshot=${png}`, pathToFileURL(file).href], { stdio: 'ignore', timeout: 60000 });
        ok(`preview/${theme}.png`);
      } catch {
        warnings.push(`could not screenshot preview/${theme}.html with Edge`);
      }
    }
  }
}

const text = readFileSync(README, 'utf8');
const urls = collectUrls(text);
console.log('Images and SVGs');
checkAssetUrls(urls);
checkSvgs();
console.log('House style');
checkStyle(text);
if (!args.has('--offline')) {
  console.log('Links');
  await checkLinks(urls);
}
if (args.has('--preview')) {
  console.log('Preview');
  await preview(text);
}

for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  FAIL  ${e}`);
console.log(errors.length ? `\n${errors.length} problem(s).` : `\nAll checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
process.exit(errors.length ? 1 : 0);
