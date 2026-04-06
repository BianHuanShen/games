// ===============================
// Actualización de UI del jugador
// ===============================
function actualizarUI() {
    // ===============================
    // Stats del jugador
    // ===============================
    vidaJugadorFill.style.width = `${Math.max(0, (jugador.vida / jugador.vidaMax) * 100)}%`;
    ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    magiaJugadorEl.textContent = jugador.magia;
    nivelJugadorEl.textContent = jugador.nivel;
    puntajeEl.textContent = jugador.puntaje;

    // ===============================
    // Magia máxima
    // ===============================
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    // ===============================
    // Inventario visual
    // ===============================
    listaInventarioEl.innerHTML = `
        <li>🧪 Pociones: ${jugador.inventario.pocion}</li>
        <li>⚔️ Espadas: ${jugador.inventario.espada}</li>
        <li>🛡️ Armaduras: ${jugador.inventario.armadura}</li>
        <li>💎 Cristales: ${jugador.inventario.cristal}</li>
        <li>🔮 Orbes: ${jugador.inventario.orbe}</li>
        <li>⚔️ Espadas Legendarias: ${jugador.inventario.espadaLegendaria}</li>
        <li>🛡️ Armaduras Épicas: ${jugador.inventario.armaduraEpica}</li>
        <li>✨ Magia: ${jugador.magia} / ${maxMagia} ${bonusOrbes > 0 ? `(+${bonusOrbes} Orbes)` : ""}</li>
    `;

    // ===============================
    // Botones (se muestran solo si hay items)
    // ===============================

    // 🔹 Básicos
    if (usarPocionBtn) usarPocionBtn.style.display = jugador.inventario.pocion > 0 ? "block" : "none";
    if (equiparEspadaBtn) equiparEspadaBtn.style.display = jugador.inventario.espada > 0 ? "block" : "none";
    if (equiparArmaduraBtn) equiparArmaduraBtn.style.display = jugador.inventario.armadura > 0 ? "block" : "none";

    // 🔹 Raros
    if (usarCristalBtn) usarCristalBtn.style.display = jugador.inventario.cristal > 0 ? "block" : "none";
    if (usarOrbeBtn) usarOrbeBtn.style.display = jugador.inventario.orbe > 0 ? "block" : "none";
    if (equiparEspadaLegendariaBtn) equiparEspadaLegendariaBtn.style.display = jugador.inventario.espadaLegendaria > 0 ? "block" : "none";
    if (equiparArmaduraEpicaBtn) equiparArmaduraEpicaBtn.style.display = jugador.inventario.armaduraEpica > 0 ? "block" : "none";

    // ===============================
    // Botón inventario (siempre visible)
    // ===============================
    if (abrirInventarioBtn) abrirInventarioBtn.style.display = "block";
}
