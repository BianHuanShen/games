// ===============================
// RENDER SYSTEM (ESCENARIO PRO)
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
    const rutas = [
        "../img/escenario1.jpeg", // tu imagen generada
        "img/escenario2.png",
        "img/escenario3.png",
        "img/escenario4.png"
    ];

    // ===============================
    // CAMBIAR ESCENARIO DINÁMICO
    // ===============================
    function cambiarEscenario() {

        if (typeof nivelActual === "undefined") return;

        let index = nivelActual % rutas.length;

        escenario.style.backgroundImage = `url('${rutas[index]}')`;

        escenario.style.backgroundSize = "cover";
        escenario.style.backgroundPosition = "center";
        escenario.style.backgroundRepeat = "no-repeat";

        console.log("🌄 Escenario:", rutas[index]);
    }

    // ===============================
    // INTERCEPTAR GENERAR NIVEL 🔥
    // ===============================
    const originalGenerarNivel = window.generarNivel;

    window.generarNivel = function () {

        if (originalGenerarNivel) {
            originalGenerarNivel();
        }

        cambiarEscenario(); // 🔥 se actualiza automáticamente
    };

    // ===============================
    // PRIMER CARGA
    // ===============================
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(cambiarEscenario, 100);
    });

})();