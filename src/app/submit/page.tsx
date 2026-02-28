import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { CostEntryForm } from './cost-entry-form'

export const metadata = {
	title: 'Veri Paylaş | Okul Maliyet Endeksi',
	description: 'Okul maliyet verinizi anonim olarak paylaşın.',
}

export default function SubmitCostPage() {
	return (
		<main className="min-h-screen p-4 md:p-8">
			<Link
				href={ROUTES.HOME}
				className="mb-6 inline-block text-sm text-blue-600 hover:underline"
			>
				← Ana sayfa
			</Link>

			<h1 className="mb-2 text-2xl font-bold">Veri Paylaş</h1>
			<p className="mb-8 text-gray-600 dark:text-gray-400">
				Tüm veriler anonimdir. Kişisel bilgi toplanmaz.
			</p>

			<CostEntryForm />
		</main>
	)
}
