"use client"

import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ProductData {
  name: string
  description: string
  estimatedPrice?: number // Added estimated price
}

export default function ConfirmProductPage() {
  const router = useRouter()
  const [price, setPrice] = useState("00,00")
  const [day, setDay] = useState("05")
  const [month, setMonth] = useState("07")
  const [year, setYear] = useState("2025")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Retrieve the captured image and product data from sessionStorage
    const storedImage = sessionStorage.getItem("capturedImage")
    const storedProductData = sessionStorage.getItem("productData")

    if (storedImage) {
      setCapturedImage(storedImage)
    }

    if (storedProductData) {
      try {
        const parsedData = JSON.parse(storedProductData)
        setProductData(parsedData)

        // Set the price input to the estimated price if available
        if (parsedData.estimatedPrice) {
          setPrice(parsedData.estimatedPrice.toString().replace(".", ","))
        }
      } catch (error) {
        console.error("Error parsing product data:", error)
      }
    }
  }, [])

  const handleAccept = async () => {
    try {
      setIsSubmitting(true)

      // 1. First API call: Save the product goal
      const goalData = {
        product: productData,
        targetPrice: price.replace(",", "."),
        targetDate: `${year}-${month}-${day}`,
        image: capturedImage,
      }

      const saveResponse = await fetch("/api/save-product-goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      })

      if (!saveResponse.ok) {
        throw new Error("Error saving product goal")
      }

      // 2. Second API call: Evaluate the purchase decision
      const evaluateResponse = await fetch("/api/evaluate-decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: price.replace(",", "."),
          productId: productData?.name?.toLowerCase().replace(/\s+/g, "-") || "product",
        }),
      })

      if (!evaluateResponse.ok) {
        throw new Error("Error evaluating decision")
      }

      const evaluationResult = await evaluateResponse.json()

      // Store the evaluation result in sessionStorage to use it in the chat
      sessionStorage.setItem("evaluationResult", JSON.stringify(evaluationResult))

      // Navigate to chat page
      const productId = productData?.name?.toLowerCase().replace(/\s+/g, "-") || "product"
      router.push(`/chat/${productId}`)
    } catch (error) {
      console.error("Error processing request:", error)
      alert("Error processing your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Navigate back to the result page
    router.push("/scan/result")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b">
        <Link href="/scan/result" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <Image src="/logo.png" alt="RevWise" width={120} height={36} />
      </header>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Confirmed product</h2>

        {/* Product Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center">
            <div className="mr-4 w-16 h-16 relative flex-shrink-0">
              {capturedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured product"
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <Image
                  src="/snowboard.png"
                  alt="Default product image"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{productData?.name || "Unknown Product"}</h3>
              <p className="text-gray-700 text-sm">{productData?.description || "No description available"}</p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h3 className="text-xl font-medium mb-6 text-center">Help me help you</h3>

          {/* Price Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">What is the price?</label>
            <div className="flex items-center">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-gray-100 p-3 rounded-lg text-xl font-medium w-24 mr-2"
              />
              <span className="text-3xl">€</span>
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium mb-2">When do you want to buy it?</label>
            <div className="flex items-center">
              <input
                type="text"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="bg-gray-100 p-3 rounded-lg text-xl font-medium w-16"
                maxLength={2}
              />
              <span className="mx-2 text-xl">/</span>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-gray-100 p-3 rounded-lg text-xl font-medium w-16"
                maxLength={2}
              />
              <span className="mx-2 text-xl">/</span>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-gray-100 p-3 rounded-lg text-xl font-medium w-24"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-center font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-lg bg-purple-800 text-white text-center font-medium disabled:opacity-50 flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              "Accept"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
