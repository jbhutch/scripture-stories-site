// Scripture Stories Widget
// Scriptable (https://scriptable.app) script for a Home Screen widget
// that shows a random scripture story from the Scripture Stories API.
//
// Setup:
// 1. Install the free "Scriptable" app from the App Store.
// 2. Open it, tap "+", paste this whole file in, name it whatever you like.
// 3. Long-press your Home Screen > add a widget > search "Scriptable".
// 4. Add it (large recommended, for the most summary text) then edit the
//    widget: set "Script" to this one, and (optionally) set "Parameter" to
//    a category slug like "old_testament" or a comma-separated list like
//    "old_testament,new_testament" to filter. Leave blank for any category.

const API_BASE = "https://cy3e7z5a3fui6kfh2hfc37epfu0nimle.lambda-url.us-west-2.on.aws";

async function fetchStory(categories) {
  let url = `${API_BASE}/story`;
  if (categories) {
    url += `?categories=${encodeURIComponent(categories)}`;
  }
  const req = new Request(url);
  return await req.loadJSON();
}

function categoryLabel(slug) {
  return slug
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function createWidget(story, family) {
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#1c1c1e");

  const padding = family === "small" ? 12 : 16;
  widget.setPadding(padding, padding, padding, padding);

  const categoryText = widget.addText(categoryLabel(story.category).toUpperCase());
  categoryText.font = Font.boldSystemFont(11);
  categoryText.textColor = new Color("#8e8e93");

  widget.addSpacer(2);

  const titleText = widget.addText(story.title);
  titleText.font = Font.boldSystemFont(family === "small" ? 15 : 18);
  titleText.textColor = Color.white();
  titleText.minimumScaleFactor = 0.8;

  widget.addSpacer(4);

  const refText = widget.addText(story.reference);
  refText.font = Font.italicSystemFont(12);
  refText.textColor = new Color("#8e8e93");

  if (family !== "small") {
    widget.addSpacer(6);
    const summaryText = widget.addText(story.summary);
    summaryText.font = Font.systemFont(family === "large" ? 13 : 12);
    summaryText.textColor = new Color("#d1d1d6");
    // No lineLimit: let it wrap and show as much as the widget's fixed
    // physical size allows, rather than cutting it off early.
  }

  // Refresh roughly hourly. iOS ultimately decides the real cadence, but
  // this hints at how often you'd like new content.
  widget.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);

  return widget;
}

function createErrorWidget(message) {
  const widget = new ListWidget();
  widget.backgroundColor = new Color("#1c1c1e");
  widget.setPadding(16, 16, 16, 16);

  const title = widget.addText("Couldn't load a story");
  title.font = Font.boldSystemFont(14);
  title.textColor = Color.red();

  widget.addSpacer(4);

  const detail = widget.addText(message);
  detail.font = Font.systemFont(10);
  detail.textColor = new Color("#8e8e93");

  // Retry sooner than a normal successful refresh.
  widget.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000);
  return widget;
}

async function run() {
  const categories = (args.widgetParameter || "").trim();
  const family = config.widgetFamily || "large";

  let widget;
  try {
    const story = await fetchStory(categories);
    if (!story || !story.title) {
      throw new Error(story?.message || "Unexpected response from API");
    }
    widget = createWidget(story, family);
  } catch (e) {
    widget = createErrorWidget(String(e.message || e));
  }

  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else if (family === "small") {
    await widget.presentSmall();
  } else if (family === "large") {
    await widget.presentLarge();
  } else {
    await widget.presentMedium();
  }

  Script.complete();
}

await run();
