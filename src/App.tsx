import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Box, Check, ChevronDown, CircleHelp, Command, Cpu, Database, Globe2, Layers3, Menu, Network, Pause, Play, Radio, RotateCcw, Server, Shield, Sparkles, Terminal, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import NetworkScene, { houseCatalog } from './NetworkScene';
import type { HouseId, NodeKey } from './NetworkScene';
import TransportWalkthrough from './TransportWalkthrough';

type Language = 'en' | 'de';
type SlideKey = 'overview' | 'protocol' | 'pricing' | 'takeaways';

const copy = {
  en: {
    eyebrow: 'A field guide to connected context', titleA: 'THE COMMERCE', titleB: 'CONTEXT LAYER', subtitle: 'How Model Context Protocol connects an AI assistant to the live systems behind a real webshop.', enter: 'ENTER THE SYSTEM', chapter: 'CHAPTER', slides: ['Network map', 'Inside a tool call', 'Pricing engine', 'What changes'], nav: ['Overview', 'Transport', 'Deep dive', 'Takeaways'], live: 'SIMULATED SYSTEM MAP', online: 'DEMO NODES READY', focus: 'SELECT A NODE', rotate: 'DRAG TO ORBIT', zoom: 'SCROLL TO ZOOM', hub: 'SYMFONY WEBSHOP', hubSub: 'SYMFONY MCP GATEWAY · GIFFITS', products: 'PRODUCT DATA', prices: 'PRICE ENGINE', finishing: 'FINISHING', satSub: 'MCP SERVER', outbound: 'JSON-RPC REQUEST', inbound: 'TOOL RESULT', overviewTitle: 'One interface. Many systems.', overviewBody: 'The assistant speaks MCP. The AI host uses MCP clients to reach focused servers. A Symfony integration layer connects those servers to the systems that already run the shop.', protocolTitle: 'A tool call, in four moves.', protocolBody: 'MCP uses JSON-RPC 2.0 to make the boundary explicit: discover capabilities, request an action, execute it, return structured data.', pricingTitle: 'Zoom in: the price engine.', pricingBody: 'A single question fans out into a typed tool call. The server owns business logic; the model receives a compact, trustworthy result.', takeawayTitle: 'Context becomes a product interface.', takeawayBody: 'MCP gives assistants a consistent way to discover and call capabilities while keeping system ownership where it belongs.', host: 'HOST', server: 'SERVER', assistant: 'AI ASSISTANT', tool: 'TOOL', request: 'REQUEST', response: 'RESPONSE', discover: 'Discover tools', invoke: 'Call tool', execute: 'Run domain logic', return: 'Structured result', inspector: 'NODE INSPECTOR', choose: 'Choose a node to inspect', tools: 'AVAILABLE TOOLS', calls: 'SAMPLE JSON-RPC', connections: 'CONNECTIONS', latency: 'LATENCY', capabilities: 'CAPABILITIES', status: 'STATUS', active: 'ACTIVE', method: 'METHOD', payload: 'PAYLOAD', result: 'RESULT', copy: 'COPY JSON', copied: 'COPIED', pause: 'Pause streams', resume: 'Resume streams', restart: 'Restart presentation', locale: 'LANGUAGE', help: 'Keyboard shortcuts', helpText: 'Navigate with ← → or Space. Press 1–4 to jump to a chapter. Press L to switch language.', source: 'ILLUSTRATIVE SYSTEM MAP', footer: 'A TECH TALK ON MODEL CONTEXT PROTOCOL', slideLabel: 'SLIDE', of: 'OF', next: 'NEXT CHAPTER', previous: 'PREVIOUS', note: 'Example architecture · not a live Giffits integration', secure: 'CONTROLLED ACCESS', serverTools: 'Server-owned capabilities', whyTitle: 'Why a protocol?', whyBody: 'Without a shared interface, every model-to-system connection becomes a one-off integration. MCP turns that connection into a reusable contract.', discoverDesc: 'Client asks what this server can do.', invokeDesc: 'A named tool receives typed arguments.', executeDesc: 'The server validates and runs shop logic.', returnDesc: 'The result returns as structured content.', languageName: 'English', motionReduced: 'Animation reduced by system settings', jsonLabel: 'MCP · 2026-07-28 · JSON-RPC 2.0', line1: 'Client ↔ host', line2: 'Host ↔ server', line3: 'Tools, resources & prompts', learnMore: 'THE PROTOCOL', nextAction: 'Explore the transport', jump: 'JUMP TO CHAPTER', client: 'MCP CLIENT · AI HOST', hostText: 'MCP GATEWAY', serverText: 'MCP SERVER', titleTag: 'FROM MODEL TO MERCHANDISE', finalCta: 'EXPLORE THE NETWORK', highlight: 'A shared contract', highlightBody: 'Capability discovery, typed tool calls, and structured results — over one standard interface.', footerSide: 'BUILT FOR THE REAL WORLD', latencyVal: '22 ms', productTools: ['catalog.search', 'product.get', 'variant.list'], priceTools: ['price.quote', 'discount.check', 'currency.convert'], finishTools: ['finish.options', 'logo.preview', 'production.check'],
  },
  de: {
    eyebrow: 'Ein Wegweiser für vernetzten Kontext', titleA: 'DIE COMMERCE-', titleB: 'KONTEXTSCHICHT', subtitle: 'Wie das Model Context Protocol einen KI-Assistenten mit den Live-Systemen eines Webshops verbindet.', enter: 'SYSTEM BETRETEN', chapter: 'KAPITEL', slides: ['Netzwerkübersicht', 'Ein Tool-Aufruf', 'Preis-Engine', 'Was sich ändert'], nav: ['Übersicht', 'Transport', 'Einblick', 'Fazit'], live: 'SIMULIERTE STADTKARTE', online: 'DEMO-SERVER BEREIT', focus: 'KNOTEN AUSWÄHLEN', rotate: 'ZIEHEN ZUM DREHEN', zoom: 'SCROLLEN ZUM ZOOMEN', hub: 'SYMFONY-WEBSHOP', hubSub: 'SYMFONY-MCP-GATEWAY · GIFFITS', products: 'PRODUKTDATEN', prices: 'PREIS-ENGINE', finishing: 'VEREDELUNG', satSub: 'MCP-SERVER', outbound: 'JSON-RPC-ANFRAGE', inbound: 'TOOL-ERGEBNIS', overviewTitle: 'Eine Schnittstelle. Viele Systeme.', overviewBody: 'Der KI-Host nutzt MCP-Clients, um spezialisierte Server aufzurufen. Eine Symfony-Integrationsschicht verbindet diese mit den bestehenden Shop-Systemen.', protocolTitle: 'Ein Tool-Aufruf in vier Schritten.', protocolBody: 'MCP nutzt JSON-RPC 2.0 und macht die Grenze eindeutig: Fähigkeiten entdecken, Aktion anfragen, ausführen, strukturierte Daten zurückgeben.', pricingTitle: 'Einblick: die Preis-Engine.', pricingBody: 'Aus einer Frage wird ein typisierter Tool-Aufruf. Die Geschäftslogik bleibt auf dem Server; das Modell erhält ein kompaktes, verlässliches Ergebnis.', takeawayTitle: 'Kontext wird zur Produktschnittstelle.', takeawayBody: 'MCP ermöglicht Assistenten, Fähigkeiten einheitlich zu entdecken und aufzurufen. Die Verantwortung für Systeme bleibt dort, wo sie hingehört.', host: 'HOST', server: 'SERVER', assistant: 'KI-ASSISTENT', tool: 'TOOL', request: 'ANFRAGE', response: 'ANTWORT', discover: 'Tools entdecken', invoke: 'Tool aufrufen', execute: 'Fachlogik ausführen', return: 'Strukturiertes Ergebnis', inspector: 'KNOTENDETAILS', choose: 'Knoten zur Analyse auswählen', tools: 'VERFÜGBARE TOOLS', calls: 'JSON-RPC-BEISPIEL', connections: 'VERBINDUNGEN', latency: 'LATENZ', capabilities: 'FÄHIGKEITEN', status: 'STATUS', active: 'AKTIV', method: 'METHODE', payload: 'NUTZDATEN', result: 'ERGEBNIS', copy: 'JSON KOPIEREN', copied: 'KOPIERT', pause: 'Datenströme anhalten', resume: 'Datenströme fortsetzen', restart: 'Präsentation neu starten', locale: 'SPRACHE', help: 'Tastenkürzel', helpText: 'Mit ← → oder Leertaste navigieren. Mit 1–4 direkt zum Kapitel springen. Mit L Sprache wechseln.', source: 'ILLUSTRATIVE SYSTEMKARTE', footer: 'EIN TECH-TALK ÜBER DAS MODEL CONTEXT PROTOCOL', slideLabel: 'FOLIE', of: 'VON', next: 'NÄCHSTES KAPITEL', previous: 'ZURÜCK', note: 'Beispielarchitektur · keine Live-Integration mit Giffits', secure: 'KONTROLLIERTER ZUGRIFF', serverTools: 'Serverseitig verwaltete Fähigkeiten', discoverDesc: 'Der Client fragt verfügbare Fähigkeiten ab.', invokeDesc: 'Ein benanntes Tool erhält typisierte Argumente.', executeDesc: 'Der Server validiert und führt Shop-Logik aus.', returnDesc: 'Das Ergebnis kommt strukturiert zurück.', languageName: 'Deutsch', motionReduced: 'Animation gemäß Systemeinstellung reduziert', jsonLabel: 'MCP · 2026-07-28 · JSON-RPC 2.0', line1: 'Client ↔ Host', line2: 'Host ↔ Server', line3: 'Tools, Ressourcen & Prompts', learnMore: 'DAS PROTOKOLL', nextAction: 'Transport erkunden', jump: 'KAPITEL SPRINGEN', client: 'MCP-CLIENT · KI-HOST', hostText: 'MCP-GATEWAY', serverText: 'MCP-SERVER', titleTag: 'VOM MODELL ZUM PRODUKT', finalCta: 'NETZWERK ERKUNDEN', highlight: 'Ein gemeinsamer Vertrag', highlightBody: 'Fähigkeiten entdecken, typisierte Tools aufrufen, strukturierte Ergebnisse erhalten — über eine einheitliche Schnittstelle.', footerSide: 'FÜR DIE PRAXIS GEDACHT', latencyVal: '22 ms', productTools: ['catalog.search', 'product.get', 'variant.list'], priceTools: ['price.quote', 'discount.check', 'currency.convert'], finishTools: ['finish.options', 'logo.preview', 'production.check'], whyTitle: 'Warum ein Protokoll?', whyBody: 'Ohne gemeinsame Schnittstelle wird jede Verbindung zwischen Modell und System zur Einzellösung. MCP macht daraus einen wiederverwendbaren Vertrag.',
  },
} as const;

const learningCopy = {
  en: {
    roleHost: 'AI HOST', roleHostBody: 'Owns the conversation and model.',
    roleClient: 'MCP CLIENT', roleClientBody: 'Connects to each server and relays messages.',
    roleServer: 'MCP SERVER', roleServerBody: 'Owns tool schemas and shop capabilities.',
    priceInputTitle: 'Inputs', priceInputBody: 'SKU, quantity, currency and finish.',
    priceRulesTitle: 'Shop rules', priceRulesBody: 'Contract tier, volume breaks and availability.',
    priceOutputTitle: 'Quote result', priceOutputBody: 'Unit price, total and any constraints.',
    guardrailTitle: 'Keep the boundary visible', guardrailBody: 'Show the tool, validate inputs and confirm consequential changes before execution.',
  },
  de: {
    roleHost: 'KI-HOST', roleHostBody: 'Steuert Dialog und Modell.',
    roleClient: 'MCP-CLIENT', roleClientBody: 'Verbindet sich mit Servern und leitet Nachrichten weiter.',
    roleServer: 'MCP-SERVER', roleServerBody: 'Verwaltet Tool-Schemas und Shop-Fähigkeiten.',
    priceInputTitle: 'Eingaben', priceInputBody: 'SKU, Menge, Währung und Veredelung.',
    priceRulesTitle: 'Shop-Regeln', priceRulesBody: 'Kundentarif, Mengenstaffeln und Verfügbarkeit.',
    priceOutputTitle: 'Preisangebot', priceOutputBody: 'Stückpreis, Gesamtsumme und Einschränkungen.',
    guardrailTitle: 'Grenzen sichtbar halten', guardrailBody: 'Tool anzeigen, Eingaben prüfen und folgenreiche Änderungen vor der Ausführung bestätigen.',
  },
} as const;

const nodeMeta: Record<NodeKey, { color: string; accent: string; position: [number, number, number]; toolsKey: 'productTools' | 'priceTools' | 'finishTools'; icon: typeof Database }> = {
  giffits: { color: '#f0a7ff', accent: '#e959ff', position: [0, 0, 0], toolsKey: 'productTools', icon: Cpu },
  products: { color: '#55e7ff', accent: '#30b8ff', position: [-3.3, 1.45, 0.1], toolsKey: 'productTools', icon: Database },
  pricing: { color: '#78ffd3', accent: '#30e6a1', position: [3.2, 1.3, -0.2], toolsKey: 'priceTools', icon: Activity },
  finishing: { color: '#d2a0ff', accent: '#a968ff', position: [0.2, -2.1, 0.3], toolsKey: 'finishTools', icon: Layers3 },
};

const houseArguments: Record<HouseId, Record<string, string | number>> = {
  gateway: { shop: 'giffits', customerId: 'C-2048' },
  catalog: { query: 'recycled cotton tote' },
  inventory: { sku: 'GF-2048', quantity: 250, deliveryCountry: 'DE' },
  profiles: { customerId: 'C-2048', catalog: 'promotional-textiles' },
  pricing: { sku: 'GF-2048', quantity: 250, currency: 'EUR' },
  discounts: { sku: 'GF-2048', quantity: 250, customerTier: 'gold' },
  currency: { amount: 1205, from: 'EUR', to: 'USD' },
  finishing: { sku: 'GF-2048', technique: 'screen_print' },
  production: { sku: 'GF-2048', artworkId: 'ART-731' },
};

function buildJson(houseId: HouseId, direction: 'request' | 'response' = 'request') {
  const house = houseCatalog.find((entry) => entry.id === houseId);
  if (!house) throw new Error(`Unknown MCP city house: ${houseId}`);
  if (direction === 'response') {
    const text: Record<HouseId, string> = {
      gateway: 'Shop context resolved · customer session authorized',
      catalog: '3 matching products found',
      inventory: '250 units available · lead time 12 days',
      profiles: 'Gold customer · promotional textiles catalog',
      pricing: 'Unit price: 4.82 EUR · Quantity: 250',
      discounts: 'Gold tier discount applied · 8%',
      currency: '1205 EUR = 1312.45 USD',
      finishing: 'Screen print available · 4 color positions',
      production: 'Artwork valid · production constraints passed',
    };
    return JSON.stringify({ jsonrpc: '2.0', id: 42, result: { resultType: 'complete', isError: false, content: [{ type: 'text', text: text[houseId] }] } }, null, 2);
  }
  const requestMeta = { 'io.modelcontextprotocol/protocolVersion': '2026-07-28', 'io.modelcontextprotocol/clientInfo': { name: 'giffits-commerce-demo', version: '1.0.0' }, 'io.modelcontextprotocol/clientCapabilities': {} };
  return JSON.stringify({ jsonrpc: '2.0', id: 42, method: 'tools/call', params: { name: house.tools[0], arguments: houseArguments[houseId], _meta: requestMeta } }, null, 2);
}

function JsonPanel({ t, houseId, copied, onCopy }: { t: { jsonLabel: string; copy: string; copied: string; request: string; response: string }; houseId: HouseId; copied: boolean; onCopy: (direction: 'request' | 'response') => void }) {
  const [direction, setDirection] = useState<'request' | 'response'>('request');
  return <div className="json-card">
    <div className="json-head"><span className="json-lights"><i/><i/><i/></span><span>{t.jsonLabel}</span><div className="json-tabs"><button className={direction === 'request' ? 'selected' : ''} onClick={() => setDirection('request')}>{t.request}</button><button className={direction === 'response' ? 'selected' : ''} onClick={() => setDirection('response')}>{t.response}</button></div><button className="copy-button" onClick={() => onCopy(direction)}>{copied ? <Check size={13}/> : <Command size={13}/>} {copied ? t.copied : t.copy}</button></div>
    <pre>{buildJson(houseId, direction)}</pre>
  </div>;
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [slide, setSlide] = useState(0);
  const [selected, setSelected] = useState<NodeKey>('pricing');
  const [selectedHouse, setSelectedHouse] = useState<HouseId>('pricing');
  const [flightMode, setFlightMode] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const t = { ...copy[language], ...learningCopy[language] };
  const keys: SlideKey[] = ['overview', 'protocol', 'pricing', 'takeaways'];
  const activeSlide = keys[slide];
  const go = useCallback((index: number) => setSlide((index + keys.length) % keys.length), []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('input,textarea,select,button,[role="button"],[contenteditable="true"]')) return;
      if (event.key === 'Escape') { setHelpOpen(false); setFlightMode(false); return; }
      if (target instanceof HTMLElement && target.tagName === 'CANVAS') return;
      if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); go(slide + 1); }
      if (event.key === 'ArrowLeft') go(slide - 1);
      if (/^[1-4]$/.test(event.key)) go(Number(event.key) - 1);
      if (event.key.toLowerCase() === 'l') setLanguage((value) => value === 'en' ? 'de' : 'en');
      if (event.key === '?') setHelpOpen((value) => !value);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, slide]);
  const onCopy = async (direction: 'request' | 'response') => {
    await navigator.clipboard.writeText(buildJson(selectedHouse, direction));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  const node = nodeMeta[selected];
  const house = houseCatalog.find((entry) => entry.id === selectedHouse);
  if (!house) throw new Error(`Unknown MCP city house: ${selectedHouse}`);
  const NodeIcon = node.icon;
  const slideContent = [
    <><span className="content-kicker"><Network size={14}/> {t.nav[0]}</span><h2>{t.overviewTitle}</h2><p>{t.overviewBody}</p><div className="insight-row"><span className="insight-icon"><Server size={17}/></span><span><strong>{t.highlight}</strong><small>{t.highlightBody}</small></span></div><div className="role-grid"><div><small>{t.roleHost}</small><strong>{t.roleHostBody}</strong></div><div><small>{t.roleClient}</small><strong>{t.roleClientBody}</strong></div><div><small>{t.roleServer}</small><strong>{t.roleServerBody}</strong></div></div><button className="text-link" onClick={() => go(1)}>{t.learnMore} <ArrowUpRight size={15}/></button></>,
    <><span className="content-kicker"><AudioLines size={14}/> {t.nav[1]}</span><h2>{t.protocolTitle}</h2><p>{t.protocolBody}</p></>,
    <><span className="content-kicker"><Zap size={14}/> {t.nav[2]}</span><h2>{t.pricingTitle}</h2><p>{t.pricingBody}</p><div className="price-stat"><span>{t.latency}</span><strong>{t.latencyVal}</strong><small><Activity size={12}/> {t.online}</small></div><div className="pricing-breakdown"><span><i>01</i><b>{t.priceInputTitle}</b><small>{t.priceInputBody}</small></span><span><i>02</i><b>{t.priceRulesTitle}</b><small>{t.priceRulesBody}</small></span><span><i>03</i><b>{t.priceOutputTitle}</b><small>{t.priceOutputBody}</small></span></div><p className="micro-note">{t.secure} <span>·</span> {t.serverTools}</p></>,
    <><span className="content-kicker"><Sparkles size={14}/> {t.nav[3]}</span><h2>{t.takeawayTitle}</h2><p>{t.takeawayBody}</p><div className="takeaway-list"><span><Check size={14}/>{t.line1}</span><span><Check size={14}/>{t.line2}</span><span><Check size={14}/>{t.line3}</span></div><div className="guardrail-card"><Shield size={15}/><span><strong>{t.guardrailTitle}</strong><small>{t.guardrailBody}</small></span></div><button className="text-link" onClick={() => go(0)}>{t.finalCta} <ArrowUpRight size={15}/></button></>,
  ];
  return <main className="app-shell" onTouchStart={(event) => { const target = event.target; if (target instanceof HTMLElement && target.closest('canvas,button,select,a,[data-no-slide-swipe]')) { touchStartX.current = null; return; } touchStartX.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touchStartX.current === null) return; const delta = event.changedTouches[0]!.clientX - touchStartX.current; if (Math.abs(delta) > 80) go(slide + (delta < 0 ? 1 : -1)); touchStartX.current = null; }}>
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <header className="topbar"><a className="brand" href="#home" onClick={(event) => { event.preventDefault(); go(0); }}><span className="brand-mark"><Network size={17}/></span><span><strong>CONTEXT<span>/</span>FIELD</strong><small>MODEL CONTEXT PROTOCOL</small></span></a><nav className="chapter-nav" aria-label="Presentation chapters">{t.nav.map((item, index) => <button key={item} className={slide === index ? 'active' : ''} onClick={() => go(index)}><span>0{index + 1}</span>{item}</button>)}</nav><div className="top-actions"><span className="edition-label">TECH TALK <i>·</i> MCP</span><button className="lang-toggle" onClick={() => setLanguage(language === 'en' ? 'de' : 'en')} aria-label={t.locale}><Globe2 size={14}/>{language.toUpperCase()}</button><button className="icon-button" onClick={() => setHelpOpen(true)} aria-label={t.help}><CircleHelp size={17}/></button></div><button className="mobile-menu" onClick={() => setHelpOpen(true)} aria-label="Open controls"><Menu size={20}/></button></header>
    <div className="main-grid">
      <section className="visual-column">
        <div className="scene-topline"><div><span className="live-dot"/><span>{t.live}</span></div><div className="system-status"><span>{t.online}</span><span className="status-pip"/></div></div>
        <div className={`scene-wrap${flightMode ? ' scene-wrap--flight' : ''}`} aria-label={language === 'en' ? 'Interactive cyber city. Click a server house to inspect its tools.' : 'Interaktive Cyberstadt. Servergebäude anklicken, um die Tools zu erkunden.'} onPointerDownCapture={(event) => { if ((event.target as HTMLElement).tagName === 'CANVAS') (event.target as HTMLCanvasElement).focus(); }}><Canvas dpr={[1, 1.6]} camera={{ position: [0, 15, 23], fov: 52 }} gl={{ antialias: true, alpha: false }}><NetworkScene onSelect={setSelected} motionOn={motionOn && !reducedMotion} activeSlide={activeSlide} language={language} selectedHouse={selectedHouse} onSelectHouse={(entry) => setSelectedHouse(entry.id)}/></Canvas>
          <div className="scene-label scene-label-client"><span className="tiny-icon"><Cpu size={13}/></span><span><small>{t.client}</small><strong>LLM AGENT</strong></span></div>
          <div className="scene-label scene-label-host"><span className="tiny-icon host-icon"><Command size={14}/></span><span><small>{t.hostText}</small><strong>GIFFITS · SYMFONY</strong></span></div>
          <div className="scene-legend"><span className="legend-line cyan"/>{t.outbound}<span className="legend-line violet"/>{t.inbound}</div>
          <div className="scene-hint"><RotateCcw size={12}/>{language === 'en' ? 'DRAG TO LOOK' : 'ZIEHEN ZUM UMSCHAUEN'}<span>·</span>{language === 'en' ? 'WASD MOVE · Q/E UP/DOWN' : 'WASD BEWEGEN · Q/E HOCH/RUNTER'}</div>
          <div className="flight-hud"><span>{language === 'en' ? 'MCP CITY · SELECT A BUILDING' : 'MCP-STADT · GEBÄUDE AUSWÄHLEN'}</span><button onClick={() => setFlightMode((value) => !value)}>{flightMode ? (language === 'en' ? 'EXIT FLIGHT · ESC' : 'FLUG BEENDEN · ESC') : (language === 'en' ? 'FLY THROUGH THE CITY' : 'STADTFLUG STARTEN')} <ArrowUpRight size={13}/></button></div>
          {flightMode && <div className="flight-house-card"><small>{language === 'en' ? 'SELECTED MCP HOUSE' : 'AUSGEWÄHLTES MCP-HAUS'}</small><strong>{house[language].name}</strong><p>{house[language].purpose}</p><div>{house.tools.map((toolName) => <span key={toolName}>{toolName}</span>)}</div></div>}
          {activeSlide === 'overview' && <div className="scene-chip chip-left"><span className="chip-orb"/><span>01 / {t.products}<small>{t.satSub}</small></span></div>}
          {activeSlide === 'overview' && <div className="scene-chip chip-right"><span className="chip-orb green"/><span>02 / {t.prices}<small>{t.satSub}</small></span></div>}
        </div>
        <div className="scene-bottomline"><span>{t.source} <i>·</i> {t.note}</span><div><span>{language === 'en' ? 'CLICK A HOUSE TO INSPECT' : 'HAUS ANKLICKEN · DETAILS ANSEHEN'}</span><button onClick={() => setMotionOn((value) => !value)} aria-label={motionOn ? t.pause : t.resume}>{motionOn ? <Pause size={12}/> : <Play size={12}/>}</button></div></div>
      </section>
      <aside className="story-column">
        <div className="story-heading"><div className="chapter-index"><span>0{slide + 1}</span><i>/</i>04</div><div className="chapter-progress">{keys.map((_, i) => <button key={i} aria-label={`${t.jump} ${i + 1}`} className={i <= slide ? 'filled' : ''} onClick={() => go(i)}/>)}</div></div>
        <AnimatePresence mode="wait"><motion.article className={`story-content${activeSlide === 'protocol' ? ' story-content--protocol' : ''}`} key={`${slide}-${language}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28, ease: 'easeOut' }}>{activeSlide === 'protocol' ? <TransportWalkthrough language={language}/> : slideContent[slide]}</motion.article></AnimatePresence>
        {activeSlide !== 'protocol' && <div className="house-details"><small>{language === 'en' ? 'CITY NODE · MCP SERVER' : 'STADTKNOTEN · MCP-SERVER'}</small><strong>{house[language].name}</strong><p>{house[language].purpose}</p><div>{house.tools.map((toolName) => <span key={toolName}>{toolName}</span>)}</div></div>}
        {activeSlide !== 'protocol' && <><div className="node-inspector"><div className="inspector-title"><div><span className="inspector-icon" style={{ color: node.color }}><NodeIcon size={15}/></span><span><small>{t.inspector}</small><strong>{selected === 'giffits' ? t.hub : selected === 'products' ? t.products : selected === 'pricing' ? t.prices : t.finishing}</strong></span></div><div className="inspector-actions"><select aria-label={t.choose} value={selected} onChange={(event) => { const key = event.target.value as NodeKey; setSelected(key); const matchingHouse = houseCatalog.find((entry) => entry.node === key); if (!matchingHouse) throw new Error(`No city house for MCP node: ${key}`); setSelectedHouse(matchingHouse.id); }}><option value="giffits">{t.hub}</option><option value="products">{t.products}</option><option value="pricing">{t.prices}</option><option value="finishing">{t.finishing}</option></select><span className="node-live"><i/> {t.active}</span></div></div><div className="inspector-meta"><span><small>{t.latency}</small><strong>{selected === 'giffits' ? '8 ms' : selected === 'products' ? '18 ms' : selected === 'pricing' ? '22 ms' : '12 ms'}</strong></span><span><small>{t.capabilities}</small><strong>{selected === 'giffits' ? '12' : '03'} TOOLS</strong></span><span><small>{t.status}</small><strong className="green-text">{t.active}</strong></span></div><div className="tool-tags">{t[node.toolsKey].map((tool) => <span key={tool}><span className="tag-dot"/>{tool}</span>)}</div></div><JsonPanel t={t} houseId={selectedHouse} copied={copied} onCopy={onCopy}/></>}
        <div className="slide-controls"><button onClick={() => go(slide - 1)} disabled={slide === 0}><ArrowLeft size={14}/>{t.previous}</button><span>{t.slideLabel} 0{slide + 1} <i>{t.of}</i> 04</span><button onClick={() => go(slide + 1)} disabled={slide === 3}>{t.next}<ArrowRight size={14}/></button></div>
      </aside>
    </div>
    <footer className="footer-bar"><div><span className="footer-glyph"><Radio size={12}/></span>{t.footer}</div><span className="footer-center">{t.titleTag}</span><div className="footer-right">{t.footerSide}<span>© 2026</span></div></footer>
    <AnimatePresence>{helpOpen && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setHelpOpen(false); }}><motion.div className="help-modal" initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}><button className="modal-close" onClick={() => setHelpOpen(false)} aria-label="Close"><X size={18}/></button><span className="content-kicker"><Command size={14}/> {t.help}</span><h2>{t.helpText}</h2><div className="shortcut-grid"><span><kbd>←</kbd> <kbd>→</kbd><small>{t.nav[0]} → {t.nav[3]}</small></span><span><kbd>1</kbd>–<kbd>4</kbd><small>{t.jump}</small></span><span><kbd>L</kbd><small>{t.locale}</small></span><span><kbd>?</kbd><small>{t.help}</small></span></div><button className="modal-action" onClick={() => { setHelpOpen(false); go(0); }}><RotateCcw size={14}/>{t.restart}</button><p className="modal-note">{t.note}</p></motion.div></motion.div>}</AnimatePresence>
  </main>;
}
