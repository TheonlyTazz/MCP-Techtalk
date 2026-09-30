# MCP Tech Talk · Giffits Cyberspace

Eine interaktive, zweisprachige Tech-Talk-Präsentation über das Model Context Protocol (MCP). Die React-, Three.js- und Framer-Motion-Oberfläche macht aus dem Giffits-Symfony-Shop eine begehbare Cyberstadt: Jedes Servergebäude steht für eine MCP-Fähigkeit und zeigt passende Tools.

An interactive bilingual tech talk about the Model Context Protocol (MCP). The React, Three.js and Framer Motion interface turns the Giffits Symfony shop into a flyable cyber city. Each server house represents an MCP capability and displays its tools.

## Entwicklung · Development

Voraussetzung / Prerequisite: Node.js 22 or newer (Vite 7 requires a current Node.js 20 or 22 release).

```bash
npm install
npm run dev
```

Öffne die von Vite ausgegebene lokale URL. / Open the local URL printed by Vite.

Für eine lokale Vorschau des Produktions-Builds: / To preview a production build locally:

```bash
npm run build
npm run preview
```

## Bedienung · Controls

- Zwischen Deutsch und Englisch über den Sprachschalter wechseln. / Switch between German and English with the language toggle.
- Ein MCP-Haus anklicken, um die Kamera heranzufliegen und rechts dessen Zweck, Tools und ein passendes JSON-RPC-Beispiel zu sehen. / Click an MCP house to fly closer and inspect its purpose, tools and matching JSON-RPC example.
- **Flugmodus:** Die Stadt maximieren. Ziehen dreht die Kamera, Mausrad zoomt; nach einem Klick in die Karte bewegt **W/A/S/D** seitwärts/vorwärts und **Q/E** nach unten/oben. **Shift** beschleunigt. **Esc** beendet den Flugmodus. / **Flight mode:** Expand the city. Drag to look, use the wheel to zoom; click the map, then use **W/A/S/D** to move and **Q/E** to descend/climb. Hold **Shift** to move faster. Press **Esc** to exit flight mode.
- Die neun Beispielhäuser decken Gateway, Produktkatalog, Lagerbestand, Kundenprofile, Preisberechnung, Rabatte, Währung, Veredelung und Produktionsprüfung ab. Die Szene ist eine Illustration und keine Live-Integration mit Giffits. / The nine sample houses cover the gateway, catalog, inventory, customer profiles, pricing, discounts, currency, finishing and production checks. The scene is illustrative and is not a live Giffits integration.

## GitHub Pages

Der Workflow in `.github/workflows/deploy.yml` baut das Projekt und veröffentlicht `dist` automatisch bei jedem Push auf `main`. Eine manuelle Ausführung ist über **Actions → Deploy to GitHub Pages → Run workflow** möglich. / The workflow builds the project and deploys `dist` on every push to `main`; it can also be started from **Actions → Deploy to GitHub Pages → Run workflow**.

Aktiviere im Repository unter **Settings → Pages** die Bereitstellung über **GitHub Actions**. Die Vite-Basis ist relativ (`./`), damit Assets auch unter dem Repository-Pfad funktionieren. / In repository settings, choose **GitHub Actions** as the Pages source. Vite uses a relative base (`./`) so assets work under the repository path.

Die veröffentlichte URL folgt dem Schema `https://<account>.github.io/<repository>/`. / The published URL follows `https://<account>.github.io/<repository>/`.
