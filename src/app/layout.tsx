import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

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
			<body className="min-h-screen antialiased flex flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					<main className="flex-1">{children}</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	)
}
