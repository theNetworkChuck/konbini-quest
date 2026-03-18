/* Konbini Quest v2 - Map Data */
const Maps = (() => {
  const T = 16;
  // Tile legend:
  //  0=void, 1=sidewalk, 2=road, 3=road-center, 4=crosswalk
  //  5=grass, 6=tree, 7=cherry blossom, 8=bench, 9=street lamp
  // 10=fence, 11=vending machine, 12=building wall
  // 13=7E awning, 14=lawson awning, 15=FM awning
  // 16=7E door, 17=lawson door, 18=FM door
  // 19=7E window, 20=lawson window, 21=FM window
  // 22=floor, 23=warm floor, 24=store wall
  // 25=7E shelf, 26=lawson shelf, 27=FM shelf
  // 28=counter, 29=door mat, 30=sign
  // 31=lawson hot food, 32=FM hot food, 33=grass2

  // Walkability: which tiles can you walk on?
  const WALKABLE = new Set([1, 2, 3, 4, 5, 16, 17, 18, 22, 23, 29, 33]);
  // Warp tiles: doors trigger map transitions
  // NPC positions are defined separately

  // ==========================================
  // MAP 0: JAPANESE STREET (20 wide x 18 tall)
  // ==========================================
  const streetMap = [
    //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
    [ 6, 5, 6,12,13,13,13,12, 5, 6,12,14,14,14,12, 5, 6,12,15,15], // 0 - trees + awnings
    [ 5, 5, 5,19,13,13,19, 5, 5, 5,20,14,14,20, 5, 5, 5,21,15,15], // 1 - windows + awning
    [ 5, 5, 5,12,16,16,12, 5, 5, 5,12,17,17,12, 5, 5, 5,12,18,18], // 2 - doors
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 3 - sidewalk
    [ 9, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 1, 1, 9, 1, 1, 1, 1, 9], // 4 - sidewalk + lamps
    [ 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2], // 5 - road + crosswalk
    [ 2, 2, 4, 4, 2, 2, 3, 3, 2, 2, 4, 4, 2, 2, 3, 3, 4, 4, 2, 2], // 6 - road center
    [ 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2], // 7 - road
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 8 - sidewalk
    [ 1, 1, 1,30, 1, 1, 1, 1, 1,11, 1, 1, 1, 8, 1, 1, 1,11, 1, 1], // 9 - sign, vending, bench
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //10 - sidewalk
    [ 7, 5, 5, 1, 1, 1, 1, 5, 7, 5, 1, 1, 1, 1, 5, 5, 7, 1, 1, 5], //11 - park area
    [ 5, 5, 5, 1, 8, 1, 5, 5, 5, 5, 1, 1, 1, 5, 5, 6, 5, 1, 1, 5], //12 - benches, trees
    [ 6, 5, 5, 1, 1, 1, 1, 5, 5, 6, 1, 1, 1, 1, 5, 5, 5, 1, 1, 6], //13 - more park
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //14 - sidewalk
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //15 - sidewalk
    [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], //16 - fence
    [ 6, 5, 7, 5, 6, 5, 5, 7, 5, 6, 5, 5, 7, 5, 6, 5, 7, 5, 5, 6], //17 - trees
  ];

  // Warp definitions for street
  const streetWarps = [
    // 7-Eleven doors at (4,2) and (5,2) -> map 1
    { x: 4, y: 2, targetMap: 1, targetX: 7, targetY: 12 },
    { x: 5, y: 2, targetMap: 1, targetX: 8, targetY: 12 },
    // Lawson doors at (11,2) and (12,2) -> map 2
    { x: 11, y: 2, targetMap: 2, targetX: 7, targetY: 12 },
    { x: 12, y: 2, targetMap: 2, targetX: 8, targetY: 12 },
    // FamilyMart doors at (18,2) and (19,2) -> map 3
    { x: 18, y: 2, targetMap: 3, targetX: 7, targetY: 12 },
    { x: 19, y: 2, targetMap: 3, targetX: 8, targetY: 12 },
  ];

  // ==========================================
  // STORE INTERIORS (16 wide x 14 tall each)
  // ==========================================

  // 7-Eleven Interior (map 1)
  const sevenElevenMap = [
    //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
    [24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24], // 0 - back wall
    [24,25,25,25,25,25,25,22,22,25,25,25,25,25,25,24], // 1 - shelves
    [24,25,25,25,25,25,25,22,22,25,25,25,25,25,25,24], // 2 - shelves
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24], // 3 - aisle
    [24,25,25,25,25,22,22,22,22,22,22,25,25,25,25,24], // 4 - shelves
    [24,25,25,25,25,22,22,22,22,22,22,25,25,25,25,24], // 5 - shelves
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24], // 6 - aisle
    [24,25,25,25,25,22,22,22,22,22,22,25,25,25,25,24], // 7 - shelves
    [24,25,25,25,25,22,22,22,22,22,22,25,25,25,25,24], // 8 - shelves
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24], // 9 - aisle
    [24,28,28,28,28,28,28,28,28,28,28,28,28,28,28,24], //10 - counter
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24], //11 - space in front
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24], //12 - floor
    [24,24,24,24,24,24,24,29,29,24,24,24,24,24,24,24], //13 - door/mat
  ];

  const sevenElevenWarps = [
    { x: 7, y: 13, targetMap: 0, targetX: 4, targetY: 3 },
    { x: 8, y: 13, targetMap: 0, targetX: 5, targetY: 3 },
  ];

  // Lawson Interior (map 2)
  const lawsonMap = [
    [24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],
    [24,26,26,26,26,26,26,22,22,26,26,26,26,26,26,24],
    [24,26,26,26,26,26,26,22,22,26,26,26,26,26,26,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,26,26,26,26,22,22,22,22,22,22,31,31,26,26,24],
    [24,26,26,26,26,22,22,22,22,22,22,31,31,26,26,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,26,26,26,26,22,22,22,22,22,22,26,26,26,26,24],
    [24,26,26,26,26,22,22,22,22,22,22,26,26,26,26,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,28,28,28,28,28,28,28,28,28,28,28,28,28,28,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,24,24,24,24,24,24,29,29,24,24,24,24,24,24,24],
  ];

  const lawsonWarps = [
    { x: 7, y: 13, targetMap: 0, targetX: 11, targetY: 3 },
    { x: 8, y: 13, targetMap: 0, targetX: 12, targetY: 3 },
  ];

  // FamilyMart Interior (map 3)
  const familyMartMap = [
    [24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],
    [24,27,27,27,27,27,27,22,22,27,27,27,27,27,27,24],
    [24,27,27,27,27,27,27,22,22,27,27,27,27,27,27,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,27,27,27,27,22,22,22,22,22,22,32,32,27,27,24],
    [24,27,27,27,27,22,22,22,22,22,22,32,32,27,27,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,27,27,27,27,22,22,22,22,22,22,27,27,27,27,24],
    [24,27,27,27,27,22,22,22,22,22,22,27,27,27,27,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,28,28,28,28,28,28,28,28,28,28,28,28,28,28,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,22,22,22,22,22,22,22,22,22,22,22,22,22,22,24],
    [24,24,24,24,24,24,24,29,29,24,24,24,24,24,24,24],
  ];

  const familyMartWarps = [
    { x: 7, y: 13, targetMap: 0, targetX: 18, targetY: 3 },
    { x: 8, y: 13, targetMap: 0, targetX: 19, targetY: 3 },
  ];

  // All maps collection
  const allMaps = [
    { name: 'Konbini Street', nameJp: 'コンビニ通り', data: streetMap, warps: streetWarps, width: 20, height: 18 },
    { name: '7-Eleven', nameJp: 'セブンイレブン', data: sevenElevenMap, warps: sevenElevenWarps, width: 16, height: 14, store: '7-Eleven' },
    { name: 'Lawson', nameJp: 'ローソン', data: lawsonMap, warps: lawsonWarps, width: 16, height: 14, store: 'Lawson' },
    { name: 'FamilyMart', nameJp: 'ファミリーマート', data: familyMartMap, warps: familyMartWarps, width: 16, height: 14, store: 'FamilyMart' },
  ];

  function getTile(mapIdx, x, y) {
    const map = allMaps[mapIdx];
    if (!map) return 0;
    if (y < 0 || y >= map.height || x < 0 || x >= map.width) return 0;
    return map.data[y][x];
  }

  function isWalkable(mapIdx, x, y) {
    const tile = getTile(mapIdx, x, y);
    return WALKABLE.has(tile);
  }

  function getWarp(mapIdx, x, y) {
    const map = allMaps[mapIdx];
    if (!map) return null;
    return map.warps.find(w => w.x === x && w.y === y) || null;
  }

  return { allMaps, getTile, isWalkable, getWarp, WALKABLE, T };
})();
