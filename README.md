# MCP Tech Talk · Giffits Cyberspace

Eine interaktive, zweisprachige Tech-Talk-Präsentation über das Model Context Protocol (MCP). Die React-, Three.js- und Framer-Motion-Oberfläche stellt den Symfony-basierten Giffits-Webshop als zentralen Knoten dar und verbindet ihn mit Satelliten für Produktdaten, Preise und Veredelungen.

An interactive bilingual tech talk about the Model Context Protocol (MCP). The React, Three.js and Framer Motion interface represents the Symfony-based Giffits shop as the central node and connects it to satellites for product data, pricing and finishing options.

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
- Die Netzwerkansicht zeigt den Giffits-Symfony-Webshop im Zentrum sowie den KI-Client und MCP-Server-Satelliten. / The network view shows the Giffits Symfony webshop at the center, alongside the AI client and MCP server satellites.
- Einen 3D-Knoten oder die barrierefreie Knotenauswahl verwenden. Anfrage oder Antwort im JSON-RPC-Beispiel ansehen und kopieren. / Select any 3D node or use the keyboard-accessible node selector. Inspect and copy the request or response JSON-RPC envelope.
- Die Szene kann mit Maus oder Touch erkundet werden. / Explore the scene with mouse or touch.

## GitHub Pages

Der Workflow in `.github/workflows/deploy.yml` baut das Projekt und veröffentlicht `dist` automatisch bei jedem Push auf `main`. Eine manuelle Ausführung ist über **Actions → Deploy to GitHub Pages → Run workflow** möglich. / The workflow builds the project and deploys `dist` on every push to `main`; it can also be started from **Actions → Deploy to GitHub Pages → Run workflow**.

Aktiviere im Repository unter **Settings → Pages** die Bereitstellung über **GitHub Actions**. Die Vite-Basis ist relativ (`./`), damit Assets auch unter dem Repository-Pfad funktionieren. / In repository settings, choose **GitHub Actions** as the Pages source. Vite uses a relative base (`./`) so assets work under the repository path.

Die veröffentlichte URL folgt dem Schema `https://<account>.github.io/<repository>/`. / The published URL follows `https://<account>.github.io/<repository>/`.
