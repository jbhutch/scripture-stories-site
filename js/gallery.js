import { getStories } from "./api.js";
import { buildStoryCard, showError, clear } from "./render.js";

const BATCH_SIZE = 24;

let allStories = [];
let renderedCount = 0;

export async function initGalleryView() {
  const gridEl = document.getElementById("gallery-grid");
  const loadMoreBtn = document.getElementById("gallery-load-more");

  loadMoreBtn.addEventListener("click", () => renderNextBatch(gridEl, loadMoreBtn));

  clear(gridEl);
  gridEl.classList.add("loading");
  try {
    const { stories } = await getStories();
    allStories = stories;
    gridEl.classList.remove("loading");
    renderedCount = 0;
    renderNextBatch(gridEl, loadMoreBtn);
  } catch (err) {
    gridEl.classList.remove("loading");
    showError(gridEl, err);
  }
}

function renderNextBatch(gridEl, loadMoreBtn) {
  const next = allStories.slice(renderedCount, renderedCount + BATCH_SIZE);
  for (const story of next) {
    gridEl.appendChild(buildStoryCard(story));
  }
  renderedCount += next.length;
  loadMoreBtn.hidden = renderedCount >= allStories.length;
}
