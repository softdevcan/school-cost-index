import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'Okul Maliyet Endeksi | Özel Okul Fiyatları',
	description:
		'Okulunuzun sadece etiket fiyatını değil, son faturada ödeyeceğiniz gerçek tutarı görün.',
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="tr">
			<body className="min-h-screen antialiased">{children}</body>
		</html>
	)
}
