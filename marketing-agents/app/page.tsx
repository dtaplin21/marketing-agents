"use client"

import React, { useEffect, useState } from 'react'
import { CommandPalette } from '../components/command/CommandPalette'

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AI Agents Dashboard</h1>
              <nav className="ml-10 space-x-4">
                <a href="#" className="text-gray-900 font-medium">Overview</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Analytics</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Settings</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommandPalette />
      </main>
    </div>
  )
}
