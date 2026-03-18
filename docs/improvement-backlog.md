# Konbini Quest - Improvement Backlog

## Priority Order (highest impact first)

### Batch 1: Core Learning Effectiveness
1. **Spaced Repetition Review System** - After completing a level, previously learned phrases reappear in later levels as quick-fire reviews. Track which phrases the player struggles with and surface them more often. This is THE #1 evidence-based technique for language retention.
2. **Listening Comprehension Mode** - Clerk speaks Japanese audio ONLY (no text), player must choose the correct meaning. Forces real ear training instead of just reading.
3. **Romaji → Kana Transition** - Early levels show romaji, later levels show only hiragana/katakana. Gradually removes the crutch.

### Batch 2: Addictive Game Mechanics
4. **Daily Challenge / Streak System** - A special NPC on the street offers a daily challenge. Visual streak counter on the HUD. Creates the "Hooked" cycle (trigger → action → variable reward → investment).
5. **Collection Mechanic** - "Konbini Stamp Card" that fills up as you master phrases. Visual progress toward completion triggers completionist drive.
6. **Variable Rewards** - Random rare items/phrases with special animations. The "variable reward" is the most addictive element per Nir Eyal's framework.

### Batch 3: Better Graphics & Polish
7. **Animated Store Entry** - Sliding door animation when entering stores instead of just fade-to-black.
8. **Weather System** - Rain, night, cherry blossom petals. Makes the overworld feel alive.
9. **NPC Walk Cycles** - Street NPCs wander around instead of standing still. More Pokemon-like.
10. **Particle Effects** - Stars burst when completing levels, sparkles on correct answers.

### Batch 4: Deeper Japanese Content
11. **Payment Method Interactions** - Full payment flow: "How would you like to pay?" → Cash/Card/IC card responses with proper keigo.
12. **Seasonal Items** - Oden in winter, ice cream in summer. Teaches seasonal vocabulary.
13. **Regional Dialects** - Kansai-ben clerk at one store as a bonus challenge.
14. **Politeness Levels** - Show casual vs polite vs keigo versions of the same phrase.

### Batch 5: Advanced Mechanics
15. **Mini-map** - Small map in corner showing store locations and completion status.
16. **Inventory System** - Items you "buy" appear in a bag. Review what you purchased with Japanese labels.
17. **Achievement Badges** - "First Purchase", "Point Card Pro", "Konbini Master" etc.
18. **Sound Design** - Ambient konbini BGM, register beeps, bag rustling.

### Batch 6: Advanced Learning
19. **Mistake Journal** - Track wrong answers, show them in a review section.
20. **Cultural Notes** - Brief cultural context popups (money tray etiquette, bowing, etc.)
21. **Speed Round** - Timed mode where clerk fires rapid questions. Tests recall under pressure.
22. **Pronunciation Guide** - Show pitch accent patterns for key phrases.

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
