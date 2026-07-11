# PAWRADE — Execution Plan for Opus 4.8 + Sonnet
### Finalized 2026-07-09 · Phase A shipped & verified · this plan takes the product to launch

> **How to run any task:** open this folder in Claude Code → select the task's model → paste the task block verbatim → the session auto-loads `CLAUDE.md` (laws, pipeline, state). Every task ends with the same three steps: `build.ps1` → cscript parse check → live browser verification (console + Harness). No task is "done" on code alone.
>
> **Model doctrine:** OPUS 4.8 = anything where fun/feel/character/writing is the risk, plus all Bible-compliance reviews. SONNET = anything below with an exact spec. Effort tags: [S]mall <1h · [M]edium 1-3h · [L]arge 3-6h.

---

## PHASE P0 — Polish debt from Phase A verification *(do first, ~half a day)*

| # | Task | Model | Size |
|---|------|-------|------|
| P0.1 | **Layout collision:** care chips overlap the pet nameplate in the den. Move nameplate + "day N together" line above the chips; verify at 3 window sizes (narrow phone ratio, square, wide) | Sonnet | S |
| P0.2 | **Frenchie silhouette** reads bunny-ish at grid size. Redesign the ears in `drawPet`: wider at base, rounder tips, inner-ear pink smaller; add the frenchie's signature head-tilt idle (rotate ±0.04 on its soul clock — no other breed tilts at idle). Squint test: 5 strangers must not say "bunny" | **Opus** | M |
| P0.3 | **Audio human pass** (cannot be automated): confirm scale notes ascend per parade pet, breed voices distinct, lullaby mix after 22:00, nothing clips. Tune gains only | **Opus** | S |
| P0.4 | **Reduced-motion + colorblind pass:** honor `prefers-reduced-motion` (breathing stays, everything else stills); verify breed distinctness in grayscale (silhouette shapes carry identity — ears differ per breed already; fix any ambiguity found) | Sonnet | M |
| P0.5 | **First-interaction reliability:** investigate the swallowed-first-click-after-reload quirk with a real mouse; if reproducible outside CDP, fix (likely needs a first-frame pointer capture) | Sonnet | S |

**Review gate:** Opus runs the §Review checklist on P0 output before Phase M starts.

---

## PHASE M — MERGE RESTORATION: link-to-merge core ✅ **BUILT + BROWSER-VERIFIED 2026-07-09** (plus the SLEEPIES antagonist, owner-ratified same day)

> **Verified live:** 3-pup link → hug → ONE stage-2 pet at path end (+108 = 12·3²·×1 exact) · stage-2 pets render larger w/ correct souls · deck/gravity/refill math exact · **yawn wave fired on merge #3, two pets slept (drooped, closed eyes, blue dust), 😴 meter 0%→5% exact** · sleepers excluded from linking · console clean. **Sleepies spec (now law):** yawn every 3rd merge hits 2 seeded-stream targets; merges wake adjacent sleepers; ≥62% asleep or no awake hug = "the nap won" (half pot, all pets doze gently). Sleep pressure = cool blue vignette (never red — cozy law).
> **Still unverified by play (same primitives, low risk — testers will hit them):** stage-2→3 merge, graduation walk-off, nap-topple end. M1 stage-3 art is v1-simple (wider + serene + halo + Chairman's bowtie; LONGCAT gets side-whiskers) — full M1 majesty pass remains open for Opus.

> Converts the verified link engine from link-to-clear into **link-to-MERGE**: a path of 3+ same critters hugs and becomes ONE next-stage critter at the path's end cell. Growth stages restore the number-go-up dopamine merge had in GREED; graduation feeds the den.

| # | Task | Model | Size |
|---|------|-------|------|
| M1 | **Stage system:** 3 growth stages per species (e.g. corgi: pup → corgi → THE LOAF; tabby: kitten → cat → LONGCAT; tux: kitten → cat → THE CHAIRMAN; shiba: pup → shiba → CLOUD; frenchie: pup → frenchie → THE GREMLIN — Opus names them all in-voice). `drawPet` gains a stage param: stage 2 = +25% size, fluffier silhouette, calmer eyes; stage 3 = +55%, signature accessory-free majesty (shape only, no props). Squint test per stage | **Opus** | L |
| M2 | **Merge resolution:** path of N same-species-same-stage (+ void wilds) → merge animation (the chain hugs INWARD along the path with anticipation, not a pop) → ONE stage+1 critter spawns at the path's END cell → score = 12·N² × stage multiplier (×1/×3/×9). Chain window: a merge landing adjacent to matching neighbors glows (invitation, no auto-cascade — player agency, deterministic law). Board space now RECOVERS through merging = deeper runs, more banking tension | **Opus** (feel) + Sonnet (logic) | L |
| M3 | **Graduation:** linking 3+ FINAL-stage critters = no score — they parade off the board into the den permanently (the den population is earned). One graduate per species type shows roaming in den v1's exterior scene immediately (full roaming behavior lands with B1) | Sonnet after M2 | M |
| M4 | **Rebalance:** deck 96 → retune (stages consume 3× pets per tier; target: median first-session reaches one stage-3; graduation ≈ every 2-3 good runs). Daily #N determinism unchanged | Sonnet + **Opus** playtest | M |
| M5 | **Harness re-verification:** full pointer-path test of merge → stage-2 merge → graduation on a seeded practice board; console clean; §Review checklist | **Opus** | S |

---

## PHASE B′ — THE BURROW: the home layer *(secondary by design: decoration + earned critters roaming + light care, ~2-3 days)*

| # | Task | Model | Size |
|---|------|-------|------|
| B1 | **Den scene v2 — the room that improves, with YOUR earned pets roaming it.** Interior den view (still two-light: hearth + moon through window). Furniture slots: rug, lamp, bunk bed, reading nook, window plants, picture frame (6 slots × 4 tiers = 24 items). Each purchased item is VISIBLY placed. **Graduated critters (from M3) ROAM: slow wander paths, nap on furniture they like, occasional two-pet snuggle piles** — the "pets running around your decorated home" owner vision, literal. Care taps (feed/play/gift) affect roamers' visible mood. Spend screen: lowercase, one item highlighted per day as "tonight's want" | **Opus** (scene+design+roaming feel) then Sonnet (catalog data + spend wiring) | L |
| B2 | **Dreamlight economy:** price curve so a daily player furnishes something small ~every 2-3 days early, slower later (item 1: 15 ✦ … item 24: 400 ✦). After every daily result: "tonight's tucking bought the fireplace." messaging when a purchase unlocks | Sonnet | M |
| B3 | **Rescue cadence:** rescue #2 at streak 3 (Biscuit — golden pup found behind the bakery, smells like cinnamon, extremely proud of a stick), rescue #3 at streak 7 (the void cat — "she was never found. she simply decided."; she never blinks in the den; eyes follow the pointer). Arrival scenes reuse the rain-box pattern with new one-line stories. All rescues live in the den with idle souls + nameplates | **Opus** (stories/scenes) + Sonnet (plumbing) | M |
| B4 | **Rescue memory:** each rescue's den nameplate shows "rescued N days ago" on hover/tap; day-100 candle detail (no announcement — Bible law) | Sonnet | S |
| B5 | **Pet cameo in the parade:** your created pet leads the parade exit animation on streak-milestone days (3/7/30) — walks across the top of the grid ahead of the chain | **Opus** | M |

**Gate B′ (human):** show the den to 3 people who saw Phase A. Metric: does anyone ask "how do I get the fireplace?" unprompted — that's meta-pull existing.

---

## PHASE C′ — THE SHARE ENGINE *(virality hardware, ~1-2 days)*

| # | Task | Model | Size |
|---|------|-------|------|
| C1 | **The polaroid share card:** canvas-render a 1080×1350 image — tonight's actual den (pets included, current furniture), score handwritten in Caveat, "PAWRADE #N", worn-paper border, tiny grain. Copy-image to clipboard + Web Share API on mobile; text fallback stays | **Opus** (composition) + Sonnet (clipboard/share plumbing) | L |
| C2 | **Topple mercy moment:** after a topple, your pet walks to the camera and sits with you for 1.2s before results (Bible detail #15). Anticipation + follow-through per the timing table | **Opus** | M |
| C3 | **Blanket tuck animation:** TUCK confirm = a knitted blanket (visible mended patch — Bible #16) unrolls over the grid with a cloth curve, lamp dims, one collective sigh note. 700ms, never linear | **Opus** | M |
| C4 | **OG/social meta:** og:image (a den polaroid), title/description in the narrator's voice | Sonnet | S |

---

## PHASE D′ — SHIP *(distribution, ~1-2 days + review queues)*

| # | Task | Model | Size |
|---|------|-------|------|
| D1 | **Name clearance:** search "PAWRADE" across app stores/trademark databases/domains; if conflicted, shortlist alternates in the same voice (the narrator names it). Register domain | Sonnet (search) + **Opus** (naming call) + HUMAN (purchase) | S |
| D2 | **Cloudflare Pages deploy** + PWA (manifest, icon = Mochi face, offline-capable — it already is; installable). Update share URLs to the real domain | Sonnet | M |
| D3 | **Portal builds:** endless "stroll" as the portal-facing mode; CrazyGames SDK wrapper build + GameDistribution build (separate build.ps1 targets; ads only at natural breaks — between strolls, never mid-daily). Submit both + Poki (accept slower curation) | Sonnet | L |
| D4 | **Privacy page + about page** ("built by one person and two AIs who argued about corgi physics") in the narrator voice | **Opus** writes, Sonnet wires | S |

---

## PHASE E′ — MONEY WORTH PAYING *(after D′ is live, ~1 day)*

| # | Task | Model | Size |
|---|------|-------|------|
| E1 | **The Supporter Lantern ($3.99, Stripe Payment Link):** pajama + bandana + winter-coat cosmetics for YOUR pet and all rescues, one exclusive den item (the second lantern — echoing the day-100 detail), supporter flair on the polaroid (a tiny stitched heart), and the warm truth on the buy page: "this buys nothing but love and keeps the lights on." Unlock via code entered in-app (zero backend: signed code validated client-side) | **Opus** (offer design + copy) + Sonnet (Stripe + unlock plumbing) | M |
| E2 | Store-wrap prep (deferred until traction): TWA/Capacitor configs documented, IAP mapping of E1 | Sonnet | S |

**Monetization law reminder:** all cosmetic, nothing gameplay, no chance, no urgency timers on purchases. The buy screen must pass the same lowercase-voice review as any whisper.

---

## PHASE F′ — MEASURE & DECIDE *(ongoing after ship)*

- **Gate A′ (the aww test):** the same end users who rejected GREED. Pass = audible "aww" + unprompted replay + anyone asking about the fireplace.
- **Optional percentile worker** (the one sanctioned backend): daily score distribution → "you tucked more than 68% of the world." Cloudflare Worker + KV, ~free tier. Only build after ship. [Sonnet M]
- **Gate D (week 8, pre-committed):** persevere only if a portal accepted with week-over-week growth OR ≥20% next-day return OR visible organic shares. Otherwise: the engine (link/parade/den) is proven modular — swap the wrapper, not the soul.

---

## §Review — Bible-compliance checklist (Opus runs after every Sonnet task)
1. Two lights per scene, exactly? Grain overlay intact?
2. Anything popping instead of arriving? Any per-frame (non-dt) animation added?
3. Any two creatures blinking/breathing in sync?
4. All new copy: lowercase whispers, ≤1 "!", zero gamer jargon, narrator voice?
5. Any new detail announcing itself (popup/badge)? → strip the announcement
6. Laws 1-6 in CLAUDE.md untouched? cscript parse passes? Console clean? Harness path links?

## §Harness — gameplay verification snippet (paste in browser console / javascript_tool)
```js
// walks a real pointer path through cells [(col,row),...] — adjacency: 8-way, same breed (+ void wild)
(async function (cells) {
  var cv = document.getElementById('cv'), r = cv.getBoundingClientRect();
  function pt(c){return {x:r.left+(114+c[0]*96)*(r.width/720), y:r.top+(306+c[1]*96)*(r.height/1160)};}
  function fire(t,el,p){el.dispatchEvent(new PointerEvent(t,{bubbles:true,cancelable:true,clientX:p.x,clientY:p.y,pointerId:1,isPrimary:true}));}
  fire('pointerdown',cv,pt(cells[0]));
  for (var i=0;i<cells.length;i++){await new Promise(function(s){setTimeout(s,90);});fire('pointermove',window,pt(cells[i]));}
  await new Promise(function(s){setTimeout(s,120);});
  fire('pointerup',window,pt(cells[cells.length-1]));
})([[0,3],[1,3],[2,4]]); // edit path per today's board
```

## Sequencing summary
**P0 → M → B′ → C′ → D′ → E′ → F′.** The merge core (M) lands before the den build (B′) because the puzzle is the product and the den's population is earned in it — the two are one loop, in that order. Polish budget law: 40% of each phase reserved for feel — if a phase runs over, features are cut before polish is. The den still ships before portals (D′): distribution without the fireplace repeats GREED's mistake.
