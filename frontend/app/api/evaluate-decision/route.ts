import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the price and product ID from the request
    const { price, productId } = await request.json()

    if (!price) {
      return NextResponse.json({ error: "Price is required" }, { status: 400 })
    }

    // Convert price to number
    const priceValue = Number.parseFloat(price)

    // In a real implementation, you would:
    // 1. Check the price against market data
    // 2. Evaluate if it's a good decision
    // 3. Return the appropriate result

    // For this example, we'll use a simple logic based on the price value
    let decision
    let message

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simple decision logic (for demonstration)
    if (productId.includes("salomon") || productId.includes("snowboard")) {
      if (priceValue < 300) {
        decision = 1 // Good decision
        message = "It is a safe purchase. Your monthly balance won't be agressively affected after this purchase."
      } else if (priceValue < 500) {
        decision = 0 // Think about it
        message = "It's not the best decicion you could make. Your monthly balance would be nagative after this purchase. You should not buy it but your emergency fund wonuldn't be affected."
      } else {
        decision = -1 // Bad decision
        message = "It's a bad decission. You should not buy it. If you buy it, your emergency fund will be affected."
      }
    } else if (productId.includes("jordan") || productId.includes("sneakers")) {
      if (priceValue < 100) {
        decision = 1 // Good decision
        message = "It is a safe purchase. Your monthly balance won't be agressively affected after this purchase."
      } else if (priceValue < 150) {
        decision = 0 // Think about it
        message = "It's not the best decicion you could make. Your monthly balance would be nagative after this purchase. You should not buy it but your emergency fund wonuldn't be affected."
      } else {
        decision = -1 // Bad decision
        message = "It's a bad decission. You should not buy it. If you buy it, your emergency fund will be affected."
      }
    } else if (productId.includes("macbook")) {
      if (priceValue < 900) {
        decision = 1 // Good decision
        message = "It is a safe purchase. Your monthly balance won't be agressively affected after this purchase."
      } else if (priceValue < 1200) {
        decision = 0 // Think about it
        message = "It's not the best decicion you could make. Your monthly balance would be nagative after this purchase. You should not buy it but your emergency fund wonuldn't be affected."
      } else {
        decision = -1 // Bad decision
        message = "It's a bad decission. You should not buy it. If you buy it, your emergency fund will be affected."
      }
    } else {
      // Default logic for unknown products
      if (priceValue < 50) {
        decision = 1 // Good decision
        message = "It is a safe purchase. Your monthly balance won't be agressively affected after this purchase."
      } else if (priceValue < 100) {
        decision = 0 // Think about it
        message = "It's not the best decicion you could make. Your monthly balance would be nagative after this purchase. You should not buy it but your emergency fund wonuldn't be affected."
      } else {
        decision = -1 // Bad decision
        message = "It's a bad decission. You should not buy it. If you buy it, your emergency fund will be affected."
      }
    }

    return NextResponse.json({
      decision,
      message,
      price: priceValue,
      productId,
    })
  } catch (error) {
    console.error("Error evaluating decision:", error)
    return NextResponse.json({ error: "Failed to evaluate decision" }, { status: 500 })
  }
}
