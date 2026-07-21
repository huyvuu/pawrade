# PAWRADE — SPENDER PLAYTEST → PRODUCT ROADMAP
### 2026-07-10 · supersedes BUILD-PLAN.md for forward planning · builds on PLAYTEST-FEEDBACK.md (v4 fixes, all shipped)
### Method: four in-character playtests as habitual casual-game SPENDERS. Each diary records the "wallet moment" — the second they tried to pay and couldn't.

---

# PART 1 — FOUR WALLETS, FOUR VERDICTS

## 🛋 Linh, 34 — "The Decorator" (plays Royal Match daily, spends ~$20/mo)

**Diary:** "The den is adorable for exactly three days. Night one I bought the rug. Night two the fern and lamp. Night three I saved for the hearth, bought it, watched the fire flicker — genuinely lovely. Night four I opened the shop and it was five checkmarks. That's the whole store. In Royal Match I've been rebuilding a castle for eleven months. Here I finished decorating on Thursday."

**Wallet moment:** "I had $10 ready for a garden set. There is no garden. There isn't even a second WALL."

**What she'd actually pay for:** rooms (bedroom, garden, reading nook), *style choices* per slot ("does the lamp come in brass?"), set completion bonuses, seasonal collections (autumn den).
**What she'd never pay for:** score boosters. "I don't care about the number, I care about the room."
**Churn risk:** gone day 5 without more space to express taste. **Retention driver:** an unfinished room is a standing appointment.

## 📖 Priya, 27 — "The Collector" (Neko Atsume, Animal Crossing; completionist)

**Diary:** "Five breeds, three stages. Fine. But where's the page with the empty silhouettes that ruins my life in a good way? I graduated my first LONGCAT and the game just… incremented a counter I can't even find. Also — I picked a cream coat for my corgi in the creator and the board only ever shows the default orange. The variants EXIST in the code and you don't use them?"

**Wallet moment:** "I'd pay $3.99 tonight, once, if I could SEE a golden corgi in an album page I haven't earned yet. The silhouette does the selling. You have no album, so you have nothing to sell me."

**What she'd pay for:** one-time completion packs, rare coat variants (calico nights!), void-cat lore page.
**What she'd never pay for:** random draws. "Gacha me and I leave a one-star review with screenshots."
**Key free fix first:** an album/dreams page — collection desire must exist before it can be monetized.

## 🐕 Dana, 41 — "The Pet Parent" (named the game corgi after her real corgi, Biscuit)

**Diary:** "I named him Biscuit because my Biscuit sleeps behind me on the chair while I play. The whispers kill me — 'Biscuit leans into it.' I fed him, played ball, tapped him just to see him react. Then his birthday came around (mine — I decided it was his too) and I went looking for something to GIVE him."

**Wallet moment:** "You let me name him. Then you sold me a fern. The fern is for the ROOM. Where is HIS stuff? A bandana. A collar with a little tag. A bed with his name embroidered. A portrait for the wall. I had my card out. I closed the app."

**What she'd pay for:** identity items for HER pet — wardrobe, named bed, framed polaroid, birthday cake ritual. $4.99 without blinking.
**What she'd never pay for:** anything for the puzzle. She tolerates the puzzle to fund Biscuit's life.
**Note:** highest LTV per feature-dollar of the four. Wardrobe is cheap to build (canvas overlays on drawPet) and she's the buyer.

## 🏆 Marcus, 31 — "The Competitor" (NYT games sub; buys Candy Crush boosters on planes)

**Diary:** "Beat the bot night one, +212. Beat it night two. Then what? The daily is one shot — good, that's the Wordle nerve — but when it's done the only button is 'practice,' and practice is the same game with the meaning removed. I ran out of GAME in four minutes. Candy Crush would have shown me level 7,842 by now."

**Wallet moment:** "I'd pay four bucks for this TONIGHT if there were a hundred levels in front of me and a map that showed how far I'd climbed. There's one night. Also: the day my flight lands late and my streak dies, I will pay anything to repair it, and I will resent you either way — do that one gently."

**What he'd pay for:** the game itself (premium unlock) once a campaign exists; streak repair; hard-mode nights.
**What he'd never pay for:** cosmetics. "The bandana is for my girlfriend's save file."

## THE SYNTHESIS — why the money bounces

1. **Zero purchase surfaces.** All four had money out. There is literally no button in the product that accepts it. (Fixable LAST — the wants must exist first.)
2. **No want-formation at minute 0.** Royal Match shows the castle before level 1. We show a creator form. Nobody was shown the dream, so nobody started wanting anything. → **Demo/overview.**
3. **Spend attaches, in order of strength: identity (MY pet) → visible progress (the home) → completion (the album) → continuation (levels/streak).** Current build has none of the four surfaces.
4. **The four never conflict.** Decorator money, collector money, parent money, competitor money buy different things. One roadmap can serve all four wallets without any pay-to-win.
5. **What all four said unprompted:** no energy system, no gacha, no ads mid-night, no consumable currency. The COZY BRAND IS the moat. Monetization must be one-time, cosmetic/expansive, and proud of itself.

---

# PART 2 — THE ROADMAP
*(nearest phase = buildable spec; later = progressively lighter, detailed as we approach — by design)*

## V5 — "THE NEIGHBORHOOD" · levels + the dream demo  ✅ BUILT & VERIFIED LIVE (2026-07-09)
> Shipped: 40-night serpentine map (2 streets), 5 objective types, moons rated vs bot par, first-clear ✦ + furniture drops, next-night unlock + street-2 gate (18🌙); 4-page storybook demo after creator; DREAMS album with silhouettes. Tuning knobs left for real testers: moon thresholds (par×0.3 / ×0.55) and SCORE targets (absolute ramp, because bot par inflates on easy few-breed boards). index.html 112KB, console clean.
> *(original spec below, for reference)*

**Why first:** Marcus's campaign + everyone's minute-0 dream. Levels create the container that the home (V6), wardrobe (V7), and purchases (V8) sell into. Also solves "practice is meaningless."

### 5A. Levels — the Parade Path
Legal frame: level-map progression as a MECHANIC is not protectable and is used by hundreds of games (Royal Match, Gardenscapes, Best Fiends). What gets studios sued is expression: the word **"Saga," candy theming, cloned map art/trade dress** (King v. 6waves). Our expression — a night street of porch lights, moons not stars, quilted path — is distinct. Never use: "Saga," "Candy," "-scapes," King's swirl-lollipop visual language.

- **Structure:** streets of 20 nights. Launch with 2 streets (40 nights). `NIGHTS[]` static table; each night: `{ id, street, seed:'NIGHT-'+id, breeds:3..5, yawnEvery, yawnTargets, voidRate, deckSize, objective, moonT:[t2,t3] }`.
- **Difficulty knobs (already in engine):** breed count (3 = easy … 5 = hard), yawn cadence, deck size, void rate. Street 1: 3→4 breeds, gentle yawns. Street 2: 5 breeds, sleepier, smaller decks.
- **Objectives (5 types, all already computable from run state):** SCORE n · GROW n (stage-2s made) · LOAF (graduate a stage-3) · WAKE n (wake-bonus count) · BEATBOT (beat the night's bot).
- **Moons (not stars — ours):** 🌙 objective met · 🌙🌙 met + score ≥ botPar×1.1 · 🌙🌙🌙 met + ≥ botPar×1.4. **Thresholds come free from `computeBotPar(seed)` — zero hand-tuning for 40 levels, all deterministic.**
- **Map screen:** canvas scene, a winding night street rendered with existing two-light/firefly language; nodes = porch lights (done = warm glow + moons, current = pulsing, locked = dark windows). Drag to scroll. Tap node → night card (objective, best, moons) → play. Entry: "THE NEIGHBORHOOD" button in den.
- **Rewards:** first-clear ✦8–20 by night; every 5th night grants a furniture piece directly ("the neighbors left you a reading lamp") — pre-seeds V6 desire. 3-moon totals gate street 2 (soft gate: 24 moons).
- **Save:** `save.nights = { id: {moons, best} }`. **The daily is untouched** — daily = ritual/argument-with-the-bot; neighborhood = depth. Rename practice → "midnight stroll" inside the map as node 0, fixing P2-15.

### 5B. The Dream Demo — storybook overview for new players
After the creator, before the first-night tutorial: a 4-page skippable storybook (canvas-drawn with existing drawPet/scene language, ~30s):
1. *"link the sleepy little ones — they hug so hard they grow up"* (3 corgis → arrow → big corgi, animated once)
2. *"the grown-ups move into your home. furnish it, room by room"* (den mock fully furnished — THE DREAM shot)
3. *"every night, one worldwide parade. beat the sleepy bot. keep your streak"* (score card mock)
4. *"a whole neighborhood of nights is waiting"* (mini-map vignette) → "meet your first friend →"
Plus **DREAMS page v0** (album skeleton, reachable from den): silhouettes of breeds×stages, furniture checklist, badge slots. No rewards logic yet — its job in V5 is only to make wants visible (Priya's silhouettes).

**V5 exit test:** a new player, 60 seconds in, can say what the game is and name one thing they want (a room, a big pet, night 20). Marcus has 40 nights; nobody's wallet is out yet — correct.

## V6 — "THE HOME" · from one den screen to a house they build  ✅ BUILT & VERIFIED LIVE (2026-07-10)
> Shipped: 4 rooms (den + garden + bedroom + nook), ‹ › navigation, per-room unlock (pay ✦), tap-a-slot style chooser with 3 distinct previews each (first placement pays ✦, re-style free — the "choice" is the product), placed decor renders in-room, graduated pets live in the rooms. index.html 131KB, console clean. Backlog for V6.1: pets pathing between rooms / sleeping on the beds specifically, room-completion polaroid moment, nightly "tuck the house in" ritual, den-room migration to the slot system (den still uses the old shop). Prop art is parametric (same ceiling as the pets — illustrated sprites would lift it).
> *(original feature spec below, for reference)*

The user-stated north star: **build a whole home for their pets.**
- **Rooms unlock as scenes:** den (exists) → bedroom → garden → reading nook → kitchen → attic. Each room: one canvas scene, 6–10 **slots** (rug slot, wall slot, window slot…).
- **Slots offer a style CHOICE** (pick 1 of 3 looks, Royal-Match style; re-pickable free later — taste, not FOMO). Choice is the decorator's product; Linh's $10 was for *choosing*.
- **Pets USE the home:** graduates + rescues path between rooms, sleep on beds, sit by the hearth, chase in the garden. Room population makes rooms feel alive; cap per room drives wanting the next room.
- **Economy rebalance (numbers set at build time):** V5 faucets ≈ ✦600 campaign + ~✦10/day. Full home catalog target ≈ ✦2,500–3,500 → 3–5 weeks of engaged furnishing. Room-completion = polaroid moment + ✦ rebate + a "housewarming" pet ritual.
- **Nightly ritual (P2-12):** "tuck everyone in" — one evergreen den verb, +✦, lamps dim room by room.

## V7 — "MINE & ALL OF THEM" · identity + collection  ✅ BUILT & VERIFIED LIVE (2026-07-10)
> Shipped: the WARDROBE (dressing room — live pet preview + 10 accessories that draw on the pet: collar/bandana/bowtie buyable, glasses/crown/cap/party/tophat earned by raising each breed, founder crown supporter-gated), album→wardrobe rewards (raise a breed to majestic → its accessory + ✦50), and the BIRTHDAY ritual (adoption anniversary → den party hat + cake + confetti + "happy gotcha day"). Verified equip/buy/birthday on screen. Backlog (V7.1): rare coat variants on the board (COATS indices 1-3 unused / calico nights), golden-corgi chase, stage-3 majesty art, settable custom birthday, and consolidating the now-6-tall den button bar.
> *(original goal spec below, for reference)*

- **Wardrobe (Dana):** collars, bandanas, sleep caps, name-tag beds, wall portraits. Canvas overlays on drawPet; earned via nights/album, premium set reserved for the supporter pack. Birthday ritual (player sets pet's birthday; the den decorates itself that day — Dana cries, tells three friends).
- **Album (Priya):** DREAMS v0 grows rewards: completion rows pay ✦/wardrobe; **rare coat variants** appear on special seeded nights ("calico night") using the COATS arrays the board currently never shows; golden corgi as the long-tail chase. Fix: board pets draw their variant coat, not coat 0.
- **Stage-3 majesty art pass** (backlog item) lands here — the album is where big pets get admired.

## V8 — "THE PROUD TIP JAR" · real-money surfaces  ✅ BUILT & VERIFIED LIVE (2026-07-10)
> Shipped: the one-time **Founder Pack** ($3.99, cosmetics only) — a storefront with the restraint pledge front-and-centre, an external-checkout → offline-code-redemption flow (zero backend), and unlocks (founder crown wearable, golden den aurora + "💛 founder" badge, 🐾💛 paw on shares). Entry: tapping the locked founder crown in the wardrobe. Verified redemption live. **You must connect a real payment processor** (Stripe / itch / portal IAP) at FOUNDER_URL and generate codes with `genFounderCode()` — the game validates them offline. **Streak repair was deliberately NOT built** (conflicts with your law #4 — ratify or drop it). Backlog V8.1: decorator style packs ($2.99), golden-corgi coat (with V7.1 coat variants).
> *(original constraint spec below, for reference)*

Zero-backend truth: no server ⇒ no consumable economy worth selling (local save = editable anyway). So sell **one-time unlocks, delivered as portal IAP (CrazyGames/Poki SDK) or Stripe/itch payment link → unlock code**, all cosmetic/expansive:
- **Founder Pack $3.99:** golden paw badge on share cards, exclusive den theme (Midnight Mint — the callback), supporter collar, golden corgi guaranteed in album.
- **Decorator packs $2.99:** alternate full-room style collections (Linh).
- **Streak lantern:** one free repair/month for everyone; supporters get two, gently. (Marcus, without resentment.)
- **Never:** energy, gacha, ads-between-nights, pay-for-score. Print this in the store copy — the restraint IS the marketing.

## "RARE FRIENDS" — unique unlockable pets  ✅ BUILT & VERIFIED LIVE (2026-07-10)
> Shipped tiers 1+2: shimmer nights (deterministic rare-coat spawns, ✦ twinkles, coat inheritance through merges, rare-majestic album row + den display + ✦75) and 4 feat-locked LEGENDS (STARLIGHT / BIGHUG / THE GILDED CORGI / THE MOON MAYOR) with custom looks, big unlock celebrations, den pride-of-place, album legends row + chase hints. Verified: night-3 silver tabbies, inheritance ({tabby,s2,c1}), gilded founder migration. Tier 3 (more story rescues) remains open. Variant sprite art = extra manifest files later (parametric covers them today).

## ORIGINAL PROPOSAL (2026-07-10, owner ideation): "RARE FRIENDS" — unique unlockable pets
Owner asked: can pets evolve / are there unique unlockables? Evolution already IS the core (stage 1→2→3→graduates home; stage 4 would break the tuned deck math — refuse). The fitting build, all deterministic/earned (laws intact, NO gacha):
1. **Rare coats ("shiny" system):** COATS[breed][1..3] exist unused — special seeded nights ("calico night") spawn the featured breed in a rare coat; merging it to majestic = variant graduate in den + new album rows. Nearly free in parametric; each kept variant needs a sprite file later (key e.g. `corgi1g`).
2. **Legendary named uniques via feats:** golden corgi (founder pack tie-in), STARLIGHT (3 wishing stars in one night), 8-chain void-touched, street-1-all-3🌙 — silhouettes visible in DREAMS from day one.
3. **More story rescues:** rescue system exists w/ only Penguin; milestone nights bring new named arrivals.
Refused on principle: gacha/eggs (law #4 + brand), stage-4, losable pets. STATUS: designed, awaiting owner go.

## OWNER PLAYTEST ROUND 2 (2026-07-11) — 6 fixes from the owner's own hands-on session  ✅ BUILT & VERIFIED LIVE
> The owner played the build personally (not a synthetic persona this time), sent annotated screenshots of overlapping den text/buttons, and filed 6 requests. All shipped: **wardrobe try-before-buy** (unowned items preview instead of auto-purchasing), **run-exit back button** (leave stroll/night/daily mid-run, score>0 asks to confirm via the existing half-keep path), **stroll energy** (3 hearts, 2h regen, gates ONLY the practice button — daily/Neighborhood stay unlimited), **Neighborhood level blueprints** (each night's obstacle layout is fixed forever, the pet content shuffles every attempt — required deriving a segmented-gravity refill algorithm for obstacle-aware column drops), **the overhead 2.5D den** (perspective-projected floor, depth-sorted roamers, hand-derived waypoint zones so the pet/graduates/rescue can never visually collide again), and **The Rescue Ritual** (see below — was proposed this same session and shipped in the same pass). General de-collision polish landed too: bot-par capped to human scale, den layout overlaps fixed, FX-leak-across-screens fixed, board-clip on falling pets. See CLAUDE.md "Current state (verified live — through tasks #23-28)" for the technical detail.

## "THE RESCUE RITUAL" — the viral rescue arc, cozy-adapted (proposed 2026-07-11)  ✅ BUILT & VERIFIED LIVE
Owner asked whether viral animal-rescue content (hurt/sick animal → rescued → cared for → transformation) belongs in the game. Verdict: YES to the ARC, NO to the suffering — law #3 (never sick/in pain/in danger) stands, and it's also the correct commercial call for the cozy demographic. Adaptation: strays arrive VULNERABLE (wet/shy/thin/hiding — safe the moment they're taken in), a multi-day TRUST meter (hiding→watching→approaching→home) replaces survival stakes, and completion mints the GLOW-UP: a before/after polaroid share card ("day 1: found her shaking under the porch. day 9: she owns the good cushion.") — the viral video compressed into one shareable image, and it finally ships the long-backlogged polaroid. Optional, owner-veto: 1-2 disabled pets framed as celebrated characters (cart corgi who's fastest in the den; one-eyed tux with a dashing patch) — never pity. Retention: the trust arc is a warmer multi-day comeback loop than any energy gate. Task #28.

## EXECUTION PLAN (2026-07-13) — all open tasks, sequenced · tasks #36 → #37 → #34 → #38 (+ sprite track)
> Companion to DOPAMINE-DESIGN.md. Order rationale: P0 first (highest dopamine-per-line, hardest correctness — do fresh); P1 next (results-flow, independent); iso Phase 3 before P2 because P2's furniture-love-payoff needs Phase 3's pet-pathing (#38 blockedBy #34 recorded). Every phase ends: build → cscript parse gate → live verify in FOCUSABLE Chrome (in-app pane pauses rAF) → commit → push (auto-deploys Pages) → doc updates.

**Phase 1 · #36 Dopamine P0 (largest).** Dream Bubbles: dedicated rng stream seeded `seedStr+'-bubbles'` — NEVER the deck's stream (bot-par rng parity, same lesson as rare coats); ~1/7-per-merge spawn w/ pity ≤12; drifting time-based bubble entity, tap-catch in onDown (play/idle), staged pop → ladder (✦S/✦M/✦L/fuse-refill/wardrobe-shard). Dream Chain: after a merge lands, orthogonal same-breed+stage neighbors auto-echo-merge at 50% pts, SINGLE-level (no recursion, bounds par math); MUST mirror in computeBotPar. Goodnight Gift: post-daily-tuck overlay, 3-tap staged opening, contents seeded day+streak (streak raises floor). Verify: daily determinism proof (2 reloads → identical bubble schedule + par), echo-merge par parity, economy guardrail (~15% of session ✦ income).
**Phase 2 · #37 Dopamine P1 (medium).** Wishing-star pre-arrival sky shimmer + graze near-miss on expiry; slow-mo photo-finish count-up when |score−par|/par < 8%; unlock ladder — sessions 1–10 each end with a novel reveal (re-sequence existing content) + "tomorrow: something new" teaser on results.
**Phase 3 · #34 Iso room Phase 3 (medium-large).** `save.denStyle` wall/floor palettes (3–4 each) pickable inside furnish mode; wall-mounted decor (window, paintings) on wall slots; pets USE furniture — wander pool augmented with owned-furniture tiles + a "using" pose state (nap on bed, sit by hearth, eat at bowl reusing petReact).
**Phase 4 · #38 Dopamine P2 (small, after #34).** Combo Fever state at ×4+ (edge glow, music layer, deck bounce); Warm-up Treat — first merge of each real day gets oversized FX + flat ✦ grant OUTSIDE score (never distorts par fairness); furniture love-payoff — placement confetti + nearest pet paths to the new piece (Phase 3 pathing) + heart burst.
**Parallel track (owner-gated): illustrated sprites.** Blocked solely on art PNGs (SPRITE-ART-GUIDE.md ⚡quick-start). On delivery: bake via build.ps1, tune SPRITE_BOX/SPRITE_CY, run the guide's QA checklist. Slots in at any phase boundary without conflict.
**Final regression (after Phase 4):** daily same-board/par/bubbles proof, night replay → same mask/different deck, den tap-targets, wardrobe preview, rescue coax, founder redeem — then the standing gate: real external testers.

## V9 — "SEASONS" · directional only
Seasonal streets (autumn street, winter street), seasonal den sets, event nights, polaroid share cards, portal launch hardening. Detailed when V8 ships.

---

# THE STANDING GATE (unchanged, every version)
Real testers before/while each phase ships. V5's exit test is answerable by one stranger in 60 seconds. Feedback loops with actual humans beat a fifth internal persona — including these four.
