function darLoot() {
    asegurarInventario(); // Aseguramos que no haya NaN antes de añadir items

    const r = Math.random();

    if (r < 0.5) {
        jugador.inventario.pocion += 2;
        return "🧪 Pociones x2";
    } else if (r < 0.7) {
        jugador.inventario.espada += 1;
        return "⚔️ Espada";
    } else if (r < 0.85) {
        jugador.inventario.armadura += 1;
        return "🛡️ Armadura";
    } else if (r < 0.92) {
        jugador.inventario.cristal += 1;
        return "💎 Cristal";
    } else if (r < 0.96) {
        jugador.inventario.orbe += 1;
        return "🔮 Orbe";
    } else if (r < 0.98) {
        jugador.inventario.espadaLegendaria += 1;
        return "⚔️ Espada Legendaria";
    } else {
        jugador.inventario.armaduraEpica += 1;
        return "🛡️ Armadura Épica";
    }
}
