/* PAWRADE - Phase A+M+Sleepies. Built under the Craft Bible.
   Link-to-MERGE core: paths hug into the next growth stage. Final stages graduate to the den.
   THE SLEEPIES are the antagonist: yawns drift, pets doze, merges wake neighbors, a full nap ends the run.
   Zero backend, zero runtime tokens, outcomes deterministic per play. Corgis 8% slower (the legs). */
(function () {
'use strict';

// ============ CONFIG ============
var W = 720, H = 1160;
var COLS = 6, ROWS = 7, CELL = 96, GRID_X = (W - COLS * CELL) / 2, GRID_Y = 258;
var DECK_SIZE = 84, MIN_CHAIN = 3;
var EPOCH_Y = 2026, EPOCH_M = 6, EPOCH_D = 9;
var BREEDS = ['corgi', 'shiba', 'frenchie', 'tabby', 'tux'];
var VOID_RATE = 0.035;
var STAGE_MULT = [0, 1, 3, 9];
var STAGE_R = [0, 32, 40, 47];
var STAGE_NAME = {
  corgi:   ['', 'pup', 'corgi', 'THE LOAF'],
  shiba:   ['', 'pup', 'shiba', 'CLOUD'],
  frenchie:['', 'pup', 'frenchie', 'THE GREMLIN'],
  tabby:   ['', 'kitten', 'cat', 'LONGCAT'],
  tux:     ['', 'kitten', 'cat', 'THE CHAIRMAN']
};
var YAWN_EVERY = 3;          // every 3rd merge, a yawn drifts through
var YAWN_TARGETS = 2;        // pets it touches
var NAP_FRAC = 0.62;         // this fraction asleep = the nap wins
// five breeds, five color FAMILIES (the three-oranges fix): corgi marmalade / shiba pale-cream / tabby deep-ginger / frenchie grey / tux black
var COATS = {
  corgi:   [['#f0a35e','#d9854a'], ['#c98a4b','#a86a34'], ['#e8b87a','#c49356'], ['#b0713d','#8f5628']],
  shiba:   [['#f0e3c4','#d4c199'], ['#d9853f','#b5662a'], ['#f7efd8','#dccdaa'], ['#3a3540','#28242e']],
  frenchie:[['#9a8f9e','#75697d'], ['#5a5560','#443f4a'], ['#c9bcc7','#a396a8'], ['#8a6a4a','#6e5238']],
  tabby:   [['#e0782c','#b8571a'], ['#a8a4ae','#8a8694'], ['#c9884a','#a86a34'], ['#e8e0d0','#c4bcae']],
  tux:     [['#3f3a48','#2a2732'], ['#3a3540','#2a2530'], ['#443c4a','#302a36'], ['#28242e','#1a1720']]
};
var RIMLIGHT = { tux: 'rgba(160,180,220,.5)', voidcat: 'rgba(160,180,220,.4)', frenchie: 'rgba(220,210,225,.35)' };
// featured breed night — deterministic, worldwide. featured breed makes up ~42% of tonight's deck (graduation becomes reachable)
function featuredBreed() { return BREEDS[dayNumber() % BREEDS.length]; }
var FURNITURE = [
  { id: 'rug',    name: 'the fireplace rug',  cost: 40,  blurb: 'woven, warm, immediately claimed.' },
  { id: 'fern',   name: 'the window fern',    cost: 60,  blurb: 'nobody waters it. it thrives anyway.' },
  { id: 'lamp',   name: 'the reading lamp',   cost: 90,  blurb: 'a second little pool of warm.' },
  { id: 'cushion',name: 'the good cushion',   cost: 150, blurb: 'there will be arguments over this.' },
  { id: 'hearth', name: 'the hearth',         cost: 250, blurb: 'the den finally has a heartbeat.' }
];
// ============ THE RESCUE RITUAL ============
// vulnerable, never suffering (law: no sickness/pain/danger). the arc is TRUST, not survival — a multi-day
// comeback loop that fills once per real day you show up, not something that can be rushed or lost.
var RESCUE_POOL = [
  { breed: 'tux',      coat: 0, suggest: 'Penguin', trait: null,
    found: 'a soggy little tuxedo cat, found under the porch. she has opinions about the rain.' },
  { breed: 'corgi',    coat: 0, suggest: 'Biscuit',  trait: null,
    found: 'a corgi pup who won’t stop watching you from behind the fence. hasn’t decided about you yet.' },
  { breed: 'shiba',    coat: 0, suggest: 'Maple',    trait: null,
    found: 'a shiba hiding in the hedge, one ear still full of leaves. very suspicious of the whole situation.' },
  { breed: 'tabby',    coat: 0, suggest: 'Ginger',   trait: 'patch',
    found: 'a scruffy one-eyed tabby, keeping a very dashing watch from a safe distance.' },
  { breed: 'frenchie', coat: 0, suggest: 'Waffle',   trait: 'cart',
    found: 'a frenchie pup with a determined little wobble in her back legs. zero patience for pity.' },
  { breed: 'voidcat',  coat: 0, suggest: 'Whisper',  trait: null,
    found: 'something small and dark, watching from the shadows. she blinks first, eventually.' }
];
function rescueStage(trust) { return trust >= 85 ? 3 : trust >= 55 ? 2 : trust >= 25 ? 1 : 0; } // hiding / watching / approaching / home
var RESCUE_STAGE_WORD = ['still hiding', 'watching you', 'coming closer', 'home, for good 💛'];
var pendingArrivalProfile = null, pendingGlowRescue = -1, curFeaturedRescue = -1;
var DEN_RESCUE_X = 566, DEN_RESCUE_Y = 688;
function nextRescueProfile() { return RESCUE_POOL[Math.min(save.rescues.length, RESCUE_POOL.length - 1)]; }
// once per REAL calendar day the daily is completed — ties the arc to actually coming back, not to grinding
function advanceRescueRitual() {
  if (!save.rescues.length) { pendingArrivalProfile = RESCUE_POOL[0]; return; }
  if (save.rescues.length < RESCUE_POOL.length && save.nightsPlayed % 5 === 0) { pendingArrivalProfile = nextRescueProfile(); }
  for (var i = 0; i < save.rescues.length; i++) {
    var r = save.rescues[i];
    if (r.trust < 100) {
      r.trust = Math.min(100, r.trust + 22);
      if (r.trust >= 85 && !r.homeCelebrated) { r.homeCelebrated = true; pendingGlowRescue = i; }
      break; // only the OLDEST still-growing trust advances — they settle in one at a time
    }
  }
  persist();
}
var SCALE_HZ = [349.23, 392.0, 440.0, 523.25, 587.33, 698.46, 784.0, 880.0, 1046.5];
var WHISPERS = {
  denDay:   ['the den smells like warm bread today.', 'somebody hid the yarn again.', 'a good day for growing, probably.'],
  denNight: ['everyone is pretending to be asleep.', 'the lantern hums its one note.', 'the moon checked in on the den. all fine.'],
  boardStart: ['the whole world got these exact friends today.', 'everyone starts small tonight. everyone.'],
  strollStart: ['the strays are lining up for a stroll.'],
  linkBig:  ['that is a lot of paws holding paws.', 'the hug is getting ambitious.'],
  yawn:     ['a yawn drifts by...', 'someone started it. now look.', 'the sleepies are spreading.'],
  wake:     ['the hug woke the neighbors. they have opinions.', 'up! up! there is growing to do.'],
  sleepyBoard: ['the room is getting very sleepy...', 'so many little snores.'],
  armDeck:  ['...the night is still young.', '...there are friends left in the crowd.'],
  armStage: ['...{X} is one hug away.'],
  armLast:  ['...quit now? with one hug left?'],
  nap:      ['the nap won. it usually does, eventually.', 'everyone is asleep. it is honestly adorable. half the pot though.'],
  tucked:   ['smart. warm. a little boring. perfect.', 'the blanket does its one great trick.'],
  grown:    ['three {a} hugged so hard they became a {b}.'],
  graduated: ['{X} is complete. they are going home.'],
  featured: ['tonight the {X}s came out in force.', 'a good night to raise a {X}.'],
  star:     ['a lucky star settled in. run a hug through it.', 'ooh — a wishing star. quick, before it drifts off.'],
  starHit:  ['the wishing star DOUBLED it. ✦✦'],
  beatBot:  ['you out-hugged the sleepy bot. 🏆', 'the bot naps in shame.'],
  loseBot:  ['the sleepy bot got you tonight. get it tomorrow.']
};

// ============ STORAGE ============
var store = (function () {
  var mem = {};
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return (k in mem) ? mem[k] : d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; } }
  return { get: get, set: set };
})();
var SAVE_KEY = 'pawrade-v1';
var save = store.get(SAVE_KEY, {
  pet: null, rescues: [], streak: 0, lastDay: 0, nightsPlayed: 0, best: 0, bestParade: 0,
  dreamlight: 0, muted: false, daily: {}, care: { feed: 0, play: 0, gift: 0 }
});
// migrate: old builds stored save.nights as a play-counter number; it is now the Neighborhood map
if (typeof save.nights === 'number') { save.nightsPlayed = save.nights; save.nights = {}; }
save.nightsPlayed = save.nightsPlayed || 0;
save.graduates = save.graduates || {};   // breed -> count (they live in the den)
save.furniture = save.furniture || {};   // id -> true (owned den decor)
save.nights = (save.nights && typeof save.nights === 'object') ? save.nights : {}; // night id -> { moons, best }
save.seen = save.seen || {};             // 'breed+stage' -> true (the dreams album)
save.rooms = save.rooms || { den: true };// unlocked rooms of the home
save.home = save.home || {};             // roomId -> { slotId: styleIndex }  (placed decor)
save.owned = save.owned || {};           // accessoryId -> true (wardrobe you own)
save.albumRewards = save.albumRewards || {}; // breed -> true (stage-3 reward claimed)
save.legends = save.legends || {};       // legendId -> true (one-of-a-kind friends)
save.rareGrads = save.rareGrads || {};   // breed -> coatIdx (rare-coat majestic raised)
save.botBeats = save.botBeats || 0;      // dailies where you out-hugged the bot (gilded corgi chase)
if (save.strollEnergy == null) save.strollEnergy = 3;   // stroll hearts — daily & the neighborhood are ALWAYS unlimited, only strolls tucker out
if (save.strollEnergyT == null) save.strollEnergyT = Date.now();
if (save.founder === undefined) save.founder = false; // the one-time founder pack (supporter)
if (save.pet) { if (save.pet.mood == null) save.pet.mood = 82; if (save.pet.moodT == null) save.pet.moodT = Date.now(); if (save.pet.bond == null) save.pet.bond = 0; }
if (save.demoSeen === undefined) save.demoSeen = false;
if (save.tutDone === undefined) save.tutDone = false;
// migrate: rescues adopted before the trust arc existed are grandfathered in as already-home (fair — they were never asked to wait)
for (var mri = 0; mri < save.rescues.length; mri++) { var mr = save.rescues[mri]; if (mr.trust == null) mr.trust = 100; if (mr.homeCelebrated == null) mr.homeCelebrated = true; if (mr.trait === undefined) mr.trait = null; }
function persist() { store.set(SAVE_KEY, save); }

// ============ RNG / TIME ============
function hashStr(s) { var h = 1779033703 ^ s.length; for (var i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return (h >>> 0); }
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function startOfToday() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime(); }
function dayNumber() { return Math.max(1, Math.floor((startOfToday() - new Date(EPOCH_Y, EPOCH_M, EPOCH_D).getTime()) / 864e5) + 1); }
function isNight() { var h = new Date().getHours(); return h >= 21 || h < 6; }
function moonPhase() { var synodic = 29.53058867; var days = (Date.now() - Date.UTC(2000, 0, 6, 18, 14)) / 864e5; return ((days / synodic) % 1 + 1) % 1; }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function whisperOf(pool) { return pool[Math.floor(Math.random() * pool.length)]; }

// ============ AUDIO ============
var AC = null, master = null, lastThud = 0;
function audio() {
  if (save.muted) return null;
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = 0.42; master.connect(AC.destination); } catch (e) { return null; } }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function mallet(freq, when, gain, dur) {
  var ac = audio(); if (!ac) return;
  var t0 = ac.currentTime + (when || 0);
  var lull = isNight();
  if (lull) { gain = (gain || 0.2) * 0.7; dur = (dur || 0.5) * 1.5; }
  var o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
  o.type = 'triangle'; o.frequency.value = freq;
  o2.type = 'sine'; o2.frequency.value = freq * 2.004;
  f.type = 'lowpass'; f.frequency.value = lull ? 1400 : 3800;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain || 0.2, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + (dur || 0.5));
  o.connect(g); o2.connect(g); g.connect(f); f.connect(master);
  o.start(t0); o2.start(t0); o.stop(t0 + (dur || 0.5) + 0.05); o2.stop(t0 + (dur || 0.5) + 0.05);
}
function noisePuff(when, gain, freq) {
  var ac = audio(); if (!ac) return;
  var t0 = ac.currentTime + (when || 0);
  var len = Math.floor(ac.sampleRate * 0.09), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  var src = ac.createBufferSource(); src.buffer = buf;
  var f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq || 800;
  var g = ac.createGain(); g.gain.value = gain || 0.12;
  src.connect(f); f.connect(g); g.connect(master); src.start(t0);
}
var VOICE = {
  corgi: function (st) { mallet(174.6 / (st || 1), 0, 0.22, 0.14); noisePuff(0, 0.06, 400); },
  shiba: function () { mallet(261.6, 0, 0.14, 0.12); mallet(329.6, 0.07, 0.1, 0.12); },
  frenchie: function () { noisePuff(0, 0.16, 600); noisePuff(0.09, 0.1, 450); },
  tabby: function () { mallet(392, 0, 0.12, 0.16); mallet(523.25, 0.08, 0.12, 0.2); },
  tux: function () { mallet(440, 0, 0.1, 0.3); },
  voidcat: function () { /* the silence IS the joke */ }
};
function uiTick() { mallet(SCALE_HZ[2], 0, 0.08, 0.18); }
function yawnSound() { mallet(196, 0, 0.1, 0.9, true); mallet(147, 0.3, 0.08, 1.1); }
function wakeSound() { mallet(587, 0, 0.1, 0.12); mallet(698, 0.06, 0.1, 0.14); }
function mergeChord(stage) { var base = stage === 3 ? 2 : (stage === 2 ? 1 : 0); mallet(SCALE_HZ[base], 0, 0.18, 0.5); mallet(SCALE_HZ[base + 2], 0.05, 0.16, 0.55); mallet(SCALE_HZ[base + 4], 0.1, 0.14, 0.7); }

// ============ CANVAS / STAGE ============
var cv = document.getElementById('cv'), ctx = cv.getContext('2d');
var stage = document.getElementById('stage');
function fit() { var s = Math.min(window.innerWidth / W, window.innerHeight / H); stage.style.width = (W * s) + 'px'; stage.style.height = (H * s) + 'px'; }
window.addEventListener('resize', fit); fit();
function toWorld(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; }
(function grain() {
  var g = document.createElement('canvas'); g.width = 160; g.height = 160;
  var gc = g.getContext('2d'), im = gc.createImageData(160, 160);
  for (var i = 0; i < im.data.length; i += 4) { var v = 120 + Math.random() * 135; im.data[i] = v; im.data[i + 1] = v; im.data[i + 2] = v; im.data[i + 3] = 255; }
  gc.putImageData(im, 0, 0);
  document.getElementById('grain').style.background = 'url(' + g.toDataURL() + ')';
})();

// ============ SPRITES (build-time baked art; empty object = 100% parametric fallback) ============
var SPR = (typeof SPRITES !== 'undefined') ? SPRITES : {};
var sprImgs = {};
var SPRITE_BOX = 3.2;    // sprite draw box, in multiples of r
var SPRITE_CY = -0.33;   // vertical centering (parametric pets' visual center sits above origin: tall ears)
function decodeSprites() { for (var k in SPR) { var im = new Image(); im.src = SPR[k]; sprImgs[k] = im; } }

// ============ PET RENDERER ============
// o: {breath, blinkL, blinkR, pupil, sleeping, sad, wet, tilt, stage}
function drawPet(c, breed, coatIdx, x, y, r, o) {
  o = o || {};
  var st = o.stage || 1;
  var coat = o.coatO ? o.coatO : ((breed === 'voidcat') ? ['#232030', '#161320'] : (COATS[breed] ? COATS[breed][coatIdx || 0] : ['#ccc', '#999']));
  var C1 = coat[0], C2 = coat[1];
  var ink = (breed === 'tux' || breed === 'voidcat') ? '#fdf3e0' : '#4a3010';
  var breath = 1 + (o.breath || 0) * 0.02;
  c.save(); c.translate(x, y); c.rotate(o.tilt || 0); c.scale(breath, breath);
  var e = r / 20;
  // ---- illustrated sprite path: baked art wins; parametric below is the fallback ----
  // sleeping pets need their own '<key>s' variant (eyes closed) — mixed art reads wrong
  var sk = breed + st + (o.sleeping ? 's' : '');
  var si = sprImgs[sk];
  // legends (coatO) and rare coats stay parametric until dedicated variant sprites exist — wrong-colored art reads broken
  if (!o.coatO && !(coatIdx > 0) && si && si.complete && si.naturalWidth) {
    var sbox = r * SPRITE_BOX;
    c.drawImage(si, -sbox / 2, r * SPRITE_CY - sbox / 2, sbox, sbox);
    if (o.worn && typeof ACCESSORIES !== 'undefined' && ACCESSORIES[o.worn]) ACCESSORIES[o.worn].draw(c, e);
    c.restore();
    return;
  }
  var headRx = (st === 3) ? 14.8 * e : 13.6 * e;   // stage 3 = wider, loafier
  var headRy = (st === 3) ? 14.2 * e : 13.6 * e;   // rounder head = babyish = cuter

  if (st === 3) { // majesty halo floof
    c.fillStyle = C1; c.globalAlpha = 0.25;
    c.beginPath(); c.ellipse(0, 0.6 * e, headRx * 1.18, headRy * 1.16, 0, 0, 7); c.fill();
    c.globalAlpha = 1;
  }
  // ears
  if (breed === 'corgi') {
    c.fillStyle = C1;
    c.beginPath(); c.moveTo(-12 * e, -6 * e); c.quadraticCurveTo(-15 * e, -26 * e, -4 * e, -27 * e); c.quadraticCurveTo(2 * e, -27 * e, 2 * e, -17 * e); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(12 * e, -6 * e); c.quadraticCurveTo(15 * e, -26 * e, 4 * e, -27 * e); c.quadraticCurveTo(-2 * e, -27 * e, -2 * e, -17 * e); c.closePath(); c.fill();
    c.strokeStyle = C2; c.lineWidth = 1.6 * e;
    c.beginPath(); c.moveTo(-10 * e, -10 * e); c.quadraticCurveTo(-11 * e, -21 * e, -5 * e, -23 * e); c.stroke();
    c.beginPath(); c.moveTo(10 * e, -10 * e); c.quadraticCurveTo(11 * e, -21 * e, 5 * e, -23 * e); c.stroke();
  } else if (breed === 'shiba') {
    c.fillStyle = C1;
    c.beginPath(); c.moveTo(-13 * e, -8 * e); c.lineTo(-9 * e, -24 * e); c.lineTo(0, -13 * e); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(13 * e, -8 * e); c.lineTo(9 * e, -24 * e); c.lineTo(0, -13 * e); c.closePath(); c.fill();
  } else if (breed === 'frenchie') {
    c.fillStyle = C1;
    c.beginPath(); c.ellipse(-10 * e, -18 * e, 6.2 * e, 9.6 * e, -0.22, 0, 7); c.fill();
    c.beginPath(); c.ellipse(10 * e, -18 * e, 6.2 * e, 9.6 * e, 0.22, 0, 7); c.fill();
    c.fillStyle = '#e8c9d4';
    c.beginPath(); c.ellipse(-10 * e, -17 * e, 3 * e, 5.4 * e, -0.22, 0, 7); c.fill();
    c.beginPath(); c.ellipse(10 * e, -17 * e, 3 * e, 5.4 * e, 0.22, 0, 7); c.fill();
  } else {
    c.fillStyle = C1;
    c.beginPath(); c.moveTo(-13 * e, -7 * e); c.lineTo(-9 * e, -23 * e); c.lineTo(-1 * e, -12 * e); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(13 * e, -7 * e); c.lineTo(9 * e, -23 * e); c.lineTo(1 * e, -12 * e); c.closePath(); c.fill();
  }
  // head
  c.fillStyle = C1;
  c.beginPath(); c.ellipse(0, 0.6 * e, headRx, headRy, 0, 0, 7); c.fill();
  // rim-light so dark pets read against the dark board
  if (RIMLIGHT[breed]) { c.strokeStyle = RIMLIGHT[breed]; c.lineWidth = 1.8 * e; c.beginPath(); c.ellipse(0, 0.6 * e, headRx, headRy, 0, Math.PI * 1.02, Math.PI * 1.62); c.stroke(); }
  // dimension: soft bottom shade + top-left highlight so pets read round, not flat clip-art
  c.globalAlpha = 0.12; c.fillStyle = '#000';
  c.beginPath(); c.ellipse(0, 0.6 * e + headRy * 0.46, headRx * 0.8, headRy * 0.44, 0, 0, 7); c.fill();
  c.globalAlpha = 0.16; c.fillStyle = '#fff';
  c.beginPath(); c.ellipse(-headRx * 0.3, 0.6 * e - headRy * 0.4, headRx * 0.5, headRy * 0.34, 0, 0, 7); c.fill();
  c.globalAlpha = 1;
  // markings
  if (breed === 'corgi') { c.fillStyle = '#fdf3e0'; c.beginPath(); c.moveTo(-6.5 * e, 2 * e); c.quadraticCurveTo(0, -5 * e, 6.5 * e, 2 * e); c.quadraticCurveTo(7 * e, 10 * e, 0, 12.5 * e); c.quadraticCurveTo(-7 * e, 10 * e, -6.5 * e, 2 * e); c.fill(); }
  if (breed === 'shiba') { c.fillStyle = '#faf0dc'; c.beginPath(); c.arc(-8 * e, 6 * e, 5 * e, 0, 7); c.fill(); c.beginPath(); c.arc(8 * e, 6 * e, 5 * e, 0, 7); c.fill(); c.beginPath(); c.moveTo(-7 * e, 7 * e); c.quadraticCurveTo(0, 12 * e, 7 * e, 7 * e); c.quadraticCurveTo(4 * e, 13.5 * e, 0, 13.5 * e); c.quadraticCurveTo(-4 * e, 13.5 * e, -7 * e, 7 * e); c.fill(); }
  if (breed === 'tabby') { c.strokeStyle = C2; c.lineWidth = 1.7 * e; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-5 * e, -11 * e); c.quadraticCurveTo(-4 * e, -8 * e, -5 * e, -5.5 * e); c.stroke();
    c.beginPath(); c.moveTo(0, -12 * e); c.quadraticCurveTo(1 * e, -9 * e, 0, -6 * e); c.stroke();
    c.beginPath(); c.moveTo(5 * e, -11 * e); c.quadraticCurveTo(4 * e, -8 * e, 5 * e, -5.5 * e); c.stroke();
    if (st === 3) { c.beginPath(); c.moveTo(-headRx + 1 * e, 2 * e); c.lineTo(-headRx + 4.5 * e, 2 * e); c.stroke(); c.beginPath(); c.moveTo(headRx - 1 * e, 2 * e); c.lineTo(headRx - 4.5 * e, 2 * e); c.stroke(); } }
  if (breed === 'tux') { c.fillStyle = '#fdf3e0'; c.beginPath(); c.moveTo(-6 * e, 4 * e); c.quadraticCurveTo(0, -1 * e, 6 * e, 4 * e); c.quadraticCurveTo(5 * e, 12 * e, 0, 13 * e); c.quadraticCurveTo(-5 * e, 12 * e, -6 * e, 4 * e); c.fill();
    if (st === 3) { c.strokeStyle = '#fdf3e0'; c.lineWidth = 1.4 * e; c.beginPath(); c.moveTo(-3 * e, 15 * e); c.lineTo(0, 17.5 * e); c.lineTo(3 * e, 15 * e); c.stroke(); } } // the chairman's little bowtie
  // eyes — big, round and glossy: the single biggest 'aww' lever. low-set + wide = babyish
  var eyeY = -0.2 * e, gap = 6.3 * e, er = 3.35 * e;
  var px = (o.pupil ? o.pupil.x : 0) * 0.9 * e, py = (o.pupil ? o.pupil.y : 0) * 0.9 * e;
  var serene = (st === 3) && !o.sleeping && !o.sad;
  var gloss = function (cx, cy) { // two catchlights make the eye read wet and alive
    c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.arc(cx + er * 0.32, cy - er * 0.42, er * 0.44, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(cx - er * 0.38, cy + er * 0.34, er * 0.2, 0, 7); c.fill();
  };
  if (o.sleeping) {
    c.strokeStyle = ink; c.lineWidth = 2 * e; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-gap - 2.4 * e, eyeY + e); c.quadraticCurveTo(-gap, eyeY + 3.2 * e, -gap + 2.4 * e, eyeY + e); c.stroke();
    c.beginPath(); c.moveTo(gap - 2.4 * e, eyeY + e); c.quadraticCurveTo(gap, eyeY + 3.2 * e, gap + 2.4 * e, eyeY + e); c.stroke();
  } else if (serene) {
    c.strokeStyle = ink; c.lineWidth = Math.max(2, r * 0.075); c.lineCap = 'round';
    c.beginPath(); c.arc(-gap, eyeY, er, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
    c.beginPath(); c.arc(gap, eyeY, er, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
  } else if (breed === 'tux' || breed === 'voidcat') {
    var ec = (breed === 'voidcat') ? '#ffd76e' : '#ffe08a';
    var blL = o.blinkL && breed !== 'voidcat', blR = o.blinkR && breed !== 'voidcat';
    c.fillStyle = ec;
    if (!blL) { c.beginPath(); c.ellipse(-gap, eyeY, er * 0.94, er * 1.12, 0, 0, 7); c.fill(); }
    if (!blR) { c.beginPath(); c.ellipse(gap, eyeY, er * 0.94, er * 1.12, 0, 0, 7); c.fill(); }
    c.fillStyle = '#131019';
    if (!blL) { c.beginPath(); c.ellipse(-gap + px, eyeY + py, er * 0.5, er * 0.74, 0, 0, 7); c.fill(); }
    if (!blR) { c.beginPath(); c.ellipse(gap + px, eyeY + py, er * 0.5, er * 0.74, 0, 0, 7); c.fill(); }
    if (!blL) gloss(-gap + px * 0.6, eyeY + py * 0.6);
    if (!blR) gloss(gap + px * 0.6, eyeY + py * 0.6);
  } else {
    if (o.blinkL) { c.strokeStyle = ink; c.lineWidth = 1.9 * e; c.lineCap = 'round'; c.beginPath(); c.moveTo(-gap - 2.2 * e, eyeY - 0.3 * e); c.quadraticCurveTo(-gap, eyeY + 1.5 * e, -gap + 2.2 * e, eyeY - 0.3 * e); c.stroke(); }
    else { c.fillStyle = ink; c.beginPath(); c.ellipse(-gap + px, eyeY + py, er * 0.92, er, 0, 0, 7); c.fill(); gloss(-gap + px, eyeY + py); }
    if (o.blinkR) { c.strokeStyle = ink; c.lineWidth = 1.9 * e; c.lineCap = 'round'; c.beginPath(); c.moveTo(gap - 2.2 * e, eyeY - 0.3 * e); c.quadraticCurveTo(gap, eyeY + 1.5 * e, gap + 2.2 * e, eyeY - 0.3 * e); c.stroke(); }
    else { c.fillStyle = ink; c.beginPath(); c.ellipse(gap + px, eyeY + py, er * 0.92, er, 0, 0, 7); c.fill(); gloss(gap + px, eyeY + py); }
  }
  // blush — big rosy cheeks, low on the face
  if (!o.sleeping) {
    c.fillStyle = (breed === 'frenchie') ? 'rgba(232,150,172,.5)' : 'rgba(246,150,112,.46)';
    c.beginPath(); c.ellipse(-9.9 * e, 5.8 * e, 3.4 * e, 2.5 * e, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(9.9 * e, 5.8 * e, 3.4 * e, 2.5 * e, 0, 0, 7); c.fill();
  }
  // nose + mouth — sit low under the big eyes
  var isDog = (breed === 'corgi' || breed === 'shiba' || breed === 'frenchie');
  c.fillStyle = (breed === 'frenchie') ? '#33254a' : ((breed === 'tux' || breed === 'voidcat' || breed === 'tabby') ? '#f0906a' : '#4a3010');
  c.beginPath(); c.ellipse(0, 5.6 * e, isDog ? 2.4 * e : 1.6 * e, isDog ? 1.9 * e : 1.3 * e, 0, 0, 7); c.fill();
  c.strokeStyle = ink; c.lineWidth = 1.4 * e; c.lineCap = 'round';
  if (o.sad) { c.beginPath(); c.moveTo(-2.6 * e, 10.6 * e); c.quadraticCurveTo(0, 8.6 * e, 2.6 * e, 10.6 * e); c.stroke(); }
  else if (o.sleeping) { c.beginPath(); c.moveTo(-1.6 * e, 9.6 * e); c.quadraticCurveTo(0, 10.6 * e, 1.6 * e, 9.6 * e); c.stroke(); }
  else {
    c.beginPath(); c.moveTo(0, 7.2 * e); c.quadraticCurveTo(0, 9 * e, -2.6 * e, 9.4 * e); c.stroke();
    c.beginPath(); c.moveTo(0, 7.2 * e); c.quadraticCurveTo(0, 9 * e, 2.6 * e, 9.4 * e); c.stroke();
    if (isDog) { c.fillStyle = '#f0906a'; c.beginPath(); c.moveTo(-1.8 * e, 10.2 * e); c.quadraticCurveTo(0, 13.4 * e, 1.8 * e, 10.2 * e); c.closePath(); c.fill(); }
  }
  if (breed === 'tabby' && st < 3) {
    c.strokeStyle = 'rgba(74,48,16,.6)'; c.lineWidth = 0.9 * e;
    c.beginPath(); c.moveTo(-13 * e, 3 * e); c.lineTo(-18 * e, 2.4 * e); c.stroke();
    c.beginPath(); c.moveTo(13 * e, 3 * e); c.lineTo(18 * e, 2.4 * e); c.stroke();
  }
  if (o.wet) { c.strokeStyle = 'rgba(125,184,236,.8)'; c.lineWidth = 1.2 * e; c.beginPath(); c.moveTo(10 * e, -9 * e); c.lineTo(12 * e, -5 * e); c.stroke(); }
  if (breed === 'voidcat') { c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(8 * e, -8 * e, 0.9 * e, 0, 7); c.fill(); }
  if (o.worn && typeof ACCESSORIES !== 'undefined' && ACCESSORIES[o.worn]) ACCESSORIES[o.worn].draw(c, e); // V7 wardrobe overlay
  c.restore();
}

// ============ IDLE LIFE ============
function IdleSoul(seed) {
  var rng = mulberry32(seed);
  this.breathP = rng() * 6.28; this.breathS = 3.8 + rng() * 1.4;
  this.nextBlink = performance.now() + 1500 + rng() * 6000;
  this.blinkUntil = 0;
}
IdleSoul.prototype.tick = function (now) { if (now > this.nextBlink) { this.blinkUntil = now + 120; this.nextBlink = now + 4000 + Math.random() * 4000; } };
IdleSoul.prototype.breath = function (now) { return Math.sin(now / 1000 * (6.28 / this.breathS) + this.breathP); };
IdleSoul.prototype.blinking = function (now) { return now < this.blinkUntil; };

// ============ GAME STATE ============
var screenMode = 'den', phase = 'idle';
var grid = [], deck = [], deckPos = 0, yawnRng = null;
var score = 0, longestHug = 0, mergeCount = 0, grownTonight = 0, gradsTonight = [], runMode = 'daily';
var curYawnEvery = 3, curYawnTargets = 2, curNight = 0, curObjective = null, wokenTotal = 0;
var curMask = [];   // this run's fixed obstacle shape — same every attempt, part of the level's "architecture"
function isBlockedCell(x, y) { return isMaskedCell(curMask, x, y); }
var mapScroll = 0, mapDrag = null;   // Neighborhood map scroll state
var slotPreview = [];                // home slot-chooser preview canvases (populated at boot, before V6 defs)
var wardrobeOpen = false, wardrobeCv, wardrobeCtx;   // V7 dressing room (declared up top — boot-order safety)
var glowupCv, glowupCtx;                             // the rescue glow-up reveal (declared up top — boot-order safety)
var wardrobePreview = null;                          // accessory id being TRIED ON, not yet bought — no more accidental purchases
var petIdle = null, petIdleNext = 0;                 // den pet autonomous idle life
// ============ THE DEN, IN 2.5D ============
// a pseudo-perspective floor: depth 0 (far/back wall) .. 1 (near/front). true WebGL 3D would break the
// single-file zero-dep law, so this is the classic mobile-game trick — flat sprites that move & scale on
// a projected floor plane, depth-sorted so "further back" always draws behind "closer."
var DEN_FLOOR_TOPY = 330, DEN_FLOOR_BOTY = 900, DEN_FLOOR_TOPHW = 175, DEN_FLOOR_BOTHW = 430;
function denProject(depth, lateral) {
  var y = DEN_FLOOR_TOPY + depth * (DEN_FLOOR_BOTY - DEN_FLOOR_TOPY);
  var hw = DEN_FLOOR_TOPHW + depth * (DEN_FLOOR_BOTHW - DEN_FLOOR_TOPHW);
  return { x: W / 2 + lateral * hw, y: y, scale: 0.58 + depth * 0.62 };
}
// each roamer picks waypoints from its own zone only. the PET owns the centre column as the hero (mid-depth so its
// floating name has clear sky above and its chin clears the whisper below); everyone else lives in the back band,
// pushed to the LEFT/RIGHT so they never share the pet's centre column — no sprite or label ever converges.
var PET_WP = [{ d: 0.66, l: 0 }, { d: 0.63, l: 0.05 }, { d: 0.69, l: -0.05 }, { d: 0.65, l: 0.03 }];
// graduates keep to the LEFT (one far-back corner, one mid-forward), the rescue owns the RIGHT — pet owns centre.
var GRAD_L_WP = [{ d: 0.23, l: -0.68 }, { d: 0.26, l: -0.74 }, { d: 0.22, l: -0.62 }, { d: 0.25, l: -0.72 }];
var GRAD_R_WP = [{ d: 0.34, l: -0.42 }, { d: 0.37, l: -0.46 }, { d: 0.32, l: -0.38 }, { d: 0.36, l: -0.44 }];
var RESCUE_WP = [{ d: 0.31, l: 0.44 }, { d: 0.33, l: 0.5 }, { d: 0.29, l: 0.38 }, { d: 0.32, l: 0.46 }];
function wanderInit(d0, l0) { return { d: d0, l: l0, fromD: d0, fromL: l0, toD: d0, toL: l0, t0: 0, dur: 1, pauseUntil: 0, moving: false }; }
function wanderTick(w, now, stagger, wp0) {
  wp0 = wp0 || PET_WP;
  if (!w.pauseUntil) w.pauseUntil = now + stagger;
  if (!w.moving && now > w.pauseUntil) {
    var wp = wp0[(Math.random() * wp0.length) | 0];
    w.fromD = w.d; w.fromL = w.l;
    w.toD = Math.max(0.18, Math.min(0.88, wp.d + (Math.random() - 0.5) * 0.05));
    w.toL = Math.max(-0.82, Math.min(0.82, wp.l + (Math.random() - 0.5) * 0.12));
    w.t0 = now; w.dur = 1900 + Math.random() * 1500; w.moving = true;
  }
  if (w.moving) {
    var p = Math.min(1, (now - w.t0) / w.dur);
    var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    w.d = w.fromD + (w.toD - w.fromD) * e; w.l = w.fromL + (w.toL - w.fromL) * e;
    if (p >= 1) { w.moving = false; w.pauseUntil = now + 4200 + Math.random() * 6800; }
  }
  return w;
}
var petWander = null, gradWander = [null, null], rescueWander = null;
var petScreenPos = { x: 300, y: 618, r: 124 }, rescueScreenPos = { x: 566, y: 688, r: 70 };
var combo = 0, comboT = 0, comboBest = 0, comboPulse = 0, parCrossed = false, lastPlop = 0; // satisfaction layer
var COMBO_WINDOW = 6500;                             // humans need a beat to FIND the next chain — 6.5s keeps streaks reachable
var curRareCoat = 0, starHits = 0;                   // rare friends: tonight's shimmer coat + wishing stars hit this run
var path = [], armed = false, armT = 0;
var pointerPos = { x: W / 2, y: H / 2 };
var walkers = [], callouts = [], sparkles = [], hugFlyers = [];
var botPar = 0, featBreed = null, hitstopUntil = 0, calloutBusyUntil = 0;
var star = null, starMoves = 0, starRng = null;   // the drifting wishing star
var shakeMag = 0, scoreShown = 0, fadeFrom = -9999, scorePulse = 0;
var countdownTimer = null;
var denSouls = { pet: new IdleSoul(11), r0: new IdleSoul(23), g0: new IdleSoul(37), g1: new IdleSoul(51) };
var practiceRng = mulberry32((Math.random() * 1e9) | 0);
var $ = function (id) { return document.getElementById(id); };
function fmt(n) { return n.toLocaleString('en-US'); }

// ---- first-night tutorial + den juice state ----
var tut = { active: false, step: 0, cells: [] };
var flyers = [];        // care items flying to the pet
var petPopT = 0;        // den pet reaction bounce
var tutTimers = [];
function tutSay(list) { // [[text, delayAfterMs], ...] chained
  var d = 0;
  for (var i = 0; i < list.length; i++) {
    (function (txt, when) { tutTimers.push(setTimeout(function () { setWhisper(txt); }, when)); })(list[i][0], d);
    d += list[i][1];
  }
  return d;
}
function tutClear() { for (var i = 0; i < tutTimers.length; i++) clearTimeout(tutTimers[i]); tutTimers = []; }

// ============ DECK / GRID ============
// ---- run spec: one object drives deck, bot, and yawns, so difficulty is data ----
function defaultSpec() { return { breeds: BREEDS, deckSize: DECK_SIZE, voidRate: VOID_RATE, feat: null, featRate: 0.42, yawnEvery: YAWN_EVERY, yawnTargets: YAWN_TARGETS, mask: [], presetSleep: 0 }; }
// ---- level ARCHITECTURE: small fixed obstacle shapes, always at column edges (keeps column-gravity segments simple & safe) ----
var MASKS = [
  [],
  [[0, 0], [5, 0]],
  [[0, 6], [5, 6]],
  [[0, 0], [5, 0], [0, 6], [5, 6]],
  [[2, 0], [3, 0]],
  [[0, 3], [5, 3]],
  [[2, 6], [3, 6]],
  [[0, 0], [5, 0], [2, 6], [3, 6]]
];
function maskFor(id) { return MASKS[id % MASKS.length]; }
function isMaskedCell(mask, x, y) { for (var i = 0; i < mask.length; i++) if (mask[i][0] === x && mask[i][1] === y) return true; return false; }
function buildDeck(rng, spec) {
  deck = []; deckPos = 0;
  var bs = spec.breeds, n = spec.deckSize;
  for (var i = 0; i < n; i++) {
    if (rng() < spec.voidRate) deck.push({ breed: 'voidcat', stage: 1 });
    else if (spec.feat && rng() < spec.featRate) {
      // shimmer nights: ~1/3 of featured cards wear the rare coat — INDEX-based, so the bot's rng stream stays identical
      deck.push({ breed: spec.feat, stage: 1, coat: (spec.rareCoat && i % 3 === 1) ? spec.rareCoat : 0 });
    }
    else deck.push({ breed: bs[Math.floor(rng() * bs.length)], stage: 1 });
  }
}
// ============ THE NEIGHBORHOOD (40 nights, deterministic difficulty ramp) ============
var OBJ_LABEL = {
  SCORE:   function (o) { return 'reach ' + fmt(o.n) + ' points'; },
  HUGS:    function (o) { return 'make ' + o.n + ' hugs'; },
  MAJESTY: function (o) { return 'raise a majestic pet'; },
  WAKE:    function (o) { return 'wake ' + o.n + ' sleepyheads'; },
  BEATBOT: function (o) { return 'out-hug the sleepy bot'; }
};
function nightSpec(id) {
  // street 1 (1-20): learnable. street 2 (21-40): sleepier, tighter decks, more breeds.
  var street = id <= 20 ? 1 : 2, k = (id - 1) % 20;
  var breeds = Math.min(5, 3 + (street - 1) + Math.floor(k / 7));   // 3..5 then 4..5
  var yawnEvery = Math.max(2, (street === 1 ? 4 : 3) - Math.floor(k / 10));
  var yawnTargets = 2 + (street === 2 && k >= 12 ? 1 : 0);
  var deckSize = 84 - (street === 2 ? 12 : 0) - Math.floor(k / 8) * 4;
  var voidRate = 0.03 + 0.004 * Math.floor(k / 5);
  return {
    breeds: BREEDS.slice(0, breeds), deckSize: deckSize, voidRate: voidRate,
    feat: BREEDS[id % BREEDS.length], featRate: 0.42, yawnEvery: yawnEvery, yawnTargets: yawnTargets,
    rareCoat: (id % 5 === 3) ? 1 + (id % 3) : 0,   // every 5th-ish night shimmers (deterministic, worldwide)
    mask: maskFor(id), presetSleep: Math.min(6, (street === 1 ? 0 : 2) + Math.floor(k / 6))   // the ARCHITECTURE: fixed shape + opening sleepers, same every attempt
  };
}
var NIGHTS = (function () {
  var out = [], cycle = ['HUGS', 'SCORE', 'WAKE', 'MAJESTY', 'BEATBOT'];
  for (var i = 0; i < 40; i++) {
    var id = i + 1, spec = nightSpec(id);
    var par = computeBotPar('NIGHT-' + id, spec);
    var type = i < 3 ? (i === 0 ? 'HUGS' : i === 1 ? 'SCORE' : 'HUGS') : cycle[i % cycle.length];
    var obj = { type: type };
    // gentle ABSOLUTE ramps (not par-based) so objectives are always reachable and never block progression
    if (type === 'SCORE') obj.n = Math.round((250 + i * 160) / 50) * 50;
    else if (type === 'HUGS') obj.n = Math.min(14, 3 + Math.floor(i / 3));
    else if (type === 'WAKE') obj.n = Math.min(12, 3 + Math.floor(i / 4));
    out.push({ id: id, street: id <= 20 ? 1 : 2, spec: spec, par: par, obj: obj });
  }
  return out;
})();
function totalMoons() { var m = 0, k; for (k in save.nights) m += (save.nights[k].moons || 0); return m; }
function nightUnlocked(id) {
  if (id <= 1) return true;
  if (id === 21 && totalMoons() < 18) return false;         // soft gate into street 2 (≈1 moon/night)
  return !!(save.nights[id - 1] && save.nights[id - 1].moons > 0) || !!(save.nights[id] && save.nights[id].moons > 0);
}
function firstOpenNight() { for (var i = 1; i <= 40; i++) { if (!(save.nights[i] && save.nights[i].moons > 0) && nightUnlocked(i)) return i; } return 40; }
// 1🌙 = objective met (the gate). 2-3🌙 = score stretch vs the bot (reachable fractions; a tuning knob for real testers)
function objMoons(met, final) { return !met ? 0 : (final >= botPar * 0.55 ? 3 : final >= botPar * 0.3 ? 2 : 1); }
function objectiveMet(final) {
  var o = curObjective; if (!o) return false;
  if (o.type === 'SCORE') return final >= o.n;
  if (o.type === 'HUGS') return mergeCount >= o.n;
  if (o.type === 'MAJESTY') return grownTonight >= 1;
  if (o.type === 'WAKE') return wokenTotal >= o.n;
  if (o.type === 'BEATBOT') return final >= botPar;
  return false;
}
// ============ THE SLEEPY BOT (deterministic par — plays tonight's exact deck greedily) ============
function computeBotPar(seedStr, spec) {
  spec = spec || defaultSpec();
  var rng = mulberry32(hashStr(seedStr)), yr = mulberry32(hashStr(seedStr + '-yawn'));
  var bs = spec.breeds, YE = spec.yawnEvery, YT = spec.yawnTargets;
  var bdeck = [], bp = 0;
  for (var i = 0; i < spec.deckSize; i++) {
    if (rng() < spec.voidRate) bdeck.push({ b: 'voidcat', s: 1 });
    else if (spec.feat && rng() < spec.featRate) bdeck.push({ b: spec.feat, s: 1 });
    else bdeck.push({ b: bs[Math.floor(rng() * bs.length)], s: 1 });
  }
  var mask = spec.mask || [];
  var g = [], sleep = [];
  for (var y = 0; y < ROWS; y++) { g.push([]); sleep.push([]); for (var x = 0; x < COLS; x++) { var blk = isMaskedCell(mask, x, y); g[y].push(blk ? null : (bp < bdeck.length ? bdeck[bp++] : null)); sleep[y].push(false); } }
  if (spec.presetSleep) { // same fixed opening shape the real board uses, so the bot faces the identical architecture
    var archRng2 = mulberry32(hashStr('ARCH-' + seedStr.split('-').slice(0, 2).join('-')));
    var openCells2 = []; for (var ay2 = 0; ay2 < ROWS; ay2++) for (var ax2 = 0; ax2 < COLS; ax2++) if (!isMaskedCell(mask, ax2, ay2)) openCells2.push([ax2, ay2]);
    for (var pc2 = 0; pc2 < Math.min(spec.presetSleep, openCells2.length); pc2++) { var idx2 = Math.floor(archRng2() * openCells2.length), cp2 = openCells2.splice(idx2, 1)[0]; sleep[cp2[1]][cp2[0]] = true; }
  }
  function groupAt(sx, sy, seen) {
    var p = g[sy][sx]; if (!p || sleep[sy][sx] || p.b === 'voidcat') return null;
    var stack = [[sx, sy]], cells = []; seen[sx + ',' + sy] = 1;
    while (stack.length) {
      var c = stack.pop(); cells.push(c);
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var nx = c[0] + dx, ny = c[1] + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS || seen[nx + ',' + ny]) continue;
        var np = g[ny][nx];
        if (np && !sleep[ny][nx] && (np.b === p.b && np.s === p.s || np.b === 'voidcat')) { seen[nx + ',' + ny] = 1; stack.push([nx, ny]); }
      }
    }
    return { kind: p, cells: cells };
  }
  var score = 0, merges = 0, guard = 0;
  while (guard++ < 400) {
    var best = null, seen = {};
    for (var yy = 0; yy < ROWS; yy++) for (var xx = 0; xx < COLS; xx++) {
      if (seen[xx + ',' + yy]) continue;
      var grp = groupAt(xx, yy, seen);
      // the bot links like a PERSON: at most 5 friends per hug (a greedy blob-eater scores inhumanly)
      if (grp && grp.cells.length >= MIN_CHAIN) { var bn = Math.min(5, grp.cells.length); var val = bn * bn * STAGE_MULT[grp.kind.s]; if (!best || val > best.val) { grp.val = val; best = grp; } }
    }
    if (!best) break;
    var cells = best.cells.slice(0, 5), n = cells.length, kind = best.kind;
    if (kind.s >= 3) { for (var ci = 0; ci < n; ci++) g[cells[ci][1]][cells[ci][0]] = null; }
    else {
      score += 12 * n * n * STAGE_MULT[kind.s];
      var end = cells[n - 1];
      for (var cj = 0; cj < n; cj++) g[cells[cj][1]][cells[cj][0]] = null;
      g[end[1]][end[0]] = { b: kind.b, s: kind.s + 1 };
      merges++;
      if (merges >= 12) break;   // the bot gets sleepy too — par stays HUMAN-scale (a person plays 10-20 hugs, not the whole deck)
    }
    // gravity + refill, in segments around any blocked cells (same architecture the player's board uses)
    for (var gx = 0; gx < COLS; gx++) {
      var wy = ROWS - 1;
      for (var gy = ROWS - 1; gy >= 0; gy--) {
        if (isMaskedCell(mask, gx, gy)) { for (var fy2 = wy; fy2 > gy; fy2--) { g[fy2][gx] = bp < bdeck.length ? bdeck[bp++] : null; sleep[fy2][gx] = false; } wy = gy - 1; continue; }
        if (g[gy][gx]) { if (wy !== gy) { g[wy][gx] = g[gy][gx]; sleep[wy][gx] = sleep[gy][gx]; g[gy][gx] = null; sleep[gy][gx] = false; } wy--; }
      }
      for (; wy >= 0; wy--) { g[wy][gx] = bp < bdeck.length ? bdeck[bp++] : null; sleep[wy][gx] = false; }
    }
    if (merges % YE === 0) { // yawn
      var awake = [];
      for (var ay = 0; ay < ROWS; ay++) for (var ax = 0; ax < COLS; ax++) if (g[ay][ax] && !sleep[ay][ax] && g[ay][ax].s < 3) awake.push([ax, ay]);
      for (var h = 0; h < Math.min(YT, awake.length); h++) { var t = awake.splice(Math.floor(yr() * awake.length), 1)[0]; sleep[t[1]][t[0]] = true; }
    }
    // nap check
    var occ = 0, asl = 0;
    for (var ny2 = 0; ny2 < ROWS; ny2++) for (var nx2 = 0; nx2 < COLS; nx2++) if (g[ny2][nx2]) { occ++; if (sleep[ny2][nx2]) asl++; }
    if (occ && asl / occ >= NAP_FRAC) break;
  }
  return Math.max(200, Math.round(score * 0.9)); // the bot plays well but beatably
}
function drawFromDeck() { return deckPos < deck.length ? deck[deckPos++] : null; }
function newSoul(cx, cy) { return new IdleSoul(hashStr('c' + cx + '-' + cy + '-' + Math.floor(Math.random() * 1e6))); }
function startRun(mode, id) {
  runMode = mode; screenMode = 'play'; phase = 'idle';
  score = 0; longestHug = 0; mergeCount = 0; grownTonight = 0; gradsTonight = []; wokenTotal = 0;
  path = []; walkers = []; hugFlyers = []; armed = false; star = null; starMoves = 0; scoreShown = 0; scorePulse = 0; fadeFrom = performance.now();
  combo = 0; comboT = 0; comboBest = 0; comboPulse = 0; parCrossed = false;
  clearFx();
  var spec, seedStr;
  if (mode === 'night') {
    // the ARCHITECTURE (mask, sleepers, breeds, objective) is fixed forever — but the CONTENT reshuffles fresh every attempt,
    // and the bot's par is recomputed against that exact same shuffle, so the race always stays honest.
    curNight = id; curObjective = NIGHTS[id - 1].obj; spec = NIGHTS[id - 1].spec;
    seedStr = 'NIGHT-' + id + '-' + ((Math.random() * 1e9) | 0);
  } else {
    curNight = 0; curObjective = null; spec = defaultSpec();
    if (mode === 'daily') { seedStr = 'PAWRADE-v1-' + dayNumber(); spec.feat = featuredBreed(); spec.rareCoat = (dayNumber() % 4 === 2) ? 1 + (dayNumber() % 3) : 0; }
    else if (mode === 'tutorial') { seedStr = 'FIRST-NIGHT'; spec.feat = null; }
    else { seedStr = 'stroll-' + ((practiceRng() * 1e9) | 0); spec.feat = BREEDS[(Math.random() * 5) | 0]; spec.rareCoat = (practiceRng() < 0.35) ? 1 + ((practiceRng() * 3) | 0) : 0; }
  }
  featBreed = spec.feat;
  curRareCoat = spec.rareCoat || 0; starHits = 0;
  curYawnEvery = spec.yawnEvery; curYawnTargets = spec.yawnTargets;
  curMask = spec.mask || [];
  buildDeck(mulberry32(hashStr(seedStr)), spec);
  yawnRng = mulberry32(hashStr(seedStr + '-yawn'));
  starRng = mulberry32(hashStr(seedStr + '-star'));
  botPar = (mode === 'tutorial') ? 0 : computeBotPar(seedStr, spec);   // recomputed fresh per attempt — same shuffle the player got
  grid = [];
  for (var y = 0; y < ROWS; y++) { grid.push([]); for (var x = 0; x < COLS; x++) {
    var blocked = isBlockedCell(x, y);
    grid[y].push({ pet: blocked ? null : drawFromDeck(), soul: newSoul(x, y), drop: -(ROWS - y) * 30 - 60, vy: 0, asleep: false, blocked: blocked });
  } }
  if (spec.presetSleep) { // the opening puzzle SHAPE — a fixed set of cells the level always starts with dozing, same every attempt
    var archRng = mulberry32(hashStr('ARCH-' + seedStr.split('-').slice(0, 2).join('-')));
    var openCells = []; for (var py = 0; py < ROWS; py++) for (var px = 0; px < COLS; px++) if (!isBlockedCell(px, py)) openCells.push([px, py]);
    for (var pc = 0; pc < Math.min(spec.presetSleep, openCells.length); pc++) {
      var idx = Math.floor(archRng() * openCells.length), cellPos = openCells.splice(idx, 1)[0];
      grid[cellPos[1]][cellPos[0]].asleep = true;
    }
  }
  if (mode === 'tutorial') stampTutorial();
  setUI();
  if (mode === 'night') setWhisper('tonight — ' + OBJ_LABEL[curObjective.type](curObjective) + '.');
  else if (mode !== 'tutorial') setWhisper(whisperOf(WHISPERS.featured).replace('{X}', STAGE_NAME[featBreed][2]));
  if (curRareCoat && mode !== 'tutorial') callout('✨ the ' + STAGE_NAME[featBreed][2] + 's are shimmering tonight', '#ffd24a');
}
function cellAt(px, py) {
  var x = Math.floor((px - GRID_X) / CELL), y = Math.floor((py - GRID_Y) / CELL);
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
  var cx = GRID_X + x * CELL + CELL / 2, cy = GRID_Y + y * CELL + CELL / 2;
  if (Math.abs(px - cx) > CELL * 0.42 || Math.abs(py - cy) > CELL * 0.42) return null;
  return { x: x, y: y };
}
function samePos(a, b) { return a && b && a.x === b.x && a.y === b.y; }
function adjacent(a, b) { return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1 && !samePos(a, b); }
function cellOf(p) { return grid[p.y][p.x]; }
function petAt(p) { var c = cellOf(p); return c ? c.pet : null; }
function pathKind() { // {breed, stage} of first non-void in path
  for (var i = 0; i < path.length; i++) { var pt = petAt(path[i]); if (pt && pt.breed !== 'voidcat') return pt; }
  return null;
}
function canJoin(pos) {
  var c = cellOf(pos), pt = c.pet;
  if (!pt || c.asleep) return false;                       // sleepers cannot hold paws
  for (var i = 0; i < path.length; i++) if (samePos(path[i], pos)) return false;
  if (path.length && !adjacent(path[path.length - 1], pos)) return false;
  if (pt.breed === 'voidcat') return true;
  var k = pathKind();
  return !k || (pt.breed === k.breed && pt.stage === k.stage);
}
function awakeStats() {
  var occupied = 0, asleep = 0, x, y;
  for (y = 0; y < ROWS; y++) for (x = 0; x < COLS; x++) { var c = grid[y][x]; if (c.pet) { occupied++; if (c.asleep) asleep++; } }
  return { occupied: occupied, asleep: asleep, frac: occupied ? asleep / occupied : 0 };
}
function anyHugPossible() {
  var kinds = {}, x, y;
  for (var bi = 0; bi < BREEDS.length; bi++) {
    for (var si = 1; si <= 3; si++) {
      var b = BREEDS[bi], seen = {}, ok = false;
      for (y = 0; y < ROWS && !ok; y++) for (x = 0; x < COLS && !ok; x++) {
        var c = grid[y][x], p = c.pet;
        if (!p || c.asleep || seen[x + ',' + y]) continue;
        if (!(p.breed === 'voidcat' || (p.breed === b && p.stage === si))) continue;
        var stack = [{ x: x, y: y }], size = 0;
        seen[x + ',' + y] = 1;
        while (stack.length) {
          var cur = stack.pop(); size++;
          for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
            var nx = cur.x + dx, ny = cur.y + dy;
            if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS || seen[nx + ',' + ny]) continue;
            var nc = grid[ny][nx], np = nc.pet;
            if (np && !nc.asleep && (np.breed === 'voidcat' || (np.breed === b && np.stage === si))) { seen[nx + ',' + ny] = 1; stack.push({ x: nx, y: ny }); }
          }
        }
        if (size >= MIN_CHAIN) ok = true;
      }
      if (ok) kinds[b + si] = { breed: b, stage: si };
    }
  }
  return kinds;
}

// ============ INPUT ============
var MUTE_R = { x: W - 66, y: 12, w: 54, h: 46 };
var BACK_R = { x: 12, y: 12, w: 54, h: 46 };
function onDown(e) {
  var p = toWorld(e); pointerPos = p;
  if (p.x > MUTE_R.x && p.y < MUTE_R.y + MUTE_R.h) { save.muted = !save.muted; persist(); uiTick(); return; }
  if (screenMode === 'play' && phase !== 'linking' && p.x >= BACK_R.x && p.x <= BACK_R.x + BACK_R.w && p.y >= BACK_R.y && p.y <= BACK_R.y + BACK_R.h) { audio(); uiTick(); requestLeave(); return; }
  if (screenMode === 'map') {
    if (p.x >= MAP_BACK.x && p.x <= MAP_BACK.x + MAP_BACK.w && p.y >= MAP_BACK.y && p.y <= MAP_BACK.y + MAP_BACK.h) { audio(); uiTick(); goDen(); return; }
    mapDrag = { y0: p.y, s0: mapScroll, moved: 0, px: p.x, py: p.y }; return;
  }
  if (screenMode === 'den') {
    // room navigation arrows
    if (curRoom > 0 && p.x >= NAV_L.x && p.x <= NAV_L.x + NAV_L.w && p.y >= NAV_L.y && p.y <= NAV_L.y + NAV_L.h) { audio(); uiTick(); curRoom--; fadeFrom = performance.now(); setUI(); return; }
    if (curRoom < ROOMS.length - 1 && p.x >= NAV_R.x && p.x <= NAV_R.x + NAV_R.w && p.y >= NAV_R.y && p.y <= NAV_R.y + NAV_R.h) { audio(); uiTick(); curRoom++; fadeFrom = performance.now(); setUI(); return; }
    if (curRoom === 0) {
      if (save.pet && Math.hypot(p.x - petScreenPos.x, p.y - petScreenPos.y) < petScreenPos.r * 1.25) { audio(); petReact('pat'); return; }
      if (curFeaturedRescue >= 0 && Math.hypot(p.x - rescueScreenPos.x, p.y - rescueScreenPos.y) < rescueScreenPos.r * 1.25) { coaxRescue(curFeaturedRescue); return; }
      return;
    }
    var room = ROOMS[curRoom];
    if (!save.rooms[room.id]) { // locked: the unlock button
      if (p.x >= ROOM_UNLOCK_R.x && p.x <= ROOM_UNLOCK_R.x + ROOM_UNLOCK_R.w && p.y >= ROOM_UNLOCK_R.y && p.y <= ROOM_UNLOCK_R.y + ROOM_UNLOCK_R.h) tryUnlockRoom(curRoom);
      return;
    }
    for (var si = 0; si < room.slots.length; si++) { var sl = room.slots[si]; var ay = propAnchorIsWall(sl.prop) ? sl.y : sl.y - 16; if (Math.abs(p.x - sl.x) < 56 && Math.abs(p.y - ay) < 52) { openSlot(curRoom, si); return; } }
    return;
  }
  if (screenMode !== 'play' || phase !== 'idle') return;
  audio();
  var c = cellAt(p.x, p.y);
  if (c && petAt(c) && !cellOf(c).asleep) {
    path = [c]; phase = 'linking';
    var pt = petAt(c); if (VOICE[pt.breed]) VOICE[pt.breed](pt.stage);
    if (armed) disarm();
  }
}
function onMove(e) {
  pointerPos = toWorld(e);
  if (screenMode === 'map') { if (mapDrag) { mapScroll = clampScroll(mapDrag.s0 - (pointerPos.y - mapDrag.y0)); mapDrag.moved += Math.abs(pointerPos.y - mapDrag.y0); } return; }
  if (phase !== 'linking') return;
  var c = cellAt(pointerPos.x, pointerPos.y);
  if (!c) return;
  if (path.length >= 2 && samePos(path[path.length - 2], c)) { path.pop(); mallet(SCALE_HZ[Math.max(0, path.length - 1) % 9], 0, 0.07, 0.15); return; }
  var guard = 0;
  while (path.length && !adjacent(path[path.length - 1], c) && guard < 4) {
    var last = path[path.length - 1];
    var bridge = { x: last.x + Math.max(-1, Math.min(1, c.x - last.x)), y: last.y + Math.max(-1, Math.min(1, c.y - last.y)) };
    if (samePos(bridge, c) || !canJoin(bridge)) break;
    path.push(bridge);
    mallet(SCALE_HZ[(path.length - 1) % 9], 0, 0.1, 0.22);
    guard++;
  }
  if (canJoin(c)) {
    path.push(c);
    mallet(SCALE_HZ[(path.length - 1) % 9], 0, 0.1, 0.22);
    sparkAt(GRID_X + c.x * CELL + CELL / 2, GRID_Y + c.y * CELL + CELL / 2, 4, '#ffe9a8');
    if (path.length === 5) setWhisper(whisperOf(WHISPERS.linkBig));
  }
}
function onUp() {
  if (screenMode === 'map') { if (mapDrag && mapDrag.moved < 12) { var h = nodeHit(mapDrag.px, mapDrag.py); if (h) openNight(h); } mapDrag = null; return; }
  if (phase !== 'linking') return;
  if (path.length >= MIN_CHAIN) resolveMerge();
  else { path = []; phase = 'idle'; }
}
cv.addEventListener('pointerdown', onDown);
window.addEventListener('pointermove', onMove);
window.addEventListener('pointerup', onUp);
cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

// ============ THE MERGE (the core) ============
function resolveMerge() {
  phase = 'resolving';
  var n = path.length;
  if (n > longestHug) longestHug = n;
  var kind = pathKind() || { breed: 'voidcat', stage: 1 };
  var endPos = path[n - 1];
  var isFinal = kind.stage >= 3;

  if (isFinal) {
    // GRADUATION: no points. something better.
    for (var g = 0; g < n; g++) {
      var gp = path[g], gc = cellOf(gp);
      var stepDur = 150 * (kind.breed === 'corgi' ? 1.08 : 1);
      walkers.push({ pet: gc.pet, sx: GRID_X + gp.x * CELL + CELL / 2, sy: GRID_Y + gp.y * CELL + CELL / 2, t: -g * stepDur, dur: 1000 });
      mallet(SCALE_HZ[g % 9], g * stepDur / 1000 + 0.1, 0.16, 0.5);
      gc.pet = null;
    }
    save.graduates[kind.breed] = (save.graduates[kind.breed] || 0) + 1;
    gradsTonight.push(kind.breed);
    persist();
    callout(STAGE_NAME[kind.breed][3] + ' IS COMPLETE.', '#ffd9a0');
    setWhisper(WHISPERS.graduated[0].replace('{X}', STAGE_NAME[kind.breed][3]));
    wakeAround(endPos, 2); // the parade noise wakes half the room
  } else {
    // ---- THE HUG: they slide together, squeeze, and ONE bigger friend unfurls ----
    var nextStage = kind.stage + 1;
    var gained = 12 * n * n * STAGE_MULT[kind.stage];
    var starHit = false;
    for (var si = 0; si < n; si++) if (star && path[si].x === star.x && path[si].y === star.y) starHit = true;
    if (mergeCount === 0) { gained *= 2; callout('first hug of the night ×2', '#ffd9a0'); }
    if (starHit) { gained *= 2; star = null; starHits++; if (starHits >= 3) unlockLegend('starlight'); }
    var ex = GRID_X + endPos.x * CELL + CELL / 2, ey = GRID_Y + endPos.y * CELL + CELL / 2;
    // capture + null sources; launch them flying INTO the end cell. the shimmer carries: any rare in the chain → rare result
    var theCoat = 0;
    for (var i = 0; i < n; i++) {
      var pp = path[i], pc = cellOf(pp);
      if (pc.pet && pc.pet.coat) theCoat = pc.pet.coat;
      if (i !== n - 1) hugFlyers.push({ breed: kind.breed, stage: kind.stage, coat: (pc.pet && pc.pet.coat) || 0, sx: GRID_X + pp.x * CELL + CELL / 2, sy: GRID_Y + pp.y * CELL + CELL / 2, ex: ex, ey: ey, t: 0 });
      pc.pet = null;
    }
    if (n >= 8) unlockLegend('bighug');   // an 8-friend hug — BIGHUG remembers
    var HUG_MS = 240;
    mallet(SCALE_HZ[Math.min(8, kind.stage * 2)], 0, 0.08, 0.18); // the pull-together note
    var thePos = endPos, theN = n, theStar = starHit, theGain = gained, theBreed = kind.breed, theNext = nextStage, theC = theCoat;
    setTimeout(function () {
      var ec = cellOf(thePos);
      ec.pet = { breed: theBreed, stage: theNext, coat: theC };
      ec.soul = newSoul(thePos.x, thePos.y);
      ec.popT = performance.now(); ec.asleep = false;
      markSeen(theBreed, theNext, theC); // dreams album + stage-3 wardrobe reward (+ rare row when shimmering)
      // ---- COMBO: keep the hugs coming and the pot multiplies (skill, not chance) ----
      var nowMs = performance.now();
      combo = (comboT && nowMs - comboT < COMBO_WINDOW) ? combo + 1 : 1;
      comboT = nowMs; comboPulse = 1;
      if (combo > comboBest) comboBest = combo;
      var comboMult = 1 + Math.min(5, combo - 1) * 0.2;   // ×1.2 … ×2, capped
      var finalGain = Math.round(theGain * comboMult);
      if (combo >= 2) mallet(SCALE_HZ[Math.min(8, 2 + combo)], 0.06, 0.1, 0.4); // the rising streak note
      score += finalGain; scorePulse = 1;
      shakeMag = theNext === 3 ? 10 : Math.min(10, 3 + theN * 0.9);   // bigger hugs hit harder
      hitstopUntil = nowMs + (theNext === 3 ? 110 : 70);
      mergeChord(theNext);
      if (VOICE[theBreed]) setTimeout(function () { VOICE[theBreed](theNext); }, 40);
      textPop(ex, ey - 26, (theStar ? '✦ ' : '+') + fmt(finalGain), theNext === 3 ? '#ffd9a0' : (theStar ? '#a8d8ff' : '#f6efe6'));
      burstHearts(thePos, Math.min(16, (theNext === 3 ? 10 : 5) + theN));
      if (theStar) callout(whisperOf(WHISPERS.starHit), '#a8d8ff');
      else if (theNext === 3) { grownTonight++; callout('a ' + STAGE_NAME[theBreed][3] + ' is born!', '#ffd9a0'); }
      else if (theN >= 6) callout('MEGA HUG — ' + theN + ' friends!', '#ffd24a');
      else callout(theN + ' ' + STAGE_NAME[theBreed][1] + 's became a ' + STAGE_NAME[theBreed][2] + '.', '#e8b4c8');
      var woke = wakeAround(thePos, 1);
      if (woke > 0) { var bonus = woke * 40; score += bonus; wokenTotal += woke; textPop(ex + 30, ey + 20, 'woke +' + bonus, '#7fe0d4'); }
      // ---- passing the bot: the run's big fill-the-bar payoff ----
      if (!parCrossed && botPar > 0 && score >= botPar) {
        parCrossed = true; shakeMag = Math.max(shakeMag, 7);
        callout('you passed the sleepy bot! 🏆', '#ffd24a');
        mallet(SCALE_HZ[4], 0, 0.14, 0.5); mallet(SCALE_HZ[6], 0.12, 0.14, 0.6); mallet(SCALE_HZ[8], 0.24, 0.18, 0.9);
        sparkAt(W / 2, 214, 20, '#ffd24a');
      }
      mergeCount++;
      if (mergeCount % (tut.active ? 2 : curYawnEvery) === 0) queueYawn();
      if (tut.active) tutOnMerge();
      setUI();
      setTimeout(function () { settleAndRefill(); }, 320);
    }, HUG_MS);
  }
  if (!isFinal) { path = []; return; } // non-final settles inside the timeout above
  path = [];
  setTimeout(function () { settleAndRefill(); }, 1300);
  setUI();
}
function burstHearts(pos, n) {
  var cx = GRID_X + pos.x * CELL + CELL / 2, cy = GRID_Y + pos.y * CELL + CELL / 2;
  for (var i = 0; i < n; i++) sparkles.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 3, vy: -2 - Math.random() * 2, life: 1, color: '#ffb9c8', heart: true });
}
function wakeAround(pos, radius) {
  var woke = 0;
  for (var dy = -radius; dy <= radius; dy++) for (var dx = -radius; dx <= radius; dx++) {
    var nx = pos.x + dx, ny = pos.y + dy;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
    var c = grid[ny][nx];
    if (c.pet && c.asleep) { c.asleep = false; c.soul = newSoul(nx, ny); woke++; sparkAt(GRID_X + nx * CELL + CELL / 2, GRID_Y + ny * CELL + CELL / 2, 3, '#7fe0d4'); }
  }
  if (woke > 0) wakeSound();
  return woke;
}
function queueYawn() {
  // deterministic given your play: targets come from the seeded yawn stream
  var awake = [], x, y;
  for (y = 0; y < ROWS; y++) for (x = 0; x < COLS; x++) { var c = grid[y][x]; if (c.pet && !c.asleep && c.pet.stage < 3) awake.push({ x: x, y: y }); }
  if (!awake.length) return;
  yawnSound();
  callout('a yawn drifts by…', '#a8d8ff');
  var hits = Math.min(curYawnTargets, awake.length);
  for (var i = 0; i < hits; i++) {
    var idx = Math.floor(yawnRng() * awake.length);
    var t = awake.splice(idx, 1)[0];
    (function (t, delay) {
      setTimeout(function () {
        var c = grid[t.y][t.x];
        if (c.pet && !c.asleep) { c.asleep = true; sparkAt(GRID_X + t.x * CELL + CELL / 2, GRID_Y + t.y * CELL + CELL / 3, 4, '#a8d8ff'); }
      }, 500 + delay * 260);
    })(t, i);
  }
}
function settleAndRefill() {
  // gravity runs in SEGMENTS between blocked cells — obstacles are fixed walls, never moved, never occupied
  for (var x = 0; x < COLS; x++) {
    var wy = ROWS - 1;
    for (var y = ROWS - 1; y >= 0; y--) {
      if (isBlockedCell(x, y)) {
        for (var fy = wy; fy > y; fy--) { var nb = drawFromDeck(); grid[fy][x].pet = nb; grid[fy][x].asleep = false; if (nb) { grid[fy][x].soul = newSoul(x, fy); grid[fy][x].drop = -(fy + 1.5) * CELL; grid[fy][x].vy = 0; } }
        wy = y - 1; continue;
      }
      if (grid[y][x].pet) {
        if (wy !== y) {
          grid[wy][x].pet = grid[y][x].pet; grid[wy][x].soul = grid[y][x].soul; grid[wy][x].asleep = grid[y][x].asleep;
          grid[wy][x].drop = -(wy - y) * CELL; grid[y][x].pet = null; grid[y][x].asleep = false;
        }
        wy--;
      }
    }
    for (; wy >= 0; wy--) {
      var np = drawFromDeck();
      grid[wy][x].pet = np; grid[wy][x].asleep = false;
      if (np) { grid[wy][x].soul = newSoul(x, wy); grid[wy][x].drop = -(wy + 1.5) * CELL; grid[wy][x].vy = 0; }
    }
  }
  phase = 'idle';
  // wishing star lifecycle: it drifts, lasts 3 moves, then leaves
  if (star) { starMoves--; if (starMoves <= 0) star = null; }
  if (!tut.active && !star && mergeCount >= 3 && mergeCount % 4 === 3) {
    var cand = [], cx2, cy2;
    for (cy2 = 0; cy2 < ROWS; cy2++) for (cx2 = 0; cx2 < COLS; cx2++) { var cc = grid[cy2][cx2]; if (cc.pet && !cc.asleep && cc.pet.stage < 3 && cc.pet.breed !== 'voidcat') cand.push({ x: cx2, y: cy2 }); }
    if (cand.length) { star = cand[Math.floor(starRng() * cand.length)]; starMoves = 3; callout(whisperOf(WHISPERS.star), '#a8d8ff'); }
  }
  var st = awakeStats();
  var hugs = anyHugPossible();
  var hugCount = 0, k; for (k in hugs) hugCount++;
  if (st.frac >= NAP_FRAC || hugCount === 0) { doNap(); return; }
  if (st.frac >= 0.4) setWhisper(whisperOf(WHISPERS.sleepyBoard));
  else if (hugCount === 1) setWhisper(whisperOf(WHISPERS.armLast));
  setUI();
}

// ============ TUCK / NAP / END ============
var tuckBtn = $('btn-tuck');
function setUI() {
  var inDen = (screenMode === 'den' && curRoom === 0);
  $('whisper').classList.toggle('den', inDen);         // whisper floats above the care chips in the den, above the tuck in play
  $('bar-icons').classList.toggle('hidden', !inDen);   // the compact secondary row lives only in the den
  if (!save.pet) { // before a pet exists, the game holds its breath — no UI noise behind the creator
    var all = ['btn-parade', 'btn-map', 'btn-dreams', 'btn-wardrobe', 'btn-practice', 'btn-shop', 'btn-tuck'];
    for (var ai = 0; ai < all.length; ai++) $(all[ai]).classList.add('hidden');
    $('bar-icons').classList.add('hidden'); $('care').classList.add('hidden');
    return;
  }
  var big = ['btn-parade', 'btn-map'];
  if (screenMode === 'play' || screenMode === 'map') {
    big.forEach(function (b) { $(b).classList.add('hidden'); });
    $('care').classList.add('hidden');
    if (screenMode === 'map') { tuckBtn.classList.add('hidden'); return; }
    tuckBtn.classList.remove('hidden');
    if (!armed) { tuckBtn.textContent = '🛌 TUCK THEM IN · ' + fmt(score); tuckBtn.disabled = score <= 0; }
  } else {
    tuckBtn.classList.add('hidden');
    if (curRoom > 0) { big.forEach(function (b) { $(b).classList.add('hidden'); }); $('care').classList.add('hidden'); return; }
    $('btn-parade').classList.remove('hidden');
    $('btn-map').classList.remove('hidden');
    $('care').classList.remove('hidden');
    var n = dayNumber(), done = save.daily && save.daily.day === n;
    $('btn-parade').innerHTML = done ? ('TONIGHT ✓ ' + fmt(save.daily.score)) : ('🐾 TODAY’S PAWRADE #' + n);
    $('shop-dl').textContent = fmt(save.dreamlight);
    $('stroll-hearts').textContent = strollHeartsLabel();
    refreshCare();
  }
}
// ============ THE SHOP (dreamlight buys visible furniture) ============
function wantToday() { return FURNITURE[dayNumber() % FURNITURE.length]; } // one gentle "tonight's want"
function buildShop() {
  $('shop-dl2').innerHTML = '✦ ' + fmt(save.dreamlight) + ' dreamlight';
  var want = wantToday(), list = $('shop-list'); list.innerHTML = '';
  FURNITURE.forEach(function (it) {
    var owned = save.furniture[it.id], afford = save.dreamlight >= it.cost;
    var row = document.createElement('div');
    row.className = 'shop-row' + (want.id === it.id && !owned ? ' want' : '');
    row.innerHTML = '<div class="shop-name">' + it.name + (want.id === it.id && !owned ? '  ·  tonight’s want' : '') + '<div class="shop-blurb">' + it.blurb + '</div></div>' +
      '<div class="shop-buy ' + (owned ? 'owned' : (afford ? 'ok' : 'no')) + '">' + (owned ? 'in the den ✓' : '✦ ' + it.cost) + '</div>';
    if (!owned && afford) row.querySelector('.shop-buy').addEventListener('click', function () {
      save.dreamlight -= it.cost; save.furniture[it.id] = true; persist(); audio();
      mallet(SCALE_HZ[4], 0, 0.16, 0.4); mallet(SCALE_HZ[6], 0.12, 0.16, 0.5); mallet(SCALE_HZ[8], 0.26, 0.16, 0.7);
      buildShop(); setWhisper('the ' + it.name.replace('the ', '') + ' is in. someone is already investigating it.');
    });
    list.appendChild(row);
  });
}
function disarm() { armed = false; tuckBtn.classList.remove('armed'); setUI(); }
tuckBtn.addEventListener('click', function (ev) {
  ev.stopPropagation();
  if (screenMode !== 'play' || phase === 'done' || score <= 0) return;
  audio();
  if (!armed) {
    armed = true; armT = performance.now();
    tuckBtn.classList.add('armed');
    tuckBtn.textContent = 'hold your nerve? tap again.';
    var hugs = anyHugPossible(), names = [], k;
    for (k in hugs) if (hugs[k].stage === 2) names.push(STAGE_NAME[hugs[k].breed][3]);
    if (names.length) setWhisper(WHISPERS.armStage[0].replace('{X}', names[0]));
    else setWhisper(whisperOf(WHISPERS.armDeck));
    mallet(SCALE_HZ[0], 0, 0.12, 0.4);
  } else {
    endRun(true);
  }
});
function doNap() {
  phase = 'done';
  setWhisper(whisperOf(WHISPERS.nap));
  // everyone visibly dozes off, gently
  for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) if (grid[y][x].pet) grid[y][x].asleep = true;
  mallet(196, 0, 0.12, 1.4); mallet(147, 0.4, 0.1, 1.8);
  setTimeout(function () { endRun(false); }, 1400);
}
function endRun(tucked) {
  phase = 'done'; disarm(); tuckBtn.disabled = true;
  var wasTut = tut.active;
  if (wasTut) { tut.active = false; tut.cells = []; save.tutDone = true; tuckBtn.classList.remove('tutpulse'); tutClear(); persist(); }
  // tucking in graduates any grown-up on the board to the den (the den fills every few nights)
  if (tucked) {
    for (var gy = 0; gy < ROWS; gy++) for (var gx = 0; gx < COLS; gx++) {
      var gc = grid[gy][gx];
      if (gc.pet && gc.pet.stage >= 3) {
        save.graduates[gc.pet.breed] = (save.graduates[gc.pet.breed] || 0) + 1; gradsTonight.push(gc.pet.breed);
        if (gc.pet.coat) { save.seen['rare-' + gc.pet.breed] = true; save.rareGrads[gc.pet.breed] = gc.pet.coat; } // the shimmer moves in
      }
    }
  }
  var final = tucked ? score : Math.ceil(score / 2);
  if (tucked) { mallet(SCALE_HZ[0], 0, 0.18, 0.7); mallet(SCALE_HZ[2], 0.12, 0.18, 0.7); mallet(SCALE_HZ[4], 0.24, 0.2, 1.0); }
  var isDaily = runMode === 'daily', isNightRun = runMode === 'night';
  if (isDaily) {
    var n = dayNumber();
    if (save.lastDay !== n) {
      save.streak = (save.lastDay === n - 1) ? save.streak + 1 : 1;
      save.lastDay = n; save.nightsPlayed++;
      advanceRescueRitual();   // the trust arc moves forward exactly once per real day you show up
    }
    save.daily = { day: n, score: final, tucked: tucked, longest: longestHug, grads: gradsTonight.slice(), par: botPar };
    if (final >= botPar && botPar > 0) { save.botBeats = (save.botBeats || 0) + 1; if (save.botBeats >= 7) unlockLegend('gilded'); }
  }
  // --- Neighborhood night: objective + moons + first-clear rewards ---
  var met = false, moons = 0, dropped = null;
  if (isNightRun) {
    met = objectiveMet(final); moons = objMoons(met, final);
    var prev = save.nights[curNight] || { moons: 0, best: 0 };
    var newClear = moons > 0 && prev.moons === 0;
    save.nights[curNight] = { moons: Math.max(prev.moons, moons), best: Math.max(prev.best, final) };
    // THE MOON MAYOR: all of street 1 at three moons
    var perfect1 = true;
    for (var mi = 1; mi <= 20; mi++) if (!(save.nights[mi] && save.nights[mi].moons === 3)) { perfect1 = false; break; }
    if (perfect1) unlockLegend('moonmayor');
    if (newClear) {
      save.dreamlight += 8 + Math.floor(curNight / 2) * 2;              // first-clear ✦
      if (curNight % 5 === 0) for (var fi = 0; fi < FURNITURE.length; fi++)  // every 5th night gifts furniture
        if (!save.furniture[FURNITURE[fi].id]) { save.furniture[FURNITURE[fi].id] = true; dropped = FURNITURE[fi]; break; }
    }
  }
  if (final > save.best) save.best = final;
  if (longestHug > save.bestParade) save.bestParade = longestHug;
  save.dreamlight += Math.floor(final / 100);
  persist();
  showEnd({ daily: isDaily, mode: runMode, nightId: curNight, obj: curObjective, met: met, moons: moons, dropped: dropped,
    day: dayNumber(), score: final, tucked: tucked, longest: longestHug, grads: gradsTonight.slice(), tut: wasTut, par: botPar });
}
function moonGlyphs(n) { var s = ''; for (var i = 0; i < 3; i++) s += (i < n ? '🌙' : '·'); return s; }
// ---- the payoff: scores COUNT UP, wins rain confetti ----
var endCountAnim = null;
function animScore(el, target) {
  if (endCountAnim) clearInterval(endCountAnim);
  var t0 = performance.now(), dur = 900;
  el.textContent = '0';
  endCountAnim = setInterval(function () {
    var p = Math.min(1, (performance.now() - t0) / dur), ease = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(target * ease));
    if (p >= 1) { clearInterval(endCountAnim); endCountAnim = null; }
  }, 33);
}
function endConfetti() {
  var cols = ['#e8879e', '#ffd9a0', '#a8d8ff', '#c8a8e8', '#8fd0a4'];
  for (var i = 0; i < 44; i++) sparkles.push({ x: Math.random() * W, y: -20 - Math.random() * 260, vx: (Math.random() - 0.5) * 1.6, vy: 1.6 + Math.random() * 2.4, life: 1.5, color: cols[i % 5], size: 2.6 + Math.random() * 3 });
  mallet(SCALE_HZ[5], 0.1, 0.14, 0.5); mallet(SCALE_HZ[8], 0.25, 0.18, 0.8);
}
function showEnd(d) {
  window._last = d;
  window._endCtx = { mode: d.mode, nightId: d.nightId, nextId: (d.mode === 'night' && d.nightId < 40 && nightUnlocked(d.nightId + 1)) ? d.nightId + 1 : 0 };
  if (d.mode === 'night') {
    // ---- Neighborhood night results: moons are the headline ----
    $('end-title').textContent = d.met ? ('NIGHT ' + d.nightId + ' — ' + moonGlyphs(d.moons)) : ('NIGHT ' + d.nightId);
    $('end-title').style.color = d.met ? '#ffca7a' : '#a8d8ff';
    $('end-run').textContent = 'the neighborhood';
    animScore($('end-score'), d.score);
    if (d.met) endConfetti();
    $('end-note').textContent = d.met
      ? (d.moons === 3 ? 'a perfect night. every light is on.' : d.moons === 2 ? 'a bright night. one moon left up there.' : 'cleared — the porch light is warm.')
      : ('you needed to ' + OBJ_LABEL[d.obj.type](d.obj) + '. so close.');
    $('end-note').style.color = d.met ? '#ffd9a0' : '#a8d8ff';
    var beatln = d.score >= d.par ? ('beat the bot by +' + fmt(d.score - d.par)) : ('the bot: ' + fmt(d.par));
    var dropln = d.dropped ? ('  ·  the neighbors left you ' + d.dropped.name) : '';
    $('end-parade').textContent = 'goal: ' + OBJ_LABEL[d.obj.type](d.obj) + '  ·  ' + beatln + dropln;
    $('st-days').textContent = totalMoons() + ' 🌙';
    $('st-streak').textContent = d.nightId;
    $('st-best').textContent = fmt((save.nights[d.nightId] || {}).best || d.score);
    $('end-count').textContent = window._endCtx.nextId ? '' : (d.nightId === 40 ? 'you reached the end of the neighborhood. more streets are coming.' : 'clear this night to open the next porch light.');
    $('btn-end-map').classList.add('hidden');
    $('btn-again').classList.remove('hidden');
    $('btn-again').textContent = window._endCtx.nextId ? 'next night →' : 'try again';
    $('btn-home').textContent = 'the neighborhood';
    showOv('end-ov');
    return;
  }
  $('btn-again').textContent = 'another stroll'; $('btn-home').textContent = 'back to the den';
  $('end-title').textContent = d.tucked ? 'TUCKED IN 🛌' : 'THE NAP WON';
  $('end-title').style.color = d.tucked ? '#ffca7a' : '#e8b4c8';
  $('end-run').textContent = d.tut ? 'first night — graduated' : (d.daily ? ('PAWRADE #' + d.day) : 'just a stroll');
  animScore($('end-score'), d.score);
  // the headline is now the RACE — a number that means something
  // send them TOWARD the game, not away from it — the neighborhood is one tap from here
  $('btn-end-map').classList.toggle('hidden', !(d.tut || d.daily));
  if (d.tut) { $('end-note').textContent = 'that’s the trick — and forty nights are waiting up the street.'; $('end-note').style.color = '#e8b4c8'; }
  else {
    var beat = d.score - (d.par || 0);
    if (beat >= 0) endConfetti();
    // honest copy tiers: "so close" is only said when it's TRUE
    var soClose = d.par > 0 && d.score >= d.par * 0.85;
    $('end-note').textContent = beat >= 0 ? ('you beat the sleepy bot by +' + fmt(beat) + '  🏆')
      : (soClose ? ('the bot tucked ' + fmt(d.par) + ' — SO close. get it tomorrow.') : ('the bot tucked ' + fmt(d.par) + '. every hug counts — closer tomorrow.'));
    $('end-note').style.color = beat >= 0 ? '#ffd9a0' : '#a8d8ff';
  }
  var gradLine = d.grads && d.grads.length ? (d.grads.map(function (b) { return STAGE_NAME[b][3]; }).join(' & ') + ' moved into the den.') : '';
  var flavor = d.tucked ? whisperOf(WHISPERS.tucked) : 'everyone dozed off mid-hug — half the pot rolled under the couch.';
  $('end-parade').textContent = (d.tut ? '' : flavor + '  ·  ') + 'longest hug: ' + d.longest + (gradLine ? '  ·  ' + gradLine : '');
  $('st-days').textContent = save.nightsPlayed;
  $('st-streak').textContent = save.streak;
  $('st-best').textContent = fmt(save.best);
  $('btn-again').classList.toggle('hidden', d.daily);
  $('end-count').textContent = '';
  if (d.daily) {
    var upd = function () {
      var ms = (startOfToday() + 864e5) - Date.now();
      var hh = Math.floor(ms / 36e5), mm = Math.floor(ms / 6e4) % 60, ss = Math.floor(ms / 1000) % 60;
      $('end-count').textContent = 'the next parade forms in ' + hh + ':' + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
    };
    upd(); countdownTimer = setInterval(upd, 1000);
  }
  showOv('end-ov');
  if (d.daily && pendingArrivalProfile) {
    var arrivingProfile = pendingArrivalProfile;
    setTimeout(function () { hideOv('end-ov'); showRescueArrival(arrivingProfile); }, 3200);
  }
}
function shareText() {
  var d = window._last; if (!d) return '';
  var head = (save.founder ? '🐾💛 ' : '') + (d.daily ? ('PAWRADE #' + d.day) : 'PAWRADE (a stroll)');
  var line = d.tucked ? ('🛌 ' + fmt(d.score) + ' tucked in 💤') : ('😴 the nap won (kept ' + fmt(d.score) + ')');
  var beat = d.score - (d.par || 0);
  var botLine = '\n' + (beat >= 0 ? ('beat the bot by +' + fmt(beat) + ' 🏆') : ('the bot won by ' + fmt(-beat)));
  var grads = d.grads && d.grads.length ? ('\nraised: ' + d.grads.map(function (b) { return STAGE_NAME[b][3]; }).join(', ')) : '';
  return head + '  ' + line + botLine + grads + '\npawrade.pages.dev';
}

// ============ CARE ============
var CARE_CD = { feed: 4 * 36e5, play: 2 * 36e5, gift: 4 * 36e5 };
function careReady(k) { return Date.now() - (save.care[k] || 0) >= CARE_CD[k]; }
function refreshCare() {
  ['feed', 'play', 'gift'].forEach(function (k) {
    var el = $('chip-' + k), ready = careReady(k);
    el.classList.toggle('ready', ready);
    var lb = el.querySelector('.lb');
    if (ready) lb.textContent = k.toUpperCase() + ' · ready!';
    else { var ms = CARE_CD[k] - (Date.now() - save.care[k]); lb.textContent = k.toUpperCase() + ' · ' + Math.floor(ms / 36e5) + ':' + String(Math.floor(ms / 6e4) % 60).padStart(2, '0'); }
  });
}
function doCare(k) {
  if (!careReady(k)) { setWhisper(save.pet.name + ' is okay for now. really.'); petReact('pat'); return; }
  audio();
  save.care[k] = Date.now();
  var dl = (k === 'gift' ? 10 : (k === 'feed' ? 5 : 3));
  save.dreamlight += dl; persist();
  spawnFlyer(k); // the item flies to the pet; the payoff lands when it arrives
  var arrive = 700;
  setTimeout(function () {
    petReact(k);
    textPop(300, 480, '✦ +' + dl, '#ffd9a0');
    if (k === 'feed') { setWhisper('nom. NOM. ' + save.pet.name + ' approves of you enormously.'); noisePuff(0, 0.1, 500); noisePuff(0.15, 0.08, 450); }
    if (k === 'play') { setWhisper('the yarn has been defeated. for now.'); mallet(SCALE_HZ[4], 0, 0.14, 0.3); mallet(SCALE_HZ[6], 0.1, 0.14, 0.3); }
    if (k === 'gift') { setWhisper(save.pet.name + ' found you something. it’s a leaf. it’s perfect.'); mallet(SCALE_HZ[6], 0, 0.14, 0.5); mallet(SCALE_HZ[8], 0.15, 0.14, 0.7); sparkAt(300, 560, 14, '#ffe9a8'); }
  }, arrive);
  // tutorial: the first feed advances the first night
  if (tut.active && tut.step === 1 && k === 'feed') {
    tut.step = 2;
    $('chip-feed').classList.remove('tutpulse');
    tutTimers.push(setTimeout(function () {
      tutSay([['see? completely worth it. ✦ dreamlight buys furniture for the den, later.', 2800]]);
      tutTimers.push(setTimeout(startTutorialStroll, 3000));
    }, 1200));
  }
  refreshCare();
}
$('chip-feed').addEventListener('click', function () { doCare('feed'); });
$('chip-play').addEventListener('click', function () { doCare('play'); });
$('chip-gift').addEventListener('click', function () { doCare('gift'); });

// ============ CREATOR + RESCUE ============
var selSpecies = 'corgi', selCoat = 0;
function buildCreator() {
  var sc = $('c-species'); sc.innerHTML = '';
  BREEDS.forEach(function (b) {
    var d = document.createElement('div'); d.className = 'copt' + (b === selSpecies ? ' on' : '');
    var pc = document.createElement('canvas'); pc.width = 96; pc.height = 96;
    drawPet(pc.getContext('2d'), b, 0, 48, 52, 40, {});
    d.appendChild(pc);
    d.addEventListener('click', function () { selSpecies = b; selCoat = 0; buildCreator(); uiTick(); });
    sc.appendChild(d);
  });
  var cc = $('c-coat'); cc.innerHTML = '';
  COATS[selSpecies].forEach(function (co, i) {
    var s = document.createElement('div'); s.className = 'sw' + (i === selCoat ? ' on' : '');
    s.style.background = co[0];
    s.addEventListener('click', function () { selCoat = i; buildCreator(); uiTick(); });
    cc.appendChild(s);
  });
}
$('btn-meet').addEventListener('click', function () {
  var nm = ($('petname').value || 'Mochi').trim().slice(0, 12) || 'Mochi';
  save.pet = { species: selSpecies, coat: selCoat, name: nm, since: Date.now() };
  persist(); audio(); mallet(SCALE_HZ[4], 0, 0.16, 0.4); mallet(SCALE_HZ[6], 0.12, 0.16, 0.5); mallet(SCALE_HZ[8], 0.26, 0.16, 0.8);
  hideOv('creator-ov');
  if (!save.demoSeen) { startDemo(); }
  else if (!save.tutDone) { startTutorialDen(); }
  else { setWhisper(nm + ' is home. that’s the whole tutorial.'); }
  setUI();
});

// ============ FIRST NIGHT (auto-tutorial through every screen) ============
function startTutorialDen() {
  tut.active = true; tut.step = 1;
  save.care = { feed: 0, play: 0, gift: 0 }; persist(); // everything ready on night one
  setUI();
  petReact('hello');
  var total = tutSay([
    [save.pet.name + ' is home.', 2000],
    ['this is the den. everything you ever earn ends up here.', 2600],
    ['first things first — ' + save.pet.name + ' says they are starving. (they are not.)', 2400],
    ['tap the 🍗.', 0]
  ]);
  tutTimers.push(setTimeout(function () { $('chip-feed').classList.add('tutpulse'); }, total));
}
function startTutorialStroll() {
  tut.step = 3;
  tutSay([['now — the parade. come. this is the actual game.', 1600]]);
  tutTimers.push(setTimeout(function () {
    startRun('tutorial');
    tutSay([
      ['every pup here wants to hold paws.', 2200],
      ['draw one line through the glowing pups. don’t lift your finger.', 0]
    ]);
  }, 1800));
}
function stampTutorial() {
  // a fat corgi cluster + a shiba trio, guaranteed, same for every new player
  var corgis = [[2, 3], [3, 3], [2, 4], [3, 4], [2, 5]];
  var shibas = [[0, 1], [1, 1], [0, 2]];
  var i;
  for (i = 0; i < corgis.length; i++) { grid[corgis[i][1]][corgis[i][0]].pet = { breed: 'corgi', stage: 1 }; grid[corgis[i][1]][corgis[i][0]].asleep = false; }
  for (i = 0; i < shibas.length; i++) { grid[shibas[i][1]][shibas[i][0]].pet = { breed: 'shiba', stage: 1 }; grid[shibas[i][1]][shibas[i][0]].asleep = false; }
  tut.cells = corgis;
  tut.glowAt = performance.now() + 1000;   // let the pets LAND before we point at them
}
function tutOnMerge() {
  if (tut.step === 3) {
    tut.step = 4;
    tut.cells = [[0, 1], [1, 1], [0, 2]];
    confettiLite();
    tutSay([
      ['THEY GREW. bigger friends are worth three times more.', 2600],
      ['and bigger friends can hug too — that’s where the big numbers live.', 2600],
      ['now the shibas. same trick.', 0]
    ]);
  } else if (tut.step === 4) {
    tut.step = 5;
    tut.cells = [];
    tutTimers.push(setTimeout(function () {
      tutSay([
        ['hear that yawn? sleepy friends can’t hold paws.', 2600],
        ['a hug landing NEXT to a sleeper wakes them. remember that.', 2800],
        ['last thing. the pot you’ve built? it isn’t yours yet.', 2600],
        ['TUCK THEM IN to keep it — or keep hugging and risk the nap. greed is allowed here. encouraged, even.', 0]
      ]);
      tutTimers.push(setTimeout(function () { tuckBtn.classList.add('tutpulse'); }, 8200));
    }, 1600));
  }
}
function confettiLite() {
  for (var i = 0; i < 26; i++) sparkles.push({ x: W / 2 + (Math.random() - 0.5) * 300, y: 200, vx: (Math.random() - 0.5) * 4, vy: 1 + Math.random() * 2, life: 1, color: ['#ffd9a0', '#ffb9c8', '#a8d8ff'][i % 3] });
}
// den juice: things fly to the pet, the pet REACTS
function spawnFlyer(kind) {
  flyers.push({ kind: kind, t: 0, sx: W / 2 + (kind === 'feed' ? -160 : (kind === 'gift' ? 160 : 0)), sy: H * 0.86, tx: petScreenPos.x, ty: petScreenPos.y - 20 });
}
// ---- the pet's inner life: a mood you tend (gentle — never sad) and a bond that only grows ----
var BOND_NAMES = { 5: 'warming up to you', 12: 'your little shadow', 25: 'trusts you completely', 50: 'bonded for life', 100: 'inseparable' };
function petMood() {
  if (!save.pet) return 82;
  var h = (Date.now() - (save.pet.moodT || Date.now())) / 36e5;
  return Math.max(40, Math.min(100, (save.pet.mood == null ? 82 : save.pet.mood) - h * 0.6)); // ~14/day, never below cozy
}
function raiseMood(a) { if (!save.pet) return; save.pet.mood = Math.min(100, petMood() + a); save.pet.moodT = Date.now(); }
// ---- stroll energy: a cozy comeback meter. ONLY strolls tucker out — the daily and the neighborhood are always unlimited,
// so progression through the game never gates. free regen only, forever — nothing here is ever for sale.
var STROLL_ENERGY_MAX = 3, STROLL_REGEN_MS = 2 * 36e5;   // one heart back every ~2 hours
function strollEnergyNow() {
  if (save.strollEnergy >= STROLL_ENERGY_MAX) return STROLL_ENERGY_MAX;
  var gained = Math.floor((Date.now() - save.strollEnergyT) / STROLL_REGEN_MS);
  return Math.min(STROLL_ENERGY_MAX, save.strollEnergy + gained);
}
function strollEnergySync() { var now = strollEnergyNow(); if (now !== save.strollEnergy) { save.strollEnergy = now; save.strollEnergyT = Date.now(); persist(); } }
function strollMsToNext() {
  strollEnergySync();
  if (save.strollEnergy >= STROLL_ENERGY_MAX) return 0;
  return Math.max(0, STROLL_REGEN_MS - (Date.now() - save.strollEnergyT));
}
function strollHeartsLabel() { strollEnergySync(); var s = ''; for (var i = 0; i < STROLL_ENERGY_MAX; i++) s += (i < save.strollEnergy ? '♥' : '·'); return s; }
function raiseBond(a) {
  if (!save.pet) return;
  var before = save.pet.bond || 0, after = before + a; save.pet.bond = after;
  for (var k in BOND_NAMES) { var t = +k; if (before < t && after >= t) setTimeout(function (nm) { return function () { setWhisper(save.pet.name + ' is ' + nm + '. 💛'); burstHeartsAt(300, 560, 10); }; }(BOND_NAMES[t]), 900); }
}
function burstHeartsAt(x, y, n) { for (var i = 0; i < n; i++) sparkles.push({ x: x + (Math.random() - 0.5) * 80, y: y - 30, vx: (Math.random() - 0.5) * 2.4, vy: -1.6 - Math.random() * 1.8, life: 1, color: '#ffb9c8', heart: true }); }
var petReactKind = '', petReactT = 0, petBall = null; // care-reaction choreography
function petReact(kind) {
  petPopT = performance.now();
  petReactKind = kind; petReactT = performance.now();
  raiseMood(kind === 'gift' ? 22 : kind === 'feed' ? 18 : kind === 'play' ? 16 : 6);
  raiseBond(kind === 'pat' ? 1 : 2); persist();
  var px = petScreenPos.x, py = petScreenPos.y;
  for (var i = 0; i < 6; i++) sparkles.push({ x: px + (Math.random() - 0.5) * 90, y: py - 40, vx: (Math.random() - 0.5) * 2, vy: -1.5 - Math.random() * 1.5, life: 1, color: '#ffb9c8', heart: true });
  if (save.pet && VOICE[save.pet.species]) VOICE[save.pet.species](1);
  // distinct choreography per kind
  if (kind === 'feed') { for (var f = 0; f < 10; f++) sparkles.push({ x: px + (Math.random() - 0.5) * 60, y: py - 10, vx: (Math.random() - 0.5) * 3, vy: 0.5 + Math.random() * 1.5, life: 1, color: ['#b5713a', '#d8a25a', '#8a5a30'][f % 3], size: 2 + Math.random() * 2 }); }
  else if (kind === 'play') { petBall = { x: px + 130, y: py - 40, vx: -5, vy: -3, t: performance.now() }; }
  else if (kind === 'gift') { for (var g = 0; g < 18; g++) sparkles.push({ x: px + (Math.random() - 0.5) * 40, y: py - 30, vx: (Math.random() - 0.5) * 5, vy: -2 - Math.random() * 3, life: 1, color: g % 2 ? '#ffe9a8' : '#ffb9c8', heart: g % 3 === 0 }); }
  if (kind === 'pat') {
    var lines = [save.pet.name + ' leans into it.', 'the tail has opinions. happy ones.', save.pet.name + ' would like that again, please.'];
    setWhisper(lines[Math.floor(Math.random() * lines.length)]);
  }
}
function showRescueArrival(profile) {
  var rc = $('rescue-cv').getContext('2d');
  rc.fillStyle = '#241b3e'; rc.fillRect(0, 0, 280, 200);
  rc.strokeStyle = 'rgba(125,184,236,.6)'; rc.lineWidth = 2;
  for (var i = 0; i < 9; i++) { var rx = 20 + i * 30, ry = 12 + (i % 3) * 8; rc.beginPath(); rc.moveTo(rx, ry); rc.lineTo(rx - 4, ry + 14); rc.stroke(); }
  rc.fillStyle = '#8a6a48'; rc.beginPath(); rc.moveTo(60, 120); rc.lineTo(74, 186); rc.lineTo(206, 186); rc.lineTo(220, 120); rc.closePath(); rc.fill();
  rc.fillStyle = '#a58057'; rc.fillRect(52, 112, 176, 14);
  drawPet(rc, profile.breed, profile.coat, 140, 100, 52, { sad: true, wet: true, pupil: { x: 0, y: 1 } });
  $('rescue-line').textContent = profile.found;
  $('rescuename').value = profile.suggest;
  showOv('rescue-ov');
}
$('btn-adopt').addEventListener('click', function () {
  var profile = pendingArrivalProfile || RESCUE_POOL[0];
  var nm = ($('rescuename').value || profile.suggest).trim().slice(0, 12) || profile.suggest;
  save.rescues.push({ breed: profile.breed, coat: profile.coat, name: nm, since: Date.now(), trait: profile.trait, trust: 0, homeCelebrated: false });
  pendingArrivalProfile = null;
  persist(); audio();
  mallet(SCALE_HZ[0], 0, 0.14, 0.5); mallet(SCALE_HZ[4], 0.15, 0.16, 0.6); mallet(SCALE_HZ[8], 0.32, 0.16, 1.0);
  hideOv('rescue-ov');
  goDen();
  setWhisper(nm + ' is safe now. still shy — give her time.');
});
// ---- the glow-up: the before/after reveal, the whole viral-rescue arc compressed into one shareable moment ----
function traitLine(trait) { return trait === 'cart' ? 'the fastest in the whole yard.' : trait === 'patch' ? 'keeps a very dashing eye on things.' : 'home. really home.'; }
function drawGlowUp(r) {
  var c = glowupCtx; if (!c) return;
  var g = c.createLinearGradient(0, 0, 0, 170); g.addColorStop(0, '#241b3e'); g.addColorStop(1, '#33244e'); c.fillStyle = g; c.fillRect(0, 0, 300, 170);
  c.fillStyle = 'rgba(13,8,21,.3)'; c.beginPath(); c.ellipse(80, 140, 46, 11, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(220, 140, 46, 11, 0, 0, 7); c.fill();
  drawPet(c, r.breed, r.coat, 80, 95, 46, { sad: true, wet: true, pupil: { x: 0, y: 1 } });
  drawTraitMark(c, r.trait, 220, 95, 46, true);
  drawPet(c, r.breed, r.coat, 220, 95, 46, { worn: null });
  drawTraitMark(c, r.trait, 220, 95, 46, false);
  c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '20px "Segoe UI"'; c.textAlign = 'center'; c.fillText('→', 150, 100);
  c.font = "600 12px Fredoka, sans-serif"; c.fillStyle = '#8f7bb0';
  c.fillText('day one', 80, 162); c.fillText('today', 220, 162);
}
function drawTraitMark(c, trait, x, y, r, before) {
  if (before || !trait) return;
  if (trait === 'cart') { c.strokeStyle = '#c9a876'; c.lineWidth = 3; c.beginPath(); c.arc(x - r * 0.4, y + r * 0.75, r * 0.22, 0, 7); c.stroke(); c.beginPath(); c.arc(x + r * 0.4, y + r * 0.75, r * 0.22, 0, 7); c.stroke(); }
  else if (trait === 'patch') { c.fillStyle = '#2e2230'; c.beginPath(); c.ellipse(x - r * 0.42, y - r * 0.06, r * 0.2, r * 0.16, -0.15, 0, 7); c.fill(); }
}
function showGlowUp(idx) {
  var r = save.rescues[idx]; if (!r) return;
  $('glowup-title').textContent = r.name + '’s glow-up';
  drawGlowUp(r);
  $('glowup-line').textContent = r.name + ': ' + (r.trait ? traitLine(r.trait) : 'once so shy she wouldn’t come out. now she owns the good cushion.');
  showOv('glowup-ov');
  audio(); endConfetti();
  mallet(SCALE_HZ[3], 0, 0.16, 0.5); mallet(SCALE_HZ[5], 0.14, 0.16, 0.6); mallet(SCALE_HZ[7], 0.28, 0.18, 0.8); mallet(SCALE_HZ[8], 0.46, 0.22, 1.1);
}
// tapping the rescue directly IS "giving it care" — a small, uncooled, always-available nudge (free, gentle, no exploit: it's tiny)
function coaxRescue(idx) {
  var r = save.rescues[idx]; if (!r) return;
  audio();
  var before = rescueStage(r.trust);
  r.trust = Math.min(100, r.trust + 4);
  var after = rescueStage(r.trust);
  persist();
  burstHeartsAt(rescueScreenPos.x, rescueScreenPos.y - 20, 5);
  var talk = [
    ['not yet. but she noticed you.', 'a little ear turns your way.'],
    ['she’s watching you back now.', 'still wary. still watching.'],
    ['so close now.', 'nearly not-shy anymore.'],
    [r.name + ' leans into it.', r.name + ' would like that again, please.']
  ];
  setWhisper(talk[after][Math.floor(Math.random() * talk[after].length)]);
  if (after >= 3 && before < 3 && !r.homeCelebrated) { r.homeCelebrated = true; persist(); setTimeout(function () { showGlowUp(idx); }, 700); }
}
function rescueShareText(r) {
  return r.name + ': found scared, ' + (r.trait ? 'now ' + traitLine(r.trait) : 'now home for good. 💛') + '\npawrade.pages.dev';
}
$('glowup-close').addEventListener('click', function () { uiTick(); hideOv('glowup-ov'); });
$('glowup-copy').addEventListener('click', function () {
  var idx = pendingGlowRescue >= 0 ? pendingGlowRescue : (save.rescues.length - 1);
  var r = save.rescues[idx]; if (!r) return;
  var txt = rescueShareText(r);
  var done = function () { toast('copied. go tell someone about the glow-up.'); uiTick(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { legacyCopy(txt); done(); });
  else { legacyCopy(txt); done(); }
});

// ============ OVERLAYS ============
function showOv(id) { var el = $(id); el.classList.remove('hidden2'); el.classList.remove('hidden'); }
function hideOv(id) { var el = $(id); el.classList.add('hidden2'); if (countdownTimer && id === 'end-ov') { clearInterval(countdownTimer); countdownTimer = null; } }
$('btn-copy').addEventListener('click', function () {
  var txt = shareText();
  var done = function () { toast('copied. go tell someone about the hug.'); uiTick(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { legacyCopy(txt); done(); });
  else { legacyCopy(txt); done(); }
});
function legacyCopy(txt) { var ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = 0; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); }
$('btn-again').addEventListener('click', function () {
  hideOv('end-ov'); uiTick();
  var c = window._endCtx;
  if (c && c.mode === 'night') startRun('night', c.nextId || c.nightId);
  else startRun('practice');
});
$('btn-home').addEventListener('click', function () {
  hideOv('end-ov'); uiTick();
  if (window._endCtx && window._endCtx.mode === 'night') goMap(); else goDen();
});
$('btn-end-map').addEventListener('click', function () { hideOv('end-ov'); uiTick(); goMap(); });
$('btn-parade').addEventListener('click', function () {
  audio(); uiTick();
  var n = dayNumber();
  if (save.daily && save.daily.day === n) { window._last = { daily: true, day: n, score: save.daily.score, tucked: save.daily.tucked, longest: save.daily.longest, grads: save.daily.grads || [] }; showEnd(window._last); return; }
  startRun('daily');
});
$('btn-practice').addEventListener('click', function () {
  uiTick();
  strollEnergySync();
  if (save.strollEnergy <= 0) {
    audio(); var ms = strollMsToNext(), mm = Math.ceil(ms / 60000), hh = Math.floor(mm / 60);
    setWhisper('tuckered out for tonight’s strolls — back in ' + (hh > 0 ? hh + 'h ' : '') + (mm % 60) + 'm.');
    $('stroll-hearts').textContent = strollHeartsLabel();
    return;
  }
  save.strollEnergy--; persist(); audio();
  $('stroll-hearts').textContent = strollHeartsLabel();
  startRun('practice');
});
$('btn-map').addEventListener('click', function () { audio(); uiTick(); goMap(); });
$('btn-night-play').addEventListener('click', function () { hideOv('night-ov'); uiTick(); startRun('night', cardId); });
$('btn-night-close').addEventListener('click', function () { uiTick(); hideOv('night-ov'); });
$('leave-stay').addEventListener('click', function () { uiTick(); hideOv('leave-ov'); });
$('leave-go').addEventListener('click', function () { uiTick(); leaveNow(); });
$('demo-next').addEventListener('click', demoNext);
$('demo-skip').addEventListener('click', function () { uiTick(); endDemo(); });
(function () { var cs = document.querySelectorAll('.slot-choice'); for (var i = 0; i < cs.length; i++) { slotPreview.push({ cv: cs[i], ctx: cs[i].getContext('2d') }); (function (idx) { cs[idx].addEventListener('click', function () { chooseStyle(idx); }); })(i); } })();
$('slot-close').addEventListener('click', function () { uiTick(); hideOv('slot-ov'); });
$('btn-dreams').addEventListener('click', function () { uiTick(); openDreams(); });
$('btn-wardrobe').addEventListener('click', function () { uiTick(); openWardrobe(); });
$('wardrobe-close').addEventListener('click', function () { uiTick(); wardrobeOpen = false; wardrobePreview = null; hideOv('wardrobe-ov'); });
$('wardrobe-confirm-buy').addEventListener('click', function () { uiTick(); confirmBuyPreview(); });
$('wardrobe-put-back').addEventListener('click', function () { uiTick(); cancelPreview(); });
$('founder-redeem').addEventListener('click', function () { uiTick(); redeemFounder(); if (save.founder && wardrobeOpen) buildWardrobeList(); });
$('founder-close').addEventListener('click', function () { uiTick(); hideOv('founder-ov'); if (wardrobeOpen) buildWardrobeList(); });
$('btn-dreams-close').addEventListener('click', function () { uiTick(); hideOv('dreams-ov'); });
$('btn-shop').addEventListener('click', function () { audio(); uiTick(); buildShop(); showOv('shop-ov'); });
$('btn-shop-close').addEventListener('click', function () { uiTick(); hideOv('shop-ov'); setUI(); });
function clearFx() { sparkles.length = 0; callouts.length = 0; hugFlyers.length = 0; calloutBusyUntil = 0; } // no effect outlives its screen
// ---- leaving a run: never a trap. free to back out; a fair confirm only when something is actually at stake ----
function requestLeave() {
  if (tut.active) { setWhisper('almost there — one more moment.'); return; }
  if (score <= 0) { leaveNow(); return; }
  $('leave-title').textContent = runMode === 'daily' ? 'leave tonight’s parade?' : 'leave for now?';
  $('leave-note').textContent = runMode === 'daily' ? ('tonight ends here — you’ll keep half: ' + fmt(Math.ceil(score / 2)) + '.') : ('leaving now keeps half your ' + fmt(score) + '. or stay and bank it all.');
  showOv('leave-ov');
}
function leaveNow() {
  hideOv('leave-ov');
  if (score > 0) { endRun(false); return; }   // nothing free to keep the stakes honest — same fair path as a gentle nap
  phase = 'done';
  if (runMode === 'night') goMap(); else goDen();   // nothing was ever at risk; step away, the board stays exactly as fresh
}
function goDen() {
  screenMode = 'den'; curRoom = 0; phase = 'idle'; clearFx(); fadeFrom = performance.now(); setUI(); denWhisper();
  if (pendingGlowRescue >= 0) { var gi = pendingGlowRescue; pendingGlowRescue = -1; setTimeout(function () { showGlowUp(gi); }, 900); }
}
function denWhisper() {
  if (save.pet && petMood() < 52 && Math.random() < 0.6) { setWhisper(save.pet.name + ' perks right up the moment you walk in.'); return; }
  setWhisper(whisperOf(isNight() ? WHISPERS.denNight : WHISPERS.denDay));
}

// ============ THE NEIGHBORHOOD MAP ============
var MAP_TOP = 250, MAP_GAP = 158, MAP_BACK = { x: 20, y: 22, w: 150, h: 48 };
function mapMaxScroll() { return Math.max(0, MAP_TOP + 40 * MAP_GAP - (H - 150)); }
function clampScroll(s) { return Math.max(0, Math.min(mapMaxScroll(), s)); }
function nodePos(i) { return { x: W / 2 + Math.sin(i * 0.68) * 158, y: MAP_TOP + i * MAP_GAP - mapScroll }; } // i is 0-based
function nodeHit(px, py) {
  for (var i = 0; i < 40; i++) { var p = nodePos(i); if (Math.hypot(px - p.x, py - p.y) < 48) return i + 1; }
  return 0;
}
function goMap() {
  screenMode = 'map'; phase = 'idle'; clearFx(); fadeFrom = performance.now();
  mapScroll = clampScroll(MAP_TOP + (firstOpenNight() - 1) * MAP_GAP - H * 0.42);
  setUI(); setWhisper('forty nights, one street at a time.');
}
var cardId = 0;
function openNight(id) {
  if (!nightUnlocked(id)) { setWhisper(id === 21 ? 'earn 24 🌙 to open the next street.' : 'clear the night before to light this porch.'); mallet(196, 0, 0.1, 0.5); return; }
  cardId = id; audio();
  var nt = NIGHTS[id - 1], rec = save.nights[id] || { moons: 0, best: 0 };
  $('night-title').textContent = 'NIGHT ' + id + (id > 20 ? '  ·  street 2' : '');
  $('night-obj').textContent = OBJ_LABEL[nt.obj.type](nt.obj);
  $('night-moons').textContent = moonGlyphs(rec.moons);
  $('night-best').textContent = (rec.best ? 'your best: ' + fmt(rec.best) + '  ·  ' : '') + 'the bot tucks ' + fmt(nt.par) + '  ·  ' + nt.spec.breeds.length + ' breeds';
  $('btn-night-play').textContent = rec.moons > 0 ? '🐾 PLAY AGAIN' : '🐾 PLAY THIS NIGHT';
  showOv('night-ov');
}
function renderMap(now) {
  twoLightSky(now, W - 130, 128);
  // the winding trail
  ctx.strokeStyle = 'rgba(120,98,156,.4)'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.setLineDash([2, 26]); ctx.beginPath();
  for (var i = 0; i < 40; i++) { var p = nodePos(i); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
  ctx.stroke(); ctx.setLineDash([]);
  var open = firstOpenNight();
  for (var j = 0; j < 40; j++) {
    var np = nodePos(j); if (np.y < -60 || np.y > H + 60) continue;
    var id = j + 1, rec = save.nights[id], done = rec && rec.moons > 0;
    var locked = !nightUnlocked(id), current = id === open;
    var r = 34 + (current ? 3 * Math.sin(now / 260) + 3 : 0);
    // porch-light glow
    if (done || current) { var gl = ctx.createRadialGradient(np.x, np.y, 4, np.x, np.y, 70); gl.addColorStop(0, 'rgba(255,202,122,' + (done ? .5 : .35) + ')'); gl.addColorStop(1, 'rgba(255,158,94,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(np.x, np.y, 70, 0, 7); ctx.fill(); }
    ctx.beginPath(); ctx.arc(np.x, np.y, r, 0, 7);
    ctx.fillStyle = locked ? 'rgba(40,30,58,.85)' : done ? '#3a2b50' : '#4a3563'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = locked ? 'rgba(90,80,110,.6)' : done ? '#ffca7a' : current ? '#ffe0a8' : '#8f7bb0'; ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (locked) { ctx.font = '22px "Segoe UI"'; ctx.fillStyle = 'rgba(200,190,220,.6)'; ctx.fillText('🔒', np.x, np.y); }
    else {
      ctx.font = "800 26px 'Baloo 2', sans-serif"; ctx.fillStyle = '#fff'; ctx.fillText(id, np.x, np.y - 2);
      var ms = done ? moonGlyphs(rec.moons) : '···';
      ctx.font = '13px "Segoe UI"'; ctx.fillStyle = done ? '#ffd9a0' : 'rgba(180,168,200,.7)'; ctx.fillText(ms, np.x, np.y + 24);
    }
    if (id === 21 && locked) { ctx.font = "500 14px Fredoka, sans-serif"; ctx.fillStyle = '#a8d8ff'; ctx.fillText('needs 24 🌙 (' + totalMoons() + ')', np.x, np.y + 46); }
    ctx.textBaseline = 'alphabetic';
  }
  // header + back
  ctx.textAlign = 'left';
  ctx.font = "800 30px 'Baloo 2', sans-serif"; ctx.fillStyle = '#ffd9a0'; ctx.fillText('THE NEIGHBORHOOD', 24, 120);
  ctx.font = "500 20px Fredoka, sans-serif"; ctx.fillStyle = '#b9a9c9'; ctx.fillText(totalMoons() + ' / 120 🌙  ·  drag to wander', 24, 150);
  roundRect(MAP_BACK.x, MAP_BACK.y, MAP_BACK.w, MAP_BACK.h, 14); ctx.fillStyle = 'rgba(58,43,80,.9)'; ctx.fill(); ctx.strokeStyle = '#574371'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#d9c9ea'; ctx.font = "700 17px 'Baloo 2', sans-serif"; ctx.textAlign = 'center'; ctx.fillText('← the den', MAP_BACK.x + MAP_BACK.w / 2, MAP_BACK.y + 30);
}

// ============ THE DREAM DEMO (storybook shown once, after the creator) ============
var demoCv, dctx, demoPage = 0, demoActive = false;
function demoBg() {
  var g = dctx.createLinearGradient(0, 0, 0, 230); g.addColorStop(0, '#241b3e'); g.addColorStop(1, '#452e58');
  dctx.fillStyle = g; dctx.fillRect(0, 0, 360, 230);
  for (var i = 0; i < 8; i++) { dctx.fillStyle = 'rgba(255,233,196,.5)'; dctx.fillRect((hashStr('d' + i) % 360), (hashStr('e' + i) % 120), 2, 2); }
}
var DEMO_PAGES = [
  { title: 'the parade', line: 'link the sleepy little ones — they hug so hard they grow all the way up.', draw: function (now) {
      var t = (now % 2600) / 2600, ease = t < 0.6 ? t / 0.6 : 1;
      demoBg();
      if (t < 0.72) { var xs = [110, 180, 250];
        for (var i = 0; i < 3; i++) { var x = xs[i] + (180 - xs[i]) * ease; drawPet(dctx, 'corgi', 0, x, 130, 30 * (1 - ease * 0.2), { stage: 1, tilt: Math.sin(now / 200 + i) * 0.1 }); }
      } else { var pp = Math.min(1, (t - 0.72) / 0.28); drawPet(dctx, 'corgi', 0, 180, 128, 40 + 14 * Math.sin(pp * Math.PI), { stage: 2 }); }
      dctx.fillStyle = '#ffd9a0'; dctx.font = "700 15px 'Baloo 2',sans-serif"; dctx.textAlign = 'center'; dctx.fillText('3 pups  →  1 bigger friend', 180, 205);
    } },
  { title: 'a whole home', line: 'the grown-ups move in. you build them a home — room by room, all yours.', draw: function (now) {
      demoBg();
      dctx.fillStyle = '#2c2044'; dctx.beginPath(); dctx.moveTo(0, 150); dctx.quadraticCurveTo(180, 130, 360, 150); dctx.lineTo(360, 230); dctx.lineTo(0, 230); dctx.fill();
      var fl = 0.8 + 0.2 * Math.sin(now / 300); var lg = dctx.createRadialGradient(70, 150, 6, 70, 150, 120); lg.addColorStop(0, 'rgba(255,202,122,' + 0.4 * fl + ')'); lg.addColorStop(1, 'rgba(255,158,94,0)'); dctx.fillStyle = lg; dctx.fillRect(0, 40, 360, 190);
      dctx.fillStyle = '#8a4a5a'; dctx.beginPath(); dctx.ellipse(180, 190, 110, 16, 0, 0, 7); dctx.fill();               // rug
      dctx.fillStyle = '#4a3260'; dctx.fillRect(60, 70, 6, 90); dctx.fillStyle = '#ffca7a'; dctx.globalAlpha = fl; dctx.fillRect(50, 52, 26, 22); dctx.globalAlpha = 1;  // lamp
      drawPet(dctx, 'shiba', 0, 150, 165, 30, { stage: 2, tilt: Math.sin(now / 260) * 0.08 });
      drawPet(dctx, 'tabby', 0, 225, 172, 26, { stage: 1, sleeping: true });
      dctx.fillStyle = '#ffd9a0'; dctx.font = "700 15px 'Baloo 2',sans-serif"; dctx.textAlign = 'center'; dctx.fillText('rugs · lamps · rooms to come', 180, 216);
    } },
  { title: 'the nightly race', line: 'one parade a night for the whole world. out-hug the sleepy bot. keep your streak.', draw: function (now) {
      demoBg();
      dctx.textAlign = 'center';
      dctx.fillStyle = '#fff'; dctx.font = "800 46px 'Baloo 2',sans-serif"; dctx.fillText('1,840', 180, 96);
      dctx.fillStyle = '#ffd9a0'; dctx.font = "700 17px 'Baloo 2',sans-serif"; dctx.fillText('🏆 you beat the sleepy bot (1,600)', 180, 130);
      dctx.fillStyle = '#a8d8ff'; dctx.font = "500 22px Caveat,cursive"; dctx.fillText('🔥 streak: 12 nights', 180, 168);
      dctx.fillStyle = '#b9a9c9'; dctx.font = "500 14px Fredoka,sans-serif"; dctx.fillText('everyone plays the exact same friends today', 180, 205);
    } },
  { title: 'the neighborhood', line: 'forty nights are waiting up the street — each its own little puzzle to clear.', draw: function (now) {
      demoBg();
      for (var i = 0; i < 6; i++) {
        var x = 60 + i * 50, y = 150 + Math.sin(i * 0.9) * 44;
        var done = i < 2, cur = i === 2;
        if (done || cur) { var gl = dctx.createRadialGradient(x, y, 3, x, y, 34); gl.addColorStop(0, 'rgba(255,202,122,.5)'); gl.addColorStop(1, 'rgba(255,158,94,0)'); dctx.fillStyle = gl; dctx.beginPath(); dctx.arc(x, y, 34, 0, 7); dctx.fill(); }
        dctx.beginPath(); dctx.arc(x, y, 18, 0, 7); dctx.fillStyle = done ? '#3a2b50' : cur ? '#4a3563' : 'rgba(40,30,58,.85)'; dctx.fill();
        dctx.strokeStyle = done ? '#ffca7a' : cur ? '#ffe0a8' : '#6a5a80'; dctx.lineWidth = 2; dctx.stroke();
        dctx.fillStyle = '#fff'; dctx.font = "800 14px 'Baloo 2',sans-serif"; dctx.textAlign = 'center'; dctx.textBaseline = 'middle'; dctx.fillText(i + 1, x, y); dctx.textBaseline = 'alphabetic';
      }
      dctx.fillStyle = '#ffd9a0'; dctx.font = "700 15px 'Baloo 2',sans-serif"; dctx.textAlign = 'center'; dctx.fillText('clear a night → the next porch lights up', 180, 210);
    } }
];
function startDemo() { demoActive = true; demoPage = 0; showOv('demo-ov'); showDemoPage(); }
function showDemoPage() {
  var p = DEMO_PAGES[demoPage];
  $('demo-title').textContent = p.title; $('demo-line').textContent = p.line;
  var dots = ''; for (var i = 0; i < DEMO_PAGES.length; i++) dots += (i === demoPage ? '●' : '○') + ' ';
  $('demo-dots').textContent = dots.trim();
  $('demo-next').textContent = demoPage === DEMO_PAGES.length - 1 ? 'meet your friend →' : 'next →';
}
function demoNext() { audio(); if (demoPage < DEMO_PAGES.length - 1) { demoPage++; showDemoPage(); } else endDemo(); }
function endDemo() { demoActive = false; save.demoSeen = true; persist(); hideOv('demo-ov'); if (!save.tutDone) startTutorialDen(); else goDen(); setUI(); }

// ============ THE DREAMS ALBUM ============
var dreamsCv, drctx;
function seenStage(breed, stage) { return stage === 1 || !!save.seen[breed + stage]; }
function openDreams() {
  audio(); renderDreamsAlbum();
  var got = 0; for (var bi = 0; bi < BREEDS.length; bi++) for (var s = 1; s <= 3; s++) if (seenStage(BREEDS[bi], s)) got++;
  var furn = 0, fk; for (fk in save.furniture) if (save.furniture[fk]) furn++;
  var outfits = 0, ok; for (ok in save.albumRewards) if (save.albumRewards[ok]) outfits++;
  var rares = 0, rk; for (rk = 0; rk < BREEDS.length; rk++) if (save.seen['rare-' + BREEDS[rk]]) rares++;
  var legs = 0, lk; for (lk in save.legends) if (save.legends[lk]) legs++;
  $('dreams-sub').textContent = got + ' / 15 raised  ·  ' + rares + ' / 5 rare ✦  ·  ' + legs + ' / ' + LEGENDS.length + ' legends  ·  ' + outfits + ' / 5 outfits';
  // one locked legend's hint at a time — the chase whispers how
  var hintL = null, hi;
  for (hi = 0; hi < LEGENDS.length; hi++) if (!save.legends[LEGENDS[hi].id]) { hintL = LEGENDS[hi]; break; }
  $('dreams-hint').textContent = hintL ? (hintL.name + ' — ' + hintL.how + '.') : 'every friend is home. you did it all.';
  showOv('dreams-ov');
}
function renderDreamsAlbum() {
  var c = drctx; c.clearRect(0, 0, 360, 500);
  var colW = 68, x0 = 16, y0 = 26, rowH = 96;
  function slot(cx, cy, known, drawFn, rare) {
    c.fillStyle = rare ? 'rgba(96,74,50,.45)' : 'rgba(74,54,96,.5)'; roundRect2(c, cx - 30, cy - 30, 60, 60, 14); c.fill();
    if (rare) { c.strokeStyle = 'rgba(255,210,74,.5)'; c.lineWidth = 1.5; roundRect2(c, cx - 30, cy - 30, 60, 60, 14); c.stroke(); }
    if (known) drawFn();
    else { c.fillStyle = 'rgba(20,12,32,.7)'; c.beginPath(); c.arc(cx, cy, 22, 0, 7); c.fill(); c.fillStyle = rare ? '#a08a5a' : '#6a5a80'; c.font = "800 24px 'Baloo 2',sans-serif"; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(rare ? '✦' : '?', cx, cy + 1); c.textBaseline = 'alphabetic'; }
  }
  for (var b = 0; b < BREEDS.length; b++) for (var s = 1; s <= 3; s++) {
    (function (b, s) {
      var cx = x0 + b * colW + 34, cy = y0 + (s - 1) * rowH + 34;
      slot(cx, cy, seenStage(BREEDS[b], s), function () { drawPet(c, BREEDS[b], 0, cx, cy, s === 3 ? 26 : s === 2 ? 23 : 20, { stage: s }); }, false);
    })(b, s);
  }
  // the RARE row: shimmer-coat majestics (one chase per breed)
  for (var rb = 0; rb < BREEDS.length; rb++) {
    (function (rb) {
      var cx = x0 + rb * colW + 34, cy = 348;
      slot(cx, cy, !!save.seen['rare-' + BREEDS[rb]], function () { drawPet(c, BREEDS[rb], save.rareGrads[BREEDS[rb]] || 1, cx, cy, 26, { stage: 3 }); c.fillStyle = '#ffd24a'; c.font = '12px "Segoe UI"'; c.textAlign = 'center'; c.fillText('✦', cx + 22, cy - 18); }, true);
    })(rb);
  }
  // the LEGENDS row: one-of-a-kind friends
  for (var lg = 0; lg < LEGENDS.length; lg++) {
    (function (lg) {
      var L = LEGENDS[lg], cx = x0 + 34 + lg * colW + 34, cy = 442;
      slot(cx, cy, !!save.legends[L.id], function () { drawPet(c, L.breed, 0, cx, cy, 26, { stage: 3, coatO: L.coatO, worn: L.worn }); }, true);
    })(lg);
  }
  // labels down the side
  c.textAlign = 'left'; c.font = "600 11px Fredoka,sans-serif"; c.fillStyle = '#8f7bb0';
  var labels = ['pups', 'grown', 'majestic'];
  for (var li = 0; li < 3; li++) c.fillText(labels[li], 2, y0 + li * rowH + 74);
  c.fillStyle = '#a08a5a';
  c.fillText('rare ✦', 2, 388); c.fillText('legends', 2, 482);
}
function roundRect2(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ============ THE WARDROBE (V7 — identity) ============
// each accessory draws in the pet's local e-units (e = r/20), over the finished face
var ACCESSORIES = {
  collar: { name: 'the collar', how: 'buy', cost: 30, draw: function (c, e) {
    c.strokeStyle = '#c0453f'; c.lineWidth = 2.6 * e; c.beginPath(); c.arc(0, 0.6 * e, 12.4 * e, Math.PI * 0.26, Math.PI * 0.74); c.stroke();
    c.fillStyle = '#ffd24a'; c.beginPath(); c.arc(0, 13.2 * e, 2.3 * e, 0, 7); c.fill(); c.strokeStyle = '#b58a1a'; c.lineWidth = 0.7 * e; c.stroke();
  } },
  bandana: { name: 'the bandana', how: 'buy', cost: 40, draw: function (c, e) {
    c.fillStyle = '#5a94c4'; c.beginPath(); c.moveTo(-9 * e, 9 * e); c.lineTo(9 * e, 9 * e); c.lineTo(0, 18 * e); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-9 * e, 9 * e); c.lineTo(-12.5 * e, 7.5 * e); c.lineTo(-8 * e, 12.5 * e); c.fill(); c.beginPath(); c.moveTo(9 * e, 9 * e); c.lineTo(12.5 * e, 7.5 * e); c.lineTo(8 * e, 12.5 * e); c.fill();
    c.fillStyle = '#a8d0ec'; for (var i = -1; i <= 1; i++) { c.beginPath(); c.arc(i * 4 * e, 12 * e, 0.8 * e, 0, 7); c.fill(); }
  } },
  bowtie: { name: 'the bow tie', how: 'buy', cost: 60, draw: function (c, e) {
    c.fillStyle = '#8a3a4a'; c.beginPath(); c.moveTo(0, 12.6 * e); c.lineTo(-6 * e, 10 * e); c.lineTo(-6 * e, 15.2 * e); c.closePath(); c.fill(); c.beginPath(); c.moveTo(0, 12.6 * e); c.lineTo(6 * e, 10 * e); c.lineTo(6 * e, 15.2 * e); c.closePath(); c.fill();
    c.fillStyle = '#b06678'; c.beginPath(); c.arc(0, 12.6 * e, 1.7 * e, 0, 7); c.fill();
  } },
  glasses: { name: 'the specs', how: 'earn', breed: 'tabby', draw: function (c, e) {
    c.strokeStyle = '#2e2230'; c.lineWidth = 1.2 * e; var gap = 5.6 * e, eyeY = -1.4 * e;
    c.beginPath(); c.arc(-gap, eyeY, 3.4 * e, 0, 7); c.stroke(); c.beginPath(); c.arc(gap, eyeY, 3.4 * e, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(-gap + 3.4 * e, eyeY); c.lineTo(gap - 3.4 * e, eyeY); c.stroke();
    c.beginPath(); c.moveTo(-gap - 3.4 * e, eyeY); c.lineTo(-11.5 * e, eyeY - 1.5 * e); c.stroke(); c.beginPath(); c.moveTo(gap + 3.4 * e, eyeY); c.lineTo(11.5 * e, eyeY - 1.5 * e); c.stroke();
  } },
  crown: { name: 'the flower crown', how: 'earn', breed: 'corgi', draw: function (c, e) {
    var fc = ['#e8879e', '#ffd9a0', '#a8d8ff', '#f6efe6', '#c8a8e8'];
    for (var i = 0; i < 5; i++) { var a = Math.PI * (1.16 + i * 0.14), fx = Math.cos(a) * 12.8 * e, fy = 0.6 * e + Math.sin(a) * 12.8 * e; c.fillStyle = fc[i]; for (var p = 0; p < 5; p++) { c.beginPath(); c.arc(fx + Math.cos(p * 1.26) * 1.5 * e, fy + Math.sin(p * 1.26) * 1.5 * e, 1.2 * e, 0, 7); c.fill(); } c.fillStyle = '#ffd24a'; c.beginPath(); c.arc(fx, fy, 0.8 * e, 0, 7); c.fill(); }
  } },
  cap: { name: 'the nightcap', how: 'earn', breed: 'shiba', draw: function (c, e) {
    c.fillStyle = '#6a7ab8'; c.beginPath(); c.moveTo(-12 * e, -8 * e); c.quadraticCurveTo(-13 * e, -24 * e, 5 * e, -22 * e); c.quadraticCurveTo(12 * e, -21 * e, 12 * e, -9 * e); c.quadraticCurveTo(0, -13 * e, -12 * e, -8 * e); c.fill();
    c.fillStyle = '#f6efe6'; c.beginPath(); c.moveTo(-12 * e, -8 * e); c.quadraticCurveTo(0, -13 * e, 12 * e, -9 * e); c.lineTo(12 * e, -5.5 * e); c.quadraticCurveTo(0, -10 * e, -12 * e, -4.5 * e); c.fill();
    c.fillStyle = '#a8b6e0'; c.beginPath(); c.arc(7 * e, -22 * e, 3 * e, 0, 7); c.fill();
  } },
  party: { name: 'the party hat', how: 'earn', breed: 'frenchie', draw: function (c, e) {
    c.fillStyle = '#e8879e'; c.beginPath(); c.moveTo(-9 * e, -10 * e); c.lineTo(9 * e, -10 * e); c.lineTo(0, -28 * e); c.closePath(); c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 1 * e; c.beginPath(); c.moveTo(-6 * e, -14 * e); c.lineTo(4 * e, -16 * e); c.moveTo(-3 * e, -20 * e); c.lineTo(5 * e, -21 * e); c.stroke();
    c.fillStyle = '#ffd24a'; c.beginPath(); c.arc(0, -28 * e, 2 * e, 0, 7); c.fill();
  } },
  tophat: { name: 'the top hat', how: 'earn', breed: 'tux', draw: function (c, e) {
    c.fillStyle = '#26222e'; c.fillRect(-8 * e, -25 * e, 16 * e, 15 * e); c.fillRect(-12.5 * e, -11 * e, 25 * e, 3 * e);
    c.fillStyle = '#8a3a4a'; c.fillRect(-8 * e, -13 * e, 16 * e, 2.4 * e);
  } },
  goldcrown: { name: 'the founder crown', how: 'supporter', draw: function (c, e) {
    c.fillStyle = '#ffd24a'; c.beginPath(); c.moveTo(-10 * e, -9 * e); c.lineTo(-10 * e, -18 * e); c.lineTo(-5 * e, -13 * e); c.lineTo(0, -21 * e); c.lineTo(5 * e, -13 * e); c.lineTo(10 * e, -18 * e); c.lineTo(10 * e, -9 * e); c.closePath(); c.fill();
    c.fillStyle = '#e8879e'; c.beginPath(); c.arc(0, -13 * e, 1.4 * e, 0, 7); c.fill(); c.fillStyle = '#a8d8ff'; c.beginPath(); c.arc(-6 * e, -13 * e, 1 * e, 0, 7); c.fill(); c.beginPath(); c.arc(6 * e, -13 * e, 1 * e, 0, 7); c.fill();
  } }
};
var BREED_ACCESSORY = { corgi: 'crown', shiba: 'cap', frenchie: 'party', tabby: 'glasses', tux: 'tophat' };
var ACC_ORDER = ['collar', 'bandana', 'bowtie', 'glasses', 'crown', 'cap', 'party', 'tophat', 'goldcrown'];
function accOwned(id) { if (!id || id === 'none') return true; var a = ACCESSORIES[id]; if (!a) return false; if (a.how === 'supporter') return !!save.founder; return !!save.owned[id]; }
// ============ LEGENDS (one-of-a-kind friends, earned by FEATS — never by chance, never for sale alone) ============
var LEGENDS = [
  { id: 'starlight', name: 'STARLIGHT', breed: 'tabby', coatO: ['#bfe3ff', '#7fb3e8'], worn: null, how: 'chain through 3 wishing stars in one night' },
  { id: 'bighug', name: 'BIGHUG', breed: 'frenchie', coatO: ['#8a76b8', '#655090'], worn: null, how: 'make an 8-friend hug' },
  { id: 'gilded', name: 'THE GILDED CORGI', breed: 'corgi', coatO: ['#ffd24a', '#d4a017'], worn: 'goldcrown', how: 'founders — or out-hug the bot on 7 nights' },
  { id: 'moonmayor', name: 'THE MOON MAYOR', breed: 'tux', coatO: ['#dfe8ff', '#aab8dd'], worn: 'tophat', how: 'three moons on every street-1 night' }
];
function legendById(id) { for (var i = 0; i < LEGENDS.length; i++) if (LEGENDS[i].id === id) return LEGENDS[i]; return null; }
function unlockLegend(id) {
  if (save.legends[id]) return;
  var L = legendById(id); if (!L) return;
  save.legends[id] = true; persist();
  callout('✨ ' + L.name + ' has joined your family!', '#ffd24a');
  endConfetti();
  mallet(SCALE_HZ[3], 0, 0.16, 0.5); mallet(SCALE_HZ[5], 0.14, 0.16, 0.6); mallet(SCALE_HZ[7], 0.28, 0.18, 0.8); mallet(SCALE_HZ[8], 0.46, 0.22, 1.1);
  setTimeout(function () { setWhisper(L.name + ' is home now. they were always going to find you.'); }, 1200);
}
// grant collection: raising a breed to stage 3 unlocks its accessory + ✦
function markSeen(breed, stage, coat) {
  var k = breed + stage, dirty = false;
  if (!save.seen[k]) {
    save.seen[k] = true; dirty = true;
    if (stage === 3 && !save.albumRewards[breed]) {
      save.albumRewards[breed] = true;
      var acc = BREED_ACCESSORY[breed]; if (acc) save.owned[acc] = true;
      save.dreamlight += 50;
      callout('✦50 + ' + (acc ? ACCESSORIES[acc].name : 'a gift') + ' unlocked!', '#ffd9a0');
    }
  }
  // a RARE majestic: the shimmer made it all the way home
  if (coat && stage === 3 && !save.seen['rare-' + breed]) {
    save.seen['rare-' + breed] = true; save.rareGrads[breed] = coat; save.dreamlight += 75; dirty = true;
    callout('✨ a RARE ' + STAGE_NAME[breed][3] + '! ✦75', '#ffd24a');
    endConfetti();
  } else if (coat && stage === 3) { save.rareGrads[breed] = coat; dirty = true; }
  if (dirty) persist();
}
function isBirthday() {
  if (!save.pet || !save.pet.since) return false;
  if (Date.now() - save.pet.since < 300 * 864e5) return false;   // an ANNIVERSARY, not adoption day — day-one party was a bug
  var b = new Date(save.pet.since), t = new Date(); return b.getMonth() === t.getMonth() && b.getDate() === t.getDate();
}
function openWardrobe() {
  if (!save.pet) return;
  audio(); wardrobeOpen = true; wardrobePreview = null;
  $('wardrobe-title').textContent = save.pet.name + '’s wardrobe';
  $('wardrobe-preview-bar').classList.add('hidden');
  buildWardrobeList(); showOv('wardrobe-ov');
}
function buildWardrobeList() {
  var list = $('wardrobe-list'); list.innerHTML = '';
  var opts = ['none'].concat(ACC_ORDER);
  opts.forEach(function (id) {
    var worn = (save.pet.worn || 'none') === id;
    var previewing = wardrobePreview === id;
    var a = id === 'none' ? { name: 'no fuss' } : ACCESSORIES[id];
    var owned = accOwned(id), badge, cls;
    if (previewing) { badge = 'trying it on…'; cls = 'buy'; }
    else if (id === 'none') { badge = worn ? 'on ✓' : 'bare'; cls = 'ok'; }
    else if (owned) { badge = worn ? 'on ✓' : 'wear'; cls = 'ok'; }
    else if (a.how === 'buy') { badge = '✦ ' + a.cost + ' · preview'; cls = save.dreamlight >= a.cost ? 'buy' : 'no'; }
    else if (a.how === 'earn') { badge = 'raise a ' + STAGE_NAME[a.breed][2]; cls = 'lock'; }
    else { badge = 'founder pack'; cls = 'lock'; }
    var chip = document.createElement('div');
    chip.className = 'ward-chip' + (worn && !previewing ? ' worn' : '') + (previewing ? ' previewing' : '');
    chip.innerHTML = '<div class="ward-name">' + a.name + '</div><div class="ward-badge ' + cls + '">' + badge + '</div>';
    chip.addEventListener('click', function () { tryAcc(id); });
    list.appendChild(chip);
  });
}
// tapping an item you own (or "none") wears it instantly — free, no stakes.
// tapping one you DON'T own only PREVIEWS it on the pet; buying is a separate, explicit confirm.
function tryAcc(id) {
  if (id === 'none') { wardrobePreview = null; $('wardrobe-preview-bar').classList.add('hidden'); save.pet.worn = null; persist(); audio(); buildWardrobeList(); return; }
  var a = ACCESSORIES[id];
  if (accOwned(id)) {
    wardrobePreview = null; $('wardrobe-preview-bar').classList.add('hidden');
    save.pet.worn = id; persist(); audio(); mallet(SCALE_HZ[4], 0, 0.12, 0.4); mallet(SCALE_HZ[6], 0.1, 0.12, 0.5);
    setWhisper(save.pet.name + ' wears ' + a.name + '. adorable.'); buildWardrobeList(); setUI(); return;
  }
  if (a.how === 'earn') { setWhisper('raise a ' + STAGE_NAME[a.breed][3] + ' and ' + a.name + ' is yours.'); mallet(196, 0, 0.1, 0.5); return; }
  if (a.how === 'supporter') { openFounder(); return; }
  // buyable + not owned: try it on, no money moves yet
  audio(); wardrobePreview = id;
  $('wardrobe-buy-cost').textContent = a.cost;
  $('wardrobe-preview-bar').classList.remove('hidden');
  setWhisper('just trying it on — ' + a.name + '.');
  buildWardrobeList();
}
function confirmBuyPreview() {
  if (!wardrobePreview) return;
  var id = wardrobePreview, a = ACCESSORIES[id];
  if (save.dreamlight < a.cost) { setWhisper('need ✦' + a.cost + ' for ' + a.name + '.'); mallet(196, 0, 0.1, 0.5); return; }
  save.dreamlight -= a.cost; save.owned[id] = true; save.pet.worn = id; persist(); audio();
  mallet(SCALE_HZ[4], 0, 0.16, 0.4); mallet(SCALE_HZ[6], 0.12, 0.16, 0.5); mallet(SCALE_HZ[8], 0.26, 0.16, 0.7);
  setWhisper(save.pet.name + ' gets to keep ' + a.name + '!');
  wardrobePreview = null; $('wardrobe-preview-bar').classList.add('hidden');
  buildWardrobeList(); setUI();
}
function cancelPreview() {
  wardrobePreview = null; $('wardrobe-preview-bar').classList.add('hidden');
  setWhisper('back on the shelf — no harm done.');
  buildWardrobeList();
}
function drawWardrobePreview(now) {
  var c = wardrobeCtx; if (!c) return;
  var g = c.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, '#33244e'); g.addColorStop(1, '#452e58'); c.fillStyle = g; c.fillRect(0, 0, 200, 180);
  if (!save.pet) return;
  c.fillStyle = 'rgba(13,8,21,.3)'; c.beginPath(); c.ellipse(100, 150, 52, 12, 0, 0, 7); c.fill();
  var s = denSouls.pet; s.tick(now);
  drawPet(c, save.pet.species, save.pet.coat, 100, 98, 66, { breath: s.breath(now), blinkL: s.blinking(now), blinkR: s.blinking(now), worn: wardrobePreview || save.pet.worn });
}

// ============ THE FOUNDER PACK (V8 — one-time supporter unlock, cosmetics ONLY) ============
// zero backend: you sell the pack on an external checkout, hand the buyer a code, the game validates it offline.
// replace FOUNDER_URL with your real link, and generate codes with genFounderCode() from your processor.
var FOUNDER_URL = 'pawrade.pages.dev/founder';
var CB32 = '234567ABCDEFGHJKLMNPQRSTUVWXYZ'; // no 0/1/8/9/I/O — unambiguous
function ccsum(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h; }
function genFounderCode(seed) { var body = ('PAW' + seed).toUpperCase().replace(/[^A-Z0-9]/g, ''); return body + CB32.charAt(ccsum(body) % 30); }
function validFounderCode(code) {
  var c = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (c.length < 5 || c.indexOf('PAW') !== 0) return false;
  return CB32.charAt(ccsum(c.slice(0, -1)) % 30) === c.charAt(c.length - 1);
}
function openFounder() {
  audio();
  $('founder-url').textContent = FOUNDER_URL;
  $('founder-body').classList.toggle('hidden', save.founder);
  $('founder-thanks').classList.toggle('hidden', !save.founder);
  $('founder-code').value = ''; $('founder-msg').textContent = '';
  showOv('founder-ov');
}
function redeemFounder() {
  if (save.founder) return;
  if (!validFounderCode($('founder-code').value)) { $('founder-msg').textContent = 'hmm — that code didn’t take. check for typos?'; $('founder-msg').style.color = '#e8b4c8'; mallet(196, 0, 0.1, 0.5); return; }
  save.founder = true; save.owned.goldcrown = true; if (save.pet) save.pet.worn = 'goldcrown';
  persist(); audio();
  unlockLegend('gilded');   // founders get the gilded corgi, day one
  mallet(SCALE_HZ[3], 0, 0.16, 0.5); mallet(SCALE_HZ[5], 0.12, 0.16, 0.6); mallet(SCALE_HZ[7], 0.26, 0.18, 0.9); mallet(SCALE_HZ[8], 0.42, 0.2, 1.1);
  $('founder-body').classList.add('hidden'); $('founder-thanks').classList.remove('hidden');
  $('founder-msg').textContent = ''; buildWardrobeList && (wardrobeOpen && buildWardrobeList());
}
function setWhisper(t) { var el = $('whisper'); el.style.opacity = 0; setTimeout(function () { el.textContent = t; el.style.opacity = 1; }, 250); }
function toast(msg) { var t = $('toast'); t.textContent = msg; t.style.opacity = 1; setTimeout(function () { t.style.opacity = 0; }, 1900); }

// ============ EFFECTS ============
function sparkAt(x, y, n, color) { for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, s = 1 + Math.random() * 2.8; sparkles.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 1, color: color, size: 2.2 + Math.random() * 2.6 }); } }
function textPop(x, y, text, color) { callouts.push({ text: text, x: x, y: y, ttl: 1.3, age: 0, size: 38, score: true, color: color }); }
function callout(text, color) {
  // queue center callouts so they never overlap into mush (one at a time)
  var delay = Math.max(0, (calloutBusyUntil - performance.now()) / 1000);
  callouts.push({ text: text, x: W / 2, y: 214, ttl: 1.6, age: -delay, size: 30, color: color, center: true });
  calloutBusyUntil = performance.now() + (delay + 1.15) * 1000;
}

// ============ RENDER ============
function twoLightSky(now, moonX, moonY) {
  var g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#241b3e'); g.addColorStop(0.55, '#33244e'); g.addColorStop(1, '#452e58');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (var i = 0; i < 14; i++) {
    var sx = (hashStr('s' + i) % 720), sy = (hashStr('t' + i) % 360);
    var tw = 0.35 + 0.6 * Math.abs(Math.sin(now / 1400 + i * 1.7));
    ctx.fillStyle = 'rgba(255,233,196,' + tw + ')';
    ctx.fillRect(sx, sy, 2.4, 2.4);
  }
  // the moon is real (tonight's phase) — proper crescent via an offset shadow disc, not a bean
  var ph = moonPhase();
  ctx.fillStyle = 'rgba(255,233,184,.12)'; ctx.beginPath(); ctx.arc(moonX, moonY, 74, 0, 7); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(moonX, moonY, 34, 0, 7); ctx.clip();
  ctx.fillStyle = '#fdf0cf'; ctx.fillRect(moonX - 36, moonY - 36, 72, 72);
  ctx.fillStyle = 'rgba(232,213,168,.5)'; ctx.beginPath(); ctx.arc(moonX + 6, moonY + 8, 4.5, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(moonX - 8, moonY - 4, 3, 0, 7); ctx.fill();
  var lit = (1 - Math.cos(ph * 6.283)) / 2, off = lit * 70, waxing = ph < 0.5;
  ctx.fillStyle = '#2a2044'; ctx.beginPath(); ctx.arc(moonX + (waxing ? -off : off), moonY, 34, 0, 7); ctx.fill();
  ctx.restore();
}
var fireflies = [{ p: 0.1, s: 13 }, { p: 0.45, s: 17 }, { p: 0.8, s: 11 }];
function drawFireflies(now) {
  for (var i = 0; i < fireflies.length; i++) {
    var f = fireflies[i];
    var fx = W * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(now / (f.s * 1000) + f.p * 6.28)));
    var fy = H * (0.3 + 0.12 * Math.sin(now / (f.s * 700) + f.p * 9));
    var glow = 0.5 + 0.5 * Math.sin(now / 900 + i * 2.2);
    ctx.fillStyle = 'rgba(255,233,168,' + (0.35 + glow * 0.5) + ')';
    ctx.beginPath(); ctx.arc(fx, fy, 3 + glow * 1.5, 0, 7); ctx.fill();
  }
}
// ============ THE HOME (multi-room builder) ============
// each prop draws one of 3 styles around an (x,y) floor-anchor
var PROPS = {
  rug: function (c, x, y, s, now) {
    var col = [['#8a4a5a', '#a85f70'], ['#3f6a86', '#5f8aa8'], ['#6a5a38', '#a0895a']][s];
    c.fillStyle = col[0]; c.beginPath(); c.ellipse(x, y, 122, 27, 0, 0, 7); c.fill();
    c.strokeStyle = col[1]; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, 100, 21, 0, 0, 7); c.stroke();
    if (s === 2) { c.beginPath(); c.ellipse(x, y, 68, 13, 0, 0, 7); c.stroke(); }
  },
  plant: function (c, x, y, s, now) {
    c.fillStyle = '#6a4a32'; c.beginPath(); c.moveTo(x - 18, y - 6); c.lineTo(x + 18, y - 6); c.lineTo(x + 14, y + 20); c.lineTo(x - 14, y + 20); c.fill();
    var sway = Math.sin(now / 900) * 0.06;
    if (s === 0) { c.strokeStyle = '#4a7a4e'; c.lineWidth = 4; c.lineCap = 'round'; for (var i = 0; i < 5; i++) { var a = -2 + i * 0.34 + sway; c.beginPath(); c.moveTo(x, y - 6); c.quadraticCurveTo(x + Math.cos(a) * 30, y - 6 + Math.sin(a) * 38, x + Math.cos(a) * 48, y - 6 + Math.sin(a) * 30); c.stroke(); } }
    else if (s === 1) { c.fillStyle = '#5a8a5e'; c.beginPath(); c.ellipse(x, y - 30, 15, 26, 0, 0, 7); c.fill(); c.fillStyle = '#e8879e'; c.beginPath(); c.arc(x, y - 52, 6, 0, 7); c.fill(); }
    else { var fc = ['#e8879e', '#ffd9a0', '#a8d8ff']; c.strokeStyle = '#4a7a4e'; c.lineWidth = 3; for (var j = 0; j < 3; j++) { c.beginPath(); c.moveTo(x - 10 + j * 10, y - 6); c.lineTo(x - 10 + j * 10, y - 40); c.stroke(); c.fillStyle = fc[j]; c.beginPath(); c.arc(x - 10 + j * 10, y - 44 + Math.sin(now / 700 + j) * 2, 7, 0, 7); c.fill(); } }
  },
  lamp: function (c, x, y, s, now) {
    var glow = [['255,210,130'], ['255,150,120'], ['168,216,255']][s][0], fl = 0.78 + 0.22 * Math.sin(now / 300 + x);
    var g = c.createRadialGradient(x, y - 118, 6, x, y - 118, 90); g.addColorStop(0, 'rgba(' + glow + ',' + 0.5 * fl + ')'); g.addColorStop(1, 'rgba(' + glow + ',0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y - 110, 90, 0, 7); c.fill();
    c.fillStyle = '#4a3260'; c.fillRect(x - 4, y - 120, 8, 120);
    c.fillStyle = 'rgba(' + glow + ',.9)'; c.beginPath(); c.moveTo(x - 24, y - 120); c.lineTo(x + 24, y - 120); c.lineTo(x + 16, y - 152); c.lineTo(x - 16, y - 152); c.fill();
  },
  bed: function (c, x, y, s, now) {
    var col = [['#5e7a9a', '#7a96b6'], ['#8a5a6a', '#a87686'], ['#5a7a5e', '#76a67e']][s];
    c.fillStyle = 'rgba(13,8,21,.35)'; c.beginPath(); c.ellipse(x, y + 8, 66, 15, 0, 0, 7); c.fill();
    c.fillStyle = col[0]; c.beginPath(); c.ellipse(x, y, 62, 26, 0, 0, 7); c.fill();
    c.fillStyle = col[1]; c.beginPath(); c.ellipse(x, y - 4, 44, 16, 0, 0, 7); c.fill();
  },
  picture: function (c, x, y, s, now) {   // wall art — y is the frame center on the wall
    c.fillStyle = '#3a2c22'; roundRect2(c, x - 42, y - 34, 84, 68, 6); c.fill();
    c.fillStyle = '#241a38'; c.fillRect(x - 35, y - 27, 70, 54);
    if (s === 0) { var mg = c.createRadialGradient(x, y, 2, x, y, 26); mg.addColorStop(0, '#fdf0cf'); mg.addColorStop(1, '#241a38'); c.fillStyle = mg; c.beginPath(); c.arc(x + 8, y - 4, 14, 0, 7); c.fill(); }
    else if (s === 1) { c.fillStyle = '#ffca7a'; c.beginPath(); c.arc(x, y + 4, 9, 0, 7); c.fill(); for (var i = 0; i < 4; i++) { var a = i * 1.57; c.beginPath(); c.arc(x + Math.cos(a) * 12, y + 4 + Math.sin(a) * 12, 6, 0, 7); c.fill(); } }
    else { c.fillStyle = '#5a7a9a'; c.fillRect(x - 35, y + 6, 70, 21); c.fillStyle = '#6a5a80'; c.beginPath(); c.moveTo(x - 35, y + 6); c.lineTo(x - 10, y - 14); c.lineTo(x + 12, y + 6); c.fill(); }
  },
  bush: function (c, x, y, s, now) {
    var sway = Math.sin(now / 1100 + x) * 3;
    if (s === 0) { c.fillStyle = '#3a6a44'; c.beginPath(); c.arc(x - 18, y, 24, 0, 7); c.arc(x + 18, y, 24, 0, 7); c.arc(x, y - 16, 28, 0, 7); c.fill(); }
    else if (s === 1) { c.fillStyle = '#3a6a44'; c.beginPath(); c.arc(x, y - 6, 30, 0, 7); c.fill(); var fc = ['#e8879e', '#ffd9a0', '#f6efe6']; for (var i = 0; i < 7; i++) { c.fillStyle = fc[i % 3]; c.beginPath(); c.arc(x - 24 + (i * 8) + sway, y - 20 + Math.sin(i) * 12, 5, 0, 7); c.fill(); } }
    else { c.fillStyle = '#3a6a44'; c.beginPath(); c.arc(x, y - 8, 20, 0, 7); c.fill(); c.beginPath(); c.arc(x, y - 40, 15, 0, 7); c.fill(); c.fillStyle = '#2f5638'; c.fillRect(x - 4, y - 30, 8, 20); }
  },
  pond: function (c, x, y, s, now) {
    c.fillStyle = '#2f4a6a'; c.beginPath(); c.ellipse(x, y, 70, 26, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(168,216,255,.3)'; c.beginPath(); c.ellipse(x, y - 3, 58, 18, 0, 0, 7); c.fill();
    var r = 12 + (now / 60 % 40);
    c.strokeStyle = 'rgba(200,230,255,' + Math.max(0, 0.4 - r / 100) + ')'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y, r, r * 0.36, 0, 0, 7); c.stroke();
    if (s === 0) { c.fillStyle = '#4a8a5e'; c.beginPath(); c.ellipse(x - 18, y, 16, 6, 0, 0, 7); c.fill(); c.fillStyle = '#e8879e'; c.beginPath(); c.arc(x - 18, y - 2, 5, 0, 7); c.fill(); }
    else if (s === 1) { c.fillStyle = '#e0782c'; c.beginPath(); c.ellipse(x + 10 + Math.sin(now / 800) * 14, y, 10, 5, 0, 0, 7); c.fill(); }
    else { c.strokeStyle = '#a8d8ff'; c.lineWidth = 3; for (var i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x + (i - 1) * 8, y - 30 - Math.abs(Math.sin(now / 300 + i)) * 8); c.stroke(); } }
  }
};
// ROOMS: den is 0 (existing scene, no slots). the rest are furnishable.
var ROOMS = [
  { id: 'den', name: 'the den', unlock: 0 },
  { id: 'garden', name: 'the garden', unlock: 150, ground: '#2a4030', slots: [
    { id: 'bushL', prop: 'bush', name: 'the hedge', cost: 40, x: 170, y: 800, styleNames: ['tidy hedge', 'flowering', 'topiary'] },
    { id: 'bushR', prop: 'bush', name: 'the far shrub', cost: 40, x: 560, y: 780, styleNames: ['tidy hedge', 'flowering', 'topiary'] },
    { id: 'pond', prop: 'pond', name: 'the pond', cost: 90, x: 360, y: 910, styleNames: ['lily pad', 'a koi', 'fountain'] },
    { id: 'planter', prop: 'plant', name: 'the planter', cost: 50, x: 630, y: 900, styleNames: ['fern', 'cactus', 'wildflowers'] }
  ] },
  { id: 'bedroom', name: 'the bedroom', unlock: 300, ground: '#3a2c26', slots: [
    { id: 'bedL', prop: 'bed', name: 'the big bed', cost: 60, x: 220, y: 880, styleNames: ['blue', 'rose', 'sage'] },
    { id: 'bedR', prop: 'bed', name: 'the little bed', cost: 50, x: 500, y: 900, styleNames: ['blue', 'rose', 'sage'] },
    { id: 'lamp', prop: 'lamp', name: 'the lamp', cost: 70, x: 640, y: 880, styleNames: ['warm', 'sunset', 'moonlight'] },
    { id: 'art', prop: 'picture', name: 'the wall art', cost: 60, x: 360, y: 420, styleNames: ['the moon', 'a paw', 'the hills'] }
  ] },
  { id: 'nook', name: 'the reading nook', unlock: 450, ground: '#332a44', slots: [
    { id: 'rug', prop: 'rug', name: 'the rug', cost: 40, x: 360, y: 920, styleNames: ['ruby', 'ocean', 'sand'] },
    { id: 'lamp', prop: 'lamp', name: 'the reading lamp', cost: 70, x: 600, y: 800, styleNames: ['warm', 'sunset', 'moonlight'] },
    { id: 'art', prop: 'picture', name: 'the print', cost: 60, x: 210, y: 420, styleNames: ['the moon', 'a paw', 'the hills'] },
    { id: 'plant', prop: 'plant', name: 'the corner plant', cost: 50, x: 630, y: 910, styleNames: ['fern', 'cactus', 'wildflowers'] }
  ] }
];
var curRoom = 0;
function roomFilled(idx) { var r = ROOMS[idx], h = save.home[r.id] || {}, n = 0; for (var i = 0; i < r.slots.length; i++) if (h[r.slots[i].id] !== undefined) n++; return n; }
function propAnchorIsWall(prop) { return prop === 'picture'; }
function renderDen(now) {           // the HOME dispatcher (screenMode stays 'den')
  if (curRoom === 0) renderDenRoom(now);
  else renderRoom(now, curRoom);
  drawRoomNav(now);
}
function drawRoomNav(now) {
  ctx.textAlign = 'center'; ctx.font = '40px "Segoe UI", sans-serif'; ctx.textBaseline = 'middle';
  if (curRoom > 0) { ctx.fillStyle = 'rgba(217,201,234,.85)'; ctx.fillText('‹', 40, H / 2); }
  if (curRoom < ROOMS.length - 1) { ctx.fillStyle = 'rgba(217,201,234,.85)'; ctx.fillText('›', W - 40, H / 2); }
  ctx.textBaseline = 'alphabetic';
  // room dots
  var dotY = 150, tot = ROOMS.length, x0 = W / 2 - (tot - 1) * 11;
  for (var i = 0; i < tot; i++) { ctx.beginPath(); ctx.arc(x0 + i * 22, dotY, i === curRoom ? 6 : 4, 0, 7); ctx.fillStyle = i === curRoom ? '#ffd9a0' : (save.rooms[ROOMS[i].id] ? 'rgba(217,201,234,.5)' : 'rgba(120,108,140,.45)'); ctx.fill(); }
}
var NAV_L = { x: 8, y: H / 2 - 44, w: 74, h: 88 }, NAV_R = { x: W - 82, y: H / 2 - 44, w: 74, h: 88 };
function roomGrads(idx) { // which graduate breeds live in this room (spread across the house)
  var all = [], b; for (b in save.graduates) for (var k = 0; k < save.graduates[b]; k++) all.push(b);
  var out = []; for (var i = idx; i < all.length; i += (ROOMS.length - 1)) out.push(all[i]); return out.slice(0, 2);
}
function renderRoom(now, idx) {
  var room = ROOMS[idx], unlocked = !!save.rooms[room.id];
  // background per room
  if (room.id === 'garden') {
    twoLightSky(now, W - 140, 130);
    ctx.fillStyle = '#24401f'; ctx.beginPath(); ctx.moveTo(0, 620); ctx.quadraticCurveTo(360, 580, 720, 620); ctx.lineTo(720, H); ctx.lineTo(0, H); ctx.fill();
    ctx.fillStyle = '#1c3018'; ctx.beginPath(); ctx.moveTo(0, 720); ctx.quadraticCurveTo(360, 690, 720, 720); ctx.lineTo(720, H); ctx.lineTo(0, H); ctx.fill();
    ctx.strokeStyle = '#3a2c22'; ctx.lineWidth = 8; for (var fx = 40; fx < 720; fx += 60) { ctx.beginPath(); ctx.moveTo(fx, 560); ctx.lineTo(fx, 640); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(0, 590); ctx.lineTo(720, 590); ctx.stroke();
    drawFireflies(now);
  } else if (room.id === 'bedroom') {
    var wg = ctx.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#3a2e42'); wg.addColorStop(1, '#4a3a44'); ctx.fillStyle = wg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#2a2038'; ctx.beginPath(); ctx.arc(W - 130, 150, 44, 0, 7); ctx.fill();  // window w/ moon
    ctx.strokeStyle = '#5a4a5e'; ctx.lineWidth = 6; ctx.strokeRect(W - 190, 90, 120, 120); ctx.beginPath(); ctx.moveTo(W - 130, 90); ctx.lineTo(W - 130, 210); ctx.moveTo(W - 190, 150); ctx.lineTo(W - 70, 150); ctx.stroke();
    ctx.fillStyle = '#4a3a30'; ctx.fillRect(0, 760, W, H - 760);
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 2; for (var by = 800; by < H; by += 46) { ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(W, by); ctx.stroke(); }
  } else { // nook
    var ng = ctx.createLinearGradient(0, 0, 0, H); ng.addColorStop(0, '#2e2440'); ng.addColorStop(1, '#3a2f4e'); ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3a2c22'; ctx.fillRect(60, 300, 150, 460);  // bookshelf
    var bcol = ['#8a5a6a', '#5e7a9a', '#6a5a3a', '#5a7a5e'];
    for (var sh = 0; sh < 4; sh++) for (var bk = 0; bk < 6; bk++) { ctx.fillStyle = bcol[(sh + bk) % 4]; ctx.fillRect(72 + bk * 22, 316 + sh * 112, 18, 96); }
    ctx.fillStyle = '#4a3a30'; ctx.fillRect(0, 760, W, H - 760);
  }
  // locked veil
  if (!unlocked) { ctx.fillStyle = 'rgba(12,8,20,.62)'; ctx.fillRect(0, 0, W, H); }
  // slots
  var home = save.home[room.id] || {};
  for (var si = 0; si < room.slots.length; si++) {
    var sl = room.slots[si], style = home[sl.id];
    if (!unlocked) continue;
    if (style !== undefined) { PROPS[sl.prop](ctx, sl.x, sl.y, style, now); }
    else { // empty-slot hint
      var pulse = 0.4 + 0.3 * Math.sin(now / 500 + si);
      ctx.strokeStyle = 'rgba(255,217,160,' + pulse + ')'; ctx.lineWidth = 2.5; ctx.setLineDash([8, 8]);
      var hy = propAnchorIsWall(sl.prop) ? sl.y - 34 : sl.y - 30;
      roundRect(sl.x - 44, hy, 88, propAnchorIsWall(sl.prop) ? 68 : 60, 14); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,217,160,' + pulse + ')'; ctx.font = "800 30px 'Baloo 2',sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('+', sl.x, propAnchorIsWall(sl.prop) ? sl.y : sl.y);
      ctx.font = "500 13px Fredoka,sans-serif"; ctx.fillStyle = 'rgba(217,201,234,.8)'; ctx.fillText('✦ ' + sl.cost, sl.x, (propAnchorIsWall(sl.prop) ? sl.y + 44 : sl.y + 42)); ctx.textBaseline = 'alphabetic';
    }
  }
  // graduated pets living here
  if (unlocked) { var gr = roomGrads(idx); for (var gi = 0; gi < gr.length; gi++) { var gx = 200 + gi * 300, gy = 700; ctx.fillStyle = 'rgba(13,8,21,.3)'; ctx.beginPath(); ctx.ellipse(gx, gy + 34, 46, 11, 0, 0, 7); ctx.fill(); drawPet(ctx, gr[gi], (save.rareGrads && save.rareGrads[gr[gi]]) || 0, gx, gy, 52, { breath: Math.sin(now / 1200 + gi) * 0.5, sleeping: room.id === 'bedroom', stage: 3 }); } }
  // header
  ctx.textAlign = 'left'; ctx.font = "800 34px 'Baloo 2', sans-serif"; ctx.fillStyle = '#ffd9a0'; ctx.fillText(room.name, 26, 52);
  ctx.font = "500 20px Fredoka, sans-serif"; ctx.fillStyle = '#b9a9c9';
  if (unlocked) ctx.fillText(roomFilled(idx) + ' / ' + room.slots.length + ' furnished  ·  ✦ ' + save.dreamlight, 26, 84);
  else ctx.fillText('locked  ·  ✦ ' + save.dreamlight, 26, 84);
  // locked prompt
  if (!unlocked) {
    ctx.textAlign = 'center';
    ctx.font = "800 30px 'Baloo 2',sans-serif"; ctx.fillStyle = '#ffd9a0'; ctx.fillText('🔒 ' + room.name, W / 2, H / 2 - 30);
    var can = save.dreamlight >= room.unlock;
    roundRect(W / 2 - 130, H / 2 + 4, 260, 60, 16); ctx.fillStyle = can ? '#ffca7a' : '#3a2b50'; ctx.fill();
    ctx.fillStyle = can ? '#4a2c08' : '#8f7bb0'; ctx.font = "800 20px 'Baloo 2',sans-serif"; ctx.fillText('open this room · ✦ ' + room.unlock, W / 2, H / 2 + 42);
    ctx.font = "500 22px Caveat,cursive"; ctx.fillStyle = '#b9a9c9'; ctx.fillText(can ? 'a whole new room to make yours.' : 'earn a little more ✦ first.', W / 2, H / 2 + 96);
  }
}
var ROOM_UNLOCK_R = { x: W / 2 - 130, y: H / 2 + 4, w: 260, h: 60 };
// ---- slot chooser + economy ----
var slotCtx = { room: 1, slot: 0 };
function tryUnlockRoom(idx) {
  var room = ROOMS[idx];
  if (save.dreamlight < room.unlock) { setWhisper('you need ✦' + room.unlock + ' to open ' + room.name + '. keep clearing nights.'); mallet(196, 0, 0.1, 0.5); return; }
  save.dreamlight -= room.unlock; save.rooms[room.id] = true; persist(); audio();
  mallet(SCALE_HZ[2], 0, 0.16, 0.5); mallet(SCALE_HZ[4], 0.12, 0.16, 0.6); mallet(SCALE_HZ[6], 0.26, 0.18, 0.9);
  setWhisper(room.name + ' is yours now. go make it cozy.'); setUI();
}
function openSlot(roomIdx, slotIdx) {
  audio(); slotCtx = { room: roomIdx, slot: slotIdx };
  var room = ROOMS[roomIdx], sl = room.slots[slotIdx];
  var home = save.home[room.id] || {}, owned = home[sl.id] !== undefined;
  $('slot-title').textContent = sl.name;
  $('slot-cost').textContent = owned ? 'change the style — free' : ('✦ ' + sl.cost + '  ·  ' + (save.dreamlight >= sl.cost ? 'pick a style' : 'not enough ✦ yet'));
  var wall = propAnchorIsWall(sl.prop);
  for (var i = 0; i < 3; i++) {
    var pc = slotPreview[i], cx = pc.ctx; cx.clearRect(0, 0, 100, 100);
    cx.fillStyle = 'rgba(58,43,80,.5)'; roundRect2(cx, 6, 6, 88, 88, 12); cx.fill();
    cx.save(); cx.translate(50, wall ? 44 : 74); cx.scale(wall ? 0.72 : 0.46, wall ? 0.72 : 0.46); PROPS[sl.prop](cx, 0, 0, i, performance.now()); cx.restore();
    cx.fillStyle = '#d9c9ea'; cx.font = "600 11px Fredoka,sans-serif"; cx.textAlign = 'center'; cx.fillText(sl.styleNames[i], 50, 94);
    pc.cv.className = 'slot-choice' + (owned && home[sl.id] === i ? ' on' : '');
  }
  showOv('slot-ov');
}
function chooseStyle(i) {
  var room = ROOMS[slotCtx.room], sl = room.slots[slotCtx.slot];
  save.home[room.id] = save.home[room.id] || {};
  var owned = save.home[room.id][sl.id] !== undefined;
  if (!owned) {
    if (save.dreamlight < sl.cost) { setWhisper('need ✦' + sl.cost + ' for ' + sl.name + '.'); mallet(196, 0, 0.1, 0.5); return; }
    save.dreamlight -= sl.cost;
  }
  save.home[room.id][sl.id] = i; persist(); audio();
  mallet(SCALE_HZ[3], 0, 0.14, 0.4); mallet(SCALE_HZ[5], 0.1, 0.14, 0.5); mallet(SCALE_HZ[7], 0.2, 0.14, 0.6);
  hideOv('slot-ov'); setWhisper(sl.styleNames[i] + ' ' + sl.name + ' — like it was always there.'); setUI();
}
// ---- furniture, drawn relative to a floor anchor so one scale transform sizes them by depth ----
function drawHearthAt(c, x, y, sc, now) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = '#5a4636'; c.fillRect(-46, -140, 92, 140);
  c.fillStyle = '#3a2c22'; c.fillRect(-32, -70, 64, 70);
  var hf = 0.7 + 0.3 * Math.sin(now / 120) * Math.sin(now / 70);
  var hg = c.createRadialGradient(0, -26, 4, 0, -30, 56); hg.addColorStop(0, 'rgba(255,180,90,' + hf + ')'); hg.addColorStop(1, 'rgba(255,120,50,0)');
  c.fillStyle = hg; c.beginPath(); c.arc(0, -30, 56, 0, 7); c.fill();
  c.fillStyle = '#ff9e4e'; c.beginPath(); c.moveTo(-8, -6); c.quadraticCurveTo(-12, -35, 0, -50); c.quadraticCurveTo(12, -35, 8, -6); c.fill();
  c.restore();
}
function drawLampAt(c, x, y, sc, now) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = '#4a3260'; c.fillRect(-4, -130, 8, 130);
  var lf = 0.8 + 0.2 * Math.sin(now / 300);
  var lg2 = c.createRadialGradient(0, -138, 6, 0, -138, 78); lg2.addColorStop(0, 'rgba(255,210,130,' + 0.55 * lf + ')'); lg2.addColorStop(1, 'rgba(255,180,90,0)');
  c.fillStyle = lg2; c.beginPath(); c.arc(0, -138, 78, 0, 7); c.fill();
  c.fillStyle = '#ffca7a'; c.beginPath(); c.moveTo(-16, -130); c.lineTo(16, -130); c.lineTo(10, -152); c.lineTo(-10, -152); c.fill();
  c.restore();
}
function drawFernAt(c, x, y, sc) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  c.strokeStyle = '#4a7a4e'; c.lineWidth = 4; c.lineCap = 'round';
  for (var fp = 0; fp < 5; fp++) { var fa = -1.9 + fp * 0.32; c.beginPath(); c.moveTo(0, -16); c.quadraticCurveTo(Math.cos(fa) * 30, -16 + Math.sin(fa) * 36, Math.cos(fa) * 48, -16 + Math.sin(fa) * 30); c.stroke(); }
  c.fillStyle = '#6a4a32'; c.fillRect(-12, -18, 24, 18);
  c.restore();
}
function drawCushionAt(c, x, y, sc) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = '#5e7a9a'; c.beginPath(); c.ellipse(0, 0, 46, 20, 0, 0, 7); c.fill();
  c.strokeStyle = '#7a96b6'; c.lineWidth = 2; c.stroke();
  c.restore();
}
var DEN_FURN_PLOTS = { hearth: { d: 0.22, l: -0.72 }, lamp: { d: 0.28, l: 0.75 }, fern: { d: 0.5, l: -0.8 }, cushion: { d: 0.58, l: 0.62 } };
// ---- the floor + walls: a pseudo-3D room. flat sprites move & scale on this projected plane — no WebGL needed ----
function drawDenFloor(now) {
  var backL = W / 2 - DEN_FLOOR_TOPHW, backR = W / 2 + DEN_FLOOR_TOPHW, frontL = W / 2 - DEN_FLOOR_BOTHW, frontR = W / 2 + DEN_FLOOR_BOTHW;
  var wg = ctx.createLinearGradient(0, 180, 0, DEN_FLOOR_TOPY); wg.addColorStop(0, '#2c2044'); wg.addColorStop(1, '#241a38');
  ctx.fillStyle = wg; ctx.fillRect(0, 180, W, DEN_FLOOR_TOPY - 180 + 4);
  ctx.fillStyle = '#20172c';
  ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(backL, DEN_FLOOR_TOPY); ctx.lineTo(0, DEN_FLOOR_TOPY); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W, 180); ctx.lineTo(backR, DEN_FLOOR_TOPY); ctx.lineTo(W, DEN_FLOOR_TOPY); ctx.fill();
  var flick = 0.85 + 0.15 * Math.sin(now / 340) * Math.sin(now / 190);
  ctx.fillStyle = '#4a3260'; ctx.fillRect(106, 232, 9, 98);
  ctx.fillStyle = '#ffca7a'; ctx.globalAlpha = flick; ctx.fillRect(97, 200, 28, 34); ctx.globalAlpha = 1;
  ctx.fillStyle = '#4a3260'; ctx.fillRect(94, 194, 34, 8);
  var fg = ctx.createLinearGradient(0, DEN_FLOOR_TOPY, 0, DEN_FLOOR_BOTY); fg.addColorStop(0, '#382a4a'); fg.addColorStop(1, '#2a1f3c');
  ctx.fillStyle = fg;
  ctx.beginPath(); ctx.moveTo(backL, DEN_FLOOR_TOPY); ctx.lineTo(backR, DEN_FLOOR_TOPY); ctx.lineTo(frontR, DEN_FLOOR_BOTY); ctx.lineTo(frontL, DEN_FLOOR_BOTY); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 2;
  for (var sl = -3; sl <= 3; sl++) { var lp0 = denProject(0, sl / 3.4), lp1 = denProject(1, sl / 3.4); ctx.beginPath(); ctx.moveTo(lp0.x, lp0.y); ctx.lineTo(lp1.x, lp1.y); ctx.stroke(); }
  var lg = ctx.createRadialGradient(W / 2, DEN_FLOOR_BOTY - 60, 30, W / 2, DEN_FLOOR_BOTY - 60, 480);
  lg.addColorStop(0, 'rgba(255,202,122,' + 0.26 * flick + ')'); lg.addColorStop(1, 'rgba(255,158,94,0)');
  ctx.fillStyle = lg; ctx.fillRect(0, DEN_FLOOR_TOPY, W, H - DEN_FLOOR_TOPY);
  drawFireflies(now);
  for (var dm = 0; dm < 8; dm++) {
    var mx = 60 + (dm * 91) % 600 + Math.sin(now / 2100 + dm * 1.3) * 22;
    var my = DEN_FLOOR_BOTY - 140 - ((now / 32 + dm * 96) % 520);
    var ma = 0.10 + 0.09 * Math.sin(now / 850 + dm * 2.1);
    ctx.fillStyle = 'rgba(255,228,176,' + Math.max(0, ma) + ')'; ctx.beginPath(); ctx.arc(mx, my, 1.5, 0, 7); ctx.fill();
  }
  var rugP = denProject(0.86, 0);
  ctx.fillStyle = '#8a4a5a'; ctx.beginPath(); ctx.ellipse(rugP.x, rugP.y, 150 * rugP.scale, 26 * rugP.scale, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#a85f70'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(rugP.x, rugP.y, 128 * rugP.scale, 20 * rugP.scale, 0, 0, 7); ctx.stroke();
}
function renderDenRoom(now) {
  twoLightSky(now, W - 150, 130);
  if (save.founder) { // a soft golden aurora — the founder's den glows
    var au = ctx.createLinearGradient(0, 70, W, 200); au.addColorStop(0, 'rgba(255,210,74,0)'); au.addColorStop(0.5, 'rgba(255,210,74,' + (0.07 + 0.05 * Math.sin(now / 1300)) + ')'); au.addColorStop(1, 'rgba(232,135,158,0)');
    ctx.fillStyle = au; ctx.fillRect(0, 55, W, 170);
  }
  drawDenFloor(now);
  // ---- everyone on the floor, DEPTH-SORTED so back draws behind front (the core 2.5D trick) ----
  var jobs = [];
  var furnKeys = { hearth: drawHearthAt, lamp: drawLampAt, fern: drawFernAt, cushion: drawCushionAt };
  for (var fk in furnKeys) if (save.furniture[fk]) { var fp2 = DEN_FURN_PLOTS[fk], fpr = denProject(fp2.d, fp2.l); (function (fn, x, y, sc) { jobs.push({ depth: fp2.d, draw: function () { fn(ctx, x, y, sc, now); } }); })(furnKeys[fk], fpr.x, fpr.y, fpr.scale); }
  if (save.pet) {
    if (!petWander) petWander = wanderInit(0.66, 0);
    wanderTick(petWander, now, 1200, PET_WP);
    var pp = denProject(petWander.d, petWander.l);
    (function (px, py, psc) {
      jobs.push({ depth: petWander.d, draw: function () {
        var s = denSouls.pet; s.tick(now);
        var mood = petMood(), happy = mood > 68;
        var sleeping = isNight() && (now - petPopT > 6000) && mood < 55 && !petWander.moving;
        var dx = Math.max(-1, Math.min(1, (pointerPos.x - px) / 300)), dy = Math.max(-1, Math.min(1, (pointerPos.y - py) / 300));
        if (!petIdleNext) petIdleNext = now + 2200;
        if (now > petIdleNext && now - petPopT > 1600 && !sleeping && !petWander.moving) {
          var acts = happy ? ['hop', 'wag', 'look', 'wag', 'hop'] : ['look', 'wag', 'yawn'];
          petIdle = { kind: acts[(Math.random() * acts.length) | 0], t: now };
          petIdleNext = now + (happy ? 3000 : 5200) + Math.random() * 3200;
        }
        var iDy = 0, iTilt = 0, iPup = null, iSleep = false;
        if (petWander.moving) { iDy = -Math.abs(Math.sin(now / 130)) * 6 * psc; iTilt = Math.sin(petWander.l * 6 + now / 90) * 0.05; }
        else if (petIdle) { var ip = now - petIdle.t;
          if (petIdle.kind === 'hop' && ip < 520) iDy = -Math.abs(Math.sin(ip / 520 * Math.PI)) * 20;
          else if (petIdle.kind === 'wag' && ip < 780) iTilt = Math.sin(ip / 55) * 0.09 * (1 - ip / 780);
          else if (petIdle.kind === 'look' && ip < 1000) iPup = { x: Math.sin(ip / 230) * 0.9, y: 0.1 };
          else if (petIdle.kind === 'yawn' && ip < 850) iSleep = true;
          if (ip > 1100) petIdle = null;
        }
        var r = 124 * psc;
        if (happy && !sleeping) { var mi = (mood - 68) / 32, mg = ctx.createRadialGradient(px, py - r * 0.3, 20 * psc, px, py - r * 0.3, 190 * psc); mg.addColorStop(0, 'rgba(255,222,150,' + (0.08 + 0.12 * mi) + ')'); mg.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(px, py - r * 0.3, 190 * psc, 0, 7); ctx.fill(); }
        if (happy && Math.floor(now / 700) % 4 === 0 && Math.random() < 0.3) sparkles.push({ x: px - 60 + Math.random() * 160, y: py - r * 0.7 + Math.random() * 80, vx: 0, vy: -0.4, life: 1, color: '#ffe9a8', size: 1.6 });
        ctx.fillStyle = 'rgba(13,8,21,.4)'; ctx.beginPath(); ctx.ellipse(px, py + r * 0.16 - iDy * 0.3, (r * 0.75) - iDy * 0.3, r * 0.16, 0, 0, 7); ctx.fill();
        var pop2 = 1; if (now - petPopT < 420) { var pa = (now - petPopT) / 420; pop2 = 1 + 0.13 * Math.sin(pa * Math.PI); }
        var bday = isBirthday();
        var py2 = py - r * 0.6 + iDy;
        ctx.save(); ctx.translate(px, py2); ctx.scale(pop2, pop2); ctx.translate(-px, -py2);
        drawPet(ctx, save.pet.species, save.pet.coat, px, py2, r, {
          breath: s.breath(now), blinkL: s.blinking(now), blinkR: s.blinking(now), tilt: iTilt,
          pupil: iPup || { x: dx, y: dy }, sleeping: (sleeping || iSleep) && !bday, worn: bday ? 'party' : save.pet.worn
        });
        ctx.restore();
        petScreenPos = { x: px, y: py2, r: r };
        if (petBall) {
          petBall.vy += 22 * dtSec; petBall.x += petBall.vx * dtSec * 60; petBall.y += petBall.vy * dtSec * 60;
          if (petBall.y > py + r * 0.1) { petBall.y = py + r * 0.1; petBall.vy *= -0.62; petBall.vx *= 0.82; }
          if ((now - petBall.t) > 2600 || (Math.abs(petBall.vx) < 0.4 && petBall.y >= py + r * 0.08)) petBall = null;
          else { ctx.fillStyle = '#7fb8e8'; ctx.beginPath(); ctx.arc(petBall.x, petBall.y, 12 * psc, 0, 7); ctx.fill(); ctx.strokeStyle = '#5a94c4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(petBall.x, petBall.y, 8.5 * psc, 0.4, 2.6); ctx.stroke(); }
        }
        if (petReactKind && now - petReactT < 1100) { var rp = (now - petReactT) / 1100, emo = petReactKind === 'feed' ? '🍖' : petReactKind === 'play' ? '🎾' : petReactKind === 'gift' ? '🎁' : '💛'; ctx.globalAlpha = 1 - rp; ctx.font = (30 - rp * 8) + 'px "Segoe UI"'; ctx.textAlign = 'center'; ctx.fillText(emo, px + 48, py2 - 40 - rp * 60); ctx.globalAlpha = 1; }
        if (bday) {
          ctx.save(); ctx.translate(px + r * 1.2, py2 - r * 0.2); ctx.scale(psc, psc);
          ctx.fillStyle = '#e8b4c8'; roundRect(-36, 0, 72, 44, 8); ctx.fill();
          ctx.fillStyle = '#f6efe6'; ctx.fillRect(-36, 0, 72, 10);
          ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -16); ctx.stroke();
          var flk = 0.6 + 0.4 * Math.sin(now / 90); ctx.fillStyle = 'rgba(255,180,90,' + flk + ')'; ctx.beginPath(); ctx.arc(0, -20, 5, 0, 7); ctx.fill();
          ctx.restore();
          for (var cf = 0; cf < 5; cf++) { var ccy = (now / 3 + cf * 120) % 300; ctx.fillStyle = ['#e8879e', '#ffd9a0', '#a8d8ff'][cf % 3]; ctx.fillRect(180 + cf * 90, 420 + ccy, 6, 6); }
        }
        ctx.font = "700 " + Math.round(28 * Math.max(psc, 0.82)) + "px 'Baloo 2', sans-serif"; ctx.textAlign = 'center';
        ctx.fillStyle = '#ffd9a0';
        var nameY = py2 - r * 1.74;   // clears the pet's ears + breath so the label always floats in clear sky above the head
        ctx.fillText(save.pet.name + (bday ? ' 🎂' : (sleeping ? ' 💤' : '')), px, nameY);
        if (bday) { ctx.font = "500 20px Caveat, cursive"; ctx.fillStyle = '#e8b4c8'; ctx.fillText('happy gotcha day, ' + save.pet.name + '!', px, nameY + 26); }
        else { var moodWord = mood >= 85 ? 'over the moon' : mood >= 68 ? 'happy as can be' : mood >= 52 ? 'cozy' : 'ready for a cuddle';
          ctx.font = "500 16px Fredoka, sans-serif"; ctx.fillStyle = '#b9a9c9';
          ctx.fillText(moodWord + (save.pet.bond > 0 ? '   ·   💛 ' + save.pet.bond : ''), px, nameY + 26);
        }
      } });
    })(pp.x, pp.y, pp.scale);
  }
  // graduates roam the floor too — up to two, LEGENDS get pride of place
  var denPool = [], b, li2;
  for (li2 = 0; li2 < LEGENDS.length; li2++) if (save.legends[LEGENDS[li2].id]) denPool.push({ legend: LEGENDS[li2] });
  for (b in save.graduates) denPool.push({ breed: b, coat: save.rareGrads[b] || 0 });
  for (var gi = 0; gi < Math.min(2, denPool.length); gi++) {
    if (!gradWander[gi]) gradWander[gi] = wanderInit(gi === 0 ? 0.23 : 0.34, gi === 0 ? -0.7 : -0.42);
    wanderTick(gradWander[gi], now, 2000 + gi * 900, gi === 0 ? GRAD_L_WP : GRAD_R_WP);
    var gp = denProject(gradWander[gi].d, gradWander[gi].l), dp = denPool[gi], soulG = gi === 0 ? denSouls.g0 : denSouls.g1;
    (function (gx, gy, gsc, dp, soul, idx) {
      jobs.push({ depth: gradWander[idx].d, draw: function () {
        soul.tick(now);
        var gr = 48 * gsc;
        ctx.fillStyle = 'rgba(13,8,21,.4)'; ctx.beginPath(); ctx.ellipse(gx, gy + gr * 0.14, gr * 1.1, gr * 0.23, 0, 0, 7); ctx.fill();
        if (dp.legend) {
          var Lg = dp.legend;
          var lgl = ctx.createRadialGradient(gx, gy - gr * 0.5, 8 * gsc, gx, gy - gr * 0.5, 74 * gsc); lgl.addColorStop(0, 'rgba(255,224,150,.22)'); lgl.addColorStop(1, 'rgba(255,224,150,0)');
          ctx.fillStyle = lgl; ctx.beginPath(); ctx.arc(gx, gy - gr * 0.5, 74 * gsc, 0, 7); ctx.fill();
          drawPet(ctx, Lg.breed, 0, gx, gy - gr * 0.5, gr, { breath: soul.breath(now), sleeping: true, stage: 3, coatO: Lg.coatO, worn: Lg.worn });
        } else {
          drawPet(ctx, dp.breed, dp.coat, gx, gy - gr * 0.5, gr, { breath: soul.breath(now), sleeping: true, stage: 3 });
          if (dp.coat) { ctx.fillStyle = 'rgba(255,224,150,.8)'; ctx.font = (14 * gsc) + 'px "Segoe UI", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('✦', gx + gr * 0.8, gy - gr * 1.14); }
        }
      } });
    })(gp.x, gp.y, gp.scale, dp, soulG, gi);
  }
  if (save.rescues.length) {
    var featR = null, featI = 0, fri;
    for (fri = 0; fri < save.rescues.length; fri++) if (save.rescues[fri].trust < 100) { featR = save.rescues[fri]; featI = fri; break; }
    if (!featR) { featI = save.rescues.length - 1; featR = save.rescues[featI]; }
    curFeaturedRescue = featI;
    if (!rescueWander) rescueWander = wanderInit(0.29, 0.4);
    var rstage0 = rescueStage(featR.trust);
    if (rstage0 >= 2) wanderTick(rescueWander, now, 2600, RESCUE_WP); // shy stages stay put near their spot; confident ones wander
    var rp2 = denProject(rescueWander.d, rescueWander.l);
    (function (rx, ry, rsc) {
      jobs.push({ depth: rescueWander.d, draw: function () {
        var rstage = rescueStage(featR.trust), s2 = denSouls.r0; s2.tick(now);
        var rr = 70 * [0.6, 0.76, 0.9, 1][rstage] * rsc;
        ctx.fillStyle = '#57406e'; ctx.beginPath(); ctx.ellipse(rx, ry + rr * 0.12, rr * 1.12, rr * 0.24, 0, 0, 7); ctx.fill();
        if (rstage === 3) { var rgl = ctx.createRadialGradient(rx, ry - rr * 0.5, 10, rx, ry - rr * 0.5, 90 * rsc); rgl.addColorStop(0, 'rgba(255,222,150,.16)'); rgl.addColorStop(1, 'rgba(255,222,150,0)'); ctx.fillStyle = rgl; ctx.beginPath(); ctx.arc(rx, ry - rr * 0.5, 90 * rsc, 0, 7); ctx.fill(); }
        ctx.save(); ctx.globalAlpha = rstage < 3 ? (0.5 + rstage * 0.2) : 1;
        drawPet(ctx, featR.breed, featR.coat, rx, ry - rr * 0.5, rr, { breath: s2.breath(now), sleeping: rstage === 0, sad: rstage === 1, pupil: rstage <= 1 ? { x: 0.55, y: 0.15 } : { x: 0, y: 0 } });
        drawTraitMark(ctx, featR.trait, rx, ry - rr * 0.5, rr, rstage < 3);
        if (rstage === 0) { ctx.fillStyle = '#3a2c22'; ctx.fillRect(rx - rr * 0.63, ry - rr * 0.15, rr * 1.26, rr * 0.57); ctx.fillStyle = '#4a3a30'; ctx.fillRect(rx - rr * 0.63, ry - rr * 0.15, rr * 1.26, rr * 0.09); }
        ctx.restore();
        ctx.font = "600 " + Math.round(17 * Math.max(rsc, 0.85)) + "px 'Baloo 2', sans-serif"; ctx.fillStyle = '#b9a9c9'; ctx.textAlign = 'center';
        ctx.fillText(featR.name + ' — ' + RESCUE_STAGE_WORD[rstage], rx, ry - rr * 1.02 + rr * 0.9);
        rescueScreenPos = { x: rx, y: ry - rr * 0.5, r: rr };
      } });
    })(rp2.x, rp2.y, rp2.scale);
  } else { curFeaturedRescue = -1; }
  jobs.sort(function (a, b) { return a.depth - b.depth; });
  for (var ji = 0; ji < jobs.length; ji++) jobs[ji].draw();
  // care items in flight (the payoff is visible, always) — fly to wherever the pet currently stands
  for (var fi = flyers.length - 1; fi >= 0; fi--) {
    var fl = flyers[fi];
    fl.t += dtSec * 1.5;
    if (fl.t >= 1) { flyers.splice(fi, 1); continue; }
    var ft = fl.t, fx = fl.sx + (fl.tx - fl.sx) * ft, fy = fl.sy + (fl.ty - fl.sy) * ft - Math.sin(ft * Math.PI) * 150;
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.sin(ft * 9) * 0.3);
    if (fl.kind === 'feed') {
      ctx.fillStyle = '#b5713a'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 11, 0.5, 0, 7); ctx.fill();
      ctx.fillStyle = '#fdf3e0'; ctx.beginPath(); ctx.arc(-14, -11, 5, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(-8, -16, 5, 0, 7); ctx.fill();
    } else if (fl.kind === 'play') {
      ctx.fillStyle = '#7fb8e8'; ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill();
      ctx.strokeStyle = '#5a94c4'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 9, 0.4, 2.6); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 5, 3.5, 5.8); ctx.stroke();
    } else {
      ctx.fillStyle = '#e8879e'; ctx.fillRect(-12, -10, 24, 20);
      ctx.fillStyle = '#ffd9a0'; ctx.fillRect(-3, -10, 6, 20); ctx.fillRect(-12, -3, 24, 6);
    }
    ctx.restore();
  }
  ctx.textAlign = 'left';
  ctx.font = "800 34px 'Baloo 2', sans-serif"; ctx.fillStyle = '#ffd9a0';
  ctx.fillText('the den', 26, 52);
  ctx.font = "500 22px Fredoka, sans-serif"; ctx.fillStyle = '#b9a9c9';
  ctx.fillText('night ' + save.nightsPlayed + '  ·  🕯 ' + save.streak + '  ·  ✦ ' + save.dreamlight, 26, 84);
  var gradTotal = 0, k2; for (k2 in save.graduates) gradTotal += save.graduates[k2];
  var line3 = [];
  if (gradTotal) line3.push(gradTotal + ' graduates');
  if (save.rescues.length) line3.push(save.rescues.length + ' rescued');
  var homeSuffix = line3.length ? ' — all home.' : '';
  if (save.founder) line3.push('💛 founder');
  if (line3.length) { ctx.font = "500 17px Fredoka, sans-serif"; ctx.fillText(line3.join(' · ') + homeSuffix, 26, 110); }
}
function renderPlay(now) {
  ctx.save();
  if (shakeMag > 0.3) { ctx.translate((Math.random() - 0.5) * shakeMag, (Math.random() - 0.5) * shakeMag); shakeMag *= 0.84; } else shakeMag = 0;
  twoLightSky(now, W - 120, 108);
  var lg = ctx.createRadialGradient(80, H - 120, 30, 80, H - 120, 560);
  lg.addColorStop(0, 'rgba(255,202,122,.20)'); lg.addColorStop(1, 'rgba(255,158,94,0)');
  ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  // the way out — always visible (except mid-tutorial), never a trap
  if (!tut.active) { ctx.font = '28px "Segoe UI", sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(217,201,234,.85)'; ctx.fillText('‹', BACK_R.x + 14, BACK_R.y + 36); }
  ctx.textAlign = 'left';
  ctx.font = "800 30px 'Baloo 2', sans-serif"; ctx.fillStyle = '#ffd9a0';
  ctx.fillText('PAWRADE ' + (runMode === 'daily' ? '#' + dayNumber() : ''), 24, 50);
  ctx.font = "500 19px Fredoka, sans-serif"; ctx.fillStyle = '#b9a9c9';
  var remaining = deck.length - deckPos;
  var st = awakeStats();
  var featLabel = featBreed ? ((curRareCoat ? '✨ rare ' : '🌟 ') + STAGE_NAME[featBreed][2] + ' night') : '';
  ctx.fillText((runMode === 'daily' ? '🔥 ' + save.streak + '  ·  ' : '') + featLabel + '  ·  😴 ' + Math.round(st.frac * 100) + '%', 24, 78);
  ctx.textAlign = 'center';
  var sps = 1 + scorePulse * 0.13;
  ctx.save(); ctx.translate(W / 2, 168); ctx.scale(sps, sps);
  ctx.font = "800 54px 'Baloo 2', sans-serif";
  ctx.fillStyle = score >= botPar && botPar > 0 ? '#ffe08a' : '#fff';
  ctx.shadowColor = 'rgba(255,205,130,' + (0.35 + scorePulse * 0.55) + ')'; ctx.shadowBlur = 6 + scorePulse * 16; ctx.shadowOffsetY = 3;
  ctx.fillText(fmt(Math.round(scoreShown)), 0, 0);
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.restore();
  // the race: the bot's par, always visible — the number that makes the gamble mean something
  if (botPar > 0) {
    ctx.font = "600 18px Fredoka, sans-serif";
    var ahead = score >= botPar;
    ctx.fillStyle = ahead ? '#ffd9a0' : '#8fa4c8';
    ctx.fillText((ahead ? '🏆 ahead of the bot (' : '😴 the sleepy bot: ') + fmt(botPar) + (ahead ? ')' : ''), W / 2, 200);
    // the fill-the-bar: your run racing the bot, always visible, gold when you pass it
    var bw = 300, bx = (W - bw) / 2, by = 210, frac = Math.min(1, scoreShown / botPar);
    roundRect(bx, by, bw, 7, 4); ctx.fillStyle = 'rgba(28,18,46,.85)'; ctx.fill();
    if (frac > 0.02) { roundRect(bx, by, Math.max(10, bw * frac), 7, 4); ctx.fillStyle = frac >= 1 ? '#ffd24a' : '#8fa4c8'; ctx.fill(); }
    if (frac >= 1) { ctx.globalAlpha = 0.4 + 0.3 * Math.sin(now / 170); roundRect(bx - 2, by - 2, bw + 4, 11, 6); ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1; }
    if (runMode === 'night') { // moon goalposts on the bar (2🌙 / 3🌙 thresholds)
      ctx.fillStyle = 'rgba(255,217,160,.9)';
      ctx.fillRect(bx + bw * 0.3 - 1, by - 3, 2, 13); ctx.fillRect(bx + bw * 0.55 - 1, by - 3, 2, 13);
    }
  }
  // the combo streak: a gold ×N that pulses, with its own little draining fuse
  if (combo >= 2 && now - comboT < COMBO_WINDOW) {
    var crem = 1 - (now - comboT) / COMBO_WINDOW;
    var ccs = 1 + comboPulse * 0.3;
    ctx.save(); ctx.translate(W / 2 + 188, 162); ctx.scale(ccs, ccs);
    ctx.textAlign = 'center';
    ctx.font = "800 30px 'Baloo 2', sans-serif"; ctx.fillStyle = '#ffd24a';
    ctx.shadowColor = 'rgba(255,210,74,.7)'; ctx.shadowBlur = 12;
    ctx.fillText('×' + combo, 0, 0); ctx.shadowBlur = 0;
    ctx.font = "700 11px 'Baloo 2', sans-serif"; ctx.fillStyle = '#b9a9c9'; ctx.fillText('combo', 0, 15);
    ctx.fillStyle = 'rgba(255,210,74,.9)'; ctx.fillRect(-24, 20, 48 * crem, 3);
    ctx.restore();
  }
  // board with depth: drop-shadow, fill, inner top-shade, warm rim
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  roundRect(GRID_X - 14, GRID_Y - 14, COLS * CELL + 28, ROWS * CELL + 28, 26);
  ctx.fillStyle = 'rgba(38,26,58,.72)'; ctx.fill(); ctx.restore();
  var bgr = ctx.createLinearGradient(0, GRID_Y - 14, 0, GRID_Y + ROWS * CELL + 14);
  bgr.addColorStop(0, 'rgba(18,10,30,.5)'); bgr.addColorStop(0.2, 'rgba(18,10,30,0)');
  roundRect(GRID_X - 14, GRID_Y - 14, COLS * CELL + 28, ROWS * CELL + 28, 26); ctx.fillStyle = bgr; ctx.fill();
  ctx.strokeStyle = 'rgba(124,102,160,.9)'; ctx.lineWidth = 3; roundRect(GRID_X - 14, GRID_Y - 14, COLS * CELL + 28, ROWS * CELL + 28, 26); ctx.stroke();
  if (path.length) {
    var buildRope = function () {
      ctx.beginPath();
      for (var i = 0; i < path.length; i++) {
        var px2 = GRID_X + path[i].x * CELL + CELL / 2, py2 = GRID_Y + path[i].y * CELL + CELL / 2;
        if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
      }
      if (phase === 'linking') ctx.lineTo(Math.max(GRID_X, Math.min(GRID_X + COLS * CELL, pointerPos.x)), Math.max(GRID_Y, Math.min(GRID_Y + ROWS * CELL, pointerPos.y)));
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(255,205,130,.22)'; ctx.lineWidth = 22; buildRope(); ctx.stroke(); // soft glow
    ctx.strokeStyle = 'rgba(255,224,168,.95)'; ctx.lineWidth = 9; buildRope(); ctx.stroke();  // warm core
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3; buildRope(); ctx.stroke();   // hot center
  }
  ctx.save(); roundRect(GRID_X - 14, GRID_Y - 14, COLS * CELL + 28, ROWS * CELL + 28, 26); ctx.clip(); // falling pets stay INSIDE the board
  for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
    var cell = grid[y][x];
    var cx = GRID_X + x * CELL + CELL / 2, cy = GRID_Y + y * CELL + CELL / 2;
    if (cell.blocked) { // the level's fixed architecture — reads as room decor, not an empty gap
      ctx.fillStyle = 'rgba(40,28,58,.5)'; roundRect(cx - CELL / 2 + 6, cy - CELL / 2 + 6, CELL - 12, CELL - 12, 16); ctx.fill();
      ctx.strokeStyle = 'rgba(90,74,120,.4)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = 'rgba(120,102,150,.55)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - 12, cy - 12); ctx.lineTo(cx + 12, cy + 12); ctx.moveTo(cx + 12, cy - 12); ctx.lineTo(cx - 12, cy + 12); ctx.stroke();
      continue;
    }
    if (!cell.pet) continue;
    // tile-card: every pet sits on a soft quilt square, not in a void (readability fix)
    ctx.fillStyle = cell.asleep ? 'rgba(70,90,130,.4)' : 'rgba(74,54,96,.55)';
    roundRect(cx - CELL / 2 + 6, cy - CELL / 2 + 6, CELL - 12, CELL - 12, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(124,102,160,.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    var isStar = star && star.x === x && star.y === y;
    if (isStar) {
      var sp2 = 0.5 + 0.5 * Math.sin(now / 200);
      ctx.strokeStyle = 'rgba(168,216,255,' + (0.55 + sp2 * 0.45) + ')'; ctx.lineWidth = 3 + sp2 * 2;
      roundRect(cx - CELL / 2 + 4, cy - CELL / 2 + 4, CELL - 8, CELL - 8, 18); ctx.stroke();
      ctx.fillStyle = '#a8d8ff'; ctx.font = '18px "Segoe UI", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('⭐', cx + CELL / 2 - 16, cy - CELL / 2 + 20);
    }
    if (cell.drop < 0) { cell.vy += 820 * dtSec; cell.drop += cell.vy * dtSec * 14;
      if (cell.drop > 0) { // touchdown: squash, a puff of dust, a soft plop
        cell.drop = 0; cell.vy = 0; cell.landT = now;
        if (now - lastPlop > 85) { lastPlop = now; noisePuff(0, 0.05, 240 + ((x * 37 + y * 53) % 5) * 30); }
        sparkAt(cx, cy + CELL * 0.34, 2, 'rgba(196,178,220,.55)');
      }
    }
    var onPath = false;
    for (var pi = 0; pi < path.length; pi++) if (path[pi].x === x && path[pi].y === y) { onPath = true; break; }
    cell.soul.tick(now);
    var isVoid = cell.pet.breed === 'voidcat';
    var pup = { x: 0, y: 0 };
    if ((isVoid || onPath) && !cell.asleep) {
      pup.x = Math.max(-1, Math.min(1, (pointerPos.x - cx) / 200));
      pup.y = Math.max(-1, Math.min(1, (pointerPos.y - cy) / 200));
    }
    if (onPath) { ctx.fillStyle = 'rgba(255,217,160,.16)'; roundRect(cx - CELL / 2 + 5, cy - CELL / 2 + 5, CELL - 10, CELL - 10, 18); ctx.fill(); }
    var pr = STAGE_R[cell.pet.stage || 1];
    var pop = 1;
    if (cell.popT) { var age = (now - cell.popT) / 300; if (age < 1) pop = 0.55 + 0.45 * age + 0.3 * Math.sin(age * Math.PI); else cell.popT = 0; }
    // landing squash-and-stretch: pets are soft, and soft things squish
    var sqx = 1, sqy = 1;
    if (cell.landT) {
      var la = (now - cell.landT) / 240;
      if (la < 1) { var lk = Math.sin(la * Math.PI) * (1 - la * 0.35); sqx = 1 + 0.16 * lk; sqy = 1 - 0.2 * lk; }
      else cell.landT = 0;
    }
    // grounding shadow so the pet sits ON the tile, not floating over it
    ctx.fillStyle = 'rgba(0,0,0,.20)';
    ctx.beginPath(); ctx.ellipse(cx, cy + cell.drop + pr * 0.84, pr * 0.7 * sqx, pr * 0.24, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(cx, cy + cell.drop); ctx.scale(pop * sqx, pop * sqy); ctx.translate(-cx, -(cy + cell.drop));
    drawPet(ctx, cell.pet.breed, cell.pet.coat || 0, cx, cy + cell.drop, pr, {
      breath: cell.soul.breath(now),
      blinkL: cell.soul.blinking(now), blinkR: cell.soul.blinking(now),
      pupil: pup, tilt: onPath ? Math.sin(now / 160 + x) * 0.06 : (cell.asleep ? 0.05 : 0),
      sleeping: cell.asleep, stage: cell.pet.stage || 1
    });
    ctx.restore();
    // the shimmer twinkle: rare-coat pets carry a little star so collectors can spot them across the room
    if (cell.pet.coat) {
      var tw2 = 0.45 + 0.45 * Math.sin(now / 260 + x * 2.1 + y * 1.3);
      ctx.fillStyle = 'rgba(255,224,150,' + tw2 + ')'; ctx.font = '15px "Segoe UI", sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('✦', cx + pr * 0.72, cy + cell.drop - pr * 0.62);
    }
    if (cell.asleep && Math.floor(now / 900 + x + y) % 3 === 0) {
      ctx.font = "500 20px Caveat, cursive"; ctx.fillStyle = 'rgba(168,216,255,.8)'; ctx.textAlign = 'center';
      ctx.fillText('z', cx + 26, cy + cell.drop - 30);
    }
  }
  ctx.restore(); // end board clip
  // tutorial: the glowing invitation
  if (tut.active && tut.cells.length && now > (tut.glowAt || 0)) {
    var tp = 0.5 + 0.5 * Math.sin(now / 260);
    ctx.strokeStyle = 'rgba(255,217,160,' + (0.45 + tp * 0.5) + ')';
    ctx.lineWidth = 4 + tp * 2;
    for (var ti = 0; ti < tut.cells.length; ti++) {
      var tc = tut.cells[ti];
      roundRect(GRID_X + tc[0] * CELL + 6, GRID_Y + tc[1] * CELL + 6, CELL - 12, CELL - 12, 16);
      ctx.stroke();
    }
  }
  // graduates walking home
  for (var i2 = walkers.length - 1; i2 >= 0; i2--) {
    var pw = walkers[i2];
    pw.t += dtSec * 1000;
    if (pw.t < 0) { drawPet(ctx, pw.pet.breed, pw.pet.coat || 0, pw.sx, pw.sy, STAGE_R[3], { stage: 3 }); continue; }
    var f = Math.min(1, pw.t / pw.dur);
    var ease = f < 0.08 ? -f * 0.6 : (f - 0.08) / 0.92;
    var tx = W + 80, ty = GRID_Y - 60;
    var xx = pw.sx + (tx - pw.sx) * Math.max(0, ease);
    var yy = pw.sy + (ty - pw.sy) * Math.max(0, ease) - Math.abs(Math.sin(f * 12)) * 16;
    drawPet(ctx, pw.pet.breed, pw.pet.coat || 0, xx, yy, STAGE_R[3], { stage: 3, tilt: Math.sin(f * 14) * 0.14 });
    if (f >= 1) walkers.splice(i2, 1);
  }
  // THE HUG: source pets fly into the merge cell, shrinking as they squeeze together
  for (var hi = hugFlyers.length - 1; hi >= 0; hi--) {
    var hf = hugFlyers[hi];
    hf.t += dtSec * 4.2;
    if (hf.t >= 1) { hugFlyers.splice(hi, 1); continue; }
    var he = hf.t * hf.t * (3 - 2 * hf.t);
    var hx = hf.sx + (hf.ex - hf.sx) * he, hy = hf.sy + (hf.ey - hf.sy) * he - Math.sin(hf.t * Math.PI) * 14;
    drawPet(ctx, hf.breed, hf.coat || 0, hx, hy, STAGE_R[hf.stage] * (1 - 0.35 * hf.t), { tilt: Math.sin(hf.t * 10) * 0.2 });
  }
  // sleep pressure: cool blue creeps from the edges as the room dozes
  if (st.frac > 0.25) {
    var sg = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.62);
    sg.addColorStop(0, 'rgba(125,160,220,0)');
    sg.addColorStop(1, 'rgba(96,130,200,' + Math.min(0.34, (st.frac - 0.25) * 0.7) + ')');
    ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function renderFx(now) {
  for (var i = sparkles.length - 1; i >= 0; i--) {
    var s = sparkles[i];
    s.x += s.vx; s.y += s.vy; s.vy += 0.06; s.life -= 0.02;
    if (s.life <= 0) { sparkles.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, Math.min(1, s.life));
    if (s.heart) {
      ctx.font = (11 + s.life * 7) + 'px "Segoe UI", sans-serif'; ctx.textAlign = 'center'; ctx.fillText('💛', s.x, s.y);
    } else {
      ctx.fillStyle = s.color; ctx.shadowColor = s.color; ctx.shadowBlur = 7;
      ctx.beginPath(); ctx.arc(s.x, s.y, (s.size || 2.6) * (0.4 + 0.6 * s.life), 0, 7); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }
  for (var j = callouts.length - 1; j >= 0; j--) {
    var c = callouts[j];
    c.age += 0.016;
    if (c.age < 0) continue;              // queued center callout, waiting its turn
    if (c.age > c.ttl) { callouts.splice(j, 1); continue; }
    var t = c.age / c.ttl, sc = t < 0.14 ? t / 0.14 : 1, al = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
    ctx.save(); ctx.translate(c.x, c.y - t * 40); ctx.scale(sc, sc); ctx.globalAlpha = al;
    ctx.textAlign = 'center';
    if (c.score) { ctx.font = "800 " + c.size + "px 'Baloo 2', sans-serif"; ctx.fillStyle = c.color || '#ffd9a0'; ctx.shadowColor = '#4a3563'; ctx.shadowOffsetY = 2; }
    else { ctx.font = "500 " + c.size + "px Caveat, cursive"; ctx.fillStyle = c.color || '#e8b4c8'; }
    ctx.fillText(c.text, 0, 0);
    ctx.restore();
  }
  ctx.font = '24px "Segoe UI", sans-serif'; ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(185,169,201,.8)';
  ctx.fillText(save.muted ? '🔇' : '🔊', W - 20, 44);
}

// ============ MAIN LOOP ============
var lastT = performance.now(), dtSec = 1 / 60;
function loop(now) {
  requestAnimationFrame(loop);
  dtSec = Math.min(0.06, (now - lastT) / 1000);
  lastT = now;
  if (now < hitstopUntil) dtSec = 0;   // the hitstop: time itself holds its breath on impact
  scoreShown += (score - scoreShown) * Math.min(1, dtSec * 9);
  if (Math.abs(score - scoreShown) < 0.6) scoreShown = score;
  scorePulse *= 0.9; comboPulse *= 0.92;
  if (screenMode === 'den') renderDen(now);
  else if (screenMode === 'map') renderMap(now);
  else renderPlay(now);
  renderFx(now);
  if (demoActive && dctx) DEMO_PAGES[demoPage].draw(now);   // storybook has its own canvas
  if (wardrobeOpen && wardrobeCtx) drawWardrobePreview(now); // dressing room preview
  // eased screen transitions — no hard cuts (polish)
  var fa = 1 - Math.min(1, (now - fadeFrom) / 300);
  if (fa > 0.01) { ctx.globalAlpha = fa; ctx.fillStyle = '#140c20'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (armed && now - armT > 2600) disarm();
}
// ============ BOOT ============
// read-only dev hook (harmless in prod; lets automated tests see closure state) — plain function, ES3-safe
decodeSprites();
if (save.founder && !save.legends.gilded) unlockLegend('gilded');   // migration: founders who redeemed before legends existed
window._pw = function () {
  var o = [], blk = [];
  for (var y = 0; y < ROWS; y++) { o.push([]); blk.push([]); for (var x = 0; x < COLS; x++) { var c = grid[y] && grid[y][x]; o[y].push(c && c.pet ? { b: c.pet.breed, s: c.pet.stage, z: !!c.asleep, c: c.pet.coat || 0 } : null); blk[y].push(c ? !!c.blocked : false); } }
  return { combo: combo, comboBest: comboBest, score: score, botPar: botPar, parCrossed: parCrossed, mergeCount: mergeCount, board: o, rareCoat: curRareCoat, mask: curMask, blocked: blk, petScreenPos: petScreenPos, rescueScreenPos: rescueScreenPos };
};
demoCv = $('demo-cv'); dctx = demoCv.getContext('2d');
dreamsCv = $('dreams-cv'); drctx = dreamsCv.getContext('2d');
wardrobeCv = $('wardrobe-cv'); wardrobeCtx = wardrobeCv.getContext('2d');
glowupCv = $('glowup-cv'); glowupCtx = glowupCv.getContext('2d');
buildCreator();
setUI();
if (!save.pet) { showOv('creator-ov'); } else { denWhisper(); }
requestAnimationFrame(loop);
})();
