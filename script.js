const coinContainer = document.getElementById("coinContainer");
const tossButton = document.getElementById("tossButton");
const addCoinsButton = document.getElementById("addCoinsButton");
const tossAllButton = document.getElementById("tossAllButton");
const coinCountInput = document.getElementById("coinCount");
const headsCount = document.getElementById("headsCount");
const tailsCount = document.getElementById("tailsCount");
const totalCoinsCount = document.getElementById("totalCoinsCount");
const totalTossCount = document.getElementById("totalTossCount");
const tossStyleToggle = document.getElementById("tossStyleToggle");
const fullScreenIcon = document.getElementById("fullScreenIcon");
const exitFullScreenIcon = document.getElementById("exitFullScreenIcon");

const spinSound = document.getElementById("spin");
const flipSound = document.getElementById("flip");

fullScreenIcon.addEventListener("click", () => {
  coinContainer.classList.add("full-screen");
});

exitFullScreenIcon.addEventListener("click", () => {
  coinContainer.classList.remove("full-screen");
});

let heads = 0;
let tails = 0;
let totalTosses = 0;
let totalCoins = 1;

function createCoin() {
  const coin = document.createElement("div");
  coin.classList.add("coin");
  coin.innerHTML = `
    <div class="side heads">Heads</div>
    <div class="side tails">Tails</div>
  `;
  coin.addEventListener("click", () => tossCoin(coin));
  coinContainer.appendChild(coin);
  totalCoinsCount.textContent = totalCoins;
}

function tossCoin(coin) {
  if (navigator.vibrate) {
    navigator.vibrate(70);
  }
  const random = Math.random();
  const result = random < 0.5 ? "heads" : "tails";
  const tossStyle = tossStyleToggle.checked ? "toss" : "spin";
  coin.style.animation = "none";
  setTimeout(() => {
    coin.style.animation =
      tossStyle == "spin"
        ? `${tossStyle} 4.7s ease-out`
        : `${tossStyle} 1s ease-out`;
    coin.style.zIndex = 9; // Bring the coin above everything
    tossStyle === "spin" ? spinSound.play() : flipSound.play();
  }, 10);
  setTimeout(() => {
    if (result === "heads") {
      heads++;
      coin.style.transform = "rotateY(0deg)";
    } else {
      tails++;
      coin.style.transform = "rotateY(180deg)";
    }
    headsCount.textContent = heads;
    tailsCount.textContent = tails;
    totalTosses++;
    totalTossCount.textContent = totalTosses;
    coin.style.zIndex = 0;
  }, 1000);
}

function tossAllCoins() {
  const coins = document.querySelectorAll(".coin");
  coins.forEach((coin) => tossCoin(coin));
}

tossButton.addEventListener("click", () => {
  const coin = document.querySelector(".coin");
  if (coin) tossCoin(coin);
});

addCoinsButton.addEventListener("click", () => {
  const count = parseInt(coinCountInput.value) || 1;
  for (let i = 0; i < count; i++) {
    createCoin();
    totalCoins++;
  }
  totalCoinsCount.textContent = totalCoins;
});

tossAllButton.addEventListener("click", tossAllCoins);

createCoin();
