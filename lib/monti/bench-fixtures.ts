/**
 * Deterministic Monti site-builder fixtures for /monti/bench.
 * One fully populated record per TradeKey, plus the staged patch sequence
 * a live session publishes (hero → services → about → contact).
 *
 * No Math.random. No network. Content is West Virginia small-business copy
 * so visual judgment of the template is meaningful.
 */

import { emptyRecord } from './contract';
import type {
  FillSection,
  MontiPatch,
  MontiRecord,
  Palette,
  SiteLayout,
  TradeKey,
} from './types';
import { TRADE_KEYS } from './types';

/** SiteLayout union — keep in lockstep with lib/monti/types.ts. */
export const SITE_LAYOUTS = ['classic', 'bold', 'split'] as const satisfies readonly SiteLayout[];

/** Palette union — keep in lockstep with lib/monti/types.ts. */
export const PALETTES = [
  'ember',
  'slate',
  'pine',
  'river',
  'sand',
] as const satisfies readonly Palette[];

/** Trade keys including `general` — same array as types.TRADE_KEYS. */
export const BENCH_TRADE_KEYS = TRADE_KEYS;

export type BenchStageName = 'hero' | 'services' | 'about' | 'contact';

export type BenchStage = {
  name: BenchStageName;
  /** Partial patch applied this tick (deepMergeRecord). */
  patch: MontiPatch;
  /** FillSection values this stage adds to fill[]. */
  fill: FillSection[];
};

function fixture(
  trade: TradeKey,
  fields: Omit<MontiRecord, 'template_id' | 'theme'> & {
    template_id?: MontiRecord['template_id'];
  },
): MontiRecord {
  const base = emptyRecord();
  const palette = fields.palette;
  const theme_mood = fields.theme_mood;
  return {
    ...base,
    ...fields,
    template_id: fields.template_id ?? 'trades',
    theme: { palette, mood: theme_mood },
    trade_key: trade,
    hero: {
      ...fields.hero,
      image_id: fields.hero.image_id || trade,
    },
  };
}

/**
 * Fully populated MontiRecord per trade. Layout/palette defaults are neutral;
 * the bench UI overrides layout/palette when controlling those axes.
 */
export const TRADE_FIXTURES: Record<TradeKey, MontiRecord> = {
  landscaping: fixture('landscaping', {
    layout: 'classic',
    palette: 'pine',
    theme_mood: 'clean',
    copy_tone: 'warm',
    trade_key: 'landscaping',
    business: {
      name: 'Ridge Line Landscapes',
      phone: '(304) 555-0142',
      service_area: 'Charleston, South Charleston & Kanawha Valley',
      established: 2009,
      hours: 'Mon–Sat 7am–6pm',
    },
    hero: {
      headline: 'Yards that hold up in WV weather',
      subhead:
        'Mowing, mulch, hardscape, and seasonal cleanup for homes from the valley to the ridge.',
      cta_text: 'Get a free quote',
      image_id: 'landscaping',
    },
    about: {
      body:
        'We are a family crew out of South Charleston. We know clay soil, steep grades, and the freeze-thaw that wrecks a rushed patio. Every job gets a clear plan, clean edges, and a yard you are proud to drive home to.',
    },
    services: [
      {
        title: 'Weekly lawn care',
        description: 'Mow, edge, and blow-off on a steady schedule all season.',
      },
      {
        title: 'Mulch & beds',
        description: 'Fresh beds, clean lines, and plants that survive our winters.',
      },
      {
        title: 'Hardscape',
        description: 'Patios, retaining walls, and steps built for hill country.',
      },
      {
        title: 'Fall leaf cleanup',
        description: 'Full property leaf haul so your lawn is ready for frost.',
      },
    ],
    trust: {
      badges: ['Insured', 'Local crew', 'Free estimates', 'Since 2009'],
      reviews: [
        {
          quote:
            'They rebuilt our side yard wall after the spring washout. Showed up when they said and left it clean.',
          name: 'Karen M.',
          detail: 'South Hills',
        },
        {
          quote: 'Best looking lawn on the street. Fair price, no hard sell.',
          name: 'Tom R.',
          detail: 'Dunbar',
        },
        {
          quote: 'Mulch and edging looked sharp for the whole summer.',
          name: 'Lisa P.',
          detail: 'Nitro',
        },
      ],
    },
    contact: {
      cta_text: 'Request a quote',
      phone_prompt: 'Tell us about your yard',
      emergency: false,
    },
  }),

  plumbing: fixture('plumbing', {
    layout: 'classic',
    palette: 'slate',
    theme_mood: 'clean',
    copy_tone: 'grounded',
    trade_key: 'plumbing',
    business: {
      name: 'Mountain Fork Plumbing',
      phone: '(304) 555-0198',
      service_area: 'Huntington, Barboursville & Cabell County',
      established: 2003,
      hours: '24/7 emergency · Office 8–5',
    },
    hero: {
      headline: 'Leaks, clogs, and water heaters — fixed right',
      subhead:
        'Licensed plumbers who answer the phone. Same-day help when the water will not wait.',
      cta_text: 'Call now',
      image_id: 'plumbing',
    },
    about: {
      body:
        'Mountain Fork is a small shop, not a franchise call center. We diagnose before we quote, show you the worn parts, and leave your home cleaner than we found it. Serving Cabell and surrounding counties for twenty years.',
    },
    services: [
      {
        title: 'Drain clearing',
        description: 'Kitchen, bath, and main line clogs without the runaround.',
      },
      {
        title: 'Water heaters',
        description: 'Repair or replace — tank and tankless, done to code.',
      },
      {
        title: 'Leak repair',
        description: 'Under sinks, behind walls, and outdoor spigots.',
      },
      {
        title: 'Fixture installs',
        description: 'Faucets, toilets, and disposals installed clean.',
      },
    ],
    trust: {
      badges: ['Licensed', 'Insured', '24/7 emergency', 'Upfront pricing'],
      reviews: [
        {
          quote:
            'Burst pipe at 11pm. They were here in under an hour and saved the basement.',
          name: 'James H.',
          detail: 'Huntington',
        },
        {
          quote: 'Honest quote on a water heater. No upsell nonsense.',
          name: 'Denise W.',
          detail: 'Barboursville',
        },
        {
          quote: 'Fixed a slow drain my last guy could not find.',
          name: 'Mark S.',
          detail: 'Milton',
        },
      ],
    },
    contact: {
      cta_text: 'Call now',
      phone_prompt: 'Talk to a real plumber today',
      emergency: true,
    },
  }),

  towing: fixture('towing', {
    layout: 'bold',
    palette: 'ember',
    theme_mood: 'rugged',
    copy_tone: 'grounded',
    trade_key: 'towing',
    business: {
      name: 'Coal River Towing',
      phone: '(304) 555-0177',
      service_area: 'Beckley, Oak Hill & Fayette County',
      established: 1998,
      hours: '24 hours · 7 days',
    },
    hero: {
      headline: 'Fast local tow when you are stuck',
      subhead:
        'Light and medium-duty towing, jump starts, and lockouts across southern WV.',
      cta_text: 'CALL NOW',
      image_id: 'towing',
    },
    about: {
      body:
        'We run local trucks and local drivers who know the hollows and the interstate exits. No phone tree — you get a real person and an honest ETA. Family-owned out of Beckley since 1998.',
    },
    services: [
      {
        title: 'Light-duty towing',
        description: 'Cars, SUVs, and light trucks to the shop or home.',
      },
      {
        title: 'Jump starts',
        description: 'Dead battery help on the shoulder or your driveway.',
      },
      {
        title: 'Lockout service',
        description: 'Keys locked inside? We open without damage when possible.',
      },
      {
        title: 'Winch-outs',
        description: 'Off the ditch, mud, or snowbank — careful recovery.',
      },
    ],
    trust: {
      badges: ['24/7 dispatch', 'Local drivers', 'Flat rates', 'Since 1998'],
      reviews: [
        {
          quote: 'Pulled me out of a ditch on 19 in the rain. Fair price, kind crew.',
          name: 'Ashley B.',
          detail: 'Oak Hill',
        },
        {
          quote: 'Showed up faster than the estimate. Professional gear.',
          name: 'Ryan C.',
          detail: 'Beckley',
        },
        {
          quote: 'Lockout at the grocery lot. Done in minutes.',
          name: 'Pat K.',
          detail: 'Fayetteville',
        },
      ],
    },
    contact: {
      cta_text: 'Call now',
      phone_prompt: 'We pick up — day or night',
      emergency: true,
    },
  }),

  hvac: fixture('hvac', {
    layout: 'classic',
    palette: 'river',
    theme_mood: 'clean',
    copy_tone: 'grounded',
    trade_key: 'hvac',
    business: {
      name: 'Highland Comfort HVAC',
      phone: '(304) 555-0133',
      service_area: 'Morgantown, Star City & Monongalia County',
      established: 2011,
      hours: 'Mon–Fri 7:30–5:30 · Sat on-call',
    },
    hero: {
      headline: 'Heat and cool that keep the house right',
      subhead:
        'Installs, tune-ups, and no-heat emergencies for homes around Morgantown.',
      cta_text: 'Call now',
      image_id: 'hvac',
    },
    about: {
      body:
        'Highland Comfort is a local HVAC shop — not a national lead mill. We size equipment for real WV winters, explain options in plain language, and stand behind the work with clear warranties.',
    },
    services: [
      {
        title: 'AC repair',
        description: 'Diagnose and fix cool-air problems before the heat wave.',
      },
      {
        title: 'Furnace service',
        description: 'No-heat calls, cleanings, and safe ignition checks.',
      },
      {
        title: 'System installs',
        description: 'Right-sized heat pumps and furnaces, done clean.',
      },
      {
        title: 'Seasonal tune-ups',
        description: 'Spring and fall maintenance so systems last longer.',
      },
    ],
    trust: {
      badges: ['NATE techs', 'Licensed', 'Financing options', 'Local shop'],
      reviews: [
        {
          quote: 'Replaced our furnace mid-January. Straight talk and tidy work.',
          name: 'Ellen D.',
          detail: 'Morgantown',
        },
        {
          quote: 'AC was out on a Saturday. They got us cool again same day.',
          name: 'Chris V.',
          detail: 'Westover',
        },
        {
          quote: 'Tune-up found a bad capacitor before it failed.',
          name: 'Nina F.',
          detail: 'Cheat Lake',
        },
      ],
    },
    contact: {
      cta_text: 'Schedule service',
      phone_prompt: 'Heat and cool — we answer',
      emergency: true,
    },
  }),

  electrical: fixture('electrical', {
    layout: 'classic',
    palette: 'slate',
    theme_mood: 'clean',
    copy_tone: 'grounded',
    trade_key: 'electrical',
    business: {
      name: 'Potomac Electric Co.',
      phone: '(304) 555-0164',
      service_area: 'Martinsburg, Inwood & Eastern Panhandle',
      established: 2006,
      hours: 'Mon–Fri 8am–5pm · Emergency line open',
    },
    hero: {
      headline: 'Safe electrical work for homes and shops',
      subhead:
        'Panels, outlets, generators, and troubleshooting — careful work, clear quotes.',
      cta_text: 'Call now',
      image_id: 'electrical',
    },
    about: {
      body:
        'We are licensed electricians based in Martinsburg. Code-compliant installs, honest assessments on older wiring, and no scare tactics. If a fix is simple, we say so. If you need a panel upgrade, we explain why.',
    },
    services: [
      {
        title: 'Panel upgrades',
        description: 'Replace outdated panels and add capacity safely.',
      },
      {
        title: 'Outlet & switch',
        description: 'New circuits, GFCI, USB outlets, and dimmers.',
      },
      {
        title: 'Generator hookups',
        description: 'Transfer switches and standby generator wiring.',
      },
      {
        title: 'Troubleshooting',
        description: 'Tripping breakers, flickering lights, dead rooms.',
      },
    ],
    trust: {
      badges: ['Licensed', 'Insured', 'Code compliant', 'Free estimates'],
      reviews: [
        {
          quote: 'Panel swap was clean and on schedule. House feels safer.',
          name: 'Greg L.',
          detail: 'Martinsburg',
        },
        {
          quote: 'Found the shared neutral issue two other shops missed.',
          name: 'Amy T.',
          detail: 'Inwood',
        },
        {
          quote: 'Generator install before winter storms. Professional crew.',
          name: 'Steve N.',
          detail: 'Hedgesville',
        },
      ],
    },
    contact: {
      cta_text: 'Call now',
      phone_prompt: 'Safe work. Clear answers.',
      emergency: true,
    },
  }),

  roofing: fixture('roofing', {
    layout: 'classic',
    palette: 'ember',
    theme_mood: 'rugged',
    copy_tone: 'grounded',
    trade_key: 'roofing',
    business: {
      name: 'Allegheny Roof Works',
      phone: '(304) 555-0119',
      service_area: 'Parkersburg, Vienna & Wood County',
      established: 2001,
      hours: 'Mon–Sat 7am–5pm',
    },
    hero: {
      headline: 'Roofs built for WV weather',
      subhead:
        'Repairs, replacements, and storm damage work with materials that last on these hills.',
      cta_text: 'Free roof check',
      image_id: 'roofing',
    },
    about: {
      body:
        'Allegheny Roof Works is a local crew — not door knockers after a storm. We photograph the damage, walk you through options, and install with proper flashing and ventilation so the next storm is not your problem.',
    },
    services: [
      {
        title: 'Full replacements',
        description: 'Tear-off and new shingles with clean job-site habits.',
      },
      {
        title: 'Leak repairs',
        description: 'Find the path of water and seal it for good.',
      },
      {
        title: 'Storm damage',
        description: 'Documentation and repairs after high wind or hail.',
      },
      {
        title: 'Gutter work',
        description: 'Seamless gutters and downspouts that handle runoff.',
      },
    ],
    trust: {
      badges: ['Insured', 'Manufacturer certified', 'Local crew', 'Written warranty'],
      reviews: [
        {
          quote: 'Replaced our whole roof after the derecho. On time, tidy yard.',
          name: 'Paula J.',
          detail: 'Vienna',
        },
        {
          quote: 'Found a leak at the chimney flashing. Fixed in one visit.',
          name: 'Bill O.',
          detail: 'Parkersburg',
        },
        {
          quote: 'Fair price, no high-pressure insurance talk.',
          name: 'Ruth E.',
          detail: 'Williamstown',
        },
      ],
    },
    contact: {
      cta_text: 'Request a quote',
      phone_prompt: 'Tell us about your roof',
      emergency: false,
    },
  }),

  auto: fixture('auto', {
    layout: 'classic',
    palette: 'slate',
    theme_mood: 'clean',
    copy_tone: 'grounded',
    trade_key: 'auto',
    business: {
      name: 'Kanawha Valley Auto',
      phone: '(304) 555-0185',
      service_area: 'Charleston metro & surrounding towns',
      established: 1995,
      hours: 'Mon–Fri 8am–5:30pm',
    },
    hero: {
      headline: 'Honest work under the hood',
      subhead:
        'Brakes, diagnostics, oil, and the repairs that keep you on I-64 and US-119.',
      cta_text: 'Book service',
      image_id: 'auto',
    },
    about: {
      body:
        'Independently owned bay in Charleston. We show you the worn parts, quote before we turn a wrench, and never invent repairs. Fleet and personal vehicles — same straight talk either way.',
    },
    services: [
      {
        title: 'Brake service',
        description: 'Pads, rotors, and fluid — inspected, not upsold.',
      },
      {
        title: 'Diagnostics',
        description: 'Check-engine lights explained in plain English.',
      },
      {
        title: 'Oil & filters',
        description: 'Quick service with quality oil for your engine.',
      },
      {
        title: 'Suspension',
        description: 'Shocks, struts, and alignments for WV roads.',
      },
    ],
    trust: {
      badges: ['ASE techs', 'Warranty work', 'Loaner when available', 'Since 1995'],
      reviews: [
        {
          quote: 'Finally a shop that does not invent problems. Transparent invoice.',
          name: 'Derek M.',
          detail: 'Charleston',
        },
        {
          quote: 'Brakes done right the first time. Quiet and smooth.',
          name: 'Heather S.',
          detail: 'St. Albans',
        },
        {
          quote: 'Diagnosed a wiring issue others called a computer failure.',
          name: 'Al P.',
          detail: 'Sissonville',
        },
      ],
    },
    contact: {
      cta_text: 'Schedule service',
      phone_prompt: 'Tell us what the car is doing',
      emergency: false,
    },
  }),

  cleaning: fixture('cleaning', {
    layout: 'classic',
    palette: 'sand',
    theme_mood: 'clean',
    copy_tone: 'warm',
    trade_key: 'cleaning',
    business: {
      name: 'New River Clean Co.',
      phone: '(304) 555-0126',
      service_area: 'Fayetteville, Ansted & New River Gorge area',
      established: 2014,
      hours: 'Mon–Fri 8am–4pm',
    },
    hero: {
      headline: 'Clean that holds up to real life',
      subhead:
        'Homes, rentals, and small offices — clear scope, no surprise extras.',
      cta_text: 'Get a quote',
      image_id: 'cleaning',
    },
    about: {
      body:
        'We are a local cleaning team who treat your place like a neighbor would. Background-checked staff, eco-friendly products on request, and a checklist you approve before we start. Great for short-term rentals and busy households.',
    },
    services: [
      {
        title: 'Recurring home clean',
        description: 'Weekly or biweekly so the house stays guest-ready.',
      },
      {
        title: 'Deep clean',
        description: 'Baseboards, appliances, and the corners that get skipped.',
      },
      {
        title: 'Rental turnover',
        description: 'Airbnb and cabin resets between guests.',
      },
      {
        title: 'Move-out clean',
        description: 'Empty-home cleans for landlords and sellers.',
      },
    ],
    trust: {
      badges: ['Bonded', 'Background checked', 'Supplies included', 'Local team'],
      reviews: [
        {
          quote: 'Cabin looks better than when we bought it. Guests notice.',
          name: 'Julie A.',
          detail: 'Fayetteville',
        },
        {
          quote: 'Consistent every other week. Keys handled carefully.',
          name: 'Mike R.',
          detail: 'Ansted',
        },
        {
          quote: 'Move-out clean helped us get the full deposit back.',
          name: 'Sara L.',
          detail: 'Oak Hill',
        },
      ],
    },
    contact: {
      cta_text: 'Request a quote',
      phone_prompt: 'Tell us what you need cleaned',
      emergency: false,
    },
  }),

  general: fixture('general', {
    layout: 'classic',
    palette: 'pine',
    theme_mood: 'clean',
    copy_tone: 'warm',
    trade_key: 'general',
    business: {
      name: 'Main Street Mercantile',
      phone: '(304) 555-0108',
      service_area: 'Lewisburg & Greenbrier Valley',
      established: 1987,
      hours: 'Tue–Sat 10am–6pm',
    },
    hero: {
      headline: 'Goods and gifts from a real main street',
      subhead:
        'Local makers, everyday essentials, and a shop that still knows your name.',
      cta_text: 'Visit the shop',
      image_id: 'general',
    },
    about: {
      body:
        'Main Street Mercantile has been on Washington Street for decades. We stock practical goods, West Virginia-made gifts, and the small things you forget until you need them. Come in — we are glad you are here.',
    },
    services: [
      {
        title: 'Local makers shelf',
        description: 'Honey, soap, pottery, and goods from nearby makers.',
      },
      {
        title: 'Everyday essentials',
        description: 'Hardware, kitchen basics, and household staples.',
      },
      {
        title: 'Gift wrapping',
        description: 'In-store wrap for birthdays and host gifts.',
      },
      {
        title: 'Special orders',
        description: 'We will track down hard-to-find items when we can.',
      },
    ],
    trust: {
      badges: ['Family owned', 'Since 1987', 'Local makers', 'Downtown'],
      reviews: [
        {
          quote: 'Always find something I did not know I needed. Friendly staff.',
          name: 'Carol W.',
          detail: 'Lewisburg',
        },
        {
          quote: 'Best place for a last-minute host gift with real wrap.',
          name: 'Ian B.',
          detail: 'Ronceverte',
        },
        {
          quote: 'Supports local makers and still has practical stock.',
          name: 'Meg H.',
          detail: 'White Sulphur',
        },
      ],
    },
    contact: {
      cta_text: 'Get directions',
      phone_prompt: 'Call with questions before you drive in',
      emergency: false,
    },
  }),

  pet_care: fixture('pet_care', {
    layout: 'classic',
    palette: 'sand',
    theme_mood: 'clean',
    copy_tone: 'warm',
    trade_key: 'pet_care',
    business: {
      name: 'Greenbrier Paws',
      phone: '(304) 555-0151',
      service_area: 'Lewisburg, Fairlea & Greenbrier County',
      established: 2016,
      hours: 'Tue–Sat 9am–5pm',
    },
    hero: {
      headline: 'Gentle grooming and care for local pets',
      subhead:
        'Baths, haircuts, nail trims, and daycare-style boarding for dogs and cats.',
      cta_text: 'Book a visit',
      image_id: 'pet_care',
    },
    about: {
      body:
        'Greenbrier Paws is a small salon and care shop — calm rooms, patient hands, and updates so you know how the day went. We treat every dog and cat like a regular, not a ticket number.',
    },
    services: [
      {
        title: 'Full groom',
        description: 'Bath, haircut, nails, and ears for dogs of all coats.',
      },
      {
        title: 'Bath & tidy',
        description: 'Freshen-up baths between full grooms.',
      },
      {
        title: 'Day boarding',
        description: 'Supervised day stays while you work or travel.',
      },
      {
        title: 'Nail trims',
        description: 'Quick, low-stress trims by appointment.',
      },
    ],
    trust: {
      badges: ['Gentle handling', 'Insured', 'By appointment', 'Local shop'],
      reviews: [
        {
          quote: 'Our anxious rescue leaves calm and looking sharp every time.',
          name: 'Tanya G.',
          detail: 'Lewisburg',
        },
        {
          quote: 'Day boarding with photos. Huge relief on workdays.',
          name: 'Omar F.',
          detail: 'Fairlea',
        },
        {
          quote: 'Cat grooming without the drama. Patient staff.',
          name: 'Sue C.',
          detail: 'Ronceverte',
        },
      ],
    },
    contact: {
      cta_text: 'Book a visit',
      phone_prompt: 'Tell us about your pet',
      emergency: false,
    },
  }),
};

/**
 * Staged patches Monti publishes in a live build.
 * Order matches CORE_FILLS progression: hero → services → about → contact.
 * Callers deepMergeRecord each patch in order and accumulate fill[].
 */
export function stagesForFixture(record: MontiRecord): BenchStage[] {
  return [
    {
      name: 'hero',
      patch: {
        template_id: 'trades',
        layout: record.layout,
        palette: record.palette,
        theme_mood: record.theme_mood,
        copy_tone: record.copy_tone,
        trade_key: record.trade_key,
        business: {
          name: record.business.name,
          phone: record.business.phone,
          service_area: record.business.service_area,
          established: record.business.established,
        },
        hero: { ...record.hero },
        trust: { badges: [...record.trust.badges] },
      },
      fill: ['hero'],
    },
    {
      name: 'services',
      patch: {
        services: record.services.map((s) => ({ ...s })),
      },
      fill: ['services'],
    },
    {
      name: 'about',
      patch: {
        about: { body: record.about.body },
        trust: {
          reviews: record.trust.reviews.map((r) => ({ ...r })),
        },
      },
      fill: ['about'],
    },
    {
      name: 'contact',
      patch: {
        business: { hours: record.business.hours },
        contact: { ...record.contact },
      },
      fill: ['contact'],
    },
  ];
}

/** Apply layout + palette axes onto a fixture without mutating the original. */
export function withStyle(
  record: MontiRecord,
  layout: SiteLayout,
  palette: Palette,
): MontiRecord {
  return {
    ...structuredClone(record),
    layout,
    palette,
    theme: { palette, mood: record.theme_mood },
  };
}
