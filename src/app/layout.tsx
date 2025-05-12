import React from 'react'
import './globals.css'

export const metadata = {
  title: 'AI Command Palette',
  description: 'AI Command Interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 