import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'pine - Modern Game Platform',
  description: 'A modern, developer-friendly game platform built with React, TypeScript, and shadcn/ui. No ads, no tracking.',
  keywords: ['games', 'platform', 'react', 'typescript', 'shadcn', 'api'],
  authors: [{ name: 'Rohan' }],
  openGraph: {
    title: 'pine - Modern Game Platform',
    description: 'A modern, developer-friendly game platform built with React, TypeScript, and shadcn/ui.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
