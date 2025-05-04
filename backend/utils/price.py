from serpapi import GoogleSearch
import os
from dotenv import load_dotenv

# Cargar variables desde el .env
load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def estimate_average_price(product_name):
    if not SERPAPI_KEY:
        return None, "No SerpAPI key configurada."

    search = GoogleSearch({
        "q": product_name,
        "engine": "google_shopping",
        "api_key": SERPAPI_KEY
    })

    results = search.get_dict()
    prices = []

    try:
        for item in results.get("shopping_results", []):
            price_str = item.get("price", "")
            if price_str.startswith("$") or price_str.startswith("€"):
                price = float(price_str[1:].replace(",", ""))
                prices.append(price)
            elif price_str.endswith("€") or price_str.endswith("$"):
                price = float(price_str[:-1].replace(",", ""))
                prices.append(price)
    except Exception as e:
        return None, f"Error extrayendo precios: {str(e)}"

    if prices:
        avg_price = sum(prices) / len(prices)
        return round(avg_price, 2), None
    else:
        return None, "No se encontraron precios"
