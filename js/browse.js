import { getStories, getCategories } from "./api.js";
import { buildStoryCard, showError, clear } from "./render.js";

// Memoized so initBrowseView and showBrowseSection can each ask for the
// categories without caring which one ran first -- the router may route to a
// section before the initial render has finished.
let categoriesPromise = null;
const loadCategories = () => (categoriesPromise ??= getCategories());

// Stories per section, so going back and forth between sections is instant.
const storiesBySlug = new Map();

const el = (id) => document.getElementById(id);

export async function initBrowseView() {
  const sectionsEl = el("browse-sections");

  try {
    const { categories } = await loadCategories();
    clear(sectionsEl);
    for (const { slug, label, count } of categories) {
      const link = document.createElement("a");
      link.className = "section-card";
      link.href = `#browse/${slug}`;

      const heading = document.createElement("h2");
      heading.textContent = label;
      link.appendChild(heading);

      const meta = document.createElement("p");
      meta.className = "section-count";
      meta.textContent = `${count} stories`;
      link.appendChild(meta);

      sectionsEl.appendChild(link);
    }
  } catch (err) {
    showError(sectionsEl, err);
  }
}

// Called by the router. An empty slug means the section list itself.
export async function showBrowseSection(slug) {
  const sectionsEl = el("browse-sections");
  const sectionView = el("browse-section-view");

  if (!slug) {
    sectionsEl.hidden = false;
    sectionView.hidden = true;
    return;
  }

  sectionsEl.hidden = true;
  sectionView.hidden = false;

  const titleEl = el("browse-section-title");
  const resultsEl = el("browse-results");

  // Label comes from /categories; fall back to the slug if that call failed.
  try {
    const { categories } = await loadCategories();
    titleEl.textContent = categories.find((c) => c.slug === slug)?.label ?? slug;
  } catch {
    titleEl.textContent = slug;
  }

  if (storiesBySlug.has(slug)) {
    renderStories(resultsEl, storiesBySlug.get(slug));
    return;
  }

  clear(resultsEl);
  resultsEl.classList.add("loading");
  try {
    const { stories } = await getStories([slug]);
    storiesBySlug.set(slug, stories);
    resultsEl.classList.remove("loading");
    // The user may have navigated away while this was in flight.
    if (el("browse-section-view").hidden) return;
    renderStories(resultsEl, stories);
  } catch (err) {
    resultsEl.classList.remove("loading");
    showError(resultsEl, err);
  }
}

function renderStories(resultsEl, stories) {
  clear(resultsEl);
  if (!stories.length) {
    resultsEl.textContent = "No stories in this section yet.";
    return;
  }
  for (const story of stories) {
    resultsEl.appendChild(buildStoryCard(story));
  }
}
