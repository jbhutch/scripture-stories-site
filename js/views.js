const VIEWS = ["random", "browse", "gallery"];
const DEFAULT_VIEW = "random";

function showView(name) {
  if (!VIEWS.includes(name)) name = DEFAULT_VIEW;

  for (const view of VIEWS) {
    document.getElementById(`view-${view}`).hidden = view !== name;
    document.querySelector(`[data-nav="${view}"]`)?.classList.toggle("active", view === name);
  }
}

export function initRouter() {
  const fromHash = () => showView((location.hash || `#${DEFAULT_VIEW}`).slice(1));

  window.addEventListener("hashchange", fromHash);
  for (const view of VIEWS) {
    document.querySelector(`[data-nav="${view}"]`)?.addEventListener("click", () => {
      location.hash = view;
    });
  }

  fromHash();
}
