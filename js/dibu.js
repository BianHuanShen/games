// ===============================
// DIBUJAR ENEMIGOS (PRO + SPRITES)
// ===============================
function dibujarEnemigos() {

    // Limpiar enemigos anteriores
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    enemigos.forEach((e, index) => {
        const div = document.createElement("div");
        div.classList.add("enemigo");

        // ===============================
        // DATA
        // ===============================
        div.dataset.index = index;
        div.dataset.jefe = e.jefe;
        div.title = e.ia;

        // ===============================
        // POSICIÓN
        // ===============================
        div.style.position = "absolute";
        div.style.left = `${200 + index * 80}px`;
        div.style.top = `${300 + Math.random() * 100}px`; // posición dinámica

        // ===============================
        // 🎨 SELECCIÓN DE IMAGEN
        // ===============================
        let img = "img/enemigo1.png"; // default

        if (e.jefe) {
            img = "img/boss.png";
        } else if (e.ia === "mago") {
            img = "img/mago.png";
        } else {
            const random = Math.floor(Math.random() * 3) + 1;
            img = `img/enemigo${random}.png`;
        }

        div.style.backgroundImage = `url('${img}')`;
        div.style.backgroundSize = "contain";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";

        // ===============================
        // 🎬 ACTIVAR SPRITE (ANIMACIÓN)
        // ===============================
        div.classList.add("animado");

        // ===============================
        // 🎨 FILTRO POR IA
        // ===============================
        switch (e.ia) {
            case "agresivo":
                div.style.filter = "hue-rotate(0deg)";
                break;
            case "defensivo":
                div.style.filter = "hue-rotate(90deg)";
                break;
            case "mago":
                div.style.filter = "hue-rotate(250deg)";
                break;
        }

        // ===============================
        // 💀 BOSS EFECTO
        // ===============================
        if (e.jefe) {
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.boxShadow = "0 0 30px red";
            div.style.animation = "caminar 0.8s steps(4) infinite";
        }

        // ===============================
        // ❤️ BARRA DE VIDA
        // ===============================
        const barra = document.createElement("div");
        barra.classList.add("barra-vida");

        const fill = document.createElement("div");
        fill.style.width = "100%";

        barra.appendChild(fill);
        div.appendChild(barra);

        // ===============================
        // AGREGAR AL ESCENARIO
        // ===============================
        gameArea.appendChild(div);
    });
}
