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
    Dialogue.update(dt);

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
        audioInitialized = true;
      }
      GameAudio.playSelect();
      state.phase = 'playing';
      state.currentMap = 0;
      state.player.x = 10;
      state.player.y = 10;
      state.player.dir = 'down';
      Engine.startFadeIn();
    }
  }

  function updatePlaying(dt) {
    if (Engine.isFading()) return;

    // Update stamp notification timer
    if (state.stampNotification) {
      state.stampNotification.timer -= dt;
      if (state.stampNotification.timer <= 0) {
        state.stampNotification = null;
      }
    }

    // Handle stamp card overlay
    if (state.stampCardOpen) {
      if (Engine.inputB() || Engine.wasPressed('tab')) {
        state.stampCardOpen = false;
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
  function checkWarp() {
    const warp = Maps.getWarp(state.currentMap, state.player.x, state.player.y);
    if (!warp) return;

    GameAudio.playDoor();

    Engine.startFadeOut(() => {
      state.currentMap = warp.targetMap;
      state.player.x = warp.targetX;
      state.player.y = warp.targetY;
      state.player.dir = 'down';
      state.player.walking = false;
      state.greetingShown = false;

      // Play store chime if entering a store
      const map = Maps.allMaps[warp.targetMap];
      if (map && map.store) {
        state.enteredStore = map.store;
        GameAudio.playStoreChime(map.store);

        // Show greeting after fade
        setTimeout(() => {
          if (!state.greetingShown) {
            state.greetingShown = true;
            Dialogue.show('Clerk', 'いらっしゃいませ！', () => {
              GameAudio.speakJapanese('いらっしゃいませ');
            });
          }
        }, 600);
      }

      Engine.startFadeIn();
    });
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
      state.reviewCorrect++;
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, true);

      Dialogue.show('Sensei', 'よくできた！ Well done!', () => {
        state.reviewIdx++;
        runReview();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, false);

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
      challengeGameState.challengeCorrect++;
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, true);

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
    });
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

      // Track for spaced repetition
      if (state.currentInteractionLevel) {
        NPCs.trackPhrase(
          state.currentInteractionLevel.id,
          state.currentInteractionIdx,
          true
        );
      }

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

      // Track for spaced repetition
      if (state.currentInteractionLevel) {
        NPCs.trackPhrase(
          state.currentInteractionLevel.id,
          state.currentInteractionIdx,
          true
        );
      }

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

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('', explanation, () => {
        // Retry same interaction
        showQuiz(interaction);
      });
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

    // Award stamp based on performance
    // stars maps directly to stamp tier: 3=gold, 2=silver, 1=bronze
    const storeProgress = NPCs.getStoreProgress(store);
    const levelIdx = storeProgress.current - 1; // just advanced, so -1
    NPCs.awardStamp(store, levelIdx, stars);

    // Check for new stamp notification
    const tierNames = { 3: 'GOLD', 2: 'SILVER', 1: 'BRONZE' };
    const tierJp = { 3: '\u91D1', 2: '\u9280', 1: '\u9285' };
    const stampMsg = `${tierJp[stars]}\u30B9\u30BF\u30F3\u30D7 ${tierNames[stars]} STAMP!`;

    GameAudio.playLevelComplete();
    GameAudio.playStar();

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

    // HUD
    Engine.renderHUD(state.currentMap);

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
    });
  };

  // Testing hook: open/close stamp card
  window.toggleStampCard = () => {
    state.stampCardOpen = !state.stampCardOpen;
  };

  // Testing hook: award a test stamp
  window.awardTestStamp = (store, levelIdx, tier) => {
    NPCs.awardStamp(store || '7-Eleven', levelIdx || 0, tier || 3);
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

  window.advanceTime = (ms) => {
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i++) {
      update(1 / 60);
    }
    render();
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
