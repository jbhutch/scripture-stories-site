import { getStoryById } from "./api.js";
import { buildStoryDetail, showError, openModal } from "./render.js";

// The router is the only caller: Browse/Gallery cards are plain #story/<id>
// links now, so the resulting hashchange is what triggers this, not a click
// handler on the card itself.
export async function showStoryDetail(story) {
  const loading = document.createElement("div");
  loading.className = "loading modal-loading";
  openModal(loading);

  try {
    const full = await getStoryById(story.id);
    openModal(buildStoryDetail(full));
  } catch (err) {
    const errWrap = document.createElement("div");
    showError(errWrap, err);
    openModal(errWrap);
  }
}
