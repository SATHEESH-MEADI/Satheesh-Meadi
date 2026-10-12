# DESIGN.md

Visual world for satheesh-meadi.github.io, documented from the built site (October 2026). Written for whoever edits the site next, human or agent.

## World: loam and cotton

A field researcher's portfolio that opens in the field. The ground is the green-black of wet Oklahoma soil under a cotton canopy; the type is the white of open bolls; the one hot color is OSU orange, used as a material (whole fields of it) and not as a sprinkle. Photographs are the authority: real, dated, unretouched beyond exposure and tone.

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

Theme is single, dark, locked. Light sections do not exist; the orange contact block is the one full color field and it closes the page.

## Type

- **Bricolage Grotesque** (self-hosted variable, `fonts/`), weight 200 to 800, width 75 to 100. Display at width 88 to 96, weight 650 to 700, tracking -0.025 to -0.035em. Body at weight 420, 17px, line-height 1.6, measure 44 to 62ch.
- **Martian Mono** (self-hosted variable) only for measurement: dates, counts, coordinates, status labels (`.mono`: 12px, uppercase, width 90). Never for body copy or as a "technical" costume.
- Headings carry their own weight. No eyebrows above headings, no section numbers, no middle-dot chains, no em or en dashes anywhere in visible copy (the checker enforces the dash rule).

## Composition

- Hero: full-bleed photograph, headline anchored bottom-left, one primary and one ghost action, a two-line mono stamp bottom-right. Nothing else.
- Research: sticky 3D field model on the left; three research questions scroll on the right and drive the model's layer.
- Fieldwork: stats row, horizontal scroll-snap strip of dated visits, map and detail panel.
- Season: slider with crossfading dated frames.
- Gallery: six-column grid with `wide` (4 columns), `tall` (2 rows) and `square` tiles; captions appear on hover and focus; a native `<dialog>` lightbox with arrow-key navigation.
- Software and publications: typographic lists on hairlines, no cards, no fake previews.
- About: portrait, bio, credentials (orange top rules), education and experience lists, toolkit.
- Contact: orange field with the single contact action, then a quiet footer.

Each layout family appears once. Corner radius is 4px everywhere except circular controls and pill tags.

## Motion (vendor/motion.min.js, MIT)

One authored moment: the hero photograph wipes in from the top while the headline settles word by word (fonts ready first); on scroll the photo recedes (scale 1.08) and the copy drifts up. Supporting motion only explains state: reveals once per element on entry (`[data-reveal]`, 22px rise, 0.8s, stagger capped at 300ms), counters count up once, the research model rotates with scroll position and swaps layers with the active question, the trip photo crossfades.

Easing is `cubic-bezier(0.16, 1, 0.3, 1)`. Routine state changes are 200 to 300ms. Everything spatial collapses under `prefers-reduced-motion`; opacity and state changes remain.

## Browser surfaces

Selection is orange on loam, focus rings are 2px orange with 4px offset, the scrollbar is themed, numerals are tabular in mono. Dialogs use the native element for focus containment.

## Content rules

Claims come from the supplied CV and dated field notes (docs/content-provenance.md). Field counts in the HTML must match `scripts/content.js`; `npm run check` fails otherwise. Photographs keep their capture date and region together; a region never borrows another region's photograph.
