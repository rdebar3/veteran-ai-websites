# WORK PACKET — Design & Lock the 3 Monti Templates

*Self-contained. Hand this to a fresh chat or to Grok Build. Everything needed to design and lock
the three templates Monti fills is in here — no other context required. Report the distilled
results back to the command-center chat when done.*

Author: Claude (Rich's command center) · For: Rich, Veteran AI Websites · Date: 2026-07-19

---

## 0. The one thing to understand before anything else

Monti is a voice concierge on veteranaiwebsites.com. A visitor talks to him; he asks a few
questions; and **live, while they answer, a real homepage for their business assembles on screen.**
At the end Monti hands them off to Rich as a hot lead.

The whole promise rests on one hard rule Rich set: **"it cannot miss — it literally has to be good
every single time."**

Here is how we guarantee that, and why this packet exists:

**Monti does NOT design. Monti fills.** He never writes HTML, never picks a layout, never chooses
colors or spacing. Those are decided ONCE, by a human, in these three templates — beautiful,
fixed, hand-built frames. At runtime Monti only pours *structured text and a chosen photo* into
slots that are already designed to look great. A fixed frame with good content poured in **cannot
render ugly**, because the ugly decisions were never his to make.

So the quality of Monti = the quality of these three templates. That's why the first thing we build
isn't code that talks — it's these three frames, nailed and locked. **This packet is that job.**

Your deliverable is three production-ready responsive homepage templates that look like a
$3,000 site the moment they load, before Monti pours in a single word.

> **⚡ READ §10 FIRST — big head start.** The repo already has 2 of the 3 template frames
> hand-built and rendering live. You're adapting 2 proven frames + building 1 new one, not
> designing 3 from scratch. Details at the bottom.

---

## 1. The three verticals (and why these three)

West Virginia small business splits cleanly into three buckets. One template each — that's enough
to cover the vast majority of who Monti will meet, without diluting the design.

1. **Trades & Services** — plumber, electrician, HVAC, contractor, landscaper, auto shop, cleaning,
   towing, roofing. *Buyer intent: "I have a problem, are you reliable and can you come now?"*
   Emphasis: trust, licensed/insured, fast response, service area, phone-first.

2. **Food & Hospitality** — diner, café, BBQ joint, bakery, brewery, food truck, catering, bar.
   *Buyer intent: "Do I want to eat here — is it good, where is it, when's it open?"*
   Emphasis: appetite (photography), hours, location/map, menu highlights, atmosphere.

3. **Tourism & Outdoors** — cabin rental, whitewater outfitter, guided tours, campground, ATV
   trails, fishing/hunting guide, event venue. *Buyer intent: "Plan my trip — is this the
   experience I want, and how do I book it?"*
   Emphasis: aspiration (big landscape hero), the experience, seasons, booking/reserve CTA.

These map to WV's real economy: the trades that keep towns running, the food that anchors Main
Street, and the outdoor tourism that's the state's growth engine. If a business doesn't fit neatly,
Monti picks the closest of the three — never a fourth "generic" template (generic = the thing that
looks bad).

---

## 2. The aesthetic bar (the non-negotiables)

Rich's standard, in his exact words, applies to every pixel: **"I don't want anything stupid corny
or gay, it needs to be professional."** And: **"I want them to actually be impressed by something,
not let down."**

Translate that to design rules:

- **Appalachia-meets-AI, but the AI is silent.** Premium-quiet, not flashy-loud. The site should
  feel like it was built by someone who's stood in the same trenches as the owner — not by someone
  showing off technology. No robot motifs, no glow, no waveforms, no "powered by AI" badges.
- **One strong local visual per template, and it carries the whole page.** A real, curated WV photo
  (not AI-generated, not a generic stock businessman). The hero image does the emotional work; the
  type stays restrained.
- **Bold but restrained typography.** One confident display face for headlines, one clean readable
  face for body. Big, calm headline. Generous whitespace. Nothing cramped, nothing shouting.
- **Mobile-first, always.** Most of these visitors are on a phone. It has to be flawless at 375px
  before it's anything at 1440px.
- **No cheese, ever.** No stock "handshake" photos, no clip-art icons that look like 2011, no
  gradient buttons, no drop-shadow soup, no emoji in the UI, no exclamation marks in the chrome.
- **Fast.** Curated images are optimized/compressed; no giant hero video in these templates (the
  cinematic stuff lives on the main marketing site, not on Monti's generated pages).

The test for every design decision: *would a hardworking WV shop owner who's been burned by a
cheap web guy before look at this and think "damn, this is legit"?* If not, cut it.

---

## 3. The data contract — what Monti is allowed to put in (memorize this)

This is the spine. Monti outputs **structured fields only — never raw HTML, never CSS, never a
layout choice.** Every template must be designed to render beautifully from exactly this shape and
nothing more. If a template needs a field that isn't here, either it gets added to the contract for
ALL templates or the template must supply it as a fixed default — Monti never invents structure.

```json
{
  "template_id": "trades" | "food" | "tourism",
  "palette": "one of the 2–3 pre-approved palettes defined per template (see §5)",
  "hero_image_id": "id of a curated photo from the template's own image set (see §6)",
  "copy_tone": "grounded" | "warm" | "adventurous",

  "hero": {
    "headline": "string, ≤ 60 chars",
    "subhead": "string, ≤ 120 chars",
    "cta_text": "string, ≤ 22 chars"
  },
  "about": {
    "body": "string, 2–3 sentences, ≤ 320 chars"
  },
  "services": [
    { "title": "string ≤ 28 chars", "description": "string ≤ 90 chars" }
    // exactly 3 to 6 items — template must look right at BOTH 3 and 6
  ],
  "trust": {
    "badges": ["string ≤ 24 chars", ...],   // 0–4 items, e.g. "Licensed & Insured", "Since 1998"
    "reviews_snippet": "string ≤ 140 chars or null"  // one short real-sounding quote or null
  },
  "contact": {
    "cta_text": "string ≤ 22 chars",
    "phone_prompt": "string ≤ 40 chars"      // e.g. "Call for same-day service"
  }
}
```

**The validation gate (build this attitude into the templates):** every field has a max length and
a fallback. If Monti returns something too long, malformed, or empty, the template shows a designed
default for that slot — it must NEVER render a broken frame, a blank hole, or overflowing text.
Design each slot so its *empty state and its longest-allowed state both look intentional.* That is
the actual guarantee of "good every single time" — not that Monti is perfect, but that the frame is
bulletproof no matter what he hands it.

---

## 4. Required sections per template (same skeleton, three treatments)

All three templates share the SAME section order (consistency = less that can break). What changes
between verticals is the *visual treatment and emphasis*, not the structure.

1. **Hero** — full-bleed curated photo, headline + subhead over it, one primary CTA button.
   Business name + phone visible. This is 80% of the impression.
2. **About** — short, warm, 2–3 sentences. Owner-voice, not corporate. Optional small secondary
   image or a calm solid band.
3. **Services / Offerings** — the `services[]` array as a clean card grid or list. Must look
   deliberate at 3 items and at 6 items (design the grid so it never looks empty or crammed).
4. **Trust** — badges row (licensed/insured/since-year) + one review snippet. Hidden gracefully if
   Monti passes none.
5. **Contact / CTA** — the close. Phone-first for trades, map/hours for food, book-now for tourism.
   Big, obvious, single action.
6. **Footer** — business name, phone, service area/address, and a quiet "Site by Veteran AI
   Websites" line.

Per-vertical emphasis:

- **Trades:** phone number pinned top-right AND in a sticky mobile bar; "Licensed & Insured" and
  service-area front and center; CTA = "Call Now" / "Get a Quote". Palette grounded (see §5).
- **Food:** the photo does everything — hero is the food/room; hours + map are near the top; menu
  highlights use the `services[]` slots; CTA = "See the Menu" / "Get Directions". Warmer palette.
- **Tourism:** biggest, most cinematic hero (landscape); the experience is the pitch; seasons/what's
  included in `services[]`; CTA = "Check Availability" / "Book Your Trip". Adventurous palette.

---

## 5. Palettes (pre-approved, locked — Monti only picks, never mixes)

Each template ships with 2–3 fixed palettes. Monti chooses one via `palette`. He cannot invent
colors. Define each as a small token set (bg, surface, text, muted, accent, accent-contrast). Keep
them all in the same restrained WV family so nothing can clash:

- **Trades — "grounded":** deep charcoal/navy base, warm steel accents, one confident action color
  (a strong blue or a work-boot orange used sparingly). Feels dependable, blue-collar-premium.
- **Food — "warm":** warm off-white/cream base, deep espresso text, one appetizing accent (brick
  red, or amber). Feels inviting, clean, hungry-making.
- **Tourism — "adventurous":** deep forest/slate base, big natural photography, one crisp accent
  (river blue or sunrise gold). Feels expansive, aspirational, outdoorsy.

Rule for whoever builds: palettes are **design tokens**, not inline colors. One source of truth per
palette so a template can't drift.

---

## 6. Hero images (curated, NOT AI-generated — decide the approach)

Each template needs a small curated set (say 4–8) of real, license-clear WV-appropriate photos,
each with a `hero_image_id`. Monti picks the closest fit; he never generates one.

For THIS packet, you don't need to source final photography — you need to:
1. Specify the *kind* of shot each template needs (composition, mood, safe area for text overlay).
2. Use tasteful placeholders with correct dimensions/crops so the layout is locked.
3. Note the sourcing plan (Rich curates final licensed photos later — Unsplash/commissioned/his own).

Give every hero a **dark-enough overlay or gradient scrim** so white headline text is always
readable regardless of which photo lands. That scrim is part of the guarantee — text legibility can
never depend on the photo.

---

## 7. What to actually deliver back

Build these as **real, static, responsive HTML/CSS (Tailwind, matching the existing app's stack)**,
each rendered with realistic placeholder content so Rich can look at them:

1. **Three template files/components**, one per vertical, each accepting the §3 JSON shape as props
   and rendering all six sections.
2. **Two filled samples per template (6 total):** one filled with *minimum* data (3 services, no
   badges, null review — the sparse case) and one with *maximum* data (6 services, 4 badges, long
   review — the full case). This proves both extremes look intentional. This is the single most
   important deliverable — it's the proof the frame can't break.
3. **A one-screen "palette + type" reference** per template showing the tokens and fonts used.
4. **A short notes file:** any fields you had to add/adjust in the §3 contract, and why. If the
   contract changed, that has to come back to the command center so Monti's spec stays in sync.

Keep it self-contained and static (no live LLM, no backend, no Monti wiring yet) — this is purely
the frames. The conversation engine and validation code are a *later* packet; do not build them
here. Mixing them in is how the "good every time" guarantee gets muddy.

---

## 8. Definition of "locked" (the finish line)

A template is LOCKED when all of these are true:

- It looks like a legit $3k site at 375px and at 1440px, empty-handed (placeholder) — before Monti.
- Both the sparse sample and the full sample look deliberate — no blank holes, no overflow, no
  crammed grid, no lonely single card.
- Every §3 field has a designed slot AND a designed fallback for missing/too-long input.
- Nothing in it trips Rich's "stupid/corny/professional" wire. (He is the final judge.)
- It uses only its pre-approved palette tokens and its own curated image set.

When all three are locked, Monti has something bulletproof to fill — and only THEN do we build the
part that talks. Frames first. Always frames first.

---

## 9. How to report back

Send the command-center chat (Claude): (a) the 6 rendered samples or screenshots, (b) any changes
you made to the §3 contract and why, (c) anything that fought you or any spot where "good every
time" felt at risk. Claude folds it into PROJECT-MEMORY.md and we move to the next packet (the
hidden /monti route + the conversation/validation engine).

*Frames first. Monti only fills. That's the whole game.*

---

## 10. HEAD START — you already have 2 of the 3 frames (verified 2026-07-19)

The `veteran-ai-websites` repo already contains three hand-built, production-quality example sites
under `app/examples/`. Two map directly onto Monti's verticals and are strong enough to become the
locked template bases — confirmed both in code AND rendering live:

- **Trades → `starter-plumbing`** ("Summit Plumbing"). **THE strongest base.** One self-contained
  client component with all CSS inline: split hero, sticky header w/ scroll-progress bar, emergency
  top bar, stats strip, 6-card services grid, feature bands, 3-step process, reviews, quote form,
  CTA band, footer, sticky mobile call bar. Navy/blue "grounded" palette, phone-first,
  licensed/insured, real WV voice ("right here in the mountains," "not a call center"). Mobile-first,
  accessible (focus-visible, aria labels). Verified rendering live at `/examples/starter-plumbing` —
  looks like a $3k site. **Use as the Trades template skeleton.**
- **Food → `premium-restaurant`** ("The Ridge Bistro"). Genuinely upscale "quiet luxury" — gold/dark
  palette, reveal animations, dish grid, tasting-menu feature, press quotes. Clears the no-cheese bar
  easily. ONE caveat: it's tuned for *fine dining*, but most WV food targets are diners/BBQ/cafés/
  breweries. Keep the structure + polish; dial the tone from "fine dining" to "warm, proud, local."
  **Use as the Food template base, warmth-adjusted.**
- **Tourism/Outdoors → nothing exists.** Build fresh. Borrow the plumbing component's clean CSS-token
  system + section rhythm as the structural start; swap to an "adventurous" forest/slate palette and
  a big landscape hero.
- (`complete-hvac` is a *second* trades reference — richer visuals, seasonal panels, but pulls from
  external data + CSS files and has an email-gate modal. Use it for ideas, not as the base.)

**CRITICAL refactor — this is the actual work of Packet A now.** These examples are HAND-AUTHORED
with hardcoded copy. To become Monti templates they must go from "fixed copy" to "fixed FRAME, filled
from the §3 JSON contract." The design is ~90% done; the remaining per-template work is:
1. **Parameterize every string** so all copy comes from the §3 fields (hero/about/services/trust/
   contact) as props — zero hardcoded text.
2. **Add the validation-gate fallback** to every slot (designed empty state + max-length clamp) so
   Monti physically cannot break the frame. Prove it with the sparse + full samples (§7).
3. **Lock palettes as tokens** — the plumbing file already uses CSS vars (`--navy`, `--blue`…), which
   is the right pattern; expose the 2–3 approved palettes per template via `palette`.
4. **Wire `hero_image_id`** to a small curated image set instead of one hardcoded photo; keep the
   dark scrim so headline text is always legible.
5. **Strip what doesn't belong** in a Monti-generated page (HVAC email-gate modal; hardcoded phone
   numbers → pull from the contract).

Net: **adapt 2 proven frames + build 1 new one, then make all 3 contract-driven.** Much shorter,
safer path to "locked" than starting blank. Files to stage from the repo:
`app/examples/starter-plumbing/page.tsx` (self-contained, best reference) ·
`app/examples/premium-restaurant/page.tsx` + `components/ridge-bistro/BistroShell` +
`lib/ridge-bistro-data` + `app/examples/premium-restaurant/ridge-bistro.css` ·
`app/examples/complete-hvac/page.tsx` + `lib/complete-hvac-data` + `.../complete-hvac.css`.
