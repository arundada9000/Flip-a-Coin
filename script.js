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

drawerToggle.onclick = () => {
  const isOpen = sidebar.classList.toggle("open");
  drawerToggle.setAttribute("aria-expanded", isOpen);
};

document.getElementById("setGold").onclick = () => {
  currentMaterial = "gold";
  document.getElementById("setGold").classList.add("active");
  document.getElementById("setGold").setAttribute("aria-pressed", "true");
  document.getElementById("setSilver").classList.remove("active");
  document.getElementById("setSilver").setAttribute("aria-pressed", "false");
};
document.getElementById("setSilver").onclick = () => {
  currentMaterial = "silver";
  document.getElementById("setSilver").classList.add("active");
  document.getElementById("setSilver").setAttribute("aria-pressed", "true");
  document.getElementById("setGold").classList.remove("active");
  document.getElementById("setGold").setAttribute("aria-pressed", "false");
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
  coin.setAttribute("role", "button");
  coin.setAttribute("tabindex", "0");
  coin.setAttribute("aria-label", "Toss this coin");
  coin.innerHTML = `
        <div class="side heads" aria-hidden="true">HEADS</div>
        <div class="side tails" aria-hidden="true">TAILS</div>
    `;
  coin.onclick = () => tossCoin(coin);
  coin.onkeypress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tossCoin(coin);
    }
  };
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

// PWA Installation & Service Worker Logic
const installContainer = document.getElementById("installContainer");
const installAppButton = document.getElementById("installAppButton");
let deferredPrompt;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(
      (registration) => console.log("ServiceWorker registration successful:", registration.scope),
      (err) => console.log("ServiceWorker registration failed:", err)
    );
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installContainer.style.display = "block";
});

installAppButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);
  deferredPrompt = null;
  installContainer.style.display = "none";
});

window.addEventListener("appinstalled", () => {
  installContainer.style.display = "none";
  deferredPrompt = null;
  console.log("PWA was installed successfully");
});
