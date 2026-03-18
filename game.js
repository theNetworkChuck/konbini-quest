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
      Dialogue.pressB();
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
    const dialogue = NPCs.getStreetDialogue(npc);
    Dialogue.show(npc.name, dialogue);
  }

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

    runInteraction();
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

    // Determine what to show first
    if (interaction.clerkJp) {
      // Clerk speaks Japanese
      GameAudio.speakJapanese(interaction.clerkJp);

      const lines = [];
      lines.push(interaction.clerkJp);
      if (interaction.clerkRomaji) lines.push(interaction.clerkRomaji);
      if (interaction.clerkEn) lines.push(interaction.clerkEn);
      if (interaction.question) lines.push(interaction.question);
      if (interaction.tip) lines.push(interaction.tip);

      Dialogue.show('Clerk', lines, () => {
        showQuiz(interaction);
      });
    } else if (interaction.playerPrompt) {
      // Player needs to initiate
      Dialogue.show('Guide', interaction.playerPrompt, () => {
        if (interaction.tip) {
          Dialogue.show('Tip', interaction.tip, () => {
            showQuiz(interaction);
          });
        } else {
          showQuiz(interaction);
        }
      });
    }
  }

  function showQuiz(interaction) {
    const options = interaction.options.map(o => ({
      text: o.text || o.textJp || '',
      correct: o.correct,
      romaji: o.romaji,
      en: o.en,
    }));

    // Show the question context if available
    const contextLine = interaction.question || 'Choose your response:';
    Dialogue.show('', contextLine, () => {
      Dialogue.showChoices(options, (selectedIdx) => {
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

    GameAudio.playLevelComplete();
    GameAudio.playStar();

    const starText = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    Dialogue.show('', [
      `Level Complete: ${level.name}!`,
      `${starText}`,
      NPCs.isStoreComplete(store)
        ? `You've mastered ${store}!`
        : `Next level unlocked!`
    ], () => {
      state.interacting = false;
      state.currentInteractionStore = null;
      state.currentInteractionLevel = null;
    });
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

    // Dialogue
    Dialogue.render(ctx);

    // Fade overlay (always on top)
    Engine.renderFade();
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
      stars: NPCs.getTotalStars(),
      interacting: state.interacting,
    });
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
