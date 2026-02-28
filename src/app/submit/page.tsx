import { ROUTES } from '@/lib/constants/routes'
import { AppHeader } from '@/components/app-header'
import { CostEntryForm } from './cost-entry-form'

export const metadata = {
	title: 'Veri Paylaş | Okul Maliyet Endeksi',
	description: 'Okul maliyet verinizi anonim olarak paylaşın.',
}

export default function SubmitCostPage() {
	return (
		<main className="min-h-screen p-4 md:p-8">
			<AppHeader showBack backHref={ROUTES.HOME} backLabel="Ana sayfa" />

			<h1 className="mb-2 text-2xl font-bold tracking-tight">Veri Paylaş</h1>
			<p className="mb-8 text-muted-foreground">
				Tüm veriler anonimdir. Kişisel bilgi toplanmaz.
			</p>

			<CostEntryForm />
		</main>
	)
}
