import Link from 'next/link'

export default function HomePage() {
	return (
		<main className="min-h-screen p-4 md:p-8">
			<header className="mb-8 text-center">
				<h1 className="text-2xl font-bold md:text-3xl">
					Okul Maliyet Endeksi
				</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Özel okul fiyatlarını karşılaştırın. Gerçek maliyeti görün.
				</p>
			</header>

			<nav className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
				<Link
					href="/arama"
					className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-center font-medium transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
				>
					Okul Ara
				</Link>
				<Link
					href="/veri-gir"
					className="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition hover:bg-blue-700"
				>
					Veri Paylaş
				</Link>
			</nav>
		</main>
	)
}
