// ===============================
// 🤖 IA PRO ENEMIGOS (SEGUIMIENTO + COMBATE)
// ===============================

(function () {

    console.log("🧠 IA PRO cargada");

    const velocidadBase = 1.5;
    const rangoAtaque = 60;

    function updateEnemigos() {

        const jugador = document.getElementById("jugador");
        if (!jugador) return;

        const jx = jugador.offsetLeft;
        const jy = jugador.offsetTop;

        const enemigosDOM = document.querySelectorAll(".enemigo");

        enemigosDOM.forEach((enemigoDiv, i) => {

            let ex = enemigoDiv.offsetLeft;
            let ey = enemigoDiv.offsetTop;

            let dx = jx - ex;
            let dy = jy - ey;

            let distancia = Math.sqrt(dx * dx + dy * dy);

            // ===============================
            // 🎯 COMPORTAMIENTO SEGÚN IA
            // ===============================
            let tipo = enemigoDiv.title;
            let velocidad = velocidadBase;

            if (tipo === "agresivo") velocidad *= 1.5;
            if (tipo === "defensivo") velocidad *= 0.7;
            if (tipo === "mago") velocidad *= 1.1;

            // ===============================
            // 🧠 MOVIMIENTO INTELIGENTE
            // ===============================
            if (distancia > rangoAtaque) {

                let moveX = (dx / distancia) * velocidad * 2;
                let moveY = (dy / distancia) * velocidad * 2;

                // 🔥 efecto "rodear" (no fila india)
                moveX += Math.sin(Date.now() / 300 + i) * 1.5;

                enemigoDiv.style.left = (ex + moveX) + "px";
                enemigoDiv.style.top = (ey + moveY) + "px";

            } else {
                // ===============================
                // ⚔️ ATAQUE CERCANO (VISUAL)
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
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(updateEnemigos, 500);
    });

})();
