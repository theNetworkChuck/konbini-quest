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

  // TTS
  function speakJapanese(text) {
    if (muted || !text) return;
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

  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }

  return {
    init, resume, toggleMute, isMuted,
    playStoreChime, playCorrect, playWrong,
    playLevelComplete, playStar, playSelect,
    playCursor, playFootstep, playDoor, playAlert,
    speakJapanese, playRewardSound,
    playSlidingDoor, playSlidingDoorClose,
    startRainAmbience, stopRainAmbience, isRainPlaying,
  };
})();
