"use client"

import React, { useEffect, useState } from 'react'
import { CommandPalette } from '../components/command/CommandPalette'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

interface DashboardState {
  isLoading: boolean;
  error: string | null;
}

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Simulate initial data loading
    const loadDashboard = async () => {
      try {
        // Here you would fetch initial data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load dashboard'
        }));
      }
    };

    loadDashboard();
  }, []);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{state.error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Enhanced Navigation Bar */}
      <nav className="bg-gray-800 border-b-2 border-blue-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                AI Command Center
              </h1>
              <div className="ml-10 flex space-x-8">
                <a href="#" className="text-blue-400 font-bold border-b-2 border-blue-500 pb-2 hover:text-blue-300 transition-colors">
                  Mission Control
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-400 hover:border-b-2 hover:border-blue-500 pb-2 transition-all">
                  Intelligence Hub
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-400 hover:border-b-2 hover:border-blue-500 pb-2 transition-all">
                  Command Log
                </a>
                <a href="#" className="text-gray-300 hover:text-blue-400 hover:border-b-2 hover:border-blue-500 pb-2 transition-all">
                  Neural Network
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg border-2 border-blue-400 shadow-lg hover:shadow-blue-500/50 transition-all">
                Launch Console
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg border-2 border-purple-400 shadow-lg hover:shadow-purple-500/50 transition-all">
                Initialize System
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-80 bg-gray-800 border-r-2 border-blue-500 min-h-screen p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">
                Neural Networks
              </h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg group border-2 border-blue-400 shadow-lg hover:shadow-blue-500/50 transition-all">
                  <span className="mr-3 text-xl">🧠</span>
                  Quantum Analysis Engine
                </a>
                <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:text-white bg-gray-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-700 rounded-lg group border-2 border-gray-600 hover:border-purple-400 transition-all">
                  <span className="mr-3 text-xl">🌐</span>
                  Social Intelligence Matrix
                </a>
                <a href="#" className="flex items-center px-4 py-3 text-gray-300 hover:text-white bg-gray-700 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 rounded-lg group border-2 border-gray-600 hover:border-green-400 transition-all">
                  <span className="mr-3 text-xl">⚡</span>
                  System Synapse Monitor
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4">
                Command Matrix
              </h3>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 rounded-lg border-2 border-purple-400 shadow-lg hover:shadow-purple-500/50 transition-all flex items-center">
                  <span className="mr-3 text-xl">📊</span>
                  Generate Neural Report
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg border-2 border-blue-400 shadow-lg hover:shadow-blue-500/50 transition-all flex items-center">
                  <span className="mr-3 text-xl">🔄</span>
                  Sync Neural Network
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4">
                Knowledge Base
              </h3>
              <div className="space-y-3">
                <a href="#" className="block px-4 py-3 text-gray-300 hover:text-white bg-gray-700 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 rounded-lg border-2 border-gray-600 hover:border-green-400 transition-all">
                  Neural Documentation
                </a>
                <a href="#" className="block px-4 py-3 text-gray-300 hover:text-white bg-gray-700 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 rounded-lg border-2 border-gray-600 hover:border-green-400 transition-all">
                  Synaptic Interface
                </a>
                <a href="#" className="block px-4 py-3 text-gray-300 hover:text-white bg-gray-700 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 rounded-lg border-2 border-gray-600 hover:border-green-400 transition-all">
                  Neural Support Hub
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 overflow-auto bg-gray-900">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Neural Command Interface
              </h2>
              <p className="mt-2 text-gray-400 text-lg">
                Access quantum-powered AI tools to enhance your cognitive workflow
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800 border-2 border-blue-500 shadow-lg hover:shadow-blue-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg border-2 border-blue-400">
                      🧠
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-blue-400">Quantum Analysis</h3>
                      <p className="text-gray-400">Neural Network Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-2 border-purple-500 shadow-lg hover:shadow-purple-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg border-2 border-purple-400">
                      🌐
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-purple-400">Social Matrix</h3>
                      <p className="text-gray-400">Neural Network Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-2 border-green-500 shadow-lg hover:shadow-green-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-lg border-2 border-green-400">
                      ⚡
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-green-400">System Synapse</h3>
                      <p className="text-gray-400">Neural Network Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Command Palette */}
            <CommandPalette />
          </div>
        </main>
      </div>
    </div>
  )
}
