# PAWRADE — MAXIMUM-DOPAMINE DESIGN AUDIT & PLAN
### 2026-07-13 · owner asked: "design the game for maximum dopamine release — audit whether it already is; pivot only if necessary"
### VERDICT UP FRONT: **no pivot needed.** The core stack is already the proven top-grossing dopamine architecture (~70% built). The missing 30% is one specific layer — variable-ratio rewards + cascade windfalls — which is additive, cheap, and law-compatible via seeded RNG.

---

## 1. THE SCIENCE, COMPRESSED (what actually fires dopamine)

Dopamine encodes **reward prediction error** — it fires hardest on *anticipation of an uncertain reward*, not on receiving a known one (Schultz). Peak firing occurs near **~50% reward probability** (maximum uncertainty, Fiorillo). Casual games translate this into a known 10-lever stack:

| # | Lever | Canonical example |
|---|---|---|
| 1 | Variable-ratio rewards (the slot-machine core) | loot boxes, Candy Crush boosters |
| 2 | Cascade windfalls (unearned eruptions from one action) | Candy Crush cascades, Suika chain-pops |
| 3 | Near-miss engineering | slots' 2-of-3 jackpot reels, "so close!" |
| 4 | Push-your-luck stakes | Balatro, blackjack, bank-or-bust |
| 5 | Micro-feedback juice (<100ms action→reward) | Peggle, every top ad |
| 6 | Mid-full progress bars + completion sets (Zeigarnik) | album silhouettes, 7/8 collections |
| 7 | Streaks + appointment loops | Wordle, Duolingo |
| 8 | Unlock drip (novelty every session) | Vampire Survivors' unlock wall |
| 9 | Rivalry / social proof | leaderboards, "beat your friend" |
| 10 | Attachment amplification | pets/babies — cuteness multiplies every reward |

## 2. THE AUDIT — where PAWRADE stands lever-by-lever

| Lever | Status | Evidence in build |
|---|---|---|
| 5. Juice | ✅ **STRONG** | satisfaction pass: hitstop, squash+stretch, landing plops, rising combo pitch, ×N badge+fuse, confetti, count-up score |
| 4. Push-your-luck | ✅ **STRONG** | TUCK THEM IN bank-or-bust vs. the Sleepies — this IS the core engine (GREED lineage) |
| 7. Streak/appointment | ✅ | daily deterministic parade, streak lantern, care timers, stroll-energy comeback meter |
| 6. Completion sets | ✅ | DREAMS album silhouettes, rare-coat rows, legends row, wardrobe, furniture catalog |
| 10. Attachment | ✅ | named pet, mood/bond, birthdays, rescue trust arc, cuteness pass (glossy eyes) |
| 9. Rivalry | 🟡 partial | Sleepy Bot par + fill-bar (synthetic rival); no human leaderboards (zero-backend law — acceptable trade) |
| 8. Unlock drip | 🟡 partial | first-clears, furniture every 5th night, shimmer nights — exists but not *guaranteed novel-thing-per-session* in the first 10 sessions |
| 3. Near-miss | 🟡 partial | tiered "so close" copy only — no engineered photo-finish moment |
| **1. Variable-ratio rewards** | ❌ **MISSING** | every reward is a fixed amount at a fixed trigger; zero "what did I get?" reveals |
| **2. Cascade windfalls** | ❌ **MISSING** | link-merge means every point is earned deliberately; the board never *erupts on its own* |

**Diagnosis:** the game has the *skill-satisfaction* half of the stack (juice, stakes, collection, attachment) at genuinely high quality, but is missing the *slot-machine* half (uncertainty, windfalls, staged reveals). That half is exactly what Candy Crush/Royal Match layer on top of an identical base — and it's additive, not structural.

**Law check:** Law #2 (zero runtime randomness in outcomes) *appears* to block lever 1 — but task #26 already amended it de facto (night decks are per-attempt random, owner-requested). The thread-the-needle: **seed all variable rewards from the run seed.** Daily = same "random" rewards worldwide (law's spirit: shared board, fair race — preserved). Strolls/nights = already per-attempt seeds. Law #4 (no money-for-chance) is untouched — every variable reward below is FREE and unpurchasable, which is precisely why it's safe for the brand.

## 3. THE PLAN — "WARM JACKPOT" pass (close the 30%)

### P0 — the variable-reward layer (highest dopamine-per-line-of-code)
1. **Dream Bubbles** *(variable-ratio jackpot in-run)* — each merge has a seeded ~1-in-7 chance (pity: guaranteed within 12) of releasing a drifting, wobbling bubble. Tap it before it floats off-screen → staged pop reveal on a rarity ladder: small ✦ / big ✦ / combo-fuse refill / wardrobe shard / rare-coat token. Anticipation (drifting), action (catch), uncertainty (ladder), reveal (sparkle pop) — all four beats of the slot moment, no money anywhere near it.
2. **Dream Chain cascades** *(unearned windfalls)* — when a merged pet lands, any same-breed+stage pets orthogonally adjacent get pulled into a bonus echo-merge at 50% points, automatically. Refills occasionally set these up by pure luck → the board erupts without the player having planned it. Reuses the existing hug-flyer choreography; the bot sim must mirror it for par parity.
3. **The Goodnight Gift** *(daily mystery box)* — after every daily tuck: a wrapped gift, 3 taps to open, escalating shimmer per tap, variable contents (seeded by day+streak; streak raises the *floor*, never gates). The staged-opening ritual is the dopamine, not the contents.

### P1 — anticipation & near-miss engineering
4. **Wishing-star trails** — sky shimmer 1–2 merges *before* the star lands ("a wish is coming…"); a graze-sparkle near-miss if it expires untapped.
5. **Par photo-finish** — when the final score lands within ~8% of bot par, the results count-up goes slow-mo and overtakes/falls-short at the last moment. Engineered photo-finish in both directions.
6. **Unlock ladder tightening** — guarantee sessions 1–10 each END with a novel reveal (re-sequence existing content: album → wardrobe item → shimmer preview → furniture → rescue → …) + a "tomorrow: something new is coming" teaser line on results.

### P2 — compounding states & instant-on
7. **Combo Fever** — at ×4+: screen-edge glow, extra music layer, deck pets bounce. A visible state players chase (Peggle's fever).
8. **Warm-up Treat** — the first merge of each real day always erupts oversized. Guaranteed dopamine spike <30s from app-open.
9. **Furniture love-at-first-sight** — on placement: confetti + the nearest pet immediately runs over and uses/sniffs the new piece (ties into iso Phase 3). Purchase → instant affection payoff = the Royal Match decorator loop.

### Guardrails (what we deliberately do NOT do)
- No loss-aversion punishment, no expiring streaks, no gacha, no paid energy — those are the burnout levers, they violate laws #3/#4, and the cozy warmth is simultaneously the differentiator AND the monetization moat. Royal Match is the #1-grossing western casual game on exactly this "warm dopamine" positioning.
- Economy guardrail: Dream Bubble / Goodnight Gift ✦ payouts must stay within ~15% of current session income on average, or the furniture catalog deflates.

## 4. PIVOT ANALYSIS (asked-for, and the answer is no)

Hypothetical higher-raw-dopamine alternatives, and why each loses:
- **Suika-style physics merge** — constant cascades, but no daily-share nerve, brutal art bar, saturated lane (we killed this direction once already at validation).
- **Balatro-like run deckbuilder** — multiplier compounding is elite dopamine, but wrong audience for the cozy/female-casual moat and a full rebuild.
- **Coin-pusher/slots-adjacent** — maximum raw dopamine, minimum brand, King-lawyer bait, violates the entire constitution.

None clears the bar that PAWRADE already clears: proven psychology stack + distribution thesis + ~200KB of verified, deployed build. The gaps are features, not foundations. **Build the missing layer; don't pivot.**

## 5. STATUS
- P0/P1/P2 queued as tasks #36–38 (P0 first). Law-#2 note: seeded-variable rewards preserve the daily's same-for-everyone guarantee; owner ratification of this reading recorded as requested in-session 2026-07-13.
