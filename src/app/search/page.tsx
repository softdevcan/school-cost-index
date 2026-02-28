import { createClient } from '@/lib/supabase/server'
import { AppHeader } from '@/components/app-header'
import { ROUTES } from '@/lib/constants/routes'
import { SchoolSearch } from './school-search'

export const metadata = {
	title: 'Okul Ara | Okul Maliyet Endeksi',
	description: 'İl, ilçe ve okul adına göre özel okul maliyetlerini karşılaştırın.',
}

export const dynamic = 'force-dynamic'

export default async function SearchPage() {
	let cities: string[] = []
	try {
		const supabase = await createClient()
		const { data: cityRows, error } = await supabase
			.from('schools')
			.select('city')
			.order('city')

		if (error) {
			console.error('Supabase schools query error:', error)
		} else {
			cities = [...new Set((cityRows ?? []).map((x) => x.city))]
		}
	} catch (err) {
		console.error('Search page data fetch error:', err)
	}

	return (
		<main className="min-h-screen p-4 md:p-8">
			<AppHeader showBack backHref={ROUTES.HOME} backLabel="Ana sayfa" />

			<h1 className="mb-2 text-2xl font-bold tracking-tight">Okul Ara</h1>
			<p className="mb-8 text-muted-foreground">
				İl, ilçe veya okul adına göre maliyet verilerini görüntüleyin.
			</p>

			<SchoolSearch cities={cities} />
		</main>
	)
}
