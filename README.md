# Satheesh Meadi

PhD researcher in Biosystems & Agricultural Engineering at Oklahoma State University, connecting agricultural water management, geospatial analytics, and applied AI.

This repository contains my personal research portfolio: a custom 3D agricultural field, research and software projects, publications, education, and a photographic fieldwork journal.

## Preview locally

With Node.js 20 or newer:

```sh
npm start
```

Open http://127.0.0.1:4173. There are no npm dependencies to install and no build step. The development server serves only website asset directories and listens on the local machine.

To use another port, set the `PORT` environment variable. A standard static server also works, for example `python -m http.server 4173 --bind 127.0.0.1`.

## Validate

```sh
npm run check
```

Checks local links, image files, section IDs, project detail references, and fieldwork counts against the reviewed source records. Browser QA covered desktop, tablet and phone layouts, the 3D layer buttons, regional filters, date selection, project dialogs, navigation, and the seven-frame season slider. See `docs/qa.md` for the recorded checks and limitations.

## Edit the site

| File | Purpose |
| --- | --- |
| `index.html` | Profile, research, publications, education, and semantic page structure |
| `styles/main.css` | Responsive design, typography, colors, and layouts |
| `scripts/content.js` | Dated field visits and project detail copy |
| `scripts/main.js` | Navigation, filters, dialogs, season slider, and 3D loading |
| `scripts/scene.js` | Procedural Three.js crop field and sensor illustration |
| `images/fieldwork/` | Optimized copies of selected field photographs |
| `assets/Satheesh-Meadi-CV.pdf` | Supplied July 22, 2026 CV |
| `docs/content-provenance.md` | Content sources, counting rules, and scope |
| `docs/asset-provenance.json` | Photo sources and hashes of original files |

### Fieldwork data

The current journal contains **11 distinct fieldwork dates and 36 site visits**, June–August 2026, across Caddo, Altus, and Panhandle PDS. Only field-note attendance lists naming Satheesh are included. Multiple site visits on one date are not counted as multiple travel dates. These records do not represent the full eight-month fieldwork history.

`tools/prepare_assets.py` regenerates WebP derivatives using Pillow, given `--field-root` pointing to the original `2026 Field Trips` directory. It reads and hash-checks the sources, never edits them. Original notes, raw datasets, and photographs remain outside this repository. Network-drive access is not required to run the website.

### Graphics and accessibility

The About portrait uses professional shot `satheesh-meadi-260324-0016.jpg`. `tools/prepare_portrait.py --source <original-file>` creates its optimized web copy and source-hash record without altering the original. Portrait preparation is separate from field-photo preparation.

Three.js **0.180.0** is vendored locally with its MIT license. The scene renders on interaction or resize rather than running a perpetual animation loop, pauses rendering offscreen, and caps device pixel ratio. Reduced-motion and data-saving preferences use the static SVG illustration. Unsupported WebGL also retains that illustration. The decorative scene is separate from the accessible layer controls and explanatory text.

Other features include a skip link, native modal dialogs, keyboard controls, visible focus states, responsive navigation, labeled photography, and lazy-loaded images. Google Fonts supplies DM Sans and Instrument Serif with local system-font fallbacks. No analytics or third-party contact form is configured.

## Hosting

The live portfolio is published at **https://satheesh-meadi.github.io/Satheesh-Meadi/**.

Pushing to `main` runs `.github/workflows/pages.yml`: validate the portfolio, package `index.html` with `styles/`, `scripts/`, `images/`, `assets/`, and `vendor/`, then deploy to GitHub Pages. Repository documentation, provenance records, and preparation tools are excluded from the website artifact. Pages uses GitHub Actions as its publishing source. The site supports both a domain root and a repository subpath through relative asset URLs. Local preview does not publish changes.

## Connect

- [GitHub](https://github.com/SATHEESH-MEADI)
- [LinkedIn](https://www.linkedin.com/in/satheesh-meadi/)
- [Email](mailto:satheesh.meadi@okstate.edu)
