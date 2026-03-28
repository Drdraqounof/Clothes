import { Cormorant_Garamond, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../components/cart-context'

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700']
})

const bodyFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700']
})

export const metadata = {
  title: 'Clothes Atelier',
  description: 'A Next.js fashion showroom for curated men and women collections.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}