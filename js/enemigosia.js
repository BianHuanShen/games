// ===============================
// 🤖 IA PRO ENEMIGOS (SEGUIMIENTO + COMBATE)
// ===============================

function tipoIA() {
    const tipos = ["agresivo", "defensivo", "mago"];
    return tipos[Math.floor(Math.random() * tipos.length)];
}

(function () {
    console.log("🧠 IA PRO cargada");

    const velocidadBase = 1.5;
    const rangoAtaque = 60;

    function updateEnemigos() {
        const jugador = document.getElementById("jugador");
        if (!jugador) return; // 🔥 bloqueo si jugador no existe

        const jx = jugador.offsetLeft + jugador.offsetWidth / 2;
        const jy = jugador.offsetTop + jugador.offsetHeight / 2;

        const enemigosDOM = document.querySelectorAll(".enemigo");

        enemigosDOM.forEach((enemigoDiv, i) => {
            let ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
            let ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;

            let dx = jx - ex;
            let dy = jy - ey;
            let distancia = Math.sqrt(dx * dx + dy * dy);

            // ===============================
            // 🎯 COMPORTAMIENTO SEGÚN IA
            // ===============================
            let tipo = enemigoDiv.title || "agresivo";
            let velocidad = velocidadBase;

            if (tipo === "agresivo") velocidad *= 1.5;
            if (tipo === "defensivo") velocidad *= 0.7;
            if (tipo === "mago") velocidad *= 1.1;

            // ===============================
            // 🧠 MOVIMIENTO INTELIGENTE
            // ===============================
            if (distancia > rangoAtaque) {
                let moveX = (dx / distancia) * velocidad;
                let moveY = (dy / distancia) * velocidad;

                // 🔥 efecto "rodear" para que no se amontonen
                moveX += Math.sin(Date.now() / 300 + i) * 1.5;

                enemigoDiv.style.left = (enemigoDiv.offsetLeft + moveX) + "px";
                enemigoDiv.style.top = (enemigoDiv.offsetTop + moveY) + "px";
            } else {
                // ===============================
                // ⚔️ ATAQUE CERCANO (solo visual)
                // ===============================
                enemigoDiv.style.transform = "scale(1.1)";
                setTimeout(() => {
                    enemigoDiv.style.transform = "scale(1)";
                }, 100);
            }
        });

        requestAnimationFrame(updateEnemigos);
    }

    // ===============================
    // START LOOP
    // ===============================
    window.addEventListener("load", () => {
        updateEnemigos(); // 🔥 loop infinito
    });
})();
