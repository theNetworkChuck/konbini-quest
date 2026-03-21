/* Konbini Quest v2 - Audio System */
const GameAudio = (() => {
  let ctx = null;
  let masterGain = null;
  let muted = false;
  let initialized = false;

  function init() {
    if (initialized) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.value = 0.5;
      initialized = true;
    } catch(e) { console.warn('Audio init failed', e); }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function toggleMute() {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.5;
    // Stop ambient loops when muting (they check `muted` on restart)
    if (muted) {
      stopKonbiniBGM();
      stopStreetAmbience();
      stopRainAmbience();
    }
    return muted;
  }

  function isMuted() { return muted; }

  function playNote(freq, startTime, duration, type = 'triangle', vol = 0.35) {
    if (!ctx || muted) return startTime + duration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.max(duration, 0.1));
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
    return startTime + duration;
  }

  // FamilyMart chime (Eb major, 11 notes)
  function playFamilyMartChime() {
    if (!ctx) return; resume();
    const notes = [392.0,311.1,233.1,311.1,349.2,466.2,349.2,392.0,349.2,233.1,311.1];
    let t = ctx.currentTime + 0.05;
    notes.forEach((freq, i) => {
      playNote(freq, t, i === notes.length - 1 ? 1.0 : 0.7, 'triangle', 0.3);
      t += 0.22;
    });
  }

  // 7-Eleven chime (2-note)
  function playSevenElevenChime() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.05;
    playNote(659.25, t, 0.6, 'sine', 0.35);
    playNote(523.25, t + 0.3, 0.8, 'sine', 0.35);
  }

  // Lawson chime (ascending)
  function playLawsonChime() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.05;
    playNote(659.25, t, 0.4, 'sine', 0.3);
    playNote(783.99, t + 0.2, 0.4, 'sine', 0.3);
    playNote(1046.5, t + 0.4, 0.6, 'sine', 0.3);
  }

  function playStoreChime(store) {
    if (store === '7-Eleven') playSevenElevenChime();
    else if (store === 'Lawson') playLawsonChime();
    else if (store === 'FamilyMart') playFamilyMartChime();
  }

  // Correct answer
  function playCorrect() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.02;
    playNote(523.25, t, 0.2, 'square', 0.15);
    playNote(659.25, t + 0.1, 0.2, 'square', 0.15);
    playNote(783.99, t + 0.2, 0.4, 'square', 0.15);
  }

  // Wrong answer
  function playWrong() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.02;
    playNote(180, t, 0.15, 'square', 0.15);
    playNote(150, t + 0.12, 0.25, 'square', 0.12);
  }

  // Level complete
  function playLevelComplete() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.05;
    const melody = [523.25,587.33,659.25,783.99,659.25,783.99,1046.5];
    const durs = [0.12,0.12,0.12,0.2,0.12,0.12,0.5];
    melody.forEach((f, i) => {
      playNote(f, t, durs[i] + 0.2, 'square', 0.15);
      t += durs[i];
    });
  }

  // Star sparkle
  function playStar() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.02;
    playNote(1046.5, t, 0.15, 'sine', 0.2);
    playNote(1318.5, t + 0.08, 0.15, 'sine', 0.2);
    playNote(1568.0, t + 0.16, 0.3, 'sine', 0.2);
  }

  // Menu select blip
  function playSelect() {
    if (!ctx) return; resume();
    playNote(880, ctx.currentTime, 0.06, 'square', 0.1);
  }

  // Menu cursor move
  function playCursor() {
    if (!ctx) return; resume();
    playNote(660, ctx.currentTime, 0.03, 'square', 0.06);
  }

  // Footstep
  function playFootstep() {
    if (!ctx) return; resume();
    const freq = 100 + Math.random() * 40;
    playNote(freq, ctx.currentTime, 0.03, 'square', 0.03);
  }

  // Door transition (old simple beep)
  function playDoor() {
    if (!ctx) return; resume();
    let t = ctx.currentTime;
    playNote(220, t, 0.15, 'triangle', 0.12);
    playNote(330, t + 0.08, 0.2, 'triangle', 0.1);
  }

  // Sliding door open sound (whoosh + mechanical slide)
  function playSlidingDoor() {
    if (!ctx || muted) return; resume();
    let t = ctx.currentTime;
    // Mechanical click/latch
    playNote(800, t, 0.04, 'square', 0.08);
    // Sliding whoosh - descending frequency sweep
    playNote(400, t + 0.05, 0.12, 'triangle', 0.1);
    playNote(350, t + 0.10, 0.12, 'triangle', 0.12);
    playNote(300, t + 0.15, 0.12, 'triangle', 0.12);
    playNote(250, t + 0.20, 0.15, 'triangle', 0.10);
    playNote(200, t + 0.28, 0.18, 'triangle', 0.08);
    // Soft thud at end of slide
    playNote(100, t + 0.42, 0.08, 'triangle', 0.06);
    // Subtle pneumatic hiss (noise-like high freq)
    playNote(2000, t + 0.05, 0.35, 'sawtooth', 0.015);
  }

  // Sliding door close sound (reverse whoosh)
  function playSlidingDoorClose() {
    if (!ctx || muted) return; resume();
    let t = ctx.currentTime;
    // Reverse slide
    playNote(200, t, 0.12, 'triangle', 0.08);
    playNote(250, t + 0.08, 0.12, 'triangle', 0.10);
    playNote(300, t + 0.14, 0.12, 'triangle', 0.10);
    playNote(350, t + 0.20, 0.10, 'triangle', 0.08);
    // Click shut
    playNote(900, t + 0.30, 0.04, 'square', 0.08);
  }

  // Exclamation "!"
  function playAlert() {
    if (!ctx) return; resume();
    let t = ctx.currentTime;
    playNote(1200, t, 0.08, 'square', 0.12);
    playNote(1600, t + 0.05, 0.12, 'square', 0.15);
  }

  // Reward drop sound (common tier - simple chime)
  function playRewardCommon() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.02;
    playNote(880, t, 0.12, 'sine', 0.2);
    playNote(1174.7, t + 0.1, 0.15, 'sine', 0.2);
    playNote(1396.9, t + 0.2, 0.3, 'sine', 0.18);
  }

  // Reward drop sound (rare tier - ascending sparkle)
  function playRewardRare() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.02;
    playNote(659.25, t, 0.1, 'sine', 0.18);
    playNote(880, t + 0.08, 0.1, 'sine', 0.2);
    playNote(1174.7, t + 0.16, 0.1, 'sine', 0.22);
    playNote(1396.9, t + 0.24, 0.12, 'sine', 0.22);
    playNote(1760, t + 0.34, 0.4, 'sine', 0.25);
  }

  // Reward drop sound (ultra rare - dramatic fanfare)
  function playRewardUltraRare() {
    if (!ctx) return; resume();
    let t = ctx.currentTime + 0.02;
    // Dramatic pause then ascending fanfare
    playNote(523.25, t, 0.15, 'square', 0.12);
    playNote(659.25, t + 0.12, 0.15, 'square', 0.14);
    playNote(783.99, t + 0.24, 0.15, 'square', 0.16);
    playNote(1046.5, t + 0.38, 0.12, 'sine', 0.2);
    playNote(1318.5, t + 0.48, 0.12, 'sine', 0.22);
    playNote(1568, t + 0.58, 0.15, 'sine', 0.22);
    playNote(2093, t + 0.72, 0.5, 'sine', 0.25);
    // Sparkle overtone
    playNote(2637, t + 0.85, 0.3, 'sine', 0.1);
    playNote(3136, t + 0.95, 0.3, 'sine', 0.08);
  }

  function playRewardSound(tier) {
    if (tier === 'ultra_rare') playRewardUltraRare();
    else if (tier === 'rare') playRewardRare();
    else playRewardCommon();
  }

  // Ambient rain loop (white noise filtered through bandpass)
  let rainGain = null;
  let rainNodes = []; // track oscillators for cleanup
  let rainActive = false;

  function startRainAmbience() {
    if (!ctx || muted || rainActive) return;
    resume();
    rainActive = true;
    rainGain = ctx.createGain();
    rainGain.gain.value = 0;
    rainGain.connect(masterGain);

    // Create multiple filtered noise sources for rain texture
    // We use detuned oscillators with noise-like characteristics
    const freqs = [200, 400, 800, 1600, 3200];
    const vols = [0.015, 0.012, 0.008, 0.006, 0.004];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const bandGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.value = freq + Math.random() * 50;
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 0.5;
      bandGain.gain.value = vols[i];
      osc.connect(filter);
      filter.connect(bandGain);
      bandGain.connect(rainGain);
      osc.start();
      rainNodes.push({ osc, filter, bandGain });
    });

    // Fade in
    rainGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 2);
  }

  function stopRainAmbience() {
    if (!ctx || !rainActive) return;
    rainActive = false;
    if (rainGain) {
      rainGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    }
    // Clean up nodes after fade
    const nodesToClean = [...rainNodes];
    rainNodes = [];
    setTimeout(() => {
      nodesToClean.forEach(n => {
        try { n.osc.stop(); } catch(e) {}
      });
      rainGain = null;
    }, 2000);
  }

  function isRainPlaying() { return rainActive; }

  // === ElevenLabs Real Japanese Voice System ===
  const ELEVENLABS_API_KEY = 'sk_fdc4e35db2ff37ef0b2286d05c744a2e15e753be1c1778e4';
  // Hanako - young conversational Japanese female (standard accent)
  const ELEVENLABS_VOICE_ID = 'IIUvcn96WSMnC5WxNypI';
  const ELEVENLABS_MODEL = 'eleven_multilingual_v2';
  const ELEVENLABS_URL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

  // Audio cache: text -> { blob, url } to avoid re-fetching the same phrase
  const voiceCache = new Map();
  let currentVoiceAudio = null; // track current playing Audio element
  let voiceFetchInFlight = new Set(); // prevent duplicate fetches
  let elevenLabsAvailable = true; // set false on persistent failures

  // Fetch audio from ElevenLabs and cache it
  async function fetchVoiceAudio(text) {
    // Return cached version if available
    if (voiceCache.has(text)) return voiceCache.get(text);
    // Skip if already fetching this exact text
    if (voiceFetchInFlight.has(text)) return null;
    voiceFetchInFlight.add(text);

    try {
      const resp = await fetch(ELEVENLABS_URL, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: ELEVENLABS_MODEL,
          voice_settings: {
            stability: 0.50,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!resp.ok) {
        console.warn('ElevenLabs API error:', resp.status);
        if (resp.status === 401 || resp.status === 403) {
          elevenLabsAvailable = false; // bad key, stop trying
        }
        voiceFetchInFlight.delete(text);
        return null;
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const entry = { blob, url };
      voiceCache.set(text, entry);
      voiceFetchInFlight.delete(text);
      return entry;
    } catch (e) {
      console.warn('ElevenLabs fetch failed:', e);
      voiceFetchInFlight.delete(text);
      return null;
    }
  }

  // Preload common konbini phrases in background
  function preloadCommonPhrases() {
    const common = [
      // Clerk greetings/questions
      '\u3044\u3089\u3063\u3057\u3083\u3044\u307e\u305b',
      '\u30dd\u30a4\u30f3\u30c8\u30ab\u30fc\u30c9\u306f\u304a\u6301\u3061\u3067\u3059\u304b',
      '\u304a\u5f01\u5f53\u306f\u6e29\u3081\u307e\u3059\u304b',
      '\u30ec\u30b8\u888b\u306f\u3054\u5229\u7528\u3067\u3059\u304b',
      '\u304a\u7bb8\u306f\u304a\u4ed8\u3051\u3057\u307e\u3059\u304b',
      '\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3057\u305f',
      '\u307e\u305f\u304a\u8d8a\u3057\u304f\u3060\u3055\u3044\u307e\u305b',
      '\u3044\u304f\u3064\u304a\u4ed8\u3051\u3057\u307e\u3059\u304b',
      '\u3053\u3061\u3089\u3067\u304a\u53ec\u3057\u4e0a\u304c\u308a\u3067\u3059\u304b',
      // Common player responses
      '\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059',
      '\u306f\u3044\u3001\u304a\u9858\u3044\u3057\u307e\u3059',
      '\u5927\u4e08\u592b\u3067\u3059',
      '\u3055\u3088\u3046\u306a\u3089',
      '\u30d0\u30a4\u30d0\u30a4\uff01',
      '\u3053\u3093\u306b\u3061\u306f\uff01',
      '\u3042\u308a\u304c\u3068\u3046\uff01',
      '\u3044\u3089\u3063\u3057\u3083\u3044\u307e\u305b\uff01',
    ];
    // Stagger fetches to avoid rate limiting
    common.forEach((phrase, i) => {
      setTimeout(() => fetchVoiceAudio(phrase), i * 1200);
    });
  }

  // Fallback to Web Speech API
  function speakJapaneseFallback(text) {
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'ja-JP';
      utt.rate = 0.85;
      const voices = window.speechSynthesis.getVoices();
      const jpVoice = voices.find(v => v.lang.startsWith('ja'));
      if (jpVoice) utt.voice = jpVoice;
      window.speechSynthesis.speak(utt);
    } catch(e) {}
  }

  // Main TTS function - uses ElevenLabs with fallback
  // Always attempts ElevenLabs first; only uses Web Speech API as last resort
  function speakJapanese(text) {
    if (muted || !text) return;

    // Stop any currently playing voice
    stopCurrentVoice();

    if (!elevenLabsAvailable) {
      speakJapaneseFallback(text);
      return;
    }

    // Check cache first for instant playback
    if (voiceCache.has(text)) {
      const entry = voiceCache.get(text);
      playVoiceFromCache(entry);
      return;
    }

    // Fetch from ElevenLabs and play as soon as it arrives
    // No fallback -- wait for the real voice
    fetchAndPlay(text);
  }

  // Fetch audio from ElevenLabs and play it immediately when ready
  async function fetchAndPlay(text) {
    const entry = await fetchVoiceAudio(text);
    if (entry) {
      // Only play if nothing else has started playing since we began fetching
      // (prevents stale audio from playing over newer requests)
      playVoiceFromCache(entry);
    } else {
      // ElevenLabs failed for this phrase -- fall back
      speakJapaneseFallback(text);
    }
  }

  // Stop any currently playing voice audio
  function stopCurrentVoice() {
    if (currentVoiceAudio) {
      try { currentVoiceAudio.pause(); currentVoiceAudio.currentTime = 0; } catch(e) {}
      currentVoiceAudio = null;
    }
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }

  function playVoiceFromCache(entry) {
    try {
      const audio = new Audio(entry.url);
      audio.volume = muted ? 0 : 0.85;
      currentVoiceAudio = audio;
      audio.play().catch(e => {
        console.warn('Voice playback failed:', e);
        // Fallback not needed -- cache hit means we tried before
      });
      audio.onended = () => {
        if (currentVoiceAudio === audio) currentVoiceAudio = null;
      };
    } catch(e) {
      console.warn('Voice Audio() failed:', e);
    }
  }

  // Expose voice system status for debugging
  function getVoiceStatus() {
    return {
      cached: voiceCache.size,
      inFlight: voiceFetchInFlight.size,
      elevenLabsAvailable,
      voiceId: ELEVENLABS_VOICE_ID
    };
  }

  // === KONBINI AMBIENT BGM SYSTEM ===
  // Gentle lo-fi muzak loop for store interiors — inspired by real konbini background music
  let bgmGain = null;
  let bgmNodes = [];
  let bgmActive = false;
  let bgmInterval = null;

  function startKonbiniBGM() {
    if (!ctx || muted || bgmActive) return;
    resume();
    bgmActive = true;
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0;
    bgmGain.connect(masterGain);

    // Soft pad chord (warm, muzak-like background)
    // Uses detuned sine waves for a gentle, dreamy quality
    const chords = [
      [261.6, 329.6, 392.0, 523.3],  // C major
      [293.7, 370.0, 440.0, 523.3],  // Dm7-ish
      [349.2, 440.0, 523.3, 659.3],  // F major
      [392.0, 493.9, 587.3, 784.0],  // G major
    ];
    let chordIdx = 0;

    function playChord() {
      if (!ctx || !bgmActive) return;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;
      const now = ctx.currentTime;

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq + (Math.random() - 0.5) * 1.5; // slight detune for warmth
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.025, now + 0.8);
        g.gain.exponentialRampToValueAtTime(0.018, now + 2.5);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
        osc.connect(g);
        g.connect(bgmGain);
        osc.start(now);
        osc.stop(now + 4.2);
      });

      // Gentle melody note on top (pentatonic scale for that elevator-music feel)
      const melodyNotes = [523.3, 587.3, 659.3, 784.0, 880.0, 784.0, 659.3, 587.3];
      const melodyNote = melodyNotes[chordIdx % melodyNotes.length];
      const melOsc = ctx.createOscillator();
      const melGain = ctx.createGain();
      melOsc.type = 'triangle';
      melOsc.frequency.value = melodyNote;
      melGain.gain.setValueAtTime(0.0001, now + 0.3);
      melGain.gain.exponentialRampToValueAtTime(0.03, now + 0.6);
      melGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
      melOsc.connect(melGain);
      melGain.connect(bgmGain);
      melOsc.start(now + 0.3);
      melOsc.stop(now + 2.7);
    }

    // Fade BGM in gently
    bgmGain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 3);

    // Play first chord, then repeat every 4 seconds
    playChord();
    bgmInterval = setInterval(playChord, 4000);
  }

  function stopKonbiniBGM() {
    if (!bgmActive) return;
    bgmActive = false;
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    if (bgmGain && ctx) {
      bgmGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      setTimeout(() => { bgmGain = null; }, 2000);
    }
  }

  function isBGMPlaying() { return bgmActive; }

  // === REGISTER / SCANNER BEEP ===
  // Barcode scanner beep sound — that classic konbini "pi!" sound
  function playRegisterBeep() {
    if (!ctx || muted) return; resume();
    const t = ctx.currentTime;
    // Sharp high-pitched beep (like a real barcode scanner)
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(2200, t + 0.08);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Double beep for item scan confirmation
  function playItemScan() {
    if (!ctx || muted) return; resume();
    const t = ctx.currentTime;
    // First beep
    playNote(2400, t, 0.06, 'sine', 0.15);
    // Second beep (slightly lower)
    playNote(2200, t + 0.1, 0.08, 'sine', 0.15);
  }

  // === BAG RUSTLING / ITEM SOUNDS ===
  // Plastic bag rustling — synthesized with filtered noise bursts
  function playBagRustle() {
    if (!ctx || muted) return; resume();
    const t = ctx.currentTime;

    // Create multiple short noise bursts for crinkle texture
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 3000 + Math.random() * 4000;
      filter.type = 'bandpass';
      filter.frequency.value = 4000 + Math.random() * 3000;
      filter.Q.value = 2 + Math.random() * 3;
      const offset = i * 0.08 + Math.random() * 0.04;
      const dur = 0.04 + Math.random() * 0.04;
      g.gain.setValueAtTime(0.0001, t + offset);
      g.gain.exponentialRampToValueAtTime(0.04, t + offset + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + offset + dur);
      osc.connect(filter);
      filter.connect(g);
      g.connect(masterGain);
      osc.start(t + offset);
      osc.stop(t + offset + dur + 0.02);
    }
  }

  // === CASH REGISTER KA-CHING ===
  // Classic cash register sound for purchase completion
  function playCashRegister() {
    if (!ctx || muted) return; resume();
    const t = ctx.currentTime;
    // Register drawer "ka" — percussive hit
    playNote(600, t, 0.04, 'square', 0.12);
    playNote(400, t + 0.02, 0.05, 'square', 0.08);
    // "Ching" — bright metallic ring
    playNote(2093, t + 0.08, 0.3, 'sine', 0.12);
    playNote(2637, t + 0.10, 0.25, 'sine', 0.10);
    playNote(3136, t + 0.12, 0.4, 'sine', 0.08);
    // Slight bell decay
    playNote(2093, t + 0.15, 0.5, 'triangle', 0.04);
  }

  // === COIN DROP SOUND ===
  // Coins being placed on the counter/tray
  function playCoinDrop() {
    if (!ctx || muted) return; resume();
    const t = ctx.currentTime;
    // Multiple small metallic "clinks"
    const clinks = [3520, 4186, 3729, 4698];
    clinks.forEach((freq, i) => {
      const offset = i * 0.06 + Math.random() * 0.03;
      playNote(freq, t + offset, 0.08, 'sine', 0.06 + Math.random() * 0.03);
    });
  }

  // === STREET AMBIENCE ===
  // Subtle urban background for overworld map — distant traffic hum + occasional sounds
  let streetGain = null;
  let streetNodes = [];
  let streetActive = false;

  function startStreetAmbience() {
    if (!ctx || muted || streetActive) return;
    resume();
    streetActive = true;
    streetGain = ctx.createGain();
    streetGain.gain.value = 0;
    streetGain.connect(masterGain);

    // Low frequency hum (distant traffic)
    const hum = ctx.createOscillator();
    const humFilter = ctx.createBiquadFilter();
    const humGain = ctx.createGain();
    hum.type = 'sawtooth';
    hum.frequency.value = 80;
    humFilter.type = 'lowpass';
    humFilter.frequency.value = 120;
    humFilter.Q.value = 0.7;
    humGain.gain.value = 0.012;
    hum.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(streetGain);
    hum.start();
    streetNodes.push({ osc: hum });

    // Mid-range city texture (wind between buildings)
    const wind = ctx.createOscillator();
    const windFilter = ctx.createBiquadFilter();
    const windGain = ctx.createGain();
    wind.type = 'sawtooth';
    wind.frequency.value = 300 + Math.random() * 100;
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 350;
    windFilter.Q.value = 0.3;
    windGain.gain.value = 0.005;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(streetGain);
    wind.start();
    streetNodes.push({ osc: wind });

    // Fade in gently
    streetGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
  }

  function stopStreetAmbience() {
    if (!ctx || !streetActive) return;
    streetActive = false;
    if (streetGain) {
      streetGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    }
    const nodesToClean = [...streetNodes];
    streetNodes = [];
    setTimeout(() => {
      nodesToClean.forEach(n => {
        try { n.osc.stop(); } catch(e) {}
      });
      streetGain = null;
    }, 2000);
  }

  function isStreetPlaying() { return streetActive; }

  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }

  return {
    init, resume, toggleMute, isMuted,
    playStoreChime, playCorrect, playWrong,
    playLevelComplete, playStar, playSelect,
    playCursor, playFootstep, playDoor, playAlert,
    speakJapanese, stopCurrentVoice, playRewardSound,
    playSlidingDoor, playSlidingDoorClose,
    startRainAmbience, stopRainAmbience, isRainPlaying,
    preloadCommonPhrases, fetchVoiceAudio, getVoiceStatus,
    // Sound Design additions
    startKonbiniBGM, stopKonbiniBGM, isBGMPlaying,
    playRegisterBeep, playItemScan,
    playBagRustle, playCashRegister, playCoinDrop,
    startStreetAmbience, stopStreetAmbience, isStreetPlaying,
  };
})();
