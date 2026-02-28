import { ROUTES } from '@/lib/constants/routes'
import { AppHeader } from '@/components/app-header'
import { UpdateCostForm } from './update-cost-form'

export const metadata = {
	title: 'Veri Güncelle | Okul Maliyet Endeksi',
	description: 'Referans kodunuz ile paylaştığınız maliyet verisini güncelleyin.',
}

export default function UpdatePage() {
	return (
		<main className="min-h-screen p-4 md:p-8">
			<AppHeader showBack backHref={ROUTES.HOME} backLabel="Ana sayfa" />

			<h1 className="mb-2 text-2xl font-bold tracking-tight">Veri Güncelle</h1>
			<p className="mb-8 text-muted-foreground">
				Veri paylaşımı sonrası aldığınız referans kodu ile kaydınızı güncelleyebilirsiniz.
			</p>

			<UpdateCostForm />
		</main>
	)
}
