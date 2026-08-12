# Veteran AI Websites — Site Overhaul Plan

*Converged plan from Claude + Grok, run through Rich's "professional, no-cheese" bar. 2026-07-18.*

## North star
The site should feel like it was built by someone who has **stood in the same trenches as his
clients** — not someone trying to impress them with technology. **AI is the quiet advantage, not
the headline.** The **network is the real moat**, and it starts with real introductions, not
software. Premium-quiet beats flashy-loud for an audience that buys trust.

## Diagnosis
The site is genuinely well-built (gorgeous Glade Creek grist-mill hero, warm veteran/WV branding,
clean dark modern body, clear pricing). But the word "AI" appears nowhere except the logo, nothing
signals the differentiator, and the analog hero is so strong it actively buries the AI story. The
fix is NOT more flash — it's telling the right story and adding restraint.

---

## Priority order (do it in THIS order)

### 1. Reposition the hero copy — FIRST (biggest win, nearly free, ~10 min)
Stop leading with "AI"; lead with Rich. AI is the enabler, not the brand. Three real options:

- **A (recommended):** "A professional website in a day."
  sub: "Built by a West Virginia veteran who spent 15 years working alongside small business
  owners — not a tech guy selling you software."
- **B:** "Your site. Ready tomorrow."
  sub: "Fifteen years in the trenches with small business owners. Now I use AI so you get a real
  site without the agency price or the three-month wait."
- **C:** "Veteran-owned. Built in a day. Priced so it doesn't hurt. No jargon, no runaround."

### 2. Monti "coming soon" teaser — copy only, ships with #1
Placed directly after the hero, entering the dark modern half. Restrained tone:
> **Monti is almost here.**
> A faster way to see what your site could look like — built live while you talk.
> Coming soon.

Rules: same type scale as the rest of the site, no waveform, no glow, no "chat with me" language.
Quiet, confident teaser — not a gimmick.

### 3. The network seed — start NOW, no software (the long game)
Don't *build* a community — *be* one. Relationships first; software maybe never.
- **The habit:** after every delivered site, send ONE short text introducing that client to one
  other local business Rich trusts. e.g. "Hey Mike, just built a site for a cabin outfitter near
  you looking for a good plumber to send guests to — want an intro?" Track in a simple note. Goal:
  one meaningful intro per completed site.
- **One quiet site line** (on the thank-you / next-steps screen after inquiry/booking):
  "Once your site is live, I often introduce owners to other solid local businesses when it makes
  sense. No spam — just useful connections."
- That's the entire seed. No directory, no community page, no software.

### 4. The transition — build LAST (the fun part is the least urgent)
Kill the black hole (too gimmicky). The version that survives = **combine, restrained**:
- Rich's short rendered cinematic (8–10 sec, made in Grok Imagine + CapCut, web-optimized) does
  the emotional open and **ends on a still of the mill**.
- Then a **restrained scroll-driven desaturation dissolve** — fall colors cooling into deep
  navy/black, the mill quietly becoming the dark modern section — does the quiet handoff.
- Feel: **crossing a threshold, not falling through a wormhole.** No glitches, no particles, no
  sci-fi. "A pure scroll version feels incomplete; a pure black-hole video feels gimmicky; this is
  the restrained middle that still feels intentional."
- Build this only AFTER the copy is fixed and Monti is actually real.

---

## Build prompt for steps 1 + 2 (paste into Grok Build)
Repo: veteran-ai-websites. Reposition hero (headline "A professional website in a day." + the
veteran subhead, keep eyebrow/mill/CTAs; if the hero cycles phrases keep animation but lead with
that phrase and keep the subhead visible). Add a "Monti coming soon" teaser section right after the
hero (eyebrow COMING SOON / "Monti is almost here." / "A faster way to see what your site could
look like — built live while you talk.") — same styling, no glow/waveform/animation. Copy only,
match Tailwind, typecheck, commit "Reposition hero around the veteran story + add Monti coming-soon
teaser", push to main.
