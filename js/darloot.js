function darLoot() {
    asegurarInventario(); // Aseguramos que no haya NaN antes de añadir items

    const r = Math.random();

    if (r < 0.5) {
        jugador.inventario.pocion += 2;
        return "🧪 Pociones x2";
    } else if (r < 0.8) {
        jugador.inventario.espada += 1;
        return "⚔️ Espada";
    } else if (r < 0.95) {
        jugador.inventario.armadura += 1;
        return "🛡️ Armadura";
    } else {
        jugador.inventario.cristal += 1;
        return "💎 Cristal";
    }
    } else {
        jugador.inventario.inventario.orbe += 1;
        return "⚔️ Orbe Legendario";
    }
 } else {
        jugador.inventario.EspadaLegendaria += 1;
        return "⚔️ Espada Legendaria";
    }
 } else {
        jugador.inventario.ArmaduraEpica += 1;
        return "⚔️ Espada Legendaria";
    }
}
