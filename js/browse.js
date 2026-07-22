import { getStories, getCategories } from "./api.js";
import { buildStoryCard, showError, clear } from "./render.js";
import { showStoryDetail } from "./gallery.js";

export async function initBrowseView() {
  const filterEl = document.getElementById("browse-categories");
  const resultsEl = document.getElementById("browse-results");

  let selected = [];

  async function loadResults() {
    clear(resultsEl);
    resultsEl.classList.add("loading");
    try {
      const { stories } = await getStories(selected);
      resultsEl.classList.remove("loading");
      clear(resultsEl);
      if (!stories.length) {
        resultsEl.textContent = "No stories in this category yet.";
        return;
      }
      for (const story of stories) {
        resultsEl.appendChild(buildStoryCard(story, { onClick: showStoryDetail }));
      }
    } catch (err) {
      resultsEl.classList.remove("loading");
      showError(resultsEl, err);
    }
  }

  try {
    const { categories } = await getCategories();
    filterEl.innerHTML = "";
    for (const { slug, label, count } of categories) {
      const wrap = document.createElement("label");
      wrap.className = "category-checkbox";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = slug;
      checkbox.addEventListener("change", () => {
        selected = [...filterEl.querySelectorAll("input:checked")].map((el) => el.value);
        loadResults();
      });

      wrap.appendChild(checkbox);
      wrap.append(` ${label} (${count})`);
      filterEl.appendChild(wrap);
    }
  } catch (err) {
    showError(filterEl, err);
  }

  loadResults();
}
