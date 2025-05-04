datos_bancarios = {
    "saldo_actual": 2000,
    "sueldo": 1600,
    "fondo_emergencia": 1000,
    "gastos_previstos_mes": {
        "alquiler": 800,
        "subscripciones": 50,
        "trnasaccion_ahorros": 100,
        "gimnasio": 30
    },
    "gastos_variables": {
        "comida": 250,
        "transporte": 50
    },
    "gastos_puntuales_promedio": {
        "compras": 200,
        "ocio" : 100
    }
}

def evaluate_costs(product_price, datos_bancarios=datos_bancarios):
    # Gastos fijos que todavía no se han pagado este mes
    gastos_fijos_restantes = sumar_gastos(datos_bancarios["gastos_previstos_mes"])

    # Gastos variables restantes previstos
    gastos_variables_previstos = sumar_gastos(datos_bancarios["gastos_variables"])

    # Gastos puntuales
    gastos_puntuales_promedio = sumar_gastos(datos_bancarios["gastos_puntuales_promedio"])

    # Ganancias esperadas a final de mes
    ganancias = int(datos_bancarios["sueldo"]) - gastos_fijos_restantes - gastos_variables_previstos - gastos_puntuales_promedio

    # Asumimos el gasto
    ganancias_resultantes = ganancias - int(product_price)

    if ganancias_resultantes >= 0:
        return 1    # SEGURO
    else:
        if int(datos_bancarios["saldo_actual"]) + ganancias_resultantes >= datos_bancarios["fondo_emergencia"]:
            return 0    # ARRIESGADO
        else:
            return -1   # INCONSCIENTE


def sumar_gastos(gastos_previstos):
    result = 0

    for key, gasto in gastos_previstos.items():
        result += gasto
    
    return result
