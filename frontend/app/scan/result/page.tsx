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

export default function ScanResultPage() {
  const router = useRouter()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Retrieve the captured image and product data from sessionStorage
    const storedImage = sessionStorage.getItem("capturedImage")
    const storedProductData = sessionStorage.getItem("productData")

    if (storedImage) {
      setCapturedImage(storedImage)
    }

    if (storedProductData) {
      setProductData(JSON.parse(storedProductData))
    }

    setIsLoading(false)
  }, [])

  const handleAccept = () => {
    // Navigate to the confirmation page
    router.push("/scan/confirm")
  }

  const handleCancel = () => {
    // Navigate back to the scanner
    router.push("/scan")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b">
        <Link href="/scan" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <Image src="/logo.png" alt="RevWise" width={120} height={36} />
      </header>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Scanned product</h2>

        {/* Product Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {/* Product Image - Using the captured image */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
            {capturedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={capturedImage || "/placeholder.svg"} alt="Captured product" className="object-contain h-40" />
            ) : (
              <Image
                src="/snowboard.png"
                alt="Default product image"
                width={200}
                height={120}
                className="object-contain h-40"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="mb-2">
            <h3 className="text-lg font-bold">{productData?.name || "Unknown Product"}</h3>
            <p className="text-gray-700">{productData?.description || "No description available"}</p>
            {productData?.estimatedPrice && (
              <p className="text-purple-700 font-medium mt-2">Estimated price: {productData.estimatedPrice}€</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-center font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 py-3 px-4 rounded-lg bg-purple-800 text-white text-center font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
