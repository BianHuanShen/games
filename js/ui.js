// ===============================
// Actualización de UI del jugador
// ===============================
function actualizarUI() {
    vidaJugadorFill.style.width = `${Math.max(0, (jugador.vida / jugador.vidaMax) * 100)}%`;
    ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    magiaJugadorEl.textContent = jugador.magia;
    nivelJugadorEl.textContent = jugador.nivel;
    puntajeEl.textContent = jugador.puntaje;

    const maxMagia = Math.floor(jugador.nivel / 3) * 2;

    listaInventarioEl.innerHTML = `
        <li>🧪 Pociones: ${jugador.inventario.pocion}</li>
        <li>⚔️ Espadas: ${jugador.inventario.espada}</li>
        <li>🛡️ Armaduras: ${jugador.inventario.armadura}</li>
        <li>💎 Cristales: ${jugador.inventario.cristal}</li>
        <li>🔮 Orbes: ${jugador.inventario.orbe}</li>
        <li>⚔️ Espadas Legendarias: ${jugador.inventario.espadaLegendaria}</li>
        <li>🛡️ Armaduras Épicas: ${jugador.inventario.armaduraEpica}</li>
        <li>✨ Magia: ${jugador.magia} / ${maxMagia}</li>
    `;

    actualizarBarraMagia(maxMagia);
}

// ===============================
// ACCIONES JUGADOR
// ===============================
function curar() {
    if (jugador.vida <= 0 || jugador.inventario.pocion <= 0) return;
    jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 25);
    jugador.inventario.pocion--;
    mensajeEl.textContent = "🧪 Usaste Poción";
    actualizarUI();
}

function equiparArma() {
    if (jugador.vida <= 0 || jugador.inventario.espada <= 0) return;
    jugador.ataque += 5;
    jugador.inventario.espada--;
    mensajeEl.textContent = "⚔️ Usaste 1 Espada (+5 ataque)";
    actualizarUI();
}

function equiparArmadura() {
    if (jugador.vida <= 0 || jugador.inventario.armadura <= 0) return;
    jugador.defensa += 3;
    jugador.inventario.armadura--;
    mensajeEl.textContent = "🛡️ Usaste 1 Armadura (+3 defensa)";
    actualizarUI();
}

// ===============================
// NUEVAS ACCIONES PARA ITEMS RAROS
// ===============================
function usarCristal() {
    if (jugador.inventario.cristal <= 0) return;
    jugador.ataque += 15; // Los raros son más poderosos
    jugador.inventario.cristal--;
    mensajeEl.textContent = "💎 Usaste Cristal Místico (+15 ataque)";
    actualizarUI();
}

function usarOrbe() {
    if (jugador.inventario.orbe <= 0) return;
    jugador.magia += 5;
    jugador.inventario.orbe--;
    mensajeEl.textContent = "🔮 Usaste Orbe Arcano (+5 magia)";
    actualizarUI();
}

function equiparEspadaLegendaria() {
    if (jugador.inventario.espadaLegendaria <= 0) return;
    jugador.ataque += 25;
    jugador.inventario.espadaLegendaria--;
    mensajeEl.textContent = "⚔️ Usaste Espada Legendaria (+25 ataque)";
    actualizarUI();
}

function equiparArmaduraEpica() {
    if (jugador.inventario.armaduraEpica <= 0) return;
    jugador.defensa += 15;
    jugador.inventario.armaduraEpica--;
    mensajeEl.textContent = "🛡️ Usaste Armadura Épica (+15 defensa)";
    actualizarUI();
}
