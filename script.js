const candlesContainer = document.getElementById("candles");
const merci = document.getElementById("merci");
const candleCount = 33;
let blown = false;

// Création des bougies (tailles différentes)
for (let i = 0; i < candleCount; i++) {
    const candle = document.createElement("div");
    candle.className = "candle";

    const height = 34 + Math.random() * 16;
    candle.style.height = height + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    // Zone ovale du gâteau
    const x = Math.random() * 240 + 40;
    const y = Math.random() * 55 + 20;

    candle.style.left = x + "px";
    candle.style.top = y + "px";

    candle.style.transform = `
        rotate(${Math.random() * 6 - 3}deg)
        translateZ(${20 + Math.random() * 20}px)
    `;

    candlesContainer.appendChild(candle);
}

// MICRO (desktop + mobile)
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);

    function detectBlow() {
        analyser.getByteTimeDomainData(data);
        let volume = data.reduce((s, v) => s + Math.abs(v - 128), 0) / data.length;

        if (volume > 28 && !blown) {
            blown = true;
            blowOut();
        }
        requestAnimationFrame(detectBlow);
    }
    detectBlow();
}).catch(() => {
    document.querySelector("h1").innerText = "Autorise le micro pour souffler 🎤";
});

// Extinction + fumée
function blowOut() {
    document.querySelectorAll(".candle").forEach(candle => {
        const flame = candle.querySelector(".flame");
        if (flame) flame.remove();

        const smoke = document.createElement("div");
        smoke.className = "smoke";
        candle.appendChild(smoke);
    });

    merci.classList.remove("hidden");
    setTimeout(() => merci.classList.add("show"), 500);
}
