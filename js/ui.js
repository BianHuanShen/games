// ===============================
// UI SYSTEM - COMPLETO Y ESTABLE
// ===============================
function actualizarUI() {
    if (!jugador) return;
    // ===== VIDA =====
    const porcentajeVida = Math.max(0, (jugador.vida / jugador.vidaMax) * 100);

    if (vidaJugadorFill) {
        vidaJugadorFill.style.width = `${porcentajeVida}%`;

        // Color dinámico
        vidaJugadorFill.style.background =
            porcentajeVida > 60
                ? "linear-gradient(90deg, #2ecc71, #27ae60)"
                : porcentajeVida > 30
                ? "linear-gradient(90deg, #f1c40f, #f39c12)"
                : "linear-gradient(90deg, #e74c3c, #c0392b)";
    }
    // ===== STATS =====
    if (ataqueJugadorEl) ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    if (defensaJugadorEl) defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    if (magiaJugadorEl) magiaJugadorEl.textContent = jugador.magia;
    if (nivelJugadorEl) nivelJugadorEl.textContent = jugador.nivel;
    if (puntajeEl) puntajeEl.textContent = jugador.puntaje;

    // ===== MAGIA =====
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;
       // ===== INVENTARIO COMPLETO =====
    if (listaInventarioEl) {
        listaInventarioEl.innerHTML = `
            <li>🧪 Pociones: ${jugador.inventario.pocion || 0}</li>

            <li><b>🟢 Comunes</b></li>
            <li>⚔️ Espadas: ${jugador.inventario.espada || 0}</li>
            <li>🛡️ Armaduras: ${jugador.inventario.armadura || 0}</li>
            <li>⛑️ Cascos: ${jugador.inventario.casco || 0}</li>
            <li>👕 Camisas: ${jugador.inventario.camisa || 0}</li>
            <li>🧤 Guantes: ${jugador.inventario.guantes || 0}</li>
            <li>👢 Botas: ${jugador.inventario.botas || 0}</li>
            <li>👖 Pantalones: ${jugador.inventario.pantalon || 0}</li>

            <li><b>🔵 Raros</b></li>
            <li>💎 Cristales: ${jugador.inventario.cristal || 0}</li>
            <li>🔮 Orbes: ${jugador.inventario.orbe || 0}</li>
            <li>🏹 Arcos: ${jugador.inventario.arco || 0}</li>
            <li>🗡️ Dagas: ${jugador.inventario.daga || 0}</li>

            <li><b>🟣 Épicos</b></li>
            <li>🛡️ Armadura Épica: ${jugador.inventario.armaduraEpica || 0}</li>
            <li>👢 Botas Épicas: ${jugador.inventario.botasEpicas || 0}</li>
            <li>⛑️ Casco Épico: ${jugador.inventario.cascoEpico || 0}</li>

            <li><b>🟡 Legendarios</b></li>
            <li>⚔️ Espada Legendaria: ${jugador.inventario.espadaLegendaria || 0}</li>
            <li>🛡️ Armadura Legendaria: ${jugador.inventario.armaduraLegendaria || 0}</li>

            <li><b>✨ Magia:</b> ${jugador.magia} / ${maxMagia} 
                ${bonusOrbes > 0 ? `(+${bonusOrbes} bonus)` : ""}
            </li>
        `;
    }

    // 🔹 Mostrar u ocultar botones de items raros
    // ===== BOTONES DINÁMICOS =====
    const botones = [
        [curarBtn, jugador.inventario.pocion > 0],
        [usarCristalBtn, jugador.inventario.cristal > 0],
        [usarOrbeBtn, jugador.inventario.orbe > 0],

        [equiparArmaBtn, jugador.inventario.espada > 0],
        [equiparArmaduraBtn, jugador.inventario.armadura > 0],
        [equiparCascoBtn, jugador.inventario.casco > 0],
        [equiparcamisaBtn, jugador.inventario.camisa > 0],
        [equiparGuantesBtn, jugador.inventario.guantes > 0],
        [equiparPantalonBtn, jugador.inventario.pantalon > 0],
        [equiparBotasBtn, jugador.inventario.botas > 0],

        [equiparArcoBtn, jugador.inventario.arco > 0],
        [equiparDagaBtn, jugador.inventario.daga > 0],

        [equiparArmaduraEpicaBtn, jugador.inventario.armaduraEpica > 0],
        [equiparBotasEpicasBtn, jugador.inventario.botasEpicas > 0],
        [equiparCascoEpicoBtn, jugador.inventario.cascoEpico > 0],

        [equiparEspadaLegendariaBtn, jugador.inventario.espadaLegendaria > 0],
        [equiparArmaduraLegendariaBtn, jugador.inventario.armaduraLegendaria > 0],

        [abrirInventarioBtn, true]
    ];

    botones.forEach(([btn, cond]) => {
        if (btn) btn.style.display = cond ? "block" : "none";
    });
// ===============================
// APRENDER MAGIA (actualizado)
// ===============================
function aprenderMagia() {
    if (jugador.vida <= 0) return;

    // Magia base por nivel
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;

    // Bonus de magia por Orbes usados
   const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;

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

    if (!jugador.inventario.orbeUsados) jugador.inventario.orbeUsados = 0;

    jugador.inventario.orbe--;
    jugador.inventario.orbeUsados++;

    // Calcular nuevo límite
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    // Subir magia hasta el nuevo límite
    jugador.magia = Math.min(jugador.magia + 2, maxMagia);

    mensajeEl.textContent = `🔮 Orbe usado (+2 magia)`;

    animarBoton(usarOrbeBtn);
    actualizarUI();
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
   // ===== BARRAS =====
    actualizarBarraVida(porcentajeVida);
    actualizarBarraMagia(maxMagia);
}
// ===============================
// BARRA VIDA
// ===============================
function actualizarBarraVida(porcentajeVida) {
    const vidaBarra = document.getElementById("vidaBarra");
    if (vidaBarra) vidaBarra.style.width = `${porcentajeVida}%`;
}
// ===============================
// BARRA MAGIA (PRO)
// ===============================
function actualizarBarraMagia(maxMagia) {
    let barra = document.getElementById("barraMagia");

    if (!barra) {
        barra = document.createElement("div");
        barra.id = "barraMagia";
        barra.style.cssText = `
            width:200px;
            height:20px;
            background:#444;
            border:2px solid #000;
            border-radius:5px;
            position:relative;
            margin-top:10px;
        `;

        const base = document.createElement("div");
        base.id = "barraMagiaBase";
        base.style.cssText = `
            height:100%;
            width:0%;
            background:#00f;
            position:absolute;
        `;

        const bonus = document.createElement("div");
        bonus.id = "barraMagiaBonus";
        bonus.style.cssText = `
            height:100%;
            width:0%;
            background:#0ff;
            position:absolute;
        `;

        barra.appendChild(base);
        barra.appendChild(bonus);

        document.getElementById("gameArea")?.appendChild(barra);
    }

    const base = document.getElementById("barraMagiaBase");
    const bonus = document.getElementById("barraMagiaBonus");

    const maxBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;

    const magiaBase = Math.min(jugador.magia, maxBase);
    const magiaExtra = Math.max(0, jugador.magia - maxBase);

    if (base) base.style.width = maxMagia > 0 ? (magiaBase / maxMagia) * 100 + "%" : "0%";
    if (bonus) bonus.style.width = maxMagia > 0 ? (magiaExtra / maxMagia) * 100 + "%" : "0%";
}
// ===============================
// ANIMACIÓN BOTONES
// ===============================
function animarBoton(btn) {
    if (!btn) return;
    btn.classList.add("usar-item-anim");
    setTimeout(() => btn.classList.remove("usar-item-anim"), 300);
}
// ===============================
// CSS AUTOMÁTICO
// ===============================
(function () {
    const style = document.createElement("style");
    style.textContent = `
        .usar-item-anim {
            animation: pulse 0.3s ease;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); box-shadow: 0 0 20px currentColor; }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
})();
