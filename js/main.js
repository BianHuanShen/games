// ===============================
// MINI RPG - CORE SYSTEM v2.1
// Sistema fusionado: Código base + Enemigos
// ===============================
// ===== CONFIGURACIÓN DE ENEMIGOS =====
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
        camisa: 0,
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
// Consumibles
const usarCristalBtn = document.getElementById("usarCristalBtn");
const usarOrbeBtn = document.getElementById("usarOrbeBtn");
const aprenderMagiaBtn = document.getElementById("aprenderMagiaBtn");
// Comunes
const equiparArmaBtn = document.getElementById("equiparArmaBtn");
const equiparArmaduraBtn = document.getElementById("equiparArmaduraBtn");
const equiparCascoBtn = document.getElementById("equiparCascoBtn");
const equiparCamisaBtn = document.getElementById("equiparCamisaBtn"); 
const equiparGuantesBtn = document.getElementById("equiparGuantesBtn");
const equiparPantalonBtn = document.getElementById("equiparPantalonBtn");
const equiparBotasBtn = document.getElementById("equiparBotasBtn");
// Raros
const equiparArcoBtn = document.getElementById("equiparArcoBtn");
const equiparDagaBtn = document.getElementById("equiparDagaBtn");
// Épicos
const equiparArmaduraEpicaBtn = document.getElementById("equiparArmaduraEpicaBtn");
const equiparBotasEpicasBtn = document.getElementById("equiparBotasEpicasBtn");
const equiparCascoEpicoBtn = document.getElementById("equiparCascoEpicoBtn");
// Legendarios
const equiparEspadaLegendariaBtn = document.getElementById("equiparEspadaLegendariaBtn");
const equiparArmaduraLegendariaBtn = document.getElementById("equiparArmaduraLegendariaBtn");
// Extra
const abrirInventarioBtn = document.getElementById("abrirInventarioBtn");
// ===============================
// EVENTOS
// ===============================
// 🔹 ACCIONES BÁSICAS
document.addEventListener("DOMContentLoaded", () => {
    // Botones de acción
    if (atacarBtn) atacarBtn.addEventListener("click", atacar);
    if (curarBtn) curarBtn.addEventListener("click", () => {
        if (typeof curar === 'function') curar();
    });
    if (aprenderMagiaBtn) aprenderMagiaBtn.addEventListener("click", () => {
        if (typeof aprenderMagia === 'function') aprenderMagia();
    });

    if (equiparEspadaLegendariaBtn) equiparEspadaLegendariaBtn.addEventListener("click", () => {
        if (typeof equiparEspadaLegendaria === 'function') equiparEspadaLegendaria();
    });
    if (equiparArmaduraEpicaBtn) equiparArmaduraEpicaBtn.addEventListener("click", () => {
        if (typeof equiparArmaduraEpica === 'function') equiparArmaduraEpica();
    });

    // Inventario
    if (abrirInventarioBtn) {
        abrirInventarioBtn.addEventListener("click", () => {
            if (ventanaInventario) ventanaInventario.style.display = "block";
        });
    }
    if (cerrarInventario) {
        cerrarInventario.addEventListener("click", () => {
            if (ventanaInventario) ventanaInventario.style.display = "none";
        });
    }
// ===============================
// 🧪 CONSUMIBLES
// ===============================
if (usarCristalBtn) usarCristalBtn.addEventListener("click", () => {
        if (typeof usarCristal === 'function') usarCristal();
    });
    if (usarOrbeBtn) usarOrbeBtn.addEventListener("click", () => {
        if (typeof usarOrbe === 'function') usarOrbe();
    });
// ===============================
// ⚔️ EQUIPO COMÚN
// ===============================
 if (equiparArmaBtn) equiparArmaBtn.addEventListener("click", () => {
        if (typeof equiparArma === 'function') equiparArma();
    });
    if (equiparArmaduraBtn) equiparArmaduraBtn.addEventListener("click", () => {
        if (typeof equiparArmadura === 'function') equiparArmadura();
    });
    
if (equiparCascoBtn) equiparCascoBtn.addEventListener("click", () => { );
        if (typeof equiparCasco === 'function') equiparCasco();
    });
if (equiparCamisaBtn) equiparCamisaBtn.addEventListener("click", () => { );
        if (typeof equiparCamisa === 'function') equiparCamisa();
    });
if (equiparGuantesBtn) equiparGuantesBtn.addEventListener("click", () => { );
        if (typeof equiparGuantes === 'function') equiparGuantes();
    });
if (equiparPantalonBtn) equiparPantalonBtn.addEventListener("click", () => { );
        if (typeof equiparPantalon === 'function') equiparPantalon();
    });
if (equiparBotasBtn) equiparBotasBtn.addEventListener("click", () => { );
        if (typeof equiparBotas === 'function') equiparBotas();
    });
// ===============================
// 🏹 EQUIPO RARO
// ===============================
if (equiparDagaBtn) equiparDagaBtn.addEventListener("click", () => { );
        if (typeof equiparDaga === 'function') equiparDaga();
    });
if (equiparArcoBtn) equiparArcoBtn.addEventListener("click", () => { );
        if (typeof equiparArco === 'function') equiparArco();
    });
// ===============================
// 🟣 EQUIPO ÉPICO
// ===============================
if (equiparCascoEpicoBtn) equiparCascoEpicoBtn.addEventListener("click", () => { );
        if (typeof equiparCascoEpico === 'function') equiparCascoEpico();
    });
if (equiparArmaduraEpica) equiparArmaduraEpica.addEventListener("click", () => { );
        if (typeof equiparArmaduraEpica === 'function') equiparArmaduraEpica();
    });
if (equiparpantalonEpicoBtn) equiparpantalonEpicoBtn.addEventListener("click", () => { );
        if (typeof equiparpantalonEpico === 'function') equiparpantalonEpico();
    });
if (equiparBotasEpicasBtn) equiparBotasEpicasBtn.addEventListener("click", () => { );
        if (typeof equiparBotasEpicas === 'function') equiparBotasEpicas();
    });
// ===============================
// 🟡 EQUIPO LEGENDARIO
// ===============================
if (equiparEspadaLegendariaBtn) equiparEspadaLegendariaBtn.addEventListener("click", () => { );
        if (typeof equiparEspadaLegendaria === 'function') equiparEspadaLegendaria();
    });
if (equiparArmaduraLegendariaBtn) equiparArmaduraLegendariaBtn.addEventListener("click", () => { );
        if (typeof equiparArmaduraLegendaria === 'function') equiparArmaduraLegendaria();
    });
// ===============================
// 🎒 INVENTARIO UI
// ===============================
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
// 🔥 CRÍTICO ESCALABLE
function esCritico() {
    const base = 0.2;
    const bonus = jugador ? jugador.nivel * 0.005 : 0;
    return Math.random() < (base + bonus);
}
// 🎭 CLASE ALEATORIA (USA TIPOS_ENEMIGO)
function getClaseAleatoria() {
    const claves = Object.keys(TIPOS_ENEMIGO);
    return TIPOS_ENEMIGO[claves[Math.floor(Math.random() * claves.length)]];
}
// NUEVO: Calcular variante según nivel (1-10)
function getVarianteEnemigo(nivel) {
    return Math.min(Math.ceil(nivel / 2), 10);
}
// 🧠 IA DINÁMICA
function tipoIA() {
    const tipos = ["agresivo", "defensivo", "mago", "equilibrado"];
    return tipos[Math.floor(Math.random() * tipos.length)];
}
// 📈 VARIANTE SEGÚN NIVEL (1-10)
function getVarianteEnemigo(nivel) {
    return Math.min(Math.ceil(nivel / 2), 10);
}
// NUEVO: Sistema de rutas mejorado
function getRutaEnemigo(enemigo) {
    const clase = enemigo.claseInfo.clase;
    const variante = getVarianteEnemigo(nivelActual);
    if (enemigo.jefe) {
        // Intentar jefe específico primero
        const rutaJefe = RUTAS_IMAGENES.jefes[clase]?.[variante - 1];
        if (rutaJefe) return rutaJefe;
        // Fallback a boss genérico
        return RUTAS_IMAGENES.fallback.boss;
    } else {
        // Enemigo normal
        const rutaNormal = RUTAS_IMAGENES.enemigos[clase]?.[variante - 1];
        if (rutaNormal) return rutaNormal;
        // Fallback por clase
        return RUTAS_IMAGENES.fallback[clase] || RUTAS_IMAGENES.fallback.guerrero;
    }
}
function getIconoClase(clase) {
    const iconos = { mago: '🔮', guerrero: '⚔️', arquero: '🏹', esqueleto: '💀' };
    return iconos[clase] || '👹';
}
// ===============================
// 👾 CREACIÓN DE ENEMIGOS PRO MAX
// ===============================
function crearEnemigo(nivel, jefe = false) {
    const claseInfo = getClaseAleatoria();
    const ia = tipoIA();
    const factor = 1 + (nivel * 0.15);
    let vida = 30 + (nivel * 6 * factor);
    let ataque = 5 + (nivel * 1.2 * factor);
    let defensa = 2 + (nivel * 0.7 * factor);
    let magia = Math.floor(nivel / 3);
    // ===== MODIFICADOR POR CLASE =====
    vida *= claseInfo.statMod.defensa;
    ataque *= claseInfo.statMod.ataque;
    defensa *= claseInfo.statMod.defensa;
    // ===== IA =====
    switch (ia) {
        case "agresivo":
            ataque *= 1.3;
            defensa *= 0.9;
            break;
        case "defensivo":
            defensa *= 1.4;
            ataque *= 0.8;
            break;
        case "mago":
            magia *= 2;
            ataque *= 0.9;
            break;
    }
    // ===== JEFE =====
    if (jefe) {
        const bossFactor = 2 + (nivel * 0.05);
        vida *= bossFactor;
        ataque *= (1.3 + nivel * 0.02);
        defensa *= (1.2 + nivel * 0.02);
        magia *= 1.5;
    }
    return {
        vida: Math.floor(vida),
        vidaMax: Math.floor(vida),
        ataque: Math.floor(ataque),
        defensa: Math.floor(defensa),
        magia: Math.floor(magia),
        jefe,
        ia,
        claseInfo // 🔥 CLAVE para imágenes y estilo
        tipo: claseInfo.clase,
        velocidad: claseInfo.statMod.velocidad || 0.5
    };
}
// ===============================
// 🖼️ RUTA ENEMIGO (SISTEMA PRO)
// ===============================
function getRutaEnemigo(enemigo) {
    const clase = enemigo.claseInfo.clase;
    const variante = getVarianteEnemigo(nivelActual);
    if (enemigo.jefe) {
        const rutaJefe = RUTAS_IMAGENES.jefes[clase]?.[variante - 1];
        if (rutaJefe) return rutaJefe;
        return RUTAS_IMAGENES.fallback.boss;
    } else {
        const rutaNormal = RUTAS_IMAGENES.enemigos[clase]?.[variante - 1];
        if (rutaNormal) return rutaNormal;
        return RUTAS_IMAGENES.fallback[clase] || RUTAS_IMAGENES.fallback.guerrero;
    }
}
// ===============================
// 🎯 DIBUJAR ENEMIGOS PRO MAX
// ===============================
function dibujarEnemigos() {
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());
    enemigos.forEach((e, index) => {
        const div = document.createElement("div");
        div.classList.add("enemigo");
        // ===== DATA =====
        div.dataset.index = index;
        div.dataset.jefe = e.jefe;
        div.dataset.clase = e.claseInfo.clase;
        div.title = `${e.claseInfo.clase} - ${e.ia}`;
        // ===== POSICIÓN =====
        div.style.position = "absolute";
        div.style.left = `${200 + index * 90}px`;
        div.style.top = `${250 + Math.random() * 120}px`;
        // ===== IMAGEN =====
        const img = getRutaEnemigo(e);
        div.style.backgroundImage = `url('${img}')`;
        div.style.backgroundSize = "contain";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";
        // ===== COLOR POR CLASE =====
        div.style.filter = `drop-shadow(0 0 10px ${e.claseInfo.color})`;
        // ===== EFECTO IA =====
        switch (e.ia) {
            case "agresivo":
                div.style.transform = "scale(1.1)";
                break;
            case "defensivo":
                div.style.filter += " brightness(0.8)";
                break;
            case "mago":
                div.style.filter += " hue-rotate(250deg)";
                break;
        }
        // ===== JEFE =====
        if (e.jefe) {
            div.style.width = "110px";
            div.style.height = "110px";
            div.style.boxShadow = "0 0 30px red";
            div.style.animation = "caminar 0.8s steps(4) infinite";
        } else {
            div.style.width = "70px";
            div.style.height = "70px";
        }
        // ===============================
        // ❤️ BARRA DE VIDA PRO
        // ===============================
        const barra = document.createElement("div");
        barra.style.cssText = `
            position:absolute;
            bottom:-10px;
            left:0;
            width:100%;
            height:6px;
            background:rgba(0,0,0,0.5);
            border-radius:3px;
        `;
        const fill = document.createElement("div");
        const porcentaje = (e.vida / e.vidaMax) * 100;
        fill.style.width = `${porcentaje}%`;
        fill.style.height = "100%";
        fill.style.borderRadius = "3px";
        fill.style.background =
            porcentaje > 60 ? "#2ecc71" :
            porcentaje > 30 ? "#f1c40f" :
            "#e74c3c";
        barra.appendChild(fill);
        div.appendChild(barra);
        // ===============================
        // ⚡ LABEL CLASE
        // ===============================
        const label = document.createElement("div");
        label.textContent = e.claseInfo.clase.toUpperCase();
        label.style.cssText = `
            position:absolute;
            top:-15px;
            left:0;
            font-size:10px;
            color:white;
            text-shadow:0 0 5px black;
        `;
        div.appendChild(label);
        // ===============================
        // 🎯 CLICK ATAQUE
        // ===============================
        div.addEventListener("click", () => atacarEnemigo?.(index));

        gameArea.appendChild(div);
    });
}
// ===============================
// GENERAR NIVEL
// ===============================
function generarNivel() {
    // Reset estado
    enemigos = [];
    enemigosDerrotadosNivel = 0;
    // Limpiar pantalla
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());
    // ===== CONFIGURACIÓN NIVEL =====
    const esNivelJefe = (nivelActual % 5 === 0);
    const dificultadBase = 1 + Math.floor(nivelActual / 2);
    const multiplicadorDificultad = 1 + (nivelActual * 0.1);
    // ===== CANTIDAD ENEMIGOS =====
    let numEnemigos;
    if (esNivelJefe) {
        numEnemigos = 1;
    } else {
        numEnemigos = Math.min(3 + dificultadBase, 8);
    }
    // ===== GENERACIÓN =====
    for (let i = 0; i < numEnemigos; i++) {
        // 🔥 Mini-jefe aleatorio (más dinámico)
        const esMiniJefe = (Math.random() < 0.1 && nivelActual > 3);
        const esJefe = esNivelJefe || esMiniJefe;
        const enemigo = crearEnemigo(nivelActual, esJefe);
        // ===== ESCALADO FINAL =====
        enemigo.vidaMax = Math.floor(enemigo.vidaMax * multiplicadorDificultad);
        enemigo.vida = enemigo.vidaMax;
        enemigo.ataque = Math.floor(enemigo.ataque * multiplicadorDificultad);
        enemigo.defensa = Math.floor(enemigo.defensa * multiplicadorDificultad);
        enemigo.magia = Math.floor(enemigo.magia * multiplicadorDificultad);
        // 🔥 BONUS extra si es mini-jefe (sin ser jefe principal)
        if (esMiniJefe && !esNivelJefe) {
            enemigo.vida *= 1.3;
            enemigo.ataque *= 1.2;
            enemigo.defensa *= 1.2;
        }
        enemigos.push(enemigo);
    }
    // ===============================
    // 🧾 MENSAJE DINÁMICO
    // ===============================
    if (mensajeEl) {
        mensajeEl.innerHTML = esNivelJefe
            ? `👑 <b>Nivel ${nivelActual}</b> - <span style="color:#e74c3c">¡JEFE FINAL!</span>`
            : `⚔️ <b>Nivel ${nivelActual}</b> - ${numEnemigos} enemigos`;
    }
    // ===============================
    // 🎨 RENDER + UI
    // ===============================
    dibujarEnemigos();
    if (typeof actualizarUI === "function") {
        actualizarUI();
    }
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
    if (!juegoActivo || jugador.vida <= 0 || enemigos.length === 0) return;
    const enemigo = enemigos[0];
    const enemigoDiv = gameArea.querySelector(`.enemigo[data-index="0"]`);
    if (!enemigoDiv) return;
    // ===== DAÑO BASE =====
    let daño = jugador.ataque + jugador.magia - enemigo.defensa;
    // ===== BONUS POR CLASE =====
    if (enemigo.claseInfo) {
        switch (enemigo.claseInfo.clase) {
            case "mago":
                daño *= 1.1; // magos reciben más daño
                break;
            case "guerrero":
                daño *= 0.9; // guerreros resisten más
                break;
            case "arquero":
                daño *= 1.05;
                break;
            case "esqueleto":
                daño *= 1.15;
                break;
        }
    }
    // ===== CRÍTICO =====
    let esCrit = esCritico();
    if (esCrit) {
        daño *= 2;
        mensajeEl.innerHTML = `💥 <span style="color:#f1c40f">¡CRÍTICO!</span>`;
        sonidoCritico?.play().catch(() => {});
    } else {
        mensajeEl.textContent = `⚔️ Atacas al enemigo`;
        sonidoGolpe?.play().catch(() => {});
    }
    // ===== DAÑO MÍNIMO =====
    if (daño < 2) daño = 2;
    daño = Math.floor(daño);
    // ===== APLICAR DAÑO =====
    enemigo.vida -= daño;
    enemigo.vida = Math.max(0, enemigo.vida);
    // ===== ACTUALIZAR BARRA VIDA =====
    const fill = enemigoDiv.querySelector(".vida-fill");
    if (fill) {
        const porcentaje = (enemigo.vida / enemigo.vidaMax) * 100;
        fill.style.width = `${porcentaje}%`;
        // Color dinámico
        fill.style.background =
            porcentaje > 60 ? "#2ecc71" :
            porcentaje > 30 ? "#f1c40f" :
            "#e74c3c";
    }
    // ===== EFECTO VISUAL DE GOLPE =====
    enemigoDiv.style.transform = "scale(1.15)";
    enemigoDiv.style.filter = "brightness(1.8)";
    setTimeout(() => {
        enemigoDiv.style.transform = "";
        enemigoDiv.style.filter = "";
    }, 150);
    mensajeEl.innerHTML += `<br>⚔️ Daño: <span style="color:#e74c3c">${daño}</span>`;
    // ===============================
    // ☠️ MUERTE DEL ENEMIGO
    // ===============================
    if (enemigo.vida <= 0) {
        enemigosDerrotadosNivel++;
        // ===== PUNTOS =====
        let puntos = 10;
        if (enemigo.jefe) puntos = 50;
        else if (enemigo.claseInfo?.clase === "esqueleto") puntos = 15;
        jugador.puntaje += puntos;
        // ===== CURACIÓN =====
        const curacion = enemigo.jefe ? 30 : 10;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + curacion);
        mensajeEl.innerHTML += `
            <br><span style="color:#2ecc71">
            ★ Enemigo derrotado! +${puntos} pts, +${curacion} HP
            </span>
        `;
        // ===== LOOT INTELIGENTE =====
        let loot = null;
        if (typeof darLootEspecial === "function" && enemigo.claseInfo) {
            loot = darLootEspecial(enemigo.claseInfo.clase, enemigo.jefe);
        } else if (typeof darLoot === "function") {
            loot = darLoot();
        }
        if (loot) {
            mensajeEl.innerHTML += `<br>🎁 ${loot}`;
        }
        sonidoLoot?.play().catch(() => {});
        // ===== ELIMINAR ENEMIGO =====
        enemigos.shift();
        enemigoDiv.remove();
        dibujarEnemigos();
    }
    // ===== RESPUESTA ENEMIGA =====
    if (typeof ataqueEnemigos === "function") {
        ataqueEnemigos();
    }
    // ===== ESTADO DEL JUEGO =====
    if (typeof revisarEstado === "function") {
        revisarEstado();
    }
    actualizarUI();
}
// ===============================
// ATAQUE ENEMIGOS
// ===============================
function ataqueEnemigos() {
    if (!juegoActivo || jugador.vida <= 0) return;
    const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
    const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;
    document.querySelectorAll(".enemigo").forEach((enemigoDiv, i) => {
        const enemigo = enemigos[i];
        if (!enemigo || enemigo.vida <= 0) return;
        const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
        const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;
        const distancia = Math.sqrt((jx - ex) ** 2 + (jy - ey) ** 2);
        const clase = enemigo.claseInfo?.clase || "guerrero";
        // ===== RANGO DINÁMICO =====
        let rangoAtaque = 70;
        if (clase === "arquero") rangoAtaque = 120;
        if (clase === "mago") rangoAtaque = 100;
        if (distancia <= rangoAtaque) {
            let daño = enemigo.ataque;
            // ===== MODIFICADORES POR CLASE =====
            switch (clase) {
                case "arquero":
                    daño *= 1.2;
                    if (Math.random() < 0.3) {
                        mensajeEl.innerHTML += `<br><span style="color:#3498db">🏹 Esquivaste la flecha</span>`;
                        return;
                    }
                    break;
                case "mago":
                    daño += 5;
                    daño += Math.floor(jugador.defensa * 0.3); // ignora defensa
                    break;
                case "esqueleto":
                    daño *= 1.1;
                    enemigo.vida = Math.min(enemigo.vidaMax, enemigo.vida + 2); // vampirismo
                    break;
            }
            // ===== IA =====
            if (enemigo.ia === "agresivo") daño *= 1.2;
            if (enemigo.ia === "defensivo") daño *= 0.7;
            // ===== DEFENSA =====
            daño -= jugador.defensa;
            if (daño < 1) daño = 1;
            daño = Math.floor(daño);
            // ===== APLICAR DAÑO =====
            jugador.vida -= daño;
            jugador.vida = Math.max(0, jugador.vida);
            // ===== ANIMACIÓN ENEMIGO =====
            enemigoDiv.style.transform = "scale(1.2)";
            setTimeout(() => enemigoDiv.style.transform = "", 150);
            // ===== EFECTO EN JUGADOR =====
            jugadorDiv.style.filter = "brightness(2) sepia(1) hue-rotate(-50deg)";
            setTimeout(() => jugadorDiv.style.filter = "", 200);
            // ===== MENSAJES DINÁMICOS =====
            if (Math.random() < 0.3) {
                const mensajes = {
                    guerrero: "⚔️ Golpe brutal",
                    mago: "🔮 Magia oscura",
                    arquero: "🏹 Disparo preciso",
                    esqueleto: "💀 Ataque óseo"
                };
                mensajeEl.innerHTML = `
                    <span style="color:#e74c3c">
                    ${mensajes[clase] || "Ataque enemigo"} -${daño} HP
                    </span>
                `;
            }
            actualizarUI();
        }
    });
}
// ===============================
// IA ENEMIGOS
// ===============================
(function iniciarAtaqueEnemigos() {
    function atacarEnemigos() {
        if (!juegoActivo || jugador.vida <= 0) {
            requestAnimationFrame(atacarEnemigos);
            return;
        }
        const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
        const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;
        document.querySelectorAll(".enemigo").forEach((enemigoDiv, i) => {
            const enemigo = enemigos[i];
            if (!enemigo || enemigo.vida <= 0) return;
            const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
            const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;
            const dx = jx - ex;
            const dy = jy - ey;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            const clase = enemigo.claseInfo?.clase || "guerrero";
            // ===== RANGO DINÁMICO =====
            let rangoAtaque = 70;
            if (clase === "arquero") rangoAtaque = 120;
            if (clase === "mago") rangoAtaque = 100;
            if (distancia <= rangoAtaque) {
                let daño = enemigo.ataque;
                // ===== CLASES =====
                switch (clase) {
                    case "arquero":
                        daño *= 1.2;
                        if (Math.random() < 0.3) {
                            mensajeEl.innerHTML += `<br><span style="color:#3498db">🏹 Esquivaste flecha</span>`;
                            return;
                        }
                        break;
                    case "mago":
                        daño += 5;
                        daño += Math.floor(jugador.defensa * 0.3);
                        break;
                    case "esqueleto":
                        daño *= 1.1;
                        enemigo.vida = Math.min(enemigo.vidaMax, enemigo.vida + 2);
                        break;
                }
                // ===== IA =====
                if (enemigo.ia === "agresivo") daño *= 1.2;
                if (enemigo.ia === "defensivo") daño *= 0.7;
                // ===== DEFENSA =====
                daño -= jugador.defensa;
                if (daño < 1) daño = 1;
                daño = Math.floor(daño);
                // ===== APLICAR DAÑO =====
                jugador.vida -= daño;
                jugador.vida = Math.max(0, jugador.vida);
                // ===== ANIMACIÓN =====
                enemigoDiv.style.transform = "scale(1.2)";
                setTimeout(() => enemigoDiv.style.transform = "", 150);
                jugadorDiv.style.filter = "brightness(2) sepia(1) hue-rotate(-50deg)";
                setTimeout(() => jugadorDiv.style.filter = "", 200);
                // ===== MENSAJE =====
                if (Math.random() < 0.3) {
                    const mensajes = {
                        guerrero: "⚔️ Golpe pesado!",
                        mago: "🔮 Magia oscura!",
                        arquero: "🏹 Flecha certera!",
                        esqueleto: "💀 Ataque óseo!"
                    };
                    mensajeEl.innerHTML = `
                        <span style="color:#e74c3c">
                        ${mensajes[clase] || "Ataque enemigo"} -${daño} HP
                        </span>
                    `;
                }
                actualizarUI();
            }
        });
        requestAnimationFrame(atacarEnemigos);
    }
    window.addEventListener("load", atacarEnemigos);
})();
// ===============================
// IA ENEMIGOS
// ===============================
(function iniciarMovimientoEnemigos() {
    function moverEnemigos() {
        if (!juegoActivo) {
            requestAnimationFrame(moverEnemigos);
            return;
        }
        const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
        const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;
        document.querySelectorAll(".enemigo").forEach((enemigoDiv, i) => {
            const enemigo = enemigos[i];
            if (!enemigo || enemigo.vida <= 0) return;
            const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
            const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;
            const dx = jx - ex;
            const dy = jy - ey;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            const clase = enemigo.claseInfo?.clase || "guerrero";
            // ===== VELOCIDAD =====
            let velocidad = enemigo.velocidad || 0.5;
            // ===== COMPORTAMIENTO =====
            if (clase === "arquero") {
                if (distancia < 80) velocidad *= -1; // huye
            } else if (clase === "mago") {
                velocidad *= 0.6;
            } else if (enemigo.ia === "agresivo") {
                velocidad *= 1.3;
            } else if (enemigo.ia === "defensivo") {
                velocidad *= 0.6;
            }
            const rangoAtaque = clase === "arquero" ? 100 : 60;
            // ===== MOVIMIENTO =====
            if (distancia > rangoAtaque || (clase === "arquero" && distancia < 60)) {
                const moveX = (dx / distancia) * velocidad + Math.sin(Date.now() / 300 + i) * 0.5;
                const moveY = (dy / distancia) * velocidad;
                const newLeft = enemigoDiv.offsetLeft + moveX;
                const newTop = enemigoDiv.offsetTop + moveY;
                const maxX = gameArea.offsetWidth - enemigoDiv.offsetWidth;
                const maxY = gameArea.offsetHeight - enemigoDiv.offsetHeight;
                enemigoDiv.style.left = Math.max(0, Math.min(newLeft, maxX)) + "px";
                enemigoDiv.style.top = Math.max(0, Math.min(newTop, maxY)) + "px";
            }
        });
        requestAnimationFrame(moverEnemigos);
    }
    window.addEventListener("load", moverEnemigos);
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
// 🔹 Movimiento teclado
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
    // Arrastre del jugador
    let dragging = false;
    let offsetX = 0, offsetY = 0;
    function startDrag(e) {
        dragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = jugadorDiv.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        jugadorDiv.style.cursor = "grabbing";
        e.preventDefault();
    }
    function onDrag(e) {
        if (!dragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const gameRect = gameArea.getBoundingClientRect();
        let x = clientX - gameRect.left - offsetX;
        let y = clientY - gameRect.top - offsetY;
        const maxX = gameArea.offsetWidth - jugadorDiv.offsetWidth;
        const maxY = gameArea.offsetHeight - jugadorDiv.offsetHeight;
        jugadorDiv.style.left = Math.max(0, Math.min(x, maxX)) + "px";
        jugadorDiv.style.top = Math.max(0, Math.min(y, maxY)) + "px";
        ataqueEnemigos();
    }
    function stopDrag() {
        dragging = false;
        jugadorDiv.style.cursor = "grab";
    }
    jugadorDiv.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    jugadorDiv.addEventListener("touchstart", startDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", stopDrag);
    // Iniciar loops
    moverEnemigos();
    setInterval(() => {
        if (juegoActivo) ataqueEnemigos();
    }, 800);
    // Generar primer nivel
    generarNivel();
});
