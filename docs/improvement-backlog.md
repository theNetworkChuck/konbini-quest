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
11. ~~**HD Graphics Upgrade**~~ ✅ - Significantly improve sprite quality across the game. Current sprites use small pixel maps (e.g., 16x16). Upgrade to larger, more detailed pixel art with richer color palettes. Focus on: player character (more expressive, more animation frames), store exteriors (more architectural detail, signage), store interiors (shelving detail, products on display), NPC designs (more distinct, more personality). Maintain the kawaii 8-bit Pokemon aesthetic but push quality higher — think Game Boy Color level detail vs original Game Boy.

### Batch 3b: Visual Polish (continued)
12. ~~**Particle Effects**~~ ✅ - Stars burst when completing levels, sparkles on correct answers.

### Batch 4: Deeper Japanese Content
13. ~~**Payment Method Interactions**~~ ✅ - Full payment flow: "How would you like to pay?" → Cash/Card/IC card responses with proper keigo.
14. ~~**Seasonal Items**~~ ✅ - Oden in winter, ice cream in summer. Teaches seasonal vocabulary.
15. ~~**Regional Dialects**~~ -- Kansai-ben coach NPC teaches Osaka dialect as a bonus challenge.
16. ~~**Politeness Levels**~~ -- Politeness coach NPC teaches casual/polite/keigo escalation for konbini phrases.

### Batch 5: Advanced Mechanics
17. ~~**Mini-map**~~ ✅ - Small map in corner showing store locations and completion status.
18. ~~**Inventory System**~~ -- Items you "buy" appear in a bag. Review what you purchased with Japanese labels.
19. ~~**Achievement Badges**~~ ✅ - "First Purchase", "Point Card Pro", "Konbini Master" etc.
20. ~~**Sound Design**~~ ✅ - Ambient konbini BGM, register beeps, bag rustling.

### Batch 6: Advanced Learning
21. ~~**Mistake Journal**~~ ✅ - Track wrong answers, show them in a review section.
22. ~~**Cultural Notes**~~ -- Brief cultural context popups (money tray etiquette, bowing, etc.)
23. ~~**Speed Round**~~ ✅ - Timed mode where clerk fires rapid questions. Tests recall under pressure.
24. ~~**Pronunciation Guide**~~ ✅ - Show pitch accent patterns for key phrases.

### Batch 7: Persistence & Quality of Life
25. ~~**Save/Load System**~~ ✅ - Persist all game progress to localStorage. Auto-save after level completion, NPC interactions, and store exits. Title screen shows CONTINUE/NEW GAME menu when save data exists. Green "SAVED" indicator flashes on screen. Serializes all 16 state systems (progress, spaced repetition, stamps, inventory, achievements, etc.).
26. ~~**Conversation Practice Mode**~~ -- Free-form conversation NPC where player picks from a scenario (buying coffee, asking for directions to bathroom, etc.) and plays through a full multi-turn conversation. More immersive than single-question quizzes.
27. ~~**Onomatopoeia Lesson**~~ ✅ - Teach common konbini sound words: pipi (register beep), gacha (capsule machine), paka (opening a bento). Japanese onomatopoeia is essential for natural speech.
28. ~~**Night Shift Mode**~~ ✅ - Different NPCs and dialogue appear at night (time-of-day already exists). Drunk salaryman, late-night snack vocabulary, midnight konbini culture.

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

### 2026-03-19 -- #12 Particle Effects
**Commit:** `e75db63`

**What was added:**
- New particle effects system in engine.js with two distinct effect types:
  - **Sparkles** (correct answers): 12 small 1-3px pixel squares burst outward in a kawaii green/gold/white/teal palette, with twinkle oscillation and gravity
  - **Star bursts** (level completion): 20 cross-shaped star particles in gold/red/purple + 12 trailing sparkle ring, more dramatic spread and longer lifetime
- Physics: gravity pull, velocity drag, twinkle (sine-wave alpha oscillation), fade-out in last 30% of life
- All particles are pixel-consistent (integer positions, no gradients, 1-3px squares) to match 8-bit aesthetic
- Sparkles hooked into all 4 correct-answer handlers: main quiz, review sensei, challenge master, listening mode
- Star bursts hooked into all 3 level-complete handlers: main store, review complete, challenge complete
- Particles render above dialogue/overlays but below door animation and screen fade
- Update loop integrated into main game update for smooth animation
- Auto-cleanup: particles remove themselves after their lifetime expires (~0.5-1.3s)

**Files modified:** engine.js, game.js

### 2026-03-19 -- #11 HD Graphics Upgrade
**Commit:** `4f4aa9f`

**What was changed:**
- **Player character:** Expanded color palette from 9 to 20 colors with shadow/highlight variants for every element. Added mouth expression, blush marks on cheeks, 3-tone hair gradient (dark/mid/highlight), backpack depth shading, and shoe highlights. All 8 frames (4 directions × 2 walk frames) upgraded.
- **Clerk NPC:** Added hair highlights, skin shadow tones, mouth detail, blush, and shadow variants for all store-branded uniforms (7-Eleven red, Lawson blue, FamilyMart green). Each store's clerk has dark/light uniform tones.
- **Old Man NPC:** Silver-white hair with highlights, warmer skin shadow tones, coat with button highlight detail, mouth expression.
- **Schoolgirl NPC:** Hair highlight tones, red bow tie on navy uniform, blush marks, pink mouth, white knee socks.
- **Businessman NPC:** Hair highlights, white shirt collar visible under suit, red tie detail, skin shading.
- **Sensei NPC:** Silver hair with bright highlights, gold robe accents, maroon robe with dark shadow variant, wooden sandal detail.
- **Challenger NPC:** Yellow outfit with shadow variant, white accent details on outfit, red headband with dark/light tones.
- **Store awnings:** Scalloped fringe bottom edges with alternating color detail, dark top edge shadow, lighter fringe.
- **Store doors:** Glass pane reflections (blue highlight), door divider bar, gold handles with highlight, darker mat with edge detail.
- **Store windows:** Gradient glass reflections (top-left highlight), window sill detail, frame shadow.
- **Trees:** Multi-layer canopy with 4 green shades (dark depth, mid, light, dapple highlights), bark grain on trunk, shadow at base.
- **Cherry blossoms:** 4 pink tones in canopy, individual petal highlights in white/pink, dark depth areas, improved trunk.
- **Grass:** Multi-shade texture with tiny wildflowers (yellow and pink dots).
- **Sidewalks:** Crack/wear marks, edge highlights on top of tiles, subtle aging detail.
- **Roads:** Deterministic asphalt texture (no more random), center line with glow effect.
- **Vending machines:** Drink variety with individual highlights, coin slot with gold accent, better panel depth.
- **Benches:** Wood grain on seat and back, leg shadows, improved ground shadow.
- **Street lamps:** Gradient pole, lamp housing detail, warm light glow on ground.
- **Fences:** Wood grain on horizontal bars, post caps, bark-colored posts.
- **Signs:** Beveled edge effect, decorative red accent dot.
- **Store interiors:** Floor tiles with subtle shine, wall panel lines, shelf product label highlights, counter with register keypad dots, hot food display with warm glow and price labels.

**Files modified:** sprites.js

### 2026-03-19 -- #13 Payment Method Interactions
**Commit:** `2d974c4`

**What was changed:**
- New NPC "Reiko" the Payment Coach added to Konbini Street at position (17, 10)
- Custom pixel art sprite: teal blazer, light brown hair, professional konbini payment instructor look
- Pulsing teal card icon bubble indicator appears above Reiko when player has completed 2+ store levels
- 6 complete payment scenarios covering all common konbini payment methods:
  1. **Cash Payment (現金)** - Basic cash flow with money tray etiquette
  2. **IC Card (Suica/PASMO)** - Tap-to-pay with proper phrasing
  3. **Credit Card** - One-time payment confirmation flow
  4. **QR Code (PayPay etc.)** - App-specific naming convention
  5. **Changing Payment** - What to do when your card is declined
  6. **Receipt & Change** - Handling お釣り and レシート politely
- Each scenario has 2 multi-step interactions (12 total quiz exchanges)
- Full interactive quiz flow: intro → clerk Japanese dialogue → multiple choice → correct/wrong feedback with explanations
- Authentic keigo phrases throughout (お支払い方法はいかがなさいますか, Suicaでお願いします, etc.)
- ElevenLabs voice preloading for all Japanese phrases in each scenario
- Correct answers trigger sparkle particles + voice playback + variable reward rolls
- Scenario progression tracking: completed count, unique scenarios unlocked (0-6)
- Payment bubble rendering in engine.js follows same pattern as challenge/review bubbles
- Unlocks after completing 2 store levels (ensures player knows basics first)

**Files modified:** sprites.js, npc.js, engine.js, game.js

### 2026-03-20 -- #14 Seasonal Items & Vocabulary
**Commit:** `603b1c3`

**What was changed:**
- New NPC "Obaa-chan" the Seasonal Guide added to Konbini Street at position (10, 15)
- Custom pixel art sprite: warm grandmother design with rust headscarf, olive green apron
- Pulsing warm orange leaf bubble indicator appears above Obaa-chan when player has completed 1+ store level
- 4 seasonal lessons covering all four seasons of authentic konbini seasonal items:
  1. **Spring (春)** - Sakura mochi (桜餅), kisetsu gentei (季節限定 / seasonal limited), ichigo daifuku (いちご大福)
  2. **Summer (夏)** - Hiyashi chuuka (冷やし中華), ice cream shinsaku (新作アイス), mugicha (麦茶)
  3. **Autumn (秋)** - Kuri/chestnut items (栗), satsumaimo/sweet potato (さつまいも), aki no aji (秋の味 / taste of autumn)
  4. **Winter (冬)** - Oden ordering (おでん), nikuman vs anman (肉まん vs あんまん), karashi condiment (からし)
- Each season has 3 interactive quiz scenarios (12 total quiz exchanges)
- Full interactive quiz flow: Obaa-chan introduces season → Japanese dialogue → multiple choice → correct/wrong feedback with cultural context
- Authentic Japanese seasonal konbini vocabulary researched for accuracy
- ElevenLabs voice preloading for all seasonal Japanese phrases
- Correct answers trigger sparkle particles + voice playback + variable reward rolls
- Season progression tracking: completed seasons, star ratings, 4-season unlock system
- Seasonal bubble rendering in engine.js follows same pattern as payment/challenge bubbles
- Unlocks after completing first store level (ensures player knows konbini basics first)
- Star rating system: 完璧 (perfect ★★★), いいね (good ★★☆), もう少し (keep practicing ★☆☆)
- All-seasons completion celebration: 全季節クリア! bonus message

**Files modified:** sprites.js, npc.js, engine.js, game.js

### 2026-03-20 -- #16 Politeness Levels
**Commit:** `f62df90`

**What was changed:**
- New NPC "Keiko" the Politeness Coach added to Konbini Street at position (6, 14)
- Custom pixel art sprite: refined woman in navy kimono with gold obi sash, dark upswept hair, white tabi socks
- Pulsing navy-purple bubble indicator with gold up-arrow and triple-line icon (symbolizing three levels)
- 5 complete politeness level lessons covering konbini phrases at all three formality levels:
  1. **Greeting Politeness** - irasshaimase casual vs keigo, three levels of arigatou, gomen vs sumimasen vs moushiwake gozaimasen
  2. **Making Requests** - ohashi wo otsuke shimasu ka (humble keigo pattern), onegai shimasu vs onegai itashimasu, daijoubu desu vs kekkou de gozaimasu
  3. **Having & Existing** - point card omochi desu ka (honorific forms), receipt irimasu ka vs go-nyuuyou, bento atatame masu ka patterns
  4. **Payment Politeness** - de gozaimasu (keigo desu), natural payment levels at konbini, shoushou omachi kudasai vs chotto matte
  5. **The desu/masu System** - i-adjective + desu pattern, verb stem + masu pattern, special keigo verbs (meshiagaru)
- Each lesson has 3 interactive quizzes (15 total quiz exchanges)
- Every question teaches how the same phrase changes across casual/polite/keigo levels
- Grammar pattern explanations: o + verb stem + shimasu (humble), verb stem + masu (polite), de gozaimasu (keigo desu)
- ElevenLabs voice preloading for all politeness-level Japanese phrases
- Correct answers trigger sparkle particles + voice playback + variable reward rolls
- Topic progression tracking: completed topics, star ratings, 5-topic unlock system
- Unlocks after completing 2 store levels
- Star rating: kanpeki (perfect), jouzu (well done), mou sukoshi (keep practicing)
- All-topics completion: keigo masutaa!

**Files modified:** sprites.js, npc.js, engine.js, game.js

### 2026-03-20 -- #15 Regional Dialects (Kansai-ben)
**Commit:** `e3e116c`

**What was changed:**
- New NPC "Takoyaki" the Kansai Dialect Coach added to Konbini Street at position (15, 14)
- Custom pixel art sprite: red headband, black and gold tiger-stripe happi coat (Osaka festival style), wooden geta sandals
- Pulsing red/gold speech-line bubble indicator appears above Takoyaki when player has completed 3+ store levels
- 5 Kansai-ben dialect lessons covering essential Osaka vocabulary in konbini context:
  1. **Kansai Greetings** - maido (hello), ookini (thank you), hona (see ya)
  2. **Kansai Shopping Talk** - nanbo (how much), meccha ee (very good), akan (no good)
  3. **Reactions & Feelings** - honma (really), kamahen (no problem), omoroi (interesting)
  4. **Kansai Konbini Phrases** - ee (good/okay), iran (don't need), chau (wrong/no)
  5. **Grammar Patterns** - ~hen negative form, ya/da copula swap, yarou/darou
- Each lesson has 3 interactive quiz scenarios (15 total quiz exchanges)
- Every question teaches the standard Japanese equivalent of a Kansai expression
- Context explanations with each phrase: etymology, usage, and cultural notes
- Kansai-flavored encouragements: seya! (that's right!), meccha ee! (great!), ookini! (well done!)
- Wrong answer response uses ちゃうちゃう (chau chau = no no!)
- ElevenLabs voice preloading for all Kansai Japanese phrases
- Correct answers trigger sparkle particles + voice playback + variable reward rolls
- Topic progression tracking: completed topics, star ratings, 5-topic unlock system
- Unlocks after completing 3 store levels (requires solid standard Japanese base first)
- Star rating: 完璧 (perfect), ええ感じ (not bad), もうちょい (keep at it)
- All-topics completion message: 関西弁マスター! (Kansai-ben master!)

**Files modified:** sprites.js, npc.js, engine.js, game.js

### 2026-03-20 -- #17 Mini-map ✅
**Commit:** `edfd93f`

**What was added:**
- Pixel-art mini-map overlay in the bottom-left corner of the screen (street map only)
- Shows the entire 20x18 street layout at 3px-per-tile scale with simplified tile coloring
- All 3 stores rendered in their brand colors: 7-Eleven (#d4380d), Lawson (#1a6fc4), FamilyMart (#27ae60)
- Player position shown as blinking red/white dot that tracks movement in real-time
- Store completion indicators: gold checkmark for completed stores, pulsing white dot for available interactions
- Road, sidewalk, grass, trees, fence, benches, street lamps, and vending machines all color-coded
- Semi-transparent dark background (85% opacity) with subtle border
- "MAP" label above the mini-map for clarity
- Automatically hidden during dialogue, stamp card overlay, and phrase book overlay
- Only renders on the street map (map 0) — not inside stores
- renderMiniMap() function added to engine.js, called from game.js render pipeline after HUD

**Files modified:** engine.js, game.js

### 2026-03-21 -- #19 Achievement Badges System
**Commit:** `389d27b`

**What was added:**
- 21 achievement badges across 6 categories with Bronze/Silver/Gold tiers:
  - **Store Milestones** (5): First Purchase, 7-Eleven Fan, Lawson Regular, FamiMa Friend, Konbini Master
  - **Star Excellence** (2): Star Collector (10 stars), Perfectionist (30 stars)
  - **Collection** (4): Stamp Starter, Stamp King, Phrase Hunter, Phrase Encyclopedia, Full Bag
  - **Challenge** (3): Challenger, Hot Streak (3-streak), On Fire (10-streak)
  - **NPC Specialist** (4): Payment Pro, Four Seasons, Kansai Speaker, Keigo Master
  - **Learning** (2): Review Student, Memory Master
- Unique pixel-art icons for each achievement type: bag, crown, star, sparkle, fire, card, leaf, speech, bow, pencil, brain, and store logos
- Achievement gallery overlay accessible via [G] key from street
- Two-column grid layout: unlocked badges show colored borders, icons, names + Japanese; locked badges show description hints and tier labels
- Trophy icon in HUD (top-right, below inventory bag) showing unlocked/total count
- Gold pulsing HUD border when new achievements are unlocked
- Tier-colored unlock notification banner that slides in from top with glow effect and star burst particles
- Notification queue system: if multiple achievements unlock simultaneously, they display one after another
- Achievement checks trigger automatically after: level completion, challenge completion, payment/seasonal/kansai/politeness lesson completion, and review sessions
- Progress bar at bottom of gallery showing overall completion percentage
- Accurate Japanese names for all 21 badges (初めてのお買い物, コンビニマスター, 完璧主義者, etc.)
- Testing hooks: toggleAchievements(), testAchievement()

**Files modified:** npc.js, sprites.js, engine.js, game.js

### 2026-03-21 -- #18 Inventory Bag System
**Commit:** `8e19e50`

**What was added:**
- Full inventory/shopping bag system: 12 konbini items tied to each game level
- Items catalog with accurate Japanese vocabulary:
  - Lv1: ガム (Gamu / Gum) - 7-Eleven
  - Lv2: お茶 (Ocha / Green Tea) - Lawson
  - Lv3: おにぎり (Onigiri / Rice Ball) - FamilyMart
  - Lv4: サンドイッチ (Sandoicchi / Egg Sandwich) - 7-Eleven
  - Lv5: お弁当 (Obento / Bento Box) - Lawson
  - Lv6: スープ (Suupu / Soup) - FamilyMart
  - Lv7: コーヒー (Koohii / Coffee) - 7-Eleven
  - Lv8: ツナマヨおにぎり (Tuna mayo onigiri) - Lawson
  - Lv9: ファミチキ (Famichiki / Fried Chicken) - FamilyMart
  - Lv10: 幕の内弁当 (Makunouchi bento) - 7-Eleven
  - Lv11: ビール (Biiru / Beer) - Lawson
  - Lv12: メロンパン (Meronpan / Melon Bread) - FamilyMart
- Unique 16x16 pixel-art icons for each item type (10 distinct designs)
- Bag icon added to HUD (top-right, below phrase book) with count display
- Gold border on bag icon when new items are uncollected
- Full-screen inventory overlay opened with [I] key on street map
- Each item shows: pixel icon, Japanese name, romaji, English translation
- Store color bars (red/blue/green) indicate which konbini each item is from
- Progress bar and store legend at bottom
- Pulsing NEW indicators on freshly acquired items
- Items auto-added to bag when completing store levels via finishLevel()
- Overlay hidden during dialogue and other overlays; mini-map also hidden when open

**Files modified:** npc.js, sprites.js, engine.js, game.js

### 2026-03-21 — #20 Sound Design ✅
**Commit:** `a355a2b`

**What was added:**
- **Konbini BGM System**: Gentle lo-fi muzak loop with warm chord progressions (C→Dm7→F→G) and pentatonic melody notes. Uses detuned sine waves for dreamy, authentic konbini elevator-music feel. Auto-starts when entering any store, auto-stops when leaving.
- **Register/Scanner Beep**: Sharp "ピッ" barcode scanner sound plays on each correct answer during store interactions. Adds satisfying feedback that reinforces the konbini shopping experience.
- **Item Scan Double-Beep**: Two-tone confirmation beep for scanned items.
- **Bag Rustling**: Synthesized plastic bag crinkle sounds (filtered noise bursts) play when completing a level/purchase. Multiple randomized bursts create realistic texture.
- **Cash Register Ka-Ching**: Classic register sound with percussive "ka" hit followed by bright metallic ring. Plays on purchase completion alongside bag rustle.
- **Coin Drop Sound**: Metallic clink sounds for payment-related correct answers, simulating coins on the counter tray.
- **Street Ambience**: Subtle urban background for overworld — distant traffic hum (filtered low-frequency oscillator) plus city wind texture. Auto-plays when not raining.
- All ambient sounds properly integrate with the mute toggle and weather system (rain takes precedence over street ambience on overworld).
- All sounds use Web Audio API oscillator synthesis — no external audio files needed.

**Sound trigger points:**
- Entering store → stop rain/street ambience, start konbini BGM
- Leaving store → stop BGM, start street ambience (or rain if raining)
- Correct answer in store → register beep alongside correct chime
- Payment correct answer → coin drop + register beep
- Level complete → cash register ka-ching + bag rustle + level complete fanfare
- Mute toggle → stops all ambient loops

**Files modified:** audio.js, game.js

### 2026-03-21 — #21 Mistake Journal ✅
**Commit:** `038d67d`

**What was added:**
- **Mistake Tracking System** (npc.js): `recordMistake()` function captures wrong answers with full context — clerk's Japanese/English question, player's wrong choice, correct answer, and source location. Smart deduplication: repeated mistakes on the same clerk question increment a count and move to front of list. Capped at 50 entries to keep things manageable.
- **Journal Overlay** (sprites.js): Full-screen dark red themed overlay showing all recorded mistakes. Each entry displays: the clerk's Japanese question, wrong answer marked with red ✗, correct answer marked with green ✓, repeat count badges for frequently missed items, and source tags (Main Store, Review, Challenge, Payment, Seasonal, Kansai, Politeness, Listening).
- **Empty State**: Shows encouraging message "No mistakes yet!" with Japanese proverb 「失敗は成功のもと！」("Mistakes are the path to success!"). Rotating motivational tips at the bottom.
- **HUD Icon** (engine.js): Red-themed mistake journal indicator in top-right HUD stack (below achievements) showing current mistake count. Pulsing red border animation when new mistakes are recorded.
- **Full Game Integration** (game.js): 
  - [J] key opens/closes journal overlay from street map
  - [B] key also closes the overlay
  - Mistakes automatically recorded from ALL 8 wrong-answer handlers: main store, spaced repetition review, daily challenge, payment interactions, seasonal items, Kansai dialect, politeness levels, and listening comprehension
  - Minimap hidden while journal is open
  - Marks mistakes as viewed when closing overlay (clears "new" indicator)

**Why it matters for learning:** Research shows that tracking and reviewing errors is one of the most effective metacognitive strategies for language acquisition. The mistake journal transforms wrong answers from frustrating dead-ends into targeted study material, helping players identify their personal weak spots and focus review time where it matters most.

**Files modified:** npc.js, sprites.js, engine.js, game.js

### 2026-03-21 -- #22 Cultural Notes
**Commit:** `9601fc8`

**What was added:**
- **16 Cultural Notes** covering authentic konbini etiquette and customs:
  - Money tray etiquette (kashi-zara) -- place cash on the tray, never hand directly
  - The irasshaimase greeting ritual -- no reply needed, just a nod
  - Both-hands rule -- giving/receiving with both hands shows respect
  - Bag charge law (2020) -- 3-5 yen per bag, bring your mai-baggu
  - Point cards (T-Point, Ponta, dPoint) -- "nai desu" is fine for tourists
  - No eating in aisles -- use the eat-in corner or eat outside
  - Quiet atmosphere -- match the soft, calm environment
  - Heated food ("atatame-masuka?") -- clerks microwave bento for you
  - Chopsticks check ("ohashi wa otsukai desu ka?")
  - Age verification -- legal age is 20, not 18 or 21
  - Door chime melodies -- each chain has a unique tune
  - Receipt ritual -- "daijoubu desu" to politely decline
  - Coin counting is OK -- take your time, clerks are patient
  - Arigatou timing -- say thanks when receiving your bag, not when entering
  - Oshibori (hot towels) -- included with some hot food purchases
  - Konbini ATMs -- 7-Eleven's "Seven Bank" accepts international cards
- **Golden scroll-themed popup banners** slide in from top during gameplay with "DID YOU KNOW?" header, Japanese + English title, word-wrapped explanation text, and [A] dismiss hint
- **Context-aware triggers**: notes appear after store entry greetings (store_entry context), correct quiz answers (checkout context), and level completion (general context)
- **Smart rate limiting**: 40% chance per trigger, 45-second cooldown between notes, no duplicates
- **Collection overlay** via [C] key: full-screen golden parchment-themed grid showing all 16 notes in 2 columns. Discovered notes show Japanese + English titles; undiscovered show "???"
- **HUD icon**: golden scroll icon with count badge (e.g., "0/16") in top-right stack below mistake journal. Pulses when new notes are discovered
- All notes have context tags for relevant triggering (payment, store_entry, checkout, food, general, greeting)

**Why it matters for learning:** Language learning without cultural context produces speakers who are technically correct but socially awkward. These notes teach the invisible rules that make the difference between a tourist and someone who truly understands Japanese konbini culture -- exactly the kind of knowledge that impresses Japanese people.

**Files modified:** npc.js, sprites.js, engine.js, game.js (532 lines added)

### 2026-03-21 -- #23 Speed Round
**Commit:** `6449420`

**What was added:**
- **Hayate NPC (速い)** — sporty new character with blue jacket + orange headband sprite on Konbini Street. Name means "fast" — perfect for the speed challenge master.
- **5-question rapid-fire quiz**: Hayate pulls from the player's tracked phrases and tests recall under time pressure. Each question has 8 seconds on the clock.
- **Animated countdown timer bar**: Renders above the dialogue box, transitions green→yellow→red as time runs out, with pulsing urgency animation when below 25%.
- **Timeout mechanic**: Running out of time counts as a wrong answer with 「時間切れ!」("Time's up!") message — keeps the pressure real.
- **Quick encouragements**: Between questions, brief Japanese praise flashes (正解! いいね! 速い! バッチリ!) then immediately moves to next question — no momentum-killing pauses.
- **Japanese performance ratings** at round end:
  - 5/5: 電光石火 (Lightning Speed)
  - 4/5: 速い！(Fast!)
  - 3/5: まあまあ (So-so)
  - 0-2/5: もっと練習しよう (Let's practice more)
- **Persistent stats tracking**: Best score, total elapsed time, and rounds completed stored in NPC state.
- **45-second cooldown** between rounds prevents spamming, requires 4+ tracked phrases to activate.
- **Full system integration**: Works with spaced repetition weighting, records to mistake journal on wrong answers, checks achievement thresholds after each round.
- **Speed bubble indicator**: Animated ⚡ bubble above Hayate when a speed round is available.

**Why it matters for learning:** Timed recall is one of the most effective techniques for moving vocabulary from recognition to true fluency. When learners must retrieve Japanese phrases under pressure, it builds the kind of automatic recall needed for real konbini conversations — where the clerk won't wait 30 seconds for you to remember the right response. The competitive element (beating your own score) creates intrinsic motivation to keep practicing.

**Files modified:** npc.js, sprites.js, engine.js, game.js (537 lines added)

### 2026-03-23 -- #24 Pronunciation Guide
**Commit:** `925ab4f`

**What was added:**
- **Akiko NPC (音子 = "sound child")** — new purple-haired, purple-dressed Pronunciation Guide on Konbini Street at position (3, 12)
- **12 key konbini phrases** with complete mora-by-mora pitch accent data based on Tokyo standard dialect:
  - いらっしゃいませ (heiban), おはし (atamadaka), おつり (odaka), お弁当 (nakadaka), レジ袋 (heiban), ポイントカード (nakadaka), あたため (nakadaka), 大丈夫 (heiban), おねがいします (heiban), ありがとう (odaka), すみません (heiban), いただきます (nakadaka)
- **Visual pitch diagrams**: H/L dots connected by lines showing exact pitch contour for each phrase
- **All 4 accent types** covered: 平板 (heiban), 頭高 (atamadaka), 中高 (nakadaka), 尾高 (odaka)
- **Lesson mode**: Browse phrases with [A], replay audio with [Space], close with [B]
- **Quiz mode [P]**: 3-question quiz identifying accent patterns from 3 choices using [1/2/3] keys
- Wrong answers recorded to mistake journal; correct answers trigger playCorrect sound
- Purple-themed overlay UI (dark purple background, pink accents) matching Akiko's design
- Pronunciation bubble indicator with musical note icon above Akiko when ready
- Requires completing 1 store level to activate
- Stats tracking: lessons viewed, quiz attempts, correct answers

**Why it matters for learning:** Pitch accent is the single biggest factor separating "textbook Japanese" from natural-sounding speech. Most learners never practice it because it's invisible in written text. This feature makes pitch patterns visible and quizzable, building the kind of prosodic awareness that makes Japanese people genuinely impressed by a learner's pronunciation.

**Files modified:** npc.js, sprites.js, engine.js, game.js (762 lines added)

### 2026-03-23 -- #25 Save/Load System
**Commit:** `6debd2b`

**What was added:**
- **Full game state persistence** via localStorage -- all progress survives page reload, browser close, and device restart
- **16 state systems serialized**: store progress (levels, stars), spaced repetition tracker (phrase mastery, intervals, correct streaks), mistake journal (wrong answers with context), cultural notes (seen notes), challenge stats (best streak, completed count), variable rewards (collected bonus phrases), stamp cards (tier per level per store), payment practice progress, seasonal lesson progress, Kansai dialect progress, politeness lesson progress, inventory bag (items collected per level), achievement badges (unlocked set), speed round stats (best score, total attempts), pronunciation guide state (lessons viewed, quiz stats)
- **Auto-save triggers** at every meaningful checkpoint:
  - After completing any store level (finishLevel)
  - After finishing review sessions (Review Sensei)
  - After completing daily challenges (Challenge Master)
  - After payment practice (Reiko)
  - After seasonal lessons (Obaa-chan)
  - After Kansai dialect lessons (Takoyaki)
  - After politeness lessons (Keiko)
  - After speed rounds (Hayate)
  - When exiting any store back to the street
- **Green "SAVED" indicator** flashes in bottom-right corner for 2 seconds after each auto-save, then fades out
- **Title screen menu** when save data exists: CONTINUE (default, highlighted gold) / NEW GAME options with arrow-key navigation and blinking cursor
- **New Game clears save data** to prevent stale state from interfering
- **Save info API** (getSaveInfo) returns saved timestamp, completed levels, and total stars for potential future use
- **Error handling**: graceful fallback if localStorage is unavailable or corrupted; save version field for future migration
- **Round-trip tested**: save -> reload -> load -> verify all state matches exactly

**Why it matters:** This was the single most impactful quality-of-life improvement possible. Before this change, ALL progress was lost every time the page reloaded. Players who completed levels, earned stamps, collected phrases, or made progress through any NPC interaction would lose everything. Now the game auto-saves silently at every checkpoint, and the Pokemon-style CONTINUE/NEW GAME menu makes it feel like a real game cartridge. This removes the #1 barrier to long-term engagement with the learning content.

**Files modified:** npc.js, engine.js, game.js (~400 lines added)

### 2026-04-01 -- #26 Conversation Practice Mode
**Commit:** `b5d08fd`

**What was added:**
- **Yuri NPC** -- new Conversation Coach character on Konbini Street at position (11, 9). Custom pixel art sprite: orange cardigan, brown hair, clipboard in hand.
- **5 multi-turn conversation scenarios** covering common konbini interactions from start to finish:
  1. **Buying Coffee** (コーヒーを買う) -- 4 turns: greeting, order confirmation, payment method, receipt/farewell
  2. **Buying a Bento** (お弁当を買う) -- 4 turns: greeting, warming offer, chopsticks, payment
  3. **Asking for Bathroom** (トイレを聞く) -- 3 turns: approaching clerk, asking politely, thanking
  4. **Buying Hot Food** (ホットスナック) -- 4 turns: ordering from hot case, quantity, sauce/condiments, payment
  5. **Buying Alcohol** (お酒を買う) -- 4 turns: selection, age verification screen tap, payment, farewell
- **Multi-turn conversation flow**: Clerk speaks Japanese (with ElevenLabs voice) -> English translation shown -> context hint -> player picks from 3 multiple-choice responses -> feedback (correct/wrong) -> next turn
- **Scenario selection overlay**: When interacting with Yuri, a full menu shows all 5 scenarios with emoji icons, Japanese titles, difficulty stars, and completion status
- **Conversation bubble indicator**: Orange speech bubble with conversation icon above Yuri when conversation practice is available
- **Correct answer tracking**: Per-scenario completion, total correct/attempted stats
- **Full system integration**: Sparkle particles on correct answers, ElevenLabs voice preloading for all scenario phrases, variable reward rolls, mistake journal recording on wrong answers, auto-save after scenario completion
- **Save/load support**: Conversation state (completed scenarios, stats) serialized via getFullState/loadFullState
- **Activation requirement**: Requires completing 1+ store levels

**Why it matters for learning:** Single-question quizzes test isolated vocabulary, but real konbini conversations require stringing together multiple responses in sequence -- understanding the clerk's greeting, confirming your order, handling payment, and saying goodbye. This mode bridges the gap between knowing individual phrases and handling a complete interaction. Players practice the full flow they'll actually experience in a Japanese konbini, building the confidence and automaticity needed for real-world encounters.

**Files modified:** npc.js, sprites.js, engine.js, game.js (~794 lines added)

### 2026-04-01 -- #27 Onomatopoeia Coach NPC (Mimi)
**Commit:** `c200d54`

**What was added:**
- **Mimi NPC** -- new Onomatopoeia Coach character on Konbini Street at position (18, 10). Custom pixel art sprite: vibrant pink hair, teal headphones, pink/teal sound wave theme.
- **5 onomatopoeia lesson topics** with 3 quizzes each (15 total questions):
  1. **Konbini Sounds** (コンビニの音) -- ピッピッ (scanner beep), チン (microwave ding), ガチャ (mechanical clunk)
  2. **Food Textures** (食感) -- サクサク (crispy), フワフワ (fluffy), モチモチ (chewy)
  3. **Eating & Drinking** (食べる・飲む) -- ゴクゴク (gulping), ペコペコ (hungry), パクパク (chomping)
  4. **Feelings & States** (気持ち) -- ワクワク (excited), ドキドキ (heartbeat), ニコニコ (smiling)
  5. **Drinks & Fizz** (飲み物の音) -- シュワシュワ (fizzy), ホカホカ (warm/steamy), トロトロ (melty/creamy)
- **Cultural connections** woven into quiz explanations: Pac-Man named from パクパク, Niconico from ニコニコ, チンする as everyday verb for microwaving, ガチャポン capsule machines from ガチャ+ポン
- **Teal bubble indicator** with sound wave icon (3 vertical bars) pulsing above Mimi when practice is ready
- **Full quiz flow**: Intro dialogue -> Japanese phrase with romaji/English -> quiz question -> 3 shuffled options -> correct/wrong feedback with detailed explanations -> lesson completion rating (★★★/★★☆/★☆☆)
- **System integration**: ElevenLabs voice preloading for all Japanese phrases, sparkle particles + register beep on correct, variable reward rolls, mistake journal for wrong answers, auto-save after lesson completion
- **Save/load support**: Onomatopoeia state (completed topics, lesson count) serialized via getFullState/loadFullState
- **Activation requirement**: Requires completing 1+ store levels

**Why it matters for learning:** Japanese has one of the world's richest onomatopoeia systems (~4,500 words), yet textbooks barely cover them. They're everywhere in daily speech -- food packaging (サクサク、モチモチ), manga (ドキドキ、ワクワク), and konbini interactions (チンしますか？). Knowing these words is the difference between textbook Japanese and natural-sounding Japanese. Japanese people are genuinely impressed when foreigners use onomatopoeia correctly, because it signals deep cultural understanding beyond vocabulary drills.

**Files modified:** npc.js, sprites.js, engine.js, game.js (~604 lines added)

### 2026-04-01 -- #28 Night Shift Mode (Salaryman Suzuki)
**Commit:** `106ae79`

**What was added:**
- **Suzuki NPC** -- a tired salaryman who only appears during the night phase of the day/night cycle. Custom pixel art sprite: dark messy hair, rumpled navy suit, loosened red tie, holding a green Strong Zero can, black shoes. Positioned at (9, 14) on Konbini Street.
- **Time-of-day NPC filtering** -- `getNPCsOnMap()`, `getNPCAt()`, and `isNPCBlocking()` now check an `isNPCVisible()` helper that hides night-shift NPCs during non-night phases. Uses the existing `Engine.getTimeOfDay()` system (120s full cycle, night = 35%-65% of cycle).
- **4 night lesson topics** with 3 quizzes each (12 total questions):
  1. **Late-Night Drinks** (深夜の飲み物) -- ストロングゼロ (Strong Zero), 年齢確認 (age verification), おつまみ (drinking snacks)
  2. **Midnight Munchies** (深夜の食べ物) -- 肉まん (nikuman), おでん (oden ordering), 温めますか (heating food)
  3. **Salaryman Survival** (サラリーマンのサバイバル) -- おつかれさまです, 終電 (last train), 飲み会 (nomikai)
  4. **Midnight Konbini Culture** (深夜のコンビニ文化) -- いってらっしゃい/いってきます, warm vs cold drink labels, no late-night surcharge fact
- **Salaryman personality** in dialogue: tired humor, Strong Zero references, *yawn* and *hic* actions, night owl encouragements
- **Full quiz flow**: Night-themed intro -> Japanese phrase with romaji/English + cultural tip -> quiz question -> 3 shuffled options -> correct/wrong feedback with detailed explanations -> lesson completion with ★ rating
- **System integration**: ElevenLabs voice preloading, sparkle particles + register beep on correct, variable reward rolls, mistake journal for wrong answers, auto-save after lesson completion
- **Save/load support**: Night shift state (completed topics, lesson count) serialized via getFullState/loadFullState
- **Activation requirement**: Requires completing 2+ store levels (higher than other NPCs since this is intermediate content)

**Why it matters for learning:** 40% of konbini sales happen between 10PM-6AM, yet no Japanese learning resource covers late-night konbini culture. This teaches vocabulary and phrases that salarymen and night owls use daily -- ordering nikuman, understanding age verification for alcohol, knowing おつかれさまです (the most important phrase in Japanese work culture), and navigating the unique midnight konbini atmosphere. The time-gated NPC adds discovery and mystery -- players have to wait for night to find Suzuki, creating a memorable learning moment.

**Files modified:** npc.js, sprites.js, game.js (~539 lines added)

### 2026-04-01 -- #29 Global Combo Counter
**Commit:** `26594ba`

**What was added:**
- **Cross-quiz combo streak system** -- tracks consecutive correct answers across ALL quiz types (store levels, challenges, reviews, speed rounds, pitch quizzes, conversation practice, onomatopoeia, night shift). Any correct answer increments the combo; any wrong answer resets it to zero.
- **5 escalating visual tiers** with distinct color schemes:
  1. **Teal** (2-4x) -- cool, understated pulsing counter
  2. **Gold** (5-9x) -- warm golden glow, milestone banner: "いいね!" (Nice!)
  3. **Orange** (10-14x) -- hot orange with stronger glow, milestone: "すごい!" (Amazing!)
  4. **Red** (15-19x) -- fire red with star decorations, milestone: "燃えろ!" (Burn it up!)
  5. **Purple** (20+x) -- legendary tier with intense glow + stars, milestone: "伝説的!" (Legendary!)
- **Animated combo pill** in top-right HUD area -- scales with tier (stronger pulse at higher combos), glow effects at tier 2+
- **Milestone banners** at 5/10/15/20/25/30/40/50 with slide-in animation, Japanese encouragement text, and star burst particle effects
- **45-second inactivity decay** -- combo resets if no answers within 45 seconds, preventing stale combos across sessions
- **Centralized hook system** -- `onCorrectAnswer()` and `onWrongAnswer()` functions called at all 13 correct-answer and 14 wrong-answer code sites (including pitch quiz wrong path that didn't previously have a sound)
- **Overlay awareness** -- combo counter and milestone banners hidden during stamp card, phrase book, inventory, achievement, mistake journal, and cultural notes overlays
- **Testing hook**: `window.setCombo(n)` for visual debugging

**Why it matters for learning:** Combo counters are one of the most psychologically powerful game mechanics for sustained engagement. The escalating visual feedback (color shifts, particle effects, Japanese exclamations) creates a "flow state" where players push to maintain their streak, naturally increasing focus and reducing careless answers. The 45-second decay timer prevents gaming the system while keeping reasonable pauses between questions. The Japanese milestone messages (いいね → すごい → 燃えろ → 伝説的) also serve as vocabulary exposure -- players learn these common exclamations through emotional association rather than explicit study, which is how native speakers actually acquire them.

**Files modified:** game.js, sprites.js (~226 lines added)

### 2026-04-02 -- #30 Progress Dashboard
**Commit:** `97f89cb`

**What was added:**
- **Full-screen progress dashboard overlay** accessible via [P] key from the street map -- a comprehensive stats screen aggregating data from all 16 game subsystems into one beautiful view.
- **Overall accuracy circle** -- large animated ring chart showing lifetime correct/total answer percentage with Japanese label (正答率) and letter grade (S/A/B/C/D) based on performance.
- **Store progress section** -- individual progress bars for 7-Eleven, Lawson, and FamilyMart showing levels completed vs total (12 levels), with star counts and brand-colored bars.
- **Collection stats** -- stamp cards collected, phrases learned, inventory items, cultural notes discovered, and achievement badges unlocked, each with progress fraction and visual bar.
- **NPC lesson tracker** -- shows completion for all 9 NPC lesson systems: Payment (Reiko), Seasonal (Obaa-chan), Kansai (Takoyaki), Politeness (Keiko), Speed Round (Hayate), Pronunciation (Akiko), Conversation (Yuri), Onomatopoeia (Mimi), and Night Shift (Suzuki).
- **Challenge & review stats** -- daily challenge best streak, review sessions completed, mistake journal entry count, and global combo best streak.
- **Section headers** with Japanese labels: 全体の正答率 (Overall Accuracy), 店舗の進捗 (Store Progress), コレクション (Collections), NPCレッスン (NPC Lessons), チャレンジ (Challenges).
- **Dark semi-transparent overlay** with scrollable layout, soft rounded-corner section cards, and consistent color theming matching each system's brand colors.
- **Title bar** with Japanese + English: 「学習の進捗 PROGRESS」
- **HUD integration** -- overlay hides minimap, combo counter, and cultural note popups while open. Closes with [P] or [B] key.
- **getProgressDashboard()** in npc.js aggregates data from: store progress, spaced repetition tracker, stamp cards, phrase book, inventory bag, cultural notes, achievement badges, challenge stats, mistake journal, combo counter, and all 9 NPC lesson state objects.
- **Testing hook**: `window.toggleProgressDash()` for debugging.

**Why it matters for learning:** Research in educational psychology shows that visible progress tracking is one of the strongest motivators for continued learning. Players can now see exactly how far they've come across every dimension of the game -- store completions, NPC lessons, collections, accuracy rates, and challenge performance. This creates a sense of accomplishment that fights the "am I actually learning?" doubt that causes most language learners to quit. The dashboard also helps players identify which areas they haven't explored yet, naturally guiding them toward underused features like pronunciation practice or cultural notes.

**Files modified:** npc.js, sprites.js, game.js (~480 lines added)

### 2026-04-02 -- #31 Location Name Banners
**Commit:** `269d6c8`

**What was added:**
- **Pokemon-style location name banners** that slide in from the right when entering or exiting stores -- just like Pokemon games display area names when entering a new town or route.
- **Store entry banners** show the store's Japanese name in large text (e.g., "セブンイレブン") with the English name below ("7-Eleven") in the store's brand color.
- **Brand-colored theming** -- each store's banner uses its signature color: 7-Eleven (red #d4380d), Lawson (blue #1a6fc4), FamilyMart (green #27ae60). Accent lines at top and bottom of the banner, decorative diamond marker, and gradient effects all use the brand color.
- **Street return banner** -- when exiting a store back to Konbini Street, a gold-themed banner appears showing "コンビニ通り / Konbini Street."
- **Smooth cubic-eased animations** -- banner slides in with ease-out timing (0.4s), holds visible for 2 seconds, then slides out with ease-in timing (0.4s). Total duration 3.2 seconds.
- **Visual design details**: Dark semi-transparent background (rgba 10,10,30 at 92%), white Japanese text in rounded font, colored English text in pixel font, decorative diamond shape on the left edge, subtle brand-color gradient on the right edge.
- **Proper render ordering** -- banner renders above the game scene and particles but below the sliding door animation and fade overlay, so transitions look natural.
- **Testing hook**: `window.testLocationBanner('7-Eleven')` (also accepts 'Lawson', 'FamilyMart', 'street').

**Why it matters for learning:** Location banners are a signature feature of Pokemon games that create a sense of arrival and significance when entering a new area. This reinforces the store name association in both Japanese and English every time the player enters -- passive katakana reading practice that happens naturally during gameplay. The Japanese katakana rendering of store names (セブンイレブン, ローソン, ファミリーマート) gives players authentic exposure to how these brands are written in Japan, building real-world recognition for when they visit actual Japanese konbinis. The banner also creates a brief moment of anticipation before the clerk greeting, making each store visit feel like entering a new Pokemon area.

**Files modified:** engine.js, game.js (~150 lines added)

### 2026-04-02 -- #32 Interactive Tutorial Bubbles
**Commit:** `67a068c`

**What was added:**
- **Contextual tutorial bubble system** that teaches players through play at the exact moment they need each hint -- following BBC GEL and GameRefinery onboarding best practices.
- **7 tutorial trigger points** covering the full new-player journey:
  1. **First steps** ("Use arrow keys to explore! / Find a konbini to start learning") -- appears 1.5 seconds after first game start
  2. **Near store door** ("Press Z to enter the store! / Your Japanese journey begins here") -- triggers when player walks within 2 tiles of a store entrance
  3. **Near NPC** ("Press Z to talk to NPCs! / Each one teaches something new") -- triggers when player walks within 2 tiles of a street NPC
  4. **First quiz** ("Arrows to pick, Z to go! / Listen to the clerk carefully") -- appears when the first quiz choice is presented
  5. **First correct answer** ("Great job! Keep going! / Build combos with correct answers") -- appears after the player's first correct answer
  6. **Store exit** ("Press P for progress dashboard / Track your Japanese learning") -- appears after first store exit
  7. **Hotkeys guide** ("Q=Phrases I=Bag G=Badges / J=Journal C=Notes Tab=Card") -- queued after the store exit tutorial
- **One-time display** -- each tutorial shows exactly once per player, tracked in localStorage. Returning players never see them again.
- **Visual design**: Dark purple gradient bubbles (#2a1f5e to #1a1240) with gold (#f1c40f) border. Pulsing key icon animation for actionable hints. Smooth 0.3s fade-in and 0.5s fade-out. Gentle bobbing motion.
- **Auto-clamping** -- bubbles automatically stay within canvas bounds to prevent text overflow on the 256px-wide game canvas.
- **Testing hooks**: `window.testTutorial('nearDoor')` to preview any tutorial, `window.resetTutorials()` to clear all seen flags.

**Why it matters for learning:** Research consistently shows that the #1 cause of player drop-off in educational games is confusion during the first 60 seconds. Without guidance, new players don't know they can enter stores, talk to NPCs, or how to use the quiz system. This tutorial system solves that by teaching through play -- each hint appears naturally at the exact moment the player encounters a new mechanic. The one-time-only display ensures experienced players are never interrupted. The hotkeys guide also surfaces hidden features (phrase book, inventory, journal, cultural notes, stamp card) that many players would otherwise never discover, dramatically increasing engagement with the game's learning systems.

**Files modified:** engine.js, game.js (~305 lines added)

### 2026-04-02 -- #33 Weather-Based Street Encounters
**Commit:** `e386a75`

**What was added:**
- **Two weather-conditional NPCs** that dynamically appear and disappear on the street based on the current weather state, creating a living world that changes with the seasons and weather.
- **Ame-chan** (雨ちゃん) -- a rain-loving character in a yellow raincoat with a blue umbrella who appears ONLY during rain weather. Teaches essential rain/umbrella vocabulary:
  - 雨が降っていますね (ame ga futte imasu ne) -- "It's raining!"
  - 傘はお持ちですか？(kasa wa omochi desu ka?) -- "Do you have an umbrella?"
  - コンビニでビニール傘を買えますよ (konbini de biniiru-gasa wo kaemasu yo) -- "You can buy a plastic umbrella at the konbini!"
  - 雨 (ame) = rain, 傘 (kasa) = umbrella, ビニール傘 (biniiru-gasa) = plastic umbrella
- **Sakura-san** (桜さん) -- a hanami enthusiast in a pink kimono with a flower in her hair who appears ONLY during cherry blossom weather. Teaches cherry blossom and seasonal vocabulary:
  - 桜がきれいですね (sakura ga kirei desu ne) -- "The cherry blossoms are beautiful!"
  - お花見 (ohanami) = flower viewing, a beloved spring tradition
  - コンビニでお花見用のお弁当やおにぎりを買えますよ -- "You can buy hanami bento and onigiri at the konbini!"
  - 桜の季節 (sakura no kisetsu) = cherry blossom season
- **Pixel art sprites**: Ame-chan has a detailed yellow raincoat, blue umbrella on head, and red rain boots. Sakura-san has dark hair with a pink flower, pink spring kimono.
- **Weather visibility system**: Extended `isNPCVisible()` in npc.js to support a `weatherOnly` property. NPCs with this property only render and interact when `Engine.getWeatherType()` matches their specified weather type.
- **Seamless integration**: Weather NPCs naturally cycle with the existing 45-second weather system (clear → cherry_blossoms → rain → clear → cherry_blossoms). They appear/disappear smoothly as weather transitions.

**Why it matters for learning:** Weather is a huge part of Japanese daily conversation, especially around konbinis where people buy umbrellas and seasonal items. These encounters teach vocabulary that textbooks often skip: ビニール傘 (plastic umbrella, a konbini staple), お花見 (hanami/flower viewing), and seasonal food items. By tying vocabulary to weather events, players experience contextual learning -- rain vocabulary appears during rain, cherry blossom vocabulary appears during cherry blossoms. This mirrors real-life Japan where these conversations happen naturally at konbinis during those weather conditions. The dynamic appearance also adds discovery and surprise, rewarding players who explore during different weather states.

**Files modified:** npc.js, sprites.js (~99 lines added)

### 2026-04-02 -- #34 Ambient NPC Speech Bubbles
**Commit:** `1e9d87c`

**What was added:**
- **Ambient speech bubbles** that periodically appear above street NPCs, showing context-appropriate Japanese phrases. Each bubble displays Japanese text on top with English translation below, fades in/out smoothly, and gently floats for an organic feel.
- **40+ phrases across 15 NPC types**, each tailored to the character's role and personality:
  - Sensei: fukushuu wa daiji desu yo, mainichi renshuu shimashou, ganbatte!
  - Old Man: kyou mo ii tenki ja, washi no wakai koro wa, foffofo
  - Schoolgirl: yabai! chikoku suru!, maji de? ukeru!, purikura toritai
  - Businessman: otsukaresama desu, kaigi ni okureru!, koohii nomitai, zangyou ka...
  - Kansai coach: nandeyanen!, meccha ee yan, ookini
  - Onomatopoeia coach: wakuwaku, pikapika, dokidoki
  - Night salaryman: tsukareta, ippai nomitai, shuuden daijoubu kana
  - Weather NPCs (Ame-chan, Sakura-san): contextual rain/cherry blossom phrases
  - Plus politeness, pronunciation, conversation, speed, payment, seasonal, and challenger coaches
- **Smart scheduling**: each NPC has a random 8-28 second initial cooldown, then 12-30 second cooldowns between bubbles. This creates natural staggered conversation across the street rather than synchronized popups.
- **Rendering**: white rounded bubbles with a triangle pointer, soft shadow, fade animation, gentle floating motion. Japanese text in 7px Press Start 2P, English in 5px gray.
- **Smart positioning**: bubbles clamp to screen edges so they never get cut off, even when NPCs are at the edges of the visible area.

**Why it matters for learning:** Passive exposure is one of the most powerful techniques in language acquisition. By overhearing realistic phrases that real people in Japan would say in everyday situations, players absorb natural Japanese without explicit study. The phrases capture authentic registers: salaryman fatigue ("kyou mo zangyou ka"), schoolgirl slang ("yabai", "ukeru"), elderly speech patterns ("ja", "nou"), Kansai dialect ("nandeyanen", "ookini"), and konbini-relevant utterances ("koohii nomitai", "kasa wasurechatta"). This creates a living Japanese street where players feel immersed in the language. It also reinforces phrases learned elsewhere in the game by hearing them used naturally in context, which is the gold standard for retention.

**Files modified:** npc.js (phrase pools + state), engine.js (rendering), game.js (update loop hook). 227 lines added.

### 2026-05-01 -- #35 Reaction Emotes for Quiz Answers
**Commit:** `75028f3`

**What was added:**
- **Pokemon-style 8-bit reaction emotes** that pop above the quiz dialogue area when the player answers a question. Each emote uses a satisfying squash-and-stretch pop-in animation, gentle horizontal bobble, then fades smoothly.
- **Five distinct kawaii sprites** drawn pixel-by-pixel as 16x16 fillRect art:
  - **Happy face** (yellow, closed-eye smile ^^, pink cheeks) -- correct answers
  - **Sweatdrop** (anime-style light blue teardrop with white shine) -- wrong answers
  - **Heart** (pink kawaii heart with shine) -- correct answer during a small combo (every 3rd in a streak)
  - **Fire** (red/orange/yellow flame with white-hot core) -- correct answer in a 5+ combo streak
  - **Star** (golden 5-pointed star with highlight) -- combo milestones (10, 20, 30...)
- **Combo-aware feedback logic** in `onCorrectAnswer`/`onWrongAnswer`:
  - Wrong → sweatdrop
  - Combo milestone hit → star (celebratory)
  - Combo >= 5 and divisible by 5 → fire (streak intensity)
  - Combo > 0 and divisible by 3 → heart (sweet reward)
  - Otherwise → happy
- **Pop-in animation** uses an overshoot bounce: scale starts at 0.4, peaks above 1.0 with `sin(popPhase * PI) * 0.25`, settles at 1.0. Combined with horizontal bobble (`sin(time * 4 + bobble) * 1.5`), the emotes feel alive and responsive.
- **Sweatdrop falls** (positive vy + gravity) while celebratory emotes rise (negative vy with slight gravity), reinforcing the emotional valence visually.

**Why it matters for learning:** Immediate visual feedback is one of the most powerful tools in skill acquisition. Studies of educational games show that anthropomorphic, expressive reactions to player input significantly boost engagement and retention versus dry "correct/incorrect" markers. The kawaii emotes give players micro-doses of dopamine on every correct answer (mimicking the Pokemon games' satisfying battle reactions), and the combo-tier emotes (heart → fire → star) create a sense of escalating reward that makes long study sessions feel cinematic rather than grindy. Sweatdrops on wrong answers are gentle and humorous rather than punitive, keeping learners psychologically safe. The variety also creates surprise: players don't know which emote they'll get, so each correct answer carries a tiny reveal moment, the same hook that makes slot machines (and Pokemon battles) addictive in a positive way.

**Files modified:** engine.js (+253 lines: spawnEmote, renderEmote, 5 draw functions, particle render branch, export), game.js (+13 lines: combo-aware emote spawn calls in onCorrectAnswer/onWrongAnswer).

### 2026-05-01 -- #36 Konbini Service Counter (Tetsuya, the Lifeline Clerk)
**Commit:** `d047952`

**What was added:**
- **New NPC: Tetsuya, the Lifeline Clerk** — placed on the konbini street at (2,10), wearing a blue service-counter uniform with a gold service tag and holding a clipboard/parcel. Pixel-art sprite drawn from scratch in the kawaii 8-bit style (16x16, palette of dark navy hat, blue uniform vest, cream parcel, gold tag, dark slacks).
- **Four authentic service-counter scenarios** covering the most important (and least obvious) konbini transactions Japanese learners need:
  - 💰 **公共料金の支払い (Bill Payment)** — 3 turns. Players learn 払込お願いします to hand over a barcode bill, that bill payments are CASH ONLY at konbini (no card, no Suica), and to always keep the 領収書 receipt as proof.
  - 📦 **宅配便の受け取り (Package Pickup)** — 4 turns. Players learn 荷物の受け取りに来ました and コンビニ受け取りです to announce pickup, present a QR code with こちらです, give their name in humble keigo (〜と申します vs 〜です), and sign the slip.
  - 🏧 **コンビニATMを使う (Konbini ATM)** — 4 turns. Players learn お引き出し (withdraw) vs 預け入れ (deposit) vs 残高照会 (balance inquiry), what 暗証番号 (PIN) means, how to read 一万円 (10,000 yen — Japanese counts in 万 units, not thousands), and emergency phrases for stuck cards (ATMにカードが詰まりました).
  - 🎫 **チケットを買う (Concert Ticket)** — 5 turns. Players learn to hand over a Loppi 申込券 with これお願いします, read prices like 八千五百円 (8,500 yen), discover that tickets accept クレジットカード (unlike bills), respond 一括で (lump sum, required for most foreign cards), and end with the fluent flair phrase 楽しみにしています.
- **Service Counter selection menu** (`drawServiceCounterMenu` in sprites.js) — a blue-themed parallel to the orange Conversation Practice menu. Shows サービスカウンター Service Counter title, completed count and score, all 4 scenarios with emoji + Japanese title + English title, difficulty dots (1–3 stars), and ✓ checkmarks once completed.
- **Full quiz flow in game.js** modeled after the conversation coach: `interactWithServiceCoach` → menu → `startServiceCounterScenario` → `runServiceCounterTurn` → `showServiceCounterQuiz` → `handleServiceCounterAnswer` → `finishServiceCounter`. Each turn supports clerk lines (with TTS speech), narrator lines, and player-start prompts. Correct answers trigger sparkles + register beep + variable rewards + Japanese encouragements (正解!, スムーズ!, サービス上手!). Wrong answers flash red, log to the mistake journal with `source: 'ServiceCounter'`, and show the cultural explanation so players learn from each miss.
- **Progression gate**: NPC requires 2+ levels completed to unlock the menu (matching difficulty 2 — these are intermediate skills). Before that, Tetsuya gives a teaser dialogue.
- **Save/load persistence** — `serviceCounterState` (scenarios completed, practice count, totals, last practice time) integrated into the existing `localStorage` save system at npc.js. Survives reloads.
- **End-game rewards** — completing all 4 scenarios shows サービスマスター! "You've mastered all konbini services!" and triggers the achievement-check pipeline.

**Why it matters for learning:** Most Japanese textbooks (and most other konbini-themed games) ONLY teach the front-counter checkout flow: 〜円になります、レジ袋いりますか、お会計お願いします. But konbini in Japan are a literal lifeline — people pay utility bills, pick up Amazon orders, withdraw cash, buy concert tickets, ship packages, and apply for tax forms there. Knowing only checkout vocabulary leaves learners stranded the moment they walk in holding an electric bill. This update fills that exact gap with linguistically authentic phrases verified against real-world konbini interaction patterns. Each scenario also embeds critical cultural rules that even intermediate textbooks miss: bills are cash-only, foreign cards usually require 一括 (one-time payment), the 領収書 is your only proof of payment, the konbini will print your concert ticket from a Loppi machine after payment, and 一万円 means 10,000 yen because Japanese counts in 万 (man) units. The mistake-journal integration means wrong answers immediately become spaced-repetition material, so a single playthrough of these 4 scenarios builds genuine survival fluency for daily life in Japan.

**Files modified:** npc.js (+251 lines: SERVICE_COUNTER_SCENARIOS, serviceCounterState, 5 service-counter functions, NPC def, save/load hooks, exports). sprites.js (+91 lines: npcServiceCoach pixel-art + palette, npcSprites registration, drawServiceCounterMenu, exports). game.js (+212 lines: serviceCounterMenuOpen state, menu input handler, NPC dispatch, menu render call, mini-map gate, full quiz flow with 7 functions). 554 lines added total.

### 2026-06-01 -- #37 Konbini Receipt System (authentic thermal-paper receipts)
**Commit:** `f933286`

**What was added:**
- **Every level completion now prints a pixel-art konbini receipt** that mirrors the exact format of real Japanese POS systems. The receipt slides in from above after the cash register sound, gives the player time to read the breakdown, and is dismissable with any button before the level-complete dialogue continues.
- **Receipt layout matches real konbini receipts line-for-line:**
  - Store header: Japanese branding (セブンイレブン, ローソン, ファミリーマート) plus English name and branch (渋谷中央店, 新宿駅前店, 原宿店)
  - Transaction metadata: date YYYY/MM/DD HH:MM, receipt number, レジ NN register ID, 担当 cashier line
  - Line item: Japanese product name with reduced-tax asterisk (*), `1 × ¥580`
  - Subtotal/tax block: 小計 + 消費税 with correct rate annotation -- 内税* for 8% 軽減税率 (food/drink) or 内税 for 10% standard rate (alcohol). Tax is shown as informational because konbini use tax-inclusive 内税 pricing, so subtotal == total.
  - Boxed 合計 TOTAL with inverse-color highlight
  - お預かり (tendered) and お釣り (change) computed from realistic rounded denominations
  - ポイント: 1pt per 200 yen + 1 bonus for zero-mistake transactions
  - 軽減税率対象 disclaimer when applicable
  - Polite footer: ありがとうございました / Arigatou gozaimashita! / 又のご来店をお待ちしております
- **Authentic visuals:** off-white thermal paper, jagged perforated edges, faint horizontal tint lines, cubic-ease slide-in animation with gentle bobble, decorative pixel barcode that animates in after the slide completes, blinking [Z] Continue prompt
- **Realistic 2024-2026 konbini prices** added to every item: Gum ¥110, Onigiri ¥150, Bento ¥580, Coffee ¥180, Makunouchi ¥680, Beer ¥270, etc. Beer correctly uses the 10% standard tax rate while all food/non-alcoholic drinks use the 8% 軽減税率 reduced rate.

**Why it matters for learning:** Reading a real Japanese receipt is one of the most-overlooked survival skills for living in Japan. Every transaction at every konbini, supermarket, restaurant, and store ends with a receipt the player needs to scan for 合計 (total), 内税 (tax-inclusive) vs 外税 (tax-exclusive), お預かり / お釣り (tendered/change), and the 軽減税率 marker showing which items qualified for the reduced 8% food rate. After 12 levels the player has seen the same vocabulary 12 times in authentic context — far better retention than flashcards. The receipt also teaches the cultural rule embedded in pricing: alcohol jumps from 8% to 10% tax at the konbini register, which is exactly the kind of "wait why did my receipt say something different?" moment that confuses tourists.

**Files modified:** npc.js (+123 lines: priceYen/taxRate on KONBINI_ITEMS, buildReceiptData, formatYen, computeTendered, receipt counter, exports). sprites.js (+236 lines: drawKonbiniReceipt, drawReceiptDivider helper, exports). game.js (+54 lines: state.receiptOverlay, input handler with animation gate, render call, mini-map gate update, finishLevel integration with 700ms printer delay).

### 2026-06-01 -- #38 Customer Queue System (Listening Comprehension on Store Entry)
**What was added:**
- **Sometimes when you enter a konbini, another customer is already at the register** ahead of you. Instead of bumping straight into the clerk greeting, the player now passively listens to a short 3-line exchange between the clerk and the customer in front, then answers ONE quick listening-comprehension question about what they heard.
- **6 authentic queue scenarios** spanning real konbini situations:
  1. **Salaryman ordering hot coffee** -- listening for size + ホット vs アイス
  2. **Obaachan with a bento** -- 温めますか? heat-the-bento question
  3. **Schoolgirl with onigiri** -- 大丈夫です refusing a bag politely
  4. **Older man buying beer** -- 年齢確認 age-verification button at the register
  5. **Businessman paying with PayPay** -- QR-code payment flow
  6. **Tourist requesting chopsticks** -- counter word 〜膳 (zen) for pairs of chopsticks
- **Pokemon-style 3-phase overlay:** slide-in from top with cubic-ease, blue "ご会計中 IN LINE" ribbon banner, cream counter scene with customer sprite on the left + clerk sprite on the right (both with gentle bobble animation), speech bubble appears above the active speaker during dialogue. Lower panel switches between dialogue → listening quiz → result-with-cultural-tip phases. Auto-speaks each Japanese line via the existing GameAudio.speakJapanese pipeline so it's a real listening exercise, not a reading one.
- **45% trigger chance** on store entry once the player has completed at least 1 level (so tutorial flow is uninterrupted), with a 25-second cooldown so back-to-back stores don't both spawn queues. The system prefers scenarios the player hasn't heard yet before shuffling.
- **Full integration with existing systems:** wrong answers log to the mistake journal with `source: 'CustomerQueue'`, correct answers feed the combo counter and award sparkles, all state (encountersCompleted, correctAnswers, totalAttempts, scenariosHeard) survives reload via the existing localStorage save system.

**Why it matters for learning:** Real konbini listening practice is dramatically different from real konbini speaking practice. When you're the one being addressed, the clerk speaks slowly and clearly; when you're standing in line behind another customer, the clerk speaks at full native speed and the customer often mumbles half a phrase plus a head-bow. That's the actual listening environment learners face every day in Japan, and it's the one that breaks even confident JLPT N3 students. This update reproduces that environment exactly: the player has no choice but to passively absorb a natural-pace exchange, then test their comprehension. Each scenario also teaches a cultural rule that flashcards miss -- 大丈夫です as polite refusal, 年齢確認 button protocol for alcohol/cigarettes, 〜膳 as the counter for chopstick pairs, PayPay QR-code etiquette, the difference between 温めますか and 温めましょうか. Six scenarios in rotation means a single playthrough exposes the player to ~30+ authentic clerk-customer utterances they can't hear anywhere else without actually moving to Japan.

**Files modified:** npc.js (+209 lines: CUSTOMER_QUEUE_SCENARIOS array, customerQueueState, shouldTriggerCustomerQueue, buildCustomerQueue, recordCustomerQueueResult, getCustomerQueueStats, pickNextQueueScenario, save/load hooks, exports). sprites.js (+323 lines: drawCustomerQueueOverlay master + drawQueueSpeechBubble + drawQueueDialoguePanel + drawQueueQuestionPanel + drawQueueResultPanel + wrapTextSimple, exports). game.js (+180 lines: state.customerQueue, input handler for all 3 phases, store-entry queue hook with showClerkGreeting extraction, render call, mini-map gate update, window.forceCustomerQueue test hook).

### 2026-06-01 -- #39 Greeting Response Training (Cultural Correction on Store Entry)
**What was added:**
- A new cultural-correction overlay that occasionally fires when the player enters a konbini, BEFORE the standard clerk greeting line. The clerk says one of 6 greeting variants in a kawaii white speech bubble, and the player picks the most natural reply from 4 options ranging from "culturally correct" to "common learner trap."
- **6 authentic greeting scenarios** -- each teaches a specific subrule of konbini greeting etiquette:
  1. **Standard いらっしゃいませ** in a busy chain Lawson (clerk not looking up) -- correct: small silent nod, NOT "arigatou" or "konnichiwa"
  2. **Morning おはようございます + いらっしゃいませ** at a 7am 7-Eleven -- correct: reply おはようございます in the same register (NOT casual おはよう, NOT こんにちは)
  3. **Evening こんばんは + いらっしゃいませ** from a familiar night-shift clerk -- correct: こんばんは (NOT おつかれさまです, which presumes a colleague relationship)
  4. **いらっしゃいませ + こんにちは** at a tiny mom-and-pop shop with eye contact -- correct: こんにちは (the silent-nod rule REVERSES for small shops with eye contact)
  5. **あ、いらっしゃいませ** from a clerk who recognizes you -- correct: smile + nod (NOT お世話になります, NOT またお願いします)
  6. **Rapid double いらっしゃいませ！いらっしゃいませ！** during lunch rush -- correct: walk in silently (NOT すみません, NOT acknowledging both clerks individually)
- **Three-section overlay layout:** purple "挨拶マナー GREETING" top ribbon, counter scene with centered clerk + cash register + white speech bubble showing JP greeting + English subtitle, then a lower panel with two phases:
  - **Question phase:** "どう返事しますか? YOUR REPLY?" header, dim-purple context sentence (2-3 wrapped lines explaining the situation), 4 stacked options each showing JP reply + English subtitle, purple highlight bar + cursor on selected option, "Arrows + [Z]" hint footer
  - **Result phase:** Green "正解! NATURAL!" banner for correct / orange "惜しい! CLOSE -- BUT" for incorrect, "Best reply:" reveals the correct JP option + English, then a yellow "TIP:" section with the full cultural explanation (why each wrong answer is wrong, what subtle rule the right answer follows), [Z] Continue blinking hint
- **40% trigger chance** on store entry (only after the player has completed at least 1 level so tutorial flow stays clean), 30-second cooldown between encounters, prefers scenarios the player hasn't seen yet before shuffling. Mutually exclusive with the #38 Customer Queue overlay -- if the queue fires, the greeting overlay can still follow afterward in the chained-callback flow.
- **Full integration with existing systems:** wrong answers log to the mistake journal with `source: 'GreetingResponse'`, correct answers feed the combo counter and award sparkles, all state (encountersCompleted, correctAnswers, totalAttempts, scenariosShown) survives reload via the existing localStorage save system. Clerk's greeting line auto-speaks once when the question phase first appears so the player hears native-speed pronunciation.

**Why it matters for learning:** This is the SINGLE most counter-intuitive konbini etiquette rule, and the one that marks foreign visitors instantly. Every learner's reflex on hearing いらっしゃいませ is to reply with something polite -- "arigatou gozaimasu", "konnichiwa", even echoing いらっしゃいませ back. All three are technically polite but feel slightly off in a chain konbini, because いらっしゃいませ is a one-way service phrase, not a real greeting. Textbooks and most JLPT courses don't cover this at all -- it's tribal knowledge you only pick up after embarrassing yourself a few times in real Tokyo conbini. The 6 scenarios deliberately span the FULL rulebook:
- When silence is correct (busy chain, rush hour)
- When silence is WRONG (small shop with eye contact, time-specific greeting from clerk)
- Which time-of-day greetings are appropriate at which times (おはようございます vs こんにちは vs こんばんは)
- Which adjacent phrases are tempting but wrong (おつかれさまです, お世話になります, ojama shimasu, またお願いします)
- How to handle the "regular customer" recognition moment (smile beats verbal)

The result-phase TIP for each scenario explains not just the right answer but the structural rule, so the player walks away with transferable knowledge -- after seeing all 6 scenarios they understand the actual mental model native speakers use, not just memorized phrase-reply pairs.

**Files modified:** npc.js (+170 lines: GREETING_RESPONSE_SCENARIOS array with 6 scenarios, greetingResponseState, shouldTriggerGreetingResponse, pickGreetingScenario, buildGreetingResponse, recordGreetingResponseResult, getGreetingResponseStats, save/load hooks, exports). sprites.js (+205 lines: drawGreetingResponseOverlay master + drawGreetingSpeechBubble + drawGreetingQuestionPanel + drawGreetingResultPanel, exports). game.js (+135 lines: state.greetingResponse, full input handler for question + result phases with mistake-journal/combo integration, maybeShowGreetingResponse helper, store-entry chain wiring after customer queue, mini-map gate update, render call, window.forceGreetingResponse test hook).

### 2026-07-01 -- #40 Daily Special Items (Seasonal Limited-Edition Badge Vocabulary)
**What was added:**
- A kawaii "shelf tag" pop-up banner that slides in from the top-right corner ~3.5 seconds after the player enters a konbini (60% chance, after level 1), advertising a limited-edition seasonal product. The banner sits below the existing Pokemon-style location banner so both are readable without overlap.
- **9 seasonal specials** spanning the full Japanese konbini calendar:
  - **Spring (March-May):** 桜餅 sakura mochi (春限定 SPRING ONLY ¥198), いちご大福 strawberry daifuku (新発売 NEW RELEASE ¥248)
  - **Summer (June-August):** ラムネ ramune soda (夏限定 SUMMER ONLY ¥150), かき氷カップ shaved ice cup (期間限定 LIMITED TIME ¥178)
  - **Autumn (September-November):** かぼちゃモンブラン pumpkin Mont Blanc (秋限定 AUTUMN ONLY ¥298), 焼き芋 roasted sweet potato (季節限定 SEASONAL ¥248)
  - **Winter (November-February):** おでん hot pot (冬限定 WINTER ONLY ¥100/個), 肉まん pork bun (期間限定 LIMITED TIME ¥150)
  - **Always-on:** 新味・ツナマヨおにぎり new-flavor tuna-mayo onigiri (新商品 NEW PRODUCT ¥138)
- **Real-world seasonal filtering** -- the banner picks a product whose `months` array includes the current calendar month, so a July playthrough shows summer items and a December playthrough shows winter items. Falls back to the always-on onigiri if nothing matches.
- **Unseen-first rotation** -- prefers specials the player hasn't seen yet in this save, then falls back to any in-season, then any always-on. Progress persists across reloads via the existing localStorage save system (`dailySpecialsState.seenIds` + `lastShownId`).
- **Kawaii banner design** -- creamy `#fff8f0` background with a store-colored top strip carrying the JP badge (期間限定 / 春限定 / 夏限定 / 秋限定 / 冬限定 / 季節限定 / 新発売 / 新商品), a small yellow decorative star, a large `M PLUS Rounded 1c` product name in black, a store-colored English subtitle, the price in bold `#d43a5a` red on the bottom-right, and a small grey English badge translation on the bottom-left. Slide-in 0.4s ease-out + hold 4.5s + slide-out 0.4s so players have time to read the vocabulary.

**Why it matters for learning:** The badge vocabulary on Japanese konbini shelves is one of the highest-frequency reading-comprehension domains in daily life -- learners walk past dozens of these tags every shopping trip but rarely study them, because textbooks focus on sentence-level grammar rather than on POS signage. The 8 badge types this improvement teaches (期間限定 kikan gentei "limited period", 季節限定 kisetsu gentei "seasonal", 春限定/夏限定/秋限定/冬限定 haru/natsu/aki/fuyu gentei "spring/summer/autumn/winter only", 新発売 shin hatsubai "new release", 新商品 shin shouhin "new product", plus 新味 shin aji "new flavor" as a bonus in the onigiri) cover essentially every limited-edition tag a learner will encounter across 7-Eleven, Lawson, and FamilyMart. Pairing each badge with a real seasonal product name gives the vocabulary immediate cultural context: after seeing this banner five times a learner will recognize the tag in the wild, connect it to the specific season it belongs to, and feel the pull of Japanese convenience-store "seasonal FOMO" that drives so much of konbini repeat-buying culture. The subtle detail of showing the price in the correct yen format (¥198, ¥100/個 with the counter, etc.) also builds fluency with konbini pricing conventions.

**Files modified:** npc.js (+~230 lines: DAILY_SPECIALS array with 9 seasonal products, dailySpecialsState, getCurrentSeasonMonth, seasonForMonth, pickDailySpecial with unseen-first + in-season + fallback logic, shouldTriggerDailySpecial with 60% roll and level-1 gate, markDailySpecialShown, getDailySpecialStats, save/load hooks, exports). engine.js (+~155 lines: dsBanner state, showDailySpecialBanner, updateDailySpecialBanner, renderDailySpecialBanner with kawaii shelf-tag design and slide-in/hold/slide-out animation, isDailySpecialBannerActive, exports). game.js (+~30 lines: post-entry roll with 3.5s setTimeout delay, updateDailySpecialBanner call in update loop, renderDailySpecialBanner call in render loop, window.forceDailySpecial(opts) test hook accepting an optional specific id).

### 2026-07-01 -- #41 Time-of-Day Ambient NPC Lines
**What was added:**
- The existing ambient speech-bubble system now mixes in a real-world-hour-aware pool of phrases so the streetscape feels genuinely alive at 7am vs 2pm vs 8pm vs midnight. Every time an NPC bubble is about to fire, there's a 35% chance (17.5% for coaches/sensei/guides) it pulls from the current time-of-day bucket instead of the NPC's personality-specific pool -- so personality lines still dominate but time-of-day flavor comes through consistently.
- **4 buckets covering 32 total lines**:
  - **morning (05:00 - 10:59)** 8 lines: おはようございます / 今日も一日がんばろう / 朝ごはん食べた？ / 電車混んでるなぁ / 眠い...コーヒー買おう / 朝から暑いね / 出勤前にコンビニ寄ろ / ゴミの日だった...
  - **midday (11:00 - 16:59)** 8 lines: こんにちは / お昼何食べる？ / お腹空いた～ / ランチ休憩！ / コンビニでお弁当買お / 午後の会議だるい / アイス食べたい / ちょっと休憩しよう
  - **evening (17:00 - 20:59)** 8 lines: お疲れさまでした / 早く帰りたい / 晩ごはん何にしよう / 駅前混むね / 一杯飲んで帰ろっか / 夕焼けきれい / お風呂入りたい～ / コンビニで夜ごはん
  - **night (21:00 - 04:59)** 8 lines: こんばんは / 終電間に合うかな / 夜食買いに行こ / もう寝る時間 / この時間のコンビニ好き / タクシーつかまらない / 明日も仕事だ... / コンビニの明かりだけ
- **Coach-type NPCs** (sensei / paymentcoach / seasonalguide / kansaicoach / etc) are gated to half the time-of-day chance so they stay on-topic about Japanese-teaching more often -- an NPC labeled "sensei" mostly says "let's practice every day" instead of "I want a beer after work."
- **Test hook:** `window.forceTimeOfDay('morning' | 'midday' | 'evening' | 'night' | null)` -- pass `null` to reset to real-world time. Also exposed as `NPCs.setTimeOfDayOverride()`.

**Why it matters for learning:** Japanese greeting selection is completely dependent on the hour of day, and this is one of the first things a learner gets tripped up by. Every textbook teaches こんにちは as "hello", but in real life saying こんにちは at 8am makes you sound weirdly stiff -- native speakers say おはようございます until roughly 10:30am, こんにちは through the afternoon, and こんばんは once it starts getting dark. Beyond greetings, the bucketed vocabulary carries a huge amount of situational context that learners rarely pick up from formal study: 終電 (last train), 夜食 (midnight snack), 朝ごはん (breakfast), 夕焼け (sunset), 出勤前 (before work), ランチ休憩 (lunch break), 一杯飲んで (grab a drink) -- all high-frequency phrases you'll hear dozens of times per day in Tokyo but that don't fit neatly into JLPT vocab lists because they're mostly compound expressions. Because the game reads the player's actual clock, someone playing at 7am in Osaka hears the exact phrases they'll overhear on the way to school or work that same morning, which is the single strongest possible context for retention.

**Files modified:** npc.js (+~90 lines: TIME_OF_DAY_LINES with 4 buckets x 8 lines = 32 authentic phrases, _timeOfDayOverride module state, setTimeOfDayOverride, getTimeOfDayBucket with 4-way hour-bucketing, pickTimeOfDayLine, TIME_OF_DAY_BUBBLE_CHANCE = 0.35 constant, coach detection via /coach|sensei|guide/i regex halving the chance for coaches, modified inner ambient-bubble picker to check the time-of-day pool first before falling back to personality pool, exports). game.js (+7 lines: window.forceTimeOfDay(bucket) test hook).

### 2026-07-01 -- #42 Weather-Linked Ambient NPC Lines
**What was added:**
- Extends the #41 time-of-day system to a second axis: real-world weather in the game world. Every ambient bubble roll now checks time-of-day pool first (35% chance), then weather pool (30% chance), then falls back to the NPC's personality-specific pool. Bubbles from all three axes coexist naturally so the streetscape reflects both the time of day AND the current weather.
- **4 weather buckets matching Engine.getWeatherType() output:**
  - **clear** 8 lines: いい天気ですね / 空が青い！/ 散歩日和だね / 日差しが気持ちいい / 洗濯物が乾くね / アイス日和！/ 外で食べようかな / 公園行きたい
  - **cherry_blossoms** 8 lines: 桜が満開！/ お花見しよう / 春が来た〜 / 花びらがきれい / 桜餅食べたい！/ 写真撮ろう / この時期だけだね / いい香り〜
  - **rain** 8 lines: 傘忘れた！/ よく降るね / コンビニで傘買おう / ずぶ濡れ... / 雨宿りしよう / 梅雨だね〜 / 雨の音落ち着く / 長靴履けばよかった
  - **night** 6 lines: 星がきれい / 涼しくなってきた / 月が明るいね / 夜風が気持ちいい / 静かだね / ネオンきれい
- **Coach-type NPCs** (sensei / paymentcoach / seasonalguide / etc) are gated to half the weather chance so they stay on-topic more often.
- **New engine test hook:** Engine.setWeatherType(t) forces a specific weather without waiting for the cycle. Bound to window.forceWeather('clear'|'cherry_blossoms'|'rain'|'night') for testing.
- Empirical distribution verified with 5000 sim steps under forced rain: ~17% weather / ~26% time-of-day / ~57% personality lines -- matches the 30% × (1 - 35%) probability math.

**Why it matters for learning:** Weather vocabulary is one of the highest-frequency small-talk categories in Japanese, and it's the exact category learners get stuck on because textbooks teach 雨 / 晴れ / 曇り in isolation without the natural conversational chunks that connect them. Real Japanese weather chat is full of set phrases: 散歩日和 (sanpo-biyori "walking weather", productive suffix), 傘忘れた ("I forgot my umbrella" -- almost always in casual past tense, not the polite form), 梅雨 (tsuyu, the rainy season with cultural weight), 洗濯物が乾く (the daily-life laundry-and-weather link), 花見 (hanami, one of the most culturally loaded compound nouns in the language). Pairing each phrase with the exact matching visual weather already rendered on-screen (rain streaks, falling petals, night neon) creates strong dual-coding: learners see the umbrella-forgetting person while it's actually raining in the game, so 傘忘れた becomes an unforgettable image-word bond rather than a flashcard entry. And because the game weather cycles automatically, players who spend real playtime naturally get exposed to all four weather vocabularies without any grinding.

**Files modified:** engine.js (+15 lines: setWeatherType(t) test hook validating against WEATHER_TYPES + 'night', syncing weatherIdx, respawning particles). npc.js (+~65 lines: WEATHER_LINES with 4 buckets × 6-8 lines = 30 authentic phrases, WEATHER_BUBBLE_CHANCE = 0.30 constant, pickWeatherLine(weatherType) helper, second stage in updateAmbientBubbles inner picker that reads Engine.getWeatherType() and pulls from weather pool when TOD pool misses, coach detection halves this chance too, exports). game.js (+7 lines: window.forceWeather(t) test hook).

### 2026-07-01 -- #43 Weekday vs Weekend Ambient NPC Lines
**What was added:**
- Third context axis for ambient street chatter, layered after time-of-day (35%) and weather (30%). Every ambient bubble roll now has a 25% chance of pulling from a day-of-week pool before falling through to the NPC's personality-specific pool. Bubbles from all three axes coexist so the street reflects the hour, the weather, AND whether it's a workday or a weekend.
- **2 day-type buckets** (JS Date().getDay(): 0=Sun / 6=Sat = weekend, 1-5 = weekday):
  - **weekday** 10 lines: 会社行きたくない / 打ち合わせ間に合うかな / ランチ何にしよう / 今日も残業かも / 定時で帰りたい / 出勤前にコーヒー / 週末が待ち遠しい / 眠い...月曜日きつい / 電車混んでる / あと少しで金曜日
  - **weekend** 10 lines: 今日はゆっくりしよう / どこ遊びに行こうかな / 家族とお出かけ / 朝寝坊しちゃった / 週末最高！/ 洗濯溜まってる〜 / 午後から友達と会う / のんびりできる日 / ブランチしよう / 明日も休みだ〜
- **Coach-type NPCs** (sensei / paymentcoach / seasonalguide / etc) are gated to half the day-type chance so they stay on-topic more often (12.5% for coaches vs 25% for regular NPCs).
- **New test hook:** window.forceDayType('weekday'|'weekend'|null) overrides the real-world weekday reading; pass null to reset. Also exposed as NPCs.setDayTypeOverride().
- Pool priority verified with 5000 sim steps: ~35% TOD / ~19% weather / ~11% day-type / ~34% personality -- the three context axes together account for ~65% of ambient bubbles, personality baseline still runs the remaining ~35%.
- Zero overlap between weekday and weekend pools (they teach genuinely different vocab categories).

**Why it matters for learning:** Japanese working culture is one of the biggest gaps between textbook and reality -- learners can pass N3 without ever encountering 出勤 (shukkin, going to work), 打ち合わせ (uchiawase, informal meeting -- much more common than 会議 in office speech), 残業 (zangyou, overtime -- essential culture vocab), 定時 (teiji, on-time leaving -- carries huge cultural connotation), or 月曜日きつい (getsuyoubi kitsui, "Mondays are rough" -- almost a set phrase). Konbini is where salarymen physically stop on the way to and from work, so this is the exact vocabulary a learner would overhear standing in line for coffee at 8am on a Tuesday. Weekend phrases balance the other side: お出かけ (odekake, the specifically social "going out"), のんびり (nonbiri, an onomatopoeic adverb for taking it easy that has no direct English match), 朝寝坊 (asa nebou, sleeping in -- another set expression), 週末最高 (as a joyful exclamation form). The system is passive -- players learn these through ambient exposure while wandering the street, exactly how vocabulary lands in real language acquisition. Combined with #41 (time-of-day) and #42 (weather), the game now models THREE overlapping conversational contexts, and any given walk through the street world can drop a phrase like 「出勤前にコーヒー」 at 7am on a rainy Monday, which is what actual native speech looks like.

**Files modified:** npc.js (+~75 lines: DAY_TYPE_LINES with 2 buckets × 10 lines = 20 authentic phrases, DAY_TYPE_BUBBLE_CHANCE = 0.25 constant, setDayTypeOverride / getDayTypeBucket / pickDayTypeLine helpers, third stage in updateAmbientBubbles inner picker before the personality fallback, coach detection halves this chance too, exports). game.js (+7 lines: window.forceDayType(t) test hook).
