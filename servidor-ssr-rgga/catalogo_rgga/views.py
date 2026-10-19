from django.shortcuts import render

# "Base de datos" falsa: una lista de diccionarios en memoria.
# En un proyecto real esto vendría de un modelo (models.py) y una tabla,
# pero para ENTENDER qué es SSR no necesitamos base de datos: lo importante
# es que estos datos se insertan en el HTML *antes* de enviarlo al navegador.
PRODUCTOS = [
    
{"id":1,"nombre":"Chilaquiles rojos o verdes","categoria":"Desayunos mexicanos","precio":120},
{"id":2,"nombre":"Huevos rancheros","categoria":"Desayunos mexicanos","precio":110},
{"id":3,"nombre":"Molletes","categoria":"Desayunos mexicanos","precio":95},
{"id":4,"nombre":"Omelette de espinaca","categoria":"Desayunos mexicanos","precio":115},
{"id":5,"nombre":"Machaca con huevo","categoria":"Desayunos mexicanos","precio":130},
{"id":6,"nombre":"Hot cakes","categoria":"Brunch dulce y ligero","precio":95},
{"id":7,"nombre":"Pan francés","categoria":"Brunch dulce y ligero","precio":105},
{"id":8,"nombre":"Avena con fruta","categoria":"Brunch dulce y ligero","precio":75},
{"id":9,"nombre":"Yogurt con granola","categoria":"Brunch dulce y ligero","precio":80},
{"id":10,"nombre":"Bagel de salmón","categoria":"Brunch dulce y ligero","precio":145},
{"id":11,"nombre":"Jugo de naranja","categoria":"Bebidas","precio":40},
{"id":12,"nombre":"Café americano (refill)","categoria":"Bebidas","precio":35},
{"id":13,"nombre":"Latte","categoria":"Bebidas","precio":55},
{"id":14,"nombre":"Chocolate caliente","categoria":"Bebidas","precio":50},
{"id":15,"nombre":"Mimosa sin alcohol","categoria":"Bebidas","precio":60}

]


def vista_ssr(request):
    """
    Vista con Renderizado en Servidor (SSR).

    request: el objeto que representa la petición que hizo el navegador.

    render() hace tres cosas:
      1) toma la plantilla 'catalogo/catalogo_ssr.html'
      2) le inyecta el diccionario de "contexto" (aquí: la lista de productos)
      3) devuelve el HTML final, YA CON LOS DATOS DENTRO, listo para el navegador.

    Por eso es "servidor": el HTML que llega al navegador ya trae escritos
    los nombres y precios. Si haces clic derecho > "Ver código fuente de la
    página" verás los productos en el HTML, aunque JavaScript esté desactivado.
    Compáralo con la vista CSR de la Parte B, donde el HTML llega vacío y es
    JavaScript quien dibuja los productos DESPUÉS, ya en el navegador.
    """
    contexto = {"productos": PRODUCTOS}
    return render(request, 'catalogo/catalogo_ssr.html', contexto)