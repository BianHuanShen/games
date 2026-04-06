function darLoot(nivel, esBoss = false) {
    const r = Math.random();

    // Base de loot
    const base = Math.max(1, Math.ceil(nivel * 1.5));
    const bossMultiplier = esBoss ? 2.5 : 1;

    // Probabilidades dinámicas
    const probPocion   = Math.max(0.5 - nivel * 0.03, 0.25);
    const probEspada   = Math.min(0.3 + nivel * 0.04, 0.5);
    const probArmadura = 1 - probPocion - probEspada;

    // Loot raro
    const probRaro = esBoss ? 0.15 + nivel * 0.02 : 0.02;
    const lootRaro = [
        { nombre: "💎 Cristal Místico", inventario: "cristal" },
        { nombre: "🔮 Orbe Arcano", inventario: "orbe" },
        { nombre: "⚔️ Espada Legendaria", inventario: "espadaLegendaria" },
        { nombre: "🛡️ Armadura Épica", inventario: "armaduraEpica" }
    ];

    // Inicializar inventario seguro
    jugador.inventario = jugador.inventario || {};
    ['pocion','espada','armadura'].forEach(item => {
        jugador.inventario[item] = jugador.inventario[item] || 0;
    });

    let cantidad;

    if (r < probRaro) {
        // Loot raro
        const item = lootRaro[Math.floor(Math.random() * lootRaro.length)];
        jugador.inventario[item.inventario] = (jugador.inventario[item.inventario] || 0) + 1;
        return `${item.nombre} x1`;
    } else if (r < probRaro + probPocion) {
        cantidad = Math.ceil(base * bossMultiplier * 0.8);
        jugador.inventario.pocion += cantidad;
        return `🧪 Pociones x${cantidad}`;
    } else if (r < probRaro + probPocion + probEspada) {
        cantidad = Math.ceil(base * bossMultiplier * 0.6);
        jugador.inventario.espada += cantidad;
        return `⚔️ Espada x${cantidad}`;
    } else {
        cantidad = Math.ceil(base * bossMultiplier * 0.6);
        jugador.inventario.armadura += cantidad;
        return `🛡️ Armadura x${cantidad}`;
    }
}
