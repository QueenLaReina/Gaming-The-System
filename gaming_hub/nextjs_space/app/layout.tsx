import './globals.css'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'

export const dynamic = "force-dynamic"

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Gaming The System — Accessible Gaming Hub',
  description: 'Verified Motor Accessibility & Adaptive Setup Catalog for gamers with physical motor challenges.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'Gaming The System — Accessible Gaming Hub',
    description: 'Verified Motor Accessibility & Adaptive Setup Catalog for gamers with physical motor challenges.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gaming The System - Accessible Gaming Hub' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
