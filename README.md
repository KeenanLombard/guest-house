# Salt & Still

A fictional luxury guest house in Wilderness, Western Cape. A portfolio project built around quiet coastal luxury: ocean blue, warm ivory, editorial serif typography, natural textures and expansive photography.

## Run

Requires Node.js 18 or later. No dependencies to install.

```sh
npm run dev
```

Open `http://localhost:4173`. Set `PORT` to change the port. You can also open `index.html` directly.

```sh
npm run check
npm run build
```

The build creates a self-contained `dist/` directory for static hosting. All images and fonts are bundled locally.

## Experience

- Responsive editorial layout, mobile navigation and reduced-motion support.
- Two suite detail dialogs with amenities and a route into the stay planner.
- Arrival and departure validation, guest selection, suite selection and nightly cost estimates.
- A stay preview that explicitly identifies the experience as a demo. No booking is sent, no payment is taken and no personal data is collected.
- Keyboard-accessible Wilderness guide tabs, native FAQ disclosures and modal dialogs.

Salt & Still, its property details, amenities and prices are illustrative. No claims of real guest reviews, ratings or availability are made. The Wilderness guide links to SANParks and local tourism sources.

## Assets

Four bespoke photographs were created using the built-in image generation tool and optimized into JPEGs in `assets/`. The prompts and asset notes are in [ASSETS.md](ASSETS.md). The site discloses AI imagery in its footer.

Typography uses locally bundled STIX Two Text and Open Sans. Their original licenses are included in `assets/fonts/`.

## Verification

JavaScript syntax checks and the static production build pass. Local asset and anchor references have been checked. This execution environment does not permit a listening HTTP server and its browser host is unavailable, so visual browser QA must be completed in a normal local session.
