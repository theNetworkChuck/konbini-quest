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
