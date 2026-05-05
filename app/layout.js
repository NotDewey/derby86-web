import './globals.css'

export const metadata = {
  title: 'Derby 86 · Playeras de Fútbol Retro',
  description: 'Somos aficionados del fútbol. Playeras retro, vintage y de selecciones. Monterrey · Envíos a todo México.',
  openGraph: {
    title: 'Derby 86',
    description: 'Playeras de fútbol retro y vintage. Envíos a todo México.',
    siteName: 'Derby 86',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}