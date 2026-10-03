# Reiseplaner

Eine lokal gespeicherte Reiseplaner-Web-App. Reisende verwalten Reisen mit Ziel
und Zeitraum, planen pro Tag Aktivitäten mit Uhrzeit, Ort, Kosten und Kategorie,
sehen eine Budget-Übersicht mit Balkendiagramm je Kategorie und arbeiten eine
Packliste mit Abhaken ab. Alles läuft ohne Backend im Browser und speichert die
Daten im `localStorage`.

## Tech-Stack

- **React** (mit TypeScript)
- **Vite** (Build & Dev-Server)
- **React Router** (Routing)
- **Vitest** (Unit-Tests)
- **CSS** mit Design-Tokens (kein UI-/Chart-Framework)

## Installation

Voraussetzung: Node.js ≥ 20.

```bash
npm ci
```

## Entwicklung

```bash
npm run dev
```

Öffne danach die angezeigte URL (standardmäßig `http://localhost:5173`).

## Build für Produktion

```bash
npm run build
```

Das Ergebnis liegt im Ordner `dist/` und kann statisch ausgeliefert werden.

## Tests

```bash
npm test
```

## Bedienung

Die App gliedert sich in drei Bereiche je Reise:

- **Reiseliste** (`/`): Übersicht aller Reisen. Hier legst du Reisen mit Ziel,
  Start- und Enddatum an, bearbeitest oder löschst sie.
- **Tagesplan** (`/trips/:id/plan`): Alle Tage des Zeitraums in chronologischer
  Reihenfolge; pro Tag Aktivitäten mit Uhrzeit, Ort, Kosten und Kategorie.
- **Budget** (`/trips/:id/budget`): Kostenübersicht je Kategorie als
  Balkendiagramm plus Gesamtsumme.
- **Packliste** (`/trips/:id/packing`): Einträge anlegen, abhaken und löschen,
  mit Fortschrittsanzeige.

Unbekannte Routen zeigen eine 404-Seite mit Link zurück zur Reiseliste.

## Features

- Reisen anlegen, bearbeiten und löschen (mit Bestätigung)
- Tagesplan mit chronologisch sortierten Aktivitäten und Tagessumme
- Budget-Übersicht je Kategorie mit proportionalen Balken
- Packliste mit Fortschrittsanzeige
- Persistenz im `localStorage` (überlebt Neuladen), defensive Normalisierung
  beschädigter Daten
- Responsives Layout ohne horizontales Scrollen (ab 360 px Breite)
- Sichtbare Fokus-Zustände auf allen interaktiven Elementen
