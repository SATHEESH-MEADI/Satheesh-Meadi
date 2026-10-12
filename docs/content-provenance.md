# Website content provenance

Reviewed September 5, 2026; redesign and additions October 12, 2026. Research originals were accessed read-only. Raw field notes are not included in this repository.

## October 2026 additions

- Memberships, credentials and service were stated directly by Satheesh on October 12, 2026: IEEE member, ASABE member, NCEES FE exam passed, and BAE GSA Social Chair (Biosystems and Agricultural Engineering Graduate Student Association, Oklahoma State University) since August 2026. They are not yet in the July 22, 2026 CV copied in `assets/`; update the CV file when a newer version is supplied.
- Six photographs in `images/field/` (cotton at harvest stage, a sensor station check, and two team photographs beside a rain gauge in harvested corn) were supplied directly by Satheesh. Captions avoid site names and dates until the matching field notes are read; `asset-provenance.json` records the SHA-256 of each original. Processing: EXIF orientation, gentle levels and tone curve, mild saturation, unsharp mask, proportional resize, AVIF and WebP export. No content retouching. Originals are kept outside the repository (`.local/photos/originals`, git-ignored).
- Fieldwork dates and counts are unchanged from September 5 (11 dates, 36 site visits). Later 2026 visits will be added once the corresponding notes are reviewed.
- Fonts are self-hosted: Bricolage Grotesque and Martian Mono (SIL Open Font License, licenses in `fonts/`). Animation uses the vendored Motion library (MIT, `vendor/`).

## Profile

Primary source: the supplied five-page CV, `main (3).pdf`, updated July 22, 2026. The exact supplied file is copied to `assets/Satheesh-Meadi-CV.pdf` for the approved CV links.

- Handshake fellowship corrected to August–December 2025.
- Education, professional roles, academic service, three publications and six conference contributions follow the CV.
- The 53% reduction applies to early-season canopy measurement error. The CV also reports RMSE 1.52 °C; no broader accuracy claim is added.
- Seventeen states describes the humidity research scope, not a completed extraction count. Five states describes the CV's ET analysis.
- Unsupported older website roles, certifications and generalized impact claims are not carried forward.
- Software repository links were retained from the original website and returned HTTP 200 during checks.
- The soil-fertility DOI returned HTTP 404; the website uses the verified publisher article page at https://www.pnrjournal.com/index.php/home/article/view/1622 instead.
- The IEEE DOI returned HTTP 202 during the link check. Its bibliographic details follow the supplied CV.
- Conference contributions include coauthored entries; the site does not label Satheesh as the presenter of every entry.

## Fieldwork

Sources, relative to the user's `2026 Field Trips` directory:

1. `2026_CRS/CRS_2026.docx`
2. `2026_Altus/Muller Merrit River/MMR_2026.docx`
3. `2026_Altus/SWREC/SWREC_2026.docx`
4. `2026_Panhandle_PDS/2025-Present_PH_FieldNotes.docx`

Only dated entries whose `Visited:` list explicitly includes Satheesh are included. A calendar date counts once as a fieldwork date. Each site visited on that date counts as a site visit. Earlier 2025 notes and 2026 visits listing only other team members are excluded.

| Dates in 2026 | Caddo | MMR | SWREC | Panhandle stops |
| --- | ---: | ---: | ---: | ---: |
| June 15 | 1 | 1 | 0 | 0 |
| June 30 | 1 | 1 | 0 | 0 |
| July 8 | 1 | 1 | 0 | 0 |
| July 10 | 0 | 0 | 0 | 4 |
| July 20 | 1 | 1 | 1 | 0 |
| July 30 | 1 | 1 | 1 | 0 |
| August 5 | 0 | 0 | 0 | 6 |
| August 12 | 1 | 1 | 1 | 0 |
| August 14 | 0 | 0 | 0 | 6 |
| August 19 | 1 | 1 | 1 | 0 |
| August 21 | 0 | 0 | 0 | 2 |
| Total | 7 | 7 | 4 | 18 |

Total: 11 distinct dates, 36 site visits, across three regional groupings. The inspected folders establish June–August fieldwork, not a complete January–August history. August 26 and 31 are excluded because the attendance lists do not include Satheesh.

The map uses the U.S. Census Bureau ACS2024 generalized 1:5M Oklahoma boundary, projected with longitude scaled by cos(36 degrees). Markers indicate approximate regions, not exact farm coordinates; no travel routes are drawn. Source: https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2024/State_County/MapServer/8. The downloaded geometry is preserved in oklahoma-boundary.geojson; tools/prepare_map.py rebuilds the SVG. Field diary summaries describe the full travel day; regional filters narrow the displayed site list. Team activities retain plural attribution unless the notes identify Satheesh's contribution.

## Media

The About portrait uses professional shot `satheesh-meadi-260324-0016.jpg`, selected from the user-designated Professional Headshots folder. The 8192 × 5464 original is preserved; the website uses an sRGB WebP derivative. `portrait-provenance.json` records its source and output hashes. Recreate it with `tools/prepare_portrait.py --source <original-file>`. The field-photo preparation script does not overwrite this portrait.

`asset-provenance.json` records each photo derivative's source-relative path and SHA-256 of the original. Source hashes were checked before and after reading. WebP exports are resized and oriented copies; original research photos remain unchanged. EXIF is not retained in web copies. Captions identify source dates and locations. The season viewer uses seven actual Caddo visit-date folders; viewpoints vary and no image-derived growth measurement is claimed.

The 3D field, evapotranspiration pattern and software artwork are schematic illustrations. They do not display live sensor measurements or measured ET values.

The region filter selects photographs by both capture date and region. Caddo uses only CRS photographs; Altus uses dated Altus cotton-site photographs. Seven additional Altus derivatives are recorded in asset-provenance.json and can be rebuilt with tools/prepare_altus_photos.py. Public captions and site labels omit producer names. Summaries explicitly describe the full travel day.

OSU orange (#FE5C00) follows https://brand.okstate.edu/branding-guidelines/colors and is used for the map outline, controls and small accents.
