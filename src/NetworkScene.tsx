import { Billboard, Line, OrbitControls, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

export type NodeKey = 'giffits' | 'products' | 'pricing' | 'finishing';
export type Language = 'en' | 'de';
export type SlideKey = 'overview' | 'protocol' | 'pricing' | 'takeaways';
export type HouseId = 'gateway' | 'catalog' | 'inventory' | 'profiles' | 'pricing' | 'discounts' | 'currency' | 'finishing' | 'production';

export interface HouseInfo {
  id: HouseId;
  node: NodeKey;
  en: { name: string; purpose: string };
  de: { name: string; purpose: string };
  tools: [string, string];
  accent: string;
  position: [number, number, number];
  height: number;
  size: [number, number];
}

export const houseCatalog: HouseInfo[] = [
  { id: 'gateway', node: 'giffits', en: { name: 'Giffits · Symfony Gateway', purpose: 'The shop integration routes each request to the server that owns the capability.' }, de: { name: 'Giffits · Symfony-Gateway', purpose: 'Die Shop-Integration leitet jede Anfrage an den Server weiter, der die jeweilige Fähigkeit verwaltet.' }, tools: ['shop.context', 'customer.session'], accent: '#f3bd5d', position: [0, 0, 0], height: 2.2, size: [2.1, 1.75] },
  { id: 'catalog', node: 'products', en: { name: 'Product Data', purpose: 'Search the catalog and read the canonical product and variant data.' }, de: { name: 'Produktdaten', purpose: 'Katalog durchsuchen und maßgebliche Produkt- und Variantendaten lesen.' }, tools: ['catalog.search', 'product.get'], accent: '#39d8ff', position: [-4.3, 0, -3.4], height: 1.9, size: [1.9, 1.65] },
  { id: 'inventory', node: 'products', en: { name: 'Inventory', purpose: 'Check stock, lead times and whether a requested quantity can be fulfilled.' }, de: { name: 'Lagerbestand', purpose: 'Bestand und Lieferzeiten prüfen und feststellen, ob die gewünschte Menge lieferbar ist.' }, tools: ['stock.check', 'availability.read'], accent: '#f3bd5d', position: [0.1, 0, -5.6], height: 1.55, size: [1.8, 1.55] },
  { id: 'profiles', node: 'products', en: { name: 'Customer Profiles', purpose: 'Resolve an approved customer context and its contract-specific catalog view.' }, de: { name: 'Kundenprofile', purpose: 'Freigegebenen Kundenkontext und den passenden Vertragssortiment-Ausschnitt ermitteln.' }, tools: ['customer.profile', 'catalog.segment'], accent: '#39d8ff', position: [-7.2, 0, 0.4], height: 1.7, size: [1.7, 1.55] },
  { id: 'pricing', node: 'pricing', en: { name: 'Price Engine', purpose: 'Calculate a quote from SKU, quantity, currency and the shop’s pricing rules.' }, de: { name: 'Preis-Engine', purpose: 'Ein Angebot aus SKU, Menge, Währung und den Preisregeln des Shops berechnen.' }, tools: ['price.quote', 'price.breakdown'], accent: '#48e7b0', position: [4.2, 0, -3.2], height: 2.25, size: [2, 1.7] },
  { id: 'discounts', node: 'pricing', en: { name: 'Discount Logic', purpose: 'Explain volume tiers, contract discounts, tax and price constraints.' }, de: { name: 'Rabattlogik', purpose: 'Mengenstaffeln, Vertragsrabatte, Steuern und Preisgrenzen erklären.' }, tools: ['discount.check', 'tax.calculate'], accent: '#48e7b0', position: [7.1, 0, 0.5], height: 1.75, size: [1.8, 1.6] },
  { id: 'currency', node: 'pricing', en: { name: 'Currency Matrix', purpose: 'Convert a quote to a supported currency using the configured rate source.' }, de: { name: 'Währungsmatrix', purpose: 'Angebote mit der konfigurierten Kursquelle in eine unterstützte Währung umrechnen.' }, tools: ['currency.convert', 'currency.list'], accent: '#f3bd5d', position: [5.8, 0, 4], height: 1.45, size: [1.75, 1.55] },
  { id: 'finishing', node: 'finishing', en: { name: 'Finishing Options', purpose: 'Find print techniques, color limits and placement options for a product.' }, de: { name: 'Veredelungsoptionen', purpose: 'Druckverfahren, Farbgrenzen und Positionen für ein Produkt ermitteln.' }, tools: ['finish.options', 'logo.preview'], accent: '#ce84ff', position: [0, 0, 5.3], height: 2.1, size: [2.1, 1.7] },
  { id: 'production', node: 'finishing', en: { name: 'Production Check', purpose: 'Validate artwork and production constraints before an order is submitted.' }, de: { name: 'Produktionsprüfung', purpose: 'Druckdaten und Produktionsbedingungen vor der Bestellung validieren.' }, tools: ['artwork.validate', 'production.check'], accent: '#ce84ff', position: [-3.5, 0, 6.8], height: 1.6, size: [1.8, 1.55] },
];

const seedRandom = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

function Skyline() {
  const towers = useMemo(() => {
    const random = seedRandom(9341);
    return Array.from({ length: 116 }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const radius = 11 + random() * 17;
      const width = 0.55 + random() * 1.3;
      const depth = 0.55 + random() * 1.1;
      const height = 1.5 + random() * (index < 20 ? 5.2 : 3.4);
      return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, width, depth, height, hue: random() };
    });
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const towerRef = useRef<THREE.InstancedMesh>(null);
  const windowRef = useRef<THREE.InstancedMesh>(null);
  const windows = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const random = seedRandom(2419);
    for (const tower of towers) {
      for (let floor = 0.45; floor < tower.height - 0.25; floor += 0.42) {
        for (const side of [-1, 1]) {
          if (random() > 0.79) continue;
          dummy.position.set(tower.x + side * tower.width * 0.23, floor, tower.z + tower.depth / 2 + 0.012);
          dummy.scale.set(tower.width * 0.11, 0.11, 0.012);
          dummy.updateMatrix();
          matrices.push(dummy.matrix.clone());
          colors.push(new THREE.Color(tower.hue > 0.72 ? '#ffcc70' : tower.hue > 0.34 ? '#54e8ff' : '#9c84ff'));
        }
      }
    }
    return { matrices, colors };
  }, [dummy, towers]);
  useEffect(() => {
    if (!towerRef.current || !windowRef.current) return;
    towers.forEach((tower, index) => {
      dummy.position.set(tower.x, tower.height / 2, tower.z);
      dummy.scale.set(tower.width, tower.height, tower.depth);
      dummy.updateMatrix();
      towerRef.current?.setMatrixAt(index, dummy.matrix);
    });
    windows.matrices.forEach((matrix, index) => {
      windowRef.current?.setMatrixAt(index, matrix);
      windowRef.current?.setColorAt(index, windows.colors[index]!);
    });
    towerRef.current.instanceMatrix.needsUpdate = true;
    windowRef.current.instanceMatrix.needsUpdate = true;
    if (windowRef.current.instanceColor) windowRef.current.instanceColor.needsUpdate = true;
  }, [dummy, towers, windows]);
  return <group>
    <instancedMesh ref={towerRef} args={[undefined, undefined, towers.length]}>
      <boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#101a2c" metalness={0.4} roughness={0.74} />
    </instancedMesh>
    <instancedMesh ref={windowRef} args={[undefined, undefined, windows.matrices.length]}>
      <boxGeometry args={[1, 1, 1]} /><meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  </group>;
}

function CityFloor() {
  const roadXs = [-10, -7, -1.7, 1.7, 7, 10];
  const roadZs = [-9, -6.5, -1.5, 1.5, 6.5, 9];
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
      <planeGeometry args={[68, 68]} /><meshStandardMaterial color="#080f1d" metalness={0.38} roughness={0.9} />
    </mesh>
    <gridHelper args={[68, 68, '#24405a', '#17273a']} position={[0, -0.105, 0]} />
    {roadXs.map((x) => <group key={`x-${x}`}>
      <mesh position={[x, -0.095, 0]}><boxGeometry args={[x === 0 ? 2.6 : 1.35, 0.025, 68]} /><meshStandardMaterial color="#0d1726" roughness={0.9} /></mesh>
      {x === 0 && <Line points={[[x, -0.075, -30], [x, -0.075, 30]]} color="#9470d8" transparent opacity={0.38} lineWidth={1.1} />}
    </group>)}
    {roadZs.map((z) => <group key={`z-${z}`}>
      <mesh position={[0, -0.09, z]}><boxGeometry args={[68, 0.025, z === 0 ? 2.6 : 1.35]} /><meshStandardMaterial color="#0d1726" roughness={0.9} /></mesh>
      {z === 0 && <Line points={[[-30, -0.07, z], [30, -0.07, z]]} color="#39d8ff" transparent opacity={0.28} lineWidth={1.1} />}
    </group>)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
      <planeGeometry args={[68, 68]} /><meshBasicMaterial color="#17314a" wireframe transparent opacity={0.12} />
    </mesh>
  </group>;
}

function House({ info, language, selected, showLabels, onSelect }: { info: HouseInfo; language: Language; selected: boolean; showLabels: boolean; onSelect: (house: HouseInfo) => void }) {
  const [width, depth] = info.size;
  const title = info[language].name;
  return <group position={info.position} onClick={(event) => { event.stopPropagation(); onSelect(info); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
    <mesh position={[0, 0.11, 0]}>
      <boxGeometry args={[width + 0.6, 0.22, depth + 0.55]} />
      <meshStandardMaterial color="#111c2b" metalness={0.62} roughness={0.35} emissive={info.accent} emissiveIntensity={selected ? 0.14 : 0.035} />
    </mesh>
    <mesh position={[0, info.height / 2 + 0.22, 0]}>
      <boxGeometry args={[width, info.height, depth]} />
      <meshStandardMaterial color="#0c1525" metalness={0.5} roughness={0.32} emissive={info.accent} emissiveIntensity={selected ? 0.1 : 0.025} />
    </mesh>
    <mesh position={[0, info.height / 2 + 0.22, depth / 2 + 0.012]}>
      <boxGeometry args={[width * 0.78, info.height * 0.64, 0.018]} />
      <meshBasicMaterial color="#101c2d" toneMapped={false} />
    </mesh>
    <mesh position={[0, info.height / 2 + 0.22, depth / 2 + 0.025]}>
      <boxGeometry args={[width * 0.78, info.height * 0.64, 0.025]} />
      <meshBasicMaterial color={info.accent} wireframe transparent opacity={selected ? 0.95 : 0.54} toneMapped={false} />
    </mesh>
    <mesh position={[0, info.height + 0.34, 0]}>
      <boxGeometry args={[width + 0.28, 0.1, depth + 0.28]} />
      <meshStandardMaterial color="#1a273a" metalness={0.65} roughness={0.32} emissive={info.accent} emissiveIntensity={selected ? 0.34 : 0.11} />
    </mesh>
    <Line points={[[-width * 0.37, 0.35, depth / 2 + 0.05], [width * 0.37, 0.35, depth / 2 + 0.05]]} color={info.accent} transparent opacity={0.8} lineWidth={selected ? 2.2 : 1.35} />
    {showLabels && <Billboard position={[0, info.height + 0.92, 0]}>
      <Text fontSize={0.22} color={info.accent} anchorX="center" anchorY="middle" outlineWidth={0.018} outlineColor="#07101b" letterSpacing={0.025} maxWidth={4}>{title.toUpperCase()}</Text>
      <Text position={[0, -0.26, 0]} fontSize={0.105} color="#d3dced" anchorX="center" anchorY="middle" outlineWidth={0.011} outlineColor="#07101b" letterSpacing={0.015}>{`MCP · ${info.tools[0]} · ${info.tools[1]}`}</Text>
    </Billboard>}
    <mesh position={[0, info.height / 2 + 0.22, depth / 2 + 0.04]}>
      <boxGeometry args={[width * 0.34, 0.055, 0.035]} />
      <meshBasicMaterial color={info.accent} toneMapped={false} />
    </mesh>
  </group>;
}

function Traffic() {
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const routes = useMemo(() => houseCatalog.filter((house) => house.id !== 'gateway').map((house) => {
    const start = new THREE.Vector3(0, 0.12, 0);
    const end = new THREE.Vector3(house.position[0], 0.12, house.position[2]);
    return { id: house.id, color: house.accent, curve: new THREE.QuadraticBezierCurve3(start, new THREE.Vector3(end.x * 0.48, 0.28, end.z * 0.48), end) };
  }), []);
  useFrame(({ clock }) => {
    routes.forEach((route, index) => {
      if (packets.current[index]) packets.current[index]!.position.copy(route.curve.getPoint((clock.elapsedTime * 0.11 + index * 0.19) % 1));
    });
  });
  return <group>{routes.map((route, index) => <group key={route.id}>
    <Line points={route.curve.getPoints(38)} color={route.color} transparent opacity={0.44} lineWidth={1.15} />
    <mesh ref={(element) => { packets.current[index] = element; }}>
      <sphereGeometry args={[0.09, 10, 10]} /><meshBasicMaterial color={route.color} toneMapped={false} />
    </mesh>
  </group>)}</group>;
}

function FlightKeys({ controlsRef }: { controlsRef: RefObject<OrbitControlsImpl | null> }) {
  const { camera, gl } = useThree();
  const pressed = useRef(new Set<string>());
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.tabIndex = 0;
    const keydown = (event: KeyboardEvent) => {
      if (document.activeElement !== canvas) return;
      const key = event.key.toLowerCase();
      if (!['w', 'a', 's', 'd', 'q', 'e', 'shift'].includes(key)) return;
      event.preventDefault();
      pressed.current.add(key);
      const controls = controlsRef.current;
      if (!controls || key === 'shift') return;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
      const step = new THREE.Vector3();
      if (key === 'w') step.add(direction);
      if (key === 's') step.sub(direction);
      if (key === 'd') step.add(right);
      if (key === 'a') step.sub(right);
      if (key === 'e') step.y += 1;
      if (key === 'q') step.y -= 1;
      camera.position.add(step.normalize().multiplyScalar(event.shiftKey ? 1.4 : 0.75));
      controls.target.add(step);
      controls.update();
    };
    const keyup = (event: KeyboardEvent) => pressed.current.delete(event.key.toLowerCase());
    const clear = () => pressed.current.clear();
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', clear);
    };
  }, [camera, controlsRef, gl]);
  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || pressed.current.size === 0) return;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
    const movement = new THREE.Vector3();
    if (pressed.current.has('w')) movement.add(direction);
    if (pressed.current.has('s')) movement.sub(direction);
    if (pressed.current.has('d')) movement.add(right);
    if (pressed.current.has('a')) movement.sub(right);
    if (pressed.current.has('e')) movement.y += 1;
    if (pressed.current.has('q')) movement.y -= 1;
    if (movement.lengthSq() === 0) return;
    const speed = (pressed.current.has('shift') ? 12 : 6) * Math.min(delta, 0.05);
    movement.normalize().multiplyScalar(speed);
    camera.position.add(movement);
    controls.target.add(movement);
    controls.update();
  });
  return null;
}

export interface NetworkSceneProps {
  onSelect: (node: NodeKey) => void;
  motionOn: boolean;
  activeSlide: SlideKey;
  language: Language;
  selectedHouse: HouseId;
  onSelectHouse: (house: HouseInfo) => void;
}

export default function NetworkScene({ onSelect, motionOn, activeSlide, language, selectedHouse, onSelectHouse }: NetworkSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [focusedHouse, setFocusedHouse] = useState<HouseId | null>(null);
  const cameraPosition = useMemo(() => new THREE.Vector3(0, 15, 23), []);
  const focusPoint = useMemo(() => new THREE.Vector3(0, 0.25, 0), []);
  const selectedInfo = houseCatalog.find((house) => house.id === selectedHouse);
  const chooseHouse = (house: HouseInfo) => {
    setFocusedHouse(house.id);
    onSelectHouse(house);
    onSelect(house.node);
    const controls = controlsRef.current;
    if (!controls) return;
    const destination = new THREE.Vector3(house.position[0], 0.7, house.position[2]);
    const offset = cameraPosition.clone().sub(controls.target).normalize().multiplyScalar(9);
    controls.target.copy(destination);
    cameraPosition.copy(destination).add(offset);
    controls.object.position.copy(cameraPosition);
    controls.update();
  };
  return <>
    <color attach="background" args={['#070c17']} />
    <fog attach="fog" args={['#070c17', 34, 72]} />
    <ambientLight intensity={0.72} />
    <hemisphereLight args={['#99b8dc', '#10141e', 0.8]} />
    <directionalLight position={[-8, 19, 8]} intensity={1.15} color="#b1d7ff" />
    <pointLight position={[0, 5, 0]} intensity={26} distance={17} color="#56dfff" />
    <pointLight position={[5, 4, 1]} intensity={16} distance={12} color="#49efb2" />
    <Skyline />
    <CityFloor />
    <Traffic />
    {houseCatalog.map((house) => <House key={house.id} info={house} language={language} selected={selectedHouse === house.id} showLabels={focusedHouse === null || focusedHouse === house.id} onSelect={chooseHouse} />)}
    {selectedInfo && activeSlide === 'pricing' && <group position={[selectedInfo.position[0], selectedInfo.height + 1.25, selectedInfo.position[2]]}>
      <mesh><sphereGeometry args={[1.05, 24, 24]} /><meshBasicMaterial color={selectedInfo.accent} wireframe transparent opacity={0.08} /></mesh>
    </group>}
    <OrbitControls ref={controlsRef} makeDefault enablePan enableDamping dampingFactor={0.08} minDistance={3.4} maxDistance={34} minPolarAngle={0.12} maxPolarAngle={Math.PI / 2.08} target={focusPoint} autoRotate={false} onEnd={() => setFocusedHouse(null)} />
    <FlightKeys controlsRef={controlsRef} />
  </>;
}
