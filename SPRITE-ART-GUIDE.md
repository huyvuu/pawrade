# PAWRADE — SPRITE ART PIPELINE & GENERATION GUIDE
### 2026-07-10 · pipeline BUILT & VERIFIED end-to-end (test sprite rendered on board, fallback confirmed)
### This is the ONE remaining lever between "charming indie" and "premium illustrated." Everything else is done.

---

## ⚡ QUICK START — paste this into any AI image tool (Midjourney / ChatGPT image / etc.) right now

> kawaii chibi corgi puppy head-and-shoulders portrait, front facing, perfectly centered, a round baby corgi with huge upright ears, marmalade orange coat (#f0a35e) with a cream blaze down the muzzle, big glossy hopeful eyes with bright catchlights, blushing rosy cheeks, tiny content smile, soft rounded shapes, warm flat vector illustration with subtle soft shading, gentle rim light from a warm lantern, cozy bedtime storybook style, plain transparent background, no text, no border, high quality mobile game character art

Save the result as **`corgi1.png`** (256×256, transparent background) into `PAWRADE\sprites\`, run `build.ps1`, and open the game — Mochi will be that illustrated corgi, everything else stays the current (now-cuter) code-drawn art. If you love the style, generate the rest from the manifest below using the first image as the reference/style anchor. **Send the PNGs to me and I'll bake + tune them in.**

---

## HOW IT WORKS (already built — you only make images)

1. You generate PNG images (below) and drop them into **`PAWRADE\sprites\`**.
2. Run **`build.ps1`**. Every PNG is baked into `index.html` as a data URI — still one file, zero dependencies, zero runtime cost. The build prints `N sprites baked`.
3. The game **automatically uses a sprite when its file exists** and falls back to the current parametric art per-pet when it doesn't. You can ship 2 sprites or 32 — nothing breaks.
4. Breath, tilt, squash-and-stretch, landing physics, and wardrobe accessories all still work on sprites (they're transforms and overlays).

**Tuning knobs** (top of `game.js`, if art sits wrong): `SPRITE_BOX = 3.2` (size vs. tile), `SPRITE_CY = -0.33` (vertical centering).

---

## THE FILE MANIFEST (32 files, exact names, all lowercase)

Awake + asleep variant for every pet. **A sleeping variant is required for any breed you sprite** — sleepers are a core mechanic (THE SLEEPIES) and mixed sprite/parametric art on one board reads broken.

| breed | stage 1 (baby) | stage 2 (grown) | stage 3 (majestic) |
|---|---|---|---|
| corgi | `corgi1.png` / `corgi1s.png` | `corgi2.png` / `corgi2s.png` | `corgi3.png` / `corgi3s.png` |
| shiba | `shiba1.png` / `shiba1s.png` | `shiba2.png` / `shiba2s.png` | `shiba3.png` / `shiba3s.png` |
| frenchie | `frenchie1.png` / `frenchie1s.png` | `frenchie2.png` / `frenchie2s.png` | `frenchie3.png` / `frenchie3s.png` |
| tabby | `tabby1.png` / `tabby1s.png` | `tabby2.png` / `tabby2s.png` | `tabby3.png` / `tabby3s.png` |
| tux | `tux1.png` / `tux1s.png` | `tux2.png` / `tux2s.png` | `tux3.png` / `tux3s.png` |
| void cat | `voidcat1.png` / `voidcat1s.png` | — | — |

**Start with just `corgi1.png` + `corgi1s.png`** to taste-test the style in-game before committing to 32.

## TECHNICAL SPEC (every file)

- **256×256 px** (512 max), **transparent background** (true alpha PNG — no white box)
- Head-and-shoulders portrait, **facing camera**, perfectly centered; subject fills ~**75%** of canvas (ears may reach ~90%)
- No drop shadow baked in (the game draws its own grounding shadow), no text, no border
- Keep total set light: aim <60KB/file → full set adds ~1–1.5MB to index.html (fine)

## THE STYLE BLOCK (paste at the start of EVERY prompt — consistency is everything)

> kawaii chibi pet head-and-shoulders portrait, front facing, perfectly centered, soft rounded shapes, big head, tiny dot-and-oval facial features, warm flat vector illustration with subtle soft shading, gentle rim light from a warm lantern, cozy bedtime storybook style, night-lavender-friendly palette, plain transparent background, no text, no border, high quality mobile game character art, consistent character sheet style

## PER-SPRITE SUBJECT LINES (append to the style block)

**Coat families (keep exact — the game's readability depends on them):** corgi = marmalade orange `#f0a35e` with cream blaze · shiba = pale cream `#f0e3c4` · frenchie = soft grey `#9a8f9e`, bat ears, pink inner-ear · tabby = deep ginger `#e0782c` with darker stripes · tux = near-black `#3f3a48` with cream bib and chin · void cat = ink-dark `#232030`, golden eyes, one tiny white star fleck.

- `corgi1` — a round baby corgi puppy, huge upright ears, marmalade orange with cream blaze, blushing cheeks, wide hopeful eyes
- `corgi2` — a young adult corgi, confident happy smile, marmalade orange with cream blaze, fluffy cheek tufts
- `corgi3` — THE LOAF: a majestic wide serene corgi, regal loaf posture, extra fluffy halo of fur, calm closed-arc blissful eyes, faint golden glow
- `shiba1` — a round baby shiba puppy, pale cream coat, triangle ears, tiny smug smile, blushing cheeks
- `shiba2` — a young adult shiba, pale cream coat, cheerful sly grin, fluffy curled ruff
- `shiba3` — CLOUD: a majestic enormous fluffy shiba like a cumulus cloud, pale cream, serene closed-arc eyes, softly radiant
- `frenchie1` — a round baby french bulldog puppy, soft grey, huge bat ears with pink inner-ear, big earnest eyes, squishy jowls
- `frenchie2` — a young adult french bulldog, soft grey, proud bat ears, endearing goofy grin
- `frenchie3` — THE GREMLIN: a majestic gremlin-king french bulldog, grey with mischief in its face, one ear kinked, delighted wide grin, faint glow
- `tabby1` — a round baby ginger tabby kitten, deep ginger with darker forehead stripes, huge curious eyes, tiny pink nose
- `tabby2` — a young adult ginger tabby cat, deep ginger, forehead M stripes, contented smile, whiskers
- `tabby3` — LONGCAT: a majestic serenely elongated ginger tabby, regal and softly glowing, closed-arc blissful eyes, prominent stripes
- `tux1` — a round baby tuxedo kitten, near-black with cream bib and chin, big golden eyes, tiny pink nose
- `tux2` — a young adult tuxedo cat, near-black with crisp cream bib, golden eyes, composed little smile
- `tux3` — THE CHAIRMAN: a majestic distinguished tuxedo cat with a tiny cream bowtie marking, golden eyes half-lidded with authority, faint golden glow
- `voidcat1` — a round ink-black void kitten, barely-there silhouette with huge golden eyes, one tiny white star sparkle on its head, mysterious and adorable

**Sleeping variants (`…s.png`):** same character, same pose, same palette, but *"eyes gently closed in two curved lines, tiny content smile, fast asleep"* — nothing else changes.

## WORKFLOW THAT KEEPS 32 IMAGES CONSISTENT

1. Generate `corgi2` first until you LOVE it. That image is now your **style anchor**.
2. Generate every other sprite with the same style block **plus the anchor image as reference** ("same art style and rendering as this reference, different character: …"). Most image models (GPT-image, Midjourney with `--sref`, etc.) support this.
3. Sleeping variants: feed each awake sprite back as reference, ask only for closed eyes.
4. Remove backgrounds if the model didn't (any background-remover; check no white halo).
5. Downscale to 256×256, drop into `sprites\`, run `build.ps1`, open the game.

## QA CHECKLIST (per sprite, 30 seconds each in-game)

- [ ] Transparent corners (no box) · centered (not clipped by the magenta-ring test extent)
- [ ] Reads at 96px tile size — squint test: can you tell the breed from color + silhouette alone?
- [ ] Sleeping variant clearly reads ASLEEP at tile size
- [ ] Stage 3 visibly grander than stage 2 than stage 1
- [ ] Wardrobe check: equip the flower crown on your pet — it should sit on the head, not float

## VERIFIED (so you don't have to wonder)

- Build baking: `1 sprites baked` → sprite rendered on every stage-1 corgi on a live board while all other breeds stayed parametric (per-key fallback ✓)
- Removal → rebuild → byte-identical fallback build ✓ · parse gate green ✓ · transforms + accessories apply over sprites ✓

## LATER (same pipeline, no code changes needed for the build side)
Furniture/prop sprites can be baked the same way (`SPRITES` accepts any name); wiring PROPS to consume them is a small follow-up. Do pets first — they're 90% of the perceived art quality.
