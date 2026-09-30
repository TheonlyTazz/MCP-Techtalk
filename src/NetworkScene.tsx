import { Billboard, Float, Line, OrbitControls, RoundedBox, Stars, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export type NodeKey = 'giffits' | 'products' | 'pricing' | 'finishing';
export type Language = 'en' | 'de';
export type SlideKey = 'overview' | 'protocol' | 'pricing' | 'takeaways';

export const nodeMeta: Record<NodeKey, { color: string; accent: string; position: [number, number, number]; toolsKey: 'productTools' | 'priceTools' | 'finishTools' }> = {
  giffits: { color: '#f4a4ff', accent: '#e959ff', position: [0, 0.15, 0.25], toolsKey: 'productTools' },
  products: { color: '#69eaff', accent: '#30b8ff', position: [-3.12, 1.4, 0.1], toolsKey: 'productTools' },
  pricing: { color: '#81ffd4', accent: '#30e6a1', position: [3.08, 1.35, -0.2], toolsKey: 'priceTools' },
  finishing: { color: '#d0a0ff', accent: '#a968ff', position: [0, -1.56, 0.3], toolsKey: 'finishTools' },
};

const satKeys: NodeKey[] = ['products', 'pricing', 'finishing'];
type NodePositions = Record<NodeKey, [number, number, number]>;
const box = new THREE.BoxGeometry(1, 1, 1);
const octa = new THREE.OctahedronGeometry(1, 1);
const cyl = new THREE.CylinderGeometry(1, 1, 1, 32);

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function Cityscape({ motionOn }: { motionOn: boolean }) {
  const buildings = useRef<THREE.InstancedMesh>(null);
  const windows = useRef<THREE.InstancedMesh>(null);
  const windowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const count = 52;
  const data = useMemo(() => {
    const random = seeded(7357);
    const list = Array.from({ length: count }, (_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const x = side * (4.1 + random() * 5.5);
      const z = -3.5 - random() * 7;
      const width = 0.3 + random() * 0.8;
      const height = 0.55 + random() * (index < 12 ? 2.4 : 1.1);
      const depth = 0.28 + random() * 0.7;
      return { x, z, width, height, depth, hue: random() };
    });
    const dummy = new THREE.Object3D();
    const buildingMatrices: THREE.Matrix4[] = [];
    const windowMatrices: THREE.Matrix4[] = [];
    const windowColors: THREE.Color[] = [];
    for (const item of list) {
      dummy.position.set(item.x, -2.2 + item.height / 2, item.z);
      dummy.scale.set(item.width, item.height, item.depth);
      dummy.updateMatrix();
      buildingMatrices.push(dummy.matrix.clone());
      for (let y = 0.18; y < item.height - 0.12; y += 0.22) {
        for (let xOffset = -0.32; xOffset <= 0.33; xOffset += 0.32) {
          if (random() < 0.36) continue;
          dummy.position.set(item.x + xOffset * item.width, -2.2 + y, item.z + item.depth / 2 + 0.012);
          dummy.scale.set(item.width * 0.12, 0.045, 0.012);
          dummy.updateMatrix();
          windowMatrices.push(dummy.matrix.clone());
          windowColors.push(new THREE.Color(item.hue < 0.46 ? '#42cfff' : item.hue < 0.78 ? '#b877ff' : '#ffb774'));
        }
      }
    }
    return { buildingMatrices, windowMatrices, windowColors };
  }, []);
  useLayoutEffect(() => {
    if (!buildings.current || !windows.current) return;
    data.buildingMatrices.forEach((matrix, index) => buildings.current?.setMatrixAt(index, matrix));
    data.windowMatrices.forEach((matrix, index) => {
      windows.current?.setMatrixAt(index, matrix);
      windows.current?.setColorAt(index, data.windowColors[index]!);
    });
    if (buildings.current) buildings.current.instanceMatrix.needsUpdate = true;
    if (windows.current) {
      windows.current.instanceMatrix.needsUpdate = true;
      if (windows.current.instanceColor) windows.current.instanceColor.needsUpdate = true;
    }
  }, [data]);
  useFrame(({ clock }) => {
    if (windowMaterial.current && motionOn) windowMaterial.current.opacity = 0.76 + Math.sin(clock.elapsedTime * 0.6) * 0.08;
  });
  return <group>
    <instancedMesh ref={buildings} args={[box, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial color="#0a1328" metalness={0.72} roughness={0.48} />
    </instancedMesh>
    <instancedMesh ref={windows} args={[box, undefined, data.windowMatrices.length]} frustumCulled={false}>
      <meshBasicMaterial ref={windowMaterial} color="#87b8ff" transparent opacity={0.8} toneMapped={false} />
    </instancedMesh>
    <Line points={[[-9.8, -2.22, -3], [-5, -2.22, -3], [0, -2.22, -3], [5, -2.22, -3], [9.8, -2.22, -3]]} color="#2f7eaf" opacity={0.4} transparent lineWidth={1.1} />
    <gridHelper args={[25, 45, '#1a3b60', '#101d36']} position={[0, -2.24, -2]} />
  </group>;
}

function Satellite({ node, selected, onSelect, motionOn, language, position }: { node: NodeKey; selected: boolean; onSelect: (node: NodeKey) => void; motionOn: boolean; language: Language; position: [number, number, number] }) {
  const root = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const { color, accent } = nodeMeta[node];
  const scale = selected ? 0.74 : 0.68;
  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    const emphasis = selected ? 1.04 : 0.98;
    const targetScale = scale * emphasis;
    root.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-delta * 4));
    if (motionOn) {
      root.current.rotation.y = Math.sin(clock.elapsedTime * 0.25 + position[0]) * 0.08;
      root.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.035;
      if (ring.current) ring.current.rotation.z = clock.elapsedTime * (selected ? 0.3 : 0.12);
    }
  });
  const isPricing = node === 'pricing';
  const isProducts = node === 'products';
  return <group ref={root} position={position} onClick={(event) => { event.stopPropagation(); onSelect(node); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
    <mesh position={[0, -0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.5, 0.56, 0.12, 8]} />
      <meshStandardMaterial color="#111b33" metalness={0.8} roughness={0.28} emissive={accent} emissiveIntensity={0.14} />
    </mesh>
    <mesh ref={ring} position={[0, -0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.53, 0.018, 8, 64]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
    <mesh position={[0, -0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.39, 0.008, 6, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
    <mesh position={[0, 0.02, 0]}>
      <boxGeometry args={[0.72, 0.62, 0.72]} />
      <meshStandardMaterial color="#101a31" metalness={0.86} roughness={0.22} emissive={accent} emissiveIntensity={selected ? 0.26 : 0.1} />
    </mesh>
    <mesh position={[0, 0.02, 0.37]}>
      <planeGeometry args={[0.52, 0.4]} />
      <meshBasicMaterial color="#061024" transparent opacity={0.93} />
    </mesh>
    <mesh position={[0, 0.03, 0.385]}>
      <planeGeometry args={[0.36, 0.03]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
    <mesh position={[0, -0.1, 0.385]}>
      <planeGeometry args={[0.34, 0.09]} />
      <meshBasicMaterial color={accent} transparent opacity={0.76} toneMapped={false} />
    </mesh>
    <mesh position={[-0.13, 0.03, 0.4]}>
      <sphereGeometry args={[0.037, 10, 10]} />
      <meshBasicMaterial color="#f5faff" toneMapped={false} />
    </mesh>
    {isProducts && <group>
      {[[-0.2, 0.56, 0], [0.19, 0.56, -0.04], [0, 0.88, 0.02]].map(([x, y, z], i) => <RoundedBox key={i} args={[0.32, 0.28, 0.32]} radius={0.035} smoothness={2} position={[x!, y!, z!]} rotation={[0.12, i * 0.3, 0]}>
        <meshStandardMaterial color={i === 1 ? '#0c314a' : '#12314b'} metalness={0.56} roughness={0.3} emissive={accent} emissiveIntensity={0.48} />
      </RoundedBox>)}
      <mesh position={[0, 1.12, 0]}><octahedronGeometry args={[0.13, 0]} /><meshBasicMaterial color={color} wireframe toneMapped={false} /></mesh>
    </group>}
    {isPricing && <group>
      {[0, 1, 2].map((index) => <mesh key={index} position={[(index - 1) * 0.3, 0.62 + (index === 1 ? 0.16 : 0), 0]} rotation={[0.18, 0.16, index * 0.07]}>
        <cylinderGeometry args={[0.16, 0.19, 0.3, 6]} />
        <meshStandardMaterial color="#123d36" metalness={0.72} roughness={0.24} emissive={accent} emissiveIntensity={0.38} />
      </mesh>)}
      <mesh position={[0, 1.05, 0]}><torusGeometry args={[0.22, 0.026, 8, 32]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    </group>}
    {!isProducts && !isPricing && <group>
      {[-0.23, 0, 0.23].map((x, index) => <group key={index} position={[x, 0.68, 0]} rotation={[0.08, index * 0.18, (index - 1) * 0.12]}>
        <RoundedBox args={[0.17, 0.5, 0.27]} radius={0.025} smoothness={2}>
          <meshStandardMaterial color="#291d46" metalness={0.62} roughness={0.28} emissive={accent} emissiveIntensity={0.44} />
        </RoundedBox>
        <mesh position={[0, 0, 0.14]}><planeGeometry args={[0.08, 0.27]} /><meshBasicMaterial color={color} transparent opacity={0.65} toneMapped={false} /></mesh>
      </group>)}
      <mesh position={[0, 1.1, 0]}><octahedronGeometry args={[0.13, 0]} /><meshBasicMaterial color={color} wireframe toneMapped={false} /></mesh>
    </group>}
    <mesh position={[0, 0.04, -0.49]} rotation={[0.2, 0, 0]}>
      <cylinderGeometry args={[0.06, 0.08, 0.52, 8]} />
      <meshStandardMaterial color="#152744" metalness={0.8} roughness={0.25} emissive={accent} emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[0, 0.32, -0.49]}>
      <sphereGeometry args={[0.1, 10, 10]} />
      <meshBasicMaterial color={color} wireframe toneMapped={false} />
    </mesh>
    <mesh position={[0, 0.12, 0]} scale={selected ? 1.55 : 1.28}>
      <sphereGeometry args={[0.54, 24, 24]} />
      <meshBasicMaterial color={accent} transparent opacity={selected ? 0.065 : 0.025} depthWrite={false} />
    </mesh>
    <Billboard position={[0, -0.86, 0]}>
      <Text fontSize={0.15} color={color} anchorX="center" anchorY="middle" letterSpacing={0.09} outlineWidth={0.012} outlineColor="#07101d">{language === 'en' ? node === 'products' ? 'PRODUCT DATA' : isPricing ? 'PRICE ENGINE' : 'FINISHING' : node === 'products' ? 'PRODUKTDATEN' : isPricing ? 'PREIS-ENGINE' : 'VEREDELUNG'}</Text>
    </Billboard>
    <Billboard position={[0, -1.12, 0]}>
      <Text fontSize={0.085} color="#93a2c3" anchorX="center" anchorY="middle" letterSpacing={0.12}>{language === 'en' ? `MCP SERVER · ${selected ? 'CONNECTED' : 'ONLINE'}` : `MCP-SERVER · ${selected ? 'VERBUNDEN' : 'ONLINE'}`}</Text>
    </Billboard>
  </group>;
}

function CoreHub({ selected, onSelect, motionOn, language }: { selected: boolean; onSelect: (node: NodeKey) => void; motionOn: boolean; language: Language }) {
  const core = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, delta) => {
    if (core.current) {
      core.current.rotation.y += (motionOn ? 0.004 : 0) * delta * 60;
      core.current.scale.lerp(new THREE.Vector3(selected ? 1.12 : 1, selected ? 1.12 : 1, selected ? 1.12 : 1), 1 - Math.exp(-delta * 3));
    }
    if (motionOn) {
      if (ringA.current) ringA.current.rotation.z = clock.elapsedTime * 0.25;
      if (ringB.current) ringB.current.rotation.x = Math.PI / 2 + Math.sin(clock.elapsedTime * 0.34) * 0.18;
    }
  });
  return <group onClick={(event) => { event.stopPropagation(); onSelect('giffits'); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
    <group position={[0, -0.28, 0]}>
      <mesh position={[0, -0.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.56, 0.62, 0.12, 16]} />
        <meshStandardMaterial color="#11182b" metalness={0.82} roughness={0.3} emissive="#5140a1" emissiveIntensity={0.07} />
      </mesh>
      <mesh position={[0, -0.435, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.53, 0.014, 8, 72]} /><meshBasicMaterial color="#bb86ff" toneMapped={false} /></mesh>
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.39, 0.008, 6, 64]} /><meshBasicMaterial color="#4ae5ff" transparent opacity={0.7} toneMapped={false} /></mesh>
      {Array.from({ length: 12 }, (_, index) => {
        const angle = index / 12 * Math.PI * 2;
        return <mesh key={index} position={[Math.cos(angle) * 0.48, -0.42, Math.sin(angle) * 0.48]}>
          <boxGeometry args={[0.14, 0.035, 0.05]} />
          <meshBasicMaterial color={index % 3 === 0 ? '#f4a4ff' : '#47cfff'} toneMapped={false} />
        </mesh>;
      })}
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.16, 0.26, 0.57, 8]} /><meshStandardMaterial color="#28345b" metalness={0.75} roughness={0.22} emissive="#805bff" emissiveIntensity={0.7} /></mesh>
      <group ref={core} position={[0, 0.47, 0]}>
        <mesh><icosahedronGeometry args={[0.48, 2]} /><meshStandardMaterial color="#f1a7ff" emissive="#ad4eff" emissiveIntensity={0.6} wireframe transparent opacity={0.86} /></mesh>
        <mesh><icosahedronGeometry args={[0.3, 1]} /><meshBasicMaterial color="#73ddff" wireframe transparent opacity={0.74} /></mesh>
        <mesh><sphereGeometry args={[0.23, 24, 24]} /><meshBasicMaterial color="#83cfff" transparent opacity={0.2} /></mesh>
        <mesh ref={ringA} rotation={[1.2, 0.35, 0]}><torusGeometry args={[0.69, 0.014, 6, 72]} /><meshBasicMaterial color="#63e7ff" toneMapped={false} /></mesh>
        <mesh ref={ringB} rotation={[Math.PI / 2, 0.2, 0]}><torusGeometry args={[0.58, 0.009, 6, 64]} /><meshBasicMaterial color="#e195ff" transparent opacity={0.84} /></mesh>
        <mesh position={[0, 0, 0]}><sphereGeometry args={[0.075, 16, 16]} /><meshBasicMaterial color="#fff6ff" toneMapped={false} /></mesh>
      </group>
    </group>
    <Billboard position={[0, -1.02, 0]}>
      <Text fontSize={0.12} color="#f0c7ff" anchorX="center" anchorY="middle" letterSpacing={0.1} outlineWidth={0.015} outlineColor="#07101d">{language === 'en' ? 'GIFFITS · MCP GATEWAY' : 'GIFFITS · MCP-GATEWAY'}</Text>
    </Billboard>
  </group>;
}

function DataLinks({ motionOn, selected, positions }: { motionOn: boolean; selected: NodeKey; positions: NodePositions }) {
  const particles = useRef<(THREE.Mesh | null)[]>([]);
  const trails = useRef<(THREE.Mesh | null)[]>([]);
  const curves = useMemo(() => satKeys.map((node, index) => {
    const end = new THREE.Vector3(...positions[node]);
    const start = new THREE.Vector3(0, -0.05, 0);
    const offset = index === 0 ? -0.12 : index === 1 ? 0.12 : 0;
    const control = new THREE.Vector3(end.x * 0.52 + offset, end.y * 0.45 + 0.38, -0.05);
    const request = new THREE.QuadraticBezierCurve3(start, control, end);
    const reverseControl = new THREE.Vector3(control.x, control.y + 0.11, -0.11);
    const response = new THREE.QuadraticBezierCurve3(end, reverseControl, start);
    return { node, request, response, requestPoints: request.getPoints(36), responsePoints: response.getPoints(36) };
  }), [positions]);
  useFrame(({ clock }) => {
    if (!motionOn) return;
    curves.forEach(({ request, response }, index) => {
      const phase = (clock.elapsedTime * 0.18 + index * 0.3) % 1;
      const inbound = particles.current[index * 2];
      const outbound = particles.current[index * 2 + 1];
      const trailOut = trails.current[index * 2];
      const trailBack = trails.current[index * 2 + 1];
      if (inbound) inbound.position.copy(request.getPoint(phase));
      if (outbound) outbound.position.copy(response.getPoint(phase));
      if (trailOut && inbound) trailOut.position.copy(inbound.position);
      if (trailBack && outbound) trailBack.position.copy(outbound.position);
    });
  });
  return <group>
    {curves.map(({ node, requestPoints, responsePoints }, index) => <group key={node}>
      <Line points={requestPoints} color={nodeMeta[node].accent} transparent opacity={selected === node ? 0.8 : 0.43} lineWidth={selected === node ? 2 : 1.15} />
      <Line points={requestPoints} color={nodeMeta[node].accent} transparent opacity={selected === node ? 0.14 : 0.07} lineWidth={selected === node ? 7 : 4} />
      <Line points={responsePoints} color="#d184ff" transparent opacity={selected === node ? 0.62 : 0.32} lineWidth={selected === node ? 1.5 : 0.8} />
      {[0, 1].map((direction) => <group key={direction}>
        <mesh ref={(element) => { particles.current[index * 2 + direction] = element; }}>
          <sphereGeometry args={[direction === 0 ? 0.05 : 0.043, 12, 12]} />
          <meshBasicMaterial color={direction === 0 ? nodeMeta[node].color : '#e6a6ff'} toneMapped={false} />
        </mesh>
        <mesh ref={(element) => { trails.current[index * 2 + direction] = element; }}>
          <sphereGeometry args={[0.105, 12, 12]} />
          <meshBasicMaterial color={direction === 0 ? nodeMeta[node].accent : '#b765fa'} transparent opacity={0.1} depthWrite={false} />
        </mesh>
      </group>)}
    </group>)}
  </group>;
}

function NetworkScene({ selected, onSelect, motionOn, activeSlide, language }: { selected: NodeKey; onSelect: (node: NodeKey) => void; motionOn: boolean; activeSlide: SlideKey; language: Language }) {
  const aspect = useThree((state) => state.size.width / state.size.height);
  const positions = useMemo<NodePositions>(() => {
    const spread = aspect < 0.9 ? 0.48 : aspect < 1.15 ? 0.66 : aspect < 1.45 ? 0.83 : 1;
    const lower = -2.05;
    return {
      giffits: [0, 0.15, 0.25],
      products: [-3.12 * spread, 1.4, 0.1],
      pricing: [3.08 * spread, 1.35, -0.2],
      finishing: [0, lower, 0.3],
    };
  }, [aspect]);
  const focusPoint = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  return <>
    <color attach="background" args={['#050711']} />
    <fog attach="fog" args={['#050711', 10, 20]} />
    <ambientLight intensity={0.62} />
    <hemisphereLight args={['#75bfff', '#101024', 0.44]} />
    <pointLight position={[0, 1.5, 3]} color="#bd74ff" intensity={22} distance={9} />
    <pointLight position={[-4, 2, 1]} color="#43d7ff" intensity={9} distance={9} />
    <pointLight position={[4, 1.5, 0]} color="#36ffbf" intensity={8} distance={9} />
    <Stars radius={52} depth={45} count={motionOn ? 1700 : 1100} factor={2.4} saturation={0.32} fade speed={motionOn ? 0.2 : 0} />
    <Cityscape motionOn={motionOn} />
    <DataLinks motionOn={motionOn} selected={selected} positions={positions} />
    <CoreHub selected={selected === 'giffits'} onSelect={onSelect} motionOn={motionOn} language={language} />
    {satKeys.map((node) => <Satellite key={node} node={node} selected={selected === node} onSelect={onSelect} motionOn={motionOn} language={language} position={positions[node]} />)}
    <Billboard position={[0, 1.6, 0]}>
      <Text fontSize={0.11} color="#c5cde8" anchorX="center" anchorY="middle" letterSpacing={0.14} outlineWidth={0.01} outlineColor="#080b18">{language === 'en' ? 'THE SHOP · CONNECTED CONTEXT' : 'DER SHOP · VERBUNDENER KONTEXT'}</Text>
    </Billboard>
    {activeSlide === 'pricing' && <group position={[positions.pricing[0], positions.pricing[1], -0.55]}>
      <mesh><sphereGeometry args={[1.12, 32, 32]} /><meshBasicMaterial color="#52ffbf" wireframe transparent opacity={0.12} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.18, 0.01, 6, 64]} /><meshBasicMaterial color="#69f5c0" transparent opacity={0.65} /></mesh>
    </group>}
    <OrbitControls enablePan={false} minDistance={5} maxDistance={13} minPolarAngle={0.68} maxPolarAngle={2.45} target={focusPoint} autoRotate={false} enableDamping dampingFactor={0.06} />
  </>;
}

export default NetworkScene;
