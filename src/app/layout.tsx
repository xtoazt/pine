import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { FloatingSettings } from '@/components/ui/floating-settings'
import { SettingsProvider } from '@/contexts/settings-context'
import { MusicProvider, useMusic } from '@/contexts/MusicContext'
import { MusicPlayer } from '@/components/music/MusicPlayer'
import { MusicToggle } from '@/components/music/MusicToggle'

function MusicPlayerWrapper() {
  const { isMusicVisible, toggleMusic } = useMusic()
  
  return (
    <>
      <MusicToggle onToggle={toggleMusic} isVisible={isMusicVisible} />
      <MusicPlayer isVisible={isMusicVisible} onToggle={toggleMusic} />
    </>
  )
}

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'pine - Minimalist Game Platform',
  description: 'A clean, minimalist game platform with 1,000+ carefully curated games. No ads, no tracking, just pure gaming.',
  keywords: ['pine', 'games', 'platform', 'minimalist', 'clean', 'no-ads', 'gaming', '1000 games'],
  authors: [{ name: 'pine' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'pine - Minimalist Game Platform',
    description: 'A clean, minimalist game platform with 1,000+ carefully curated games. No ads, no tracking.',
    type: 'website',
    images: ['/favicon.svg'],
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
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/favicon.svg" />
            <meta name="theme-color" content="#000000" />
            <script src="https://cdn.jsdelivr.net/gh/Parcoil/cloak@main/src/index.min.js"></script>
            <script src="https://www.youtube.com/iframe_api"></script>
          </head>
      <body className={`${inter.variable} font-sans antialiased`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SettingsProvider>
                <MusicProvider>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      {children}
                    </main>
                    <Footer />
                    <FloatingSettings />
                    <MusicPlayerWrapper />
                  </div>
                </MusicProvider>
              </SettingsProvider>
            </ThemeProvider>
      </body>
    </html>
  )
}
