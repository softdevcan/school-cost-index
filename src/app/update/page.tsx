import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { UpdateCostForm } from './update-cost-form'

export const metadata = {
	title: 'Veri Güncelle | Okul Maliyet Endeksi',
	description: 'Referans kodunuz ile paylaştığınız maliyet verisini güncelleyin.',
}

export default function UpdatePage() {
	return (
		<main className="min-h-screen p-4 md:p-8">
			<Link
				href={ROUTES.HOME}
				className="mb-6 inline-block text-sm text-blue-600 hover:underline"
			>
				← Ana sayfa
			</Link>

			<h1 className="mb-2 text-2xl font-bold">Veri Güncelle</h1>
			<p className="mb-8 text-gray-600 dark:text-gray-400">
				Veri paylaşımı sonrası aldığınız referans kodu ile kaydınızı güncelleyebilirsiniz.
			</p>

			<UpdateCostForm />
		</main>
	)
}
