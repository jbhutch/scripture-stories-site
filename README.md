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

- **Random** — loads a story immediately on arrival. Identical "Surprise
  me" buttons above and below the story both pull a new one, so you can
  reroll without scrolling past a long summary either way. The label
  avoids referring to a previous story ("another", "again") because the
  top button is read *before* the story it sits above. Ticking a category
  swaps in a story from it right away.
- **Browse** — two levels. First the four sections (Old Testament, New
  Testament, Book of Mormon, Church History), then that section's stories.
  The section lives in the hash (`#browse/old_testament`), so links are
  shareable and the back button works.
- **Gallery** — all stories, loaded in batches; click a card for the full
  summary.
- **Widgets** — instructions for running the story as an iOS Home Screen
  widget via [Scriptable](https://scriptable.app). Static content, no API
  calls.

## Widget script

[`widget/scripture-stories-widget.js`](widget/scripture-stories-widget.js)
is served as a plain file so people can download it, and the Widgets page
fetches that same file to render the on-page code block — so what's shown
and what's taken away can't drift apart.

It is, however, **a copy of `clients/scriptable/` in the API repo**. The
two are not linked; if you change one, change the other. The API repo's
copy is the original.

The page pushes people hard toward the **large** widget size, because the
script renders the story summary and only the large family has room for
it — small omits the summary entirely and medium truncates it. iOS can't
resize a placed widget, so picking wrong means removing and re-adding.

Clicking any card opens the full summary, where the scripture reference
links to the corresponding chapter on churchofjesuschrist.org. That link
comes from the API's `referenceUrl` field — the site does no URL
derivation of its own, and falls back to plain text when the field is
absent or `null`.

Stories with no image render as text-only cards rather than showing a
placeholder.
