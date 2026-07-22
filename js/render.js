export function buildImage(imageUrl, alt) {
  if (!imageUrl) return buildPlaceholder(alt);

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = alt;
  img.loading = "lazy";
  img.className = "story-image";
  img.onerror = () => img.replaceWith(buildPlaceholder(alt));
  return img;
}

function buildPlaceholder(alt) {
  const span = document.createElement("span");
  span.className = "story-image story-image-placeholder";
  span.setAttribute("role", "img");
  span.setAttribute("aria-label", alt);
  span.textContent = "📖";
  return span;
}

export function buildStoryCard(story, { onClick } = {}) {
  const card = document.createElement(onClick ? "button" : "div");
  card.className = "story-card";
  if (onClick) {
    card.type = "button";
    card.addEventListener("click", () => onClick(story));
  }

  card.appendChild(buildImage(story.image, story.title));

  const body = document.createElement("div");
  body.className = "story-card-body";

  const title = document.createElement("h3");
  title.textContent = story.title;
  body.appendChild(title);

  const reference = document.createElement("p");
  reference.className = "story-reference";
  reference.textContent = story.reference;
  body.appendChild(reference);

  card.appendChild(body);
  return card;
}

export function buildStoryDetail(story) {
  const wrap = document.createElement("div");
  wrap.className = "story-detail";

  wrap.appendChild(buildImage(story.image, story.title));

  const title = document.createElement("h2");
  title.textContent = story.title;
  wrap.appendChild(title);

  const reference = document.createElement("p");
  reference.className = "story-reference";
  reference.textContent = story.reference;
  wrap.appendChild(reference);

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
