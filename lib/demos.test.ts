import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { showcaseDemos } from './cinematic';
import { demoNote as hvacNote, nav as hvacNav } from './complete-hvac-data';
import { demoNote as bistroNote, nav as bistroNav } from './ridge-bistro-data';
import { demoNote as plumbingNote, nav as plumbingNav } from './starter-plumbing-data';

const root = process.cwd();
const examplesDir = path.join(root, 'app', 'examples');

function walkPages(dir: string, found: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkPages(full, found);
    else if (entry.name === 'page.tsx') found.push(full);
  }
  return found;
}

function toRoute(file: string): string {
  const rel = path.relative(path.join(root, 'app'), file).split(path.sep).join('/');
  return `/${rel.replace(/\/page\.tsx$/, '')}`;
}

const pageFiles = walkPages(examplesDir);
const routes = new Set(pageFiles.map(toRoute));

function countPages(slug: string): number {
  return pageFiles.filter((file) => file.split(path.sep).includes(slug)).length;
}

describe('showcase demo routes', () => {
  it('gives each demo the promised page count', () => {
    expect(countPages('starter-plumbing')).toBe(1);
    expect(countPages('complete-hvac')).toBe(5);
    expect(countPages('premium-restaurant')).toBe(7);
  });

  it('points every demo nav link at a real route', () => {
    for (const item of [...plumbingNav, ...hvacNav, ...bistroNav]) {
      const href = item.href.split('#')[0];
      expect(routes.has(href), href).toBe(true);
    }
  });

  it('labels the home-page cards 1, 5, and 7 pages', () => {
    expect(showcaseDemos.map((demo) => demo.pages)).toEqual(['1 Page', '5 Pages', '7 Pages']);
  });
});

describe('showcase demo facts', () => {
  const dataFiles = [
    'lib/starter-plumbing-data.ts',
    'lib/complete-hvac-data.ts',
    'lib/ridge-bistro-data.ts',
  ];
  const cssFiles = [
    'app/examples/starter-plumbing/starter-plumbing.css',
    'app/examples/complete-hvac/complete-hvac.css',
    'app/examples/premium-restaurant/ridge-bistro.css',
  ];

  it('keeps every phone on the fictional 555 exchange', () => {
    for (const file of dataFiles) {
      const source = fs.readFileSync(path.join(root, file), 'utf8');
      const displays = source.match(/\(\d{3}\) \d{3}-\d{4}/g) ?? [];
      const tels = source.match(/tel:[^'"]+/g) ?? [];
      expect(displays.length).toBeGreaterThan(0);
      expect(tels.length).toBeGreaterThan(0);
      for (const display of displays) expect(display).toMatch(/^\(304\) 555-\d{4}$/);
      for (const tel of tels) expect(tel).toMatch(/^tel:\+1304555\d{4}$/);
    }
  });

  it('uses the same honest demo line in each data file', () => {
    const line = 'Demo site by Veteran AI Websites. Business, reviews and photos are samples.';
    expect(plumbingNote).toBe(line);
    expect(hvacNote).toBe(line);
    expect(bistroNote).toBe(line);
  });

  it('keeps decorative grids and glass out of the demo CSS', () => {
    for (const file of cssFiles) {
      const css = fs.readFileSync(path.join(root, file), 'utf8');
      expect(css).not.toContain('backdrop-filter');
      expect(css).not.toContain('repeating-linear-gradient(');
      const gradients = css.match(/linear-gradient\([\s\S]*?\)/g) ?? [];
      for (const gradient of gradients) expect(gradient).not.toContain('1px');
    }
  });
});
