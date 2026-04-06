function actualizarUI() {
    // ===============================
    // ❤️ VIDA JUGADOR (PRO)
    // ===============================
    const porcentaje = Math.max(0, (jugador.vida / jugador.vidaMax) * 100);
    vidaJugadorFill.style.width = `${porcentaje}%`;

    // 🔥 COLOR DINÁMICO RPG
    if (porcentaje > 60) {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #2ecc71, #27ae60)";
    } else if (porcentaje > 30) {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #f1c40f, #e67e22)";
    } else {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #e74c3c, #c0392b)";
    }

    // ===============================
    // 📊 STATS
    // ===============================
    ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    magiaJugadorEl.textContent = jugador.magia;
    nivelJugadorEl.textContent = jugador.nivel;
    puntajeEl.textContent = jugador.puntaje;

    // ===============================
    // ✨ SISTEMA DE MAGIA PRO
    // ===============================
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    // ===============================
    // 🎒 INVENTARIO UI
    // ===============================
    listaInventarioEl.innerHTML = `
        <li>🧪 Pociones: ${jugador.inventario.pocion}</li>
        <li>⚔️ Espadas: ${jugador.inventario.espada}</li>
        <li>🛡️ Armaduras: ${jugador.inventario.armadura}</li>
        <li>💎 Cristales: ${jugador.inventario.cristal}</li>
        <li>🔮 Orbes: ${jugador.inventario.orbe}</li>
        <li>⚔️ Espadas Legendarias: ${jugador.inventario.espadaLegendaria}</li>
        <li>🛡️ Armaduras Épicas: ${jugador.inventario.armaduraEpica}</li>
        <li class="critico">
            ✨ Magia: ${jugador.magia} / ${maxMagia} 
            ${bonusOrbes > 0 ? `<span style="color:#00ffff;">(+${bonusOrbes})</span>` : ""}
        </li>
    `;

    // ===============================
    // 🎮 BOTONES DINÁMICOS
    // ===============================
    usarCristalBtn.style.display = jugador.inventario.cristal > 0 ? "block" : "none";
    usarOrbeBtn.style.display = jugador.inventario.orbe > 0 ? "block" : "none";

    curarBtn.style.display = jugador.inventario.pocion > 0 ? "block" : "none";
    equiparArmaBtn.style.display = jugador.inventario.espada > 0 ? "block" : "none";
    equiparArmaduraBtn.style.display = jugador.inventario.armadura > 0 ? "block" : "none";

    equiparEspadaLegendariaBtn.style.display = jugador.inventario.espadaLegendaria > 0 ? "block" : "none";
    equiparArmaduraEpicaBtn.style.display = jugador.inventario.armaduraEpica > 0 ? "block" : "none";

    if (abrirInventarioBtn) {
        abrirInventarioBtn.style.display = "block";
    }
}
