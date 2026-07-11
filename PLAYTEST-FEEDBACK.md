# PLAYTEST — as the end user
### 2026-07-10 · played: den (post-daily), practice stroll, 2 merges, care loop, board analysis · persona: casual player, 4 spare minutes, plays Royal Match

## THE DIARY (what I actually felt, in order)

**0:00 — open the app.** My corgi is cute. The whisper is charming. Then I look for something to *do*: my daily shows a checkmark, and all three care chips are grey timers (2:50, 1:55, 3:55). I have ✦60 and **nowhere to spend it**. The entire den is a dead end 5 seconds after opening. *"So… I guess I'll come back tomorrow?"* — that's churn, not retention.

**0:20 — start a stroll.** The board appears… sparse. Little floating heads in a big dark purple void. The dark cats are nearly invisible against the background. Three of the five breeds are shades of orange/tan — I squint to tell corgi from shiba from tabby. The grey "frenchie" is 100% a bunny. Scanning for chains feels like an eye exam, not a toy box.

**0:45 — my first merge.** I drag through three tuxedos — the rope is nice, the notes are nice — release… and the three pets **blink out of existence and a bigger one pops in.** +216. There was no hug. The game's entire premise — "they hug so hard they grow up" — *is a line of text, not a thing I saw.* It feels like a database transaction with a chord. Meanwhile the celebration text overlaps another whisper and renders as **illegible mush** at the exact moment the game is trying to celebrate me.

**1:30 — second merge, planning ahead.** I now have a stage-2 tux. To grow it I need TWO more stage-2 tuxes… which means finding six more stage-1 tuxes on a board where tuxes are ~1 in 5. I do the math in my head and my motivation dies: **the big pets are a spreadsheet grind away.** And the +108s keep coming — every action is worth roughly the same. Flat. No spikes, no jackpots, no "one more move because something amazing might happen."

**2:30 — the score.** I'm at a few hundred points. Is that… good? There's no par, no ghost of yesterday, no "friends average," nothing. **648 means literally nothing.** So the tuck decision — the whole dramatic core — has no reference point. Banking at 648 vs 800 vs 1,200: emotionally identical. The pink button asks "hold your nerve?" and honest answer is: *for what?*

**3:00 — the yawns.** The only thing the board ever does on its own is *take things away from me.* Every event is negative. Nothing lucky ever happens TO me.

**Verdict as a player: it's polite, pretty-ish, and hollow. Nothing I do lands with weight, nothing I earn buys anything, and nothing on the board surprises me in my favor.**

---

## THE FEEDBACK LIST (ranked, each with the fix)

### P0 — why it feels unsatisfying (fix these before anything else)

**1. The merge has no hug. The core moment is invisible.**
Pets vanish; a bigger one pops. FIX — 350ms of choreography: linked pets *crouch* (anticipation) → slide along the rope INTO the end cell, squashing together → heart-burst + **60–90ms hitstop** → the bigger pet *unfurls* (stretch → settle) → score counts up from the impact point. Stage-3 births get slow-mo + shake. This single fix is half the game's feel.

**2. The score means nothing, so the gamble means nothing.**
FIX — **THE SLEEPY BOT**: a deterministic bot "plays" tonight's exact daily (seeded simulation, zero backend, same result worldwide). Its score is tonight's par, on the HUD the whole run: *"the bot tucked 1,840."* Results: *"you beat the bot by +412 🏆"* / share line includes it. Instant meaning, instant argument-bait ("I beat the bot, you didn't"), plus personal-best ghost.

**3. Dreamlight buys nothing and the den is a dead end.**
The reward currency has no sink; after the daily the app offers three grey timers. FIX — ship the **mini-shop v0 now**: 5 furniture items (rug ✦40, fern ✦60, lamp ✦90, cushion ✦150, fireplace ✦250), each *visibly placed*, pets interact with them. One "tonight's want" highlighted daily. Every ✦ earned today is an IOU the game never pays — this is the retention hole.

**4. The growth ladder is broken math: graduation can NEVER happen.**
3 stage-3s of one breed = 27+ same-breed pets; the deck carries ~17 per breed. The den-population promise is unreachable; even one stage-3 is a rare grind. FIX — (a) **featured breed nights**: "tonight is corgi night" — featured breed = ~40% of the deck, making one stage-3 reachable most runs; (b) **a stage-3 on the board when you tuck graduates automatically** ("THE LOAF walks home when you tuck them in") — the den fills every few nights for a decent player; (c) the 3×stage-3 link becomes a legendary rare feat with its own cinematic.

**5. Nothing good ever happens to the player. All board events are taxes.**
FIX — (a) **wake bonus**: hugs that wake sleepers score +40 per woken pet ("the neighbors joined the hug!") — turns the antagonist into opportunity and makes sleep management a scoring toy; (b) **the drifting star**: every ~4th merge a golden star settles on a cell for 3 moves — run a chain through it = that merge ×2. Luck that *favors* you, deterministic seed, pure warmth.

### P1 — readability & feel

**6. The board is floating heads in a void.** Give pets soft tile-cards to sit on (quilt squares / basket weave), warm the board background, add cell shadows — a full, tactile toy-box, not a spreadsheet.
**7. Dark pets invisible on dark background.** Tile-cards fix it; add rim-light to tux/void.
**8. Three-oranges problem.** Shift shiba → cream/white, tabby → deep ginger red; corgi keeps marmalade. Five breeds, five silhouettes AND five color families.
**9. The frenchie is a bunny.** Wider-set, rounder, darker bat ears + jowl line — or replace with a beagle (floppy ears can't read as bunny).
**10. Celebration text collides into mush.** Callout queue: one center-stage message at a time, others stack below or wait.

### P2 — smaller but real

**11.** The moon phase renders like a bean/eyeball — redraw with proper crescent arcs.
**12.** Post-daily den needs *one* evergreen verb: the nightly "tuck everyone in" ritual (+✦, lamp dims), plus "tomorrow is shiba night" teaser.
**13.** Care chips on cooldown are a grey wall — show what the next tap gives; pulse when <10 min.
**14.** Audio still needs a human-ears pass (untestable via automation).
**15.** Practice is the daily minus meaning — rename "midnight stroll," give it one twist so it's a different flavor, not a lesser copy.

---

## Recommended build order (v4 scope, ~1 session)
1. Merge choreography + hitstop (P0-1) — the feel
2. Sleepy Bot par + beat-the-bot results/share (P0-2) — the meaning
3. Mini-shop v0 + auto-graduation + featured nights (P0-3, P0-4) — the payoff
4. Wake bonus + drifting star (P0-5) — the luck
5. Tile-cards + breed recolor + callout queue (P1-6/7/8/10) — the readability
