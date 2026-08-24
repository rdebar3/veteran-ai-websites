import { describe, expect, it } from 'vitest';
import {
  demoHttpStatus,
  isPreviewFlag,
  resolveDemoView,
} from './decision';
import { demoRow, NOW } from './fixtures';

describe('demo four-state render matrix', () => {
  it('live + unexpired → render (200)', () => {
    const kind = resolveDemoView(demoRow({ status: 'live' }), {
      preview: false,
      now: NOW,
    });
    expect(kind).toBe('render');
    expect(demoHttpStatus(kind)).toBe(200);
  });

  it('draft without preview → 404', () => {
    const kind = resolveDemoView(demoRow({ status: 'draft' }), {
      preview: false,
      now: NOW,
    });
    expect(kind).toBe('not_found');
    expect(demoHttpStatus(kind)).toBe(404);
  });

  it('draft with ?preview=1 → render', () => {
    expect(isPreviewFlag('1')).toBe(true);
    expect(isPreviewFlag('true')).toBe(false);
    const kind = resolveDemoView(demoRow({ status: 'draft' }), {
      preview: isPreviewFlag('1'),
      now: NOW,
    });
    expect(kind).toBe('render');
    expect(demoHttpStatus(kind)).toBe(200);
  });

  it('expired status → expired page (200)', () => {
    const kind = resolveDemoView(demoRow({ status: 'expired' }), {
      preview: false,
      now: NOW,
    });
    expect(kind).toBe('expired');
    expect(demoHttpStatus(kind)).toBe(200);
  });

  it('missing slug → 404', () => {
    const kind = resolveDemoView(null, { preview: false, now: NOW });
    expect(kind).toBe('not_found');
    expect(demoHttpStatus(kind)).toBe(404);
  });

  it('live past expires_at → expired page', () => {
    const kind = resolveDemoView(
      demoRow({
        status: 'live',
        expires_at: '2026-08-01T00:00:00.000Z',
      }),
      { preview: false, now: NOW },
    );
    expect(kind).toBe('expired');
  });

  it('killed → 404', () => {
    const kind = resolveDemoView(demoRow({ status: 'killed' }), {
      preview: false,
      now: NOW,
    });
    expect(kind).toBe('not_found');
  });
});
