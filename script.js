const coinContainer = document.getElementById("coinContainer");
const coinCountInput = document.getElementById("coinCount");
const headsCount = document.getElementById("headsCount");
const tailsCount = document.getElementById("tailsCount");
const totalCoinsCount = document.getElementById("totalCoinsCount");
const totalTossCount = document.getElementById("totalTossCount");
const tossStyleToggle = document.getElementById("tossStyleToggle");
const flipSound = document.getElementById("flipSound");
const spinSound = document.getElementById("spinSound");
const sidebar = document.getElementById("sidebar");
const drawerToggle = document.getElementById("drawerToggle");

let currentMaterial = "gold";
let heads = 0,
  tails = 0,
  totalTosses = 0,
  totalCoins = 0;

drawerToggle.onclick = () => sidebar.classList.toggle("open");

document.getElementById("setGold").onclick = () => {
  currentMaterial = "gold";
  document.getElementById("setGold").classList.add("active");
  document.getElementById("setSilver").classList.remove("active");
};
document.getElementById("setSilver").onclick = () => {
  currentMaterial = "silver";
  document.getElementById("setSilver").classList.add("active");
  document.getElementById("setGold").classList.remove("active");
};

coinCountInput.onkeypress = (e) => {
  if (e.key === "Enter") addCoins();
};

function addCoins() {
  const count = parseInt(coinCountInput.value) || 1;
  for (let i = 0; i < count; i++) createCoin();
}

function createCoin() {
  const coin = document.createElement("div");
  coin.className = `coin ${currentMaterial}`;
  coin.innerHTML = `
        <div class="side heads">HEADS</div>
        <div class="side tails">TAILS</div>
    `;
  coin.onclick = () => tossCoin(coin);
  coinContainer.appendChild(coin);
  totalCoins++;
  totalCoinsCount.textContent = totalCoins;
}

function tossCoin(coin) {
  const result = Math.random() < 0.5 ? "heads" : "tails";
  const isVertical = tossStyleToggle.checked;
  const animationName = isVertical ? `toss-${result}` : `spin-${result}`;

  const duration = isVertical ? "1.5s" : "5s";
  const delay = isVertical ? 1500 : 5000;

  isVertical ? flipSound.play() : spinSound.play();

  coin.style.animation = "none";
  void coin.offsetWidth;

  coin.style.animation = `${animationName} ${duration} cubic-bezier(0.1, 0, 0.2, 1) forwards`;

  setTimeout(() => {
    if (result === "heads") {
      heads++;
      headsCount.textContent = heads;
    } else {
      tails++;
      tailsCount.textContent = tails;
    }
    totalTosses++;
    totalTossCount.textContent = totalTosses;
  }, delay);
}

document.getElementById("addCoinsButton").onclick = addCoins;
document.getElementById("tossAllButton").onclick = () => {
  document.querySelectorAll(".coin").forEach(tossCoin);
};
document.getElementById("tossButton").onclick = () => {
  const coins = document.querySelectorAll(".coin");
  if (coins.length) tossCoin(coins[coins.length - 1]);
};

createCoin();

const fullScreenBtn = document.getElementById("fullScreenIcon");
const exitFullScreenBtn = document.getElementById("exitFullScreenIcon");
const appFrame = document.getElementById("appFrame");

// Function to Enter Fullscreen
fullScreenBtn.onclick = () => {
  if (appFrame.requestFullscreen) {
    appFrame.requestFullscreen();
  } else if (appFrame.webkitRequestFullscreen) {
    /* Safari */
    appFrame.webkitRequestFullscreen();
  } else if (appFrame.msRequestFullscreen) {
    /* IE11 */
    appFrame.msRequestFullscreen();
  }
};

// Function to Exit Fullscreen
exitFullScreenBtn.onclick = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
};

// Listen for Fullscreen Change (Handles 'Esc' key)
document.addEventListener("fullscreenchange", handleFullscreenUI);
document.addEventListener("webkitfullscreenchange", handleFullscreenUI);
document.addEventListener("mozfullscreenchange", handleFullscreenUI);
document.addEventListener("MSFullscreenChange", handleFullscreenUI);

function handleFullscreenUI() {
  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  if (isFullscreen) {
    fullScreenBtn.style.display = "none";
    exitFullScreenBtn.style.display = "block";
  } else {
    fullScreenBtn.style.display = "block";
    exitFullScreenBtn.style.display = "none";
  }
}
