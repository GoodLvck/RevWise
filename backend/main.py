from utils.evaluate_cost import evaluate_costs
from fastapi import FastAPI, File, UploadFile, Form
from utils.vision import identify_product_from_image
from fastapi.responses import JSONResponse
from utils.price import estimate_average_price
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/identify")
async def identify_image(image: UploadFile = File(...)):
    try:
        name, description = await identify_product_from_image(image)
        avg_price, error = estimate_average_price(name)

        return {
            "product_name": name,
            "description": description,
            "estimated_price": avg_price,
            "price_error": error
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/evaluate")
async def evaluate_purchase(request: dict):
    try:
        return evaluate_costs(
            product_price=request["product_price"],
            # datos_bancarios=request["user_data"],
        )
    except Exception as e:
        print("[ERROR en /evaluate]:", str(e))
        return {"error": str(e)}

