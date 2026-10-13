# DESIGN.md

Visual world for satheesh-meadi.github.io, documented from the built site (October 2026). Written for whoever edits the site next, human or agent.

## World: loam and cotton, a colour journey

A field researcher's portfolio that opens in the field. The page ground is not fixed: as the reader scrolls, the body colour morphs through the places the work happens. Loam green-black under the research model, Oklahoma red soil for the fieldwork journal, an overcast sky for the walk through the season, cotton white for the photographs, deep canopy green for software and skills, back to loam for papers and biography, red soil for service, and OSU orange for the close. Type is the white of open bolls on dark grounds and ink green on light ones. OSU orange is the only accent and the one full colour field. Photographs are the authority: real, dated, unretouched beyond exposure and tone.

The old look (cream paper, italic display serif, tracked mono eyebrows, numbered sections) was retired on purpose. Do not bring those back as polish.

## Tokens (styles/main.css `:root`)

| Token | Value | Role |
| --- | --- | --- |
| `--loam` | `#0e1813` | page ground |
| `--loam-2` | `#15221b` | alternate section ground (fieldwork, gallery, dialogs) |
| `--loam-3` | `#1c2d24` | hover surface, image placeholders |
| `--cotton` | `#f3f1e8` | primary text |
| `--cotton-2` | `#c3cdc3` | secondary text, tinted from the hue, never gray |
| `--sage` | `#93a897` | mono labels, captions (6.5:1 on loam) |
| `--orange` | `#fe5c00` | OSU orange: primary action, result numerals, the contact block |
| `--line` / `--line-strong` | cotton at 14% / 30% | hairline rules |

Section grounds are declared on each section (`data-bg`, `data-theme`), and `html[data-theme]` swaps the text and line tokens (`--fg`, `--fg-2`, `--muted`, `--line`, `--surface`) between dark, light and orange. The body background transitions over 0.9s when the section crossing the middle of the viewport changes. The footer and dialogs stay loam.

## Type

- **Bricolage Grotesque** (self-hosted variable, `fonts/`), weight 200 to 800, width 75 to 100. Display at width 88 to 96, weight 650 to 700, tracking -0.025 to -0.035em. Body at weight 420, 17px, line-height 1.6, measure 44 to 62ch.
- **Martian Mono** (self-hosted variable) only for measurement: dates, counts, coordinates, status labels (`.mono`: 12px, uppercase, width 90). Never for body copy or as a "technical" costume.
- Headings carry their own weight. No eyebrows above headings, no section numbers, no middle-dot chains, no em or en dashes anywhere in visible copy (the checker enforces the dash rule).

## Composition

- Hero: full-bleed photograph, headline anchored bottom-left, one primary and one ghost action, a two-line mono stamp bottom-right. Nothing else.
- Research: sticky 3D field model on the left; three research questions scroll on the right and drive the model's layer.
- Fieldwork: stats row, horizontal scroll-snap strip of dated visits, map and detail panel.
- Season: a pinned horizontal walk through seven dated frames (vertical scroll pans the track; native horizontal scroll with snap under 801px and with reduced motion).
- Gallery: three photographs, one tall and two wide, with a slow parallax inside each frame and a native `<dialog>` lightbox with arrow-key navigation.
- Skills: seven groups of pills from the CV, then a monochrome tool wall from Simple Icons.
- Service: memberships, committees and roles as a numbered editorial list.
- Software and publications: typographic lists on hairlines, no cards, no fake previews.
- About: portrait, bio, credentials (orange top rules), education and experience lists, toolkit.
- Contact: orange field with the single contact action, then a quiet footer.

Each layout family appears once. Corner radius is 4px everywhere except circular controls and pill tags.

## Motion (vendor/motion.min.js, MIT)

Scrolling is smoothed with Lenis (lerp 0.09, vendored). One authored moment: the hero photograph wipes in from the top while the headline settles word by word (fonts ready first), then drifts very slowly; on scroll the copy drifts up. Every display heading settles word by word on entry (`[data-words]`, 0.9s, blur to sharp, 55ms stagger) and blocks rise once (`[data-reveal]`, 18px, blur to sharp). Counters count up once, the research model rotates with scroll position and swaps layers with the active question, gallery images parallax inside their frames, the season track pans with the scroll, primary buttons are magnetic on fine pointers, and the one marquee runs only while on screen.

Easing is `cubic-bezier(0.16, 1, 0.3, 1)`. Routine state changes are 200 to 300ms. Everything spatial collapses under `prefers-reduced-motion`; opacity and state changes remain.

## Browser surfaces

Selection is orange on loam, focus rings are 2px orange with 4px offset, the scrollbar is themed, numerals are tabular in mono. Dialogs use the native element for focus containment.

## Content rules

Claims come from the supplied CV and dated field notes (docs/content-provenance.md). Field counts in the HTML must match `scripts/content.js`; `npm run check` fails otherwise. Photographs keep their capture date and region together; a region never borrows another region's photograph.
