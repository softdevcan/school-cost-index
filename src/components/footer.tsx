import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

const FOOTER_LINKS = [
	{ href: ROUTES.HOME, label: 'Ana Sayfa' },
	{ href: ROUTES.SEARCH, label: 'Okul Ara' },
	{ href: ROUTES.SUBMIT, label: 'Veri Paylaş' },
	{ href: ROUTES.UPDATE, label: 'Veri Güncelle' },
] as const

export function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="border-t bg-muted/30">
			<div className="container px-4 py-8 md:px-6">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="space-y-2">
						<p className="font-semibold">Okul Maliyet Endeksi</p>
						<p className="max-w-md text-sm text-muted-foreground">
							Özel okul fiyatlarını karşılaştırın. Kullanıcı paylaşımları ile gerçek
							maliyetleri görün. Kimlik bilgisi toplanmaz.
						</p>
					</div>

					<nav className="flex flex-wrap gap-4">
						{FOOTER_LINKS.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>

				<div className="mt-8 border-t pt-6">
					<p className="text-center text-xs text-muted-foreground">
						© {currentYear} Okul Maliyet Endeksi. Kimlik bilgisi toplanmaz.
					</p>
				</div>
			</div>
		</footer>
	)
}
