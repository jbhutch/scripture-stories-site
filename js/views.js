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
// `#story/<id>` is a third shape, handled separately below: it never names
// one of the 4 real views, it names a specific story to open in the modal.
function parseHash() {
  const [head, param = ""] = (location.hash || `#${DEFAULT_VIEW}`).slice(1).split("/");
  if (head === "story") return { storyId: param || null };
  return { view: VIEWS.includes(head) ? head : DEFAULT_VIEW, param };
}

export function initRouter(onRoute) {
  // A #story/<id> hash never changes which view is showing underneath the
  // modal -- a hash-only navigation doesn't touch the DOM we already built.
  // The one exception is a cold load straight into a shared story link,
  // where nothing has been shown yet and needs *some* backdrop.
  let hasShownAView = false;

  const route = () => {
    const parsed = parseHash();
    if ("storyId" in parsed) {
      if (!hasShownAView) {
        showView(DEFAULT_VIEW);
        hasShownAView = true;
      }
      onRoute?.(null, null, parsed.storyId);
      return;
    }

    showView(parsed.view);
    hasShownAView = true;
    onRoute?.(parsed.view, parsed.param, null);
  };

  window.addEventListener("hashchange", route);
  for (const view of VIEWS) {
    document.querySelector(`[data-nav="${view}"]`)?.addEventListener("click", () => {
      location.hash = view;
    });
  }

  route();
}
