import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, OrbitControls, Stars, Text } from '@react-three/drei';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Box, Check, ChevronDown, CircleHelp, Command, Cpu, Database, Globe2, Layers3, Menu, Network, Pause, Play, Radio, RotateCcw, Server, Shield, Sparkles, Terminal, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Language = 'en' | 'de';
type SlideKey = 'overview' | 'protocol' | 'pricing' | 'takeaways';
type NodeKey = 'giffits' | 'products' | 'pricing' | 'finishing';

const copy = {
  en: {
    eyebrow: 'A field guide to connected context', titleA: 'THE COMMERCE', titleB: 'CONTEXT LAYER', subtitle: 'How Model Context Protocol connects an AI assistant to the live systems behind a real webshop.', enter: 'ENTER THE SYSTEM', chapter: 'CHAPTER', slides: ['Network map', 'Inside a tool call', 'Pricing engine', 'What changes'], nav: ['Overview', 'Transport', 'Deep dive', 'Takeaways'], live: 'LIVE SYSTEM MAP', online: 'ALL SYSTEMS ONLINE', focus: 'SELECT A NODE', rotate: 'DRAG TO ORBIT', zoom: 'SCROLL TO ZOOM', hub: 'SYMFONY WEBSHOP', hubSub: 'SYMFONY MCP GATEWAY · GIFFITS', products: 'PRODUCT DATA', prices: 'PRICE ENGINE', finishing: 'FINISHING', satSub: 'MCP SERVER', outbound: 'JSON-RPC REQUEST', inbound: 'TOOL RESULT', overviewTitle: 'One interface. Many systems.', overviewBody: 'The assistant speaks MCP. The AI host uses MCP clients to reach focused servers. A Symfony integration layer connects those servers to the systems that already run the shop.', protocolTitle: 'A tool call, in four moves.', protocolBody: 'MCP uses JSON-RPC 2.0 to make the boundary explicit: discover capabilities, request an action, execute it, return structured data.', pricingTitle: 'Zoom in: the price engine.', pricingBody: 'A single question fans out into a typed tool call. The server owns business logic; the model receives a compact, trustworthy result.', takeawayTitle: 'Context becomes a product interface.', takeawayBody: 'MCP gives assistants a consistent way to discover and call capabilities while keeping system ownership where it belongs.', host: 'HOST', server: 'SERVER', assistant: 'AI ASSISTANT', tool: 'TOOL', request: 'REQUEST', response: 'RESPONSE', discover: 'Discover tools', invoke: 'Call tool', execute: 'Run domain logic', return: 'Structured result', inspector: 'NODE INSPECTOR', choose: 'Choose a node to inspect', tools: 'AVAILABLE TOOLS', calls: 'SAMPLE JSON-RPC', connections: 'CONNECTIONS', latency: 'LATENCY', capabilities: 'CAPABILITIES', status: 'STATUS', active: 'ACTIVE', method: 'METHOD', payload: 'PAYLOAD', result: 'RESULT', copy: 'COPY JSON', copied: 'COPIED', pause: 'Pause streams', resume: 'Resume streams', restart: 'Restart presentation', locale: 'LANGUAGE', help: 'Keyboard shortcuts', helpText: 'Navigate with ← → or Space. Press 1–4 to jump to a chapter. Press L to switch language.', source: 'ILLUSTRATIVE SYSTEM MAP', footer: 'A TECH TALK ON MODEL CONTEXT PROTOCOL', slideLabel: 'SLIDE', of: 'OF', next: 'NEXT CHAPTER', previous: 'PREVIOUS', note: 'Example architecture · not a live Giffits integration', secure: 'CONTROLLED ACCESS', serverTools: 'Server-owned capabilities', whyTitle: 'Why a protocol?', whyBody: 'Without a shared interface, every model-to-system connection becomes a one-off integration. MCP turns that connection into a reusable contract.', discoverDesc: 'Client asks what this server can do.', invokeDesc: 'A named tool receives typed arguments.', executeDesc: 'The server validates and runs shop logic.', returnDesc: 'The result returns as structured content.', languageName: 'English', motionReduced: 'Animation reduced by system settings', jsonLabel: 'MCP · 2026-07-28 · JSON-RPC 2.0', line1: 'Client ↔ host', line2: 'Host ↔ server', line3: 'Tools, resources & prompts', learnMore: 'THE PROTOCOL', nextAction: 'Explore the transport', jump: 'JUMP TO CHAPTER', client: 'MCP CLIENT · AI HOST', hostText: 'MCP GATEWAY', serverText: 'MCP SERVER', titleTag: 'FROM MODEL TO MERCHANDISE', finalCta: 'EXPLORE THE NETWORK', highlight: 'A shared contract', highlightBody: 'Capability discovery, typed tool calls, and structured results — over one standard interface.', footerSide: 'BUILT FOR THE REAL WORLD', latencyVal: '22 ms', productTools: ['catalog.search', 'product.get', 'variant.list'], priceTools: ['price.quote', 'discount.check', 'currency.convert'], finishTools: ['finish.options', 'logo.preview', 'production.check'],
  },
  de: {
    eyebrow: 'Ein Wegweiser für vernetzten Kontext', titleA: 'DIE COMMERCE-', titleB: 'KONTEXTSCHICHT', subtitle: 'Wie das Model Context Protocol einen KI-Assistenten mit den Live-Systemen eines Webshops verbindet.', enter: 'SYSTEM BETRETEN', chapter: 'KAPITEL', slides: ['Netzwerkübersicht', 'Ein Tool-Aufruf', 'Preis-Engine', 'Was sich ändert'], nav: ['Übersicht', 'Transport', 'Einblick', 'Fazit'], live: 'LIVE-SYSTEMKARTE', online: 'ALLE SYSTEME ONLINE', focus: 'KNOTEN AUSWÄHLEN', rotate: 'ZIEHEN ZUM DREHEN', zoom: 'SCROLLEN ZUM ZOOMEN', hub: 'SYMFONY-WEBSHOP', hubSub: 'SYMFONY-MCP-GATEWAY · GIFFITS', products: 'PRODUKTDATEN', prices: 'PREIS-ENGINE', finishing: 'VEREDELUNG', satSub: 'MCP-SERVER', outbound: 'JSON-RPC-ANFRAGE', inbound: 'TOOL-ERGEBNIS', overviewTitle: 'Eine Schnittstelle. Viele Systeme.', overviewBody: 'Der KI-Host nutzt MCP-Clients, um spezialisierte Server aufzurufen. Eine Symfony-Integrationsschicht verbindet diese mit den bestehenden Shop-Systemen.', protocolTitle: 'Ein Tool-Aufruf in vier Schritten.', protocolBody: 'MCP nutzt JSON-RPC 2.0 und macht die Grenze eindeutig: Fähigkeiten entdecken, Aktion anfragen, ausführen, strukturierte Daten zurückgeben.', pricingTitle: 'Einblick: die Preis-Engine.', pricingBody: 'Aus einer Frage wird ein typisierter Tool-Aufruf. Die Geschäftslogik bleibt auf dem Server; das Modell erhält ein kompaktes, verlässliches Ergebnis.', takeawayTitle: 'Kontext wird zur Produktschnittstelle.', takeawayBody: 'MCP ermöglicht Assistenten, Fähigkeiten einheitlich zu entdecken und aufzurufen. Die Verantwortung für Systeme bleibt dort, wo sie hingehört.', host: 'HOST', server: 'SERVER', assistant: 'KI-ASSISTENT', tool: 'TOOL', request: 'ANFRAGE', response: 'ANTWORT', discover: 'Tools entdecken', invoke: 'Tool aufrufen', execute: 'Fachlogik ausführen', return: 'Strukturiertes Ergebnis', inspector: 'KNOTENDETAILS', choose: 'Knoten zur Analyse auswählen', tools: 'VERFÜGBARE TOOLS', calls: 'JSON-RPC-BEISPIEL', connections: 'VERBINDUNGEN', latency: 'LATENZ', capabilities: 'FÄHIGKEITEN', status: 'STATUS', active: 'AKTIV', method: 'METHODE', payload: 'NUTZDATEN', result: 'ERGEBNIS', copy: 'JSON KOPIEREN', copied: 'KOPIERT', pause: 'Datenströme anhalten', resume: 'Datenströme fortsetzen', restart: 'Präsentation neu starten', locale: 'SPRACHE', help: 'Tastenkürzel', helpText: 'Mit ← → oder Leertaste navigieren. Mit 1–4 direkt zum Kapitel springen. Mit L Sprache wechseln.', source: 'ILLUSTRATIVE SYSTEMKARTE', footer: 'EIN TECH-TALK ÜBER DAS MODEL CONTEXT PROTOCOL', slideLabel: 'FOLIE', of: 'VON', next: 'NÄCHSTES KAPITEL', previous: 'ZURÜCK', note: 'Beispielarchitektur · keine Live-Integration mit Giffits', secure: 'KONTROLLIERTER ZUGRIFF', serverTools: 'Serverseitig verwaltete Fähigkeiten', discoverDesc: 'Der Client fragt verfügbare Fähigkeiten ab.', invokeDesc: 'Ein benanntes Tool erhält typisierte Argumente.', executeDesc: 'Der Server validiert und führt Shop-Logik aus.', returnDesc: 'Das Ergebnis kommt strukturiert zurück.', languageName: 'Deutsch', motionReduced: 'Animation gemäß Systemeinstellung reduziert', jsonLabel: 'MCP · 2026-07-28 · JSON-RPC 2.0', line1: 'Client ↔ Host', line2: 'Host ↔ Server', line3: 'Tools, Ressourcen & Prompts', learnMore: 'DAS PROTOKOLL', nextAction: 'Transport erkunden', jump: 'KAPITEL SPRINGEN', client: 'MCP-CLIENT · KI-HOST', hostText: 'MCP-GATEWAY', serverText: 'MCP-SERVER', titleTag: 'VOM MODELL ZUM PRODUKT', finalCta: 'NETZWERK ERKUNDEN', highlight: 'Ein gemeinsamer Vertrag', highlightBody: 'Fähigkeiten entdecken, typisierte Tools aufrufen, strukturierte Ergebnisse erhalten — über eine einheitliche Schnittstelle.', footerSide: 'FÜR DIE PRAXIS GEDACHT', latencyVal: '22 ms', productTools: ['catalog.search', 'product.get', 'variant.list'], priceTools: ['price.quote', 'discount.check', 'currency.convert'], finishTools: ['finish.options', 'logo.preview', 'production.check'], whyTitle: 'Warum ein Protokoll?', whyBody: 'Ohne gemeinsame Schnittstelle wird jede Verbindung zwischen Modell und System zur Einzellösung. MCP macht daraus einen wiederverwendbaren Vertrag.',
  },
} as const;

const nodeMeta: Record<NodeKey, { color: string; accent: string; position: [number, number, number]; toolsKey: 'productTools' | 'priceTools' | 'finishTools'; icon: typeof Database }> = {
  giffits: { color: '#f0a7ff', accent: '#e959ff', position: [0, 0, 0], toolsKey: 'productTools', icon: Cpu },
  products: { color: '#55e7ff', accent: '#30b8ff', position: [-3.3, 1.45, 0.1], toolsKey: 'productTools', icon: Database },
  pricing: { color: '#78ffd3', accent: '#30e6a1', position: [3.2, 1.3, -0.2], toolsKey: 'priceTools', icon: Activity },
  finishing: { color: '#d2a0ff', accent: '#a968ff', position: [0.2, -2.1, 0.3], toolsKey: 'finishTools', icon: Layers3 },
};

function buildJson(node: NodeKey, direction: 'request' | 'response' = 'request') {
  if (direction === 'response') {
    const results: Record<NodeKey, object> = {
      giffits: { jsonrpc: '2.0', id: 42, result: { content: [{ type: 'text', text: 'Product GF-2048: recycled cotton tote' }] } },
      products: { jsonrpc: '2.0', id: 42, result: { content: [{ type: 'text', text: '3 matching products found' }] } },
      pricing: { jsonrpc: '2.0', id: 42, result: { content: [{ type: 'text', text: 'Unit price: 4.82 EUR · Quantity: 250' }] } },
      finishing: { jsonrpc: '2.0', id: 42, result: { content: [{ type: 'text', text: 'Screen print available · 4 color positions' }] } },
    };
    return JSON.stringify(results[node], null, 2);
  }
  const map: Record<NodeKey, object> = {
    giffits: { jsonrpc: '2.0', id: 42, method: 'tools/call', params: { name: 'product.get', arguments: { sku: 'GF-2048' }, _meta: { 'io.modelcontextprotocol/protocolVersion': '2026-07-28' } } },
    products: { jsonrpc: '2.0', id: 42, method: 'tools/call', params: { name: 'catalog.search', arguments: { query: 'recycled cotton tote' }, _meta: { 'io.modelcontextprotocol/protocolVersion': '2026-07-28' } } },
    pricing: { jsonrpc: '2.0', id: 42, method: 'tools/call', params: { name: 'price.quote', arguments: { sku: 'GF-2048', quantity: 250, currency: 'EUR' }, _meta: { 'io.modelcontextprotocol/protocolVersion': '2026-07-28' } } },
    finishing: { jsonrpc: '2.0', id: 42, method: 'tools/call', params: { name: 'finish.options', arguments: { sku: 'GF-2048', technique: 'screen_print' }, _meta: { 'io.modelcontextprotocol/protocolVersion': '2026-07-28' } } },
  };
  return JSON.stringify(map[node], null, 2);
}

function Orb({ node, selected, onSelect, motionOn }: { node: NodeKey; selected: boolean; onSelect: (node: NodeKey) => void; motionOn: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const meta = nodeMeta[node];
  useFrame(({ clock }) => {
    if (ref.current && motionOn) ref.current.rotation.y = clock.elapsedTime * (node === 'giffits' ? 0.16 : 0.24);
  });
  const center = node === 'giffits';
  const scale = center ? 0.72 : 0.5;
  return (
    <group position={meta.position} ref={ref} onClick={(event) => { event.stopPropagation(); onSelect(node); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
      <Float speed={motionOn ? (center ? 1 : 1.5) : 0} rotationIntensity={motionOn ? 0.1 : 0} floatIntensity={motionOn ? (center ? 0.2 : 0.13) : 0}>
        <mesh>
          <icosahedronGeometry args={[scale, center ? 2 : 1]} />
          <meshStandardMaterial color={meta.color} wireframe emissive={meta.accent} emissiveIntensity={selected ? 1.45 : 0.7} transparent opacity={0.78} />
        </mesh>
        <mesh scale={center ? 0.48 : 0.42}>
          <icosahedronGeometry args={[scale, center ? 2 : 1]} />
          <meshBasicMaterial color={meta.accent} wireframe transparent opacity={0.52} />
        </mesh>
        <mesh scale={1.36}>
          <sphereGeometry args={[scale, 20, 20]} />
          <meshBasicMaterial color={meta.accent} transparent opacity={selected ? 0.11 : 0.065} />
        </mesh>
        <mesh rotation={[Math.PI / 2.6, 0.2, 0]}>
          <torusGeometry args={[scale * 1.52, 0.008, 6, 72]} />
          <meshBasicMaterial color={meta.color} transparent opacity={0.68} />
        </mesh>
      </Float>
    </group>
  );
}

function Scene({ selected, onSelect, motionOn, activeSlide }: { selected: NodeKey; onSelect: (node: NodeKey) => void; motionOn: boolean; activeSlide: SlideKey }) {
  const paths = useMemo(() => Object.entries(nodeMeta).filter(([key]) => key !== 'giffits').map(([key, value]) => ({ key, points: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(value.position[0] * 0.5, value.position[1] * 0.55 + 0.1, -0.08), new THREE.Vector3(value.position[0], value.position[1], value.position[2])] })), []);
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    if (!motionOn) return;
    packetRefs.current.forEach((packet, index) => {
      if (!packet) return;
      const t = (clock.elapsedTime * 0.18 + index * 0.34) % 1;
      const points = paths[index]?.points;
      if (!points) return;
      packet.position.copy(new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]).getPoint(t));
    });
  });
  return (
    <>
      <color attach="background" args={['#050711']} />
      <fog attach="fog" args={['#050711', 9, 20]} />
      <ambientLight intensity={0.56} />
      <pointLight position={[0, 0, 3]} color="#b484ff" intensity={15} distance={9} />
      <pointLight position={[-4, 2, 2]} color="#43d7ff" intensity={7} distance={8} />
      <pointLight position={[4, 1, 1]} color="#36ffbf" intensity={6} distance={8} />
      <Stars radius={55} depth={45} count={activeSlide === 'overview' ? 1900 : 1300} factor={3} saturation={0.4} fade speed={motionOn ? 0.32 : 0} />
      <gridHelper args={[18, 36, '#172a4a', '#0c1830']} position={[0, -3, -1]} />
      {paths.map(({ key, points }, index) => {
        const color = nodeMeta[key as NodeKey].accent;
        return <group key={key}>
          <Line points={points} color={color} transparent opacity={0.72} lineWidth={1.35} />
          <Line points={points} color={color} transparent opacity={0.18} lineWidth={5} />
          <mesh ref={(el) => { packetRefs.current[index] = el; }}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        </group>;
      })}
      {(['giffits', 'products', 'pricing', 'finishing'] as NodeKey[]).map((node) => <Orb key={node} node={node} selected={selected === node} onSelect={onSelect} motionOn={motionOn} />)}
      {Object.entries(nodeMeta).filter(([key]) => key !== 'giffits').map(([key, meta]) => <Text key={`label-${key}`} position={[meta.position[0], meta.position[1] - 0.8, 0]} fontSize={0.15} color={meta.color} anchorX="center" anchorY="middle" letterSpacing={0.09}>{key === 'products' ? 'PRODUCT DATA' : key === 'pricing' ? 'PRICE ENGINE' : 'FINISHING'}</Text>)}
      <Text position={[0, -1.06, 0]} fontSize={0.14} color="#f0c7ff" anchorX="center" anchorY="middle" letterSpacing={0.1}>SYMFONY · GIFFITS MCP GATEWAY</Text>
      {activeSlide === 'pricing' && <mesh position={[3.2, 1.3, -0.5]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#52ffbf" wireframe transparent opacity={0.14} />
      </mesh>}
      <OrbitControls enablePan={false} minDistance={5} maxDistance={14} minPolarAngle={0.65} maxPolarAngle={2.5} autoRotate={motionOn} autoRotateSpeed={0.22} />
    </>
  );
}

function JsonPanel({ t, node, copied, onCopy }: { t: { jsonLabel: string; copy: string; copied: string; request: string; response: string }; node: NodeKey; copied: boolean; onCopy: (direction: 'request' | 'response') => void }) {
  const [direction, setDirection] = useState<'request' | 'response'>('request');
  return <div className="json-card">
    <div className="json-head"><span className="json-lights"><i/><i/><i/></span><span>{t.jsonLabel}</span><div className="json-tabs"><button className={direction === 'request' ? 'selected' : ''} onClick={() => setDirection('request')}>{t.request}</button><button className={direction === 'response' ? 'selected' : ''} onClick={() => setDirection('response')}>{t.response}</button></div><button className="copy-button" onClick={() => onCopy(direction)}>{copied ? <Check size={13}/> : <Command size={13}/>} {copied ? t.copied : t.copy}</button></div>
    <pre>{buildJson(node, direction)}</pre>
  </div>;
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [slide, setSlide] = useState(0);
  const [selected, setSelected] = useState<NodeKey>('pricing');
  const [motionOn, setMotionOn] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const t = copy[language];
  const keys: SlideKey[] = ['overview', 'protocol', 'pricing', 'takeaways'];
  const activeSlide = keys[slide];
  const go = useCallback((index: number) => setSlide((index + keys.length) % keys.length), []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(target.tagName) && event.key !== ' ') return;
      if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); go(slide + 1); }
      if (event.key === 'ArrowLeft') go(slide - 1);
      if (/^[1-4]$/.test(event.key)) go(Number(event.key) - 1);
      if (event.key.toLowerCase() === 'l') setLanguage((value) => value === 'en' ? 'de' : 'en');
      if (event.key === 'Escape') setHelpOpen(false);
      if (event.key === '?') setHelpOpen((value) => !value);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, slide]);
  const onCopy = async (direction: 'request' | 'response') => {
    await navigator.clipboard.writeText(buildJson(selected, direction));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  const node = nodeMeta[selected];
  const NodeIcon = node.icon;
  const slideContent = [
    <><span className="content-kicker"><Network size={14}/> {t.nav[0]}</span><h2>{t.overviewTitle}</h2><p>{t.overviewBody}</p><div className="insight-row"><span className="insight-icon"><Server size={17}/></span><span><strong>{t.highlight}</strong><small>{t.highlightBody}</small></span></div><button className="text-link" onClick={() => go(1)}>{t.learnMore} <ArrowUpRight size={15}/></button></>,
    <><span className="content-kicker"><AudioLines size={14}/> {t.nav[1]}</span><h2>{t.protocolTitle}</h2><p>{t.protocolBody}</p><div className="steps-list">{[t.discover, t.invoke, t.execute, t.return].map((item, i) => <div className="step-row" key={item}><span className="step-number">0{i + 1}</span><span><strong>{item}</strong><small>{[t.discoverDesc, t.invokeDesc, t.executeDesc, t.returnDesc][i]}</small></span><ArrowRight size={14}/></div>)}</div></>,
    <><span className="content-kicker"><Zap size={14}/> {t.nav[2]}</span><h2>{t.pricingTitle}</h2><p>{t.pricingBody}</p><div className="price-stat"><span>{t.latency}</span><strong>{t.latencyVal}</strong><small><Activity size={12}/> {t.online}</small></div><p className="micro-note">{t.secure} <span>·</span> {t.serverTools}</p></>,
    <><span className="content-kicker"><Sparkles size={14}/> {t.nav[3]}</span><h2>{t.takeawayTitle}</h2><p>{t.takeawayBody}</p><div className="takeaway-list"><span><Check size={14}/>{t.line1}</span><span><Check size={14}/>{t.line2}</span><span><Check size={14}/>{t.line3}</span></div><button className="text-link" onClick={() => go(0)}>{t.finalCta} <ArrowUpRight size={15}/></button></>,
  ];
  return <main className="app-shell" onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touchStartX.current === null) return; const delta = event.changedTouches[0]!.clientX - touchStartX.current; if (Math.abs(delta) > 80) go(slide + (delta < 0 ? 1 : -1)); touchStartX.current = null; }}>
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <header className="topbar"><a className="brand" href="#home" onClick={(event) => { event.preventDefault(); go(0); }}><span className="brand-mark"><Network size={17}/></span><span><strong>CONTEXT<span>/</span>FIELD</strong><small>MODEL CONTEXT PROTOCOL</small></span></a><nav className="chapter-nav" aria-label="Presentation chapters">{t.nav.map((item, index) => <button key={item} className={slide === index ? 'active' : ''} onClick={() => go(index)}><span>0{index + 1}</span>{item}</button>)}</nav><div className="top-actions"><span className="edition-label">TECH TALK <i>·</i> MCP</span><button className="lang-toggle" onClick={() => setLanguage(language === 'en' ? 'de' : 'en')} aria-label={t.locale}><Globe2 size={14}/>{language.toUpperCase()}</button><button className="icon-button" onClick={() => setHelpOpen(true)} aria-label={t.help}><CircleHelp size={17}/></button></div><button className="mobile-menu" onClick={() => setHelpOpen(true)} aria-label="Open controls"><Menu size={20}/></button></header>
    <div className="main-grid">
      <section className="visual-column">
        <div className="scene-topline"><div><span className="live-dot"/><span>{t.live}</span></div><div className="system-status"><span>{t.online}</span><span className="status-pip"/></div></div>
        <div className="scene-wrap" aria-label={language === 'en' ? 'Interactive 3D network visualization' : 'Interaktive 3D-Netzwerkvisualisierung'}><Canvas dpr={[1, 1.6]} camera={{ position: [0, 0.2, 8.2], fov: 43 }} gl={{ antialias: true, alpha: false }}><Scene selected={selected} onSelect={setSelected} motionOn={motionOn && !reducedMotion} activeSlide={activeSlide}/></Canvas>
          <div className="scene-label scene-label-client"><span className="tiny-icon"><Cpu size={13}/></span><span><small>{t.client}</small><strong>LLM AGENT</strong></span></div>
          <div className="scene-label scene-label-host"><span className="tiny-icon host-icon"><Command size={14}/></span><span><small>{t.hostText}</small><strong>GIFFITS · SYMFONY</strong></span></div>
          <div className="scene-legend"><span className="legend-line cyan"/>{t.outbound}<span className="legend-line violet"/>{t.inbound}</div>
          <div className="scene-hint"><RotateCcw size={12}/>{t.rotate}<span>·</span>{t.zoom}</div>
          {activeSlide === 'overview' && <div className="scene-chip chip-left"><span className="chip-orb"/><span>01 / {t.products}<small>{t.satSub}</small></span></div>}
          {activeSlide === 'overview' && <div className="scene-chip chip-right"><span className="chip-orb green"/><span>02 / {t.prices}<small>{t.satSub}</small></span></div>}
        </div>
        <div className="scene-bottomline"><span>{t.source} <i>·</i> {t.note}</span><div><span><i className="keycap">DRAG</i> ORBIT</span><span><i className="keycap">SCROLL</i> ZOOM</span><button onClick={() => setMotionOn((value) => !value)} aria-label={motionOn ? t.pause : t.resume}>{motionOn ? <Pause size={12}/> : <Play size={12}/>}</button></div></div>
      </section>
      <aside className="story-column">
        <div className="story-heading"><div className="chapter-index"><span>0{slide + 1}</span><i>/</i>04</div><div className="chapter-progress">{keys.map((_, i) => <button key={i} aria-label={`${t.jump} ${i + 1}`} className={i <= slide ? 'filled' : ''} onClick={() => go(i)}/>)}</div></div>
        <AnimatePresence mode="wait"><motion.article className="story-content" key={`${slide}-${language}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28, ease: 'easeOut' }}>{slideContent[slide]}</motion.article></AnimatePresence>
        <div className="node-inspector"><div className="inspector-title"><div><span className="inspector-icon" style={{ color: node.color }}><NodeIcon size={15}/></span><span><small>{t.inspector}</small><strong>{selected === 'giffits' ? t.hub : selected === 'products' ? t.products : selected === 'pricing' ? t.prices : t.finishing}</strong></span></div><div className="inspector-actions"><select aria-label={t.choose} value={selected} onChange={(event) => setSelected(event.target.value as NodeKey)}><option value="giffits">{t.hub}</option><option value="products">{t.products}</option><option value="pricing">{t.prices}</option><option value="finishing">{t.finishing}</option></select><span className="node-live"><i/> {t.active}</span></div></div><div className="inspector-meta"><span><small>{t.latency}</small><strong>{selected === 'giffits' ? '8 ms' : selected === 'products' ? '18 ms' : selected === 'pricing' ? '22 ms' : '12 ms'}</strong></span><span><small>{t.capabilities}</small><strong>{selected === 'giffits' ? '12' : '03'} TOOLS</strong></span><span><small>{t.status}</small><strong className="green-text">{t.active}</strong></span></div><div className="tool-tags">{t[node.toolsKey].map((tool) => <span key={tool}><span className="tag-dot"/>{tool}</span>)}</div></div>
        <JsonPanel t={t} node={selected} copied={copied} onCopy={onCopy}/>
        <div className="slide-controls"><button onClick={() => go(slide - 1)} disabled={slide === 0}><ArrowLeft size={14}/>{t.previous}</button><span>{t.slideLabel} 0{slide + 1} <i>{t.of}</i> 04</span><button onClick={() => go(slide + 1)} disabled={slide === 3}>{t.next}<ArrowRight size={14}/></button></div>
      </aside>
    </div>
    <footer className="footer-bar"><div><span className="footer-glyph"><Radio size={12}/></span>{t.footer}</div><span className="footer-center">{t.titleTag}</span><div className="footer-right">{t.footerSide}<span>© 2026</span></div></footer>
    <AnimatePresence>{helpOpen && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setHelpOpen(false); }}><motion.div className="help-modal" initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}><button className="modal-close" onClick={() => setHelpOpen(false)} aria-label="Close"><X size={18}/></button><span className="content-kicker"><Command size={14}/> {t.help}</span><h2>{t.helpText}</h2><div className="shortcut-grid"><span><kbd>←</kbd> <kbd>→</kbd><small>{t.nav[0]} → {t.nav[3]}</small></span><span><kbd>1</kbd>–<kbd>4</kbd><small>{t.jump}</small></span><span><kbd>L</kbd><small>{t.locale}</small></span><span><kbd>?</kbd><small>{t.help}</small></span></div><button className="modal-action" onClick={() => { setHelpOpen(false); go(0); }}><RotateCcw size={14}/>{t.restart}</button><p className="modal-note">{t.note}</p></motion.div></motion.div>}</AnimatePresence>
  </main>;
}
