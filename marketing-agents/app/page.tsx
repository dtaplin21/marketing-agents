"use client"

import React, { useState } from 'react'
import { CommandPalette } from '../components/command/CommandPalette'
import { PlatformConnectModal } from '../components/modals/PlatformConnectModal'
import { Button } from '../components/ui/button'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AI Agent Dashboard</h1>
              <nav className="ml-10 space-x-4">
                <a href="/order-aggregation" className="text-gray-900 font-medium">Order Aggregation</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Data Processing</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Market Analysis</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Trend Detection</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="platform-connect-button"
              >
                Connect Platforms
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommandPalette />
      </main>

      {isModalOpen && (
        <PlatformConnectModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
