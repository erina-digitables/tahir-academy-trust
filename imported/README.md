# /imported — RAW STITCH IMPORT (SOURCE OF TRUTH)

Imported 2026-08-08 from Stitch MCP.

- **Project:** Tahir Academy Digital Portal
- **Project ID:** `projects/6286380209628221244`
- **Design system:** Liquid Editorial (`assets/cf18ec17c81c4895bb632a16876f5113`, v1)
- **Project last modified upstream:** 2026-08-08T06:25:10.141671Z

## DO NOT EDIT ANYTHING IN THIS DIRECTORY

Every file here is byte-for-byte what the Stitch MCP server returned. All fixes and
refactors happen outside this folder and are diffed against it. If a file in here
changes, the diff baseline is destroyed.

## Contents

| Path | What it is |
|---|---|
| `screens/…__landing-page/code.html` | The full landing page. Single-file HTML + Tailwind CDN. 360 lines. |
| `screens/…__shader/code.html` | Standalone WebGL shader screen (same shader is inlined in the landing page). |
| `screens/…__extracted-text/code.md` | Scraped copy from the live site tahiracademytrust.org — the real content source. |
| `assets/` | 19 binary assets: logo, photography, banners, moodboard references. |
| `_mcp/project.json` | Raw project + designTheme metadata from `list_projects`. |
| `_mcp/screens.json` | Raw screen index from `list_screens`, mapped to local paths. |
| `_mcp/design-system.md` | Raw `designMd` from `list_design_systems` — the authoritative token definitions. |
| `_mcp/download-report.json` | Per-file download result (status, bytes, content-type). |

## Note on asset URLs

The landing page HTML references `lh3.googleusercontent.com/aida/...` URLs directly.
These are Stitch-hosted and will expire. The equivalent bytes are saved in `assets/`
and the working copy must be repointed at local files. One image URL used by the three
course cards (`AP1WRLvpA1Clj…`) was inlined in the HTML but is not exposed as a screen
in the MCP screen list, so it was not downloadable via the API — see audit item 11.
