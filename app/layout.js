import './globals.css'

export const metadata = {
  title: 'Derby 86 · Playeras de Fútbol Retro',
  description: 'Somos aficionados del fútbol. Playeras retro, vintage y de selecciones. Monterrey · Envíos a todo México.',
  openGraph: {
    title: 'Derby 86',
    description: 'Playeras de fútbol retro y vintage. Envíos a todo México.',
    siteName: 'Derby 86',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
