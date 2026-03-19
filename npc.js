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
  };
})();
