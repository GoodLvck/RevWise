"use client"

import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface GoalData {
  id: string
  product: {
    name: string
    description: string
  }
  targetPrice: number
  currentPrice: number
  targetDate: string
  progress: number
}

export default function GoalPage({ params }: { params: { productId: string } }) {
  const [goalData, setGoalData] = useState<GoalData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the goal data from your API
    // For this demo, we'll simulate the data
    const fetchGoalData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        let mockGoalData: GoalData

        if (params.productId === "macbook-air-2024") {
          mockGoalData = {
            id: "goal_1",
            product: {
              name: "MacBook Air 2024",
              description: "MacBook Air laptop from 2024",
            },
            targetPrice: 999,
            currentPrice: 900,
            targetDate: "2025-07-05",
            progress: 0.8, // 80% progress
          }
        } else {
          // Default to Jordan sneakers
          mockGoalData = {
            id: "goal_2",
            product: {
              name: "Zapatillas Jordan",
              description: "Air Jordan 1 High",
            },
            targetPrice: 120,
            currentPrice: 35,
            targetDate: "2025-07-05",
            progress: 0.3, // 30% progress
          }
        }

        setGoalData(mockGoalData)
      } catch (error) {
        console.error("Error fetching goal data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGoalData()
  }, [params.productId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading goal data...</p>
        </div>
      </div>
    )
  }

  if (!goalData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Goal not found</p>
          <Link href="/" className="text-purple-700 font-medium mt-4 block">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  // Parse the target date
  const targetDate = new Date(goalData.targetDate)
  const day = targetDate.getDate().toString().padStart(2, "0")
  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0")
  const year = targetDate.getFullYear()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b">
        <Link href="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <Image src="/logo.png" alt="RevWise" width={120} height={36} />
      </header>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Your goal</h2>

        {/* Product Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
            <Image
              src={params.productId === "macbook-air-2024" ? "/macbookair2024.png" : "/jordan.png"}
              alt={goalData.product.name}
              width={240}
              height={160}
              className="object-contain h-40"
            />
          </div>

          {/* Product Info */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">{goalData.product.name}</h3>
            <p className="text-gray-700">{goalData.product.description}</p>
          </div>

          {/* Saving Progress */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Saving progress</h4>
            <div className="flex items-center justify-between">
              <span>{goalData.currentPrice}€</span>
              <div className="flex-1 h-2 bg-gray-300 rounded-full mx-2 overflow-hidden">
                <div
                  className="bg-purple-700 h-full rounded-full"
                  style={{ width: `${goalData.progress * 100}%` }}
                ></div>
              </div>
              <span>{goalData.targetPrice}€</span>
            </div>
          </div>

          {/* End Date */}
          <div>
            <h4 className="font-medium mb-2">End date</h4>
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-lg text-xl font-medium w-16 text-center">{day}</div>
              <span className="mx-2 text-xl">/</span>
              <div className="bg-gray-100 p-3 rounded-lg text-xl font-medium w-16 text-center">{month}</div>
              <span className="mx-2 text-xl">/</span>
              <div className="bg-gray-100 p-3 rounded-lg text-xl font-medium w-24 text-center">{year}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href={`/chat/${params.productId}`}
            className="flex-1 py-3 px-4 rounded-lg bg-purple-800 text-white text-center font-medium"
          >
            Chat about this product
          </Link>
        </div>
      </div>
    </div>
  )
}
