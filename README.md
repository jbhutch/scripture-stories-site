# Scripture Stories site

A plain HTML/CSS/JS static site (no framework, no build step, no npm
dependencies) that displays random and browsable scripture stories from the
[scripture-stories-api](../scripture-stories-api) Lambda API. Images are
loaded directly from `churchofjesuschrist.org`'s own CDN — this site never
stores or proxies images.

## Setup

Edit [`js/config.js`](js/config.js) and set `API_BASE` to the deployed
Lambda Function URL:

```js
export const API_BASE = "https://<your-function-id>.lambda-url.<region>.on.aws";
```

## Local development

No install step. Serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Hosted on GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which runs on every push to `main`. One-time manual setup in the GitHub UI:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

## Views

- **Random** — pulls one random story, optionally filtered by category.
- **Browse** — filter stories by category, shown as a card grid.
- **Gallery** — all stories, loaded in batches; click a card for the full
  summary.
