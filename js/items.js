// ===============================
// SEGURIDAD INVENTARIO (ANTI-NaN FIX)
// ===============================
function asegurarInventario() {
    const items = [
        "pocion", "espada", "armadura",
        "cristal", "orbe",
        "espadaLegendaria", "armaduraEpica", "magia", "orbeUsados"
    ];

    items.forEach(item => {
        jugador.inventario[item] = Number(jugador.inventario[item]) || 0;
    });

    // Evitar NaN en magia
    jugador.magia = Number(jugador.magia) || 0;
    jugador.inventario.orbeUsados = Number(jugador.inventario.orbeUsados) || 0;
}

// ===============================
// APRENDER MAGIA
// ===============================
function aprenderMagia() {
    if (jugador.vida <= 0) return;

    asegurarInventario();

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    if (jugador.magia < maxMagia) {
        jugador.magia++;
        jugador.inventario.magia++;
        const magiaRestante = maxMagia - jugador.magia;
        mensajeEl.textContent = `✨ Magia: ${jugador.magia} (faltan ${magiaRestante})`;
    } else {
        mensajeEl.textContent = `⚠️ Límite alcanzado`;
    }

    actualizarUI();
    actualizarBarraMagia(maxMagia);
}

// ===============================
// ACCIONES BÁSICAS
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
    if (jugador.inventario.espada <= 0) return;

    jugador.ataque += 5;
    jugador.inventario.espada--;
    mensajeEl.textContent = "⚔️ +5 ataque";

    animarBoton(equiparArmaBtn);
    actualizarUI();
}

function equiparArmadura() {
    if (jugador.inventario.armadura <= 0) return;

    jugador.defensa += 3;
    jugador.inventario.armadura--;
    mensajeEl.textContent = "🛡️ +3 defensa";

    animarBoton(equiparArmaduraBtn);
    actualizarUI();
}

// ===============================
// ITEMS
// ===============================
function usarCristal() {
    asegurarInventario();
    if (jugador.inventario.cristal <= 0) return;

    jugador.ataque += 15;
    jugador.inventario.cristal--;
    mensajeEl.textContent = "💎 +15 ataque";

    animarBoton(usarCristalBtn);
    actualizarUI();
}

// ===============================
// 🔮 ORBE
// ===============================
function usarOrbe() {
    asegurarInventario();

    if (jugador.inventario.orbe <= 0) return;

    jugador.inventario.orbe--;
    jugador.inventario.orbeUsados++;

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    jugador.magia += 2;
    if (jugador.magia > maxMagia) jugador.magia = maxMagia;

    mensajeEl.textContent = "🔮 +2 magia";

    animarBoton(usarOrbeBtn);
    actualizarUI();
    actualizarBarraMagia(maxMagia);
}
function equiparEspadaLegendaria() {
    asegurarInventario();
    if (jugador.inventario.espadaLegendaria <= 0) return;

    jugador.ataque += 25;
    jugador.inventario.espadaLegendaria--;
    mensajeEl.textContent = "⚔️ +25 ataque";

    animarBoton(equiparEspadaLegendariaBtn);
    actualizarUI();
}
function equiparArmaduraEpica() {
    asegurarInventario();
    if (jugador.inventario.armaduraEpica <= 0) return;

    jugador.defensa += 7;
    jugador.inventario.armaduraEpica--;
    mensajeEl.textContent = "🛡️ +7 defensa";

    animarBoton(equiparArmaduraEpicaBtn);
    actualizarUI();
}
function equiparArmaduraLegendaria() {
    asegurarInventario();
    if (jugador.inventario.armaduraLegendaria <= 0) return;
        
    jugador.defensa += 15;
    jugador.vidaMax += 25;
    jugador.inventario.armaduraLegendaria--;

    mensajeEl.textContent = `🛡️ Armadura LEGENDARIA +15 defensa, +25 vida)`;

    actualizarUI();
}
function equiparCasco() {
    asegurarInventario();

    if (jugador.inventario.casco <= 0) return;

    jugador.defensa += 5;
    jugador.vidaMax += 3;
    jugador.inventario.casco--;

    mensajeEl.textContent = `⛑️ Casco +5 defensa, +3 vida)`;

    actualizarUI();
}
function equiparCamisa() {
    asegurarInventario();

    if (jugador.inventario.camisa <= 0) return;
       
    jugador.defensa += 7;
    jugador.vidaMax += 10;
    jugador.inventario.camisa--;

    mensajeEl.textContent = `👕 Camisa equipada +7 defensa, +10 vida)`;

    actualizarUI();
}
function equiparGuantes() {
    asegurarInventario();

    if (jugador.inventario.guantes <= 0) return;
      
    jugador.ataque += 10;
    jugador.magia += magia;
    jugador.inventario.guantes--;

    mensajeEl.textContent = `🧤 Guantes +10 ataque, +${magia} magia)`;

    actualizarUI();
}
function equiparPantalon() {
    asegurarInventario();

    if (jugador.inventario.pantalon <= 0) return;
    
    jugador.defensa += 8;
    jugador.vidaMax += 6;
    jugador.inventario.pantalon--;

    mensajeEl.textContent = `👖 Pantalón +8 defensa, +6 vida)`;

    actualizarUI();
}
function equiparBotas() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.botas <= 0) return;

    jugador.defensa += 6;
    jugador.vidaMax += 2;
    jugador.inventario.botas--;

    mensajeEl.textContent = `👢 Botas +6 defensa, +2 vida)`;

    actualizarUI();
}
function equiparBotasEpicas() {
    asegurarInventario();

    if (jugador.inventario.botasEpicas <= 0) return;


    jugador.defensa += 9;
    jugador.vidaMax += 10;
    jugador.inventario.botasEpicas--;

    mensajeEl.textContent = `👢 Botas épicas +9 defensa, +10 vida)`;

    actualizarUI();
}
function equiparCascoEpico() {
    asegurarInventario();

    if (jugador.inventario.cascoEpico <= 0) return;

    jugador.defensa += 7;
    jugador.vidaMax += 12;
    jugador.inventario.cascoEpico--;

    mensajeEl.textContent = `⛑️ Casco épico +7 defensa, +12 vida)`;

    actualizarUI();
}
function equiparDaga() {
    asegurarInventario();

    if (jugador.inventario.daga <= 0) return;

    jugador.ataque += 15;
    jugador.inventario.daga--;

    mensajeEl.textContent = `🗡️ Daga +15 ataque)`;

    actualizarUI();
}
function equiparArco() {
    asegurarInventario();

    if (jugador.inventario.daga <= 0) return;

    jugador.ataque += 15;
    jugador.inventario.daga--;

    mensajeEl.textContent = `🗡️ Daga +15 ataque)`;

    actualizarUI();
}
