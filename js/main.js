// ===============================
// MINI RPG PRO - CORE SYSTEM v2.1
// Sistema fusionado: Código base + Enemigos Mejorados
// ===============================

// ===== CONFIGURACIÓN DE ENEMIGOS (NUEVO) =====
const TIPOS_ENEMIGO = {
    MAGO: { clase: 'mago', color: '#9b59b6', statMod: { ataque: 1.3, defensa: 0.7, velocidad: 0.8 } },
    GUERRERO: { clase: 'guerrero', color: '#e74c3c', statMod: { ataque: 1.2, defensa: 1.3, velocidad: 0.9 } },
    ARQUERO: { clase: 'arquero', color: '#27ae60', statMod: { ataque: 1.4, defensa: 0.6, velocidad: 1.3 } },
    ESQUELETO: { clase: 'esqueleto', color: '#95a5a6', statMod: { ataque: 1.0, defensa: 0.8, velocidad: 1.0 } }
};

// Rutas de imágenes organizadas (10 tipos por clase)
const RUTAS_IMAGENES = {
    enemigos: {
        mago: Array.from({ length: 10 }, (_, i) => `img/mago${i + 1}.jpeg`),
        guerrero: Array.from({ length: 10 }, (_, i) => `img/guerrero${i + 1}.jpeg`),
        arquero: Array.from({ length: 10 }, (_, i) => `img/arquero${i + 1}.jpeg`),
        esqueleto: Array.from({ length: 10 }, (_, i) => `img/esqueleto${i + 1}.jpeg`)
    },
    jefes: {
        mago: Array.from({ length: 10 }, (_, i) => `img/boss_mago${i + 1}.jpeg`),
        guerrero: Array.from({ length: 10 }, (_, i) => `img/boss_guerrero${i + 1}.jpeg`),
        arquero: Array.from({ length: 10 }, (_, i) => `img/boss_arquero${i + 1}.jpeg`),
        esqueleto: Array.from({ length: 10 }, (_, i) => `img/boss_esqueleto${i + 1}.jpeg`)
    },
    fallback: {
        mago: 'img/mago.jpeg',
        guerrero: 'img/enemigo1.jpeg',
        arquero: 'img/enemigo2.jpeg',
        esqueleto: 'img/enemigo3.jpeg',
        boss: 'img/boss.jpeg'
    }
};
// ===== JUGADOR =====
const jugador = {
    vida: 100,
    vidaMax: 100,
    ataque: 10,
    defensa: 5,
    magia: 0,
    nivel: 1,
    puntaje: 0,
    inventario: {
        pocion: 30,
         // ===== COMUNES =====
        espada: 1,
        armadura: 1,
        casco: 0,
        camisa: 0,      // 👈 NUEVO
        botas: 0,
        pantalon: 0,
         // ===== RAROS =====
        cristal: 0,
        orbe: 0,
        orbeUsados: 0,
        arco: 0,
        daga: 0,
        guantes: 0,
        // ===== ÉPICOS =====
        armaduraEpica: 0,
        botasEpicas: 0,
        cascoEpico: 0,
        // ===== LEGENDARIOS =====
        espadaLegendaria: 0,
        armaduraLegendaria: 0,
    }
};
// ===== ESTADO =====
let enemigos = [];
let nivelActual = 1;
let juegoActivo = true;
let enemigosDerrotadosNivel = 0;
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
jugadorDiv.style.position = "absolute";
jugadorDiv.style.left = "100px";
jugadorDiv.style.top = "300px";
gameArea.appendChild(jugadorDiv);

// ===== BOTONES =====
const atacarBtn = document.getElementById("atacarBtn");
const curarBtn = document.getElementById("curarBtn");
const equiparArmaBtn = document.getElementById("equiparArmaBtn");
const equiparArmaduraBtn = document.getElementById("equiparArmaduraBtn");
const equiparEspadaLegendariaBtn = document.getElementById("equiparEspadaLegendariaBtn");
const equiparArmaduraEpicaBtn = document.getElementById("equiparArmaduraEpicaBtn");
const usarCristalBtn = document.getElementById("usarCristalBtn");
const usarOrbeBtn = document.getElementById("usarOrbeBtn");
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
// IMAGEN ENEMIGO (FIX PRO)
// ===============================
function getRutaEnemigo(enemigo) {
    if (enemigo.jefe) return "img/boss.jpeg";
    if (nivelActual >= 2) return "img/mago.jpeg";
    return "img/enemigo1.jpeg";
}

// ===============================
// 🎯 DIBUJAR ENEMIGOS
// ===============================
function dibujarEnemigos() {
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

        const img = getRutaEnemigo(e);
        div.style.backgroundImage = `url('${img}')`;
        div.style.backgroundSize = "contain";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";
        div.classList.add("animado");

        switch (e.ia) {
            case "agresivo": div.style.filter = "hue-rotate(0deg)"; break;
            case "defensivo": div.style.filter = "hue-rotate(90deg)"; break;
            case "mago": div.style.filter = "hue-rotate(250deg)"; break;
        }

        if (e.jefe) {
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.boxShadow = "0 0 30px red";
            div.style.animation = "caminar 0.8s steps(4) infinite";
        } else {
            div.style.width = "64px";
            div.style.height = "64px";
        }

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
// GENERAR NIVEL PROFESIONAL
// ===============================
function generarNivel() {
    enemigos = [];
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    // Calcular dificultad base según el nivel
    // Nivel 1-2: fácil, nivel 3: un poco más difícil, progresivo
    const dificultadBase = 1 + Math.floor(nivelActual / 2); // aumenta cada 2 niveles
    const multiplicadorDificultad = 1 + (nivelActual * 0.1); // 10% más fuerte por nivel

    // Número de enemigos: de 1 a 8, aumenta con el nivel pero no demasiado
    let numEnemigos;
    if (nivelActual % 5 === 0) { 
        // jefe cada 5 niveles
        numEnemigos = 1;
    } else {
        numEnemigos = Math.min(3 + dificultadBase, 8); 
    }

    for (let i = 0; i < numEnemigos; i++) {
        // Crear enemigos con stats ajustadas por dificultad
        const esJefe = (nivelActual % 5 === 0);
        const enemigo = crearEnemigo(nivelActual, esJefe);

        // Ajustar stats por nivel: vida, ataque, defensa
        enemigo.vidaMax = Math.floor(enemigo.vidaMax * multiplicadorDificultad);
        enemigo.vida = enemigo.vidaMax;
        enemigo.ataque = Math.floor(enemigo.ataque * multiplicadorDificultad);
        enemigo.defensa = Math.floor(enemigo.defensa * multiplicadorDificultad);

        enemigos.push(enemigo);
    }

    dibujarEnemigos();
}
// ===============================
// CLASES
// ===============================
class Personaje {
    constructor(vida, ataque, defensa, magia, nivel, puntaje, inventario) {
        this.vida = vida;
        this.vidaMax = vida;
        this.ataque = ataque;
        this.defensa = defensa;
        this.magia = magia;
        this.nivel = nivel;
        this.puntaje = puntaje;
        this.inventario = inventario;
    }
}

class Enemigo {
    constructor(vida, ataque, defensa, ia) {
        this.vida = vida;
        this.vidaMax = vida;
        this.ataque = ataque;
        this.defensa = defensa;
        this.ia = ia; // "agresivo", "defensivo", "mago"
    }
}

// ===============================
// ATAQUE DEL JUGADOR
// ===============================
function atacar() {
    if (jugador.vida <= 0 || enemigos.length === 0) return;

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
    enemigo.vida = Math.max(0, enemigo.vida);

    enemigoDiv.querySelector(".barra-vida div").style.width = `${(enemigo.vida / enemigo.vidaMax) * 100}%`;
    mensajeEl.textContent += `\n⚔️ Daño: ${Math.floor(daño)}`;

    // Si el enemigo muere
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

    // Enemigos reaccionan si estás cerca
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
// IA ENEMIGOS (ATAQUE POR PROXIMIDAD)
// ===============================
(function iniciarAtaqueEnemigos() {
    const rangoAtaque = 60;

    function atacarEnemigos() {
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

            // Ataque solo si está dentro del rango
            if (distancia <= rangoAtaque) {
                let daño = enemigo.ataque;
                if (enemigo.ia === "agresivo") daño *= 1.2;
                if (enemigo.ia === "defensivo") daño *= 0.7;
                if (enemigo.ia === "mago") daño += 3;

                daño -= jugador.defensa;
                if (daño < 1) daño = 1;

                jugador.vida -= daño;
                jugador.vida = Math.max(0, jugador.vida);

                // Animación de ataque
                enemigoDiv.style.transform = "scale(1.1)";
                setTimeout(() => enemigoDiv.style.transform = "scale(1)", 100);

                actualizarUI();
            }
        });

        requestAnimationFrame(atacarEnemigos);
    }

    window.addEventListener("load", () => atacarEnemigos());
})();
// ===============================
// IA ENEMIGOS (MOVIMIENTO)
// ===============================
(function iniciarMovimientoEnemigos() {
    const velocidadBase = 0.3;
    const rangoAtaque = 60;

    function moverEnemigos() {
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

            // Ajustar velocidad según tipo
            let velocidad = velocidadBase;
            if (enemigo.ia === "agresivo") velocidad *= 1.2;
            if (enemigo.ia === "defensivo") velocidad *= 0.7;
            if (enemigo.ia === "mago") velocidad *= 0.5;

            // Movimiento solo si está lejos
            if (distancia > rangoAtaque) {
                const moveX = (dx / distancia) * velocidad + Math.sin(Date.now()/300 + i) * 0.5;
                const moveY = (dy / distancia) * velocidad;
                enemigoDiv.style.left = enemigoDiv.offsetLeft + moveX + "px";
                enemigoDiv.style.top = enemigoDiv.offsetTop + moveY + "px";
            }
        });

        requestAnimationFrame(moverEnemigos);
    }

    window.addEventListener("load", () => moverEnemigos());
})();
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
// EVENTOS (ACTUALIZADO PRO)
// ===============================

// 🔹 Acciones básicas
if (atacarBtn) atacarBtn.addEventListener("click", atacar);
if (curarBtn) curarBtn.addEventListener("click", curar);
if (equiparArmaBtn) equiparArmaBtn.addEventListener("click", equiparArma);
if (equiparArmaduraBtn) equiparArmaduraBtn.addEventListener("click", equiparArmadura);
if (aprenderMagiaBtn) aprenderMagiaBtn.addEventListener("click", aprenderMagia);

// 🔹 Items raros (NUEVO)
if (usarCristalBtn) usarCristalBtn.addEventListener("click", usarCristal);
if (usarOrbeBtn) usarOrbeBtn.addEventListener("click", usarOrbe);
if (equiparEspadaLegendariaBtn) equiparEspadaLegendariaBtn.addEventListener("click", equiparEspadaLegendaria);
if (equiparArmaduraEpicaBtn) equiparArmaduraEpicaBtn.addEventListener("click", equiparArmaduraEpica);

// 🔹 Inventario
if (abrirInventarioBtn) {
    abrirInventarioBtn.addEventListener("click", () => {
        ventanaInventario.style.display = "block";
    });
}

if (cerrarInventario) {
    cerrarInventario.addEventListener("click", () => {
        ventanaInventario.style.display = "none";
    });
}

// 🔹 Movimiento teclado (con límites)
document.addEventListener("keydown", e => {
    const step = 20;
    const left = jugadorDiv.offsetLeft;
    const top = jugadorDiv.offsetTop;

    const maxX = gameArea.offsetWidth - jugadorDiv.offsetWidth;

    if (e.key === "ArrowRight") {
        jugadorDiv.style.left = Math.min(left + step, maxX) + "px";
    }

    if (e.key === "ArrowLeft") {
        jugadorDiv.style.left = Math.max(left - step, 0) + "px";
    }

    // (opcional) vertical si luego quieres
    if (e.key === "ArrowUp") {
        jugadorDiv.style.top = Math.max(top - step, 0) + "px";
    }

    if (e.key === "ArrowDown") {
        const maxY = gameArea.offsetHeight - jugadorDiv.offsetHeight;
        jugadorDiv.style.top = Math.min(top + step, maxY) + "px";
    }
});
// ===============================
// FUNCIONALIDAD DE ARRASTRE
// ===============================
(function enableDrag() {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function startDrag(e) {
        dragging = true;
        const rect = jugadorDiv.getBoundingClientRect();
        if (e.type.startsWith("touch")) {
            offsetX = e.touches[0].clientX - rect.left;
            offsetY = e.touches[0].clientY - rect.top;
        } else {
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }
        e.preventDefault();
    }

    function onDrag(e) {
        if (!dragging) return;
        let x, y;
        if (e.type.startsWith("touch")) {
            x = e.touches[0].clientX - offsetX;
            y = e.touches[0].clientY - offsetY;
        } else {
            x = e.clientX - offsetX;
            y = e.clientY - offsetY;
        }
        const maxX = gameArea.offsetWidth - jugadorDiv.offsetWidth;
        const maxY = gameArea.offsetHeight - jugadorDiv.offsetHeight;
        jugadorDiv.style.left = Math.min(Math.max(0, x), maxX) + "px";
        jugadorDiv.style.top = Math.min(Math.max(0, y), maxY) + "px";
    }

    function stopDrag() {
        dragging = false;
    }

    jugadorDiv.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);

    jugadorDiv.addEventListener("touchstart", startDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", stopDrag);
})();
// ===============================
// START
// ===============================
generarNivel();
actualizarUI();
