# Konbini Quest - Complete Game Specification

## Game Overview
A kawaii 8-bit browser game that teaches players how to interact with convenience store clerks in Japan. Players progress through 12 levels, each introducing new Japanese phrases and interactions at 7-Eleven, Lawson, and FamilyMart.

## Art Direction
- **Style**: Cute kawaii 8-bit pixel art aesthetic
- **Canvas**: 2D Canvas game, NOT Three.js
- **Pixel art**: All game graphics drawn programmatically on canvas with pixel-perfect rendering (ctx.imageSmoothingEnabled = false)
- **Color palette per store**:
  - 7-Eleven: Red (#E50012), Orange (#F58220), Green (#00843D), White
  - Lawson: Royal Blue (#003399), White, Light Blue (#5B9BD5)
  - FamilyMart: Green (#00A040), Blue (#003893), White
- **Character style**: Cute chibi-style pixel art characters (16x24 or 24x32 pixel sprites scaled up)
- **Background**: Pixel art konbini interior with shelves, counter, register
- **UI**: Retro game UI with pixel borders, cute icons

## Typography
- Display font: "Press Start 2P" (Google Fonts) - for titles, level headers
- Body font: "M PLUS Rounded 1c" (Google Fonts) - for Japanese text, dialogue, hints
- Both fonts support Japanese characters

## Audio System

### Entry Chimes (Web Audio API - triangle wave oscillators)
**FamilyMart chime** (Eb major, 11 notes):
```
G4(392.0) → Eb4(311.1) → Bb3(233.1) → Eb4(311.1) → F4(349.2) → Bb4(466.2) → F4(349.2) → G4(392.0) → F4(349.2) → Bb3(233.1) → Eb4(311.1)
```
Duration per note: ~200ms, triangle wave, fast attack (5ms), exponential decay (700ms)

**7-Eleven chime** (simple descending):
```
E5(659.25) → C5(523.25)
```
Sine wave, longer decay

**Lawson chime** (ascending):
```
E5(659.25) → G5(783.99) → C6(1046.5)
```
Sine wave, bright tone

### TTS (Text-to-Speech)
- Use Web Speech API (speechSynthesis)
- Set language to 'ja-JP'
- Rate: 0.85 (slightly slower for learning)
- Select a Japanese voice from available voices
- Each clerk phrase is spoken aloud when displayed
- Player can tap a "replay" button to hear it again

### SFX (Web Audio API procedural)
- Correct answer: ascending chime (C5 → E5 → G5, quick)
- Wrong answer: descending buzz (low frequency square wave)
- Level complete: victory jingle (8-bit style)
- Button hover: subtle click
- Star earned: sparkle sound

## Game Structure

### Title Screen
- "KONBINI QUEST" in pixel art
- Subtitle: "コンビニクエスト" 
- "Learn Japanese at the Convenience Store"
- Cute pixel art of all 3 store fronts
- "TAP TO START" button
- Sound toggle icon

### Level Select Screen
- Shows 12 levels in a grid/path
- Each level shows: store icon, level name, difficulty stars (1-3)
- Completed levels show gold stars earned (1-3 based on performance)
- Locked levels shown with lock icon
- Levels unlock sequentially

### Gameplay Screen Layout
- Top: Level info bar (level number, store name, stars)
- Center: Pixel art scene (store interior with clerk character)
- Speech bubble: Clerk's Japanese text + romaji below
- Speaker icon: Tap to replay audio
- Bottom: Multiple choice response buttons (2-4 options)
- Timer bar (optional per level)
- Cultural tip box (shows context/etiquette hints)

### Scoring
- Each level has 3 stars
- Star 1: Complete the level (any score)
- Star 2: Get 80%+ correct on first try
- Star 3: Complete with no mistakes
- In-memory only (no localStorage)

## THE 12 LEVELS

### Level 1: "Welcome!" - The Greeting (7-Eleven)
**Difficulty**: ★☆☆
**Concept**: Learn that you DON'T respond to いらっしゃいませ
**Scene**: Player walks into 7-Eleven, door chime plays, clerk says greeting

**Interaction 1:**
- Clerk says: いらっしゃいませ！(Irasshaimase!)
- Audio: TTS plays the greeting
- Cultural tip: "In Japan, you don't need to respond to this greeting. It's a ritual welcome, not a personal hello."
- Options:
  1. ✓ [Stay Silent] (Do nothing - keep walking) 
  2. ✗ ありがとう！(Arigatou!) - "Thank you"
  3. ✗ こんにちは！(Konnichiwa!) - "Hello"
  4. ✗ いらっしゃいませ！(Irasshaimase!) - echo it back
- Correct: Stay Silent
- Explanation on correct: "Perfect! Japanese etiquette says you just walk in. A small nod is fine, but no verbal response is needed."
- Explanation on wrong: "Actually, Japanese people don't respond to いらっしゃいませ. It's like background noise — the clerk may not even be looking at you!"

### Level 2: "Thank You!" - Saying Goodbye (Lawson)
**Difficulty**: ★☆☆
**Concept**: Learn to say thank you when leaving
**Scene**: Player is at Lawson register, transaction complete

**Interaction 1:**
- Clerk says: ありがとうございました！(Arigatō gozaimashita!)
- "Thank you very much!"
- Options:
  1. ✓ ありがとうございます (Arigatō gozaimasu) - "Thank you"
  2. ✗ さようなら (Sayōnara) - "Goodbye" (too formal)
  3. ✗ [Stay Silent] - Walk away silently
  4. ✗ バイバイ！(Baibai!) - "Bye-bye" (too casual)
- Correct: ありがとうございます
- Tip: "Note the tense difference! The clerk uses past tense (ました/mashita) because the transaction is done. You use present tense (ます/masu) because you're thanking them now."

### Level 3: "Do You Want a Bag?" (FamilyMart)
**Difficulty**: ★☆☆
**Concept**: Handle the bag question - learn はい、お願いします and 大丈夫です
**Scene**: FamilyMart checkout, FamilyMart chime plays at start

**Interaction 1:**
- Clerk says: レジ袋はご利用ですか？(Reji-bukuro wa go-riyō desu ka?)
- "Will you be using a plastic bag?"
- Cultural tip: "Since 2020, bags cost ¥3-5. Most Japanese people bring their own bag (マイバッグ)."
- Options:
  1. ✓ はい、お願いします (Hai, onegaishimasu) - "Yes, please"
  2. ✓ 大丈夫です (Daijōbu desu) - "I'm fine / No thanks" [ALSO CORRECT]
  3. ✗ はい (Hai) - just "yes" (too short/rude in context)
  4. ✗ No, thank you [in English]
- Both option 1 and 2 are correct (different paths)
- Tip: "はい、お願いします and 大丈夫です are the two magic phrases that answer almost ANY yes/no question at a konbini!"

### Level 4: "Point Card?" (7-Eleven)
**Difficulty**: ★★☆
**Concept**: Handle the point card question
**Scene**: 7-Eleven checkout

**Interaction 1:**
- Clerk says: ポイントカードはお持ちですか？(Pointo kādo wa o-mochi desu ka?)
- "Do you have a point card?"
- Cultural tip: "7-Eleven uses nanaco, Lawson has Ponta, FamilyMart has dポイント. Listen for ポイント (pointo)!"
- Options:
  1. ✓ 大丈夫です (Daijōbu desu) - "I'm fine" (meaning no)
  2. ✓ 持っていません (Motte imasen) - "I don't have one" [ALSO CORRECT]
  3. ✗ はい (Hai) - "Yes" (but you don't have one!)
  4. ✗ ポイント？(Pointo?) - confused echo

### Level 5: "Heat It Up?" (Lawson)
**Difficulty**: ★★☆
**Concept**: Being asked about heating your bento
**Scene**: Lawson, player bought a bento

**Interaction 1:**
- Clerk says: お弁当、温めますか？(O-bentō, atatamemasu ka?)
- "Shall I heat up your bento?"
- Cultural tip: "Clerks ask this for bento, onigiri, and ready meals. The microwave is behind the counter."
- Options:
  1. ✓ はい、お願いします (Hai, onegaishimasu) - "Yes, please"
  2. ✗ 大丈夫です (Daijōbu desu) - technically correct but for this level we want YES
  3. ✗ 温めます (Atatamemasu) - "I'll heat it" (wrong grammar/meaning)
  4. ✗ ホット (Hotto) - "Hot" (English word in Japanese)

**Interaction 2:**
- Clerk says: 少々お待ちください (Shōshō omachi kudasai)
- "Please wait just a moment"
- Options:
  1. ✓ [Nod and wait] (Do nothing)
  2. ✗ 急いでください (Isoide kudasai) - "Please hurry"
  3. ✗ ありがとう (Arigatou) - Not yet!
- Tip: "The clerk is being polite. Just wait patiently!"

**Interaction 3:**
- Clerk says: お待たせいたしました (O-matase itashimashita)
- "Thank you for your patience"
- Options:
  1. ✓ ありがとうございます (Arigatō gozaimasu) - "Thank you"
  2. ✓ [Slight nod] - Also fine
  3. ✗ 遅い！(Osoi!) - "Slow!" (VERY rude)

### Level 6: "Chopsticks?" (FamilyMart)
**Difficulty**: ★★☆
**Concept**: Utensil questions - request specific items
**Scene**: FamilyMart, player bought pasta and soup

**Interaction 1:**
- Clerk says: お箸はお付けしますか？(O-hashi wa o-tsuke shimasu ka?)
- "Shall I add chopsticks?"
- Options:
  1. ✓ スプーンをお願いします (Supūn o onegaishimasu) - "A spoon, please" 
  2. ✗ はい、お願いします (Hai, onegaishimasu) - "Yes please" (chopsticks for soup?)
  3. ✗ フォーク (Fōku) - Just "fork" (incomplete sentence)
  4. ✗ 大丈夫です (Daijōbu desu) - No utensils
- Tip: "You bought soup! Chopsticks won't work. Ask for a spoon: スプーン (supūn). For a fork: フォーク (fōku)."

### Level 7: "How Much?" - The Total (7-Eleven)
**Difficulty**: ★★☆
**Concept**: Understanding the total and paying
**Scene**: 7-Eleven checkout

**Interaction 1:**
- Clerk says: 以上で七百五十円でございます (Ijō de nana-hyaku go-jū-en de gozaimasu)
- "That will be 750 yen"
- Question: "How much did the clerk say?"
- Options:
  1. ✓ ¥750
  2. ✗ ¥570
  3. ✗ ¥1,750
  4. ✗ ¥75
- Tip: "七百 (nana-hyaku) = 700, 五十 (go-jū) = 50. Listen for the numbers!"

**Interaction 2:**
- Clerk says: お支払い方法は？(O-shiharai hōhō wa?)
- "Payment method?"
- Options:
  1. ✓ 現金でお願いします (Genkin de onegaishimasu) - "Cash, please"
  2. ✓ カードでお願いします (Kādo de onegaishimasu) - "Card, please"
  3. ✓ Suicaでお願いします (Suica de onegaishimasu) - "Suica, please"
  4. ✗ [Hold up credit card silently]
- All verbal options correct; tip explains the pattern: [method] + で + お願いします

### Level 8: "Where Is It?" - Asking for Help (Lawson)
**Difficulty**: ★★☆
**Concept**: Asking where items are
**Scene**: Lawson interior, browsing shelves

**Interaction 1:**
- Player needs to ask: Where are the onigiri?
- Options:
  1. ✓ すみません、おにぎりはどこですか？(Sumimasen, onigiri wa doko desu ka?)
  2. ✗ おにぎり？(Onigiri?) - Just the word
  3. ✗ おにぎりをください (Onigiri o kudasai) - "Give me onigiri" (you need to find them first!)
  4. ✗ Where is onigiri? [in English]
- Tip: "すみません (sumimasen) gets the clerk's attention. Then: [item] + はどこですか？= Where is [item]?"

**Interaction 2:**
- Clerk points and says: あちらにございます (Achira ni gozaimasu)
- "It's over there"
- Options:
  1. ✓ ありがとうございます (Arigatō gozaimasu) - "Thank you"
  2. ✗ はい (Hai) - "Yes" (doesn't make sense)
  3. ✗ [Look confused]

### Level 9: "One Famichiki Please!" - Counter Orders (FamilyMart)
**Difficulty**: ★★★
**Concept**: Ordering hot food from the counter
**Scene**: FamilyMart, at the hot food counter

**Interaction 1:**
- Player needs to order fried chicken
- Options:
  1. ✓ ファミチキをひとつください (Famichiki o hitotsu kudasai) - "One Famichiki please"
  2. ✗ チキンをください (Chikin o kudasai) - "Chicken please" (missing counter word)
  3. ✗ これ (Kore) - "This" (too vague, not pointing)
  4. ✗ ファミチキ二つ (Famichiki futatsu) - "Two Famichiki" (wrong amount)
- Tip: "Counting things: ひとつ (hitotsu)=1, ふたつ (futatsu)=2, みっつ (mittsu)=3. Pattern: [item] を [number] ください"

**Interaction 2:**
- Clerk says: こちらでよろしいですか？(Kochira de yoroshii desu ka?)
- "Is this one okay?"
- Options:
  1. ✓ はい、お願いします (Hai, onegaishimasu) - "Yes, please"
  2. ✗ いいえ (Iie) - "No"
  3. ✗ もう一つ (Mō hitotsu) - "One more"

### Level 10: "The Full Checkout" (7-Eleven)
**Difficulty**: ★★★
**Concept**: Complete checkout flow with multiple interactions
**Scene**: 7-Eleven, player has a bento and a drink

Goes through the FULL sequence:
1. Point card question → 大丈夫です
2. Heating question → はい、お願いします  
3. Chopsticks → はい、お願いします
4. Bag question → 大丈夫です
5. Total → understand the amount
6. Payment → 現金でお願いします
7. Receipt question → 大丈夫です or はい
8. Thank you → ありがとうございます

### Level 11: "Age Check" - Buying Alcohol (Lawson)
**Difficulty**: ★★★
**Concept**: Age verification screen + complete purchase
**Scene**: Lawson, player buying beer

**Interaction 1:**
- Clerk scans beer and says: 年齢確認をお願いします。画面のタッチをお願いします
- "Age confirmation please. Please touch the screen."
- Options:
  1. ✓ [Touch はい on screen] - Tap the yes button
  2. ✗ はい、二十歳です (Hai, hatachi desu) - "Yes, I'm 20" (verbal isn't enough)
  3. ✗ [Show passport]
  4. ✗ [Do nothing]
- Tip: "You MUST touch the screen yourself. The clerk cannot do it for you — it's a legal requirement."

Then continues with full checkout...

### Level 12: "Master Level" - Full Immersion (FamilyMart)
**Difficulty**: ★★★
**Concept**: No romaji, no English hints. Full Japanese only.
**Scene**: FamilyMart, complex order (onigiri, bento, drink, Famichiki)

Complete scenario with minimal hints:
1. Enter store (chime plays) → stay silent
2. Order Famichiki at counter
3. Ask where onigiri is
4. Go to checkout
5. All checkout questions (point card, heating, utensils, bag, payment)
6. Say goodbye

Options shown in Japanese only (kanji + kana). No romaji. No English translations.
This is the "graduation" level.

## Technical Implementation Notes

### No localStorage
- All progress is in-memory only
- When page refreshes, progress resets
- This is fine for the learning-game context

### Mobile-First
- Touch targets minimum 44px
- Buttons should be large and easy to tap
- Portrait orientation preferred
- Canvas scales responsively

### TTS Implementation
```javascript
function speakJapanese(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.85;
  // Try to find a Japanese voice
  const voices = speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang.startsWith('ja'));
  if (jpVoice) utterance.voice = jpVoice;
  speechSynthesis.speak(utterance);
}
```

### File Structure
```
konbini-quest/
├── index.html
├── style.css
├── game.js         (main game engine, scenes, rendering)
├── levels.js       (level data - all 12 levels)
├── audio.js        (chimes, SFX, TTS)
├── sprites.js      (pixel art drawing functions)
└── assets/         (generated images if any)
```
