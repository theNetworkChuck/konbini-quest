/* Konbini Quest v2 - Core Engine (game loop, input, camera, rendering) */
const Engine = (() => {
  const CANVAS_W = 256;
  const CANVAS_H = 240;
  const T = 16;
  const WALK_FRAMES = 8; // frames per tile movement (~133ms at 60fps)

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  ctx.imageSmoothingEnabled = false;

  // Scale canvas to fill screen
  function resizeCanvas() {
    const ratio = CANVAS_W / CANVAS_H;
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w / h > ratio) {
      w = h * ratio;
    } else {
      h = w / ratio;
    }
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ============ INPUT ============
  const keys = {};
  const justPressed = {};

  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (!keys[k]) justPressed[k] = true;
    keys[k] = true;
    e.preventDefault();
  });
  document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  function isDown(key) { return !!keys[key]; }
  function wasPressed(key) { return !!justPressed[key]; }
  function clearJustPressed() {
    for (const k in justPressed) delete justPressed[k];
  }

  // Mobile controls
  const mobileState = { up: false, down: false, left: false, right: false, a: false, b: false };
  const mobileJust = { up: false, down: false, left: false, right: false, a: false, b: false };

  function setupMobile() {
    const dpadBtns = document.querySelectorAll('.dpad-btn[data-dir]');
    dpadBtns.forEach(btn => {
      const dir = btn.dataset.dir;
      const start = () => { if (!mobileState[dir]) mobileJust[dir] = true; mobileState[dir] = true; };
      const end = () => { mobileState[dir] = false; };
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); start(); }, { passive: false });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); end(); }, { passive: false });
      btn.addEventListener('touchcancel', end);
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    });

    const btnA = document.getElementById('btn-a');
    const btnB = document.getElementById('btn-b');
    if (btnA) {
      const startA = () => { if (!mobileState.a) mobileJust.a = true; mobileState.a = true; };
      const endA = () => { mobileState.a = false; };
      btnA.addEventListener('touchstart', (e) => { e.preventDefault(); startA(); }, { passive: false });
      btnA.addEventListener('touchend', (e) => { e.preventDefault(); endA(); }, { passive: false });
      btnA.addEventListener('touchcancel', endA);
      btnA.addEventListener('mousedown', startA);
      btnA.addEventListener('mouseup', endA);
    }
    if (btnB) {
      const startB = () => { if (!mobileState.b) mobileJust.b = true; mobileState.b = true; };
      const endB = () => { mobileState.b = false; };
      btnB.addEventListener('touchstart', (e) => { e.preventDefault(); startB(); }, { passive: false });
      btnB.addEventListener('touchend', (e) => { e.preventDefault(); endB(); }, { passive: false });
      btnB.addEventListener('touchcancel', endB);
      btnB.addEventListener('mousedown', startB);
      btnB.addEventListener('mouseup', endB);
    }
  }

  function clearMobileJust() {
    for (const k in mobileJust) mobileJust[k] = false;
  }

  // Unified input: keyboard or mobile
  function inputDir() {
    if (wasPressed('arrowup') || wasPressed('w') || mobileJust.up) return 'up';
    if (wasPressed('arrowdown') || wasPressed('s') || mobileJust.down) return 'down';
    if (wasPressed('arrowleft') || wasPressed('a') || mobileJust.left) return 'left';
    if (wasPressed('arrowright') || wasPressed('d') || mobileJust.right) return 'right';
    return null;
  }

  function inputDirHeld() {
    if (isDown('arrowup') || isDown('w') || mobileState.up) return 'up';
    if (isDown('arrowdown') || isDown('s') || mobileState.down) return 'down';
    if (isDown('arrowleft') || isDown('a') || mobileState.left) return 'left';
    if (isDown('arrowright') || isDown('d') || mobileState.right) return 'right';
    return null;
  }

  function inputA() {
    return wasPressed('z') || wasPressed(' ') || wasPressed('enter') || mobileJust.a;
  }

  function inputB() {
    return wasPressed('x') || wasPressed('escape') || mobileJust.b;
  }

  function inputQ() {
    return wasPressed('q');
  }

  // ============ CAMERA ============
  let camX = 0, camY = 0;

  function updateCamera(playerX, playerY, mapWidth, mapHeight) {
    // Center on player, clamp to map bounds
    const targetX = playerX * T + T / 2 - CANVAS_W / 2;
    const targetY = playerY * T + T / 2 - CANVAS_H / 2;
    const maxX = mapWidth * T - CANVAS_W;
    const maxY = mapHeight * T - CANVAS_H;
    camX = Math.max(0, Math.min(targetX, maxX));
    camY = Math.max(0, Math.min(targetY, maxY));
    // Snap to integers for pixel-perfect rendering
    camX = Math.round(camX);
    camY = Math.round(camY);
  }

  // ============ MAP RENDERING ============
  function renderMap(mapIdx) {
    const map = Maps.allMaps[mapIdx];
    if (!map) return;

    const startCol = Math.floor(camX / T);
    const startRow = Math.floor(camY / T);
    const endCol = Math.min(startCol + Math.ceil(CANVAS_W / T) + 1, map.width);
    const endRow = Math.min(startRow + Math.ceil(CANVAS_H / T) + 1, map.height);

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tile = Maps.getTile(mapIdx, col, row);
        const sx = col * T - camX;
        const sy = row * T - camY;
        Sprites.drawTile(ctx, tile, sx, sy);
      }
    }
  }

  // ============ STORE NAME LABELS ON MAP ============
  function renderStoreLabels(mapIdx) {
    if (mapIdx !== 0) return;
    ctx.font = '5px "Press Start 2P"';
    ctx.textAlign = 'center';

    // 7-Eleven label
    ctx.fillStyle = '#fff';
    let x = 4.5 * T - camX;
    let y = 0.5 * T - camY - 2;
    ctx.fillStyle = '#d4380d';
    ctx.fillRect(x - 20, y - 6, 40, 9);
    ctx.fillStyle = '#fff';
    ctx.fillText('7-ELEVEN', x, y);

    // Lawson label
    x = 12 * T - camX;
    ctx.fillStyle = '#1a6fc4';
    ctx.fillRect(x - 16, y - 6, 32, 9);
    ctx.fillStyle = '#fff';
    ctx.fillText('LAWSON', x, y);

    // FamilyMart label
    x = 18.5 * T - camX;
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(x - 22, y - 6, 44, 9);
    ctx.fillStyle = '#fff';
    ctx.fillText('FamilyMart', x, y);

    ctx.textAlign = 'left';
  }

  // ============ SPRITE RENDERING ============
  function renderPlayer(px, py, dir, frame, walkProgress) {
    let drawX, drawY;

    if (walkProgress > 0) {
      // Interpolate position during walk
      const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
      const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
      const prevX = px - dx;
      const prevY = py - dy;
      const t = walkProgress;
      drawX = (prevX + (px - prevX) * t) * T - camX;
      drawY = (prevY + (py - prevY) * t) * T - camY;
    } else {
      drawX = px * T - camX;
      drawY = py * T - camY;
    }

    Sprites.drawPlayer(ctx, drawX, drawY, dir, frame);
  }

  function renderNPCs(mapIdx, playerX, playerY, playerDir, time) {
    const npcs = NPCs.getNPCsOnMap(mapIdx);

    for (const npc of npcs) {
      const sx = npc.x * T - camX;
      const sy = npc.y * T - camY;

      // Skip if off-screen
      if (sx < -T || sx > CANVAS_W + T || sy < -T || sy > CANVAS_H + T) continue;

      if (npc.isClerk) {
        // Determine facing direction toward player if player is adjacent
        let clerkDir = npc.dir || 'down';
        Sprites.drawClerk(ctx, sx, sy, npc.store, clerkDir);

        // Show speech bubble or checkmark above clerk
        const store = npc.store;
        if (NPCs.isStoreComplete(store)) {
          Sprites.drawCheckmark(ctx, sx, sy);
        } else if (NPCs.hasAvailableInteraction(store)) {
          Sprites.drawSpeechBubble(ctx, sx, sy);
        }
      } else {
        Sprites.drawNPC(ctx, sx, sy, npc.type);

        // Show review bubble above sensei when reviews available
        if (npc.isSensei && NPCs.hasReviewsAvailable()) {
          Sprites.drawReviewBubble(ctx, sx, sy, time);
        }
        // Show challenge bubble above challenger when challenge ready
        if (npc.isChallenger && NPCs.isChallengeReady()) {
          Sprites.drawChallengeBubble(ctx, sx, sy, time);
        }
      }

      // Show "!" when player is adjacent and facing
      const facingX = playerX + (playerDir === 'right' ? 1 : playerDir === 'left' ? -1 : 0);
      const facingY = playerY + (playerDir === 'down' ? 1 : playerDir === 'up' ? -1 : 0);
      if (npc.x === facingX && npc.y === facingY && !Dialogue.isActive()) {
        Sprites.drawExclamation(ctx, sx, sy, time);
      }
    }
  }

  // ============ HUD ============
  function renderHUD(mapIdx) {
    const map = Maps.allMaps[mapIdx];
    if (!map) return;

    // Area name box (top center)
    ctx.font = '6px "Press Start 2P"';
    const name = map.name;
    const nameW = name.length * 6 + 12;
    const nameX = (CANVAS_W - nameW) / 2;

    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.fillRect(nameX, 2, nameW, 12);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(nameX, 2, nameW, 12);
    ctx.fillStyle = '#fff';
    ctx.fillText(name, nameX + 6, 11);

    // Streak counter (top right, above stars if streak > 0)
    const chalState = NPCs.getChallengeState();
    let hudRightY = 2;

    if (chalState.streak > 0) {
      const streakText = '🔥' + chalState.streak;
      const streakW = 36;
      ctx.fillStyle = 'rgba(26,26,46,0.85)';
      ctx.fillRect(CANVAS_W - streakW - 2, hudRightY, streakW, 12);
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 1;
      ctx.strokeRect(CANVAS_W - streakW - 2, hudRightY, streakW, 12);
      // Draw fire icon + number
      Sprites.drawStreakFire(ctx, CANVAS_W - streakW, hudRightY + 1, chalState.streak);
      ctx.fillStyle = '#f39c12';
      ctx.fillText('x' + chalState.streak, CANVAS_W - streakW + 10, hudRightY + 9);
      hudRightY += 14;
    }

    // Star count (top right)
    const stars = NPCs.getTotalStars();
    const starText = '★' + stars;
    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.fillRect(CANVAS_W - 40, hudRightY, 38, 12);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(CANVAS_W - 40, hudRightY, 38, 12);
    ctx.fillStyle = '#f1c40f';
    ctx.fillText(starText, CANVAS_W - 36, hudRightY + 9);
    hudRightY += 14;

    // Stamp card indicator (top right, below stars)
    const { total: stampTotal, max: stampMax } = NPCs.getTotalStamps();
    const stampW = 42;
    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.fillRect(CANVAS_W - stampW - 2, hudRightY, stampW, 12);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    ctx.strokeRect(CANVAS_W - stampW - 2, hudRightY, stampW, 12);
    // Stamp book icon
    Sprites.drawStampBookIcon(ctx, CANVAS_W - stampW, hudRightY + 1, stampTotal, stampMax);
    // Count text
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(stampTotal + '/' + stampMax, CANVAS_W - stampW + 16, hudRightY + 9);
    hudRightY += 14;

    // Phrase book indicator (top right, below stamps)
    const phraseCount = NPCs.getCollectedCount();
    const phraseTotal = NPCs.getTotalBonusPhrases();
    if (phraseCount > 0 || mapIdx === 0) {
      const phraseW = 48;
      ctx.fillStyle = 'rgba(26,26,46,0.85)';
      ctx.fillRect(CANVAS_W - phraseW - 2, hudRightY, phraseW, 12);
      const hasNew = NPCs.hasNewPhrases();
      ctx.strokeStyle = hasNew ? '#FFD700' : '#8B4513';
      ctx.lineWidth = 1;
      ctx.strokeRect(CANVAS_W - phraseW - 2, hudRightY, phraseW, 12);
      // Phrase book icon
      Sprites.drawPhraseBookIcon(ctx, CANVAS_W - phraseW, hudRightY + 1, phraseCount, phraseTotal);
      // Count text
      ctx.fillStyle = hasNew ? '#FFD700' : '#D2691E';
      ctx.fillText(phraseCount + '/' + phraseTotal, CANVAS_W - phraseW + 16, hudRightY + 9);
    }
  }

  // ============ FADE SYSTEM ============
  let fadeAlpha = 0;
  let fadeDir = 0; // 0=none, 1=fading out, -1=fading in
  let fadeCallback = null;

  function startFadeOut(callback) {
    fadeAlpha = 0;
    fadeDir = 1;
    fadeCallback = callback;
  }

  function startFadeIn() {
    fadeAlpha = 1;
    fadeDir = -1;
    fadeCallback = null;
  }

  function updateFade(dt) {
    if (fadeDir === 0) return;
    fadeAlpha += fadeDir * dt * 2.5; // ~400ms fade
    if (fadeAlpha >= 1 && fadeDir === 1) {
      fadeAlpha = 1;
      fadeDir = 0;
      if (fadeCallback) fadeCallback();
    } else if (fadeAlpha <= 0 && fadeDir === -1) {
      fadeAlpha = 0;
      fadeDir = 0;
    }
  }

  function renderFade() {
    if (fadeAlpha > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
  }

  function isFading() { return fadeDir !== 0; }

  // ============ SLIDING DOOR ANIMATION ============
  // State: null = inactive, object = animation running
  let doorAnim = null;

  // storeColor: the store's brand color for door frames
  // doorScreenX, doorScreenY: pixel position of the door on screen
  // direction: 'enter' = opening to go in, 'exit' = opening to come out
  function startDoorAnimation(storeColor, doorTileX, doorTileY, camXVal, camYVal, direction, callback) {
    const screenX = doorTileX * T - camXVal;
    const screenY = doorTileY * T - camYVal;
    doorAnim = {
      progress: 0,        // 0 to 1
      duration: 0.5,      // seconds for full open
      storeColor: storeColor,
      screenX: screenX,   // left door tile screen X
      screenY: screenY,
      direction: direction,
      callback: callback,
      phase: 'opening',   // opening -> hold -> done
      holdTimer: 0,
      holdDuration: 0.15, // brief hold when fully open
    };
  }

  function updateDoorAnimation(dt) {
    if (!doorAnim) return;

    if (doorAnim.phase === 'opening') {
      doorAnim.progress += dt / doorAnim.duration;
      if (doorAnim.progress >= 1) {
        doorAnim.progress = 1;
        doorAnim.phase = 'hold';
        doorAnim.holdTimer = 0;
      }
    } else if (doorAnim.phase === 'hold') {
      doorAnim.holdTimer += dt;
      if (doorAnim.holdTimer >= doorAnim.holdDuration) {
        doorAnim.phase = 'done';
        if (doorAnim.callback) doorAnim.callback();
        doorAnim = null;
      }
    }
  }

  function renderDoorAnimation() {
    if (!doorAnim) return;

    const anim = doorAnim;
    const progress = anim.progress;

    // Easing: ease-out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - progress, 3);

    // The door area spans 2 tiles wide (32px) x 1 tile tall (16px)
    // We render as an overlay on top of the scene
    const doorW = T * 2;  // 32px total width
    const doorH = T;      // 16px height
    const dx = anim.screenX;
    const dy = anim.screenY;
    const halfW = doorW / 2;

    // The slide offset: each panel moves from center to edge
    const slideOffset = eased * halfW; // 0 to 16px

    // Draw the surrounding door frame first
    ctx.fillStyle = '#5a5040';
    // Top frame bar
    ctx.fillRect(dx - 1, dy - 2, doorW + 2, 2);
    // Left frame
    ctx.fillRect(dx - 2, dy - 2, 2, doorH + 4);
    // Right frame
    ctx.fillRect(dx + doorW, dy - 2, 2, doorH + 4);

    // Interior glow visible behind doors (warm konbini light)
    const glowAlpha = eased * 0.8;
    ctx.fillStyle = `rgba(255, 248, 220, ${glowAlpha})`;
    ctx.fillRect(dx, dy, doorW, doorH);
    // Add a warm tint band at top
    ctx.fillStyle = `rgba(255, 220, 150, ${glowAlpha * 0.5})`;
    ctx.fillRect(dx, dy, doorW, 4);

    // Left door panel (slides left)
    const leftPanelW = halfW - slideOffset;
    if (leftPanelW > 0) {
      // Door panel body
      ctx.fillStyle = anim.storeColor;
      ctx.fillRect(dx, dy, leftPanelW, doorH);
      // Glass section
      ctx.fillStyle = '#8ec8e8';
      ctx.fillRect(dx + 1, dy + 1, Math.max(0, leftPanelW - 2), doorH - 4);
      // Glass reflection
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(dx + 2, dy + 2, Math.max(0, Math.min(3, leftPanelW - 3)), doorH - 6);
      // Door edge (right side of left panel)
      ctx.fillStyle = '#444';
      ctx.fillRect(dx + leftPanelW - 1, dy, 1, doorH);
    }

    // Right door panel (slides right)
    const rightPanelStart = dx + halfW + slideOffset;
    const rightPanelW = halfW - slideOffset;
    if (rightPanelW > 0) {
      // Door panel body
      ctx.fillStyle = anim.storeColor;
      ctx.fillRect(rightPanelStart, dy, rightPanelW, doorH);
      // Glass section
      ctx.fillStyle = '#8ec8e8';
      ctx.fillRect(rightPanelStart + 1, dy + 1, Math.max(0, rightPanelW - 2), doorH - 4);
      // Glass reflection
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      const refX = rightPanelStart + rightPanelW - 5;
      if (refX > rightPanelStart) {
        ctx.fillRect(refX, dy + 2, Math.min(3, rightPanelW - 3), doorH - 6);
      }
      // Door edge (left side of right panel)
      ctx.fillStyle = '#444';
      ctx.fillRect(rightPanelStart, dy, 1, doorH);
    }

    // Automatic sliding door sensor indicator (red dot above door)
    const sensorPulse = Math.sin(performance.now() / 150) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 60, 60, ${sensorPulse})`;
    ctx.fillRect(dx + halfW - 1, dy - 4, 2, 2);

    // Door mat below
    ctx.fillStyle = '#555';
    ctx.fillRect(dx + 2, dy + doorH, doorW - 4, 2);
  }

  function isDoorAnimating() { return doorAnim !== null; }

  // ============ WEATHER SYSTEM ============
  // Weather types: 'clear', 'cherry_blossoms', 'rain', 'night'
  // Weather cycles automatically based on in-game time
  const weather = {
    type: 'clear',            // current weather type
    particles: [],            // particle pool
    cycleTimer: 0,            // time until next weather change
    cycleDuration: 45,        // seconds per weather cycle
    timeOfDay: 'day',         // 'day', 'dusk', 'night', 'dawn'
    todTimer: 0,              // time-of-day cycle timer
    todCycleDuration: 120,    // full day/night cycle in seconds
    tintAlpha: 0,             // current tint overlay alpha (smoothed)
    tintTargetAlpha: 0,
    rainSoundPlaying: false,
  };

  const WEATHER_TYPES = ['clear', 'cherry_blossoms', 'rain', 'clear', 'cherry_blossoms'];
  let weatherIdx = 0;

  function initWeather() {
    weather.type = 'cherry_blossoms'; // start with petals for visual appeal
    weather.cycleTimer = weather.cycleDuration;
    weather.todTimer = 0;
    spawnWeatherParticles();
  }

  function spawnWeatherParticles() {
    weather.particles = [];
    const count = weather.type === 'rain' ? 80 : weather.type === 'cherry_blossoms' ? 30 : 0;
    for (let i = 0; i < count; i++) {
      weather.particles.push(createParticle(true));
    }
  }

  function createParticle(randomY) {
    if (weather.type === 'cherry_blossoms') {
      return {
        x: Math.random() * (CANVAS_W + 40) - 20,
        y: randomY ? Math.random() * CANVAS_H : -Math.random() * 20,
        vx: -0.3 - Math.random() * 0.4,     // gentle drift left
        vy: 0.4 + Math.random() * 0.3,       // slow fall
        size: 2 + Math.random() * 2,          // 2-4px petals
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 1.5 + Math.random(),
        swayAmp: 0.6 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 2,
        alpha: 0.5 + Math.random() * 0.4,
        // Pink palette for petals
        color: [
          '#FFB7C5', '#FF9CAD', '#FFDDE1', '#FFD1DC',
          '#FFC0CB', '#FFE4E8', '#F8BBD0'
        ][Math.floor(Math.random() * 7)],
      };
    } else if (weather.type === 'rain') {
      return {
        x: Math.random() * (CANVAS_W + 30) - 10,
        y: randomY ? Math.random() * CANVAS_H : -Math.random() * 30,
        vx: -1.2,                              // slight wind angle
        vy: 4 + Math.random() * 2,             // fast fall
        length: 4 + Math.random() * 4,          // rain streak length
        alpha: 0.15 + Math.random() * 0.25,
      };
    }
    return null;
  }

  function updateWeather(dt) {
    // Weather cycle timer
    weather.cycleTimer -= dt;
    if (weather.cycleTimer <= 0) {
      weatherIdx = (weatherIdx + 1) % WEATHER_TYPES.length;
      weather.type = WEATHER_TYPES[weatherIdx];
      weather.cycleTimer = weather.cycleDuration;
      spawnWeatherParticles();
    }

    // Time of day cycle
    weather.todTimer += dt;
    if (weather.todTimer >= weather.todCycleDuration) {
      weather.todTimer -= weather.todCycleDuration;
    }
    const todProgress = weather.todTimer / weather.todCycleDuration;
    // 0.0-0.25 = day, 0.25-0.35 = dusk, 0.35-0.65 = night, 0.65-0.75 = dawn, 0.75-1.0 = day
    if (todProgress < 0.25) weather.timeOfDay = 'day';
    else if (todProgress < 0.35) weather.timeOfDay = 'dusk';
    else if (todProgress < 0.65) weather.timeOfDay = 'night';
    else if (todProgress < 0.75) weather.timeOfDay = 'dawn';
    else weather.timeOfDay = 'day';

    // Smooth tint alpha
    let target = 0;
    if (weather.timeOfDay === 'night') target = 0.3;
    else if (weather.timeOfDay === 'dusk') target = 0.18;
    else if (weather.timeOfDay === 'dawn') target = 0.12;
    weather.tintTargetAlpha = target;
    weather.tintAlpha += (weather.tintTargetAlpha - weather.tintAlpha) * dt * 1.5;

    // Update particles
    for (let i = weather.particles.length - 1; i >= 0; i--) {
      const p = weather.particles[i];
      if (!p) continue;

      if (weather.type === 'cherry_blossoms') {
        p.swayPhase += p.swaySpeed * dt;
        p.x += p.vx * 60 * dt + Math.sin(p.swayPhase) * p.swayAmp;
        p.y += p.vy * 60 * dt;
        p.rotation += p.rotSpeed * dt;
      } else if (weather.type === 'rain') {
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;
      }

      // Recycle particles that go off-screen
      if (p.y > CANVAS_H + 10 || p.x < -30 || p.x > CANVAS_W + 30) {
        weather.particles[i] = createParticle(false);
      }
    }
  }

  function renderWeather(time) {
    if (weather.particles.length === 0 && weather.tintAlpha < 0.01) return;

    // Render particles
    for (const p of weather.particles) {
      if (!p) continue;

      if (weather.type === 'cherry_blossoms') {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // Draw petal shape: an ellipse-like shape using two arcs
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Main petal body (elliptical)
        ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        // Smaller highlight for 3D effect
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.beginPath();
        ctx.ellipse(-p.size * 0.15, -p.size * 0.2, p.size * 0.25, p.size * 0.4, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (weather.type === 'rain') {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = '#a8c8e8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 0.3, p.y + p.length);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Rain splash effect on ground (small circles that appear at bottom)
    if (weather.type === 'rain') {
      ctx.save();
      const splashCount = 6;
      for (let i = 0; i < splashCount; i++) {
        const splashPhase = (time * 3 + i * 1.7) % 1;
        if (splashPhase > 0.6) continue; // only show part of the time
        const sx = (Math.sin(time * 2.3 + i * 47) * 0.5 + 0.5) * CANVAS_W;
        const sy = CANVAS_H - 4 - Math.random() * 8;
        const radius = 1 + splashPhase * 2;
        ctx.globalAlpha = (1 - splashPhase / 0.6) * 0.2;
        ctx.strokeStyle = '#a8c8e8';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function renderTimeOfDayTint() {
    if (weather.tintAlpha < 0.01) return;

    ctx.save();
    if (weather.timeOfDay === 'night') {
      // Deep blue night tint
      ctx.fillStyle = `rgba(15, 20, 60, ${weather.tintAlpha})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    } else if (weather.timeOfDay === 'dusk') {
      // Warm orange-purple dusk
      ctx.fillStyle = `rgba(80, 30, 50, ${weather.tintAlpha})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    } else if (weather.timeOfDay === 'dawn') {
      // Soft pink dawn
      ctx.fillStyle = `rgba(80, 50, 60, ${weather.tintAlpha})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // Night: add faint starfield dots
    if (weather.timeOfDay === 'night' && weather.tintAlpha > 0.15) {
      const starSeed = [12,45,78,103,156,189,210,34,67,99,134,178,201,23,56];
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(weather.tintAlpha * 0.8, 0.4)})`;
      for (const s of starSeed) {
        const sx = (s * 17 + 3) % CANVAS_W;
        const sy = (s * 13 + 7) % (CANVAS_H * 0.3);
        const twinkle = Math.sin(performance.now() / (300 + s * 7) + s) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * Math.min(weather.tintAlpha * 1.5, 0.5);
        ctx.fillRect(sx, sy, 1, 1);
      }
    }
    ctx.restore();
  }

  function getWeatherType() { return weather.type; }
  function getTimeOfDay() { return weather.timeOfDay; }

  // ============ TITLE SCREEN ============
  function renderTitle() {
    // Dark background
    ctx.fillStyle = '#0a0a1e';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Decorative tiles
    for (let x = 0; x < CANVAS_W; x += T) {
      Sprites.drawTile(ctx, 1, x, CANVAS_H - T);
      Sprites.drawTile(ctx, 1, x, CANVAS_H - T * 2);
    }
    Sprites.drawTile(ctx, 11, T * 2, CANVAS_H - T * 3);
    Sprites.drawTile(ctx, 7, T * 13, CANVAS_H - T * 3);
    Sprites.drawTile(ctx, 6, T * 14, CANVAS_H - T * 3);

    // Small store fronts
    for (let i = 0; i < 3; i++) {
      const sx = T * 4 + i * T * 5;
      Sprites.drawTile(ctx, 13 + i, sx, CANVAS_H - T * 4);
      Sprites.drawTile(ctx, 13 + i, sx + T, CANVAS_H - T * 4);
      Sprites.drawTile(ctx, 16 + i, sx, CANVAS_H - T * 3);
      Sprites.drawTile(ctx, 19 + i, sx + T, CANVAS_H - T * 3);
    }

    // Title text
    const time = performance.now() / 1000;
    ctx.font = '12px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e74c3c';
    ctx.fillText('KONBINI', CANVAS_W / 2, 55);
    ctx.fillStyle = '#f39c12';
    ctx.fillText('QUEST', CANVAS_W / 2, 75);

    // Japanese subtitle
    ctx.font = '14px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#fff';
    ctx.fillText('コンビニクエスト', CANVAS_W / 2, 95);

    // Version tag
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.fillText('v2 - RPG Edition', CANVAS_W / 2, 108);

    // Player sprite
    const pf = Math.floor(time * 2) % 2;
    Sprites.drawPlayer(ctx, CANVAS_W / 2 - 8, 118, 'down', pf);

    // Blinking prompt
    if (Math.sin(time * 3) > 0) {
      ctx.font = '7px "Press Start 2P"';
      ctx.fillStyle = '#fff';
      ctx.fillText('PRESS A TO START', CANVAS_W / 2, 155);
    }

    ctx.textAlign = 'left';
  }

  return {
    canvas, ctx,
    CANVAS_W, CANVAS_H, T, WALK_FRAMES,
    resizeCanvas,
    // Input
    isDown, wasPressed, clearJustPressed,
    inputDir, inputDirHeld, inputA, inputB,
    setupMobile, clearMobileJust, mobileJust,
    // Camera
    updateCamera, camX: () => camX, camY: () => camY,
    // Rendering
    renderMap, renderStoreLabels, renderPlayer, renderNPCs, renderHUD,
    // Fade
    startFadeOut, startFadeIn, updateFade, renderFade, isFading,
    // Sliding door animation
    startDoorAnimation, updateDoorAnimation, renderDoorAnimation, isDoorAnimating,
    // Weather
    initWeather, updateWeather, renderWeather, renderTimeOfDayTint,
    getWeatherType, getTimeOfDay,
    // Title
    renderTitle,
  };
})();
