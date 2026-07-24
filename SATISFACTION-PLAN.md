# PAWRADE — THE SATISFACTION CORE (workstream E)
### 2026-07-13 · owner: "the home environment still feels unsatisfying. the pawrade also feels unsatisfying. I want ingenuity, originality and creativity. end users have to FEEL SATISFIED."
### This plan supersedes the ordering of every other open workstream. E ships first.

---

# PART 1 — THE HONEST DIAGNOSIS (why polish hasn't fixed it)

Three passes have landed (juice, level variety, rescue ceremonies) and the game still doesn't *feel* satisfying. That's because satisfaction in this genre rests on four pillars, and PAWRADE only has two:

| Pillar | What it means | PAWRADE today |
|---|---|---|
| **Feedback** (juice) | every action answers loudly | ✅ strong — hitstop, squash, combo pitch, confetti |
| **Anticipation** (variable reward) | "what will I get?" | 🟡 planned (#36), never built |
| **POWER EXPRESSION** | my skill mints something powerful, and USING it erupts | ❌ **absent entirely** |
| **TOUCH** | the world responds to my hands, not my taps | ❌ **absent entirely** |

**The parade's missing engine: specials.** Candy Crush's real genius was never blockers — it's that matching 4 mints a striped candy, matching 5 mints a color bomb, and *using* (and combining!) them produces board-scale eruptions. That loop — earn power → hold power → spend power → eruption — is the competence high the whole genre runs on. PAWRADE gives a 6-link exactly what it gives a 3-link: one bigger pet. Skill mints nothing. There is no power to hold, spend, or combine. **That's why the parade feels flat no matter how much juice sits on top.**

**The den's missing engine: hands.** The den is a diorama you watch. Tap → hearts is a vending machine. Every pet game that people love to *touch* (Talking Tom, Tamagotchi, Peridot) is built on direct manipulation — stroking, flinging, dragging, tucking. PAWRADE's care verbs are cooldown buttons. **That's why the home feels unsatisfying no matter how pretty the room gets.**

Everything below is designed in-fiction (bedtime, dreams, moonlight — ours, not Candy Crush's), and inside the laws (no destruction — special effects CAUSE hugs and wakings, never removal-as-violence; deterministic where the daily demands it).

# PART 2 — THE PARADE: dream-charged pets (the power layer)

## E1 · Special pets minted by big links
Link size now MATTERS — bigger links mint a charged pet at the merge cell (it's the same pet, one stage up, carrying a visible dream-charge):

| Minted by | Special | Mark on pet | When it joins a hug… |
|---|---|---|---|
| 4-link | **the Dreamer** | a drifting dream-bubble | her dream sweeps the whole **row or column** (direction = the final link segment, like a stripe's orientation): every sleeper in the line wakes, every same-breed pet in the line piles into the hug as a bonus |
| 5-link | **the Snuggler** | a little heart on the cheek | a **group hug**: all 8 neighbours are pulled in — sleepers wake, same-breed neighbours merge in |
| 6+ link | **the Moonchild** | a tiny glowing moon, soft halo | her lullaby reaches **every pet of that breed on the board** — they all join the parade at once |

**Combining specials** (two charged pets in one link) escalates: Dreamer+Dreamer = row AND column ("the dream crossed the whole house") · Dreamer+Snuggler = three full rows ("the slumber party") · anything+Moonchild = two breeds board-wide ("the whole house is dreaming"). 

Fiction rule that keeps it lawful and warm: **dreams are contagious, never destructive.** Effects wake, gather, and hug — extra score comes from the bonus hugs themselves. Nothing is destroyed or "cleared."

Bot-par note (law #2 fairness): the bot already links up to 5. When its link is 4/5 it takes a flat dream-bonus (tuned constant) instead of simulating sweeps — par stays deterministic and human-beatable; D5 calibrates the constant.

## E2 · Contagious dreams (cascades — folds in #36's Dream Chain)
After ANY merge lands, orthogonally-adjacent same-breed+stage pets echo-hug into it automatically at 50% points. The board answers your move with moves of its own — the unearned-windfall pillar. Single-level (no recursion) to keep par stable. Mirrored in the bot.

## E5 · Dream Bubbles (folds in #36's variable-reward layer — after E1/E2 so the economy is tuned once)
Seeded ~1/7-per-merge drifting bubble, tap to catch, staged rarity-ladder pop (✦S/✦M/✦L/fuse refill/wardrobe shard). Seeded from the run seed: daily identical worldwide.

# PART 3 — THE DEN: it responds to your hands

## E3 · Hands-on care
- **Stroking**: press ON a pet and drag = a stroke. Fur ripples along the stroke path, a purr builds (audio swells with consecutive strokes), hearts trail the finger, mood rises live — released after 3+ strokes → the big lean-in reaction. Per-personality responses (the void cat purrs *silently* — the joke survives).
- **Fetch that's real**: a toy basket sits in the room. Grab the ball or yarn, drag and FLING it — real velocity from the gesture (the den already has ball physics from `petBall`; this makes it player-owned). The nearest pet chases, bats it back toward you. The cart-frenchie is the fastest — her celebrated trait becomes visible play.
- Tap stays as a quick pat for everyone (B1's per-critter reactions still land later); stroking is the primary-pet intimacy verb.

## E4 · The Goodnight Ritual (+ folds in #36's Goodnight Gift)
The signature original moment — the verb the whole game is named for, done by hand:
Once per real evening the den offers "tuck the den in." You DRAG a quilt over each drowsy pet, one by one — each one sighs and settles as the quilt lands; a lamp dims with each tucked pet; when the last one is tucked the room goes moonlit-dark, the music box drops to half-tempo… and the **Goodnight Gift** appears at the door (3-tap staged opening, contents seeded day+streak). Ritual → payoff. ~30 seconds, skippable, never punished if missed (law #3).

# PART 4 — EXECUTION ORDER (this reshuffles everything open)

**E first — it is the satisfaction core:**
1. **E1 (#57) [Opus]** special pets: minting, marks, activation sweeps, combos, bot accounting
2. **E2 (#58) [Opus]** contagious-dream cascades (bot-mirrored)
3. **E3 (#59) [Opus]** hands-on den: stroking + flingable fetch
4. **E4 (#60) [Opus]** the Goodnight Ritual + Gift
5. **E5 (#61) [Sonnet]** dream bubbles (variable reward)

**Then the level workstream rides the new core:** D3 objectives (#54) → **D4 (#55, spec updated: nights now also teach the SPECIALS**, with authored moments like "a moonbeam tile placed where a Moonchild wants to be minted") → D5 (#56).
**Then den life:** B3 wants (#46) → B4 pair behaviors (#47) → B5 pets-use-furniture (#34).
**Then the remainder:** A4 (#43), B1/B2 (#44/#45), C1–C4 (#48–51), dopamine P1/P2 (#37/#38).
Task #36 is dissolved into E2/E4/E5.

**The bar for "done", per feature:** it must produce at least one moment where the tester involuntarily reacts (a smile, an "ohh") — the specials' first board-wide lullaby, the first fetch return, the first completed tuck-in. If a feature ships without its moment, it isn't done.

*(One standing constraint outside code: the pets are still parametric canvas art. The sprite pipeline + prompts are ready in SPRITE-ART-GUIDE.md — illustrated art remains the single biggest look-and-feel lever, and only the owner can supply it.)*
