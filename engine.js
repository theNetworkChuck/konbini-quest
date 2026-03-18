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

    // Star count (top right)
    const stars = NPCs.getTotalStars();
    const starText = '★' + stars;
    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.fillRect(CANVAS_W - 40, 2, 38, 12);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(CANVAS_W - 40, 2, 38, 12);
    ctx.fillStyle = '#f1c40f';
    ctx.fillText(starText, CANVAS_W - 36, 11);
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
    // Title
    renderTitle,
  };
})();
