// ===============================
// MINI RPG PRO + ULTRA FINAL FIXED
// ===============================

// ===== JUGADOR =====
const jugador = {
    vida: 100,
    vidaMax: 100,
    ataque: 10,
    defensa: 5,
    magia: 0,
    nivel: 1,
    puntaje: 0,
    inventario: { pocion: 30, espada: 1, armadura: 1, magia: 0 }
};

// ===== ESTADO =====
let enemigos = [];
let nivelActual = 1;

// ===== SONIDOS =====
const sonidoGolpe = new Audio("sonidos/golpe.mp3");
const sonidoCritico = new Audio("sonidos/critico.mp3");
const sonidoLoot = new Audio("sonidos/loot.mp3");

// ===== DOM =====
const gameArea = document.getElementById("gameArea");
const vidaJugadorFill = document.getElementById("vidaJugadorFill");
const ataqueJugadorEl = document.getElementById("ataqueJugador");
const defensaJugadorEl = document.getElementById("defensaJugador");
const magiaJugadorEl = document.getElementById("magiaJugador");
const nivelJugadorEl = document.getElementById("nivelJugador");
const puntajeEl = document.getElementById("puntaje");
const listaInventarioEl = document.getElementById("listaInventario");
const mensajeEl = document.getElementById("mensaje");
const escenario = document.getElementById("escenario");

const abrirInventarioBtn = document.getElementById("abrirInventarioBtn");
const ventanaInventario = document.getElementById("ventanaInventario");
const cerrarInventario = document.getElementById("cerrarInventario");

// jugador visual
const jugadorDiv = document.createElement("div");
jugadorDiv.id = "jugador";
gameArea.appendChild(jugadorDiv);

// ===== BOTONES =====
const atacarBtn = document.getElementById("atacarBtn");
const curarBtn = document.getElementById("curarBtn");
const equiparArmaBtn = document.getElementById("equiparArmaBtn");
const equiparArmaduraBtn = document.getElementById("equiparArmaduraBtn");
const aprenderMagiaBtn = document.getElementById("aprenderMagiaBtn");

// ===============================
// 🔥 BLOQUEO TOTAL AL MORIR
// ===============================
function bloquearBotones() {
    atacarBtn.disabled = true;
    curarBtn.disabled = true;
    equiparArmaBtn.disabled = true;
    equiparArmaduraBtn.disabled = true;
    aprenderMagiaBtn.disabled = true;
}

// ===============================
// IA ENEMIGA
// ===============================
function tipoIA() {
    const tipos = ["agresivo", "defensivo", "mago"];
    return tipos[Math.floor(Math.random() * tipos.length)];
}

// ===============================
// CREAR ENEMIGO (ESCALADO PRO)
// ===============================
function crearEnemigo(nivel, jefe = false) {

    let factor = 1 + (nivel * 0.15);

    let vida = 30 + (nivel * 6 * factor);
    let ataque = 5 + (nivel * 1.2 * factor);
    let defensa = 2 + (nivel * 0.7 * factor);

    let ia = tipoIA();

    if (jefe) {

        let bossFactor = 2 + (nivel * 0.05);

        vida *= bossFactor;
        ataque *= (1.3 + nivel * 0.01);
        defensa *= (1.2 + nivel * 0.01);

        vida *= 0.9;
    }

    return {
        vida: Math.floor(vida),
        vidaMax: Math.floor(vida),
        ataque: Math.floor(ataque),
        defensa: Math.floor(defensa),
        jefe,
        ia
    };
}

// ===============================
// GENERAR NIVEL
// ===============================
function generarNivel() {
    enemigos = [];

    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    let numEnemigos = (nivelActual % 5 === 0) ? 1 : Math.min(3 + nivelActual, 8);

    for (let i = 0; i < numEnemigos; i++) {
        enemigos.push(crearEnemigo(nivelActual, nivelActual % 5 === 0));
    }

    dibujarEnemigos();
}

// ===============================
// DIBUJAR ENEMIGOS
// ===============================
function dibujarEnemigos() {
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    enemigos.forEach((e, index) => {
        const div = document.createElement("div");
        div.classList.add("enemigo");

        div.dataset.index = index;
        div.dataset.jefe = e.jefe;
        div.title = e.ia;

        div.style.left = `${200 + index * 80}px`;
        div.style.bottom = "0px";

        const barra = document.createElement("div");
        barra.classList.add("barra-vida");

        const fill = document.createElement("div");
        fill.style.width = "100%";

        barra.appendChild(fill);
        div.appendChild(barra);

        gameArea.appendChild(div);
    });
}

// ===============================
// CRÍTICOS
// ===============================
function esCritico() {
    return Math.random() < 0.2;
}

// ===============================
// LOOT
// ===============================
function darLoot() {
    let r = Math.random();

    if (r < 0.5) {
        jugador.inventario.pocion += 2;
        return "🧪 Pociones x2";
    }
    if (r < 0.8) {
        jugador.inventario.espada++;
        return "⚔️ Espada";
    }
    jugador.inventario.armadura++;
    return "🛡️ Armadura";
}

// ===============================
// ATAQUE (FIX MUERTE + ANIMACIÓN)
// ===============================
function atacar() {

    if (jugador.vida <= 0) return; // 🔥 BLOQUEO
    if (enemigos.length === 0) return;

    // 🔥 ANIMACIÓN ATAQUE (bien ubicada)
    jugadorDiv.classList.add("atacando");
    setTimeout(() => {
        jugadorDiv.classList.remove("atacando");
    }, 200);

    let enemigo = enemigos[0];
    let enemigoDiv = gameArea.querySelector(`.enemigo[data-index="0"]`);

    let daño = jugador.ataque + jugador.magia - enemigo.defensa;

    if (esCritico()) {
        daño *= 2;
        mensajeEl.textContent = "💥 CRÍTICO!";
        sonidoCritico.play();
    } else {
        sonidoGolpe.play();
    }

    if (daño < 2) daño = 2;

    enemigo.vida -= daño;

    enemigoDiv.querySelector(".barra-vida div").style.width =
        Math.max(0, (enemigo.vida / enemigo.vidaMax) * 100) + "%";

    mensajeEl.textContent += `\n⚔️ Daño: ${Math.floor(daño)}`;

    // ===============================
    // 🔥 MUERTE ENEMIGO
    // ===============================
    if (enemigo.vida <= 0) {

        enemigos.shift();
        enemigoDiv.remove();

        let loot = darLoot();
        sonidoLoot.play();

        jugador.puntaje += 10;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 15);

        mensajeEl.textContent += `\n🎁 ${loot}`;

        dibujarEnemigos();
    }

    // ===============================
    // 🔥 ATAQUE ENEMIGOS
    // ===============================
    ataqueEnemigos();

    // ===============================
    // 🔥 MUERTE JUGADOR
    // ===============================
    if (jugador.vida <= 0) {
        jugador.vida = 0;
        mensajeEl.textContent += "\n💀 Has sido derrotado";

        bloquearBotones();
        actualizarUI();
        return;
    }

    // ===============================
    // 🔥 SIGUIENTE NIVEL
    // ===============================
    if (enemigos.length === 0) {
        jugador.nivel++;
        nivelActual++;
        mensajeEl.textContent += `\n✨ Nivel ${jugador.nivel}`;
        generarNivel();
    }

    actualizarUI();
}

// ===============================
// IA ENEMIGA
// ===============================
function ataqueEnemigos() {
    enemigos.forEach(e => {
        let daño = e.ataque;

        if (e.ia === "agresivo") daño *= 1.2;
        if (e.ia === "defensivo") daño *= 0.7;
        if (e.ia === "mago") daño += 3;

        daño -= jugador.defensa;

        if (daño < 1) daño = 1;

        jugador.vida -= daño;
    });
}

// ===============================
// UI
// ===============================
function actualizarUI() {
    vidaJugadorFill.style.width =
        Math.max(0, (jugador.vida / jugador.vidaMax) * 100) + "%";

    ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    magiaJugadorEl.textContent = jugador.magia;
    nivelJugadorEl.textContent = jugador.nivel;
    puntajeEl.textContent = jugador.puntaje;

    listaInventarioEl.innerHTML = `
        <li>🧪 Pociones: ${jugador.inventario.pocion}</li>
        <li>⚔️ Espadas: ${jugador.inventario.espada}</li>
        <li>🛡️ Armaduras: ${jugador.inventario.armadura}</li>
        <li>✨ Magia: ${jugador.inventario.magia}</li>
    `;
}

// ===============================
// INVENTARIO VENTANA
// ===============================
abrirInventarioBtn.addEventListener("click", () => {
    ventanaInventario.style.display = "block";
});

cerrarInventario.addEventListener("click", () => {
    ventanaInventario.style.display = "none";
});

// ===============================
// MOVIMIENTO
// ===============================
document.addEventListener("keydown", (e) => {
    let left = jugadorDiv.offsetLeft;

    if (e.key === "ArrowRight") jugadorDiv.style.left = left + 20 + "px";
    if (e.key === "ArrowLeft") jugadorDiv.style.left = left - 20 + "px";
});

// ===============================
// ACCIONES
// ===============================
function curar() {
    if (jugador.vida <= 0) return;

    if (jugador.inventario.pocion > 0) {
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 25);
        jugador.inventario.pocion--;
        mensajeEl.textContent = "🧪 Usaste poción";
    }
    actualizarUI();
}

function equiparArma() {
    if (jugador.vida <= 0) return;

    if (jugador.inventario.espada > 0) {
        jugador.ataque += 5;
        jugador.inventario.espada--;
    }
    actualizarUI();
}

function equiparArmadura() {
    if (jugador.vida <= 0) return;

    if (jugador.inventario.armadura > 0) {
        jugador.defensa += 3;
        jugador.inventario.armadura--;
    }
    actualizarUI();
}

function aprenderMagia() {
    if (jugador.vida <= 0) return;

    jugador.magia += 10;
    jugador.inventario.magia++;
    actualizarUI();
}

// ===============================
// EVENTOS
// ===============================
atacarBtn.addEventListener("click", atacar);
curarBtn.addEventListener("click", curar);
equiparArmaBtn.addEventListener("click", equiparArma);
equiparArmaduraBtn.addEventListener("click", equiparArmadura);
aprenderMagiaBtn.addEventListener("click", aprenderMagia);

// ===============================
// START
// ===============================
generarNivel();
actualizarUI();
