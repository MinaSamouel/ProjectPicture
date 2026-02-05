const USED_IMAGES_KEY = "usedImages";

function getUsedImages() {
  return JSON.parse(sessionStorage.getItem(USED_IMAGES_KEY)) || [];
}

function markImageAsUsed(imageName) {
  const usedImages = getUsedImages();

  if (!usedImages.includes(imageName)) {
    usedImages.push(imageName);
    sessionStorage.setItem(USED_IMAGES_KEY, JSON.stringify(usedImages));
  }
}

const replaceImageBtn = document.getElementById("replaceImageBtn");
const revealAllBtn = document.getElementById("revealAllBtn");

revealAllBtn.addEventListener("click", () => {
  const allCells = overlayGrid.querySelectorAll(".grid-cell");

  allCells.forEach((cell) => {
    cell.classList.add("revealed");
  });

  // Optional: mark all numbers as chosen
  chosenNumbers = allCells.length
    ? allCells.length && Array.from({ length: TOTAL }, (_, i) => i + 1)
    : [];

  remainingNumbers = [];
  updateChosenList();

   markImageAsUsed(imageNameDiv.textContent.replace(/\[|\]/g, ""));
});

const TOTAL_IMAGES = 32; // adjust to your actual count

function setRandomImage() {
  const usedImages = getUsedImages();

  const availableImages = Array.from({ length: TOTAL_IMAGES }, (_, i) =>
    (i + 1).toString(),
  ).filter((img) => !usedImages.includes(img));

    if (availableImages.length === 0) {
        alert("All images have been used!");
        return;
    }

  const randomImage =
    availableImages[Math.floor(Math.random() * availableImages.length)];

  img.src = `./src/media1/${randomImage}.jpg`;
  imageNameDiv.textContent = `[${randomImage}]`;
}

replaceImageBtn.addEventListener("click", () => {
  setRandomImage(); // ✅ reuse same logic

  chosenNumbers = [];
  remainingNumbers = Array.from({ length: TOTAL }, (_, i) => i + 1);
  shuffle(remainingNumbers);
  updateChosenList();

  overlayGrid.innerHTML = "";
  initGrid();

  spinButton.disabled = false;
  spinButton.textContent = "Show Random Number";
});

const TOTAL = 32;

let remainingNumbers = [];
let chosenNumbers = [];

const overlayGrid = document.getElementById("overlayGrid");
const chosenList = document.getElementById("chosenNumbers");
const spinButton = document.getElementById("spinButton"); // main button

// Show image name next to the image
const img = document.querySelector(".image-container img");
const imageNameDiv = document.getElementById("imageName");

if (img && imageNameDiv) {
  const src = img.src;
  // Extract file name without extension
  const name = src.split("/").pop().split(".")[0];
  imageNameDiv.textContent = `[${name}]`;
}

// Editable Teams input
const teamsInput = document.getElementById("teamsInput");
const editTeamsBtn = document.getElementById("editTeamsBtn");

editTeamsBtn.addEventListener("click", () => {
  if (editTeamsBtn.textContent === "Edit") {
    // Switch to edit mode
    teamsInput.readOnly = false;
    teamsInput.focus();
    editTeamsBtn.textContent = "Save";
  } else {
    // Save mode
    teamsInput.readOnly = true;
    editTeamsBtn.textContent = "Edit";
  }
});

// Shuffle helper
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initialize grid
function initGrid() {
  const gridNumbers = Array.from({ length: TOTAL }, (_, i) => i + 1);
  shuffle(gridNumbers);

  gridNumbers.forEach((num) => {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.dataset.number = num;
    cell.textContent = num;
    overlayGrid.appendChild(cell);
  });
}

// Update chosen numbers display
function updateChosenList() {
  chosenList.textContent = chosenNumbers.join(", ");
}

// Choose a random number
function chooseRandomNumber() {
  if (remainingNumbers.length === 0) {
    // alert("All numbers have been chosen!");
    return;
  }

  // Pick random index
  const idx = Math.floor(Math.random() * remainingNumbers.length);
  const chosen = remainingNumbers[idx];

  // Remove from remaining
  remainingNumbers.splice(idx, 1);
  chosenNumbers.push(chosen);

  // Small "loading" effect
  spinButton.disabled = true;
  const originalText = spinButton.textContent;
  spinButton.textContent = "Choosing...";

  // Highlight effect: flash random cells for 2 seconds
  const highlightDuration = 2000;
  const intervalTime = 200; // change highlight every 200ms
  const gridCells = Array.from(
    overlayGrid.querySelectorAll(".grid-cell:not(.revealed)"),
  );
  let intervalId = setInterval(() => {
    // Remove previous highlights
    gridCells.forEach((cell) => cell.classList.remove("highlight"));
    // Pick a random cell to highlight
    const randomCell = gridCells[Math.floor(Math.random() * gridCells.length)];
    if (randomCell) randomCell.classList.add("highlight");
  }, intervalTime);

  // After delay, reveal chosen cell
  setTimeout(() => {
    clearInterval(intervalId); // stop flashing
    gridCells.forEach((cell) => cell.classList.remove("highlight"));

    spinButton.textContent = originalText;
    spinButton.disabled = false;

    // Reveal the cell
    const cell = overlayGrid.querySelector(
      `.grid-cell[data-number="${chosen}"]`,
    );
    if (cell) cell.classList.add("revealed");

    // Update chosen numbers
    markImageAsUsed(imageNameDiv.textContent.replace(/\[|\]/g, ""));
    updateChosenList();
  }, highlightDuration);
}

// Initialize everything
function init() {
  setRandomImage(); // ✅ random image on reload
  remainingNumbers = Array.from({ length: TOTAL }, (_, i) => i + 1);
  shuffle(remainingNumbers);

  initGrid();
  updateChosenList();
}

// Event listener
spinButton.addEventListener("click", chooseRandomNumber);

init();
