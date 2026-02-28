import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'

export default function SchoolNotFound() {
	return (
		<PageContainer>
			<div className="py-12 text-center">
				<h1 className="text-xl font-semibold">Okul bulunamadı</h1>
				<p className="mt-2 text-muted-foreground">
					Aradığınız okul mevcut değil veya kaldırılmış olabilir.
				</p>
				<Button asChild className="mt-6">
					<Link href={ROUTES.SEARCH}>Okul Ara</Link>
				</Button>
			</div>
		</PageContainer>
	)
}
