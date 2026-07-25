// Returns null when there's no image. Callers mark the card/detail with the
// `no-image` class instead of substituting a placeholder, so image-less
// stories read as a deliberate text card rather than a failed load.
export function buildImage(imageUrl, alt) {
  if (!imageUrl) return null;

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = alt;
  img.loading = "lazy";
  img.className = "story-image";
  img.onerror = () => {
    img.closest(".story-card, .story-detail")?.classList.add("no-image");
    img.remove();
  };
  return img;
}

function appendImage(container, story) {
  const img = buildImage(story.image, story.title);
  if (img) {
    container.appendChild(img);
  } else {
    container.classList.add("no-image");
  }
}

export function buildStoryCard(story, { onClick } = {}) {
  const card = document.createElement(onClick ? "button" : "div");
  card.className = "story-card";
  if (onClick) {
    card.type = "button";
    card.addEventListener("click", () => onClick(story));
  }

  appendImage(card, story);

  const body = document.createElement("div");
  body.className = "story-card-body";

  const title = document.createElement("h3");
  title.textContent = story.title;
  body.appendChild(title);

  // Plain text here even when the story has a referenceUrl -- an <a> can't be
  // nested inside the <button> the card is built from. The link lives in the
  // detail view instead.
  const reference = document.createElement("p");
  reference.className = "story-reference";
  reference.textContent = story.reference;
  body.appendChild(reference);

  card.appendChild(body);
  return card;
}

// The API supplies referenceUrl, already resolved to the right
// churchofjesuschrist.org chapter (and verse anchor, where the reference has
// one). It's null for references with no canonical page, so fall back to text.
function buildReference(story) {
  if (!story.referenceUrl) {
    const p = document.createElement("p");
    p.className = "story-reference";
    p.textContent = story.reference;
    return p;
  }

  const p = document.createElement("p");
  p.className = "story-reference";

  const link = document.createElement("a");
  link.className = "story-reference-link";
  link.href = story.referenceUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = story.reference;

  p.appendChild(link);
  return p;
}

export function buildStoryDetail(story) {
  const wrap = document.createElement("div");
  wrap.className = "story-detail";

  appendImage(wrap, story);

  const title = document.createElement("h2");
  title.textContent = story.title;
  wrap.appendChild(title);

  wrap.appendChild(buildReference(story));

  if (story.summary) {
    const summary = document.createElement("p");
    summary.className = "story-summary";
    summary.textContent = story.summary;
    wrap.appendChild(summary);
  }

  return wrap;
}

export function showError(container, err) {
  container.innerHTML = "";
  const banner = document.createElement("div");
  banner.className = "error-banner";
  banner.textContent = err?.message || "Something went wrong.";
  container.appendChild(banner);
}

export function clear(container) {
  container.innerHTML = "";
}

const modal = () => document.getElementById("story-modal");
const modalBody = () => document.getElementById("modal-body");

export function openModal(contentEl) {
  const body = modalBody();
  body.innerHTML = "";
  body.appendChild(contentEl);
  modal().hidden = false;
  document.body.classList.add("modal-open");
}

export function closeModal() {
  modal().hidden = true;
  modalBody().innerHTML = "";
  document.body.classList.remove("modal-open");
}

export function initModal() {
  const overlay = modal();
  overlay.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });
}
