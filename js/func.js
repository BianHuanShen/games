// ===============================
// MODO DIOS (PLUGIN EXTERNO)
// ===============================

(function () {

    console.log("🔥 MODO DIOS ACTIVADO");

    // ===============================
    // AUTO REVIVIR
    // ===============================
    function autoRevivir() {
        if (jugador.vida <= 0) {
            jugador.vida = jugador.vidaMax * 0.5;

            mensajeEl.textContent += "\n✨ Un poder misterioso te revive...";

            desbloquearBotones();
            actualizarUI();
        }
    }

    // ===============================
    // DESBLOQUEAR BOTONES
    // ===============================
    function desbloquearBotones() {
        atacarBtn.disabled = false;
        curarBtn.disabled = false;
        equiparArmaBtn.disabled = false;
        equiparArmaduraBtn.disabled = false;
        aprenderMagiaBtn.disabled = false;
    }

    // ===============================
    // BUFF DINÁMICO (SI CASI MUERES)
    // ===============================
    function buffEmergencia() {
        if (jugador.vida < jugador.vidaMax * 0.2 && jugador.vida > 0) {

            jugador.ataque += 2;
            jugador.defensa += 2;

            mensajeEl.textContent += "\n🔥 Instinto de supervivencia activado!";
        }
    }

    // ===============================
    // RECOMPENSA PASIVA
    // ===============================
    function recompensaPasiva() {

        if (Math.random() < 0.1) {
            jugador.inventario.pocion++;

            mensajeEl.textContent += "\n🎁 Encontraste una poción oculta";
        }
    }

    // ===============================
    // SUPER LOOT (ENEMIGOS)
    // ===============================
    const originalDarLoot = darLoot;

    window.darLoot = function () {

        let loot = originalDarLoot();

        if (Math.random() < 0.3) {
            jugador.inventario.pocion += 3;
            loot += " + BONUS";
        }

        return loot;
    };

    // ===============================
    // LOOP SECRETO
    // ===============================
    setInterval(() => {
        autoRevivir();
        buffEmergencia();
        recompensaPasiva();
        actualizarUI();
    }, 2000);

    // ===============================
    // COMANDOS SECRETOS
    // ===============================
    document.addEventListener("keydown", (e) => {

        // GOD MODE ON
        if (e.key === "g") {
            jugador.ataque += 50;
            jugador.defensa += 50;
            jugador.vida = jugador.vidaMax;

            mensajeEl.textContent = "😈 MODO DIOS ACTIVADO";
        }

        // ORO / POCIONES
        if (e.key === "p") {
            jugador.inventario.pocion += 10;
            mensajeEl.textContent = "🧪 +10 pociones";
        }

        // LEVEL UP
        if (e.key === "l") {
            jugador.nivel++;
            nivelActual++;

            mensajeEl.textContent = "✨ Subiste de nivel (modo dios)";
            generarNivel();
        }

        actualizarUI();
    });

})();