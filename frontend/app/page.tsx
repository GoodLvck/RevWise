import Image from "next/image"
import Link from "next/link"
import { Camera, MessageSquare, Mic } from "lucide-react"

export default function Home() {
  return (
    <main className="max-w-md mx-auto bg-white min-h-screen p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Image src="/logo.png" alt="RevWise" width={200} height={60} className="mx-auto" />
        <p className="mt-2 text-lg">
          <span className="font-medium">RevWise</span> is your <span className="font-medium">ally</span> when{" "}
          <span className="font-medium">choosing</span> your <span className="font-medium">treats</span>
        </p>
      </div>

      {/* Feature Buttons */}
      <div className="flex justify-between mb-10">
        <Link href="/scan" className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <Camera className="text-white w-8 h-8" />
          </div>
          <span className="text-sm text-gray-600 mt-2">Scan product</span>
        </Link>

        {/* Disabled Chat Button */}
        <div className="flex flex-col items-center opacity-50 cursor-not-allowed">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
            <MessageSquare className="text-white w-8 h-8" />
          </div>
          <span className="text-sm text-gray-600 mt-2">Chat</span>
        </div>

        {/* Disabled Voice Chat Button */}
        <div className="flex flex-col items-center opacity-50 cursor-not-allowed">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Mic className="text-white w-8 h-8" />
          </div>
          <span className="text-sm text-gray-600 mt-2">Voice chat</span>
        </div>
      </div>

      {/* Recent Chats */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Recent chats</h2>
        <Link href="/chat/jordan-sneakers" className="block">
          <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Jordan Sneakers</h3>
              <p className="text-gray-600">Price: 120€ | Date: 19/07/2025</p>
            </div>
            <div className="w-16 h-16 relative">
              <Image src="/jordan.png" alt="Jordan Sneakers" width={64} height={64} className="object-contain" />
            </div>
          </div>
        </Link>
      </div>

      {/* Your Objectives - Now clickable to view goal details */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your objectives</h2>

        <Link href="/goal/jordan-sneakers" className="block mb-4">
          <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Zapatillas Jordan</h3>
              <div className="flex items-center justify-between mt-1">
                <span>35€</span>
                <div className="w-24 h-2 bg-gray-300 rounded-full mx-2 overflow-hidden">
                  <div className="bg-purple-700 h-full w-1/3 rounded-full"></div>
                </div>
                <span>120€</span>
              </div>
            </div>
            <div className="w-16 h-16 relative ml-4">
              <Image src="/jordan.png" alt="Jordan Sneakers" width={64} height={64} className="object-contain" />
            </div>
          </div>
        </Link>

        <Link href="/goal/macbook-air-2024" className="block">
          <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">MacBook Air 2024</h3>
              <div className="flex items-center justify-between mt-1">
                <span>900€</span>
                <div className="w-24 h-2 bg-gray-300 rounded-full mx-2 overflow-hidden">
                  <div className="bg-purple-700 h-full w-4/5 rounded-full"></div>
                </div>
                <span>999€</span>
              </div>
            </div>
            <div className="w-16 h-16 relative ml-4">
              <Image src="/macbookair2024.png" alt="MacBook Air" width={64} height={64} className="object-contain" />
            </div>
          </div>
        </Link>
      </div>
    </main>
  )
}
