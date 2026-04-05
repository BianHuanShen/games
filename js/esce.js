// ===============================
// 🎨 RENDER SYSTEM LIMPIO
// ===============================

(function () {

    console.log("🎨 Render cargado");

    const escenario = document.getElementById("escenario");

    if (!escenario) {
        console.warn("⚠️ No existe #escenario en el HTML");
        return;
    }

    // ===============================
    // CONFIG
    // ===============================
    const rutas = ["img/escenario1.jpeg"];
    const personajeRuta = "img/personaje.jpeg";

    // ===============================
    // FONDO
    // ===============================
    function cambiarEscenario() {
        if (typeof nivelActual === "undefined") return;

        let index = nivelActual % rutas.length;
        const rutaFinal = rutas[index];

        const img = new Image();
        img.src = rutaFinal;

        img.onload = () => {
            escenario.style.backgroundImage = `url('${rutaFinal}')`;
            escenario.style.backgroundSize = "cover";
            escenario.style.backgroundPosition = "center";
        };

        img.onerror = () => {
            console.error("❌ Error fondo:", rutaFinal);
        };
    }

    // ===============================
    // 🧍 PERSONAJE
    // ===============================
    function aplicarPersonaje() {
        const jugador = document.getElementById("jugador");

        if (!jugador) return;

        const img = new Image();
        img.src = personajeRuta;

        img.onload = () => {
            jugador.style.backgroundImage = `url('${personajeRuta}')`;
            jugador.style.backgroundSize = "contain";
            jugador.style.backgroundRepeat = "no-repeat";
            jugador.style.backgroundPosition = "center";
            jugador.style.backgroundColor = "transparent";
        };

        img.onerror = () => {
            console.error("❌ Error personaje:", personajeRuta);
        };
    }

    // ===============================
    // INTERCEPTAR NIVEL
    // ===============================
    const originalGenerarNivel = window.generarNivel;

    window.generarNivel = function () {
        if (originalGenerarNivel) originalGenerarNivel();

        cambiarEscenario();
        setTimeout(aplicarPersonaje, 50);
    };

    // ===============================
    // INIT
    // ===============================
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            cambiarEscenario();
            aplicarPersonaje();
        }, 300);
    });

})();
