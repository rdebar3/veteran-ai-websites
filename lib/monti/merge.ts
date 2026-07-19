import type { MontiPatch, MontiRecord } from './types';
import { emptyRecord } from './contract';

/** Deep-merge a validated patch into a working §3 record. Arrays replace when provided. */
export function deepMergeRecord(
  base: MontiRecord | null | undefined,
  patch: MontiPatch | null | undefined,
): MontiRecord {
  const out: MontiRecord = structuredClone(base ?? emptyRecord());
  if (!patch || typeof patch !== 'object') return out;

  if (patch.template_id === 'trades' || patch.template_id === null) {
    out.template_id = patch.template_id;
  }
  if (patch.palette === 'ember' || patch.palette === 'timber') {
    out.palette = patch.palette;
  }
  if (
    patch.copy_tone === 'grounded' ||
    patch.copy_tone === 'warm' ||
    patch.copy_tone === 'adventurous'
  ) {
    out.copy_tone = patch.copy_tone;
  }
  if (patch.trade_key !== undefined) {
    out.trade_key = patch.trade_key;
  }

  if (patch.business && typeof patch.business === 'object') {
    const b = patch.business;
    if (typeof b.name === 'string') out.business.name = b.name;
    if (typeof b.phone === 'string') out.business.phone = b.phone;
    if (typeof b.service_area === 'string') out.business.service_area = b.service_area;
    if (b.established === null || typeof b.established === 'number') {
      out.business.established = b.established;
    }
    if (b.hours === null || typeof b.hours === 'string') {
      out.business.hours = b.hours;
    }
  }

  if (patch.hero && typeof patch.hero === 'object') {
    const h = patch.hero;
    if (typeof h.headline === 'string') out.hero.headline = h.headline;
    if (typeof h.subhead === 'string') out.hero.subhead = h.subhead;
    if (typeof h.cta_text === 'string') out.hero.cta_text = h.cta_text;
    if (typeof h.image_id === 'string') out.hero.image_id = h.image_id;
  }

  if (patch.about && typeof patch.about === 'object') {
    if (typeof patch.about.body === 'string') out.about.body = patch.about.body;
  }

  if (Array.isArray(patch.services)) {
    out.services = patch.services.map((s) => ({
      title: s.title ?? '',
      description: s.description ?? '',
    }));
  }

  if (patch.trust && typeof patch.trust === 'object') {
    if (Array.isArray(patch.trust.badges)) {
      out.trust.badges = [...patch.trust.badges];
    }
    if (Array.isArray(patch.trust.reviews)) {
      out.trust.reviews = patch.trust.reviews.map((r) => ({
        quote: r.quote ?? '',
        name: r.name ?? '',
        detail: r.detail ?? '',
      }));
    }
  }

  if (patch.contact && typeof patch.contact === 'object') {
    const c = patch.contact;
    if (typeof c.cta_text === 'string') out.contact.cta_text = c.cta_text;
    if (typeof c.phone_prompt === 'string') out.contact.phone_prompt = c.phone_prompt;
    if (typeof c.emergency === 'boolean') out.contact.emergency = c.emergency;
  }

  return out;
}
