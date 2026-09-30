import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import './TransportWalkthrough.css';

export type TransportWalkthroughLanguage = 'en' | 'de';

interface WalkthroughCopy {
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  body: string;
  diagram: string[];
  snippet: string;
  note: string;
}

interface TransportStep {
  id: string;
  accent: 'cyan' | 'violet' | 'green' | 'amber';
  en: WalkthroughCopy;
  de: WalkthroughCopy;
}

const steps: TransportStep[] = [
  {
    id: 'server-discover',
    accent: 'cyan',
    en: {
      number: '01',
      eyebrow: 'SERVER / DISCOVER',
      title: 'The client learns what exists',
      summary: 'A server discovery call makes version and identity visible up front.',
      body: 'server/discover is implemented by the server and can be called by a client before it selects a tool. The response exposes the protocol version, server capabilities, and serverInfo identity. Requests carry the client protocol version, clientInfo, and clientCapabilities in params._meta so both sides have the context needed for discovery.',
      diagram: ['MCP client', 'server/discover', 'MCP server'],
      snippet: '{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "method": "server/discover",\n  "params": {\n    "_meta": {\n      "io.modelcontextprotocol/protocolVersion": "2026-07-28",\n      "io.modelcontextprotocol/clientInfo": { "name": "Giffits AI", "version": "1.0" },\n      "io.modelcontextprotocol/clientCapabilities": {}\n    }\n  }\n}\n\n// response\n{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "result": {\n    "resultType": "complete",\n    "supportedVersions": ["2026-07-28"],\n    "capabilities": { "tools": { "listChanged": true } },\n    "_meta": { "io.modelcontextprotocol/serverInfo": { "name": "Giffits MCP Gateway", "version": "1.0" } }\n  }\n}',
      note: 'Version + capabilities + serverInfo make the connection explicit.',
    },
    de: {
      number: '01',
      eyebrow: 'SERVER / ENTDECKEN',
      title: 'Der Client lernt, was existiert',
      summary: 'Eine Server-Discovery macht Version und Identität früh sichtbar.',
      body: 'server/discover wird vom Server implementiert und kann vor der Tool-Auswahl durch den Client aufgerufen werden. Die Antwort zeigt Protokollversion, Server-Fähigkeiten und die serverInfo-Identität. Requests tragen Client-Version, clientInfo und clientCapabilities in params._meta, damit beide Seiten den Kontext der Discovery kennen.',
      diagram: ['MCP-Client', 'server/discover', 'MCP-Server'],
      snippet: '{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "method": "server/discover",\n  "params": {\n    "_meta": {\n      "io.modelcontextprotocol/protocolVersion": "2026-07-28",\n      "io.modelcontextprotocol/clientInfo": { "name": "Giffits AI", "version": "1.0" },\n      "io.modelcontextprotocol/clientCapabilities": {}\n    }\n  }\n}\n\n// Antwort\n{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "result": {\n    "resultType": "complete",\n    "supportedVersions": ["2026-07-28"],\n    "capabilities": { "tools": { "listChanged": true } },\n    "_meta": { "io.modelcontextprotocol/serverInfo": { "name": "Giffits MCP Gateway", "version": "1.0" } }\n  }\n}',
      note: 'Version + Fähigkeiten + serverInfo machen die Verbindung eindeutig.',
    },
  },
  {
    id: 'tools-list',
    accent: 'violet',
    en: {
      number: '02',
      eyebrow: 'TOOLS / LIST',
      title: 'The server describes its tools',
      summary: 'Discovery returns a contract the model can reason about.',
      body: 'tools/list exposes the server-owned catalog. Every tool has a stable name, a human-readable description, and an inputSchema. The schema is the guardrail: it tells the client which fields are required, which types are accepted, and what the server expects before execution.',
      diagram: ['MCP client', 'tools/list', 'tool catalog'],
      snippet: '{\n  "jsonrpc": "2.0",\n  "id": 2,\n  "method": "tools/list",\n  "params": {\n    "_meta": {\n      "io.modelcontextprotocol/protocolVersion": "2026-07-28",\n      "io.modelcontextprotocol/clientInfo": { "name": "Giffits AI", "version": "1.0" },\n      "io.modelcontextprotocol/clientCapabilities": {}\n    }\n  }\n}\n\n// response\n{\n  "jsonrpc": "2.0",\n  "id": 2,\n  "result": {\n    "resultType": "complete",\n    "tools": [{\n      "name": "price.quote",\n      "description": "Quote a product",\n      "inputSchema": { "type": "object" }\n    }]\n  }\n}',
      note: 'Names are stable; descriptions guide the model; inputSchema constrains arguments.',
    },
    de: {
      number: '02',
      eyebrow: 'TOOLS / LIST',
      title: 'Der Server beschreibt seine Tools',
      summary: 'Die Entdeckung liefert einen Vertrag, den das Modell nutzen kann.',
      body: 'tools/list stellt den servereigenen Katalog bereit. Jedes Tool besitzt einen stabilen Namen, eine verständliche Beschreibung und ein inputSchema. Das Schema ist die Leitplanke: Es legt fest, welche Felder erforderlich sind, welche Typen gelten und was der Server vor der Ausführung erwartet.',
      diagram: ['MCP-Client', 'tools/list', 'Tool-Katalog'],
      snippet: '{\n  "jsonrpc": "2.0",\n  "id": 2,\n  "method": "tools/list",\n  "params": {\n    "_meta": {\n      "io.modelcontextprotocol/protocolVersion": "2026-07-28",\n      "io.modelcontextprotocol/clientInfo": { "name": "Giffits AI", "version": "1.0" },\n      "io.modelcontextprotocol/clientCapabilities": {}\n    }\n  }\n}\n\n// Antwort\n{\n  "jsonrpc": "2.0",\n  "id": 2,\n  "result": {\n    "resultType": "complete",\n    "tools": [{\n      "name": "price.quote",\n      "description": "Quote a product",\n      "inputSchema": { "type": "object" }\n    }]\n  }\n}',
      note: 'Namen bleiben stabil; Beschreibungen führen das Modell; inputSchema begrenzt Argumente.',
    },
  },
  {
    id: 'tools-call',
    accent: 'green',
    en: {
      number: '03',
      eyebrow: 'TOOLS / CALL',
      title: 'A typed request crosses the boundary',
      summary: 'The model proposes; the server validates and decides.',
      body: 'tools/call names one discovered tool and carries typed arguments. The MCP server validates the payload, applies authorization, and runs the shop business logic. User control still matters: a client can show the proposed action, request confirmation, or deny it before the side effect happens.',
      diagram: ['model intent', 'typed args', 'validation → domain logic'],
      snippet: '{\n  "jsonrpc": "2.0",\n  "id": 42,\n  "method": "tools/call",\n  "params": {\n    "_meta": {\n      "io.modelcontextprotocol/protocolVersion": "2026-07-28",\n      "io.modelcontextprotocol/clientInfo": { "name": "Giffits AI", "version": "1.0" },\n      "io.modelcontextprotocol/clientCapabilities": {}\n    },\n    "name": "price.quote",\n    "arguments": {\n      "sku": "GF-2048",\n      "quantity": 250\n    }\n  }\n}',
      note: 'The server owns validation, permissions, and business truth.',
    },
    de: {
      number: '03',
      eyebrow: 'TOOLS / CALL',
      title: 'Eine typisierte Anfrage überschreitet die Grenze',
      summary: 'Das Modell schlägt vor; der Server prüft und entscheidet.',
      body: 'tools/call benennt ein entdecktes Tool und überträgt typisierte Argumente. Der MCP-Server validiert die Nutzdaten, prüft Berechtigungen und führt die Shop-Fachlogik aus. Die Kontrolle bleibt beim Nutzer: Der Client kann die Aktion anzeigen, eine Bestätigung verlangen oder sie vor dem Seiteneffekt ablehnen.',
      diagram: ['Modellabsicht', 'typisierte Args', 'Validierung → Fachlogik'],
      snippet: '{\n  "jsonrpc": "2.0",\n  "id": 42,\n  "method": "tools/call",\n  "params": {\n    "_meta": {\n      "io.modelcontextprotocol/protocolVersion": "2026-07-28",\n      "io.modelcontextprotocol/clientInfo": { "name": "Giffits AI", "version": "1.0" },\n      "io.modelcontextprotocol/clientCapabilities": {}\n    },\n    "name": "price.quote",\n    "arguments": {\n      "sku": "GF-2048",\n      "quantity": 250\n    }\n  }\n}',
      note: 'Der Server besitzt Validierung, Berechtigungen und fachliche Wahrheit.',
    },
  },
  {
    id: 'response',
    accent: 'amber',
    en: {
      number: '04',
      eyebrow: 'JSON-RPC / RESPONSE',
      title: 'The result comes back with a clear signal',
      summary: 'The id correlates the response; the payload carries meaning.',
      body: 'A successful response keeps the same id and returns a result with content blocks. A tool-level isError means the tool ran but reported a domain failure, such as an unavailable variant. A JSON-RPC error means the request itself failed at the protocol boundary, for example because the method or parameters were invalid.',
      diagram: ['server result', 'same id: 42', 'client renders meaning'],
      snippet: '{\n  "jsonrpc": "2.0",\n  "id": 42,\n  "result": {\n    "resultType": "complete",\n    "isError": false,\n    "content": [{\n      "type": "text",\n      "text": "€18.40 per item"\n    }]\n  }\n}',
      note: 'result.isError is tool-level; top-level error is JSON-RPC-level.',
    },
    de: {
      number: '04',
      eyebrow: 'JSON-RPC / ANTWORT',
      title: 'Das Ergebnis kommt mit einem klaren Signal zurück',
      summary: 'Die id ordnet die Antwort zu; die Nutzdaten tragen die Bedeutung.',
      body: 'Eine erfolgreiche Antwort behält dieselbe id und liefert ein result mit Content-Blöcken. isError auf Tool-Ebene bedeutet: Das Tool lief, meldet aber einen fachlichen Fehler, etwa eine nicht verfügbare Variante. Ein JSON-RPC-Fehler bedeutet: Die Anfrage scheiterte an der Protokollgrenze, zum Beispiel wegen Methode oder Parametern.',
      diagram: ['Server-Ergebnis', 'gleiche id: 42', 'Client zeigt Bedeutung'],
      snippet: '{\n  "jsonrpc": "2.0",\n  "id": 42,\n  "result": {\n    "resultType": "complete",\n    "isError": false,\n    "content": [{\n      "type": "text",\n      "text": "€18.40 per item"\n    }]\n  }\n}',
      note: 'result.isError gehört zum Tool; error auf oberster Ebene gehört zu JSON-RPC.',
    },
  },
];

export interface TransportWalkthroughProps {
  language: TransportWalkthroughLanguage;
}

export function TransportWalkthrough({ language }: TransportWalkthroughProps) {
  const [openStep, setOpenStep] = useState<string>(steps[0].id);
  const headingId = useId();

  return (
    <section className="transport-walkthrough" aria-labelledby={`${headingId}-title`}>
      <div className="transport-walkthrough__header">
        <div>
          <span className="transport-walkthrough__kicker">MCP · 2026-07-28 · JSON-RPC 2.0</span>
          <h2 id={`${headingId}-title`}>{language === 'de' ? 'Transport, Schritt für Schritt' : 'Transport, step by step'}</h2>
          <p>{language === 'de' ? 'Öffne eine Phase, um zu sehen, welche Nachricht die nächste Grenze passiert.' : 'Open a phase to see which message crosses the next boundary.'}</p>
        </div>
        <span className="transport-walkthrough__count">{language === 'de' ? '4 PHASEN' : '4 PHASES'}</span>
      </div>

      <div className="transport-walkthrough__list">
        {steps.map((step) => {
          const copy = step[language];
          const isOpen = openStep === step.id;
          const panelId = `${headingId}-${step.id}-panel`;
          const buttonId = `${headingId}-${step.id}-button`;
          return (
            <div className={`transport-step transport-step--${step.accent}${isOpen ? ' is-open' : ''}`} key={step.id}>
              <button
                id={buttonId}
                className="transport-step__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenStep(isOpen ? '' : step.id)}
              >
                <span className="transport-step__number">{copy.number}</span>
                <span className="transport-step__labels">
                  <span className="transport-step__eyebrow">{copy.eyebrow}</span>
                  <strong>{copy.title}</strong>
                </span>
                <span className="transport-step__summary">{copy.summary}</span>
                <span className="transport-step__chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <motion.div
                id={panelId}
                className="transport-step__panel"
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <div className="transport-step__content">
                  <p>{copy.body}</p>
                  <div className="transport-step__diagram" aria-label={language === 'de' ? 'Nachrichtenfluss' : 'Message flow'}>
                    {copy.diagram.map((part, index) => (
                      <span className="transport-step__diagram-item" key={part}>
                        <span>{part}</span>
                        {index < copy.diagram.length - 1 ? <i aria-hidden="true">→</i> : null}
                      </span>
                    ))}
                  </div>
                  <pre className="transport-step__snippet"><code>{copy.snippet}</code></pre>
                  <p className="transport-step__note">{copy.note}</p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TransportWalkthrough;


