import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
	return (
		<PageContainer>
			<header className="mb-10 text-center">
				<h1 className="text-3xl font-bold tracking-tight md:text-4xl">
					Okul Maliyet Endeksi
				</h1>
				<p className="mt-3 text-muted-foreground">
					Özel okul fiyatlarını karşılaştırın. Gerçek maliyeti görün.
				</p>
			</header>

			<nav className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
				<Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
					<Link href={ROUTES.SEARCH}>Okul Ara</Link>
				</Button>
				<Button asChild size="lg" className="flex-1 sm:flex-initial">
					<Link href={ROUTES.SUBMIT}>Veri Paylaş</Link>
				</Button>
				<Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
					<Link href={ROUTES.UPDATE}>Veri Güncelle</Link>
				</Button>
			</nav>

			<div className="mx-auto mt-12 max-w-2xl">
				<Card>
					<CardHeader>
						<CardTitle>Nasıl çalışır?</CardTitle>
						<CardDescription>
							Anonim olarak paylaşılan maliyet verileri ile özel okulların gerçek
							yıllık maliyetlerini karşılaştırın.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						<ul className="list-inside list-disc space-y-1">
							<li>İl, ilçe veya okul adına göre arama yapın</li>
							<li>Kendi maliyet verinizi anonim olarak paylaşın</li>
							<li>Referans kodunuz ile verinizi güncelleyebilirsiniz</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</PageContainer>
	)
}
