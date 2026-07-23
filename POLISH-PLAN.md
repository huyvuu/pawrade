# PAWRADE — POLISH PLAN: rescue satisfaction · every-pet interactivity · finished UI
### 2026-07-13 · from owner playtest: "rescue feels unsatisfying · other animals can't be interacted with · UI feels unfinished/amateurish"
### Benchmarked against the best-polished cozy/pet apps. Written so Opus 4.8 and Sonnet 5 can execute directly.
### Model doctrine (unchanged): **Opus 4.8 owns every task where "does it feel right" is the risk. Sonnet 5 owns tasks specified exactly below.** After every Sonnet task: run the Craft-Bible checklist (BUILD-PLAN §Review) + cscript parse gate + live verify in FOCUSABLE Chrome (in-app pane pauses rAF).

---

# PART 1 — WHAT THE BEST APPS DO (research findings)

**Neko Atsume (the reference for earned animal trust):** a memento is *proof the cat trusts you* — earned only through repeated correct care, useless in gameplay, and the single most beloved feature. Lesson: the payoff of animal trust must be a *keepsake with story value*, not a stat bump. Personality is expressed through the gift.
**Animal Crossing (the reference for adoption arcs):** villagers are courted through a multi-step friendship loop (repeated visits, fulfilled requests) before the move-in ceremony; friendship is a *visible level* per villager; the design never punishes absence. Lesson: adoption = courtship with visible progress + a ceremony beat, and every resident remains a full character afterward.
**Cats & Soup / Adorable Home (the reference for multi-pet interactivity):** EVERY cat is tappable, dressable, photographable, and produces hearts; feedback is subtle-but-everywhere (micro-animations on each interaction); soft palettes + gentle transitions carry the cozy feel. Lesson: no decorative animals — every creature responds or the world reads dead.
**Polish literature (pro-vs-amateur):** the separator is *motion + feedback + integration*: button state micro-animations, smooth screen transitions, HUD pulses, UI that shares the game world's art language. "Static and disconnected" is the amateur signature. PAWRADE's specific amateur signals today: OS emoji as iconography, plain-drawn text headers, DOM buttons visually divorced from canvas art, reward numbers that appear rather than *travel*.

# PART 2 — THE THREE WORKSTREAMS

Recommended order: **C0 (tokens, 1 task) → A (rescue) → B (every pet real) → C1–C3 (UI system) → C4 (audit)**, so all new A/B UI is built on the new design system. Dopamine plan (#36–38) queues after; #38 still depends on B5.

---

## WORKSTREAM A — RESCUE RITUAL 2.0 (pain #1: "unsatisfying")
Root cause of the pain: coax = the same tap repeated (+4 trust each), no choices, no ceremony beats, no keepsake. It's a meter being filled, not a relationship being earned.

### A1 · Arrival ceremony (owner: **Opus 4.8** — pure feel) — task #40
Replace the instant arrival modal with a 3-beat scripted scene on the den canvas: (1) night only — a faint scratching sound + the lantern flickers + "someone's outside…" whisper; (2) the door edge creaks open, a small wet silhouette DASHES to behind the crate (fast, scared — never suffering); (3) the existing adopt modal (name them) reframed as "leave the door open for her?" → she stays, hiding. Guardrails: ≤10s, skippable after first view, all law-#3 compliant (scared-of-newness, never in danger), lowercase whispers.

### A2 · Coax verbs + chunky trust (owner: **Opus 4.8** — interaction feel) — task #41
Replace tap-spam with a **verb ritual**: tapping the rescue opens a 4-chip radial: `[sit near] [leave a treat] [soft words] [roll a toy]`. Each rescue has a hidden favorite (derived from `trait`/breed, deterministic); favorite = +12 trust with a unique big reaction (peek out, ear swivel, half-step closer); others = +4 with a small reaction; a gentle miss-line for none ("she pressed deeper into the dark — too soon"). Each verb usable once per real day per rescue (the ritual is daily, not grindable — replaces the current flat +4 uncooled tap). Trust meter becomes VISIBLE: a small heart-bar above her that fills in chunky animated segments, with stage crossings (25/55/85) celebrated as mini-moments (first time she eats while you watch · first time she doesn't hide · first touch). Keep `advanceRescueRitual()` daily passive gain unchanged.

### A3 · The Crossing (owner: **Opus 4.8** — the payoff scene) — task #42
At trust ≥85, one scripted ~8s scene: she walks across the room TO the player's primary pet, they touch noses, hearts burst, THEN the existing glow-up polaroid fires. Afterward she picks a favorite spot (a furniture tile if owned — ties to B5) and is promoted to a full den resident (B1 entity). The glow-up/copy-share machinery already exists — this task only builds the walk + nose-touch choreography and the favorite-spot assignment.

### A4 · Mementos (owner: **Sonnet 5** — exactly specified) — task #43
Neko-Atsume-style keepsakes. Spec: new save field `save.mementos = { petKey: {id, day} }`. Each rescue at trust 100 (and each graduate, 15% seeded chance per real day, max 1/day globally) leaves a memento at the den door tile (0,0): draw a small wrapped bundle; tap → reveal card (canvas overlay, reuse glowup-ov pattern) naming the item + a one-line story ("a bottle cap. she guarded it like treasure."). 12-item memento table (id, name, line, tiny parametric drawer each ≤15 lines). Album gets a memento shelf row (reuse dreams-cv row pattern). Acceptance: memento appears ≤2 days after first rescue completes; reveal card renders; album row shows collected/total; parse gate green; no rng stream shared with deck/bot.

## WORKSTREAM B — EVERY PET IS REAL (pain #2: "other animals can't be interacted with")
Root cause: only the primary pet has tap/care handlers; graduates+rescues are draw-only.

### B1 · Unified interactive den entities (owner: **Sonnet 5**) — task #44
Spec: introduce `denActors[]` built each den frame: `{kind:'pet'|'grad'|'rescue', ref, x, y, r, wander}` (positions already computed — collect them instead of scattering). onDown den hit-test iterates denActors nearest-first: primary pet keeps `petReact('pat')`; graduates get a new `gradReact(actor)` — bounce + 2-4 hearts + a soft chirp note + one whisper from a per-breed 3-line pool ("the longcat permits this."); rescues keep coax (A2). Add per-grad `IdleSoul`s (currently g0/g1 exist — keep). Acceptance: tapping EVERY visible critter produces a visible+audible reaction; `window._pw()` exposes `denActors` count+positions for tests; no hit-test regression on care chips/nav arrows (verify by scripted taps).

### B2 · Pet profile cards (owner: **Sonnet 5**) — task #45
Spec: double-tap (two taps <350ms same actor) opens a profile overlay (new `profile-ov` in body.html, modal styling copied from wardrobe-ov): live portrait canvas (drawPet, breathing), name (renameable — input + save), breed + stage word, trait line, arrival story (grads: "graduated night N" from a new `save.gradMeta[breed]={night}` recorded at graduation, fallback "one of the first"; rescues: "found {found-line}, day N"), bond hearts (grads get `save.gradBond[breed]` 0-5, +1 per 3 pats, capped), memento thumbnail if owned (A4). Acceptance: opens for every actor kind; rename persists reload; no cscript-gate ES5 violations (plain functions only).

### B3 · Wants: thought bubbles (owner: **Opus 4.8** — cadence/feel risk) — task #46
Occasionally (non-synced, one at a time, ≥90s apart) a random den critter shows a soft thought bubble: 🍖/🎾/💤/💛-equivalent drawn icons (C1 language). Fulfilling it (tap the bubble, or the matching care chip while bubbled) = big heart burst + bond+1 + whisper. Ignore = it fades harmlessly (no guilt, law #3). Feel goals: rare enough to be a delight, never a checklist.

### B4 · Pair behaviors (owner: **Opus 4.8**) — task #47
Occasional two-critter moments (≥3 min apart, non-synced): walk-to-each-other + nose boop + shared heart; curl-up-adjacent nap; slow chase (two waypoint followers). Pure presentation, no state. Feel goal: catching one mid-moment reads as "they live here even when I'm gone."

### B5 · Room styles + wall decor + pets USE furniture (owner: **Sonnet 5**; was task #34) — task #34 (updated)
Spec: (1) `save.denStyle={wall:0..3, floor:0..3}` — 4 wall + 4 floor palettes (const tables; furnish mode gets two swatch rows above the catalog; free to switch once bought for ✦60 each beyond the first). (2) Wall slots: 2 fixed mounts per wall (window/painting/shelf-art items added to ISO_FURN with `wall:'L'|'R'`, drawn on the wall plane). (3) Pets use furniture: wander waypoint pool += owned bed/cushion/hearth-adjacent/bowl tiles; on arrival at one, enter `using` state 8-20s (bed→sleeping pose on the furniture; hearth→sit + warm glow tint; bowl→eat loop reusing petReact crumbs), then resume. Acceptance: style switch persists; wall items depth-sort behind floor actors; each furniture type visibly used within 90s of watching with 3+ owned pieces; #38's love-payoff can call `sendActorTo(tile)`.

## WORKSTREAM C — THE FINISH PASS (pain #3: "unfinished/amateurish")

### C0 · Design tokens + art direction spec (owner: **Opus 4.8** — the taste call; FIRST TASK of the whole plan) — task #39
Deliverable is a SPEC (in this file, appended) that C1–C3 implement: exact corner radii set {20 modal / 14 button / 10 chip}, shadow recipe (1 ambient + 1 key, no more), type scale (Baloo 2: 34/26/21/17 · Fredoka: 17/15/12 — kill all other sizes), spacing unit (8px grid), the 10-icon drawn-icon language replacing ALL UI emoji (paw, moon, hanger, book, sofa, heart, star, gift, bone, ball — simple 2-tone canvas path drawers matching pet art), currency presentation rule (✦ always gold #ffca7a, always animates when it changes), one-gold-CTA-per-screen rule.

### C1 · Icon set implementation (owner: **Sonnet 5**) — task #48
Replace every emoji in chrome UI (bar icons, care chips, buttons, HUD) with C0's drawn icons — `drawIcon(ctx,name,x,y,size,color)` atlas function + DOM usage via tiny per-icon canvas elements. Emoji stays ONLY in whisper/toast prose and share text. Acceptance: zero emoji in persistent chrome at rest; icons legible at 20px; parse gate green.

### C2 · Motion pass (owner: **Sonnet 5**) — task #49
Spec: (1) ✦ changes fly gold motes from source to the header counter, counter ticks up (reuse flyer pattern); (2) all overlays get the existing unroll spring (audit stragglers: leave-ov, glowup-ov, profile-ov); (3) DOM buttons get :active scale(.97) uniformly; (4) care chips entrance-stagger 60ms on den arrival; (5) whisper crossfades (no text swap while visible). All time-based (Bible law).

### C3 · DOM/canvas unification + header plaque (owner: **Sonnet 5**) — task #50
Spec: DOM modals/buttons get the canvas art language — 2px grain texture overlay (reuse #grain), consistent border `1.5px var(--line)`, the C0 shadow recipe (audit every .modal/.btn/.chip/.iconbtn). Redraw the den/map/play headers as a proper plaque: rounded panel + tiny paw icon + baseline-aligned stats with drawn ✦/🕯 icons (C1), replacing plain fillText lines. Acceptance: side-by-side screenshot den before/after; no layout collisions at 360px/414px widths (DevTools device emulation).

### C4 · Final feel audit (owner: **Opus 4.8**) — task #51
Full pass on-device-size: every screen screenshotted at 2 widths, collision + hierarchy + voice check against the Craft Bible (two-light, grain, nothing pops, lowercase whispers, ≤1 exclamation), fix list executed, then deploy + docs.

# PART 3 — EXECUTION NOTES (for whichever model picks a task up)
- Build/verify pipeline per CLAUDE.md: edit `game.js`/`body.html`/`style.css` → `build.ps1` → `cscript //E:JScript //Nologo game.js` ("'document' is undefined" = parse OK) → live verify at http://localhost:8789 in a FOCUSABLE tab → commit → `git push origin main` deploys https://huyvuu.github.io/pawrade/ → update CLAUDE.md/ROADMAP/memory.
- ES5 only (var/function; no getters — they kill the cscript gate). No new rng streams touching deck/bot streams. All animation time-based. Laws #1–#6 binding.
- Task order: #39 → #40 → #41 → #42 → #43 → #44 → #45 → #46 → #47 → #34 → #48 → #49 → #50 → #51, then dopamine #36 → #37 → #38. Dependencies recorded in the task list: #42←#41, #45←#44, #48/#49/#50←#39, #51←#48+#49+#50, #38←#34.

---

# PART 4 — C0 DESIGN SYSTEM (the binding spec · task #39 deliverable · Opus 4.8 taste call)
The one rule: **the DOM chrome must look like it was drawn by the same hand as the pets.** Flat, warm, rounded, two-light, hand-illustrated — never default-OS. Everything below is a hard constraint for #48–#51.

## 4.1 Color tokens (formalize the existing `:root`; do not invent new hues)
| token | hex | use |
|---|---|---|
| `--honey` | `#ffca7a` | THE accent. gold CTAs, ✦ currency, active states, focus. one saturated gold moment per screen. |
| `--pink` | `#e8b4c8` | warmth / whisper / hand-text / affection (hearts, blush). |
| `--ink` | `#f6efe6` | primary text on dark. |
| `--dim` | `#b9a9c9` | secondary text, captions, inactive icon. |
| `--plum`/`--panel`/`--deep` | `#33244e`/`#2a1d3d`/`#1d1526` | surfaces back→front. |
| `--line` | `#574371` | every border, 1.5px. |
| semantic | `#8fd0a4` good · `#e8879e` alert-soft | ONLY for owned/affordable ticks & gentle warnings. never as accent. |
Neutrals are plum-biased on purpose (a grey with the accent's hue = "chosen," not default). Dark-first; the game is single-theme night by design — no light mode (a deliberate committed world, not an omission).

## 4.2 Type scale (kill every off-scale size)
- **Baloo 2** (800, display): `34` den title · `26` modal logo · `21` section head · `17` button/label. letter-spacing .5px on ≤17.
- **Fredoka** (400/500, body): `17` body · `15` subline · `12` caption/badge (700, +1px tracking, often uppercase).
- **Caveat** (cursive, voice): whisper/hand only, `clamp(15,2.6vh,24)`. never for UI labels.
- Nothing else. Audit `game.js` fillText + `style.css` for stragglers (28/30/24/22/20/16/14/13/11/10.5 → snap to nearest scale step).

## 4.3 Shape & depth (the chunky flat language — keep it, systematize it)
- Radii: **modal 20 · button/card 14 · chip/badge 10 · pill 24**. no other radii.
- Depth = the chunky bottom (flat, not blurry): CTA `box-shadow: 0 5px 0 <shade>, 0 0 22px rgba(255,196,107,.28)` · soft button `0 4px 0 #241830` · chip `0 3px 0 #241830`. `:active` drops to `0 2px 0` + `translateY(3px)`. ONE ambient blur allowed on modals only: `0 18px 70px rgba(0,0,0,.6)`.
- Every DOM surface (modal/button/chip/iconbtn) carries the `#grain` texture (2px, .05 overlay) so it shares the canvas's tactile grain. border always `1.5px var(--line)`.

## 4.4 Icon language (10 drawn icons — replace ALL chrome emoji)
`drawIcon(ctx, name, x, y, size, color)` — one atlas fn, each icon a ≤12-line 2-tone path centered in a `size×size` box, stroke-weight `size*0.09`, rounded caps, matching the pets' soft-vector feel. DOM usage: a tiny `<canvas>` per icon slot (12–22px) painted at init + on theme events.
| name | replaces | form |
|---|---|---|
| `paw` | 🐾 parade | 3 toe-beans + pad |
| `moon` | 🏠/night | the existing crescent, canonized |
| `hanger` | 👗 wardrobe | shoulder-curve + hook |
| `book` | 📖 dreams | open book, 2 pages + spine |
| `sofa` | 🛋 furnish | 2-cushion couch silhouette |
| `heart` | 💛 bond | rounded heart, honey or pink |
| `spark` | ✦ dreamlight | 4-point sparkle (currency mark) |
| `gift` | 🎁 | box + bow |
| `bone` | 🍖 feed | dog bone |
| `ball` | 🎾 play | circle + seam arc |
| `candle` | 🕯 streak | flame + stick (11th, tiny) |
Emoji survives ONLY in whisper/toast prose, share text, and the birthday cake moment (intentional warmth, not chrome).

## 4.5 Motion tokens (all time-based — Bible law; never per-frame increments)
- transition `.transform/.opacity 120ms ease` on interactive; overlay unroll = existing `cubic-bezier(.2,.9,.25,1.05) 450ms`.
- `:active` press = `scale(.97)` uniform, 90ms.
- currency change = gold `spark` motes fly source→header counter (reuse flyer system) + counter count-up (reuse scoreShown lerp). NEVER snap a ✦ number.
- entrances stagger 60ms; whisper crossfades (opacity, no mid-visible text swap).

## 4.6 Layout / spacing
- 8px grid for all padding/gaps/margins. bar at 5% side insets (existing). safe-area: nothing critical below 92%vh.
- one gold CTA per screen (the primary verb); everything else is soft/plum. hierarchy by weight+color, not size inflation.
- responsive: verify 360px & 414px; wide content (catalog, album) scrolls in its own container, body never scrolls sideways.

## 4.7 Voice (already Bible law — restated as a token)
lowercase whispers · ≤1 exclamation per screen · verbs say what happens ("tuck them in" → toast "tucked in") · errors are gentle and actionable ("not enough dreamlight" not "ERROR"). specific > cute.

**Acceptance for #39:** this section exists and is precise enough that #48–#51 need no further taste decisions. ✅ (delivered 2026-07-13)
