# Japanese Konbini (Convenience Store) Entry Chime Research
> Research for Web Audio API / oscillator-based recreation in a browser game

---

## 1. FamilyMart Entry Chime (ファミリーマート入店音)

### Origin & History
- **Official name**: "Matsushita Electric Industrial Co. Ltd. Doorbell Chime EC5227WP"  
- **Composer**: Yasushi Inaba / 稲葉渉 (sometimes transliterated as "Yasushi Inada"), a conductor who worked at Matsushita Electric (now Panasonic)  
- **Created**: 1978, as a standard residential/commercial doorbell product  
- **Song title**: The piece is sometimes called **大盛況 (Daiseikyo / "Great Success")** or referenced as *Daihakken* ("Great Discovery") in some sources  
- **Why FamilyMart uses it**: FamilyMart simply bought the Panasonic EC5227WP doorbells — they did not license the melody separately. The tune's **rights remain with Panasonic**, not FamilyMart.  
- **Usage**: Standard in all FamilyMart locations across Japan, Philippines, Thailand, Taiwan, and China (Shanghai, Guangzhou, Suzhou)  
- **Note count**: 12 notes total (including harmony/left-hand notes); 11 distinct melody notes in the right-hand lead

### Musical Notes — Right Hand (Melody)

**Key**: E♭ major / B♭ major (original key starts on F♯ per some sources, simplified version in D major)

**Right hand note sequence** (starting on G above middle C, one octave up):

| Position | Note | Freq (Hz) |
|----------|------|-----------|
| 1 | G4 | 392.0 |
| 2 | E♭4 | 311.1 |
| 3 | B♭3 | 233.1 |
| 4 | E♭4 | 311.1 |
| 5 | F4 | 349.2 |
| 6 | B♭4 | 466.2 |
| 7 | F4 | 349.2 |
| 8 | G4 | 392.0 |
| 9 | F4 | 349.2 |
| 10 | B♭3 | 233.1 |
| 11 | E♭4 | 311.1 |

> Source: [Amosdoll piano tutorial](https://www.youtube.com/watch?v=g8VBxljDAIE) — "G down to E-flat, B-flat, up to E-flat again, then F up to B-flat, then F-G-F, down to B-flat, E-flat"

**Japanese solfege (ドレミ) version** — simplified easy key (D major):

`レ → ソ → シ → ラ → レ → ラ → レ → ソ → ラ → シ → ソ → レ`

(Re-So-Si-Ra-Re-Ra-Re-So-Ra-Si-So-Re)

> Source: [piano-gakufu.com sheet music PDF](https://piano-gakufu.com/wp-content/uploads/2021/09/%E3%83%AA%E3%82%B3%E3%83%BC%E3%83%80%E3%83%BC%EF%BC%97%EF%BC%8E%E3%83%95%E3%82%A1%E3%83%9F%E3%83%AA%E3%83%BC%E3%83%9E%E3%83%BC%E3%83%88%E3%81%AE%E5%85%A5%E5%BA%97%E9%9F%B3.pdf)

**Mapping to Western notes (D major easy version)**:
- レ(Re) = D
- ソ(So) = G
- シ(Si) = B
- ラ(Ra) = A

Easy version sequence: `D → G → B → A → D → A → D → G → A → B → G → D`

### Left Hand (Harmony)
Starting on G one octave *below* the right hand G:

`G → D → F → B♭ → B♭ → G`

Combined playing pattern:
- Right hand starts alone: G → Eb → Bb → Eb
- Then F (R) + D (L) together
- B♭ left hand alone
- F + B♭ together
- F + B♭ together  
- Eb (R) + G (L) together

### Timing / Rhythm
- **BPM**: ~176 (per [Chordify analysis](https://chordify.net/chords/familymart-jingle-famirimato-ru-dian-yin-piano-tutorial-by-javin-tham-javin-tham-music))
- **Key**: C minor (Chordify) / E♭ major (enharmonic equivalent)
- **Duration**: ~2–3 seconds for the full 12-note sequence at normal playback speed
- **Note duration**: Each note approximately 150–200ms; the chime has a natural decay (bell-like envelope)

### Web Audio API Implementation Notes
- Use a **sine** or **triangle** wave oscillator for the bell-like tone
- Apply a fast attack (~5ms) and long exponential decay (~500–800ms per note)
- Notes play sequentially with slight overlap (legato feel)
- The original has a warm, resonant tone — triangle wave is closer than sine
- The Panasonic original uses a 2-tone chime mechanism; the 12 notes are likely 6 pairs of resonators

### Web Audio API Code Sketch

```javascript
// FamilyMart chime - original key (Eb major)
const familymartNotes = [
  { freq: 392.0, duration: 0.25 },  // G4
  { freq: 311.1, duration: 0.25 },  // Eb4
  { freq: 233.1, duration: 0.25 },  // Bb3
  { freq: 311.1, duration: 0.25 },  // Eb4
  { freq: 349.2, duration: 0.25 },  // F4
  { freq: 466.2, duration: 0.25 },  // Bb4
  { freq: 349.2, duration: 0.25 },  // F4
  { freq: 392.0, duration: 0.25 },  // G4
  { freq: 349.2, duration: 0.25 },  // F4
  { freq: 233.1, duration: 0.25 },  // Bb3
  { freq: 311.1, duration: 0.5  },  // Eb4 (held)
];

// D major easy version
const familymartEasyNotes = [
  { freq: 293.66, duration: 0.25 }, // D4
  { freq: 392.0,  duration: 0.25 }, // G4
  { freq: 493.88, duration: 0.25 }, // B4
  { freq: 440.0,  duration: 0.25 }, // A4
  { freq: 587.33, duration: 0.25 }, // D5
  { freq: 440.0,  duration: 0.25 }, // A4
  { freq: 587.33, duration: 0.25 }, // D5
  { freq: 392.0,  duration: 0.25 }, // G4
  { freq: 440.0,  duration: 0.25 }, // A4
  { freq: 493.88, duration: 0.25 }, // B4
  { freq: 392.0,  duration: 0.25 }, // G4
  { freq: 293.66, duration: 0.5  }, // D4 (held)
];

function playChime(notes, ctx) {
  let time = ctx.currentTime;
  notes.forEach(({ freq, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.8);
    time += duration;
  });
}
```

### YouTube Videos
- **Piano tutorial with notes**: [Amosdoll - How To Play Family Mart Jingle](https://www.youtube.com/watch?v=g8VBxljDAIE)
- **ドレミ sheet music version (slow)**: [ファミリーマートで100万回聞く曲【ドレミ楽譜付き】](https://www.youtube.com/watch?v=b-hMLfmA0gY)
- **Entry chime solfege breakdown**: [ファミリーマートの入店音ドレミ楽譜（原曲、単音、簡単）](https://www.youtube.com/watch?v=H2IBxgAqveM)
- **All 3 konbini chimes piano**: [Japan Convenience Stores' Sounds on Piano](https://www.youtube.com/shorts/TSgzDS69BRI)
- **Lawson + 7-Eleven + FamilyMart comparison**: [コンビニ入店音を耳コピしてエレクトーンで弾いてみた](https://www.youtube.com/watch?v=3BNeuVhoKfE)
- **All 3 store chimes (Lawson 0:00, 7-Eleven 0:20, FamilyMart 0:41)**: [コンビニで聞く入店音と音楽](https://www.youtube.com/watch?v=9QZIKHtX9e4)
- **Original Panasonic WAV file (EC5347)**: [ec5347_m02.wav](https://www2.panasonic.biz/jp/densetsu/ha/signal/chime/sounds/product03/ec5347_m02.wav)

### Sheet Music
- [MuseScore - Family Mart doorbell piano](https://musescore.com/user/10489881/scores/4409851)
- [MuseScore - New FamilyMart Jingle](https://musescore.com/user/49932263/scores/8639820)
- [Flat.io - ファミマ入店音](https://flat.io/score/5d7ed57eb21b2335598e6be8-famima-ru-dian-yin)
- [Piano-gakufu.com - explanation page](https://piano-gakufu.com/?p=4905) — notes original version starts on F♯

---

## 2. 7-Eleven Japan Entry Chime (セブンイレブン入店音)

### Origin & History
- A simple 2–5 note electronic chime; **not** a composed melody like FamilyMart's
- 7-Eleven Japan (Seven-Eleven Japan) began in 1981
- The chime is a generic electronic door sensor sound — different from FamilyMart's elaborate 12-note jingle
- Often described online as sounding similar to the **opening notes of Radiohead's "No Surprises"** — this is a popular internet observation based on the similar descending interval feel
- Multiple sources (Reddit, TikTok) note the chime plays in the C4–C5 octave range

### Musical Character
- **Type**: Simple 2–4 note descending chime, electronic ding-dong style
- **Key/register**: C major, approximately C5–C6 range (per [co piano YouTube thumbnails](https://www.youtube.com/watch?v=ohdG02uujds))
- **The "No Surprises" connection**: The Radiohead song opens with `G → F → E → D → C` (descending C major scale fragment); the 7-Eleven chime has a similar descending character with notes roughly in that pattern
- Can be played with right hand only, no sharps or flats needed (per Japanese piano teacher video description)

### Best Approximation of Notes
Based on piano tutorial videos and descriptions (the chime is a simple electronic tone, not an elaborate melody):

**Short version** (entry chime): `E5 → C5` (a descending major third — the classic "ding-dong")

**Longer version** (sometimes heard): `G5 → E5 → C5` or `E5 → D5 → C5` (descending stepwise)

**Full sequence approximation** based on multiple piano cover transcriptions:
`C5 → E5 → G5 → E5` (a simple C major arpeggio up and back)

> Note: The 7-Eleven Japan chime is *much simpler* than FamilyMart's and varies slightly by store/region. It is primarily a 2–3 note electronic tone, not a melodic sequence.

### Web Audio API Code Sketch

```javascript
// 7-Eleven Japan chime approximation (simple descending chime)
const sevenElevenNotes = [
  { freq: 659.25, duration: 0.2 }, // E5
  { freq: 523.25, duration: 0.4 }, // C5
];

// Longer 3-note version
const sevenElevenNotesLong = [
  { freq: 783.99, duration: 0.2 }, // G5
  { freq: 659.25, duration: 0.2 }, // E5
  { freq: 523.25, duration: 0.4 }, // C5
];
```

### YouTube Videos
- [セブンイレブンの入店音 ピアノver.](https://www.youtube.com/watch?v=qntmyKfoIRg) — right hand only, no accidentals
- [おもしろピアノ⑤ セブンイレブン入店音(ピアノ)簡単解説付き](https://www.youtube.com/watch?v=GBPxEa6gYfs) — beginner tutorial
- [25秒でわかる！セブンイレブン入店音の弾き方](https://www.youtube.com/shorts/XZ3tDlc5RWg) — 25-second tutorial
- [7 Eleven Sound on Piano](https://www.youtube.com/shorts/ISoDxhQPs5k) — Amosdoll short

### Notes on the "No Surprises" Connection
Radiohead's "No Surprises" (1997) opens with a glockenspiel figure: `G → F → E → D → C → B♭` (descending in G major). The 7-Eleven Japan chime has a similar simple, descending quality — both use a soft, bell-like timbre and descend stepwise — which is why many people make this comparison when hearing the chime in Thai and Japanese 7-Elevens.

---

## 3. Lawson Entry Chime (ローソン入店音)

### Origin & History  
- Lawson is Japan's 3rd-largest convenience store chain
- Uses a simple electronic chime, distinct from FamilyMart's elaborate melody
- **Two versions**: Some sources note Lawson has had 2 different chime versions over the years (per [co piano TikTok](https://www.tiktok.com/@co0piano/video/7360598486305361170): "ローソンの入店音を2種類" — 2 types of Lawson entry chimes)
- The chime is in **C major**, using the C5–C6 register (per co piano thumbnail showing piano keyboard)

### Musical Character
- **Type**: Short 2–4 note electronic chime
- **Key**: C major (no sharps/flats)
- **Register**: C5–C6
- **Character**: Higher, brighter, and simpler than FamilyMart; often described as a quick ascending or two-pitch "ping" sound
- Shorter duration than the FamilyMart 12-note sequence

### Best Approximation of Notes
Based on piano cover videos (the Lawson chime is a simple store door sensor tone):

**Version 1** (ascending): `C5 → E5` or `C5 → G5` (simple interval)

**Version 2** (short melody): `E5 → G5 → E5 → C5` (a brief C major pattern)

> Note: Confirmed C major key with C6 as the high note from co piano thumbnail (thumbnail shows piano keys with "C Major" label and "C6" marker visible)

### Web Audio API Code Sketch

```javascript
// Lawson entry chime approximation
const lawsonNotes = [
  { freq: 659.25, duration: 0.15 }, // E5
  { freq: 783.99, duration: 0.15 }, // G5
  { freq: 1046.5, duration: 0.3  }, // C6
];
```

### YouTube Videos
- [ローソンで100万回聞くやつ (co piano)](https://www.youtube.com/watch?v=Wd-0rxyDqSY)
- [ドレミで弾けるローソンの入店音 - co piano](https://co0-piano.com/archives/1031)
- [Lawson Convenience Store Chime (SoundCloud)](https://soundcloud.com/pamono/lawson-convenience-store-chime) — audio sample
- [All 3 chimes comparison (Lawson at 0:38)](https://www.youtube.com/watch?v=3BNeuVhoKfE)

---

## 4. Comparative Summary

| Store | Note Count | Key | Duration | Complexity | Character |
|-------|-----------|-----|----------|------------|-----------|
| FamilyMart | 11–12 notes | E♭ major (or D easy) | ~2.5 sec | High (melodic jingle) | Warm, nostalgic, memorable |
| 7-Eleven | 2–4 notes | C major | ~0.5–1 sec | Low (simple chime) | Electronic, descending ding-dong |
| Lawson | 2–4 notes | C major | ~0.5–1 sec | Low (simple chime) | Bright, ascending ping |

---

## 5. Note Frequency Reference Table

Useful frequencies for Web Audio API oscillators:

| Note | Octave 3 | Octave 4 | Octave 5 | Octave 6 |
|------|---------|---------|---------|---------|
| C | 130.81 | 261.63 | 523.25 | 1046.5 |
| D | 146.83 | 293.66 | 587.33 | 1174.7 |
| E♭ | 155.56 | 311.13 | 622.25 | 1244.5 |
| E | 164.81 | 329.63 | 659.25 | 1318.5 |
| F | 174.61 | 349.23 | 698.46 | 1396.9 |
| G | 196.00 | 392.00 | 783.99 | 1568.0 |
| A | 220.00 | 440.00 | 880.00 | 1760.0 |
| B♭ | 233.08 | 466.16 | 932.33 | 1864.7 |
| B | 246.94 | 493.88 | 987.77 | 1975.5 |

---

## 6. General Konbini Ambient Sounds

### Background Music
- **7-Eleven Japan**: Plays licensed music (MIDI/music box renditions of well-known tracks, Disney tunes, popular Western songs like "Karma Chameleon"). They publish monthly playlists on their official site. ([Reddit r/japanesemusic](https://www.reddit.com/r/japanesemusic/comments/1od6v8i/japan_7eleven_melodies/))
- **FamilyMart & Lawson**: Play curated background music, often light J-pop or instrumental
- **Store closing song**: Many Japanese stores (including larger supermarkets) play **蛍の光 (Hotaru no Hikari / "Auld Lang Syne")** at closing time — this is a standard closing signal across Japan

### Register/POS Sounds
- Electronic beep tones on scanning items (standard retail beep, ~1–2kHz, brief pulse)
- Cash register "ding" on payment completion
- IC card reader confirmation tones (Suica, PASMO)

### Irasshaimase (いらっしゃいませ)
- Staff verbally greet every entering customer: "Irasshaimase!" (Welcome!)
- Part of the overall konbini audio experience — all staff members call it out simultaneously

### Other Characteristic Sounds
- **Microwave beeping**: Staff often heat foods for customers
- **Coffee machine sounds**: FamilyMart café machines grinding and dispensing
- **ATM machine tones**: Konbini ATMs have distinctive confirmation tones
- **Fan heater sounds**: Hot food cases humming
- **Free audio pack for game dev**: [Lemmasoft Forums - Convenience Store Audio Pack CC BY-SA 4.0](https://lemmasoft.renai.us/forums/viewtopic.php?t=46919) — includes SFX and original music for commercial/non-commercial use

---

## 7. Web Audio API Implementation Guide

### Oscillator Type Recommendation
- **Triangle wave**: Closest to the warm, bell-like tone of the FamilyMart chime
- **Sine wave**: Even softer, good for simple 2-note chimes (7-Eleven, Lawson)
- **Square wave**: Too harsh; avoid unless going for retro 8-bit effect

### Envelope (ADSR)
For a chime/bell sound:
```javascript
gain.gain.setValueAtTime(0.0001, startTime);          // Start near zero
gain.gain.exponentialRampToValueAtTime(0.4, startTime + 0.005);  // Fast attack (5ms)
gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);  // Long decay (800ms)
```

### Note Scheduling Pattern
```javascript
function playSequence(notes, audioCtx) {
  let t = audioCtx.currentTime + 0.05; // small delay
  const beatDuration = 60 / 176; // ~0.34s per beat at 176 BPM

  notes.forEach(note => {
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = note.freq;

    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.35, t + 0.005);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    osc.connect(env);
    env.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.85);

    t += note.duration * beatDuration;
  });
}
```

### Full FamilyMart Chime Implementation
```javascript
// Original key (Eb major) — most authentic
const FAMILYMART_CHIME = [
  392.0,  // G4  (1)
  311.1,  // Eb4 (2)
  233.1,  // Bb3 (3)
  311.1,  // Eb4 (4)
  349.2,  // F4  (5)
  466.2,  // Bb4 (6)
  349.2,  // F4  (7)
  392.0,  // G4  (8)
  349.2,  // F4  (9)
  233.1,  // Bb3 (10)
  311.1,  // Eb4 (11) [held note]
];

// Easy key (D major) — same relative melody
const FAMILYMART_D_MAJOR = [
  293.66, // D4
  392.00, // G4
  493.88, // B4
  440.00, // A4
  587.33, // D5
  440.00, // A4
  587.33, // D5
  392.00, // G4
  440.00, // A4
  493.88, // B4
  392.00, // G4
  293.66, // D4 [final]
];
```

---

## 8. Sources & References

| Source | URL |
|--------|-----|
| Amosdoll FamilyMart piano tutorial (note sequence) | https://www.youtube.com/watch?v=g8VBxljDAIE |
| Piano-gakufu solfege sheet | https://piano-gakufu.com/wp-content/uploads/2021/09/... |
| Piano-gakufu explanation page | https://piano-gakufu.com/?p=4905 |
| Chordify (key=Cm, BPM=176) | https://chordify.net/chords/familymart-jingle-famirimato-ru-dian-yin-piano-tutorial-by-javin-tham-javin-tham-music |
| Instagram - Panasonic EC5227WP origin (1978) | https://www.instagram.com/reel/DDCFAWLvnEY/ |
| Smart Marketing article | https://www.smartmarketing.me/music-can-be-an-effective-distinctive-brand-asset.html |
| Paolo from Tokyo (Panasonic doorbell, Yasushi) | https://www.youtube.com/watch?v=R1AcsaNIsNQ |
| Reddit r/taiwan - Panasonic WAV | https://www.reddit.com/r/taiwan/comments/126lnm7/looking_for_familymart_sound/ |
| Panasonic original chime WAV | https://www2.panasonic.biz/jp/densetsu/ha/signal/chime/sounds/product03/ec5347_m02.wav |
| MuseScore FamilyMart doorbell | https://musescore.com/user/10489881/scores/4409851 |
| MuseScore New FamilyMart Jingle | https://musescore.com/user/49932263/scores/8639820 |
| co piano - 7-Eleven ドレミ | https://co0-piano.com/archives/1023 |
| co piano - Lawson ドレミ | https://co0-piano.com/archives/1031 |
| 7-Eleven entry chime piano | https://www.youtube.com/watch?v=qntmyKfoIRg |
| All 3 konbini chimes (Lawson 0:00, 7-Eleven 0:20, FamilyMart 0:41) | https://www.youtube.com/watch?v=9QZIKHtX9e4 |
| Konbini chimes electone cover | https://www.youtube.com/watch?v=3BNeuVhoKfE |
| All 6 konbini chimes MIDI piano | https://www.youtube.com/watch?v=M33Ek0m3jis |
| 7-Eleven chime guitar cover (2026) | https://www.instagram.com/reel/DV3Mch1E9BO/ |
| Lawson chime SoundCloud | https://soundcloud.com/pamono/lawson-convenience-store-chime |
| Free CC audio pack for game dev | https://lemmasoft.renai.us/forums/viewtopic.php?t=46919 |
| Note frequencies reference | https://marcgg.com/blog/2016/11/01/javascript-audio/ |
| Reddit - Japan 7-Eleven melodies | https://www.reddit.com/r/japanesemusic/comments/1od6v8i/japan_7eleven_melodies/ |
