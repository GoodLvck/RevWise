from google.cloud import vision
import io
import os

# 🟡 Establece la ruta a tu clave JSON (asegúrate que esté en la raíz del proyecto)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "google_credentials.json"

async def identify_product_from_image(image_file):
    # Leer la imagen subida por el usuario
    contents = await image_file.read()
    image = vision.Image(content=contents)

    # Crear el cliente de Vision API
    client = vision.ImageAnnotatorClient()
    
    # Detectar etiquetas en la imagen
    response = client.web_detection(image=image)
    web_detection = response.web_detection

    name = "Producto no identificado"
    description = "No se pudo generar una descripción."

    # Buscar mejor coincidencia
    if web_detection.best_guess_labels:
        name = web_detection.best_guess_labels[0].label

    # Buscar entidades relacionadas (productos similares)
    if web_detection.web_entities:
        top_entities = sorted(
            web_detection.web_entities,
            key=lambda e: e.score,
            reverse=True
        )
        description = ", ".join([entity.description for entity in top_entities if entity.description][:5])

    return name, description