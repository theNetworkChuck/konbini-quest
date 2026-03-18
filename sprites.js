/* Konbini Quest v2 - Programmatic Sprite System (16x16 pixel art) */
const Sprites = (() => {
  const T = 16; // tile size
  const spriteCache = {};

  // Helper: draw pixels from a compact string map
  function drawPixelMap(ctx, x, y, map, palette) {
    const rows = map.split('\n').filter(r => r.length > 0);
    rows.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        const ch = row[rx];
        if (ch === '.' || ch === ' ') continue;
        const color = palette[ch];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x + rx, y + ry, 1, 1);
        }
      }
    });
  }

  // ============ PLAYER SPRITES ============
  const playerPalette = {
    'H': '#5c3a1e', // hair
    'S': '#f5d0a9', // skin
    'E': '#222',    // eyes
    'W': '#fff',    // white
    'T': '#e74c3c', // shirt
    'P': '#2c3e50', // pants
    'B': '#d4a017', // backpack
    'O': '#1a5276', // shoes
    'h': '#7a4a2a', // hair highlight
  };

  // Player facing down, frame 0
  const playerDown0 = `
....HHHH....
...HhHHhH...
...HHHHHH...
..SSEESSE..
..SSSSSSSS..
...SSSSSS...
..TTTTTTTT..
..TBTTTTBT..
..TTTTTTTT..
...TTTTTT...
..PPPPPPPP..
..PP.PP.PP..
..PP.PP.PP..
...PP..PP...
...OO..OO...
...OO..OO...`;

  // Player facing down, frame 1 (left foot forward)
  const playerDown1 = `
....HHHH....
...HhHHhH...
...HHHHHH...
..SSEESSE..
..SSSSSSSS..
...SSSSSS...
..TTTTTTTT..
..TBTTTTBT..
..TTTTTTTT..
...TTTTTT...
..PPPPPPPP..
..PP.PP.PP..
..PP.PP.PP..
..PP....PP..
..OO....OO..
...OO..OO...`;

  // Player facing up, frame 0
  const playerUp0 = `
....HHHH....
...HHHHHH...
...HHHHHH...
...HHHHHH...
..SSSSSSSS..
...SSSSSS...
..TTTTTTTT..
..TBTTTTBT..
..BBTTTTBB..
...BBBBBB...
..PPPPPPPP..
..PP.PP.PP..
..PP.PP.PP..
...PP..PP...
...OO..OO...
...OO..OO...`;

  // Player facing up, frame 1
  const playerUp1 = `
....HHHH....
...HHHHHH...
...HHHHHH...
...HHHHHH...
..SSSSSSSS..
...SSSSSS...
..TTTTTTTT..
..TBTTTTBT..
..BBTTTTBB..
...BBBBBB...
..PPPPPPPP..
..PP.PP.PP..
..PP.PP.PP..
..PP....PP..
..OO....OO..
...OO..OO...`;

  // Player facing left, frame 0
  const playerLeft0 = `
....HHHH....
...HHHHHH...
...HHHHHH...
..SSESSS....
..SSSSSS....
...SSSS.....
..TTTTTB....
..TTTTBB....
..TTTTTB....
...TTTT.....
..PPPPPP....
..PP.PP.....
..PP.PP.....
...PP.PP....
...OO.OO...
...OO.OO...`;

  // Player facing left, frame 1
  const playerLeft1 = `
....HHHH....
...HHHHHH...
...HHHHHH...
..SSESSS....
..SSSSSS....
...SSSS.....
..TTTTTB....
..TTTTBB....
..TTTTTB....
...TTTT.....
..PPPPPP....
..PP.PP.....
..PP.PP.....
..PP..PP....
..OO..OO....
...OO.OO...`;

  // Player facing right, frame 0
  const playerRight0 = `
....HHHH....
...HHHHHH...
...HHHHHH...
....SSSESS..
....SSSSSS..
.....SSSS...
....BTTTTT..
....BBTTTT..
....BTTTTT..
.....TTTT...
....PPPPPP..
.....PP.PP..
.....PP.PP..
....PP.PP...
...OO.OO...
...OO.OO...`;

  // Player facing right, frame 1
  const playerRight1 = `
....HHHH....
...HHHHHH...
...HHHHHH...
....SSSESS..
....SSSSSS..
.....SSSS...
....BTTTTT..
....BBTTTT..
....BTTTTT..
.....TTTT...
....PPPPPP..
.....PP.PP..
.....PP.PP..
....PP..PP..
....OO..OO..
...OO.OO...`;

  const playerFrames = {
    down:  [playerDown0, playerDown1],
    up:    [playerUp0, playerUp1],
    left:  [playerLeft0, playerLeft1],
    right: [playerRight0, playerRight1],
  };

  function drawPlayer(ctx, x, y, dir, frame) {
    const key = `player_${dir}_${frame}`;
    const map = playerFrames[dir][frame % 2];
    drawPixelMap(ctx, x, y, map, playerPalette);
  }

  // ============ CLERK SPRITES ============
  function getClerkPalette(store) {
    const base = {
      'H': '#1a1a2e', // hair
      'S': '#f5d0a9', // skin
      'E': '#222',    // eyes
      'W': '#fff',
      'A': '#888',    // apron
      'P': '#2c3e50', // pants
      'O': '#333',    // shoes
    };
    if (store === '7-Eleven') { base['U'] = '#d4380d'; base['A'] = '#e8652e'; } // red/orange
    else if (store === 'Lawson') { base['U'] = '#1a6fc4'; base['A'] = '#3498db'; } // blue
    else { base['U'] = '#27ae60'; base['A'] = '#2ecc71'; } // green
    return base;
  }

  const clerkDown = `
....HHHH....
...HHHHHH...
...HHHHHH...
..SSEESSE..
..SSSSSSSS..
...SSSSSS...
..UUUUUUUU..
..UUUUUUUU..
..AAUUUUAA..
..AAAAAAAA..
..PPPPPPPP..
..PP.PP.PP..
..PP.PP.PP..
...PP..PP...
...OO..OO...
...OO..OO...`;

  const clerkUp = `
....HHHH....
...HHHHHH...
...HHHHHH...
...HHHHHH...
..SSSSSSSS..
...SSSSSS...
..UUUUUUUU..
..UUUUUUUU..
..AAUUUUAA..
..AAAAAAAA..
..PPPPPPPP..
..PP.PP.PP..
..PP.PP.PP..
...PP..PP...
...OO..OO...
...OO..OO...`;

  const clerkLeft = `
....HHHH....
...HHHHHH...
...HHHHHH...
..SSESSS....
..SSSSSS....
...SSSS.....
..UUUUUU....
..UUUUUU....
..AAUUUU....
..AAAAAA....
..PPPPPP....
..PP.PP.....
..PP.PP.....
...PP.PP....
...OO.OO...
...OO.OO...`;

  const clerkRight = `
....HHHH....
...HHHHHH...
...HHHHHH...
....SSSESS..
....SSSSSS..
.....SSSS...
....UUUUUU..
....UUUUUU..
....UUUUAA..
....AAAAAA..
....PPPPPP..
.....PP.PP..
.....PP.PP..
....PP.PP...
...OO.OO...
...OO.OO...`;

  const clerkFrames = { down: clerkDown, up: clerkUp, left: clerkLeft, right: clerkRight };

  function drawClerk(ctx, x, y, store, dir) {
    const palette = getClerkPalette(store);
    drawPixelMap(ctx, x, y, clerkFrames[dir] || clerkDown, palette);
  }

  // ============ NPC SPRITES ============
  // Old man
  const npcOldMan = `
...WWWWWW...
..WWWWWWWW..
..WWWWWWWW..
..SSEESSE..
..SSSSSSSS..
...SSSSSS...
..88888888..
..88888888..
..88888888..
...888888...
..66666666..
..66.66.66..
..66.66.66..
...66..66...
...33..33...
...33..33...`;

  const npcOldManPalette = {
    'W': '#bbb', 'S': '#e8c090', 'E': '#222', '8': '#7f6b52', '6': '#555', '3': '#3a3a3a'
  };

  // School girl
  const npcSchoolGirl = `
....1111....
...111111...
...111111...
..SSEESSE..
..SSSSSSSS..
...SSSSSS...
..NNNNNNNN..
..NWNNNNWN..
..NNNNNNNN..
...NNNNNN...
..22222222..
..22.22.22..
..22.22.22..
...22..22...
...WW..WW...
...WW..WW...`;

  const npcSchoolGirlPalette = {
    '1': '#1a1a2e', 'S': '#f5d0a9', 'E': '#222', 'W': '#fff',
    'N': '#1a3a6e', '2': '#2c3e50'
  };

  // Business man
  const npcBusinessMan = `
....1111....
...111111...
...111111...
..SSEESSE..
..SSSSSSSS..
...SSSSSS...
..44444444..
..44R44444..
..44444444..
...444444...
..44444444..
..44.44.44..
..44.44.44..
...44..44...
...33..33...
...33..33...`;

  const npcBusinessManPalette = {
    '1': '#1a1a2e', 'S': '#f5d0a9', 'E': '#222', 'R': '#c0392b',
    '4': '#2c3e50', '3': '#1a1a1a'
  };

  // Sensei (review NPC) - older wise teacher with traditional look
  const npcSensei = `
....HHHH....
...HHHHHH...
...HHHHHH...
..SSEESSE..
..SSSSSSSS..
..SSMMSS....
..RRRRRRRR..
..RRGRRGRR..
..RRRRRRRR..
...RRRRRR...
..RRRRRRRR..
..RR.RR.RR..
..RR.RR.RR..
...RR..RR...
...55..55...
...55..55...`;

  const npcSenseiPalette = {
    'H': '#888', 'S': '#e8c090', 'E': '#222', 'M': '#c0a080',
    'R': '#8b2252', 'G': '#d4af37', '5': '#4a3a2a'
  };

  // Challenge Master NPC - energetic game-show host type with headband
  const npcChallenger = `
....HHHH....
...HhHHhH...
..RRRRRRrr..
..SSEESSE..
..SSSSSSSS..
...SSMSS....
..YYYYYYYY..
..YYWYYWYY..
..YYYYYYYY..
...YYYYYY...
..YYYYYYYY..
..YY.YY.YY..
..YY.YY.YY..
...YY..YY...
...WW..WW...
...WW..WW...`;

  const npcChallengerPalette = {
    'H': '#1a1a2e', 'h': '#2a2a3e', 'S': '#f5d0a9', 'E': '#222', 'M': '#c0a080',
    'R': '#e74c3c', 'r': '#c0392b', // red headband
    'Y': '#f1c40f', 'W': '#fff', // yellow outfit, white shoes
  };

  const npcSprites = {
    oldman: { map: npcOldMan, palette: npcOldManPalette },
    schoolgirl: { map: npcSchoolGirl, palette: npcSchoolGirlPalette },
    businessman: { map: npcBusinessMan, palette: npcBusinessManPalette },
    sensei: { map: npcSensei, palette: npcSenseiPalette },
    challenger: { map: npcChallenger, palette: npcChallengerPalette },
  };

  function drawNPC(ctx, x, y, type) {
    const sprite = npcSprites[type];
    if (sprite) drawPixelMap(ctx, x, y, sprite.map, sprite.palette);
  }

  // ============ TILE DRAWING ============
  // Draw a cached tile to an offscreen canvas
  function getTileCanvas(id, drawFn) {
    if (!spriteCache[id]) {
      const c = document.createElement('canvas');
      c.width = T; c.height = T;
      const tc = c.getContext('2d');
      drawFn(tc);
      spriteCache[id] = c;
    }
    return spriteCache[id];
  }

  // --- Tile drawing functions ---
  function drawSidewalk(tc) {
    tc.fillStyle = '#c8c0b0';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#b8b0a0';
    tc.fillRect(0, 0, 8, 8);
    tc.fillRect(8, 8, 8, 8);
    tc.strokeStyle = '#a8a090';
    tc.lineWidth = 0.5;
    tc.strokeRect(0, 0, 8, 8);
    tc.strokeRect(8, 0, 8, 8);
    tc.strokeRect(0, 8, 8, 8);
    tc.strokeRect(8, 8, 8, 8);
  }

  function drawRoad(tc) {
    tc.fillStyle = '#555';
    tc.fillRect(0, 0, T, T);
    // Subtle asphalt texture
    tc.fillStyle = '#4a4a4a';
    for (let i = 0; i < 6; i++) {
      tc.fillRect(Math.random()*14|0, Math.random()*14|0, 2, 1);
    }
  }

  function drawRoadCenter(tc) {
    tc.fillStyle = '#555';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#e8c840';
    tc.fillRect(0, 7, T, 2);
  }

  function drawCrosswalk(tc) {
    tc.fillStyle = '#555';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#eee';
    for (let y = 0; y < T; y += 4) {
      tc.fillRect(0, y, T, 2);
    }
  }

  function drawGrass(tc) {
    tc.fillStyle = '#5a8f3a';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#4a7f2a';
    tc.fillRect(2, 3, 2, 2);
    tc.fillRect(10, 7, 2, 2);
    tc.fillRect(6, 12, 2, 2);
  }

  function drawTree(tc) {
    // Trunk
    tc.fillStyle = '#6b4226';
    tc.fillRect(6, 10, 4, 6);
    // Leaves
    tc.fillStyle = '#2d8a4e';
    tc.fillRect(2, 2, 12, 10);
    tc.fillRect(4, 0, 8, 2);
    tc.fillStyle = '#3aaa5e';
    tc.fillRect(4, 3, 8, 6);
  }

  function drawCherryBlossom(tc) {
    tc.fillStyle = '#4a3020';
    tc.fillRect(6, 10, 4, 6);
    tc.fillStyle = '#f0a0b0';
    tc.fillRect(2, 2, 12, 10);
    tc.fillRect(4, 0, 8, 2);
    tc.fillStyle = '#f8c0d0';
    tc.fillRect(4, 3, 8, 6);
    // Petals
    tc.fillStyle = '#fff';
    tc.fillRect(3, 4, 1, 1);
    tc.fillRect(9, 2, 1, 1);
    tc.fillRect(6, 8, 1, 1);
  }

  function drawBench(tc) {
    tc.fillStyle = '#c8c0b0';
    tc.fillRect(0, 0, T, T);
    // Bench seat
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(1, 6, 14, 3);
    // Legs
    tc.fillStyle = '#5a3a1e';
    tc.fillRect(2, 9, 2, 4);
    tc.fillRect(12, 9, 2, 4);
    // Back
    tc.fillStyle = '#7a4e2c';
    tc.fillRect(1, 3, 14, 3);
  }

  function drawStreetLamp(tc) {
    tc.fillStyle = '#c8c0b0';
    tc.fillRect(0, 0, T, T);
    // Pole
    tc.fillStyle = '#666';
    tc.fillRect(7, 4, 2, 12);
    // Light
    tc.fillStyle = '#ffe066';
    tc.fillRect(4, 0, 8, 4);
    tc.fillStyle = '#fff8cc';
    tc.fillRect(5, 1, 6, 2);
  }

  function drawFence(tc) {
    tc.fillStyle = '#5a8f3a';
    tc.fillRect(0, 0, T, T);
    // Horizontal bars
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(0, 4, T, 2);
    tc.fillRect(0, 10, T, 2);
    // Vertical posts
    tc.fillStyle = '#6b4226';
    tc.fillRect(1, 2, 2, 12);
    tc.fillRect(7, 2, 2, 12);
    tc.fillRect(13, 2, 2, 12);
  }

  function drawVendingMachine(tc) {
    tc.fillStyle = '#2c5aa0';
    tc.fillRect(1, 0, 14, 16);
    tc.fillStyle = '#3a7ae0';
    tc.fillRect(2, 1, 12, 10);
    // Drinks
    tc.fillStyle = '#e74c3c'; tc.fillRect(3, 2, 3, 4);
    tc.fillStyle = '#2ecc71'; tc.fillRect(7, 2, 3, 4);
    tc.fillStyle = '#f39c12'; tc.fillRect(11, 2, 2, 4);
    tc.fillStyle = '#fff'; tc.fillRect(3, 7, 3, 3);
    tc.fillStyle = '#e67e22'; tc.fillRect(7, 7, 3, 3);
    // Slot
    tc.fillStyle = '#1a1a2e';
    tc.fillRect(5, 12, 6, 3);
    tc.fillStyle = '#444';
    tc.fillRect(6, 13, 4, 1);
  }

  function drawBuildingWall(tc) {
    tc.fillStyle = '#d4c4a0';
    tc.fillRect(0, 0, T, T);
    tc.strokeStyle = '#c0b090';
    tc.lineWidth = 0.5;
    for (let y = 0; y < T; y += 4) {
      for (let x = (y % 8 === 0 ? 0 : 4); x < T; x += 8) {
        tc.strokeRect(x, y, 8, 4);
      }
    }
  }

  function drawStoreAwning(tc, color1, color2) {
    tc.fillStyle = color1;
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = color2;
    for (let x = 0; x < T; x += 4) {
      tc.fillRect(x, 0, 2, T);
    }
    // Bottom edge
    tc.fillStyle = '#fff';
    tc.fillRect(0, T - 2, T, 2);
  }

  function drawStoreDoor(tc, color) {
    tc.fillStyle = '#8a7a60';
    tc.fillRect(0, 0, T, T);
    // Door
    tc.fillStyle = color;
    tc.fillRect(2, 0, 12, 14);
    // Glass
    tc.fillStyle = '#aed6f1';
    tc.fillRect(3, 1, 10, 8);
    // Handle
    tc.fillStyle = '#d4af37';
    tc.fillRect(10, 10, 2, 2);
    // Mat
    tc.fillStyle = '#555';
    tc.fillRect(0, 14, T, 2);
  }

  function drawStoreWindow(tc, color) {
    tc.fillStyle = '#d4c4a0';
    tc.fillRect(0, 0, T, T);
    // Window frame
    tc.fillStyle = color;
    tc.fillRect(1, 2, 14, 10);
    // Glass
    tc.fillStyle = '#aed6f1';
    tc.fillRect(2, 3, 12, 8);
    // Cross
    tc.fillStyle = color;
    tc.fillRect(7, 3, 2, 8);
    tc.fillRect(2, 6, 12, 2);
  }

  // Store floor tiles
  function drawStoreFloor(tc, color1, color2) {
    tc.fillStyle = color1;
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = color2;
    tc.fillRect(0, 0, 8, 8);
    tc.fillRect(8, 8, 8, 8);
  }

  function drawStoreWall(tc, color) {
    tc.fillStyle = color;
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#fff';
    tc.fillRect(0, T - 1, T, 1);
  }

  function drawShelf(tc, accentColor) {
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(0, 0, T, T);
    // Shelf surfaces
    tc.fillStyle = '#a0764a';
    tc.fillRect(0, 4, T, 1);
    tc.fillRect(0, 10, T, 1);
    // Products
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', accentColor];
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 4; i++) {
        tc.fillStyle = colors[(row * 4 + i) % colors.length];
        tc.fillRect(1 + i * 4, row * 6 + 1, 3, 3);
      }
    }
    tc.fillStyle = colors[2];
    tc.fillRect(1, 12, 3, 3);
    tc.fillStyle = colors[0];
    tc.fillRect(5, 12, 3, 3);
    tc.fillStyle = colors[3];
    tc.fillRect(9, 12, 3, 3);
    tc.fillStyle = colors[1];
    tc.fillRect(13, 12, 2, 3);
  }

  function drawCounter(tc) {
    tc.fillStyle = '#d4c4a0';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(0, 2, T, 12);
    tc.fillStyle = '#a0764a';
    tc.fillRect(0, 0, T, 3);
    // Register
    tc.fillStyle = '#555';
    tc.fillRect(5, 3, 6, 5);
    tc.fillStyle = '#2ecc71';
    tc.fillRect(6, 4, 4, 2);
  }

  function drawDoorMat(tc) {
    tc.fillStyle = '#d4c4a0';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#666';
    tc.fillRect(2, 4, 12, 8);
    tc.fillStyle = '#555';
    tc.fillRect(3, 5, 10, 6);
  }

  function drawSign(tc) {
    tc.fillStyle = '#c8c0b0';
    tc.fillRect(0, 0, T, T);
    // Sign board
    tc.fillStyle = '#2c3e50';
    tc.fillRect(2, 1, 12, 10);
    tc.fillStyle = '#34495e';
    tc.fillRect(3, 2, 10, 8);
    // Post
    tc.fillStyle = '#666';
    tc.fillRect(7, 11, 2, 5);
    // Text lines
    tc.fillStyle = '#ecf0f1';
    tc.fillRect(4, 3, 8, 1);
    tc.fillRect(4, 5, 6, 1);
    tc.fillRect(4, 7, 7, 1);
  }

  // Hot food counter
  function drawHotFoodCounter(tc, accentColor) {
    tc.fillStyle = '#d4c4a0';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(0, 2, T, 12);
    // Glass display
    tc.fillStyle = accentColor;
    tc.fillRect(1, 0, 14, 3);
    tc.fillStyle = '#f0e0c0';
    tc.fillRect(2, 3, 12, 6);
    // Food items
    tc.fillStyle = '#d4880f';
    tc.fillRect(3, 4, 3, 3);
    tc.fillRect(8, 4, 3, 3);
    // Label
    tc.fillStyle = '#fff';
    tc.fillRect(4, 10, 8, 2);
  }

  // Create tile by ID
  const TILE_FNS = {
    0: () => {},  // empty/void
    1: drawSidewalk,
    2: drawRoad,
    3: drawRoadCenter,
    4: drawCrosswalk,
    5: drawGrass,
    6: drawTree,
    7: drawCherryBlossom,
    8: drawBench,
    9: drawStreetLamp,
    10: drawFence,
    11: drawVendingMachine,
    12: drawBuildingWall,
    // Store awnings (13-15)
    13: (tc) => drawStoreAwning(tc, '#d4380d', '#e8652e'), // 7-Eleven
    14: (tc) => drawStoreAwning(tc, '#1a6fc4', '#3498db'), // Lawson
    15: (tc) => drawStoreAwning(tc, '#27ae60', '#2ecc71'), // FamilyMart
    // Store doors (16-18)
    16: (tc) => drawStoreDoor(tc, '#d4380d'),
    17: (tc) => drawStoreDoor(tc, '#1a6fc4'),
    18: (tc) => drawStoreDoor(tc, '#27ae60'),
    // Store windows (19-21)
    19: (tc) => drawStoreWindow(tc, '#d4380d'),
    20: (tc) => drawStoreWindow(tc, '#1a6fc4'),
    21: (tc) => drawStoreWindow(tc, '#27ae60'),
    // Interior tiles
    22: (tc) => drawStoreFloor(tc, '#f0e8d8', '#e8e0d0'), // generic floor
    23: (tc) => drawStoreFloor(tc, '#f0e0d0', '#e8d8c8'), // warm floor
    24: (tc) => drawStoreWall(tc, '#e8dcc8'),
    25: (tc) => drawShelf(tc, '#e74c3c'),   // 7-Eleven shelf
    26: (tc) => drawShelf(tc, '#3498db'),   // Lawson shelf
    27: (tc) => drawShelf(tc, '#2ecc71'),   // FamilyMart shelf
    28: drawCounter,
    29: drawDoorMat,
    30: drawSign,
    31: (tc) => drawHotFoodCounter(tc, '#1a6fc4'), // Lawson hot food
    32: (tc) => drawHotFoodCounter(tc, '#2ecc71'), // FamilyMart hot food
    33: drawGrass, // grass variant
  };

  function drawTile(ctx, tileId, x, y) {
    const cached = getTileCanvas('tile_' + tileId, (tc) => {
      if (TILE_FNS[tileId]) TILE_FNS[tileId](tc);
    });
    ctx.drawImage(cached, x, y);
  }

  // ============ UI SPRITES ============
  function drawExclamation(ctx, x, y, bounce) {
    const by = Math.sin(bounce * 6) * 2;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 6, y - 10 + by, 4, 6);
    ctx.fillRect(x + 6, y - 3 + by, 4, 2);
  }

  function drawSpeechBubble(ctx, x, y) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 3, y - 12, 10, 8);
    ctx.fillRect(x + 6, y - 4, 4, 2);
    ctx.fillStyle = '#333';
    ctx.fillRect(x + 5, y - 10, 2, 1);
    ctx.fillRect(x + 8, y - 10, 2, 1);
    ctx.fillRect(x + 5, y - 8, 6, 1);
  }

  function drawCheckmark(ctx, x, y) {
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(x + 3, y - 10, 10, 8);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 5, y - 5, 2, 2);
    ctx.fillRect(x + 7, y - 7, 2, 2);
    ctx.fillRect(x + 9, y - 9, 2, 2);
    ctx.fillRect(x + 7, y - 5, 2, 2);
  }

  // Review available indicator (pulsing book/scroll icon)
  function drawReviewBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 4) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (golden)
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Book icon
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 4, y - 12, 8, 6);
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(x + 7, y - 12, 2, 6); // spine
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(x + 5, y - 11, 2, 1);
    ctx.fillRect(x + 9, y - 11, 2, 1);
    ctx.fillRect(x + 5, y - 9, 2, 1);
    ctx.fillRect(x + 9, y - 9, 2, 1);
    ctx.globalAlpha = 1;
  }

  // Challenge available indicator (pulsing flame/lightning icon)
  function drawChallengeBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 5) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (red/yellow gradient feel)
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Lightning bolt icon
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 7, y - 13, 3, 2);
    ctx.fillRect(x + 6, y - 11, 3, 2);
    ctx.fillRect(x + 5, y - 9, 3, 2);
    ctx.fillRect(x + 7, y - 7, 3, 2);
    ctx.globalAlpha = 1;
  }

  // Streak fire icon for HUD
  function drawStreakFire(ctx, x, y, streak) {
    // Flame base
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x + 2, y + 3, 4, 5);
    ctx.fillRect(x + 1, y + 5, 6, 3);
    // Flame tip
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(x + 3, y + 1, 2, 4);
    ctx.fillRect(x + 2, y + 4, 4, 2);
    // Inner glow
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 3, y + 3, 2, 3);
  }

  function drawStar(ctx, x, y, filled) {
    ctx.fillStyle = filled ? '#f1c40f' : '#555';
    // Simple 8-pixel star shape
    ctx.fillRect(x + 3, y, 2, 1);
    ctx.fillRect(x + 1, y + 1, 6, 1);
    ctx.fillRect(x + 0, y + 2, 8, 1);
    ctx.fillRect(x + 1, y + 3, 6, 1);
    ctx.fillRect(x + 2, y + 4, 4, 1);
    ctx.fillRect(x + 1, y + 5, 2, 1);
    ctx.fillRect(x + 5, y + 5, 2, 1);
  }

  // ============ STAMP CARD VISUALS ============
  const STAMP_COLORS = {
    empty:  { fill: '#333', border: '#555', icon: '#444' },
    bronze: { fill: '#8B5E3C', border: '#A0764A', icon: '#D4A76A' },
    silver: { fill: '#A8A8A8', border: '#CCC', icon: '#E8E8E8' },
    gold:   { fill: '#D4AF37', border: '#F1C40F', icon: '#FFF8DC' },
  };

  // Draw a single stamp circle (12x12)
  function drawStamp(ctx, x, y, tier, size) {
    size = size || 12;
    const tierName = tier >= 3 ? 'gold' : tier >= 2 ? 'silver' : tier >= 1 ? 'bronze' : 'empty';
    const colors = STAMP_COLORS[tierName];
    const r = size / 2;
    const cx = x + r;
    const cy = y + r;

    // Outer circle
    ctx.fillStyle = colors.border;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner circle
    ctx.fillStyle = colors.fill;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.fill();

    if (tier > 0) {
      // Stamp icon: cherry blossom pattern for filled stamps
      ctx.fillStyle = colors.icon;
      // Center dot
      ctx.fillRect(cx - 1, cy - 1, 2, 2);
      // Petals (4 directions)
      ctx.fillRect(cx - 1, cy - 3, 2, 2); // top
      ctx.fillRect(cx - 1, cy + 1, 2, 2); // bottom
      ctx.fillRect(cx - 3, cy - 1, 2, 2); // left
      ctx.fillRect(cx + 1, cy - 1, 2, 2); // right
    } else {
      // Empty stamp: just a faint outline
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Draw master stamp (larger, special golden seal)
  function drawMasterStamp(ctx, x, y, unlocked) {
    const size = 16;
    const r = size / 2;
    const cx = x + r;
    const cy = y + r;

    if (unlocked) {
      // Golden seal with sparkle
      ctx.fillStyle = '#F1C40F';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
      ctx.fill();
      // Crown/star icon
      ctx.fillStyle = '#FFF8DC';
      ctx.fillRect(cx - 3, cy - 2, 6, 1);
      ctx.fillRect(cx - 4, cy - 1, 8, 3);
      ctx.fillRect(cx - 2, cy - 4, 1, 2);
      ctx.fillRect(cx + 1, cy - 4, 1, 2);
      ctx.fillRect(cx - 1, cy - 3, 2, 1);
    } else {
      // Locked: dark circle with ? mark
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#555';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText('?', cx, cy + 3);
      ctx.textAlign = 'left';
    }
  }

  // Draw stamp card HUD icon (small stamp book icon)
  function drawStampBookIcon(ctx, x, y, stampCount, maxStamps) {
    // Small book shape 14x10
    ctx.fillStyle = '#8B2252';
    ctx.fillRect(x, y, 14, 10);
    ctx.fillStyle = '#A83279';
    ctx.fillRect(x + 1, y + 1, 12, 8);
    // Spine
    ctx.fillStyle = '#6B1A42';
    ctx.fillRect(x + 6, y, 2, 10);
    // Stamp dots on cover
    ctx.fillStyle = stampCount > 0 ? '#F1C40F' : '#555';
    ctx.fillRect(x + 3, y + 3, 2, 2);
    ctx.fillRect(x + 9, y + 3, 2, 2);
    ctx.fillRect(x + 3, y + 6, 2, 2);
    ctx.fillRect(x + 9, y + 6, 2, 2);
  }

  // Draw the full stamp card overlay
  function drawStampCardOverlay(ctx, canvasW, canvasH, stampCards, storeColors, time) {
    // Semi-transparent backdrop
    ctx.fillStyle = 'rgba(10, 10, 30, 0.92)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Card background
    const cardX = 12;
    const cardY = 14;
    const cardW = canvasW - 24;
    const cardH = canvasH - 28;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#8B2252';
    ctx.lineWidth = 1;
    ctx.strokeRect(cardX + 2, cardY + 2, cardW - 4, cardH - 4);

    // Title
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#D4AF37';
    ctx.textAlign = 'center';
    ctx.fillText('STAMP CARD', canvasW / 2, cardY + 14);
    ctx.font = '10px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#F1C40F';
    ctx.fillText('\u30B9\u30BF\u30F3\u30D7\u30AB\u30FC\u30C9', canvasW / 2, cardY + 26);

    // Store stamp rows
    const stores = ['7-Eleven', 'Lawson', 'FamilyMart'];
    const storeLabels = ['7-ELEVEN', 'LAWSON', 'FamilyMart'];
    const storeClrs = {
      '7-Eleven': '#d4380d',
      'Lawson': '#1a6fc4',
      'FamilyMart': '#27ae60'
    };

    const rowStartY = cardY + 34;
    const rowH = 48;

    for (let s = 0; s < 3; s++) {
      const store = stores[s];
      const card = stampCards[store];
      const rowY = rowStartY + s * rowH;

      // Store label background
      const labelClr = storeClrs[store];
      ctx.fillStyle = labelClr;
      ctx.fillRect(cardX + 6, rowY, cardW - 12, 10);
      ctx.font = '5px "Press Start 2P"';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(storeLabels[s], canvasW / 2, rowY + 8);

      // Stamp slots
      const stampStartX = cardX + 20;
      const stampY = rowY + 14;
      const stampSpacing = 38;

      // Level names for this store
      const levelNames = [];
      const storeLvls = NPCs.storeLevels[store];
      for (let i = 0; i < storeLvls.length; i++) {
        levelNames.push(LEVELS[storeLvls[i]].name);
      }

      for (let i = 0; i < 4; i++) {
        const sx = stampStartX + i * stampSpacing;
        const tier = card.stamps[i];

        // Animate new stamps with a pulse
        const stampAlpha = tier > 0 ? 1.0 : 0.4;
        ctx.globalAlpha = stampAlpha;
        drawStamp(ctx, sx, stampY, tier, 14);
        ctx.globalAlpha = 1;

        // Level name below stamp
        ctx.font = '4px "Press Start 2P"';
        ctx.fillStyle = tier > 0 ? '#ccc' : '#555';
        ctx.textAlign = 'center';
        const lvlName = levelNames[i] || '';
        ctx.fillText(lvlName.substring(0, 8), sx + 7, stampY + 20);
      }

      // Master stamp at end
      const masterX = stampStartX + 4 * stampSpacing - 8;
      drawMasterStamp(ctx, masterX, stampY - 1, card.masterStamp);

      ctx.textAlign = 'left';
    }

    // Footer: total progress
    const { total, max } = NPCs.getTotalStamps();
    const pct = max > 0 ? Math.round(total / max * 100) : 0;

    // Progress bar
    const barX = cardX + 20;
    const barY = cardY + cardH - 22;
    const barW = cardW - 40;
    const barH = 6;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(barX, barY, barW * (pct / 100), barH);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(barX, barY, barW, barH);

    // Progress text
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#D4AF37';
    ctx.textAlign = 'center';
    ctx.fillText(`${total}/${max} (${pct}%)`, canvasW / 2, barY + 14);

    // Close hint
    ctx.fillStyle = '#888';
    ctx.fillText('[B] Close', canvasW / 2, cardY + cardH - 4);

    ctx.textAlign = 'left';
  }

  return {
    T,
    drawPlayer,
    drawClerk,
    drawNPC,
    drawTile,
    drawExclamation,
    drawSpeechBubble,
    drawCheckmark,
    drawReviewBubble,
    drawChallengeBubble,
    drawStreakFire,
    drawStar,
    drawPixelMap,
    // Stamp card
    drawStamp,
    drawMasterStamp,
    drawStampBookIcon,
    drawStampCardOverlay,
  };
})();
