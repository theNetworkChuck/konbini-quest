/* Konbini Quest v2 - Main Game State & Scene Management */
(() => {
  const T = 16;
  const WALK_FRAMES = Engine.WALK_FRAMES;

  // ============ GAME STATE ============
  const state = {
    phase: 'title', // title, playing, transition
    currentMap: 0,
    player: {
      x: 10, y: 10, // tile coordinates
      dir: 'down',
      frame: 0,
      walking: false,
      walkTimer: 0,
      walkFrame: 0,
    },
    time: 0,
    // Interaction state
    interacting: false,
    currentInteractionStore: null,
    currentInteractionLevel: null,
    currentInteractionIdx: 0,
    interactionMistakes: 0,
    // Entry greeting tracking
    enteredStore: null,
    greetingShown: false,
    // Review system state
    inReview: false,
    reviewPhrases: [],
    reviewIdx: 0,
    reviewCorrect: 0,
    reviewTotal: 0,
    // Romaji peek state (kana_assist mode)
    romajiPeekActive: false,
    romajiPeekData: null, // stores romaji text for current choices
    currentDisplayMode: 'romaji', // current level's display mode
    // Stamp card overlay
    stampCardOpen: false,
    stampNotification: null, // {text, timer} for new stamp earned
    // Variable rewards
    rewardNotification: null, // {reward, timer} for bonus phrase drops
    phraseBookOpen: false,
    // Inventory bag
    inventoryOpen: false,
    // Achievement badges
    achievementOpen: false,
    achievementNotification: null, // {achievement, timer}
    achievementQueue: [], // queued unlock notifications
    // Mistake journal
    mistakeJournalOpen: false,
    // Cultural notes
    culturalNotesOpen: false,
    culturalNoteNotification: null, // {note, timer}
  };

  let audioInitialized = false;
  let lastTimestamp = 0;

  // ============ GAME LOOP ============
  function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
    lastTimestamp = timestamp;
    state.time += dt;

    update(dt);
    render();

    Engine.clearJustPressed();
    Engine.clearMobileJust();
    requestAnimationFrame(gameLoop);
  }

  // ============ UPDATE ============
  function update(dt) {
    Engine.updateFade(dt);
    Engine.updateDoorAnimation(dt);
    Engine.updateParticles(dt);
    Dialogue.update(dt);

    // Update weather only on street (map 0) — indoors has no weather
    if (state.currentMap === 0) {
      Engine.updateWeather(dt);
      // Start/stop rain ambience based on weather type
      if (Engine.getWeatherType() === 'rain' && !GameAudio.isRainPlaying()) {
        GameAudio.startRainAmbience();
      } else if (Engine.getWeatherType() !== 'rain' && GameAudio.isRainPlaying()) {
        GameAudio.stopRainAmbience();
      }
      // Street ambience on overworld (when not raining — rain takes precedence)
      if (Engine.getWeatherType() !== 'rain' && !GameAudio.isStreetPlaying()) {
        GameAudio.startStreetAmbience();
      } else if (Engine.getWeatherType() === 'rain' && GameAudio.isStreetPlaying()) {
        GameAudio.stopStreetAmbience();
      }
      // Stop store BGM when on street
      if (GameAudio.isBGMPlaying()) {
        GameAudio.stopKonbiniBGM();
      }
    } else {
      // Inside a store
      if (GameAudio.isRainPlaying()) {
        GameAudio.stopRainAmbience();
      }
      if (GameAudio.isStreetPlaying()) {
        GameAudio.stopStreetAmbience();
      }
      // Start konbini BGM inside stores
      if (!GameAudio.isBGMPlaying()) {
        GameAudio.startKonbiniBGM();
      }
    }

    if (state.phase === 'title') {
      updateTitle();
    } else if (state.phase === 'playing') {
      updatePlaying(dt);
    }
  }

  function updateTitle() {
    if (Engine.inputA() || Engine.inputB()) {
      if (!audioInitialized) {
        GameAudio.init();
        GameAudio.resume();
        GameAudio.preloadCommonPhrases();
        audioInitialized = true;
      }
      GameAudio.playSelect();
      state.phase = 'playing';
      state.currentMap = 0;
      state.player.x = 10;
      state.player.y = 10;
      state.player.dir = 'down';
      Engine.initWeather();
      NPCs.initNPCWalking();
      Engine.startFadeIn();
    }
  }

  function updatePlaying(dt) {
    if (Engine.isFading() || Engine.isDoorAnimating()) return;

    // Update NPC walk cycles (street map only)
    if (state.currentMap === 0) {
      NPCs.updateNPCWalking(state.player.x, state.player.y, Dialogue.isActive());
    }

    // Update stamp notification timer
    if (state.stampNotification) {
      state.stampNotification.timer -= dt;
      if (state.stampNotification.timer <= 0) {
        state.stampNotification = null;
      }
    }

    // Update reward notification timer
    if (state.rewardNotification) {
      state.rewardNotification.timer -= dt;
      if (state.rewardNotification.timer <= 0) {
        state.rewardNotification = null;
      }
    }

    // Update achievement notification timer & queue
    if (state.achievementNotification) {
      state.achievementNotification.timer -= dt;
      if (state.achievementNotification.timer <= 0) {
        state.achievementNotification = null;
        // Show next queued achievement
        if (state.achievementQueue.length > 0) {
          const next = state.achievementQueue.shift();
          state.achievementNotification = { achievement: next, timer: 4.0 };
          GameAudio.playLevelComplete();
        }
      }
    }

    // Update cultural note notification timer
    if (state.culturalNoteNotification) {
      state.culturalNoteNotification.timer -= dt;
      if (state.culturalNoteNotification.timer <= 0) {
        state.culturalNoteNotification = null;
      }
    }

    // Handle cultural notes overlay
    if (state.culturalNotesOpen) {
      if (Engine.inputB() || Engine.wasPressed('c')) {
        NPCs.markNotesViewed();
        state.culturalNotesOpen = false;
        GameAudio.playSelect();
      }
      return;
    }

    // Handle cultural note banner dismissal
    if (state.culturalNoteNotification) {
      if (Engine.inputA()) {
        state.culturalNoteNotification = null;
        GameAudio.playSelect();
      }
    }

    // Handle mistake journal overlay
    if (state.mistakeJournalOpen) {
      if (Engine.inputB() || Engine.wasPressed('j')) {
        NPCs.markMistakesViewed();
        state.mistakeJournalOpen = false;
        GameAudio.playSelect();
      }
      return;
    }

    // Handle achievement overlay
    if (state.achievementOpen) {
      if (Engine.inputB() || Engine.wasPressed('g')) {
        NPCs.markAchievementsViewed();
        state.achievementOpen = false;
        GameAudio.playSelect();
      }
      return;
    }

    // Handle phrase book overlay
    if (state.phraseBookOpen) {
      if (Engine.inputB()) {
        // Mark all phrases as seen when closing
        NPCs.getCollectedPhrases().forEach(p => NPCs.markPhraseSeen(p.id));
        state.phraseBookOpen = false;
        GameAudio.playSelect();
      }
      return;
    }

    // Handle stamp card overlay
    if (state.stampCardOpen) {
      if (Engine.inputB() || Engine.wasPressed('tab')) {
        state.stampCardOpen = false;
        GameAudio.playSelect();
      }
      return;
    }

    // Handle inventory overlay
    if (state.inventoryOpen) {
      if (Engine.inputB() || Engine.wasPressed('i')) {
        NPCs.markInventoryViewed();
        state.inventoryOpen = false;
        GameAudio.playSelect();
      }
      return;
    }

    // Open stamp card with Tab key (on street map only)
    if (Engine.wasPressed('tab') && !Dialogue.isActive() && !state.interacting && state.currentMap === 0) {
      state.stampCardOpen = true;
      GameAudio.playSelect();
      return;
    }

    // Open phrase book with Q key (on street map only)
    if (Engine.wasPressed('q') && !Dialogue.isActive() && !state.interacting && state.currentMap === 0) {
      state.phraseBookOpen = true;
      GameAudio.playSelect();
      return;
    }

    // Open inventory with I key (on street map only)
    if (Engine.wasPressed('i') && !Dialogue.isActive() && !state.interacting && state.currentMap === 0) {
      state.inventoryOpen = true;
      GameAudio.playSelect();
      return;
    }

    // Open achievements with G key (on street map only)
    if (Engine.wasPressed('g') && !Dialogue.isActive() && !state.interacting && state.currentMap === 0) {
      state.achievementOpen = true;
      GameAudio.playSelect();
      return;
    }

    // Open mistake journal with J key (on street map only)
    if (Engine.wasPressed('j') && !Dialogue.isActive() && !state.interacting && state.currentMap === 0) {
      state.mistakeJournalOpen = true;
      GameAudio.playSelect();
      return;
    }

    // Open cultural notes with C key (on street map only)
    if (Engine.wasPressed('c') && !Dialogue.isActive() && !state.interacting && state.currentMap === 0) {
      state.culturalNotesOpen = true;
      GameAudio.playSelect();
      return;
    }

    // Handle dialogue
    if (Dialogue.isActive()) {
      updateDialogue();
      return;
    }

    // Player movement
    if (!state.player.walking) {
      // Check for interaction first
      if (Engine.inputA()) {
        tryInteract();
        return;
      }

      // Movement input
      const dir = Engine.inputDirHeld();
      if (dir) {
        tryMove(dir);
      }
    } else {
      // Walking animation
      state.player.walkTimer++;
      if (state.player.walkTimer >= WALK_FRAMES) {
        state.player.walking = false;
        state.player.walkTimer = 0;
        state.player.frame = 0;

        // Check for warps after movement completes
        checkWarp();
      } else {
        // Walking frame
        state.player.walkFrame = state.player.walkTimer / WALK_FRAMES;
        if (state.player.walkTimer === Math.floor(WALK_FRAMES / 2)) {
          state.player.frame = 1 - state.player.frame;
        }
      }
    }
  }

  function updateDialogue() {
    if (Engine.inputA()) {
      Dialogue.pressA();
    }
    if (Engine.inputB()) {
      // In kana_assist mode during quiz, B toggles romaji peek
      if (state.currentDisplayMode === 'kana_assist' && Dialogue.choiceActive && state.romajiPeekData) {
        state.romajiPeekActive = !state.romajiPeekActive;
        GameAudio.playCursor();
      } else {
        Dialogue.pressB();
      }
    }
    // D-pad for choice menu
    if (Dialogue.choiceActive) {
      const dir = Engine.inputDir();
      if (dir === 'up' || dir === 'down') {
        Dialogue.moveCursor(dir);
      }
    }
  }

  // ============ MOVEMENT ============
  function tryMove(dir) {
    state.player.dir = dir;

    const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
    const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
    const nx = state.player.x + dx;
    const ny = state.player.y + dy;

    // Check walkability
    if (!Maps.isWalkable(state.currentMap, nx, ny)) return;

    // Check NPC blocking
    if (NPCs.isNPCBlocking(state.currentMap, nx, ny)) return;

    // Start walking
    state.player.walking = true;
    state.player.walkTimer = 0;
    state.player.walkFrame = 0;
    state.player.x = nx;
    state.player.y = ny;

    GameAudio.playFootstep();
  }

  // ============ WARPS ============

  // Store brand colors for door animation
  const STORE_COLORS = {
    '7-Eleven': '#d4380d',
    'Lawson': '#1a6fc4',
    'FamilyMart': '#27ae60',
  };

  function checkWarp() {
    const warp = Maps.getWarp(state.currentMap, state.player.x, state.player.y);
    if (!warp) return;

    const targetMap = Maps.allMaps[warp.targetMap];
    const isEnteringStore = state.currentMap === 0 && targetMap && targetMap.store;

    if (isEnteringStore) {
      // Animated sliding door entry!
      const storeColor = STORE_COLORS[targetMap.store] || '#888';

      // Find the leftmost door tile for this store pair
      // Door warps come in pairs at (x, y) and (x+1, y) — use the left one
      const doorX = Math.min(warp.x, warp.x); // Current warp position
      // Street map door tiles are at row 2, find the pair
      const streetWarps = Maps.allMaps[0].warps.filter(w => w.targetMap === warp.targetMap);
      const leftDoorX = Math.min(...streetWarps.map(w => w.x));
      const doorY = warp.y;

      // Get current camera position for screen coordinate calc
      const map = Maps.allMaps[state.currentMap];
      Engine.updateCamera(state.player.x, state.player.y, map.width, map.height);
      const camXVal = Engine.camX();
      const camYVal = Engine.camY();

      // Play sliding door sound
      GameAudio.playSlidingDoor();

      // Start the door opening animation, then fade to black
      Engine.startDoorAnimation(storeColor, leftDoorX, doorY, camXVal, camYVal, 'enter', () => {
        // Door fully open → fade to black and transition
        Engine.startFadeOut(() => {
          state.currentMap = warp.targetMap;
          state.player.x = warp.targetX;
          state.player.y = warp.targetY;
          state.player.dir = 'down';
          state.player.walking = false;
          state.greetingShown = false;
          state.enteredStore = targetMap.store;

          // Play store chime as we enter
          GameAudio.playStoreChime(targetMap.store);

          // Show greeting after fade-in
          setTimeout(() => {
            if (!state.greetingShown) {
              state.greetingShown = true;
              Dialogue.show('Clerk', 'いらっしゃいませ！', () => {
                GameAudio.speakJapanese('いらっしゃいませ');
                // Try showing a cultural note on store entry
                tryCulturalNote('store_entry');
              });
            }
          }, 600);

          Engine.startFadeIn();
        });
      });
    } else {
      // Exiting store → simple fade with door close sound
      GameAudio.playSlidingDoorClose();

      Engine.startFadeOut(() => {
        state.currentMap = warp.targetMap;
        state.player.x = warp.targetX;
        state.player.y = warp.targetY;
        state.player.dir = 'down';
        state.player.walking = false;
        state.greetingShown = false;

        Engine.startFadeIn();
      });
    }
  }

  // ============ INTERACTION ============
  function tryInteract() {
    const dx = state.player.dir === 'left' ? -1 : state.player.dir === 'right' ? 1 : 0;
    const dy = state.player.dir === 'up' ? -1 : state.player.dir === 'down' ? 1 : 0;
    const fx = state.player.x + dx;
    const fy = state.player.y + dy;

    const npc = NPCs.getNPCAt(state.currentMap, fx, fy);
    if (!npc) return;

    // Turn NPC to face player
    const oppositeDir = { up: 'down', down: 'up', left: 'right', right: 'left' };
    npc.dir = oppositeDir[state.player.dir] || 'down';

    GameAudio.playAlert();

    if (npc.isClerk) {
      interactWithClerk(npc);
    } else {
      interactWithStreetNPC(npc);
    }
  }

  function interactWithStreetNPC(npc) {
    // Check if this is the Sensei NPC
    if (npc.isSensei) {
      interactWithSensei(npc);
      return;
    }
    // Check if this is the Challenge Master NPC
    if (npc.isChallenger) {
      interactWithChallenger(npc);
      return;
    }
    // Check if this is the Payment Coach NPC
    if (npc.isPaymentCoach) {
      interactWithPaymentCoach(npc);
      return;
    }
    // Check if this is the Seasonal Guide NPC
    if (npc.isSeasonalGuide) {
      interactWithSeasonalGuide(npc);
      return;
    }
    // Check if this is the Kansai Dialect Coach NPC
    if (npc.isKansaiCoach) {
      interactWithKansaiCoach(npc);
      return;
    }
    // Check if this is the Politeness Coach NPC
    if (npc.isPolitenessCoach) {
      interactWithPolitenessCoach(npc);
      return;
    }
    const dialogue = NPCs.getStreetDialogue(npc);
    Dialogue.show(npc.name, dialogue);
  }

  // ============ REVIEW SENSEI ============
  function interactWithSensei(npc) {
    const reviewPhrases = NPCs.getReviewPhrases(5);
    const stats = NPCs.getReviewStats();

    if (reviewPhrases.length === 0) {
      // No reviews available
      if (stats.total === 0) {
        Dialogue.show('Sensei', [
          "Welcome, young learner! I am the Review Sensei.",
          "Complete some store levels first, then come back.",
          "I'll quiz you on phrases you've learned to help them stick!",
          "復習 (fukushū) means review — the key to mastery!"
        ]);
      } else {
        const masteredPct = stats.total > 0 ? Math.round(stats.mastered / stats.total * 100) : 0;
        Dialogue.show('Sensei', [
          `Phrases learned: ${stats.total} | Mastered: ${stats.mastered}`,
          masteredPct === 100
            ? "You've mastered everything! Come back after new levels."
            : "No phrases due for review yet. Keep learning!",
          "Complete more levels and I'll have new reviews for you!"
        ]);
      }
      return;
    }

    // Start review session
    state.inReview = true;
    state.reviewPhrases = reviewPhrases;
    state.reviewIdx = 0;
    state.reviewCorrect = 0;
    state.reviewTotal = reviewPhrases.length;

    Dialogue.show('Sensei', [
      `復習タイム！ Review Time!`,
      `${reviewPhrases.length} phrase${reviewPhrases.length > 1 ? 's' : ''} to review.`,
      "Let's see how well you remember!"
    ], () => {
      runReview();
    });
  }

  function runReview() {
    if (state.reviewIdx >= state.reviewPhrases.length) {
      finishReview();
      return;
    }

    const phraseData = state.reviewPhrases[state.reviewIdx];
    const interaction = NPCs.getInteractionForPhrase(phraseData);

    if (!interaction) {
      // Skip if interaction data not found
      state.reviewIdx++;
      runReview();
      return;
    }

    // Show as quick-fire review (shorter format)
    const header = `Review ${state.reviewIdx + 1}/${state.reviewTotal}`;

    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      Dialogue.show(header, [
        interaction.clerkJp,
        interaction.question || 'What\'s the best response?'
      ], () => {
        showReviewQuiz(interaction, phraseData);
      });
    } else if (interaction.playerPrompt) {
      Dialogue.show(header, interaction.playerPrompt, () => {
        showReviewQuiz(interaction, phraseData);
      });
    }
  }

  function showReviewQuiz(interaction, phraseData) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    // Shuffle options for review to prevent memorizing positions
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handleReviewAnswer(interaction, selected, phraseData);
    });
  }

  function handleReviewAnswer(interaction, selected, phraseData) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      Engine.spawnSparkles();
      state.reviewCorrect++;
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, true);

      // Speak the player's correct Japanese response
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && responseText !== '[\u4f55\u3082\u8a00\u308f\u306a\u3044]') {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      Dialogue.show('Sensei', '\u3088\u304f\u3067\u304d\u305f\uff01 Well done!', () => {
        state.reviewIdx++;
        runReview();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, false);

      // Record in mistake journal
      const correctOpt = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOpt ? (correctOpt.text || correctOpt.textJp || '') : '',
        correctEn: correctOpt ? (correctOpt.en || '') : '',
        source: 'Review',
      });

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('Sensei', [
        'もう一回！ Let\'s review that...',
        explanation
      ], () => {
        state.reviewIdx++;
        runReview();
      });
    }
  }

  function finishReview() {
    const correct = state.reviewCorrect;
    const total = state.reviewTotal;
    const pct = Math.round(correct / total * 100);

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '完璧！ Perfect! ★★★';
    else if (pct >= 70) rating = 'いいね！ Great job! ★★☆';
    else rating = 'がんばれ！ Keep practicing! ★☆☆';

    Dialogue.show('Sensei', [
      `Review Complete: ${correct}/${total} correct!`,
      rating,
      "Phrases you missed will come back sooner for extra practice.",
      "Come back after completing more levels!"
    ], () => {
      state.inReview = false;
      state.reviewPhrases = [];
      setTimeout(() => triggerAchievementCheck(), 300);
    });
  }

  // ============ CHALLENGE MASTER ============
  // Challenge state tracked in game.js
  const challengeGameState = {
    inChallenge: false,
    challengeType: null,
    challengePhrases: [],
    challengeIdx: 0,
    challengeCorrect: 0,
    challengeTotal: 0,
    isSurvival: false,
    survivalFailed: false,
  };

  function interactWithChallenger(npc) {
    const chalState = NPCs.getChallengeState();

    if (!NPCs.canStartChallenge()) {
      // Player hasn't learned enough phrases yet
      Dialogue.show('Hana', [
        'チャレンジタイム！ I\'m Hana, the Challenge Master!',
        'You need to learn more phrases before I can challenge you.',
        'Complete some store levels first, then come back!',
        'がんばって！ Do your best!'
      ]);
      return;
    }

    if (!NPCs.isChallengeReady()) {
      // Cooldown active
      Dialogue.show('Hana', [
        'Great effort! Take a breather. 休憩 (kyūkei)!',
        chalState.streak > 0
          ? `Your streak: ${chalState.streak} 🔥 Keep it going!`
          : 'Come back in a moment for another challenge!'
      ]);
      return;
    }

    // Pick a random challenge type
    const challengeType = NPCs.getRandomChallengeType();
    const phrases = NPCs.buildChallengeQuiz(challengeType.count);

    if (phrases.length < 2) {
      Dialogue.show('Hana', 'I need more phrases to work with. Learn more at the stores!');
      return;
    }

    // Set up challenge state
    challengeGameState.inChallenge = true;
    challengeGameState.challengeType = challengeType;
    challengeGameState.challengePhrases = phrases;
    challengeGameState.challengeIdx = 0;
    challengeGameState.challengeCorrect = 0;
    challengeGameState.challengeTotal = phrases.length;
    challengeGameState.isSurvival = challengeType.name === 'Survival';
    challengeGameState.survivalFailed = false;

    // Intro dialogue with challenge type reveal
    const streakMsg = chalState.streak > 0
      ? `\n連勝 streak: ${chalState.streak} 🔥`
      : '';

    GameAudio.playAlert();
    Dialogue.show('Hana', [
      `チャレンジ！ ${challengeType.nameJp}!`,
      `${challengeType.name}: ${challengeType.description}${streakMsg}`,
      challengeGameState.isSurvival
        ? 'Perfect score or your streak resets! 覚悟を決めて！'
        : 'Get 60%+ to keep your streak alive! 準備はいい？'
    ], () => {
      runChallengeQuestion();
    });
  }

  function runChallengeQuestion() {
    if (challengeGameState.challengeIdx >= challengeGameState.challengePhrases.length) {
      finishChallenge();
      return;
    }

    // Check if survival failed early
    if (challengeGameState.isSurvival && challengeGameState.survivalFailed) {
      finishChallenge();
      return;
    }

    const phraseData = challengeGameState.challengePhrases[challengeGameState.challengeIdx];
    const interaction = NPCs.getInteractionForPhrase(phraseData);

    if (!interaction) {
      challengeGameState.challengeIdx++;
      runChallengeQuestion();
      return;
    }

    const qNum = challengeGameState.challengeIdx + 1;
    const qTotal = challengeGameState.challengeTotal;
    const header = `Challenge ${qNum}/${qTotal}`;

    // Show the question with clerk dialogue
    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      Dialogue.show(header, [
        interaction.clerkJp,
        interaction.question || 'What\'s the best response?'
      ], () => {
        showChallengeQuiz(interaction, phraseData);
      });
    } else if (interaction.playerPrompt) {
      Dialogue.show(header, interaction.playerPrompt, () => {
        showChallengeQuiz(interaction, phraseData);
      });
    }
  }

  function showChallengeQuiz(interaction, phraseData) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    // Shuffle options
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handleChallengeAnswer(interaction, selected, phraseData);
    });
  }

  function handleChallengeAnswer(interaction, selected, phraseData) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      challengeGameState.challengeCorrect++;
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, true);

      // Speak the player's correct Japanese response
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && responseText !== '[\u4f55\u3082\u8a00\u308f\u306a\u3044]') {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      // Roll for variable reward (bonus phrase drop)
      tryVariableReward();

      const encouragements = [
        '正解！ Correct!', 'いいね！ Nice!',
        'すごい！ Amazing!', 'バッチリ！ Perfect!'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];

      Dialogue.show('Hana', msg, () => {
        challengeGameState.challengeIdx++;
        runChallengeQuestion();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, false);

      // Record in mistake journal
      const correctOptChallenge = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOptChallenge ? (correctOptChallenge.text || correctOptChallenge.textJp || '') : '',
        correctEn: correctOptChallenge ? (correctOptChallenge.en || '') : '',
        source: 'Challenge',
      });

      if (challengeGameState.isSurvival) {
        challengeGameState.survivalFailed = true;
      }

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('Hana', [
        '残念！ Not quite!',
        explanation
      ], () => {
        challengeGameState.challengeIdx++;
        runChallengeQuestion();
      });
    }
  }

  function finishChallenge() {
    const correct = challengeGameState.challengeCorrect;
    const total = challengeGameState.challengeTotal;
    const isSurvival = challengeGameState.isSurvival;

    const passed = NPCs.recordChallengeResult(correct, total, isSurvival);
    const chalState = NPCs.getChallengeState();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let resultLines;
    if (passed) {
      const streakEmoji = '🔥'.repeat(Math.min(chalState.streak, 5));
      resultLines = [
        `Challenge Complete: ${correct}/${total} correct!`,
        `連勝 Streak: ${chalState.streak} ${streakEmoji}`,
      ];

      // Streak milestone bonuses (variable reward)
      if (chalState.streak === 3) {
        resultLines.push('★ 3-streak bonus! すごいね！');
      } else if (chalState.streak === 5) {
        resultLines.push('★★ 5-streak! コンビニマスター！');
      } else if (chalState.streak === 10) {
        resultLines.push('★★★ 10-streak! 伝説級！ LEGENDARY!');
      } else if (chalState.streak > 0) {
        resultLines.push('がんばって！ Keep the streak alive!');
      }
    } else {
      resultLines = [
        `Challenge Complete: ${correct}/${total} correct.`,
        isSurvival ? 'サバイバル失敗... Survival failed!' : 'Streak reset... もう一回！',
        chalState.bestStreak > 0 ? `Best streak: ${chalState.bestStreak}` : '',
        'Try again after a short break!'
      ].filter(l => l.length > 0);
    }

    Dialogue.show('Hana', resultLines, () => {
      challengeGameState.inChallenge = false;
      challengeGameState.challengePhrases = [];
      setTimeout(() => triggerAchievementCheck(), 300);
    });
  }

  // ============ PAYMENT COACH ============
  const paymentGameState = {
    inPayment: false,
    scenario: null,
    interactionIdx: 0,
    correct: 0,
    total: 0,
  };

  function interactWithPaymentCoach(npc) {
    if (!NPCs.isPaymentPracticeReady()) {
      // Player needs more experience first
      Dialogue.show('Reiko', [
        'お支払い (o-shiharai) means payment!',
        'Complete a few store levels first, then come back.',
        'I\'ll teach you every payment method used in konbini!',
        '現金、カード、Suica、PayPay... 全部教えます！'
      ]);
      return;
    }

    const stats = NPCs.getPaymentStats();
    const scenario = NPCs.getNextPaymentScenario();

    if (!scenario) {
      Dialogue.show('Reiko', 'Something went wrong... come back later!');
      return;
    }

    // Set up payment practice state
    paymentGameState.inPayment = true;
    paymentGameState.scenario = scenario;
    paymentGameState.interactionIdx = 0;
    paymentGameState.correct = 0;
    paymentGameState.total = scenario.interactions.length;

    // Preload all Japanese phrases for this scenario
    preloadPaymentPhrases(scenario);

    // Intro dialogue
    const isNew = !stats.scenariosUnlocked || stats.completed === 0;
    const introLines = isNew
      ? [
          'お支払いマスターへようこそ！ Welcome to Payment Training!',
          'I\'m Reiko. I\'ll teach you how to pay at any konbini.',
          `Today's lesson: ${scenario.title} (${scenario.titleJp})`,
          'いきましょう！ Let\'s go!'
        ]
      : [
          `${scenario.titleJp}! ${scenario.title}`,
          `Practice ${stats.completed + 1} | ${stats.scenariosUnlocked}/${stats.totalScenarios} scenarios learned`,
          '準備はいい？ Ready?'
        ];

    GameAudio.playAlert();
    Dialogue.show('Reiko', introLines, () => {
      runPaymentInteraction();
    });
  }

  function preloadPaymentPhrases(scenario) {
    if (!scenario || !scenario.interactions) return;
    const phrases = new Set();
    for (const interaction of scenario.interactions) {
      if (interaction.clerkJp) phrases.add(interaction.clerkJp);
      if (interaction.options) {
        for (const opt of interaction.options) {
          const text = opt.text || opt.textJp || '';
          if (/[\u3000-\u9fff\uff00-\uffef]/.test(text) && !text.startsWith('[')) {
            phrases.add(text);
          }
        }
      }
    }
    for (const phrase of phrases) {
      GameAudio.speakJapanese(phrase); // triggers cache/preload
    }
  }

  function runPaymentInteraction() {
    if (paymentGameState.interactionIdx >= paymentGameState.scenario.interactions.length) {
      finishPaymentPractice();
      return;
    }

    const interaction = paymentGameState.scenario.interactions[paymentGameState.interactionIdx];
    const qNum = paymentGameState.interactionIdx + 1;
    const qTotal = paymentGameState.total;
    const header = `Payment ${qNum}/${qTotal}`;

    // Show clerk dialogue, then quiz
    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      const lines = [interaction.clerkJp];
      if (interaction.clerkRomaji) lines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
      if (interaction.tip) lines.push('💡 ' + interaction.tip);

      Dialogue.show(header, lines, () => {
        showPaymentQuiz(interaction);
      });
    } else {
      showPaymentQuiz(interaction);
    }
  }

  function showPaymentQuiz(interaction) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    // Shuffle options
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    // Play each option's Japanese text on hover/selection for learning
    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handlePaymentAnswer(interaction, selected);
    });
  }

  function handlePaymentAnswer(interaction, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      GameAudio.playRegisterBeep();
      setTimeout(() => GameAudio.playCoinDrop(), 200); // coin sound for payment
      Engine.spawnSparkles();
      paymentGameState.correct++;

      // Speak the player's correct Japanese response
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && !responseText.startsWith('[')) {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      // Roll for variable reward
      tryVariableReward();

      const encouragements = [
        '正解！ Correct!', 'いいね！ Nice!',
        'お支払い上手！ Great payment skills!', 'バッチリ！ Perfect!'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      const explanation = interaction.correctExplanation || '';

      Dialogue.show('Reiko', explanation ? [msg, explanation] : msg, () => {
        paymentGameState.interactionIdx++;
        runPaymentInteraction();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();

      // Record in mistake journal
      const correctOptPayment = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOptPayment ? (correctOptPayment.text || correctOptPayment.textJp || '') : '',
        correctEn: correctOptPayment ? (correctOptPayment.en || '') : '',
        source: 'Payment',
      });

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('Reiko', [
        'もう一回！ Try again!',
        explanation
      ], () => {
        paymentGameState.interactionIdx++;
        runPaymentInteraction();
      });
    }
  }

  function finishPaymentPractice() {
    const correct = paymentGameState.correct;
    const total = paymentGameState.total;
    const scenario = paymentGameState.scenario;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    NPCs.completePaymentScenario(scenario.id);
    const stats = NPCs.getPaymentStats();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '完璧！ Perfect payment skills! ★★★';
    else if (pct >= 50) rating = 'いいね！ Good work! ★★☆';
    else rating = 'もう少し！ Keep practicing! ★☆☆';

    const resultLines = [
      `Practice Complete: ${correct}/${total} correct!`,
      rating,
      `Scenarios mastered: ${stats.scenariosUnlocked}/${stats.totalScenarios}`,
    ];

    if (stats.scenariosUnlocked >= stats.totalScenarios) {
      resultLines.push('🎉 全クリ！ You\'ve mastered all payment methods!');
    } else {
      resultLines.push('Come back to learn more payment methods!');
    }

    Dialogue.show('Reiko', resultLines, () => {
      paymentGameState.inPayment = false;
      paymentGameState.scenario = null;
      setTimeout(() => triggerAchievementCheck(), 300);
    });
  }

  // ============ SEASONAL GUIDE ============
  const seasonalGameState = {
    inSeasonal: false,
    lesson: null,
    interactionIdx: 0,
    correct: 0,
    total: 0,
  };

  function interactWithSeasonalGuide(npc) {
    if (!NPCs.isSeasonalPracticeReady()) {
      Dialogue.show('Obaa-chan', [
        '季節 (kisetsu) means season!',
        'Complete at least one store level first, dear.',
        'Then come back and I\'ll teach you about seasonal konbini treats!',
        '春、夏、秋、冬... every season has special food!'
      ]);
      return;
    }

    const stats = NPCs.getSeasonalStats();
    const lesson = NPCs.getNextSeasonalLesson();

    if (!lesson) {
      Dialogue.show('Obaa-chan', 'Something went wrong... come back later!');
      return;
    }

    // Set up seasonal practice state
    seasonalGameState.inSeasonal = true;
    seasonalGameState.lesson = lesson;
    seasonalGameState.interactionIdx = 0;
    seasonalGameState.correct = 0;
    seasonalGameState.total = lesson.interactions.length;

    // Preload Japanese phrases for this lesson
    preloadSeasonalPhrases(lesson);

    const isNew = stats.completed === 0;
    const introLines = isNew
      ? [
          '季節の勉強へようこそ! Welcome to Seasonal Studies!',
          'I\'m Obaa-chan. Let me teach you what konbini sell each season.',
          `Today: ${lesson.seasonJp} -- ${lesson.season}!`,
          lesson.intro
        ]
      : [
          `${lesson.seasonJp}! ${lesson.season} lesson`,
          `Practice ${stats.completed + 1} | ${stats.seasonsUnlocked}/${stats.totalSeasons} seasons learned`,
          lesson.intro
        ];

    GameAudio.playAlert();
    Dialogue.show('Obaa-chan', introLines, () => {
      runSeasonalInteraction();
    });
  }

  function preloadSeasonalPhrases(lesson) {
    if (!lesson || !lesson.interactions) return;
    const phrases = new Set();
    for (const interaction of lesson.interactions) {
      if (interaction.clerkJp) phrases.add(interaction.clerkJp);
      if (interaction.options) {
        for (const opt of interaction.options) {
          const text = opt.text || opt.textJp || '';
          if (/[\u3000-\u9fff\uff00-\uffef]/.test(text) && !text.startsWith('[')) {
            phrases.add(text);
          }
        }
      }
    }
    for (const phrase of phrases) {
      GameAudio.speakJapanese(phrase);
    }
  }

  function runSeasonalInteraction() {
    if (seasonalGameState.interactionIdx >= seasonalGameState.lesson.interactions.length) {
      finishSeasonalLesson();
      return;
    }

    const interaction = seasonalGameState.lesson.interactions[seasonalGameState.interactionIdx];
    const qNum = seasonalGameState.interactionIdx + 1;
    const qTotal = seasonalGameState.total;
    const season = seasonalGameState.lesson.season;
    const header = `${season} ${qNum}/${qTotal}`;

    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      const lines = [interaction.clerkJp];
      if (interaction.clerkRomaji) lines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
      if (interaction.tip) lines.push(interaction.tip);
      if (interaction.question) lines.push(interaction.question);

      Dialogue.show(header, lines, () => {
        showSeasonalQuiz(interaction);
      });
    } else {
      showSeasonalQuiz(interaction);
    }
  }

  function showSeasonalQuiz(interaction) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    const shuffled = [...options].sort(() => Math.random() - 0.5);

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handleSeasonalAnswer(interaction, selected);
    });
  }

  function handleSeasonalAnswer(interaction, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      seasonalGameState.correct++;

      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && !responseText.startsWith('[')) {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      tryVariableReward();

      const encouragements = [
        '正解! Correct!', 'いいね! Nice!',
        '季節の達人! Seasonal expert!', 'よくできました! Well done!'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      const explanation = interaction.correctExplanation || '';

      Dialogue.show('Obaa-chan', explanation ? [msg, explanation] : msg, () => {
        seasonalGameState.interactionIdx++;
        runSeasonalInteraction();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();

      // Record in mistake journal
      const correctOptSeasonal = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOptSeasonal ? (correctOptSeasonal.text || correctOptSeasonal.textJp || '') : '',
        correctEn: correctOptSeasonal ? (correctOptSeasonal.en || '') : '',
        source: 'Seasonal',
      });

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('Obaa-chan', [
        'もう一回! Let me explain...',
        explanation
      ], () => {
        seasonalGameState.interactionIdx++;
        runSeasonalInteraction();
      });
    }
  }

  function finishSeasonalLesson() {
    const correct = seasonalGameState.correct;
    const total = seasonalGameState.total;
    const lesson = seasonalGameState.lesson;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    NPCs.completeSeasonalLesson(lesson.id);
    const stats = NPCs.getSeasonalStats();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '\u5b8c\u74a7! Seasonal master! \u2605\u2605\u2605';
    else if (pct >= 50) rating = '\u3044\u3044\u306d! Good work! \u2605\u2605\u2606';
    else rating = '\u3082\u3046\u5c11\u3057! Keep practicing! \u2605\u2606\u2606';

    const resultLines = [
      `Lesson Complete: ${correct}/${total} correct!`,
      rating,
      `Seasons mastered: ${stats.seasonsUnlocked}/${stats.totalSeasons}`,
    ];

    if (stats.seasonsUnlocked >= stats.totalSeasons) {
      resultLines.push('全季節クリア! You know all four seasons of konbini!');
    } else {
      resultLines.push('Come back to learn about the next season!');
    }

    Dialogue.show('Obaa-chan', resultLines, () => {
      seasonalGameState.inSeasonal = false;
      seasonalGameState.lesson = null;
      setTimeout(() => triggerAchievementCheck(), 300);
    });
  }

  // ============ KANSAI DIALECT COACH ============
  const kansaiGameState = {
    inKansai: false,
    lesson: null,
    interactionIdx: 0,
    correct: 0,
    total: 0,
  };

  function interactWithKansaiCoach(npc) {
    if (!NPCs.isKansaiPracticeReady()) {
      Dialogue.show('Takoyaki', [
        '\u307E\u3044\u3069! I\'m Takoyaki from Osaka!',
        'Complete a few more store levels first, then come back.',
        'I\'ll teach you \u95A2\u897F\u5F01 (Kansai-ben) -- the Osaka dialect!',
        'It\'s \u3081\u3063\u3061\u3083\u304A\u3082\u308D\u3044 (super fun)!'
      ]);
      return;
    }

    const stats = NPCs.getKansaiStats();
    const lesson = NPCs.getNextKansaiLesson();

    if (!lesson) {
      Dialogue.show('Takoyaki', 'Something went wrong... come back later!');
      return;
    }

    // Set up kansai practice state
    kansaiGameState.inKansai = true;
    kansaiGameState.lesson = lesson;
    kansaiGameState.interactionIdx = 0;
    kansaiGameState.correct = 0;
    kansaiGameState.total = lesson.interactions.length;

    // Preload Japanese phrases
    preloadKansaiPhrases(lesson);

    const isNew = stats.completed === 0;
    const introLines = isNew
      ? [
          '\u95A2\u897F\u5F01\u30EC\u30C3\u30B9\u30F3\u3078\u3088\u3046\u3053\u305D! Welcome to Kansai-ben Lesson!',
          'I\'m Takoyaki. In Osaka, we talk different from Tokyo!',
          `Today: ${lesson.titleJp} -- ${lesson.title}`,
          lesson.intro
        ]
      : [
          `${lesson.titleJp}! ${lesson.title}`,
          `Practice ${stats.completed + 1} | ${stats.topicsUnlocked}/${stats.totalTopics} topics learned`,
          lesson.intro
        ];

    GameAudio.playAlert();
    Dialogue.show('Takoyaki', introLines, () => {
      runKansaiInteraction();
    });
  }

  function preloadKansaiPhrases(lesson) {
    if (!lesson || !lesson.interactions) return;
    const phrases = new Set();
    for (const interaction of lesson.interactions) {
      if (interaction.clerkJp) phrases.add(interaction.clerkJp);
      if (interaction.options) {
        for (const opt of interaction.options) {
          const text = opt.text || '';
          if (/[\u3000-\u9fff\uff00-\uffef]/.test(text) && !text.startsWith('[')) {
            phrases.add(text);
          }
        }
      }
    }
    for (const phrase of phrases) {
      GameAudio.speakJapanese(phrase);
    }
  }

  function runKansaiInteraction() {
    if (kansaiGameState.interactionIdx >= kansaiGameState.lesson.interactions.length) {
      finishKansaiLesson();
      return;
    }

    const interaction = kansaiGameState.lesson.interactions[kansaiGameState.interactionIdx];
    const qNum = kansaiGameState.interactionIdx + 1;
    const qTotal = kansaiGameState.total;
    const header = `\u95A2\u897F\u5F01 ${qNum}/${qTotal}`;

    // Show the Kansai phrase with context, then quiz
    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      const lines = [interaction.clerkJp];
      if (interaction.clerkRomaji) lines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
      if (interaction.context) lines.push(interaction.context);

      Dialogue.show(header, lines, () => {
        showKansaiQuiz(interaction);
      });
    } else {
      showKansaiQuiz(interaction);
    }
  }

  function showKansaiQuiz(interaction) {
    const question = interaction.question || 'What does this mean?';
    const options = interaction.options.map(o => ({
      text: o.text || '',
      correct: o.correct,
      en: o.en,
    }));

    // Shuffle
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    // Show question then choices
    Dialogue.show('Takoyaki', question, () => {
      Dialogue.showChoices(shuffled, (selectedIdx) => {
        const selected = shuffled[selectedIdx];
        handleKansaiAnswer(interaction, selected);
      });
    });
  }

  function handleKansaiAnswer(interaction, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      kansaiGameState.correct++;

      // Speak the correct answer
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && !responseText.startsWith('[')) {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      tryVariableReward();

      const encouragements = [
        '\u305B\u3084! Correct!', '\u3081\u3063\u3061\u3083\u3048\u3048! Great!',
        '\u307B\u3093\u307E\u306B\u3059\u3054\u3044! Really amazing!', '\u304A\u304A\u304D\u306B! Well done!'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      const explanation = interaction.correctExplanation || '';

      Dialogue.show('Takoyaki', explanation ? [msg, explanation] : msg, () => {
        kansaiGameState.interactionIdx++;
        runKansaiInteraction();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();

      // Record in mistake journal
      const correctOptKansai = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOptKansai ? (correctOptKansai.text || correctOptKansai.textJp || '') : '',
        correctEn: correctOptKansai ? (correctOptKansai.en || '') : '',
        source: 'Kansai',
      });

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('Takoyaki', [
        '\u3061\u3083\u3046\u3061\u3083\u3046! That\'s not it!',
        explanation
      ], () => {
        kansaiGameState.interactionIdx++;
        runKansaiInteraction();
      });
    }
  }

  function finishKansaiLesson() {
    const correct = kansaiGameState.correct;
    const total = kansaiGameState.total;
    const lesson = kansaiGameState.lesson;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    NPCs.completeKansaiLesson(lesson.id);
    const stats = NPCs.getKansaiStats();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '\u5B8C\u74A7! Kansai master! \u2605\u2605\u2605';
    else if (pct >= 50) rating = '\u3048\u3048\u611F\u3058! Not bad! \u2605\u2605\u2606';
    else rating = '\u3082\u3046\u3061\u3087\u3044! Keep at it! \u2605\u2606\u2606';

    const resultLines = [
      `Lesson Complete: ${correct}/${total} correct!`,
      rating,
      `Topics mastered: ${stats.topicsUnlocked}/${stats.totalTopics}`,
    ];

    if (stats.topicsUnlocked >= stats.totalTopics) {
      resultLines.push('\u95A2\u897F\u5F01\u30DE\u30B9\u30BF\u30FC! You know Kansai-ben!');
    } else {
      resultLines.push('Come back to learn more Kansai-ben!');
    }

    Dialogue.show('Takoyaki', resultLines, () => {
      kansaiGameState.inKansai = false;
      kansaiGameState.lesson = null;
      setTimeout(() => triggerAchievementCheck(), 300);
    });
  }

  // ============ POLITENESS LEVELS INTERACTION ============
  const politenessGameState = {
    inPoliteness: false,
    lesson: null,
    interactionIdx: 0,
    correct: 0,
    total: 0,
  };

  function interactWithPolitenessCoach(npc) {
    if (!NPCs.isPolitenessPracticeReady()) {
      Dialogue.show('Keiko', [
        '\u3053\u3093\u306B\u3061\u306F! I\'m Keiko, a politeness coach.',
        'Complete a couple more store levels first, then come back.',
        'I\'ll teach you \u4E01\u5BE7\u8A9E (teineigo), \u5C0A\u656C\u8A9E (sonkeigo), and \u8B19\u8B72\u8A9E (kenjougo)!',
        'Understanding politeness levels is the key to natural Japanese.'
      ]);
      return;
    }

    const stats = NPCs.getPolitenessStats();
    const lesson = NPCs.getNextPolitenessLesson();

    if (!lesson) {
      Dialogue.show('Keiko', 'Something went wrong... come back later!');
      return;
    }

    // Set up politeness practice state
    politenessGameState.inPoliteness = true;
    politenessGameState.lesson = lesson;
    politenessGameState.interactionIdx = 0;
    politenessGameState.correct = 0;
    politenessGameState.total = lesson.interactions.length;

    // Preload Japanese phrases
    preloadPolitenessPhrases(lesson);

    const isNew = stats.completed === 0;
    const introLines = isNew
      ? [
          '\u4E01\u5BE7\u8A9E\u30EC\u30C3\u30B9\u30F3\u3078\u3088\u3046\u3053\u305D! Welcome to Politeness Lessons!',
          'I\'m Keiko. In Japanese, HOW you say something matters as much as WHAT you say.',
          'There are three levels: \u666E\u901A (casual) \u2192 \u4E01\u5BE7\u8A9E (polite) \u2192 \u656C\u8A9E (keigo)',
          `Today: ${lesson.titleJp} -- ${lesson.title}`
        ]
      : [
          `${lesson.titleJp}! ${lesson.title}`,
          `Practice ${stats.completed + 1} | ${stats.topicsUnlocked}/${stats.totalTopics} topics learned`,
          lesson.intro
        ];

    GameAudio.playAlert();
    Dialogue.show('Keiko', introLines, () => {
      runPolitenessInteraction();
    });
  }

  function preloadPolitenessPhrases(lesson) {
    if (!lesson || !lesson.interactions) return;
    const phrases = new Set();
    for (const interaction of lesson.interactions) {
      if (interaction.clerkJp) phrases.add(interaction.clerkJp);
      if (interaction.options) {
        for (const opt of interaction.options) {
          const text = opt.text || '';
          if (/[\u3000-\u9fff\uff00-\uffef]/.test(text) && !text.startsWith('[')) {
            phrases.add(text);
          }
        }
      }
    }
    for (const phrase of phrases) {
      GameAudio.speakJapanese(phrase);
    }
  }

  function runPolitenessInteraction() {
    if (politenessGameState.interactionIdx >= politenessGameState.lesson.interactions.length) {
      finishPolitenessLesson();
      return;
    }

    const interaction = politenessGameState.lesson.interactions[politenessGameState.interactionIdx];
    const qNum = politenessGameState.interactionIdx + 1;
    const qTotal = politenessGameState.total;
    const header = `\u4E01\u5BE7\u3055 ${qNum}/${qTotal}`;

    // Show the phrase with context, then quiz
    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      const lines = [interaction.clerkJp];
      if (interaction.clerkRomaji) lines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
      if (interaction.context) lines.push(interaction.context);

      Dialogue.show(header, lines, () => {
        showPolitenessQuiz(interaction);
      });
    } else {
      showPolitenessQuiz(interaction);
    }
  }

  function showPolitenessQuiz(interaction) {
    const question = interaction.question || 'What politeness level is this?';
    const options = interaction.options.map(o => ({
      text: o.text || '',
      correct: o.correct,
      en: o.en,
    }));

    // Shuffle
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    // Show question then choices
    Dialogue.show('Keiko', question, () => {
      Dialogue.showChoices(shuffled, (selectedIdx) => {
        const selected = shuffled[selectedIdx];
        handlePolitenessAnswer(interaction, selected);
      });
    });
  }

  function handlePolitenessAnswer(interaction, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      politenessGameState.correct++;

      // Speak the correct answer
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && !responseText.startsWith('[')) {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      tryVariableReward();

      const encouragements = [
        '\u7D20\u6674\u3089\u3057\u3044! Wonderful!', '\u304A\u898B\u4E8B! Splendid!',
        '\u305D\u306E\u901A\u308A! Exactly right!', '\u3088\u304F\u3067\u304D\u307E\u3057\u305F! Well done!'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      const explanation = interaction.correctExplanation || '';

      Dialogue.show('Keiko', explanation ? [msg, explanation] : msg, () => {
        politenessGameState.interactionIdx++;
        runPolitenessInteraction();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();

      // Record in mistake journal
      const correctOptPoliteness = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOptPoliteness ? (correctOptPoliteness.text || correctOptPoliteness.textJp || '') : '',
        correctEn: correctOptPoliteness ? (correctOptPoliteness.en || '') : '',
        source: 'Politeness',
      });

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('Keiko', [
        '\u60DC\u3057\u3044\u3067\u3059! Not quite!',
        explanation
      ], () => {
        politenessGameState.interactionIdx++;
        runPolitenessInteraction();
      });
    }
  }

  function finishPolitenessLesson() {
    const correct = politenessGameState.correct;
    const total = politenessGameState.total;
    const lesson = politenessGameState.lesson;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    NPCs.completePolitenessLesson(lesson.id);
    const stats = NPCs.getPolitenessStats();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '\u5B8C\u74A7! Perfect manners! \u2605\u2605\u2605';
    else if (pct >= 50) rating = '\u4E0A\u624B! Well done! \u2605\u2605\u2606';
    else rating = '\u3082\u3046\u5C11\u3057! Keep practicing! \u2605\u2606\u2606';

    const resultLines = [
      `Lesson Complete: ${correct}/${total} correct!`,
      rating,
      `Topics mastered: ${stats.topicsUnlocked}/${stats.totalTopics}`,
    ];

    if (stats.topicsUnlocked >= stats.totalTopics) {
      resultLines.push('\u656C\u8A9E\u30DE\u30B9\u30BF\u30FC! You\'ve mastered politeness levels!');
    } else {
      resultLines.push('Come back to learn more about politeness levels!');
    }

    Dialogue.show('Keiko', resultLines, () => {
      politenessGameState.inPoliteness = false;
      politenessGameState.lesson = null;
      setTimeout(() => triggerAchievementCheck(), 300);
    });
  }

  // ============ VARIABLE REWARD TRIGGER ============
  // Called after any correct answer to roll for a bonus phrase reward
  function tryVariableReward() {
    const chalState = NPCs.getChallengeState();
    const reward = NPCs.rollVariableReward(chalState.streak);
    if (reward) {
      // Show reward notification
      state.rewardNotification = { reward, timer: 4.0 };
      // Play tier-appropriate sound
      GameAudio.playRewardSound(reward.tier);
      // Speak the Japanese phrase after a short delay
      setTimeout(() => {
        GameAudio.speakJapanese(reward.jp);
      }, 800);
    }
  }

  // Try showing a cultural note based on context
  function tryCulturalNote(contextTag) {
    // Don't show if another notification is active
    if (state.culturalNoteNotification || state.rewardNotification || state.achievementNotification) return;
    const note = NPCs.getCulturalNote(contextTag);
    if (note) {
      state.culturalNoteNotification = { note, timer: 6.0 };
    }
  }

  // Track which display mode transitions the player has seen
  const seenModeTransitions = {};

  function interactWithClerk(npc) {
    const store = npc.store;
    const level = NPCs.getCurrentLevel(store);

    if (!level) {
      // All levels complete
      Dialogue.show('Clerk', 'You\'ve mastered everything here! Thank you for shopping!');
      return;
    }

    // Start level interaction sequence
    state.interacting = true;
    state.currentInteractionStore = store;
    state.currentInteractionLevel = level;
    state.currentInteractionIdx = 0;
    state.interactionMistakes = 0;

    // Preload all Japanese phrases for this level (clerk lines + answer options)
    preloadLevelPhrases(level);

    const displayMode = getDisplayMode(level);
    state.currentDisplayMode = displayMode;

    // Show a one-time transition notice when entering a new writing mode
    if (!seenModeTransitions[displayMode] && displayMode !== 'romaji') {
      seenModeTransitions[displayMode] = true;
      if (displayMode === 'kana_assist') {
        Dialogue.show('Guide', [
          '\u30ec\u30d9\u30eb\u30a2\u30c3\u30d7\uff01 Level Up!',
          'Romaji training wheels are coming off!',
          'Text now shows in kana/kanji. Press [B] during quizzes to peek at romaji.',
          'Your reading skills are growing! \u304c\u3093\u3070\u3063\u3066\uff01'
        ], () => {
          runInteraction();
        });
      } else if (displayMode === 'kana_only') {
        Dialogue.show('Guide', [
          '\u4e0a\u7d1a\u8005\uff01 Advanced Mode!',
          'No more romaji or English hints.',
          'Read the Japanese text directly. You\'ve earned this!',
          '\u65e5\u672c\u8a9e\u3060\u3051\u3067\u304c\u3093\u3070\u308d\u3046\uff01'
        ], () => {
          runInteraction();
        });
      } else {
        runInteraction();
      }
    } else {
      runInteraction();
    }
  }

  // Preload all Japanese phrases for a level so ElevenLabs voices are cached
  function preloadLevelPhrases(level) {
    if (!level || !level.interactions) return;
    const phrases = new Set();
    for (const interaction of level.interactions) {
      // Clerk lines
      if (interaction.clerkJp) phrases.add(interaction.clerkJp);
      // Answer option texts
      if (interaction.options) {
        for (const opt of interaction.options) {
          const text = opt.text || opt.textJp || '';
          // Only preload Japanese text (skip English-only options)
          if (/[\u3000-\u9fff\uff00-\uffef]/.test(text) && text !== '[\u4f55\u3082\u8a00\u308f\u306a\u3044]') {
            phrases.add(text);
          }
        }
      }
    }
    // Stagger fetches to avoid rate limiting
    let delay = 0;
    for (const phrase of phrases) {
      setTimeout(() => GameAudio.fetchVoiceAudio(phrase), delay);
      delay += 800;
    }
  }

  // Check if a phrase should use listening comprehension mode
  // Listening mode activates when:
  // 1. The level is marked as Japanese-only (Master level), OR
  // 2. The player has previously learned this phrase (mastery >= 1)
  function shouldUseListeningMode(level, interactionIdx) {
    if (level.isJapaneseOnly) return true;
    const key = `${level.id}_${interactionIdx}`;
    const tracked = NPCs.phraseTracker[key];
    return tracked && tracked.mastery >= 1;
  }

  // Get display mode for current level
  function getDisplayMode(level) {
    if (!level) return 'romaji';
    return LEVEL_DISPLAY_MODES[level.id] || 'romaji';
  }

  // Format clerk dialogue lines based on display mode
  function formatClerkLines(interaction, displayMode) {
    const lines = [];
    lines.push(interaction.clerkJp);

    if (displayMode === 'romaji') {
      // Beginner: show romaji + English + tips
      if (interaction.clerkRomaji) lines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
    } else if (displayMode === 'kana_assist') {
      // Intermediate: show English but skip romaji (player can peek with B)
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
    }
    // kana_only: just the Japanese text, no romaji, no English

    if (interaction.question) lines.push(interaction.question);
    if (displayMode !== 'kana_only' && interaction.tip) lines.push(interaction.tip);
    return lines;
  }

  function runInteraction() {
    const level = state.currentInteractionLevel;
    const idx = state.currentInteractionIdx;

    if (idx >= level.interactions.length) {
      // Level complete!
      finishLevel();
      return;
    }

    const interaction = level.interactions[idx];
    const useListening = interaction.clerkJp && shouldUseListeningMode(level, idx);
    const displayMode = getDisplayMode(level);
    state.currentDisplayMode = displayMode;
    state.romajiPeekActive = false;
    state.romajiPeekData = null;

    // Determine what to show first
    if (interaction.clerkJp) {
      // Clerk speaks Japanese
      GameAudio.speakJapanese(interaction.clerkJp);

      if (useListening) {
        // LISTENING COMPREHENSION MODE
        // Play audio but don't show text -- player must identify from hearing
        const prompt = interaction.question || 'Listen carefully... What did the clerk say?';
        Dialogue.showListening(
          'Clerk',
          prompt,
          () => {
            // When player presses A, show the quiz with meaning-based options
            showListeningQuiz(interaction);
          },
          () => {
            // When player presses B, replay the audio
            GameAudio.speakJapanese(interaction.clerkJp);
          }
        );
      } else {
        // Normal mode: show text + audio, filtered by display mode
        const lines = formatClerkLines(interaction, displayMode);

        Dialogue.show('Clerk', lines, () => {
          showQuiz(interaction);
        });
      }
    } else if (interaction.playerPrompt) {
      // Player needs to initiate
      Dialogue.show('Guide', interaction.playerPrompt, () => {
        if (displayMode !== 'kana_only' && interaction.tip) {
          Dialogue.show('Tip', interaction.tip, () => {
            showQuiz(interaction);
          });
        } else {
          showQuiz(interaction);
        }
      });
    }
  }

  // Listening mode quiz: same as normal quiz but with shuffled options
  // and an extra "listen again" mechanic
  function showListeningQuiz(interaction) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    // Shuffle options so memorized positions don't help
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handleListeningAnswer(interaction, selected);
    });
  }

  function handleListeningAnswer(interaction, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();

      // Speak the player's correct Japanese response
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && responseText !== '[\u4f55\u3082\u8a00\u308f\u306a\u3044]') {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      // Track for spaced repetition
      if (state.currentInteractionLevel) {
        NPCs.trackPhrase(
          state.currentInteractionLevel.id,
          state.currentInteractionIdx,
          true
        );
      }

      // Roll for variable reward (bonus phrase drop)
      tryVariableReward();

      // Show the original text as a reveal after correct listening answer
      const revealLines = [];
      if (interaction.clerkJp) revealLines.push(interaction.clerkJp);
      if (interaction.clerkRomaji) revealLines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) revealLines.push(interaction.clerkEn);
      const explanation = interaction.correctExplanation || 'Correct!';
      revealLines.push(explanation);

      Dialogue.show('', revealLines, () => {
        state.currentInteractionIdx++;
        runInteraction();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      state.interactionMistakes++;

      // Record in mistake journal
      const correctOptListening = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOptListening ? (correctOptListening.text || correctOptListening.textJp || '') : '',
        correctEn: correctOptListening ? (correctOptListening.en || '') : '',
        source: 'Listening',
      });

      // Track mistake for spaced repetition
      if (state.currentInteractionLevel) {
        NPCs.trackPhrase(
          state.currentInteractionLevel.id,
          state.currentInteractionIdx,
          false
        );
      }

      // Reveal what the clerk actually said, then retry
      const revealLines = [];
      revealLines.push('The clerk said:');
      if (interaction.clerkJp) revealLines.push(interaction.clerkJp);
      if (interaction.clerkEn) revealLines.push(interaction.clerkEn);
      const explanation = interaction.wrongExplanation || 'Not quite...';
      revealLines.push(explanation);

      Dialogue.show('', revealLines, () => {
        // Replay audio so they hear it again with text
        GameAudio.speakJapanese(interaction.clerkJp);
        // Retry with normal mode this time (no double listening)
        showQuiz(interaction);
      });
    }
  }

  function showQuiz(interaction) {
    const displayMode = state.currentDisplayMode;
    const options = interaction.options.map(o => {
      const opt = {
        text: o.text || o.textJp || '',
        correct: o.correct,
        romaji: o.romaji,
        en: o.en,
      };

      // In kana_assist mode: if the text is already Japanese, keep it.
      // If it's English-only (like '[Stay Silent]'), keep it.
      // Store romaji for peek functionality but don't show it inline.
      // In kana_only mode: remove romaji and English entirely.
      if (displayMode === 'kana_only') {
        opt.romaji = undefined;
        opt.en = undefined;
      }
      return opt;
    });

    // Store romaji peek data for kana_assist mode
    if (displayMode === 'kana_assist') {
      state.romajiPeekData = interaction.options.map(o => o.romaji || null);
      state.romajiPeekActive = false;
      Dialogue.kanaPeekHint = true;
    } else {
      Dialogue.kanaPeekHint = false;
    }

    // Show the question context if available
    const contextLine = interaction.question || 'Choose your response:';
    Dialogue.show('', contextLine, () => {
      Dialogue.showChoices(options, (selectedIdx) => {
        state.romajiPeekActive = false;
        state.romajiPeekData = null;
        Dialogue.kanaPeekHint = false;
        const selected = options[selectedIdx];
        handleAnswer(interaction, selected);
      });
    });
  }

  function handleAnswer(interaction, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      // Correct!
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();

      // Speak the player's correct Japanese response aloud
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && responseText !== '[\u4f55\u3082\u8a00\u308f\u306a\u3044]') {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      // Track for spaced repetition
      if (state.currentInteractionLevel) {
        NPCs.trackPhrase(
          state.currentInteractionLevel.id,
          state.currentInteractionIdx,
          true
        );
      }

      // Roll for variable reward (bonus phrase drop)
      tryVariableReward();

      // Try showing a cultural note (context based on store type)
      tryCulturalNote('checkout');

      const explanation = interaction.correctExplanation || 'Correct!';
      Dialogue.show('', explanation, () => {
        // Move to next interaction in this level
        state.currentInteractionIdx++;
        runInteraction();
      });
    } else {
      // Wrong
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      state.interactionMistakes++;

      // Track mistake for spaced repetition
      if (state.currentInteractionLevel) {
        NPCs.trackPhrase(
          state.currentInteractionLevel.id,
          state.currentInteractionIdx,
          false
        );
      }

      // Record in mistake journal
      const correctOpt = interaction.options.find(o => o.correct);
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOpt ? (correctOpt.text || correctOpt.textJp || '') : '',
        correctEn: correctOpt ? (correctOpt.en || '') : '',
        source: state.enteredStore || 'Store',
      });

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('', explanation, () => {
        // Retry same interaction
        showQuiz(interaction);
      });
    }
  }

  // ============ ACHIEVEMENT CHECK HELPER ============
  function triggerAchievementCheck() {
    const justUnlocked = NPCs.checkAchievements();
    if (justUnlocked.length > 0) {
      // Queue all unlocked achievements for notification
      for (const ach of justUnlocked) {
        if (!state.achievementNotification) {
          state.achievementNotification = { achievement: ach, timer: 4.0 };
          GameAudio.playLevelComplete();
          Engine.spawnStarBurst();
        } else {
          state.achievementQueue.push(ach);
        }
      }
    }
  }

  function finishLevel() {
    const store = state.currentInteractionStore;
    const level = state.currentInteractionLevel;

    // Calculate stars
    const stars = state.interactionMistakes === 0 ? 3 :
                  state.interactionMistakes <= 2 ? 2 : 1;

    // Record progress
    for (let i = 0; i < level.interactions.length; i++) {
      NPCs.completeLevelInteraction(store, i, stars);
    }
    NPCs.advanceStoreLevel(store);
    NPCs.incrementCompletedLevels();

    // Add item to inventory bag
    NPCs.addToInventory(level.id);

    // Award stamp based on performance
    // stars maps directly to stamp tier: 3=gold, 2=silver, 1=bronze
    const storeProgress = NPCs.getStoreProgress(store);
    const levelIdx = storeProgress.current - 1; // just advanced, so -1
    NPCs.awardStamp(store, levelIdx, stars);

    // Check for new stamp notification
    const tierNames = { 3: 'GOLD', 2: 'SILVER', 1: 'BRONZE' };
    const tierJp = { 3: '\u91D1', 2: '\u9280', 1: '\u9285' };
    const stampMsg = `${tierJp[stars]}\u30B9\u30BF\u30F3\u30D7 ${tierNames[stars]} STAMP!`;

    // Sound Design: cash register ka-ching + bag rustle for purchase completion
    GameAudio.playCashRegister();
    setTimeout(() => GameAudio.playBagRustle(), 400);

    GameAudio.playLevelComplete();
    GameAudio.playStar();
    Engine.spawnStarBurst();

    const starText = '\u2605'.repeat(stars) + '\u2606'.repeat(3 - stars);

    // Check if master stamp was just unlocked
    const card = NPCs.getStampCard(store);
    const masterMsg = card.masterStamp ? `\n\u30DE\u30B9\u30BF\u30FC\u30B9\u30BF\u30F3\u30D7\u89E3\u9664\uFF01 MASTER STAMP UNLOCKED!` : '';

    // Show stamp notification popup
    state.stampNotification = { text: stampMsg, timer: 3.0 };

    Dialogue.show('', [
      `Level Complete: ${level.name}!`,
      `${starText}`,
      `${stampMsg}${masterMsg}`,
      NPCs.isStoreComplete(store)
        ? `You've mastered ${store}!`
        : `Next level unlocked! [TAB] View Stamp Card`
    ], () => {
      state.interacting = false;
      state.currentInteractionStore = null;
      state.currentInteractionLevel = null;
      // Check for achievement unlocks after level completion
      setTimeout(() => triggerAchievementCheck(), 500);
      // Try showing a cultural note after completing a level
      setTimeout(() => tryCulturalNote('general'), 1500);
    });
  }

  // ============ WRITING MODE DISPLAY ============
  function renderWritingModeBadge(ctx) {
    const mode = state.currentDisplayMode;
    const CANVAS_W = Engine.CANVAS_W;

    // Badge in top-left corner
    let label, color;
    if (mode === 'romaji') {
      label = 'Aa';
      color = '#3498db'; // blue
    } else if (mode === 'kana_assist') {
      label = '\u3042a';
      color = '#f39c12'; // orange
    } else {
      label = '\u3042';
      color = '#e74c3c'; // red
    }

    const badgeW = 24;
    const badgeH = 12;
    const badgeX = 2;
    const badgeY = 2;

    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label, badgeX + badgeW / 2, badgeY + 9);
    ctx.textAlign = 'left';
  }

  function renderRomajiPeek(ctx) {
    // Draw a small romaji hint box above the choice menu
    const CANVAS_W = Engine.CANVAS_W;
    const CANVAS_H = Engine.CANVAS_H;
    const BOX_H = 56;

    // Position: small box at top-left of screen
    const peekX = 4;
    const peekY = 16;
    const peekW = 120;
    const lineH = 10;

    // Filter to only entries that have romaji
    const romajiLines = state.romajiPeekData.filter(r => r != null);
    if (romajiLines.length === 0) return;

    const peekH = romajiLines.length * lineH + 10;

    // Background
    ctx.fillStyle = 'rgba(26,26,46,0.92)';
    ctx.fillRect(peekX, peekY, peekW, peekH);
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 1;
    ctx.strokeRect(peekX, peekY, peekW, peekH);

    // Header
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#f39c12';
    ctx.fillText('[B] Romaji Peek', peekX + 4, peekY + 8);

    // Romaji lines
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#ccc';
    let idx = 0;
    for (let i = 0; i < state.romajiPeekData.length; i++) {
      if (state.romajiPeekData[i]) {
        const text = state.romajiPeekData[i].length > 18
          ? state.romajiPeekData[i].substring(0, 17) + '\u2026'
          : state.romajiPeekData[i];
        ctx.fillText(text, peekX + 4, peekY + 18 + idx * lineH);
        idx++;
      }
    }
  }

  // ============ RENDER ============
  function render() {
    const ctx = Engine.ctx;
    ctx.imageSmoothingEnabled = false;

    // Clear
    ctx.fillStyle = '#0a0a1e';
    ctx.fillRect(0, 0, Engine.CANVAS_W, Engine.CANVAS_H);

    if (state.phase === 'title') {
      Engine.renderTitle();
      return;
    }

    // Update camera
    const map = Maps.allMaps[state.currentMap];
    Engine.updateCamera(state.player.x, state.player.y, map.width, map.height);

    // Render map tiles
    Engine.renderMap(state.currentMap);

    // Time-of-day tint (below sprites, above map — on street only)
    if (state.currentMap === 0) {
      Engine.renderTimeOfDayTint();
    }

    // Render store labels
    Engine.renderStoreLabels(state.currentMap);

    // Render sprites (Y-sorted: NPCs + Player together)
    Engine.renderNPCs(state.currentMap, state.player.x, state.player.y, state.player.dir, state.time);

    // Render player
    const walkProgress = state.player.walking ? state.player.walkFrame : 0;
    Engine.renderPlayer(
      state.player.x, state.player.y,
      state.player.dir, state.player.frame,
      walkProgress
    );

    // Weather particles (above player/NPCs, below HUD — street only)
    if (state.currentMap === 0) {
      Engine.renderWeather(state.time);
    }

    // HUD
    Engine.renderHUD(state.currentMap);

    // Mini-map (street map only, hidden during overlays/dialogue)
    if (!state.stampCardOpen && !state.phraseBookOpen && !state.inventoryOpen && !state.achievementOpen && !state.mistakeJournalOpen && !state.culturalNotesOpen && !Dialogue.isActive()) {
      Engine.renderMiniMap(state.currentMap, state.player.x, state.player.y, state.time);
    }

    // Writing mode badge (only during store interactions)
    if (state.interacting && state.currentInteractionLevel) {
      renderWritingModeBadge(ctx);
    }

    // Dialogue
    Dialogue.render(ctx);

    // Romaji peek overlay (kana_assist mode)
    if (state.romajiPeekActive && state.romajiPeekData && Dialogue.choiceActive) {
      renderRomajiPeek(ctx);
    }

    // Stamp card overlay
    if (state.stampCardOpen) {
      Sprites.drawStampCardOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        NPCs.getAllStampCards(), null, state.time
      );
    }

    // Stamp earned notification (floating banner)
    if (state.stampNotification) {
      renderStampNotification(ctx);
    }

    // Variable reward banner (bonus phrase drop)
    if (state.rewardNotification) {
      Sprites.drawRewardBanner(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        state.rewardNotification.reward,
        state.rewardNotification.timer
      );
    }

    // Phrase book overlay
    if (state.phraseBookOpen) {
      Sprites.drawPhraseBookOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        NPCs.getCollectedPhrases(),
        NPCs.getTotalBonusPhrases(),
        state.time
      );
    }

    // Inventory bag overlay
    if (state.inventoryOpen) {
      Sprites.drawInventoryOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        NPCs.getInventory(),
        NPCs.getTotalItems(),
        state.time
      );
    }

    // Achievement gallery overlay
    if (state.achievementOpen) {
      Sprites.drawAchievementOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        NPCs.getAllAchievements(),
        state.time
      );
    }

    // Mistake journal overlay
    if (state.mistakeJournalOpen) {
      Sprites.drawMistakeJournalOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        NPCs.getMistakeJournal(),
        state.time
      );
    }

    // Cultural notes collection overlay
    if (state.culturalNotesOpen) {
      Sprites.drawCulturalNotesOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        NPCs.getAllCulturalNotes(),
        state.time
      );
    }

    // Cultural note popup banner
    if (state.culturalNoteNotification) {
      Sprites.drawCulturalNoteBanner(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        state.culturalNoteNotification.note,
        state.culturalNoteNotification.timer
      );
    }

    // Achievement unlock notification banner
    if (state.achievementNotification) {
      Sprites.drawAchievementBanner(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        state.achievementNotification.achievement,
        state.achievementNotification.timer
      );
    }

    // Particle effects (sparkles + star bursts — above dialogue/overlays)
    Engine.renderParticles(state.time);

    // Sliding door animation overlay (above scene, below fade)
    Engine.renderDoorAnimation();

    // Fade overlay (always on top)
    Engine.renderFade();
  }

  // ============ STAMP NOTIFICATION RENDER ============
  function renderStampNotification(ctx) {
    if (!state.stampNotification) return;

    const notif = state.stampNotification;
    const CANVAS_W = Engine.CANVAS_W;

    // Fade in/out based on timer
    let alpha = 1;
    if (notif.timer > 2.5) alpha = (3.0 - notif.timer) * 2; // fade in
    else if (notif.timer < 0.5) alpha = notif.timer * 2; // fade out

    // Slide up from center
    const slideY = notif.timer > 2.5 ? (3.0 - notif.timer) * 40 : 20;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Banner background
    const bannerW = 160;
    const bannerH = 16;
    const bannerX = (CANVAS_W - bannerW) / 2;
    const bannerY = slideY;

    ctx.fillStyle = 'rgba(26,26,46,0.9)';
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

    // Text
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#F1C40F';
    ctx.textAlign = 'center';
    ctx.fillText(notif.text, CANVAS_W / 2, bannerY + 11);
    ctx.textAlign = 'left';

    ctx.restore();
  }

  // ============ TESTING HOOKS ============
  window.render_game_to_text = () => {
    return JSON.stringify({
      phase: state.phase,
      map: state.currentMap,
      mapName: Maps.allMaps[state.currentMap]?.name,
      player: {
        x: state.player.x,
        y: state.player.y,
        dir: state.player.dir,
        walking: state.player.walking,
      },
      dialogue: Dialogue.isActive(),
      listeningMode: Dialogue.listeningMode,
      displayMode: state.currentDisplayMode,
      romajiPeekActive: state.romajiPeekActive,
      stars: NPCs.getTotalStars(),
      interacting: state.interacting,
      inReview: state.inReview,
      reviewStats: NPCs.getReviewStats(),
      reviewsAvailable: NPCs.hasReviewsAvailable(),
      // Challenge system
      inChallenge: challengeGameState.inChallenge,
      challengeState: NPCs.getChallengeState(),
      challengeReady: NPCs.isChallengeReady(),
      // Stamp card
      stampCardOpen: state.stampCardOpen,
      stampCards: NPCs.getAllStampCards(),
      totalStamps: NPCs.getTotalStamps(),
      // Variable rewards
      phraseBookOpen: state.phraseBookOpen,
      rewardActive: !!state.rewardNotification,
      collectedPhrases: NPCs.getCollectedCount(),
      totalBonusPhrases: NPCs.getTotalBonusPhrases(),
      // ElevenLabs voice system
      voiceStatus: GameAudio.getVoiceStatus(),
      // Achievement badges
      achievementOpen: state.achievementOpen,
      achievementNotification: !!state.achievementNotification,
      achievementsUnlocked: NPCs.getAchievementCount(),
      achievementsTotal: NPCs.getTotalAchievements(),
    });
  };

  // Testing hook: open/close achievement gallery
  window.toggleAchievements = () => {
    state.achievementOpen = !state.achievementOpen;
  };

  // Testing hook: force unlock an achievement by ID
  window.testAchievement = (id) => {
    // Manually trigger the check which will unlock any earned ones
    triggerAchievementCheck();
  };

  // Testing hook: open/close stamp card
  window.toggleStampCard = () => {
    state.stampCardOpen = !state.stampCardOpen;
  };

  // Testing hook: award a test stamp
  window.awardTestStamp = (store, levelIdx, tier) => {
    NPCs.awardStamp(store || '7-Eleven', levelIdx || 0, tier || 3);
  };

  // Testing hook: force a variable reward drop
  window.forceReward = (tier) => {
    const tiers = { common: 'common', rare: 'rare', ultra_rare: 'ultra_rare' };
    const t = tiers[tier] || 'rare';
    const phrases = NPCs.BONUS_PHRASES.filter(p => p.tier === t);
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    const reward = { ...phrase, tierInfo: NPCs.TIER_INFO[t] };
    state.rewardNotification = { reward, timer: 4.0 };
    GameAudio.playRewardSound(t);
    setTimeout(() => GameAudio.speakJapanese(reward.jp), 800);
  };

  // Testing hook: open/close phrase book
  window.togglePhraseBook = () => {
    state.phraseBookOpen = !state.phraseBookOpen;
  };

  // Testing hook: force next interaction to use listening mode
  window.forceListeningMode = () => {
    // Pre-seed the phraseTracker so listening mode triggers
    // for all interactions of level 1 (7-Eleven Welcome)
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 10; j++) {
        const key = `${i + 1}_${j}`;
        if (!NPCs.phraseTracker[key]) {
          NPCs.phraseTracker[key] = {
            levelId: i + 1, interactionIdx: j,
            mastery: 2, interval: 2, wrongCount: 0,
            lastReviewAt: 0, correctStreak: 2
          };
        }
      }
    }
  };

  // Testing hook: override display mode
  window.setDisplayMode = (mode) => {
    state.currentDisplayMode = mode;
  };

  // Testing hook: complete levels up to N to unlock higher levels
  window.unlockToLevel = (storeIdx, count) => {
    const stores = ['7-Eleven', 'Lawson', 'FamilyMart'];
    const store = stores[storeIdx] || '7-Eleven';
    const p = NPCs.progress[store];
    if (p) p.current = count;
  };

  window.teleportPlayer = (x, y, mapIdx) => {
    if (mapIdx !== undefined) state.currentMap = mapIdx;
    state.player.x = x;
    state.player.y = y;
    state.player.walking = false;
  };

  window.setPlayerDir = (dir) => {
    state.player.dir = dir;
  };

  // Weather testing hooks
  window.setWeather = (type) => {
    // Force a weather type: 'clear', 'cherry_blossoms', 'rain'
    console.log('Setting weather to:', type);
  };

  window.getWeatherInfo = () => {
    return { weather: Engine.getWeatherType(), timeOfDay: Engine.getTimeOfDay(), map: state.currentMap };
  };

  window.advanceTime = (ms) => {
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i++) {
      update(1 / 60);
    }
    render();
  };

  // ElevenLabs voice system debug/test hooks
  window.getVoiceStatus = () => GameAudio.getVoiceStatus();
  window.testVoice = (text) => {
    text = text || 'いらっしゃいませ';
    GameAudio.speakJapanese(text);
  };

  // ============ INIT ============
  function init() {
    Engine.setupMobile();
    Engine.resizeCanvas();

    // Show mobile controls on touch devices only
    const mc = document.getElementById('mobile-controls');
    if (mc && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      mc.style.display = 'flex';
    }

    // Start game loop
    lastTimestamp = performance.now();
    requestAnimationFrame(gameLoop);
  }

  // Wait for fonts then init
  document.fonts.ready.then(init);
})();
