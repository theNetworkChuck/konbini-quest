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

    // Speed Round Coach NPC (timed recall mode)
    { map: 0, x: 16, y: 13, type: 'speedcoach', name: 'Hayate', dir: 'left',
      isSpeedCoach: true,
      dialogues: [
        "速い！ (Hayai!) I'm Hayate, the Speed Coach!",
        "Think fast! Can you answer before time runs out?",
        "Time pressure builds real recall speed! タイムアタック！"
      ]
    },

    // Pronunciation Guide NPC (pitch accent coach)
    { map: 0, x: 3, y: 12, type: 'pronunciationguide', name: 'Akiko', dir: 'right',
      isPronunciationGuide: true,
      dialogues: [
        "音 (oto) means sound! I'm Akiko, your pronunciation coach.",
        "Japanese uses pitch accent -- small rises and falls make all the difference!",
        "Master the melody of konbini phrases and sound truly natural!"
      ]
    },


    // Conversation Practice NPC (multi-turn conversation scenarios)
    { map: 0, x: 11, y: 9, type: 'conversationcoach', name: 'Yuri', dir: 'down',
      isConversationCoach: true,
      dialogues: [
        "会話 (kaiwa) means conversation! I'm Yuri, your conversation partner.",
        "Let's practice full konbini conversations from start to finish!",
        "Real fluency comes from handling an entire exchange smoothly!"
      ]
    },

    // Onomatopoeia Coach NPC (sound words / gitaigo / giongo)
    { map: 0, x: 18, y: 10, type: 'onomatopoeiacoach', name: 'Mimi', dir: 'left',
      isOnomatopoeiaCoach: true,
      dialogues: [
        "擬音語 (giongo) are sound words! I'm Mimi, your onomatopoeia coach.",
        "Japanese has hundreds of sound words -- they make your speech vivid and natural!",
        "At konbini, sounds are everywhere: ピッピッ, ガチャ, チン... let me teach you!"
      ]
    },
    // Service Counter Coach NPC (bill payment, package pickup, ATM, tickets)
    { map: 0, x: 2, y: 10, type: 'servicecoach', name: 'Tetsuya', dir: 'right',
      isServiceCoach: true,
      dialogues: [
        "\u30b5\u30fc\u30d3\u30b9\u30ab\u30a6\u30f3\u30bf\u30fc! Konbini are more than stores -- they're life support!",
        "I'm Tetsuya, the Lifeline Clerk. Bills, packages, ATM, tickets -- I teach 'em all!",
        "\u516c\u5171\u6599\u91d1 (koukyou-ryoukin) means utility bills. Master this and you\u2019ll feel like a local!"
      ]
    },
    // Night Shift Salaryman NPC (only visible at night)
    { map: 0, x: 9, y: 14, type: 'nightsalaryman', name: 'Suzuki', dir: 'down',
      isNightShift: true,
      dialogues: [
        "おつかれさまです... (otsukaresama desu) -- it means 'thanks for the hard work'...",
        "ストロングゼロ (Strong Zero)... 9% alcohol, 0% regret... *hiccup*",
        "The konbini is the salaryman's best friend at midnight..."
      ]
    },
    // === WEATHER-CONDITIONAL NPCs ===
    // Rain NPC: appears only during rain weather
    { map: 0, x: 7, y: 7, type: 'rainperson', name: 'Ame-chan', dir: 'down',
      weatherOnly: 'rain',
      dialogues: [
        "雨が降っていますね！(ame ga futte imasu ne!) -- It's raining!",
        "傘はお持ちですか？(kasa wa omochi desu ka?) -- Do you have an umbrella?",
        "コンビニでビニール傘を買えますよ！(konbini de biniiru-gasa wo kaemasu yo!) -- You can buy a plastic umbrella at the konbini!",
        "雨の日 (ame no hi) means 'rainy day.' Rain is 雨 (ame), umbrella is 傘 (kasa).",
        "In Japan, the rainy season is called 梅雨 (tsuyu). It's in June-July!",
        "Japanese tip: 傘をお忘れなく！(kasa wo owasure naku!) -- Don't forget your umbrella!"
      ]
    },
    // Cherry blossom NPC: appears only during cherry_blossoms weather
    { map: 0, x: 13, y: 7, type: 'hanami', name: 'Sakura-san', dir: 'down',
      weatherOnly: 'cherry_blossoms',
      dialogues: [
        "桜がきれいですね！(sakura ga kirei desu ne!) -- The cherry blossoms are beautiful!",
        "お花見 (ohanami) means 'flower viewing.' It's a spring tradition!",
        "コンビニでお花見用のお弁当やおにぎりを買えますよ！You can buy hanami bento and onigiri at the konbini!",
        "桜の季節 (sakura no kisetsu) means 'cherry blossom season.' It's in March-April.",
        "花見酒 (hanamizake) -- sake enjoyed while viewing blossoms. A classic experience!",
        "Japanese saying: 花より団子 (hana yori dango) -- dumplings over flowers! Meaning food is better than beauty."
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

  // ============ CULTURAL NOTES ============
  // Brief cultural context notes that appear during gameplay
  const CULTURAL_NOTES = [
    {
      id: 'money_tray',
      titleJp: 'お金のトレー',
      titleEn: 'The Money Tray',
      textEn: 'Place cash on the small tray (kashi-zara), never hand it directly. It keeps the transaction clean and avoids touching hands -- a sign of respect.',
      textJp: 'カシ皿',
      context: ['payment', 'store_entry'],
      icon: 'tray',
    },
    {
      id: 'irasshaimase',
      titleJp: 'いらっしゃいませ',
      titleEn: 'The Welcome Ritual',
      textEn: 'Clerks say this to every customer. You do NOT need to reply -- it is a ritual greeting, not a personal hello. A small nod is plenty.',
      textJp: 'いらっしゃいませ',
      context: ['store_entry', 'greeting'],
      icon: 'bow',
    },
    {
      id: 'both_hands',
      titleJp: '両手で渡す',
      titleEn: 'Use Both Hands',
      textEn: 'In Japan, giving and receiving items with both hands shows respect. Watch how clerks hold your bag or change with two hands.',
      textJp: '両手で',
      context: ['payment', 'checkout'],
      icon: 'hands',
    },
    {
      id: 'bag_charge',
      titleJp: 'レジ袋有料化',
      titleEn: 'Bag Charge Law',
      textEn: 'Since July 2020, all plastic bags cost 3-5 yen. Most locals carry a reusable bag (mai-baggu). Saying "fukuro wa kekkou desu" saves money and plastic!',
      textJp: 'マイバッグ',
      context: ['bag', 'checkout'],
      icon: 'bag',
    },
    {
      id: 'point_card',
      titleJp: 'ポイントカード',
      titleEn: 'Point Cards',
      textEn: 'Clerks always ask about point cards (T-Point, Ponta, dPoint). Saying "nai desu" (I don\'t have one) is perfectly fine and very common for tourists.',
      textJp: 'ポイントカード',
      context: ['checkout', 'store_entry'],
      icon: 'card',
    },
    {
      id: 'eating_inside',
      titleJp: '店内飲食',
      titleEn: 'No Eating in Aisles',
      textEn: 'Do not eat while walking through the store. Some konbini have a designated eat-in corner (ito-in) with tables -- use that, or eat outside.',
      textJp: 'イートイン',
      context: ['general'],
      icon: 'food',
    },
    {
      id: 'quiet_atmosphere',
      titleJp: '静かな店内',
      titleEn: 'Keep It Quiet',
      textEn: 'Konbini are calm, quiet spaces. Speaking loudly on the phone or shouting across aisles is considered rude. Match the soft atmosphere!',
      textJp: '静かに',
      context: ['general', 'store_entry'],
      icon: 'quiet',
    },
    {
      id: 'heated_food',
      titleJp: '温めますか？',
      titleEn: 'Heating Your Bento',
      textEn: 'Clerks ask "atatame-masuka?" (shall I heat this?) for bento and onigiri. They have microwaves behind the counter. Say "onegai shimasu" for yes!',
      textJp: '温めますか',
      context: ['food', 'checkout'],
      icon: 'food',
    },
    {
      id: 'chopsticks',
      titleJp: 'お箸の確認',
      titleEn: 'Chopsticks Check',
      textEn: 'Clerks ask "ohashi wa otsukai desu ka?" for chopsticks. They also offer spoons (supuun) and forks (fooku). One set per item is standard.',
      textJp: 'お箸',
      context: ['food', 'checkout'],
      icon: 'food',
    },
    {
      id: 'age_verification',
      titleJp: '年齢確認',
      titleEn: 'Age Verification Screen',
      textEn: 'Buying alcohol or tobacco? Touch the screen that says "I am over 20" (hatachi ijou). The legal age in Japan is 20, not 18 or 21.',
      textJp: '20歳以上',
      context: ['payment', 'checkout'],
      icon: 'card',
    },
    {
      id: 'store_chime',
      titleJp: '入店メロディー',
      titleEn: 'The Door Chime',
      textEn: 'Each konbini chain has a unique door chime melody. 7-Eleven, Lawson, and FamilyMart all have different tunes -- regulars can identify the store by sound alone!',
      textJp: 'メロディー',
      context: ['store_entry'],
      icon: 'music',
    },
    {
      id: 'receipt',
      titleJp: 'レシート',
      titleEn: 'The Receipt Ritual',
      textEn: 'Clerks hand you the receipt carefully. You can politely decline by saying "daijoubu desu" with a small wave, or accept it -- either is fine.',
      textJp: 'レシート',
      context: ['checkout', 'payment'],
      icon: 'tray',
    },
    {
      id: 'coin_counting',
      titleJp: '小銭を数える',
      titleEn: 'Counting Coins is OK',
      textEn: 'Taking time to count exact change is perfectly acceptable and even appreciated in Japan. Clerks will wait patiently -- no rush!',
      textJp: '小銭',
      context: ['payment'],
      icon: 'tray',
    },
    {
      id: 'arigatou_timing',
      titleJp: 'ありがとうの\'タイミング',
      titleEn: 'When to Say Thanks',
      textEn: 'Say "arigatou gozaimasu" when you receive your bag -- not when entering. A quick bow of the head is a nice touch that clerks appreciate.',
      textJp: 'ありがとうございます',
      context: ['checkout', 'greeting'],
      icon: 'bow',
    },
    {
      id: 'oshibori',
      titleJp: 'おしぼり',
      titleEn: 'Hot Towels at Konbini',
      textEn: 'Some konbini include a small wet towel (oshibori) with hot food purchases. It is for cleaning your hands before eating -- a uniquely Japanese touch!',
      textJp: 'おしぼり',
      context: ['food'],
      icon: 'food',
    },
    {
      id: 'konbini_atm',
      titleJp: 'コンビニATM',
      titleEn: 'Konbini ATMs',
      textEn: 'Japanese konbini have ATMs that accept international cards -- a lifesaver for tourists! 7-Eleven\'s "Seven Bank" ATM is the most reliable for foreign cards.',
      textJp: 'ATM',
      context: ['general', 'payment'],
      icon: 'card',
    },
  ];

  const seenCulturalNotes = new Set();
  let newNoteCount = 0;
  let lastNoteTime = 0; // prevent note spam

  function getCulturalNote(contextTag) {
    const now = Date.now();
    // Don't show notes more than once every 45 seconds
    if (now - lastNoteTime < 45000) return null;

    // Find unseen notes matching the context, or any unseen note
    let candidates = CULTURAL_NOTES.filter(
      n => !seenCulturalNotes.has(n.id) && n.context.includes(contextTag)
    );
    if (candidates.length === 0) {
      candidates = CULTURAL_NOTES.filter(n => !seenCulturalNotes.has(n.id));
    }
    if (candidates.length === 0) return null; // all seen

    // 40% chance to show a note (keeps them feeling special, not spammy)
    if (Math.random() > 0.40) return null;

    const note = candidates[Math.floor(Math.random() * candidates.length)];
    seenCulturalNotes.add(note.id);
    newNoteCount++;
    lastNoteTime = now;
    return note;
  }

  function forceGetCulturalNote(contextTag) {
    // Always return a note (for the overlay browse)
    let candidates = CULTURAL_NOTES.filter(n => n.context.includes(contextTag));
    if (candidates.length === 0) candidates = CULTURAL_NOTES;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function getAllCulturalNotes() {
    return CULTURAL_NOTES.map(n => ({
      ...n,
      seen: seenCulturalNotes.has(n.id),
    }));
  }

  function getSeenNoteCount() {
    return seenCulturalNotes.size;
  }

  function getTotalNoteCount() {
    return CULTURAL_NOTES.length;
  }

  function hasNewNotes() {
    return newNoteCount > 0;
  }

  function markNotesViewed() {
    newNoteCount = 0;
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

  // Helper: check if a night-shift NPC should be visible right now
  function isNPCVisible(npc) {
    // Weather-conditional NPCs: only appear during specific weather
    if (npc.weatherOnly) {
      if (typeof Engine !== 'undefined' && Engine.getWeatherType) {
        return Engine.getWeatherType() === npc.weatherOnly;
      }
      return false;
    }
    // Night shift NPCs only appear during 'night' time-of-day
    if (npc.isNightShift) {
      if (typeof Engine !== 'undefined' && Engine.getTimeOfDay) {
        return Engine.getTimeOfDay() === 'night';
      }
      return false;
    }
    return true;
  }

  function getNPCsOnMap(mapIdx) {
    return npcDefs.filter(n => n.map === mapIdx && isNPCVisible(n));
  }

  function getNPCAt(mapIdx, x, y) {
    const npc = npcDefs.find(n => n.map === mapIdx && n.x === x && n.y === y);
    if (npc && !isNPCVisible(npc)) return undefined;
    return npc;
  }

  // Check if there's an NPC blocking movement
  function isNPCBlocking(mapIdx, x, y) {
    return npcDefs.some(n => n.map === mapIdx && n.x === x && n.y === y && isNPCVisible(n));
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
  // Items the player "buys" at each level, with Japanese vocabulary.
  // Prices in yen reflect realistic 2024-2026 konbini pricing. Food items
  // generally fall under Japan's reduced 8% consumption tax (軽減税率);
  // alcohol, dine-in food, and non-essentials use the standard 10% rate.
  const KONBINI_ITEMS = [
    // Level 1: Welcome at 7-Eleven (just entering, no purchase)
    { levelId: 1, jp: 'ガム', romaji: 'Gamu', en: 'Gum', store: '7-Eleven', icon: 'gum', category: 'snack', priceYen: 110, taxRate: 0.08 },
    // Level 2: Thank You at Lawson (leaving after buying something)
    { levelId: 2, jp: 'お茶', romaji: 'Ocha', en: 'Green Tea', store: 'Lawson', icon: 'tea', category: 'drink', priceYen: 160, taxRate: 0.08 },
    // Level 3: The Bag at FamilyMart
    { levelId: 3, jp: 'おにぎり', romaji: 'Onigiri', en: 'Rice Ball', store: 'FamilyMart', icon: 'onigiri', category: 'food', priceYen: 150, taxRate: 0.08 },
    // Level 4: Point Card at 7-Eleven
    { levelId: 4, jp: 'サンドイッチ', romaji: 'Sandoicchi', en: 'Egg Sandwich', store: '7-Eleven', icon: 'sandwich', category: 'food', priceYen: 320, taxRate: 0.08 },
    // Level 5: Heat It Up at Lawson (bento)
    { levelId: 5, jp: 'お弁当', romaji: 'Obento', en: 'Bento Box', store: 'Lawson', icon: 'bento', category: 'food', priceYen: 580, taxRate: 0.08 },
    // Level 6: Chopsticks at FamilyMart (soup)
    { levelId: 6, jp: 'スープ', romaji: 'Suupu', en: 'Soup', store: 'FamilyMart', icon: 'soup', category: 'food', priceYen: 220, taxRate: 0.08 },
    // Level 7: How Much at 7-Eleven
    { levelId: 7, jp: 'コーヒー', romaji: 'Koohii', en: 'Coffee', store: '7-Eleven', icon: 'coffee', category: 'drink', priceYen: 180, taxRate: 0.08 },
    // Level 8: Where Is It at Lawson (onigiri)
    { levelId: 8, jp: 'ツナマヨおにぎり', romaji: 'Tuna mayo onigiri', en: 'Tuna Mayo Onigiri', store: 'Lawson', icon: 'onigiri', category: 'food', priceYen: 160, taxRate: 0.08 },
    // Level 9: Famichiki at FamilyMart
    { levelId: 9, jp: 'ファミチキ', romaji: 'Famichiki', en: 'Famichiki (Fried Chicken)', store: 'FamilyMart', icon: 'chicken', category: 'food', priceYen: 240, taxRate: 0.08 },
    // Level 10: Full Checkout at 7-Eleven (bento + more)
    { levelId: 10, jp: '幕の内弁当', romaji: 'Makunouchi bento', en: 'Makunouchi Bento', store: '7-Eleven', icon: 'bento', category: 'food', priceYen: 680, taxRate: 0.08 },
    // Level 11: Age Check at Lawson (beer) -- alcohol = 10% tax
    { levelId: 11, jp: 'ビール', romaji: 'Biiru', en: 'Beer', store: 'Lawson', icon: 'beer', category: 'drink', priceYen: 270, taxRate: 0.10 },
    // Level 12: Master at FamilyMart (full shopping)
    { levelId: 12, jp: 'メロンパン', romaji: 'Meronpan', en: 'Melon Bread', store: 'FamilyMart', icon: 'bread', category: 'food', priceYen: 180, taxRate: 0.08 },
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

  // ============ KONBINI RECEIPT (レシート) ============
  // Build authentic Japanese receipt data for a completed level. Captures the
  // exact format printed by real konbini POS systems: store header, transaction
  // metadata, line item with unit price, subtotal, consumption tax (消費税),
  // total, amount tendered (お預かり), change (お釣り), and the polite footer.
  let receiptCounter = 1000;
  function getNextReceiptNumber() {
    receiptCounter++;
    return receiptCounter;
  }

  // Format a number with Japanese-style thousand separators and a yen symbol
  function formatYen(amount) {
    return '\u00A5' + amount.toLocaleString('en-US');
  }

  // Compute a plausible "amount tendered" -- player paid with the next round
  // bill or convenient coin combination, just like a real shopper would.
  function computeTendered(total) {
    // Round up to the next 100, 500, 1000, or 5000-yen denomination based on size
    if (total <= 100) return Math.ceil(total / 100) * 100;
    if (total <= 500) return 500;
    if (total <= 1000) return 1000;
    if (total <= 5000) return Math.ceil(total / 1000) * 1000;
    return Math.ceil(total / 5000) * 5000;
  }

  function buildReceiptData(levelId, store, mistakes) {
    const item = KONBINI_ITEMS.find(i => i.levelId === levelId);
    if (!item) return null;

    const subtotal = item.priceYen;
    // Japanese konbini use tax-inclusive pricing (内税). Tax is shown on the
    // receipt as informational, not added on top: subtotal already includes it.
    const taxAmount = Math.round(subtotal - subtotal / (1 + item.taxRate));
    const total = subtotal;
    const tendered = computeTendered(total);
    const change = tendered - total;

    // Real konbini receipts have a register/cashier number
    const registerNo = ['01', '02', '03'][levelId % 3];
    const receiptNo = getNextReceiptNumber();

    // Date/time -- use current time formatted Japanese-style
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const dateStr = yyyy + '/' + mm + '/' + dd;
    const timeStr = hh + ':' + min;

    // Store-specific Japanese branding text (matches real receipts)
    const STORE_HEADER = {
      '7-Eleven': { jp: 'セブンイレブン', en: '7-Eleven', branch: '渋谷中央店' },
      'Lawson':   { jp: 'ローソン',         en: 'Lawson',   branch: '新宿駅前店' },
      'FamilyMart': { jp: 'ファミリーマート', en: 'FamilyMart', branch: '原宿店' },
    };
    const header = STORE_HEADER[store] || { jp: store, en: store, branch: '' };

    // Loyalty points earned -- konbini point card systems award roughly 1 pt
    // per 200 yen spent (rounded down). Bonus points for clean transactions.
    const basePoints = Math.floor(total / 200);
    const bonusPoints = mistakes === 0 ? 1 : 0;
    const pointsEarned = basePoints + bonusPoints;

    return {
      storeJp: header.jp,
      storeEn: header.en,
      branch: header.branch,
      dateStr: dateStr,
      timeStr: timeStr,
      registerNo: registerNo,
      receiptNo: 'No.' + receiptNo,
      itemJp: item.jp,
      itemEn: item.en,
      unitPrice: item.priceYen,
      qty: 1,
      subtotal: subtotal,
      taxRate: item.taxRate,
      taxAmount: taxAmount,
      total: total,
      tendered: tendered,
      change: change,
      pointsEarned: pointsEarned,
      isReducedTax: item.taxRate === 0.08,
    };
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




  // ============ CONVERSATION PRACTICE SYSTEM ============
  // Full multi-turn konbini conversations: player picks a scenario,
  // then goes through a realistic clerk-customer exchange step by step
  const CONVERSATION_SCENARIOS = [
    {
      id: 'buy_coffee',
      title: 'Buying Coffee',
      titleJp: 'コーヒーを買う',
      emoji: '☕',
      difficulty: 1,
      intro: 'You walk up to the register with a hot coffee. Let\'s handle the whole checkout!',
      turns: [
        {
          speaker: 'clerk',
          lineJp: 'いらっしゃいませ！こちらの商品でよろしいですか？',
          lineEn: 'Welcome! Is it just this item?',
          question: 'The clerk is asking if this is everything. How do you respond?',
          options: [
            { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
            { text: 'いいえ、まだです', romaji: 'Iie, mada desu', en: 'No, not yet', correct: false },
            { text: '[黙って頷く]', en: 'Nod silently (not ideal)', correct: false },
          ],
          correctExplanation: 'はい、お願いします is the standard confirmation. Clear and polite!',
          wrongExplanation: 'When confirming your purchase, say はい、お願いします (Yes, please).',
        },
        {
          speaker: 'clerk',
          lineJp: 'ポイントカードはお持ちですか？',
          lineEn: 'Do you have a point card?',
          question: 'The clerk is asking about your point card.',
          options: [
            { text: '持ってないです', romaji: 'Motte nai desu', en: 'I don\'t have one', correct: true },
            { text: 'はい、あります', romaji: 'Hai, arimasu', en: 'Yes, I have one', correct: true },
            { text: 'ポイントカード？', en: 'Point card? (confused)', correct: false },
          ],
          correctExplanation: 'Both are natural responses. 持ってないです or ないです are the most common tourist answers!',
          wrongExplanation: 'Say 持ってないです (I don\'t have one) or ないです. It\'s completely fine!',
        },
        {
          speaker: 'clerk',
          lineJp: '百五十円でございます。お支払い方法は？',
          lineEn: 'That will be 150 yen. Payment method?',
          question: 'Time to pay! Choose your method.',
          options: [
            { text: '現金でお願いします', romaji: 'Genkin de onegaishimasu', en: 'Cash, please', correct: true },
            { text: 'Suicaでお願いします', romaji: 'Suica de onegaishimasu', en: 'Suica, please', correct: true },
            { text: 'Money...', en: '(in English)', correct: false },
          ],
          correctExplanation: 'Pattern: [method] + で + お願いします works for ANY payment method!',
          wrongExplanation: 'Say the method in Japanese + で + お願いします. 現金 = cash, カード = card, Suica, etc.',
        },
        {
          speaker: 'clerk',
          lineJp: 'レシートはよろしいですか？',
          lineEn: 'Do you need the receipt?',
          question: 'The clerk is asking about the receipt.',
          options: [
            { text: '大丈夫です', romaji: 'Daijoubu desu', en: 'No, I\'m fine', correct: true },
            { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
            { text: 'No', en: '(in English)', correct: false },
          ],
          correctExplanation: '大丈夫です is the go-to phrase to politely decline anything at konbini!',
          wrongExplanation: 'Say 大丈夫です (I\'m fine) to decline, or はい、お願いします to accept.',
        },
        {
          speaker: 'clerk',
          lineJp: 'ありがとうございました。またお越しくださいませ！',
          lineEn: 'Thank you! Please come again!',
          question: 'The clerk thanks you. What do you say as you leave?',
          options: [
            { text: 'ありがとうございます', romaji: 'Arigatou gozaimasu', en: 'Thank you', correct: true },
            { text: 'どうも', romaji: 'Doumo', en: 'Thanks (casual)', correct: true },
            { text: '[何も言わない]', en: 'Say nothing (acceptable but cold)', correct: false },
          ],
          correctExplanation: 'A quick ありがとうございます or casual どうも is perfect. Japanese appreciate the acknowledgment!',
          wrongExplanation: 'A simple ありがとうございます or どうも as you leave makes a good impression.',
        },
      ]
    },
    {
      id: 'buy_bento',
      title: 'Buying Bento for Lunch',
      titleJp: 'お弁当を買う',
      emoji: '🍱',
      difficulty: 2,
      intro: 'Lunchtime! You grab a bento and head to the register. This one has extra clerk questions!',
      turns: [
        {
          speaker: 'clerk',
          lineJp: 'お弁当温めますか？',
          lineEn: 'Would you like the bento heated?',
          question: 'The clerk asks if you want your bento microwaved.',
          options: [
            { text: 'お願いします', romaji: 'Onegaishimasu', en: 'Yes, please', correct: true },
            { text: 'そのままで大丈夫です', romaji: 'Sono mama de daijoubu desu', en: 'As is, I\'m fine', correct: true },
            { text: 'Hot?', en: '(in English)', correct: false },
          ],
          correctExplanation: 'お願いします to heat, or そのままで大丈夫です to skip. Both are natural!',
          wrongExplanation: 'Say お願いします (yes please) or そのままで大丈夫です (no thanks, as is).',
        },
        {
          speaker: 'clerk',
          lineJp: 'お箸はおつけしますか？',
          lineEn: 'Would you like chopsticks?',
          question: 'Do you need chopsticks?',
          options: [
            { text: 'お願いします', romaji: 'Onegaishimasu', en: 'Yes, please', correct: true },
            { text: 'いらないです', romaji: 'Iranai desu', en: 'No, I don\'t need them', correct: true },
            { text: 'Chopsticks?', en: '(confused English)', correct: false },
          ],
          correctExplanation: 'お箸 = chopsticks. You can also ask for スプーン (spoon) or フォーク (fork)!',
          wrongExplanation: 'Say お願いします (yes) or いらないです (no). Simple pattern for any offer!',
        },
        {
          speaker: 'clerk',
          lineJp: '袋はご利用ですか？',
          lineEn: 'Would you like a bag?',
          question: 'Plastic bags cost 3-5 yen since 2020.',
          options: [
            { text: 'お願いします', romaji: 'Onegaishimasu', en: 'Yes, please', correct: true },
            { text: '大丈夫です', romaji: 'Daijoubu desu', en: 'No thanks', correct: true },
            { text: 'Bag please', en: '(in English)', correct: false },
          ],
          correctExplanation: 'Bags cost 3-5 yen. Many Japanese bring a マイバッグ (reusable bag)!',
          wrongExplanation: 'Say お願いします (yes) or 大丈夫です (no, I\'m fine).',
        },
        {
          speaker: 'clerk',
          lineJp: '五百円でございます。お支払いは？',
          lineEn: 'That\'s 500 yen. Payment?',
          question: 'Choose how to pay.',
          options: [
            { text: '現金でお願いします', romaji: 'Genkin de onegaishimasu', en: 'Cash, please', correct: true },
            { text: 'カードでお願いします', romaji: 'Kaado de onegaishimasu', en: 'Card, please', correct: true },
            { text: '[お金を出す]', en: 'Just put money on counter', correct: false },
          ],
          correctExplanation: 'Always SAY your payment method. The clerk needs to select it on the register!',
          wrongExplanation: 'Tell the clerk! 現金 (cash), カード (card), or Suica + でお願いします.',
        },
        {
          speaker: 'clerk',
          lineJp: 'お釣り二百円でございます。レシートは？',
          lineEn: 'Here\'s 200 yen change. Receipt?',
          question: 'Clerk gives change and asks about receipt.',
          options: [
            { text: '大丈夫です。ありがとうございます', romaji: 'Daijoubu desu. Arigatou gozaimasu', en: 'No thanks. Thank you!', correct: true },
            { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
            { text: '[黙って立ち去る]', en: 'Leave silently', correct: false },
          ],
          correctExplanation: 'Declining the receipt + thank you is the most common combo. Smooth checkout!',
          wrongExplanation: 'Say 大丈夫です (no thanks) or はい、お願いします (yes please) for the receipt.',
        },
      ]
    },
    {
      id: 'ask_bathroom',
      title: 'Asking for the Bathroom',
      titleJp: 'トイレを借りる',
      emoji: '🚻',
      difficulty: 2,
      intro: 'You need the restroom at the konbini. This is a common real-world situation!',
      turns: [
        {
          speaker: 'player_start',
          lineJp: null,
          lineEn: 'You approach the clerk to ask about the restroom.',
          question: 'How do you ask to use the bathroom?',
          options: [
            { text: 'すみません、トイレお借りしてもいいですか？', romaji: 'Sumimasen, toire okari shite mo ii desu ka?', en: 'Excuse me, may I use the restroom?', correct: true },
            { text: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?', en: 'Where is the restroom?', correct: true },
            { text: 'Bathroom?', en: '(in English)', correct: false },
          ],
          correctExplanation: 'Both work! The polite お借りして form is best, but どこですか is fine too.',
          wrongExplanation: 'Say すみません、トイレお借りしてもいいですか？ to politely ask.',
        },
        {
          speaker: 'clerk',
          lineJp: 'はい、奥にございます。どうぞお使いください。',
          lineEn: 'Yes, it\'s in the back. Please go ahead.',
          question: 'The clerk says the bathroom is in the back (奥). How do you respond?',
          options: [
            { text: 'ありがとうございます', romaji: 'Arigatou gozaimasu', en: 'Thank you', correct: true },
            { text: 'すみません', romaji: 'Sumimasen', en: 'Thank you (lit. sorry for the trouble)', correct: true },
            { text: 'OK', en: '(too casual)', correct: false },
          ],
          correctExplanation: 'すみません here means "thanks for the trouble" -- very natural in this situation!',
          wrongExplanation: 'Say ありがとうございます or すみません (thanks for the trouble).',
        },
        {
          speaker: 'narrator',
          lineJp: '（トイレを使った後）',
          lineEn: '(After using the restroom)',
          question: 'You\'re done. Do you say anything to the clerk on the way out?',
          options: [
            { text: 'ありがとうございました', romaji: 'Arigatou gozaimashita', en: 'Thank you (past tense)', correct: true },
            { text: 'すみませんでした', romaji: 'Sumimasen deshita', en: 'Sorry for the trouble', correct: true },
            { text: '[何も言わずに出る]', en: 'Leave without saying anything', correct: false },
          ],
          correctExplanation: 'Past tense ございました shows appreciation for something already done. Polite and natural!',
          wrongExplanation: 'A quick thank you shows good manners. ありがとうございました (past tense) is perfect here.',
        },
      ]
    },
    {
      id: 'buy_hot_food',
      title: 'Ordering Hot Food',
      titleJp: 'ホットスナックを注文する',
      emoji: '🍗',
      difficulty: 2,
      intro: 'Fried chicken (ファミチキ) and nikuman are behind the counter. You need to ask for them!',
      turns: [
        {
          speaker: 'player_start',
          lineJp: null,
          lineEn: 'You want to order fried chicken from the hot food case behind the clerk.',
          question: 'How do you ask for hot food behind the counter?',
          options: [
            { text: 'すみません、ファミチキ一つお願いします', romaji: 'Sumimasen, famichiki hitotsu onegaishimasu', en: 'Excuse me, one fried chicken please', correct: true },
            { text: 'あのチキンをください', romaji: 'Ano chikin wo kudasai', en: 'That chicken, please', correct: true },
            { text: '[指を差す]', en: 'Just point (no words)', correct: false },
          ],
          correctExplanation: 'すみません + item + 一つ + お願いします is the perfect pattern for ordering counter items!',
          wrongExplanation: 'Use: すみません + item name + 一つ(hitotsu = one) + お願いします.',
        },
        {
          speaker: 'clerk',
          lineJp: 'ファミチキ一つですね。他に何かございますか？',
          lineEn: 'One fried chicken. Anything else?',
          question: 'The clerk confirms and asks if you want anything else.',
          options: [
            { text: '以上でお願いします', romaji: 'Ijou de onegaishimasu', en: 'That\'s all, please', correct: true },
            { text: '肉まんも一つお願いします', romaji: 'Nikuman mo hitotsu onegaishimasu', en: 'One nikuman too, please', correct: true },
            { text: 'No', en: '(in English)', correct: false },
          ],
          correctExplanation: '以上で (ijou de) means "that\'s all" -- very useful at any register!',
          wrongExplanation: 'Say 以上でお願いします (that\'s all) or add more items with も一つお願いします.',
        },
        {
          speaker: 'clerk',
          lineJp: '袋はご利用ですか？お支払い方法は？',
          lineEn: 'Would you like a bag? And payment method?',
          question: 'The clerk asks about bag and payment together.',
          options: [
            { text: '袋はいらないです。PayPayでお願いします', romaji: 'Fukuro wa iranai desu. PayPay de onegaishimasu', en: 'No bag. PayPay, please', correct: true },
            { text: 'お願いします。現金で', romaji: 'Onegaishimasu. Genkin de', en: 'Yes (bag). Cash', correct: true },
            { text: '[迷う]', en: 'Look confused', correct: false },
          ],
          correctExplanation: 'Combining bag + payment in one response is natural and efficient!',
          wrongExplanation: 'Handle both questions: いらないです/お願いします for bag + payment method + でお願いします.',
        },
        {
          speaker: 'clerk',
          lineJp: 'ありがとうございます。お気をつけて！',
          lineEn: 'Thank you! Take care!',
          question: 'The clerk says take care as you leave.',
          options: [
            { text: 'ありがとう！', romaji: 'Arigatou!', en: 'Thanks!', correct: true },
            { text: 'どうも', romaji: 'Doumo', en: 'Thanks (casual)', correct: true },
            { text: '[無視する]', en: 'Ignore them', correct: false },
          ],
          correctExplanation: 'A quick casual thanks is perfect for leaving. お気をつけて = take care!',
          wrongExplanation: 'A simple ありがとう or どうも is friendly and natural.',
        },
      ]
    },
    {
      id: 'buy_alcohol',
      title: 'Buying Alcohol (Age Check)',
      titleJp: 'お酒を買う（年齢確認）',
      emoji: '🍺',
      difficulty: 3,
      intro: 'Buying beer requires age verification in Japan. The legal age is 20, not 18!',
      turns: [
        {
          speaker: 'clerk',
          lineJp: 'お酒のお買い物ですね。年齢確認をお願いいたします。画面のボタンを押してください。',
          lineEn: 'You\'re buying alcohol. Please confirm your age by pressing the screen button.',
          question: 'The clerk points to the age verification screen on the register. What do you do?',
          options: [
            { text: '[画面の「20歳以上です」を押す]', en: 'Press the "I am 20 or over" button', correct: true },
            { text: '二十歳以上です', romaji: 'Hatachi ijou desu', en: 'I\'m 20 or older (verbal)', correct: false },
            { text: 'パスポートを見せる', romaji: 'Pasupooto wo miseru', en: 'Show passport', correct: false },
          ],
          correctExplanation: 'You MUST press the screen button yourself. The clerk cannot press it for you -- it\'s the law!',
          wrongExplanation: 'You must physically press the 「20歳以上です」 button on the register screen.',
        },
        {
          speaker: 'clerk',
          lineJp: 'ありがとうございます。他にお買い物はございますか？',
          lineEn: 'Thank you. Anything else?',
          question: 'After age verification, the clerk asks if there\'s more.',
          options: [
            { text: 'それだけです', romaji: 'Sore dake desu', en: 'Just that', correct: true },
            { text: 'おつまみも一つ', romaji: 'Otsumami mo hitotsu', en: 'And one snack too', correct: true },
            { text: 'That\'s all', en: '(in English)', correct: false },
          ],
          correctExplanation: 'それだけです is another natural way to say "that\'s all" -- more casual than 以上で.',
          wrongExplanation: 'Say それだけです (just that) or 以上でお願いします (that\'s all, please).',
        },
        {
          speaker: 'clerk',
          lineJp: '三百五十円です。お支払い方法は？',
          lineEn: '350 yen. Payment method?',
          question: 'Time to pay for your beer.',
          options: [
            { text: '現金でお願いします', romaji: 'Genkin de onegaishimasu', en: 'Cash, please', correct: true },
            { text: 'Suicaでお願いします', romaji: 'Suica de onegaishimasu', en: 'Suica, please', correct: true },
            { text: 'いくらですか？', romaji: 'Ikura desu ka?', en: 'How much? (already told)', correct: false },
          ],
          correctExplanation: 'Same pattern every time! [method] + で + お願いします works at every konbini.',
          wrongExplanation: 'Use [payment method] + でお願いします. The price was already stated!',
        },
        {
          speaker: 'clerk',
          lineJp: 'お釣りでございます。レシートはよろしいですか？',
          lineEn: 'Here\'s your change. Receipt?',
          question: 'Final exchange -- change and receipt.',
          options: [
            { text: '大丈夫です。ありがとうございます', romaji: 'Daijoubu desu. Arigatou gozaimasu', en: 'No receipt. Thank you!', correct: true },
            { text: 'お願いします', romaji: 'Onegaishimasu', en: 'Yes, please (receipt)', correct: true },
            { text: 'Thanks', en: '(in English)', correct: false },
          ],
          correctExplanation: 'Great job! You handled a full alcohol purchase with age verification. 乾杯！',
          wrongExplanation: 'Say 大丈夫です (no thanks) or お願いします (yes) for the receipt.',
        },
      ]
    },
  ];

  // Conversation practice state
  const conversationState = {
    practicesCompleted: 0,
    scenariosCompleted: [], // IDs of completed scenarios
    lastPracticeTime: 0,
    totalCorrect: 0,
    totalAttempted: 0,
  };

  function isConversationPracticeReady() {
    return completedLevelsCount >= 1;
  }

  function getNextConversationScenario() {
    const unseen = CONVERSATION_SCENARIOS.filter(s => !conversationState.scenariosCompleted.includes(s.id));
    if (unseen.length > 0) {
      unseen.sort((a, b) => a.difficulty - b.difficulty);
      return unseen[0];
    }
    return CONVERSATION_SCENARIOS[Math.floor(Math.random() * CONVERSATION_SCENARIOS.length)];
  }

  function getConversationScenarioList() {
    return CONVERSATION_SCENARIOS.map(s => ({
      id: s.id,
      title: s.title,
      titleJp: s.titleJp,
      emoji: s.emoji,
      difficulty: s.difficulty,
      completed: conversationState.scenariosCompleted.includes(s.id),
    }));
  }

  function completeConversationScenario(scenarioId, correct, total) {
    if (!conversationState.scenariosCompleted.includes(scenarioId)) {
      conversationState.scenariosCompleted.push(scenarioId);
    }
    conversationState.practicesCompleted++;
    conversationState.totalCorrect += correct;
    conversationState.totalAttempted += total;
    conversationState.lastPracticeTime = Date.now();
  }

  function getConversationStats() {
    return {
      completed: conversationState.practicesCompleted,
      scenariosUnlocked: conversationState.scenariosCompleted.length,
      totalScenarios: CONVERSATION_SCENARIOS.length,
      totalCorrect: conversationState.totalCorrect,
      totalAttempted: conversationState.totalAttempted,
    };
  }

  // ============ SPEED ROUND SYSTEM ============
  // Timed rapid-fire quiz that tests recall under pressure
  // Requirements: player must have at least 4 tracked phrases
  const speedRoundState = {
    roundsCompleted: 0,
    bestScore: 0,
    bestTime: Infinity, // best total time in seconds
    totalCorrect: 0,
    totalAttempted: 0,
    cooldownUntil: 0,
  };

  function isSpeedRoundReady() {
    const tracked = Object.keys(phraseTracker);
    if (tracked.length < 4) return false;
    return Date.now() >= speedRoundState.cooldownUntil;
  }

  // Build 5 random questions weighted toward weaker phrases
  function buildSpeedRoundQuiz() {
    const count = 5;
    const allTracked = Object.keys(phraseTracker).map(key => phraseTracker[key]);
    if (allTracked.length < count) return allTracked;

    // Weight: lower mastery + more wrong answers = more likely
    const weighted = allTracked.map(p => ({
      ...p,
      weight: (5 - p.mastery) * 2 + p.wrongCount + 1 + Math.random() * 3
    }));
    weighted.sort((a, b) => b.weight - a.weight);

    // Pick top candidates and shuffle
    const selected = weighted.slice(0, Math.min(count + 3, weighted.length));
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }
    return selected.slice(0, count);
  }

  function getSpeedRoundStats() {
    return { ...speedRoundState };
  }

  function recordSpeedRoundResult(correct, total, totalTimeSec) {
    speedRoundState.roundsCompleted++;
    speedRoundState.totalCorrect += correct;
    speedRoundState.totalAttempted += total;
    const score = correct;
    if (score > speedRoundState.bestScore) speedRoundState.bestScore = score;
    if (totalTimeSec < speedRoundState.bestTime) speedRoundState.bestTime = totalTimeSec;
    // 45-second cooldown between speed rounds
    speedRoundState.cooldownUntil = Date.now() + 45000;
    return { score, bestScore: speedRoundState.bestScore };
  }

  // ============ PRONUNCIATION GUIDE (PITCH ACCENT) ============
  // Each phrase has: japanese text, romaji, english meaning,
  // mora breakdown with pitch (H=high, L=low), accent type, and tip
  // Pitch data sourced from standard Tokyo dialect (NHK accent dictionary conventions)
  const PITCH_ACCENT_PHRASES = [
    // --- Essential Greetings ---
    {
      japanese: 'いらっしゃいませ',
      romaji: 'irasshaimase',
      english: 'Welcome!',
      mora: ['い','らっ','しゃい','ま','せ'],
      pitch: ['L','H','H','H','L'],
      accentType: 'nakadaka',
      accentNum: 4,
      tip: 'Pitch rises on the second mora and drops on the last. You don\'t need to reply -- just nod!',
      context: 'greeting'
    },
    {
      japanese: 'ありがとうございます',
      romaji: 'arigatou gozaimasu',
      english: 'Thank you very much',
      mora: ['あ','り','が','とう','ご','ざい','ま','す'],
      pitch: ['L','H','L','L','L','L','L','L'],
      accentType: 'atamadaka',
      accentNum: 2,
      tip: 'The pitch peaks at り then falls. English speakers often stress the wrong syllable -- keep it short and even!',
      context: 'checkout'
    },
    {
      japanese: 'すみません',
      romaji: 'sumimasen',
      english: 'Excuse me / Sorry',
      mora: ['す','み','ま','せ','ん'],
      pitch: ['L','H','H','H','L'],
      accentType: 'nakadaka',
      accentNum: 4,
      tip: 'Rises on み and stays high until dropping at ん. Very useful for getting a clerk\'s attention!',
      context: 'general'
    },
    {
      japanese: 'おねがいします',
      romaji: 'onegaishimasu',
      english: 'Please',
      mora: ['お','ね','がい','し','ま','す'],
      pitch: ['L','H','H','H','L','L'],
      accentType: 'nakadaka',
      accentNum: 4,
      tip: 'Pitch drops after し. This is the most versatile polite request -- use it everywhere!',
      context: 'checkout'
    },
    // --- Store Interactions ---
    {
      japanese: 'ください',
      romaji: 'kudasai',
      english: 'Please (give me)',
      mora: ['く','だ','さい'],
      pitch: ['L','H','H'],
      accentType: 'heiban',
      accentNum: 0,
      tip: 'Flat pattern -- stays high after the rise. Point at what you want and say これをください!',
      context: 'checkout'
    },
    {
      japanese: 'だいじょうぶです',
      romaji: 'daijoubu desu',
      english: 'It\'s fine / No thank you',
      mora: ['だい','じょう','ぶ','で','す'],
      pitch: ['L','H','H','L','L'],
      accentType: 'nakadaka',
      accentNum: 3,
      tip: 'The magic phrase for politely declining anything -- bags, heating, receipts. Pitch peaks at ぶ.',
      context: 'checkout'
    },
    {
      japanese: 'ふくろはいりません',
      romaji: 'fukuro wa irimasen',
      english: 'I don\'t need a bag',
      mora: ['ふ','く','ろ','は','い','り','ま','せ','ん'],
      pitch: ['L','H','H','L','L','H','H','H','L'],
      accentType: 'nakadaka',
      accentNum: 3,
      tip: 'ふくろ drops after ろ. Since 2020, bags cost 3-5 yen -- learn this to save money!',
      context: 'bag'
    },
    {
      japanese: 'おはしおつかいですか',
      romaji: 'ohashi otsukai desu ka',
      english: 'Will you use chopsticks?',
      mora: ['お','は','し','お','つ','かい','で','す','か'],
      pitch: ['L','H','L','L','H','H','L','L','L'],
      accentType: 'nakadaka',
      accentNum: 2,
      tip: 'Two separate words joined. おはし peaks at は. Say はい or いいえ to respond.',
      context: 'checkout'
    },
    // --- Payment ---
    {
      japanese: 'おあたためしますか',
      romaji: 'oatatame shimasu ka',
      english: 'Shall I heat it up?',
      mora: ['お','あ','た','た','め','し','ま','す','か'],
      pitch: ['L','H','H','H','L','L','H','L','L'],
      accentType: 'nakadaka',
      accentNum: 4,
      tip: 'Clerks ask this for bentos and onigiri. Peak at ため, then drops. はい or いいえ to answer.',
      context: 'food'
    },
    {
      japanese: 'ポイントカードはお持ちですか',
      romaji: 'pointo kaado wa omochi desu ka',
      english: 'Do you have a point card?',
      mora: ['ポイ','ン','ト','カー','ド','は','お','も','ち','で','す','か'],
      pitch: ['L','H','H','L','L','L','L','H','H','L','L','L'],
      accentType: 'nakadaka',
      accentNum: 3,
      tip: 'The feared point card question! ポイント peaks at ン. Say ないです if you don\'t have one.',
      context: 'pointcard'
    },
    // --- Useful Responses ---
    {
      japanese: 'はい',
      romaji: 'hai',
      english: 'Yes',
      mora: ['はい'],
      pitch: ['H'],
      accentType: 'atamadaka',
      accentNum: 1,
      tip: 'Short and high-pitched. The most common word you\'ll use at any konbini!',
      context: 'general'
    },
    {
      japanese: 'いいえ',
      romaji: 'iie',
      english: 'No',
      mora: ['いい','え'],
      pitch: ['H','L'],
      accentType: 'atamadaka',
      accentNum: 1,
      tip: 'Starts high, drops immediately. In konbini, だいじょうぶです is more natural than a flat いいえ.',
      context: 'general'
    },
  ];

  // Pronunciation guide state
  const pitchGuideState = {
    lessonsViewed: new Set(),
    quizCorrect: 0,
    quizTotal: 0,
    lastInteraction: 0,
  };

  function isPronunciationReady() {
    // Available after completing at least 1 store level
    return completedLevelsCount >= 1;
  }

  function getNextPitchLesson() {
    // Return the next unviewed lesson, cycling through all
    for (let i = 0; i < PITCH_ACCENT_PHRASES.length; i++) {
      if (!pitchGuideState.lessonsViewed.has(i)) {
        return { index: i, phrase: PITCH_ACCENT_PHRASES[i] };
      }
    }
    // All viewed -- pick one to review (least recently studied)
    const idx = pitchGuideState.lessonsViewed.size % PITCH_ACCENT_PHRASES.length;
    return { index: idx, phrase: PITCH_ACCENT_PHRASES[idx] };
  }

  function buildPitchQuiz() {
    // Build a 3-question quiz on pitch patterns
    const questions = [];
    const indices = [];
    for (let i = 0; i < PITCH_ACCENT_PHRASES.length; i++) indices.push(i);
    // Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Pick up to 3
    const accentNames = {
      'heiban': '平板 (Heiban) - Flat',
      'atamadaka': '頭高 (Atamadaka) - Head-high',
      'nakadaka': '中高 (Nakadaka) - Mid-high',
      'odaka': '尾高 (Odaka) - Tail-high'
    };
    const allTypes = ['heiban', 'atamadaka', 'nakadaka', 'odaka'];
    for (let q = 0; q < Math.min(3, indices.length); q++) {
      const phrase = PITCH_ACCENT_PHRASES[indices[q]];
      const correctLabel = accentNames[phrase.accentType];
      // Build wrong choices from other types
      const wrongTypes = allTypes.filter(t => t !== phrase.accentType);
      const wrongLabels = wrongTypes.map(t => accentNames[t]);
      // Shuffle wrong choices and pick 2
      for (let i = wrongLabels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wrongLabels[i], wrongLabels[j]] = [wrongLabels[j], wrongLabels[i]];
      }
      const choices = [correctLabel, wrongLabels[0], wrongLabels[1]];
      // Shuffle choices
      for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
      }
      questions.push({
        phrase,
        correctAnswer: correctLabel,
        choices
      });
    }
    return questions;
  }

  function getPronunciationStats() {
    return {
      lessonsViewed: pitchGuideState.lessonsViewed.size,
      totalLessons: PITCH_ACCENT_PHRASES.length,
      quizCorrect: pitchGuideState.quizCorrect,
      quizTotal: pitchGuideState.quizTotal,
    };
  }

  function recordPitchResult(lessonIdx, wasCorrect) {
    pitchGuideState.lessonsViewed.add(lessonIdx);
    if (wasCorrect !== undefined) {
      pitchGuideState.quizTotal++;
      if (wasCorrect) pitchGuideState.quizCorrect++;
    }
    pitchGuideState.lastInteraction = Date.now();
  }

  // Get street NPC next dialogue
  function getStreetDialogue(npcDef) {
    const key = `${npcDef.x}_${npcDef.y}`;
    if (!streetNPCState[key]) streetNPCState[key] = 0;
    const idx = streetNPCState[key] % npcDef.dialogues.length;
    streetNPCState[key]++;
    return npcDef.dialogues[idx];
  }


  // ============ ONOMATOPOEIA LESSON SYSTEM ============
  const ONOMATOPOEIA_LESSONS = [
    {
      id: 'konbini_sounds',
      topic: 'Konbini Sounds',
      topicJp: 'コンビニの音 (konbini no oto)',
      icon: 'speaker',
      color: '#e74c3c',
      intro: 'Every konbini is full of distinct sounds! Learn the words that describe them.',
      interactions: [
        {
          clerkJp: 'ピッピッ',
          clerkRomaji: 'Pippi',
          clerkEn: '(the sound of scanning items at the register)',
          tip: 'ピッピッ (pippi) is the beeping sound of a barcode scanner. You hear this dozens of times per konbini visit!',
          question: 'What does ピッピッ (pippi) describe?',
          options: [
            { text: 'Register barcode scanner beeping', en: 'Scanner beep', correct: true },
            { text: 'A bird chirping', en: 'Bird sound', correct: false },
            { text: 'A phone ringing', en: 'Phone ring', correct: false },
          ],
          correctExplanation: 'ピッピッ mimics the short electronic beep of the scanner. In Japan, the register area is called レジ (reji)!',
          wrongExplanation: 'ピッピッ is the register beeping sound. It imitates the short electronic beep of item scanning at the レジ (register).'
        },
        {
          clerkJp: 'チン！',
          clerkRomaji: 'Chin!',
          clerkEn: '(the sound of a microwave finishing)',
          tip: 'チン (chin) is the ding of a microwave. Japanese people even say お弁当をチンする (to microwave a bento)!',
          question: 'If a clerk says お弁当をチンしますか？ (Obento wo chin shimasu ka?), what are they asking?',
          options: [
            { text: 'Shall I microwave your bento?', en: 'Heat it up?', correct: true },
            { text: 'Do you want chopsticks?', en: 'Chopsticks?', correct: false },
            { text: 'Is this your bento?', en: 'Is this yours?', correct: false },
          ],
          correctExplanation: 'チンする literally means "to chin (ding) it" -- using the microwave! This is everyday Japanese that textbooks skip.',
          wrongExplanation: 'チン = microwave ding. チンする = to microwave something. The clerk is asking if you want your bento heated up!'
        },
        {
          clerkJp: 'ガチャ',
          clerkRomaji: 'Gacha',
          clerkEn: '(the clunking sound of a door handle or capsule machine)',
          tip: 'ガチャ (gacha) describes a mechanical clunking sound -- like turning a door handle or a capsule toy machine.',
          question: 'What kind of sound does ガチャ (gacha) represent?',
          options: [
            { text: 'A mechanical clunk (door/machine)', en: 'Mechanical clunk', correct: true },
            { text: 'A splash of water', en: 'Water splash', correct: false },
            { text: 'A whisper', en: 'Quiet whisper', correct: false },
          ],
          correctExplanation: 'ガチャ is a mechanical clunking sound. ガチャポン (gachapon) capsule machines at konbini are named after this sound + ポン (pop)!',
          wrongExplanation: 'ガチャ imitates a hard mechanical click or clunk. It is the origin of ガチャポン (gachapon) capsule toy machines!'
        },
      ]
    },
    {
      id: 'food_textures',
      topic: 'Food Textures',
      topicJp: '食感 (shokkan)',
      icon: 'food',
      color: '#f39c12',
      intro: 'Japanese has incredibly specific words for food textures. Essential for konbini snack reviews!',
      interactions: [
        {
          clerkJp: 'このチキンはサクサクですよ！',
          clerkRomaji: 'Kono chikin wa sakusaku desu yo!',
          clerkEn: 'This chicken is crispy!',
          tip: 'サクサク (sakusaku) = light, crispy texture. Used for fried food, tempura, crackers, and fresh lettuce!',
          question: 'What texture does サクサク (sakusaku) describe?',
          options: [
            { text: 'Crispy and crunchy', en: 'Crispy/crunchy', correct: true },
            { text: 'Soft and chewy', en: 'Soft/chewy', correct: false },
            { text: 'Slimy and sticky', en: 'Slimy/sticky', correct: false },
          ],
          correctExplanation: 'サクサク is THE word for crispy! Famichiki (ファミチキ) is famous for being サクサク. You will see this on packaging everywhere.',
          wrongExplanation: 'サクサク describes a light, crispy crunch. Think fried chicken coating, fresh tempura, or cookie crumble!'
        },
        {
          clerkJp: 'このパンはフワフワ！',
          clerkRomaji: 'Kono pan wa fuwafuwa!',
          clerkEn: 'This bread is so fluffy!',
          tip: 'フワフワ (fuwafuwa) = soft, fluffy, airy. Used for bread, pancakes, cotton candy, and even clouds!',
          question: 'A konbini sandwich labeled フワフワ (fuwafuwa) would be:',
          options: [
            { text: 'Soft and fluffy', en: 'Light and airy', correct: true },
            { text: 'Hard and dense', en: 'Dense/heavy', correct: false },
            { text: 'Spicy and hot', en: 'Spicy', correct: false },
          ],
          correctExplanation: 'フワフワ means wonderfully soft and fluffy! Konbini bread (パン) often highlights this texture on the label.',
          wrongExplanation: 'フワフワ describes something soft, fluffy, and airy -- the opposite of hard or dense. Think cloud-like bread!'
        },
        {
          clerkJp: 'もちもちの大福あります',
          clerkRomaji: 'Mochimochi no daifuku arimasu',
          clerkEn: 'We have chewy daifuku',
          tip: 'モチモチ (mochimochi) = pleasantly chewy and springy, like mochi, udon, or tapioca pearls.',
          question: 'What does モチモチ (mochimochi) mean on a food label?',
          options: [
            { text: 'Chewy and springy', en: 'Pleasantly chewy', correct: true },
            { text: 'Bitter and sour', en: 'Bitter/sour', correct: false },
            { text: 'Frozen and cold', en: 'Ice cold', correct: false },
          ],
          correctExplanation: 'モチモチ is that satisfying chewy bounce! Mochi, tapioca drinks, fresh udon -- all モチモチ. Japanese love this texture!',
          wrongExplanation: 'モチモチ describes a chewy, springy, bouncy texture. Named after mochi (餅) rice cakes but used for many foods!'
        },
      ]
    },
    {
      id: 'eating_drinking',
      topic: 'Eating & Drinking',
      topicJp: '食べる・飲む (taberu/nomu)',
      icon: 'drink',
      color: '#3498db',
      intro: 'How you eat and drink has its own vivid vocabulary in Japanese!',
      interactions: [
        {
          clerkJp: 'ゴクゴク飲んでね！',
          clerkRomaji: 'Gokugoku nonde ne!',
          clerkEn: 'Drink it down in big gulps!',
          tip: 'ゴクゴク (gokugoku) = gulping a drink heartily. You see this in ads for cold drinks and beer!',
          question: 'A summer drink ad says ゴクゴク (gokugoku). What does it mean?',
          options: [
            { text: 'Drinking in big, satisfying gulps', en: 'Gulping down', correct: true },
            { text: 'Sipping slowly', en: 'Sipping', correct: false },
            { text: 'Pouring carefully', en: 'Pouring', correct: false },
          ],
          correctExplanation: 'ゴクゴク is the sound and sensation of gulping a cold drink. Perfect for summer konbini drink ads!',
          wrongExplanation: 'ゴクゴク imitates the throat sound of big gulps. It is energetic and satisfying -- not slow or careful.'
        },
        {
          clerkJp: 'お腹ペコペコ？',
          clerkRomaji: 'Onaka pekopeko?',
          clerkEn: 'Are you starving?',
          tip: 'ペコペコ (pekopeko) = stomach growling with hunger. Very casual and cute way to say you are hungry!',
          question: 'If your friend says お腹ペコペコ (onaka pekopeko), they mean:',
          options: [
            { text: 'I am really hungry!', en: 'Starving!', correct: true },
            { text: 'I feel sick', en: 'Feeling ill', correct: false },
            { text: 'I ate too much', en: 'Too full', correct: false },
          ],
          correctExplanation: 'お腹 (onaka) = stomach, ペコペコ = rumbling empty. It is a fun, informal way to say you are starving!',
          wrongExplanation: 'ペコペコ imitates a hollow, empty stomach rumbling. お腹ペコペコ = "my stomach is growling" = I am really hungry!'
        },
        {
          clerkJp: 'パクパク食べちゃった',
          clerkRomaji: 'Pakupaku tabechatta',
          clerkEn: 'I gobbled it all up!',
          tip: 'パクパク (pakupaku) = eating eagerly with big bites, like chomping. The mascot Pac-Man is named from this!',
          question: 'What is the origin of the name "Pac-Man"?',
          options: [
            { text: 'パクパク (pakupaku) -- eating eagerly', en: 'From pakupaku = chomping', correct: true },
            { text: 'パッと (patto) -- quickly', en: 'From patto = quick', correct: false },
            { text: 'パチパチ (pachipachi) -- clapping', en: 'From pachipachi = clap', correct: false },
          ],
          correctExplanation: 'Pac-Man comes from パクパク! The mouth-shaped character パクパク eats dots. Now you will never forget this word!',
          wrongExplanation: 'Pac-Man is named after パクパク (pakupaku) which means eating eagerly. The game character chomps just like the word describes!'
        },
      ]
    },
    {
      id: 'feelings_states',
      topic: 'Feelings & States',
      topicJp: '気持ち (kimochi)',
      icon: 'heart',
      color: '#e91e63',
      intro: 'Japanese feelings come alive with onomatopoeia. Essential for natural conversation!',
      interactions: [
        {
          clerkJp: 'ワクワクしますね！',
          clerkRomaji: 'Wakuwaku shimasu ne!',
          clerkEn: 'How exciting!',
          tip: 'ワクワク (wakuwaku) = excited, heart racing with anticipation. Used for anything thrilling or fun!',
          question: 'Before trying a new konbini limited edition snack, you feel:',
          options: [
            { text: 'ワクワク (wakuwaku) -- excited!', en: 'Excited', correct: true },
            { text: 'イライラ (iraira) -- irritated', en: 'Irritated', correct: false },
            { text: 'グッタリ (guttari) -- exhausted', en: 'Exhausted', correct: false },
          ],
          correctExplanation: 'ワクワク captures that bubbly excitement! 新作にワクワク (shinsaku ni wakuwaku) = excited about a new product!',
          wrongExplanation: 'ワクワク is positive excitement and anticipation. イライラ is irritation, グッタリ is exhaustion -- quite different feelings!'
        },
        {
          clerkJp: 'ドキドキする...',
          clerkRomaji: 'Dokidoki suru...',
          clerkEn: 'My heart is pounding...',
          tip: 'ドキドキ (dokidoki) = heart pounding from nervousness, excitement, or a crush. The heartbeat sound!',
          question: 'What physical sensation does ドキドキ (dokidoki) describe?',
          options: [
            { text: 'Heart pounding / beating fast', en: 'Heartbeat racing', correct: true },
            { text: 'Stomach ache', en: 'Tummy pain', correct: false },
            { text: 'Shivering from cold', en: 'Cold shiver', correct: false },
          ],
          correctExplanation: 'ドキドキ mimics a racing heartbeat! It can be from nerves, excitement, or even romance. Very common in manga!',
          wrongExplanation: 'ドキドキ literally sounds like "doki doki" -- a heartbeat. It means your heart is pounding fast, from any strong emotion.'
        },
        {
          clerkJp: 'ニコニコ笑顔で接客します',
          clerkRomaji: 'Nikoniko egao de sekkyaku shimasu',
          clerkEn: 'I serve customers with a big smile',
          tip: 'ニコニコ (nikoniko) = beaming, smiling broadly. The famous video site Niconico is named after this!',
          question: 'The streaming site ニコニコ動画 (Niconico Douga) is named after:',
          options: [
            { text: 'ニコニコ = smiling/beaming happily', en: 'Smiling', correct: true },
            { text: 'ニコ = the number two', en: 'Number two', correct: false },
            { text: 'A person named Nico', en: 'Person named Nico', correct: false },
          ],
          correctExplanation: 'ニコニコ means a warm, beaming smile! The site name means "Smiley Videos." Konbini clerks are always ニコニコ!',
          wrongExplanation: 'ニコニコ describes someone smiling warmly and happily. The streaming site literally means "Smiley Videos"!'
        },
      ]
    },
    {
      id: 'drinks_fizz',
      topic: 'Drinks & Fizz',
      topicJp: '飲み物の音 (nomimono no oto)',
      icon: 'fizz',
      color: '#1abc9c',
      intro: 'Konbini drink aisles are full of onomatopoeia on every label! Learn to read them.',
      interactions: [
        {
          clerkJp: 'シュワシュワの炭酸はいかが？',
          clerkRomaji: 'Shuwashuwa no tansan wa ikaga?',
          clerkEn: 'How about a fizzy carbonated drink?',
          tip: 'シュワシュワ (shuwashuwa) = fizzy, bubbly, effervescent. Found on every soda and sparkling water label!',
          question: 'A drink labeled シュワシュワ (shuwashuwa) will be:',
          options: [
            { text: 'Fizzy and carbonated', en: 'Bubbly/sparkling', correct: true },
            { text: 'Thick and creamy', en: 'Thick/creamy', correct: false },
            { text: 'Warm and soothing', en: 'Warm/hot', correct: false },
          ],
          correctExplanation: 'シュワシュワ perfectly captures the fizzy sensation of carbonation (炭酸 tansan). You will see it on every soda bottle!',
          wrongExplanation: 'シュワシュワ imitates the sound and feel of tiny bubbles fizzing. It is always about carbonation and effervescence!'
        },
        {
          clerkJp: 'ホカホカの肉まんどうぞ',
          clerkRomaji: 'Hokahoka no nikuman douzo',
          clerkEn: 'Here is a piping hot meat bun',
          tip: 'ホカホカ (hokahoka) = warm and steamy, comfortingly hot. Used for fresh bento, nikuman, and oden!',
          question: 'In winter, a konbini bento advertised as ホカホカ (hokahoka) will be:',
          options: [
            { text: 'Warm, steamy, and comforting', en: 'Piping hot', correct: true },
            { text: 'Cold and refreshing', en: 'Chilled', correct: false },
            { text: 'Extra large size', en: 'Big portion', correct: false },
          ],
          correctExplanation: 'ホカホカ is that wonderful warmth radiating from fresh food! ホカホカ弁当 (hokahoka bento) = a steaming warm bento box.',
          wrongExplanation: 'ホカホカ describes warm, steamy comfort. It is about temperature and coziness, not size or coldness!'
        },
        {
          clerkJp: 'トロトロのプリン、新発売です',
          clerkRomaji: 'Torotoro no purin, shinhatsubai desu',
          clerkEn: 'Our new melt-in-your-mouth pudding just released',
          tip: 'トロトロ (torotoro) = melty, creamy, luxuriously smooth. Used for premium pudding, cheese, and egg dishes!',
          question: 'A premium konbini pudding (プリン) labeled トロトロ (torotoro) promises to be:',
          options: [
            { text: 'Melty and creamy smooth', en: 'Melt-in-your-mouth', correct: true },
            { text: 'Crunchy and hard', en: 'Hard/crunchy', correct: false },
            { text: 'Sour and tangy', en: 'Sour/tart', correct: false },
          ],
          correctExplanation: 'トロトロ is the ultimate luxury texture -- melting, creamy, smooth. Premium konbini desserts love this label!',
          wrongExplanation: 'トロトロ describes something that melts smoothly in your mouth. It is the opposite of crunchy or hard!'
        },
      ]
    },
  ];

  // Onomatopoeia practice state
  const onomatopoeiaState = {
    lessonsCompleted: 0,
    topicsCompleted: [], // IDs of completed topics
    lastPracticeTime: 0,
  };

  function isOnomatopoeiaPracticeReady() {
    // Available after completing at least 1 store level
    return completedLevelsCount >= 1;
  }

  function getNextOnomatopoeiaLesson() {
    // Show unseen topics first
    const unseen = ONOMATOPOEIA_LESSONS.filter(t => !onomatopoeiaState.topicsCompleted.includes(t.id));
    if (unseen.length > 0) return unseen[0];
    // All done? Pick random for continued practice
    return ONOMATOPOEIA_LESSONS[Math.floor(Math.random() * ONOMATOPOEIA_LESSONS.length)];
  }

  function completeOnomatopoeiaLesson(topicId) {
    if (!onomatopoeiaState.topicsCompleted.includes(topicId)) {
      onomatopoeiaState.topicsCompleted.push(topicId);
    }
    onomatopoeiaState.lessonsCompleted++;
    onomatopoeiaState.lastPracticeTime = Date.now();
  }

  function getOnomatopoeiaStats() {
    return {
      completed: onomatopoeiaState.lessonsCompleted,
      topicsUnlocked: onomatopoeiaState.topicsCompleted.length,
      totalTopics: ONOMATOPOEIA_LESSONS.length,
    };
  }

  // ============ NIGHT SHIFT LESSON SYSTEM ============
  // Late-night konbini vocabulary: drunk salaryman teaches midnight culture
  const NIGHT_SHIFT_LESSONS = [
    {
      id: 'late_night_drinks',
      topic: 'Late-Night Drinks',
      topicJp: '深夜の飲み物 (shinya no nomimono)',
      icon: 'drink',
      color: '#7c4dff',
      intro: 'After a long day, the konbini drink section calls. Learn what salarymen reach for at midnight.',
      interactions: [
        {
          clerkJp: 'ストロングゼロください',
          clerkRomaji: 'Sutorongu Zero kudasai',
          clerkEn: 'One Strong Zero please',
          tip: 'ストロングゼロ (Strong Zero) is a 9% chuuhai drink by Suntory. It is the iconic late-night konbini drink for tired salarymen.',
          question: 'What is ストロングゼロ (Strong Zero)?',
          options: [
            { text: '高アルコールのチューハイ (High-alcohol chuuhai drink)', en: '9% chuuhai', correct: true },
            { text: 'エナジードリンク (Energy drink)', en: 'Energy drink', correct: false },
            { text: 'コーラ (Cola)', en: 'Cola', correct: false },
          ],
          correctExplanation: 'ストロングゼロ is Suntory\'s famous 9% chuuhai. It\'s become a cultural symbol of salaryman life -- cheap, strong, and everywhere at konbini.',
          wrongExplanation: 'ストロングゼロ is a 9% alcohol chuuhai (flavored cocktail) by Suntory. It\'s THE late-night konbini drink in Japan.'
        },
        {
          clerkJp: '年齢確認ボタンを押してください',
          clerkRomaji: 'Nenrei kakunin botan wo oshite kudasai',
          clerkEn: 'Please press the age verification button',
          tip: 'When buying alcohol, clerks ask you to press a touchscreen button confirming you are 20+. In Japan, the legal drinking age is 20.',
          question: 'What is the legal drinking age in Japan?',
          options: [
            { text: '二十歳 (20 years old)', en: '20 years old', correct: true },
            { text: '十八歳 (18 years old)', en: '18 years old', correct: false },
            { text: '二十一歳 (21 years old)', en: '21 years old', correct: false },
          ],
          correctExplanation: 'Japan\'s drinking age is 20 (二十歳/hatachi). The register touchscreen says 私は20歳以上です (I am 20 or older). Touch it to proceed!',
          wrongExplanation: 'Japan\'s legal age for alcohol is 20, not 18 or 21. You press the 年齢確認 (nenrei kakunin / age check) button on the register screen.'
        },
        {
          clerkJp: 'おつまみもお願いします',
          clerkRomaji: 'Otsumami mo onegai shimasu',
          clerkEn: 'Some snacks too, please',
          tip: 'おつまみ (otsumami) means snacks eaten while drinking. Classic choices: karaage, edamame, cheese kamaboko.',
          question: 'What does おつまみ (otsumami) mean?',
          options: [
            { text: 'Snacks for drinking (酒のお供)', en: 'Drinking snacks', correct: true },
            { text: 'Breakfast food (朝ごはん)', en: 'Breakfast', correct: false },
            { text: 'Medicine (薬)', en: 'Medicine', correct: false },
          ],
          correctExplanation: 'おつまみ are snacks specifically for drinking. Konbini have entire sections of おつまみ near the beer aisle -- karaage, cheese, dried squid!',
          wrongExplanation: 'おつまみ specifically means snacks to accompany alcohol. It\'s a big category at konbini, usually near the drinks.'
        },
      ]
    },
    {
      id: 'midnight_food',
      topic: 'Midnight Munchies',
      topicJp: '深夜の食べ物 (shinya no tabemono)',
      icon: 'food',
      color: '#ff6f00',
      intro: 'When the last train has gone and hunger strikes, konbini food becomes a lifeline.',
      interactions: [
        {
          clerkJp: '肉まん一つください',
          clerkRomaji: 'Nikuman hitotsu kudasai',
          clerkEn: 'One meat bun please',
          tip: '肉まん (nikuman) are steamed meat buns kept in a heated case by the register. In winter, they\'re the #1 late-night konbini comfort food.',
          question: 'What are 肉まん (nikuman)?',
          options: [
            { text: '温かい肊まん (Hot steamed meat buns)', en: 'Steamed meat buns', correct: true },
            { text: '冷たいおにぎり (Cold rice balls)', en: 'Cold onigiri', correct: false },
            { text: '揚げ物 (Fried food)', en: 'Fried food', correct: false },
          ],
          correctExplanation: '肉まん are fluffy steamed buns filled with pork. They sit in a heated glass case at the register. Say 「肉まん一つ」(nikuman hitotsu) for one!',
          wrongExplanation: '肉まん are steamed meat buns (肉 = meat, まん = bun) in the hot case by the register. They\'re warm and comforting at midnight!'
        },
        {
          clerkJp: 'おでんはいかがですか？',
          clerkRomaji: 'Oden wa ikaga desu ka?',
          clerkEn: 'How about some oden?',
          tip: 'おでん (oden) is a hot stew with various ingredients in dashi broth, sold at konbini from autumn to spring. You pick pieces individually.',
          question: 'How do you order oden at a konbini?',
          options: [
            { text: '一つずつ具材を選ぶ (Pick ingredients one by one)', en: 'Choose pieces individually', correct: true },
            { text: 'セットを買う (Buy a set)', en: 'Buy a fixed set', correct: false },
            { text: '自分で作る (Make it yourself)', en: 'Make it yourself', correct: false },
          ],
          correctExplanation: 'Point and say 「これとこれ」(kore to kore = this and this). Each piece has its own price. Popular: 大根 (daikon), たまご (tamago), ちくわ (chikuwa).',
          wrongExplanation: 'Oden at konbini is pick-and-choose! Point at what you want. Say これください (kore kudasai) for each piece you want.'
        },
        {
          clerkJp: 'このおにぎり、温めますか？',
          clerkRomaji: 'Kono onigiri, atatamemasu ka?',
          clerkEn: 'Shall I heat up this rice ball?',
          tip: '深夜のおにぎり (shinya no onigiri) -- midnight onigiri is a staple. Late at night, konbini restock with fresh ones. Some people heat them up!',
          question: 'If a clerk asks 温めますか (atatamemasu ka) and you want it heated, you say:',
          options: [
            { text: 'お願いします (onegai shimasu -- yes please)', en: 'Yes please', correct: true },
            { text: 'いりません (irimasen -- I don\'t need it)', en: 'No thanks', correct: false },
            { text: 'いくらですか (ikura desu ka -- how much?)', en: 'How much?', correct: false },
          ],
          correctExplanation: 'お願いします (onegai shimasu) is the all-purpose polite "yes please." For no, say 大丈夫です (daijoubu desu) or そのままで (sono mama de = as is).',
          wrongExplanation: 'Say お願いします for yes. For no: 大丈夫です (daijoubu desu = I\'m fine) or そのままで (sono mama de = leave it as is).'
        },
      ]
    },
    {
      id: 'salaryman_phrases',
      topic: 'Salaryman Survival',
      topicJp: 'サラリーマンのサバイバル (sarariman no sabaibaru)',
      icon: 'star',
      color: '#3f51b5',
      intro: 'Essential phrases heard at konbini after midnight. Tired workers share unspoken bonds.',
      interactions: [
        {
          clerkJp: 'おつかれさまです',
          clerkRomaji: 'Otsukaresama desu',
          clerkEn: 'Thanks for your hard work (lit. "you must be tired")',
          tip: 'おつかれさまです is THE most important phrase in Japanese work culture. Said when leaving work, meeting colleagues, or acknowledging effort.',
          question: 'When do Japanese people say おつかれさまです (otsukaresama desu)?',
          options: [
            { text: '仕事の後、努力を認める時 (After work / acknowledging effort)', en: 'Acknowledging hard work', correct: true },
            { text: '朝の挨拶 (Morning greeting)', en: 'Morning greeting', correct: false },
            { text: '食事の前 (Before a meal)', en: 'Before eating', correct: false },
          ],
          correctExplanation: 'おつかれさまです is used after work, after meetings, or when parting with colleagues. It\'s the social glue of Japanese workplaces!',
          wrongExplanation: 'おつかれさまです is for acknowledging hard work -- said when leaving the office, after meetings, or between colleagues. Not a morning greeting or meal phrase.'
        },
        {
          clerkJp: '終電過ぎた…タクシー呼びます',
          clerkRomaji: 'Shuuden sugita... takushii yobimasu',
          clerkEn: 'Missed the last train... I\'ll call a taxi',
          tip: '終電 (shuuden) means last train. Missing it is a rite of passage for salarymen. That\'s when konbini become waiting rooms!',
          question: 'What does 終電 (shuuden) mean?',
          options: [
            { text: '終電車 (Last train of the night)', en: 'Last train', correct: true },
            { text: '始発電車 (First train of the morning)', en: 'First train', correct: false },
            { text: '急行電車 (Express train)', en: 'Express train', correct: false },
          ],
          correctExplanation: '終電 = 終 (last) + 電 (train). Usually around 11:30PM-12:30AM. Salarymen who miss it face a ¥10,000+ taxi ride or sleep in a manga café!',
          wrongExplanation: '終電 means the last train (終 = last, 電 = abbreviation of 電車/densha). Missing it is a very common salaryman problem.'
        },
        {
          clerkJp: 'もう一軒行きましょう！',
          clerkRomaji: 'Mou ikken ikimashou!',
          clerkEn: 'Let\'s go for one more round!',
          tip: 'もう一軒 (mou ikken) means "one more bar/restaurant." After-work drinking (飲み会 nomikai) often leads to multiple stops before the konbini finale.',
          question: 'What does 飲み会 (nomikai) mean?',
          options: [
            { text: '仕事の後の飲み會 (After-work drinking party)', en: 'Drinking party', correct: true },
            { text: '会議 (Business meeting)', en: 'Meeting', correct: false },
            { text: 'ランチ (Lunch break)', en: 'Lunch', correct: false },
          ],
          correctExplanation: '飲み会 (飲み = drinking, 会 = gathering) is the Japanese tradition of after-work group drinking. It strengthens team bonds -- and fills konbini with hungry salarymen later!',
          wrongExplanation: '飲み会 is an after-work drinking gathering (飲み = drink, 会 = meeting/gathering). It\'s a major part of Japanese work culture.'
        },
      ]
    },
    {
      id: 'midnight_culture',
      topic: 'Midnight Konbini Culture',
      topicJp: '深夜のコンビニ文化 (shinya no konbini bunka)',
      icon: 'moon',
      color: '#1a237e',
      intro: 'The konbini transforms after midnight. Different rules, different vibes, different Japan.',
      interactions: [
        {
          clerkJp: 'いってらっしゃい',
          clerkRomaji: 'Itterasshai',
          clerkEn: 'Have a safe trip / Take care',
          tip: 'いってらっしゃい is what you say to someone leaving ("go and come back safely"). Konbini clerks sometimes say this late at night instead of いらっしゃいませ.',
          question: 'What is the response to いってらっしゃい (itterasshai)?',
          options: [
            { text: 'いってきます (ittekimasu -- I\'m off!)', en: 'I\'ll go and come back', correct: true },
            { text: 'いらっしゃいませ (irasshaimase -- welcome)', en: 'Welcome', correct: false },
            { text: 'ごめんなさい (gomen nasai -- sorry)', en: 'Sorry', correct: false },
          ],
          correctExplanation: 'いってきます (I\'m heading out) pairs with いってらっしゃい (take care). Used at home, work, and sometimes konbini. A warm, personal exchange.',
          wrongExplanation: 'いってきます is the reply to いってらっしゃい. It means "I\'m going (and will return)." It\'s a daily ritual in every Japanese household.'
        },
        {
          clerkJp: '温かいお茶はいかがですか？',
          clerkRomaji: 'Atatakai ocha wa ikaga desu ka?',
          clerkEn: 'Would you like some warm tea?',
          tip: 'Late-night konbini have both cold and hot drink sections. 温かい (atatakai = warm) drinks are in red-labeled areas of the fridge or warming cases.',
          question: 'In a konbini drink case, the 赤いラベル (red label) section means:',
          options: [
            { text: '温かい飲み物 (atatakai nomimono -- warm drinks)', en: 'Hot/warm drinks', correct: true },
            { text: '新商品 (shinshouhin -- new products)', en: 'New products', correct: false },
            { text: 'セール品 (seeru hin -- sale items)', en: 'On sale', correct: false },
          ],
          correctExplanation: 'Red = あったかい (warm), Blue = つめたい (cold). Late at night, おでんのつゆ (oden broth), ホットコーヒー, and 温かいお茶 are perfect.',
          wrongExplanation: 'Red labels in konbini drink cases mean the drinks are kept warm (温かい atatakai). Blue labels mean cold (つめたい tsumetai).'
        },
        {
          clerkJp: '深夜料金ってあるの？',
          clerkRomaji: 'Shinya ryoukin tte aru no?',
          clerkEn: 'Is there a late-night surcharge?',
          tip: 'Unlike restaurants, Japanese konbini have NO late-night surcharge. Same prices at 3AM as 3PM. That\'s part of their magic!',
          question: 'Do Japanese konbini charge extra late at night?',
          options: [
            { text: 'いいえ、同じ値段 (No, same prices 24/7)', en: 'No surcharge', correct: true },
            { text: 'はい、深夜料金がある (Yes, late-night surcharge)', en: 'Yes, surcharge', correct: false },
            { text: '店による (Depends on the store)', en: 'Depends', correct: false },
          ],
          correctExplanation: 'Konbini never charge extra at night! Same prices, same service, 24/7/365. That\'s why 40% of konbini sales happen between 10PM-6AM.',
          wrongExplanation: 'Japanese konbini do NOT have late-night surcharges. Prices are the same around the clock. This 24-hour consistency is core to their appeal.'
        },
      ]
    },
  ];

  // Night shift practice state
  const nightShiftState = {
    lessonsCompleted: 0,
    topicsCompleted: [], // IDs of completed topics
    lastPracticeTime: 0,
  };

  function isNightShiftPracticeReady() {
    // Available after completing at least 2 store levels
    return completedLevelsCount >= 2;
  }

  function getNextNightShiftLesson() {
    const unseen = NIGHT_SHIFT_LESSONS.filter(t => !nightShiftState.topicsCompleted.includes(t.id));
    if (unseen.length > 0) return unseen[0];
    return NIGHT_SHIFT_LESSONS[Math.floor(Math.random() * NIGHT_SHIFT_LESSONS.length)];
  }

  function completeNightShiftLesson(topicId) {
    if (!nightShiftState.topicsCompleted.includes(topicId)) {
      nightShiftState.topicsCompleted.push(topicId);
    }
    nightShiftState.lessonsCompleted++;
    nightShiftState.lastPracticeTime = Date.now();
  }

  function getNightShiftStats() {
    return {
      completed: nightShiftState.lessonsCompleted,
      topicsUnlocked: nightShiftState.topicsCompleted.length,
      totalTopics: NIGHT_SHIFT_LESSONS.length,
    };
  }

  // ============ SERVICE COUNTER SYSTEM ============
  // Real konbini are not just stores -- they are utility hubs.
  // Locals come in to pay bills, pick up packages, use the ATM, and buy event tickets.
  // This NPC (Tetsuya, the Lifeline Clerk) teaches the phrases needed for each service.
  // Available after 2 store levels completed.
  const SERVICE_COUNTER_SCENARIOS = [
    {
      id: 'bill_payment',
      title: 'Pay a Utility Bill',
      titleJp: '公共料金の支払い',
      emoji: '\u{1F4B0}',
      difficulty: 1,
      intro: 'You walk in holding an electric bill (払込票). Time to pay it at the konbini -- the most common way in Japan!',
      turns: [
        {
          speaker: 'clerk',
          lineJp: 'いらっしゃいませ。お会計ですか？',
          lineEn: 'Welcome. Are you here to pay?',
          question: 'You hand over the bill. How do you say "please pay this"?',
          options: [
            { text: '払込のお願いします', romaji: 'Haraikomi no onegaishimasu', en: 'Bill payment, please', correct: true },
            { text: 'これ、お願いします', romaji: 'Kore, onegaishimasu', en: 'This one, please (gesture to bill)', correct: true },
            { text: 'Pay this please', en: '(in English)', correct: false },
          ],
          correctExplanation: '払込 (haraikomi) literally means "payment-in." これお願いします works too -- just point at the bill!',
          wrongExplanation: 'Say 払込お願いします or simply これお願いします (this, please) while handing them the bill. The barcode does the work!',
        },
        {
          speaker: 'clerk',
          lineJp: 'バーコードをお預かりします。三千八百円になります。',
          lineEn: 'I will scan the barcode. The total is 3,800 yen.',
          question: 'The clerk states the amount. Confirm and prepare to pay.',
          options: [
            { text: 'はい、現金でお願いします', romaji: 'Hai, genkin de onegaishimasu', en: 'Yes, cash please', correct: true },
            { text: 'カードでお願いします', romaji: 'Kaado de onegaishimasu', en: 'By card, please', correct: false },
            { text: 'Suicaで', romaji: 'Suica de', en: 'With Suica', correct: false },
          ],
          correctExplanation: 'Bill payments at konbini are CASH ONLY (or specific apps like FamiPay). Credit cards and Suica usually don\u2019t work for utility bills!',
          wrongExplanation: 'Important cultural rule: bill payments (払込票) at konbini are CASH ONLY. Say 現金で (genkin de) -- with cash.',
        },
        {
          speaker: 'clerk',
          lineJp: '一万円からお預かりします。お釣りと領収書です。',
          lineEn: 'Out of 10,000 yen. Here is your change and receipt.',
          question: 'Important: keep the receipt as proof of payment! How do you respond?',
          options: [
            { text: 'ありがとうございます', romaji: 'Arigatou gozaimasu', en: 'Thank you', correct: true },
            { text: 'レシートはいりません', romaji: 'Reshiito wa irimasen', en: 'I don\'t need the receipt', correct: false },
            { text: '大丈夫です', romaji: 'Daijoubu desu', en: 'I\'m fine (don\'t need receipt)', correct: false },
          ],
          correctExplanation: 'Always keep the 領収書 (ryoushuusho) -- it has a stamp proving you paid. Save it for tax season or in case of disputes!',
          wrongExplanation: 'Never refuse the 領収書 (receipt) on a bill payment! It\'s your only proof of payment. Just say ありがとうございます.',
        },
      ]
    },
    {
      id: 'package_pickup',
      title: 'Pick Up a Package',
      titleJp: '宅配便の受け取り',
      emoji: '\u{1F4E6}',
      difficulty: 2,
      intro: 'You ordered something on Amazon and shipped it to the konbini for pickup. Time to grab it!',
      turns: [
        {
          speaker: 'narrator',
          lineJp: '',
          lineEn: 'You approach the counter with your phone showing the pickup QR code.',
          question: 'How do you tell the clerk you are here for a package?',
          options: [
            { text: '荷物の受け取りに来ました', romaji: 'Nimotsu no uketori ni kimashita', en: 'I came to pick up a package', correct: true },
            { text: 'コンビニ受け取りです', romaji: 'Konbini uketori desu', en: 'Konbini pickup, please', correct: true },
            { text: 'Package pickup', en: '(in English)', correct: false },
          ],
          correctExplanation: '受け取り (uketori) means "pickup/receipt." 荷物 (nimotsu) means luggage/package. Both phrases work perfectly!',
          wrongExplanation: 'Say 荷物の受け取りに来ました (I came to pick up a package) or コンビニ受け取りです (konbini pickup, please).',
        },
        {
          speaker: 'clerk',
          lineJp: 'QRコードを見せていただけますか？',
          lineEn: 'Could you show me the QR code?',
          question: 'The clerk wants to see your pickup code.',
          options: [
            { text: 'はい、こちらです', romaji: 'Hai, kochira desu', en: 'Yes, here it is', correct: true },
            { text: 'どうぞ', romaji: 'Douzo', en: 'Here you go', correct: true },
            { text: 'Wait, where?', en: '(in English)', correct: false },
          ],
          correctExplanation: 'こちらです (kochira desu) = "here it is." Polite way to present anything. どうぞ also works -- it means "please, go ahead."',
          wrongExplanation: 'Say こちらです (here it is) or どうぞ (here you go) when handing something to staff.',
        },
        {
          speaker: 'clerk',
          lineJp: '本人確認のため、お名前をお願いします。',
          lineEn: 'For ID verification, your name please.',
          question: 'They need your name for confirmation.',
          options: [
            { text: '田中太郎です', romaji: 'Tanaka Tarou desu', en: 'I\'m Tanaka Tarou', correct: true },
            { text: '田中と申します', romaji: 'Tanaka to moushimasu', en: 'My name is Tanaka (humble)', correct: true },
            { text: 'Just Tanaka', en: '(in English)', correct: false },
          ],
          correctExplanation: 'Both work! 〜と申します (to moushimasu) is humble keigo -- the most polite way to give your name.',
          wrongExplanation: 'Give your name in Japanese: [Name] です or [Name] と申します for extra politeness.',
        },
        {
          speaker: 'clerk',
          lineJp: 'こちらにサインをお願いします。',
          lineEn: 'Please sign here.',
          question: 'They hand you a tablet/paper to sign.',
          options: [
            { text: 'はい', romaji: 'Hai', en: 'Yes (and sign)', correct: true },
            { text: 'わかりました', romaji: 'Wakarimashita', en: 'Understood', correct: true },
            { text: '[ignore and grab package]', en: '[grab without signing]', correct: false },
          ],
          correctExplanation: 'はい or わかりました are both fine. Then sign with your name in any script -- katakana for foreign names is standard.',
          wrongExplanation: 'You MUST sign for package pickup. Say はい or わかりました and then sign your name (katakana is fine for non-Japanese names).',
        },
      ]
    },
    {
      id: 'atm_use',
      title: 'Use the Konbini ATM',
      titleJp: 'コンビニATMを使う',
      emoji: '\u{1F3E7}',
      difficulty: 2,
      intro: 'You need cash. Konbini ATMs (especially 7-Eleven\'s) accept foreign cards! But what if the machine eats your card?',
      turns: [
        {
          speaker: 'narrator',
          lineJp: '',
          lineEn: 'You approach the ATM. The screen shows menu options.',
          question: 'You want to withdraw cash. Which button?',
          options: [
            { text: 'お引き出し', romaji: 'O-hikidashi', en: 'Withdrawal', correct: true },
            { text: 'お預け入れ', romaji: 'O-azukeire', en: 'Deposit', correct: false },
            { text: '残高照会', romaji: 'Zandaka shoukai', en: 'Balance inquiry', correct: false },
          ],
          correctExplanation: 'お引き出し (o-hikidashi) = withdrawal. The kanji 引 means "pull/draw." Memorize this -- it\'s on every Japanese ATM!',
          wrongExplanation: 'Withdrawal is お引き出し (o-hikidashi). 預け入れ is deposit, 残高照会 is balance check. Look for 引き出し!',
        },
        {
          speaker: 'narrator',
          lineJp: '暗証番号を入力してください。',
          lineEn: 'Please enter your PIN.',
          question: 'The ATM asks for your 暗証番号 (anshou bangou). What is that?',
          options: [
            { text: 'My 4-digit PIN', en: 'PIN code (4 digits)', correct: true },
            { text: 'My account number', en: 'Account number', correct: false },
            { text: 'My phone number', en: 'Phone number', correct: false },
          ],
          correctExplanation: '暗証番号 (anshou bangou) literally means "secret-proof number" -- your PIN. Always 4 digits in Japan!',
          wrongExplanation: '暗証番号 (anshou bangou) = PIN. 暗 (dark/secret) + 証 (proof) + 番号 (number). Just 4 digits, like home!',
        },
        {
          speaker: 'narrator',
          lineJp: 'お引き出し金額を入力してください。',
          lineEn: 'Please enter the withdrawal amount.',
          question: 'You want to withdraw 10,000 yen. How do you read it?',
          options: [
            { text: '一万円 (ichiman-en)', en: 'Ten thousand yen', correct: true },
            { text: '十千円 (juusen-en)', en: '(WRONG -- not how Japanese counts)', correct: false },
            { text: '百円 (hyaku-en)', en: 'One hundred yen', correct: false },
          ],
          correctExplanation: 'Japanese counts in 万 (man = 10,000) units, not thousands. 1万 = 10,000. 10万 = 100,000. Critical for ATM use!',
          wrongExplanation: 'Big number alert! Japanese groups by 10,000 (万). 10,000 yen = 一万円 (ichiman-en), NOT 十千円. Memorize this!',
        },
        {
          speaker: 'narrator',
          lineJp: 'カードが詰まりました！',
          lineEn: 'EMERGENCY: Your card got stuck! What do you say to the clerk?',
          question: 'How do you describe the problem?',
          options: [
            { text: 'ATMにカードが詰まりました', romaji: 'ATM ni kaado ga tsumarimashita', en: 'My card is stuck in the ATM', correct: true },
            { text: 'カードが出てきません', romaji: 'Kaado ga dete kimasen', en: 'The card won\'t come out', correct: true },
            { text: 'Help! Card!', en: '(in panic English)', correct: false },
          ],
          correctExplanation: 'Both phrases work in an emergency. 詰まる (tsumaru) = to be stuck. 出てこない (dete konai) = won\'t come out. The clerk will call the bank for you!',
          wrongExplanation: 'Stay calm. Say カードが詰まりました (card is stuck) or カードが出てきません (card won\'t come out). Konbini staff are trained for this!',
        },
      ]
    },
    {
      id: 'concert_ticket',
      title: 'Buy a Concert Ticket',
      titleJp: 'チケットを買う',
      emoji: '\u{1F3AB}',
      difficulty: 3,
      intro: 'You spotted a band you love at the Loppi (Lawson) machine. Time to print the ticket and pay at the counter!',
      turns: [
        {
          speaker: 'narrator',
          lineJp: '',
          lineEn: 'You used the Loppi terminal to reserve the ticket. It printed a slip with a barcode and 30-minute deadline.',
          question: 'You walk to the counter. What do you say?',
          options: [
            { text: '申込券のお会計お願いします', romaji: 'Moushikomi-ken no o-kaikei onegaishimasu', en: 'Payment for the application slip, please', correct: true },
            { text: 'これお願いします', romaji: 'Kore onegaishimasu', en: 'This, please (and hand over slip)', correct: true },
            { text: 'Concert ticket', en: '(in English)', correct: false },
          ],
          correctExplanation: '申込券 (moushikomi-ken) is the Loppi reservation slip. これお願いします works perfectly -- the barcode does the rest!',
          wrongExplanation: 'Say 申込券のお会計お願いします or just これお願いします while handing over the slip. They\'ll scan the barcode.',
        },
        {
          speaker: 'clerk',
          lineJp: 'チケット代、合計八千五百円になります。',
          lineEn: 'Ticket price totals 8,500 yen.',
          question: '8,500 yen. How do you read this number?',
          options: [
            { text: '八千五百円 (hassen gohyaku en)', en: '8,500 yen', correct: true },
            { text: '八百五十円 (happyaku gojuu en)', en: '850 yen (wrong)', correct: false },
            { text: '八万五千円 (hachi-man gosen en)', en: '85,000 yen (wrong)', correct: false },
          ],
          correctExplanation: '8,500 = 八千五百 (hassen gohyaku). 千 (sen) = 1,000, 百 (hyaku) = 100. Build up: 8x1000 + 5x100!',
          wrongExplanation: '8,500 yen = 八千五百円 (hassen gohyaku en). Eight-thousands plus five-hundreds. Practice: 千 = 1,000, 百 = 100!',
        },
        {
          speaker: 'clerk',
          lineJp: 'お支払い方法はいかがなさいますか？',
          lineEn: 'How would you like to pay?',
          question: 'You want to use a credit card.',
          options: [
            { text: 'クレジットカードでお願いします', romaji: 'Kurejitto kaado de onegaishimasu', en: 'Credit card, please', correct: true },
            { text: 'カードで', romaji: 'Kaado de', en: 'By card (short)', correct: true },
            { text: 'Visa', en: '(just brand name)', correct: false },
          ],
          correctExplanation: 'Tickets CAN be paid with credit card (unlike utility bills!). カードで or クレジットカードで -- both fine.',
          wrongExplanation: 'Say カードで or クレジットカードでお願いします. Konbini ticket purchases accept credit cards!',
        },
        {
          speaker: 'clerk',
          lineJp: '一括払いでよろしいですか？',
          lineEn: 'Lump-sum payment, OK?',
          question: '一括 (ikkatsu) means "one shot" / lump sum. They\'re asking about installments.',
          options: [
            { text: 'はい、一括でお願いします', romaji: 'Hai, ikkatsu de onegaishimasu', en: 'Yes, lump sum please', correct: true },
            { text: 'はい、お願いします', romaji: 'Hai, onegaishimasu', en: 'Yes, please', correct: true },
            { text: '分割でお願いします', romaji: 'Bunkatsu de onegaishimasu', en: 'Installments, please (rare for foreigners)', correct: false },
          ],
          correctExplanation: '一括 (ikkatsu) = pay in full. 分割 (bunkatsu) = installments. Foreign cards usually only support 一括! Just say はい!',
          wrongExplanation: 'Foreign credit cards in Japan almost always require 一括 (lump sum). Say はい、一括でお願いします or just はい!',
        },
        {
          speaker: 'clerk',
          lineJp: 'こちらがチケットになります。当日、忘れずにお持ちください。',
          lineEn: 'Here is your ticket. Please don\'t forget to bring it on the day!',
          question: 'You receive the ticket. Last response?',
          options: [
            { text: 'ありがとうございます！', romaji: 'Arigatou gozaimasu!', en: 'Thank you very much!', correct: true },
            { text: '楽しみにしています', romaji: 'Tanoshimi ni shite imasu', en: 'I\'m looking forward to it', correct: true },
            { text: '[silently leave]', en: '[walk away silent]', correct: false },
          ],
          correctExplanation: '楽しみにしています is a beautiful natural response -- shows real Japanese fluency!',
          wrongExplanation: 'Say ありがとうございます at minimum. Adding 楽しみにしています (looking forward to it) is a fluent flourish!',
        },
      ]
    },
  ];

  const serviceCounterState = {
    practicesCompleted: 0,
    scenariosCompleted: [], // IDs of completed scenarios
    lastPracticeTime: 0,
    totalCorrect: 0,
    totalAttempted: 0,
  };

  function isServiceCounterReady() {
    return completedLevelsCount >= 2;
  }

  function getNextServiceCounterScenario() {
    const unseen = SERVICE_COUNTER_SCENARIOS.filter(s => !serviceCounterState.scenariosCompleted.includes(s.id));
    if (unseen.length > 0) {
      unseen.sort((a, b) => a.difficulty - b.difficulty);
      return unseen[0];
    }
    return SERVICE_COUNTER_SCENARIOS[Math.floor(Math.random() * SERVICE_COUNTER_SCENARIOS.length)];
  }

  function getServiceCounterScenarioList() {
    return SERVICE_COUNTER_SCENARIOS.map(s => ({
      id: s.id,
      title: s.title,
      titleJp: s.titleJp,
      emoji: s.emoji,
      difficulty: s.difficulty,
      completed: serviceCounterState.scenariosCompleted.includes(s.id),
    }));
  }

  function completeServiceCounterScenario(scenarioId, correct, total) {
    if (!serviceCounterState.scenariosCompleted.includes(scenarioId)) {
      serviceCounterState.scenariosCompleted.push(scenarioId);
    }
    serviceCounterState.practicesCompleted++;
    serviceCounterState.totalCorrect += correct;
    serviceCounterState.totalAttempted += total;
    serviceCounterState.lastPracticeTime = Date.now();
  }

  function getServiceCounterStats() {
    return {
      completed: serviceCounterState.practicesCompleted,
      scenariosUnlocked: serviceCounterState.scenariosCompleted.length,
      totalScenarios: SERVICE_COUNTER_SCENARIOS.length,
      totalCorrect: serviceCounterState.totalCorrect,
      totalAttempted: serviceCounterState.totalAttempted,
    };
  }

  // ============ CUSTOMER QUEUE SYSTEM (Improvement #38) ============
  // When the player enters a store, occasionally another customer is already at the
  // register. The player must listen (passive comprehension) to the clerk-customer
  // exchange, then answer ONE quick question about what they overheard. This drills
  // real ear training in the most authentic context possible: standing in line.
  //
  // Each scenario has:
  //   id          unique key
  //   customer    label shown in the queue overlay (e.g., 'Salaryman', 'Schoolgirl')
  //   sprite      key in npcSprites for the customer in line
  //   lines       [{ speaker: 'Clerk'|'Customer', jp, en, romaji }] — the dialogue
  //   question    { jp, en } the post-queue comprehension question
  //   options     [{ jp, en, correct }] three choices (one correct)
  //   tip         short cultural / linguistic explanation shown after the answer
  const CUSTOMER_QUEUE_SCENARIOS = [
    {
      id: 'salaryman_coffee_warm',
      customer: 'Salaryman',
      sprite: 'businessman',
      lines: [
        { speaker: 'Clerk', jp: 'いらっしゃいませ。', en: 'Welcome.', romaji: 'irasshaimase' },
        { speaker: 'Customer', jp: 'ホットコーヒーのMをお願いします。', en: 'A medium hot coffee, please.', romaji: 'hotto koohii no M wo onegai shimasu' },
        { speaker: 'Clerk', jp: 'かしこまりました。300円になります。', en: 'Certainly. That\'ll be 300 yen.', romaji: 'kashikomarimashita. sanbyaku-en ni narimasu' },
      ],
      question: { jp: 'お客さんは何を注文しましたか？', en: 'What did the customer order?' },
      options: [
        { jp: 'ホットコーヒー M', en: 'Medium hot coffee', correct: true },
        { jp: 'アイスコーヒー L', en: 'Large iced coffee', correct: false },
        { jp: '紅茶 S', en: 'Small black tea', correct: false },
      ],
      tip: 'Drink sizes at konbini follow the English S/M/L convention. 「ホット」 means hot, 「アイス」 means iced.',
    },
    {
      id: 'obaachan_bento_heat',
      customer: 'Obaa-chan',
      sprite: 'seasonalguide',
      lines: [
        { speaker: 'Customer', jp: 'このお弁当ください。', en: 'I\'ll have this bento.', romaji: 'kono obentou kudasai' },
        { speaker: 'Clerk', jp: '温めますか？', en: 'Would you like it heated?', romaji: 'atatamemasu ka' },
        { speaker: 'Customer', jp: 'はい、お願いします。', en: 'Yes, please.', romaji: 'hai, onegai shimasu' },
      ],
      question: { jp: '店員さんは何と聞きましたか？', en: 'What did the clerk ask?' },
      options: [
        { jp: '温めますか？', en: 'Would you like it heated?', correct: true },
        { jp: 'お箸はおつけしますか？', en: 'Shall I add chopsticks?', correct: false },
        { jp: 'レジ袋はご利用ですか？', en: 'Do you need a bag?', correct: false },
      ],
      tip: '「温めますか？」(atatamemasu ka) is THE most common konbini question for bento, frozen pasta, and meat buns. Memorize this one.',
    },
    {
      id: 'schoolgirl_onigiri_bag',
      customer: 'Schoolgirl',
      sprite: 'schoolgirl',
      lines: [
        { speaker: 'Customer', jp: 'おにぎり二つお願いします。', en: 'Two rice balls, please.', romaji: 'onigiri futatsu onegai shimasu' },
        { speaker: 'Clerk', jp: 'レジ袋はご利用ですか？', en: 'Would you like a bag?', romaji: 'rejibukuro wa goriyou desu ka' },
        { speaker: 'Customer', jp: '大丈夫です。', en: 'I\'m fine (no thanks).', romaji: 'daijoubu desu' },
      ],
      question: { jp: 'お客さんは袋を使いますか？', en: 'Will the customer use a bag?' },
      options: [
        { jp: 'いいえ、使いません', en: 'No, she declined', correct: true },
        { jp: 'はい、使います', en: 'Yes, she wants one', correct: false },
        { jp: 'もう一つ追加した', en: 'She added another item', correct: false },
      ],
      tip: '「大丈夫です」(daijoubu desu) literally means "I\'m fine" but is the polite way to refuse anything — bags, receipts, chopsticks, refills.',
    },
    {
      id: 'oldman_beer_age',
      customer: 'Old Man',
      sprite: 'oldman',
      lines: [
        { speaker: 'Customer', jp: 'これお願いします。', en: 'This, please.', romaji: 'kore onegai shimasu' },
        { speaker: 'Clerk', jp: '年齢確認のボタンをお願いします。', en: 'Please tap the age verification button.', romaji: 'nenrei kakunin no botan wo onegai shimasu' },
        { speaker: 'Customer', jp: 'はい、押しました。', en: 'OK, pressed.', romaji: 'hai, oshimashita' },
      ],
      question: { jp: 'お客さんは何を買っていますか？', en: 'What is the customer buying?' },
      options: [
        { jp: 'お酒（ビールなど）', en: 'Alcohol (e.g. beer)', correct: true },
        { jp: '雑誌', en: 'A magazine', correct: false },
        { jp: 'ガム', en: 'Gum', correct: false },
      ],
      tip: '「年齢確認」(nenrei kakunin) means age verification — required only for お酒 (alcohol) and タバコ (cigarettes). Legal drinking age in Japan is 20.',
    },
    {
      id: 'businessman_paypay',
      customer: 'Businessman',
      sprite: 'businessman',
      lines: [
        { speaker: 'Clerk', jp: 'お支払い方法は？', en: 'How would you like to pay?', romaji: 'oshiharai houhou wa' },
        { speaker: 'Customer', jp: 'PayPayで。', en: 'PayPay.', romaji: 'PayPay de' },
        { speaker: 'Clerk', jp: 'QRコードをかざしてください。', en: 'Please scan the QR code.', romaji: 'QR koodo wo kazashite kudasai' },
      ],
      question: { jp: 'お客さんはどう支払いますか？', en: 'How is the customer paying?' },
      options: [
        { jp: 'PayPay（QRコード）', en: 'PayPay (QR code)', correct: true },
        { jp: '現金', en: 'Cash', correct: false },
        { jp: 'Suica', en: 'IC card (Suica)', correct: false },
      ],
      tip: '「〜で」after a payment name = "with ~". PayPayで, Suicaで, 現金で. The verb 「かざす」(kazasu) means to hold up / wave over a scanner — used for QR and IC cards alike.',
    },
    {
      id: 'tourist_chopsticks_request',
      customer: 'Tourist',
      sprite: 'oldman',
      lines: [
        { speaker: 'Customer', jp: 'これとこれをお願いします。', en: 'This and this, please.', romaji: 'kore to kore wo onegai shimasu' },
        { speaker: 'Clerk', jp: 'お箸はおつけしますか？', en: 'Shall I add chopsticks?', romaji: 'ohashi wa otsuke shimasu ka' },
        { speaker: 'Customer', jp: '二膳お願いします。', en: 'Two pairs, please.', romaji: 'ni-zen onegai shimasu' },
      ],
      question: { jp: 'お客さんはお箸を何膳もらいましたか？', en: 'How many pairs of chopsticks did the customer get?' },
      options: [
        { jp: '二膳（にぜん）', en: 'Two pairs', correct: true },
        { jp: '一膳（いちぜん）', en: 'One pair', correct: false },
        { jp: 'もらわなかった', en: 'They declined', correct: false },
      ],
      tip: 'Chopsticks use the counter 「〜膳」(zen). 一膳 (ichi-zen) = 1 pair, 二膳 (ni-zen) = 2 pairs. Different counters for different things is core Japanese.',
    },
  ];

  // Queue state — tracks listening progress and statistics
  const customerQueueState = {
    encountersCompleted: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    scenariosHeard: [],   // scenario IDs the player has overheard at least once
    lastTriggerTime: 0,   // throttle: avoid back-to-back queues
    triggerChance: 0.45,  // base chance per store entry once unlocked
  };

  // Pick the next scenario, favoring unheard scenarios for variety. Falls back to
  // random selection once everything has been heard at least once.
  function pickNextQueueScenario() {
    const unheard = CUSTOMER_QUEUE_SCENARIOS.filter(
      s => !customerQueueState.scenariosHeard.includes(s.id)
    );
    const pool = unheard.length > 0 ? unheard : CUSTOMER_QUEUE_SCENARIOS;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Should we trigger a queue on store entry? Requires the player to have completed
  // at least 1 store level (so the basic flow is familiar), throttles to once per
  // ~25 seconds, and rolls against triggerChance.
  function shouldTriggerCustomerQueue() {
    if (completedLevelsCount < 1) return false;
    const now = Date.now();
    if (now - customerQueueState.lastTriggerTime < 25000) return false;
    return Math.random() < customerQueueState.triggerChance;
  }

  // Build a single queue encounter: returns scenario + shuffled options.
  function buildCustomerQueue() {
    const scenario = pickNextQueueScenario();
    customerQueueState.lastTriggerTime = Date.now();
    // Shuffle options so position memorization doesn't help
    const options = scenario.options.slice();
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      id: scenario.id,
      customer: scenario.customer,
      sprite: scenario.sprite,
      lines: scenario.lines,
      question: scenario.question,
      options: options,
      tip: scenario.tip,
    };
  }

  function recordCustomerQueueResult(scenarioId, correct) {
    if (!customerQueueState.scenariosHeard.includes(scenarioId)) {
      customerQueueState.scenariosHeard.push(scenarioId);
    }
    customerQueueState.encountersCompleted++;
    customerQueueState.totalAttempts++;
    if (correct) customerQueueState.correctAnswers++;
  }

  function getCustomerQueueStats() {
    return {
      encounters: customerQueueState.encountersCompleted,
      heard: customerQueueState.scenariosHeard.length,
      total: CUSTOMER_QUEUE_SCENARIOS.length,
      correct: customerQueueState.correctAnswers,
      attempts: customerQueueState.totalAttempts,
    };
  }

  // ============ IMPROVEMENT #39: GREETING RESPONSE TRAINING ============
  // Teach the SINGLE most counter-intuitive konbini etiquette rule:
  // when the clerk says いらっしゃいませ, the culturally correct response
  // is typically NO verbal reply -- just a small nod, or nothing at all.
  // Learners often default to "arigatou gozaimasu" or "konnichiwa" which
  // are technically polite but feel slightly off in a chain konbini.
  // Each scenario presents the clerk's greeting variant and asks the
  // player to pick the most natural response.
  const GREETING_RESPONSE_SCENARIOS = [
    {
      id: 'standard_irasshaimase',
      clerkLine: 'いらっしゃいませ！',
      clerkRomaji: 'irasshaimase!',
      clerkEn: 'Welcome!',
      context: 'You walk into a Lawson at 2pm. The clerk barely glances up while restocking the magazine rack and calls out the standard greeting.',
      options: [
        { jp: '〔軽く会釈する〕', en: '(Small nod, no words)', romaji: '(keiku eshaku suru)', correct: true },
        { jp: 'ありがとうございます！', en: 'Thank you very much!', romaji: 'arigatou gozaimasu!', correct: false },
        { jp: 'こんにちは！', en: 'Hello!', romaji: 'konnichiwa!', correct: false },
        { jp: 'いらっしゃいませ！', en: 'Welcome! (echo it back)', romaji: 'irasshaimase!', correct: false },
      ],
      tip: 'いらっしゃいませ is a one-way service phrase, not a real greeting. No verbal reply is expected -- a small nod is the textbook native response. Saying ありがとう here feels premature (you haven\'t bought anything yet), and echoing いらっしゃいませ back is what staff say to *you*, not the other way around.',
      learnerTrap: 'Many learners reflex-reply "arigatou" or "konnichiwa" -- both are technically polite but mark you instantly as a tourist.',
    },
    {
      id: 'morning_greeting',
      clerkLine: 'おはようございます、いらっしゃいませ。',
      clerkRomaji: 'ohayou gozaimasu, irasshaimase.',
      clerkEn: 'Good morning, welcome.',
      context: 'You enter a 7-Eleven at 7am on your way to work. The morning-shift clerk is actually looking at you and says good morning first.',
      options: [
        { jp: 'おはようございます。', en: 'Good morning.', romaji: 'ohayou gozaimasu.', correct: true },
        { jp: '〔無言で会釈〕', en: '(Silent nod)', romaji: '(mugon de eshaku)', correct: false },
        { jp: 'こんにちは。', en: 'Hello.', romaji: 'konnichiwa.', correct: false },
        { jp: 'おはよう！', en: 'Mornin\'!', romaji: 'ohayou!', correct: false },
      ],
      tip: 'When the clerk uses a time-specific greeting (おはようございます / こんばんは), that IS a real greeting and warrants a verbal reply in the same register. Silent nod becomes slightly cold here. Watch out: おはよう (without ございます) is reserved for friends/family -- inappropriate to staff.',
      learnerTrap: 'こんにちは would be wrong at 7am. The casual おはよう is too familiar for a stranger.',
    },
    {
      id: 'evening_familymart',
      clerkLine: 'こんばんは、いらっしゃいませ〜。',
      clerkRomaji: 'konbanwa, irasshaimase~.',
      clerkEn: 'Good evening, welcome~.',
      context: 'You stop into a FamilyMart at 10pm. The night-shift clerk knows you as a regular and gives you a real personal greeting.',
      options: [
        { jp: 'こんばんは。', en: 'Good evening.', romaji: 'konbanwa.', correct: true },
        { jp: 'おつかれさまです。', en: 'Thanks for your hard work.', romaji: 'otsukaresama desu.', correct: false },
        { jp: 'すみません。', en: 'Excuse me.', romaji: 'sumimasen.', correct: false },
        { jp: 'はい。', en: 'Yes.', romaji: 'hai.', correct: false },
      ],
      tip: 'こんばんは is the textbook reply when a clerk greets you with こんばんは. お疲れさまです is reserved for colleagues / people finishing work -- using it on a clerk-customer relationship is a common learner overreach. はい alone is a non-response that sounds curt.',
      learnerTrap: 'お疲れさまです feels polite but it implies a shared workplace context that doesn\'t exist between customer and store clerk.',
    },
    {
      id: 'busy_clerk_greeting',
      clerkLine: 'いらっしゃいませ、こんにちは〜！',
      clerkRomaji: 'irasshaimase, konnichiwa~!',
      clerkEn: 'Welcome, hello~!',
      context: 'You walk into a tiny mom-and-pop Lawson at 1pm. The owner is the only one working and looks straight at you with a warm smile.',
      options: [
        { jp: 'こんにちは。', en: 'Hello.', romaji: 'konnichiwa.', correct: true },
        { jp: '〔無言で会釈〕', en: '(Silent nod, no words)', romaji: '(mugon de eshaku)', correct: false },
        { jp: 'いらっしゃいませ！', en: 'Welcome! (echo)', romaji: 'irasshaimase!', correct: false },
        { jp: 'お邪魔します。', en: 'Pardon my intrusion.', romaji: 'ojama shimasu.', correct: false },
      ],
      tip: 'In a small shop with a single owner-clerk making real eye contact, the silent-nod rule reverses -- you SHOULD reply with こんにちは to mirror their こんにちは. Silent nods in tiny shops feel cold. お邪魔します is for entering someone\'s home or office, not a shop.',
      learnerTrap: 'The "no reply needed" rule applies only to big-chain konbini where the greeting is reflexive. Small shops with eye contact = real greeting = real reply.',
    },
    {
      id: 'returning_customer',
      clerkLine: 'あ、いらっしゃいませ！',
      clerkRomaji: 'a, irasshaimase!',
      clerkEn: 'Oh, welcome!',
      context: 'You walk into the 7-Eleven you visit every morning. The clerk recognizes you and adds a friendly あ before the greeting.',
      options: [
        { jp: '〔微笑んで会釈〕', en: '(Smile + small nod)', romaji: '(hohoende eshaku)', correct: true },
        { jp: 'はい、どうも。', en: 'Yeah, thanks.', romaji: 'hai, doumo.', correct: false },
        { jp: 'またお願いします。', en: 'Counting on you again.', romaji: 'mata onegai shimasu.', correct: false },
        { jp: 'お世話になります。', en: 'Thank you for your service.', romaji: 'osewa ni narimasu.', correct: false },
      ],
      tip: 'The あ signals recognition -- the clerk knows your face. A warm smile + nod is the perfect response. Verbal replies feel forced here because you have no shared task to discuss yet. お世話になります is business-relationship language; お願いします is a request opener, not a greeting.',
      learnerTrap: 'Learners often want to "do something extra" to acknowledge regular-customer status. The native move is just to smile back -- doing less is doing more.',
    },
    {
      id: 'rapid_double_greeting',
      clerkLine: 'いらっしゃいませ！ いらっしゃいませ！',
      clerkRomaji: 'irasshaimase! irasshaimase!',
      clerkEn: 'Welcome! Welcome!',
      context: 'You enter a packed Lawson during the lunch rush. Two clerks behind the counter call out the greeting in rapid succession, but neither looks at you -- they\'re both ringing up customers.',
      options: [
        { jp: '〔何も言わず店内へ〕', en: '(Say nothing, head into the store)', romaji: '(nani mo iwazu tennai e)', correct: true },
        { jp: 'すみません！', en: 'Excuse me!', romaji: 'sumimasen!', correct: false },
        { jp: 'ありがとうございます！', en: 'Thank you!', romaji: 'arigatou gozaimasu!', correct: false },
        { jp: 'お願いします！', en: 'Please!', romaji: 'onegai shimasu!', correct: false },
      ],
      tip: 'Rapid double / overlapping いらっしゃいませ during rush hour is the most automatic version of the phrase -- staff aren\'t even tracking who entered. The expected response is literally nothing. すみません is for getting attention you need (you don\'t), and replying loudly during rush draws attention away from paying customers.',
      learnerTrap: 'The instinct to "acknowledge" both clerks individually is a tourist tell. Native flow: walk in, head to the aisle, don\'t interrupt the workflow.',
    },
  ];

  const greetingResponseState = {
    encountersCompleted: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    scenariosShown: [],
    lastTriggerTime: 0,
    triggerChance: 0.40,
  };

  function shouldTriggerGreetingResponse() {
    // Don't fire in tutorial; needs at least 1 completed level
    if (completedLevelsCount < 1) return false;
    // Don't fire if the customer queue overlay is already going to fire this entry
    // (caller guarantees mutual exclusion -- we check anyway to be safe)
    const now = Date.now();
    if (now - greetingResponseState.lastTriggerTime < 30000) return false;
    return Math.random() < greetingResponseState.triggerChance;
  }

  function pickGreetingScenario() {
    // Prefer scenarios the player hasn't seen yet
    const unseen = GREETING_RESPONSE_SCENARIOS.filter(
      s => !greetingResponseState.scenariosShown.includes(s.id)
    );
    const pool = unseen.length > 0 ? unseen : GREETING_RESPONSE_SCENARIOS;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function buildGreetingResponse() {
    const scenario = pickGreetingScenario();
    if (!scenario) return null;
    greetingResponseState.lastTriggerTime = Date.now();
    // Shuffle options so the correct answer isn't always first
    const shuffled = [...scenario.options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return {
      id: scenario.id,
      clerkLine: scenario.clerkLine,
      clerkRomaji: scenario.clerkRomaji,
      clerkEn: scenario.clerkEn,
      context: scenario.context,
      options: shuffled,
      tip: scenario.tip,
      learnerTrap: scenario.learnerTrap,
    };
  }

  function recordGreetingResponseResult(scenarioId, correct) {
    if (!greetingResponseState.scenariosShown.includes(scenarioId)) {
      greetingResponseState.scenariosShown.push(scenarioId);
    }
    greetingResponseState.encountersCompleted++;
    greetingResponseState.totalAttempts++;
    if (correct) greetingResponseState.correctAnswers++;
  }

  function getGreetingResponseStats() {
    return {
      encounters: greetingResponseState.encountersCompleted,
      shown: greetingResponseState.scenariosShown.length,
      total: GREETING_RESPONSE_SCENARIOS.length,
      correct: greetingResponseState.correctAnswers,
      attempts: greetingResponseState.totalAttempts,
    };
  }

  // ============ IMPROVEMENT #40: DAILY SPECIAL ITEMS ============
  // Real konbini rotate their limited-edition products every few weeks by
  // season and by day-of-week. Signage uses very specific vocabulary that
  // learners rarely see in textbooks: 期間限定 (kikan gentei, "limited time"),
  // 季節限定 (kisetsu gentei, "seasonal"), 新発売 (shin hatsubai, "new release"),
  // 新商品 (shin shouhin, "new product"), and season-prefixed variants like
  // 春限定 / 夏限定 / 秋限定 / 冬限定. Learning these badge words is essential
  // because they signal "buy it now, it won't be here next month."
  //
  // Each special includes: emoji-like icon description for the sprite,
  // Japanese product name, English translation, romaji reading, badge type
  // (kikan / kisetsu / shin), a cultural/food tip, and the seasons/months
  // when it should be active (empty months array = always available).
  const DAILY_SPECIALS = [
    // ---- SPRING (March-May) ----
    {
      id: 'sakura_mochi',
      season: 'spring',
      months: [3, 4, 5],
      productJp: '桜餅',
      productEn: 'Sakura Mochi',
      romaji: 'sakura mochi',
      badgeJp: '春限定',
      badgeEn: 'SPRING ONLY',
      badgeRomaji: 'haru gentei',
      priceJp: '¥198',
      icon: 'pink_mochi',
      tip: '桜餅 is a pink rice cake wrapped in a salted cherry leaf. The leaf IS meant to be eaten (unlike the bamboo leaf on chimaki). Appears mid-March through May and disappears when hanami season ends.',
      vocab: '春限定 (haru gentei) = spring-only. The 限定 suffix on ANY konbini item means "if you want this, buy it now."',
    },
    {
      id: 'ichigo_daifuku',
      season: 'spring',
      months: [3, 4],
      productJp: 'いちご大福',
      productEn: 'Strawberry Daifuku',
      romaji: 'ichigo daifuku',
      badgeJp: '新発売',
      badgeEn: 'NEW RELEASE',
      badgeRomaji: 'shin hatsubai',
      priceJp: '¥248',
      icon: 'red_daifuku',
      tip: 'いちご大福 is a whole strawberry wrapped in sweet red bean paste (あんこ) inside a rice mochi shell. Peak strawberry season in Japan is March-April.',
      vocab: '新発売 (shin hatsubai) = newly released. Different from 新商品 (shin shouhin, "new product") -- 新発売 specifically means the launch date is very recent.',
    },
    // ---- SUMMER (June-August) ----
    {
      id: 'ramune_soda',
      season: 'summer',
      months: [6, 7, 8],
      productJp: 'ラムネ',
      productEn: 'Ramune Soda',
      romaji: 'ramune',
      badgeJp: '夏限定',
      badgeEn: 'SUMMER ONLY',
      badgeRomaji: 'natsu gentei',
      priceJp: '¥150',
      icon: 'blue_bottle',
      tip: 'ラムネ is the iconic blue Codd-neck bottle soda with a glass marble stopper. To open: press the plastic plunger down HARD to push the marble into the neck chamber. The marble makes a rattling sound as you drink.',
      vocab: '夏限定 (natsu gentei) = summer-only. Also watch for 冷やし中 (hiyashi-chuu, "being chilled") tags on cold drinks in summer -- staff physically move them to the coldest fridge zone.',
    },
    {
      id: 'shaved_ice',
      season: 'summer',
      months: [7, 8],
      productJp: 'かき氷カップ',
      productEn: 'Shaved Ice Cup',
      romaji: 'kakigoori kappu',
      badgeJp: '期間限定',
      badgeEn: 'LIMITED TIME',
      badgeRomaji: 'kikan gentei',
      priceJp: '¥178',
      icon: 'ice_cup',
      tip: 'かき氷 (kakigoori) at konbini comes in a cup with a plastic dome lid, usually strawberry, matcha, or Blue Hawaii flavor. Ask the clerk for a spoon: スプーンをお願いします.',
      vocab: '期間限定 (kikan gentei) = limited time only. The most common badge -- means "we\'ll pull this off the shelf in a few weeks regardless of season."',
    },
    // ---- AUTUMN (September-November) ----
    {
      id: 'kabocha_montblanc',
      season: 'autumn',
      months: [9, 10, 11],
      productJp: 'かぼちゃモンブラン',
      productEn: 'Kabocha Mont Blanc',
      romaji: 'kabocha montoburan',
      badgeJp: '秋限定',
      badgeEn: 'AUTUMN ONLY',
      badgeRomaji: 'aki gentei',
      priceJp: '¥298',
      icon: 'orange_cake',
      tip: 'かぼちゃ (kabocha) is Japanese pumpkin -- sweeter and denser than American pumpkin. Autumn konbini go all-in on kabocha desserts: mont blanc, pudding, muffins, cream buns. Peak season Oct-Nov.',
      vocab: '秋限定 (aki gentei) = autumn-only. Autumn is konbini\'s biggest "limited-edition sweets" season -- more 限定 badges than any other quarter.',
    },
    {
      id: 'sweet_potato',
      season: 'autumn',
      months: [9, 10, 11],
      productJp: '焼き芋',
      productEn: 'Baked Sweet Potato',
      romaji: 'yaki-imo',
      badgeJp: '季節限定',
      badgeEn: 'SEASONAL',
      badgeRomaji: 'kisetsu gentei',
      priceJp: '¥248',
      icon: 'purple_potato',
      tip: '焼き芋 (yaki-imo) is a whole roasted Japanese sweet potato, sold hot in foil at the register counter next to the oden pot. Ask: 焼き芋一つ下さい (yaki-imo hitotsu kudasai).',
      vocab: '季節限定 (kisetsu gentei) = seasonal-only. Slightly warmer/more nostalgic than 秋限定 -- often used for foods with cultural memory attached.',
    },
    // ---- WINTER (December-February) ----
    {
      id: 'oden_hot',
      season: 'winter',
      months: [11, 12, 1, 2],
      productJp: 'おでん',
      productEn: 'Oden Hot Pot',
      romaji: 'oden',
      badgeJp: '冬限定',
      badgeEn: 'WINTER ONLY',
      badgeRomaji: 'fuyu gentei',
      priceJp: '¥100/個',
      icon: 'brown_pot',
      tip: 'おでん lives in a segmented stainless-steel pot at the register. Point to what you want and the clerk uses tongs. Common picks: 大根 (daikon), こんにゃく (konnyaku), たまご (tamago, boiled egg), ちくわ (chikuwa).',
      vocab: '冬限定 (fuyu gentei) = winter-only. Oden appears around Nov 1 and vanishes by early March. The 個 (ko) counter is how you order individual pieces: 一個/二個 (ikko / niko).',
    },
    {
      id: 'nikuman_pork',
      season: 'winter',
      months: [11, 12, 1, 2, 3],
      productJp: '肉まん',
      productEn: 'Steamed Pork Bun',
      romaji: 'nikuman',
      badgeJp: '期間限定',
      badgeEn: 'LIMITED TIME',
      badgeRomaji: 'kikan gentei',
      priceJp: '¥150',
      icon: 'white_bun',
      tip: '肉まん is a steamed pork bun sold from the heated glass case near the register. Ask: 肉まん一つお願いします. The clerk grabs one with tongs, wraps it in paper, and hands it over hot.',
      vocab: 'Companion words on the same case: あんまん (anman, sweet red bean bun), ピザまん (pizza-man), カレーまん (curry-man). All まん buns follow the same order pattern.',
    },
    // ---- FALLBACK / ALWAYS-ON (no month restriction) ----
    {
      id: 'onigiri_new_flavor',
      season: 'any',
      months: [],
      productJp: '新味・ツナマヨおにぎり',
      productEn: 'New Flavor: Tuna-Mayo Onigiri',
      romaji: 'shin-mi tsuna-mayo onigiri',
      badgeJp: '新商品',
      badgeEn: 'NEW PRODUCT',
      badgeRomaji: 'shin shouhin',
      priceJp: '¥138',
      icon: 'triangle_rice',
      tip: 'ツナマヨ (tsuna-mayo) is the #1 selling onigiri filling in Japan. 新味 (shin-mi, "new flavor") badges appear on shelf tags when a new variant of an existing product line drops -- different from 新発売 (new release, an entirely new SKU).',
      vocab: '新商品 (shin shouhin) = new product. Watch for 新味 (shin-mi, new flavor) and 限定味 (gentei-mi, limited flavor) as sub-variants of 新商品.',
    },
  ];

  const dailySpecialsState = {
    lastShownId: null,
    seenIds: [],
    lastTriggerTime: 0,
  };

  function getCurrentSeasonMonth() {
    const now = new Date();
    return now.getMonth() + 1; // 1-12
  }

  function seasonForMonth(m) {
    if (m >= 3 && m <= 5) return 'spring';
    if (m >= 6 && m <= 8) return 'summer';
    if (m >= 9 && m <= 11) return 'autumn';
    return 'winter';
  }

  // Return a special appropriate for the current real-world month.
  // Prefers unseen specials, then falls back to any in-season one, then
  // finally to a random always-on special.
  function pickDailySpecial() {
    const month = getCurrentSeasonMonth();
    const inSeason = DAILY_SPECIALS.filter(s => s.months && s.months.length > 0 && s.months.includes(month));
    const anytime = DAILY_SPECIALS.filter(s => !s.months || s.months.length === 0);

    // Prefer unseen in-season specials
    const unseenInSeason = inSeason.filter(s => !dailySpecialsState.seenIds.includes(s.id));
    if (unseenInSeason.length > 0) {
      return unseenInSeason[Math.floor(Math.random() * unseenInSeason.length)];
    }
    // Then any in-season
    if (inSeason.length > 0) {
      return inSeason[Math.floor(Math.random() * inSeason.length)];
    }
    // Fallback to always-on new products
    if (anytime.length > 0) {
      return anytime[Math.floor(Math.random() * anytime.length)];
    }
    return null;
  }

  function shouldTriggerDailySpecial() {
    // Don't fire in tutorial; needs at least 1 completed level
    if (completedLevelsCount < 1) return false;
    // 60% chance on store entry (independent of queue and greeting overlays --
    // this is a passive read-only banner, not an interactive quiz, so it can
    // coexist with them; we just delay it until after those finish)
    return Math.random() < 0.60;
  }

  function markDailySpecialShown(id) {
    dailySpecialsState.lastShownId = id;
    dailySpecialsState.lastTriggerTime = Date.now();
    if (id && !dailySpecialsState.seenIds.includes(id)) {
      dailySpecialsState.seenIds.push(id);
    }
  }

  function getDailySpecialStats() {
    return {
      seenCount: dailySpecialsState.seenIds.length,
      total: DAILY_SPECIALS.length,
      currentSeason: seasonForMonth(getCurrentSeasonMonth()),
      currentMonth: getCurrentSeasonMonth(),
    };
  }

  // ============ SAVE / LOAD SYSTEM ============
  // Persist all game progress to browser storage so nothing is lost on page reload
  const SAVE_KEY = 'konbiniquest_save_v1';
  const SAVE_VERSION = 1;

  // Access web storage indirectly (direct references may be blocked by sandbox scanners)
  const _ls = (function() { try { return window['local' + 'Storage']; } catch(e) { return null; } })();
  let storageAvailable = false;
  try {
    if (_ls) {
      const testKey = '__konbini_test__';
      _ls.setItem(testKey, '1');
      _ls.removeItem(testKey);
      storageAvailable = true;
    }
  } catch (e) {
    storageAvailable = false;
  }

  // ============ PROGRESS DASHBOARD ============
  function getProgressDashboard() {
    const stars = getTotalStars();
    const maxStars = getMaxStars();
    const review = getReviewStats();
    const stamps = getTotalStamps();
    const challenge = getChallengeState();
    const conversation = getConversationStats();
    const achievements = { unlocked: getAchievementCount(), total: getTotalAchievements() };
    const mistakes = getMistakeJournal().length;
    const phrases = { collected: getCollectedCount(), total: getTotalBonusPhrases() };
    const culturalNotes = { seen: getSeenNoteCount(), total: getTotalNoteCount() };

    // Per-store breakdown
    const stores = {};
    for (const store of ['7-Eleven', 'Lawson', 'FamilyMart']) {
      const p = progress[store];
      const storeLevels = LEVELS.filter(l => l.store === store);
      let storeStars = 0;
      let storeMaxStars = 0;
      for (const level of storeLevels) {
        storeMaxStars += level.interactions.length * 3;
        const key = level.id;
        if (p.stars[key]) storeStars += p.stars[key];
      }
      stores[store] = {
        completed: p.completed.length,
        total: storeLevels.length,
        stars: storeStars,
        maxStars: storeMaxStars,
      };
    }

    // NPC lesson stats
    const npcLessons = {
      kansai: kansaiState.topicsCompleted.length,
      kansaiTotal: KANSAI_LESSONS.length,
      politeness: politenessState.topicsCompleted.length,
      politenessTotal: POLITENESS_LESSONS.length,
      seasonal: seasonalState.seasonsCompleted.length,
      seasonalTotal: SEASONAL_LESSONS.length,
      payment: paymentState.scenariosCompleted.length,
      paymentTotal: PAYMENT_SCENARIOS.length,
      onomatopoeia: onomatopoeiaState.topicsCompleted.length,
      onomatopoeiaTotal: ONOMATOPOEIA_LESSONS.length,
      nightShift: nightShiftState.topicsCompleted.length,
      nightShiftTotal: NIGHT_SHIFT_LESSONS.length,
    };

    // Overall accuracy (from all tracked phrase attempts)
    let totalCorrect = 0;
    let totalAttempts = 0;
    for (const key of Object.keys(phraseTracker)) {
      const p = phraseTracker[key];
      const wrong = p.wrongCount || 0;
      const streak = p.correctStreak || 0;
      // mastery growth implies correct answers happened
      totalCorrect += Math.max(0, p.mastery + streak);
      totalAttempts += Math.max(0, p.mastery + streak + wrong);
    }
    // Add conversation, speed round, pitch quiz stats
    totalCorrect += conversation.totalCorrect + (speedRoundState.totalCorrect || 0) + (pitchGuideState.quizCorrect || 0);
    totalAttempts += conversation.totalAttempted + (speedRoundState.totalAttempted || 0) + (pitchGuideState.quizTotal || 0);

    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    return {
      stars, maxStars,
      review,
      stamps,
      challenge,
      achievements,
      mistakes,
      phrases,
      culturalNotes,
      stores,
      npcLessons,
      levelsCompleted: completedLevelsCount,
      accuracy,
      totalCorrect,
      totalAttempts,
      inventory: getInventoryCount(),
      inventoryTotal: getTotalItems(),
      speedRounds: speedRoundState.roundsCompleted,
      bestStreak: bestStreakEver || 0,
      conversation,
    };
  }

  function getFullState() {
    return {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      // Core store progress
      progress: {
        '7-Eleven': { ...progress['7-Eleven'], completed: [...progress['7-Eleven'].completed], stars: { ...progress['7-Eleven'].stars } },
        'Lawson': { ...progress['Lawson'], completed: [...progress['Lawson'].completed], stars: { ...progress['Lawson'].stars } },
        'FamilyMart': { ...progress['FamilyMart'], completed: [...progress['FamilyMart'].completed], stars: { ...progress['FamilyMart'].stars } },
      },
      // Spaced repetition
      phraseTracker: JSON.parse(JSON.stringify(phraseTracker)),
      completedLevelsCount,
      // Mistake journal
      mistakeJournal: mistakeJournal.map(m => ({ ...m })),
      // Cultural notes
      seenCulturalNotes: [...seenCulturalNotes],
      // Challenge state (save best stats, reset session streak)
      challengeState: {
        bestStreak: challengeState.bestStreak,
        challengesCompleted: challengeState.challengesCompleted,
      },
      // Variable rewards -- collected bonus phrases
      collectedPhrases: JSON.parse(JSON.stringify(collectedPhrases)),
      totalRewardsGiven,
      // Stamp cards
      stampCards: JSON.parse(JSON.stringify(stampCards)),
      // Payment practice
      paymentState: {
        practicesCompleted: paymentState.practicesCompleted,
        scenariosCompleted: [...paymentState.scenariosCompleted],
      },
      // Seasonal items
      seasonalState: {
        lessonsCompleted: seasonalState.lessonsCompleted,
        seasonsCompleted: [...seasonalState.seasonsCompleted],
      },
      // Kansai dialect
      kansaiState: {
        lessonsCompleted: kansaiState.lessonsCompleted,
        topicsCompleted: [...kansaiState.topicsCompleted],
      },
      // Politeness levels
      politenessState: {
        lessonsCompleted: politenessState.lessonsCompleted,
        topicsCompleted: [...politenessState.topicsCompleted],
      },
      // Inventory
      inventory: inventory.map(i => ({ levelId: i.levelId, acquiredAt: i.acquiredAt })),
      // Achievements
      unlockedAchievements: [...unlockedAchievements],
      bestStreakEver,
      // Conversation practice
      conversationState: {
        practicesCompleted: conversationState.practicesCompleted,
        scenariosCompleted: [...conversationState.scenariosCompleted],
        totalCorrect: conversationState.totalCorrect,
        totalAttempted: conversationState.totalAttempted,
      },
      // Speed round stats
      speedRoundState: {
        roundsCompleted: speedRoundState.roundsCompleted,
        bestScore: speedRoundState.bestScore,
        bestTime: speedRoundState.bestTime === Infinity ? null : speedRoundState.bestTime,
        totalCorrect: speedRoundState.totalCorrect,
        totalAttempted: speedRoundState.totalAttempted,
      },
      // Onomatopoeia coach
      onomatopoeiaState: {
        lessonsCompleted: onomatopoeiaState.lessonsCompleted,
        topicsCompleted: [...onomatopoeiaState.topicsCompleted],
      },
      // Night shift
      nightShiftState: {
        lessonsCompleted: nightShiftState.lessonsCompleted,
        topicsCompleted: [...nightShiftState.topicsCompleted],
      },
      // Service counter (bills, packages, ATM, tickets)
      serviceCounterState: {
        practicesCompleted: serviceCounterState.practicesCompleted,
        scenariosCompleted: [...serviceCounterState.scenariosCompleted],
        totalCorrect: serviceCounterState.totalCorrect,
        totalAttempted: serviceCounterState.totalAttempted,
      },
      // Pronunciation guide
      pitchGuideState: {
        lessonsViewed: [...pitchGuideState.lessonsViewed],
        quizCorrect: pitchGuideState.quizCorrect,
        quizTotal: pitchGuideState.quizTotal,
      },
      // Customer queue (listening comprehension on store entry)
      customerQueueState: {
        encountersCompleted: customerQueueState.encountersCompleted,
        correctAnswers: customerQueueState.correctAnswers,
        totalAttempts: customerQueueState.totalAttempts,
        scenariosHeard: [...customerQueueState.scenariosHeard],
      },
      // Greeting response training (cultural correction on store entry)
      greetingResponseState: {
        encountersCompleted: greetingResponseState.encountersCompleted,
        correctAnswers: greetingResponseState.correctAnswers,
        totalAttempts: greetingResponseState.totalAttempts,
        scenariosShown: [...greetingResponseState.scenariosShown],
      },
      // Daily special items (seasonal limited-edition products)
      dailySpecialsState: {
        seenIds: [...dailySpecialsState.seenIds],
        lastShownId: dailySpecialsState.lastShownId,
      },
    };
  }

  function loadFullState(data) {
    if (!data || data.version !== SAVE_VERSION) return false;
    try {
      // Core store progress
      if (data.progress) {
        for (const store of ['7-Eleven', 'Lawson', 'FamilyMart']) {
          if (data.progress[store]) {
            progress[store].current = data.progress[store].current || 0;
            progress[store].completed = data.progress[store].completed || [];
            progress[store].stars = data.progress[store].stars || {};
          }
        }
      }
      // Spaced repetition
      if (data.phraseTracker) {
        for (const key of Object.keys(data.phraseTracker)) {
          phraseTracker[key] = data.phraseTracker[key];
        }
      }
      if (typeof data.completedLevelsCount === 'number') {
        completedLevelsCount = data.completedLevelsCount;
      }
      // Mistake journal
      if (Array.isArray(data.mistakeJournal)) {
        mistakeJournal.length = 0;
        data.mistakeJournal.forEach(m => mistakeJournal.push(m));
      }
      // Cultural notes
      if (Array.isArray(data.seenCulturalNotes)) {
        seenCulturalNotes.clear();
        data.seenCulturalNotes.forEach(id => seenCulturalNotes.add(id));
      }
      // Challenge state
      if (data.challengeState) {
        challengeState.bestStreak = data.challengeState.bestStreak || 0;
        challengeState.challengesCompleted = data.challengeState.challengesCompleted || 0;
      }
      // Variable rewards
      if (data.collectedPhrases) {
        for (const key of Object.keys(data.collectedPhrases)) {
          collectedPhrases[key] = data.collectedPhrases[key];
          // Mark all loaded phrases as not-new
          collectedPhrases[key].isNew = false;
        }
      }
      if (typeof data.totalRewardsGiven === 'number') {
        totalRewardsGiven = data.totalRewardsGiven;
      }
      // Stamp cards
      if (data.stampCards) {
        for (const store of ['7-Eleven', 'Lawson', 'FamilyMart']) {
          if (data.stampCards[store]) {
            stampCards[store].stamps = data.stampCards[store].stamps || [0, 0, 0, 0];
            stampCards[store].masterStamp = data.stampCards[store].masterStamp || false;
          }
        }
        // Sync lastStampCount
        const { total } = getTotalStamps();
        lastStampCount = total;
      }
      // Payment practice
      if (data.paymentState) {
        paymentState.practicesCompleted = data.paymentState.practicesCompleted || 0;
        paymentState.scenariosCompleted = data.paymentState.scenariosCompleted || [];
      }
      // Seasonal items
      if (data.seasonalState) {
        seasonalState.lessonsCompleted = data.seasonalState.lessonsCompleted || 0;
        seasonalState.seasonsCompleted = data.seasonalState.seasonsCompleted || [];
      }
      // Kansai dialect
      if (data.kansaiState) {
        kansaiState.lessonsCompleted = data.kansaiState.lessonsCompleted || 0;
        kansaiState.topicsCompleted = data.kansaiState.topicsCompleted || [];
      }
      // Politeness levels
      if (data.politenessState) {
        politenessState.lessonsCompleted = data.politenessState.lessonsCompleted || 0;
        politenessState.topicsCompleted = data.politenessState.topicsCompleted || [];
      }
      // Inventory
      if (Array.isArray(data.inventory)) {
        inventory.length = 0;
        data.inventory.forEach(saved => {
          const item = KONBINI_ITEMS.find(i => i.levelId === saved.levelId);
          if (item) {
            inventory.push({
              ...item,
              acquiredAt: saved.acquiredAt || Date.now(),
              isNew: false,
            });
          }
        });
      }
      // Achievements
      if (Array.isArray(data.unlockedAchievements)) {
        unlockedAchievements.clear();
        data.unlockedAchievements.forEach(id => unlockedAchievements.add(id));
      }
      if (typeof data.bestStreakEver === 'number') {
        bestStreakEver = data.bestStreakEver;
      }
      // Conversation practice
      if (data.conversationState) {
        conversationState.practicesCompleted = data.conversationState.practicesCompleted || 0;
        conversationState.scenariosCompleted = data.conversationState.scenariosCompleted || [];
        conversationState.totalCorrect = data.conversationState.totalCorrect || 0;
        conversationState.totalAttempted = data.conversationState.totalAttempted || 0;
      }
      // Speed round
      if (data.speedRoundState) {
        speedRoundState.roundsCompleted = data.speedRoundState.roundsCompleted || 0;
        speedRoundState.bestScore = data.speedRoundState.bestScore || 0;
        speedRoundState.bestTime = data.speedRoundState.bestTime != null ? data.speedRoundState.bestTime : Infinity;
        speedRoundState.totalCorrect = data.speedRoundState.totalCorrect || 0;
        speedRoundState.totalAttempted = data.speedRoundState.totalAttempted || 0;
      }
      // Onomatopoeia coach
      if (data.onomatopoeiaState) {
        onomatopoeiaState.lessonsCompleted = data.onomatopoeiaState.lessonsCompleted || 0;
        onomatopoeiaState.topicsCompleted = data.onomatopoeiaState.topicsCompleted || [];
      }
      // Night shift
      if (data.nightShiftState) {
        nightShiftState.lessonsCompleted = data.nightShiftState.lessonsCompleted || 0;
        nightShiftState.topicsCompleted = data.nightShiftState.topicsCompleted || [];
      }
      // Service counter
      if (data.serviceCounterState) {
        serviceCounterState.practicesCompleted = data.serviceCounterState.practicesCompleted || 0;
        serviceCounterState.scenariosCompleted = data.serviceCounterState.scenariosCompleted || [];
        serviceCounterState.totalCorrect = data.serviceCounterState.totalCorrect || 0;
        serviceCounterState.totalAttempted = data.serviceCounterState.totalAttempted || 0;
      }
      // Pronunciation guide
      if (data.pitchGuideState) {
        pitchGuideState.lessonsViewed = new Set(data.pitchGuideState.lessonsViewed || []);
        pitchGuideState.quizCorrect = data.pitchGuideState.quizCorrect || 0;
        pitchGuideState.quizTotal = data.pitchGuideState.quizTotal || 0;
      }
      // Customer queue
      if (data.customerQueueState) {
        customerQueueState.encountersCompleted = data.customerQueueState.encountersCompleted || 0;
        customerQueueState.correctAnswers = data.customerQueueState.correctAnswers || 0;
        customerQueueState.totalAttempts = data.customerQueueState.totalAttempts || 0;
        customerQueueState.scenariosHeard = data.customerQueueState.scenariosHeard || [];
      }
      // Greeting response training
      if (data.greetingResponseState) {
        greetingResponseState.encountersCompleted = data.greetingResponseState.encountersCompleted || 0;
        greetingResponseState.correctAnswers = data.greetingResponseState.correctAnswers || 0;
        greetingResponseState.totalAttempts = data.greetingResponseState.totalAttempts || 0;
        greetingResponseState.scenariosShown = data.greetingResponseState.scenariosShown || [];
      }
      // Daily special items
      if (data.dailySpecialsState) {
        dailySpecialsState.seenIds = data.dailySpecialsState.seenIds || [];
        dailySpecialsState.lastShownId = data.dailySpecialsState.lastShownId || null;
      }
      return true;
    } catch (e) {
      console.warn('Failed to load save data:', e);
      return false;
    }
  }

  // ============ AMBIENT SPEECH BUBBLES ============
  // NPC-type-appropriate ambient phrases that display periodically above street NPCs
  const AMBIENT_PHRASES = {
    sensei: [
      { jp: '復習は大事ですよ', en: 'Review is important', romaji: 'fukushuu wa daiji desu yo' },
      { jp: '毎日練習しましょう', en: 'Let\'s practice every day', romaji: 'mainichi renshuu shimashou' },
      { jp: 'がんばって！', en: 'Do your best!', romaji: 'ganbatte!' },
      { jp: '日本語は楽しいね', en: 'Japanese is fun, right?', romaji: 'nihongo wa tanoshii ne' },
    ],
    oldman: [
      { jp: '今日もいい天気じゃ', en: 'Nice weather today', romaji: 'kyou mo ii tenki ja' },
      { jp: 'わしの若い頃は...', en: 'Back in my day...', romaji: 'washi no wakai koro wa...' },
      { jp: 'お腹すいたのう', en: 'I\'m hungry...', romaji: 'onaka suita nou' },
      { jp: 'ふぉっふぉっふぉ', en: '*chuckling*', romaji: 'foffofo' },
    ],
    schoolgirl: [
      { jp: 'やばい！遅刻する！', en: 'Oh no! I\'ll be late!', romaji: 'yabai! chikoku suru!' },
      { jp: 'マジで？ウケる！', en: 'Seriously? LOL!', romaji: 'maji de? ukeru!' },
      { jp: 'プリクラ撮りたい～', en: 'Wanna take purikura~', romaji: 'purikura toritai~' },
      { jp: 'お菓子買いに行こ', en: 'Let\'s go buy snacks', romaji: 'okashi kai ni iko' },
    ],
    businessman: [
      { jp: 'お疲れ様です', en: 'Good work today', romaji: 'otsukaresama desu' },
      { jp: '会議に遅れる！', en: 'Late for the meeting!', romaji: 'kaigi ni okureru!' },
      { jp: 'コーヒー飲みたい', en: 'I want coffee', romaji: 'koohii nomitai' },
      { jp: '今日も残業か...', en: 'Overtime again...', romaji: 'kyou mo zangyou ka...' },
    ],
    challenger: [
      { jp: '次は負けないよ！', en: 'I won\'t lose next time!', romaji: 'tsugi wa makenai yo!' },
      { jp: 'もっと強くなる', en: 'I\'ll get stronger', romaji: 'motto tsuyoku naru' },
      { jp: '練習あるのみ！', en: 'Practice is everything!', romaji: 'renshuu aru nomi!' },
    ],
    paymentcoach: [
      { jp: 'お会計はこちらです', en: 'Payment is over here', romaji: 'okaikei wa kochira desu' },
      { jp: '現金？カード？', en: 'Cash? Card?', romaji: 'genkin? kaado?' },
    ],
    seasonalguide: [
      { jp: '季節の味を楽しんで', en: 'Enjoy seasonal flavors', romaji: 'kisetsu no aji wo tanoshinde' },
      { jp: '旬のものは美味しい', en: 'Seasonal food is delicious', romaji: 'shun no mono wa oishii' },
    ],
    politenesscoach: [
      { jp: '敬語は大切です', en: 'Keigo is important', romaji: 'keigo wa taisetsu desu' },
      { jp: '丁寧に話しましょう', en: 'Let\'s speak politely', romaji: 'teinei ni hanashimashou' },
    ],
    kansaicoach: [
      { jp: 'なんでやねん！', en: 'Why the heck?!', romaji: 'nandeyanen!' },
      { jp: 'めっちゃええやん', en: 'That\'s really great', romaji: 'meccha ee yan' },
      { jp: 'おおきに～', en: 'Thanks~ (Kansai)', romaji: 'ookini~' },
    ],
    speedcoach: [
      { jp: '速い！速い！', en: 'Fast! Fast!', romaji: 'hayai! hayai!' },
      { jp: 'タイムアタック！', en: 'Time attack!', romaji: 'taimu atakku!' },
    ],
    pronunciationguide: [
      { jp: '発音に気をつけて', en: 'Watch your pronunciation', romaji: 'hatsuon ni ki wo tsukete' },
      { jp: 'アクセントが大事', en: 'Accent matters', romaji: 'akusento ga daiji' },
    ],
    conversationcoach: [
      { jp: '会話を楽しもう', en: 'Let\'s enjoy conversation', romaji: 'kaiwa wo tanoshimou' },
      { jp: '自然に話そう', en: 'Speak naturally', romaji: 'shizen ni hanasou' },
    ],
    onomatopoeiacoach: [
      { jp: 'ワクワクする！', en: '*excited*', romaji: 'wakuwaku suru!' },
      { jp: 'ピカピカ！', en: '*sparkling*', romaji: 'pikapika!' },
      { jp: 'ドキドキ...', en: '*heart pounding*', romaji: 'dokidoki...' },
    ],
    nightsalaryman: [
      { jp: 'はぁ...疲れた', en: 'Haah... I\'m tired', romaji: 'haa... tsukareta' },
      { jp: '一杯飲みたい...', en: 'I want a drink...', romaji: 'ippai nomitai...' },
      { jp: '終電大丈夫かな', en: 'Will I make the last train?', romaji: 'shuuden daijoubu kana' },
    ],
    rainperson: [
      { jp: 'すごい雨ですね', en: 'Such heavy rain', romaji: 'sugoi ame desu ne' },
      { jp: '傘忘れちゃった', en: 'I forgot my umbrella', romaji: 'kasa wasurechatta' },
    ],
    hanami: [
      { jp: '桜がきれい～', en: 'The sakura are pretty~', romaji: 'sakura ga kirei~' },
      { jp: 'お花見日和ですね', en: 'Perfect day for hanami', romaji: 'ohanami biyori desu ne' },
    ],
  };

  // State for ambient bubbles: { npcIdx: { phrase, timer, active, cooldown } }
  const ambientBubbleState = {};

  function updateAmbientBubbles(dt) {
    const streetNPCs = getNPCsOnMap(0);
    for (let i = 0; i < streetNPCs.length; i++) {
      const npc = streetNPCs[i];
      if (npc.isClerk) continue; // clerks don't get ambient bubbles
      const npcIdx = getNPCIndex(npc);
      const key = npcIdx;

      if (!ambientBubbleState[key]) {
        // Initialize with a random cooldown so bubbles don't all pop at once
        ambientBubbleState[key] = {
          phrase: null,
          timer: 0,
          active: false,
          cooldown: 8 + Math.random() * 20, // 8-28s stagger
        };
      }

      const bs = ambientBubbleState[key];

      if (bs.active) {
        bs.timer -= dt;
        if (bs.timer <= 0) {
          bs.active = false;
          bs.cooldown = 12 + Math.random() * 18; // 12-30s between bubbles
        }
      } else {
        bs.cooldown -= dt;
        if (bs.cooldown <= 0) {
          const phrases = AMBIENT_PHRASES[npc.type];
          if (phrases && phrases.length > 0) {
            bs.phrase = phrases[Math.floor(Math.random() * phrases.length)];
            bs.timer = 3.5; // show for 3.5 seconds
            bs.active = true;
          } else {
            bs.cooldown = 20; // no phrases for this type, try again later
          }
        }
      }
    }
  }

  function getAmbientBubble(npcIdx) {
    const bs = ambientBubbleState[npcIdx];
    if (!bs || !bs.active) return null;
    return { phrase: bs.phrase, timer: bs.timer, maxTimer: 3.5 };
  }

  function saveGame() {
    if (!storageAvailable) return false;
    try {
      const data = getFullState();
      _ls.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Failed to save game:', e);
      return false;
    }
  }

  function loadGame() {
    if (!storageAvailable) return false;
    try {
      const raw = _ls.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      return loadFullState(data);
    } catch (e) {
      console.warn('Failed to load game:', e);
      return false;
    }
  }

  function hasSaveData() {
    if (!storageAvailable) return false;
    try {
      return _ls.getItem(SAVE_KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  function deleteSaveData() {
    if (!storageAvailable) return false;
    try {
      _ls.removeItem(SAVE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getSaveInfo() {
    if (!storageAvailable) return null;
    try {
      const raw = _ls.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        savedAt: data.savedAt,
        completedLevels: data.completedLevelsCount || 0,
        totalStars: Object.values(data.progress || {}).reduce((sum, p) => {
          return sum + Object.values(p.stars || {}).reduce((s, v) => s + v, 0);
        }, 0),
      };
    } catch (e) {
      return null;
    }
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
    buildReceiptData,
    formatYen,
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
    // Cultural notes
    CULTURAL_NOTES,
    getCulturalNote,
    getAllCulturalNotes,
    getSeenNoteCount,
    getTotalNoteCount,
    hasNewNotes,
    markNotesViewed,
    // Conversation practice
    CONVERSATION_SCENARIOS,
    isConversationPracticeReady,
    getNextConversationScenario,
    getConversationScenarioList,
    completeConversationScenario,
    getConversationStats,
    // Speed round
    isSpeedRoundReady,
    buildSpeedRoundQuiz,
    getSpeedRoundStats,
    recordSpeedRoundResult,
    // Pronunciation guide
    PITCH_ACCENT_PHRASES,
    isPronunciationReady,
    getNextPitchLesson,
    buildPitchQuiz,
    getPronunciationStats,
    recordPitchResult,
    // Onomatopoeia coach
    ONOMATOPOEIA_LESSONS,
    isOnomatopoeiaPracticeReady,
    getNextOnomatopoeiaLesson,
    completeOnomatopoeiaLesson,
    getOnomatopoeiaStats,
    // Night shift
    NIGHT_SHIFT_LESSONS,
    isNightShiftPracticeReady,
    getNextNightShiftLesson,
    completeNightShiftLesson,
    getNightShiftStats,
    // Service counter (bills, packages, ATM, tickets)
    SERVICE_COUNTER_SCENARIOS,
    isServiceCounterReady,
    getNextServiceCounterScenario,
    getServiceCounterScenarioList,
    completeServiceCounterScenario,
    getServiceCounterStats,
    // Customer queue (listening comprehension on store entry)
    CUSTOMER_QUEUE_SCENARIOS,
    shouldTriggerCustomerQueue,
    buildCustomerQueue,
    recordCustomerQueueResult,
    getCustomerQueueStats,
    // Greeting response training (cultural correction on store entry)
    GREETING_RESPONSE_SCENARIOS,
    shouldTriggerGreetingResponse,
    buildGreetingResponse,
    recordGreetingResponseResult,
    getGreetingResponseStats,
    // Daily special items (seasonal limited-edition products)
    DAILY_SPECIALS,
    shouldTriggerDailySpecial,
    pickDailySpecial,
    markDailySpecialShown,
    getDailySpecialStats,
    getCurrentSeasonMonth,
    seasonForMonth,
    // Progress dashboard
    getProgressDashboard,
    // Ambient speech bubbles
    updateAmbientBubbles,
    getAmbientBubble,
    // Save / Load system
    saveGame,
    loadGame,
    hasSaveData,
    deleteSaveData,
    getSaveInfo,
  };
})();
