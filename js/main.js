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
// BLOQUEO TOTAL AL MORIR
// ===============================
function bloquearBotones() {
    atacarBtn.disabled = true;
    curarBtn.disabled = true;
    equiparArmaBtn.disabled = true;
    equiparArmaduraBtn.disabled = true;
    aprenderMagiaBtn.disabled = true;
}

// ===============================
// FUNCIONES UTILITARIAS
// ===============================
function esCritico() {
    return Math.random() < 0.2;
}

function tipoIA() {
    const tipos = ["agresivo", "defensivo", "mago"];
    return tipos[Math.floor(Math.random() * tipos.length)];
}

function darLoot() {
    const r = Math.random();
    if (r < 0.5) {
        jugador.inventario.pocion += 2;
        return "🧪 Pociones x2";
    } else if (r < 0.8) {
        jugador.inventario.espada++;
        return "⚔️ Espada";
    } else {
        jugador.inventario.armadura++;
        return "🛡️ Armadura";
    }
}

function crearEnemigo(nivel, jefe = false) {
    const factor = 1 + (nivel * 0.15);

    let vida = 30 + (nivel * 6 * factor);
    let ataque = 5 + (nivel * 1.2 * factor);
    let defensa = 2 + (nivel * 0.7 * factor);

    let ia = tipoIA();

    if (jefe) {
        const bossFactor = 2 + (nivel * 0.05);
        vida *= bossFactor * 0.9;
        ataque *= (1.3 + nivel * 0.01);
        defensa *= (1.2 + nivel * 0.01);
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
// 🎯 GET RUTA DE IMAGEN DEL ENEMIGO
// ===============================
function getRutaEnemigo(enemigo) {
    if (enemigo.jefe) return "img/boss.jpeg";
    if (enemigo.ia === "mago") return "img/mago.jpeg";

    // Enemigos normales: asignar una imagen aleatoria solo una vez
    if (!enemigo.img) {
        enemigo.img = `img/enemigo${Math.floor(Math.random() * 3) + 1}.jpeg`;
    }
    return enemigo.img;
}

// ===============================
// 🎯 DIBUJAR ENEMIGOS
// ===============================
function dibujarEnemigos() {
    // Limpiar enemigos anteriores
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    enemigos.forEach((e, index) => {
        const div = document.createElement("div");
        div.classList.add("enemigo");
        div.dataset.index = index;
        div.dataset.jefe = e.jefe;
        div.title = e.ia;

        div.style.position = "absolute";
        div.style.left = `${200 + index * 80}px`;
        div.style.top = `${300 + Math.random() * 100}px`;

        // Imagen consistente según tipo
        const img = getRutaEnemigo(e);
        div.style.backgroundImage = `url('${img}')`;
        div.style.backgroundSize = "contain";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";
        div.classList.add("animado");

        // Filtro según IA
        switch (e.ia) {
            case "agresivo": div.style.filter = "hue-rotate(0deg)"; break;
            case "defensivo": div.style.filter = "hue-rotate(90deg)"; break;
            case "mago": div.style.filter = "hue-rotate(250deg)"; break;
        }

        // Tamaño y animación
        if (e.jefe) {
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.boxShadow = "0 0 30px red";
            div.style.animation = "caminar 0.8s steps(4) infinite";
        } else {
            div.style.width = "64px";
            div.style.height = "64px";
        }

        // Barra de vida
        const barra = document.createElement("div");
        barra.classList.add("barra-vida");
        barra.style.position = "absolute";
        barra.style.bottom = "-10px";
        barra.style.left = "0";
        barra.style.width = "100%";
        barra.style.height = "6px";
        barra.style.background = "rgba(0,0,0,0.5)";
        barra.style.borderRadius = "3px";

        const fill = document.createElement("div");
        fill.style.width = "100%";
        fill.style.height = "100%";
        fill.style.background = e.jefe ? "red" : "limegreen";
        fill.style.borderRadius = "3px";

        barra.appendChild(fill);
        div.appendChild(barra);

        gameArea.appendChild(div);
    });
}
// ===============================
// GENERAR NIVEL
// ===============================
function generarNivel() {
    enemigos = [];
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    const numEnemigos = (nivelActual % 5 === 0) ? 1 : Math.min(3 + nivelActual, 8);
    for (let i = 0; i < numEnemigos; i++) {
        enemigos.push(crearEnemigo(nivelActual, nivelActual % 5 === 0));
    }

    dibujarEnemigos();
}

// ===============================
// ATAQUE JUGADOR
// ===============================
function atacar() {
    if (jugador.vida <= 0 || enemigos.length === 0) return;

    // Animación ataque
    jugadorDiv.classList.add("atacando");
    setTimeout(() => jugadorDiv.classList.remove("atacando"), 200);

    const enemigo = enemigos[0];
    const enemigoDiv = gameArea.querySelector(`.enemigo[data-index="0"]`);

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
    enemigoDiv.querySelector(".barra-vida div").style.width = `${Math.max(0, (enemigo.vida / enemigo.vidaMax) * 100)}%`;
    mensajeEl.textContent += `\n⚔️ Daño: ${Math.floor(daño)}`;

    if (enemigo.vida <= 0) {
        enemigos.shift();
        enemigoDiv.remove();

        const loot = darLoot();
        sonidoLoot.play();
        jugador.puntaje += 10;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 15);

        mensajeEl.textContent += `\n🎁 ${loot}`;

        dibujarEnemigos();
    }

    ataqueEnemigos();
    revisarEstado();
    actualizarUI();
}

// ===============================
// ATAQUE ENEMIGOS
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
// REVISAR ESTADO JUEGO
// ===============================
function revisarEstado() {
    if (jugador.vida <= 0) {
        jugador.vida = 0;
        mensajeEl.textContent += "\n💀 Has sido derrotado";
        bloquearBotones();
    }

    if (enemigos.length === 0) {
        jugador.nivel++;
        nivelActual++;
        mensajeEl.textContent += `\n✨ Nivel ${jugador.nivel}`;
        generarNivel();
    }
}

// ===============================
// ACTUALIZAR UI
// ===============================
function actualizarUI() {
    vidaJugadorFill.style.width = `${Math.max(0, (jugador.vida / jugador.vidaMax) * 100)}%`;
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
// ACCIONES JUGADOR
// ===============================
function curar() {
    if (jugador.vida <= 0 || jugador.inventario.pocion <= 0) return;
    jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 25);
    jugador.inventario.pocion--;
    mensajeEl.textContent = "🧪 Usaste poción";
    actualizarUI();
}

function equiparArma() {
    if (jugador.vida <= 0 || jugador.inventario.espada <= 0) return;
    jugador.ataque += 5;
    jugador.inventario.espada--;
    actualizarUI();
}

function equiparArmadura() {
    if (jugador.vida <= 0 || jugador.inventario.armadura <= 0) return;
    jugador.defensa += 3;
    jugador.inventario.armadura--;
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

abrirInventarioBtn.addEventListener("click", () => ventanaInventario.style.display = "block");
cerrarInventario.addEventListener("click", () => ventanaInventario.style.display = "none");

document.addEventListener("keydown", e => {
    const left = jugadorDiv.offsetLeft;
    if (e.key === "ArrowRight") jugadorDiv.style.left = left + 20 + "px";
    if (e.key === "ArrowLeft") jugadorDiv.style.left = left - 20 + "px";
});

// ===============================
// IA ENEMIGOS (MOVIMIENTO)
 // ===============================
(function iniciarIA() {
    const velocidadBase = 0.1;
    const rangoAtaque = 60;

    function updateEnemigos() {
        const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
        const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;

        document.querySelectorAll(".enemigo").forEach((enemigoDiv, i) => {
            const enemigo = enemigos[i];
            if (!enemigo) return;

            const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
            const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;
            const dx = jx - ex;
            const dy = jy - ey;
            const distancia = Math.sqrt(dx*dx + dy*dy);

            let velocidad = velocidadBase;
            if (enemigo.ia === "agresivo") velocidad *= 0.7;
            if (enemigo.ia === "defensivo") velocidad *= 0.2;
            if (enemigo.ia === "mago") velocidad *= 0.4;

            if (distancia > rangoAtaque) {
                let moveX = (dx / distancia) * velocidad + Math.sin(Date.now()/300 + i) * 1.5;
                let moveY = (dy / distancia) * velocidad;
                enemigoDiv.style.left = enemigoDiv.offsetLeft + moveX + "px";
                enemigoDiv.style.top = enemigoDiv.offsetTop + moveY + "px";
            } else {
                enemigoDiv.style.transform = "scale(1.1)";
                setTimeout(() => enemigoDiv.style.transform = "scale(1)", 100);
            }
        });

        requestAnimationFrame(updateEnemigos);
    }

    window.addEventListener("load", () => updateEnemigos());
})();

// ===============================
// START
// ===============================
generarNivel();
actualizarUI();
