## Hero Section Implementation - Session Notes (2025-11-16)

### Summary
- Implemented a new hero section in `src/app/components/home/hero-section/` aligned with the existing Angular Material/Tailwind v4 setup, using bilingual constraints (Bulgarian only).
- Added Bulgarian headline/subheadline, feature badges, scarcity messaging with live spots left, and a single primary CTA that scrolls to the signup form.
- Preserved dependencies and performance constraints; used CSS gradients and lightweight iconography.

### Key Decisions
- Copy (BG):
  - Headline: “Вашият интелигентен помощник за продажби — автоматизирайте, предотвратявайте грешки и развивайте бизнеса си”
  - Subheadline emphasizing EUR conversion readiness, VIES checks, fiscal receipts, and СУПТО compatibility.
  - Badges: EUR conversion (2026), real‑time VIES checks, СУПТО, Fiscal receipts (Datecs, Tremol, Daisy, др.), AI analytics (upcoming).
  - Short compliance note for СУПТО included.
- Scarcity:
  - Total places: 100; live “spots left” computed as 100 − registered count.
  - Bound `registerdUsersCount()` from `HomePage` to hero via input for dynamic display.
- CTA:
  - Single primary CTA “Запази място в пилотната вълна” scrolls to `#signup-form` via `NavigationService`.
- Visuals:
  - Right column card with subtle gradient blobs and feature highlight tiles; no heavy imagery.
  - Placeholder customer logos as neutral boxes.

### Files Changed
- `src/app/components/home/hero-section/hero-section.component.ts`
  - Standalone imports for `MatButtonModule`, `MatIconModule`.
  - Inputs: `registerdUsersCount`; computed `spotsLeft`; method to scroll to anchor.
- `src/app/components/home/hero-section/hero-section.component.html`
  - Two‑column responsive layout with Tailwind classes, badges, CTA, scarcity, disclaimers, placeholders, and visual card.
  - Tailwind v4 important class order normalized (`text-base!`).
- `src/app/pages/home/home.page.html`
  - Passed `[registerdUsersCount]="registerdUsersCount()"` to hero.

### Notes
- Countdown logic remains external as per prior implementation notes; hero shows dynamic seats left only.
- No new dependencies added. Lint passes.

### Follow-ups (optional)
- Replace placeholder logos with real assets when available.
- If countdown display is required in the hero, expose the existing end time or countdown state from `HomePage` and bind similarly.


## Session Update - Add optimized customer logo (2025-11-16)

### Summary
- Replaced one placeholder logo tile in `hero-section` with an optimized image for "Саламандър 911" using Angular's `NgOptimizedImage`.

### Decisions
- Reuse the image optimization approach already present in `below-hero-section` by importing `NgOptimizedImage` into `HeroSectionComponent`.
- Use `fill` mode with a `relative` parent and `object-contain` to respect the fixed tile height (`h-10`) without layout shift.
- Serve the asset from the public images folder: `/public/images/cutomer_logos/salamander.png` (kept existing directory name).

### Files Changed
- `src/app/components/home/hero-section/hero-section.component.ts`
  - Added `NgOptimizedImage` to standalone `imports`.
- `src/app/components/home/hero-section/hero-section.component.html`
  - Replaced the first placeholder tile with:
    - `<img ngSrc="/images/cutomer_logos/salamander.png" alt="Саламандър 911" fill class="object-contain" />`
    - Wrapped in a `relative h-10 rounded-md` container.

### Rationale
- `NgOptimizedImage` ensures proper loading behavior and opt-in priority handling, while `fill` avoids the need to hardcode logo dimensions inside a small grid tile.


