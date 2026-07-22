import { initRouter } from "./views.js";
import { initRandomView } from "./random.js";
import { initBrowseView } from "./browse.js";
import { initGalleryView } from "./gallery.js";
import { initModal } from "./render.js";

initModal();
initRouter();
initRandomView();
initBrowseView();
initGalleryView();
