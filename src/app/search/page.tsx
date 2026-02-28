import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { SchoolSearch } from './school-search'

export const metadata = {
	title: 'Okul Ara | Okul Maliyet Endeksi',
	description: 'İl, ilçe ve okul adına göre özel okul maliyetlerini karşılaştırın.',
}

export default async function SearchPage() {
	const supabase = await createClient()

	const { data: cityRows } = await supabase
		.from('schools')
		.select('city')
		.order('city')
	const cities = [...new Set((cityRows ?? []).map((x) => x.city))]

	return (
		<main className="min-h-screen p-4 md:p-8">
			<Link
				href={ROUTES.HOME}
				className="mb-6 inline-block text-sm text-blue-600 hover:underline"
			>
				← Ana sayfa
			</Link>

			<h1 className="mb-2 text-2xl font-bold">Okul Ara</h1>
			<p className="mb-8 text-gray-600 dark:text-gray-400">
				İl, ilçe veya okul adına göre maliyet verilerini görüntüleyin.
			</p>

			<SchoolSearch cities={cities} />
		</main>
	)
}
