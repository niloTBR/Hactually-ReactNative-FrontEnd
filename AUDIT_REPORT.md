# Hactually Design System Audit Report
Generated: 2026-04-06

## Priority Actions

### P1 — Bugs
1. CheckedInScreen: duplicate `dmHeaderAvatar` StyleSheet key (line ~1379 vs ~1393)
2. Web-only `<style>`, `<div>`, `clipPath`, `boxShadow` in CheckedIn + Spots — will crash on native

### P2 — Token System Gaps (add before fixing screens)
3. Add opacity tokens: `'CC'` (80%), `'B3'` (70%), `'66'` (40%), `'26'` (15%), `'14'` (8%)
4. Add micro typography: `typography.micro` (10px), `typography.label` (11px)
5. Add `LightOliveTheme` preset to GhostTheme.js for Edit Profile light forms
6. Replace 6 manual shadow definitions with `shadows.card` / `shadows.sm`

### P3 — Component Library Gaps
7. Extract `Toggle` from ProfileScreen into component library
8. Migrate Badge + Tabs to LEAN `color` tokens (currently use legacy `colors`)
9. Use `Input`/`GhostInput` for raw TextInputs in CheckedIn (chat) + Matches (DM)
10. Update StyleGuide: add Badge, Tabs, SocialButton, MeMarker, LocationDropdown, FormError

### P4 — Systematic Token Replacement
11. Replace all circular `borderRadius: N` with `radius.full`
12. Replace `borderRadius: 18` (36px pills) with `radius.full`
13. Normalize sub-token spacing (marginTop: 1/2, gap: 2) — accept or add `spacing.hairline`
14. Button.js: replace raw sizeConfig values with spacing tokens

### P5 — Component Internal Cleanup
15. All 6 components importing `colors` → migrate to `color` (LEAN)

## Violation Counts by Screen

| Screen | fontSize | radius | spacing | opacity | shadows | web-only | total |
|--------|----------|--------|---------|---------|---------|----------|-------|
| CheckedIn | 20+ | 8+ | 6+ | 10+ | 2 | 15+ | 55+ |
| Matches | 14 | 6 | 3 | 5+ | 1 | 0 | 25+ |
| Profile | 14 | 5 | 3 | 2+ | 0 | 0 | 22+ |
| Spots | 5 | 8 | 1 | 3+ | 0 | 4 | 14+ |
| Home | 0 | 0 | 2 | 1 | 2 | 0 | 5 |
| VenueCheckIn | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| Welcome | 0 | 2 | 0 | 3 | 0 | 0 | 5 |
| AuthOptions | 0 | 0 | 1 | 2 | 0 | 0 | 3 |
| OTP | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| Location | 0 | 1 | 0 | 1 | 0 | 0 | 2 |
| ProfileSetup | 0 | 0 | 0 | 4 | 0 | 0 | 4 |
| StyleGuide | 4+ | 0 | 3+ | 0 | 0 | 0 | 7+ |

## Light Form Style
- Used in EditProfile via `<GhostTheme themeColor={color.charcoal} isDark={false}>`
- No named preset exists — need to add `LightOliveTheme` to GhostTheme.js
- `inputStyles.solid` token exists but is unused in practice
