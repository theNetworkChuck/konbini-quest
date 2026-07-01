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
    // Receipt overlay shown after completing a level
    receiptOverlay: null, // {data, elapsed, onDismiss}
    // Customer queue overlay shown on store entry when another customer is already in line
    customerQueue: null, // {phase, lineIdx, lines, options, selectedIdx, wasCorrect, elapsed, onDismiss, ...}
    greetingResponse: null, // Improvement #39: {phase, options, selectedIdx, wasCorrect, elapsed, onDismiss, ...}
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
    // Title menu (save/load)
    titleMenuIdx: 0,
    hasSaveData: false,
    // Conversation practice
    conversationMenuOpen: false,
    conversationMenuIdx: 0,
    // Service Counter practice
    serviceCounterMenuOpen: false,
    serviceCounterMenuIdx: 0,
    // Progress dashboard
    progressDashOpen: false,
    // Combo counter system
    combo: 0,
    maxCombo: 0,
    comboTimer: 0, // visual display timer (animation time accumulator)
    comboMilestone: null, // {combo, timer} for milestone banner
    comboDecayTimer: 0, // resets combo after inactivity (seconds)
  };

  let audioInitialized = false;
  let lastTimestamp = 0;

  // ============ TUTORIAL BUBBLE SYSTEM ============
  // Tracks which tutorials have been shown, persisted in localStorage
  const LS = window['local' + 'Storage'];
  const TUT_KEY = 'konbiniquest_tutorials';
  let tutorialsSeen = {};
  try {
    const saved = LS.getItem(TUT_KEY);
    if (saved) tutorialsSeen = JSON.parse(saved);
  } catch (e) { /* ignore */ }

  function hasTutorial(id) {
    return !!tutorialsSeen[id];
  }

  function showTutorial(id, text, subtext, x, y, pulseKey, duration) {
    if (tutorialsSeen[id]) return false; // already shown
    if (Engine.isTutorialBubbleActive()) return false; // another bubble showing
    if (Dialogue.isActive()) return false; // dialogue active
    tutorialsSeen[id] = true;
    try { LS.setItem(TUT_KEY, JSON.stringify(tutorialsSeen)); } catch (e) { /* ignore */ }
    Engine.showTutorialBubble(text, subtext, x, y, pulseKey, duration);
    return true;
  }

  // Tutorial definitions -- triggered at moment of need
  const TUTORIALS = {
    firstSteps: {
      id: 'first_steps',
      text: 'Use arrow keys to explore!',
      subtext: 'Find a konbini to start learning',
    },
    nearDoor: {
      id: 'near_door',
      text: 'Press Z to enter the store!',
      subtext: 'Your Japanese journey begins here',
    },
    nearNPC: {
      id: 'near_npc',
      text: 'Press Z to talk to NPCs!',
      subtext: 'Each one teaches something new',
    },
    firstQuiz: {
      id: 'first_quiz',
      text: 'Arrows to pick, Z to go!',
      subtext: 'Listen to the clerk carefully',
    },
    firstCorrect: {
      id: 'first_correct',
      text: 'Great job! Keep going!',
      subtext: 'Build combos with correct answers',
    },
    exitedStore: {
      id: 'exited_store',
      text: 'Press P for progress dashboard',
      subtext: 'Track your Japanese learning',
    },
    hotkeys: {
      id: 'hotkeys',
      text: 'Q=Phrases I=Bag G=Badges',
      subtext: 'J=Journal C=Notes Tab=Card',
    },
  };

  // Timer for delayed tutorial triggers
  let tutorialDelayTimer = 0;
  let tutorialPendingId = null;

  // Check for save data on startup
  state.hasSaveData = NPCs.hasSaveData();

  // Auto-save helper: saves game and shows indicator
  function autoSave() {
    if (NPCs.saveGame()) {
      Engine.showSaveIndicator();
      state.hasSaveData = true;
    }
  }

  // ============ COMBO COUNTER SYSTEM ============
  const COMBO_MILESTONES = [5, 10, 15, 20, 25, 30, 40, 50];
  const COMBO_DECAY_TIME = 45; // seconds before combo resets from inactivity

  function onCorrectAnswer() {
    state.combo++;
    state.comboDecayTimer = COMBO_DECAY_TIME;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;

    // Tutorial: first correct answer
    if (!hasTutorial('first_correct') && state.combo === 1) {
      const cw = Engine.CANVAS_W || 256;
      const t = TUTORIALS.firstCorrect;
      showTutorial(t.id, t.text, t.subtext, cw / 2, 30, null, 3.5);
    }

    // Reaction emote: pop a kawaii face / heart / fire above the dialogue area
    // Combo milestone -> star, hot streak (5+) -> fire, every 3rd -> heart, otherwise happy
    const cw = Engine.CANVAS_W || 256;
    const ch = Engine.CANVAS_H || 240;
    const emoteY = ch / 2 - 36; // above dialogue, below HUD
    if (COMBO_MILESTONES.includes(state.combo)) {
      Engine.spawnEmote('star', cw / 2, emoteY);
      Engine.spawnStarBurst();
      state.comboMilestone = { combo: state.combo, timer: 2.5 };
    } else if (state.combo >= 5 && state.combo % 5 === 0) {
      Engine.spawnEmote('fire', cw / 2, emoteY);
    } else if (state.combo > 0 && state.combo % 3 === 0) {
      Engine.spawnEmote('heart', cw / 2, emoteY);
    } else {
      Engine.spawnEmote('happy', cw / 2, emoteY);
    }
  }

  function onWrongAnswer() {
    state.combo = 0;
    state.comboDecayTimer = 0;
    // Reaction emote: classic anime sweatdrop
    const cw = Engine.CANVAS_W || 256;
    const ch = Engine.CANVAS_H || 240;
    const emoteY = ch / 2 - 36;
    Engine.spawnEmote('sweatdrop', cw / 2, emoteY);
  }

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
    Engine.updateSaveIndicator(dt);
    Engine.updateLocationBanner(dt);
    Engine.updateDailySpecialBanner(dt);
    Engine.updateTutorialBubble(dt);
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

  function initAudio() {
    if (!audioInitialized) {
      GameAudio.init();
      GameAudio.resume();
      GameAudio.preloadCommonPhrases();
      audioInitialized = true;
    }
  }

  function startPlaying() {
    state.phase = 'playing';
    state.currentMap = 0;
    state.player.x = 10;
    state.player.y = 10;
    state.player.dir = 'down';
    Engine.initWeather();
    NPCs.initNPCWalking();
    Engine.startFadeIn();

    // Tutorial: first steps on the street (delayed 1.5s for fade-in)
    setTimeout(() => {
      const cw = Engine.CANVAS_W || 256;
      const ch = Engine.CANVAS_H || 224;
      const t = TUTORIALS.firstSteps;
      showTutorial(t.id, t.text, t.subtext, cw / 2, ch - 40, null, 5.0);
    }, 1500);
  }

  function updateTitle() {
    if (state.hasSaveData) {
      // Menu navigation: up/down to switch between CONTINUE and NEW GAME
      const dir = Engine.inputDir();
      if (dir === 'up' && state.titleMenuIdx > 0) {
        state.titleMenuIdx = 0;
        GameAudio.playMove && GameAudio.playMove();
      } else if (dir === 'down' && state.titleMenuIdx < 1) {
        state.titleMenuIdx = 1;
        GameAudio.playMove && GameAudio.playMove();
      }

      if (Engine.inputA()) {
        initAudio();
        GameAudio.playSelect();
        if (state.titleMenuIdx === 0) {
          // CONTINUE: load save data
          NPCs.loadGame();
          startPlaying();
        } else {
          // NEW GAME: delete save, fresh start
          NPCs.deleteSaveData();
          startPlaying();
        }
      }
    } else {
      // No save data: any button starts a new game
      if (Engine.inputA() || Engine.inputB()) {
        initAudio();
        GameAudio.playSelect();
        startPlaying();
      }
    }
  }

  function updatePlaying(dt) {
    if (Engine.isFading() || Engine.isDoorAnimating()) return;

    // Update NPC walk cycles and ambient speech bubbles (street map only)
    if (state.currentMap === 0) {
      NPCs.updateNPCWalking(state.player.x, state.player.y, Dialogue.isActive());
      NPCs.updateAmbientBubbles(dt);
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

    // Update combo counter timers
    if (state.combo >= 2) {
      state.comboTimer += dt;
    }
    if (state.comboDecayTimer > 0) {
      state.comboDecayTimer -= dt;
      if (state.comboDecayTimer <= 0) {
        state.combo = 0;
        state.comboTimer = 0;
      }
    }
    if (state.comboMilestone) {
      state.comboMilestone.timer -= dt;
      if (state.comboMilestone.timer <= 0) {
        state.comboMilestone = null;
      }
    }

    // Update speed round countdown timer
    if (speedGameState.inSpeedRound && speedGameState.timerActive) {
      speedGameState.timerRemaining -= dt;
      if (speedGameState.timerRemaining <= 0) {
        speedGameState.timerRemaining = 0;
        handleSpeedTimeout();
      }
    }

    // Update speed round result banner timer
    if (speedGameState.showingResult) {
      speedGameState.resultTimer -= dt;
      if (speedGameState.resultTimer <= 0) {
        speedGameState.showingResult = false;
      }
    }

    // Handle receipt overlay -- highest priority, blocks all other input
    if (state.receiptOverlay) {
      state.receiptOverlay.elapsed += dt;
      // Allow dismiss only after the slide-in animation completes
      if (state.receiptOverlay.elapsed >= 0.5 && (Engine.inputA() || Engine.inputB())) {
        const cb = state.receiptOverlay.onDismiss;
        state.receiptOverlay = null;
        GameAudio.playPaperRustle && GameAudio.playPaperRustle();
        GameAudio.playSelect && GameAudio.playSelect();
        if (cb) cb();
      }
      return;
    }

    // Handle customer queue overlay (Improvement #38) -- blocks all other input.
    // The player waits in line, listens to the dialogue between the customer ahead
    // and the clerk, then answers a quick comprehension question.
    if (state.customerQueue) {
      state.customerQueue.elapsed += dt;
      const q = state.customerQueue;
      // Wait for slide-in animation before accepting input
      if (q.elapsed < 0.4) return;

      if (q.phase === 'dialogue') {
        // [Z]/[A] advances to next line. When the speaker changes or the current
        // line is a Japanese line, play the TTS so the player actually hears it.
        const line = q.lines[q.lineIdx];
        // Auto-speak when the line first appears (not every frame)
        if (line && !q.spoken) {
          q.spoken = true;
          if (line.jp) {
            try { GameAudio.speakJapanese && GameAudio.speakJapanese(line.jp); } catch (e) { /* ignore */ }
          }
        }
        if (Engine.inputA()) {
          // Advance to next line; if past the end, move to the quiz phase
          q.lineIdx++;
          q.spoken = false;
          GameAudio.playMove && GameAudio.playMove();
          if (q.lineIdx >= q.lines.length) {
            q.phase = 'question';
            q.selectedIdx = 0;
            GameAudio.playRegisterBeep && GameAudio.playRegisterBeep();
          }
        }
        return;
      }

      if (q.phase === 'question') {
        const dir = Engine.inputDir();
        if (dir === 'up' && q.selectedIdx > 0) {
          q.selectedIdx--;
          GameAudio.playMove && GameAudio.playMove();
        } else if (dir === 'down' && q.selectedIdx < q.options.length - 1) {
          q.selectedIdx++;
          GameAudio.playMove && GameAudio.playMove();
        }
        if (Engine.inputA()) {
          const picked = q.options[q.selectedIdx];
          q.wasCorrect = !!picked.correct;
          q.answeredIdx = q.selectedIdx;
          q.phase = 'result';
          // Record stats + journal
          try { NPCs.recordCustomerQueueResult(q.id, q.wasCorrect); } catch (e) { /* ignore */ }
          if (q.wasCorrect) {
            GameAudio.playCorrect && GameAudio.playCorrect();
            Engine.spawnSparkles && Engine.spawnSparkles(Engine.CANVAS_W / 2, Engine.CANVAS_H / 2);
            if (typeof onCorrectAnswer === 'function') onCorrectAnswer();
          } else {
            GameAudio.playWrong && GameAudio.playWrong();
            // Log to mistake journal so wrong answers feed spaced repetition
            try {
              NPCs.recordMistake && NPCs.recordMistake({
                clerkJp: q.lines.map(l => l.jp).join(' / '),
                clerkEn: q.question.en,
                wrongJp: picked.jp,
                wrongEn: picked.en,
                correctJp: (q.options.find(o => o.correct) || {}).jp || '',
                correctEn: (q.options.find(o => o.correct) || {}).en || '',
                source: 'CustomerQueue',
              });
            } catch (e) { /* ignore */ }
            if (typeof onWrongAnswer === 'function') onWrongAnswer();
          }
        }
        return;
      }

      if (q.phase === 'result') {
        if (Engine.inputA() || Engine.inputB()) {
          const cb = q.onDismiss;
          state.customerQueue = null;
          GameAudio.playSelect && GameAudio.playSelect();
          if (cb) cb();
        }
        return;
      }
    }

    // Handle greeting response overlay (Improvement #39) -- blocks all other input.
    // The clerk says a greeting in a speech bubble, and the player picks the most
    // natural reply. Teaches the counter-intuitive rule that silent-nod is often correct.
    if (state.greetingResponse) {
      state.greetingResponse.elapsed += dt;
      const gr = state.greetingResponse;
      // Wait for slide-in animation before accepting input
      if (gr.elapsed < 0.4) return;

      // Auto-speak the clerk's line once when the question phase first appears
      if (gr.phase === 'question' && !gr.spoken) {
        gr.spoken = true;
        if (gr.clerkLine) {
          try { GameAudio.speakJapanese && GameAudio.speakJapanese(gr.clerkLine); } catch (e) { /* ignore */ }
        }
      }

      if (gr.phase === 'question') {
        const dir = Engine.inputDir();
        if (dir === 'up' && gr.selectedIdx > 0) {
          gr.selectedIdx--;
          GameAudio.playMove && GameAudio.playMove();
        } else if (dir === 'down' && gr.selectedIdx < gr.options.length - 1) {
          gr.selectedIdx++;
          GameAudio.playMove && GameAudio.playMove();
        }
        if (Engine.inputA()) {
          const picked = gr.options[gr.selectedIdx];
          gr.wasCorrect = !!picked.correct;
          gr.answeredIdx = gr.selectedIdx;
          gr.phase = 'result';
          try { NPCs.recordGreetingResponseResult(gr.id, gr.wasCorrect); } catch (e) { /* ignore */ }
          if (gr.wasCorrect) {
            GameAudio.playCorrect && GameAudio.playCorrect();
            Engine.spawnSparkles && Engine.spawnSparkles(Engine.CANVAS_W / 2, Engine.CANVAS_H / 2);
            if (typeof onCorrectAnswer === 'function') onCorrectAnswer();
          } else {
            GameAudio.playWrong && GameAudio.playWrong();
            try {
              NPCs.recordMistake && NPCs.recordMistake({
                clerkJp: gr.clerkLine,
                clerkEn: gr.clerkEn,
                wrongJp: picked.jp,
                wrongEn: picked.en,
                correctJp: (gr.options.find(o => o.correct) || {}).jp || '',
                correctEn: (gr.options.find(o => o.correct) || {}).en || '',
                source: 'GreetingResponse',
              });
            } catch (e) { /* ignore */ }
            if (typeof onWrongAnswer === 'function') onWrongAnswer();
          }
        }
        return;
      }

      if (gr.phase === 'result') {
        if (Engine.inputA() || Engine.inputB()) {
          const cb = gr.onDismiss;
          state.greetingResponse = null;
          GameAudio.playSelect && GameAudio.playSelect();
          if (cb) cb();
        }
        return;
      }
    }

    // Handle conversation scenario menu overlay
    if (state.conversationMenuOpen) {
      const dir = Engine.inputDir();
      const scenarioList = NPCs.getConversationScenarioList();
      if (dir === 'up' && state.conversationMenuIdx > 0) {
        state.conversationMenuIdx--;
        GameAudio.playMove && GameAudio.playMove();
      } else if (dir === 'down' && state.conversationMenuIdx < scenarioList.length - 1) {
        state.conversationMenuIdx++;
        GameAudio.playMove && GameAudio.playMove();
      }
      if (Engine.inputA()) {
        state.conversationMenuOpen = false;
        GameAudio.playSelect();
        startConversationScenario(scenarioList[state.conversationMenuIdx].id);
      }
      if (Engine.inputB()) {
        state.conversationMenuOpen = false;
        GameAudio.playSelect();
      }
      return;
    }

    // Handle service counter scenario menu overlay
    if (state.serviceCounterMenuOpen) {
      const dir = Engine.inputDir();
      const scenarioList = NPCs.getServiceCounterScenarioList();
      if (dir === 'up' && state.serviceCounterMenuIdx > 0) {
        state.serviceCounterMenuIdx--;
        GameAudio.playMove && GameAudio.playMove();
      } else if (dir === 'down' && state.serviceCounterMenuIdx < scenarioList.length - 1) {
        state.serviceCounterMenuIdx++;
        GameAudio.playMove && GameAudio.playMove();
      }
      if (Engine.inputA()) {
        state.serviceCounterMenuOpen = false;
        GameAudio.playSelect();
        startServiceCounterScenario(scenarioList[state.serviceCounterMenuIdx].id);
      }
      if (Engine.inputB()) {
        state.serviceCounterMenuOpen = false;
        GameAudio.playSelect();
      }
      return;
    }

    // Handle progress dashboard overlay
    if (state.progressDashOpen) {
      if (Engine.inputB() || Engine.wasPressed('p')) {
        state.progressDashOpen = false;
        GameAudio.playSelect();
      }
      return;
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

    // Handle pronunciation guide overlay
    if (pitchGuideState.active) {
      // Check for key presses
      if (Engine.inputA()) { handlePitchGuideInput('a'); return; }
      if (Engine.inputB()) { handlePitchGuideInput('b'); return; }
      if (Engine.wasPressed('p')) { handlePitchGuideInput('p'); return; }
      if (Engine.wasPressed(' ')) { handlePitchGuideInput(' '); return; }
      if (Engine.wasPressed('1')) { handlePitchGuideInput('1'); return; }
      if (Engine.wasPressed('2')) { handlePitchGuideInput('2'); return; }
      if (Engine.wasPressed('3')) { handlePitchGuideInput('3'); return; }
      if (Engine.wasPressed('escape')) { handlePitchGuideInput('Escape'); return; }
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

    // Open progress dashboard with P key (on street map only)
    if (Engine.wasPressed('p') && !Dialogue.isActive() && !state.interacting && state.currentMap === 0) {
      state.progressDashOpen = true;
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

        // Tutorial proximity checks (street map only)
        if (state.currentMap === 0 && !Dialogue.isActive()) {
          checkTutorialProximity();
        }
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

          // Show location name banner (Pokemon-style)
          const bannerColor = STORE_COLORS[targetMap.store] || '#888';
          Engine.showLocationBanner(targetMap.nameJp, targetMap.name, bannerColor);

          // Improvement #40: Roll for a daily-special limited-edition banner.
          // Slides in from the top-right ~3.5s after the location banner so
          // the two don't visually overlap.
          try {
            if (NPCs.shouldTriggerDailySpecial && NPCs.shouldTriggerDailySpecial()) {
              const special = NPCs.pickDailySpecial();
              if (special) {
                setTimeout(() => {
                  try {
                    Engine.showDailySpecialBanner(special, bannerColor);
                    NPCs.markDailySpecialShown(special.id);
                  } catch (e) { /* ignore */ }
                }, 3500);
              }
            }
          } catch (e) { /* daily special is optional -- swallow errors */ }

          // Helper to run the actual clerk greeting (extracted so we can chain
          // it after the optional customer queue overlay).
          const showClerkGreeting = () => {
            if (state.greetingShown) return;
            state.greetingShown = true;
            Dialogue.show('Clerk', 'いらっしゃいませ！', () => {
              GameAudio.speakJapanese('いらっしゃいませ');
              // Try showing a cultural note on store entry
              tryCulturalNote('store_entry');
            });
          };

          // Helper to optionally show the Improvement #39 Greeting Response overlay
          // BEFORE the plain clerk greeting. If it doesn't fire, fall through to
          // the standard clerk greeting line.
          const maybeShowGreetingResponse = (onAfter) => {
            try {
              if (NPCs.shouldTriggerGreetingResponse && NPCs.shouldTriggerGreetingResponse()) {
                const greet = NPCs.buildGreetingResponse();
                if (greet) {
                  state.greetingResponse = {
                    id: greet.id,
                    clerkLine: greet.clerkLine,
                    clerkRomaji: greet.clerkRomaji,
                    clerkEn: greet.clerkEn,
                    context: greet.context,
                    options: greet.options,
                    selectedIdx: 0,
                    wasCorrect: false,
                    answeredIdx: -1,
                    tip: greet.tip,
                    storeName: targetMap.store,
                    storeColor: bannerColor,
                    elapsed: 0,
                    spoken: false,
                    phase: 'question',
                    // After the player dismisses the result, run the normal greeting
                    onDismiss: onAfter,
                  };
                  return true;
                }
              }
            } catch (e) { /* fall through */ }
            return false;
          };

          // Show greeting (or customer queue first, or greeting-response quiz) after fade-in.
          // Priority order on store entry:
          //   1. Customer queue (#38) -- if it fires, then -> greeting-response (#39) -> clerk greeting
          //   2. Greeting-response quiz (#39) -- if it fires, then -> clerk greeting
          //   3. Plain clerk greeting fallback
          setTimeout(() => {
            // Build the chain right-to-left: after the (possible) greeting-response
            // overlay, run the actual showClerkGreeting; after the (possible) customer
            // queue, attempt the greeting-response overlay (and fall through to
            // showClerkGreeting if it doesn't fire).
            const afterQueue = () => {
              if (!maybeShowGreetingResponse(showClerkGreeting)) {
                showClerkGreeting();
              }
            };

            let triggered = false;
            try {
              if (NPCs.shouldTriggerCustomerQueue && NPCs.shouldTriggerCustomerQueue()) {
                const queue = NPCs.buildCustomerQueue();
                if (queue) {
                  state.customerQueue = {
                    id: queue.id,
                    customer: queue.customer,
                    sprite: queue.sprite,
                    lines: queue.lines,
                    lineIdx: 0,
                    phase: 'dialogue',
                    question: queue.question,
                    options: queue.options,
                    selectedIdx: 0,
                    wasCorrect: false,
                    answeredIdx: -1,
                    tip: queue.tip,
                    storeName: targetMap.store,
                    storeColor: bannerColor,
                    elapsed: 0,
                    spoken: false,
                    onDismiss: afterQueue,
                  };
                  triggered = true;
                }
              }
            } catch (e) { /* fall through */ }
            if (!triggered) {
              // No customer queue this time -- try greeting-response, else plain greeting
              afterQueue();
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

        // Auto-save when leaving a store
        autoSave();

        // Show street location banner when exiting
        const streetMap = Maps.allMaps[0];
        if (warp.targetMap === 0 && streetMap) {
          Engine.showLocationBanner(streetMap.nameJp, streetMap.name, '#f1c40f');
        }

        // Tutorial: first store exit -- show progress dashboard hint
        if (warp.targetMap === 0) {
          setTimeout(() => {
            const cw = Engine.CANVAS_W || 256;
            const ch = Engine.CANVAS_H || 224;
            const t1 = TUTORIALS.exitedStore;
            if (showTutorial(t1.id, t1.text, t1.subtext, cw / 2, ch - 40, 'P', 5.0)) {
              // Queue the hotkeys tutorial after this one
              setTimeout(() => {
                const t2 = TUTORIALS.hotkeys;
                showTutorial(t2.id, t2.text, t2.subtext, cw / 2, ch - 40, null, 6.0);
              }, 5500);
            }
          }, 3500); // delay to let location banner finish
        }

        Engine.startFadeIn();
      });
    }
  }

  // ============ TUTORIAL PROXIMITY CHECKS ============
  function checkTutorialProximity() {
    const px = state.player.x;
    const py = state.player.y;
    const cw = Engine.CANVAS_W || 256;
    const ch = Engine.CANVAS_H || 224;

    // Near a store door? (row 2-3 on street map, near warp tiles)
    if (!hasTutorial('near_door') && py <= 4) {
      const warps = Maps.allMaps[0].warps || [];
      for (const w of warps) {
        const dist = Math.abs(px - w.x) + Math.abs(py - w.y);
        if (dist <= 2) {
          const t = TUTORIALS.nearDoor;
          showTutorial(t.id, t.text, t.subtext, cw / 2, ch / 2 + 20, 'Z', 4.0);
          return;
        }
      }
    }

    // Near an NPC? (any NPC within 2 tiles, non-clerk)
    if (!hasTutorial('near_npc')) {
      const npcs = NPCs.getNPCsOnMap(0);
      for (const npc of npcs) {
        if (npc.isClerk) continue;
        const dist = Math.abs(px - npc.x) + Math.abs(py - npc.y);
        if (dist <= 2) {
          const t = TUTORIALS.nearNPC;
          showTutorial(t.id, t.text, t.subtext, cw / 2, ch / 2 + 20, 'Z', 4.0);
          return;
        }
      }
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
    // Check if this is the Speed Round Coach NPC
    if (npc.isSpeedCoach) {
      interactWithSpeedCoach(npc);
      return;
    }
    // Check if this is the Pronunciation Guide NPC
    if (npc.isPronunciationGuide) {
      interactWithPronunciationGuide(npc);
      return;
    }
    // Check if this is the Conversation Practice NPC
    if (npc.isConversationCoach) {
      interactWithConversationCoach(npc);
      return;
    }
    // Check if this is the Service Counter Coach NPC (Tetsuya)
    if (npc.isServiceCoach) {
      interactWithServiceCoach(npc);
      return;
    }
    // Check if this is the Onomatopoeia Coach NPC
    if (npc.isOnomatopoeiaCoach) {
      interactWithOnomatopoeiaCoach(npc);
      return;
    }
    // Check if this is the Night Shift Salaryman NPC
    if (npc.isNightShift) {
      interactWithNightShiftNPC(npc);
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
      onCorrectAnswer();
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
      onWrongAnswer();
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
      autoSave();
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
      onCorrectAnswer();
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
      onWrongAnswer();
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
      autoSave();
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
      onCorrectAnswer();
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
      onWrongAnswer();

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
      autoSave();
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
      onCorrectAnswer();
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
      onWrongAnswer();

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
      autoSave();
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
      onCorrectAnswer();
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
      onWrongAnswer();

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
      autoSave();
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
      onCorrectAnswer();
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
      onWrongAnswer();

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
      autoSave();
    });
  }

  // ============ SPEED ROUND (TIMED RECALL MODE) ============
  const speedGameState = {
    inSpeedRound: false,
    phrases: [],
    currentIdx: 0,
    correct: 0,
    total: 0,
    timerRemaining: 0,   // seconds remaining for current question
    timerMax: 8,         // max seconds per question
    timerActive: false,
    totalElapsed: 0,     // cumulative time spent answering
    roundStartTime: 0,   // performance.now() of round start
    questionStartTime: 0,// performance.now() of question start
    showingResult: false,
    resultTimer: 0,
    resultCorrect: 0,
    resultTotal: 0,
    resultTime: 0,
    resultIsNewBest: false,
  };

  function interactWithSpeedCoach(npc) {
    if (!NPCs.canStartChallenge || Object.keys(NPCs.phraseTracker).length < 4) {
      Dialogue.show('Hayate', [
        'タイムアタック！ I\'m Hayate, the Speed Coach!',
        'You need to learn more phrases before we can race!',
        'Complete some store levels first! がんばって！'
      ]);
      return;
    }

    if (!NPCs.isSpeedRoundReady()) {
      const stats = NPCs.getSpeedRoundStats();
      Dialogue.show('Hayate', [
        'Easy, speedy! Take a short break. 休憩!',
        stats.roundsCompleted > 0
          ? `Best score: ${stats.bestScore}/5 | Rounds: ${stats.roundsCompleted}`
          : 'Come back in a moment for a speed challenge!'
      ]);
      return;
    }

    const phrases = NPCs.buildSpeedRoundQuiz();
    if (phrases.length < 3) {
      Dialogue.show('Hayate', 'Need more phrases to work with. Learn more at the stores!');
      return;
    }

    // Set up speed round state
    speedGameState.inSpeedRound = true;
    speedGameState.phrases = phrases;
    speedGameState.currentIdx = 0;
    speedGameState.correct = 0;
    speedGameState.total = phrases.length;
    speedGameState.timerRemaining = 0;
    speedGameState.timerMax = 8; // 8 seconds per question
    speedGameState.timerActive = false;
    speedGameState.totalElapsed = 0;
    speedGameState.roundStartTime = performance.now();
    speedGameState.showingResult = false;

    const stats = NPCs.getSpeedRoundStats();
    const intro = stats.roundsCompleted > 0
      ? [
          'タイムアタック! Speed Round!',
          `5 questions. 8 seconds each. Beat your best!`,
          stats.bestScore > 0 ? `Current best: ${stats.bestScore}/5` : '',
          '準備はいい？ Ready? GO!'
        ].filter(l => l.length > 0)
      : [
          'タイムアタック！ I\'m Hayate, the Speed Coach!',
          '5 rapid-fire questions. You have 8 seconds each!',
          'Answer fast! Time pressure builds real recall speed!',
          '準備はいい？ Ready? GO!'
        ];

    GameAudio.playAlert();
    Dialogue.show('Hayate', intro, () => {
      runSpeedQuestion();
    });
  }

  function runSpeedQuestion() {
    if (speedGameState.currentIdx >= speedGameState.phrases.length) {
      finishSpeedRound();
      return;
    }

    const phraseData = speedGameState.phrases[speedGameState.currentIdx];
    const interaction = NPCs.getInteractionForPhrase(phraseData);

    if (!interaction) {
      speedGameState.currentIdx++;
      runSpeedQuestion();
      return;
    }

    const qNum = speedGameState.currentIdx + 1;
    const qTotal = speedGameState.total;

    // Start the countdown timer
    speedGameState.timerRemaining = speedGameState.timerMax;
    speedGameState.timerActive = false; // will activate when choices show
    speedGameState.questionStartTime = performance.now();

    // Show the clerk question (brief, no long explanation)
    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      Dialogue.show(`Speed Q${qNum}/${qTotal}`, interaction.clerkJp, () => {
        showSpeedChoices(interaction, phraseData);
      });
    } else if (interaction.playerPrompt) {
      Dialogue.show(`Speed Q${qNum}/${qTotal}`, interaction.playerPrompt, () => {
        showSpeedChoices(interaction, phraseData);
      });
    }
  }

  function showSpeedChoices(interaction, phraseData) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    // Shuffle options
    const shuffled = [...options].sort(() => Math.random() - 0.5);

    // Activate timer NOW when choices appear
    speedGameState.timerActive = true;
    speedGameState.questionStartTime = performance.now();

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      speedGameState.timerActive = false;
      const selected = shuffled[selectedIdx];
      handleSpeedAnswer(interaction, selected, phraseData);
    });
  }

  function handleSpeedAnswer(interaction, selected, phraseData) {
    Dialogue.hideChoices();

    // Calculate time taken for this question
    const questionTime = (performance.now() - speedGameState.questionStartTime) / 1000;
    speedGameState.totalElapsed += questionTime;

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 300);
      GameAudio.playCorrect();
      onCorrectAnswer();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      speedGameState.correct++;
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, true);

      // Speak the correct response
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && responseText !== '[\u4f55\u3082\u8a00\u308f\u306a\u3044]') {
        setTimeout(() => GameAudio.speakJapanese(responseText), 400);
      }

      tryVariableReward();

      // Quick encouragement then move on FAST (speed round!)
      const fast = ['正解!', 'いいね!', '速い!', 'バッチリ!'];
      const msg = fast[Math.floor(Math.random() * fast.length)];

      Dialogue.show('Hayate', msg, () => {
        speedGameState.currentIdx++;
        runSpeedQuestion();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 300);
      GameAudio.playWrong();
      onWrongAnswer();
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, false);

      // Record mistake
      const correctOpt = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOpt ? (correctOpt.text || correctOpt.textJp || '') : '',
        correctEn: correctOpt ? (correctOpt.en || '') : '',
        source: 'Speed Round',
      });

      // Brief wrong answer then move on quickly
      Dialogue.show('Hayate', '残念! Next!', () => {
        speedGameState.currentIdx++;
        runSpeedQuestion();
      });
    }
  }

  function handleSpeedTimeout() {
    // Time's up! Count as wrong
    speedGameState.timerActive = false;
    Dialogue.hideChoices();

    const phraseData = speedGameState.phrases[speedGameState.currentIdx];
    const interaction = NPCs.getInteractionForPhrase(phraseData);

    Dialogue.flash('rgba(231,76,60,0.5)', 400);
    GameAudio.playWrong();
    onWrongAnswer();

    if (interaction && phraseData) {
      NPCs.trackPhrase(phraseData.levelId, phraseData.interactionIdx, false);

      // Record timeout as mistake
      const correctOpt = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: '[時間切れ / Time Up]',
        correctText: correctOpt ? (correctOpt.text || correctOpt.textJp || '') : '',
        correctEn: correctOpt ? (correctOpt.en || '') : '',
        source: 'Speed Round',
      });
    }

    speedGameState.totalElapsed += speedGameState.timerMax;

    Dialogue.show('Hayate', '時間切れ! Time\'s up!', () => {
      speedGameState.currentIdx++;
      runSpeedQuestion();
    });
  }

  function finishSpeedRound() {
    const correct = speedGameState.correct;
    const total = speedGameState.total;
    const totalTime = speedGameState.totalElapsed;

    const result = NPCs.recordSpeedRoundResult(correct, total, totalTime);
    const isNewBest = correct >= result.bestScore && correct > 0;

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    // Show results
    speedGameState.showingResult = true;
    speedGameState.resultTimer = 5.0;
    speedGameState.resultCorrect = correct;
    speedGameState.resultTotal = total;
    speedGameState.resultTime = totalTime;
    speedGameState.resultIsNewBest = isNewBest;

    const pct = correct / total;
    let resultLines;
    if (pct >= 1.0) {
      resultLines = [
        `電光石火! ${correct}/${total} correct!`,
        `Total time: ${totalTime.toFixed(1)} seconds`,
        'Perfect score! You have lightning reflexes!'
      ];
    } else if (pct >= 0.6) {
      resultLines = [
        `速い! ${correct}/${total} correct!`,
        `Total time: ${totalTime.toFixed(1)} seconds`,
        'Keep practicing to get that perfect score!'
      ];
    } else {
      resultLines = [
        `${correct}/${total} correct.`,
        `Total time: ${totalTime.toFixed(1)} seconds`,
        'もっと練習! Review at the stores and try again!'
      ];
    }

    if (isNewBest && result.bestScore > 0) {
      resultLines.push('★ NEW PERSONAL BEST! ★');
    }

    Dialogue.show('Hayate', resultLines, () => {
      speedGameState.inSpeedRound = false;
      speedGameState.showingResult = false;
      speedGameState.phrases = [];
      setTimeout(() => triggerAchievementCheck(), 300);
      autoSave();
    });
  }

  // ============ PRONUNCIATION GUIDE ============
  const pitchGuideState = {
    active: false,
    currentPhrase: null,
    currentIndex: -1,
    inQuiz: false,
    quizQuestions: [],
    quizIdx: 0,
    quizCorrect: 0,
    selectedChoice: -1,
    showingResult: false,
  };

  function interactWithPronunciationGuide(npc) {
    if (!NPCs.isPronunciationReady()) {
      Dialogue.show('Akiko', [
        '\u97f3 (oto) means sound! I\'m Akiko, the Pronunciation Coach!',
        'Complete a store level first, then I\'ll teach you pitch accent.',
        'Japanese melody is key to sounding natural! \u304c\u3093\u3070\u3063\u3066!'
      ]);
      return;
    }

    const stats = NPCs.getPronunciationStats();
    const lesson = NPCs.getNextPitchLesson();
    const introLines = stats.lessonsViewed === 0
      ? [
          '\u97f3 (oto) means sound! I\'m Akiko!',
          'Japanese uses PITCH ACCENT -- the melody of words.',
          'Each mora (sound unit) has a HIGH or LOW pitch.',
          'Getting this right makes you sound truly Japanese!',
          'Let me show you the pattern for a key konbini phrase...'
        ]
      : [
          `\u304a\u304b\u3048\u308a! Studied ${stats.lessonsViewed}/${stats.totalLessons} phrases.`,
          stats.quizTotal > 0
            ? `Quiz accuracy: ${stats.quizCorrect}/${stats.quizTotal} correct!`
            : 'Try quiz mode [P] to test your pitch knowledge!',
          'Let me show you the next phrase...'
        ];

    Dialogue.show('Akiko', introLines, () => {
      // Play the phrase audio
      GameAudio.speakJapanese(lesson.phrase.japanese);
      // Enter pronunciation overlay mode
      pitchGuideState.active = true;
      pitchGuideState.currentPhrase = lesson.phrase;
      pitchGuideState.currentIndex = lesson.index;
      pitchGuideState.inQuiz = false;
      NPCs.recordPitchResult(lesson.index);
    });
  }

  function startPitchQuiz() {
    const questions = NPCs.buildPitchQuiz();
    pitchGuideState.inQuiz = true;
    pitchGuideState.quizQuestions = questions;
    pitchGuideState.quizIdx = 0;
    pitchGuideState.quizCorrect = 0;
    pitchGuideState.selectedChoice = -1;
    pitchGuideState.showingResult = false;
  }

  function handlePitchGuideInput(key) {
    if (!pitchGuideState.active) return false;

    if (!pitchGuideState.inQuiz) {
      // Lesson mode
      if (key === 'a' || key === 'ArrowRight') {
        // Next phrase
        const next = NPCs.getNextPitchLesson();
        pitchGuideState.currentPhrase = next.phrase;
        pitchGuideState.currentIndex = next.index;
        NPCs.recordPitchResult(next.index);
        GameAudio.speakJapanese(next.phrase.japanese);
        return true;
      }
      if (key === 'b' || key === 'Escape') {
        pitchGuideState.active = false;
        return true;
      }
      if (key === 'p') {
        // Enter quiz mode
        startPitchQuiz();
        // Play first question audio
        if (pitchGuideState.quizQuestions.length > 0) {
          GameAudio.speakJapanese(pitchGuideState.quizQuestions[0].phrase.japanese);
        }
        return true;
      }
      // Replay audio with space
      if (key === ' ') {
        GameAudio.speakJapanese(pitchGuideState.currentPhrase.japanese);
        return true;
      }
      return true;
    }

    // Quiz mode
    if (pitchGuideState.showingResult) {
      if (key === 'a' || key === ' ') {
        pitchGuideState.quizIdx++;
        pitchGuideState.showingResult = false;
        pitchGuideState.selectedChoice = -1;
        if (pitchGuideState.quizIdx >= pitchGuideState.quizQuestions.length) {
          // Quiz complete
          const correct = pitchGuideState.quizCorrect;
          const total = pitchGuideState.quizQuestions.length;
          pitchGuideState.inQuiz = false;
          GameAudio.playLevelComplete();

          const pct = correct / total;
          let rating;
          if (pct >= 1.0) rating = '\u5b8c\u74a7! Perfect pitch ear!';
          else if (pct >= 0.66) rating = '\u3044\u3044\u306d! Good hearing!';
          else rating = '\u3082\u3046\u4e00\u56de! Try again!';

          Dialogue.show('Akiko', [
            `Quiz complete: ${correct}/${total} correct!`,
            rating,
            'Keep studying patterns to sound more natural!'
          ], () => {
            pitchGuideState.active = false;
            setTimeout(() => triggerAchievementCheck(), 300);
          });
          return true;
        }
        // Play next question audio
        GameAudio.speakJapanese(pitchGuideState.quizQuestions[pitchGuideState.quizIdx].phrase.japanese);
        return true;
      }
      return true;
    }

    // Selecting answer: 1, 2, 3 keys or arrow keys + A
    const q = pitchGuideState.quizQuestions[pitchGuideState.quizIdx];
    if (!q) return true;

    if (key === '1' || key === '2' || key === '3') {
      const choiceIdx = parseInt(key) - 1;
      if (choiceIdx < q.choices.length) {
        const isCorrect = q.choices[choiceIdx] === q.correctAnswer;
        pitchGuideState.selectedChoice = choiceIdx;
        pitchGuideState.showingResult = true;
        NPCs.recordPitchResult(
          NPCs.PITCH_ACCENT_PHRASES.indexOf(q.phrase),
          isCorrect
        );
        if (isCorrect) {
          pitchGuideState.quizCorrect++;
          GameAudio.playCorrect();
          onCorrectAnswer();
        } else {
          onWrongAnswer();
          NPCs.recordMistake(
            q.phrase.japanese,
            q.phrase.english,
            q.choices[choiceIdx],
            q.correctAnswer,
            'Pitch Quiz'
          );
        }
      }
      return true;
    }

    if (key === 'b' || key === 'Escape') {
      pitchGuideState.inQuiz = false;
      pitchGuideState.active = false;
      return true;
    }

    // Replay audio with space
    if (key === ' ') {
      GameAudio.speakJapanese(q.phrase.japanese);
      return true;
    }

    return true;
  }

  // ============ VARIABLE REWARD TRIGGER ============
  // Called after any correct answer to roll for a bonus phrase reward
  

  // ============ CONVERSATION PRACTICE ============
  const conversationGameState = {
    inConversation: false,
    scenario: null,
    turnIdx: 0,
    correct: 0,
    total: 0,
  };

  function interactWithConversationCoach(npc) {
    if (!NPCs.isConversationPracticeReady()) {
      Dialogue.show('Yuri', [
        '会話 (kaiwa) means conversation!',
        'Complete at least one store level first.',
        'Then come back and we\'ll practice full konbini conversations!',
        '会話練習は一番大事！ Conversation practice is the most important!'
      ]);
      return;
    }

    const stats = NPCs.getConversationStats();

    // Show scenario selection menu
    state.conversationMenuOpen = true;
    state.conversationMenuIdx = 0;
    GameAudio.playAlert();
  }

  function startConversationScenario(scenarioId) {
    const scenario = NPCs.CONVERSATION_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    conversationGameState.inConversation = true;
    conversationGameState.scenario = scenario;
    conversationGameState.turnIdx = 0;
    conversationGameState.correct = 0;
    conversationGameState.total = scenario.turns.length;

    // Preload all Japanese phrases for this scenario
    preloadConversationPhrases(scenario);

    // Intro dialogue
    Dialogue.show('Yuri', [
      `${scenario.emoji} ${scenario.titleJp}! ${scenario.title}`,
      scenario.intro,
      '準備はいい？ Ready? Let\'s go!'
    ], () => {
      runConversationTurn();
    });
  }

  function preloadConversationPhrases(scenario) {
    if (!scenario || !scenario.turns) return;
    const phrases = new Set();
    for (const turn of scenario.turns) {
      if (turn.lineJp) phrases.add(turn.lineJp);
      if (turn.options) {
        for (const opt of turn.options) {
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

  function runConversationTurn() {
    if (conversationGameState.turnIdx >= conversationGameState.scenario.turns.length) {
      finishConversation();
      return;
    }

    const turn = conversationGameState.scenario.turns[conversationGameState.turnIdx];
    const tNum = conversationGameState.turnIdx + 1;
    const tTotal = conversationGameState.total;
    const header = `Turn ${tNum}/${tTotal}`;

    if (turn.speaker === 'clerk' || turn.speaker === 'narrator') {
      // Clerk or narrator speaks first, then quiz
      const lines = [];
      if (turn.lineJp) {
        if (turn.speaker === 'clerk') GameAudio.speakJapanese(turn.lineJp);
        lines.push(turn.lineJp);
      }
      if (turn.lineEn) lines.push(turn.lineEn);
      if (turn.question) lines.push(turn.question);

      const speakerName = turn.speaker === 'clerk' ? 'Clerk' : header;
      Dialogue.show(speakerName, lines, () => {
        showConversationQuiz(turn);
      });
    } else {
      // Player starts (player_start) - just show the question
      const lines = [];
      if (turn.lineEn) lines.push(turn.lineEn);
      if (turn.question) lines.push(turn.question);

      Dialogue.show(header, lines, () => {
        showConversationQuiz(turn);
      });
    }
  }

  function showConversationQuiz(turn) {
    const options = turn.options.map(o => ({
      text: o.text || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    const shuffled = [...options].sort(() => Math.random() - 0.5);

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handleConversationAnswer(turn, selected);
    });
  }

  function handleConversationAnswer(turn, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      onCorrectAnswer();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      conversationGameState.correct++;

      // Speak the player's correct Japanese response
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && !responseText.startsWith('[')) {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      // Roll for variable reward
      tryVariableReward();

      const encouragements = [
        '正解! Correct!', 'いいね! Nice!',
        'スムーズ! Smooth!', '会話上手! Great conversation skills!'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      const explanation = turn.correctExplanation || '';

      Dialogue.show('Yuri', explanation ? [msg, explanation] : msg, () => {
        conversationGameState.turnIdx++;
        runConversationTurn();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      onWrongAnswer();

      // Record in mistake journal
      const correctOpt = turn.options ? turn.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: turn.lineJp || turn.question || '',
        clerkEn: turn.lineEn || '',
        chosenText: selected.text || '',
        correctText: correctOpt ? (correctOpt.text || '') : '',
        correctEn: correctOpt ? (correctOpt.en || '') : '',
        source: 'Conversation',
      });

      const explanation = turn.wrongExplanation || 'Not quite...';
      Dialogue.show('Yuri', [
        'もう一回！ Let\'s try that...',
        explanation
      ], () => {
        conversationGameState.turnIdx++;
        runConversationTurn();
      });
    }
  }

  function finishConversation() {
    const correct = conversationGameState.correct;
    const total = conversationGameState.total;
    const scenario = conversationGameState.scenario;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    NPCs.completeConversationScenario(scenario.id, correct, total);
    const stats = NPCs.getConversationStats();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '完璧! Perfect conversation! ★★★';
    else if (pct >= 60) rating = 'いいね! Good job! ★★☆';
    else rating = 'もう少し! Keep practicing! ★☆☆';

    const resultLines = [
      `Conversation Complete: ${correct}/${total} correct!`,
      rating,
      `Scenarios mastered: ${stats.scenariosUnlocked}/${stats.totalScenarios}`,
    ];

    if (stats.scenariosUnlocked >= stats.totalScenarios) {
      resultLines.push('\u{1F389} 全シナリオクリア！ You\'ve mastered all conversations!');
    } else {
      resultLines.push('Come back to practice more conversations!');
    }

    Dialogue.show('Yuri', resultLines, () => {
      conversationGameState.inConversation = false;
      conversationGameState.scenario = null;
      setTimeout(() => triggerAchievementCheck(), 300);
      autoSave();
    });
  }



  // ============ SERVICE COUNTER PRACTICE ============
  // Tetsuya teaches the konbini lifeline: bills, packages, ATM, tickets
  const serviceCounterGameState = {
    inServiceCounter: false,
    scenario: null,
    turnIdx: 0,
    correct: 0,
    total: 0,
  };

  function interactWithServiceCoach(npc) {
    if (!NPCs.isServiceCounterReady()) {
      Dialogue.show('Tetsuya', [
        'コンビニはライフライン！ The konbini is your lifeline!',
        'Pay bills, pick up packages, use ATMs, buy tickets...',
        'Complete at least one store level first.',
        'Then come back -- I\'ll teach you all four service counter skills!'
      ]);
      return;
    }

    state.serviceCounterMenuOpen = true;
    state.serviceCounterMenuIdx = 0;
    GameAudio.playAlert();
  }

  function startServiceCounterScenario(scenarioId) {
    const scenario = NPCs.SERVICE_COUNTER_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    serviceCounterGameState.inServiceCounter = true;
    serviceCounterGameState.scenario = scenario;
    serviceCounterGameState.turnIdx = 0;
    serviceCounterGameState.correct = 0;
    serviceCounterGameState.total = scenario.turns.length;

    // Preload all Japanese phrases for this scenario
    preloadServiceCounterPhrases(scenario);

    Dialogue.show('Tetsuya', [
      `${scenario.emoji} ${scenario.titleJp}! ${scenario.title}`,
      scenario.intro,
      'いきましょう！ Let\'s go!'
    ], () => {
      runServiceCounterTurn();
    });
  }

  function preloadServiceCounterPhrases(scenario) {
    if (!scenario || !scenario.turns) return;
    const phrases = new Set();
    for (const turn of scenario.turns) {
      if (turn.lineJp) phrases.add(turn.lineJp);
      if (turn.options) {
        for (const opt of turn.options) {
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

  function runServiceCounterTurn() {
    if (serviceCounterGameState.turnIdx >= serviceCounterGameState.scenario.turns.length) {
      finishServiceCounter();
      return;
    }

    const turn = serviceCounterGameState.scenario.turns[serviceCounterGameState.turnIdx];
    const tNum = serviceCounterGameState.turnIdx + 1;
    const tTotal = serviceCounterGameState.total;
    const header = `Turn ${tNum}/${tTotal}`;

    if (turn.speaker === 'clerk' || turn.speaker === 'narrator') {
      const lines = [];
      if (turn.lineJp) {
        if (turn.speaker === 'clerk') GameAudio.speakJapanese(turn.lineJp);
        lines.push(turn.lineJp);
      }
      if (turn.lineEn) lines.push(turn.lineEn);
      if (turn.question) lines.push(turn.question);

      const speakerName = turn.speaker === 'clerk' ? 'Clerk' : header;
      Dialogue.show(speakerName, lines, () => {
        showServiceCounterQuiz(turn);
      });
    } else {
      const lines = [];
      if (turn.lineEn) lines.push(turn.lineEn);
      if (turn.question) lines.push(turn.question);

      Dialogue.show(header, lines, () => {
        showServiceCounterQuiz(turn);
      });
    }
  }

  function showServiceCounterQuiz(turn) {
    const options = turn.options.map(o => ({
      text: o.text || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    const shuffled = [...options].sort(() => Math.random() - 0.5);

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handleServiceCounterAnswer(turn, selected);
    });
  }

  function handleServiceCounterAnswer(turn, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      onCorrectAnswer();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      serviceCounterGameState.correct++;

      // Speak correct Japanese response
      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && !responseText.startsWith('[')) {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      tryVariableReward();

      const encouragements = [
        '正解! Correct!', 'いいね! Nice!',
        'スムーズ! Smooth!', 'サービス上手! Great service skills!'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      const explanation = turn.correctExplanation || '';

      Dialogue.show('Tetsuya', explanation ? [msg, explanation] : msg, () => {
        serviceCounterGameState.turnIdx++;
        runServiceCounterTurn();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      onWrongAnswer();

      const correctOpt = turn.options ? turn.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: turn.lineJp || turn.question || '',
        clerkEn: turn.lineEn || '',
        chosenText: selected.text || '',
        correctText: correctOpt ? (correctOpt.text || '') : '',
        correctEn: correctOpt ? (correctOpt.en || '') : '',
        source: 'ServiceCounter',
      });

      const explanation = turn.wrongExplanation || 'Not quite...';
      Dialogue.show('Tetsuya', [
        'もう一回! Let\'s think again...',
        explanation
      ], () => {
        serviceCounterGameState.turnIdx++;
        runServiceCounterTurn();
      });
    }
  }

  function finishServiceCounter() {
    const correct = serviceCounterGameState.correct;
    const total = serviceCounterGameState.total;
    const scenario = serviceCounterGameState.scenario;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    NPCs.completeServiceCounterScenario(scenario.id, correct, total);
    const stats = NPCs.getServiceCounterStats();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '完璧! Perfect service! ★★★';
    else if (pct >= 60) rating = 'いいね! Good job! ★★☆';
    else rating = 'もう少し! Keep practicing! ★☆☆';

    const resultLines = [
      `Service Counter: ${correct}/${total} correct!`,
      rating,
      `Skills mastered: ${stats.scenariosUnlocked}/${stats.totalScenarios}`,
    ];

    if (stats.scenariosUnlocked >= stats.totalScenarios) {
      resultLines.push('\u{1F389} サービスマスター! You\'ve mastered all konbini services!');
    } else {
      resultLines.push('Come back to learn more services!');
    }

    Dialogue.show('Tetsuya', resultLines, () => {
      serviceCounterGameState.inServiceCounter = false;
      serviceCounterGameState.scenario = null;
      setTimeout(() => triggerAchievementCheck(), 300);
      autoSave();
    });
  }



  // ============ ONOMATOPOEIA COACH ============
  const onomatopoeiaGameState = {
    inOnomatopoeia: false,
    lesson: null,
    interactionIdx: 0,
    correct: 0,
    total: 0,
  };

  function interactWithOnomatopoeiaCoach(npc) {
    if (!NPCs.isOnomatopoeiaPracticeReady()) {
      Dialogue.show('Mimi', [
        '擬音語 (giongo) are sound words!',
        'Complete at least one store level first.',
        'Then come back and I\'ll teach you the sounds of the konbini!',
        'ピッピッ、チン、ガチャ... sounds are everywhere!'
      ]);
      return;
    }

    const stats = NPCs.getOnomatopoeiaStats();
    const lesson = NPCs.getNextOnomatopoeiaLesson();

    if (!lesson) {
      Dialogue.show('Mimi', 'Something went wrong... come back later!');
      return;
    }

    // Set up onomatopoeia practice state
    onomatopoeiaGameState.inOnomatopoeia = true;
    onomatopoeiaGameState.lesson = lesson;
    onomatopoeiaGameState.interactionIdx = 0;
    onomatopoeiaGameState.correct = 0;
    onomatopoeiaGameState.total = lesson.interactions.length;

    // Preload Japanese phrases
    preloadOnomatopoeiaPhrases(lesson);

    const isNew = stats.completed === 0;
    const introLines = isNew
      ? [
          '擬音語レッスンへようこそ! Welcome to Onomatopoeia Lessons!',
          'I\'m Mimi! Japanese has hundreds of sound and texture words.',
          'They make your speech vivid and natural -- textbooks barely cover them!',
          `Today: ${lesson.topicJp} -- ${lesson.topic}!`,
          lesson.intro
        ]
      : [
          `${lesson.topicJp}! ${lesson.topic}`,
          `Practice ${stats.completed + 1} | ${stats.topicsUnlocked}/${stats.totalTopics} topics learned`,
          lesson.intro
        ];

    GameAudio.playAlert();
    Dialogue.show('Mimi', introLines, () => {
      runOnomatopoeiaInteraction();
    });
  }

  function preloadOnomatopoeiaPhrases(lesson) {
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

  function runOnomatopoeiaInteraction() {
    if (onomatopoeiaGameState.interactionIdx >= onomatopoeiaGameState.lesson.interactions.length) {
      finishOnomatopoeiaLesson();
      return;
    }

    const interaction = onomatopoeiaGameState.lesson.interactions[onomatopoeiaGameState.interactionIdx];
    const qNum = onomatopoeiaGameState.interactionIdx + 1;
    const qTotal = onomatopoeiaGameState.total;
    const topic = onomatopoeiaGameState.lesson.topic;
    const header = `${topic} ${qNum}/${qTotal}`;

    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      const lines = [interaction.clerkJp];
      if (interaction.clerkRomaji) lines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
      if (interaction.tip) lines.push(interaction.tip);
      if (interaction.question) lines.push(interaction.question);

      Dialogue.show(header, lines, () => {
        showOnomatopoeiaQuiz(interaction);
      });
    } else {
      showOnomatopoeiaQuiz(interaction);
    }
  }

  function showOnomatopoeiaQuiz(interaction) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    const shuffled = [...options].sort(() => Math.random() - 0.5);

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handleOnomatopoeiaAnswer(interaction, selected);
    });
  }

  function handleOnomatopoeiaAnswer(interaction, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      onCorrectAnswer();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      onomatopoeiaGameState.correct++;

      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && !responseText.startsWith('[')) {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      tryVariableReward();

      const encouragements = [
        '正解! Correct!', 'いいね! Nice!',
        '音の達人! Sound master!', 'よくできました! Well done!',
        'すごい! Amazing ear!'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      const explanation = interaction.correctExplanation || '';

      Dialogue.show('Mimi', explanation ? [msg, explanation] : msg, () => {
        onomatopoeiaGameState.interactionIdx++;
        runOnomatopoeiaInteraction();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      onWrongAnswer();

      // Record in mistake journal
      const correctOpt = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOpt ? (correctOpt.text || correctOpt.textJp || '') : '',
        correctEn: correctOpt ? (correctOpt.en || '') : '',
        source: 'Onomatopoeia',
      });

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('Mimi', [
        'もう一回! Let me explain...',
        explanation
      ], () => {
        onomatopoeiaGameState.interactionIdx++;
        runOnomatopoeiaInteraction();
      });
    }
  }

  function finishOnomatopoeiaLesson() {
    const correct = onomatopoeiaGameState.correct;
    const total = onomatopoeiaGameState.total;
    const lesson = onomatopoeiaGameState.lesson;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    NPCs.completeOnomatopoeiaLesson(lesson.id);
    const stats = NPCs.getOnomatopoeiaStats();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '完璧! Sound word master! ★★★';
    else if (pct >= 50) rating = 'いいね! Good listening! ★★☆';
    else rating = 'もう少し! Keep your ears open! ★☆☆';

    const resultLines = [
      `Lesson Complete: ${correct}/${total} correct!`,
      rating,
      `Topics mastered: ${stats.topicsUnlocked}/${stats.totalTopics}`,
    ];

    if (stats.topicsUnlocked >= stats.totalTopics) {
      resultLines.push('全トピッククリア! You know all the konbini sounds!');
      resultLines.push('Japanese people will be impressed by your natural sound words!');
    } else {
      resultLines.push('Come back to learn more sound words!');
    }

    Dialogue.show('Mimi', resultLines, () => {
      onomatopoeiaGameState.inOnomatopoeia = false;
      onomatopoeiaGameState.lesson = null;
      setTimeout(() => triggerAchievementCheck(), 300);
      autoSave();
    });
  }

  // ============ NIGHT SHIFT SALARYMAN ============
  const nightShiftGameState = {
    inNightShift: false,
    lesson: null,
    interactionIdx: 0,
    correct: 0,
    total: 0,
  };

  function interactWithNightShiftNPC(npc) {
    if (!NPCs.isNightShiftPracticeReady()) {
      Dialogue.show('Suzuki', [
        '*yawn* おつかれさまです...',
        'You look new around here... complete at least 2 store levels first.',
        'Then come find me at night. I\'ll teach you the real konbini...',
        '*takes a sip of Strong Zero*'
      ]);
      return;
    }

    const stats = NPCs.getNightShiftStats();
    const lesson = NPCs.getNextNightShiftLesson();

    if (!lesson) {
      Dialogue.show('Suzuki', 'Something went wrong... come back later!');
      return;
    }

    // Set up night shift practice state
    nightShiftGameState.inNightShift = true;
    nightShiftGameState.lesson = lesson;
    nightShiftGameState.interactionIdx = 0;
    nightShiftGameState.correct = 0;
    nightShiftGameState.total = lesson.interactions.length;

    // Preload Japanese phrases
    preloadNightShiftPhrases(lesson);

    const isNew = stats.completed === 0;
    const introLines = isNew
      ? [
          '*stretches* 深夜のコンビニへようこそ... Welcome to the night shift...',
          'I\'m Suzuki. Salaryman by day, konbini regular by night.',
          'After midnight, the konbini becomes a different world.',
          `Tonight\'s lesson: ${lesson.topicJp}`,
          lesson.intro
        ]
      : [
          `*nods* ${lesson.topicJp}`,
          `Lesson ${stats.completed + 1} | ${stats.topicsUnlocked}/${stats.totalTopics} night topics learned`,
          lesson.intro
        ];

    GameAudio.playAlert();
    Dialogue.show('Suzuki', introLines, () => {
      runNightShiftInteraction();
    });
  }

  function preloadNightShiftPhrases(lesson) {
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

  function runNightShiftInteraction() {
    if (nightShiftGameState.interactionIdx >= nightShiftGameState.lesson.interactions.length) {
      finishNightShiftLesson();
      return;
    }

    const interaction = nightShiftGameState.lesson.interactions[nightShiftGameState.interactionIdx];
    const qNum = nightShiftGameState.interactionIdx + 1;
    const qTotal = nightShiftGameState.total;
    const topic = nightShiftGameState.lesson.topic;
    const header = `🌙 ${topic} ${qNum}/${qTotal}`;

    if (interaction.clerkJp) {
      GameAudio.speakJapanese(interaction.clerkJp);
      const lines = [interaction.clerkJp];
      if (interaction.clerkRomaji) lines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
      if (interaction.tip) lines.push(interaction.tip);
      if (interaction.question) lines.push(interaction.question);

      Dialogue.show(header, lines, () => {
        showNightShiftQuiz(interaction);
      });
    } else {
      showNightShiftQuiz(interaction);
    }
  }

  function showNightShiftQuiz(interaction) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    const shuffled = [...options].sort(() => Math.random() - 0.5);

    Dialogue.showChoices(shuffled, (selectedIdx) => {
      const selected = shuffled[selectedIdx];
      handleNightShiftAnswer(interaction, selected);
    });
  }

  function handleNightShiftAnswer(interaction, selected) {
    Dialogue.hideChoices();

    if (selected.correct) {
      Dialogue.flash('rgba(46,204,113,0.5)', 400);
      GameAudio.playCorrect();
      onCorrectAnswer();
      GameAudio.playRegisterBeep();
      Engine.spawnSparkles();
      nightShiftGameState.correct++;

      const responseText = selected.text || '';
      if (/[\u3000-\u9fff\uff00-\uffef]/.test(responseText) && !responseText.startsWith('[')) {
        setTimeout(() => GameAudio.speakJapanese(responseText), 500);
      }

      tryVariableReward();

      const encouragements = [
        '正解! Not bad for a rookie!', 'おお！You know your stuff!',
        'さすが！Impressive night owl!', 'いいね! You\'re learning fast!',
        '完璧! Even I\'m impressed... *hic*'
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      const explanation = interaction.correctExplanation || '';

      Dialogue.show('Suzuki', explanation ? [msg, explanation] : msg, () => {
        nightShiftGameState.interactionIdx++;
        runNightShiftInteraction();
      });
    } else {
      Dialogue.flash('rgba(231,76,60,0.5)', 400);
      GameAudio.playWrong();
      onWrongAnswer();

      // Record in mistake journal
      const correctOpt = interaction.options ? interaction.options.find(o => o.correct) : null;
      NPCs.recordMistake({
        clerkJp: interaction.clerkJp || '',
        clerkEn: interaction.clerkEn || '',
        chosenText: selected.text || selected.textJp || '',
        correctText: correctOpt ? (correctOpt.text || correctOpt.textJp || '') : '',
        correctEn: correctOpt ? (correctOpt.en || '') : '',
        source: 'Night Shift',
      });

      const explanation = interaction.wrongExplanation || 'Not quite...';
      Dialogue.show('Suzuki', [
        '*shakes head* ちがうよ... Let me explain...',
        explanation
      ], () => {
        nightShiftGameState.interactionIdx++;
        runNightShiftInteraction();
      });
    }
  }

  function finishNightShiftLesson() {
    const correct = nightShiftGameState.correct;
    const total = nightShiftGameState.total;
    const lesson = nightShiftGameState.lesson;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;

    NPCs.completeNightShiftLesson(lesson.id);
    const stats = NPCs.getNightShiftStats();

    GameAudio.playLevelComplete();
    Engine.spawnStarBurst();

    let rating;
    if (pct === 100) rating = '完璧! True night owl! ★★★';
    else if (pct >= 50) rating = '悪くない! Not bad for a beginner! ★★☆';
    else rating = 'もう少し! Come back tomorrow night! ★☆☆';

    const resultLines = [
      `Night Lesson Complete: ${correct}/${total} correct!`,
      rating,
      `Night topics mastered: ${stats.topicsUnlocked}/${stats.totalTopics}`,
    ];

    if (stats.topicsUnlocked >= stats.totalTopics) {
      resultLines.push('深夜の達人! You\'ve mastered midnight konbini culture!');
      resultLines.push('Even salarymen would be impressed. おつかれさま!');
    } else {
      resultLines.push('*finishes Strong Zero* Come back next night for more...');
    }

    Dialogue.show('Suzuki', resultLines, () => {
      nightShiftGameState.inNightShift = false;
      nightShiftGameState.lesson = null;
      setTimeout(() => triggerAchievementCheck(), 300);
      autoSave();
    });
  }


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
      onCorrectAnswer();
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
      onWrongAnswer();
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

    // Tutorial: first quiz encounter
    if (!hasTutorial('first_quiz')) {
      const cw = Engine.CANVAS_W || 256;
      const t = TUTORIALS.firstQuiz;
      showTutorial(t.id, t.text, t.subtext, cw / 2, 30, null, 4.0);
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
      onCorrectAnswer();
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
      onWrongAnswer();
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

    // Build the konbini receipt for this transaction. Real konbini print a
    // receipt for every purchase -- this gives the player a satisfying paper
    // trail and reinforces price/tax vocabulary (合計, お預かり, お釣り, etc.)
    const receiptData = NPCs.buildReceiptData(level.id, store, state.interactionMistakes);

    // Helper to show the level-complete dialogue after the receipt is dismissed
    const showLevelCompleteDialogue = () => {
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
        // Auto-save after completing a level
        autoSave();
      });
    };

    if (receiptData) {
      // Slight delay so the cash register sound finishes before the printer
      // "prints" the receipt -- mimics the real konbini transaction rhythm
      setTimeout(() => {
        // Print sound (re-use register beep series as printer tick)
        if (GameAudio.playRegisterBeep) GameAudio.playRegisterBeep();
        state.receiptOverlay = {
          data: receiptData,
          elapsed: 0,
          onDismiss: showLevelCompleteDialogue,
        };
      }, 700);
    } else {
      showLevelCompleteDialogue();
    }
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
      Engine.renderTitle(state.hasSaveData, state.titleMenuIdx);
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
    if (!state.stampCardOpen && !state.phraseBookOpen && !state.inventoryOpen && !state.achievementOpen && !state.mistakeJournalOpen && !state.culturalNotesOpen && !state.conversationMenuOpen && !state.serviceCounterMenuOpen && !state.progressDashOpen && !state.receiptOverlay && !state.customerQueue && !pitchGuideState.active && !Dialogue.isActive()) {
      Engine.renderMiniMap(state.currentMap, state.player.x, state.player.y, state.time);
    }

    // Writing mode badge (only during store interactions)
    if (state.interacting && state.currentInteractionLevel) {
      renderWritingModeBadge(ctx);
    }

    // Dialogue
    Dialogue.render(ctx);

    // Speed round timer bar (above dialogue, during speed round choices)
    if (speedGameState.inSpeedRound && speedGameState.timerActive) {
      Sprites.drawSpeedTimer(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        speedGameState.timerRemaining,
        speedGameState.timerMax,
        speedGameState.currentIdx + 1,
        speedGameState.total
      );
    }

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

    // Conversation scenario selection menu
    if (state.conversationMenuOpen) {
      const scenarioList = NPCs.getConversationScenarioList();
      const stats = NPCs.getConversationStats();
      Sprites.drawConversationMenu(ctx, Engine.CANVAS_W, Engine.CANVAS_H, scenarioList, state.conversationMenuIdx, stats);
    }

    // Service Counter scenario selection menu
    if (state.serviceCounterMenuOpen) {
      const scenarioList = NPCs.getServiceCounterScenarioList();
      const stats = NPCs.getServiceCounterStats();
      Sprites.drawServiceCounterMenu(ctx, Engine.CANVAS_W, Engine.CANVAS_H, scenarioList, state.serviceCounterMenuIdx, stats);
    }

    // Cultural notes collection overlay
    if (state.culturalNotesOpen) {
      Sprites.drawCulturalNotesOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        NPCs.getAllCulturalNotes(),
        state.time
      );
    }

    // Progress dashboard overlay
    if (state.progressDashOpen) {
      Sprites.drawProgressDashboard(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        NPCs.getProgressDashboard(),
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

    // Pronunciation guide overlay
    if (pitchGuideState.active) {
      if (pitchGuideState.inQuiz) {
        // Quiz mode rendering
        const q = pitchGuideState.quizQuestions[pitchGuideState.quizIdx];
        if (q) {
          // Draw the phrase with pitch diagram
          Sprites.drawPronunciationOverlay(
            ctx, Engine.CANVAS_W, Engine.CANVAS_H,
            q.phrase,
            pitchGuideState.quizIdx + 1,
            pitchGuideState.quizQuestions.length
          );
          // Draw quiz choices on top
          const panelW = Math.min(Engine.CANVAS_W - 20, 320);
          const px = (Engine.CANVAS_W - panelW) / 2;
          const py = 20;
          const panelH = Engine.CANVAS_H - 40;

          // Override title to say QUIZ
          ctx.fillStyle = '#4a1a6b';
          ctx.fillRect(px, py, panelW, 22);
          ctx.font = '10px monospace';
          ctx.fillStyle = '#f39c12';
          const qTitle = `PITCH QUIZ  Q${pitchGuideState.quizIdx + 1}/${pitchGuideState.quizQuestions.length}`;
          const qtW = ctx.measureText(qTitle).width;
          ctx.fillText(qTitle, px + (panelW - qtW) / 2, py + 15);

          // Question label
          ctx.font = '8px monospace';
          ctx.fillStyle = '#ccc';
          const qLabel = 'What pitch accent pattern is this?';
          const qlW = ctx.measureText(qLabel).width;
          ctx.fillText(qLabel, px + (panelW - qlW) / 2, py + panelH - 75);

          // Draw choices
          for (let i = 0; i < q.choices.length; i++) {
            const cy = py + panelH - 60 + i * 16;
            const choiceText = `[${i + 1}] ${q.choices[i]}`;

            if (pitchGuideState.showingResult) {
              const isCorrect = q.choices[i] === q.correctAnswer;
              const isSelected = i === pitchGuideState.selectedChoice;
              if (isCorrect) {
                ctx.fillStyle = '#2ecc71';
              } else if (isSelected) {
                ctx.fillStyle = '#e74c3c';
              } else {
                ctx.fillStyle = '#555';
              }
            } else {
              ctx.fillStyle = '#fff';
            }
            ctx.fillText(choiceText, px + 16, cy);
          }

          // Show result text
          if (pitchGuideState.showingResult) {
            const wasRight = q.choices[pitchGuideState.selectedChoice] === q.correctAnswer;
            ctx.font = '8px monospace';
            ctx.fillStyle = wasRight ? '#2ecc71' : '#e74c3c';
            const resultText = wasRight ? '\u6b63\u89e3! Correct! [A] Next' : '\u6b8b\u5ff5... Wrong! [A] Next';
            const rtW = ctx.measureText(resultText).width;
            ctx.fillText(resultText, px + (panelW - rtW) / 2, py + panelH - 8);
          } else {
            ctx.font = '7px monospace';
            ctx.fillStyle = '#666';
            const hint2 = '[1/2/3] Choose  [Space] Replay audio  [B] Quit';
            const h2W = ctx.measureText(hint2).width;
            ctx.fillText(hint2, px + (panelW - h2W) / 2, py + panelH - 8);
          }
        }
      } else {
        // Lesson mode rendering
        Sprites.drawPronunciationOverlay(
          ctx, Engine.CANVAS_W, Engine.CANVAS_H,
          pitchGuideState.currentPhrase,
          pitchGuideState.currentIndex + 1,
          NPCs.PITCH_ACCENT_PHRASES.length
        );
      }
    }

    // Achievement unlock notification banner
    if (state.achievementNotification) {
      Sprites.drawAchievementBanner(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        state.achievementNotification.achievement,
        state.achievementNotification.timer
      );
    }

    // Combo counter (persistent, above overlays)
    if (state.combo >= 2 && !state.stampCardOpen && !state.phraseBookOpen && !state.inventoryOpen && !state.achievementOpen && !state.mistakeJournalOpen && !state.culturalNotesOpen && !state.progressDashOpen) {
      Sprites.drawComboCounter(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        state.combo, state.comboTimer, state.maxCombo, 1
      );
    }

    // Combo milestone banner (hidden during overlays)
    if (state.comboMilestone && !state.stampCardOpen && !state.phraseBookOpen && !state.inventoryOpen && !state.achievementOpen && !state.mistakeJournalOpen && !state.culturalNotesOpen && !state.progressDashOpen) {
      Sprites.drawComboMilestoneBanner(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        state.comboMilestone.combo, state.comboMilestone.timer
      );
    }

    // Konbini receipt overlay (above everything except particles/fade/save)
    if (state.receiptOverlay) {
      Sprites.drawKonbiniReceipt(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        Object.assign({}, state.receiptOverlay.data, { elapsed: state.receiptOverlay.elapsed }),
        state.time
      );
    }

    // Greeting response overlay (#39) -- mutually exclusive with customer queue
    if (state.greetingResponse) {
      Sprites.drawGreetingResponseOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        state.greetingResponse,
        state.time,
      );
    }

    // Customer queue overlay (above scene, below particles/fade/banners)
    if (state.customerQueue) {
      Sprites.drawCustomerQueueOverlay(
        ctx, Engine.CANVAS_W, Engine.CANVAS_H,
        state.customerQueue,
        state.time
      );
    }

    // Particle effects (sparkles + star bursts — above dialogue/overlays)
    Engine.renderParticles(state.time);

    // Tutorial bubble (above scene, below banners/fade)
    Engine.renderTutorialBubble();

    // Location name banner (above scene, below door/fade)
    Engine.renderLocationBanner();
    Engine.renderDailySpecialBanner();

    // Sliding door animation overlay (above scene, below fade)
    Engine.renderDoorAnimation();

    // Fade overlay (always on top)
    Engine.renderFade();

    // Save indicator (very top layer)
    Engine.renderSaveIndicator();
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
      // Progress dashboard
      progressDashOpen: state.progressDashOpen,
      // Combo counter
      combo: state.combo,
      maxCombo: state.maxCombo,
      comboMilestone: state.comboMilestone ? state.comboMilestone.combo : null,
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

  // Testing hook: toggle progress dashboard
  window.toggleProgressDash = () => {
    state.progressDashOpen = !state.progressDashOpen;
  };

  // Testing hook: force a customer queue overlay (Improvement #38)
  window.forceCustomerQueue = (opts) => {
    opts = opts || {};
    let queue;
    try { queue = NPCs.buildCustomerQueue(); } catch (e) { console.warn(e); return; }
    if (!queue) return;
    state.customerQueue = {
      id: queue.id,
      customer: queue.customer,
      sprite: queue.sprite,
      lines: queue.lines,
      lineIdx: 0,
      phase: 'dialogue',
      question: queue.question,
      options: queue.options,
      selectedIdx: 0,
      wasCorrect: false,
      answeredIdx: -1,
      tip: queue.tip,
      storeName: opts.storeName || '7-Eleven',
      storeColor: opts.storeColor || '#d4380d',
      elapsed: 0,
      spoken: false,
      onDismiss: () => { console.log('queue dismissed'); },
    };
    return state.customerQueue;
  };

  // Testing hook: force a greeting response overlay (Improvement #39)
  window.forceGreetingResponse = (opts) => {
    opts = opts || {};
    let greet;
    try { greet = NPCs.buildGreetingResponse(); } catch (e) { console.warn(e); return; }
    if (!greet) return;
    state.greetingResponse = {
      id: greet.id,
      clerkLine: greet.clerkLine,
      clerkRomaji: greet.clerkRomaji,
      clerkEn: greet.clerkEn,
      context: greet.context,
      options: greet.options,
      selectedIdx: 0,
      wasCorrect: false,
      answeredIdx: -1,
      tip: greet.tip,
      storeName: opts.storeName || '7-Eleven',
      storeColor: opts.storeColor || '#b67dd9',
      elapsed: 0,
      spoken: false,
      phase: 'question',
      onDismiss: () => { console.log('greeting response dismissed'); },
    };
    return state.greetingResponse;
  };

  // Testing hook: force the weather type (Improvement #42)
  // Usage: window.forceWeather('clear' | 'cherry_blossoms' | 'rain' | 'night')
  window.forceWeather = (t) => {
    if (Engine && Engine.setWeatherType) Engine.setWeatherType(t);
    return Engine.getWeatherType();
  };

  // Testing hook: force the time-of-day bucket (Improvement #41)
  // Usage: window.forceTimeOfDay('morning' | 'midday' | 'evening' | 'night' | null)
  window.forceTimeOfDay = (bucket) => {
    NPCs.setTimeOfDayOverride(bucket || null);
    return NPCs.getTimeOfDayBucket();
  };

  // Testing hook: force weekday vs weekend (Improvement #43)
  // Usage: window.forceDayType('weekday' | 'weekend' | null)
  window.forceDayType = (bucket) => {
    NPCs.setDayTypeOverride(bucket || null);
    return NPCs.getDayTypeBucket();
  };

  // Testing hook: force a daily-special banner (Improvement #40)
  window.forceDailySpecial = (opts) => {
    opts = opts || {};
    let special;
    if (opts.id) {
      // Look up a specific special by id
      special = (NPCs.DAILY_SPECIALS || []).find(s => s.id === opts.id);
    }
    if (!special) {
      try { special = NPCs.pickDailySpecial(); } catch (e) { console.warn(e); return; }
    }
    if (!special) return;
    Engine.showDailySpecialBanner(special, opts.storeColor || '#ff6b9d');
    NPCs.markDailySpecialShown(special.id);
    return special;
  };

  // Testing hook: set combo for visual testing
  window.setCombo = (n) => {
    state.combo = n;
    state.maxCombo = Math.max(state.maxCombo, n);
    state.comboDecayTimer = COMBO_DECAY_TIME;
    state.comboTimer = 0;
    if (COMBO_MILESTONES.includes(n)) {
      state.comboMilestone = { combo: n, timer: 2.5 };
    }
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

  // Test and reset tutorial bubbles
  window.testTutorial = (id) => {
    const t = TUTORIALS[id || 'firstSteps'];
    if (!t) { console.log('Available:', Object.keys(TUTORIALS).join(', ')); return; }
    const cw = Engine.CANVAS_W || 256;
    const ch = Engine.CANVAS_H || 224;
    Engine.showTutorialBubble(t.text, t.subtext, cw / 2, ch / 2, t.id === 'near_door' ? 'Z' : null, 5.0);
  };
  window.resetTutorials = () => {
    tutorialsSeen = {};
    try { LS.removeItem(TUT_KEY); } catch (e) { /* ignore */ }
    console.log('Tutorials reset! They will show again.');
  };

  // Test location banners from console
  window.testLocationBanner = (store) => {
    const stores = {
      '7-Eleven': { jp: 'セブンイレブン', en: '7-Eleven', color: '#d4380d' },
      'Lawson': { jp: 'ローソン', en: 'Lawson', color: '#1a6fc4' },
      'FamilyMart': { jp: 'ファミリーマート', en: 'FamilyMart', color: '#27ae60' },
      'street': { jp: 'コンビニ通り', en: 'Konbini Street', color: '#f1c40f' },
    };
    const s = stores[store] || stores['7-Eleven'];
    Engine.showLocationBanner(s.jp, s.en, s.color);
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
