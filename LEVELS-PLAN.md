# PAWRADE — LEVEL VARIETY OVERHAUL ("the complexity staircase")
### 2026-07-13 · owner: "the levels feel stale and not interesting."
### Benchmarked against Candy Crush Saga's actual level-design doctrine (King design talks + level-design studies).
### PRIORITY NOTE: CLAUDE.md law — **the puzzle is PRIMARY**. Stale levels are a core-loop failure and outrank the remaining UI polish. This workstream (D) jumps ahead of workstream C.

---

# PART 1 — HOW CANDY CRUSH ACTUALLY DOES IT (research findings)

1. **The complexity staircase.** New *blockers* are introduced progressively — simple ones early, complex ones once you've proven mastery. New mechanics appear "only when existing mechanics cannot support desired level types," not on a rigid clock, but the felt cadence is a new toy every episode (~15 levels).
2. **Blockers must create CHOICES, not just obstruction.** King explicitly shifted philosophy: early blockers merely "restricted space or absorbed moves"; modern ones "interact with objectives, special candies and board layouts in ways that reward planning." This is the single most important lesson for us.
3. **Variety comes from MIXING, not escalating.** They deliberately vary difficulty rather than ramping monotonically, and combine established blockers with recent ones. They "mix up game board shapes with blockers of different sizes."
4. **Every level has a hook** — one clear idea, with an intended objective, difficulty target, and audience before a single tile is placed.
5. **Objectives change the VERB.** Score / clear-the-jelly / bring-ingredients-down / order-collection / timed are *different games* sharing one mechanic.
6. **Bots estimate difficulty pre-release.** They simulate many plays to predict difficulty. **We already own this: `computeBotPar`.**
7. **Human-authored intent, tool-assisted tuning.** Not procedural soup.

# PART 2 — WHY PAWRADE FEELS STALE (honest diagnosis)

| Candy Crush lever | PAWRADE today | Verdict |
|---|---|---|
| ~15+ blockers on a staircase | **ONE** mechanic (the Sleepies) for all 40 nights | ❌ nothing new is ever taught after night 1 |
| Board shapes vary wildly | full rectangle + `MASKS[8]` tiny 2–4 cell edge blobs, recycled `id % 8` | ❌ every board reads identical; shapes repeat every 8 nights |
| Objectives change the verb | 5 objectives, but HUGS/SCORE/MAJESTY/BEATBOT are all "score more" | 🟡 effectively 2 verbs (score, wake) |
| Mix, don't escalate | difficulty = raise breed count, shrink deck | ❌ monotonic number-ramp = grind |
| Episodes with a new toy | 2 streets × 20, no theming, no new-toy cadence | ❌ no rhythm |
| Bot-tuned difficulty | `computeBotPar` exists and is per-night | ✅ **asset already in hand** |

**Root cause in one line:** PAWRADE varies *numbers*; Candy Crush varies *rules*. Forty nights of "same board, slightly harder" is the definition of stale.

# PART 3 — THE FIX: eight cozy blockers on a staircase

Every mechanic below obeys the laws: **no cruelty**, and the legal fence **"pets are never trapped/imprisoned by the puzzle"** — so nothing is ever "free the caged pet." These are *house* obstacles in a cozy home, and most create a CHOICE rather than a wall (per King's own philosophy shift).

| # | Mechanic | Cozy fiction | What it does | Choice it creates | Taught at night |
|---|---|---|---|---|---|
| 1 | **The Sleepies** *(exists)* | pets doze off | dozing pets can't link; adjacent merge wakes them | route merges to wake the right ones | 1 |
| 2 | **Quilt squares** | a quilt over the floorboards | tile is covered; a merge touching it folds the quilt away (1–2 layers) | *the jelly analogue* — unlocks the TIDY objective | 4 |
| 3 | **Walk-home pups** | a pup wants to reach the door | a special pet must be brought to the bottom row via gravity | *the ingredient analogue* — plan drops, not just matches | 8 |
| 4 | **Yarn tangle** | a knot of yarn | blocks the link path; a merge adjacent unravels one layer | clear it vs. route around it | 12 |
| 5 | **Moonbeam tile** | a shaft of moonlight | merges completed **on** it score ×2 | greed vs. efficiency — a *positive* blocker | 16 |
| 6 | **The draft** | a cold spot by the window | any pet landing here falls asleep next turn | routing + timing, not obstruction | 21 |
| 7 | **Toybox spill** | a toybox that keeps spilling | re-emits one pet of a set breed each merge until merged adjacent | pressure to deal with it *now* (the chocolate analogue, made gentle) | 26 |
| 8 | ~~**The stairs**~~ | ~~a step in the floor~~ | ~~one row shifts sideways after every merge~~ | **CUT (2026-07-13)** — a board that rearranges itself violates the Craft-Bible law *"nothing pops, everything arrives"*, and a shifting row makes `computeBotPar` unstable (par would swing run to run). The other seven carry the variety without it. | — |

Plus **board SHAPES** (the biggest perceived-variety win per unit of work): replace tiny edge masks with ~20 authored silhouettes — hourglass, cross, two islands, keyhole, heart, diagonal bands, chevron, donut. The segmented-gravity algorithm from task #26 already supports arbitrary blocked cells, so shapes cost *data, not engine*.

**New objectives (verbs, not numbers):** `TIDY` (fold every quilt) · `WALKHOME` (get N pups to the door) · `UNTANGLE` (clear all yarn) — joining the existing five.

**Episode structure:** 4 streets × 10 nights. Each street opens with a **teach night** (one new mechanic, gentle, near-unloseable), mixes it with everything prior across nights 2–9, and ends on a **curveball** night. Street themes give visual identity (the hallway / the sunroom / the attic / the garden at night).

**Anti-monotony rule (from King):** never ramp three nights in a row. Author each street as `easy · easy · medium · hard · easy · medium · hard · medium · easy · CURVEBALL`.

**Bot-tuned, human-authored:** every night is hand-specified (hook + shape + mechanics + objective), then `computeBotPar` estimates difficulty and sets moon thresholds — exactly King's bot-simulation step, which we already have.

# PART 4 — TASKS (workstream D)

- **D1 · Blocker engine (#52) [Opus 4.8]** ✅ **BUILT & VERIFIED LIVE 2026-07-13.** Typed tiles (`curTiles`, `tilesFromSpec`/`tileBlocks`/`foldTiles`/`tilesLeft`) shared by board AND bot. Verified in-game, exact: quilt folds one layer per hug (needed a dedupe fix — it was decrementing once per adjacent path cell); yarn blocks and unravels 2→1 per merge; **moonbeam doubled a hug to 432 = 108 base ×2 first-hug ×2 moonlight**; draft dozed an awake frenchie that settled in it; toybox turned its right-hand neighbour into a tux (fixed scan order, no `Math.random` — the daily must stay identical worldwide, law #2). Bot par recomputed with tiles present.
  *(original spec)* — generalize the board cell from `{pet, blocked}` to typed tiles: `quilt(n)`, `yarn(n)`, `moonbeam`, `draft`, `spawner(breed)`, `stairs(row)`. Hook into `settleAndRefill` (gravity must respect them), `resolveMerge` (merges clear adjacent quilt/yarn, moonbeam doubles, spawner emits), and **mirror every one inside `computeBotPar`** or par breaks. Render each as cozy house art. Feel risk = high → Opus.
- **D2 · Board shape library (#53) [Sonnet 5]** — replace `MASKS[8]` with `SHAPES[~20]` authored silhouettes as ASCII-art string arrays parsed to blocked-cell sets; `shapeFor(nightId)` picks per the night table (no `%` recycling within a street). Verify segmented gravity on every shape (no unreachable pockets).
- **D3 · New objectives (#54) [Sonnet 5]** — `TIDY` / `WALKHOME` / `UNTANGLE`: objective eval in `endRun`, HUD goal display, results copy, and moon thresholds. Exact spec derived from existing objective plumbing.
- **D4 · The 40-night rebuild (#55) [Opus 4.8]** — re-author `NIGHTS[]` as 4 streets × 10 with per-night HOOK, shape, mechanic mix, objective, and the anti-monotony rhythm; teach-night tutorials for each new mechanic (reuse the tut system). This is the taste-heavy one.
- **D5 · Bot re-tune + solvability sweep (#56) [Sonnet 5]** — run `computeBotPar` across all 40 rebuilt nights, confirm every night is completable and no par is inhuman (the ≤12-merge cap still applies), record the table, fix outliers.

**Ordering:** D1 → D2 → D3 → D4 → D5. D1 is the engine everything else sits on.
