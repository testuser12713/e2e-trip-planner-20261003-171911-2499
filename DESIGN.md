# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Ruhiges, modernes Light-UI mit einem klaren Teal-Akzent, inspiriert von Linear/Stripe: reduzierte Farbfläche, klare Typografie und viel Weißraum für einen sachlichen Reiseplaner.

## Colors

- `--color-bg`: **#F7F8FA**
- `--color-surface`: **#FFFFFF**
- `--color-fg`: **#1A1D21**
- `--color-muted`: **#6B7280**
- `--color-border`: **#E2E5EA**
- `--color-accent`: **#0F766E**
- `--color-accent_hover`: **#0D5F59**
- `--color-accent_soft`: **#E6F2F1**
- `--color-danger`: **#B3261E**
- `--color-danger_soft`: **#FBE9E7**
- `--color-success`: **#2E7D32**
- `--color-focus_ring`: **#0F766E**

## Typography

- `font_family`: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- `heading_weight`: 600
- `body_weight`: 400
- `size_scale`: sm: 13px; md: 16px; lg: 20px; xl: 28px

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button

Primär: bg=accent, Text #FFFFFF, padding 12px 24px, radius md, font-size 16px, min-height 44px, min-width 44px. Hover: bg=accent_hover. Active: bg um 8% dunkler + innerer Schatten. Focus-visible: 2px outline focus_ring mit 2px Offset. Disabled: opacity 0.55, pointer-events none. Sekundär: bg=surface, 1px border border, Text fg; Hover: bg=#F0F1F3; Active: bg=#E8EAED. Danger-Variante: bg=danger, Hover #97241B.

### Card

bg=surface, 1px border border, radius lg, padding 16px (mobil) / 24px (Desktop), Box-Shadow 0 1px 2px rgba(16,24,40,0.04). Hover (bei interaktiven Karten): border wird accent_soft, Schatten 0 4px 12px rgba(16,24,40,0.08).

### Input

bg=surface, 1px border border, radius md, padding 10px 12px, font-size 16px (verhindert iOS-Zoom), min-height 44px. Focus: border=accent + 2px Ring focus_ring mit 2px Offset. Fehler: border=danger + Hintergrund danger_soft; Fehlertext 13px in danger direkt unter dem Feld.

### Badge/Kategorie

Radius pill, padding 4px 10px, font-size 13px, Schriftfarbe fg, Hintergrund accent_soft, 1px border #CBE5E2. Farbliche Kategorie-Codierung bleibt dezent und verwendet nur accent_soft mit dunklerem Text.

### Fortschrittsbalken

Höhe 8px, radius pill, Hintergrund border, Füllung bg=accent. Beschriftung daneben in muted, z. B. '3 von 7 gepackt'. Budget-Balken: Höhe 12px, radius sm, Hintergrund #EEF0F2, Füllung accent bei aktiven Kategorien.

### Modal/Dialog

Overlay: rgba(26,29,33,0.45) über gesamter Fläche. Dialog: bg=surface, radius lg, max-width 420px, padding 24px, Box-Shadow 0 16px 40px rgba(16,24,40,0.2). Titel in lg/600, Aktionen rechtsbündig mit 12px Abstand. Schließen per Escape, Overlay-Klick und sichtbarem Schließen-Button (44px Touch-Target).

### Tab-Navigation

Horizontale Unter-Navigation: border-bottom 1px border. Aktiver Tab: Schriftfarbe accent, 2px Unterstreichung accent, font-weight 600. Inaktiver Tab: muted, Hover fg. Tab-Höhe min. 44px, padding 12px 16px, Fokus wie Button.

## Layout Principles

- Container: max-width 1040px, horizontal zentriert, padding 16px mobil / 24px ab 640px.
- Breakpoints: mobil < 640px, Tablet 640–960px, Desktop > 960px; Inhalte stapeln mobil, ab Tablet ein- bis zweispaltiges Grid (minmax(0, 1fr)).
- Vertikaler Rhythmus: 24px zwischen Sektionen, 16px zwischen Elementgruppen, 8–12px innerhalb einer Gruppe.
- Reiseliste als responsives Grid: 1 Spalte mobil, 2 Spalten ab 640px, 3 Spalten ab 960px.
- Kein horizontales Scrollen bei 360px: alle Tabellen-ähnlichen Strukturen werden unter 640px in Block-Layout überführt.
- Sichtbare Fokus-Zustände auf allen interaktiven Elementen; interaktive Elemente mindestens 44px hoch/breit.
