import { initRouter } from "./views.js";
import { initRandomView } from "./random.js";
import { initBrowseView, showBrowseSection } from "./browse.js";
import { initGalleryView } from "./gallery.js";
import { initWidgetsView } from "./widgets.js";
import { initModal, closeModal } from "./render.js";
import { showStoryDetail } from "./story-link.js";

initModal();
initRandomView();
initBrowseView();
initGalleryView();
initWidgetsView();

initRouter((view, param, storyId) => {
  if (view === "browse") showBrowseSection(param);
  if (storyId) showStoryDetail({ id: storyId });
  else closeModal(); // keeps the modal in sync if the hash moved to a real view (nav click, or a back() landed on one)
});
