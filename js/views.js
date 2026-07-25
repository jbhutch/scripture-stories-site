const VIEWS = ["random", "browse", "gallery", "widgets"];
const DEFAULT_VIEW = "random";

function showView(name) {
  if (!VIEWS.includes(name)) name = DEFAULT_VIEW;

  for (const view of VIEWS) {
    document.getElementById(`view-${view}`).hidden = view !== name;
    document.querySelector(`[data-nav="${view}"]`)?.classList.toggle("active", view === name);
  }
}

// Hashes are `#view` or `#view/param`, e.g. `#browse/old_testament`, so a
// browse section is a real URL: shareable, and the back button works.
function parseHash() {
  const [view, param = ""] = (location.hash || `#${DEFAULT_VIEW}`).slice(1).split("/");
  return { view: VIEWS.includes(view) ? view : DEFAULT_VIEW, param };
}

export function initRouter(onRoute) {
  const route = () => {
    const { view, param } = parseHash();
    showView(view);
    onRoute?.(view, param);
  };

  window.addEventListener("hashchange", route);
  for (const view of VIEWS) {
    document.querySelector(`[data-nav="${view}"]`)?.addEventListener("click", () => {
      location.hash = view;
    });
  }

  route();
}
