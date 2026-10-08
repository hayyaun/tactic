"use strict";

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const contactDialog = document.querySelector(".contact-dialog");
const studyDialog = document.querySelector(".study-dialog");
const contactForm = document.getElementById("contact-form");
const briefResult = document.getElementById("brief-result");
const briefPreview = document.getElementById("brief-preview");
const copyStatus = document.getElementById("copy-status");
const siteHeader = document.querySelector(".site-header");
let briefText = "";
let dialogOpener = null;
let headerFrame = null;

function updateHeader() {
  const visible = window.scrollY > 100;
  siteHeader.classList.toggle("is-visible", visible);
  siteHeader.inert = !visible;
  siteHeader.setAttribute("aria-hidden", String(!visible));
  if (!visible) closeMenu();
  headerFrame = null;
}

window.addEventListener(
  "scroll",
  () => {
    if (headerFrame === null) headerFrame = requestAnimationFrame(updateHeader);
  },
  { passive: true },
);
window.addEventListener("pageshow", updateHeader);
updateHeader();

function closeMenu() {
  mobileMenu.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  mobileMenu.hidden = isOpen;
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
});
mobileMenu
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.matchMedia("(min-width: 960px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

function openDialog(dialog) {
  dialogOpener = mobileMenu.contains(document.activeElement)
    ? menuButton
    : document.activeElement;
  closeMenu();
  dialog.showModal();
  document.body.classList.add("modal-open");
}
document
  .querySelectorAll("[data-contact]")
  .forEach((button) =>
    button.addEventListener("click", () => openDialog(contactDialog)),
  );
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog
    .querySelector("[data-close]")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (dialogOpener?.isConnected) dialogOpener.focus({ preventScroll: true });
    dialogOpener = null;
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
});

const studies = {
  pathways: {
    title: "A clearer direction",
    image: "assets/pathways.webp",
    alt: "TACTIC’s green and red marks become intersecting pathways with figures choosing a direction.",
    description:
      "Every decision opens a path. Our paired marks represent two perspectives: the possibility ahead and the lessons that help us get there. A visual exploration of clarity, choice, and moving with intent.",
  },
  strategy: {
    title: "Thinking ahead",
    image: "assets/strategy.webp",
    alt: "A chess pawn sits within a green ring among other pieces and TACTIC brand symbols.",
    description:
      "Creativity starts with a good question. This brand exploration brings the TACTIC perspective to the chessboard: see the bigger picture, understand the possibilities, and make the next move a considered one.",
  },
  architecture: {
    title: "Built to stand apart",
    image: "assets/architecture.webp",
    alt: "TACTIC’s opposing green and red marks form two architectural towers.",
    description:
      "An identity with substance. Our opposing forms become a small architectural world, turning a simple mark into a place for possibility. Distinctive from a distance. Considered up close.",
  },
};
document.querySelectorAll("[data-study]").forEach((button) =>
  button.addEventListener("click", () => {
    const study = studies[button.dataset.study];
    document.getElementById("study-dialog-title").textContent = study.title;
    const image = document.getElementById("study-dialog-image");
    image.src = study.image;
    image.alt = study.alt;
    document.getElementById("study-dialog-description").textContent =
      study.description;
    openDialog(studyDialog);
  }),
);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  briefText = [
    "TACTIC — Project enquiry",
    "",
    `Name: ${data.get("name").trim()}`,
    `Email: ${data.get("email").trim()}`,
    `Interested in: ${data.get("service")}`,
    "",
    "About the project:",
    data.get("message").trim(),
  ].join("\n");
  briefPreview.textContent = briefText;
  contactForm.hidden = true;
  briefResult.hidden = false;
  copyStatus.textContent = "";
  document.getElementById("copy-brief").focus();
});
document.getElementById("edit-brief").addEventListener("click", () => {
  briefResult.hidden = true;
  contactForm.hidden = false;
  contactForm.elements.name.focus();
});
document.getElementById("copy-brief").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(briefText);
    copyStatus.textContent = "Project brief copied. Nothing has been sent.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(briefPreview);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = "Brief selected. Press Ctrl+C (or ⌘C) to copy.";
  }
});
document.getElementById("year").textContent = new Date().getFullYear();
