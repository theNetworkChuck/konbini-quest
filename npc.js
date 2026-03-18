/* Konbini Quest v2 - NPC Definitions & Interaction System */
const NPCs = (() => {

  // Level distribution across stores
  // 7-Eleven: levels 1,4,7,10 (Welcome, Point Card, How Much, Full Checkout)
  // Lawson: levels 2,5,8,11 (Thank You, Heat It Up, Where Is It, Age Check)
  // FamilyMart: levels 3,6,9,12 (The Bag, Chopsticks, Famichiki, Master)
  const storeLevels = {
    '7-Eleven': [0, 3, 6, 9],    // indices into LEVELS array
    'Lawson':   [1, 4, 7, 10],
    'FamilyMart': [2, 5, 8, 11],
  };

  // NPC definitions per map
  // Map 0: Street NPCs + store front indicators
  // Maps 1-3: Store clerks

  const npcDefs = [
    // === MAP 0: STREET ===
    // Review Sensei (spaced repetition NPC)
    { map: 0, x: 8, y: 13, type: 'sensei', name: 'Sensei', dir: 'down',
      isSensei: true,
      dialogues: [
        "Practice makes perfect! Let me quiz you on what you've learned.",
        "Repetition is the mother of all learning! 復習は学習の母！",
        "Come back after completing more levels for review practice!"
      ]
    },
    // Old man near park bench
    { map: 0, x: 5, y: 10, type: 'oldman', name: 'Old Man', dir: 'down',
      dialogues: [
        "In Japan, silence is golden at the konbini. Don't stress about every clerk question!",
        "The two magic words: はい、お願いします for yes, 大丈夫です for no.",
        "Most konbini clerks won't judge you for being quiet. Just nod and smile!"
      ]
    },
    // School girl near vending machine
    { map: 0, x: 14, y: 9, type: 'schoolgirl', name: 'Yuki', dir: 'down',
      dialogues: [
        "Did you know FamilyMart's entry chime is actually a doorbell composed in 1978?",
        "It's called 「大盛況」 — 'Great Success' in D major! So catchy!",
        "Try listening carefully when you enter each store. They all sound different!"
      ]
    },
    // Businessman
    { map: 0, x: 3, y: 14, type: 'businessman', name: 'Tanaka', dir: 'right',
      dialogues: [
        "Always use the money tray when paying with cash! Never hand money directly.",
        "I visit konbini twice a day. The coffee at 7-Eleven is excellent!",
        "Pro tip: say [method]でお願いします for any payment — cash, card, Suica, anything!"
      ]
    },
    // Challenge Master NPC (daily challenge / streak system)
    { map: 0, x: 12, y: 14, type: 'challenger', name: 'Hana', dir: 'left',
      isChallenger: true,
      dialogues: [
        "チャレンジタイム！ I'm Hana, the Challenge Master!",
        "Test your konbini skills with my rapid-fire quizzes!",
        "Build a streak and earn bonus stars! 連勝 (renshō) means winning streak!"
      ]
    },

    // === MAP 1: 7-ELEVEN CLERK ===
    { map: 1, x: 8, y: 10, type: 'clerk', store: '7-Eleven', name: 'Clerk', dir: 'down',
      isClerk: true },

    // === MAP 2: LAWSON CLERK ===
    { map: 2, x: 8, y: 10, type: 'clerk', store: 'Lawson', name: 'Clerk', dir: 'down',
      isClerk: true },

    // === MAP 3: FAMILYMART CLERK ===
    { map: 3, x: 8, y: 10, type: 'clerk', store: 'FamilyMart', name: 'Clerk', dir: 'down',
      isClerk: true },
  ];

  // Progress tracking (in-memory only)
  const progress = {
    // For each store, track which level index is current (0-based within store's levels)
    '7-Eleven': { current: 0, completed: [], stars: {} },
    'Lawson':   { current: 0, completed: [], stars: {} },
    'FamilyMart': { current: 0, completed: [], stars: {} },
  };

  // ============ SPACED REPETITION SYSTEM ============
  // Each phrase is keyed by "levelId_interactionIdx"
  // mastery: 0=new, 1=seen, 2=learning, 3=familiar, 4=mastered
  // interval: how many completed levels before next review
  // wrongCount: total times answered wrong
  // lastReviewAt: completedLevelsCount when last reviewed
  const phraseTracker = {};
  let completedLevelsCount = 0; // global counter of levels finished

  function trackPhrase(levelId, interactionIdx, wasCorrect) {
    const key = `${levelId}_${interactionIdx}`;
    if (!phraseTracker[key]) {
      phraseTracker[key] = {
        levelId, interactionIdx,
        mastery: 0, interval: 1, wrongCount: 0,
        lastReviewAt: completedLevelsCount,
        correctStreak: 0
      };
    }
    const p = phraseTracker[key];
    p.lastReviewAt = completedLevelsCount;

    if (wasCorrect) {
      p.correctStreak++;
      // Increase interval: 1 → 2 → 4 → 8 (capped)
      if (p.correctStreak >= 2) {
        p.interval = Math.min(8, p.interval * 2);
        p.mastery = Math.min(4, p.mastery + 1);
      } else {
        p.mastery = Math.max(1, p.mastery);
      }
    } else {
      p.wrongCount++;
      p.correctStreak = 0;
      // Reset interval on mistakes
      p.interval = 1;
      p.mastery = Math.max(1, p.mastery - 1);
    }
  }

  function incrementCompletedLevels() {
    completedLevelsCount++;
  }

  // Get phrases that are due for review (interval elapsed)
  function getReviewPhrases(maxCount) {
    const due = [];
    for (const key of Object.keys(phraseTracker)) {
      const p = phraseTracker[key];
      const elapsed = completedLevelsCount - p.lastReviewAt;
      if (elapsed >= p.interval && p.mastery < 4) {
        due.push({ ...p, key, priority: p.wrongCount * 3 + (4 - p.mastery) + elapsed });
      }
    }
    // Sort by priority (hardest/most overdue first)
    due.sort((a, b) => b.priority - a.priority);
    return due.slice(0, maxCount || 5);
  }

  // Check if any reviews are available
  function hasReviewsAvailable() {
    for (const key of Object.keys(phraseTracker)) {
      const p = phraseTracker[key];
      const elapsed = completedLevelsCount - p.lastReviewAt;
      if (elapsed >= p.interval && p.mastery < 4) return true;
    }
    return false;
  }

  // Get the interaction data for a tracked phrase
  function getInteractionForPhrase(phraseData) {
    const level = LEVELS.find(l => l.id === phraseData.levelId);
    if (!level) return null;
    return level.interactions[phraseData.interactionIdx] || null;
  }

  // Get review stats for display
  function getReviewStats() {
    let total = Object.keys(phraseTracker).length;
    let mastered = 0;
    let learning = 0;
    for (const key of Object.keys(phraseTracker)) {
      if (phraseTracker[key].mastery >= 4) mastered++;
      else if (phraseTracker[key].mastery >= 1) learning++;
    }
    return { total, mastered, learning, due: getReviewPhrases(99).length };
  }

  // ============ CHALLENGE / STREAK SYSTEM ============
  // Session-only streak tracking (in-memory only, resets on page reload)
  const challengeState = {
    streak: 0,
    bestStreak: 0,
    challengesCompleted: 0,
    lastChallengeCorrect: 0,
    lastChallengeTotal: 0,
    cooldownUntil: 0, // timestamp when next challenge is available
  };

  // Challenge types for variable reward
  const CHALLENGE_TYPES = [
    { name: 'Speed Round', nameJp: 'スピードラウンド', count: 3, description: '3 quick-fire questions!' },
    { name: 'Mix Master', nameJp: 'ミックスマスター', count: 4, description: '4 questions from different stores!' },
    { name: 'Survival', nameJp: 'サバイバル', count: 5, description: '5 questions — one mistake and it\'s over!' },
  ];

  // Get a random challenge if player has learned enough phrases
  function canStartChallenge() {
    const tracked = Object.keys(phraseTracker);
    return tracked.length >= 3; // need at least 3 phrases to create a challenge
  }

  // Build a random challenge quiz set from learned phrases
  function buildChallengeQuiz(count) {
    const allTracked = Object.keys(phraseTracker).map(key => phraseTracker[key]);
    if (allTracked.length < count) count = allTracked.length;

    // Weighted random selection: harder phrases (lower mastery, more wrong) are more likely
    const weighted = allTracked.map(p => ({
      ...p,
      weight: (5 - p.mastery) * 2 + p.wrongCount + 1 + Math.random() * 2
    }));
    weighted.sort((a, b) => b.weight - a.weight);

    // Pick top N but shuffle to prevent predictability
    const selected = weighted.slice(0, Math.min(count + 2, weighted.length));
    // Shuffle and take 'count'
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }
    return selected.slice(0, count);
  }

  // Get a random challenge type (variable reward = different types)
  function getRandomChallengeType() {
    // Higher streaks have higher chance of harder challenges
    const streakBonus = Math.min(challengeState.streak, 5);
    const weights = [
      Math.max(1, 5 - streakBonus),  // Speed Round (easier, less likely at high streak)
      3,                               // Mix Master (always mid)
      1 + streakBonus,                 // Survival (harder, more likely at high streak)
    ];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) return CHALLENGE_TYPES[i];
    }
    return CHALLENGE_TYPES[0];
  }

  // Record challenge result
  function recordChallengeResult(correct, total, isSurvival) {
    challengeState.lastChallengeCorrect = correct;
    challengeState.lastChallengeTotal = total;
    challengeState.challengesCompleted++;

    // For survival mode: any mistake breaks streak
    const passed = isSurvival ? (correct === total) : (correct >= Math.ceil(total * 0.6));

    if (passed) {
      challengeState.streak++;
      challengeState.bestStreak = Math.max(challengeState.bestStreak, challengeState.streak);
    } else {
      challengeState.streak = 0;
    }

    // Short cooldown between challenges (30 seconds of game time)
    challengeState.cooldownUntil = Date.now() + 30000;

    return passed;
  }

  function getChallengeState() {
    return { ...challengeState };
  }

  function isChallengeReady() {
    return canStartChallenge() && Date.now() >= challengeState.cooldownUntil;
  }

  // ============ STAMP CARD COLLECTION SYSTEM ============
  // Each store has a stamp card with slots for each level
  // Stamps have tiers: empty(0), bronze(1)=completed, silver(2)=few mistakes, gold(3)=perfect
  // Collecting all gold stamps per store unlocks a "Master Stamp"
  const stampCards = {
    '7-Eleven': { stamps: [0, 0, 0, 0], masterStamp: false },
    'Lawson':   { stamps: [0, 0, 0, 0], masterStamp: false },
    'FamilyMart': { stamps: [0, 0, 0, 0], masterStamp: false },
  };

  // Award stamp when a level is completed
  // tier: 3=gold(perfect), 2=silver(1-2 mistakes), 1=bronze(3+ mistakes)
  function awardStamp(store, levelIdx, tier) {
    const card = stampCards[store];
    if (!card) return;
    // Only upgrade, never downgrade
    card.stamps[levelIdx] = Math.max(card.stamps[levelIdx], tier);
    // Check if all stamps are gold for master stamp
    if (card.stamps.every(s => s >= 3)) {
      card.masterStamp = true;
    }
  }

  function getStampCard(store) {
    return stampCards[store] || { stamps: [0, 0, 0, 0], masterStamp: false };
  }

  function getAllStampCards() {
    return { ...stampCards };
  }

  // Get total stamps collected (any tier > 0 counts)
  function getTotalStamps() {
    let total = 0;
    let max = 0;
    for (const store of Object.keys(stampCards)) {
      const card = stampCards[store];
      for (const s of card.stamps) {
        if (s > 0) total++;
      }
      max += card.stamps.length;
      if (card.masterStamp) total++; // bonus for master
      max++; // master slot
    }
    return { total, max };
  }

  // Get stamp tier label
  function getStampTierName(tier) {
    if (tier >= 3) return 'gold';
    if (tier >= 2) return 'silver';
    if (tier >= 1) return 'bronze';
    return 'empty';
  }

  // Check if any new stamp was just earned (for notification)
  let lastStampCount = 0;
  function checkNewStamp() {
    const { total } = getTotalStamps();
    if (total > lastStampCount) {
      const diff = total - lastStampCount;
      lastStampCount = total;
      return diff;
    }
    return 0;
  }

  // Street NPC dialogue index
  const streetNPCState = {};

  function getNPCsOnMap(mapIdx) {
    return npcDefs.filter(n => n.map === mapIdx);
  }

  function getNPCAt(mapIdx, x, y) {
    return npcDefs.find(n => n.map === mapIdx && n.x === x && n.y === y);
  }

  // Check if there's an NPC blocking movement
  function isNPCBlocking(mapIdx, x, y) {
    return npcDefs.some(n => n.map === mapIdx && n.x === x && n.y === y);
  }

  // Get store progress
  function getStoreProgress(store) {
    return progress[store] || { current: 0, completed: [], stars: {} };
  }

  // Check if store has available interaction
  function hasAvailableInteraction(store) {
    const p = progress[store];
    const levels = storeLevels[store];
    return p && p.current < levels.length;
  }

  // Check if store is all complete
  function isStoreComplete(store) {
    const p = progress[store];
    const levels = storeLevels[store];
    return p && p.current >= levels.length;
  }

  // Get current level for a store
  function getCurrentLevel(store) {
    const p = progress[store];
    const levels = storeLevels[store];
    if (!p || p.current >= levels.length) return null;
    return LEVELS[levels[p.current]];
  }

  // Complete a level interaction
  function completeLevelInteraction(store, interactionIdx, stars) {
    const p = progress[store];
    const levels = storeLevels[store];
    const levelGlobalIdx = levels[p.current];
    const key = `${levelGlobalIdx}_${interactionIdx}`;
    p.stars[key] = Math.max(p.stars[key] || 0, stars);
  }

  // Advance to next level in store
  function advanceStoreLevel(store) {
    const p = progress[store];
    if (p) p.current++;
  }

  // Get total stars
  function getTotalStars() {
    let total = 0;
    for (const store of Object.keys(progress)) {
      const p = progress[store];
      for (const key of Object.keys(p.stars)) {
        total += p.stars[key];
      }
    }
    return total;
  }

  // Get max possible stars
  function getMaxStars() {
    let total = 0;
    for (const level of LEVELS) {
      total += level.interactions.length * 3; // 3 stars per interaction
    }
    return total;
  }

  // Get street NPC next dialogue
  function getStreetDialogue(npcDef) {
    const key = `${npcDef.x}_${npcDef.y}`;
    if (!streetNPCState[key]) streetNPCState[key] = 0;
    const idx = streetNPCState[key] % npcDef.dialogues.length;
    streetNPCState[key]++;
    return npcDef.dialogues[idx];
  }

  return {
    npcDefs,
    storeLevels,
    progress,
    getNPCsOnMap,
    getNPCAt,
    isNPCBlocking,
    getStoreProgress,
    hasAvailableInteraction,
    isStoreComplete,
    getCurrentLevel,
    completeLevelInteraction,
    advanceStoreLevel,
    getTotalStars,
    getMaxStars,
    getStreetDialogue,
    // Spaced repetition
    trackPhrase,
    incrementCompletedLevels,
    getReviewPhrases,
    hasReviewsAvailable,
    getInteractionForPhrase,
    getReviewStats,
    phraseTracker,
    // Challenge system
    canStartChallenge,
    isChallengeReady,
    getRandomChallengeType,
    buildChallengeQuiz,
    recordChallengeResult,
    getChallengeState,
    // Stamp card collection
    awardStamp,
    getStampCard,
    getAllStampCards,
    getTotalStamps,
    getStampTierName,
    checkNewStamp,
  };
})();
