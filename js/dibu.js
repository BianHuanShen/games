// ===============================
// DIBUJAR ENEMIGOS (PRO + SPRITES DOFUS STYLE)
// ===============================
function dibujarEnemigos() {
    // 🔥 Limpiar enemigos anteriores
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
        div.style.top = `${300 + Math.random() * 100}px`;

        // ===============================
        // 🎨 IMAGEN / SPRITE
        // ===============================
        let img = "img/enemigo1.png"; // por defecto

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
        // 🎬 ANIMACIÓN SPRITE
        // ===============================
        div.classList.add("animado"); // la clase animado maneja el sprite sheet en CSS

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
        // 💀 EFECTO BOSS
        // ===============================
        if (e.jefe) {
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.boxShadow = "0 0 30px red";
            div.style.animation = "caminar 0.8s steps(4) infinite";
        } else {
            div.style.width = "64px";
            div.style.height = "64px";
        }

        // ===============================
        // ❤️ BARRA DE VIDA PROFESIONAL
        // ===============================
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

        // ===============================
        // AGREGAR AL ESCENARIO
        // ===============================
        gameArea.appendChild(div);
    });
}
