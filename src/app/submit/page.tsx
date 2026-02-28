import { ROUTES } from '@/lib/constants/routes'
import { PageContainer } from '@/components/page-container'
import { BackLink } from '@/components/back-link'
import { CostEntryForm } from './cost-entry-form'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
	title: 'Veri Paylaş | Okul Maliyet Endeksi',
	description: 'Okul maliyet verinizi paylaşın. Kimlik bilgisi toplanmaz.',
}

export default function SubmitCostPage() {
	return (
		<PageContainer>
			<BackLink href={ROUTES.HOME} label="Ana sayfa" className="mb-6 block" />

			<h1 className="mb-2 text-2xl font-bold tracking-tight">Veri Paylaş</h1>
			<p className="mb-6 text-muted-foreground">
				Kimlik bilgisi toplanmaz. Sadece okul ve maliyet bilgisi paylaşılır.
			</p>

			<Card className="mb-8 border-muted bg-muted/30">
				<CardContent className="pt-6">
					<p className="text-sm font-medium">Toplanan veriler</p>
					<ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
						<li>Okul adı, il, ilçe (maliyetin hangi okula ait olduğunu göstermek için)</li>
						<li>Eğitim yılı, sınıf, ücret kalemleri (karşılaştırma için)</li>
						<li>Referans kodu (verinizi güncellemeniz için)</li>
					</ul>
					<p className="mt-3 text-sm text-muted-foreground">
						İsim, e-posta, telefon veya benzeri kişisel bilgi talep edilmez.
					</p>
				</CardContent>
			</Card>

			<CostEntryForm />
		</PageContainer>
	)
}
