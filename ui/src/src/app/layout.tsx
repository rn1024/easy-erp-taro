import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../../styles/globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WeChat Style Task Management',
  description: 'A modern task management application with WeChat-style interface',
  keywords: ['task management', 'workflow', 'team collaboration', 'mobile-first'],
  authors: [{ name: 'Development Team' }],
  creator: 'WeChat Task Management Team',
  publisher: 'WeChat Task Management',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wechat-task-management.vercel.app'),
  openGraph: {
    title: 'WeChat Style Task Management',
    description: 'A modern task management application with WeChat-style interface',
    url: 'https://wechat-task-management.vercel.app',
    siteName: 'WeChat Task Management',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WeChat Style Task Management'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeChat Style Task Management',
    description: 'A modern task management application with WeChat-style interface',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  colorScheme: 'light dark',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Task Manager" />
        <meta name="application-name" content="Task Manager" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={cn(
        inter.className,
        "min-h-screen bg-background font-sans antialiased",
        "touch-manipulation", // 移动端触摸优化
        "select-none", // 防止文本选择
        "overflow-x-hidden" // 防止横向滚动
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}