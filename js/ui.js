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

    // Calcula magia máxima considerando bonus de Orbes
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados || 0;
    const maxMagia = maxMagiaBase + bonusOrbes;

    // Inventario visual
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

    // 🔹 Mostrar u ocultar botones de items raros
    usarCristalBtn.style.display = jugador.inventario.cristal > 0 ? "block" : "none";
    usarOrbeBtn.style.display = jugador.inventario.orbe > 0 ? "block" : "none";
    equiparEspadaLegendariaBtn.style.display = jugador.inventario.espadaLegendaria > 0 ? "block" : "none";
    equiparArmaduraEpicaBtn.style.display = jugador.inventario.armaduraEpica > 0 ? "block" : "none";

    // 🔹 Botón de inventario siempre visible
    if (abrirInventarioBtn) abrirInventarioBtn.style.display = "block";
}
// ===============================
// APRENDER MAGIA (actualizado)
// ===============================
function aprenderMagia() {
    if (jugador.vida <= 0) return;

    // Magia base por nivel
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;

    // Bonus de magia por Orbes usados
    const bonusOrbes = jugador.inventario.orbeUsados || 0;

    const maxMagia = maxMagiaBase + bonusOrbes;

    // Si todavía puedes aprender magia
    if (jugador.magia < maxMagia) {
        jugador.magia++; // Subir 1 punto
        jugador.inventario.magia++;
        const magiaRestante = maxMagia - jugador.magia;
        mensajeEl.textContent = `✨ Aprendiste magia! Magia actual: ${jugador.magia} (faltan ${magiaRestante} para el límite del nivel + Orbes)`;
    } else {
        mensajeEl.textContent = `⚠️ No puedes aumentar magia todavía (nivel ${jugador.nivel})`;
    }

    actualizarUI();
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
// ===============================
// USAR ORBE ( para bonus)
// ===============================
function usarOrbe() {
    if (jugador.inventario.orbe <= 0) return;

    // Inicializa el contador de Orbes usados si no existe
    if (!jugador.inventario.orbeUsados) jugador.inventario.orbeUsados = 0;

    jugador.magia += 2;                  // Cada Orbe da +2 magia
    jugador.inventario.orbe--;           
    jugador.inventario.orbeUsados++;     // Suma al bonus de magia

    mensajeEl.textContent = `🔮 Usaste Orbe Arcano (+2 magia)`;
    animarBoton(usarOrbeBtn);
    actualizarUI();

    // Actualiza barra de magia considerando bonus de Orbes
    const maxMagia = Math.floor(jugador.nivel / 3) * 2 + jugador.inventario.orbeUsados;
    actualizarBarraMagia(maxMagia);
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
// ===============================
// BARRA VISUAL DE MAGIA
// ===============================
function actualizarBarraMagia(maxMagia) {
    let barraMagia = document.getElementById("barraMagia");

    if (!barraMagia) {
        barraMagia = document.createElement("div");
        barraMagia.id = "barraMagia";
        barraMagia.style.width = "200px";
        barraMagia.style.height = "20px";
        barraMagia.style.background = "#444";
        barraMagia.style.border = "2px solid #000";
        barraMagia.style.borderRadius = "5px";
        barraMagia.style.position = "relative";
        barraMagia.style.marginTop = "10px";

        const fillBase = document.createElement("div");
        fillBase.id = "barraMagiaFillBase";
        fillBase.style.height = "100%";
        fillBase.style.width = "0%";
        fillBase.style.background = "#00f"; // magia base: azul
        fillBase.style.borderRadius = "3px";
        fillBase.style.position = "absolute";
        fillBase.style.left = "0";
        fillBase.style.top = "0";

        const fillBonus = document.createElement("div");
        fillBonus.id = "barraMagiaFillBonus";
        fillBonus.style.height = "100%";
        fillBonus.style.width = "0%";
        fillBonus.style.background = "#0ff"; // magia extra de Orbes: cian
        fillBonus.style.borderRadius = "3px";
        fillBonus.style.position = "absolute";
        fillBonus.style.left = "0";
        fillBonus.style.top = "0";

        barraMagia.appendChild(fillBase);
        barraMagia.appendChild(fillBonus);

        document.getElementById("gameArea").appendChild(barraMagia);
    }

    const fillBase = document.getElementById("barraMagiaFillBase");
    const fillBonus = document.getElementById("barraMagiaFillBonus");

    // Calculamos magia base y bonus
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados || 0;
    const magiaBase = Math.min(jugador.magia, maxMagiaBase);
    const magiaBonus = Math.max(0, jugador.magia - maxMagiaBase);

    // Actualizamos las barras
    fillBase.style.width = maxMagiaBase > 0 ? (magiaBase / maxMagia) * 100 + "%" : "0%";
    fillBonus.style.width = maxMagia > 0 ? (magiaBonus / maxMagia) * 100 + "%" : "0%";
}
