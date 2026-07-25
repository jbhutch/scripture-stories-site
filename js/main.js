import { initRouter } from "./views.js";
import { initRandomView } from "./random.js";
import { initBrowseView, showBrowseSection } from "./browse.js";
import { initGalleryView } from "./gallery.js";
import { initWidgetsView } from "./widgets.js";
import { initModal } from "./render.js";

initModal();
initRandomView();
initBrowseView();
initGalleryView();
initWidgetsView();

initRouter((view, param) => {
  if (view === "browse") showBrowseSection(param);
});
