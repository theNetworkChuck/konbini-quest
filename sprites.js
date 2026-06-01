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

  // Speed Round Coach NPC - Hayate (sporty, stopwatch theme)
  const npcSpeedCoach = `
....HHHH....
...HhHHhH...
..LLLLLLLL..
..sWEsWEs..
..sSSSSSs...
...ssMss....
..CCCCCCCC..
..CwCCCwCC..
..CCTTCCCC..
...CCCCCC...
..ccCCCCcc..
..CC.CC.CC..
..CC.CC.CC..
...CC..CC...
...WW..WW...
...WW..WW...`;

  const npcSpeedCoachPalette = {
    'H': '#1a1a2e', 'h': '#2e2e44',
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff', 'w': '#ddd',
    'M': '#c09080', 'B': '#f0a0a0',
    'L': '#FF6B35', // orange headband (speed/energy)
    'C': '#2196F3', 'c': '#1565C0', // bright blue sporty jacket
    'T': '#FFD600', // yellow stopwatch/lightning accent on chest
  };

  // Pronunciation Guide NPC - Akiko (music/sound theme, purple & pink)
  const npcPronunciationGuide = `
....HHHH....
...HhHhHH...
..HhHhHhHH..
..sWEsWEs...
..sSSSSSs...
...ssMss....
..PPPPPPPP..
..PPNPPNPP..
..PPNNPPPP..
...PPPPPP...
..PPPPPPPp..
..PP.PP.PP..
..PP.PP.PP..
...PP..PP...
...WW..WW...
...WW..WW...`;

  const npcPronunciationGuidePalette = {
    'H': '#4a1a6b', 'h': '#6b2fa0', // purple hair (sound/music theme)
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff',
    'M': '#c06080', 'B': '#f0a0a0', // pink smile
    'P': '#9b59b6', 'p': '#7d3c98', // purple dress/top
    'N': '#e91e9b', // hot pink musical note accent
  };




  // Onomatopoeia Coach (Mimi) — playful character with headphones, pink/teal sound wave theme
  const npcOnomatopoeiaCoach = `
....HHHH....
...HhHhHh..
..THhHhHhT.
..THSSSSH..
..TSSEESST.
..SSSMSSMS.
..SSSbSSS..
..SSMMSS...
...CCCC....
..CcCcCc...
.CcNNCcNc..
.CcNNCcNc..
..CcCcCc...
...LLLL....
..LlLlLl...
..WW..WW...`;

  const npcOnomatopoeiaCoachPalette = {
    'H': '#e91e63', 'h': '#f06292', // vibrant pink hair (playful/sound theme)
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff',
    'M': '#e57373', 'b': '#ffab91', // warm smile
    'T': '#00bcd4', // teal headphone pads
    'C': '#00897b', 'c': '#4db6ac', // teal top (sound wave)
    'N': '#e91e63', // pink accent on shirt
    'L': '#37474f', 'l': '#546e7a', // dark pants
  };

  // Conversation Practice Coach (Yuri) — friendly young woman with a clipboard, warm orange/brown tones
  const npcConversationCoach = `
....HHHH....
...HhHhHh..
..HhHhHhH..
..HSSSSSH..
..SSEESSE..
..SSMSSMS..
..SSSbSSS..
..SSMMSS...
...CCCC....
..CcCcCc...
.CcNNCcNc..
.CcNNCcNc..
..CcCcCc...
...LLLL....
..LlLlLl...
..WW..WW...`;

  const npcConversationCoachPalette = {
    'H': '#5c3a1e', 'h': '#7a4f2e', // warm brown hair
    'S': '#f5d0a9', 's': '#e0b88a', 'E': '#1a1a2e', 'W': '#fff',
    'M': '#d06070', 'b': '#f0a0a0', // pink smile and blush
    'C': '#e67e22', 'c': '#d35400', // orange cardigan
    'N': '#f5e6d3', // clipboard/notepad
    'L': '#2c3e50', 'l': '#1a252f', // dark navy pants
  };

  // Service Counter Coach (Tetsuya) — friendly clerk holding a parcel/clipboard for service window practice
  const npcServiceCoach = `
....HHHH....
...HhHhHh...
..HHHHHHHH..
..HSSSSSSH..
..SSEESSEE..
..SSSMSSSS..
..SSbbSSSS..
..VVVVVVVV..
..VVNNVVNV..
..VnnnnnnV..
..VVVVVVVV..
..VVTTVVTV..
..VVVVVVVV..
..PP..PP....
..PP..PP....
..OO..OO....`;

  const npcServiceCoachPalette = {
    'H': '#1a3a5c', 'h': '#2a5078', // dark blue cap/hair (clerk hat tone)
    'S': '#f5d0a9', 's': '#e0b88a', // skin
    'E': '#1a1a2e', // eyes
    'M': '#7a4a30', 'b': '#d06070', // mustache hint + smile
    'V': '#2980b9', 'v': '#1f6391', // service uniform vest (blue)
    'N': '#f5f5dc', 'n': '#e8e8c8', // package/clipboard cream
    'T': '#f39c12', // service tag/badge gold
    'P': '#34495e', // dark slacks
    'O': '#1a1a1a', // black shoes
  };

  // Night Shift Salaryman — tired, loosened tie, rumpled suit, holding Strong Zero
  const npcNightSalaryman = `
....HHHH....
...HhHHhH...
..HHHHHH....
..sWEsWEs...
..sSSSSSs...
..ssMSSs....
..1111111q..
..1RR11Rq1..
..1111111q..
...111111...
..q1111q1...
..11GG11....
..33.33.....
...33..33...
...OO..OO...
...OO..OO...`;

  const npcNightSalarymanPalette = {
    'H': '#1a1a2e', 'h': '#2a2a3e', // dark messy hair
    'S': '#e8c89a', 's': '#d0aa80', // slightly flushed skin
    'E': '#333', 'W': '#ddd', // tired eyes
    'M': '#b07060', // tired half-smile
    '1': '#2c3450', 'q': '#1e2640', // rumpled dark navy suit
    'R': '#aa3333', // loosened red tie
    'G': '#4caf50', // Strong Zero can (green)
    '3': '#2c3e50', // dark pants
    'O': '#1a1a1a', // black shoes
  };

  // Rain NPC: Ame-chan (yellow raincoat, umbrella overhead)
  const npcRainPerson = `
..UUUUUUUU..
.UuuuuuuuuU.
..UUUUUUUU..
....HHHH....
...HSSHSH...
..sSWEWEs...
...sSMSs....
..YYYYYYYYY.
..YYYYYYYYY.
..YY.YY.YYY.
..YYYYYYYYY.
...YY..YY...
...BB..BB...
...BB..BB...
...OO..OO...
...OO..OO...`;

  const npcRainPersonPalette = {
    'U': '#5090d0', 'u': '#70b0e8', // blue umbrella
    'H': '#2a1a0a', // dark hair (wet)
    'S': '#f0d0b0', 's': '#d8b898', // skin
    'E': '#222', 'W': '#eee', // eyes
    'M': '#d08080', // smile
    'Y': '#f5d020', // yellow raincoat
    'B': '#1a4a7a', // blue rain pants
    'O': '#d04040', // red rain boots
  };

  // Cherry blossom NPC: Sakura-san (pink spring outfit, flower in hair)
  const npcHanami = `
....HHHH....
...HHHHHH...
..FHHHHHH...
..sSWEWEs...
...sSMSs....
..ppppppp...
..ppWppWpp..
..ppWppWpp..
..ppppppp...
...pppppp...
..pp..pp....
..RR..RR....
..RR..RR....
...SS..SS...
...SS..SS...
...SS..SS...`;

  const npcHanamiPalette = {
    'H': '#2a1a0a', // dark hair
    'F': '#ff88aa', // pink flower in hair
    'S': '#f0d0b0', 's': '#d8b898', // skin
    'E': '#222', 'W': '#eee', // eyes
    'M': '#d06070', // smile
    'p': '#ffb0c8', // pink spring kimono top
    'R': '#cc4466', // darker pink bottom
  };

  const npcSprites = {
    oldman:      { frames: [npcOldMan, npcOldManWalk], palette: npcOldManPalette },
    nightsalaryman: { frames: [npcNightSalaryman], palette: npcNightSalarymanPalette },
    schoolgirl:  { frames: [npcSchoolGirl, npcSchoolGirlWalk], palette: npcSchoolGirlPalette },
    businessman: { frames: [npcBusinessMan, npcBusinessManWalk], palette: npcBusinessManPalette },
    sensei:      { frames: [npcSensei], palette: npcSenseiPalette },
    challenger:  { frames: [npcChallenger], palette: npcChallengerPalette },
    paymentcoach: { frames: [npcPaymentCoach], palette: npcPaymentCoachPalette },
    seasonalguide: { frames: [npcSeasonalGuide], palette: npcSeasonalGuidePalette },
    kansaicoach: { frames: [npcKansaiCoach], palette: npcKansaiCoachPalette },
    politenesscoach: { frames: [npcPolitenessCoach], palette: npcPolitenessCoachPalette },
    speedcoach: { frames: [npcSpeedCoach], palette: npcSpeedCoachPalette },
    pronunciationguide: { frames: [npcPronunciationGuide], palette: npcPronunciationGuidePalette },
    conversationcoach: { frames: [npcConversationCoach], palette: npcConversationCoachPalette },
    servicecoach: { frames: [npcServiceCoach], palette: npcServiceCoachPalette },
    onomatopoeiacoach: { frames: [npcOnomatopoeiaCoach], palette: npcOnomatopoeiaCoachPalette },
    rainperson: { frames: [npcRainPerson], palette: npcRainPersonPalette },
    hanami: { frames: [npcHanami], palette: npcHanamiPalette },
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

  // Speed Round bubble (stopwatch icon, orange/blue)
  function drawSpeedBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 4.5) * 0.18 + 0.82;
    ctx.globalAlpha = pulse;
    // Bubble background (electric blue)
    ctx.fillStyle = '#0d47a1';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Stopwatch body (orange circle)
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(x + 5, y - 12, 6, 6);
    ctx.fillRect(x + 4, y - 11, 8, 4);
    // Stopwatch center
    ctx.fillStyle = '#FFD600';
    ctx.fillRect(x + 7, y - 11, 2, 1); // button on top
    ctx.fillRect(x + 7, y - 10, 1, 2); // hand
    ctx.fillRect(x + 7, y - 9, 2, 1);  // hand
    ctx.globalAlpha = 1;
  }

  // Speed round timer bar (drawn above dialogue box during speed round)
  function drawSpeedTimer(ctx, canvasW, canvasH, timeRemaining, maxTime, questionNum, totalQuestions) {
    const barY = canvasH - 66; // above dialogue box
    const barX = 8;
    const barW = canvasW - 16;
    const barH = 8;
    const ratio = Math.max(0, timeRemaining / maxTime);

    // Timer bar background
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

    // Timer bar fill — green to yellow to red
    let color;
    if (ratio > 0.5) {
      color = '#2ecc71'; // green
    } else if (ratio > 0.25) {
      color = '#f39c12'; // yellow/orange
    } else {
      color = '#e74c3c'; // red
    }
    ctx.fillStyle = color;
    ctx.fillRect(barX, barY, barW * ratio, barH);

    // Pulsing urgency effect when low
    if (ratio < 0.25 && ratio > 0) {
      const urgePulse = Math.sin(Date.now() / 100) * 0.3 + 0.3;
      ctx.fillStyle = `rgba(231,76,60,${urgePulse})`;
      ctx.fillRect(barX, barY, barW * ratio, barH);
    }

    // Timer text
    ctx.font = '7px monospace';
    ctx.fillStyle = '#fff';
    const timeText = timeRemaining.toFixed(1) + 's';
    ctx.fillText(timeText, barX + 2, barY + 7);

    // Question progress on right
    const qText = `Q${questionNum}/${totalQuestions}`;
    const qTextW = ctx.measureText(qText).width;
    ctx.fillText(qText, barX + barW - qTextW - 2, barY + 7);

    // "SPEED ROUND" label centered
    ctx.fillStyle = ratio < 0.25 ? '#e74c3c' : '#FFD600';
    const label = 'タイムアタック!';
    const labelW = ctx.measureText(label).width;
    ctx.fillText(label, barX + (barW - labelW) / 2, barY + 7);
  }

  // Speed round results summary
  function drawSpeedResultBanner(ctx, canvasW, canvasH, correct, total, totalTime, isNewBest, timer) {
    // Fade in/out
    let alpha = 1;
    if (timer > 4.5) alpha = (5.0 - timer) * 2;
    else if (timer < 0.5) alpha = timer * 2;
    ctx.globalAlpha = alpha;

    const bw = 200, bh = 50;
    const bx = (canvasW - bw) / 2;
    const by = (canvasH - bh) / 2 - 20;

    // Background
    ctx.fillStyle = '#0d2137';
    ctx.fillRect(bx, by, bw, bh);
    // Border — gold if new best, blue otherwise
    ctx.strokeStyle = isNewBest ? '#FFD600' : '#2196F3';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.font = '8px monospace';
    ctx.fillStyle = '#FFD600';
    const header = isNewBest ? '★ NEW BEST! ★' : 'SPEED ROUND COMPLETE';
    const headerW = ctx.measureText(header).width;
    ctx.fillText(header, bx + (bw - headerW) / 2, by + 12);

    ctx.fillStyle = '#fff';
    const scoreLine = `Score: ${correct}/${total} | Time: ${totalTime.toFixed(1)}s`;
    const scoreW = ctx.measureText(scoreLine).width;
    ctx.fillText(scoreLine, bx + (bw - scoreW) / 2, by + 26);

    // Rating
    const pct = correct / total;
    let rating, ratingColor;
    if (pct >= 1.0) { rating = '電光石火! Lightning!'; ratingColor = '#FFD600'; }
    else if (pct >= 0.8) { rating = '速い! Fast!'; ratingColor = '#2ecc71'; }
    else if (pct >= 0.6) { rating = 'まあまあ Not bad'; ratingColor = '#f39c12'; }
    else { rating = 'もっと練習! Practice more!'; ratingColor = '#e74c3c'; }
    ctx.fillStyle = ratingColor;
    const ratingW = ctx.measureText(rating).width;
    ctx.fillText(rating, bx + (bw - ratingW) / 2, by + 40);

    ctx.globalAlpha = 1;
  }


  // Conversation practice bubble (speech lines icon, orange/warm)
  function drawConversationBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 3.5) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (warm orange)
    ctx.fillStyle = '#d35400';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Speech bubble icon (two overlapping speech bubbles)
    ctx.fillStyle = '#f5e6d3';
    ctx.fillRect(x + 4, y - 13, 6, 4); // bubble 1
    ctx.fillRect(x + 4, y - 9, 2, 1);  // tail 1
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 7, y - 11, 5, 4); // bubble 2
    ctx.fillRect(x + 10, y - 7, 2, 1); // tail 2
    ctx.globalAlpha = 1;
  }

  // Conversation scenario selection overlay
  function drawServiceCounterMenu(ctx, canvasW, canvasH, scenarios, selectedIdx, stats) {
    // Dark overlay background
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Title header (blue tone for service counter)
    ctx.fillStyle = '#2980b9';
    ctx.font = 'bold 10px monospace';
    const title = 'サービスカウンター Service Counter';
    const titleW = ctx.measureText(title).width;
    ctx.fillText(title, (canvasW - titleW) / 2, 18);

    // Stats line
    ctx.fillStyle = '#aaa';
    ctx.font = '7px monospace';
    const statsText = `Completed: ${stats.scenariosUnlocked}/${stats.totalScenarios} | Score: ${stats.totalCorrect}/${stats.totalAttempted}`;
    const statsW = ctx.measureText(statsText).width;
    ctx.fillText(statsText, (canvasW - statsW) / 2, 30);

    // Scenario list
    const startY = 42;
    const itemH = 22;
    ctx.font = '8px monospace';

    for (let i = 0; i < scenarios.length; i++) {
      const s = scenarios[i];
      const y = startY + i * itemH;
      const isSelected = i === selectedIdx;

      if (isSelected) {
        ctx.fillStyle = 'rgba(41, 128, 185, 0.35)';
        ctx.fillRect(8, y - 9, canvasW - 16, itemH - 2);
        if (Math.floor(Date.now() / 400) % 2 === 0) {
          ctx.fillStyle = '#2980b9';
          ctx.fillText('▶', 12, y + 2);
        }
      }

      ctx.fillStyle = s.completed ? '#2ecc71' : '#fff';
      const label = `${s.emoji} ${s.titleJp} - ${s.title}`;
      ctx.fillText(label, 24, y + 2);

      ctx.fillStyle = '#f39c12';
      for (let d = 0; d < s.difficulty; d++) {
        ctx.fillRect(canvasW - 22 + d * 5, y - 1, 3, 3);
      }

      if (s.completed) {
        ctx.fillStyle = '#2ecc71';
        ctx.fillText('✓', canvasW - 36, y + 2);
      }
    }

    ctx.fillStyle = '#888';
    ctx.font = '7px monospace';
    const hint = '[↑↓] Select  [A] Start  [B] Close';
    const hintW = ctx.measureText(hint).width;
    ctx.fillText(hint, (canvasW - hintW) / 2, canvasH - 8);
  }

  function drawConversationMenu(ctx, canvasW, canvasH, scenarios, selectedIdx, stats) {
    // Dark overlay background
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Title header
    ctx.fillStyle = '#e67e22';
    ctx.font = 'bold 10px monospace';
    const title = '会話練習 Conversation Practice';
    const titleW = ctx.measureText(title).width;
    ctx.fillText(title, (canvasW - titleW) / 2, 18);

    // Stats line
    ctx.fillStyle = '#aaa';
    ctx.font = '7px monospace';
    const statsText = `Completed: ${stats.scenariosUnlocked}/${stats.totalScenarios} | Score: ${stats.totalCorrect}/${stats.totalAttempted}`;
    const statsW = ctx.measureText(statsText).width;
    ctx.fillText(statsText, (canvasW - statsW) / 2, 30);

    // Scenario list
    const startY = 42;
    const itemH = 22;
    ctx.font = '8px monospace';

    for (let i = 0; i < scenarios.length; i++) {
      const s = scenarios[i];
      const y = startY + i * itemH;
      const isSelected = i === selectedIdx;

      // Highlight selected
      if (isSelected) {
        ctx.fillStyle = 'rgba(230, 126, 34, 0.3)';
        ctx.fillRect(8, y - 9, canvasW - 16, itemH - 2);
        // Blinking cursor
        if (Math.floor(Date.now() / 400) % 2 === 0) {
          ctx.fillStyle = '#e67e22';
          ctx.fillText('▶', 12, y + 2);
        }
      }

      // Emoji + title
      ctx.fillStyle = s.completed ? '#2ecc71' : '#fff';
      const label = `${s.emoji} ${s.titleJp} - ${s.title}`;
      ctx.fillText(label, 24, y + 2);

      // Difficulty dots
      ctx.fillStyle = '#f39c12';
      for (let d = 0; d < s.difficulty; d++) {
        ctx.fillRect(canvasW - 22 + d * 5, y - 1, 3, 3);
      }

      // Checkmark if completed
      if (s.completed) {
        ctx.fillStyle = '#2ecc71';
        ctx.fillText('✓', canvasW - 36, y + 2);
      }
    }

    // Instructions
    ctx.fillStyle = '#888';
    ctx.font = '7px monospace';
    const hint = '[↑↓] Select  [A] Start  [B] Close';
    const hintW = ctx.measureText(hint).width;
    ctx.fillText(hint, (canvasW - hintW) / 2, canvasH - 8);
  }


  // Onomatopoeia practice indicator (pulsing sound wave icon, pink/teal)
  function drawOnomatopoeiaBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 4.2) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (teal)
    ctx.fillStyle = '#00897b';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Sound wave icon (pink)
    ctx.fillStyle = '#e91e63';
    ctx.fillRect(x + 4, y - 10, 2, 4);  // center bar
    ctx.fillRect(x + 7, y - 12, 2, 8);  // tall bar
    ctx.fillRect(x + 10, y - 10, 2, 4); // right bar
    ctx.globalAlpha = 1;
  }

  // Pronunciation guide bubble (musical note icon, purple/pink)
  function drawPronunciationBubble(ctx, x, y, time) {
    const pulse = Math.sin(time * 3) * 0.15 + 0.85;
    ctx.globalAlpha = pulse;
    // Bubble background (purple)
    ctx.fillStyle = '#4a1a6b';
    ctx.fillRect(x + 2, y - 14, 12, 10);
    ctx.fillRect(x + 5, y - 4, 6, 2);
    // Musical note icon (pink)
    ctx.fillStyle = '#e91e9b';
    ctx.fillRect(x + 5, y - 12, 2, 6); // stem
    ctx.fillRect(x + 5, y - 12, 6, 2); // flag bar
    ctx.fillRect(x + 9, y - 12, 2, 6); // second stem
    ctx.fillRect(x + 4, y - 7, 3, 2);  // note head 1
    ctx.fillRect(x + 8, y - 7, 3, 2);  // note head 2
    ctx.globalAlpha = 1;
  }

  // Draw pitch accent diagram for a phrase
  // mora: array of mora strings, pitch: array of 'H' or 'L'
  function drawPitchDiagram(ctx, cx, cy, mora, pitch, phraseW) {
    const moraCount = mora.length;
    const spacing = Math.min(28, (phraseW - 20) / moraCount);
    const startX = cx - (moraCount * spacing) / 2;
    const highY = cy - 10;
    const lowY = cy + 6;

    ctx.font = '9px monospace';

    for (let i = 0; i < moraCount; i++) {
      const mx = startX + i * spacing + spacing / 2;
      const isHigh = pitch[i] === 'H';
      const my = isHigh ? highY : lowY;

      // Draw connecting line to next mora
      if (i < moraCount - 1) {
        const nextHigh = pitch[i + 1] === 'H';
        const nextY = nextHigh ? highY : lowY;
        const nextX = startX + (i + 1) * spacing + spacing / 2;
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();
      }

      // Draw mora dot
      ctx.fillStyle = isHigh ? '#e91e9b' : '#6c3483';
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw mora text below diagram
      ctx.fillStyle = '#fff';
      const textW = ctx.measureText(mora[i]).width;
      ctx.fillText(mora[i], mx - textW / 2, cy + 24);

      // Draw H/L label above/below dot
      ctx.fillStyle = isHigh ? '#f39c12' : '#7f8c8d';
      ctx.font = '6px monospace';
      const label = isHigh ? 'H' : 'L';
      const lw = ctx.measureText(label).width;
      ctx.fillText(label, mx - lw / 2, isHigh ? my - 7 : my + 11);
      ctx.font = '9px monospace';
    }
  }

  // Draw the full pronunciation lesson overlay
  function drawPronunciationOverlay(ctx, canvasW, canvasH, phrase, lessonNum, totalLessons) {
    // Semi-transparent dark backdrop
    ctx.fillStyle = 'rgba(20, 10, 40, 0.92)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    const panelW = Math.min(canvasW - 20, 320);
    const panelH = canvasH - 40;
    const px = (canvasW - panelW) / 2;
    const py = 20;

    // Panel background
    ctx.fillStyle = '#1a0a2e';
    ctx.fillRect(px, py, panelW, panelH);
    // Purple border
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, panelW, panelH);

    // Title bar
    ctx.fillStyle = '#4a1a6b';
    ctx.fillRect(px, py, panelW, 22);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#e91e9b';
    const title = `PITCH ACCENT GUIDE  ${lessonNum}/${totalLessons}`;
    const tw = ctx.measureText(title).width;
    ctx.fillText(title, px + (panelW - tw) / 2, py + 15);

    // Japanese phrase (large)
    ctx.font = '16px monospace';
    ctx.fillStyle = '#fff';
    const jpW = ctx.measureText(phrase.japanese).width;
    ctx.fillText(phrase.japanese, px + (panelW - jpW) / 2, py + 52);

    // Romaji
    ctx.font = '9px monospace';
    ctx.fillStyle = '#b0b0b0';
    const rmW = ctx.measureText(phrase.romaji).width;
    ctx.fillText(phrase.romaji, px + (panelW - rmW) / 2, py + 67);

    // English meaning
    ctx.fillStyle = '#7f8c8d';
    const enW = ctx.measureText(phrase.english).width;
    ctx.fillText(phrase.english, px + (panelW - enW) / 2, py + 80);

    // Divider
    ctx.fillStyle = '#4a1a6b';
    ctx.fillRect(px + 10, py + 88, panelW - 20, 1);

    // Pitch diagram
    drawPitchDiagram(ctx, px + panelW / 2, py + 115, phrase.mora, phrase.pitch, panelW);

    // Accent type label
    const accentNames = {
      'heiban': '\u5e73\u677f (Heiban) - Flat',
      'atamadaka': '\u982d\u9ad8 (Atamadaka) - Head-high',
      'nakadaka': '\u4e2d\u9ad8 (Nakadaka) - Mid-high',
      'odaka': '\u5c3e\u9ad8 (Odaka) - Tail-high'
    };
    ctx.font = '8px monospace';
    ctx.fillStyle = '#e91e9b';
    const accentLabel = 'Pattern: ' + (accentNames[phrase.accentType] || phrase.accentType);
    const alW = ctx.measureText(accentLabel).width;
    ctx.fillText(accentLabel, px + (panelW - alW) / 2, py + 155);

    // Accent number explanation
    ctx.fillStyle = '#9b59b6';
    const accentExplain = phrase.accentNum === 0
      ? 'No pitch drop (stays high)'
      : `Pitch drops after mora #${phrase.accentNum}`;
    const aeW = ctx.measureText(accentExplain).width;
    ctx.fillText(accentExplain, px + (panelW - aeW) / 2, py + 168);

    // Divider
    ctx.fillStyle = '#4a1a6b';
    ctx.fillRect(px + 10, py + 175, panelW - 20, 1);

    // Tip text (word-wrapped)
    ctx.font = '7px monospace';
    ctx.fillStyle = '#ccc';
    const tip = phrase.tip;
    const maxLineW = panelW - 24;
    const words = tip.split(' ');
    let line = '';
    let lineY = py + 190;
    for (const word of words) {
      const test = line + (line ? ' ' : '') + word;
      if (ctx.measureText(test).width > maxLineW && line) {
        ctx.fillText(line, px + 12, lineY);
        line = word;
        lineY += 10;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, px + 12, lineY);

    // Controls hint
    ctx.font = '7px monospace';
    ctx.fillStyle = '#666';
    const hint = '[A] Next phrase  [B] Close  [P] Quiz mode';
    const hW = ctx.measureText(hint).width;
    ctx.fillText(hint, px + (panelW - hW) / 2, py + panelH - 8);
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

  // ============ MISTAKE JOURNAL OVERLAY ============
  // Pixel-art journal icon for HUD
  function drawJournalIcon(ctx, x, y, count, hasNew, time) {
    // Open book shape in red/dark red
    ctx.fillStyle = '#8B2020';
    ctx.fillRect(x, y, 10, 8);
    ctx.fillStyle = '#B33030';
    ctx.fillRect(x + 1, y + 1, 4, 6);
    ctx.fillRect(x + 6, y + 1, 3, 6);
    // Spine
    ctx.fillStyle = '#5A1010';
    ctx.fillRect(x + 5, y, 1, 8);
    // Page lines
    ctx.fillStyle = '#ddd';
    ctx.fillRect(x + 2, y + 2, 2, 1);
    ctx.fillRect(x + 2, y + 4, 2, 1);
    ctx.fillRect(x + 7, y + 2, 2, 1);
    ctx.fillRect(x + 7, y + 4, 2, 1);
    // X mark (mistakes)
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(x + 3, y + 5, 1, 1);
    ctx.fillRect(x + 4, y + 6, 1, 1);

    // Count badge
    if (count > 0) {
      ctx.font = '5px "Press Start 2P"';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(String(count), x + 18, y + 7);
      ctx.textAlign = 'left';
    }

    // New indicator glow
    if (hasNew) {
      const alpha = 0.4 + Math.sin(time * 4) * 0.4;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#FF4444';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 1, y - 1, 12, 10);
      ctx.restore();
    }
  }

  function drawMistakeJournalOverlay(ctx, canvasW, canvasH, mistakes, time) {
    // Darken background
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Card dimensions
    const cardW = canvasW - 16;
    const cardH = canvasH - 16;
    const cardX = 8;
    const cardY = 8;

    // Card background (dark red tint for mistake theme)
    ctx.fillStyle = '#1a0a0a';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#8B2020';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);
    // Inner border accent
    ctx.strokeStyle = 'rgba(180,50,50,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(cardX + 2, cardY + 2, cardW - 4, cardH - 4);

    // Title
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = '#FF6666';
    ctx.textAlign = 'center';
    ctx.fillText('MISTAKE JOURNAL', canvasW / 2, cardY + 13);

    // Japanese subtitle
    ctx.font = '9px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#aa6666';
    ctx.fillText('\u9593\u9055\u3044\u30CE\u30FC\u30C8', canvasW / 2, cardY + 23);

    // Count
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#777';
    ctx.fillText(mistakes.length + ' mistakes recorded', canvasW / 2, cardY + 31);
    ctx.textAlign = 'left';

    if (mistakes.length === 0) {
      // Empty state
      ctx.font = '6px "Press Start 2P"';
      ctx.fillStyle = '#555';
      ctx.textAlign = 'center';
      ctx.fillText('No mistakes yet!', canvasW / 2, cardY + 55);
      ctx.fillText('Keep practicing and', canvasW / 2, cardY + 67);
      ctx.fillText('your errors will', canvasW / 2, cardY + 79);
      ctx.fillText('show up here.', canvasW / 2, cardY + 91);
      ctx.font = '8px "M PLUS Rounded 1c"';
      ctx.fillStyle = '#666';
      ctx.fillText('\u5931\u6557\u306F\u6210\u529F\u306E\u3082\u3068\uFF01', canvasW / 2, cardY + 110);
      ctx.font = '5px "Press Start 2P"';
      ctx.fillStyle = '#555';
      ctx.fillText('Mistakes are the path to success!', canvasW / 2, cardY + 120);
      ctx.textAlign = 'left';
    } else {
      // Mistake list
      const listY = cardY + 36;
      const entryH = 28;
      const maxVisible = Math.floor((cardH - 56) / entryH);

      for (let i = 0; i < Math.min(mistakes.length, maxVisible); i++) {
        const m = mistakes[i];
        const ey = listY + i * entryH;

        // Entry row background
        ctx.fillStyle = i % 2 === 0 ? 'rgba(139,32,32,0.12)' : 'rgba(0,0,0,0)';
        ctx.fillRect(cardX + 3, ey, cardW - 6, entryH - 1);

        // Repeat count badge (left side)
        if (m.count > 1) {
          ctx.fillStyle = '#8B2020';
          ctx.fillRect(cardX + 4, ey + 2, 10, 8);
          ctx.font = '5px "Press Start 2P"';
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.fillText('x' + m.count, cardX + 9, ey + 8);
          ctx.textAlign = 'left';
        }

        const textX = m.count > 1 ? cardX + 16 : cardX + 6;

        // Clerk's question (what was asked)
        ctx.font = '7px "M PLUS Rounded 1c"';
        ctx.fillStyle = '#ccc';
        const clerkLine = m.clerkJp.length > 28 ? m.clerkJp.substring(0, 27) + '...' : m.clerkJp;
        ctx.fillText(clerkLine, textX, ey + 8);

        // Wrong answer (in red) and correct answer (in green)
        ctx.font = '5px "Press Start 2P"';
        // Red X + wrong choice
        ctx.fillStyle = '#FF4444';
        ctx.fillText('\u2718', textX, ey + 16);
        ctx.fillStyle = '#cc6666';
        const wrongText = (m.chosenText || '').length > 16 ? m.chosenText.substring(0, 15) + '..' : m.chosenText;
        ctx.fillText(wrongText, textX + 7, ey + 16);

        // Green check + correct answer
        const midX = textX + 7 + Math.max(wrongText.length * 4.5, 50);
        if (midX < cardX + cardW - 10) {
          ctx.fillStyle = '#44CC44';
          ctx.fillText('\u2714', midX, ey + 16);
          ctx.fillStyle = '#88cc88';
          const correctText = (m.correctText || '').length > 14 ? m.correctText.substring(0, 13) + '..' : m.correctText;
          ctx.fillText(correctText, midX + 7, ey + 16);
        }

        // Source tag (small, right-aligned)
        if (m.source) {
          ctx.font = '4px "Press Start 2P"';
          ctx.fillStyle = '#666';
          ctx.textAlign = 'right';
          ctx.fillText(m.source, cardX + cardW - 5, ey + 8);
          ctx.textAlign = 'left';
        }

        // Subtle separator line
        ctx.fillStyle = 'rgba(139,32,32,0.25)';
        ctx.fillRect(cardX + 6, ey + entryH - 1, cardW - 12, 1);
      }

      if (mistakes.length > maxVisible) {
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('+ ' + (mistakes.length - maxVisible) + ' more...', canvasW / 2, listY + maxVisible * entryH + 6);
        ctx.textAlign = 'left';
      }
    }

    // Motivational tip at bottom
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#aa6666';
    ctx.textAlign = 'center';
    const tips = [
      'Review your mistakes to learn faster!',
      'Patterns reveal what to study next.',
      'Repeated mistakes = priority review!',
      'Making mistakes means you are trying!',
    ];
    const tipIdx = Math.floor(time / 5) % tips.length;
    ctx.fillText(tips[tipIdx], canvasW / 2, cardY + cardH - 12);

    // Close hint
    ctx.fillText('[B] Close  [J] Close', canvasW / 2, cardY + cardH - 4);
    ctx.textAlign = 'left';
  }

  // ============ CULTURAL NOTES ============

  // Scroll/book icon for HUD
  function drawCulturalNoteIcon(ctx, x, y, count, total, hasNew, time) {
    const w = 40, h = 12;
    // Background
    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = hasNew ? '#e8a930' : '#8e6c24';
    if (hasNew) {
      const pulse = Math.sin(time * 4) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(232,169,48,${pulse})`;
    }
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    // Scroll icon (small book)
    ctx.fillStyle = '#e8a930';
    ctx.fillRect(x + 3, y + 2, 6, 8);
    ctx.fillStyle = '#d4920a';
    ctx.fillRect(x + 3, y + 2, 1, 8);
    ctx.fillRect(x + 5, y + 3, 3, 1);
    ctx.fillRect(x + 5, y + 5, 3, 1);
    ctx.fillRect(x + 5, y + 7, 2, 1);
    // Count text
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#e8a930';
    ctx.fillText(`${count}/${total}`, x + 12, y + 9);
  }

  // Cultural note popup banner (appears after correct answers)
  function drawCulturalNoteBanner(ctx, canvasW, canvasH, note, timer) {
    if (!note) return;

    // Slide in from top, pause, slide out
    let alpha = 1;
    const maxT = 6.0;
    if (timer > maxT - 0.5) alpha = (maxT - timer) / 0.5; // fade out at end
    if (timer > maxT) return;
    const slideIn = timer < 0.4 ? timer / 0.4 : 1;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    const bannerW = 230;
    const bannerH = 68;
    const bannerX = (canvasW - bannerW) / 2;
    const bannerY = 4 + (1 - slideIn) * -40;

    // Dark background with golden border (scroll aesthetic)
    ctx.fillStyle = 'rgba(30,22,10,0.94)';
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);

    // Double border for scroll feel
    ctx.strokeStyle = '#8e6c24';
    ctx.lineWidth = 2;
    ctx.strokeRect(bannerX + 1, bannerY + 1, bannerW - 2, bannerH - 2);
    ctx.strokeStyle = '#d4a830';
    ctx.lineWidth = 1;
    ctx.strokeRect(bannerX + 3, bannerY + 3, bannerW - 6, bannerH - 6);

    // Header: "Did you know?" with torii gate accent
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#d4a830';
    ctx.textAlign = 'center';
    ctx.fillText('DID YOU KNOW?', canvasW / 2, bannerY + 12);

    // Decorative line
    ctx.strokeStyle = '#8e6c24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bannerX + 20, bannerY + 15);
    ctx.lineTo(bannerX + bannerW - 20, bannerY + 15);
    ctx.stroke();

    // Title: Japanese + English
    ctx.font = '9px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#f0d080';
    ctx.fillText(note.titleJp, canvasW / 2, bannerY + 25);

    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#e8a930';
    ctx.fillText(note.titleEn, canvasW / 2, bannerY + 33);

    // Body text (word-wrapped)
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#c0a060';
    ctx.textAlign = 'left';
    const maxWidth = bannerW - 20;
    const words = note.textEn.split(' ');
    let line = '';
    let lineY = bannerY + 42;
    const lineH = 7;
    let lineCount = 0;
    for (let i = 0; i < words.length; i++) {
      const test = line + (line ? ' ' : '') + words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, bannerX + 10, lineY);
        line = words[i];
        lineY += lineH;
        lineCount++;
        if (lineCount >= 3) { line += '...'; break; }
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, bannerX + 10, lineY);

    // Dismiss hint
    ctx.textAlign = 'center';
    ctx.fillStyle = '#887040';
    ctx.font = '4px "Press Start 2P"';
    ctx.fillText('[A] Dismiss', canvasW / 2, bannerY + bannerH - 5);

    ctx.textAlign = 'left';
    ctx.restore();
  }

  // Full cultural notes collection overlay (opened with [C])
  function drawCulturalNotesOverlay(ctx, canvasW, canvasH, notes, time) {
    // Semi-transparent background
    ctx.fillStyle = 'rgba(20,15,5,0.92)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    const cardW = canvasW - 20;
    const cardH = canvasH - 10;
    const cardX = 10;
    const cardY = 5;

    // Scroll/parchment background
    ctx.fillStyle = '#1e1608';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#d4a830';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX + 1, cardY + 1, cardW - 2, cardH - 2);
    ctx.strokeStyle = '#8e6c24';
    ctx.lineWidth = 1;
    ctx.strokeRect(cardX + 3, cardY + 3, cardW - 6, cardH - 6);

    // Title
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#d4a830';
    ctx.textAlign = 'center';
    ctx.fillText('CULTURAL NOTES', canvasW / 2, cardY + 16);

    // Japanese subtitle
    ctx.font = '10px "M PLUS Rounded 1c"';
    ctx.fillStyle = '#a08040';
    ctx.fillText('\u6587\u5316\u30CE\u30FC\u30C8', canvasW / 2, cardY + 28);

    // Count
    const seenCount = notes.filter(n => n.seen).length;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#887040';
    ctx.fillText(`${seenCount}/${notes.length} discovered`, canvasW / 2, cardY + 36);

    // Decorative line
    ctx.strokeStyle = '#8e6c24';
    ctx.beginPath();
    ctx.moveTo(cardX + 15, cardY + 39);
    ctx.lineTo(cardX + cardW - 15, cardY + 39);
    ctx.stroke();

    // Notes grid (2 columns)
    const colW = (cardW - 30) / 2;
    const rowH = 22;
    const startY = cardY + 44;
    const maxRows = 8;

    for (let i = 0; i < notes.length && i < maxRows * 2; i++) {
      const note = notes[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      const nx = cardX + 10 + col * (colW + 10);
      const ny = startY + row * rowH;

      if (note.seen) {
        // Discovered note
        ctx.fillStyle = 'rgba(40,30,10,0.8)';
        ctx.fillRect(nx, ny, colW, rowH - 2);
        ctx.strokeStyle = '#8e6c24';
        ctx.lineWidth = 1;
        ctx.strokeRect(nx, ny, colW, rowH - 2);

        // Japanese title
        ctx.font = '8px "M PLUS Rounded 1c"';
        ctx.fillStyle = '#f0d080';
        ctx.textAlign = 'left';
        ctx.fillText(note.titleJp, nx + 3, ny + 9);

        // English title
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#c0a060';
        let enTitle = note.titleEn;
        if (ctx.measureText(enTitle).width > colW - 6) {
          enTitle = enTitle.substring(0, 14) + '...';
        }
        ctx.fillText(enTitle, nx + 3, ny + 17);
      } else {
        // Undiscovered note (locked)
        ctx.fillStyle = 'rgba(20,15,5,0.6)';
        ctx.fillRect(nx, ny, colW, rowH - 2);
        ctx.strokeStyle = '#443010';
        ctx.lineWidth = 1;
        ctx.strokeRect(nx, ny, colW, rowH - 2);

        // Question mark
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = '#443010';
        ctx.textAlign = 'center';
        ctx.fillText('???', nx + colW / 2, ny + 12);
        ctx.textAlign = 'left';
      }
    }

    // Rotating tip at bottom
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#887040';
    ctx.textAlign = 'center';
    const cultureTips = [
      'Cultural notes appear during gameplay!',
      'Play more levels to discover new notes.',
      'Understanding culture deepens language!',
      'Konbini culture is uniquely Japanese.',
    ];
    const tipIdx = Math.floor(time / 5) % cultureTips.length;
    ctx.fillText(cultureTips[tipIdx], canvasW / 2, cardY + cardH - 12);

    // Close hint
    ctx.fillText('[B] Close  [C] Close', canvasW / 2, cardY + cardH - 4);
    ctx.textAlign = 'left';
  }

  // ============ PROGRESS DASHBOARD OVERLAY ============
  // ============ KONBINI RECEIPT (レシート) ============
  // Renders an authentic Japanese konbini thermal-paper receipt as a centered
  // overlay. Layout matches real-world receipts: store branding header,
  // transaction metadata, line items with unit prices, tax breakdown
  // (軽減税率 reduced rate marked with *), total, tendered, change, points,
  // and the polite 又のご来店をお待ちしております footer.
  function drawKonbiniReceipt(ctx, canvasW, canvasH, receipt, time) {
    if (!receipt) return;

    // Dim background
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Slide-in animation: paper slides down from above with bobble
    const animT = Math.min(1, (receipt.elapsed || 0) / 0.5); // 0.5s slide
    const ease = 1 - Math.pow(1 - animT, 3); // ease-out cubic
    const bobble = Math.sin(time * 1.5) * 0.5;

    // Receipt paper dimensions (thermal paper, narrow & tall)
    const W = 148;
    const H = 198;
    const X = Math.floor((canvasW - W) / 2);
    const Y = Math.floor((canvasH - H) / 2 - 20 + (1 - ease) * -240) + bobble;

    // Paper shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(X + 3, Y + 3, W, H);

    // Thermal paper (off-white)
    ctx.fillStyle = '#fdfaf2';
    ctx.fillRect(X, Y, W, H);

    // Torn-edge effect at top (jagged perforation)
    ctx.fillStyle = '#fdfaf2';
    for (let i = 0; i < W; i += 4) {
      const h = (i % 8 === 0) ? 2 : 1;
      ctx.fillRect(X + i, Y - h, 4, h);
    }
    // Torn edge bottom
    for (let i = 0; i < W; i += 4) {
      const h = (i % 8 === 4) ? 2 : 1;
      ctx.fillRect(X + i, Y + H, 4, h);
    }

    // Faint paper tint lines for thermal-paper authenticity
    ctx.fillStyle = 'rgba(180,160,120,0.05)';
    for (let i = 0; i < H; i += 3) {
      ctx.fillRect(X, Y + i, W, 1);
    }

    // All text in dark thermal ink color
    ctx.fillStyle = '#1a1a1a';

    let y = Y + 8;
    const cx = X + W / 2;
    const padX = X + 6;
    const rightX = X + W - 6;

    // ---- Header: store name (Japanese, large) ----
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(receipt.storeJp, cx, y);
    y += 9;

    // English name + branch
    ctx.font = '6px monospace';
    ctx.fillText(receipt.storeEn, cx, y);
    y += 7;
    ctx.fillText(receipt.branch, cx, y);
    y += 9;

    // Divider
    drawReceiptDivider(ctx, padX, rightX, y);
    y += 5;

    // ---- Transaction metadata ----
    ctx.font = '6px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(receipt.dateStr + ' ' + receipt.timeStr, padX, y);
    ctx.textAlign = 'right';
    ctx.fillText(receipt.receiptNo, rightX, y);
    y += 7;

    ctx.textAlign = 'left';
    ctx.fillText('レジ ' + receipt.registerNo, padX, y);
    ctx.textAlign = 'right';
    ctx.fillText('担当: スタッフ', rightX, y);
    y += 9;

    drawReceiptDivider(ctx, padX, rightX, y);
    y += 6;

    // ---- Line item ----
    // Japanese item name (top line, full width)
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'left';
    const itemMark = receipt.isReducedTax ? '*' : '';
    ctx.fillText(itemMark + receipt.itemJp, padX, y);
    y += 7;

    // Unit price line: qty x unit price = total
    ctx.font = '6px monospace';
    ctx.fillText('  ' + receipt.qty + ' × ¥' + receipt.unitPrice, padX, y);
    ctx.textAlign = 'right';
    ctx.fillText('¥' + receipt.unitPrice.toLocaleString(), rightX, y);
    y += 9;

    drawReceiptDivider(ctx, padX, rightX, y);
    y += 6;

    // ---- Subtotal / tax / total block ----
    ctx.font = '6px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('小計 (Subtotal)', padX, y);
    ctx.textAlign = 'right';
    ctx.fillText('¥' + receipt.subtotal.toLocaleString(), rightX, y);
    y += 7;

    // Tax line with rate annotation
    ctx.textAlign = 'left';
    const taxPct = Math.round(receipt.taxRate * 100);
    const taxLabel = receipt.isReducedTax
      ? '消費税 ' + taxPct + '% (内税*)'
      : '消費税 ' + taxPct + '% (内税)';
    ctx.fillText(taxLabel, padX, y);
    ctx.textAlign = 'right';
    ctx.fillText('¥' + receipt.taxAmount.toLocaleString(), rightX, y);
    y += 9;

    drawReceiptDivider(ctx, padX, rightX, y);
    y += 6;

    // ---- TOTAL (合計) -- bold and boxed for emphasis ----
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(padX - 1, y - 6, W - 12 + 2, 11);
    ctx.fillStyle = '#fdfaf2';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('合計 TOTAL', padX + 1, y + 2);
    ctx.textAlign = 'right';
    ctx.fillText('¥' + receipt.total.toLocaleString(), rightX - 1, y + 2);
    y += 12;
    ctx.fillStyle = '#1a1a1a';

    // ---- Tendered / Change ----
    ctx.font = '6px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('お預かり (Tendered)', padX, y);
    ctx.textAlign = 'right';
    ctx.fillText('¥' + receipt.tendered.toLocaleString(), rightX, y);
    y += 7;

    ctx.textAlign = 'left';
    ctx.fillText('お釣り (Change)', padX, y);
    ctx.textAlign = 'right';
    ctx.fillText('¥' + receipt.change.toLocaleString(), rightX, y);
    y += 9;

    drawReceiptDivider(ctx, padX, rightX, y);
    y += 6;

    // ---- Loyalty points ----
    ctx.textAlign = 'left';
    ctx.fillText('ポイント Points', padX, y);
    ctx.textAlign = 'right';
    ctx.fillText('+' + receipt.pointsEarned + ' pt', rightX, y);
    y += 9;

    // Reduced-tax disclaimer (only if applicable)
    if (receipt.isReducedTax) {
      ctx.font = '5px monospace';
      ctx.fillStyle = '#555';
      ctx.textAlign = 'left';
      ctx.fillText('* 軽減税率対象 (reduced tax)', padX, y);
      y += 6;
      ctx.fillStyle = '#1a1a1a';
    }

    // ---- Footer: thank-you message ----
    y += 2;
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ありがとうございました', cx, y);
    y += 7;
    ctx.font = '5px monospace';
    ctx.fillText('Arigatou gozaimashita!', cx, y);
    y += 7;
    ctx.fillText('又のご来店をお待ちしております', cx, y);

    // Bottom barcode (decorative, animated reveal)
    ctx.textAlign = 'left';
    if (animT >= 1) {
      const bcY = Y + H - 12;
      const bcX = X + 14;
      const bcW = W - 28;
      ctx.fillStyle = '#1a1a1a';
      // Stripes of varying width
      const stripes = [2,1,3,1,2,2,1,3,2,1,2,3,1,2,1,3,2,1,2,1,3,1,2,2,1,3,2,1,2,1,3,2,1,2];
      let bx = bcX;
      let i = 0;
      while (bx < bcX + bcW && i < stripes.length) {
        const sw = stripes[i % stripes.length];
        if (i % 2 === 0) {
          ctx.fillRect(bx, bcY, sw, 8);
        }
        bx += sw + 1;
        i++;
      }
    }

    // Reset
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';

    // ---- Hint at bottom of screen ----
    if (animT >= 1) {
      ctx.font = '6px monospace';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      const blink = Math.floor(time * 2) % 2 === 0;
      if (blink) {
        ctx.fillText('[Z] Continue', canvasW / 2, canvasH - 6);
      }
      ctx.textAlign = 'left';
    }
  }

  function drawReceiptDivider(ctx, x1, x2, y) {
    // Dotted divider line characteristic of thermal-paper receipts
    ctx.fillStyle = '#1a1a1a';
    for (let x = x1; x < x2; x += 3) {
      ctx.fillRect(x, y, 1, 1);
    }
  }

  function drawProgressDashboard(ctx, canvasW, canvasH, data, time) {
    ctx.save();

    // Full-screen overlay with dark bg
    ctx.fillStyle = 'rgba(10,10,30,0.92)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    const panelW = Math.min(canvasW - 16, 330);
    const panelH = canvasH - 16;
    const px = (canvasW - panelW) / 2;
    const py = 8;

    // Panel border
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, panelW, panelH);

    // Inner border accent
    ctx.strokeStyle = 'rgba(78,205,196,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 2, py + 2, panelW - 4, panelH - 4);

    // Title bar
    ctx.fillStyle = '#1a1a3e';
    ctx.fillRect(px, py, panelW, 18);
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, panelW, 18);

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#4ecdc4';
    ctx.textAlign = 'center';
    ctx.fillText('\u5b66\u7fd2\u306e\u9032\u6357 PROGRESS', canvasW / 2, py + 13);

    let y = py + 24;
    const leftX = px + 8;
    const rightX = px + panelW / 2 + 8;
    const colW = panelW / 2 - 16;

    // --- SECTION: Overall Stats ---
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#f39c12';
    ctx.textAlign = 'left';
    ctx.fillText('OVERALL', leftX, y);
    y += 9;

    // Accuracy circle
    const accCx = leftX + 16;
    const accCy = y + 11;
    const accR = 10;
    // Background circle
    ctx.beginPath();
    ctx.arc(accCx, accCy, accR, 0, Math.PI * 2);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Progress arc
    const accAngle = (data.accuracy / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(accCx, accCy, accR, -Math.PI / 2, -Math.PI / 2 + accAngle);
    ctx.strokeStyle = data.accuracy >= 80 ? '#2ecc71' : data.accuracy >= 60 ? '#f1c40f' : '#e74c3c';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Percentage text
    ctx.font = 'bold 7px "Press Start 2P"';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(data.accuracy + '%', accCx, accCy + 3);
    ctx.font = '4px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Accuracy', accCx, accCy + 9);

    // Stats next to circle
    const statX = accCx + accR + 10;
    ctx.font = '5px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#F1C40F';
    ctx.fillText('\u2605 ' + data.stars + '/' + data.maxStars, statX, y + 3);
    ctx.fillStyle = '#4ecdc4';
    ctx.fillText('Phrases: ' + data.review.total, statX, y + 11);
    ctx.fillStyle = '#2ecc71';
    ctx.fillText('Mastered: ' + data.review.mastered, statX, y + 19);

    // Right column stats
    ctx.fillStyle = '#e74c3c';
    ctx.fillText('Mistakes: ' + data.mistakes, rightX, y + 3);
    ctx.fillStyle = '#9b59b6';
    ctx.fillText('Streak: ' + data.bestStreak, rightX, y + 11);
    ctx.fillStyle = '#f39c12';
    ctx.fillText('Levels: ' + data.levelsCompleted, rightX, y + 19);

    y += 28;

    // --- SECTION: Store Progress ---
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#f39c12';
    ctx.textAlign = 'left';
    ctx.fillText('STORES', leftX, y);
    y += 9;

    const storeColors = { '7-Eleven': '#e74c3c', 'Lawson': '#3498db', 'FamilyMart': '#2ecc71' };
    for (const store of ['7-Eleven', 'Lawson', 'FamilyMart']) {
      const s = data.stores[store];
      const barW = panelW - 70;
      const barH = 6;
      const barX = leftX + 58;

      // Store name
      ctx.font = '5px "Press Start 2P"';
      ctx.fillStyle = storeColors[store];
      ctx.textAlign = 'left';
      ctx.fillText(store, leftX, y + 4);

      // Progress bar background
      ctx.fillStyle = '#222';
      ctx.fillRect(barX, y, barW, barH);

      // Progress bar fill
      const pct = s.maxStars > 0 ? s.stars / s.maxStars : 0;
      ctx.fillStyle = storeColors[store];
      ctx.fillRect(barX, y, barW * pct, barH);

      // Border
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, y, barW, barH);

      // Stars fraction
      ctx.font = '5px monospace';
      ctx.fillStyle = '#ddd';
      ctx.textAlign = 'right';
      ctx.fillText(s.stars + '/' + s.maxStars + '\u2605', px + panelW - 8, y + 4);

      y += 10;
    }

    y += 2;

    // --- SECTION: Collections ---
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#f39c12';
    ctx.textAlign = 'left';
    ctx.fillText('COLLECTIONS', leftX, y);
    y += 9;

    ctx.font = '5px monospace';
    // Two columns
    const items = [
      { label: 'Achievements', val: data.achievements.unlocked + '/' + data.achievements.total, color: '#f39c12' },
      { label: 'Stamps', val: data.stamps.total + '/' + data.stamps.max, color: '#D4AF37' },
      { label: 'Bonus Phrases', val: data.phrases.collected + '/' + data.phrases.total, color: '#9b59b6' },
      { label: 'Items', val: data.inventory + '/' + data.inventoryTotal, color: '#3498db' },
      { label: 'Cultural Notes', val: data.culturalNotes.seen + '/' + data.culturalNotes.total, color: '#2ecc71' },
      { label: 'Speed Rounds', val: '' + data.speedRounds, color: '#e67e22' },
    ];
    for (let i = 0; i < items.length; i++) {
      const col = i % 2 === 0 ? leftX : rightX;
      const row = Math.floor(i / 2);
      ctx.fillStyle = items[i].color;
      ctx.textAlign = 'left';
      ctx.fillText(items[i].label + ': ' + items[i].val, col, y + row * 8);
    }
    y += Math.ceil(items.length / 2) * 8 + 3;

    // --- SECTION: NPC Lessons ---
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#f39c12';
    ctx.textAlign = 'left';
    ctx.fillText('NPC LESSONS', leftX, y);
    y += 9;

    ctx.font = '5px monospace';
    const npcItems = [
      { label: 'Kansai', done: data.npcLessons.kansai, total: data.npcLessons.kansaiTotal },
      { label: 'Politeness', done: data.npcLessons.politeness, total: data.npcLessons.politenessTotal },
      { label: 'Seasonal', done: data.npcLessons.seasonal, total: data.npcLessons.seasonalTotal },
      { label: 'Payment', done: data.npcLessons.payment, total: data.npcLessons.paymentTotal },
      { label: 'Onomat.', done: data.npcLessons.onomatopoeia, total: data.npcLessons.onomatopoeiaTotal },
      { label: 'Night', done: data.npcLessons.nightShift, total: data.npcLessons.nightShiftTotal },
    ];
    for (let i = 0; i < npcItems.length; i++) {
      const col = i % 2 === 0 ? leftX : rightX;
      const row = Math.floor(i / 2);
      const n = npcItems[i];
      const complete = n.done >= n.total;
      ctx.fillStyle = complete ? '#2ecc71' : '#ccc';
      ctx.textAlign = 'left';
      const check = complete ? '\u2713 ' : '  ';
      ctx.fillText(check + n.label + ': ' + n.done + '/' + n.total, col, y + row * 8);
    }
    y += Math.ceil(npcItems.length / 2) * 8 + 3;

    // --- SECTION: Challenge Stats ---
    if (data.challenge) {
      ctx.font = '6px "Press Start 2P"';
      ctx.fillStyle = '#f39c12';
      ctx.textAlign = 'left';
      ctx.fillText('CHALLENGES', leftX, y);
      y += 9;

      ctx.font = '5px monospace';
      ctx.fillStyle = '#ccc';
      ctx.fillText('Completed: ' + data.challenge.challengesCompleted, leftX, y);
      ctx.fillText('Best Streak: ' + data.challenge.bestStreak, rightX, y);
      y += 8;

      if (data.conversation) {
        ctx.fillText('Conversations: ' + data.conversation.completed, leftX, y);
        const convAcc = data.conversation.totalAttempted > 0 ? Math.round(data.conversation.totalCorrect / data.conversation.totalAttempted * 100) : 0;
        ctx.fillText('Conv. Acc: ' + convAcc + '%', rightX, y);
        y += 8;
      }
    }

    // Footer
    ctx.font = '5px monospace';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('[B] Close  [P] Close', canvasW / 2, py + panelH - 4);

    ctx.restore();
  }

  // ============ CUSTOMER QUEUE OVERLAY (Improvement #38) ============
  // Pokemon-style overlay shown when the player enters a store and another customer
  // is already at the register. Renders a wooden frame around the dialogue, the
  // customer's pixel sprite + clerk sprite at the counter, a speech bubble for the
  // current line, and (after the dialogue) a 3-choice listening comprehension quiz.
  //
  // Queue object shape:
  //   phase    'dialogue' | 'question' | 'result'
  //   lineIdx  index into lines array for 'dialogue' phase
  //   lines    [{ speaker, jp, en, romaji }]
  //   customer label string ('Salaryman', 'Schoolgirl', ...)
  //   sprite   key in npcSprites for the customer pixel art
  //   question { jp, en }
  //   options  [{ jp, en, correct }]
  //   selectedIdx  highlighted option for 'question' phase
  //   answeredIdx  which option was picked (for 'result' phase)
  //   wasCorrect   bool for 'result' phase
  //   storeName    optional, drawn in the corner ribbon
  //   storeColor   '#d4380d' etc for the accent stripe
  //   elapsed      ms-equivalent in seconds since the overlay opened (slide-in)
  function drawCustomerQueueOverlay(ctx, canvasW, canvasH, queue, time) {
    if (!queue) return;

    // --- Dim background ---
    ctx.fillStyle = 'rgba(8,8,18,0.78)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // --- Slide-in animation (from top) ---
    const animT = Math.min(1, (queue.elapsed || 0) / 0.4);
    const ease = 1 - Math.pow(1 - animT, 3); // ease-out cubic
    const slideOffset = (1 - ease) * -canvasH;

    ctx.save();
    ctx.translate(0, slideOffset);

    // ============ TOP RIBBON: "ご会計中" (CHECKOUT IN PROGRESS) ============
    const ribbonY = 8;
    const ribbonH = 14;
    const ribbonColor = queue.storeColor || '#d4380d';
    ctx.fillStyle = ribbonColor;
    ctx.fillRect(0, ribbonY, canvasW, ribbonH);
    // Subtle bottom shadow band
    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ctx.fillRect(0, ribbonY + ribbonH - 2, canvasW, 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ご会計中  IN LINE', canvasW / 2, ribbonY + ribbonH / 2 + 1);

    // ============ COUNTER SCENE PANEL ============
    const sceneY = ribbonY + ribbonH + 6;
    const sceneH = 56;
    const sceneX = 8;
    const sceneW = canvasW - 16;
    // Wall (cream) + dark floor band evoke konbini interior
    ctx.fillStyle = '#f4e4c1';
    ctx.fillRect(sceneX, sceneY, sceneW, sceneH - 12);
    // Counter front
    ctx.fillStyle = '#7b5230';
    ctx.fillRect(sceneX, sceneY + sceneH - 12, sceneW, 12);
    // Counter top edge
    ctx.fillStyle = '#a87445';
    ctx.fillRect(sceneX, sceneY + sceneH - 14, sceneW, 2);
    // Cash register (small box on counter, right side)
    const regX = sceneX + sceneW - 38;
    const regY = sceneY + sceneH - 26;
    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(regX, regY, 22, 12);
    ctx.fillStyle = '#3aaee0';
    ctx.fillRect(regX + 2, regY + 2, 18, 4); // tiny screen
    ctx.fillStyle = '#666';
    ctx.fillRect(regX + 2, regY + 8, 18, 2); // keypad row
    // Frame around the scene
    ctx.strokeStyle = ribbonColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(sceneX + 0.5, sceneY + 0.5, sceneW - 1, sceneH - 1);

    // ============ CHARACTERS ============
    // Customer on the left, clerk on the right of the counter
    // Sprites are 16x16. Position them so feet touch the counter front.
    const charY = sceneY + sceneH - 14 - 16; // 16 high, touching counter top
    const customerX = sceneX + 14;
    const clerkX = sceneX + sceneW - 14 - 16;
    // Gentle bobble for both characters (different phases so they feel alive)
    const customerBob = Math.floor(Math.sin(time * 3) * 0.5);
    const clerkBob = Math.floor(Math.sin(time * 3 + 1.7) * 0.5);
    // Customer sprite (faces right, toward the clerk)
    drawNPC(ctx, customerX, charY + customerBob, queue.sprite || 'businessman', 'right', 0);
    // Clerk sprite (faces left, toward the customer)
    // Reuse drawClerk for authenticity — it takes a store argument; default 7-Eleven
    drawClerk(ctx, clerkX, charY + clerkBob, queue.storeName || '7-Eleven', 'left');

    // ============ SPEECH BUBBLE (above the speaker for dialogue phase) ============
    if (queue.phase === 'dialogue' && queue.lines && queue.lineIdx >= 0 && queue.lineIdx < queue.lines.length) {
      const line = queue.lines[queue.lineIdx];
      const isCustomer = line.speaker === 'Customer';
      // Bubble position (above the speaker)
      const bubbleX = isCustomer ? sceneX + 4 : sceneX + sceneW / 2 - 4;
      drawQueueSpeechBubble(ctx, bubbleX, sceneY - 2, sceneW / 2 - 4, line, isCustomer);
    }

    // ============ LOWER PANEL: SPEAKER LABEL OR QUESTION / RESULT ============
    const panelY = sceneY + sceneH + 6;
    const panelH = canvasH - panelY - 8;
    const panelX = 8;
    const panelW = canvasW - 16;
    // Wooden / paper panel background
    ctx.fillStyle = '#1a1024';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.fillStyle = '#2a1c3a';
    ctx.fillRect(panelX, panelY, panelW, 1);
    ctx.fillRect(panelX, panelY + panelH - 1, panelW, 1);
    ctx.strokeStyle = ribbonColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX + 0.5, panelY + 0.5, panelW - 1, panelH - 1);

    if (queue.phase === 'dialogue') {
      // Show dialogue line text + speaker tag + progress
      drawQueueDialoguePanel(ctx, panelX, panelY, panelW, panelH, queue, time);
    } else if (queue.phase === 'question') {
      drawQueueQuestionPanel(ctx, panelX, panelY, panelW, panelH, queue, time);
    } else if (queue.phase === 'result') {
      drawQueueResultPanel(ctx, panelX, panelY, panelW, panelH, queue, time);
    }

    ctx.restore();
  }

  // Small kawaii speech bubble for queue dialogue (manga-style tail)
  function drawQueueSpeechBubble(ctx, x, y, maxW, line, pointDown) {
    const w = Math.min(maxW, 120);
    const h = 10;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, w, 1);
    ctx.fillRect(x, y + h - 1, w, 1);
    ctx.fillRect(x, y, 1, h);
    ctx.fillRect(x + w - 1, y, 1, h);
    // Tail (down arrow pointing to speaker)
    const tailX = pointDown ? x + 6 : x + w - 10;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tailX, y + h, 4, 1);
    ctx.fillRect(tailX + 1, y + h + 1, 2, 1);
    ctx.fillStyle = '#000';
    ctx.fillRect(tailX - 1, y + h, 1, 1);
    ctx.fillRect(tailX + 4, y + h, 1, 1);
    ctx.fillRect(tailX, y + h + 1, 1, 1);
    ctx.fillRect(tailX + 3, y + h + 1, 1, 1);
    ctx.fillRect(tailX + 1, y + h + 2, 2, 1);
    // Three dots inside ("..." indicates speech is in dialogue panel below)
    ctx.fillStyle = '#000';
    ctx.fillRect(x + w / 2 - 5, y + 4, 2, 2);
    ctx.fillRect(x + w / 2 - 1, y + 4, 2, 2);
    ctx.fillRect(x + w / 2 + 3, y + 4, 2, 2);
  }

  function drawQueueDialoguePanel(ctx, px, py, pw, ph, queue, time) {
    const line = queue.lines[queue.lineIdx];
    if (!line) return;

    // Speaker tag in top-left
    ctx.fillStyle = line.speaker === 'Customer' ? '#ffd166' : '#7fdbff';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const speakerLabel = line.speaker === 'Customer'
      ? (queue.customer || 'Customer') + ':'
      : 'Clerk:';
    ctx.fillText(speakerLabel, px + 6, py + 5);

    // Progress dots (right side): one dot per line, current line highlighted
    if (queue.lines && queue.lines.length) {
      const totalDots = queue.lines.length;
      const dotSize = 3;
      const gap = 3;
      const startX = px + pw - 6 - (totalDots * (dotSize + gap));
      for (let i = 0; i < totalDots; i++) {
        ctx.fillStyle = (i <= queue.lineIdx) ? '#ffd166' : '#555';
        ctx.fillRect(startX + i * (dotSize + gap), py + 6, dotSize, dotSize);
      }
    }

    // Japanese line (large)
    ctx.fillStyle = '#fff';
    ctx.font = '9px "Press Start 2P", monospace, sans-serif';
    ctx.textAlign = 'left';
    wrapTextSimple(ctx, line.jp, px + 6, py + 18, pw - 12, 11);

    // English translation
    ctx.fillStyle = '#bbbbbb';
    ctx.font = '6px "Press Start 2P", monospace';
    wrapTextSimple(ctx, line.en, px + 6, py + ph - 22, pw - 12, 7);

    // Continue hint (blinking)
    const blink = Math.floor(time * 2) % 2 === 0;
    if (blink) {
      ctx.fillStyle = '#ffd166';
      ctx.textAlign = 'right';
      ctx.font = '6px "Press Start 2P", monospace';
      ctx.fillText('[Z] Listen', px + pw - 6, py + ph - 8);
    }
  }

  function drawQueueQuestionPanel(ctx, px, py, pw, ph, queue, time) {
    // Question header
    ctx.fillStyle = '#ffd166';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('耳を澄まして... LISTENING QUIZ', px + 6, py + 4);

    // Japanese question
    ctx.fillStyle = '#fff';
    ctx.font = '8px "Press Start 2P", monospace';
    wrapTextSimple(ctx, queue.question.jp, px + 6, py + 14, pw - 12, 10);

    // English subtitle
    ctx.fillStyle = '#aaa';
    ctx.font = '6px "Press Start 2P", monospace';
    wrapTextSimple(ctx, queue.question.en, px + 6, py + 28, pw - 12, 7);

    // Options (3 rows)
    const optStartY = py + 50;
    const optH = 18;
    queue.options.forEach((opt, i) => {
      const oy = optStartY + i * optH;
      const selected = i === queue.selectedIdx;
      // Highlight bar
      if (selected) {
        ctx.fillStyle = '#3aaee0';
        ctx.fillRect(px + 4, oy - 1, pw - 8, optH - 2);
      }
      // Cursor arrow
      ctx.fillStyle = selected ? '#fff' : '#666';
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.textBaseline = 'top';
      ctx.fillText(selected ? '>' : ' ', px + 6, oy + 1);
      // Option text (jp + en)
      ctx.fillStyle = '#fff';
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.fillText(opt.jp, px + 16, oy + 1);
      ctx.fillStyle = selected ? '#cde9ff' : '#888';
      ctx.font = '5px "Press Start 2P", monospace';
      ctx.fillText(opt.en, px + 16, oy + 11);
    });

    // Hint footer
    const blink = Math.floor(time * 2) % 2 === 0;
    if (blink) {
      ctx.fillStyle = '#ffd166';
      ctx.font = '5px "Press Start 2P", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('Arrows + [Z]', px + pw - 6, py + ph - 6);
    }
  }

  function drawQueueResultPanel(ctx, px, py, pw, ph, queue, time) {
    const correct = queue.wasCorrect;
    // Result header banner across top
    ctx.fillStyle = correct ? '#27ae60' : '#c0392b';
    ctx.fillRect(px, py, pw, 14);
    ctx.fillStyle = '#fff';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(correct ? '正解！ CORRECT' : '不正解 INCORRECT', px + pw / 2, py + 7);

    // Correct answer line
    const ansOpt = queue.options.find(o => o.correct);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#7fdbff';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('Answer:', px + 6, py + 20);
    ctx.fillStyle = '#fff';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(ansOpt ? ansOpt.jp : '', px + 6, py + 30);
    ctx.fillStyle = '#bbbbbb';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText(ansOpt ? ansOpt.en : '', px + 6, py + 40);

    // Tip / cultural note
    if (queue.tip) {
      ctx.fillStyle = '#ffd166';
      ctx.font = '5px "Press Start 2P", monospace';
      ctx.fillText('TIP:', px + 6, py + 52);
      ctx.fillStyle = '#ddd';
      wrapTextSimple(ctx, queue.tip, px + 6, py + 60, pw - 12, 7);
    }

    // Continue prompt
    const blink = Math.floor(time * 2) % 2 === 0;
    if (blink) {
      ctx.fillStyle = '#ffd166';
      ctx.font = '6px "Press Start 2P", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('[Z] Continue', px + pw - 6, py + ph - 6);
    }
  }

  // Tiny word-wrap helper used by all 3 queue panels
  function wrapTextSimple(ctx, text, x, y, maxW, lineH) {
    if (!text) return;
    // For Japanese text we can't easily split on spaces. Use a simple char-by-char
    // breaker that respects the ctx.measureText width.
    let line = '';
    let yy = y;
    for (let i = 0; i < text.length; i++) {
      const test = line + text[i];
      if (ctx.measureText(test).width > maxW && line.length > 0) {
        ctx.fillText(line, x, yy);
        line = text[i];
        yy += lineH;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, yy);
  }

  // ============ COMBO COUNTER DISPLAY ============
  function drawComboCounter(ctx, canvasW, canvasH, combo, showTimer, maxCombo, multiplier) {
    if (combo < 2) return; // Only show at 2+ combo

    ctx.save();

    // Position: top-right area, below HUD stars
    const cx = canvasW - 50;
    const cy = 18;

    // Determine tier for visual escalation
    let tier = 0; // 0=normal, 1=warm, 2=hot, 3=fire, 4=legendary
    if (combo >= 20) tier = 4;
    else if (combo >= 15) tier = 3;
    else if (combo >= 10) tier = 2;
    else if (combo >= 5) tier = 1;

    const tierColors = [
      { bg: 'rgba(26,26,46,0.85)', border: '#4ecdc4', text: '#4ecdc4', glow: null },       // normal teal
      { bg: 'rgba(46,26,10,0.9)', border: '#f39c12', text: '#f1c40f', glow: '#f39c12' },   // warm gold
      { bg: 'rgba(60,20,10,0.9)', border: '#e67e22', text: '#ff6b35', glow: '#e67e22' },   // hot orange
      { bg: 'rgba(70,10,10,0.92)', border: '#e74c3c', text: '#ff4757', glow: '#e74c3c' },  // fire red
      { bg: 'rgba(60,10,60,0.95)', border: '#9b59b6', text: '#f39cff', glow: '#9b59b6' },  // legendary purple
    ];
    const tc = tierColors[tier];

    // Pulse animation based on showTimer (0..1 fraction remaining)
    const pulse = 1 + Math.sin(showTimer * 12) * (0.03 * (tier + 1));

    ctx.translate(cx, cy);
    ctx.scale(pulse, pulse);

    // Glow effect for higher tiers
    if (tc.glow && tier >= 2) {
      ctx.shadowColor = tc.glow;
      ctx.shadowBlur = 4 + tier * 2;
    }

    // Background pill
    const pillW = 44;
    const pillH = 20;
    ctx.fillStyle = tc.bg;
    ctx.fillRect(-pillW / 2, -pillH / 2, pillW, pillH);
    ctx.strokeStyle = tc.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(-pillW / 2, -pillH / 2, pillW, pillH);

    ctx.shadowBlur = 0;

    // Combo number
    ctx.font = 'bold 10px "Press Start 2P"';
    ctx.fillStyle = tc.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(combo + 'x', 0, -2);

    // Multiplier label below
    ctx.font = '5px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('COMBO', 0, 7);

    // Fire emoji for tier 3+
    if (tier >= 3) {
      ctx.font = '7px monospace';
      ctx.fillStyle = tier >= 4 ? '#f39cff' : '#ff4757';
      ctx.fillText('\u2605', -pillW / 2 - 5, -1);
      ctx.fillText('\u2605', pillW / 2 + 2, -1);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  // Draw combo milestone banner ("5x COMBO! +10% Bonus!")
  function drawComboMilestoneBanner(ctx, canvasW, canvasH, combo, timer) {
    if (timer <= 0) return;

    const maxTimer = 2.5;
    let alpha = 1;
    if (timer > maxTimer - 0.3) alpha = (maxTimer - timer + 0.3) / 0.3; // fade in
    else if (timer < 0.5) alpha = timer / 0.5; // fade out

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Slide down from top
    const slideY = timer > maxTimer - 0.3 ? 8 + ((maxTimer - timer) / 0.3) * 20 : 28;

    const bannerW = 140;
    const bannerH = 18;
    const bx = (canvasW - bannerW) / 2;
    const by = slideY;

    // Milestone text
    let milestoneText = '';
    let bgColor = '';
    let borderColor = '';
    if (combo >= 20) { milestoneText = combo + 'x COMBO! \u4f1d\u8aac\u7684!'; bgColor = 'rgba(60,10,60,0.95)'; borderColor = '#9b59b6'; }
    else if (combo >= 15) { milestoneText = combo + 'x COMBO! \u71c3\u3048\u308d!'; bgColor = 'rgba(70,10,10,0.92)'; borderColor = '#e74c3c'; }
    else if (combo >= 10) { milestoneText = combo + 'x COMBO! \u3059\u3054\u3044!'; bgColor = 'rgba(60,20,10,0.9)'; borderColor = '#e67e22'; }
    else if (combo >= 5) { milestoneText = combo + 'x COMBO! \u3044\u3044\u306d!'; bgColor = 'rgba(46,26,10,0.9)'; borderColor = '#f39c12'; }
    else { ctx.restore(); return; }

    ctx.fillStyle = bgColor;
    ctx.fillRect(bx, by, bannerW, bannerH);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bannerW, bannerH);

    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(milestoneText, canvasW / 2, by + 12);
    ctx.textAlign = 'left';

    ctx.restore();
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
    // Mistake journal
    drawJournalIcon,
    drawMistakeJournalOverlay,
    // Cultural notes
    drawCulturalNoteIcon,
    drawCulturalNoteBanner,
    drawCulturalNotesOverlay,
    // Speed round
    drawSpeedBubble,
    drawConversationBubble,
    drawConversationMenu,
    drawServiceCounterMenu,
    drawSpeedTimer,
    drawSpeedResultBanner,
    // Onomatopoeia coach
    drawOnomatopoeiaBubble,
    // Pronunciation guide
    drawPronunciationBubble,
    drawPitchDiagram,
    drawPronunciationOverlay,
    // Progress dashboard
    drawProgressDashboard,
    drawKonbiniReceipt,
    // Customer queue (listening comprehension on store entry)
    drawCustomerQueueOverlay,
    // Combo counter
    drawComboCounter,
    drawComboMilestoneBanner,
  };
})();
