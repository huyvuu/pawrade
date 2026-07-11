# PLAYTEST 2 — as the end user (fresh save, full first session)
### 2026-07-10 · played: creator → storybook → tutorial → guided stroll → first daily → results · persona: new player, phone in bed, 6 spare minutes
### Build tested: current (V8 + satisfaction + rare friends, 168KB)

## THE DIARY (what I actually felt, in order)

**0:00 — the creator.** Charming. Picked a shiba, named her Mochi. Small thing: the whole game UI (buttons, icons) is visible behind the modal before I have a pet — noise before the story starts.

**0:20 — MY BRAND-NEW PET IS HAVING A BIRTHDAY.** Party hat, cake, confetti, *"happy gotcha day, Mochi!"* — I adopted her nine seconds ago. The adoption-anniversary check fires on adoption DAY. As a player it reads as a glitch; as a designer it burns the game's single best future emotional beat (the real anniversary, a year away) on minute one.

**0:40 — the storybook.** Cute, skipped it after page 2 like most people will. Skip worked cleanly into the tutorial.

**1:00 — fed Mochi.** Crumbs, ✦+5, sweet. But the whisper text rendered **on top of the care chips** — two lines of handwriting colliding with three buttons. Readability mush at the most-taught moment of the game.

**1:30 — the guided stroll.** The glow said *"draw one line through the glowing pups"* — **while two of the five glowing cells were still empty** (pets hadn't finished falling). I waited, confused, then it made sense. Also the ✦+5 sparkle from feeding was still floating over the puzzle board, and falling pets rain across the score/header text.

**2:30 — first hug: 600 points.** The count-up, the pops, the hearts — genuinely satisfying now. The shiba lesson, the yawn lesson — all landed.

**3:00 — tutorial results:** *"that's the whole game. tomorrow the real parade forms."* — **and it sent me away.** I have a 40-night Neighborhood sitting unopened one tap away, and the game's own copy told me to come back tomorrow. The results modal has "another stroll" and "back to the den" — no "🏠 the neighborhood →". This copy predates the levels and now actively fights retention at the exact moment I'm most hooked.

**4:00 — the daily. The heartbreaker.** I played well — four clean merges, 670 points, real satisfaction. Tucked in. The results said: *"the sleepy bot tucked **9,558**. so close. get it tomorrow."*
**I scored 7% of the bot's total and the game called it close.** The par bar never left the left edge. As a player my honest read: either this game is broken, or I am unimaginably bad at it. Both reads end in churn. And this one number poisons everything wired to it: the par bar (permanently ~empty), the daily headline, the share line ("the bot won by 8,888" — who shares that?), the BEATBOT night objectives (unclearable), and the GILDED CORGI chase (beat the bot 7 times = impossible for non-founders).

**Root cause (designer hat):** the bot simulation plays the ENTIRE 84-card deck with perfect greedy chains until nothing is left. A human plays 10–20 merges before the nap or the tuck. They aren't playing the same game. The ×0.9 "beatable" factor is a rounding error on a 14× gap.

**Verdict as a player: the first five minutes are genuinely lovely and juicy — and then the game's own scoreboard tells me I'm worthless at it. Fix the bot and this is shippable.**

---

## RANKED FEEDBACK

### P0 — trust-breakers (fix before anyone else plays)
1. **The bot par is inhuman (670 vs 9,558).** FIX: cap the bot's simulation at ~12 merges — "the bot gets sleepy too." Par lands ~1,200–2,500: beatable on a good night, a real race. Everything downstream self-heals: par bar moves, moon thresholds (par×0.3/×0.55) become earnable, BEATBOT nights clearable, gilded-corgi chase real. Also tier the loss copy: "so close" ONLY within ~15% of par; otherwise "the bot's ahead tonight — every hug counts."
2. **Day-one birthday.** FIX: `isBirthday()` requires ≥300 days since adoption (or year differs). The real anniversary stays magical.
3. **The game sends new players away at peak excitement.** FIX: tutorial + daily results get a "🏠 the neighborhood →" button; rewrite tutorial-end copy: "that's the trick. now — forty nights are waiting up the street." Daily-done den state should point at the map too.

### P1 — polish wounds (visible in every session)
4. **Whisper text collides with care chips in the den.** FIX: move whisper above the chips when in den (or chips up, whisper anchored below pet).
5. **Tutorial glow appears before the stamped pets finish falling.** FIX: delay `tut.cells` glow ~800ms until drops settle.
6. **FX leak across screens** (feed sparkle floats over the puzzle; board hearts over the den). FIX: clear `sparkles`/`callouts` on screen transitions (startRun/goDen/goMap).
7. **Two competing furniture systems** — the old den "furnish" shop (rug/fern/lamp/cushion/hearth ✦-list) AND the room slot-chooser. A new player can't tell them apart. FIX (interim): retitle shop "the den · quick furnish" and have it visibly say "more rooms → swipe ›". FIX (proper, later): migrate the den to the slot system.
8. **Falling pets render over the HUD/score.** FIX: clip board drawing to the board rect (one `ctx.clip()`).

### P2 — tuning & nits
9. **Combo window (5s) is tight for humans** who scan between merges. FIX: 6.5–7s + show the fuse near the score, not the corner.
10. Night results don't show the ✦ first-clear reward — the payout is silent. FIX: add "+✦N" line.
11. Creator modal shows the full game UI behind it. FIX: hide bar until pet exists.
12. "stroll" icon is redundant with the Neighborhood for new players — fold into map later (existing backlog).

---

## THE PLAN (build order, ~1 session)

**Phase A — the trust fixes (P0, do first, in this order):**
1. `computeBotPar`: add merge cap (`merges >= 12 → break`) — one line; NIGHTS pars recompute automatically at load. Verify: daily par lands 1–3k; night-1 2🌙/3🌙 thresholds reachable.
2. Loss-copy tiers in `showEnd` (+ share line): <15% gap = "so close"; else honest-warm.
3. `isBirthday()` day-count guard.
4. Results CTA: "🏠 the neighborhood" button on tutorial + daily results; rewrite tutorial-end line.

**Phase B — the polish wounds (P1):**
5. Den whisper position fix; 6. tutorial glow delay; 7. FX clear on transitions; 8. shop retitle + pointer; 9. board clip.

**Phase C — tuning (P2):** combo window 6.5s + badge reposition; night-results ✦ line; creator bar hide.

**Verify after each phase** (fresh-save run for Phase A; the par number is the acceptance test: a 4-merge run should read ≥25% on the bar).

**Explicitly NOT in this plan:** new features. This is a trust-and-polish pass; the game has enough systems.
