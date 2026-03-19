# Konbini Quest - Improvement Backlog

## Priority Order (highest impact first)

### Batch 1: Core Learning Effectiveness
1. **Spaced Repetition Review System** - After completing a level, previously learned phrases reappear in later levels as quick-fire reviews. Track which phrases the player struggles with and surface them more often. This is THE #1 evidence-based technique for language retention.
2. **Listening Comprehension Mode** - Clerk speaks Japanese audio ONLY (no text), player must choose the correct meaning. Forces real ear training instead of just reading.
3. ~~**Romaji → Kana Transition**~~ ✅ - Early levels show romaji, later levels show only hiragana/katakana. Gradually removes the crutch.

### Batch 2: Addictive Game Mechanics
4. ~~**Daily Challenge / Streak System**~~ ✅ - A special NPC on the street offers a daily challenge. Visual streak counter on the HUD. Creates the "Hooked" cycle (trigger → action → variable reward → investment).
5. ~~**Collection Mechanic**~~ ✅ - "Konbini Stamp Card" that fills up as you master phrases. Visual progress toward completion triggers completionist drive.
6. ~~**Variable Rewards**~~ -- Random rare items/phrases with special animations. The "variable reward" is the most addictive element per Nir Eyal's framework.

### Batch 3: Better Graphics & Polish
7. ~~**Animated Store Entry**~~ ✅ - Sliding door animation when entering stores instead of just fade-to-black.
8. ~~**Weather System**~~ ✅ - Rain, night, cherry blossom petals. Makes the overworld feel alive.
9. ~~**NPC Walk Cycles**~~ -- Street NPCs wander around instead of standing still. More Pokemon-like.

### ⭐ HIGH PRIORITY — User Requested
10. ~~**ElevenLabs Real Japanese Voices**~~ -- Replace the Web Speech API TTS with real Japanese voices from ElevenLabs. Use the REST API (`POST https://api.elevenlabs.io/v1/text-to-speech/:voice_id`) with `xi-api-key` header and `eleven_multilingual_v2` model. The `speakJapanese(text)` function in `audio.js` currently uses `window.speechSynthesis` — replace it with a fetch call to ElevenLabs that returns audio, then play it via Web Audio API or `Audio()` element. Cache audio blobs in memory to avoid re-fetching the same phrases. Select a natural-sounding Japanese female voice (research available voice IDs). API Key: `sk_fdc4e35db2ff37ef0b2286d05c744a2e15e753be1c1778e4`.
11. **HD Graphics Upgrade** - Significantly improve sprite quality across the game. Current sprites use small pixel maps (e.g., 16x16). Upgrade to larger, more detailed pixel art with richer color palettes. Focus on: player character (more expressive, more animation frames), store exteriors (more architectural detail, signage), store interiors (shelving detail, products on display), NPC designs (more distinct, more personality). Maintain the kawaii 8-bit Pokemon aesthetic but push quality higher — think Game Boy Color level detail vs original Game Boy.

### Batch 3b: Visual Polish (continued)
12. **Particle Effects** - Stars burst when completing levels, sparkles on correct answers.

### Batch 4: Deeper Japanese Content
13. **Payment Method Interactions** - Full payment flow: "How would you like to pay?" → Cash/Card/IC card responses with proper keigo.
14. **Seasonal Items** - Oden in winter, ice cream in summer. Teaches seasonal vocabulary.
15. **Regional Dialects** - Kansai-ben clerk at one store as a bonus challenge.
16. **Politeness Levels** - Show casual vs polite vs keigo versions of the same phrase.

### Batch 5: Advanced Mechanics
17. **Mini-map** - Small map in corner showing store locations and completion status.
18. **Inventory System** - Items you "buy" appear in a bag. Review what you purchased with Japanese labels.
19. **Achievement Badges** - "First Purchase", "Point Card Pro", "Konbini Master" etc.
20. **Sound Design** - Ambient konbini BGM, register beeps, bag rustling.

### Batch 6: Advanced Learning
21. **Mistake Journal** - Track wrong answers, show them in a review section.
22. **Cultural Notes** - Brief cultural context popups (money tray etiquette, bowing, etc.)
23. **Speed Round** - Timed mode where clerk fires rapid questions. Tests recall under pressure.
24. **Pronunciation Guide** - Show pitch accent patterns for key phrases.

## Research Notes
- Flow Theory: 7 key elements for educational game engagement - learning goals, immediate feedback, adaptive challenge, control/autonomy, concentration, rewards, sensory immersion
- Hooked Model (Nir Eyal): Trigger → Action → Variable Reward → Investment
- Spaced repetition is "the most replicable and robust finding from experimental psychology"
- Pokemon's addictive loop: Collection + Progression + Reward anticipation + Physical exploration
- Key konbini phrases foreigners struggle with: point card questions, payment method, bag/chopstick requests, heating food, age verification screen

---

## CHANGELOG

### 2026-03-18 — #1 Spaced Repetition Review System ✅
**Commit:** `c5642e3`

**What was added:**
- New "Review Sensei" NPC on the street (in the park area) wearing a maroon robe with grey hair
- Complete spaced repetition phrase tracking system in npc.js
- Every quiz answer (correct or wrong) is tracked with mastery levels and review intervals
- Algorithm: correct answers increase review interval (1→2→4→8 levels), wrong answers reset to 1
- Quick-fire review quiz format with shuffled answer positions
- Pulsing golden book indicator above Sensei when reviews are available
- Review stats tracking: total phrases, mastered, learning, due count
- Japanese/English feedback during reviews (よくできた！/ もう一回！)
- Star-rated review completion summary (★★★ perfect / ★★☆ great / ★☆☆ keep practicing)
- Updated render_game_to_text with review state for testing

**Files modified:** game.js, npc.js, engine.js, sprites.js

### 2026-03-18 — #2 Listening Comprehension Mode ✅
**Commit:** `b59f72e`

**What was added:**
- New "Listening Mode" that activates when encountering previously-learned phrases
- Audio-only challenge: clerk speaks Japanese via TTS but no text is shown on screen
- Player must identify what the clerk said from audio alone, then select the correct response
- Pulsing ear icon with animated sound waves in the dialogue box during listening mode
- Press [B] to replay the audio as many times as needed
- Press [A] to proceed to the answer choices
- On correct answer: reveals the original Japanese text + romaji + English as reinforcement
- On wrong answer: reveals what the clerk said, replays audio, then retries with text visible
- Shuffled answer positions in listening quizzes to prevent position memorization
- Level 12 (Master level) always uses listening mode for all clerk interactions
- Integrates with spaced repetition: only phrases with mastery >= 1 trigger listening mode
- Testing hook (window.forceListeningMode) for development verification
- Added listeningMode state to render_game_to_text for testing

**Files modified:** dialogue.js, game.js

### 2026-03-18 — #4 Daily Challenge / Streak System ✅
**Commit:** `cf1048c`

**What was added:**
- New "Challenge Master" NPC named Hana on the street — bright yellow outfit with red headband
- 3 challenge types with variable rewards (Nir Eyal's Hooked Model):
  - **Speed Round** (スピードラウンド): 3 quick-fire questions
  - **Mix Master** (ミックスマスター): 4 questions from different stores
  - **Survival** (サバイバル): 5 questions, one mistake breaks the streak
- Session-based streak counter with fire icon in HUD (top-right, stacked above stars)
- Pulsing red/yellow lightning bolt indicator above Hana when challenge is ready
- Higher streaks shift challenge type distribution toward harder modes
- Streak milestone bonuses at 3, 5, and 10 with Japanese celebration messages
- 30-second cooldown between challenges to prevent burnout
- Quiz questions pulled from learned phrases with weighted selection (harder phrases appear more)
- Shuffled answer options prevent position memorization
- Challenge answers feed back into spaced repetition tracking
- Japanese encouragement messages with variety (正解、いいね、すごい、バッチリ)
- Testing hooks added to render_game_to_text for challenge state

**Files modified:** game.js, npc.js, engine.js, sprites.js

### 2026-03-18 — #5 Collection Mechanic (Stamp Card) ✅
**Commit:** `0c7d788`

**What was added:**
- Full stamp card collection system with 3 tiers: bronze (3+ mistakes), silver (1-2 mistakes), gold (perfect)
- Each store has 4 stamp slots + 1 locked "Master Stamp" that unlocks when all 4 are gold
- Cherry blossom-styled stamp icons with tier-colored variants (brown/silver/gold)
- Full-screen stamp card overlay accessible via TAB key from the street
- Shows all 3 stores (7-Eleven, Lawson, FamilyMart) with color-coded headers
- Level names displayed under each stamp slot
- Total progress bar at bottom with percentage
- HUD indicator in top-right corner: stamp book icon + count (e.g., "6/15")
- Floating notification banner when new stamps are earned (金/銀/銅 + GOLD/SILVER/BRONZE)
- Master stamp features golden crown icon when unlocked, "?" when locked
- Stamps only upgrade (never downgrade) — replay levels to earn better tiers
- Testing hooks: toggleStampCard(), awardTestStamp()

**Files modified:** npc.js, sprites.js, engine.js, game.js

### 2026-03-18 — #3 Romaji → Kana Transition ✅
**Commit:** `8751bcd`

**What was added:**
- Progressive writing system transition across three modes:
  - **Romaji mode** (Levels 1-4): Full Japanese + romaji + English for beginners
  - **Kana Assist mode** (Levels 5-8): Japanese + English only; romaji removed from dialogue; press [B] during quizzes to peek at romaji readings
  - **Kana Only mode** (Levels 9-12): Japanese text only, no romaji or English hints
- Color-coded HUD badge in top-left corner shows current writing mode:
  - Blue "Aa" = Romaji mode
  - Orange "あa" = Kana Assist mode
  - Red "あ" = Kana Only mode
- One-time transition notifications when entering a new writing mode for the first time:
  - "レベルアップ！" for kana_assist explaining [B] peek
  - "上級者！" for kana_only encouraging Japanese-only reading
- Romaji peek overlay: press [B] during kana_assist quiz to show all option readings in an orange popup
- "[B] Romaji" hint displayed below quiz choices in kana_assist mode
- Tips suppressed in kana_only mode (player should be advanced enough)
- Based on language learning research: dropping romaji early is the #1 recommendation from Japanese learning communities
- Testing hooks: window.setDisplayMode(), window.unlockToLevel()

**Files modified:** levels.js, game.js, dialogue.js

### 2026-03-18 -- #6 Variable Rewards System ✅
**Commit:** `87532eb`

**What was added:**
- Variable reward system based on Nir Eyal's Hooked Model (variable ratio reinforcement schedule)
- 20 collectible bonus phrases in 3 rarity tiers:
  - Common (8 phrases, ~60% drop chance): everyday konbini phrases like straw requests, wet towels, separate bags
  - Rare (6 phrases, ~30% drop chance): situational phrases like asking for restroom, spicy food check, IC card charge
  - Ultra Rare (6 phrases, ~10% drop chance): advanced keigo and cultural phrases like polite restroom request, itadakimasu, gochisousama
- ~25% base chance to roll a reward on any correct answer, with streak bonus up to +15%
- Tier-specific reward animations:
  - Common: bronze-colored slide-in banner
  - Rare: silver banner with pulsing glow effect and sparkle particles
  - Ultra Rare: golden double-bordered banner with dramatic glow, 8 orbiting sparkle particles
- Tier-specific reward sound effects:
  - Common: 3-note ascending chime
  - Rare: 5-note sparkle ascending sequence
  - Ultra Rare: dramatic 9-note fanfare with overtone sparkles
- Bonus Phrase Book overlay (press [Q] from the street) showing all collected phrases
  - Sorted by rarity (ultra rare first)
  - Pulsing "NEW" indicators on unseen phrases
  - Color-coded tier dots and legend (bronze/silver/gold)
  - Progress bar showing X/20 collection progress
- HUD indicator in top-right: book icon + collected count, golden border when new phrases available
- Japanese TTS reads each bonus phrase aloud after the reward animation
- Rewards trigger during store quizzes, listening mode, and challenge mode
- Testing hooks: forceReward(tier), togglePhraseBook()

**Files modified:** npc.js, audio.js, sprites.js, engine.js, game.js

### 2026-03-19 -- #9 NPC Walk Cycles
**Commit:** `d5b71fb`

**What was added:**
- Pokemon-style wandering AI for 3 street NPCs: Old Man, Schoolgirl, Businessman
- Tile-based random movement: NPCs pick a random direction, walk one tile with smooth pixel interpolation, then pause
- 2-frame walk animation for each NPC type (alternating foot positions for walk cycle)
- Pause duration between walks varies randomly: 1.5 to 4 seconds (staggered start times so they don't all move in sync)
- 3-tile leash distance from home position prevents NPCs from wandering too far
- Full collision system: NPCs check walkable map tiles, player position, and other NPC positions before moving
- NPCs freeze immediately when dialogue is active (no awkward walking-while-talking)
- If an NPC cannot find a walkable tile, it randomly turns to face a new direction (adds life without displacement)
- Sensei and Challenger NPCs remain stationary -- players need to reliably find them for reviews and challenges
- Store clerks are unaffected (they are on indoor maps only)
- Walk speed: 12 frames per tile (~200ms), matching a natural slow amble pace
- NPC walk state initialized when game starts (on title screen -> playing transition)

**Files modified:** npc.js, sprites.js, engine.js, game.js

### 2026-03-19 -- #8 Weather System ✅
**Commit:** `c01794a`

**What was added:**
- Cherry blossom petal particle system: 30 pink petals with elliptical shapes, sway motion (sine wave), rotation, and drift
- 7 shades of pink for natural variety (#FFB7C5, #FF9CAD, #FFDDE1, etc.)
- Each petal has a white highlight for 3D depth effect
- Rain particle system: 80 rain streaks with diagonal fall, varying lengths and transparency
- Rain ground splash effects: animated expanding circles at the bottom of the screen
- Ambient rain audio: 5 layered bandpass-filtered oscillators creating realistic rain texture
- Rain audio fades in over 2s and out over 1.5s for smooth transitions
- Day/night cycle with 4 phases over 120s: day → dusk (warm orange-purple) → night (deep blue) → dawn (soft pink)
- Smooth alpha interpolation between phases (no jarring transitions)
- Twinkling star field during nighttime: 15 deterministic stars with sine-based twinkle
- Weather auto-cycles every 45s: cherry blossoms → clear → rain → clear → cherry blossoms
- Weather only renders on the street (map 0) — store interiors are unaffected
- Rain ambient sound stops when entering stores, resumes when returning to street
- Time-of-day tint renders below sprites/NPCs but above map tiles for proper layering
- Weather particles render above player but below HUD for correct visual hierarchy
- Testing hooks: getWeatherInfo(), setWeather()

**Files modified:** engine.js, audio.js, game.js

### 2026-03-18 -- #7 Animated Store Entry ✅
**Commit:** `9c47443`

**What was added:**
- Konbini-style automatic sliding door animation when entering stores from the street
- Two glass door panels slide apart with ease-out cubic easing (0.5s duration)
- Warm interior glow visible through opening doors (simulates konbini fluorescent lighting)
- Store brand colors on door panels: red for 7-Eleven, blue for Lawson, green for FamilyMart
- Pulsing red sensor dot above door (mimics real konbini automatic door sensors)
- Door frame and mat rendering details for authenticity
- New sliding door open sound effect: mechanical click + descending frequency sweep + pneumatic hiss
- New sliding door close sound effect when exiting stores: reverse slide + click shut
- Player movement blocked during door animation for smooth, uninterruptible transition
- Full entry flow: door slides open → fade to black → map switch → fade in → store chime → clerk greeting
- Exit flow: door close sound → fade to black → map switch → fade in (simpler, no door anim needed since player faces away)
- Door animation system added to Engine with separate update/render lifecycle
- All 3 store entries verified working with correct brand colors

**Files modified:** audio.js, engine.js, game.js

### 2026-03-19 -- #10 ElevenLabs Real Japanese Voices
**Commit:** `393a725`

**What was added:**
- Replaced Web Speech API (window.speechSynthesis) with ElevenLabs eleven_multilingual_v2 model for all Japanese TTS
- Selected Hanako voice (IIUvcn96WSMnC5WxNypI) -- young conversational Japanese female with standard accent, perfect for konbini clerk role
- REST API integration: POST to /v1/text-to-speech/:voice_id with xi-api-key header
- In-memory audio cache (Map keyed by text) -- once a phrase is fetched, it plays instantly from cache forever after
- Preloads 9 common konbini phrases on game start (staggered 1.5s apart to avoid rate limiting):
  - Irasshaimase, point card question, bento warming, bag question, chopsticks question, thank you, please come again, how many, eat here question
- Smart fallback system: if a phrase is not yet cached, plays Web Speech API immediately while ElevenLabs fetches in background for next time
- After first encounter, all subsequent plays of the same phrase use the cached ElevenLabs audio (natural, high-quality)
- Graceful error handling: 401/403 permanently disables ElevenLabs (bad key), other errors retry next time
- Audio playback via HTML5 Audio() element with volume tied to mute state
- Stops any currently-playing voice audio before starting new speech (no overlapping)
- Testing hooks: getVoiceStatus() returns cache size/API status, testVoice(text) plays a phrase
- Voice status included in render_game_to_text for automated testing

**Files modified:** audio.js, game.js

### 2026-03-19 -- #10 Hotfix: Comprehensive ElevenLabs Voice Coverage
**Commit:** `681f7c8`

**What was changed:**
- **Async-first voice:** speakJapanese() now fetches from ElevenLabs immediately and plays when ready (no more fallback-first delay). Only falls back to Web Speech if ElevenLabs fetch fails.
- **Answer options speak on cursor move:** When navigating quiz answer choices with up/down, the highlighted Japanese option is spoken aloud via ElevenLabs. First option speaks automatically when quiz menu appears (200ms delay).
- **Correct answer voice playback:** All 4 quiz handlers (main, review sensei, challenge master, listening mode) now speak the player's selected Japanese response 500ms after the correct-answer sound effect.
- **Level phrase preloading:** When entering a store level, all Japanese phrases (clerk lines + every answer option) are extracted and preloaded via fetchVoiceAudio() with 800ms stagger. This means voices are cached before the player encounters them.
- **Expanded common phrases:** preloadCommonPhrases() now covers 17 phrases (up from 9), including common player responses like ありがとうございます, はい、お願いします, 大丈夫です, etc.
- **New helpers:** stopCurrentVoice() extracted and exported, fetchAndPlay() async function for fetch+play in one step.
- **Skips [何も言わない]:** The "Stay Silent" option is intentionally not spoken when highlighted or selected.

**Files modified:** audio.js, dialogue.js, game.js
