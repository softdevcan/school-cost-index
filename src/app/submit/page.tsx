import { ROUTES } from '@/lib/constants/routes'
import { PageContainer } from '@/components/page-container'
import { BackLink } from '@/components/back-link'
import { CostEntryForm } from './cost-entry-form'

export const metadata = {
	title: 'Veri Paylaş | Okul Maliyet Endeksi',
	description: 'Okul maliyet verinizi anonim olarak paylaşın.',
}

export default function SubmitCostPage() {
	return (
		<PageContainer>
			<BackLink href={ROUTES.HOME} label="Ana sayfa" className="mb-6 block" />

			<h1 className="mb-2 text-2xl font-bold tracking-tight">Veri Paylaş</h1>
			<p className="mb-8 text-muted-foreground">
				Tüm veriler anonimdir. Kişisel bilgi toplanmaz.
			</p>

			<CostEntryForm />
		</PageContainer>
	)
}
