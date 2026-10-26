
document.addEventListener("DOMContentLoaded", () => {

  if (
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const symbols = ["✦", "✧", "⋆", "✳", "·","СИЯЙ", "ТВОРИ", "ПИШИ", "ГОРИ", "СВЕТИ", "ГРЕЙ", "✳", "·" ];
  const colors = [
    "#D8ED9C", // лаймовый
    "#FF91C8", // розовый
    "#A9B9FF", // голубой
    "#C7A5FF", // сиреневый
    "#FFCA70", // жёлтый
    "#FFFFFF"  // белый
  ];

  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;

  document.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const now = performance.now();

    // Расстояние между искрами
    const distance = Math.hypot(x - lastX, y - lastY);

    if (distance < 10 || now - lastTime < 100) return;

    lastX = x;
    lastY = y;
    lastTime = now;

    createSparkle(x, y);
  });

  function createSparkle(x, y) {
    const sparkle = document.createElement("span");

    sparkle.className = "cursor-sparkle";
    sparkle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    const size = Math.random() * 13 + 30;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 5 + 60;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.fontSize = `${size}px`;
    sparkle.style.color =
      colors[Math.floor(Math.random() * colors.length)];

    sparkle.style.setProperty("--dx", `${dx}px`);
    sparkle.style.setProperty("--dy", `${dy}px`);
    sparkle.style.setProperty(
      "--rotation",
      `${Math.random() * 240 - 120}deg`
    );

    document.body.appendChild(sparkle);

    sparkle.addEventListener("animationend", () => {
      sparkle.remove();
    }, { once: true });
  }
});
