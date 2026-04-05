// ===============================
// 🤖 IA PRO ENEMIGOS (SEGUIMIENTO + COMBATE)
// ===============================

function tipoIA() {
    const tipos = ["agresivo", "defensivo", "mago"];
    return tipos[Math.floor(Math.random() * tipos.length)];
}

(function () {
    console.log("🧠 IA PRO cargada");

    // ===============================
    // 🔹 CONSTANTES
    // ===============================
    const velocidadBase = 1.5;
    const rangoAtaque = 60;

    // ===============================
    // 🔹 FUNCIONES DE IA / MOVIMIENTO
    // ===============================
    function updateEnemigos() {
        const jugador = document.getElementById("jugador");
        if (!jugador) return; // 🔥 bloqueo si jugador no existe

        const jx = jugador.offsetLeft + jugador.offsetWidth / 2;
        const jy = jugador.offsetTop + jugador.offsetHeight / 2;

        const enemigosDOM = document.querySelectorAll(".enemigo");

        enemigosDOM.forEach((enemigoDiv, i) => {
            const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
            const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;

            const dx = jx - ex;
            const dy = jy - ey;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            // 🎯 COMPORTAMIENTO SEGÚN IA
            const tipo = enemigoDiv.title || "agresivo";
            let velocidad = velocidadBase;

            if (tipo === "agresivo") velocidad *= 1.5;
            if (tipo === "defensivo") velocidad *= 0.7;
            if (tipo === "mago") velocidad *= 1.1;

            // 🧠 MOVIMIENTO INTELIGENTE
            if (distancia > rangoAtaque) {
                let moveX = (dx / distancia) * velocidad;
                let moveY = (dy / distancia) * velocidad;

                // 🔥 efecto "rodear" para que no se amontonen
                moveX += Math.sin(Date.now() / 300 + i) * 1.5;

                enemigoDiv.style.left = (enemigoDiv.offsetLeft + moveX) + "px";
                enemigoDiv.style.top = (enemigoDiv.offsetTop + moveY) + "px";
            } else {
                // ⚔️ ATAQUE CERCANO (solo visual)
                enemigoDiv.style.transform = "scale(1.1)";
                setTimeout(() => {
                    enemigoDiv.style.transform = "scale(1)";
                }, 100);
            }
        });

        requestAnimationFrame(updateEnemigos);
    }

    // ===============================
    // 🔹 FUNCION DIBUJAR ENEMIGOS
    // ===============================
    function dibujarEnemigos() {
        const gameArea = document.getElementById("gameArea");
        if (!gameArea) return;

        // Limpiar enemigos antiguos
        gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

        enemigos.forEach((enemigo, index) => {
            const enemigoDiv = document.createElement("div");
            enemigoDiv.classList.add("enemigo");

            // Identificar jefe
            if (enemigo.jefe) {
                enemigoDiv.dataset.jefe = "true";
            }

            // Guardar índice y tipo para IA
            enemigoDiv.dataset.index = index;
            enemigoDiv.title = enemigo.ia; // agresivo, defensivo, mago

            // Posición inicial aleatoria en x dentro del escenario
            enemigoDiv.style.left = (50 + index * 80) + "px";
            enemigoDiv.style.bottom = "10px";

            // Barra de vida
            const barraVida = document.createElement("div");
            barraVida.style.width = (enemigo.vida / enemigo.vidaMax * 100) + "%";
            barraVida.style.height = "100%";
            barraVida.style.background = "linear-gradient(to right, #ffcc00, #ff0000)";
            barraVida.style.borderRadius = "8px";

            const barraContenedor = document.createElement("div");
            barraContenedor.classList.add("barra-vida");
            barraContenedor.appendChild(barraVida);

            enemigoDiv.appendChild(barraContenedor);
            gameArea.appendChild(enemigoDiv);
        });
    }

    // ===============================
    // 🔹 INICIO DEL LOOP
    // ===============================
    window.addEventListener("load", () => {
        dibujarEnemigos(); // Dibuja enemigos al inicio
        updateEnemigos();  // Inicia loop de IA
    });

})();
