import { getRandomStory, getCategories, ApiError } from "./api.js";
import { buildStoryDetail, showError, clear } from "./render.js";

export async function initRandomView() {
  const filterEl = document.getElementById("random-category-filter");
  const resultEl = document.getElementById("random-result");
  const button = document.getElementById("random-btn");

  let categories = [];
  try {
    const { categories: list } = await getCategories();
    filterEl.innerHTML = "";
    for (const { slug, label, count } of list) {
      const id = `random-cat-${slug}`;
      const wrap = document.createElement("label");
      wrap.className = "category-checkbox";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.value = slug;
      checkbox.addEventListener("change", () => {
        categories = [...filterEl.querySelectorAll("input:checked")].map((el) => el.value);
      });

      wrap.appendChild(checkbox);
      wrap.append(` ${label} (${count})`);
      filterEl.appendChild(wrap);
    }
  } catch (err) {
    showError(filterEl, err);
  }

  button.addEventListener("click", async () => {
    clear(resultEl);
    resultEl.classList.add("loading");
    try {
      const story = await getRandomStory(categories);
      resultEl.classList.remove("loading");
      resultEl.appendChild(buildStoryDetail(story));
    } catch (err) {
      resultEl.classList.remove("loading");
      showError(resultEl, err instanceof ApiError ? err : new ApiError(0, { message: String(err) }));
    }
  });
}
