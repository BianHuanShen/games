// ===============================
// Actualización de UI del jugador
// ===============================
// ===============================
// Actualización de UI del jugador
// ===============================
function actualizarUI() {
    // Vida, ataque, defensa, magia, nivel y puntaje
    vidaJugadorFill.style.width = `${Math.max(0, (jugador.vida / jugador.vidaMax) * 100)}%`;
    ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    magiaJugadorEl.textContent = jugador.magia;
    nivelJugadorEl.textContent = jugador.nivel;
    puntajeEl.textContent = jugador.puntaje;

    const maxMagia = Math.floor(jugador.nivel / 3) * 2;

    // Inventario visual
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

    // 🔹 Mostrar u ocultar botones de items raros
    usarCristalBtn.style.display = jugador.inventario.cristal > 0 ? "block" : "none";
    usarOrbeBtn.style.display = jugador.inventario.orbe > 0 ? "block" : "none";
    equiparEspadaLegendariaBtn.style.display = jugador.inventario.espadaLegendaria > 0 ? "block" : "none";
    equiparArmaduraEpicaBtn.style.display = jugador.inventario.armaduraEpica > 0 ? "block" : "none";

    // 🔹 Botón de inventario siempre visible
    if (abrirInventarioBtn) abrirInventarioBtn.style.display = "block";
}
// ===============================
// ACCIONES JUGADOR
// ===============================
function curar() {
    if (jugador.vida <= 0 || jugador.inventario.pocion <= 0) return;
    jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 25);
    jugador.inventario.pocion--;
    mensajeEl.textContent = "🧪 Usaste Poción";
    animarBoton(curarBtn);
    actualizarUI();
}

function equiparArma() {
    if (jugador.vida <= 0 || jugador.inventario.espada <= 0) return;
    jugador.ataque += 5;
    jugador.inventario.espada--;
    mensajeEl.textContent = "⚔️ Usaste 1 Espada (+5 ataque)";
    animarBoton(equiparArmaBtn);
    actualizarUI();
}

function equiparArmadura() {
    if (jugador.vida <= 0 || jugador.inventario.armadura <= 0) return;
    jugador.defensa += 3;
    jugador.inventario.armadura--;
    mensajeEl.textContent = "🛡️ Usaste 1 Armadura (+3 defensa)";
    animarBoton(equiparArmaduraBtn);
    actualizarUI();
}

// ===============================
// NUEVAS ACCIONES PARA ITEMS RAROS
// ===============================
function usarCristal() {
    if (jugador.inventario.cristal <= 0) return;
    jugador.ataque += 15;
    jugador.inventario.cristal--;
    mensajeEl.textContent = "💎 Usaste Cristal Místico (+15 ataque)";
    animarBoton(usarCristalBtn);
    actualizarUI();
}

function usarOrbe() {
    if (jugador.inventario.orbe <= 0) return;
    jugador.magia += 5;
    jugador.inventario.orbe--;
    mensajeEl.textContent = "🔮 Usaste Orbe Arcano (+5 magia)";
    animarBoton(usarOrbeBtn);
    actualizarUI();
}

function equiparEspadaLegendaria() {
    if (jugador.inventario.espadaLegendaria <= 0) return;
    jugador.ataque += 25;
    jugador.inventario.espadaLegendaria--;
    mensajeEl.textContent = "⚔️ Usaste Espada Legendaria (+25 ataque)";
    animarBoton(equiparEspadaLegendariaBtn);
    actualizarUI();
}

function equiparArmaduraEpica() {
    if (jugador.inventario.armaduraEpica <= 0) return;
    jugador.defensa += 15;
    jugador.inventario.armaduraEpica--;
    mensajeEl.textContent = "🛡️ Usaste Armadura Épica (+15 defensa)";
    animarBoton(equiparArmaduraEpicaBtn);
    actualizarUI();
}

// ===============================
// FUNCIONES DE ANIMACIÓN BOTONES
// ===============================
function animarBoton(btn) {
    btn.classList.add("usar-item-anim");
    setTimeout(() => btn.classList.remove("usar-item-anim"), 300);
}
