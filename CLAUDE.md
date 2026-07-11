# PAWRADE — project context (auto-loaded)

**What this is:** a master-crafted daily **link-to-MERGE** puzzle — pets people love (corgi/shiba/frenchie/tabby/tux/void cat) that you link into hugs and MERGE up growth stages (puppy → dog → majestic floof), with a bank-or-bust "TUCK THEM IN" decision layer. Final-stage pets graduate off the board INTO your den.

**Hierarchy (owner-ratified 2026-07-09 — do not invert):**
1. **PRIMARY: the puzzle.** The merge-link game is the product; sessions live here.
2. **SECONDARY: the home.** A decoratable den where earned critters run around and need light care (feed/play/gift = comeback taps). The den is the reward surface, never the main event. Its population comes FROM the puzzle (graduated final-stage pets) plus rare story rescues.

Phase A (link engine, den v1, first rescue) is BUILT and browser-verified end-to-end (2026-07-09). Phase M in BUILD-PLAN.md converts link-clear → link-to-merge.

**Read before any work, in this order:**
1. `BUILD-PLAN.md` (here) — the current task list, model assignments, gates
2. `..\Research\PAWRADE-Craft.html` — THE CRAFT BIBLE. Binding law, not inspiration
3. `..\Research\TUCK-Design.md` + `..\Research\GREED-Design.md` — design lineage/psychology

## Non-negotiable laws (violations fail review)
1. **Zero runtime AI tokens · zero backend** (localStorage + local clock only; the one sanctioned exception: an optional Cloudflare Worker for daily percentile, Phase F′)
2. **Zero runtime randomness in outcomes** — daily is deterministic worldwide (seed = day number). RNG allowed only in celebration presentation and whisper selection
3. **Everyone finishes; streaks never die to failure; no cruelty** — busts keep half, pets are never sick/dead/in danger, the game never guilt-trips
4. **No money-for-chance, ever** — cosmetics/supporter only. No loot boxes, no paid continues, no streak repair
5. **Craft Bible enforcement:** two-light rule, grain on every frame, idle life never synchronized, nothing pops (everything arrives), time-based animation ONLY (never per-frame increments), music box in F major pentatonic, lowercase whispers ≤1 exclamation per screen, no detail ever announces itself
6. **Legal fences:** never "Pet Rescue" in naming (King), pets never trapped/imprisoned by the puzzle (walk home, never freed-from-blocks), no dots-like link visuals (Two Dots), no known-mascot lookalikes, "Tamagotchi" never appears in product copy (Bandai trademark)

## Build & test pipeline (established, working)
- Source: `style.css` + `body.html` + `game.js` (ES5-style: var/function only — JScript-parseable) → `build.ps1` concatenates into self-contained `index.html` (no-BOM, non-ASCII escaped to \uXXXX)
- Syntax check without Node: `cscript //E:JScript //Nologo game.js` → "'document' is undefined" at runtime = parse OK
- Serve: `serve.ps1` (port 8789) → test at http://localhost:8789
- **Browser verification is mandatory before claiming done**: load, read console errors, and drive real gameplay with the pointer-event harness in `BUILD-PLAN.md` §Harness. Known CDP quirks: first click after hard reload may be swallowed (retry); a backgrounded/non-focused tab can fully PAUSE `requestAnimationFrame` (not just throttle it) — confirm via `document.hasFocus()` or nudge with a `computer`-tool screenshot before trusting any live-read position (this is also why all animation must be time-based, never per-frame)
- Model split doctrine: **Opus 4.8 owns everything where "is it fun / does it feel right" is the risk. Sonnet 4.5/5 owns everything already exactly specified.** After every Sonnet task, run the Bible-compliance checklist (BUILD-PLAN §Review)

## Current state (verified live — through tasks #23-28, from the owner's personal playtest)
Owner personally playtested (2026-07-11), sent annotated screenshots of overlapping UI text/buttons, and filed 6 requests, all now BUILT & VERIFIED LIVE:
- **#23 wardrobe try-before-buy:** tapping an unowned accessory no longer auto-purchases — `wardrobePreview` state shows it on the pet live (dashed-blue `.previewing` chip) with a put-it-back/buy bar; owned/free items still equip instantly (`tryAcc`).
- **#24 run-exit back button:** a `‹` back region (top-left, mirrors mute button) works from stroll/night/daily via `requestLeave()` — score 0 leaves instantly, score>0 shows a confirm modal (`leave-ov`) and reuses the existing fair `endRun(false)` half-keep path.
- **#25 stroll energy:** `STROLL_ENERGY_MAX=3` hearts, 2h regen, on-demand computed (`strollEnergyNow()` — same pattern as `petMood()`, no interval). Gated ONLY inside `btn-practice`'s click handler — daily and Neighborhood are untouched/unlimited by construction. Founder pledge copy corrected to "no paid energy" (a free energy system now exists).
- **#26 level blueprints (fixed architecture, randomized content):** `MASKS[8]` obstacle shapes seeded per-night (`'ARCH-'+id`, independent of the per-attempt RNG) via `maskFor`/`isBlockedCell`; night-mode content (deck shuffle + preset sleepers) is fresh every attempt via a per-attempt random salt in the seed. Required deriving a "segmented gravity" refill algorithm (on hitting a blocked cell while scanning bottom-to-top, immediately refill the segment just finished before resetting the write-pointer) — implemented identically in `settleAndRefill()` and `computeBotPar()` so the bot faces the same obstacles.
- **#27 overhead 2.5D den:** `denProject(depth,lateral)→{x,y,scale}` fakes depth with flat sprites; a `jobs=[{depth,draw}]` array (furniture + pet + graduates + featured rescue) is depth-sorted before drawing. Each roamer has its own `wanderInit`/`wanderTick` waypoint state machine; taps hit-test against live `petScreenPos`/`rescueScreenPos`. Fixed a label/sprite-crowding bug: all roamers originally shared one waypoint pool with no separation, and the pet's own sprite is far bigger (radius scales to ~140px) than the others — now each role has its own hand-derived-safe waypoint zone (`PET_WP`/`GRAD_L_WP`/`GRAD_R_WP`/`RESCUE_WP`), passed as `wanderTick`'s 4th param. **Gotcha:** a backgrounded (non-focused) Chrome tab can fully pause `requestAnimationFrame`, not just throttle it — any den/canvas automated test must confirm the tab is actually rendering (e.g. via a `computer`-tool screenshot) before trusting positions read off `window._pw()`.
- **#28 The Rescue Ritual:** strays arrive vulnerable-but-safe (never sick/in danger, per law #3) and climb a 4-stage trust meter (hiding→watching→approaching→home) via daily passive gain + direct den pats (`coaxRescue`); reaching "home" fires a before/after glow-up card with a copy-to-clipboard share (the long-backlogged polaroid moment). `RESCUE_POOL[6]` includes two dignified disabled traits (never framed as pity).

General polish landed alongside these: bot-par capped to human scale (≤12 merges, ≤5/chain — was reading 14× the achievable human score), den layout de-collided (nameplate/mood/cake/rescue/graduate positions no longer overlap), FX cleared on every screen transition, falling pets clipped to the board rect.

## Current state (verified live — through V8 + satisfaction + sprites + RARE FRIENDS)
**RARE FRIENDS (2026-07-10):** shimmer nights (`spec.rareCoat`: daily day%4==2, neighborhood id%5==3; featured cards coat via INDEX i%3==1 — never rng, keeps bot-par rng parity), coat inherits through merges (any rare in chain), rare majestic → `save.seen['rare-'+breed]` + `save.rareGrads` + ✦75; ✦ twinkles on board, "✨ rare X night" HUD. LEGENDS (starlight/bighug/gilded/moonmayor) via `unlockLegend` — feats only, custom looks via drawPet `o.coatO` override (coatO/coatIdx>0 skip sprites). Album: rare ✦ row + legends row + hint. Founder boot-migration grants gilded. `window._pw()` board now includes coat (`c`) + rareCoat.


**SPRITE PIPELINE (2026-07-10, verified e2e):** drop PNGs in `sprites/` → build.ps1 bakes them as data URIs into `var SPRITES={}` → drawPet uses sprite when key exists (breed+stage, sleeping = `<key>s`), parametric fallback per-key. Knobs: SPRITE_BOX/SPRITE_CY. See `SPRITE-ART-GUIDE.md` for the 32-file manifest + prompts. Test images: make with PowerShell System.Drawing (browser toDataURL returns are blocked by the extension).


**SATISFACTION PASS (2026-07-10):** combo streaks (5s window, ×1.2..×2, gold ×N badge + fuse, rising pitch — math proven exact: 108→130 at combo 2), par fill-bar under score (gold shimmer on overflow, 🌙 goalposts in nights, one-time pass-the-bot celebration), landing squash+dust+plop on every touchdown, chain-scaled shake/hearts + MEGA HUG at 6+, hitstop FIXED (was set-but-never-consumed since V4 — now freezes dtSec), results count-up + confetti on wins only. **Dev hook `window._pw()`** (plain ES3 function — getters BREAK the cscript parse gate) returns closure state incl. board snapshot so tests compute valid chains. Automation warning: background-tab timer throttling (40ms→1s+) breaks timing tests & long evals — use short evals + the board hook; for timing proofs, temp-widen the constant, prove, revert, re-verify artifact.

## Current state (verified live — through V8)
**V8 MONEY:** the one-time Founder Pack ($3.99, cosmetics only per law #4). founder-ov storefront + restraint pledge + offline code redemption (`validFounderCode`/`genFounderCode` checksum, FOUNDER_URL placeholder). Redeem → `save.founder` → goldcrown wearable + den golden aurora + "💛 founder" badge + 🐾💛 on shares. Entry = tapping the locked founder crown in the wardrobe. Streak repair deliberately NOT built (law #4). To ship: connect a real payment processor + generate codes. FULL LOOP COMPLETE (levels/demo/album/home/wardrobe/identity/money) — next real step is external testers.
**Den bar consolidated (2026-07-10):** the 6-tall button stack is now 2 big CTAs (parade + neighborhood) + a compact 4-icon row (`#bar-icons`: wardrobe/dreams/furnish/stroll, `.iconbtn` class) shown only in den room 0 via `setUI`; the pet is no longer buried. `shop-dl` kept as a hidden span for the JS reference.

## Current state (verified live — through V7)
**V7 IDENTITY:** the WARDROBE (`ACCESSORIES` library drawn over the pet via `o.worn` in drawPet; dressing-room overlay w/ live preview + buy/earn/wear/supporter states; `save.owned`/`save.pet.worn`), album→wardrobe rewards (`markSeen` grants a breed's accessory + ✦50 at stage-3), and the BIRTHDAY ritual (`isBirthday()` = adoption anniversary → den party hat + cake + confetti). btn-wardrobe in den. KNOWN: den button bar is now 6 tall (covers pet's lower half) — consolidate later. DEFERRED V7.1: rare coat variants (COATS[breed] indices 1-3 unused), golden corgi, majesty art, custom birthday.

## Current state (verified live — through V6)
**V6 THE HOME:** the den is now a multi-room house — `renderDen` dispatches on `curRoom` (0=den scene, else `renderRoom`); ‹ › nav + room dots; rooms garden/bedroom/nook unlock for ✦; each has `slots` decorated via a 3-style chooser (`PROPS` library, `save.home`/`save.rooms`); graduated pets live in the rooms. GOTCHA (cost a long debug): eval-time IIFEs/top-level statements in the wiring section must not forward-reference a `var` declared later — it throws and aborts the whole boot (loop never starts, blank canvas). Keep such state in the top declaration block.


Creator → 4-page storybook demo (hug/home/race/map, gated `save.demoSeen`) → first-night tutorial → den (real moon phase, night sleep by local clock, whispers, care timers, furniture) → **THE NEIGHBORHOOD** (40-night serpentine map, screenMode 'map': porch-light nodes, drag-scroll, tap→night card→play; objectives HUGS/SCORE/WAKE/MAJESTY/BEATBOT; 🌙 rating vs bot par; first-clear ✦ + furniture drops; street-2 gate 18🌙) + daily + practice + **DREAMS album** (btn-dreams: 5×3 silhouette collection). Merge choreography (hug flyers+hitstop+shake), Sleepy Bot par, wishing star, wake bonus, count-up score, screen fades, pet shading/shadows all live. Save schema `pawrade-v1`; `save.nights` is now the night-progress MAP (migration renamed old counter→`save.nightsPlayed`). Run difficulty is data: `spec` object drives buildDeck/computeBotPar/queueYawn.
**Open tuning (needs real testers):** bot par inflates on few-breed boards; moon thresholds (par×0.3/×0.55) and SCORE-objective ramp are provisional.
Known small defects: care chips overlap pet nameplate; frenchie silhouette reads bunny-ish at grid size; audio unverified by human ears.
