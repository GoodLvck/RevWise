"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Start camera when component mounts
    startCamera()

    // Clean up when component unmounts
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) return

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
          },
          "image/jpeg",
          0.8,
        )
      })

      // Create FormData and append the image
      const formData = new FormData()
      formData.append("image", blob, "product-image.jpg")

      // Call the API to identify the product
      const response = await fetch("http://localhost:8000/identify", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const formData = new FormData()
        formData.append("image", blob, "snowboard.jpg")

        // Call the API to identify the product
        const response = await fetch("http://localhost:8000/identify", {
          method: "POST",
          body: formData,
        })
        // throw new Error("Error identifying product")
      }

      const data = await response.json()

      // Normalizar propiedades del backend
      const productData = {
        name: data.product_name,
        description: data.description,
        estimatedPrice: data.estimated_price,
      }

      const imageDataUrl = canvas.toDataURL("image/jpeg")

      sessionStorage.setItem("capturedImage", imageDataUrl)
      sessionStorage.setItem("productData", JSON.stringify(productData))


      // Navigate to the result page
      router.push("/scan/result")
    } catch (error) {
      console.error("Error capturing or processing image:", error)
      alert("Error identifying product. Please try again.")
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Camera Video Feed (full screen) */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" />

      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70">
        {/* Header */}
        <div className="flex items-center p-4">
          <Link href="/" className="text-white mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-white text-xl font-bold">
            Rev<span className="text-purple-500">Wise</span>
          </h1>
        </div>

        {/* Scan Text */}
        <div className="text-center mt-8">
          <h2 className="text-white text-2xl font-medium">Scan a product</h2>
        </div>

        {/* Scanning Square (transparent window) */}
        <div className="relative mx-auto mt-8 w-64 h-64 border-4 border-white rounded-lg overflow-hidden">
          {/* This div creates a "hole" in the overlay */}
          <div className="absolute inset-0 bg-transparent"></div>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capturePhoto}
            disabled={isCapturing}
            className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
              isCapturing ? "bg-gray-500 border-gray-600" : "bg-red-600 border-red-800"
            }`}
          >
            <div className={`w-12 h-12 rounded-full ${isCapturing ? "bg-gray-400" : "bg-red-500"}`}></div>
          </button>
        </div>
      </div>
    </div>
  )
}
