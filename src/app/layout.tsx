import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

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
		<html lang="tr" suppressHydrationWarning>
			<body className="min-h-screen antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
