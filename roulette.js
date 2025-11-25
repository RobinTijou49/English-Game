const wheel = document.getElementById("wheel");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");
const spinBtn = document.getElementById("spin-btn");

const games = [
  { name: "Typing Test", file: "typing.html" },
  { name: "Connect the Cables", file: "cables.html" },
  { name: "Fast Key", file: "fastkey.html" },
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
    360 * 5 + (360 - (randomIndex * sliceAngle + offset));

  wheel.style.transform = `rotate(${targetAngle}deg)`;

  setTimeout(() => {
    popup.classList.remove("hidden");
    popupText.textContent = "🎮 Jeu choisi : " + chosen.name + " !";

    setTimeout(() => {
      window.location.href = chosen.file;
    }, 2000);

  }, 4100);
});
