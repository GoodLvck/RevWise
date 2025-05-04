"use client"

import { ArrowLeft, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
}

interface ProductData {
  name: string
  description: string
}

interface EvaluationResult {
  decision: number
  message: string
  price: number
  productId: string
}

export default function ProductChatPage({ params }: { params: { productId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setValue] = useState("")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Retrieve the captured image and product data from sessionStorage
    const storedImage = sessionStorage.getItem("capturedImage")
    const storedProductData = sessionStorage.getItem("productData")
    const storedEvaluationResult = sessionStorage.getItem("evaluationResult")

    if (storedImage) {
      setCapturedImage(storedImage)
    }

    if (storedProductData) {
      setProductData(JSON.parse(storedProductData))
    }

    if (storedEvaluationResult) {
      setEvaluationResult(JSON.parse(storedEvaluationResult))
    }

    // Initialize messages array
    const initialMessages: Message[] = []

    // Add welcome message
    initialMessages.push({
      id: "welcome",
      text: `Hello! I'm your RevWise assistant. How can I help you with the ${productData?.name || params.productId}?`,
      sender: "assistant",
      timestamp: new Date(),
    })

    // Add evaluation message if available
    if (storedEvaluationResult) {
      const evaluation = JSON.parse(storedEvaluationResult) as EvaluationResult

      let evaluationText = ""
      switch (evaluation.decision) {
        case -1:
          evaluationText = "It's a bad decission. You should not buy it. If you buy it, your emergency fund will be affected."
          break
        case 0:
          evaluationText = "It's not the best decicion you could make. Your monthly balance would be nagative after this purchase. You should not buy it but your emergency fund wonuldn't be affected."
          break
        case 1:
          evaluationText = "It is a safe purchase. Your monthly balance won't be agressively affected after this purchase."
          break
      }

      initialMessages.push({
        id: "evaluation",
        text: evaluationText,
        sender: "assistant",
        timestamp: new Date(Date.now() + 100), // Slightly after welcome message
      })
    }

    setMessages(initialMessages)
  }, [params.productId, productData?.name])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setValue("")

    try {
      // In a real implementation, you would call your API here
      // For now, we'll simulate a response

      // Simulate API processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAssistantResponse(inputValue, productData?.name || params.productId),
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting response:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const getAssistantResponse = (userInput: string, productName: string): string => {
    const userInputLower = userInput.toLowerCase()

    if (userInputLower.includes("price") || userInputLower.includes("cost")) {
      return `The current market price for the ${productName} ranges from 399€ to 499€ depending on the retailer and any ongoing promotions.`
    } else if (userInputLower.includes("review") || userInputLower.includes("rating")) {
      return `The ${productName} has an average rating of 4.7/5 stars based on 128 reviews. Users particularly praise its versatility and responsiveness.`
    } else if (userInputLower.includes("feature") || userInputLower.includes("spec")) {
      return `The ${productName} features a twin shape design, medium flex pattern, and Salomon's Quad Camber profile for excellent pop and edge control. It's ideal for freestyle riding and park performance.`
    } else if (userInputLower.includes("where") || userInputLower.includes("buy")) {
      return `You can purchase the ${productName} at several retailers including specialized stores and official websites. I can help you track the best price if you set a price alert.`
    } else if (userInputLower.includes("decision") || userInputLower.includes("should i buy")) {
      if (evaluationResult) {
        switch (evaluationResult.decision) {
          case -1:
            return `I don't recommend buying at ${evaluationResult.price}€. This price is above the market value for this product.`
          case 0:
            return `At ${evaluationResult.price}€, this is close to the average market price. You might want to wait for a better deal.`
          case 1:
            return `At ${evaluationResult.price}€, this is a good deal! I recommend making the purchase.`
        }
      }
      return `Based on your target price, I can help evaluate if it's a good time to buy. What price are you considering?`
    } else {
      return `Thanks for your question about the ${productName}. How else can I help you with information about this product?`
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b">
        <Link href="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <Image src="/logo.png" alt="RevWise" width={120} height={36} />
      </header>

      {/* Product Info */}
      <div className="bg-white p-4 flex justify-between items-center border-b">
        <div>
          <h2 className="font-bold text-lg">{productData?.name || params.productId}</h2>
          <p className="text-gray-700 text-sm">{productData?.description || ""}</p>
        </div>
        <div className="w-12 h-12 relative">
          {capturedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Captured product"
              className="w-12 h-12 object-contain"
            />
          ) : (
            <Image src="/snowboard.png" alt="Default product image" width={48} height={48} className="object-contain" />
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-purple-700 text-white rounded-tr-none"
                  : "bg-white border rounded-tl-none"
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4">
        <div className="flex items-center bg-white rounded-full border overflow-hidden">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
            placeholder="Write your message"
            className="flex-1 py-3 px-4 outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-purple-800 text-white p-3 rounded-full mr-1"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
