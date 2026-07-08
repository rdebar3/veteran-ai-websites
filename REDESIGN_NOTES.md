# Redesign Notes — Veteran AI Websites

Living inventory for evolving the homepage cinematic experience without breaking checkout, orders, demos, or section anchors.

**Last audited:** 2026-07-08  
**Stack:** Next.js 16.2.7 · React 19 · App Router only (`app/`, no `pages/`) · Tailwind 4 · Framer Motion · Lenis · Stripe · Formspree

---

## Router & shell

| Piece | Path | Notes |
|-------|------|--------|
| Root layout | `app/layout.tsx` | `FilmGrain` → `SmoothScroll` → `Navbar` / `{children}` / `Footer` |
| Homepage | `app/page.tsx` | Client component; order form + payment success handling |
| Global styles | `app/globals.css` | Design tokens, Lenis CSS, room/card/nav system |
| Stripe API | `app/api/create-checkout-session/route.ts` | Package + add-on Price IDs |
| Demos | `app/examples/*` | starter-plumbing · complete-hvac · premium-restaurant |

---

## Current homepage flow (top → bottom)

Single vertical page. Video bands (`HeroCinematic` / `CinematicSection`) alternate with content chambers (`BaseRoom`).

| # | Component | Section `id` | Content |
|---|-----------|--------------|---------|
| 1 | `HeroCinematic` | `hero` | Full-viewport video (`/cinematic/hero.mp4`), $397 offer, CTAs → `#build` / `#pricing` |
| 2 | `CinematicSection` | *(none)* | command-base video · “Inside the command base” · left copy · CTA `#build` |
| 3 | `BaseRoom` armoury | **`build`** | Order form: package → add-ons → details → Formspree submit; optional Stripe Pay Now after success |
| 4 | `CinematicSection` | *(none)* | veteran video · “One veteran · One mission” · right copy |
| 5 | `BaseRoom` command-center | **`pricing`** | `PricingCard` grid + “every package includes” |
| 6 | `BaseRoom` mission-planning | **`how-it-works`** | Six process steps |
| 7 | `BaseRoom` observation-deck | **`examples`** | `HorizontalShowcase` → live demo links |
| 8 | `BaseRoom` after-action-lounge | **`testimonials`** | Testimonial cards |
| 9 | `CinematicSection` | *(none)* | night video · closing CTA `#build` |
| 10 | `BaseRoom` debrief | **`contact`** | FAQ · add-ons list · contact form · final CTA |

### Room config source

`lib/base-rooms.ts` — each room has `sectionId`, vista image (landmark/mountain), interior image, mood/accent. Homepage passes `className="base-room--functional"`, which:

- Disables vista parallax scroll tasks
- Hides interior chamber image blend
- Skips codename status line / chamber enter motion

---

## Active components (wired today)

### Layout / chrome

- `SmoothScroll` — Lenis + `runScrollFrame` loop; reduced-motion fallback; `#` anchor handling
- `FilmGrain`, `Navbar`, `Footer`
- `FacebookIcon`

### Homepage surface

- `HeroCinematic`, `CinematicSection`, `BaseRoom`
- `Reveal`, `InViewStagger` / `InViewItem`
- `PricingCard`, `FAQAccordion`, `OfferCountdown`, `MagneticButton`
- `HorizontalShowcase`

### Demo shells (examples only)

- `complete-hvac/HvacShell`, `complete-hvac/CinematicEntrance`
- `ridge-bistro/BistroShell`
- `starter-plumbing/CinematicEntrance`

### Active libs

- `scroll-driver.ts` — task bus, Lenis instance, `scrollToElement`
- `scroll-motion.ts` — Framer in-view variants
- `base-rooms.ts`, `data.ts`, `testimonials.ts`, `navigation.ts`, `offer-countdown.ts`
- `cinematic.ts` — **only `showcaseDemos` used on home** (`storyChapters` / `processChapters` / `marqueeItems` unused by pages)
- `landmarks.ts` — used by rooms, footer credits, unused chapter data
- Demo data: `complete-hvac-data.ts`, `ridge-bistro-data.ts`

---

## Unused cinematic / legacy components

**Not imported by any `app/` route.** Only referenced inside other unused components or self-contained.

| Component | Intended role | Only consumers (also unused) |
|-----------|---------------|------------------------------|
| `CinematicScroll` | Sticky multi-panel chapter scrubber | — (uses `scroll-cinema` + `storyChapters`) |
| `MountainBackdrop` | Parallax mountain layer stack | — (uses `mountain-journey`) |
| `ScrollLift` | Scale-up in-view lift wrapper | — |
| `PatrioticOverlay` | Crimson/gold/cyan stripe overlay | `Hero` only |
| `NeuralOverlay` | Neural mesh overlay | `Hero`, `MountainBackdrop` |
| `CircuitOverlay` | Circuit line overlay | `Hero` only |
| `Hero` | Full legacy HUD hero | — |
| `HeroBackground` | Video/poster hero media | `Hero` |
| `HeroHeadline` | Word-stagger headline | `Hero` |
| `HeroSystemsHud` | Systems HUD chrome | `Hero` |
| `HeroConstellationMesh` | Constellation canvas | `Hero` |
| `HeroRadarSweep` | Radar sweep FX | `Hero` |
| `MainGateHero` | Gate-themed room hero | — |
| `VisualInterlude` | Full-bleed photo interlude + CTA | — |
| `MarqueeBand` | Landmark/offer marquee | — |
| `RoomEnter` | Room enter transition | — |
| `ScrollReveal` | Older in-view reveal | `SectionShell` only |
| `SectionShell` | Generic section wrapper | — |
| `SectionHeader` | Section title block | — |
| `WhyChooseSection` | Why-choose pillars | — (uses `content-sections`) |
| `TrustStrip` | Trust badges strip | — |

### Unused or orphaned libs (no live page import)

| Lib | Notes |
|-----|--------|
| `scroll-cinema.ts` | Track/panel progress math for `CinematicScroll` |
| `mountain-journey.ts` | Layer peaks for `MountainBackdrop` |
| `content-sections.ts` | Why-choose copy for `WhyChooseSection` |
| `hero-media.ts` | Points at `/hero/hero-bg.mp4` (may not exist); used by dead `HeroBackground` |
| `hero-motion.ts` | Motion tiers/variants for dead Hero stack |

### Partial data usage

| Export | Status |
|--------|--------|
| `showcaseDemos` | **Live** on homepage |
| `storyChapters`, `processChapters`, `marqueeItems` | Defined in `lib/cinematic.ts`, **not mounted** |
| `baseRooms['main-gate']` | Config only; hero is `HeroCinematic`, not Main Gate room |
| `navRooms` | Exported from `base-rooms.ts`; **Navbar uses `navLinks` instead** |

---

## Assets inventory

### Live on homepage

- **Video:** `/cinematic/hero`, `command-base`, `veteran`, `night` (+ posters)
- **Rooms (vistas via BaseRoom):** mountain vistas + landmarks (misty-ridges, capitol, seneca, spruce-knob, monongahela, golden-overlook)
- **Demos:** `/demos/*-hero.jpg` via HorizontalShowcase
- **Logo / misc:** veteran-ai-logo, favicon

### Available but unused (or only by dead components)

- **Cinematic video unused on home:** `abstract`, `landmark`, `patriot` (+ posters)
- **Interludes:** `/interludes/local-business-highlands.jpg`, `promo-foothills.jpg`
- **Mountains:** `hero-vista`, `foothills`, `summit` (partially used elsewhere)
- **Rooms interiors:** still on disk; functional rooms hide interior blend
- **Hero:** `/hero/hero-poster.jpg`; `hero-media` expects `/hero/hero-bg.mp4` (legacy path)
- **Grok image dumps** in `public/` root (unreferenced)

---

## Scroll architecture (do not casually rip out)

```
SmoothScroll (Lenis rAF)
  └─ runScrollFrame() → registered ScrollTasks
       ├─ Navbar scrolled class
       └─ BaseRoom vista parallax (skipped when base-room--functional)

Framer Motion whileInView (parallel path)
  └─ Reveal, InViewStagger, CinematicSection enter, Pricing cards, etc.

scrollToElement(id)  → Lenis.scrollTo if available, else native
Anchor clicks #foo   → intercepted by SmoothScroll (offset -72)
```

**Reduced motion:** Lenis destroyed; native scroll; motion components short-circuit to static markup.

---

## Non-breaking evolution constraints

### Must preserve (Stripe / Formspree / commerce)

| Concern | Location | Rule |
|---------|----------|------|
| Formspree endpoint | `app/page.tsx` — `https://formspree.io/f/mwvjoklj` | Keep form fields: businessName, email, phone, description + appended package / addOns / estimatedTotal |
| Stripe checkout | `POST /api/create-checkout-session` | Body: `{ package, addOns: string[] }` — package names **exactly** `Starter` \| `Complete` \| `Premium`; add-on names **exactly** `Shoppable Store` \| `Monthly Website Care` |
| Stripe Price IDs | `route.ts` `PRICE_MAP` | Do not rename keys without updating Stripe dashboard + map |
| Success return | `?payment_success=true` | Homepage `useEffect` restores `sessionStorage.pendingOrder` and shows success UI |
| Cancel return | `?payment_cancel=true` | Supported by API cancel_url (homepage may ignore) |
| Session storage key | `pendingOrder` | JSON: `{ selectedBuilderPackage, selectedAddOnIds, builderForm }` |

### Must preserve (section anchors / nav)

Keep these **element `id`s** (or update `lib/navigation.ts` + all `#` links together):

- `hero`, `build`, `pricing`, `how-it-works`, `examples`, `testimonials`, `contact`

**Known bug:** Navbar lists `Story` → `#story`, but **no `#story` exists** on the page. Either add `id="story"` to a cinematic band or change the nav link.

### Must preserve (demo routes)

- `/examples/starter-plumbing`
- `/examples/complete-hvac` (+ about, services, reviews, contact)
- `/examples/premium-restaurant` (+ multi-page tree)

`HorizontalShowcase` hrefs and demo shells must keep working.

### Safe to evolve

- Visual treatment of `HeroCinematic` / `CinematicSection` / `BaseRoom` (CSS, video, motion)
- Re-enabling non-functional BaseRoom atmosphere (remove `--functional` carefully for perf)
- Wiring unused components (`CinematicScroll`, `MountainBackdrop`, `VisualInterlude`, etc.) **alongside** existing sections
- Filling `#story` with a landmark/story band using `storyChapters` + `CinematicScroll` or new section
- `globals.css` tokens, FilmGrain intensity, Navbar styling
- Copy inside sections (not field `name`s required by Formspree/Stripe)

### Risky / coordinate carefully

- Renaming package or add-on display names that feed Stripe `PRICE_MAP`
- Replacing Lenis without keeping `scrollToElement` + scroll-task registration
- Moving order form off `#build` without redirecting all CTAs
- Heavy sticky scroll-jacking on mobile (Lenis already has mobile branch)

---

## Recommended evolution approach

1. **Keep** `app/page.tsx` section order and commerce handlers as the spine.
2. **Enhance** between existing blocks (e.g. story cinema after hero, interludes between rooms) rather than rewriting the form block.
3. **Reuse** dead components when they match intent; delete only after a second pass confirms no planned use.
4. **Fix** `#story` nav when adding a real story section.
5. **Test** after any homepage change:
   - Submit order (Formspree)
   - Pay Now path (Stripe redirect + return `?payment_success=true`)
   - All nav anchors + Lenis smooth scroll
   - Demo links from Examples
   - `prefers-reduced-motion` and mobile width

---

## Quick file map

```
app/
  layout.tsx, page.tsx, globals.css
  api/create-checkout-session/route.ts
  examples/{starter-plumbing,complete-hvac,premium-restaurant}/
components/
  [active] HeroCinematic, CinematicSection, BaseRoom, HorizontalShowcase, …
  [unused] CinematicScroll, MountainBackdrop, Hero*, overlays, VisualInterlude, …
lib/
  [active] scroll-driver, scroll-motion, base-rooms, data, cinematic(showcaseDemos), …
  [orphaned] scroll-cinema, mountain-journey, content-sections, hero-media, hero-motion
public/
  cinematic/, demos/, landmarks/, mountains/, rooms/, interludes/, hero/
```
