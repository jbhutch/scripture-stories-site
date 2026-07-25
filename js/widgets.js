// The widget script is fetched from the same file the Download link serves,
// rather than being pasted into index.html, so the code shown on the page and
// the code people take away can't drift apart.
const SCRIPT_URL = "widget/scripture-stories-widget.js";

let scriptSource = null;

export async function initWidgetsView() {
  const pre = document.getElementById("widget-code");
  const code = pre.querySelector("code");
  const copyBtn = document.getElementById("widget-copy");
  const status = document.getElementById("widget-copy-status");

  copyBtn.addEventListener("click", () => copyScript(copyBtn, status, code));

  try {
    const res = await fetch(SCRIPT_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    scriptSource = await res.text();
    pre.classList.remove("loading");
    code.textContent = scriptSource;
  } catch {
    pre.classList.remove("loading");
    code.textContent = "Couldn't load the script here — use the download link instead.";
    copyBtn.disabled = true;
    setStatus(status, "The script couldn't be loaded. Try the download link below.", true);
  }
}

async function copyScript(button, status, code) {
  if (!scriptSource) return;

  // Needs a secure context, and Safari can still refuse it. Falling back to
  // selecting the text means the iOS Copy callout is one tap away rather than
  // leaving someone to drag-select 120 lines.
  try {
    await navigator.clipboard.writeText(scriptSource);
    button.textContent = "Copied";
    setStatus(status, "Copied. Now open Scriptable and paste it into a new script.");
  } catch {
    selectAll(code);
    button.textContent = "Copy the whole script";
    setStatus(status, "Couldn't copy automatically — the script is selected, so tap Copy.", true);
  }

  setTimeout(() => (button.textContent = "Copy the whole script"), 3000);
}

function selectAll(code) {
  code.closest("details")?.setAttribute("open", "");
  const range = document.createRange();
  range.selectNodeContents(code);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  code.scrollIntoView({ block: "center", behavior: "smooth" });
}

function setStatus(status, message, isWarning = false) {
  status.textContent = message;
  status.classList.toggle("copy-status-warn", isWarning);
}
