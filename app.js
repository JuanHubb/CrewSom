/**
 * CrewSom - WebGL Gamified Fitness Application logic
 * Built with Three.js, GSAP, and Vanilla CSS
 */

// ==========================================
// 1. STATE STORE (Zustand-like Persistence)
// ==========================================
const DEFAULT_STATE = {
  nickname: "로빈슨",
  streakDays: 5,
  hearts: 10,
  steps: 75, // Matches the screenshot
  fitnessPoints: 350,
  woodenPlanks: 2,
  heavyStones: 1,
  strongRopes: 3,
  ironBars: 0,
  trackStones: [
    { id: "stone-init-1", name: "동네 한바퀴", shape: "city-park", met: 3.5, size: 0.52, date: "2026-06-23" },
    { id: "stone-init-2", name: "아침 야산 런", shape: "mountain-loop", met: 8.3, size: 1.25, date: "2026-06-24" }
  ],
  history: [
    { id: "hist-1", type: "OUTDOOR", intensity: "LOW", duration: 25, met: 3.0, points: 31, date: "2026-06-20 18:24", photo: null },
    { id: "hist-2", type: "COURSE", intensity: "HIGH", duration: 40, met: 10.0, points: 220, date: "2026-06-21 07:15", photo: "mock-photo.jpg" },
    { id: "hist-3", type: "INDOOR", intensity: "MODERATE", duration: 50, met: 6.0, points: 150, date: "2026-06-22 19:30", photo: null },
    { id: "hist-4", type: "COURSE", intensity: "MODERATE", duration: 30, met: 7.5, points: 120, date: "2026-06-23 08:00", photo: null },
    { id: "hist-5", type: "OUTDOOR", intensity: "LOW", duration: 60, met: 3.0, points: 90, date: "2026-06-24 17:45", photo: null }
  ],
  friends: [
    { name: "빈츠 (Beenzino)", status: "온라인 - 러닝 코스 개척 중", step: 5, color: "#60a5fa" },
    { name: "주린스 (Joorins)", status: "오프라인 - 어제 스쿼트 100개 완료", step: 4, color: "#f87171" },
    { name: "펄 (Pearl)", status: "식사 중 - 단백질 쉐이크 보충", step: 3, color: "#34d399" },
    { name: "톰행크스 (Tom)", status: "휴식 중 - 섬에 고립됨", step: 1, color: "#8b5a2b" },
    { name: "로빈슨 (Robinson)", status: "야영 중 - 모닥불 피우는 중", step: 2, color: "#a855f7" },
    { name: "프라이데이 (Friday)", status: "러닝 중 - 페이스 메이커 활동", step: 6, color: "#eab308" }
  ],
  crewMembers: [
    { name: "빈츠", step: 5, role: "리더", color: "#60a5fa" },
    { name: "주린스", step: 4, role: "대원", color: "#f87171" },
    { name: "펄", step: 3, role: "대원", color: "#34d399" },
    { name: "로빈슨", step: 2, role: "대원", color: "#a855f7" },
    { name: "프라이데이", step: 6, role: "대원", color: "#eab308" }
  ],
  crews: [
    {
      id: "crew-1",
      name: "윌슨 연합",
      level: 1,
      levelName: "야영 텐트촌",
      icon: "fa-tents",
      members: [
        { name: "빈츠", step: 5, role: "리더", color: "#60a5fa" },
        { name: "주린스", step: 4, role: "대원", color: "#f87171" },
        { name: "펄", step: 3, role: "대원", color: "#34d399" },
        { name: "로빈슨", step: 2, role: "대원", color: "#a855f7" },
        { name: "프라이데이", step: 6, role: "대원", color: "#eab308" }
      ]
    },
    {
      id: "crew-2",
      name: "로빈슨 클럽",
      level: 2,
      levelName: "통나무 오두막",
      icon: "fa-house-chimney",
      members: [
        { name: "톰행크스", step: 1, role: "리더", color: "#8b5a2b" },
        { name: "척놀랜드", step: 4, role: "대원", color: "#60a5fa" },
        { name: "윌슨공", step: 3, role: "대원", color: "#f87171" },
        { name: "피츠제럴드", step: 5, role: "대원", color: "#34d399" }
      ]
    },
    {
      id: "crew-3",
      name: "금요 등산회",
      level: 3,
      levelName: "벽돌 베이스캠프",
      icon: "fa-hotel",
      members: [
        { name: "한라산", step: 6, role: "리더", color: "#10b981" },
        { name: "백두산", step: 5, role: "대원", color: "#3b82f6" },
        { name: "지리산", step: 3, role: "대원", color: "#f59e0b" },
        { name: "설악산", step: 2, role: "대원", color: "#ef4444" }
      ]
    },
    {
      id: "crew-4",
      name: "스마트시티 런",
      level: 4,
      levelName: "스마트 시티 센터",
      icon: "fa-city",
      members: [
        { name: "테슬라", step: 7, role: "리더", color: "#3b82f6" },
        { name: "에디슨", step: 4, role: "대원", color: "#10b981" },
        { name: "머스크", step: 5, role: "대원", color: "#a855f7" },
        { name: "뉴턴", step: 3, role: "대원", color: "#ef4444" }
      ]
    }
  ],
  selectedCrewId: "crew-1",
  mapNodes: [
    { id: "island-1", name: "스타트 캠프", status: "VISITED", x: 60, y: 300 },
    { id: "island-2", name: "모닥불 섬", status: "CURRENT", x: 160, y: 180 },
    { id: "island-3", name: "바람막이 섬", status: "ADJACENT_AVAILABLE", x: 260, y: 220 },
    { id: "island-4", name: "최종 보물 섬", status: "LOCKED", x: 340, y: 100 }
  ],
  workoutSettings: {
    type: "COURSE",
    intensity: "MODERATE",
    duration: 30,
    gpsEnabled: true,
    gpsPath: "river-trail"
  },
  remainingBridgeAttempts: 2
};

let state = JSON.parse(localStorage.getItem("crewsom_state"));
if (!state || !state.history || state.history.length < 5 || !state.crews) {
  state = DEFAULT_STATE;
  localStorage.setItem("crewsom_state", JSON.stringify(state));
}

// Safe migrations for streak & resources
if (state.streakDays === undefined) state.streakDays = 5;
if (state.heavyStones === undefined) state.heavyStones = 1;
if (state.strongRopes === undefined) state.strongRopes = 3;
if (state.ironBars === undefined) state.ironBars = 0;

function saveState() {
  localStorage.setItem("crewsom_state", JSON.stringify(state));
  updateHUD();
}

function updateHUD() {
  const hudStreak = document.getElementById("hud-streak");
  if (hudStreak) {
    hudStreak.innerText = `${state.streakDays}일`;
  }
  document.getElementById("hud-steps").innerText = state.steps;
  document.getElementById("inv-points-val").innerText = state.fitnessPoints;
  document.getElementById("inv-planks-val").innerText = state.woodenPlanks;

  const invStones = document.getElementById("inv-stones-val");
  const invRopes = document.getElementById("inv-ropes-val");
  const invIron = document.getElementById("inv-iron-val");
  if (invStones) invStones.innerText = state.heavyStones;
  if (invRopes) invRopes.innerText = state.strongRopes;
  if (invIron) invIron.innerText = state.ironBars;
}

// Show Toast Alerts
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// MET Values mapping
const MET_VALUES = {
  COURSE: { LOW: 5.0, MODERATE: 7.5, HIGH: 10.0 },
  INDOOR: { LOW: 3.5, MODERATE: 6.0, HIGH: 8.5 },
  OUTDOOR: { LOW: 3.0, MODERATE: 5.0, HIGH: 8.0 }
};

const WORKOUT_TYPES = {
  COURSE: { label: "코스 운동", icon: "route" },
  INDOOR: { label: "실내운동", icon: "dumbbell" },
  OUTDOOR: { label: "실외운동", icon: "mountain-sun" }
};

// ==========================================
// 2. MAIN 3D SCENE (Three.js Floating Island)
// ==========================================
let scene, camera, renderer, controls, islandGroup;
let huts = {};
let flameGroupMesh;
const labels = {};

function initThree() {
  const container = document.getElementById("canvas-wrapper");
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2563eb); // sky blue background
  scene.fog = new THREE.FogExp2(0x3b82f6, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 45, 45);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("three-canvas"), antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't allow rotating under ground
  controls.minDistance = 6;
  controls.maxDistance = 25;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.5);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffedd5, 1.3);
  sunLight.position.set(8, 14, 8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 40;
  const d = 10;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // Campfire Light (Orange Glow)
  const campfireLight = new THREE.PointLight(0xf97316, 2.5, 8);
  campfireLight.position.set(0, 0.7, 0);
  campfireLight.castShadow = true;
  scene.add(campfireLight);

  // Create Island and Water
  createWater();
  createIsland();
  createSeaFoam();
  createBuildings();
  createPaths();
  createCampfire();
  createBuoy();

  // Handle Resize
  window.addEventListener("resize", onWindowResize);

  // Animation Loop
  animate();
}

// 2.1 Animated Wave Plane (Water)
let waterMesh;
function createWater() {
  const waterGeo = new THREE.PlaneGeometry(60, 60, 24, 24);
  const pos = waterGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, (Math.random() - 0.5) * 0.15);
  }
  waterGeo.computeVertexNormals();
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0055aa, // deep ocean blue
    roughness: 0.15,
    metalness: 0.1,
    flatShading: true
  });
  waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = -1.2;
  waterMesh.receiveShadow = true;
  scene.add(waterMesh);
}

// Expanding Wave Foam Rings around the Island Cliff Base
let waveFoams = [];
function createSeaFoam() {
  const foamGroup = new THREE.Group();

  // Flat circular disc geometry laid flat
  const geo = new THREE.CircleGeometry(0.15, 6);
  geo.rotateX(-Math.PI / 2);

  // Create 32 scattered foam spray particles
  for (let i = 0; i < 32; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);

    // Random initial distance (radius) and angle around island
    const distance = 5.2 + Math.random() * 1.6;
    const angle = Math.random() * Math.PI * 2;

    mesh.position.set(Math.cos(angle) * distance, -1.18, Math.sin(angle) * distance);
    foamGroup.add(mesh);

    waveFoams.push({
      mesh: mesh,
      angle: angle,
      distance: distance,
      speed: 0.25 + Math.random() * 0.35,
      scale: 0.7 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2
    });
  }
  scene.add(foamGroup);
}

// 2.2 Stylized Low-Poly Island Ground
// 2.2 Stylized Low-Poly Island Ground & Cliff Base (Upgraded matching reference)
function createIsland() {
  islandGroup = new THREE.Group();

  // 1. Core Green Grass Top Layer
  const grassGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.4, 16, 1);
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x65a30d, // Lush green
    roughness: 0.8,
    flatShading: true
  });
  const grassMesh = new THREE.Mesh(grassGeo, grassMat);
  grassMesh.position.y = 0.1;
  grassMesh.receiveShadow = true;
  grassMesh.castShadow = true;
  islandGroup.add(grassMesh);

  // 2. Core Rocky Cylinder Cliff Base
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x7c2d12, // Warm dark reddish-brown rock (Matches reference game tone)
    roughness: 0.9,
    flatShading: true
  });
  const coreGeo = new THREE.CylinderGeometry(5.0, 5.8, 2.5, 12, 2);
  const coreMesh = new THREE.Mesh(coreGeo, baseMat);
  coreMesh.position.y = -1.25;
  coreMesh.receiveShadow = true;
  coreMesh.castShadow = true;
  islandGroup.add(coreMesh);

  // 3. Overlapping Rocky Protrusions for premium low-poly faceted look
  const rockGeo = new THREE.DodecahedronGeometry(1.5);
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x5c2e16, // Darker cliff crevices shading
    roughness: 0.9,
    flatShading: true
  });

  for (let i = 0; i < 18; i++) {
    const rock = new THREE.Mesh(rockGeo, rockMat);
    const angle = (i / 18) * Math.PI * 2;
    const dist = 3.6 + Math.random() * 0.6;
    const rx = Math.cos(angle) * dist;
    const rz = Math.sin(angle) * dist;
    const ry = -1.5 - Math.random() * 1.0;

    rock.position.set(rx, ry, rz);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    // Stretch vertically for cliff columns
    const scaleY = 1.2 + Math.random() * 1.4;
    rock.scale.set(0.7 + Math.random() * 0.4, scaleY, 0.7 + Math.random() * 0.4);

    rock.castShadow = true;
    rock.receiveShadow = true;
    islandGroup.add(rock);
  }

  // 4. Lush Foliage / border leaves (Fleshes out green edges)
  const leafGeo = new THREE.DodecahedronGeometry(0.35);
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Dark green leaves
    roughness: 0.85,
    flatShading: true
  });

  for (let i = 0; i < 35; i++) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    const angle = Math.random() * Math.PI * 2;
    const dist = 4.4 + Math.random() * 0.6;
    leaf.position.set(Math.cos(angle) * dist, 0.25, Math.sin(angle) * dist);
    leaf.scale.set(0.7 + Math.random() * 0.6, 0.7 + Math.random() * 0.6, 0.7 + Math.random() * 0.6);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    islandGroup.add(leaf);
  }

  // 5. Shrink overall group slightly (0.88 scale) so the entire island fit in viewport
  islandGroup.scale.set(0.9, 0.9, 0.9);
  scene.add(islandGroup);

  // Add decorative rocks and palm trees
  addDecorations(islandGroup);
}

function addDecorations(parent) {
  // Low-Poly Palm Tree generator matching screenshot
  const createPalmTree = (x, z) => {
    const tree = new THREE.Group();

    // Curved trunk segment loop
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true, roughness: 0.8 });
    let currY = 0.1;
    let currX = 0;
    const segments = 5;

    for (let i = 0; i < segments; i++) {
      const segGeo = new THREE.CylinderGeometry(0.12 - i * 0.01, 0.15 - i * 0.01, 0.35, 5);
      const seg = new THREE.Mesh(segGeo, trunkMat);
      seg.position.set(currX, currY + 0.175, 0);

      // Bend slightly outwards
      seg.rotation.z = -x * 0.04;
      seg.rotation.x = z * 0.04;
      seg.castShadow = true;
      seg.receiveShadow = true;
      tree.add(seg);

      currY += 0.3;
      currX += -x * 0.015;
    }

    // Drooping Palm Leaves (5 green planes)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x166534, flatShading: true, roughness: 0.8 });
    const leafGeo = new THREE.BoxGeometry(0.9, 0.03, 0.3);
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(currX, currY, 0);
      const leafAngle = (i / 5) * Math.PI * 2;
      leaf.rotation.y = leafAngle;
      leaf.rotation.z = 0.25; // droop down
      leaf.translateX(0.4);
      leaf.castShadow = true;
      tree.add(leaf);
    }

    tree.position.set(x, 0.1, z);
    parent.add(tree);
  };

  // Place Palm Trees around edge
  createPalmTree(-3.8, -1.8);
  createPalmTree(-3.5, 3.2);
  createPalmTree(3.8, -1.8);
  createPalmTree(2.2, 3.8);

  // Grey details rocks
  const rockGeo = new THREE.DodecahedronGeometry(0.24);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, flatShading: true, roughness: 0.85 });
  for (let i = 0; i < 8; i++) {
    const rock = new THREE.Mesh(rockGeo, rockMat);
    const angle = Math.random() * Math.PI * 2;
    const dist = 4.2 + Math.random() * 0.6;
    rock.position.set(Math.cos(angle) * dist, 0.2, Math.sin(angle) * dist);
    rock.rotation.set(Math.random() * 5, Math.random() * 5, Math.random() * 5);
    rock.scale.set(0.8 + Math.random() * 0.6, 0.8 + Math.random() * 0.6, 0.8 + Math.random() * 0.6);
    rock.castShadow = true;
    rock.receiveShadow = true;
    parent.add(rock);
  }
}

// 2.3 Interactive Buildings (Huts) - High-Fidelity programmatically styled matching reference
function createBuildings() {
  const woodColor = 0xd97706; // Golden-brown wood
  const darkWoodColor = 0x78350f; // Dark brown roof wood
  const fabricColor = 0xfef08a; // Cream fabric tent
  const stoneColor = 0x94a3b8; // Grey stone portal

  const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, flatShading: true, roughness: 0.8 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: darkWoodColor, flatShading: true, roughness: 0.85 });
  const fabricMat = new THREE.MeshStandardMaterial({ color: fabricColor, flatShading: true, roughness: 0.9 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: stoneColor, flatShading: true, roughness: 0.85 });

  // North Hut: Main Workout Cabin
  const northHut = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 1.0), woodMat);
  base.position.y = 0.35;
  base.castShadow = true;
  base.receiveShadow = true;
  northHut.add(base);

  const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 1.2), darkWoodMat);
  roofLeft.position.set(-0.45, 0.9, 0);
  roofLeft.rotation.z = -Math.PI / 4;
  roofLeft.castShadow = true;

  const roofRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 1.2), darkWoodMat);
  roofRight.position.set(0.45, 0.9, 0);
  roofRight.rotation.z = Math.PI / 4;
  roofRight.castShadow = true;
  northHut.add(roofLeft, roofRight);

  const pilGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 5);
  const pillarL = new THREE.Mesh(pilGeo, darkWoodMat);
  pillarL.position.set(-0.55, 0.35, 0.45);
  pillarL.castShadow = true;
  const pillarR = pillarL.clone();
  pillarR.position.x = 0.55;
  northHut.add(pillarL, pillarR);

  northHut.position.set(0, 0.2, -3.2);
  islandGroup.add(northHut);
  huts["north"] = northHut;
  labels["north"] = document.getElementById("lbl-north");

  // East Hut: Tent (Wilson Campground)
  const eastHut = new THREE.Group();
  const tentGeo = new THREE.ConeGeometry(0.65, 0.9, 4);
  const tent = new THREE.Mesh(tentGeo, fabricMat);
  tent.rotation.y = Math.PI / 4;
  tent.position.set(0.4, 0.45, 0);
  tent.castShadow = true;
  tent.receiveShadow = true;
  eastHut.add(tent);

  const shelterBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.8), woodMat);
  shelterBase.position.set(-0.5, 0.75, 0);
  shelterBase.rotation.z = -0.15;
  shelterBase.castShadow = true;
  eastHut.add(shelterBase);

  const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.75, 5);
  for (let xOffset of [-0.8, -0.2]) {
    for (let zOffset of [-0.3, 0.3]) {
      const pole = new THREE.Mesh(poleGeo, darkWoodMat);
      pole.position.set(xOffset, 0.375, zOffset);
      pole.castShadow = true;
      eastHut.add(pole);
    }
  }

  eastHut.position.set(3.2, 0.2, 0);
  islandGroup.add(eastHut);
  huts["east"] = eastHut;
  labels["east"] = document.getElementById("lbl-east");

  // West Hut: Item Shop Market Stand with pink items on it
  const westHut = new THREE.Group();
  const counter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.6), woodMat);
  counter.position.y = 0.25;
  counter.castShadow = true;
  counter.receiveShadow = true;
  westHut.add(counter);

  const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.8), darkWoodMat);
  canopy.position.set(0, 0.9, 0);
  canopy.rotation.x = 0.15;
  canopy.castShadow = true;
  westHut.add(canopy);

  const shopPoleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.9, 5);
  for (let xOffset of [-0.55, 0.55]) {
    for (let zOffset of [-0.25, 0.25]) {
      const pole = new THREE.Mesh(shopPoleGeo, darkWoodMat);
      pole.position.set(xOffset, 0.45, zOffset);
      pole.castShadow = true;
      westHut.add(pole);
    }
  }

  const itemBoxGeo = new THREE.BoxGeometry(0.18, 0.12, 0.18);
  const itemMat = new THREE.MeshStandardMaterial({ color: 0xec4899, flatShading: true }); // Pink items
  for (let i = 0; i < 3; i++) {
    const box = new THREE.Mesh(itemBoxGeo, itemMat);
    box.position.set(-0.3 + i * 0.3, 0.56, 0);
    box.castShadow = true;
    westHut.add(box);
  }

  westHut.position.set(-3.2, 0.2, 0);
  islandGroup.add(westHut);
  huts["west"] = westHut;
  labels["west"] = document.getElementById("lbl-west");

  // South Hut: Record Stone Arch Portal with glowing core symbol
  const southHut = new THREE.Group();
  const colL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.9, 0.24), stoneMat);
  colL.position.set(-0.45, 0.45, 0);
  colL.castShadow = true;
  colL.receiveShadow = true;
  const colR = colL.clone();
  colR.position.x = 0.45;
  southHut.add(colL, colR);

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 0.32), stoneMat);
  lintel.position.set(0, 0.99, 0);
  lintel.castShadow = true;
  lintel.receiveShadow = true;
  southHut.add(lintel);

  const symbolGeo = new THREE.TorusGeometry(0.16, 0.05, 6, 12);
  const symbol = new THREE.Mesh(symbolGeo, stoneMat);
  symbol.position.set(0, 0.5, 0);
  symbol.castShadow = true;

  const glowGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // cyan glow
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.set(0, 0.5, 0);
  southHut.add(symbol, glow);

  southHut.position.set(0, 0.2, 3.2);
  islandGroup.add(southHut);
  huts["south"] = southHut;
  labels["south"] = document.getElementById("lbl-south");
}

// 2.4 Detailed Diamond Railway Track System (Fidelity upgrade matching screenshot)
function createPaths() {
  const trackGroup = new THREE.Group();

  const railMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, flatShading: true, roughness: 0.7 }); // wooden rails
  const tieMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, flatShading: true, roughness: 0.85 });  // dark sleepers

  const drawTrackSegment = (x1, z1, x2, z2, numTies) => {
    const p1 = new THREE.Vector3(x1, 0.21, z1);
    const p2 = new THREE.Vector3(x2, 0.21, z2);
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    dir.normalize();

    const angle = Math.atan2(dir.x, dir.z);

    // Draw 2 parallel rails
    const railGeo = new THREE.BoxGeometry(0.04, 0.04, len);
    const rail1 = new THREE.Mesh(railGeo, railMat);
    rail1.position.copy(p1).addScaledVector(dir, len / 2);
    rail1.position.x += Math.cos(angle + Math.PI / 2) * 0.14;
    rail1.position.z += Math.sin(angle + Math.PI / 2) * 0.14;
    rail1.rotation.y = angle;
    rail1.castShadow = true;

    const rail2 = new THREE.Mesh(railGeo, railMat);
    rail2.position.copy(p1).addScaledVector(dir, len / 2);
    rail2.position.x += Math.cos(angle - Math.PI / 2) * 0.14;
    rail2.position.z += Math.sin(angle - Math.PI / 2) * 0.14;
    rail2.rotation.y = angle;
    rail2.castShadow = true;

    trackGroup.add(rail1, rail2);

    // Draw sleepers
    const tieGeo = new THREE.BoxGeometry(0.46, 0.024, 0.09);
    for (let i = 0; i <= numTies; i++) {
      const t = i / numTies;
      const tie = new THREE.Mesh(tieGeo, tieMat);
      tie.position.copy(p1).addScaledVector(dir, len * t);
      tie.rotation.y = angle + Math.PI / 2;
      tie.castShadow = true;
      trackGroup.add(tie);
    }
  };

  // 4 Segments linking the huts in a diamond track ring
  drawTrackSegment(0, -2.4, 2.4, 0, 7);
  drawTrackSegment(2.4, 0, 0, 2.4, 7);
  drawTrackSegment(0, 2.4, -2.4, 0, 7);
  drawTrackSegment(-2.4, 0, 0, -2.4, 7);

  islandGroup.add(trackGroup);
}

// 2.5 Volumetric Campfire Flame and stone plaque
let fireParticles = [];
function createCampfire() {
  const fireGroup = new THREE.Group();

  // Plaque monument
  const plaqueGeo = new THREE.BoxGeometry(1.2, 0.6, 0.3);
  const plaqueMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, flatShading: true, roughness: 0.85 });
  const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
  plaque.position.set(0, 0.3, 0.6);
  plaque.rotation.x = -0.15;
  plaque.castShadow = true;
  plaque.receiveShadow = true;
  fireGroup.add(plaque);

  // Wooden D-5 signpost
  const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 5), plaqueMat);
  signPost.position.set(0.8, 0.3, 0.5);
  signPost.castShadow = true;
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.05), plaqueMat);
  signBoard.position.set(0.8, 0.6, 0.5);
  signBoard.castShadow = true;
  fireGroup.add(signPost, signBoard);

  // Logs surrounding fire
  const logGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.75, 5);
  const logMat = new THREE.MeshStandardMaterial({ color: 0x451a03, flatShading: true, roughness: 0.9 });
  for (let i = 0; i < 4; i++) {
    const log = new THREE.Mesh(logGeo, logMat);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = (i * Math.PI) / 4;
    log.position.y = 0.22;
    log.castShadow = true;
    fireGroup.add(log);
  }

  // Volumetric Low-Poly 3D Flame Mesh (glowing orange/yellow)
  const flameGroup = new THREE.Group();
  const orangeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    flatShading: true,
    roughness: 0.2
  });
  const yellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xca8a04,
    flatShading: true,
    roughness: 0.2
  });

  const f1 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 5), orangeMat);
  f1.position.set(0, 0.5, 0);
  const f2 = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.6, 5), yellowMat);
  f2.position.set(0.08, 0.45, -0.05);
  f2.rotation.y = 1;
  const f3 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 5), orangeMat);
  f3.position.set(-0.08, 0.4, 0.08);

  flameGroup.add(f1, f2, f3);
  fireGroup.add(flameGroup);
  flameGroupMesh = flameGroup; // Assign to global variable for pulse loop

  // Particles
  const particleGeo = new THREE.DodecahedronGeometry(0.07);
  const particleMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.8 });
  for (let i = 0; i < 15; i++) {
    const p = new THREE.Mesh(particleGeo, particleMat);
    resetParticle(p);
    p.position.y = Math.random() * 0.8;
    fireGroup.add(p);
    fireParticles.push(p);
  }

  islandGroup.add(fireGroup);
  huts["center"] = fireGroup;
  labels["center"] = document.getElementById("lbl-center");
}

function resetParticle(p) {
  p.position.set(
    (Math.random() - 0.5) * 0.25,
    0.25,
    (Math.random() - 0.5) * 0.25
  );
  p.scale.setScalar(0.7 + Math.random() * 0.8);
  p.userData = {
    speedY: 0.4 + Math.random() * 0.6,
    speedXZ: (Math.random() - 0.5) * 0.05,
    rotSpeed: Math.random() * 2
  };
}

// 2.6 Red Buoy in foreground water with metal hook ring
let buoyMesh;
function createBuoy() {
  const buoyGroup = new THREE.Group();

  const bottomGeo = new THREE.SphereGeometry(0.4, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottomMat = new THREE.MeshStandardMaterial({ color: 0xd92727, flatShading: true, roughness: 0.3 }); // shiny red buoy
  const bottom = new THREE.Mesh(bottomGeo, bottomMat);
  bottom.rotation.x = Math.PI; // upside down half sphere
  bottom.castShadow = true;
  buoyGroup.add(bottom);

  const ringGeo = new THREE.TorusGeometry(0.08, 0.03, 5, 10);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, flatShading: true });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.35;
  ring.castShadow = true;
  buoyGroup.add(ring);

  buoyGroup.position.set(0, -1.05, 3.8); // Floats near bottom center
  buoyGroup.visible = false; // Hide 3D buoy completely
  islandGroup.add(buoyGroup);

  buoyMesh = buoyGroup;
  huts["buoy"] = buoyGroup;
  labels["buoy"] = document.getElementById("lbl-buoy");
}

function updateParticles(delta) {
  fireParticles.forEach(p => {
    p.position.y += p.userData.speedY * delta;
    p.position.x += p.userData.speedXZ;
    p.rotation.x += p.userData.rotSpeed * delta;
    p.rotation.y += p.userData.rotSpeed * delta;

    // Scale down as it rises
    const t = 1.0 - (p.position.y / 0.95);
    if (t <= 0) {
      resetParticle(p);
    } else {
      p.scale.setScalar(t * (0.7 + Math.random() * 0.6));
    }
  });
}

// 2.7 Update Label positions on screen space
const tempV = new THREE.Vector3();
function updateLabels() {
  if (!scene) return;

  const widthHalf = renderer.domElement.clientWidth / 2;
  const heightHalf = renderer.domElement.clientHeight / 2;

  Object.keys(huts).forEach(key => {
    const obj = huts[key];
    const el = labels[key];
    if (!el) return;

    // Get position offset slightly upwards
    tempV.setFromMatrixPosition(obj.matrixWorld);

    if (key === "center") tempV.y += 1.5;
    else tempV.y += 1.2;

    tempV.project(camera);

    // Only display label if it's in front of camera
    if (tempV.z <= 1) {
      const x = (tempV.x * widthHalf) + widthHalf;
      const y = -(tempV.y * heightHalf) + heightHalf;
      el.style.display = "block";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    } else {
      el.style.display = "none";
    }
  });
}

let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // Water flat-shaded wave displacement
  if (waterMesh) {
    const pos = waterMesh.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.25 + time * 1.3) * 0.12 + Math.cos(y * 0.25 + time * 1.1) * 0.12;
      pos.setZ(i, z);
    }
    waterMesh.geometry.attributes.position.needsUpdate = true;
    waterMesh.geometry.computeVertexNormals();
  }

  // Animate expanding wave foams around the island base
  if (waveFoams.length > 0) {
    waveFoams.forEach(foam => {
      // Move outward
      foam.distance += foam.speed * delta;

      // Bob up and down slightly with water waves
      const bob = Math.sin(time * 2.0 + foam.phase) * 0.02;

      // Calculate opacity and scale based on distance progress
      const progress = Math.max(0, Math.min(1.0, (foam.distance - 5.2) / 1.6)); // 0 to 1

      if (progress >= 1.0) {
        // Reset to shore
        foam.distance = 5.2;
        foam.angle = Math.random() * Math.PI * 2;
        foam.speed = 0.25 + Math.random() * 0.35;
        foam.scale = 0.7 + Math.random() * 0.6;
      }

      const currentScale = foam.scale * (1.0 - progress * 0.7);
      foam.mesh.scale.set(currentScale, currentScale, currentScale);

      // Fade out towards the end
      let opacity = 0.6;
      if (progress < 0.2) {
        opacity = (progress / 0.2) * 0.6;
      } else {
        opacity = (1.0 - progress) * 0.6;
      }
      foam.mesh.material.opacity = Math.max(0, opacity);

      // Update position
      foam.mesh.position.set(
        Math.cos(foam.angle) * foam.distance,
        -1.18 + bob,
        Math.sin(foam.angle) * foam.distance
      );
    });
  }

  // Campfire Flame pulsing scale & rotate
  if (flameGroupMesh) {
    const flameScale = 1.0 + Math.sin(time * 6.0) * 0.12;
    flameGroupMesh.scale.set(flameScale, 1.0 + Math.cos(time * 5.0) * 0.08, flameScale);
    flameGroupMesh.rotation.y = time * 0.3;
  }

  updateParticles(delta);

  if (controls) controls.update();

  renderer.render(scene, camera);
  updateLabels();
}

function onWindowResize() {
  const container = document.getElementById("canvas-wrapper");
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// Raycaster setup for clicking 3D structures directly
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function setupRaycasting() {
  const canvas = document.getElementById("three-canvas");
  canvas.addEventListener("click", (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Prepare list of meshes to hit
    const targets = [];
    const mapping = {};

    Object.keys(huts).forEach(key => {
      huts[key].traverse(child => {
        if (child.isMesh) {
          targets.push(child);
          mapping[child.uuid] = key;
        }
      });
    });

    const intersects = raycaster.intersectObjects(targets);
    if (intersects.length > 0) {
      const clickedKey = mapping[intersects[0].object.uuid];
      if (clickedKey) {
        triggerHutModal(clickedKey);
      }
    }
  });
}

// Camera animation on hut click
function triggerHutModal(key) {
  let targetCamPos = new THREE.Vector3();
  let targetLookAt = new THREE.Vector3();
  let modalId = "";

  switch (key) {
    case "north":
      targetCamPos.set(0, 3, -1);
      targetLookAt.set(0, 0.4, -3.2);
      modalId = "modal-workout";
      break;
    case "east":
      targetCamPos.set(1.5, 3, 0);
      targetLookAt.set(3.2, 0.5, 0);
      modalId = "modal-friends-list";
      break;
    case "west":
      targetCamPos.set(-1.5, 3, 0);
      targetLookAt.set(-3.2, 0.4, 0);
      modalId = "modal-warehouse-shop";
      break;
    case "south":
      targetCamPos.set(0, 3, 1);
      targetLookAt.set(0, 0.4, 3.2);
      modalId = "modal-history-list";
      break;
    case "center":
      targetCamPos.set(0, 4, 3);
      targetLookAt.set(0, 0.3, 0.6);
      modalId = "modal-stage-map";
      break;
    case "buoy":
      // Buoy opens simplified workout modal
      targetCamPos.set(0, 1.5, 5);
      targetLookAt.set(0, -1.05, 3.8);
      modalId = "modal-buoy-workout";
      break;
  }

  // Zoom camera
  gsap.to(camera.position, {
    x: targetCamPos.x,
    y: targetCamPos.y,
    z: targetCamPos.z,
    duration: 1.0,
    ease: "power2.out",
    onUpdate: () => {
      controls.target.copy(targetLookAt);
    },
    onComplete: () => {
      if (key === "center") {
        window.location.href = "voyage/index.html";
      } else {
        openModal(modalId);
      }
    }
  });
}

// Reset camera to home island view
function resetCamera() {
  gsap.to(camera.position, {
    x: 0,
    y: 14,
    z: 21,
    duration: 0.8,
    ease: "power2.out",
    onUpdate: () => {
      controls.target.set(0, 0, 0);
    }
  });
}

// ==========================================
// 3. UI OVERLAYS & MODALS LOGIC
// ==========================================
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add("active");
  }
}

function closeModal(overlay) {
  overlay.classList.remove("active");
  resetCamera();
}

function setupModalTriggers() {
  // Floating bubble clicks
  const lblNorth = document.getElementById("lbl-north");
  if (lblNorth) lblNorth.addEventListener("click", () => triggerHutModal("north"));

  const lblEast = document.getElementById("lbl-east");
  if (lblEast) lblEast.addEventListener("click", () => triggerHutModal("east"));

  const lblWest = document.getElementById("lbl-west");
  if (lblWest) lblWest.addEventListener("click", () => triggerHutModal("west"));

  const lblSouth = document.getElementById("lbl-south");
  if (lblSouth) lblSouth.addEventListener("click", () => triggerHutModal("south"));

  const lblCenter = document.getElementById("lbl-center");
  if (lblCenter) lblCenter.addEventListener("click", () => triggerHutModal("center"));

  const lblBuoy = document.getElementById("lbl-buoy");
  if (lblBuoy) lblBuoy.addEventListener("click", () => triggerHutModal("buoy"));

  // Wood Start Button
  // Workout start/stop button logic
  let workoutStartTime = null;
  let workoutTimerInterval = null;

  document.getElementById("btn-start").addEventListener("click", () => {
    const btn = document.getElementById("btn-start");
    const buttonState = btn.getAttribute("data-state");
    if (buttonState === "stopped") {
      // Start workout
      workoutStartTime = Date.now();
      btn.textContent = "중지";
      btn.setAttribute("data-state", "running");

      // Get settings
      const typeCard = document.querySelector("#workout-type-group .radio-card.active");
      const intensityCard = document.querySelector("#workout-intensity-group .radio-card.active");
      const type = typeCard ? typeCard.dataset.value : "COURSE";
      const intensity = intensityCard ? intensityCard.dataset.value : "MODERATE";
      const met = (MET_VALUES[type] && MET_VALUES[type][intensity]) || 0;

      // Show Active Overlay
      const overlay = document.getElementById("workout-active-overlay");
      overlay.classList.add("active");
      document.getElementById("workout-met-val").innerText = met;
      document.getElementById("workout-timer-val").innerText = "00:00";
      document.getElementById("workout-energy-val").innerText = "0 FP";

      workoutTimerInterval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - workoutStartTime) / 1000);
        const mins = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
        const secs = String(elapsedSec % 60).padStart(2, "0");
        document.getElementById("workout-timer-val").innerText = `${mins}:${secs}`;

        // Calculate dynamic energy: MET * (elapsedSec / 60) * 10
        const currentEnergy = Math.round(met * (elapsedSec / 60) * 10);
        document.getElementById("workout-energy-val").innerText = `${currentEnergy} FP`;
      }, 1000);

    } else {
      // Stop workout, record data
      clearInterval(workoutTimerInterval);
      const endTime = Date.now();
      const durationSec = Math.round((endTime - workoutStartTime) / 1000);

      const typeCard = document.querySelector("#workout-type-group .radio-card.active");
      const intensityCard = document.querySelector("#workout-intensity-group .radio-card.active");
      const type = typeCard ? typeCard.dataset.value : "COURSE";
      const intensity = intensityCard ? intensityCard.dataset.value : "MODERATE";
      const met = (MET_VALUES[type] && MET_VALUES[type][intensity]) || 0;

      // Calculate workout power
      const workoutPower = Math.round(met * (durationSec / 60) * 10);

      // Update history in state
      const dateStr = new Date().toISOString().replace("T", " ").substring(0, 16);
      const newLog = {
        id: "hist-" + Date.now(),
        type: type,
        intensity: intensity,
        duration: Math.round(durationSec / 60) || 1, // minutes
        met: met,
        points: workoutPower,
        date: dateStr,
        photo: null
      };

      state.history.unshift(newLog);
      state.fitnessPoints += workoutPower;
      saveState();

      // Update UI
      renderHistory();
      renderWarehouse();

      // Reset active overlay
      const overlay = document.getElementById("workout-active-overlay");
      overlay.classList.remove("active");

      // Show Workout Result Modal
      const typeInfo = WORKOUT_TYPES[type] || { label: "코스 운동" };
      document.getElementById("workout-result-type").innerText = `${typeInfo.label} (${intensity === "LOW" ? "저강도" : intensity === "MODERATE" ? "중강도" : "고강도"})`;

      const resultMins = String(Math.floor(durationSec / 60)).padStart(2, "0");
      const resultSecs = String(durationSec % 60).padStart(2, "0");
      document.getElementById("workout-result-duration").innerText = `${resultMins}:${resultSecs}`;
      document.getElementById("workout-result-met").innerText = met;
      document.getElementById("workout-result-power").innerText = `+${workoutPower} FP`;

      openModal("modal-workout-result");

      // Reset button UI
      btn.textContent = "운동 시작";
      btn.setAttribute("data-state", "stopped");
    }
  });

  // Settings HUD click
  document.getElementById("btn-settings-hud").addEventListener("click", () => openModal("modal-settings"));

  // General Modal close logic
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.querySelector(".modal-close").addEventListener("click", () => {
      closeModal(overlay);
    });
  });

  // Sub-tabs switches
  document.querySelectorAll(".subtab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      const parent = tab.parentElement;
      parent.querySelectorAll(".subtab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const tabTarget = tab.getAttribute("data-tab");

      // Hide all siblings content
      if (tabTarget === "crew-friends") {
        document.getElementById("tab-crew-friends-content").style.display = "flex";
        document.getElementById("tab-all-users-content").style.display = "none";
      } else if (tabTarget === "all-users") {
        document.getElementById("tab-crew-friends-content").style.display = "none";
        document.getElementById("tab-all-users-content").style.display = "flex";
      } else if (tabTarget === "history-view") {
        document.getElementById("tab-history-view-content").style.display = "flex";
        document.getElementById("tab-history-upload-content").style.display = "none";
      } else if (tabTarget === "history-upload") {
        document.getElementById("tab-history-view-content").style.display = "none";
        document.getElementById("tab-history-upload-content").style.display = "flex";
      } else if (tabTarget === "warehouse-view") {
        document.getElementById("tab-warehouse-view-content").style.display = "flex";
        document.getElementById("tab-shop-view-content").style.display = "none";
      } else if (tabTarget === "shop-view") {
        document.getElementById("tab-warehouse-view-content").style.display = "none";
        document.getElementById("tab-shop-view-content").style.display = "flex";
      }
    });
  });

  // North (Workout setup) choices
  const bindRadioGroup = (groupId, stateField, otherGroupId) => {
    const container = document.getElementById(groupId);
    if (!container) return;
    const cards = container.querySelectorAll(".radio-card");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        const val = card.getAttribute("data-value");
        state.workoutSettings[stateField] = val;

        // Sync with the other group if provided
        if (otherGroupId) {
          const otherContainer = document.getElementById(otherGroupId);
          if (otherContainer) {
            const otherCards = otherContainer.querySelectorAll(".radio-card");
            otherCards.forEach(oc => {
              if (oc.getAttribute("data-value") === val) {
                oc.classList.add("active");
              } else {
                oc.classList.remove("active");
              }
            });
          }
        }
      });
    });
  };
  bindRadioGroup("workout-type-group", "type", "buoy-workout-type-group");
  bindRadioGroup("workout-intensity-group", "intensity", "buoy-workout-intensity-group");
  bindRadioGroup("buoy-workout-type-group", "type", "workout-type-group");
  bindRadioGroup("buoy-workout-intensity-group", "intensity", "workout-intensity-group");

  const btnSaveBuoy = document.getElementById("btn-save-buoy-workout");
  if (btnSaveBuoy) {
    btnSaveBuoy.addEventListener("click", () => {
      saveState();
      closeModal(document.getElementById("modal-buoy-workout"));
      showToast("간편 운동 설정이 완료되었습니다! 아래 '운동 시작' 버튼을 눌러 운동을 측정하세요.", "success");
    });
  }

  const durSlider = document.getElementById("slider-duration");
  durSlider.addEventListener("input", (e) => {
    const minutes = e.target.value;
    document.getElementById("val-duration").innerText = `${minutes}분`;
    state.workoutSettings.duration = parseInt(minutes);
  });

  const gpsToggle = document.getElementById("toggle-gps");
  gpsToggle.addEventListener("change", (e) => {
    state.workoutSettings.gpsEnabled = e.target.checked;
    const selector = document.getElementById("gps-path-selector-group");
    selector.style.opacity = e.target.checked ? "1" : "0.4";
    selector.style.pointerEvents = e.target.checked ? "auto" : "none";
  });

  const pathSelect = document.getElementById("select-gps-path");
  pathSelect.addEventListener("change", (e) => {
    state.workoutSettings.gpsPath = e.target.value;
  });

  // Submit Workout log
  document.getElementById("btn-save-workout").addEventListener("click", () => {
    const wType = state.workoutSettings.type;
    const wIntensity = state.workoutSettings.intensity;
    const wDuration = state.workoutSettings.duration;
    const wGps = state.workoutSettings.gpsEnabled;
    const wPath = state.workoutSettings.gpsPath;

    // Calculation MET
    const met = MET_VALUES[wType][wIntensity];
    const points = Math.round(met * wDuration * 0.5);

    // Save Workout
    const dateStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newLog = {
      id: "hist-" + Date.now(),
      type: wType,
      intensity: wIntensity,
      duration: wDuration,
      met: met,
      points: points,
      date: dateStr,
      photo: wGps ? `route-${wPath}.jpg` : null
    };
    state.history.unshift(newLog);
    state.fitnessPoints += points;

    // If GPS enabled, compile a 3D track stone
    if (wGps) {
      // Scale is average MET times a coefficient
      const stoneScale = parseFloat((met * 0.15).toFixed(2));
      const stoneNames = {
        "river-trail": "한강 시민공원",
        "mountain-loop": "남산 둘레길",
        "city-park": "여의도 공원",
        "dragon-tail": "북한산 코스"
      };
      const newStone = {
        id: "stone-" + Date.now(),
        name: `${stoneNames[wPath]} 돌`,
        shape: wPath,
        met: met,
        size: stoneScale,
        date: dateStr.split(" ")[0]
      };
      state.trackStones.unshift(newStone);
      showToast(`성공! 새 3D 트랙 돌 획득 (${stoneScale}x 스케일)`, "success");
    } else {
      showToast("운동 기록이 추가되었습니다!", "success");
    }

    saveState();
    closeModal(document.getElementById("modal-workout"));
    renderHistory();
    renderWarehouse();
  });

  // Shop Buy Planks
  document.getElementById("btn-buy-plank").addEventListener("click", () => {
    if (state.fitnessPoints >= 100) {
      state.fitnessPoints -= 100;
      state.woodenPlanks += 1;
      showToast("나무판자를 구매하였습니다!", "success");
      saveState();
      renderWarehouse();
    } else {
      showToast("운동력이 부족합니다! (필요: 100 FP)", "error");
    }
  });

  // Shop Buy Stone
  document.getElementById("btn-buy-stone").addEventListener("click", () => {
    if (state.fitnessPoints >= 150) {
      state.fitnessPoints -= 150;
      state.heavyStones = (state.heavyStones || 0) + 1;
      showToast("단단한 돌을 구매하였습니다!", "success");
      saveState();
      renderWarehouse();
    } else {
      showToast("운동력이 부족합니다! (필요: 150 FP)", "error");
    }
  });

  // Shop Buy Rope
  document.getElementById("btn-buy-rope").addEventListener("click", () => {
    if (state.fitnessPoints >= 80) {
      state.fitnessPoints -= 80;
      state.strongRopes = (state.strongRopes || 0) + 1;
      showToast("튼튼한 밧줄을 구매하였습니다!", "success");
      saveState();
      renderWarehouse();
    } else {
      showToast("운동력이 부족합니다! (필요: 80 FP)", "error");
    }
  });

  // Shop Buy Iron Ore
  document.getElementById("btn-buy-iron").addEventListener("click", () => {
    if (state.fitnessPoints >= 250) {
      state.fitnessPoints -= 250;
      state.ironBars = (state.ironBars || 0) + 1;
      showToast("철광석을 구매하였습니다!", "success");
      saveState();
      renderWarehouse();
    } else {
      showToast("운동력이 부족합니다! (필요: 250 FP)", "error");
    }
  });

  // Reset App
  document.getElementById("btn-reset-app-data").addEventListener("click", () => {
    localStorage.removeItem("crewsom_state");
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
    showToast("초기화되었습니다.", "info");
    setTimeout(() => location.reload(), 800);
  });
}

// ==========================================
// 4. RENDERING TABS & DATA CONTENT
// ==========================================
function renderFriends() {
  const container = document.getElementById("crew-friends-list-container");
  if (!container) return;
  container.innerHTML = "";

  const query = (document.getElementById("input-search-friend")?.value || "").trim().toLowerCase();
  const filteredFriends = state.friends.filter(f => f.name.toLowerCase().includes(query));

  filteredFriends.forEach(f => {
    const card = document.createElement("div");
    card.className = "friend-card";
    card.innerHTML = `
      <div class="avatar-circle" style="background:${f.color}">${f.name.substring(0, 2)}</div>
      <div class="friend-info">
        <div class="friend-name">${f.name}</div>
        <div class="friend-status">${f.status}</div>
      </div>
      <div class="friend-action"><i class="fa-solid fa-chevron-right"></i></div>
    `;
    card.addEventListener("click", () => showFriendProfile(f));
    container.appendChild(card);
  });
}

function showFriendProfile(friend) {
  const container = document.getElementById("modal-profile-info");

  const grassHTML = generateContributionGrassHTML();
  const feedHTML = generateInstaFeedHTML(friend.name);

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; width:100%; border-bottom:1px solid var(--glass-border); padding-bottom:14px;">
      <div class="avatar-circle" style="background:${friend.color}; width:56px; height:56px; font-size:22px; flex-shrink:0;">${friend.name.substring(0, 2)}</div>
      <div style="flex:1;">
        <h2 style="font-weight:900; font-size:18px;">${friend.name}</h2>
        <p style="color:var(--color-text-muted); font-size:11px; margin-top:2px;">${friend.status}</p>
        <div style="display:flex; gap:12px; margin-top:4px; font-size:11px; font-weight:700; color:var(--color-primary);">
          <span>주간 노드: ${friend.step}단계</span>
          <span>•</span>
          <span>크루원</span>
        </div>
      </div>
    </div>
    
    <!-- GitHub Contribution Grass Grid -->
    ${grassHTML}

    <!-- Instagram style 3-column feed -->
    ${feedHTML}
  `;
  document.getElementById("modal-profile").querySelector(".modal-title").innerHTML = `<i class="fa-solid fa-user"></i> 프로필 피드`;
  openModal("modal-profile");
}

function showOwnProfile() {
  const container = document.getElementById("modal-profile-info");

  const grassHTML = generateContributionGrassHTML();
  const feedHTML = generateInstaFeedHTML("로빈슨");

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; width:100%; border-bottom:1px solid var(--glass-border); padding-bottom:14px;">
      <div class="avatar-circle" style="background:#ec4899; width:56px; height:56px; font-size:22px; flex-shrink:0;">RB</div>
      <div style="flex:1;">
        <h2 style="font-weight:900; font-size:18px;">로빈슨 (나)</h2>
        <p style="color:var(--color-text-muted); font-size:11px; margin-top:2px;">오늘도 열심히 건강하게 운동하는 중! 🏃‍♂️</p>
        <div style="display:flex; gap:12px; margin-top:4px; font-size:11px; font-weight:700; color:var(--color-success);">
          <span>활동지수: ${state.steps}</span>
          <span>•</span>
          <span>누적 FP: ${state.fitnessPoints}</span>
        </div>
      </div>
    </div>
    
    <!-- GitHub Contribution Grass Grid -->
    ${grassHTML}

    <!-- Instagram style 3-column feed -->
    ${feedHTML}
  `;
  document.getElementById("modal-profile").querySelector(".modal-title").innerHTML = `<i class="fa-solid fa-user"></i> 마이페이지`;
  openModal("modal-profile");
}

function renderOwnProfilePage() {
  const container = document.getElementById("mypage-body-content");
  if (!container) return;

  const grassHTML = generateContributionGrassHTML();
  const feedHTML = generateInstaFeedHTML("로빈슨");

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; width:100%; border-bottom:1px solid var(--glass-border); padding-bottom:14px;">
      <div class="avatar-circle" style="background:#ec4899; width:56px; height:56px; font-size:22px; flex-shrink:0; border: 2.5px solid #000; box-shadow: 0 4px 0 #000; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:900;">RB</div>
      <div style="flex:1;">
        <h2 style="font-weight:900; font-size:18px; color: #fff;">로빈슨 (나)</h2>
        <p style="color:var(--color-text-muted); font-size:12px; margin-top:2px;">오늘도 열심히 건강하게 운동하는 중! 🏃‍♂️</p>
        <div style="display:flex; gap:12px; margin-top:4px; font-size:11px; font-weight:700; color:var(--color-success);">
          <span>활동지수: ${state.steps}</span>
          <span>•</span>
          <span>누적 FP: ${state.fitnessPoints}</span>
        </div>
      </div>
    </div>
    
    <!-- GitHub Contribution Grass Grid -->
    ${grassHTML}

    <!-- Instagram style 3-column feed -->
    ${feedHTML}
  `;
}

function generateContributionGrassHTML() {
  const today = new Date();
  const cells = [];
  const monthLabels = [];
  let currentMonth = -1;

  const startDate = new Date(today.getTime() - 25 * 7 * 24 * 60 * 60 * 1000); // 25 weeks for display
  const dayOffset = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOffset);

  for (let c = 0; c < 25 * 7; c++) {
    const cellDate = new Date(startDate.getTime() + c * 24 * 60 * 60 * 1000);
    let level = 0;
    const seed = (cellDate.getDate() * 7 + cellDate.getMonth() * 19) % 100;
    if (seed > 40) {
      if (seed < 65) level = 1;
      else if (seed < 80) level = 2;
      else if (seed < 93) level = 3;
      else level = 4;
    }
    cells.push(level);

    if (c % 7 === 0) {
      const month = cellDate.getMonth();
      if (month !== currentMonth) {
        monthLabels.push({ text: `${month + 1}월`, colIndex: Math.floor(c / 7) });
        currentMonth = month;
      }
    }
  }

  let monthsHTML = "";
  monthLabels.forEach(m => {
    const leftOffset = m.colIndex * 12;
    monthsHTML += `<span class="contribution-month-lbl" style="left: ${leftOffset}px">${m.text}</span>`;
  });

  let cellsHTML = "";
  cells.forEach(lvl => {
    cellsHTML += `<div class="contribution-cell level-${lvl}"></div>`;
  });

  return `
    <div class="contribution-container">
      <div class="contribution-header">
        <span>711 contributions in the last year</span>
        <span style="font-size:10px; color:var(--color-primary);">잔디 달성도 <i class="fa-solid fa-square-check"></i></span>
      </div>
      <div class="contribution-wrapper">
        <div class="contribution-row-labels">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        <div class="contribution-grid-scroll">
          <div class="contribution-months">
            ${monthsHTML}
          </div>
          <div class="contribution-grid">
            ${cellsHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

const WORKOUT_FEED_DATA = [
  { type: "COURSE", duration: 30, points: 120, date: "06-25", tag: "5.2km", icon: "route", imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8", title: "한강 모닝 러닝", intensity: "MODERATE", met: 8.3 },
  { type: "INDOOR", duration: 45, points: 180, date: "06-23", tag: "15.4km", icon: "dumbbell", imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e", title: "하남 자전거길 라이딩", intensity: "MODERATE", met: 7.0 },
  { type: "OUTDOOR", duration: 60, points: 50, date: "06-22", tag: "6,200보", icon: "mountain-sun", imageUrl: "https://images.unsplash.com/photo-1551632811-5617ba2adda4", title: "남산 산책", intensity: "LOW", met: 2.5 },
  { type: "COURSE", duration: 40, points: 220, date: "06-20", tag: "8.1km", icon: "route", imageUrl: "https://images.unsplash.com/photo-1502904582529-0a15f0cee5c2", title: "퇴근 리프레시 런", intensity: "HIGH", met: 11.0 },
  { type: "INDOOR", duration: 30, points: 100, date: "06-18", tag: "10.2km", icon: "dumbbell", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48", title: "동네 스피닝", intensity: "LOW", met: 4.0 },
  { type: "OUTDOOR", duration: 40, points: 35, date: "06-17", tag: "4,500보", icon: "mountain-sun", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773", title: "공원 점심 산책", intensity: "LOW", met: 2.5 },
  { type: "COURSE", duration: 25, points: 95, date: "06-15", tag: "4.0km", icon: "route", imageUrl: "https://images.unsplash.com/photo-1486218119243-13883505764c", title: "저녁 가벼운 조깅", intensity: "LOW", met: 6.0 },
  { type: "INDOOR", duration: 50, points: 210, date: "06-13", tag: "18.5km", icon: "dumbbell", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd", title: "주말 동호회 벙개", intensity: "HIGH", met: 10.0 },
  { type: "OUTDOOR", duration: 75, points: 65, date: "06-12", tag: "8,500보", icon: "mountain-sun", imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d", title: "주말 나들이 코스", intensity: "LOW", met: 2.5 }
];

function generateInstaFeedHTML(name) {
  let gridHTML = "";
  WORKOUT_FEED_DATA.forEach((w, index) => {
    gridHTML += `
      <div class="insta-photo" onclick="showWorkoutDetail(${index})">
        <img src="${w.imageUrl}" class="insta-photo-img feed-img" loading="lazy" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" />
        <i class="fa-solid fa-${w.icon}" style="position:absolute; top:8px; right:8px; font-size:12px; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.8);"></i>
        <span class="insta-photo-tag">${w.date} • ${w.tag}</span>
        <div class="insta-overlay">
          <span class="insta-overlay-title">${w.title}</span>
          <span class="insta-overlay-stat">${w.duration}분 • +${w.points}FP</span>
        </div>
      </div>
    `;
  });

  return `
    <div class="insta-grid-container">
      <span class="form-label">운동 피드</span>
      <div class="insta-grid">
        ${gridHTML}
      </div>
    </div>
  `;
}

function showWorkoutDetail(index) {
  const w = WORKOUT_FEED_DATA[index];
  const container = document.getElementById("modal-workout-detail-content");

  const intensityLabel = w.intensity === "LOW" ? "저강도" : w.intensity === "MODERATE" ? "중강도" : "고강도";
  const typeLabel = WORKOUT_TYPES[w.type] ? WORKOUT_TYPES[w.type].label : w.type;

  container.innerHTML = `
    <div class="workout-detail-card" style="display:flex; flex-direction:column; gap:16px;">
      <img src="${w.imageUrl}" style="width:100%; height:200px; object-fit:cover; border-radius:16px; border:2px solid var(--glass-border);" />
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="font-weight:900; font-size:20px; color:#fff; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${w.title}</h3>
        <span style="font-size:12px; color:var(--color-primary); font-weight:700;">${w.date}</span>
      </div>
      <div class="detail-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="detail-item" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:4px; border: 1px solid var(--glass-border);">
          <span style="font-size:11px; color:var(--color-text-muted);">운동 종목</span>
          <span style="font-weight:700; color:#fff;">${typeLabel}</span>
        </div>
        <div class="detail-item" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:4px; border: 1px solid var(--glass-border);">
          <span style="font-size:11px; color:var(--color-text-muted);">운동 강도</span>
          <span style="font-weight:700; color:#fff;">${intensityLabel} (MET: ${w.met})</span>
        </div>
        <div class="detail-item" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:4px; border: 1px solid var(--glass-border);">
          <span style="font-size:11px; color:var(--color-text-muted);">지속 시간</span>
          <span style="font-weight:700; color:#fff;">${w.duration}분</span>
        </div>
        <div class="detail-item" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:4px; border: 1px solid var(--glass-border);">
          <span style="font-size:11px; color:var(--color-text-muted);">획득 운동력</span>
          <span style="font-weight:700; color:var(--color-success);">+${w.points} FP</span>
        </div>
      </div>
      <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); padding:12px; border-radius:12px; display:flex; align-items:center; gap:10px; margin-top:8px;">
        <i class="fa-solid fa-square-check" style="color:var(--color-success); font-size:20px;"></i>
        <span style="font-size:12px; font-weight:700; color:var(--color-success);">오운완 사진 인증이 완료된 기록입니다.</span>
      </div>
    </div>
  `;
  openModal("modal-workout-detail");
}

function showHistoryDetail(h) {
  const container = document.getElementById("modal-workout-detail-content");
  if (!container) return;

  const typeLabel = WORKOUT_TYPES[h.type] ? WORKOUT_TYPES[h.type].label : h.type;
  const intensityLabel = h.intensity === "LOW" ? "저강도" : h.intensity === "MODERATE" ? "중강도" : "고강도";
  const icon = WORKOUT_TYPES[h.type] ? WORKOUT_TYPES[h.type].icon : "route";

  container.innerHTML = `
    <div class="workout-detail-card" style="display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; align-items:center; justify-content:center; height:120px; background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius:16px; border:1px solid var(--glass-border); font-size:48px; color:var(--color-primary);">
        <i class="fa-solid fa-${icon}"></i>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="font-weight:900; font-size:18px; color:#fff;">${typeLabel} 운동 기록 상세</h3>
        <span style="font-size:12px; color:var(--color-text-muted); font-weight:700;">${h.date}</span>
      </div>
      <div class="detail-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="detail-item" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:4px; border: 1px solid var(--glass-border);">
          <span style="font-size:11px; color:var(--color-text-muted);">운동 종목</span>
          <span style="font-weight:700; color:#fff;">${typeLabel}</span>
        </div>
        <div class="detail-item" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:4px; border: 1px solid var(--glass-border);">
          <span style="font-size:11px; color:var(--color-text-muted);">운동 강도</span>
          <span style="font-weight:700; color:#fff;">${intensityLabel} (MET: ${h.met})</span>
        </div>
        <div class="detail-item" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:4px; border: 1px solid var(--glass-border);">
          <span style="font-size:11px; color:var(--color-text-muted);">지속 시간</span>
          <span style="font-weight:700; color:#fff;">${h.duration}분</span>
        </div>
        <div class="detail-item" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:4px; border: 1px solid var(--glass-border);">
          <span style="font-size:11px; color:var(--color-text-muted);">획득 운동력</span>
          <span style="font-weight:700; color:var(--color-success);">+${h.points} FP</span>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--glass-border); padding:12px; border-radius:12px; display:flex; align-items:center; gap:10px; margin-top:8px;">
        <i class="fa-solid fa-circle-info" style="color:var(--color-primary); font-size:20px;"></i>
        <span style="font-size:12px; font-weight:700; color:var(--color-text-muted);">${h.photo ? '📸 사진 인증이 완료된 트랙 코스 기록입니다.' : '✍️ 일반 직접 기록입니다.'}</span>
      </div>
    </div>
  `;
  openModal("modal-workout-detail");
}

function renderHistory() {
  const container = document.getElementById("tab-history-view-content");
  container.innerHTML = "";
  if (state.history.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--color-text-muted); padding:30px;">아직 운동 기록이 없습니다.</div>`;
    return;
  }
  state.history.forEach(h => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.style.cursor = "pointer";
    const typeLabel = WORKOUT_TYPES[h.type] ? WORKOUT_TYPES[h.type].label : h.type;
    const intensityLabel = h.intensity === "LOW" ? "저강도" : h.intensity === "MODERATE" ? "중강도" : "고강도";
    const icon = WORKOUT_TYPES[h.type] ? WORKOUT_TYPES[h.type].icon : "route";
    card.innerHTML = `
      <div class="history-left">
        <div class="history-type">
          <i class="fa-solid fa-${icon}"></i> ${typeLabel} (${intensityLabel})
        </div>
        <div class="history-details">${h.duration}분 소요 • ${h.photo ? '📸 경로 인증됨' : '✍️ 일반 기록'}</div>
        <div class="history-date">${h.date}</div>
      </div>
      <div class="history-right">
        <div class="history-points">+${h.points} FP</div>
        <div class="history-met">${h.met} MET</div>
      </div>
    `;
    card.addEventListener("click", () => {
      showHistoryDetail(h);
    });
    container.appendChild(card);
  });
}

function renderWarehouse() {
  document.getElementById("inv-points-val").innerText = state.fitnessPoints;
  document.getElementById("inv-planks-val").innerText = state.woodenPlanks;

  const invStones = document.getElementById("inv-stones-val");
  const invRopes = document.getElementById("inv-ropes-val");
  const invIron = document.getElementById("inv-iron-val");
  if (invStones) invStones.innerText = state.heavyStones;
  if (invRopes) invRopes.innerText = state.strongRopes;
  if (invIron) invIron.innerText = state.ironBars;

  const container = document.getElementById("warehouse-stones-list");
  container.innerHTML = "";
  if (state.trackStones.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--color-text-muted); padding:20px; font-size:12px;">보유한 트랙 돌이 없습니다.</div>`;
    return;
  }
  state.trackStones.forEach(s => {
    const item = document.createElement("div");
    item.className = "stone-item";
    const shapeIcon = s.shape === "river-trail" ? "circle" : s.shape === "mountain-loop" ? "star" : s.shape === "city-park" ? "square" : "wave-square";
    item.innerHTML = `
      <div class="stone-preview">
        <i class="fa-solid fa-${shapeIcon}"></i>
      </div>
      <div class="stone-info">
        <div class="stone-title">${s.name}</div>
        <div class="stone-desc">크기 스케일: ${s.size}x | ${s.met} MET 강도</div>
      </div>
    `;
    container.appendChild(item);
  });
}

// S-Curve roadmap points generator (draws S path)
function renderRoadmap() {
  const svg = document.getElementById("crew-roadmap-svg");
  const viewport = document.getElementById("crew-roadmap-viewport");

  // Clear old nodes and avatars
  viewport.querySelectorAll(".roadmap-node, .roadmap-avatar").forEach(el => el.remove());

  const points = [
    { x: 60, y: 430, day: 1 },
    { x: 260, y: 365, day: 2 },
    { x: 60, y: 300, day: 3 },
    { x: 260, y: 235, day: 4 },
    { x: 60, y: 170, day: 5 },
    { x: 260, y: 105, day: 6 },
    { x: 160, y: 40, day: 7 }
  ];

  // Draw Path line (Zigzag)
  let pathD = `M ${points[0].x} ${points[0].y} `;
  for (let i = 1; i < points.length; i++) {
    pathD += `L ${points[i].x} ${points[i].y} `;
  }

  svg.innerHTML = `
    <path d="${pathD}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="12" stroke-linecap="round"/>
    <path d="${pathD}" fill="none" stroke="#3b82f6" stroke-width="5" stroke-linecap="round" stroke-dasharray="6 4"/>
  `;

  // Draw nodes
  points.forEach(p => {
    const node = document.createElement("div");
    node.className = `roadmap-node ${p.day <= 5 ? 'active' : ''}`;
    node.style.left = `${p.x}px`;
    node.style.top = `${p.y}px`;
    node.innerText = p.day;
    node.style.cursor = "pointer";

    // Click step node to see who is on it (opens their feed)
    node.addEventListener("click", () => {
      const membersOnThisStep = state.crewMembers.filter(m => Math.min(7, Math.max(1, m.step)) === p.day);
      if (membersOnThisStep.length > 0) {
        const m = membersOnThisStep[0];
        const friend = state.friends.find(f => f.name.includes(m.name)) || {
          name: m.name,
          color: m.color,
          status: "크루원으로 함께 달리는 동료입니다.",
          step: m.step
        };
        showFriendProfile(friend);
      } else {
        showToast(`${p.day}단계 노드입니다. 현재 이곳에 있는 크루원이 없습니다.`, "info");
      }
    });

    viewport.appendChild(node);
  });

  // Position crew avatars along nodes based on their step index (1-7)
  const stepOffsets = {};
  state.crewMembers.forEach(m => {
    const step = Math.min(7, Math.max(1, m.step));
    const targetNode = points[step - 1];

    if (!stepOffsets[step]) stepOffsets[step] = [];
    stepOffsets[step].push(m);
  });

  Object.keys(stepOffsets).forEach(stepKey => {
    const idx = parseInt(stepKey);
    const node = points[idx - 1];
    const membersAtNode = stepOffsets[stepKey];

    membersAtNode.forEach((m, offsetIdx) => {
      const av = document.createElement("div");
      av.className = "roadmap-avatar";
      av.style.background = m.color;
      av.style.cursor = "pointer";

      // Offset multiple avatars slightly so they don't overlap fully
      const offX = (offsetIdx - (membersAtNode.length - 1) / 2) * 22;
      const offY = -28;

      av.style.left = `${node.x + offX}px`;
      av.style.top = `${node.y + offY}px`;
      av.innerText = m.name.substring(0, 2);
      av.title = `${m.name} (${m.role}) - ${m.step}단계`;

      // Click avatar to show profile feed
      av.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid triggering node click
        const friend = state.friends.find(f => f.name.includes(m.name)) || {
          name: m.name,
          color: m.color,
          status: "크루원으로 함께 정복하고 있습니다.",
          step: m.step
        };
        showFriendProfile(friend);
      });

      viewport.appendChild(av);
    });
  });
}

function updateHQBuildingVisual() {
  const iconEl = document.getElementById("hq-building-icon");
  const lvlEl = document.getElementById("lbl-hq-level");
  const titleEl = document.getElementById("lbl-hq-name");
  if (!iconEl || !lvlEl || !titleEl) return;

  const crew = state.crews.find(c => c.id === state.selectedCrewId);
  if (crew) {
    iconEl.className = `hq-building-img fa-solid ${crew.icon}`;
    titleEl.innerText = crew.name;
    const count = state.crewMembers.length;
    lvlEl.innerText = `레벨 ${crew.level} - ${crew.levelName} (인원: ${count}명)`;
  }
}

function renderCrewSelectors() {
  const container = document.getElementById("crew-selector-container");
  if (!container) return;

  container.innerHTML = "";

  state.crews.forEach(crew => {
    const card = document.createElement("div");
    card.className = `crew-select-card ${state.selectedCrewId === crew.id ? 'active' : ''}`;
    card.innerHTML = `
      <i class="fa-solid ${crew.icon}"></i>
      <span>${crew.name}</span>
    `;
    card.addEventListener("click", () => {
      selectCrew(crew.id);
    });
    container.appendChild(card);
  });
}

function selectCrew(crewId) {
  state.selectedCrewId = crewId;
  const crew = state.crews.find(c => c.id === crewId);
  if (crew) {
    state.crewMembers = crew.members;
  }
  saveState();

  renderCrewSelectors();
  renderRoadmap();
  renderCrewGrid();
}

function renderCrewGrid() {
  const container = document.getElementById("crew-members-grid");
  if (!container) return;
  container.innerHTML = "";

  updateHQBuildingVisual();

  const query = (document.getElementById("crew-member-search")?.value || "").trim().toLowerCase();
  const filteredMembers = state.crewMembers.filter(m => m.name.toLowerCase().includes(query));
  const memberCount = filteredMembers.length;

  // Draw 12 cards (3x4 grid) matching the attached wireframe layout
  for (let i = 0; i < 12; i++) {
    const card = document.createElement("div");
    card.className = "journey-card";

    if (i < memberCount) {
      const m = filteredMembers[i];
      card.innerHTML = `
        <div class="journey-card-avatar">
          <i class="fa-regular fa-user"></i>
        </div>
        <div class="journey-card-name">${m.name}</div>
      `;
      // Click filled card to view their profile feed
      card.addEventListener("click", () => {
        const friend = state.friends.find(f => f.name.includes(m.name)) || {
          name: m.name,
          color: m.color,
          status: "크루원으로 함께 달리는 동료입니다.",
          step: m.step
        };
        showFriendProfile(friend);
      });
    } else {
      // Empty slot styled with a bold black plus sign
      card.className = "journey-card empty-slot";
      card.innerHTML = `
        <div class="journey-card-empty">+</div>
      `;
      card.addEventListener("click", () => inviteCrewMemberSlot());
    }
    container.appendChild(card);
  }
}

function inviteCrewMemberSlot() {
  showToast("크루 초대 기능은 활성 멤버 9명 한도까지 확장 가능합니다.", "info");

  // Add a mock member to show building evolution
  if (state.crewMembers.length < 9) {
    const names = ["철수", "영희", "민수", "정은", "지훈"];
    const colors = ["#8b5a2b", "#3b82f6", "#10b981", "#c084fc", "#f43f5e"];
    const randName = names[Math.floor(Math.random() * names.length)];
    const randColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember = {
      name: randName + (state.crewMembers.length + 1),
      step: Math.floor(Math.random() * 5) + 1,
      role: "대원",
      color: randColor
    };

    state.crewMembers.push(newMember);

    const currCrew = state.crews.find(c => c.id === state.selectedCrewId);
    if (currCrew) {
      currCrew.members = state.crewMembers;
    }

    // Also push to friends so their profile feed is accessible
    state.friends.push({
      name: `${newMember.name} (Friend)`,
      status: `오프라인 - 방금 가입함`,
      step: newMember.step,
      color: newMember.color
    });

    saveState();
    renderCrewGrid();
    renderRoadmap();
    showToast(`${newMember.name}님이 크루에 영입되었습니다! 크루 본부가 진화합니다.`, "success");
  } else {
    showToast("크루 정원이 가득 찼습니다 (최대 9명)", "error");
  }
}

// Stage map nodes creation (Skill Tree)
function renderStageMap() {
  const container = document.getElementById("map-nodes-view");
  const svg = document.getElementById("map-svg-connections");

  // Clear nodes, keeping SVG
  container.querySelectorAll(".map-node").forEach(n => n.remove());

  // Set svg dimensions
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.innerHTML = "";

  // Draw connections
  for (let i = 0; i < state.mapNodes.length - 1; i++) {
    const nStart = state.mapNodes[i];
    const nEnd = state.mapNodes[i + 1];

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", `${nStart.x}`);
    line.setAttribute("y1", `${nStart.y}`);
    line.setAttribute("x2", `${nEnd.x}`);
    line.setAttribute("y2", `${nEnd.y}`);

    // Set style depending on node status
    if (nStart.status === "VISITED" && nEnd.status === "VISITED") {
      line.setAttribute("stroke", "var(--color-success)");
      line.setAttribute("stroke-width", "4");
    } else if (nStart.status === "VISITED" && nEnd.status === "CURRENT") {
      line.setAttribute("stroke", "var(--color-primary)");
      line.setAttribute("stroke-width", "4");
    } else {
      line.setAttribute("stroke", "#475569");
      line.setAttribute("stroke-width", "3");
      line.setAttribute("stroke-dasharray", "5,5");
    }
    svg.appendChild(line);
  }

  // Draw node buttons
  state.mapNodes.forEach(node => {
    const el = document.createElement("div");
    el.className = `map-node ${node.status.toLowerCase()}`;
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;

    const icon = node.status === "VISITED" ? "circle-check" : node.status === "CURRENT" ? "fire" : node.status === "ADJACENT_AVAILABLE" ? "lock-open" : "lock";
    el.innerHTML = `
      <i class="fa-solid fa-${icon}"></i>
      <span class="map-node-label">${node.name}</span>
    `;

    if (node.status === "ADJACENT_AVAILABLE") {
      const badge = document.createElement("div");
      badge.className = "map-node-badge";
      badge.innerText = "New";
      el.appendChild(badge);

      el.addEventListener("click", () => enterBridgeGame(node));
    } else if (node.status === "CURRENT" || node.status === "VISITED") {
      el.addEventListener("click", () => showToast(`${node.name}: 탐험 완료한 섬입니다.`, "info"));
    } else {
      el.addEventListener("click", () => showToast(`아직 개척할 수 없는 원거리 섬입니다.`, "error"));
    }

    container.appendChild(el);
  });
}

// Navigation Tab Controls
function setupNavigation() {
  document.getElementById("tab-crew").addEventListener("click", () => {
    switchTab("crew");
  });
  document.getElementById("tab-home").addEventListener("click", () => {
    switchTab("home");
  });
  document.getElementById("tab-mypage").addEventListener("click", () => {
    switchTab("mypage");
  });

  // Crew member grid search input
  const searchInput = document.getElementById("crew-member-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderCrewGrid();
    });
  }

  // Crew page subtabs
  document.getElementById("crew-tab-roadmap").addEventListener("click", () => {
    document.getElementById("crew-tab-roadmap").classList.add("active");
    document.getElementById("crew-tab-grid").classList.remove("active");
    document.getElementById("page-crew-roadmap").classList.add("active");
    document.getElementById("page-crew-grid").classList.remove("active");
    renderRoadmap();
  });

  document.getElementById("crew-tab-grid").addEventListener("click", () => {
    document.getElementById("crew-tab-grid").classList.add("active");
    document.getElementById("crew-tab-roadmap").classList.remove("active");
    document.getElementById("page-crew-grid").classList.add("active");
    document.getElementById("page-crew-roadmap").classList.remove("active");
    renderCrewGrid();
  });

  // Buoy Category Button Click
  const btnBuoy = document.getElementById("btn-buoy-sport");
  if (btnBuoy) {
    btnBuoy.addEventListener("click", () => {
      openModal("modal-buoy-workout");
    });
  }

  // Friends Search Input
  const friendSearchInput = document.getElementById("input-search-friend");
  if (friendSearchInput) {
    friendSearchInput.addEventListener("input", () => {
      renderFriends();
    });
  }
}

function switchTab(tab) {
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
  document.getElementById(`tab-${tab}`).classList.add("active");

  const crewView = document.getElementById("crew-view");
  const mypageView = document.getElementById("mypage-view");

  if (tab === "crew") {
    crewView.classList.add("active");
    mypageView.classList.remove("active");
    renderCrewSelectors();
    renderRoadmap();
    renderCrewGrid();
  } else if (tab === "home") {
    crewView.classList.remove("active");
    mypageView.classList.remove("active");
    resetCamera();
  } else if (tab === "mypage") {
    crewView.classList.remove("active");
    mypageView.classList.add("active");
    renderOwnProfilePage();
  }
}

// ==========================================
// 5. MINI-GAME: BRIDGE BUILDING & PHYSICS
// ==========================================
let gameScene, gameCamera, gameRenderer, gameObjects = [];
let gamePlanksCount = 0;
let gameStones = [];
let selectedMaterial = null; // 'plank' or stoneId
let placedMaterials = []; // { type, x, y, mesh, body(for physics) }
let characterMesh = null;
let targetIslandX = 3.5;
let startIslandX = -3.5;
let simulationInProgress = false;

function enterBridgeGame(targetNode) {
  // Hide stage map modal
  closeModal(document.getElementById("modal-stage-map"));

  // Show Bridge Game Panel
  const overlay = document.getElementById("bridge-game-overlay");
  overlay.classList.add("active");

  // Load Inventory for drawer
  gamePlanksCount = state.woodenPlanks;
  gameStones = JSON.parse(JSON.stringify(state.trackStones));
  renderGameDrawer();

  // Reset attempt count
  document.getElementById("game-attempts-val").innerText = state.remainingBridgeAttempts;

  // Initialize Game 3D Scene
  initGameCanvas();
}

function renderGameDrawer() {
  const container = document.getElementById("game-drawer-items");
  container.innerHTML = "";

  // Wooden Planks
  const plankCard = document.createElement("div");
  plankCard.className = "drawer-card";
  plankCard.setAttribute("data-material", "plank");
  plankCard.innerHTML = `
    <i class="fa-solid fa-cubes drawer-card-icon" style="color:var(--wood-light)"></i>
    <span class="drawer-card-name">나무판자</span>
    <span class="drawer-card-count">${gamePlanksCount}개</span>
  `;
  plankCard.addEventListener("click", () => selectGameMaterial("plank", plankCard));
  container.appendChild(plankCard);

  // GPS Track Stones
  gameStones.forEach((stone, idx) => {
    const shapeIcon = stone.shape === "river-trail" ? "circle" : stone.shape === "mountain-loop" ? "star" : stone.shape === "city-park" ? "square" : "wave-square";
    const card = document.createElement("div");
    card.className = "drawer-card";
    card.setAttribute("data-material", stone.id);
    card.innerHTML = `
      <i class="fa-solid fa-${shapeIcon} drawer-card-icon" style="color:#94a3b8"></i>
      <span class="drawer-card-name">${stone.name}</span>
      <span class="drawer-card-count">${stone.size}x</span>
    `;
    card.addEventListener("click", () => selectGameMaterial(stone.id, card));
    container.appendChild(card);
  });
}

function selectGameMaterial(mat, cardEl) {
  document.querySelectorAll(".drawer-card").forEach(c => c.classList.remove("active"));
  if (selectedMaterial === mat) {
    selectedMaterial = null; // Toggle off
  } else {
    selectedMaterial = mat;
    cardEl.classList.add("active");
  }
}

function initGameCanvas() {
  const container = document.querySelector(".game-canvas-container");
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Clean old renderer if exists
  const oldCanvas = document.getElementById("bridge-canvas");
  const newCanvas = oldCanvas.cloneNode(true);
  oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

  gameScene = new THREE.Scene();
  gameScene.background = new THREE.Color(0x0f172a); // dark blue background

  gameCamera = new THREE.OrthographicCamera(width / -120, width / 120, height / 120, height / -120, 0.1, 100);
  gameCamera.position.set(0, 0, 10);
  gameCamera.lookAt(0, 0, 0);

  gameRenderer = new THREE.WebGLRenderer({ canvas: newCanvas, antialias: true });
  gameRenderer.setSize(width, height);
  gameRenderer.setPixelRatio(window.devicePixelRatio);

  // Clean variables
  placedMaterials = [];
  simulationInProgress = false;

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  gameScene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(2, 5, 4);
  gameScene.add(directional);

  // Left Island (Start)
  const leftIslandGeo = new THREE.BoxGeometry(3, 4, 1);
  const islandMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, flatShading: true });
  const leftIsland = new THREE.Mesh(leftIslandGeo, islandMat);
  leftIsland.position.set(-4.5, -2, 0);
  gameScene.add(leftIsland);

  // Right Island (Target)
  const rightIslandGeo = new THREE.BoxGeometry(3, 4, 1);
  const rightIsland = new THREE.Mesh(rightIslandGeo, islandMat);
  rightIsland.position.set(4.5, -2, 0);
  gameScene.add(rightIsland);

  // Water below
  const waterGeo = new THREE.BoxGeometry(12, 1, 1);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.8 });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(0, -4.5, 0);
  gameScene.add(water);

  // Character Mesh
  const charGroup = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
  body.position.y = 0.25;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
  head.position.y = 0.6;
  charGroup.add(body, head);
  charGroup.position.set(startIslandX, 0, 0); // start position
  gameScene.add(charGroup);
  characterMesh = charGroup;

  // Add click to place on bridge canvas
  newCanvas.addEventListener("click", handleGameCanvasClick);

  // Simple drag-and-drop mechanics (optional / raycast to place)
  // Let's loop
  const gameClock = new THREE.Clock();
  const gameAnimate = () => {
    if (!gameScene) return;
    requestAnimationFrame(gameAnimate);

    // Wave water slightly
    water.position.y = -4.5 + Math.sin(gameClock.getElapsedTime() * 3.0) * 0.05;

    // Simulation loop
    if (simulationInProgress) {
      updatePhysicsSim(gameClock.getDelta());
    }

    gameRenderer.render(gameScene, gameCamera);
  };
  gameAnimate();
}

// Click to place items inside the chasm
function handleGameCanvasClick(e) {
  if (simulationInProgress || !selectedMaterial) return;

  const canvas = document.getElementById("bridge-canvas");
  const rect = canvas.getBoundingClientRect();
  const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  // Unproject coordinate to game camera world space
  const vector = new THREE.Vector3(mouseX, mouseY, 0).unproject(gameCamera);
  vector.z = 0;

  // Bound checks: cannot place inside islands
  if (vector.x < startIslandX + 0.3 || vector.x > targetIslandX - 0.3) {
    showToast("자재는 두 섬 사이의 공중에만 배치할 수 있습니다.", "error");
    return;
  }

  // Handle placement logic
  if (selectedMaterial === "plank") {
    if (gamePlanksCount <= 0) {
      showToast("나무판자가 부족합니다!", "error");
      return;
    }
    gamePlanksCount--;
    placeMaterialMesh("plank", vector.x, vector.y);
  } else {
    // Stone placement
    const stoneIdx = gameStones.findIndex(s => s.id === selectedMaterial);
    if (stoneIdx !== -1) {
      const stone = gameStones[stoneIdx];
      placeMaterialMesh("stone", vector.x, vector.y, stone);
      gameStones.splice(stoneIdx, 1); // remove from temporary drawer
      selectedMaterial = null; // reset
    }
  }

  renderGameDrawer();
}

function placeMaterialMesh(type, x, y, stoneData = null) {
  let geometry, material, mesh;
  const scale = stoneData ? stoneData.size : 1.0;

  if (type === "plank") {
    // Planks are long flat boxes (width: 1.5, height: 0.15)
    geometry = new THREE.BoxGeometry(1.6, 0.2, 0.4);
    material = new THREE.MeshStandardMaterial({ color: 0xc19a6b, flatShading: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    gameScene.add(mesh);

    placedMaterials.push({
      type: "plank",
      x: x,
      y: y,
      w: 1.6,
      h: 0.2,
      mesh: mesh
    });
  } else {
    // Stones are circular/hexagonal shapes depending on GPS path
    // Scale dictates physical properties
    const shapeIcon = stoneData.shape;
    if (shapeIcon === "river-trail") {
      // Loop: thick torus-like rock
      geometry = new THREE.TorusGeometry(0.3 * scale, 0.15 * scale, 6, 12);
    } else if (shapeIcon === "mountain-loop") {
      // Star: jagged knot
      geometry = new THREE.TorusKnotGeometry(0.25 * scale, 0.1 * scale, 16, 3);
    } else {
      // Box/Cylinder shapes
      geometry = new THREE.DodecahedronGeometry(0.4 * scale);
    }

    material = new THREE.MeshStandardMaterial({ color: 0x94a3b8, flatShading: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    mesh.rotation.z = Math.random() * Math.PI; // random angle
    gameScene.add(mesh);

    placedMaterials.push({
      type: "stone",
      id: stoneData.id,
      stoneData: stoneData,
      x: x,
      y: y,
      w: 0.8 * scale, // Bounding collision bounds
      h: 0.8 * scale,
      mesh: mesh
    });
  }
}

// Reset bridge elements
document.getElementById("btn-game-clear").addEventListener("click", () => {
  if (simulationInProgress) return;

  // Return materials to local variables
  placedMaterials.forEach(p => {
    if (p.type === "plank") {
      gamePlanksCount++;
    } else {
      gameStones.push(p.stoneData);
    }
    gameScene.remove(p.mesh);
  });

  placedMaterials = [];
  characterMesh.position.set(startIslandX, 0, 0);
  selectedMaterial = null;
  renderGameDrawer();
  showToast("자재들이 창고로 회수되었습니다.");
});

// Run Physics Simulation
document.getElementById("btn-game-simulate").addEventListener("click", () => {
  if (simulationInProgress) return;

  if (state.remainingBridgeAttempts <= 0) {
    showToast("남은 시도 기회가 없습니다! 자재를 회수하고 재조정하세요.", "error");
    return;
  }

  // Reduce attempt count
  state.remainingBridgeAttempts--;
  document.getElementById("game-attempts-val").innerText = state.remainingBridgeAttempts;
  saveState();

  simulationInProgress = true;
  charVelX = 2.2; // Run speed
  charVelY = 0.0;
});

// Exit game button
document.getElementById("btn-close-game").addEventListener("click", () => {
  // Clean WebGL resources of game canvas
  gameScene = null;
  gameCamera = null;
  gameRenderer = null;

  document.getElementById("bridge-game-overlay").classList.remove("active");
  triggerHutModal("center"); // zoom back to map
});

// Dynamic evaluation loop mapping character coordinates & bounding colliders
let charVelX = 0;
let charVelY = 0;
const gravity = -6.5;

function updatePhysicsSim(dt) {
  if (!characterMesh) return;

  // Max cap frame time
  const step = Math.min(dt, 0.03);

  // Apply horizontal movement
  let cx = characterMesh.position.x;
  let cy = characterMesh.position.y;

  cx += charVelX * step;

  // Apply gravity
  charVelY += gravity * step;
  cy += charVelY * step;

  // Check collision with placed materials
  let onSolidGround = false;
  let surfaceY = -999;

  // Left Island Ground
  if (cx <= startIslandX + 0.5) {
    onSolidGround = true;
    surfaceY = 0;
  }
  // Right Island Ground
  else if (cx >= targetIslandX - 0.5) {
    onSolidGround = true;
    surfaceY = 0;
  }

  // Check collision against placed planks and stones
  placedMaterials.forEach(m => {
    const halfW = m.w / 2;
    const halfH = m.h / 2;

    // Check overlap along X axis
    if (cx >= m.x - halfW && cx <= m.x + halfW) {
      // Check landing overlap along Y axis
      const bottomCharY = cy;
      const topMaterialY = m.y + halfH;

      // Check if character sits on top of this element
      if (bottomCharY >= m.y - halfH - 0.1 && bottomCharY <= topMaterialY + 0.1 && charVelY <= 0) {
        onSolidGround = true;
        if (topMaterialY > surfaceY) {
          surfaceY = topMaterialY;
        }
      }
    }
  });

  if (onSolidGround) {
    cy = surfaceY;
    charVelY = Math.max(0, charVelY); // Cancel downward speed
  }

  characterMesh.position.set(cx, cy, 0);

  // Check Failure (Fell into gorge/water)
  if (cy <= -3.8) {
    simulationInProgress = false;
    showToast("시뮬레이션 실패! 캐릭터가 절벽 아래로 떨어졌습니다.", "error");

    // Animate splash
    gsap.to(characterMesh.scale, {
      x: 0, y: 0, duration: 0.3, onComplete: () => {
        // Reset position
        characterMesh.position.set(startIslandX, 0, 0);
        characterMesh.scale.set(1, 1, 1);
      }
    });
  }

  // Check Success (Landed on target island)
  if (cx >= targetIslandX) {
    simulationInProgress = false;
    showToast("성공! 다리를 안정적으로 건넜습니다! 🎉", "success");

    // Jump animation
    gsap.to(characterMesh.position, { y: 0.8, duration: 0.25, yoyo: true, repeat: 1 });

    // Update map progress state
    // Node 3 (Adjacent) becomes Visited, Node 4 (Locked) becomes Adjacent Available
    state.mapNodes[1].status = "VISITED";
    state.mapNodes[2].status = "CURRENT";
    state.mapNodes[3].status = "ADJACENT_AVAILABLE";

    // Deduct inventory items officially (from global state since game completed)
    state.woodenPlanks = gamePlanksCount;
    state.trackStones = gameStones;
    state.remainingBridgeAttempts = 2; // Restore attempts for next level

    saveState();

    setTimeout(() => {
      // Clean and close game
      gameScene = null;
      document.getElementById("bridge-game-overlay").classList.remove("active");

      // Open stage map to see update
      openModal("modal-stage-map");
      renderStageMap();
    }, 1500);
  }
}

// ==========================================
// 6. INITIALIZATION & BINDINGS
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  // Load HUD
  updateHUD();

  // Initialize Three.js home island
  initThree();
  setupRaycasting();

  // Bind general UI handlers
  setupModalTriggers();
  setupNavigation();

  // Pre-render list datasets
  renderFriends();
  renderHistory();
  renderWarehouse();
  renderCrewSelectors();
  renderRoadmap();
  renderCrewGrid();
  renderStageMap();

  // Setup Photo Verification drag/drop click logs
  const dropzone = document.getElementById("history-dropzone");
  const fileInput = document.getElementById("history-file-input");

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => handleManualPhotoUpload());

  document.getElementById("btn-submit-manual-log").addEventListener("click", () => {
    const uploadSelect = document.getElementById("select-upload-workout-type");
    const selectedWorkoutVal = uploadSelect.value;

    // Add logged workout
    let duration = 30;
    let intensity = "MODERATE";
    let met = MET_VALUES[selectedWorkoutVal][intensity];

    if (selectedWorkoutVal === "INDOOR") {
      duration = 45; intensity = "HIGH"; met = MET_VALUES[selectedWorkoutVal][intensity];
    } else if (selectedWorkoutVal === "OUTDOOR") {
      duration = 60; intensity = "LOW"; met = MET_VALUES[selectedWorkoutVal][intensity];
    }

    const points = Math.round(met * duration * 0.5);
    const dateStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newLog = {
      id: "hist-manual-" + Date.now(),
      type: selectedWorkoutVal,
      intensity: intensity,
      duration: duration,
      met: met,
      points: points,
      date: dateStr,
      photo: "photo-verified.jpg" // Simulated photo string
    };

    state.history.unshift(newLog);
    state.fitnessPoints += points;
    saveState();

    showToast("오운완 사진 인증 및 기록 등록이 완료되었습니다!", "success");
    closeModal(document.getElementById("modal-history-list"));
    renderHistory();
    renderWarehouse();
  });
});

function handleManualPhotoUpload() {
  const dropzone = document.getElementById("history-dropzone");
  dropzone.style.borderColor = "var(--color-success)";
  dropzone.style.background = "rgba(16, 185, 129, 0.05)";
  dropzone.querySelector("span").innerText = "사진이 업로드되었습니다! (photo-verified.jpg)";
  dropzone.querySelector("p").innerText = "인증을 완료하려면 아래 저장 버튼을 클릭하세요.";
}
