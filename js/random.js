import { getRandomStory, getCategories, ApiError } from "./api.js";
import { buildStoryDetail, showError, clear } from "./render.js";

export async function initRandomView() {
  const filterEl = document.getElementById("random-category-filter");
  const resultEl = document.getElementById("random-result");
  // One above the story and one below it, so you can reroll without scrolling
  // past a long summary either way. Both do the same thing.
  const buttons = document.querySelectorAll(".random-btn");

  let categories = [];

  // Filter changes fire a fetch each, so a fast sequence of clicks can have
  // several in flight. Only the newest is allowed to render, otherwise a slow
  // earlier response could land last and show a story from the wrong filter.
  let latestRequest = 0;

  async function loadStory() {
    const requestId = ++latestRequest;
    clear(resultEl);
    resultEl.classList.add("loading");
    try {
      const story = await getRandomStory(categories);
      if (requestId !== latestRequest) return;
      resultEl.classList.remove("loading");
      resultEl.appendChild(buildStoryDetail(story));
    } catch (err) {
      if (requestId !== latestRequest) return;
      resultEl.classList.remove("loading");
      showError(resultEl, err instanceof ApiError ? err : new ApiError(0, { message: String(err) }));
    }
  }

  for (const button of buttons) button.addEventListener("click", loadStory);

  try {
    const { categories: list } = await getCategories();
    filterEl.innerHTML = "";
    for (const { slug, label, count } of list) {
      const wrap = document.createElement("label");
      wrap.className = "category-checkbox";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `random-cat-${slug}`;
      checkbox.value = slug;
      checkbox.addEventListener("change", () => {
        categories = [...filterEl.querySelectorAll("input:checked")].map((el) => el.value);
        loadStory();
      });

      wrap.appendChild(checkbox);
      wrap.append(` ${label} (${count})`);
      filterEl.appendChild(wrap);
    }
  } catch (err) {
    showError(filterEl, err);
  }

  // Show a story on arrival rather than making the button the price of entry.
  // Runs even if the category list failed to load -- unfiltered still works.
  loadStory();
}
