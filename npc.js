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
    // Payment Coach NPC (payment method practice)
    { map: 0, x: 17, y: 10, type: 'paymentcoach', name: 'Reiko', dir: 'left',
      isPaymentCoach: true,
      dialogues: [
        "お支払い (o-shiharai) means payment! Let me teach you every method.",
        "In Japan, always tell the clerk HOW you want to pay.",
        "The pattern is simple: [method] + で + お願いします!"
      ]
    },
    // Seasonal Guide NPC (seasonal konbini vocabulary)
    { map: 0, x: 10, y: 15, type: 'seasonalguide', name: 'Obaa-chan', dir: 'up',
      isSeasonalGuide: true,
      dialogues: [
        "季節 (kisetsu) means season! Japanese konbini change with the seasons.",
        "In winter, warm oden by the register. In summer, cold noodles on ice!",
        "季節限定 (kisetsu gentei) means limited seasonal item -- always exciting!"
      ]
    },

    // Politeness Coach NPC (casual -> polite -> keigo)
    { map: 0, x: 6, y: 14, type: 'politenesscoach', name: 'Keiko', dir: 'right',
      isPolitenessCoach: true,
      dialogues: [
        "丁寧語 (teineigo) means polite language! It's the heart of Japanese manners.",
        "In a konbini, clerks always use keigo. Learning it shows deep respect!",
        "Casual → Polite → Keigo: three steps to sounding truly Japanese."
      ]
    },

    // Kansai Dialect Coach NPC
    { map: 0, x: 15, y: 14, type: 'kansaicoach', name: 'Takoyaki', dir: 'down',
      isKansaiCoach: true,
      dialogues: [
        "\u307E\u3044\u3069! I'm Takoyaki, from Osaka! Let me teach ya Kansai-ben!",
        "\u95A2\u897F\u5F01 (Kansai-ben) is the dialect of the Osaka region!",
        "In Kansai, we don't say \u3042\u308A\u304C\u3068\u3046... we say \u304A\u304A\u304D\u306B!"
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

  // ============ MISTAKE JOURNAL ============
  // Records every wrong answer with full context for review
  // Each entry: { clerkJp, clerkEn, chosenText, correctText, correctEn, source, timestamp, count }
  const mistakeJournal = [];
  let newMistakeCount = 0; // unviewed mistakes

  function recordMistake(entry) {
    // Check if this exact mistake already exists (same clerk line + same wrong choice)
    const existing = mistakeJournal.find(
      m => m.clerkJp === entry.clerkJp && m.chosenText === entry.chosenText
    );
    if (existing) {
      existing.count++;
      existing.timestamp = Date.now();
      // Move to front (most recent)
      const idx = mistakeJournal.indexOf(existing);
      if (idx > 0) {
        mistakeJournal.splice(idx, 1);
        mistakeJournal.unshift(existing);
      }
    } else {
      mistakeJournal.unshift({
        clerkJp: entry.clerkJp || '',
        clerkEn: entry.clerkEn || '',
        chosenText: entry.chosenText || '',
        correctText: entry.correctText || '',
        correctEn: entry.correctEn || '',
        source: entry.source || 'Store', // Store, Review, Challenge, Payment, etc.
        timestamp: Date.now(),
        count: 1,
      });
    }
    newMistakeCount++;
    // Cap journal at 50 entries
    if (mistakeJournal.length > 50) mistakeJournal.length = 50;
  }

  function getMistakeJournal() {
    return mistakeJournal;
  }

  function getMistakeCount() {
    return mistakeJournal.length;
  }

  function hasNewMistakes() {
    return newMistakeCount > 0;
  }

  function markMistakesViewed() {
    newMistakeCount = 0;
  }

  // Get top repeated mistakes (most-missed phrases)
  function getTopMistakes(max) {
    return mistakeJournal
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, max || 5);
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

  // ============ VARIABLE REWARDS SYSTEM ============
  // Bonus phrases: rare collectible phrases not in the main curriculum
  // Three tiers: common (60%), rare (30%), ultra_rare (10%)
  // Based on Nir Eyal's variable ratio reinforcement schedule
  const BONUS_PHRASES = [
    // Common tier - useful everyday phrases
    { id: 'bp1', jp: 'すみません', romaji: 'Sumimasen', en: 'Excuse me', tier: 'common', category: 'basics' },
    { id: 'bp2', jp: 'いくらですか？', romaji: 'Ikura desu ka?', en: 'How much is it?', tier: 'common', category: 'shopping' },
    { id: 'bp3', jp: 'これをください', romaji: 'Kore o kudasai', en: 'This one, please', tier: 'common', category: 'shopping' },
    { id: 'bp4', jp: 'ちょっと待ってください', romaji: 'Chotto matte kudasai', en: 'Please wait a moment', tier: 'common', category: 'basics' },
    { id: 'bp5', jp: '大丈夫', romaji: 'Daijoubu', en: 'It\'s okay / I\'m fine', tier: 'common', category: 'basics' },
    { id: 'bp6', jp: '袋は別々でお願いします', romaji: 'Fukuro wa betsubetsu de onegaishimasu', en: 'Separate bags, please', tier: 'common', category: 'konbini' },
    { id: 'bp7', jp: 'ストローをください', romaji: 'Sutoroo o kudasai', en: 'A straw, please', tier: 'common', category: 'konbini' },
    { id: 'bp8', jp: 'おしぼりください', romaji: 'Oshibori kudasai', en: 'A wet towel, please', tier: 'common', category: 'konbini' },
    // Rare tier - situational konbini phrases
    { id: 'bp9', jp: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?', en: 'Where is the restroom?', tier: 'rare', category: 'konbini' },
    { id: 'bp10', jp: 'これは辛いですか？', romaji: 'Kore wa karai desu ka?', en: 'Is this spicy?', tier: 'rare', category: 'food' },
    { id: 'bp11', jp: 'おすすめは何ですか？', romaji: 'Osusume wa nan desu ka?', en: 'What do you recommend?', tier: 'rare', category: 'food' },
    { id: 'bp12', jp: 'チャージお願いします', romaji: 'Chaaji onegaishimasu', en: 'Please charge (my IC card)', tier: 'rare', category: 'payment' },
    { id: 'bp13', jp: '温かいのと冷たいの、どちらがいいですか？', romaji: 'Atatakai no to tsumetai no, dochira ga ii desu ka?', en: 'Warm or cold, which is better?', tier: 'rare', category: 'food' },
    { id: 'bp14', jp: '切手はありますか？', romaji: 'Kitte wa arimasu ka?', en: 'Do you have stamps?', tier: 'rare', category: 'konbini' },
    // Ultra rare tier - advanced / culturally deep phrases
    { id: 'bp15', jp: 'お手洗いお借りしてもいいですか？', romaji: 'Otearai okari shite mo ii desu ka?', en: 'May I borrow the restroom? (very polite)', tier: 'ultra_rare', category: 'keigo' },
    { id: 'bp16', jp: 'お先にどうぞ', romaji: 'Osaki ni douzo', en: 'After you (letting someone go first)', tier: 'ultra_rare', category: 'manners' },
    { id: 'bp17', jp: 'お釣りは結構です', romaji: 'Otsuri wa kekkou desu', en: 'Keep the change (very rare usage)', tier: 'ultra_rare', category: 'payment' },
    { id: 'bp18', jp: '申し訳ございません', romaji: 'Moushiwake gozaimasen', en: 'I\'m terribly sorry (highest politeness)', tier: 'ultra_rare', category: 'keigo' },
    { id: 'bp19', jp: 'ご馳走様でした', romaji: 'Gochisousama deshita', en: 'Thanks for the meal (after eating)', tier: 'ultra_rare', category: 'manners' },
    { id: 'bp20', jp: 'いただきます', romaji: 'Itadakimasu', en: 'I humbly receive (before eating)', tier: 'ultra_rare', category: 'manners' },
  ];

  // Collected bonus phrases (in-memory)
  const collectedPhrases = {}; // keyed by id
  let totalRewardsGiven = 0;

  // Tier colors and labels
  const TIER_INFO = {
    common:     { label: 'COMMON',     labelJp: '普通',   color: '#cd7f32', chance: 0.60 },
    rare:       { label: 'RARE',       labelJp: 'レア',   color: '#C0C0C0', chance: 0.30 },
    ultra_rare: { label: 'ULTRA RARE', labelJp: '超レア', color: '#FFD700', chance: 0.10 },
  };

  // Roll for a variable reward after a correct answer
  // Returns null (no reward) or a bonus phrase object
  // Base chance: ~25% per correct answer, increases slightly with streak
  function rollVariableReward(streakBonus) {
    const baseChance = 0.25;
    const bonus = Math.min((streakBonus || 0) * 0.03, 0.15);
    if (Math.random() > baseChance + bonus) return null;

    // Pick a tier using weighted random
    const roll = Math.random();
    let tier;
    if (roll < TIER_INFO.ultra_rare.chance) {
      tier = 'ultra_rare';
    } else if (roll < TIER_INFO.ultra_rare.chance + TIER_INFO.rare.chance) {
      tier = 'rare';
    } else {
      tier = 'common';
    }

    // Pick a random phrase from that tier, preferring uncollected
    const tierPhrases = BONUS_PHRASES.filter(p => p.tier === tier);
    const uncollected = tierPhrases.filter(p => !collectedPhrases[p.id]);
    const pool = uncollected.length > 0 ? uncollected : tierPhrases;
    const phrase = pool[Math.floor(Math.random() * pool.length)];

    // Mark as collected
    if (!collectedPhrases[phrase.id]) {
      collectedPhrases[phrase.id] = { ...phrase, collectedAt: Date.now(), isNew: true };
    }
    totalRewardsGiven++;

    return { ...phrase, tierInfo: TIER_INFO[tier] };
  }

  function getCollectedPhrases() {
    return Object.values(collectedPhrases);
  }

  function getCollectedCount() {
    return Object.keys(collectedPhrases).length;
  }

  function getTotalBonusPhrases() {
    return BONUS_PHRASES.length;
  }

  function markPhraseSeen(phraseId) {
    if (collectedPhrases[phraseId]) {
      collectedPhrases[phraseId].isNew = false;
    }
  }

  function hasNewPhrases() {
    return Object.values(collectedPhrases).some(p => p.isNew);
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

  // ============ NPC WALK CYCLE SYSTEM ============
  // Only street NPCs without special roles wander (not sensei/challenger/clerks)
  const WANDER_TYPES = new Set(['oldman', 'schoolgirl', 'businessman']);
  const WALK_SPEED = 12; // frames per tile move (~200ms at 60fps)
  const PAUSE_MIN = 90;  // min pause frames (~1.5s)
  const PAUSE_MAX = 240; // max pause frames (~4s)
  const DIRECTIONS = ['up', 'down', 'left', 'right'];
  const DIR_DX = { up: 0, down: 0, left: -1, right: 1 };
  const DIR_DY = { up: -1, down: 1, left: 0, right: 0 };

  // Walk state per NPC (keyed by index in npcDefs)
  const npcWalkState = {};

  function initNPCWalking() {
    for (let i = 0; i < npcDefs.length; i++) {
      const npc = npcDefs[i];
      if (npc.map === 0 && WANDER_TYPES.has(npc.type)) {
        npcWalkState[i] = {
          homeX: npc.x,
          homeY: npc.y,
          walking: false,
          walkTimer: 0,
          walkFrame: 0, // 0 to 1 interpolation
          pauseTimer: Math.floor(Math.random() * PAUSE_MAX) + 30, // stagger starts
          dir: npc.dir || 'down',
          animFrame: 0,
          prevX: npc.x,
          prevY: npc.y,
        };
      }
    }
  }

  // Check if tile is walkable for NPC (must be walkable, not occupied by player or another NPC)
  function isNPCWalkable(mapIdx, x, y, playerX, playerY, npcIdx) {
    // Out of bounds
    const map = Maps.allMaps[mapIdx];
    if (!map || x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
    // Map collision
    if (!Maps.isWalkable(mapIdx, x, y)) return false;
    // Player collision
    if (x === playerX && y === playerY) return false;
    // Other NPC collision (check tile positions)
    for (let i = 0; i < npcDefs.length; i++) {
      if (i === npcIdx) continue;
      const other = npcDefs[i];
      if (other.map === mapIdx && other.x === x && other.y === y) return false;
    }
    // Stay within 3 tiles of home (leash distance)
    const ws = npcWalkState[npcIdx];
    if (ws) {
      const dist = Math.abs(x - ws.homeX) + Math.abs(y - ws.homeY);
      if (dist > 3) return false;
    }
    return true;
  }

  function updateNPCWalking(playerX, playerY, dialogueActive) {
    for (let i = 0; i < npcDefs.length; i++) {
      const ws = npcWalkState[i];
      if (!ws) continue;
      const npc = npcDefs[i];

      // Don't move while dialogue is active
      if (dialogueActive) {
        if (ws.walking) {
          // Snap to destination
          ws.walking = false;
          ws.walkTimer = 0;
          ws.walkFrame = 0;
        }
        continue;
      }

      if (ws.walking) {
        // Currently walking -- advance timer
        ws.walkTimer++;
        ws.walkFrame = Math.min(ws.walkTimer / WALK_SPEED, 1);
        // Toggle anim frame mid-walk
        ws.animFrame = ws.walkTimer < WALK_SPEED / 2 ? 0 : 1;

        if (ws.walkTimer >= WALK_SPEED) {
          // Walk complete
          ws.walking = false;
          ws.walkTimer = 0;
          ws.walkFrame = 0;
          ws.animFrame = 0;
          // Set new pause timer
          ws.pauseTimer = PAUSE_MIN + Math.floor(Math.random() * (PAUSE_MAX - PAUSE_MIN));
        }
      } else {
        // Pausing -- countdown
        ws.pauseTimer--;
        if (ws.pauseTimer <= 0) {
          // Try to pick a random direction to walk
          const shuffled = [...DIRECTIONS].sort(() => Math.random() - 0.5);
          let moved = false;
          for (const dir of shuffled) {
            const nx = npc.x + DIR_DX[dir];
            const ny = npc.y + DIR_DY[dir];
            if (isNPCWalkable(0, nx, ny, playerX, playerY, i)) {
              // Start walking
              ws.prevX = npc.x;
              ws.prevY = npc.y;
              ws.dir = dir;
              npc.dir = dir;
              npc.x = nx;
              npc.y = ny;
              ws.walking = true;
              ws.walkTimer = 0;
              ws.walkFrame = 0;
              moved = true;
              break;
            }
          }
          if (!moved) {
            // Couldn't move, just turn to face a random direction
            const randomDir = DIRECTIONS[Math.floor(Math.random() * 4)];
            ws.dir = randomDir;
            npc.dir = randomDir;
            ws.pauseTimer = PAUSE_MIN + Math.floor(Math.random() * (PAUSE_MAX - PAUSE_MIN));
          }
        }
      }
    }
  }

  function getNPCWalkState(npcIdx) {
    return npcWalkState[npcIdx] || null;
  }

  // Get the NPC index in npcDefs for a given NPC object
  function getNPCIndex(npc) {
    return npcDefs.indexOf(npc);
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

  // ============ PAYMENT PRACTICE SYSTEM ============
  // Payment scenarios: realistic konbini payment interactions with proper keigo
  const PAYMENT_SCENARIOS = [
    {
      id: 'cash_basic',
      title: 'Paying with Cash',
      titleJp: '現金でのお支払い',
      difficulty: 1,
      interactions: [
        {
          clerkJp: '以上で三百円でございます。お支払い方法は？',
          clerkRomaji: 'Ij\u014d de sanbyaku-en de gozaimasu. O-shiharai h\u014dh\u014d wa?',
          clerkEn: 'That will be 300 yen. Payment method?',
          options: [
            { text: '現金でお願いします', romaji: 'Genkin de onegaishimasu', en: 'Cash, please', correct: true },
            { text: 'カードでお願いします', romaji: 'K\u0101do de onegaishimasu', en: 'Card, please', correct: false },
            { text: 'お金', romaji: 'O-kane', en: 'Money (too vague)', correct: false },
            { text: 'Cash please', en: '(in English)', correct: false }
          ],
          correctExplanation: '現金 (genkin) means cash. Pattern: [method] + \u3067 + \u304a\u9858\u3044\u3057\u307e\u3059!',
          wrongExplanation: 'For cash, say \u73fe\u91d1\u3067\u304a\u9858\u3044\u3057\u307e\u3059 (genkin de onegaishimasu).'
        },
        {
          clerkJp: '一万円か\u3089で\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f',
          clerkRomaji: 'Ichiman-en kara de yoroshii desu ka?',
          clerkEn: 'You\'re paying with a 10,000 yen bill, is that correct?',
          tip: 'The clerk confirms large bills. Just confirm!',
          options: [
            { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
            { text: 'いいえ', romaji: 'Iie', en: 'No', correct: false },
            { text: '大丈夫です', romaji: 'Daij\u014dbu desu', en: 'I\'m fine', correct: false }
          ],
          correctExplanation: 'The clerk is confirming a large bill. \u306f\u3044\u3001\u304a\u9858\u3044\u3057\u307e\u3059 confirms it!',
          wrongExplanation: 'The clerk is confirming your 10,000 yen note. Say \u306f\u3044\u3001\u304a\u9858\u3044\u3057\u307e\u3059!'
        }
      ]
    },
    {
      id: 'ic_card',
      title: 'IC Card Payment',
      titleJp: 'IC\u30ab\u30fc\u30c9\u3067\u304a\u652f\u6255\u3044',
      difficulty: 1,
      interactions: [
        {
          clerkJp: '\u304a\u652f\u6255\u3044\u65b9\u6cd5\u306f\u3044\u304b\u304c\u306a\u3055\u3044\u307e\u3059\u304b\uff1f',
          clerkRomaji: 'O-shiharai h\u014dh\u014d wa ikaga nasaimasu ka?',
          clerkEn: 'How would you like to pay?',
          tip: 'This is very polite keigo. For Suica/Pasmo, just say the card name + \u3067!',
          options: [
            { text: 'Suica\u3067\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'Suica de onegaishimasu', en: 'Suica, please', correct: true },
            { text: 'IC\u30ab\u30fc\u30c9\u3067', romaji: 'IC k\u0101do de', en: 'IC card (casual but okay)', correct: true },
            { text: '\u96fb\u5b50\u30de\u30cd\u30fc', romaji: 'Denshi man\u012b', en: 'E-money (too vague)', correct: false },
            { text: '[\u30ab\u30fc\u30c9\u3092\u7121\u8a00\u3067\u51fa\u3059]', en: 'Show card silently', correct: false }
          ],
          correctExplanation: 'Suica\u3067\u304a\u9858\u3044\u3057\u307e\u3059 or IC\u30ab\u30fc\u30c9\u3067 both work! The clerk needs to select it on the register.',
          wrongExplanation: 'Say the card name! Suica\u3067\u304a\u9858\u3044\u3057\u307e\u3059. The clerk must select the method first.'
        },
        {
          clerkJp: '\u30ab\u30fc\u30c9\u3092\u30bf\u30c3\u30c1\u3057\u3066\u304f\u3060\u3055\u3044',
          clerkRomaji: 'K\u0101do o tacchi shite kudasai',
          clerkEn: 'Please tap your card',
          options: [
            { text: '[\u30bf\u30c3\u30c1\u3059\u308b]', textJp: '[\u30bf\u30c3\u30c1\u3059\u308b]', en: 'Tap card on reader', correct: true },
            { text: '\u30ab\u30fc\u30c9\u3092\u6e21\u3059', romaji: 'K\u0101do o watasu', en: 'Hand card to clerk', correct: false },
            { text: '[\u4f55\u3082\u3057\u306a\u3044]', en: 'Do nothing', correct: false }
          ],
          correctExplanation: 'Just tap your IC card on the reader! \u30bf\u30c3\u30c1 (tacchi) is the "touch" sound.',
          wrongExplanation: 'Tap your card on the reader yourself! Never hand your IC card to the clerk.'
        }
      ]
    },
    {
      id: 'credit_card',
      title: 'Credit Card Payment',
      titleJp: '\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u3067\u304a\u652f\u6255\u3044',
      difficulty: 2,
      interactions: [
        {
          clerkJp: '\u304a\u652f\u6255\u3044\u65b9\u6cd5\u306f\uff1f',
          clerkRomaji: 'O-shiharai h\u014dh\u014d wa?',
          clerkEn: 'Payment method?',
          options: [
            { text: '\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u3067\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'Kurejitto k\u0101do de onegaishimasu', en: 'Credit card, please', correct: true },
            { text: '\u30ab\u30fc\u30c9\u3067\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'K\u0101do de onegaishimasu', en: 'Card, please', correct: true },
            { text: 'VISA', en: 'Just the brand name', correct: false },
            { text: '\u73fe\u91d1\u3067\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'Genkin de onegaishimasu', en: 'Cash, please', correct: false }
          ],
          correctExplanation: '\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9 (kurejitto k\u0101do) or just \u30ab\u30fc\u30c9 (k\u0101do) both work!',
          wrongExplanation: 'Say \u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\u3067\u304a\u9858\u3044\u3057\u307e\u3059 or \u30ab\u30fc\u30c9\u3067\u304a\u9858\u3044\u3057\u307e\u3059.'
        },
        {
          clerkJp: '\u4e00\u62ec\u6255\u3044\u3067\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f',
          clerkRomaji: 'Ikkatsu-barai de yoroshii desu ka?',
          clerkEn: 'One-time payment, is that okay?',
          tip: '\u4e00\u62ec\u6255\u3044 (ikkatsu-barai) means single payment. At konbini, it\'s always one-time!',
          options: [
            { text: '\u306f\u3044\u3001\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
            { text: '\u5206\u5272\u3067', romaji: 'Bunkatsu de', en: 'Installments (not at konbini!)', correct: false },
            { text: '\u5927\u4e08\u592b\u3067\u3059', romaji: 'Daij\u014dbu desu', en: 'I\'m fine (confusing here)', correct: false }
          ],
          correctExplanation: 'At konbini, credit card payments are always \u4e00\u62ec\u6255\u3044 (single payment). Just confirm!',
          wrongExplanation: 'Konbini only allows one-time payment. Say \u306f\u3044\u3001\u304a\u9858\u3044\u3057\u307e\u3059!'
        }
      ]
    },
    {
      id: 'qr_payment',
      title: 'QR Code Payment',
      titleJp: 'QR\u30b3\u30fc\u30c9\u6c7a\u6e08',
      difficulty: 2,
      interactions: [
        {
          clerkJp: '\u304a\u652f\u6255\u3044\u65b9\u6cd5\u306f\u3044\u304b\u304c\u306a\u3055\u3044\u307e\u3059\u304b\uff1f',
          clerkRomaji: 'O-shiharai h\u014dh\u014d wa ikaga nasaimasu ka?',
          clerkEn: 'How would you like to pay?',
          options: [
            { text: 'PayPay\u3067\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'PayPay de onegaishimasu', en: 'PayPay, please', correct: true },
            { text: 'QR\u30b3\u30fc\u30c9\u3067', romaji: 'QR k\u014ddo de', en: 'QR code payment', correct: true },
            { text: '\u30b9\u30de\u30db\u3067', romaji: 'Sumaho de', en: 'With my phone (too vague)', correct: false },
            { text: '[\u30b9\u30de\u30db\u3092\u898b\u305b\u308b]', en: 'Show phone silently', correct: false }
          ],
          correctExplanation: 'Name the app! PayPay, LINE Pay, or \u697d\u5929Pay\u3067\u304a\u9858\u3044\u3057\u307e\u3059. The clerk needs to know which one.',
          wrongExplanation: 'Be specific! Say PayPay\u3067\u304a\u9858\u3044\u3057\u307e\u3059 or name the QR payment app.'
        },
        {
          clerkJp: '\u30d0\u30fc\u30b3\u30fc\u30c9\u3092\u304a\u898b\u305b\u304f\u3060\u3055\u3044',
          clerkRomaji: 'B\u0101k\u014ddo o o-mise kudasai',
          clerkEn: 'Please show your barcode',
          options: [
            { text: '[\u30d0\u30fc\u30b3\u30fc\u30c9\u3092\u898b\u305b\u308b]', textJp: '[\u30d0\u30fc\u30b3\u30fc\u30c9\u3092\u898b\u305b\u308b]', en: 'Show barcode', correct: true },
            { text: '\u306f\u3044', romaji: 'Hai', en: 'Yes (but don\'t show it)', correct: false }
          ],
          correctExplanation: 'Open the app, show the barcode. The clerk scans it!',
          wrongExplanation: 'Open PayPay and show the barcode to the clerk\'s scanner!'
        }
      ]
    },
    {
      id: 'change_method',
      title: 'Changing Payment',
      titleJp: '\u652f\u6255\u3044\u5909\u66f4',
      difficulty: 3,
      interactions: [
        {
          clerkJp: '\u304a\u652f\u6255\u3044\u65b9\u6cd5\u306f\uff1f',
          clerkRomaji: 'O-shiharai h\u014dh\u014d wa?',
          clerkEn: 'Payment method?',
          options: [
            { text: '\u73fe\u91d1\u3067\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'Genkin de onegaishimasu', en: 'Cash, please', correct: true },
            { text: '\u30ab\u30fc\u30c9\u3067\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'K\u0101do de onegaishimasu', en: 'Card, please', correct: true },
            { text: '[\u7121\u8a00]', en: 'Stay silent', correct: false }
          ],
          correctExplanation: 'Good! But wait... your card gets declined!',
          wrongExplanation: 'You need to state a payment method first!'
        },
        {
          clerkJp: '\u3059\u307f\u307e\u305b\u3093\u3001\u3053\u3061\u3089\u306e\u30ab\u30fc\u30c9\u306f\u3054\u5229\u7528\u3044\u305f\u3060\u3051\u307e\u305b\u3093',
          clerkRomaji: 'Sumimasen, kochira no k\u0101do wa go-riy\u014d itadakemasen',
          clerkEn: 'Sorry, this card cannot be used',
          tip: 'Your card was declined! Switch to another method.',
          options: [
            { text: '\u3059\u307f\u307e\u305b\u3093\u3001\u73fe\u91d1\u3067\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'Sumimasen, genkin de onegaishimasu', en: 'Sorry, cash please', correct: true },
            { text: '\u3082\u3046\u4e00\u5ea6\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'M\u014d ichido onegaishimasu', en: 'Please try again', correct: false },
            { text: '[\u56f0\u3063\u305f\u9854]', en: 'Look confused', correct: false }
          ],
          correctExplanation: '\u3059\u307f\u307e\u305b\u3093 (sorry) + new method. Switching payment methods politely is an important skill!',
          wrongExplanation: 'When your card is declined, politely switch: \u3059\u307f\u307e\u305b\u3093\u3001\u73fe\u91d1\u3067\u304a\u9858\u3044\u3057\u307e\u3059'
        }
      ]
    },
    {
      id: 'receipt_change',
      title: 'Receipt & Change',
      titleJp: '\u304a\u91e3\u308a\u3068\u30ec\u30b7\u30fc\u30c8',
      difficulty: 2,
      interactions: [
        {
          clerkJp: '\u4e94\u5343\u5186\u304b\u3089\u304a\u9810\u304b\u308a\u3057\u307e\u3059',
          clerkRomaji: 'Go-sen-en kara o-azukari shimasu',
          clerkEn: 'Received 5,000 yen',
          tip: '\u304a\u9810\u304b\u308a\u3057\u307e\u3059 is keigo for "I\'m holding your money." Just wait for change.',
          options: [
            { text: '[\u5f85\u3064]', textJp: '[\u5f85\u3064]', en: 'Wait for change', correct: true },
            { text: '\u304a\u91e3\u308a\u306f\u3044\u308a\u307e\u305b\u3093', romaji: 'O-tsuri wa irimasen', en: 'Keep the change', correct: false },
            { text: '\u65e9\u304f\uff01', romaji: 'Hayaku!', en: 'Hurry!', correct: false }
          ],
          correctExplanation: 'Just wait patiently! In Japan, you never say "keep the change" -- it would be very awkward.',
          wrongExplanation: 'Tipping/declining change is not done in Japan. Just wait!'
        },
        {
          clerkJp: '\u56db\u5343\u4e8c\u767e\u5186\u306e\u304a\u8fd4\u3057\u3067\u3059\u3002\u30ec\u30b7\u30fc\u30c8\u306f\u3088\u308d\u3057\u3044\u3067\u3059\u304b\uff1f',
          clerkRomaji: 'Yon-sen ni-hyaku-en no o-kaeshi desu. Resh\u012bto wa yoroshii desu ka?',
          clerkEn: '4,200 yen change. Do you need the receipt?',
          options: [
            { text: '\u5927\u4e08\u592b\u3067\u3059', romaji: 'Daij\u014dbu desu', en: 'No thanks', correct: true },
            { text: '\u306f\u3044\u3001\u304a\u9858\u3044\u3057\u307e\u3059', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
            { text: 'No', en: '(in English)', correct: false }
          ],
          correctExplanation: 'Both work! Most Japanese decline with \u5927\u4e08\u592b\u3067\u3059. \u304a\u8fd4\u3057 (o-kaeshi) is the polite word for change.',
          wrongExplanation: 'Say \u5927\u4e08\u592b\u3067\u3059 (no thanks) or \u306f\u3044\u3001\u304a\u9858\u3044\u3057\u307e\u3059 (yes please) for the receipt.'
        }
      ]
    }
  ];

  // Payment practice state
  const paymentState = {
    practicesCompleted: 0,
    scenariosCompleted: [], // IDs of completed scenarios
    lastPracticeTime: 0,
  };

  function isPaymentPracticeReady() {
    // Always ready if player has completed at least 2 levels (knows basics)
    return completedLevelsCount >= 2;
  }

  function getNextPaymentScenario() {
    // First show scenarios the player hasn't done yet
    const unseen = PAYMENT_SCENARIOS.filter(s => !paymentState.scenariosCompleted.includes(s.id));
    if (unseen.length > 0) {
      // Sort by difficulty
      unseen.sort((a, b) => a.difficulty - b.difficulty);
      return unseen[0];
    }
    // All done? Pick a random one for continued practice
    return PAYMENT_SCENARIOS[Math.floor(Math.random() * PAYMENT_SCENARIOS.length)];
  }

  function completePaymentScenario(scenarioId) {
    if (!paymentState.scenariosCompleted.includes(scenarioId)) {
      paymentState.scenariosCompleted.push(scenarioId);
    }
    paymentState.practicesCompleted++;
    paymentState.lastPracticeTime = Date.now();
  }

  function getPaymentStats() {
    return {
      completed: paymentState.practicesCompleted,
      scenariosUnlocked: paymentState.scenariosCompleted.length,
      totalScenarios: PAYMENT_SCENARIOS.length,
    };
  }

  // ============ SEASONAL ITEMS SYSTEM ============
  const SEASONAL_LESSONS = [
    {
      id: 'spring',
      season: 'Spring',
      seasonJp: '春 (haru)',
      icon: 'sakura',
      color: '#FFB7C5',
      intro: 'Cherry blossoms are blooming! Konbini fill with sakura treats.',
      interactions: [
        {
          clerkJp: '桜餅はいかがですか？',
          clerkRomaji: 'Sakura mochi wa ikaga desu ka?',
          clerkEn: 'Would you like some sakura mochi?',
          tip: 'Sakura mochi is a pink rice cake with bean paste wrapped in a cherry leaf.',
          question: 'The clerk is offering you a seasonal spring sweet. How do you respond?',
          options: [
            { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
            { text: '大丈夫です', romaji: 'Daijoubu desu', en: 'No thanks', correct: true },
            { text: 'いくらですか？', romaji: 'Ikura desu ka?', en: 'How much?', correct: false },
          ],
          correctExplanation: '桜餅 (sakura mochi) is THE iconic spring sweet at konbini. Available March-April only!',
          wrongExplanation: 'When offered an item, respond with はい、お願いします (yes please) or 大丈夫です (no thanks).'
        },
        {
          clerkJp: 'こちらの苺茶は季節限定です',
          clerkRomaji: 'Kochira no ichigo-cha wa kisetsu gentei desu',
          clerkEn: 'This strawberry tea is a seasonal limited item',
          tip: '季節限定 (kisetsu gentei) = seasonal limited edition. These items disappear after the season!',
          question: 'What does 季節限定 (kisetsu gentei) mean?',
          options: [
            { text: 'Seasonal limited edition', en: 'Seasonal limited edition', correct: true },
            { text: 'Always available', en: 'Always available', correct: false },
            { text: 'Sold out', en: 'Sold out', correct: false },
          ],
          correctExplanation: '季節限定 means seasonal limited edition. Spring brings strawberry and sakura everything!',
          wrongExplanation: '季節 = season, 限定 = limited. Together: seasonal limited edition!'
        },
        {
          clerkJp: '苺大福もおすすめですよ',
          clerkRomaji: 'Ichigo daifuku mo osusume desu yo',
          clerkEn: 'I also recommend the strawberry daifuku',
          question: 'What is the clerk recommending?',
          options: [
            { text: 'Strawberry daifuku (mochi with strawberry)', en: 'Strawberry mochi', correct: true },
            { text: 'Strawberry cake', en: 'Strawberry cake', correct: false },
            { text: 'Strawberry drink', en: 'Strawberry drink', correct: false },
          ],
          correctExplanation: '苺大福 (ichigo daifuku) is fresh strawberry wrapped in mochi and sweet bean paste. A spring favorite!',
          wrongExplanation: '大福 (daifuku) is a type of mochi. 苺 (ichigo) = strawberry. So 苺大福 = strawberry mochi!'
        }
      ]
    },
    {
      id: 'summer',
      season: 'Summer',
      seasonJp: '夏 (natsu)',
      icon: 'sun',
      color: '#3498db',
      intro: 'It is hot! Konbini have cold treats to beat the heat.',
      interactions: [
        {
          clerkJp: '冷やし中華はいかがですか？',
          clerkRomaji: 'Hiyashi chuuka wa ikaga desu ka?',
          clerkEn: 'Would you like cold ramen?',
          tip: '冷やし中華 is cold ramen with toppings -- a summer-only konbini staple!',
          question: 'What seasonal summer dish is the clerk offering?',
          options: [
            { text: 'Cold ramen (冷やし中華)', en: 'Cold Chinese-style noodles', correct: true },
            { text: 'Hot ramen', en: 'Hot ramen', correct: false },
            { text: 'Rice bowl', en: 'Rice bowl', correct: false },
          ],
          correctExplanation: '冷やし中華 (hiyashi chuuka) literally means "chilled Chinese." It only appears in summer!',
          wrongExplanation: '冷やし (hiyashi) = chilled/cold. This is a cold noodle dish only served in summer.'
        },
        {
          clerkJp: 'アイスの新作が出ましたよ',
          clerkRomaji: 'Aisu no shinsaku ga demashita yo',
          clerkEn: 'We have a new ice cream flavor',
          question: 'What does 新作 (shinsaku) mean?',
          options: [
            { text: 'New product/flavor', en: 'New creation', correct: true },
            { text: 'Discount', en: 'Discount', correct: false },
            { text: 'Last one', en: 'Last one', correct: false },
          ],
          correctExplanation: '新作 (shinsaku) = new creation. Konbini release new ice cream (アイス) flavors all summer!',
          wrongExplanation: '新 (shin) = new, 作 (saku) = creation. 新作 = new product or flavor.'
        },
        {
          clerkJp: '麦茶はいかがですか？冷たいのもあります',
          clerkRomaji: 'Mugicha wa ikaga desu ka? Tsumetai no mo arimasu',
          clerkEn: 'How about barley tea? We also have it cold',
          question: 'What drink is being offered?',
          options: [
            { text: 'Barley tea (麦茶)', en: 'Barley tea', correct: true },
            { text: 'Green tea', en: 'Green tea', correct: false },
            { text: 'Coffee', en: 'Coffee', correct: false },
          ],
          correctExplanation: '麦茶 (mugicha) is cold barley tea -- THE quintessential Japanese summer drink. Every home has it!',
          wrongExplanation: '麦 (mugi) = barley, 茶 (cha) = tea. 麦茶 is barley tea, the summer staple of Japan.'
        }
      ]
    },
    {
      id: 'autumn',
      season: 'Autumn',
      seasonJp: '秋 (aki)',
      icon: 'leaf',
      color: '#e67e22',
      intro: 'The leaves are changing! Konbini bring out chestnut and sweet potato treats.',
      interactions: [
        {
          clerkJp: '栗のお菓子が入りました',
          clerkRomaji: 'Kuri no okashi ga hairimashita',
          clerkEn: 'We got chestnut sweets in stock',
          tip: '秋 (aki) = autumn. Chestnut (栗 kuri) and sweet potato (さつまいも satsumaimo) are THE autumn flavors.',
          question: 'What autumn flavor does 栗 (kuri) mean?',
          options: [
            { text: 'Chestnut', en: 'Chestnut', correct: true },
            { text: 'Pumpkin', en: 'Pumpkin', correct: false },
            { text: 'Apple', en: 'Apple', correct: false },
          ],
          correctExplanation: '栗 (kuri) = chestnut. Mont Blanc cake (モンブラン) and 栗きんとん (kuri kinton) fill konbini shelves every autumn!',
          wrongExplanation: '栗 (kuri) is chestnut, not pumpkin or apple. It is the signature autumn flavor in Japan.'
        },
        {
          clerkJp: 'さつまいもラテは季節限定です',
          clerkRomaji: 'Satsumaimo rate wa kisetsu gentei desu',
          clerkEn: 'The sweet potato latte is seasonal',
          question: 'What is さつまいも (satsumaimo)?',
          options: [
            { text: 'Sweet potato', en: 'Sweet potato / yam', correct: true },
            { text: 'Pumpkin', en: 'Pumpkin', correct: false },
            { text: 'Chestnut', en: 'Chestnut', correct: false },
          ],
          correctExplanation: 'さつまいも (satsumaimo) = Japanese sweet potato. 焙き苋 (yakiimo) vendors appear on streets every autumn!',
          wrongExplanation: 'さつまいも is sweet potato. Named after Satsuma (old name for Kagoshima). Autumn is sweet potato season!'
        },
        {
          clerkJp: '秋の味覧はこちらです',
          clerkRomaji: 'Aki no aji ichiran wa kochira desu',
          clerkEn: 'The autumn flavor lineup is over here',
          question: 'What does 秋の味 (aki no aji) mean?',
          options: [
            { text: 'Autumn flavor', en: 'Taste of autumn', correct: true },
            { text: 'Autumn sale', en: 'Autumn sale', correct: false },
            { text: 'Autumn menu', en: 'Autumn menu', correct: false },
          ],
          correctExplanation: '秋 (aki) = autumn, 味 (aji) = flavor/taste. 秋の味 means "taste of autumn" -- you will see this on packaging!',
          wrongExplanation: '味 (aji) means flavor or taste, not sale or menu. 秋の味 = autumn flavor.'
        }
      ]
    },
    {
      id: 'winter',
      season: 'Winter',
      seasonJp: '冬 (fuyu)',
      icon: 'oden',
      color: '#e74c3c',
      intro: 'Brr, it is cold! Time for oden and warm nikuman at the konbini.',
      interactions: [
        {
          clerkJp: 'おでんはいかがですか？',
          clerkRomaji: 'Oden wa ikaga desu ka?',
          clerkEn: 'Would you like some oden?',
          tip: 'おでん is a winter stew simmered by the konbini register. Point at what you want!',
          question: 'How do you order oden at a konbini?',
          options: [
            { text: '大根とたまごをお願いします', romaji: 'Daikon to tamago o onegaishimasu', en: 'Daikon and egg, please', correct: true },
            { text: 'おでんをください', romaji: 'Oden o kudasai', en: 'Give me oden', correct: false },
            { text: '[Point at the pot]', en: 'Just point silently', correct: false },
          ],
          correctExplanation: 'Name specific items! 大根 (daikon, radish) and たまご (tamago, egg) are the most popular oden choices.',
          wrongExplanation: 'Order specific items by name: 大根 (daikon), たまご (egg), ちくわ (fish cake), こんにゃく (konjac).'
        },
        {
          clerkJp: '肉まんとあんまん、どちらにしますか？',
          clerkRomaji: 'Nikuman to anman, dochira ni shimasu ka?',
          clerkEn: 'Meat bun or sweet bean bun -- which one?',
          tip: '肉まん (nikuman) = meat bun. あんまん (anman) = sweet red bean bun. Both are steamed!',
          question: 'What is the clerk asking you to choose between?',
          options: [
            { text: 'Meat bun vs. sweet bean bun', en: 'Nikuman vs. Anman', correct: true },
            { text: 'Two sizes', en: 'Small vs. large', correct: false },
            { text: 'Hot vs. cold', en: 'Temperature', correct: false },
          ],
          correctExplanation: '肉まん (nikuman, meat bun) and あんまん (anman, red bean bun) sit in a steamer by the register all winter!',
          wrongExplanation: 'どちらにしますか = which one will you have? The clerk is asking you to choose between two bun types.'
        },
        {
          clerkJp: 'からしはつけますか？',
          clerkRomaji: 'Karashi wa tsukemasu ka?',
          clerkEn: 'Shall I add mustard?',
          tip: 'からし (karashi) = Japanese hot mustard, the traditional oden condiment.',
          question: 'What condiment is the clerk offering for your oden?',
          options: [
            { text: 'Japanese mustard (からし)', en: 'Karashi mustard', correct: true },
            { text: 'Soy sauce', en: 'Soy sauce', correct: false },
            { text: 'Wasabi', en: 'Wasabi', correct: false },
          ],
          correctExplanation: 'からし (karashi) is spicy yellow Japanese mustard. It is THE classic oden condiment at konbini!',
          wrongExplanation: 'からし is Japanese hot mustard, not soy sauce or wasabi. It comes in a small packet with oden.'
        }
      ]
    }
  ];

  // Seasonal practice state
  const seasonalState = {
    lessonsCompleted: 0,
    seasonsCompleted: [], // IDs of completed seasons
    lastPracticeTime: 0,
  };

  function isSeasonalPracticeReady() {
    // Available after completing at least 1 store level
    return completedLevelsCount >= 1;
  }

  function getNextSeasonalLesson() {
    // Show unseen seasons first
    const unseen = SEASONAL_LESSONS.filter(s => !seasonalState.seasonsCompleted.includes(s.id));
    if (unseen.length > 0) return unseen[0];
    // All done? Pick random for continued practice
    return SEASONAL_LESSONS[Math.floor(Math.random() * SEASONAL_LESSONS.length)];
  }

  function completeSeasonalLesson(seasonId) {
    if (!seasonalState.seasonsCompleted.includes(seasonId)) {
      seasonalState.seasonsCompleted.push(seasonId);
    }
    seasonalState.lessonsCompleted++;
    seasonalState.lastPracticeTime = Date.now();
  }

  function getSeasonalStats() {
    return {
      completed: seasonalState.lessonsCompleted,
      seasonsUnlocked: seasonalState.seasonsCompleted.length,
      totalSeasons: SEASONAL_LESSONS.length,
    };
  }

  // ============ KANSAI DIALECT SYSTEM ============
  // Each lesson teaches standard vs Kansai-ben equivalents in konbini context
  const KANSAI_LESSONS = [
    {
      id: 'greetings',
      title: 'Kansai Greetings',
      titleJp: '\u95A2\u897F\u306E\u6328\u62F6',
      intro: 'In Osaka, konbini clerks sometimes greet differently. Let\'s learn!',
      interactions: [
        {
          clerkJp: '\u307E\u3044\u3069\uff01\u304A\u5143\u6C17\u3067\u3059\u304B\uff1F',
          clerkRomaji: 'Maido! Ogenki desu ka?',
          clerkEn: 'Hey there! How are you? (Kansai style)',
          context: '\u307E\u3044\u3069 (maido) is the Kansai all-purpose greeting, short for \u6BCE\u5EA6\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059',
          question: 'What does \u307E\u3044\u3069 (maido) mean in Kansai?',
          options: [
            { text: '\u3053\u3093\u306B\u3061\u306F / Hello!', en: 'Hello / Welcome', correct: true },
            { text: '\u3055\u3088\u3046\u306A\u3089 / Goodbye', en: 'Goodbye', correct: false },
            { text: '\u3044\u304F\u3089\u3067\u3059\u304B / How much?', en: 'How much?', correct: false },
            { text: '\u3059\u307F\u307E\u305B\u3093 / Sorry', en: 'Sorry', correct: false }
          ],
          correctExplanation: '\u307E\u3044\u3069 (maido) = \u3053\u3093\u306B\u3061\u306F! It\'s the classic Kansai shopkeeper greeting, meaning "every time" (thanks for coming).',
          wrongExplanation: '\u307E\u3044\u3069 is Kansai for \u3053\u3093\u306B\u3061\u306F. It\'s short for \u6BCE\u5EA6\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059 (thank you every time).'
        },
        {
          clerkJp: '\u304A\u304A\u304D\u306B\uff01\u307E\u305F\u6765\u3066\u306A\uff01',
          clerkRomaji: 'Ookini! Mata kite na!',
          clerkEn: 'Thanks! Come again!',
          context: '\u304A\u304A\u304D\u306B (ookini) replaces \u3042\u308A\u304C\u3068\u3046 in Kansai. Very warm and friendly!',
          question: 'What is the standard Japanese for \u304A\u304A\u304D\u306B (ookini)?',
          options: [
            { text: '\u3042\u308A\u304C\u3068\u3046', en: 'Thank you', correct: true },
            { text: '\u3044\u3089\u3063\u3057\u3083\u3044\u307E\u305B', en: 'Welcome', correct: false },
            { text: '\u3054\u3081\u3093\u306A\u3055\u3044', en: 'Sorry', correct: false }
          ],
          correctExplanation: '\u304A\u304A\u304D\u306B = \u3042\u308A\u304C\u3068\u3046! It\'s the warmest "thank you" in Kansai, used especially in shops and markets.',
          wrongExplanation: '\u304A\u304A\u304D\u306B is Kansai for \u3042\u308A\u304C\u3068\u3046 (thank you). Very common in Osaka shops!'
        },
        {
          clerkJp: '\u307B\u306A\u3001\u6C17\u3092\u3064\u3051\u3066\u306A\uff01',
          clerkRomaji: 'Hona, ki o tsukete na!',
          clerkEn: 'Well then, take care!',
          context: '\u307B\u306A (hona) is Kansai for \u3058\u3083\u3042 or \u305D\u308C\u3058\u3083\u3042. It\'s a casual goodbye.',
          question: 'What does \u307B\u306A (hona) mean?',
          options: [
            { text: '\u3058\u3083\u3042\u306D / See ya', en: 'See ya / Well then', correct: true },
            { text: '\u306F\u3044 / Yes', en: 'Yes', correct: false },
            { text: '\u3044\u304F\u3089 / How much', en: 'How much', correct: false }
          ],
          correctExplanation: '\u307B\u306A = \u3058\u3083\u3042\u306D (well then / see ya). You\'ll hear this everywhere in Kansai as a friendly parting word.',
          wrongExplanation: '\u307B\u306A is Kansai for \u3058\u3083\u3042\u306D / \u305D\u308C\u3058\u3083\u3042 -- a casual "see ya" or "well then".'
        }
      ]
    },
    {
      id: 'shopping',
      title: 'Kansai Shopping Talk',
      titleJp: '\u95A2\u897F\u306E\u8CB7\u3044\u7269\u8A71',
      intro: 'Osaka is the merchant capital of Japan. Learn how they talk about prices and shopping!',
      interactions: [
        {
          clerkJp: '\u3053\u308C\u3001\u306A\u3093\u307C\u3067\u3059\u304B\uff1F',
          clerkRomaji: 'Kore, nanbo desu ka?',
          clerkEn: '(Customer asking) How much is this?',
          context: '\u306A\u3093\u307C (nanbo) is the Kansai way to ask "how much?" instead of \u3044\u304F\u3089.',
          question: 'What is \u306A\u3093\u307C (nanbo) in standard Japanese?',
          options: [
            { text: '\u3044\u304F\u3089 / How much', en: 'How much', correct: true },
            { text: '\u306A\u306B / What', en: 'What', correct: false },
            { text: '\u3069\u3053 / Where', en: 'Where', correct: false },
            { text: '\u3044\u3064 / When', en: 'When', correct: false }
          ],
          correctExplanation: '\u306A\u3093\u307C = \u3044\u304F\u3089! In Osaka\'s merchant culture, knowing how to ask prices is essential.',
          wrongExplanation: '\u306A\u3093\u307C is the Kansai way of saying \u3044\u304F\u3089 (how much?). Very common in Osaka!'
        },
        {
          clerkJp: '\u3053\u308C\u3001\u3081\u3063\u3061\u3083\u3048\u3048\u3067\uff01',
          clerkRomaji: 'Kore, meccha ee de!',
          clerkEn: 'This is really good!',
          context: '\u3081\u3063\u3061\u3083 (meccha) = \u3068\u3066\u3082 (very), \u3048\u3048 (ee) = \u3044\u3044 (good). Two classic Kansai words!',
          question: 'What does \u3081\u3063\u3061\u3083\u3048\u3048 (meccha ee) mean?',
          options: [
            { text: '\u3068\u3066\u3082\u3044\u3044 / Very good', en: 'Very good', correct: true },
            { text: '\u5168\u7136\u30C0\u30E1 / Totally bad', en: 'Totally bad', correct: false },
            { text: '\u3061\u3087\u3063\u3068\u9AD8\u3044 / A bit expensive', en: 'A bit expensive', correct: false }
          ],
          correctExplanation: '\u3081\u3063\u3061\u3083 = \u3068\u3066\u3082 (very), \u3048\u3048 = \u3044\u3044 (good). So \u3081\u3063\u3061\u3083\u3048\u3048 = \u3068\u3066\u3082\u3044\u3044!',
          wrongExplanation: '\u3081\u3063\u3061\u3083 is Kansai for \u3068\u3066\u3082, and \u3048\u3048 is Kansai for \u3044\u3044. Together: very good!'
        },
        {
          clerkJp: '\u3042\u304B\u3093\u3001\u305D\u308C\u58F2\u308A\u5207\u308C\u3084\u306D\u3093',
          clerkRomaji: 'Akan, sore urikire yanen',
          clerkEn: 'Sorry, that\'s sold out',
          context: '\u3042\u304B\u3093 (akan) = \u30C0\u30E1 (no good), \u3084\u306D\u3093 (yanen) = \u306A\u3093\u3060 (it is, explanatory)',
          question: 'What does \u3042\u304B\u3093 (akan) mean in standard Japanese?',
          options: [
            { text: '\u30C0\u30E1 / No good', en: 'No good / Can\'t do', correct: true },
            { text: '\u304A\u3044\u3057\u3044 / Delicious', en: 'Delicious', correct: false },
            { text: '\u5927\u4E08\u592B / It\'s fine', en: 'It\'s fine', correct: false }
          ],
          correctExplanation: '\u3042\u304B\u3093 = \u30C0\u30E1! One of the most-used Kansai words. \u305D\u308C\u3042\u304B\u3093\u3067 = \u305D\u308C\u306F\u30C0\u30E1\u3060\u3088.',
          wrongExplanation: '\u3042\u304B\u3093 is Kansai for \u30C0\u30E1 (no good / can\'t). You\'ll hear it constantly in Osaka!'
        }
      ]
    },
    {
      id: 'reactions',
      title: 'Kansai Reactions & Feelings',
      titleJp: '\u95A2\u897F\u306E\u30EA\u30A2\u30AF\u30B7\u30E7\u30F3',
      intro: 'Kansai people are known for being expressive. Learn their reaction words!',
      interactions: [
        {
          clerkJp: '\u305D\u308C\u3001\u307B\u3093\u307E\uff1F',
          clerkRomaji: 'Sore, honma?',
          clerkEn: 'Really? Is that true?',
          context: '\u307B\u3093\u307E (honma) replaces \u672C\u5F53 (hontou) in Kansai. Used constantly!',
          question: 'What is the standard Japanese for \u307B\u3093\u307E (honma)?',
          options: [
            { text: '\u672C\u5F53 (hontou) / Really', en: 'Really / True', correct: true },
            { text: '\u5168\u7136 (zenzen) / Not at all', en: 'Not at all', correct: false },
            { text: '\u3082\u3061\u308D\u3093 (mochiron) / Of course', en: 'Of course', correct: false }
          ],
          correctExplanation: '\u307B\u3093\u307E = \u672C\u5F53 (really/true). \u307B\u3093\u307E\u306B\uff1F is the most common Kansai reaction!',
          wrongExplanation: '\u307B\u3093\u307E is Kansai for \u672C\u5F53 (really/true). \u307B\u3093\u307E\u304B\u3044\u306A\uff1F = \u672C\u5F53\u306B\uff1F'
        },
        {
          clerkJp: '\u304B\u307E\u3078\u3093\u3001\u304B\u307E\u3078\u3093\uff01',
          clerkRomaji: 'Kamahen, kamahen!',
          clerkEn: 'No problem, no problem!',
          context: '\u304B\u307E\u3078\u3093 (kamahen) is Kansai for \u69CB\u308F\u306A\u3044 / \u5927\u4E08\u592B.',
          question: 'What does \u304B\u307E\u3078\u3093 (kamahen) mean?',
          options: [
            { text: '\u5927\u4E08\u592B / No problem', en: 'It\'s fine / No problem', correct: true },
            { text: '\u7121\u7406 / Impossible', en: 'Impossible', correct: false },
            { text: '\u3042\u308A\u304C\u3068\u3046 / Thank you', en: 'Thank you', correct: false }
          ],
          correctExplanation: '\u304B\u307E\u3078\u3093 = \u5927\u4E08\u592B / \u69CB\u308F\u306A\u3044! A very reassuring Kansai phrase. Often said twice for emphasis!',
          wrongExplanation: '\u304B\u307E\u3078\u3093 is Kansai for \u5927\u4E08\u592B (no problem). Doubling it (\u304B\u307E\u3078\u3093\u304B\u307E\u3078\u3093) adds warmth!'
        },
        {
          clerkJp: '\u3053\u306E\u304A\u306B\u304E\u308A\u3001\u3081\u3063\u3061\u3083\u304A\u3082\u308D\u3044\u5473\u3084\u3067\uff01',
          clerkRomaji: 'Kono onigiri, meccha omoroi aji ya de!',
          clerkEn: 'This onigiri has a really interesting flavor!',
          context: '\u304A\u3082\u308D\u3044 (omoroi) = \u9762\u767D\u3044 (omoshiroi), and \u3084\u3067 (ya de) = \u3060\u3088 (emphatic)',
          question: 'What is \u304A\u3082\u308D\u3044 (omoroi) in standard Japanese?',
          options: [
            { text: '\u9762\u767D\u3044 (omoshiroi) / Interesting', en: 'Interesting / Fun', correct: true },
            { text: '\u3064\u307E\u3089\u306A\u3044 (tsumaranai) / Boring', en: 'Boring', correct: false },
            { text: '\u3053\u308F\u3044 (kowai) / Scary', en: 'Scary', correct: false }
          ],
          correctExplanation: '\u304A\u3082\u308D\u3044 = \u9762\u767D\u3044! The "shi" gets dropped for faster Kansai speech. \u3084\u3067 = \u3060\u3088 (emphasis).',
          wrongExplanation: '\u304A\u3082\u308D\u3044 is Kansai for \u9762\u767D\u3044 (interesting/fun). Kansai people love \u304A\u3082\u308D\u3044 things!'
        }
      ]
    },
    {
      id: 'konbini_kansai',
      title: 'Kansai Konbini Phrases',
      titleJp: '\u95A2\u897F\u30B3\u30F3\u30D3\u30CB\u30D5\u30EC\u30FC\u30BA',
      intro: 'What if the konbini clerk speaks Kansai-ben? Here\'s how to understand them!',
      interactions: [
        {
          clerkJp: '\u304A\u5F01\u5F53\u3042\u305F\u305F\u3081\u307E\u3057\u3087\u304B\uff1F\u3048\u3048\u3067\u3059\u304B\uff1F',
          clerkRomaji: 'Obento atatame masho ka? Ee desu ka?',
          clerkEn: 'Shall I heat your bento? Is that okay?',
          context: '\u3048\u3048\u3067\u3059\u304B (ee desu ka) uses \u3048\u3048 instead of \u3044\u3044. Even polite Kansai speech sneaks in \u3048\u3048!',
          question: 'The clerk said \u3048\u3048\u3067\u3059\u304B. What does \u3048\u3048 mean?',
          options: [
            { text: '\u3044\u3044 / Good, okay', en: 'Good / Okay', correct: true },
            { text: '\u60AA\u3044 / Bad', en: 'Bad', correct: false },
            { text: '\u9AD8\u3044 / Expensive', en: 'Expensive', correct: false }
          ],
          correctExplanation: '\u3048\u3048 = \u3044\u3044 (good/okay). Even formal Kansai speech uses \u3048\u3048. It\'s the most classic Kansai word!',
          wrongExplanation: '\u3048\u3048 is Kansai for \u3044\u3044 (good). \u3048\u3048\u3067\u3059\u304B = \u3044\u3044\u3067\u3059\u304B (is that okay?).'
        },
        {
          clerkJp: '\u304A\u7BB8\u3001\u3044\u3089\u3093\uff1F\u8981\u3089\u3093\uff1F',
          clerkRomaji: 'Ohashi, iran? Iran?',
          clerkEn: 'Chopsticks, you don\'t need them? Don\'t need?',
          context: '\u3044\u3089\u3093 (iran) is Kansai negative form, from \u8981\u3089\u306A\u3044 (iranai = don\'t need).',
          question: 'The clerk asks \u304A\u7BB8\u3001\u3044\u3089\u3093\uff1F What does \u3044\u3089\u3093 mean?',
          options: [
            { text: '\u8981\u3089\u306A\u3044 / Don\'t need', en: 'Don\'t need', correct: true },
            { text: '\u6B32\u3057\u3044 / Want', en: 'Want', correct: false },
            { text: '\u3042\u308B / Have', en: 'Have', correct: false }
          ],
          correctExplanation: '\u3044\u3089\u3093 = \u8981\u3089\u306A\u3044 (don\'t need). Kansai uses \u301C\u3078\u3093/\u301C\u3093 instead of \u301C\u306A\u3044 for negatives!',
          wrongExplanation: '\u3044\u3089\u3093 is Kansai for \u8981\u3089\u306A\u3044 (don\'t need). Reply with \u3044\u3089\u3093 (no) or \u304A\u9858\u3044\u3057\u307E\u3059 (yes please)!'
        },
        {
          clerkJp: '\u30EC\u30B7\u30FC\u30C8\u3001\u3061\u3083\u3046\u3061\u3083\u3046\uff01\u3082\u3046\u3044\u3089\u3093\u306E\uff1F',
          clerkRomaji: 'Reshiito, chau chau! Mou iran no?',
          clerkEn: 'The receipt -- no no! You don\'t need it anymore?',
          context: '\u3061\u3083\u3046 (chau) = \u9055\u3046 (chigau, different/wrong). Doubled for emphasis!',
          question: 'What does \u3061\u3083\u3046 (chau) mean?',
          options: [
            { text: '\u9055\u3046 / Different, wrong', en: 'Different / Wrong / No', correct: true },
            { text: '\u6B63\u3057\u3044 / Correct', en: 'Correct', correct: false },
            { text: '\u304F\u3060\u3055\u3044 / Please', en: 'Please', correct: false }
          ],
          correctExplanation: '\u3061\u3083\u3046 = \u9055\u3046 (wrong/different/no). \u3061\u3083\u3046\u3061\u3083\u3046 is doubled for emphasis -- "no no!"',
          wrongExplanation: '\u3061\u3083\u3046 is Kansai for \u9055\u3046 (different/wrong). \u3061\u3083\u3046\u3061\u3083\u3046 = no no! / that\'s not it!'
        }
      ]
    },
    {
      id: 'grammar_fun',
      title: 'Kansai Grammar Patterns',
      titleJp: '\u95A2\u897F\u306E\u6587\u6CD5',
      intro: 'Kansai-ben has unique grammar. Master these patterns for real understanding!',
      interactions: [
        {
          clerkJp: '\u3053\u308C\u98DF\u3079\u3078\u3093\u306E\uff1F',
          clerkRomaji: 'Kore tabehen no?',
          clerkEn: 'You\'re not eating this?',
          context: '\u301C\u3078\u3093 (~hen) replaces \u301C\u306A\u3044 (~nai) for negatives in Kansai.',
          question: '\u98DF\u3079\u3078\u3093 (tabehen) is the Kansai form of...?',
          options: [
            { text: '\u98DF\u3079\u306A\u3044 / Not eating', en: 'Not eating', correct: true },
            { text: '\u98DF\u3079\u305F\u3044 / Want to eat', en: 'Want to eat', correct: false },
            { text: '\u98DF\u3079\u307E\u3057\u305F / Ate', en: 'Already ate', correct: false }
          ],
          correctExplanation: '\u98DF\u3079\u3078\u3093 = \u98DF\u3079\u306A\u3044. Kansai negative pattern: replace \u301C\u306A\u3044 with \u301C\u3078\u3093! \u884C\u304B\u306A\u3044 -> \u884C\u304B\u3078\u3093, \u308F\u304B\u3089\u306A\u3044 -> \u308F\u304B\u3089\u3078\u3093.',
          wrongExplanation: '\u301C\u3078\u3093 is the Kansai negative. \u98DF\u3079\u3078\u3093 = \u98DF\u3079\u306A\u3044 (not eating). Key pattern to learn!'
        },
        {
          clerkJp: '\u3053\u306E\u304A\u306B\u304E\u308A\u3001\u304A\u3044\u3057\u3044\u3084\u3067\uff01',
          clerkRomaji: 'Kono onigiri, oishii ya de!',
          clerkEn: 'This onigiri is delicious!',
          context: '\u3084 (ya) replaces \u3060 (da) as the copula in Kansai. \u3084\u3067 = \u3060\u3088 (with emphasis).',
          question: 'In Kansai, \u3084\u3067 (ya de) replaces which standard ending?',
          options: [
            { text: '\u3060\u3088 (da yo) / It is!', en: 'It is! (emphatic)', correct: true },
            { text: '\u3067\u3059 (desu) / It is (polite)', en: 'It is (polite)', correct: false },
            { text: '\u304B\u306A (kana) / I wonder', en: 'I wonder', correct: false }
          ],
          correctExplanation: '\u3084\u3067 = \u3060\u3088. \u3084 replaces \u3060 in Kansai: \u305D\u3046\u3060 -> \u305B\u3084, \u304A\u3044\u3057\u3044\u3060 -> \u304A\u3044\u3057\u3044\u3084. Add \u3067 for emphasis!',
          wrongExplanation: '\u3084 is the Kansai copula replacing \u3060. \u3084\u3067 = \u3060\u3088 (emphatic). This is one of the most basic Kansai grammar points!'
        },
        {
          clerkJp: '\u305D\u308C\u3001\u3061\u3083\u3046\u3061\u3083\u3046\u3002\u3053\u3063\u3061\u3084\u308D\uff1F',
          clerkRomaji: 'Sore, chau chau. Kocchi yarou?',
          clerkEn: 'That\'s wrong. You mean this one, right?',
          context: '\u3084\u308D\u3046 (yarou) = \u3060\u308D\u3046 (darou). Kansai uses \u3084 everywhere \u3060 would appear.',
          question: '\u3053\u3063\u3061\u3084\u308D\u3046 (kocchi yarou) means...?',
          options: [
            { text: '\u3053\u3063\u3061\u3060\u308D\u3046 / This one, right?', en: 'This one, right?', correct: true },
            { text: '\u3053\u3063\u3061\u306F\u30C0\u30E1 / This one is bad', en: 'This one is bad', correct: false },
            { text: '\u3053\u3063\u3061\u304F\u3060\u3055\u3044 / This one please', en: 'This one please', correct: false }
          ],
          correctExplanation: '\u3084\u308D\u3046 = \u3060\u308D\u3046 (probably / right?). Pattern: \u3060 -> \u3084 in all forms! \u3060\u308D\u3046 -> \u3084\u308D\u3046.',
          wrongExplanation: '\u3084\u308D\u3046 is Kansai for \u3060\u308D\u3046 (right? / probably). The \u3060->\u3084 swap is the foundation of Kansai grammar!'
        }
      ]
    }
  ];

  // Kansai dialect tracking
  const kansaiState = {
    lessonsCompleted: 0,
    topicsCompleted: [],
    lastPracticeTime: 0,
  };

  function isKansaiPracticeReady() {
    const totalLevels = Object.values(progress).reduce((sum, p) => sum + p.completed.length, 0);
    return totalLevels >= 3; // Unlock after 3 store levels (player has decent Japanese base)
  }

  function getNextKansaiLesson() {
    const unseen = KANSAI_LESSONS.filter(s => !kansaiState.topicsCompleted.includes(s.id));
    if (unseen.length > 0) return unseen[0];
    return KANSAI_LESSONS[Math.floor(Math.random() * KANSAI_LESSONS.length)];
  }

  function completeKansaiLesson(topicId) {
    if (!kansaiState.topicsCompleted.includes(topicId)) {
      kansaiState.topicsCompleted.push(topicId);
    }
    kansaiState.lessonsCompleted++;
    kansaiState.lastPracticeTime = Date.now();
  }

  function getKansaiStats() {
    return {
      completed: kansaiState.lessonsCompleted,
      topicsUnlocked: kansaiState.topicsCompleted.length,
      totalTopics: KANSAI_LESSONS.length,
    };
  }

  // ============ POLITENESS LEVELS SYSTEM ============
  // Teaches casual (tameguchi) -> polite (teineigo) -> keigo for the same konbini phrases
  const POLITENESS_LESSONS = [
    {
      id: 'greetings_levels',
      title: 'Greeting Politeness',
      titleJp: '挨拶の丁寧さ',
      intro: 'The same greeting changes completely depending on politeness level. Let\'s compare!',
      interactions: [
        {
          clerkJp: 'い\u3089\u3063\u3057\u3083\u3044\u307E\u305B',
          clerkRomaji: 'Irasshaimase',
          clerkEn: 'Welcome! (Keigo -- what clerks actually say)',
          context: 'Clerks always use keigo. The casual form い\u3089\u3063\u3057\u3083\u3044 (irasshai) is only for close friends visiting your home.',
          question: 'Which is the CASUAL version of い\u3089\u3063\u3057\u3083\u3044\u307E\u305B?',
          options: [
            { text: 'い\u3089\u3063\u3057\u3083\u3044 / Hey, welcome', en: 'Casual welcome', correct: true },
            { text: 'い\u3089\u3063\u3057\u3083\u3044\u307E\u305B / Formal welcome', en: 'Keigo welcome', correct: false },
            { text: 'よ\u3046\u3053\u305D / Welcome (general)', en: 'General welcome', correct: false }
          ],
          correctExplanation: 'い\u3089\u3063\u3057\u3083\u3044 is the casual form. い\u3089\u3063\u3057\u3083\u3044\u307E\u305B is keigo (honorific of 来\u308B). You\'d never use the casual form at work!',
          wrongExplanation: 'The casual form is い\u3089\u3063\u3057\u3083\u3044 (irasshai). い\u3089\u3063\u3057\u3083\u3044\u307E\u305B adds the honorific ま\u305B ending.'
        },
        {
          clerkJp: 'あ\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059',
          clerkRomaji: 'Arigatou gozaimasu',
          clerkEn: 'Thank you very much (Polite)',
          context: 'Three levels of "thank you": あ\u308A\u304C\u3068\u3046 (casual) → あ\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059 (polite) → 誠\u306B\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059 (keigo)',
          question: 'Which is the KEIGO (most formal) "thank you"?',
          options: [
            { text: '誠\u306B\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059', en: 'Truly thank you (keigo)', correct: true },
            { text: 'あ\u308A\u304C\u3068\u3046', en: 'Thanks (casual)', correct: false },
            { text: 'あ\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059', en: 'Thank you (polite)', correct: false },
            { text: 'ど\u3046\u3082', en: 'Not at all', correct: false }
          ],
          correctExplanation: '誠\u306Bあ\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059 (makoto ni) adds extreme formality. Clerks use this for big purchases or valued customers.',
          wrongExplanation: 'The keigo form is 誠\u306Bあ\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059. 誠\u306B (makoto ni) means "truly/sincerely" and elevates the formality.'
        },
        {
          clerkJp: 'す\u307F\u307E\u305B\u3093',
          clerkRomaji: 'Sumimasen',
          clerkEn: 'Excuse me (Polite)',
          context: 'Excuse me / Sorry: ご\u3081\u3093 (casual) → す\u307F\u307E\u305B\u3093 (polite) → 申\u3057\u8A33\u3054\u3056\u3044\u307E\u305B\u3093 (keigo)',
          question: 'Which is the CASUAL version of す\u307F\u307E\u305B\u3093?',
          options: [
            { text: 'ご\u3081\u3093 / Sorry (casual)', en: 'Casual sorry', correct: true },
            { text: '申\u3057\u8A33\u3054\u3056\u3044\u307E\u305B\u3093', en: 'Keigo sorry', correct: false },
            { text: 'す\u307F\u307E\u305B\u3093', en: 'Polite sorry', correct: false }
          ],
          correctExplanation: 'ご\u3081\u3093 (gomen) is casual. す\u307F\u307E\u305B\u3093 is polite. 申\u3057\u8A33\u3054\u3056\u3044\u307E\u305B\u3093 (moushiwake gozaimasen) is keigo -- used by clerks for serious apologies.',
          wrongExplanation: 'ご\u3081\u3093 is the casual form. You\'d use it with friends. Never say ご\u3081\u3093 to a clerk!'
        }
      ]
    },
    {
      id: 'requests_levels',
      title: 'Making Requests',
      titleJp: 'お願いの丁寧さ',
      intro: 'Requesting things in Japanese has very different levels of politeness. Essential for konbini!',
      interactions: [
        {
          clerkJp: 'お箭\u3092\u304A\u4ED8\u3051\u3057\u307E\u3059\u304B\uff1f',
          clerkRomaji: 'Ohashi wo otsuke shimasu ka?',
          clerkEn: 'Shall I include chopsticks? (Keigo -- humble form)',
          context: 'お\u4ED8\u3051\u3057\u307E\u3059 is humble keigo (謙\u8B72\u8A9E). The casual form is just 箸\u3044\u308B\uff1f (hashi iru? = need chopsticks?)',
          question: 'The clerk says お\u7BB8\u3092\u304A\u4ED8\u3051\u3057\u307E\u3059\u304B. What politeness level is this?',
          options: [
            { text: '敬\u8A9E (keigo) -- humble form', en: 'Keigo/humble', correct: true },
            { text: '普\u901A (casual)', en: 'Casual', correct: false },
            { text: '丁\u5BE7\u8A9E (polite)', en: 'Polite', correct: false }
          ],
          correctExplanation: 'お\u4ED8\u3051\u3057\u307E\u3059 is humble keigo (謙\u8B72\u8A9E). The お + verb stem + し\u307E\u3059 pattern is how clerks humble their own actions to honor the customer.',
          wrongExplanation: 'This is keigo! The pattern お + verb stem + し\u307E\u3059 is humble form (謙\u8B72\u8A9E), where the speaker lowers their own action.'
        },
        {
          clerkJp: 'は\u3044\u3001\u304A\u9858\u3044\u3057\u307E\u3059',
          clerkRomaji: 'Hai, onegai shimasu',
          clerkEn: 'Yes please (Polite)',
          context: 'Three ways to say "please": お\u9858\u3044 or 頑\u5F35\u3063\u3066 (casual) → お\u9858\u3044\u3057\u307E\u3059 (polite) → お\u9858\u3044\u3044\u305F\u3057\u307E\u3059 (keigo)',
          question: 'Which is the POLITE (middle level) way to say "yes please"?',
          options: [
            { text: 'は\u3044\u3001\u304A\u9858\u3044\u3057\u307E\u3059', en: 'Yes, please (polite)', correct: true },
            { text: 'う\u3093\u3001\u304A\u9858\u3044', en: 'Yeah, please (casual)', correct: false },
            { text: 'は\u3044\u3001\u304A\u9858\u3044\u3044\u305F\u3057\u307E\u3059', en: 'Yes, I humbly request (keigo)', correct: false }
          ],
          correctExplanation: 'お\u9858\u3044\u3057\u307E\u3059 is the polite 丁\u5BE7\u8A9E form -- perfect for konbini. お\u9858\u3044\u3044\u305F\u3057\u307E\u3059 adds the humble い\u305F\u3060\u304F for extreme formality.',
          wrongExplanation: 'The polite form is お\u9858\u3044\u3057\u307E\u3059. It uses the standard し\u307E\u3059 ending. This is the one you\'ll use most at konbinis!'
        },
        {
          clerkJp: '大\u4E08\u592B\u3067\u3059',
          clerkRomaji: 'Daijoubu desu',
          clerkEn: 'I\'m fine / No thanks (Polite)',
          context: 'Declining: 大\u4E08\u592B (casual) → 大\u4E08\u592B\u3067\u3059 (polite) → 結\u69CB\u3067\u3054\u3056\u3044\u307E\u3059 (keigo)',
          question: 'Which is the KEIGO way to politely decline?',
          options: [
            { text: '結\u69CB\u3067\u3054\u3056\u3044\u307E\u3059', en: 'I am quite fine (keigo)', correct: true },
            { text: '大\u4E08\u592B', en: 'It\'s fine (casual)', correct: false },
            { text: 'い\u3044\u3048\u3001\u7D50\u69CB\u3067\u3059', en: 'No, it\'s okay (polite)', correct: false },
            { text: 'い\u3089\u306A\u3044', en: 'Don\'t need (blunt)', correct: false }
          ],
          correctExplanation: '結\u69CB\u3067\u3054\u3056\u3044\u307E\u3059 (kekkou de gozaimasu) is the keigo form. ご\u3056\u3044\u307E\u3059 replaces で\u3059 for maximum politeness. Very elegant!',
          wrongExplanation: 'The keigo form is 結\u69CB\u3067\u3054\u3056\u3044\u307E\u3059. ご\u3056\u3044\u307E\u3059 is the keigo version of で\u3059, making the whole phrase super formal.'
        }
      ]
    },
    {
      id: 'existence_levels',
      title: 'Having & Existing',
      titleJp: '持\u3064\u30FB\u3042\u308Bの丁寧さ',
      intro: 'Point card questions use different verbs depending on formality. This trips up many learners!',
      interactions: [
        {
          clerkJp: 'ポ\u30A4\u30F3\u30C8\u30AB\u30FC\u30C9\u306F\u304A\u6301\u3061\u3067\u3059\u304B\uff1f',
          clerkRomaji: 'Pointo kaado wa omochi desu ka?',
          clerkEn: 'Do you have a point card? (Polite/honorific)',
          context: 'お\u6301\u3061 (omochi) is the honorific form of 持\u3064 (motsu = to have/hold). The お makes it respectful.',
          question: 'Which is the CASUAL way to ask "Do you have a point card?"',
          options: [
            { text: 'ポ\u30A4\u30F3\u30C8\u30AB\u30FC\u30C9\u6301\u3063\u3066\u308B\uff1f', en: 'Got a point card? (casual)', correct: true },
            { text: 'ポ\u30A4\u30F3\u30C8\u30AB\u30FC\u30C9\u306F\u304A\u6301\u3061\u3067\u3059\u304B\uff1f', en: 'Do you have...? (polite)', correct: false },
            { text: 'ポ\u30A4\u30F3\u30C8\u30AB\u30FC\u30C9\u306F\u304A\u6301\u3061\u3067\u3044\u3089\u3063\u3057\u3083\u3044\u307E\u3059\u304B\uff1f', en: 'Might you have...? (keigo)', correct: false }
          ],
          correctExplanation: '持\u3063\u3066\u308B\uff1f (motteru?) is casual, dropping the い from 持\u3063\u3066\u3044\u308B. お\u6301\u3061\u3067\u3059\u304B is polite. お\u6301\u3061\u3067\u3044\u3089\u3063\u3057\u3083\u3044\u307E\u3059\u304B is ultra-keigo.',
          wrongExplanation: 'The casual form is 持\u3063\u3066\u308B\uff1f (motteru?). In casual Japanese, い\u308B often contracts to just \u308B.'
        },
        {
          clerkJp: 'レ\u30B7\u30FC\u30C8\u306F\u3044\u308A\u307E\u3059\u304B\uff1f',
          clerkRomaji: 'Reshiito wa irimasu ka?',
          clerkEn: 'Do you need a receipt? (Polite)',
          context: 'い\u308B\uff1f (casual) → い\u308A\u307E\u3059\u304B\uff1f (polite) → ご\u5165\u7528\u3067\u3054\u3056\u3044\u307E\u3059\u304B\uff1f (keigo)',
          question: 'Which is the KEIGO way to ask "Do you need a receipt?"',
          options: [
            { text: 'レ\u30B7\u30FC\u30C8\u306F\u3054\u5165\u7528\u3067\u3054\u3056\u3044\u307E\u3059\u304B\uff1f', en: 'Receipt needed? (keigo)', correct: true },
            { text: 'レ\u30B7\u30FC\u30C8\u3044\u308B\uff1f', en: 'Need a receipt? (casual)', correct: false },
            { text: 'レ\u30B7\u30FC\u30C8\u306F\u3044\u308A\u307E\u3059\u304B\uff1f', en: 'Do you need a receipt? (polite)', correct: false }
          ],
          correctExplanation: 'ご\u5165\u7528 (go-nyuuyou) is the keigo noun form meaning "your use/need." ご\u5165\u7528\u3067\u3054\u3056\u3044\u307E\u3059\u304B is ultra-formal -- heard at department stores and high-end places.',
          wrongExplanation: 'The keigo form uses ご\u5165\u7528\u3067\u3054\u3056\u3044\u307E\u3059\u304B. ご\u5165\u7528 (go-nyuuyou) is the honorific noun for "need" or "use".'
        },
        {
          clerkJp: 'お\u5F01\u5F53\u6E29\u3081\u307E\u3059\u304B\uff1f',
          clerkRomaji: 'Obentou atatame masu ka?',
          clerkEn: 'Shall I heat your bento? (Polite)',
          context: '温\u3081\u308B\uff1f (casual) → 温\u3081\u307E\u3059\u304B\uff1f (polite) → お\u6E29\u3081\u3044\u305F\u3057\u307E\u3057\u3087\u3046\u304B\uff1f (keigo)',
          question: 'Which is the POLITE form of "Shall I heat it?"',
          options: [
            { text: 'お\u5F01\u5F53\u6E29\u3081\u307E\u3059\u304B\uff1f', en: 'Shall I heat the bento? (polite)', correct: true },
            { text: '温\u3081\u308B\uff1f', en: 'Heat it? (casual)', correct: false },
            { text: 'お\u6E29\u3081\u3044\u305F\u3057\u307E\u3057\u3087\u3046\u304B\uff1f', en: 'Shall I humbly heat it? (keigo)', correct: false },
            { text: 'チ\u30F3\u3059\u308B\uff1f', en: 'Microwave it? (slang)', correct: false }
          ],
          correctExplanation: '温\u3081\u307E\u3059\u304B is standard polite (丁\u5BE7\u8A9E). Most konbini clerks use this form. お\u6E29\u3081\u3044\u305F\u3057\u307E\u3057\u3087\u3046\u304B is humble keigo -- rarer at konbinis.',
          wrongExplanation: 'The polite form is 温\u3081\u307E\u3059\u304B -- the standard ま\u3059 ending. This is the most common form you\'ll hear at konbinis.'
        }
      ]
    },
    {
      id: 'payment_levels',
      title: 'Payment Politeness',
      titleJp: 'お会計の丁寧さ',
      intro: 'Paying at konbinis -- how the same exchange sounds at each level of formality.',
      interactions: [
        {
          clerkJp: 'お\u4F1A\u8A08\u306F\u5408\u8A08\u3067500\u5186\u3067\u3054\u3056\u3044\u307E\u3059',
          clerkRomaji: 'Okaikei wa goukei de gohyaku en de gozaimasu',
          clerkEn: 'Your total comes to 500 yen (Keigo)',
          context: 'で\u3054\u3056\u3044\u307E\u3059 (de gozaimasu) is the keigo version of で\u3059 (desu). You\'ll hear this at every register.',
          question: 'What politeness level is で\u3054\u3056\u3044\u307E\u3059 (de gozaimasu)?',
          options: [
            { text: '敬\u8A9E (keigo)', en: 'Keigo - highest politeness', correct: true },
            { text: '丁\u5BE7\u8A9E (teineigo)', en: 'Polite', correct: false },
            { text: '普\u901A (futsuutai)', en: 'Casual', correct: false }
          ],
          correctExplanation: 'で\u3054\u3056\u3044\u307E\u3059 is keigo! It\'s the formal version of で\u3059. Casual: 500円だよ. Polite: 500円で\u3059. Keigo: 500円\u3067\u3054\u3056\u3044\u307E\u3059.',
          wrongExplanation: 'で\u3054\u3056\u3044\u307E\u3059 is keigo, the most formal form of で\u3059. It\'s standard for all customer-facing service in Japan.'
        },
        {
          clerkJp: 'Suica\u3067\u304A\u9858\u3044\u3057\u307E\u3059',
          clerkRomaji: 'Suica de onegai shimasu',
          clerkEn: 'Suica please (Polite -- perfect for konbini)',
          context: 'Saying how you pay: Suica\u3067 (casual) → Suica\u3067\u304A\u9858\u3044\u3057\u307E\u3059 (polite) → Suica\u3067\u304A\u9858\u3044\u3044\u305F\u3057\u307E\u3059 (keigo)',
          question: 'You want to pay with Suica. Which is the most NATURAL level for a konbini?',
          options: [
            { text: 'Suica\u3067\u304A\u9858\u3044\u3057\u307E\u3059', en: 'Suica please (polite)', correct: true },
            { text: 'Suica\u3067', en: 'Suica (casual, abrupt)', correct: false },
            { text: 'Suica\u3067\u304A\u9858\u3044\u3044\u305F\u3057\u307E\u3059', en: 'Suica please (keigo, too formal)', correct: false }
          ],
          correctExplanation: 'お\u9858\u3044\u3057\u307E\u3059 is the sweet spot! Polite enough to be respectful but not overly formal. This is the golden phrase for konbini payment.',
          wrongExplanation: 'お\u9858\u3044\u3057\u307E\u3059 is perfect for konbinis. Just saying Suica\u3067 is too abrupt, and \u304A\u9858\u3044\u3044\u305F\u3057\u307E\u3059 is overkill for a convenience store.'
        },
        {
          clerkJp: '少\u3005\u304A\u5F85\u3061\u304F\u3060\u3055\u3044',
          clerkRomaji: 'Shoushou omachi kudasai',
          clerkEn: 'Please wait a moment (Keigo)',
          context: '待\u3063\u3066 (casual) → 待\u3063\u3066\u304F\u3060\u3055\u3044 (polite) → 少\u3005\u304A\u5F85\u3061\u304F\u3060\u3055\u3044 (keigo)',
          question: 'What is the CASUAL way to say "wait a sec"?',
          options: [
            { text: 'ち\u3087\u3063\u3068\u5F85\u3063\u3066', en: 'Wait a sec (casual)', correct: true },
            { text: '少\u3005\u304A\u5F85\u3061\u304F\u3060\u3055\u3044', en: 'Please wait (keigo)', correct: false },
            { text: '待\u3063\u3066\u304F\u3060\u3055\u3044', en: 'Please wait (polite)', correct: false }
          ],
          correctExplanation: 'ち\u3087\u3063\u3068\u5F85\u3063\u3066 (chotto matte) is casual. 少\u3005 (shoushou) is the formal version of ち\u3087\u3063\u3068, and お\u5F85\u3061 adds the honorific お prefix.',
          wrongExplanation: 'ち\u3087\u3063\u3068\u5F85\u3063\u3066 (chotto matte) is the casual form. 少\u3005 replaces ち\u3087\u3063\u3068, and お\u5F85\u3061 is the honorific form of 待\u3064.'
        }
      ]
    },
    {
      id: 'desu_masu',
      title: 'The desu/masu System',
      titleJp: 'です・ます体',
      intro: 'The で\u3059/ま\u3059 pattern is the backbone of polite Japanese. Master this and you\'re set!',
      interactions: [
        {
          clerkJp: 'こ\u308C\u306F\u304A\u3044\u3057\u3044\u3067\u3059\u3088',
          clerkRomaji: 'Kore wa oishii desu yo',
          clerkEn: 'This is delicious! (Polite)',
          context: 'Adjective endings: お\u3044\u3057\u3044 (casual) → お\u3044\u3057\u3044\u3067\u3059 (polite). Just add で\u3059 to make any i-adjective polite!',
          question: 'How do you make the casual お\u3044\u3057\u3044 (oishii) polite?',
          options: [
            { text: 'お\u3044\u3057\u3044\u3067\u3059', en: 'Add desu after it', correct: true },
            { text: 'お\u3044\u3057\u3044\u307E\u3059', en: 'Add masu after it', correct: false },
            { text: 'お\u3044\u3057\u3054\u3056\u3044\u307E\u3059', en: 'Make it keigo', correct: false }
          ],
          correctExplanation: 'For i-adjectives, just add で\u3059! お\u3044\u3057\u3044 → お\u3044\u3057\u3044\u3067\u3059. The ま\u3059 ending is only for verbs.',
          wrongExplanation: 'For i-adjectives, add で\u3059 (not ま\u3059). ま\u3059 is for verbs: 食\u3079\u308B → 食\u3079\u307E\u3059. But adjectives use で\u3059: お\u3044\u3057\u3044 → お\u3044\u3057\u3044\u3067\u3059.'
        },
        {
          clerkJp: '袋\u306B\u5165\u308C\u307E\u3059\u304B\uff1f',
          clerkRomaji: 'Fukuro ni iremasu ka?',
          clerkEn: 'Shall I put it in a bag? (Polite)',
          context: '入\u308C\u308B\uff1f (casual) → 入\u308C\u307E\u3059\u304B\uff1f (polite). The ま\u3059 ending makes any verb polite.',
          question: 'What is the verb pattern for polite speech (丁\u5BE7\u8A9E)?',
          options: [
            { text: 'Verb stem + ま\u3059', en: 'Add masu to verb stem', correct: true },
            { text: 'Verb + で\u3059', en: 'Add desu to verb', correct: false },
            { text: 'お + Verb', en: 'Add o prefix', correct: false }
          ],
          correctExplanation: 'Verb stem + ま\u3059 is the golden rule of teineigo! 入\u308C\u308B → 入\u308Cま\u3059, 食\u3079\u308B → 食\u3079ま\u3059, 行\u304F → 行\u304Dま\u3059.',
          wrongExplanation: 'The polite form of verbs uses stem + ま\u3059. This is the core of 丁\u5BE7\u8A9E (polite speech): take the verb stem and add ま\u3059.'
        },
        {
          clerkJp: 'こ\u3061\u3089\u3067\u304A\u53EC\u3057\u4E0A\u304C\u308A\u3067\u3059\u304B\uff1f',
          clerkRomaji: 'Kochira de omeshiagari desu ka?',
          clerkEn: 'Will you eat here? (Keigo)',
          context: '食\u3079\u308B (casual) → 食\u3079\u307E\u3059 (polite) → \u304A\u53EC\u3057\u4E0A\u304C\u308B (keigo/sonkeigo). 召\u3057\u4E0A\u304C\u308B is a special keigo verb!',
          question: 'お\u53EC\u3057\u4E0A\u304C\u308A (omeshiagari) is the keigo form of which verb?',
          options: [
            { text: '食\u3079\u308B (taberu) -- to eat', en: 'To eat', correct: true },
            { text: '飲\u3080 (nomu) -- to drink', en: 'To drink', correct: false },
            { text: '買\u3046 (kau) -- to buy', en: 'To buy', correct: false },
            { text: '見\u308B (miru) -- to see', en: 'To see', correct: false }
          ],
          correctExplanation: '召\u3057\u4E0A\u304C\u308B is the sonkeigo (honorific) form of both 食\u3079\u308B and 飲\u3080. Clerks use it to politely ask "eating here?" -- one of the most common keigo verbs in konbinis!',
          wrongExplanation: '召\u3057\u4E0A\u304C\u308B is keigo for 食\u3079\u308B (to eat). It\'s also used for 飲\u3080 (to drink). In konbinis, こ\u3061\u3089\u3067\u304A\u53EC\u3057\u4E0A\u304C\u308A\u3067\u3059\u304B means "eating here?"'
        }
      ]
    }
  ];

  const politenessState = {
    lessonsCompleted: 0,
    topicsCompleted: [],
    lastPracticeTime: 0,
  };

  function isPolitenessPracticeReady() {
    const totalLevels = Object.values(progress).reduce((sum, p) => sum + p.completed.length, 0);
    return totalLevels >= 2; // Unlock after 2 store levels
  }

  function getNextPolitenessLesson() {
    const unseen = POLITENESS_LESSONS.filter(s => !politenessState.topicsCompleted.includes(s.id));
    if (unseen.length > 0) return unseen[0];
    return POLITENESS_LESSONS[Math.floor(Math.random() * POLITENESS_LESSONS.length)];
  }

  function completePolitenessLesson(topicId) {
    if (!politenessState.topicsCompleted.includes(topicId)) {
      politenessState.topicsCompleted.push(topicId);
    }
    politenessState.lessonsCompleted++;
    politenessState.lastPracticeTime = Date.now();
  }

  function getPolitenessStats() {
    return {
      completed: politenessState.lessonsCompleted,
      topicsUnlocked: politenessState.topicsCompleted.length,
      totalTopics: POLITENESS_LESSONS.length,
    };
  }

  // ============ INVENTORY SYSTEM ============
  // Items the player "buys" at each level, with Japanese vocabulary
  const KONBINI_ITEMS = [
    // Level 1: Welcome at 7-Eleven (just entering, no purchase)
    { levelId: 1, jp: 'ガム', romaji: 'Gamu', en: 'Gum', store: '7-Eleven', icon: 'gum', category: 'snack' },
    // Level 2: Thank You at Lawson (leaving after buying something)
    { levelId: 2, jp: 'お茶', romaji: 'Ocha', en: 'Green Tea', store: 'Lawson', icon: 'tea', category: 'drink' },
    // Level 3: The Bag at FamilyMart
    { levelId: 3, jp: 'おにぎり', romaji: 'Onigiri', en: 'Rice Ball', store: 'FamilyMart', icon: 'onigiri', category: 'food' },
    // Level 4: Point Card at 7-Eleven
    { levelId: 4, jp: 'サンドイッチ', romaji: 'Sandoicchi', en: 'Egg Sandwich', store: '7-Eleven', icon: 'sandwich', category: 'food' },
    // Level 5: Heat It Up at Lawson (bento)
    { levelId: 5, jp: 'お弁当', romaji: 'Obento', en: 'Bento Box', store: 'Lawson', icon: 'bento', category: 'food' },
    // Level 6: Chopsticks at FamilyMart (soup)
    { levelId: 6, jp: 'スープ', romaji: 'Suupu', en: 'Soup', store: 'FamilyMart', icon: 'soup', category: 'food' },
    // Level 7: How Much at 7-Eleven
    { levelId: 7, jp: 'コーヒー', romaji: 'Koohii', en: 'Coffee', store: '7-Eleven', icon: 'coffee', category: 'drink' },
    // Level 8: Where Is It at Lawson (onigiri)
    { levelId: 8, jp: 'ツナマヨおにぎり', romaji: 'Tuna mayo onigiri', en: 'Tuna Mayo Onigiri', store: 'Lawson', icon: 'onigiri', category: 'food' },
    // Level 9: Famichiki at FamilyMart
    { levelId: 9, jp: 'ファミチキ', romaji: 'Famichiki', en: 'Famichiki (Fried Chicken)', store: 'FamilyMart', icon: 'chicken', category: 'food' },
    // Level 10: Full Checkout at 7-Eleven (bento + more)
    { levelId: 10, jp: '幕の内弁当', romaji: 'Makunouchi bento', en: 'Makunouchi Bento', store: '7-Eleven', icon: 'bento', category: 'food' },
    // Level 11: Age Check at Lawson (beer)
    { levelId: 11, jp: 'ビール', romaji: 'Biiru', en: 'Beer', store: 'Lawson', icon: 'beer', category: 'drink' },
    // Level 12: Master at FamilyMart (full shopping)
    { levelId: 12, jp: 'メロンパン', romaji: 'Meronpan', en: 'Melon Bread', store: 'FamilyMart', icon: 'bread', category: 'food' },
  ];

  // Player's collected inventory
  const inventory = [];

  function addToInventory(levelId) {
    const item = KONBINI_ITEMS.find(i => i.levelId === levelId);
    if (!item) return;
    // Don't add duplicates
    if (inventory.some(i => i.levelId === levelId)) return;
    inventory.push({
      ...item,
      acquiredAt: Date.now(),
      isNew: true,
    });
  }

  function getInventory() {
    return inventory;
  }

  function getInventoryCount() {
    return inventory.length;
  }

  function getTotalItems() {
    return KONBINI_ITEMS.length;
  }

  function markInventoryViewed() {
    inventory.forEach(i => { i.isNew = false; });
  }

  function hasNewInventoryItems() {
    return inventory.some(i => i.isNew);
  }

  // ============ ACHIEVEMENT BADGES SYSTEM ============
  // Achievement definitions with conditions checked against game state
  const ACHIEVEMENTS = [
    // Store Milestones
    { id: 'first_purchase', name: 'First Purchase', nameJp: '初めてのお買い物', icon: 'bag',
      desc: 'Complete your first store level', tier: 'bronze',
      check: () => completedLevelsCount >= 1 },
    { id: 'seven_fan', name: '7-Eleven Fan', nameJp: 'セブン大好き', icon: 'seven',
      desc: 'Complete all 7-Eleven levels', tier: 'silver',
      check: () => isStoreComplete('7-Eleven') },
    { id: 'lawson_regular', name: 'Lawson Regular', nameJp: 'ローソン常連', icon: 'lawson',
      desc: 'Complete all Lawson levels', tier: 'silver',
      check: () => isStoreComplete('Lawson') },
    { id: 'famima_friend', name: 'FamiMa Friend', nameJp: 'ファミマの友達', icon: 'famima',
      desc: 'Complete all FamilyMart levels', tier: 'silver',
      check: () => isStoreComplete('FamilyMart') },
    { id: 'konbini_master', name: 'Konbini Master', nameJp: 'コンビニマスター', icon: 'crown',
      desc: 'Complete all 12 store levels', tier: 'gold',
      check: () => isStoreComplete('7-Eleven') && isStoreComplete('Lawson') && isStoreComplete('FamilyMart') },

    // Star Excellence
    { id: 'star_collector', name: 'Star Collector', nameJp: 'スターコレクター', icon: 'star',
      desc: 'Earn 10 total stars', tier: 'bronze',
      check: () => getTotalStars() >= 10 },
    { id: 'perfectionist', name: 'Perfectionist', nameJp: '完璧主義者', icon: 'sparkle',
      desc: 'Earn 30 stars (all perfect)', tier: 'gold',
      check: () => getTotalStars() >= 30 },

    // Collection Achievements
    { id: 'stamp_starter', name: 'Stamp Starter', nameJp: 'スタンプ初心者', icon: 'stamp',
      desc: 'Collect 5 stamps', tier: 'bronze',
      check: () => getTotalStamps().total >= 5 },
    { id: 'stamp_king', name: 'Stamp King', nameJp: 'スタンプ王', icon: 'stamp',
      desc: 'Collect all 15 stamps', tier: 'gold',
      check: () => getTotalStamps().total >= 15 },
    { id: 'phrase_hunter', name: 'Phrase Hunter', nameJp: 'フレーズハンター', icon: 'book',
      desc: 'Collect 10 bonus phrases', tier: 'silver',
      check: () => getCollectedCount() >= 10 },
    { id: 'phrase_master', name: 'Phrase Encyclopedia', nameJp: 'フレーズ百科', icon: 'book',
      desc: 'Collect all 20 bonus phrases', tier: 'gold',
      check: () => getCollectedCount() >= 20 },
    { id: 'full_bag', name: 'Full Bag', nameJp: '買い物上手', icon: 'bag',
      desc: 'Collect all 12 konbini items', tier: 'gold',
      check: () => getInventoryCount() >= 12 },

    // Challenge Achievements
    { id: 'challenger', name: 'Challenger', nameJp: 'チャレンジャー', icon: 'fire',
      desc: 'Complete your first challenge', tier: 'bronze',
      check: () => getChallengeState().challengesCompleted >= 1 },
    { id: 'streak_3', name: 'Hot Streak', nameJp: '連勝中', icon: 'fire',
      desc: 'Reach a 3-challenge streak', tier: 'bronze',
      check: () => getChallengeState().bestStreak >= 3 },
    { id: 'streak_10', name: 'On Fire', nameJp: '絶好調', icon: 'fire',
      desc: 'Reach a 10-challenge streak', tier: 'gold',
      check: () => getChallengeState().bestStreak >= 10 },

    // NPC Specialist Achievements
    { id: 'payment_pro', name: 'Payment Pro', nameJp: 'お支払いのプロ', icon: 'card',
      desc: 'Complete all 6 payment scenarios', tier: 'silver',
      check: () => getPaymentStats().completed >= 6 },
    { id: 'season_expert', name: 'Four Seasons', nameJp: '四季マスター', icon: 'leaf',
      desc: 'Complete all 4 seasonal lessons', tier: 'silver',
      check: () => getSeasonalStats().completed >= 4 },
    { id: 'kansai_speaker', name: 'Kansai Speaker', nameJp: '関西弁使い', icon: 'speech',
      desc: 'Complete all 5 Kansai lessons', tier: 'silver',
      check: () => getKansaiStats().completed >= 5 },
    { id: 'keigo_master', name: 'Keigo Master', nameJp: '敬語マスター', icon: 'bow',
      desc: 'Complete all 5 politeness lessons', tier: 'gold',
      check: () => getPolitenessStats().completed >= 5 },

    // Learning Achievements
    { id: 'review_student', name: 'Review Student', nameJp: '復習の生徒', icon: 'pencil',
      desc: 'Complete 5 review sessions', tier: 'bronze',
      check: () => getReviewStats().totalReviews >= 5 },
    { id: 'memory_master', name: 'Memory Master', nameJp: '記憶の達人', icon: 'brain',
      desc: 'Master 20 phrases (mastery 4+)', tier: 'gold',
      check: () => getReviewStats().mastered >= 20 },
  ];

  // Unlocked achievement IDs
  const unlockedAchievements = new Set();
  // Newly unlocked (not yet dismissed by player)
  const newAchievements = [];
  // Best streak tracking for achievements (challenge state.streak is session-only)
  let bestStreakEver = 0;

  function checkAchievements() {
    const justUnlocked = [];
    for (const ach of ACHIEVEMENTS) {
      if (unlockedAchievements.has(ach.id)) continue;
      try {
        if (ach.check()) {
          unlockedAchievements.add(ach.id);
          newAchievements.push(ach.id);
          justUnlocked.push(ach);
        }
      } catch (e) {
        // Silently skip if check fails
      }
    }
    return justUnlocked;
  }

  function getUnlockedAchievements() {
    return ACHIEVEMENTS.filter(a => unlockedAchievements.has(a.id));
  }

  function getAchievementCount() {
    return unlockedAchievements.size;
  }

  function getTotalAchievements() {
    return ACHIEVEMENTS.length;
  }

  function getAllAchievements() {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: unlockedAchievements.has(a.id),
      isNew: newAchievements.includes(a.id),
    }));
  }

  function popNewAchievement() {
    if (newAchievements.length === 0) return null;
    const id = newAchievements.shift();
    return ACHIEVEMENTS.find(a => a.id === id) || null;
  }

  function hasNewAchievements() {
    return newAchievements.length > 0;
  }

  function markAchievementsViewed() {
    newAchievements.length = 0;
  }

  function updateBestStreak(streak) {
    if (streak > bestStreakEver) bestStreakEver = streak;
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
    // Variable rewards
    BONUS_PHRASES,
    TIER_INFO,
    rollVariableReward,
    getCollectedPhrases,
    getCollectedCount,
    getTotalBonusPhrases,
    markPhraseSeen,
    hasNewPhrases,
    // NPC walk cycles
    initNPCWalking,
    updateNPCWalking,
    getNPCWalkState,
    getNPCIndex,
    // Payment practice
    PAYMENT_SCENARIOS,
    isPaymentPracticeReady,
    getNextPaymentScenario,
    completePaymentScenario,
    getPaymentStats,
    // Seasonal items
    SEASONAL_LESSONS,
    isSeasonalPracticeReady,
    getNextSeasonalLesson,
    completeSeasonalLesson,
    getSeasonalStats,
    // Kansai dialect
    KANSAI_LESSONS,
    isKansaiPracticeReady,
    getNextKansaiLesson,
    completeKansaiLesson,
    getKansaiStats,
    // Politeness levels
    POLITENESS_LESSONS,
    isPolitenessPracticeReady,
    getNextPolitenessLesson,
    completePolitenessLesson,
    getPolitenessStats,
    // Inventory system
    KONBINI_ITEMS,
    addToInventory,
    getInventory,
    getInventoryCount,
    getTotalItems,
    markInventoryViewed,
    hasNewInventoryItems,
    // Achievement badges
    ACHIEVEMENTS,
    checkAchievements,
    getUnlockedAchievements,
    getAchievementCount,
    getTotalAchievements,
    getAllAchievements,
    popNewAchievement,
    hasNewAchievements,
    markAchievementsViewed,
    updateBestStreak,
    // Mistake journal
    recordMistake,
    getMistakeJournal,
    getMistakeCount,
    hasNewMistakes,
    markMistakesViewed,
    getTopMistakes,
  };
})();
