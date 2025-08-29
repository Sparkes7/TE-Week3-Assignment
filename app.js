console.log("Hello World");

// ==================== TOOLTIP RELATED CODE ====================
// Tooltip elements to be updated when I hover over my upgrades
const tooltip = document.getElementById("tooltip");
const tooltipName = document.getElementById("tooltip-name");
const tooltipCost = document.getElementById("tooltip-cost");
const tooltipText = document.getElementById("tooltip-text");
const tooltipError = document.getElementById("tooltip-error");

// event listener on the whole body that tracks my mouse position. I can then use this pixel data to position the tooltip box absolutely!
document.addEventListener("mousemove", function (e) {
  let x = e.clientX;
  let y = e.clientY;
  tooltip.style.left = x + 15 + "px";
  tooltip.style.top = y + "px";
});

// document.addEventListener("click", function (element) {
//   console.log(element.target);
// });

function showTooltip(e) {
  const index = e.target.getAttribute("data-upgrade");

  tooltipName.textContent = myUpgrades[index].name;
  tooltipCost.textContent = `Cost: ${myUpgrades[index].cost}`;
  tooltipText.textContent = `Increases clicks per second by: ${myUpgrades[index].increase}`;
  tooltip.style.display = "flex";
}

function hideTooltip() {
  tooltip.style.display = "none";
}

const upgradesButton = document.getElementById("upgrades-toggle");

let isDisplayed = false;

upgradesButton.addEventListener("click", function () {
  const upgradeContainer = document.getElementById("upgrades");

  if (isDisplayed === true) {
    isDisplayed = !isDisplayed;
    upgradeContainer.style.display = "none";
    upgradeContainer.style.visibility = "hidden";
  } else if (isDisplayed === false) {
    isDisplayed = !isDisplayed;
    upgradeContainer.style.display = "flex";
    upgradeContainer.style.visibility = "visible";
  }
});

// ==================== INITIALISING CODE ====================
// fetch the API
async function getUpgradesFromAPI() {
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  const data = await response.json();
  return data;
}

// loop through the API and append to DOM
async function initUpgrades() {
  const container = document.getElementById("upgrades");
  const upgrades = await getUpgradesFromAPI();

  // takes the data from the API and pushes it into a local array so that when I want to reference the upgrades I'm not making fetch requests every time.
  for (upgrade of upgrades) {
    myUpgrades.push(upgrade);
  }

  // Creates the actual upgrade elements and appends them to the upgrades container in the DOM.
  for (i = 0; i < myUpgrades.length; i++) {
    const upgradeDiv = document.createElement("div");
    upgradeDiv.classList.add("upgrade");
    upgradeDiv.setAttribute("data-upgrade", i);

    upgradeDiv.addEventListener("click", function (element) {
      const index = element.target.getAttribute("data-upgrade");
      if (stats.clicks >= myUpgrades[index].cost) {
        stats.clicks -= myUpgrades[index].cost;
        stats.clicksPerSecond += myUpgrades[index].increase;
        updateInterface();
      } else if (stats.clicks <= myUpgrades[index].cost) {
        tooltipError.textContent =
          "Not enough Clicks to buy this".toUpperCase();
        tooltipError.style.display = "";
        setTimeout(function () {
          tooltipError.textContent = "";
        }, 3000);
      }
    });

    upgradeDiv.addEventListener("mouseover", showTooltip);
    upgradeDiv.addEventListener("mouseleave", hideTooltip);

    container.appendChild(upgradeDiv);
  }
}

function updateInterface() {
  clicksText.textContent = `     ${stats.clicks.toFixed(0)}`;
  cpsText.textContent = ` ${stats.clicksPerSecond}`;
}

function initBobber() {
  const bobber = document.getElementById("bobber-image");
  bobber.addEventListener("click", function () {
    stats.clicks++;
  });
}

function startInterval() {
  setInterval(function () {
    stats.clicks += stats.clicksPerSecond / 10;
    updateInterface();
    saveGame();
  }, 100);
}

function saveGame() {
  localStorage.setItem("stats", JSON.stringify(stats));
}

function loadGame() {
  const data = localStorage.getItem("stats");
  const savedData = JSON.parse(data);

  if (savedData) {
    stats.clicks = savedData.clicks;
    stats.clicksPerSecond = savedData.clicksPerSecond;
  } else {
    stats.clicks = 0;
    stats.clicksPerSecond = 0;
  }
}

// ========= GLOBAL VARIABLES =========
const clicksText = document.getElementById("clicks");
const cpsText = document.getElementById("clicks-per-second");

let stats = {
  clicks: 0,
  clicksPerSecond: 0,
};

let myUpgrades = [];

// INITIALISE THE GAME
loadGame();
initUpgrades();
initBobber();
startInterval();

// FOR TESTING PURPOSES
function resetGame() {
  stats.clicks = 0;
  stats.clicksPerSecond = 0;
  localStorage.setItem("stats", JSON.stringify(stats));
}

function giveThousand() {
  stats.clicks += 1000;
}
