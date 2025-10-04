import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'pine - Minimalist Game Platform',
  description: 'A clean, minimalist game platform with 100+ carefully curated games. No ads, no tracking, just pure gaming.',
  keywords: ['pine', 'games', 'platform', 'minimalist', 'clean', 'no-ads', 'gaming'],
  authors: [{ name: 'pine' }],
  openGraph: {
    title: 'pine - Minimalist Game Platform',
    description: 'A clean, minimalist game platform with 100+ carefully curated games. No ads, no tracking.',
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
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script src="https://cdn.jsdelivr.net/gh/Parcoil/cloak@main/src/index.min.js"></script>
      </head>
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
