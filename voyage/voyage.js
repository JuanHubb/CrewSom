/**
 * CrewSom Voyage - WebGL 3D World Map & Bridge Building Game Logic
 * Built with Three.js and GSAP
 */

// ==========================================
// 1. DATA AND STATES
// ==========================================

const VoyageIslandState = {
  completed: 'completed',
  current: 'current',
  locked: 'locked'
};

const VoyageLandmark = {
  camp: '⛺',
  shell: '🐚',
  windmill: '🪁',
  blossom: '🌸',
  volcano: '🌋',
  fortress: '🏰',
  temple: '🏛️',
  skull: '💀',
  monument: '🗿'
};

// Voyage Islands specifications matching Flutter code
let voyageIslands = [
  { id: 0, name: '난파자의 섬', subtitle: '탐험 시작', x: 0.50, y: 0.88, state: VoyageIslandState.completed, landmark: VoyageLandmark.camp, grassColor: 0x8dd36d, sandColor: 0xf4d994, desc: '우리의 여정이 시작된 모래섬입니다. 난파된 흔적을 모아 첫 캠프를 마련했습니다.' },
  { id: 1, name: '조개섬', subtitle: '첫 정착지', x: 0.39, y: 0.71, state: VoyageIslandState.completed, landmark: VoyageLandmark.shell, grassColor: 0x74c98a, sandColor: 0xf1d38b, desc: '바람이 적고 모래가 고와서 정착하기 좋은 작은 섬입니다. 주변에 조개가 가득합니다.' },
  { id: 2, name: '바람섬', subtitle: '현재 항로', x: 0.55, y: 0.55, state: VoyageIslandState.current, landmark: VoyageLandmark.windmill, grassColor: 0x80d5a4, sandColor: 0xf3db9f, desc: '강한 해풍이 불어 풍차를 건설하기에 적합한 지역입니다. 이 다리를 놓아야 전진할 수 있습니다.' },
  { id: 3, name: '벚꽃섬', subtitle: '잠긴 지역', x: 0.29, y: 0.46, state: VoyageIslandState.locked, landmark: VoyageLandmark.blossom, grassColor: 0xe7a8d7, sandColor: 0xf0d4c1, desc: '화사하게 핀 야생 벚나무가 섬 전체를 덮고 있는 분홍빛 안식처입니다.' },
  { id: 4, name: '불꽃섬', subtitle: '잠긴 지역', x: 0.49, y: 0.34, state: VoyageIslandState.locked, landmark: VoyageLandmark.volcano, grassColor: 0xa6c56a, sandColor: 0xe8c47a, desc: '뜨거운 연기와 붉은 현무암으로 둘러싸여 위험하지만, 유용한 광석을 채굴할 수 있는 활화산 지대입니다.' },
  { id: 5, name: '성채섬', subtitle: '잠긴 지역', x: 0.70, y: 0.44, state: VoyageIslandState.locked, landmark: VoyageLandmark.fortress, grassColor: 0x85ba9d, sandColor: 0xefd396, desc: '과거 무인도 개척자들이 지어둔 단단한 돌성벽 성채가 굳건히 남아있는 요새입니다.' },
  { id: 6, name: '신전섬', subtitle: '잠긴 지역', x: 0.72, y: 0.24, state: VoyageIslandState.locked, landmark: VoyageLandmark.temple, grassColor: 0x90ded6, sandColor: 0xe1cf92, desc: '파도 소리와 함께 기도를 올리던 하얀 대리석 신전이 우뚝 솟아있는 성스러운 섬입니다.' },
  { id: 7, name: '해골섬', subtitle: '잠긴 지역', x: 0.31, y: 0.21, state: VoyageIslandState.locked, landmark: VoyageLandmark.skull, grassColor: 0x76cfa5, sandColor: 0xfad58a, desc: '음산한 안개가 걷히지 않으며 해적의 보물이 묻혀있다는 으스스한 절벽의 해골 바위 섬입니다.' },
  { id: 8, name: '모뉴먼트', subtitle: '최종 목적지', x: 0.52, y: 0.12, state: VoyageIslandState.locked, landmark: VoyageLandmark.monument, grassColor: 0xd9b3ea, sandColor: 0xf0e3c1, desc: '거대한 석상이 바다를 등지고 하늘을 쳐다보는 최종 목적지입니다. 윌슨의 모험 완결 지점입니다.' }
];

// Voyage routes matching Flutter coordinates
let voyageRoutes = [
  { from: 0, to: 1, state: VoyageIslandState.completed },
  { from: 1, to: 2, state: VoyageIslandState.completed },
  { from: 2, to: 3, state: VoyageIslandState.current },
  { from: 2, to: 5, state: VoyageIslandState.locked },
  { from: 3, to: 4, state: VoyageIslandState.locked },
  { from: 5, to: 4, state: VoyageIslandState.locked },
  { from: 4, to: 7, state: VoyageIslandState.locked },
  { from: 4, to: 6, state: VoyageIslandState.locked },
  { from: 7, to: 8, state: VoyageIslandState.locked },
  { from: 6, to: 8, state: VoyageIslandState.locked }
];

// Material definition schemas
const MATERIAL_SPECS = {
  smallRock: {
    label: '작은 돌', cost: 1, cells: [[0, 0]], color: 0xa1a1aa, canCrossDeepWater: false, icon: 'fa-circle'
  },
  stoneSlab: {
    label: '돌판', cost: 2, cells: [[0, 0], [1, 0]], color: 0x71717a, canCrossDeepWater: false, icon: 'fa-grip-lines-vertical'
  },
  trackRock: {
    label: '트랙 돌', cost: 5, cells: [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]], color: 0x4f46e5, canCrossDeepWater: false, icon: 'fa-route'
  },
  bridge: {
    label: '나무다리', cost: 3, cells: [[0, 0], [1, 0], [2, 0]], color: 0x854d0e, canCrossDeepWater: true, icon: 'fa-bridge'
  }
};

const BoardGeometry = {
  columns: 12,
  rows: 5,
  cellX: 1.0,  // Scale of cell spacing
  cellZ: 1.0,
  startX: -5.5,
  startZ: -2.0,
  reefs: [[2, 0], [3, 4], [8, 0], [9, 4]]
};

// Check if a cell coordinate is reef
function isReef(x, z) {
  return BoardGeometry.reefs.some(r => r[0] === x && r[1] === z);
}

// Check if deep water column
function isDeepWaterColumn(x) {
  return x >= 4 && x <= 6;
}

// Game states
let activeView = 'map'; // 'map' or 'game'
let selectedIslandId = 2;
let currentVoyageTarget = null;
let supply = 14;
let placements = []; // { materialType, cells: [[x, z]], mesh }
let occupied = {}; // 'x,z': placementIndex
let rotation = 0; // 0, 1, 2, 3 quarter turns
let activeMaterialType = 'smallRock';
let isSimulationRunning = false;

// Three.js instances
let scene, camera, renderer, controls;
let raycaster, mouse;
let mapIslandsGroup, gameBoardGroup;
let characterMesh;
let gridPlaneMesh; // Invisible helper plane for raycasting in grid
let cellHighlightMesh; // Translucent green/red grid selector box

// ==========================================
// 2. INITIALIZATION
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
  initThree();
  setupUI();
  renderMapInfoCard();
});

function initThree() {
  const container = document.getElementById('canvas-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x38bdf8); // Ocean sky blue
  scene.fog = new THREE.FogExp2(0x38bdf8, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 14, 21);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 35;

  // Lights
  const ambient = new THREE.AmbientLight(0xf0fdf4, 0.65);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfffbeb, 1.2);
  sun.position.set(10, 18, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 40;
  const d = 15;
  sun.shadow.camera.left = -d;
  sun.shadow.camera.right = d;
  sun.shadow.camera.top = d;
  sun.shadow.camera.bottom = -d;
  scene.add(sun);

  // Raycasting & Mouse setup
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Create groups
  mapIslandsGroup = new THREE.Group();
  scene.add(mapIslandsGroup);

  gameBoardGroup = new THREE.Group();
  scene.add(gameBoardGroup);

  // Build initial view
  buildWorldMapScene();

  // Resize handler
  window.addEventListener('resize', onWindowResize);

  // Start Animation
  animate();
}

// ==========================================
// 3. 3D SCENE BUILDERS
// ==========================================

// --- VIEW 1: WORLD MAP SCENE ---
function buildWorldMapScene() {
  // Reset groups
  clearGroup(mapIslandsGroup);
  clearGroup(gameBoardGroup);
  controls.target.set(0, 0, 0);

  // Sky backdrop
  renderer.setClearColor(0x38bdf8);
  scene.fog.color.setHex(0x38bdf8);
  scene.background.setHex(0x38bdf8);

  // 1. Draw Water Grid Plane
  const waterGeo = new THREE.PlaneGeometry(60, 60, 16, 16);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, roughness: 0.15, flatShading: true
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.y = -1.5;
  water.receiveShadow = true;
  mapIslandsGroup.add(water);

  // 2. Draw Islands
  voyageIslands.forEach(island => {
    // Transform coordinates from map normalized (0-1) to 3D space (-15 to +15)
    const mapWidth = 24;
    const mapHeight = 24;
    const posX = (island.x - 0.5) * mapWidth;
    const posZ = (island.y - 0.5) * mapHeight;

    const islandMesh = new THREE.Group();
    islandMesh.position.set(posX, 0, posZ);
    islandMesh.userData = { islandId: island.id, type: 'island' };

    // Low-poly Cylinder Grass layer
    const grassGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.4, 8, 1);
    const grassMat = new THREE.MeshStandardMaterial({
      color: island.grassColor, roughness: 0.8, flatShading: true
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y = 0.2;
    grass.castShadow = true;
    grass.receiveShadow = true;
    islandMesh.add(grass);

    // Sand Layer Cliff
    const cliffGeo = new THREE.CylinderGeometry(1.7, 1.9, 1.0, 8, 1);
    const cliffMat = new THREE.MeshStandardMaterial({
      color: island.sandColor, roughness: 0.9, flatShading: true
    });
    const cliff = new THREE.Mesh(cliffGeo, cliffMat);
    cliff.position.y = -0.5;
    cliff.castShadow = true;
    cliff.receiveShadow = true;
    islandMesh.add(cliff);

    // Landmark indicator (Tents, Castles, Volcanos modeled with simple shapes)
    createLandmarkModel(island.landmark, islandMesh);

    // Status Glow effect
    if (island.state === VoyageIslandState.current) {
      const glowGeo = new THREE.RingGeometry(1.8, 2.0, 16);
      glowGeo.rotateX(-Math.PI / 2);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.7
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.y = 0.42;
      islandMesh.add(glow);
      islandMesh.userData.glowRing = glow; // save for pulsing
    }

    mapIslandsGroup.add(islandMesh);
  });

  // 3. Draw Route Lines
  voyageRoutes.forEach(route => {
    const fromIsland = voyageIslands.find(i => i.id === route.from);
    const toIsland = voyageIslands.find(i => i.id === route.to);

    const mapWidth = 24;
    const mapHeight = 24;
    const fromX = (fromIsland.x - 0.5) * mapWidth;
    const fromZ = (fromIsland.y - 0.5) * mapHeight;
    const toX = (toIsland.x - 0.5) * mapWidth;
    const toZ = (toIsland.y - 0.5) * mapHeight;

    const startVec = new THREE.Vector3(fromX, 0.22, fromZ);
    const endVec = new THREE.Vector3(toX, 0.22, toZ);

    let routeColor = 0x64748b; // gray locked
    let tubeRadius = 0.08;
    if (route.state === VoyageIslandState.completed) {
      routeColor = 0x10b981; // green completed
      tubeRadius = 0.12;
    } else if (route.state === VoyageIslandState.current) {
      routeColor = 0xf59e0b; // gold active
      tubeRadius = 0.14;
    }

    // Tube Mesh representing connecting lines
    const lineCurve = new THREE.LineCurve3(startVec, endVec);
    const lineGeo = new THREE.TubeGeometry(lineCurve, 8, tubeRadius, 5, false);
    const lineMat = new THREE.MeshStandardMaterial({
      color: routeColor, roughness: 0.5, flatShading: true
    });
    const routeMesh = new THREE.Mesh(lineGeo, lineMat);
    mapIslandsGroup.add(routeMesh);
  });
}

function createLandmarkModel(landmark, group) {
  if (landmark === VoyageLandmark.camp) {
    // ⛺ Small Tent
    const tentGeo = new THREE.ConeGeometry(0.7, 1.2, 4);
    const tentMat = new THREE.MeshStandardMaterial({ color: 0xd97706, flatShading: true });
    const tent = new THREE.Mesh(tentGeo, tentMat);
    tent.position.set(0, 0.8, 0);
    tent.rotation.y = Math.PI / 4;
    group.add(tent);
  } else if (landmark === VoyageLandmark.shell) {
    // 🐚 Spiral Shell
    const shellGeo = new THREE.TorusGeometry(0.4, 0.2, 5, 8);
    const shellMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, flatShading: true });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.set(0, 0.6, 0);
    group.add(shell);
  } else if (landmark === VoyageLandmark.windmill) {
    // 🪁 Windmill
    const towerGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 6);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, flatShading: true });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(0, 1.0, 0);
    group.add(tower);
  } else if (landmark === VoyageLandmark.blossom) {
    // 🌸 Tree Pink
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 5);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 0.6, 0);
    group.add(trunk);

    const leafGeo = new THREE.DodecahedronGeometry(0.65, 1);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, flatShading: true });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0, 1.2, 0);
    group.add(leaf);
  } else if (landmark === VoyageLandmark.volcano) {
    // 🌋 Volcano
    const baseGeo = new THREE.CylinderGeometry(0.3, 0.9, 1.2, 6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, flatShading: true });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.8, 0);
    group.add(base);

    const magmaGeo = new THREE.SphereGeometry(0.35, 6, 6);
    const magmaMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const magma = new THREE.Mesh(magmaGeo, magmaMat);
    magma.position.set(0, 1.4, 0);
    group.add(magma);
  } else {
    // Default Flag Node
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.6, 4);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, 1.0, 0);
    group.add(pole);

    const bannerGeo = new THREE.BoxGeometry(0.6, 0.4, 0.05);
    const bannerMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0.3, 1.6, 0);
    group.add(banner);
  }
}

// --- VIEW 2: BRIDGE BUILDING GAME SCENE ---
function buildBridgeScene() {
  clearGroup(mapIslandsGroup);
  clearGroup(gameBoardGroup);

  // Set game camera defaults
  camera.position.set(0, 10, 14);
  controls.target.set(0, 0, 0);
  controls.update();

  // Dark sea abyss colors
  renderer.setClearColor(0x0a242b);
  scene.fog.color.setHex(0x0a242b);
  scene.background.setHex(0x0a242b);

  // 1. Draw Cliffs / Islands (Left and Right edges)
  const leftCliffGeo = new THREE.BoxGeometry(3.5, 4.0, 8.0);
  const cliffMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.9, flatShading: true });
  const leftCliff = new THREE.Mesh(leftCliffGeo, cliffMat);
  leftCliff.position.set(-7.5, -0.6, 0);
  leftCliff.receiveShadow = true;
  leftCliff.castShadow = true;
  gameBoardGroup.add(leftCliff);

  const leftGrassGeo = new THREE.BoxGeometry(3.5, 0.4, 8.0);
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x556b2f, roughness: 0.8, flatShading: true });
  const leftGrass = new THREE.Mesh(leftGrassGeo, grassMat);
  leftGrass.position.set(-7.5, 1.5, 0);
  leftGrass.receiveShadow = true;
  leftGrass.castShadow = true;
  gameBoardGroup.add(leftGrass);

  const rightCliffGeo = new THREE.BoxGeometry(3.5, 4.0, 8.0);
  const rightCliff = new THREE.Mesh(rightCliffGeo, cliffMat);
  rightCliff.position.set(7.5, -0.6, 0);
  rightCliff.receiveShadow = true;
  rightCliff.castShadow = true;
  gameBoardGroup.add(rightCliff);

  const rightGrassGeo = new THREE.BoxGeometry(3.5, 0.4, 8.0);
  const rightGrass = new THREE.Mesh(rightGrassGeo, grassMat);
  rightGrass.position.set(7.5, 1.5, 0);
  rightGrass.receiveShadow = true;
  rightGrass.castShadow = true;
  gameBoardGroup.add(rightGrass);

  // Landmark windmills or tents on start/end islands
  const windWindmill = new THREE.ConeGeometry(0.8, 1.6, 4);
  const windmillMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
  const windmillMesh = new THREE.Mesh(windWindmill, windmillMat);
  windmillMesh.position.set(7.5, 2.5, 0);
  gameBoardGroup.add(windmillMesh);

  // 2. Draw Sea Plane
  const seaGeo = new THREE.PlaneGeometry(16.0, 10.0);
  seaGeo.rotateX(-Math.PI / 2);
  const seaMat = new THREE.MeshStandardMaterial({
    color: 0x1b434c, roughness: 0.2, flatShading: true
  });
  const sea = new THREE.Mesh(seaGeo, seaMat);
  sea.position.set(0, 0.1, 0);
  sea.receiveShadow = true;
  gameBoardGroup.add(sea);

  // 3. Draw Grid lines and cells indicators
  drawGridVisuals();

  // Invisible plane for raycasting mouse coordinates
  const gridPlaneGeo = new THREE.PlaneGeometry(30, 20);
  gridPlaneGeo.rotateX(-Math.PI / 2);
  const gridPlaneMat = new THREE.MeshBasicMaterial({ visible: false });
  gridPlaneMesh = new THREE.Mesh(gridPlaneGeo, gridPlaneMat);
  gridPlaneMesh.position.y = 1.3; // grid level height
  gameBoardGroup.add(gridPlaneMesh);

  // Instantiates grid highlighter preview box
  const highlightGeo = new THREE.BoxGeometry(0.9, 0.15, 0.9);
  const highlightMat = new THREE.MeshBasicMaterial({
    color: 0x10b981, transparent: true, opacity: 0.4, wireframe: false
  });
  cellHighlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
  cellHighlightMesh.position.set(0, -100, 0); // Hide initially
  gameBoardGroup.add(cellHighlightMesh);

  // 4. Character Spawn (Little red/orange sphere chibi)
  const charGeo = new THREE.SphereGeometry(0.35, 12, 12);
  const charMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3, flatShading: true });
  characterMesh = new THREE.Mesh(charGeo, charMat);
  characterMesh.position.set(-7.5, 1.85, 0);
  characterMesh.castShadow = true;
  gameBoardGroup.add(characterMesh);
}

function drawGridVisuals() {
  const lineMat = new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.15 });

  for (let c = 0; c <= BoardGeometry.columns; c++) {
    const fromX = BoardGeometry.startX + c * BoardGeometry.cellX - BoardGeometry.cellX / 2;
    const fromZ = BoardGeometry.startZ;
    const toZ = BoardGeometry.startZ + BoardGeometry.rows * BoardGeometry.cellZ;

    const points = [
      new THREE.Vector3(fromX, 1.3, -2.5),
      new THREE.Vector3(fromX, 1.3, 2.5)
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMat);
    gameBoardGroup.add(line);
  }

  for (let r = 0; r <= BoardGeometry.rows; r++) {
    const fromZ = BoardGeometry.startZ + r * BoardGeometry.cellZ - BoardGeometry.cellZ / 2;
    const points = [
      new THREE.Vector3(-6.0, 1.3, fromZ),
      new THREE.Vector3(6.0, 1.3, fromZ)
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMat);
    gameBoardGroup.add(line);
  }

  // Highlights Reefs with red warning boxes
  BoardGeometry.reefs.forEach(reef => {
    const reefGeo = new THREE.BoxGeometry(0.9, 0.05, 0.9);
    const reefMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.25 });
    const reefMesh = new THREE.Mesh(reefGeo, reefMat);
    const center = getCellCenter(reef[0], reef[1]);
    reefMesh.position.set(center.x, 1.25, center.z);
    gameBoardGroup.add(reefMesh);
  });
}

// Translate grid coordinates to 3D positions
function getCellCenter(x, z) {
  const posX = BoardGeometry.startX + x * BoardGeometry.cellX;
  const posZ = BoardGeometry.startZ + z * BoardGeometry.cellZ;

  // matches Flutter height offset curve
  const normalized = Math.min(1.0, Math.max(0.0, Math.abs(x - 5.5) / 5.5));
  const height = 1.3 + 0.18 * Math.pow(normalized, 1.55);

  return { x: posX, y: height, z: posZ };
}

// Clears three group meshes
function clearGroup(group) {
  while (group.children.length > 0) {
    const child = group.children[0];
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else {
        child.material.dispose();
      }
    }
    group.remove(child);
  }
}

// ==========================================
// 4. RENDERING LOOP & RAYCASTS
// ==========================================

function animate() {
  requestAnimationFrame(animate);

  // Orbit controls update
  controls.update();

  // Active current node ring pulsing
  if (activeView === 'map') {
    mapIslandsGroup.children.forEach(child => {
      if (child.userData && child.userData.glowRing) {
        const glow = child.userData.glowRing;
        const pulse = 1.0 + 0.08 * Math.sin(Date.now() * 0.005);
        glow.scale.set(pulse, pulse, 1);
      }
    });
  }

  renderer.render(scene, camera);
}

function setupUI() {
  // Navigation tabs
  document.getElementById('btn-start-voyage').addEventListener('click', startVoyage);
  document.getElementById('btn-back-to-map').addEventListener('click', backToMap);
  document.getElementById('btn-clear-placements').addEventListener('click', clearPlacements);
  document.getElementById('btn-camera-reset').addEventListener('click', resetCamera);
  document.getElementById('btn-start-simulation').addEventListener('click', startSimulation);

  // Overlay confirms
  document.getElementById('btn-success-confirm').addEventListener('click', confirmSuccess);
  document.getElementById('btn-failure-retry').addEventListener('click', retryFailure);

  // Material tray selection
  document.querySelectorAll('.material-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.material-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      activeMaterialType = card.dataset.material;
      rotation = 0;
      updateHighlighterPreview();
    });
  });

  // Material rotation
  document.getElementById('btn-rotate-material').addEventListener('click', () => {
    rotation = (rotation + 1) % 4;
    updateHighlighterPreview();
    showToast("자재가 90도 회전되었습니다.", "info");
  });

  // Pointer move / tap raycast listener on canvas wrapper
  const wrapper = document.getElementById('canvas-container');
  wrapper.addEventListener('pointermove', onPointerMove);
  wrapper.addEventListener('pointerdown', onPointerDown);
}

function onWindowResize() {
  const container = document.getElementById('canvas-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

// ==========================================
// 5. INTERACTIVE FLOW LOGICS
// ==========================================

function renderMapInfoCard() {
  const island = voyageIslands.find(i => i.id === selectedIslandId);
  if (!island) return;

  document.getElementById('mission-name').innerText = island.name;
  document.getElementById('mission-subtitle').innerText = island.subtitle;
  document.getElementById('mission-icon').innerText = island.landmark;
  document.getElementById('mission-desc').innerText = island.desc;

  const badge = document.getElementById('mission-status-badge');
  badge.className = 'island-status-badge';
  if (island.state === VoyageIslandState.completed) {
    badge.innerText = '탐험 완료';
    badge.classList.add('completed');
  } else if (island.state === VoyageIslandState.current) {
    badge.innerText = '현재 위치';
  } else {
    badge.innerText = '잠김';
    badge.classList.add('locked');
  }

  // Enable/Disable Voyage button
  const startBtn = document.getElementById('btn-start-voyage');
  if (island.state === VoyageIslandState.current) {
    startBtn.removeAttribute('disabled');
  } else {
    startBtn.setAttribute('disabled', 'true');
  }
}

// Map Node Tap Raycasting
function onPointerDown(event) {
  if (isSimulationRunning) return;

  const container = document.getElementById('canvas-container');
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (activeView === 'map') {
    const intersects = raycaster.intersectObjects(mapIslandsGroup.children, true);
    if (intersects.length > 0) {
      // Find parent group with islandId
      let parent = intersects[0].object;
      while (parent && parent !== scene) {
        if (parent.userData && parent.userData.type === 'island') {
          selectedIslandId = parent.userData.islandId;
          renderMapInfoCard();
          showToast(`${voyageIslands[selectedIslandId].name}을 선택했습니다.`, "info");
          break;
        }
        parent = parent.parent;
      }
    }
  } else if (activeView === 'game') {
    // Bridge Grid click builder
    const intersects = raycaster.intersectObject(gridPlaneMesh);
    if (intersects.length > 0) {
      const hitPt = intersects[0].point;
      const cell = getCellFromPoint(hitPt);

      if (cell) {
        confirmPlacement(cell.x, cell.z);
      }
    }
  }
}

function onPointerMove(event) {
  if (activeView !== 'game' || isSimulationRunning) return;

  const container = document.getElementById('canvas-container');
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(gridPlaneMesh);
  if (intersects.length > 0) {
    const hitPt = intersects[0].point;
    const cell = getCellFromPoint(hitPt);

    if (cell) {
      updateHighlighterPreview(cell.x, cell.z);
    } else {
      cellHighlightMesh.position.set(0, -100, 0); // Hide
    }
  } else {
    cellHighlightMesh.position.set(0, -100, 0);
  }
}

function getCellFromPoint(pt) {
  const localX = pt.x - BoardGeometry.startX;
  const localZ = pt.z - BoardGeometry.startZ;

  const cellX = Math.round(localX / BoardGeometry.cellX);
  const cellZ = Math.round(localZ / BoardGeometry.cellZ);

  if (cellX >= 0 && cellX < BoardGeometry.columns && cellZ >= 0 && cellZ < BoardGeometry.rows) {
    return { x: cellX, z: cellZ };
  }
  return null;
}

// Get the actual list of grid offsets based on selected material and active rotation
function getRotatedShapeOffsets() {
  const spec = MATERIAL_SPECS[activeMaterialType];
  let offsets = spec.cells.map(c => [...c]);

  // Rotates 90 degrees clockwise 'rotation' times
  for (let turn = 0; turn < rotation; turn++) {
    offsets = offsets.map(cell => {
      // (x, z) rotated becomes (-z, x)
      return [-cell[1], cell[0]];
    });
  }
  return offsets;
}

// Update the glowing green/red bounding block preview
function updateHighlighterPreview(cx, cz) {
  if (cx === undefined || cz === undefined) {
    cellHighlightMesh.position.set(0, -100, 0);
    return;
  }

  const offsets = getRotatedShapeOffsets();
  const cells = offsets.map(o => [cx + o[0], cz + o[1]]);

  const isValid = validatePlacement(cells, activeMaterialType);

  // Position highlight mesh on center cell anchor
  const center = getCellCenter(cx, cz);
  cellHighlightMesh.position.set(center.x, center.y + 0.1, center.z);
  cellHighlightMesh.material.color.setHex(isValid ? 0x10b981 : 0xef4444);

  // Re-scale preview block dynamically to match shape
  // Let's keep it simple by wrapping the highlight size or outline, but size 1x1 works fine
}

function validatePlacement(cells, type) {
  const spec = MATERIAL_SPECS[type];
  if (supply < spec.cost) return false;

  for (const cell of cells) {
    const cx = cell[0];
    const cz = cell[1];

    // Check inside board
    if (cx < 0 || cx >= BoardGeometry.columns || cz < 0 || cz >= BoardGeometry.rows) {
      return false;
    }

    // Check Reefs
    if (isReef(cx, cz)) {
      return false;
    }

    // Check Overlaps
    if (occupied[`${cx},${cz}`] !== undefined) {
      return false;
    }

    // Check Deep water
    if (!spec.canCrossDeepWater && isDeepWaterColumn(cx)) {
      return false;
    }
  }

  // Connection check: Must touch left edge (column 0) or neighbor occupied cells
  let touchesNetwork = false;
  for (const cell of cells) {
    const cx = cell[0];
    const cz = cell[1];

    if (cx === 0) {
      touchesNetwork = true;
      break;
    }

    const neighbors = [
      [cx + 1, cz], [cx - 1, cz], [cx, cz + 1], [cx, cz - 1]
    ];
    for (const n of neighbors) {
      if (occupied[`${n[0]},${n[1]}`] !== undefined) {
        touchesNetwork = true;
        break;
      }
    }
  }

  return touchesNetwork;
}

// Build the placed block in 3D
function confirmPlacement(cx, cz) {
  const spec = MATERIAL_SPECS[activeMaterialType];
  const offsets = getRotatedShapeOffsets();
  const cells = offsets.map(o => [cx + o[0], cz + o[1]]);

  if (!validatePlacement(cells, activeMaterialType)) {
    showToast("설치할 수 없는 위치이거나 자재 비용을 초과했습니다.", "error");
    return;
  }

  // Deduct supply
  supply -= spec.cost;
  document.getElementById('lbl-supply-val').innerText = supply;

  // Placed mesh group
  const placementMeshGroup = new THREE.Group();

  cells.forEach(cell => {
    const center = getCellCenter(cell[0], cell[1]);

    const boxGeo = new THREE.BoxGeometry(0.9, 0.3, 0.9);
    const boxMat = new THREE.MeshStandardMaterial({
      color: spec.color, roughness: 0.6, flatShading: true
    });
    const block = new THREE.Mesh(boxGeo, boxMat);
    block.position.set(center.x, center.y, center.z);
    block.castShadow = true;
    block.receiveShadow = true;
    placementMeshGroup.add(block);

    // Register occupied list
    occupied[`${cell[0]},${cell[1]}`] = placements.length;
  });

  gameBoardGroup.add(placementMeshGroup);

  placements.push({
    materialType: activeMaterialType,
    cells: cells,
    mesh: placementMeshGroup,
    cost: spec.cost
  });

  showToast(`${spec.label}을 다리에 배치했습니다.`, "success");
  updateHighlighterPreview(cx, cz);
}

function clearPlacements() {
  if (isSimulationRunning) return;

  placements.forEach(p => {
    gameBoardGroup.remove(p.mesh);
  });
  placements = [];
  occupied = {};
  supply = 14;
  document.getElementById('lbl-supply-val').innerText = supply;
  showToast("자재를 모두 회수했습니다.", "info");
}

function resetCamera() {
  if (activeView === 'game') {
    camera.position.set(0, 10, 14);
    controls.target.set(0, 0, 0);
  } else {
    camera.position.set(0, 14, 21);
    controls.target.set(0, 0, 0);
  }
}

// ==========================================
// 6. BRIDGE GAME SIMULATION ENGINE
// ==========================================

function startVoyage() {
  activeView = 'game';
  document.getElementById('world-map-hud').classList.remove('active');
  document.getElementById('bridge-game-hud').classList.add('active');

  const island = voyageIslands.find(i => i.id === selectedIslandId);
  currentVoyageTarget = island;

  // Set names in HUD
  document.getElementById('bridge-from-name').innerText = '바람섬';
  document.getElementById('bridge-to-name').innerText = island.name;

  // Clear placements
  placements = [];
  occupied = {};
  supply = 14;
  document.getElementById('lbl-supply-val').innerText = supply;

  buildBridgeScene();
  showToast(`${island.name} 개척 모드에 진입했습니다.`, "info");
}

function backToMap() {
  activeView = 'map';
  document.getElementById('bridge-game-hud').classList.remove('active');
  document.getElementById('world-map-hud').classList.add('active');
  buildWorldMapScene();
  renderMapInfoCard();
}

function startSimulation() {
  if (isSimulationRunning) return;
  isSimulationRunning = true;

  document.getElementById('btn-start-simulation').setAttribute('disabled', 'true');
  document.getElementById('btn-clear-placements').setAttribute('disabled', 'true');
  document.getElementById('btn-rotate-material').style.opacity = '0.5';

  // Run path checker (BFS/Walk) from col 0 to 11
  const path = findCrossingPath();
  
  // Animate character along coordinates
  animateCharacterCrossing(path);
}

// DFS/BFS pathfinder to check grid connections
function findCrossingPath() {
  const steps = [];
  // start position
  steps.push({ x: -7.5, y: 1.85, z: 0 });

  // Column by column search
  let currentZ = 2; // Middle row (row 2)
  let failed = false;

  for (let c = 0; c < BoardGeometry.columns; c++) {
    // Look for occupied cell in column c next to current row
    let foundCell = null;
    const testRows = [currentZ, currentZ - 1, currentZ + 1, currentZ - 2, currentZ + 2];

    for (const r of testRows) {
      if (r >= 0 && r < BoardGeometry.rows) {
        if (occupied[`${c},${r}`] !== undefined) {
          foundCell = { x: c, z: r };
          break;
        }
      }
    }

    if (foundCell) {
      currentZ = foundCell.z;
      const center = getCellCenter(foundCell.x, foundCell.z);
      steps.push({ x: center.x, y: center.y + 0.55, z: center.z });
    } else {
      // Path breaks here! Character will run to the edge of the previous column and fall
      failed = true;
      const prevX = c - 1;
      if (prevX >= 0) {
        const center = getCellCenter(prevX, currentZ);
        // Fall position (sea level)
        steps.push({ x: center.x + 0.5, y: center.y + 0.55, z: center.z });
        steps.push({ x: center.x + 0.8, y: -2.0, z: center.z, fall: true }); // drop animation flag
      } else {
        // Drop straight from start cliff
        steps.push({ x: -5.0, y: 1.5, z: 0 });
        steps.push({ x: -4.5, y: -2.0, z: 0, fall: true });
      }
      break;
    }
  }

  // If path is successful, add final land position
  if (!failed) {
    steps.push({ x: 7.5, y: 1.85, z: 0 });
  }

  return { steps, success: !failed };
}

function animateCharacterCrossing(pathData) {
  const tl = gsap.timeline({
    onComplete: () => {
      isSimulationRunning = false;
      document.getElementById('btn-start-simulation').removeAttribute('disabled');
      document.getElementById('btn-clear-placements').removeAttribute('disabled');
      document.getElementById('btn-rotate-material').style.opacity = '1';

      if (pathData.success) {
        document.getElementById('panel-success').classList.add('active');
        showToast("개척 성공! 벚꽃섬으로 향하는 항로가 개척되었습니다.", "success");
      } else {
        document.getElementById('panel-failure').classList.add('active');
        showToast("다리가 끊겨 바다로 추락했습니다.", "error");
      }
    }
  });

  // GSAP animations through steps coordinates
  pathData.steps.forEach((step, i) => {
    if (i === 0) return; // start position
    const prev = pathData.steps[i - 1];

    if (step.fall) {
      // Fall down gravity curve
      tl.to(characterMesh.position, {
        x: step.x,
        y: prev.y + 0.2, // slight jump bounce
        z: step.z,
        duration: 0.25,
        ease: 'power1.out'
      }).to(characterMesh.position, {
        y: step.y,
        duration: 0.45,
        ease: 'bounce.out'
      });
    } else {
      // Standard running bounce animation
      const dist = Math.abs(step.x - prev.x) + Math.abs(step.z - prev.z);
      const duration = dist * 0.18;

      tl.to(characterMesh.position, {
        x: step.x,
        z: step.z,
        y: step.y + 0.1, // running bounce rise
        duration: duration / 2,
        ease: 'power1.out'
      }).to(characterMesh.position, {
        y: step.y,
        duration: duration / 2,
        ease: 'power1.in'
      });
    }
  });
}

function confirmSuccess() {
  document.getElementById('panel-success').classList.remove('active');

  // Update target island status to completed, unlock outer nodes
  if (currentVoyageTarget) {
    currentVoyageTarget.state = VoyageIslandState.completed;
    
    // Unlock next node (cherry island node 3 becomes active/completed)
    const nextIsland = voyageIslands.find(i => i.id === 3);
    if (nextIsland) nextIsland.state = VoyageIslandState.current;

    const route = voyageRoutes.find(r => r.from === 2 && r.to === 3);
    if (route) route.state = VoyageIslandState.completed;
    
    selectedIslandId = 3; // Focus on unlocked node
  }

  backToMap();
}

function retryFailure() {
  document.getElementById('panel-failure').classList.remove('active');
  characterMesh.position.set(-7.5, 1.85, 0); // Respawn
  clearPlacements();
}

// Show Toast Alert helper
function showToast(message, type = "info") {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
