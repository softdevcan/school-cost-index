import { ROUTES } from '@/lib/constants/routes'
import { PageContainer } from '@/components/page-container'
import { BackLink } from '@/components/back-link'
import { UpdateCostForm } from './update-cost-form'

export const metadata = {
	title: 'Veri Güncelle | Okul Maliyet Endeksi',
	description: 'Referans kodunuz ile paylaştığınız maliyet verisini güncelleyin.',
}

export default function UpdatePage() {
	return (
		<PageContainer>
			<BackLink href={ROUTES.HOME} label="Ana sayfa" className="mb-6 block" />

			<h1 className="mb-2 text-2xl font-bold tracking-tight">Veri Güncelle</h1>
			<p className="mb-8 text-muted-foreground">
				Veri paylaşımı sonrası aldığınız referans kodu ile kaydınızı güncelleyebilirsiniz.
			</p>

			<UpdateCostForm />
		</PageContainer>
	)
}
