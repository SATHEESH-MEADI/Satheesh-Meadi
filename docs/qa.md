# Website verification

October 12, 2026, branch `develop` (redesign). See the October section at the end. The September notes below describe the previous build.

September 5, 2026, branch `feature/research-portfolio-fieldwork-showcase`.

## Automated checks

- `node tools/check_site.mjs`: passed. Checks source-backed fieldwork totals, regional counts, local images and links, unique anchors, project-detail references, season dates, and provenance records.
- `node --check scripts/main.js` and `node --check scripts/scene.js`: passed.
- `git diff --check`: passed (Git's normal LF/CRLF conversion notices may appear on Windows).
- The supplied CV and website copy have identical SHA-256: `55aad831f252f2844e84b79eda4064eeacd1d33961de06621cfd2f7bf339a932`. See the source files for a fresh hash if the CV is updated.
- Selected research photos were hash-checked before and after reading; no original files were changed. Only resized, metadata-free website derivatives were created.

## Browser checks

Checked in the available Chromium-based in-app browser, using the local preview servers.

- Desktop at 1280 and 1440 pixels; tablet at 768; phones at 390 and 320.
- Corrected the initially clipped small-screen hero headline. No horizontal document overflow at the tested widths. The decorative ET pattern intentionally extends within its clipped image container.
- 3D canvas renders; Canopy, Water and Data controls update their selected state and explanatory copy.
- Caddo and Altus filters show seven dates each; Panhandle shows four dates, with 4, 6, 6 and 2 site visits.
- Date selection updates the journal, image caption and site list.
- Season slider responds to keyboard End, displaying August 19, 2026. The initial frame is June 15.
- All six research/software dialogs open with the correct content and close successfully. Escape closes the native modal.
- Conference view exposes six entries. Publications view contains three papers.
- Mobile menu opens and closes after selecting a navigation link.
- No browser error or warning entries were observed during the final desktop interaction pass. Loaded image checks found no failed images.
- Reviewed the hero, research cards, field journal, biography and mobile layouts visually.

## Scope and limitations

- This is a local website preview. No production deployment, Git push or domain configuration was performed.
- Reduced-motion, data-saving, and WebGL-unavailable paths have static fallback implementations; physical low-end-device performance and cross-browser Safari/Firefox behavior were not measured.
- No Lighthouse score, scientific model re-evaluation, or independent validation of CV performance metrics is claimed.
- External project links returned HTTP 200. The IEEE DOI returned HTTP 202. The nonresolving soil-paper DOI was replaced by the verified publisher article page. ResearchGate and LinkedIn remain external services and may require sign-in or restrict automated access.

## October 12 and 13, 2026 (redesign, then the colour-journey and smooth-scroll revision)

- `node tools/check_site.mjs`: passed (links, images and srcsets, preserved anchors, no em dashes, fieldwork totals, regional counts, season frames, gallery provenance, fonts and vendor files).
- `node --check` on `scripts/main.js`, `scripts/scene.js`, `scripts/content.js`: passed.
- Impeccable design detector (`npx impeccable detect`): remaining findings are static-analysis limits (section padding set through CSS custom properties, unitless heading line-heights) and were inspected in the rendered page.
- Headless Chromium at 1440, 1024 and 390 pixels: no horizontal overflow, no console errors, all images load. Hero, research story (sticky model + layer switching), trip strip, map filters, season slider, gallery lightbox, project dialogs, publication tabs, mobile menu checked.
- Reduced-motion path: reveals, hero wipe and scroll-linked effects disabled; state changes remain visible.
- The GitHub Pages workflow now copies `fonts/` and the local preview server serves `fonts/` and `.avif`.
- October 13: Lenis smooth scrolling, body colour journey across sections (dark, soil, sky, cotton, canopy, orange), word-by-word headings, pinned horizontal season walk (native horizontal scroll under 801px and with reduced motion), gallery of three with parallax, skills and tool wall, memberships and service section. Re-checked at 390 and 1440 pixels with no console errors or horizontal overflow; interactions re-tested.
