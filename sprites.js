/* Konbini Quest v2 - HD Programmatic Sprite System (16x16 pixel art) */
/* Improvement #11: HD Graphics Upgrade - GBC-quality pixel art */
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

  // ============ PLAYER SPRITES (HD) ============
  // Expanded palette: added shadow tones, mouth, blush, backpack shadow, shoe highlight
  const playerPalette = {
    'H': '#4a2e15', // hair dark
    'h': '#6b4226', // hair mid
    'i': '#8a5a35', // hair highlight
    'S': '#f5d0a9', // skin
    's': '#e0b88a', // skin shadow
    'E': '#1a1a2e', // eyes
    'W': '#fff',    // white/eye whites
    'w': '#ddd',    // off-white
    'M': '#d4685a', // mouth
    'B': '#f0a0a0', // blush
    'T': '#d9382c', // shirt main
    't': '#b52d22', // shirt shadow
    'R': '#e8504a', // shirt highlight
    'P': '#2c3e50', // pants
    'p': '#1e2d3a', // pants shadow
    'K': '#d4a017', // backpack
    'k': '#b8880f', // backpack shadow
    'O': '#1a5276', // shoes
    'o': '#244a65', // shoe highlight
  };

  // Player facing down, frame 0 — HD version with shading, expression
  const playerDown0 = `
....hHHi....
...HhHHiH...
...HHHHHH...
..sWEsWEs..
..sSBSSBSs..
...ssMSss...
..tTTRRTTt..
..tTTTTTTt..
..TKTTTTKT..
...tTTTTt...
..pPPPPPPp..
..pP.PP.Pp..
..PP.PP.PP..
...PP..PP...
...Oo..oO...
...OO..OO...`;

  // Player facing down, frame 1 (left foot forward)
  const playerDown1 = `
....hHHi....
...HhHHiH...
...HHHHHH...
..sWEsWEs..
..sSBSSBSs..
...ssMSss...
..tTTRRTTt..
..tTTTTTTt..
..TKTTTTKT..
...tTTTTt...
..pPPPPPPp..
..pP.PP.Pp..
..PP.PP.PP..
..PP....PP..
..Oo....oO..
...OO..OO...`;

  // Player facing up, frame 0
  const playerUp0 = `
....hHHi....
...HhHHiH...
...HHHHHH...
...HHHHHH...
..sSSSSSs...
...sSSSs....
..tTTTTTTt..
..tTTTTTTt..
..kKTTTTKk..
...kKKKKk...
..pPPPPPPp..
..pP.PP.Pp..
..PP.PP.PP..
...PP..PP...
...Oo..oO...
...OO..OO...`;

  // Player facing up, frame 1
  const playerUp1 = `
....hHHi....
...HhHHiH...
...HHHHHH...
...HHHHHH...
..sSSSSSs...
...sSSSs....
..tTTTTTTt..
..tTTTTTTt..
..kKTTTTKk..
...kKKKKk...
..pPPPPPPp..
..pP.PP.Pp..
..PP.PP.PP..
..PP....PP..
..Oo....oO..
...OO..OO...`;

  // Player facing left, frame 0
  const playerLeft0 = `
....hHHi....
...HhHHiH...
...HHHHHH...
..sWEsSs....
..sSSSss....
...sMss.....
..tTTTTK....
..tTTTKk....
..tTTTTK....
...tTTT.....
..pPPPPp....
..pP.PP.....
..PP.PP.....
...PP.PP....
...Oo.oO....
...OO.OO....`;

  // Player facing left, frame 1
  const playerLeft1 = `
....hHHi....
...HhHHiH...
...HHHHHH...
..sWEsSs....
..sSSSss....
...sMss.....
..tTTTTK....
..tTTTKk....
..tTTTTK....
...tTTT.....
..pPPPPp....
..pP.PP.....
..PP.PP.....
..PP..PP....
..Oo..oO....
...OO.OO....`;

  // Player facing right, frame 0
  const playerRight0 = `
....hHHi....
...HhHHiH...
...HHHHHH...
....sSsEWs..
....ssSSSs..
.....ssMs...
....KTTTTt..
....kKTTTt..
....KTTTTt..
.....TTTt...
....pPPPPp..
.....PP.Pp..
.....PP.PP..
....PP.PP...
....Oo.oO...
....OO.OO...`;

  // Player facing right, frame 1
  const playerRight1 = `
....hHHi....
...HhHHiH...
...HHHHHH...
....sSsEWs..
....ssSSSs..
.....ssMs...
....KTTTTt..
....kKTTTt..
....KTTTTt..
.....TTTt...
....pPPPPp..
.....PP.Pp..
.....PP.PP..
....PP..PP..
....Oo..oO..
....OO.OO...`;

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

  // ============ CLERK SPRITES (HD) ============
  function getClerkPalette(store) {
    const base = {
      'H': '#1a1a2e', // hair dark
      'h': '#2a2a3e', // hair highlight
      'S': '#f5d0a9', // skin
      's': '#e0b88a', // skin shadow
      'E': '#1a1a2e', // eyes
      'W': '#fff',
      'M': '#d4685a', // mouth
      'B': '#f0a0a0', // blush
      'A': '#888',    // apron
      'a': '#777',    // apron shadow
      'P': '#2c3e50', // pants
      'p': '#1e2d3a', // pants shadow
      'O': '#333',    // shoes
    };
    if (store === '7-Eleven') {
      base['U'] = '#d4380d'; base['u'] = '#aa2a08'; base['A'] = '#e8652e'; base['a'] = '#c45420';
    } else if (store === 'Lawson') {
      base['U'] = '#1a6fc4'; base['u'] = '#155aa0'; base['A'] = '#3498db'; base['a'] = '#2a7ab8';
    } else {
      base['U'] = '#27ae60'; base['u'] = '#1e8c4e'; base['A'] = '#2ecc71'; base['a'] = '#25a85e';
    }
    return base;
  }

  const clerkDown = `
....hHHh....
...HHHHHH...
...HhHHhH...
..sWEsWEs..
..sSBSSBSs..
...ssMs.....
..uUUUUUUu..
..UUUUUUUU..
..aAUUUUAa..
..AAAAAAAA..
..pPPPPPPp..
..PP.PP.PP..
..PP.PP.PP..
...PP..PP...
...OO..OO...
...OO..OO...`;

  const clerkUp = `
....hHHh....
...HHHHHH...
...HHHHHH...
...HHHHHH...
..sSSSSSs...
...sSSSs....
..uUUUUUUu..
..UUUUUUUU..
..aAUUUUAa..
..AAAAAAAA..
..pPPPPPPp..
..PP.PP.PP..
..PP.PP.PP..
...PP..PP...
...OO..OO...
...OO..OO...`;

  const clerkLeft = `
....hHHh....
...HHHHHH...
...HhHHhH...
..sWEsSs....
..sSSSss....
...sMss.....
..uUUUUU....
..UUUUUU....
..aAUUUU....
..AAAAAA....
..pPPPPp....
..PP.PP.....
..PP.PP.....
...PP.PP....
...OO.OO....
...OO.OO....`;

  const clerkRight = `
....hHHh....
...HHHHHH...
...HhHHhH...
....sSsEWs..
....ssSSSs..
.....ssMs...
....UUUUUu..
....UUUUUU..
....UUUUAa..
....AAAAAA..
....pPPPPp..
.....PP.PP..
.....PP.PP..
....PP.PP...
....OO.OO...
....OO.OO...`;

  const clerkFrames = { down: clerkDown, up: clerkUp, left: clerkLeft, right: clerkRight };

  function drawClerk(ctx, x, y, store, dir) {
    const palette = getClerkPalette(store);
    drawPixelMap(ctx, x, y, clerkFrames[dir] || clerkDown, palette);
  }

  // ============ NPC SPRITES (HD) ============
  // Old man — wrinkled face, grey/white hair, warm brown coat, walking cane implied
  const npcOldMan = `
...WWWWWW...
..WwWWWwWW..
..WWWWWWWW..
..sWEsWEs..
..sSSSSSs...
...ssMss....
..88888888..
..8C8888C8..
..88888888..
...888888...
..66666666..
..66.66.66..
..66.66.66..
...66..66...
...33..33...
...33..33...`;

  const npcOldManPalette = {
    'W': '#c8c8c8', 'w': '#ddd',   // grey hair with highlight
    'S': '#e0b88a', 's': '#d0a07a', 'E': '#222', 'M': '#c09080',
    '8': '#7a6548', 'C': '#8b7558', // coat with button highlight
    '6': '#4a4a4a', '3': '#333'
  };

  // School girl — dark navy uniform, red bow tie, knee socks
  const npcSchoolGirl = `
....1111....
...1q11q1...
...111111...
..sWEsWEs..
..sSBSSBSs..
...ssMs.....
..NNNNNNNN..
..NrNNNNrN..
..NNNNNNNN..
...NNNNNN...
..22222222..
..22.22.22..
..22.22.22..
...WW..WW...
...WW..WW...
...OO..OO...`;

  const npcSchoolGirlPalette = {
    '1': '#1a1a2e', 'q': '#2a2a44', // hair with highlight
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff',
    'M': '#e07070', 'B': '#ffaaaa', // pink mouth, blush
    'N': '#1a3a6e', 'r': '#e74c3c', // navy uniform, red bow
    '2': '#2c3e50', 'O': '#1a1a2e'
  };

  // Business man — dark suit, white shirt collar, red tie, briefcase
  const npcBusinessMan = `
....1111....
...1q11q1...
...111111...
..sWEsWEs..
..sSSSSSs...
...ssSss....
..44W44W44..
..44WRW444..
..44444444..
...444444...
..44444444..
..44.44.44..
..44.44.44..
...44..44...
...33..33...
...33..33...`;

  const npcBusinessManPalette = {
    '1': '#1a1a2e', 'q': '#2a2a3e',
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#e8e8e8',
    'R': '#c0392b', // red tie
    '4': '#2c3450', '3': '#1a1a1a'
  };

  // Sensei — grey hair, wise wrinkles, maroon/gold robe, wooden sandals
  const npcSensei = `
....HHHH....
...HhHHhH...
...HHHHHH...
..sWEsWEs..
..sSSSSSs...
..ssMSSs....
..RRRRRRRR..
..RRGRRGRR..
..RrRRRRrR..
...RRRRRR...
..RRRRRRRR..
..RR.RR.RR..
..RR.RR.RR..
...RR..RR...
...55..55...
...55..55...`;

  const npcSenseiPalette = {
    'H': '#999',  'h': '#bbb',  // grey hair with silver highlights
    'S': '#e0b88a', 's': '#d0a07a', 'E': '#222', 'W': '#e8ddd0',
    'M': '#c09080',
    'R': '#8b2252', 'r': '#6b1a42', 'G': '#d4af37', // maroon robe, gold accents
    '5': '#5a4030'  // wooden sandals
  };

  // Challenge Master NPC — energetic, yellow outfit, red headband, bright eyes
  const npcChallenger = `
....HHHH....
...HhHHhH...
..rRRRRRRr..
..sWEsWEs..
..sSSSSSs...
...ssMss....
..yYYYYYYy..
..YYwYYwYY..
..YYYYYYYY..
...YYYYYY...
..yYYYYYYy..
..YY.YY.YY..
..YY.YY.YY..
...YY..YY...
...WW..WW...
...WW..WW...`;

  const npcChallengerPalette = {
    'H': '#1a1a2e', 'h': '#2a2a3e',
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff', 'w': '#e8e8e8',
    'M': '#c09080',
    'R': '#e74c3c', 'r': '#c0392b', // red headband
    'Y': '#f1c40f', 'y': '#d4a80d', // yellow outfit with shadow
  };

  // Walk frame 1 variants -- shift feet for walking animation
  const npcOldManWalk = `
...WWWWWW...
..WwWWWwWW..
..WWWWWWWW..
..sWEsWEs..
..sSSSSSs...
...ssMss....
..88888888..
..8C8888C8..
..88888888..
...888888...
..66666666..
..66.66.66..
..66.66.66..
..66..66....
..33..33....
...33.33....`;

  const npcSchoolGirlWalk = `
....1111....
...1q11q1...
...111111...
..sWEsWEs..
..sSBSSBSs..
...ssMs.....
..NNNNNNNN..
..NrNNNNrN..
..NNNNNNNN..
...NNNNNN...
..22222222..
..22.22.22..
..22.22.22..
....22..22..
....WW..WW..
...WW..WW...`;

  const npcBusinessManWalk = `
....1111....
...1q11q1...
...111111...
..sWEsWEs..
..sSSSSSs...
...ssSss....
..44W44W44..
..44WRW444..
..44444444..
...444444...
..44444444..
..44.44.44..
..44.44.44..
..44..44....
..33..33....
...33.33....`;

  // Payment Coach NPC -- professional woman, teal blazer, light hair, holding card
  const npcPaymentCoach = `
....1111....
...1q11q1...
...111111...
..sWEsWEs..
..sSBSSBSs..
...ssMs.....
..TTTTTTTT..
..TwTTTTwT..
..TTTTTTTT..
...TTTTTT...
..22222222..
..22.22.22..
..22.22.22..
...22..22...
...WW..WW...
...OO..OO...`;

  const npcPaymentCoachPalette = {
    '1': '#c08850', 'q': '#d4a060', // light brown hair with highlight
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff',
    'M': '#d47070', 'B': '#ffaaaa', // pink mouth, blush
    'T': '#2a8a8a', 'w': '#e8e8e8', // teal blazer with white shirt detail
    '2': '#2c3e50', 'O': '#1a1a2e'
  };

  // Seasonal Guide NPC -- warm grandmother type, headscarf, apron, gentle colors
  const npcSeasonalGuide = `
...AAAAAA...
..AaAAAAaA..
..AAAAAAAA..
..sWEsWEs..
..sSSSSSs...
...ssMs.....
..GGGGGGGG..
..GwGGGGwG..
..GGGGGGGG..
...GGGGGG...
..PPPPPPPP..
..PP.PP.PP..
..PP.PP.PP..
...PP..PP...
...33..33...
...33..33...`;

  const npcSeasonalGuidePalette = {
    'A': '#c06040', 'a': '#d47850', // warm rust headscarf with highlight
    'S': '#f0c8a0', 's': '#d8b090', 'E': '#1a1a2e', 'W': '#fff',
    'M': '#c08070', // gentle smile
    'G': '#608050', 'w': '#f0e8d0', // olive green apron, cream shirt
    'P': '#705040', '3': '#4a3020' // brown skirt, dark shoes
  };

  // Kansai Dialect Coach NPC -- energetic Osaka character, tiger-stripe happi coat, headband
  const npcKansaiCoach = `
...RRRRRR...
..RhRRRRhR..
..RRRRRRRR..
..sWEsWEs..
..sSBSSBSs..
...ssMs.....
..TTYTTYTT..
..TYTTTYTw..
..TYTTTYTT..
...TTTTTT...
..22222222..
..22.22.22..
..22.22.22..
...22..22...
...GG..GG...
...GG..GG...`;

  const npcKansaiCoachPalette = {
    'R': '#cc2222', 'h': '#ff4444', // red headband with highlight
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff',
    'M': '#d47070', 'B': '#ffaaaa', // expressive smile, blush
    'T': '#1a1a2e', 'Y': '#f1c40f', 'w': '#fff', // tiger-stripe happi (black/gold)
    '2': '#2c3e50', 'G': '#8b4513' // dark pants, wooden geta sandals
  };

  // Politeness Coach NPC -- refined woman in navy kimono teaching keigo levels
  const npcPolitenessCoach = `
...HHHHHH....
..HhHHHhHH..
..HHHHHHHH..
..sWEsSEWs..
..sSBSSBSs..
...ssMss....
..NNNONN....
..NNONNONw..
..NNONNONN..
...NNNNNN...
..KKKKKKKK..
..KK.KK.KK..
..KK.KK.KK..
...KK..KK...
...ZZ..ZZ...
...ZZ..ZZ...`;

  const npcPolitenessCoachPalette = {
    'H': '#1a1a2e', 'h': '#334',    // dark upswept hair with sheen
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff',
    'M': '#c06060', 'B': '#f0a0a0', // gentle smile, blush
    'N': '#1a2744', 'O': '#c0a040', 'w': '#fff', // navy kimono with gold obi
    'K': '#1a2744', 'Z': '#f5f5f0'  // kimono lower, white tabi socks
  };

  const npcSprites = {
    oldman:      { frames: [npcOldMan, npcOldManWalk], palette: npcOldManPalette },
    schoolgirl:  { frames: [npcSchoolGirl, npcSchoolGirlWalk], palette: npcSchoolGirlPalette },
    businessman: { frames: [npcBusinessMan, npcBusinessManWalk], palette: npcBusinessManPalette },
    sensei:      { frames: [npcSensei], palette: npcSenseiPalette },
    challenger:  { frames: [npcChallenger], palette: npcChallengerPalette },
    paymentcoach: { frames: [npcPaymentCoach], palette: npcPaymentCoachPalette },
    seasonalguide: { frames: [npcSeasonalGuide], palette: npcSeasonalGuidePalette },
    kansaicoach: { frames: [npcKansaiCoach], palette: npcKansaiCoachPalette },
    politenesscoach: { frames: [npcPolitenessCoach], palette: npcPolitenessCoachPalette },
  };

  function drawNPC(ctx, x, y, type, dir, animFrame) {
    const sprite = npcSprites[type];
    if (!sprite) return;
    const frameIdx = (animFrame && sprite.frames.length > 1) ? animFrame % sprite.frames.length : 0;
    drawPixelMap(ctx, x, y, sprite.frames[frameIdx], sprite.palette);
  }

  // ============ TILE DRAWING (HD) ============
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

  // --- HD Tile drawing functions ---
  function drawSidewalk(tc) {
    tc.fillStyle = '#c8c0b0';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#beb6a6';
    tc.fillRect(0, 0, 8, 8);
    tc.fillRect(8, 8, 8, 8);
    // Grout lines
    tc.strokeStyle = '#a8a090';
    tc.lineWidth = 0.5;
    tc.strokeRect(0, 0, 8, 8);
    tc.strokeRect(8, 0, 8, 8);
    tc.strokeRect(0, 8, 8, 8);
    tc.strokeRect(8, 8, 8, 8);
    // Subtle cracks and wear
    tc.fillStyle = '#b0a898';
    tc.fillRect(3, 3, 1, 1);
    tc.fillRect(11, 5, 1, 1);
    tc.fillRect(5, 12, 2, 1);
    // Slight highlight on top edges
    tc.fillStyle = '#d4ccc0';
    tc.fillRect(1, 0, 6, 1);
    tc.fillRect(9, 8, 6, 1);
  }

  function drawRoad(tc) {
    tc.fillStyle = '#484848';
    tc.fillRect(0, 0, T, T);
    // Asphalt texture - deterministic for caching
    tc.fillStyle = '#424242';
    tc.fillRect(2, 1, 2, 1);
    tc.fillRect(8, 4, 3, 1);
    tc.fillRect(1, 8, 2, 1);
    tc.fillRect(11, 11, 2, 1);
    tc.fillRect(5, 13, 1, 1);
    tc.fillStyle = '#525252';
    tc.fillRect(6, 3, 1, 1);
    tc.fillRect(13, 7, 1, 1);
    tc.fillRect(3, 11, 1, 1);
  }

  function drawRoadCenter(tc) {
    tc.fillStyle = '#484848';
    tc.fillRect(0, 0, T, T);
    // Yellow center line with slight glow
    tc.fillStyle = '#c8a830';
    tc.fillRect(0, 6, T, 1);
    tc.fillStyle = '#e8c840';
    tc.fillRect(0, 7, T, 2);
    tc.fillStyle = '#c8a830';
    tc.fillRect(0, 9, T, 1);
  }

  function drawCrosswalk(tc) {
    tc.fillStyle = '#484848';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#e8e8e8';
    for (let y = 0; y < T; y += 4) {
      tc.fillRect(0, y, T, 2);
    }
    // Wear marks
    tc.fillStyle = '#d0d0d0';
    tc.fillRect(3, 0, 2, 1);
    tc.fillRect(8, 4, 2, 1);
    tc.fillRect(5, 8, 3, 1);
  }

  function drawGrass(tc) {
    tc.fillStyle = '#5a8f3a';
    tc.fillRect(0, 0, T, T);
    // Multi-shade grass texture
    tc.fillStyle = '#4a7f2a';
    tc.fillRect(2, 3, 2, 2);
    tc.fillRect(10, 7, 2, 2);
    tc.fillRect(6, 12, 2, 2);
    tc.fillStyle = '#6a9f4a';
    tc.fillRect(0, 1, 1, 1);
    tc.fillRect(7, 4, 1, 2);
    tc.fillRect(13, 10, 1, 1);
    tc.fillRect(4, 8, 1, 1);
    // Tiny flowers
    tc.fillStyle = '#f0e080';
    tc.fillRect(12, 2, 1, 1);
    tc.fillStyle = '#e0a0a0';
    tc.fillRect(1, 13, 1, 1);
  }

  function drawTree(tc) {
    // Trunk with bark detail
    tc.fillStyle = '#5a3a1e';
    tc.fillRect(6, 10, 4, 6);
    tc.fillStyle = '#6b4226';
    tc.fillRect(7, 10, 2, 6);
    // Shadow at trunk base
    tc.fillStyle = '#4a2e15';
    tc.fillRect(6, 14, 4, 2);
    // Leaf canopy with depth
    tc.fillStyle = '#1e7040';
    tc.fillRect(2, 2, 12, 10);
    tc.fillRect(4, 0, 8, 2);
    tc.fillStyle = '#2d8a4e';
    tc.fillRect(3, 3, 10, 7);
    tc.fillStyle = '#3aaa5e';
    tc.fillRect(4, 4, 8, 5);
    // Light dapples
    tc.fillStyle = '#50c070';
    tc.fillRect(5, 3, 2, 2);
    tc.fillRect(9, 5, 2, 1);
    // Dark depth
    tc.fillStyle = '#1a6038';
    tc.fillRect(2, 8, 3, 2);
    tc.fillRect(11, 6, 2, 2);
  }

  function drawCherryBlossom(tc) {
    // Trunk
    tc.fillStyle = '#3a2018';
    tc.fillRect(6, 10, 4, 6);
    tc.fillStyle = '#4a3020';
    tc.fillRect(7, 10, 2, 6);
    // Blossom canopy layers
    tc.fillStyle = '#e88898';
    tc.fillRect(2, 2, 12, 10);
    tc.fillRect(4, 0, 8, 2);
    tc.fillStyle = '#f0a0b0';
    tc.fillRect(3, 3, 10, 7);
    tc.fillStyle = '#f8c0d0';
    tc.fillRect(4, 4, 8, 5);
    // Individual petal highlights
    tc.fillStyle = '#ffe0e8';
    tc.fillRect(3, 4, 1, 1);
    tc.fillRect(9, 2, 1, 1);
    tc.fillRect(6, 7, 1, 1);
    tc.fillRect(11, 5, 1, 1);
    // Dark depth
    tc.fillStyle = '#d07888';
    tc.fillRect(2, 8, 2, 2);
    tc.fillRect(10, 7, 2, 2);
  }

  function drawBench(tc) {
    tc.fillStyle = '#c8c0b0';
    tc.fillRect(0, 0, T, T);
    // Shadow on ground
    tc.fillStyle = '#b8b0a0';
    tc.fillRect(1, 13, 14, 3);
    // Back support
    tc.fillStyle = '#6a4020';
    tc.fillRect(1, 3, 14, 3);
    tc.fillStyle = '#7a4e2c';
    tc.fillRect(2, 4, 12, 1);
    // Seat with wood grain
    tc.fillStyle = '#7a4a2a';
    tc.fillRect(1, 6, 14, 3);
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(2, 7, 12, 1);
    // Legs with shadow
    tc.fillStyle = '#4a2e15';
    tc.fillRect(2, 9, 2, 4);
    tc.fillRect(12, 9, 2, 4);
    tc.fillStyle = '#5a3a1e';
    tc.fillRect(3, 9, 1, 4);
    tc.fillRect(13, 9, 1, 4);
  }

  function drawStreetLamp(tc) {
    tc.fillStyle = '#c8c0b0';
    tc.fillRect(0, 0, T, T);
    // Pole with gradient
    tc.fillStyle = '#555';
    tc.fillRect(7, 4, 2, 12);
    tc.fillStyle = '#666';
    tc.fillRect(8, 4, 1, 12);
    // Lamp housing
    tc.fillStyle = '#555';
    tc.fillRect(3, 0, 10, 2);
    tc.fillStyle = '#666';
    tc.fillRect(4, 0, 8, 1);
    // Light glow
    tc.fillStyle = '#ffe066';
    tc.fillRect(4, 2, 8, 2);
    tc.fillStyle = '#fff8cc';
    tc.fillRect(5, 2, 6, 1);
    // Warm light on ground
    tc.fillStyle = '#d8d0c0';
    tc.fillRect(4, 14, 8, 2);
  }

  function drawFence(tc) {
    tc.fillStyle = '#5a8f3a';
    tc.fillRect(0, 0, T, T);
    // Horizontal bars with wood grain
    tc.fillStyle = '#7a4a2a';
    tc.fillRect(0, 4, T, 2);
    tc.fillRect(0, 10, T, 2);
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(0, 5, T, 1);
    tc.fillRect(0, 11, T, 1);
    // Vertical posts
    tc.fillStyle = '#5a3a1e';
    tc.fillRect(1, 2, 2, 12);
    tc.fillRect(7, 2, 2, 12);
    tc.fillRect(13, 2, 2, 12);
    // Post caps
    tc.fillStyle = '#6b4226';
    tc.fillRect(1, 2, 2, 1);
    tc.fillRect(7, 2, 2, 1);
    tc.fillRect(13, 2, 2, 1);
  }

  function drawVendingMachine(tc) {
    // Machine body with depth
    tc.fillStyle = '#1e4880';
    tc.fillRect(1, 0, 14, 16);
    tc.fillStyle = '#2c5aa0';
    tc.fillRect(2, 0, 12, 16);
    // Display window with glow
    tc.fillStyle = '#e8f4ff';
    tc.fillRect(2, 1, 12, 10);
    tc.fillStyle = '#d0e8ff';
    tc.fillRect(3, 2, 10, 8);
    // Drinks — arranged rows
    tc.fillStyle = '#e74c3c'; tc.fillRect(3, 2, 3, 3);
    tc.fillStyle = '#ff6b5b'; tc.fillRect(4, 2, 1, 2);
    tc.fillStyle = '#2ecc71'; tc.fillRect(7, 2, 3, 3);
    tc.fillStyle = '#4ee891'; tc.fillRect(8, 2, 1, 2);
    tc.fillStyle = '#f39c12'; tc.fillRect(11, 2, 2, 3);
    // Second row
    tc.fillStyle = '#fff'; tc.fillRect(3, 6, 3, 3);
    tc.fillStyle = '#e67e22'; tc.fillRect(7, 6, 3, 3);
    tc.fillStyle = '#3498db'; tc.fillRect(11, 6, 2, 3);
    // Coin slot and button panel
    tc.fillStyle = '#152a50';
    tc.fillRect(5, 12, 6, 3);
    tc.fillStyle = '#333';
    tc.fillRect(6, 13, 4, 1);
    // Coin slot highlight
    tc.fillStyle = '#d4af37';
    tc.fillRect(11, 12, 2, 1);
  }

  function drawBuildingWall(tc) {
    tc.fillStyle = '#d4c4a0';
    tc.fillRect(0, 0, T, T);
    // Brick pattern with mortar
    tc.strokeStyle = '#c0b090';
    tc.lineWidth = 0.5;
    for (let y = 0; y < T; y += 4) {
      for (let x = (y % 8 === 0 ? 0 : 4); x < T; x += 8) {
        tc.strokeRect(x, y, 8, 4);
      }
    }
    // Subtle shading for depth
    tc.fillStyle = '#ccc4a0';
    tc.fillRect(0, 0, T, 1);
    tc.fillStyle = '#c8b890';
    tc.fillRect(0, 15, T, 1);
  }

  function drawStoreAwning(tc, color1, color2) {
    tc.fillStyle = color1;
    tc.fillRect(0, 0, T, T);
    // Striped pattern with shadow
    tc.fillStyle = color2;
    for (let x = 0; x < T; x += 4) {
      tc.fillRect(x, 0, 2, T);
    }
    // Top dark edge
    tc.fillStyle = 'rgba(0,0,0,0.15)';
    tc.fillRect(0, 0, T, 1);
    // Bottom fringe with scallop
    tc.fillStyle = '#fff';
    tc.fillRect(0, T - 2, T, 2);
    tc.fillStyle = '#ffe';
    tc.fillRect(0, T - 3, T, 1);
    // Scallop detail
    tc.fillStyle = color1;
    tc.fillRect(1, T - 2, 1, 1);
    tc.fillRect(5, T - 2, 1, 1);
    tc.fillRect(9, T - 2, 1, 1);
    tc.fillRect(13, T - 2, 1, 1);
  }

  function drawStoreDoor(tc, color) {
    // Wall surround
    tc.fillStyle = '#8a7a60';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#9a8a70';
    tc.fillRect(0, 0, T, 1);
    // Door frame
    tc.fillStyle = color;
    tc.fillRect(2, 0, 12, 14);
    tc.fillStyle = 'rgba(0,0,0,0.15)';
    tc.fillRect(2, 0, 1, 14);
    // Glass pane with reflection
    tc.fillStyle = '#88c8e8';
    tc.fillRect(3, 1, 10, 8);
    tc.fillStyle = '#aed6f1';
    tc.fillRect(4, 2, 4, 4); // reflection highlight
    // Door divider
    tc.fillStyle = color;
    tc.fillRect(7, 1, 2, 8);
    // Handle
    tc.fillStyle = '#d4af37';
    tc.fillRect(10, 10, 2, 2);
    tc.fillStyle = '#e8c847';
    tc.fillRect(10, 10, 1, 1);
    // Mat
    tc.fillStyle = '#444';
    tc.fillRect(0, 14, T, 2);
    tc.fillStyle = '#555';
    tc.fillRect(1, 14, 14, 1);
  }

  function drawStoreWindow(tc, color) {
    tc.fillStyle = '#d4c4a0';
    tc.fillRect(0, 0, T, T);
    // Window frame with depth
    tc.fillStyle = color;
    tc.fillRect(1, 2, 14, 10);
    // Inner frame
    tc.fillStyle = 'rgba(0,0,0,0.1)';
    tc.fillRect(1, 2, 14, 1);
    // Glass with gradient reflection
    tc.fillStyle = '#88c8e8';
    tc.fillRect(2, 3, 12, 8);
    tc.fillStyle = '#aed6f1';
    tc.fillRect(2, 3, 5, 4); // top-left reflection
    // Cross frame
    tc.fillStyle = color;
    tc.fillRect(7, 3, 2, 8);
    tc.fillRect(2, 6, 12, 2);
    // Sill
    tc.fillStyle = '#c8b890';
    tc.fillRect(0, 12, T, 1);
  }

  // Store floor tiles
  function drawStoreFloor(tc, color1, color2) {
    tc.fillStyle = color1;
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = color2;
    tc.fillRect(0, 0, 8, 8);
    tc.fillRect(8, 8, 8, 8);
    // Floor shine
    tc.fillStyle = 'rgba(255,255,255,0.06)';
    tc.fillRect(2, 2, 4, 4);
    tc.fillRect(10, 10, 4, 4);
  }

  function drawStoreWall(tc, color) {
    tc.fillStyle = color;
    tc.fillRect(0, 0, T, T);
    // Baseboard
    tc.fillStyle = '#fff';
    tc.fillRect(0, T - 1, T, 1);
    // Subtle wall panel lines
    tc.fillStyle = 'rgba(0,0,0,0.04)';
    tc.fillRect(4, 0, 1, T - 1);
    tc.fillRect(11, 0, 1, T - 1);
  }

  function drawShelf(tc, accentColor) {
    // Shelf body with wood grain
    tc.fillStyle = '#7a4e2c';
    tc.fillRect(0, 0, T, T);
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(1, 0, 14, T);
    // Shelf ledges with highlight
    tc.fillStyle = '#a0764a';
    tc.fillRect(0, 4, T, 1);
    tc.fillRect(0, 10, T, 1);
    tc.fillStyle = '#b08a5a';
    tc.fillRect(1, 4, 14, 1);
    tc.fillRect(1, 10, 14, 1);
    // Products — more varied with labels
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', accentColor];
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 4; i++) {
        const cx = 1 + i * 4;
        const cy = row * 6 + 1;
        tc.fillStyle = colors[(row * 4 + i) % colors.length];
        tc.fillRect(cx, cy, 3, 3);
        // Product label/highlight
        tc.fillStyle = 'rgba(255,255,255,0.3)';
        tc.fillRect(cx, cy, 2, 1);
      }
    }
    // Bottom row
    tc.fillStyle = colors[2]; tc.fillRect(1, 12, 3, 3);
    tc.fillStyle = colors[0]; tc.fillRect(5, 12, 3, 3);
    tc.fillStyle = colors[3]; tc.fillRect(9, 12, 3, 3);
    tc.fillStyle = colors[1]; tc.fillRect(13, 12, 2, 3);
    // Product highlights bottom
    tc.fillStyle = 'rgba(255,255,255,0.3)';
    tc.fillRect(1, 12, 2, 1);
    tc.fillRect(5, 12, 2, 1);
    tc.fillRect(9, 12, 2, 1);
    tc.fillRect(13, 12, 1, 1);
  }

  function drawCounter(tc) {
    // Floor below
    tc.fillStyle = '#e8e0d0';
    tc.fillRect(0, 0, T, T);
    // Counter body with depth
    tc.fillStyle = '#7a4e2c';
    tc.fillRect(0, 2, T, 12);
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(1, 2, 14, 12);
    // Counter top with shine
    tc.fillStyle = '#a0764a';
    tc.fillRect(0, 0, T, 3);
    tc.fillStyle = '#b88a5a';
    tc.fillRect(1, 0, 14, 2);
    // Register
    tc.fillStyle = '#444';
    tc.fillRect(5, 3, 6, 5);
    tc.fillStyle = '#555';
    tc.fillRect(5, 3, 6, 1);
    // Register screen
    tc.fillStyle = '#2ecc71';
    tc.fillRect(6, 4, 4, 2);
    tc.fillStyle = '#4ee891';
    tc.fillRect(6, 4, 2, 1);
    // Keypad dots
    tc.fillStyle = '#888';
    tc.fillRect(6, 7, 1, 1);
    tc.fillRect(8, 7, 1, 1);
    tc.fillRect(10, 7, 1, 1);
  }

  function drawDoorMat(tc) {
    tc.fillStyle = '#e8e0d0';
    tc.fillRect(0, 0, T, T);
    // Mat with texture
    tc.fillStyle = '#555';
    tc.fillRect(2, 4, 12, 8);
    tc.fillStyle = '#4a4a4a';
    tc.fillRect(3, 5, 10, 6);
    // Mat texture lines
    tc.fillStyle = '#606060';
    tc.fillRect(3, 6, 10, 1);
    tc.fillRect(3, 9, 10, 1);
  }

  function drawSign(tc) {
    tc.fillStyle = '#c8c0b0';
    tc.fillRect(0, 0, T, T);
    // Sign board with beveled edge
    tc.fillStyle = '#1e2d3a';
    tc.fillRect(2, 1, 12, 10);
    tc.fillStyle = '#2c3e50';
    tc.fillRect(3, 2, 10, 8);
    tc.fillStyle = '#34495e';
    tc.fillRect(3, 2, 10, 1);
    // Post
    tc.fillStyle = '#555';
    tc.fillRect(7, 11, 2, 5);
    tc.fillStyle = '#666';
    tc.fillRect(8, 11, 1, 5);
    // Text lines with varied widths
    tc.fillStyle = '#ecf0f1';
    tc.fillRect(4, 3, 8, 1);
    tc.fillRect(4, 5, 6, 1);
    tc.fillRect(4, 7, 7, 1);
    // Decorative dot
    tc.fillStyle = '#e74c3c';
    tc.fillRect(10, 7, 1, 1);
  }

  // Hot food counter
  function drawHotFoodCounter(tc, accentColor) {
    // Floor
    tc.fillStyle = '#e8e0d0';
    tc.fillRect(0, 0, T, T);
    // Counter body
    tc.fillStyle = '#7a4e2c';
    tc.fillRect(0, 2, T, 12);
    tc.fillStyle = '#8b5e3c';
    tc.fillRect(1, 2, 14, 12);
    // Glass display case top
    tc.fillStyle = accentColor;
    tc.fillRect(1, 0, 14, 3);
    // Glass with warm glow
    tc.fillStyle = '#f8e8c0';
    tc.fillRect(2, 3, 12, 6);
    tc.fillStyle = '#f0ddb0';
    tc.fillRect(3, 4, 10, 4);
    // Food items with detail
    tc.fillStyle = '#d4880f';
    tc.fillRect(3, 4, 3, 3);
    tc.fillStyle = '#e8a030';
    tc.fillRect(3, 4, 2, 1);
    tc.fillStyle = '#c07808';
    tc.fillRect(8, 4, 3, 3);
    tc.fillStyle = '#d48818';
    tc.fillRect(8, 4, 2, 1);
    // Price label
    tc.fillStyle = '#fff';
    tc.fillRect(4, 10, 8, 2);
    tc.fillStyle = '#e74c3c';
    tc.fillRect(5, 10, 2, 1);
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

  // Payment practice indicator (pulsing teal card icon)
  function drawPaymentBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 3.5) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (teal)
    ctx.fillStyle = '#2a8a8a';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Card icon
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 4, y - 12, 8, 6);
    // Card stripe
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 4, y - 10, 8, 2);
    // Card chip
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(x + 5, y - 8, 3, 2);
    ctx.globalAlpha = 1;
  }

  // Seasonal practice indicator (pulsing leaf/sakura icon)
  function drawSeasonalBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 3) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (warm autumn orange)
    ctx.fillStyle = '#c06040';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Leaf icon
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(x + 6, y - 12, 4, 3);
    ctx.fillRect(x + 5, y - 11, 2, 2);
    ctx.fillRect(x + 10, y - 11, 2, 2);
    // Stem
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 7, y - 9, 2, 3);
    ctx.globalAlpha = 1;
  }

  // Kansai dialect practice indicator (pulsing speech bubble with Osaka dot)
  function drawKansaiBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 4) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (Osaka vibrant red-orange)
    ctx.fillStyle = '#cc2222';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Speech lines icon (dialect)
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 4, y - 12, 8, 2);
    ctx.fillRect(x + 5, y - 9, 6, 2);
    ctx.fillRect(x + 4, y - 6, 8, 1);
    ctx.globalAlpha = 1;
  }

  function drawPolitenessBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 3.5) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (refined navy-purple)
    ctx.fillStyle = '#2c1654';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Up-arrow icon (escalation symbol)
    ctx.fillStyle = '#c0a040';
    ctx.fillRect(x + 7, y - 12, 2, 1);
    ctx.fillRect(x + 6, y - 11, 4, 1);
    ctx.fillRect(x + 5, y - 10, 6, 1);
    // Three horizontal lines (three levels)
    ctx.fillRect(x + 5, y - 8, 6, 1);
    ctx.fillRect(x + 5, y - 6, 6, 1);
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

  // ============ VARIABLE REWARD RENDERING ============

  // Reward drop banner - shows when a bonus phrase is found
  function drawRewardBanner(ctx, canvasW, canvasH, reward, timer) {
    if (!reward) return;

    const tierColor = reward.tierInfo.color;
    const tier = reward.tier;

    // Animation: slide down from top, hold, fade out
    let alpha = 1;
    let slideY = 0;
    if (timer > 3.5) {
      // Slide in (0-0.5s)
      const t = (4.0 - timer) * 2;
      slideY = -30 + t * 30;
      alpha = t;
    } else if (timer < 0.8) {
      // Fade out
      alpha = timer / 0.8;
    } else {
      slideY = 0;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Banner dimensions
    const bannerW = 220;
    const bannerH = tier === 'ultra_rare' ? 56 : 50;
    const bannerX = (canvasW - bannerW) / 2;
    const bannerY = 30 + slideY;

    // Glow effect for rare/ultra_rare
    if (tier !== 'common') {
      const glowSize = 4 + Math.sin(timer * 6) * 2;
      ctx.fillStyle = tierColor + '33';
      ctx.fillRect(bannerX - glowSize, bannerY - glowSize, bannerW + glowSize * 2, bannerH + glowSize * 2);
    }

    // Background
    ctx.fillStyle = 'rgba(10,10,30,0.95)';
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);

    // Border with tier color
    ctx.strokeStyle = tierColor;
    ctx.lineWidth = tier === 'ultra_rare' ? 2 : 1;
    ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);
    if (tier === 'ultra_rare') {
      ctx.strokeStyle = tierColor + '88';
      ctx.strokeRect(bannerX - 1, bannerY - 1, bannerW + 2, bannerH + 2);
    }

    // Tier label header
    ctx.font = '5px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillStyle = tierColor;
    const tierLabel = `-- ${reward.tierInfo.labelJp} ${reward.tierInfo.label} --`;
    ctx.fillText(tierLabel, canvasW / 2, bannerY + 9);

    // "BONUS PHRASE!" header
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#fff';
    ctx.fillText('BONUS PHRASE FOUND!', canvasW / 2, bannerY + 19);

    // Japanese phrase
    ctx.font = '10px "M PLUS Rounded 1c"';
    ctx.fillStyle = tierColor;
    const jpText = reward.jp.length > 20 ? reward.jp.substring(0, 19) + '...' : reward.jp;
    ctx.fillText(jpText, canvasW / 2, bannerY + 32);

    // Romaji + English
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#aaa';
    const subText = `${reward.romaji} = ${reward.en}`;
    const trimmed = subText.length > 38 ? subText.substring(0, 37) + '...' : subText;
    ctx.fillText(trimmed, canvasW / 2, bannerY + 42);

    // Sparkle particles for rare/ultra_rare
    if (tier !== 'common') {
      const sparkleCount = tier === 'ultra_rare' ? 8 : 4;
      for (let i = 0; i < sparkleCount; i++) {
        const angle = (timer * 2 + i * (Math.PI * 2 / sparkleCount)) % (Math.PI * 2);
        const radius = 12 + Math.sin(timer * 3 + i) * 4;
        const sx = canvasW / 2 + Math.cos(angle) * (bannerW / 2 + radius);
        const sy = bannerY + bannerH / 2 + Math.sin(angle) * radius;
        const sparkleAlpha = 0.3 + Math.sin(timer * 5 + i * 1.5) * 0.3;
        ctx.globalAlpha = alpha * sparkleAlpha;
        ctx.fillStyle = tierColor;
        const size = tier === 'ultra_rare' ? 2 : 1;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
    }

    ctx.restore();
  }

  // Phrase book icon for HUD
  function drawPhraseBookIcon(ctx, x, y, count, total) {
    // Small book icon
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y + 1, 10, 8);
    ctx.fillStyle = '#D2691E';
    ctx.fillRect(x + 1, y + 2, 8, 6);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + 4, y + 2, 1, 6); // spine
    // Star on cover
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + 6, y + 4, 2, 2);
  }

  // Phrase book overlay - full screen collection viewer
  function drawPhraseBookOverlay(ctx, canvasW, canvasH, collected, total, time) {
    // Darken background
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Card dimensions
    const cardW = canvasW - 20;
    const cardH = canvasH - 20;
    const cardX = 10;
    const cardY = 10;

    // Card background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Title
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText('BONUS PHRASE BOOK', canvasW / 2, cardY + 14);

    // Subtitle
    ctx.font = '9px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#aaa';
    ctx.fillText('\u30DC\u30FC\u30CA\u30B9\u30D5\u30EC\u30FC\u30BA\u30D6\u30C3\u30AF', canvasW / 2, cardY + 24);

    // Count
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.fillText(`${collected.length}/${total} collected`, canvasW / 2, cardY + 32);

    ctx.textAlign = 'left';

    // Phrase list (scrollable area)
    const listY = cardY + 38;
    const lineH = 20;
    const maxVisible = 9;

    if (collected.length === 0) {
      ctx.font = '6px "Press Start 2P"';
      ctx.fillStyle = '#555';
      ctx.textAlign = 'center';
      ctx.fillText('No phrases collected yet!', canvasW / 2, listY + 30);
      ctx.fillText('Answer questions correctly', canvasW / 2, listY + 42);
      ctx.fillText('for a chance to find them.', canvasW / 2, listY + 54);
      ctx.textAlign = 'left';
    } else {
      // Sort by tier: ultra_rare first, then rare, then common
      const tierOrder = { ultra_rare: 0, rare: 1, common: 2 };
      const sorted = [...collected].sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

      for (let i = 0; i < Math.min(sorted.length, maxVisible); i++) {
        const phrase = sorted[i];
        const py = listY + i * lineH;
        const tierInfo = NPCs.TIER_INFO[phrase.tier];

        // Tier dot
        ctx.fillStyle = tierInfo.color;
        ctx.fillRect(cardX + 6, py + 3, 4, 4);

        // New indicator (pulsing)
        if (phrase.isNew) {
          const newAlpha = 0.5 + Math.sin(time * 4) * 0.5;
          ctx.save();
          ctx.globalAlpha = newAlpha;
          ctx.fillStyle = '#ff0';
          ctx.font = '4px "Press Start 2P"';
          ctx.fillText('NEW', cardX + 6, py + 1);
          ctx.restore();
        }

        // Japanese text
        ctx.font = '8px "M PLUS Rounded 1c"';
        ctx.fillStyle = '#fff';
        const jpDisplay = phrase.jp.length > 16 ? phrase.jp.substring(0, 15) + '...' : phrase.jp;
        ctx.fillText(jpDisplay, cardX + 14, py + 8);

        // Romaji + English
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#888';
        const subDisplay = `${phrase.romaji} = ${phrase.en}`;
        const trimSub = subDisplay.length > 34 ? subDisplay.substring(0, 33) + '...' : subDisplay;
        ctx.fillText(trimSub, cardX + 14, py + 16);
      }

      if (sorted.length > maxVisible) {
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(`+ ${sorted.length - maxVisible} more...`, canvasW / 2, listY + maxVisible * lineH + 4);
        ctx.textAlign = 'left';
      }
    }

    // Legend at bottom
    const legendY = cardY + cardH - 26;
    ctx.font = '4px "Press Start 2P"';
    const tiers = ['common', 'rare', 'ultra_rare'];
    const labels = ['COMMON', 'RARE', 'ULTRA RARE'];
    let lx = cardX + 20;
    for (let i = 0; i < tiers.length; i++) {
      const tInfo = NPCs.TIER_INFO[tiers[i]];
      ctx.fillStyle = tInfo.color;
      ctx.fillRect(lx, legendY, 4, 4);
      ctx.fillText(labels[i], lx + 6, legendY + 4);
      lx += labels[i].length * 4 + 18;
    }

    // Progress bar
    const barX = cardX + 20;
    const barY = cardY + cardH - 16;
    const barW = cardW - 40;
    const barH = 4;
    const pct = total > 0 ? collected.length / total : 0;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(barX, barY, barW * pct, barH);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(barX, barY, barW, barH);

    // Close hint
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('[B] Close', canvasW / 2, cardY + cardH - 4);
    ctx.textAlign = 'left';
  }

  // ============ INVENTORY BAG ICON (HUD) ============
  function drawBagIcon(ctx, x, y, count, total, hasNew) {
    // Small bag/shopping bag shape
    ctx.fillStyle = '#8B6914';
    // Bag body
    ctx.fillRect(x, y + 3, 10, 7);
    // Bag top flap
    ctx.fillStyle = '#A67C1A';
    ctx.fillRect(x + 1, y + 1, 8, 3);
    // Handle
    ctx.fillStyle = '#6B5010';
    ctx.fillRect(x + 3, y, 4, 2);
    ctx.fillRect(x + 3, y, 1, 1);
    ctx.fillRect(x + 6, y, 1, 1);
    // Items peek out
    if (count > 0) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + 2, y + 2, 2, 1);
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(x + 5, y + 2, 2, 1);
    }
    // "NEW" glow
    if (hasNew) {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(x + 8, y, 2, 2);
    }
  }

  // ============ INVENTORY ITEM ICONS (16x16 pixel art) ============
  function drawItemIcon(ctx, x, y, iconType) {
    const s = 1; // pixel scale
    ctx.save();
    switch (iconType) {
      case 'gum':
        // Pack of gum - small rectangle
        ctx.fillStyle = '#3498db';
        ctx.fillRect(x + 4, y + 2, 8, 12);
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(x + 4, y + 2, 8, 3);
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 6, y + 6, 4, 2);
        break;
      case 'tea':
        // Green tea bottle
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(x + 5, y + 4, 6, 10);
        ctx.fillStyle = '#1e8449';
        ctx.fillRect(x + 6, y + 1, 4, 4);
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 7, y + 7, 2, 3);
        ctx.fillStyle = '#d4ac0d';
        ctx.fillRect(x + 5, y + 13, 6, 1);
        break;
      case 'onigiri':
        // Triangle rice ball with nori
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 5, y + 2, 6, 4);
        ctx.fillRect(x + 4, y + 5, 8, 3);
        ctx.fillRect(x + 3, y + 7, 10, 3);
        ctx.fillRect(x + 3, y + 9, 10, 2);
        // Nori (seaweed)
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x + 4, y + 8, 8, 4);
        // Filling dot
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + 7, y + 5, 2, 2);
        break;
      case 'sandwich':
        // Triangle sandwich
        ctx.fillStyle = '#f5e6c8';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#f9e4b7';
        ctx.fillRect(x + 3, y + 3, 10, 2);
        ctx.fillRect(x + 3, y + 11, 10, 2);
        // Egg filling
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + 5, y + 5, 6, 2);
        // Lettuce
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(x + 4, y + 7, 8, 2);
        break;
      case 'bento':
        // Bento box from above
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x + 2, y + 3, 12, 10);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + 3, y + 4, 5, 4);
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 3, y + 8, 5, 4);
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(x + 9, y + 4, 4, 4);
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(x + 9, y + 8, 4, 4);
        // Divider
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x + 8, y + 3, 1, 10);
        ctx.fillRect(x + 2, y + 8, 12, 1);
        break;
      case 'soup':
        // Cup of soup
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillRect(x + 3, y + 5, 10, 6);
        // Soup inside
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(x + 5, y + 5, 6, 5);
        // Steam
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(x + 6, y + 2, 1, 2);
        ctx.fillRect(x + 9, y + 1, 1, 3);
        break;
      case 'coffee':
        // Coffee cup
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x + 5, y + 4, 6, 9);
        ctx.fillStyle = '#795548';
        ctx.fillRect(x + 4, y + 4, 8, 2);
        // Lid
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 4, y + 3, 8, 2);
        // Handle
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x + 11, y + 6, 2, 4);
        ctx.fillRect(x + 12, y + 7, 1, 2);
        // Label
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(x + 6, y + 8, 4, 2);
        break;
      case 'chicken':
        // Fried chicken drumstick
        ctx.fillStyle = '#d4880f';
        ctx.fillRect(x + 4, y + 3, 8, 6);
        ctx.fillRect(x + 5, y + 2, 6, 8);
        // Crispy bits
        ctx.fillStyle = '#b8700a';
        ctx.fillRect(x + 4, y + 4, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
        // Bone
        ctx.fillStyle = '#f5e6c8';
        ctx.fillRect(x + 6, y + 10, 3, 4);
        ctx.fillRect(x + 5, y + 13, 5, 1);
        break;
      case 'beer':
        // Beer can
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + 5, y + 2, 6, 12);
        ctx.fillStyle = '#d4ac0d';
        ctx.fillRect(x + 5, y + 2, 6, 3);
        // Label
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 6, y + 6, 4, 3);
        // Tab
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(x + 7, y + 1, 2, 2);
        break;
      case 'bread':
        // Melon pan
        ctx.fillStyle = '#f0c040';
        ctx.fillRect(x + 3, y + 4, 10, 8);
        ctx.fillRect(x + 4, y + 3, 8, 10);
        // Cross-hatch pattern
        ctx.fillStyle = '#d4a020';
        ctx.fillRect(x + 5, y + 4, 1, 8);
        ctx.fillRect(x + 8, y + 4, 1, 8);
        ctx.fillRect(x + 11, y + 4, 1, 8);
        ctx.fillRect(x + 3, y + 6, 10, 1);
        ctx.fillRect(x + 3, y + 9, 10, 1);
        break;
      default:
        // Generic item box
        ctx.fillStyle = '#888';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#aaa';
        ctx.fillRect(x + 5, y + 5, 6, 6);
    }
    ctx.restore();
  }

  // ============ INVENTORY OVERLAY ============
  function drawInventoryOverlay(ctx, canvasW, canvasH, items, total, time) {
    // Darken background
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Card dimensions
    const cardW = canvasW - 20;
    const cardH = canvasH - 20;
    const cardX = 10;
    const cardY = 10;

    // Card background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Title
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = '#d4a020';
    ctx.textAlign = 'center';
    ctx.fillText('MY KONBINI BAG', canvasW / 2, cardY + 14);

    // Japanese subtitle
    ctx.font = '9px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#aaa';
    ctx.fillText('\u30B3\u30F3\u30D3\u30CB\u306E\u304A\u8CB7\u3044\u7269', canvasW / 2, cardY + 24);

    // Count
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.fillText(`${items.length}/${total} items`, canvasW / 2, cardY + 32);

    ctx.textAlign = 'left';

    // Item grid
    const listY = cardY + 38;
    const itemH = 22;
    const maxVisible = 8;

    if (items.length === 0) {
      ctx.font = '6px "Press Start 2P"';
      ctx.fillStyle = '#555';
      ctx.textAlign = 'center';
      ctx.fillText('Your bag is empty!', canvasW / 2, listY + 25);
      ctx.fillText('Complete levels to', canvasW / 2, listY + 37);
      ctx.fillText('collect konbini items.', canvasW / 2, listY + 49);
      ctx.font = '8px "M PLUS Rounded 1c"';
      ctx.fillStyle = '#666';
      ctx.fillText('\u304A\u8CB7\u3044\u7269\u3092\u3057\u3088\u3046\uFF01', canvasW / 2, listY + 65);
      ctx.textAlign = 'left';
    } else {
      // Store brand colors for item highlights
      const storeColors = {
        '7-Eleven': '#d4380d',
        'Lawson': '#1a6fc4',
        'FamilyMart': '#27ae60',
      };

      for (let i = 0; i < Math.min(items.length, maxVisible); i++) {
        const item = items[i];
        const iy = listY + i * itemH;

        // Item row background (subtle)
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0)';
        ctx.fillRect(cardX + 4, iy, cardW - 8, itemH - 1);

        // Store color bar on left
        ctx.fillStyle = storeColors[item.store] || '#555';
        ctx.fillRect(cardX + 4, iy, 2, itemH - 1);

        // Item icon
        drawItemIcon(ctx, cardX + 8, iy + 2, item.icon);

        // New indicator
        if (item.isNew) {
          const newAlpha = 0.5 + Math.sin(time * 4) * 0.5;
          ctx.save();
          ctx.globalAlpha = newAlpha;
          ctx.fillStyle = '#FFD700';
          ctx.font = '4px "Press Start 2P"';
          ctx.fillText('NEW', cardX + 8, iy + 1);
          ctx.restore();
        }

        // Japanese name
        ctx.font = '8px "M PLUS Rounded 1c"';
        ctx.fillStyle = '#fff';
        const jpDisplay = item.jp.length > 12 ? item.jp.substring(0, 11) + '...' : item.jp;
        ctx.fillText(jpDisplay, cardX + 26, iy + 9);

        // Romaji + English
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#888';
        const subText = `${item.romaji} = ${item.en}`;
        const trimSub = subText.length > 30 ? subText.substring(0, 29) + '...' : subText;
        ctx.fillText(trimSub, cardX + 26, iy + 17);
      }

      if (items.length > maxVisible) {
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(`+ ${items.length - maxVisible} more...`, canvasW / 2, listY + maxVisible * itemH + 4);
        ctx.textAlign = 'left';
      }
    }

    // Store legend at bottom
    const legendY = cardY + cardH - 26;
    ctx.font = '4px "Press Start 2P"';
    let lx = cardX + 15;
    const stores = [['7-Eleven', '#d4380d'], ['Lawson', '#1a6fc4'], ['FamilyMart', '#27ae60']];
    for (const [name, color] of stores) {
      ctx.fillStyle = color;
      ctx.fillRect(lx, legendY, 4, 4);
      ctx.fillText(name, lx + 6, legendY + 4);
      lx += name.length * 4 + 14;
    }

    // Progress bar
    const barX = cardX + 20;
    const barY = cardY + cardH - 16;
    const barW = cardW - 40;
    const barH = 4;
    const pct = total > 0 ? items.length / total : 0;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#d4a020';
    ctx.fillRect(barX, barY, barW * pct, barH);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(barX, barY, barW, barH);

    // Close hint
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('[B] Close', canvasW / 2, cardY + cardH - 4);
    ctx.textAlign = 'left';
  }

  // ============ ACHIEVEMENT BADGES ============
  const TIER_COLORS = {
    bronze: { bg: '#8B5E3C', border: '#CD7F32', text: '#FFD4A8', glow: '#CD7F32' },
    silver: { bg: '#6A6A7A', border: '#C0C0C0', text: '#E8E8F0', glow: '#C0C0C0' },
    gold:   { bg: '#7A6420', border: '#FFD700', text: '#FFF8DC', glow: '#FFD700' },
  };

  // Draw a small 8x8 achievement icon based on type
  function drawAchievementIcon(ctx, x, y, icon, tier, size) {
    const s = size || 8;
    const tc = TIER_COLORS[tier] || TIER_COLORS.bronze;
    const half = Math.floor(s / 2);

    switch (icon) {
      case 'bag':
        ctx.fillStyle = tc.border;
        ctx.fillRect(x + 1, y, s - 2, 1);
        ctx.fillRect(x, y + 1, s, s - 2);
        ctx.fillStyle = tc.text;
        ctx.fillRect(x + 3, y + 2, 2, 1);
        break;
      case 'seven':
        ctx.fillStyle = '#d4380d';
        ctx.fillRect(x + 1, y + 1, s - 2, 2);
        ctx.fillRect(x + 4, y + 3, 2, s - 4);
        break;
      case 'lawson':
        ctx.fillStyle = '#1a6fc4';
        ctx.fillRect(x + 2, y, 1, s);
        ctx.fillRect(x + 2, y + s - 2, s - 3, 2);
        break;
      case 'famima':
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(x + 1, y + 1, s - 2, 2);
        ctx.fillRect(x + 1, y + 3, 2, 2);
        ctx.fillRect(x + 1, y + 5, s - 2, 2);
        break;
      case 'crown':
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x, y + 3, s, s - 4);
        ctx.fillRect(x, y + 1, 2, 2);
        ctx.fillRect(x + half - 1, y, 2, 2);
        ctx.fillRect(x + s - 2, y + 1, 2, 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + 2, y + 5, 1, 1);
        ctx.fillRect(x + s - 3, y + 5, 1, 1);
        break;
      case 'star':
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + 3, y, 2, 2);
        ctx.fillRect(x + 1, y + 2, 6, 2);
        ctx.fillRect(x + 2, y + 4, 4, 2);
        ctx.fillRect(x + 1, y + 6, 2, 2);
        ctx.fillRect(x + 5, y + 6, 2, 2);
        break;
      case 'sparkle':
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + half, y, 1, s);
        ctx.fillRect(x, y + half, s, 1);
        ctx.fillRect(x + 1, y + 1, 1, 1);
        ctx.fillRect(x + s - 2, y + 1, 1, 1);
        ctx.fillRect(x + 1, y + s - 2, 1, 1);
        ctx.fillRect(x + s - 2, y + s - 2, 1, 1);
        break;
      case 'stamp':
        ctx.fillStyle = tc.border;
        ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
        ctx.fillStyle = '#FFB7C5';
        ctx.fillRect(x + 2, y + 2, s - 4, s - 4);
        break;
      case 'book':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y + 1, 2, s - 2);
        ctx.fillStyle = tc.border;
        ctx.fillRect(x + 2, y, s - 3, s);
        ctx.fillStyle = tc.text;
        ctx.fillRect(x + 4, y + 2, 2, 1);
        ctx.fillRect(x + 4, y + 4, 3, 1);
        break;
      case 'fire':
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + 2, y, 3, 2);
        ctx.fillRect(x + 1, y + 2, 5, 3);
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(x + 2, y + 2, 3, 2);
        ctx.fillRect(x + 2, y + 5, 3, 2);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + 3, y + 4, 2, 3);
        break;
      case 'card':
        ctx.fillStyle = tc.border;
        ctx.fillRect(x, y + 1, s, s - 2);
        ctx.fillStyle = '#1a6fc4';
        ctx.fillRect(x + 1, y + 2, s - 2, 2);
        ctx.fillStyle = tc.text;
        ctx.fillRect(x + 1, y + 5, 3, 1);
        break;
      case 'leaf':
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(x + 3, y, 3, 2);
        ctx.fillRect(x + 2, y + 2, 4, 2);
        ctx.fillRect(x + 1, y + 4, 4, 2);
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(x + 4, y + 5, 2, 2);
        break;
      case 'speech':
        ctx.fillStyle = tc.border;
        ctx.fillRect(x + 1, y, s - 2, s - 3);
        ctx.fillRect(x, y + 1, s, s - 5);
        ctx.fillRect(x + 1, y + s - 3, 2, 2);
        ctx.fillStyle = tc.text;
        ctx.fillRect(x + 2, y + 2, 2, 1);
        ctx.fillRect(x + 2, y + 4, 3, 1);
        break;
      case 'bow':
        ctx.fillStyle = tc.border;
        ctx.fillRect(x + 2, y, 3, 3);
        ctx.fillRect(x + 1, y + 3, 5, 2);
        ctx.fillRect(x + 2, y + 5, 3, 3);
        ctx.fillStyle = '#f5d0a9';
        ctx.fillRect(x + 3, y + 1, 1, 1);
        break;
      case 'pencil':
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + 5, y, 2, 5);
        ctx.fillRect(x + 3, y + 3, 2, 3);
        ctx.fillRect(x + 1, y + 5, 2, 2);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y + 7, 2, 1);
        break;
      case 'brain':
        ctx.fillStyle = '#e8a0c0';
        ctx.fillRect(x + 1, y, s - 2, 2);
        ctx.fillRect(x, y + 2, s, 3);
        ctx.fillRect(x + 1, y + 5, s - 2, 2);
        ctx.fillStyle = '#d080a0';
        ctx.fillRect(x + half, y + 1, 1, 5);
        break;
      default:
        ctx.fillStyle = tc.border;
        ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
    }
  }

  // Draw the achievement trophy icon for HUD
  function drawTrophyIcon(ctx, x, y, count, total, hasNew) {
    // Trophy shape
    ctx.fillStyle = hasNew ? '#FFD700' : '#D4AF37';
    // Cup body
    ctx.fillRect(x + 2, y, 6, 2);
    ctx.fillRect(x + 1, y + 2, 8, 4);
    ctx.fillRect(x + 2, y + 6, 6, 1);
    // Handles
    ctx.fillRect(x, y + 2, 1, 3);
    ctx.fillRect(x + 9, y + 2, 1, 3);
    // Base
    ctx.fillRect(x + 3, y + 7, 4, 1);
    ctx.fillRect(x + 2, y + 8, 6, 1);
    // Shimmer
    ctx.fillStyle = '#FFF8DC';
    ctx.fillRect(x + 3, y + 3, 1, 1);
  }

  // Draw achievement unlock banner (toast notification)
  function drawAchievementBanner(ctx, canvasW, canvasH, achievement, timer) {
    if (!achievement) return;
    const tc = TIER_COLORS[achievement.tier] || TIER_COLORS.bronze;

    // Slide in from top
    const maxT = 4.0;
    const slideIn = Math.min(1, timer / 0.3);
    const slideOut = timer < 0.5 ? timer / 0.5 : 1;
    const alpha = Math.min(slideIn, slideOut);
    const yOffset = (1 - alpha) * -30;

    const bannerW = canvasW - 16;
    const bannerH = 28;
    const bannerX = 8;
    const bannerY = 30 + yOffset;

    // Glow effect
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = tc.glow;
    ctx.fillRect(bannerX - 1, bannerY - 1, bannerW + 2, bannerH + 2);

    ctx.globalAlpha = alpha;

    // Banner background
    ctx.fillStyle = 'rgba(10,10,30,0.95)';
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);

    // Border
    ctx.strokeStyle = tc.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

    // Icon
    drawAchievementIcon(ctx, bannerX + 4, bannerY + 4, achievement.icon, achievement.tier, 8);

    // "ACHIEVEMENT UNLOCKED" header
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = tc.border;
    ctx.textAlign = 'left';
    ctx.fillText('ACHIEVEMENT UNLOCKED!', bannerX + 16, bannerY + 9);

    // Achievement name
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#fff';
    ctx.fillText(achievement.name, bannerX + 16, bannerY + 18);

    // Japanese name
    ctx.font = '8px "M PLUS Rounded 1c"';
    ctx.fillStyle = tc.text;
    ctx.fillText(achievement.nameJp, bannerX + 16, bannerY + 26);

    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  // Draw the achievement gallery overlay
  function drawAchievementOverlay(ctx, canvasW, canvasH, achievements, time) {
    // Darken background
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Card
    const cardW = canvasW - 16;
    const cardH = canvasH - 16;
    const cardX = 8;
    const cardY = 8;

    ctx.fillStyle = '#0d0d1e';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Title
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText('ACHIEVEMENTS', canvasW / 2, cardY + 13);

    // Japanese subtitle
    ctx.font = '9px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#aaa';
    ctx.fillText('\u5B9F\u7E3E\u30D0\u30C3\u30B8', canvasW / 2, cardY + 23);

    // Count
    const unlocked = achievements.filter(a => a.unlocked).length;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.fillText(`${unlocked}/${achievements.length} unlocked`, canvasW / 2, cardY + 31);

    ctx.textAlign = 'left';

    // Achievement grid — 2 columns
    const startY = cardY + 36;
    const colW = Math.floor((cardW - 8) / 2);
    const rowH = 26;
    const maxRows = 7;

    achievements.forEach((ach, i) => {
      if (i >= maxRows * 2) return; // max 14 visible
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ax = cardX + 4 + col * colW;
      const ay = startY + row * rowH;

      const tc = TIER_COLORS[ach.tier] || TIER_COLORS.bronze;

      if (ach.unlocked) {
        // Unlocked: colored card
        ctx.fillStyle = 'rgba(40,40,60,0.9)';
        ctx.fillRect(ax, ay, colW - 2, rowH - 2);
        ctx.strokeStyle = tc.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(ax, ay, colW - 2, rowH - 2);

        // NEW indicator
        if (ach.isNew) {
          const pulse = 0.6 + 0.4 * Math.sin(time * 6);
          ctx.globalAlpha = pulse;
          ctx.fillStyle = '#FFD700';
          ctx.font = '4px "Press Start 2P"';
          ctx.fillText('NEW', ax + colW - 18, ay + 7);
          ctx.globalAlpha = 1;
        }

        // Icon
        drawAchievementIcon(ctx, ax + 3, ay + 3, ach.icon, ach.tier, 8);

        // Name
        ctx.font = '4px "Press Start 2P"';
        ctx.fillStyle = '#fff';
        ctx.fillText(ach.name, ax + 14, ay + 9);

        // Japanese name
        ctx.font = '7px "M PLUS Rounded 1c"';
        ctx.fillStyle = tc.text;
        ctx.fillText(ach.nameJp, ax + 14, ay + 18);

        // Tier dot
        ctx.fillStyle = tc.border;
        ctx.fillRect(ax + colW - 6, ay + rowH - 6, 3, 3);
      } else {
        // Locked: dark, mysterious
        ctx.fillStyle = 'rgba(20,20,30,0.8)';
        ctx.fillRect(ax, ay, colW - 2, rowH - 2);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(ax, ay, colW - 2, rowH - 2);

        // Lock icon (question mark)
        ctx.fillStyle = '#444';
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText('?', ax + 5, ay + 12);

        // Hidden description
        ctx.font = '4px "Press Start 2P"';
        ctx.fillStyle = '#555';
        ctx.fillText(ach.desc, ax + 14, ay + 9);

        // Tier hint
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#444';
        const tierLabel = ach.tier.charAt(0).toUpperCase() + ach.tier.slice(1);
        ctx.fillText(tierLabel, ax + 14, ay + 18);
      }
    });

    // Progress bar at bottom
    const barY = cardY + cardH - 14;
    const barW = cardW - 16;
    const barX = cardX + 8;
    const progress = unlocked / achievements.length;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(barX, barY, barW, 6);
    ctx.fillStyle = progress >= 1 ? '#FFD700' : '#D4AF37';
    ctx.fillRect(barX, barY, barW * progress, 6);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, 6);

    // Close hint
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('[B] Close', canvasW / 2, cardY + cardH - 2);
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
    drawPaymentBubble,
    drawSeasonalBubble,
    drawKansaiBubble,
    drawPolitenessBubble,
    drawStreakFire,
    drawStar,
    drawPixelMap,
    // Stamp card
    drawStamp,
    drawMasterStamp,
    drawStampBookIcon,
    drawStampCardOverlay,
    // Variable rewards
    drawRewardBanner,
    drawPhraseBookIcon,
    drawPhraseBookOverlay,
    // Inventory
    drawBagIcon,
    drawItemIcon,
    drawInventoryOverlay,
    // Achievement badges
    drawAchievementIcon,
    drawTrophyIcon,
    drawAchievementBanner,
    drawAchievementOverlay,
  };
})();
