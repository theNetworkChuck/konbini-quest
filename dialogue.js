/* Konbini Quest v2 - Pokemon-Style Dialogue System */
const Dialogue = (() => {
  const T = 16;
  const BOX_H = 56;
  const CHAR_DELAY = 30; // ms per character
  const CANVAS_W = 256;
  const CANVAS_H = 240;

  let active = false;
  let lines = [];
  let currentLine = 0;
  let charIndex = 0;
  let lastCharTime = 0;
  let speedUp = false;
  let waitingForInput = false;
  let onComplete = null;
  let speaker = '';
  let bounceTime = 0;

  // Choice menu state
  let choiceActive = false;
  let choices = [];
  let choiceIndex = 0;
  let onChoice = null;

  // Flash effect
  let flashColor = null;
  let flashTimer = 0;

  // Listening mode state
  let listeningMode = false;
  let listeningText = '';
  let listeningCallback = null;
  let listenAgainCallback = null;
  let listenPulse = 0;

  // Kana assist peek hint
  let kanaPeekHint = false;

  function isActive() { return active || choiceActive; }

  // Start a dialogue sequence
  function show(speakerName, textLines, callback) {
    active = true;
    speaker = speakerName || '';
    lines = Array.isArray(textLines) ? textLines : [textLines];
    currentLine = 0;
    charIndex = 0;
    lastCharTime = performance.now();
    speedUp = false;
    waitingForInput = false;
    onComplete = callback || null;
    bounceTime = 0;
    listeningMode = false;
  }

  // Start a listening comprehension dialogue (audio only, no text shown)
  function showListening(speakerName, promptText, onDone, onListenAgain) {
    active = true;
    speaker = speakerName || 'Clerk';
    listeningMode = true;
    listeningText = promptText || 'What did the clerk say?';
    listeningCallback = onDone || null;
    listenAgainCallback = onListenAgain || null;
    listenPulse = 0;
    lines = [listeningText];
    currentLine = 0;
    charIndex = listeningText.length; // show full text immediately
    waitingForInput = true;
    speedUp = false;
    bounceTime = 0;
    onComplete = null;
  }

  // Show choice menu
  function showChoices(options, callback) {
    choiceActive = true;
    choices = options;
    choiceIndex = 0;
    onChoice = callback;
    // Speak the first highlighted option after a brief delay
    setTimeout(() => speakCurrentChoice(), 200);
  }

  function hideChoices() {
    choiceActive = false;
    choices = [];
    onChoice = null;
  }

  // Flash screen (green for correct, red for wrong)
  function flash(color, duration) {
    flashColor = color;
    flashTimer = duration || 300;
  }

  // Handle A button press
  function pressA() {
    if (choiceActive) {
      GameAudio.playSelect();
      if (onChoice) onChoice(choiceIndex);
      return;
    }

    if (!active) return;

    if (listeningMode) {
      // A button in listening mode proceeds to quiz
      listeningMode = false;
      active = false;
      if (listeningCallback) listeningCallback();
      return;
    }

    if (waitingForInput) {
      // Advance to next line
      currentLine++;
      if (currentLine >= lines.length) {
        active = false;
        if (onComplete) onComplete();
        return;
      }
      charIndex = 0;
      lastCharTime = performance.now();
      waitingForInput = false;
      speedUp = false;
    } else {
      // Speed up text
      speedUp = true;
    }
  }

  // Handle B button
  function pressB() {
    if (listeningMode && listenAgainCallback) {
      // B button replays audio in listening mode
      listenAgainCallback();
      return;
    }
    // B can also speed up text
    if (active && !waitingForInput) {
      speedUp = true;
    }
  }

  // D-pad for choice menu
  function moveCursor(dir) {
    if (!choiceActive) return;
    if (dir === 'up') {
      choiceIndex = (choiceIndex - 1 + choices.length) % choices.length;
      GameAudio.playCursor();
      speakCurrentChoice();
    } else if (dir === 'down') {
      choiceIndex = (choiceIndex + 1) % choices.length;
      GameAudio.playCursor();
      speakCurrentChoice();
    }
  }

  // Speak the currently highlighted choice option if it contains Japanese
  function speakCurrentChoice() {
    if (!choiceActive || choiceIndex < 0 || choiceIndex >= choices.length) return;
    const choice = choices[choiceIndex];
    const text = choice.text || choice;
    if (typeof text !== 'string') return;
    // Only speak if text contains Japanese characters
    const isJp = /[\u3000-\u9fff\uff00-\uffef]/.test(text);
    if (isJp && text !== '[\u4f55\u3082\u8a00\u308f\u306a\u3044]') {
      // Small delay so cursor sound plays first, then voice
      setTimeout(() => GameAudio.speakJapanese(text), 80);
    }
  }

  // Update (called each frame)
  function update(dt) {
    bounceTime += dt;
    listenPulse += dt;

    if (flashTimer > 0) {
      flashTimer -= dt * 1000;
      if (flashTimer <= 0) flashColor = null;
    }

    if (!active || waitingForInput) return;

    const now = performance.now();
    const delay = speedUp ? 5 : CHAR_DELAY;
    const text = lines[currentLine] || '';

    while (charIndex < text.length && (now - lastCharTime) >= delay) {
      charIndex++;
      lastCharTime += delay;
    }

    if (charIndex >= text.length) {
      waitingForInput = true;
    }
  }

  // Render the dialogue box
  function render(ctx) {
    // Flash overlay
    if (flashColor && flashTimer > 0) {
      ctx.fillStyle = flashColor;
      ctx.globalAlpha = Math.min(0.4, flashTimer / 300 * 0.4);
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.globalAlpha = 1;
    }

    if (!active && !choiceActive) return;

    const boxY = CANVAS_H - BOX_H;

    if (active) {
      // Text box background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, boxY, CANVAS_W, BOX_H);

      // Border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, boxY + 1, CANVAS_W - 2, BOX_H - 2);

      // Speaker name tab
      if (speaker) {
        const nameWidth = speaker.length * 6 + 12;
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(8, boxY - 12, nameWidth, 13);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(8, boxY - 12, nameWidth, 13);

        ctx.fillStyle = '#fff';
        ctx.font = '7px "Press Start 2P"';
        ctx.fillText(speaker, 14, boxY - 3);
      }

      // Text content
      const text = lines[currentLine] || '';
      const displayText = text.substring(0, charIndex);

      // Determine if this is Japanese text (contains CJK chars)
      const isJapanese = /[\u3000-\u9fff\uff00-\uffef]/.test(text);

      if (isJapanese) {
        ctx.font = '11px "M PLUS Rounded 1c"';
      } else {
        ctx.font = '7px "Press Start 2P"';
      }
      ctx.fillStyle = '#fff';

      // Word wrap
      const textOffsetX = listeningMode ? 24 : 0; // offset for ear icon
      const maxWidth = CANVAS_W - 20 - textOffsetX;
      const lineHeight = isJapanese ? 14 : 11;
      const textLines = wrapText(ctx, displayText, maxWidth);
      const maxLines = 3;

      for (let i = 0; i < Math.min(textLines.length, maxLines); i++) {
        ctx.fillText(textLines[i], 10 + textOffsetX, boxY + 14 + i * lineHeight);
      }

      // Listening mode: draw ear icon and prompt
      if (listeningMode) {
        // Pulsing ear icon (left side)
        const earPulse = Math.sin(listenPulse * 3) * 0.15 + 0.85;
        ctx.globalAlpha = earPulse;
        // Ear shape (simple pixel art)
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(12, boxY + 12, 2, 14);
        ctx.fillRect(14, boxY + 8, 2, 4);
        ctx.fillRect(14, boxY + 24, 2, 4);
        ctx.fillRect(16, boxY + 6, 4, 2);
        ctx.fillRect(16, boxY + 26, 4, 2);
        ctx.fillRect(20, boxY + 8, 2, 18);
        ctx.fillRect(16, boxY + 12, 2, 8);
        // Sound waves
        const waveAlpha = (Math.sin(listenPulse * 5) + 1) / 2 * 0.6 + 0.2;
        ctx.globalAlpha = waveAlpha;
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(24, boxY + 14, 2, 2);
        ctx.fillRect(26, boxY + 12, 2, 6);
        ctx.fillRect(28, boxY + 10, 2, 10);
        ctx.globalAlpha = 1;

        // "Press B to hear again" hint
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#aaa';
        ctx.fillText('[B] Listen again', 10, boxY + BOX_H - 4);

        // "Press A to answer" hint
        ctx.fillText('[A] Answer', CANVAS_W - 68, boxY + BOX_H - 4);
      }

      // Bouncing triangle indicator
      if (waitingForInput && !listeningMode) {
        const triY = boxY + BOX_H - 8 + Math.sin(bounceTime * 4) * 2;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(CANVAS_W - 14, triY);
        ctx.lineTo(CANVAS_W - 8, triY + 4);
        ctx.lineTo(CANVAS_W - 14, triY + 8);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Choice menu
    if (choiceActive && choices.length > 0) {
      const choiceW = 130;
      const itemH = 16;
      const choiceH = choices.length * itemH + 8;
      const choiceX = CANVAS_W - choiceW - 6;
      const choiceY = CANVAS_H - BOX_H - choiceH - 4;

      // Box
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(choiceX, choiceY, choiceW, choiceH);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(choiceX + 1, choiceY + 1, choiceW - 2, choiceH - 2);

      // Options
      for (let i = 0; i < choices.length; i++) {
        const y = choiceY + 10 + i * itemH;
        let optText = choices[i].text || choices[i];

        // Cursor arrow
        if (i === choiceIndex) {
          ctx.fillStyle = '#f1c40f';
          ctx.font = '7px "Press Start 2P"';
          ctx.fillText('\u25b6', choiceX + 4, y);
        }

        // Check if Japanese
        const isJp = /[\u3000-\u9fff\uff00-\uffef]/.test(optText);
        if (isJp) {
          ctx.font = '9px "M PLUS Rounded 1c"';
          if (typeof optText === 'string' && optText.length > 12) {
            optText = optText.substring(0, 11) + '\u2026';
          }
        } else {
          ctx.font = '6px "Press Start 2P"';
          if (typeof optText === 'string' && optText.length > 15) {
            optText = optText.substring(0, 14) + '\u2026';
          }
        }
        ctx.fillStyle = i === choiceIndex ? '#f1c40f' : '#fff';
        ctx.fillText(optText, choiceX + 15, y);
      }

      // Show [B] Peek hint for kana_assist mode
      if (typeof LEVEL_DISPLAY_MODES !== 'undefined' && kanaPeekHint) {
        ctx.font = '5px "Press Start 2P"';
        ctx.fillStyle = '#f39c12';
        ctx.fillText('[B] Romaji', choiceX + 4, choiceY + choiceH + 8);
      }
    }
  }

  // Text wrapping helper
  function wrapText(ctx, text, maxWidth) {
    const result = [];
    let line = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '\n') {
        result.push(line);
        line = '';
        continue;
      }
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line.length > 0) {
        result.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) result.push(line);
    return result;
  }

  return {
    isActive,
    show,
    showListening,
    showChoices,
    hideChoices,
    flash,
    pressA,
    pressB,
    moveCursor,
    update,
    render,
    get choiceActive() { return choiceActive; },
    get choiceIndex() { return choiceIndex; },
    get listeningMode() { return listeningMode; },
    set kanaPeekHint(val) { kanaPeekHint = val; },
    get kanaPeekHint() { return kanaPeekHint; },
  };
})();
