# Konbini Quest v2 - Pokemon Red/Blue Style RPG Rebuild

## Overview
Complete rebuild as a top-down tile-based RPG. Player walks around a Japanese street, enters 3 konbini (7-Eleven, Lawson, FamilyMart), navigates aisles, talks to clerks, and learns Japanese through Pokemon-style dialogue interactions.

## Technical Architecture

### Canvas Setup
- Internal resolution: 256x240 (NES/Game Boy-esque)
- Tile size: 16x16 pixels
- Visible area: 16x15 tiles (256x240)
- Scale up to fill screen with `imageSmoothingEnabled = false`
- 60fps game loop with fixed timestep

### Tile System
All tiles are 16x16 pixels, drawn programmatically (no image files).
Tile IDs map to drawing functions.

### Color Palette
Use a limited Game Boy Color-inspired palette:
- Backgrounds: #0f380f, #306230, #8bac0f, #9bbc0f (classic GB green for outdoors)
- Indoor: warmer tones per store
- Characters: More colorful but still limited (4-5 colors per sprite)
- UI: Dark blue (#1a1a2e) with white text, like Pokemon menus

## MAPS

### Map 1: Japanese Street (Overworld) - 32x24 tiles
A small Japanese neighborhood street. The player spawns at the bottom.

Layout (top to bottom):
```
Row 0-2: Building tops / sky / trees
Row 3-6: Three konbini storefronts side by side
  - Left: 7-Eleven (cols 2-8)
  - Center: Lawson (cols 12-18)  
  - Right: FamilyMart (cols 22-28)
  - Each has a door tile (warp point)
Row 7: Sidewalk (walkable)
Row 8-9: Road with crosswalk markings
Row 10-11: Sidewalk (walkable) 
Row 12-14: Small park area with benches, trees, vending machines
Row 15-18: More sidewalk, some NPCs
Row 19-20: Fence/boundary
Row 21-23: Trees/boundary
```

Features on the street:
- Vending machines (interactable - practice ordering drinks)
- Park benches
- Street lamps
- Crosswalk markings
- Passing NPCs (decorative + optional interactions)
- A sign/bulletin board with game instructions
- Cherry blossom trees (sakura)

### Map 2: 7-Eleven Interior - 16x14 tiles
```
Row 0: Wall (back)
Row 1-2: Shelves (drinks, snacks) - not walkable
Row 3: Aisle (walkable)
Row 4-5: Shelves (onigiri, bento) - not walkable
Row 6: Aisle (walkable)
Row 7-8: Shelves (magazines, toiletries) - not walkable  
Row 9: Aisle (walkable)
Row 10: Counter with register, clerk behind it
Row 11: Space in front of counter (walkable, interaction zone)
Row 12: Floor space
Row 13: Door (warp back to street)
```

Color theme: Red/orange/green accents (7-Eleven colors)
Clerk sprite: Red vest/apron

### Map 3: Lawson Interior - 16x14 tiles
Same general layout but with Lawson blue theme.
Has a Karaage-kun hot food counter.
Clerk sprite: Blue uniform

### Map 4: FamilyMart Interior - 16x14 tiles
Same general layout but with green/blue theme.
Has a Famichiki hot food counter.
Clerk sprite: Green uniform

## SPRITES (All drawn programmatically on canvas, 16x16 pixels)

### Player Character
- 4 directions: down, up, left, right
- 2 walk frames per direction (alternating feet)
- Idle = frame 0 of current direction
- Cute chibi-style: large head, small body
- Backpack (tourist look)
- Hair color: brown

### Store Clerks (3 variants)
- 7-Eleven clerk: red/orange vest
- Lawson clerk: blue uniform  
- FamilyMart clerk: green uniform/apron
- Each has idle animation (slight movement)
- Face player when interacted with

### NPCs (Street)
- Old man with hat
- School girl with randoseru
- Business man with briefcase
- Each can give tips in Japanese

### Tile Graphics
All drawn with ctx.fillRect at 16x16 scale:
- Sidewalk: light gray with grid pattern
- Road: dark gray with yellow center line
- Crosswalk: white stripes on dark gray
- Grass: green with occasional darker dots
- Tree: green circle top, brown trunk
- Cherry blossom tree: pink top, dark trunk
- Building wall: beige/tan brick pattern
- Store front: colored awning + door + window
- Store shelves: brown with colored item rectangles
- Counter: brown with register (gray rectangle)
- Floor tiles: checkered or solid per store
- Vending machine: tall blue/red rectangle with colored dots
- Bench: brown horizontal rectangle
- Street lamp: thin pole with yellow circle top
- Fence: repeated brown vertical bars
- Door mat: dark rectangle with "WELCOME" feel

## MOVEMENT SYSTEM

### Grid-Based Movement (Pokemon style)
- Player position stored as grid coordinates (tileX, tileY)
- Movement is one tile at a time
- Walking animation plays during transition
- Movement takes ~200ms per tile (8 frames at 60fps)
- Cannot move while already moving (queue next input)
- Collision check before each step

### Input
- Arrow keys / WASD for movement
- Z or Space = A button (interact/confirm)
- X or Escape = B button (cancel/back)
- Mobile: On-screen d-pad (bottom-left) + A/B buttons (bottom-right)

### Collision
- Each tile has a `walkable` flag
- Shelves, walls, counters, trees, NPCs = not walkable
- Doors = walkable but trigger warp
- Counter fronts = walkable but trigger interaction when pressing A toward clerk

## INTERACTION SYSTEM

### NPC Detection
- When player presses A, check the tile they're FACING
- If that tile has an NPC, trigger dialogue
- Show "!" exclamation bubble above NPCs when player is adjacent and facing them
- NPC turns to face player when talked to

### Dialogue System (Pokemon-style)
- Text box at bottom of screen (full width, ~3 lines tall)
- Text appears character by character (typewriter effect, ~30ms per char)
- Press A to advance to next line / speed up text
- Speaker name shown in a small box above the text box
- For Japanese learning: show Japanese first, then romaji, then English

### Quiz Integration
When a clerk interaction triggers a learning scenario:
1. Clerk says their Japanese line (typewriter, with TTS)
2. Text box shows the phrase with furigana-style display
3. Bottom transitions to choice box (Pokemon-style menu)
4. 2-4 options displayed in a grid/list
5. Player selects with d-pad + A
6. Correct: green flash + chime + clerk happy animation
7. Wrong: red flash + buzz + clerk repeats
8. Explanation appears in text box
9. Return to free movement

### Choice Box Style
Like Pokemon's YES/NO or item selection:
- Right-aligned box with arrow cursor
- D-pad up/down to select
- A to confirm, B to cancel
- Pixel font, clean borders

## DOOR/WARP SYSTEM
- Walking onto a door tile triggers a screen transition
- Brief fade-to-black (500ms)
- Load new map
- Place player at the corresponding entry point
- Fade in (500ms)
- Play store's entry chime when entering a konbini

## PROGRESSION SYSTEM
- Free exploration from the start (all 3 stores accessible)
- Each store has a clerk with multiple interactions
- Interactions unlock progressively (complete interaction 1 to unlock 2, etc.)
- Visual indicator above clerks: speech bubble icon for available interaction, checkmark for completed
- Star rating carried over from v1 system
- Street NPCs give bonus tips/cultural lessons

## UI ELEMENTS

### HUD (always visible, top of screen)
- Current area name (top center in a small box): "Konbini Street" / "7-Eleven" etc.
- Star count / progress (top right)

### Text Box (when in dialogue)
- Bottom of screen, 256px wide, ~56px tall
- Dark blue background (#1a1a2e) with white pixel border
- 2px border, inner shadow
- Text in white, 8px pixel font
- Speaker name in a tab above the left side of the box
- Triangle "advance" indicator bottom-right (bouncing)

### Choice Menu (when selecting answer)
- Right side of text box area
- Dark background, white border
- Arrow cursor (▶) next to selected option
- Options stacked vertically

### Mobile Controls
- Semi-transparent d-pad: bottom-left, ~120px
- A button: bottom-right, circular, ~50px, labeled "A"
- B button: to the left of A, circular, ~40px, labeled "B"
- All controls semi-transparent (rgba) so game shows through
- Touch areas slightly larger than visual for fat-finger tolerance

## AUDIO (Carry over from v1)
- Store entry chimes (FamilyMart, 7-Eleven, Lawson)
- Japanese TTS for clerk phrases
- Walking footstep sounds (subtle procedural clicks)
- Interaction SFX (correct/wrong/menu select)
- Door transition sound
- Optional 8-bit background music loop for the street

## FILE STRUCTURE
```
konbini-quest/
├── index.html
├── style.css
├── engine.js      (core: game loop, input, camera, rendering)
├── maps.js        (tile data for all 4 maps, collision, warps)
├── sprites.js     (all sprite drawing functions)
├── npc.js         (NPC definitions, dialogue triggers, interaction state)
├── dialogue.js    (text box system, choice menus, typewriter effect)
├── levels.js      (all 12 levels of Japanese learning content - from v1)
├── audio.js       (chimes, SFX, TTS - from v1)
└── game.js        (main game state, scene management, progression)
```

## IMPORTANT CONSTRAINTS
- NO localStorage (sandboxed iframe)
- NO fetch() for binary files
- All graphics drawn programmatically with canvas fillRect/fillStyle
- AudioContext requires user gesture
- Mobile-first touch controls
- imageSmoothingEnabled = false everywhere
- All state in memory only
