import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { SettingsProvider } from '@/contexts/settings-context'
import { AuthProvider } from '@/contexts/auth-context'
import { TabCloak } from '@/components/tab-cloak'
import ErrorBoundary from '@/components/error-boundary'
import { StackProvider } from "@stackframe/stack"
import { stackClientApp, isStackConfigured } from '@/lib/stack'


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'pine - Minimalist Game Platform',
  description: 'A clean, minimalist game platform with carefully curated games. No ads, no tracking, just pure gaming.',
  keywords: ['pine', 'games', 'platform', 'minimalist', 'clean', 'no-ads', 'gaming'],
  authors: [{ name: 'pine' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'pine - Minimalist Game Platform',
    description: 'A clean, minimalist game platform with carefully curated games. No ads, no tracking.',
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
            <ErrorBoundary>
              {isStackConfigured ? (
                <StackProvider app={stackClientApp}>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <AuthProvider>
                      <SettingsProvider>
                        <TabCloak />
                        <div className="relative min-h-screen flex flex-col">
                          <div className="absolute inset-0 -z-10 hero-gradient opacity-40" />
                          <Header />
                          <main className="flex-1 px-4 py-6">
                            {children}
                          </main>
                          <Footer />
                        </div>
                      </SettingsProvider>
                    </AuthProvider>
                  </ThemeProvider>
                </StackProvider>
              ) : (
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <AuthProvider>
                    <SettingsProvider>
                      <TabCloak />
                      <div className="relative min-h-screen flex flex-col">
                        <div className="absolute inset-0 -z-10 hero-gradient opacity-40" />
                        <Header />
                        <main className="flex-1 px-4 py-6">
                          {children}
                        </main>
                        <Footer />
                      </div>
                    </SettingsProvider>
                  </AuthProvider>
                </ThemeProvider>
              )}
            </ErrorBoundary>
      </body>
    </html>
  )
}
