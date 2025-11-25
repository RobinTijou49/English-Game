const wheel = document.getElementById("wheel");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");
const spinBtn = document.getElementById("spin-btn");

const games = [
  { name: "Typing", file: "typing.html" },
  { name: "Cables", file: "cables.html" },
  { name: "FastKey", file: "fastkey.html" },
  { name: "Avoid", file: "avoid.html" },
  { name: "Maze", file: "maze.html" }
];

let spinning = false;

spinBtn.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;

  const randomIndex = Math.floor(Math.random() * games.length);
  const chosen = games[randomIndex];

  const sliceAngle = 360 / games.length;
  const offset = sliceAngle / 2;

  const targetAngle =
    360 * 6 + (360 - (randomIndex * sliceAngle + offset)); // +6 tours pour mobile

  wheel.style.transform = `rotate(${targetAngle}deg)`;
  wheel.style.webkitTransform = `rotate(${targetAngle}deg)`; // iPhone FIX

  setTimeout(() => {
    popup.classList.add("show");
    popupText.textContent = "🎮 Jeu tiré : " + chosen.name;

    setTimeout(() => {
      window.location.href = chosen.file;
    }, 2000);

  }, 4200);
});
