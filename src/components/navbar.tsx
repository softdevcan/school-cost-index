'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
	{ href: ROUTES.SEARCH, label: 'Okul Ara' },
	{ href: ROUTES.SUBMIT, label: 'Veri Paylaş' },
	{ href: ROUTES.UPDATE, label: 'Veri Güncelle' },
] as const

function NavLinks({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
	return (
		<>
			{NAV_ITEMS.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					onClick={onLinkClick}
					className={cn(
						'rounded-md px-3 py-2 text-sm font-medium transition-colors',
						pathname === item.href
							? 'bg-accent text-accent-foreground'
							: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
					)}
				>
					{item.label}
				</Link>
			))}
		</>
	)
}

export function Navbar() {
	const pathname = usePathname()
	const [mobileOpen, setMobileOpen] = useState(false)

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center justify-between gap-4 px-4 md:px-6">
				<Link
					href={ROUTES.HOME}
					className="flex items-center gap-2 font-semibold tracking-tight shrink-0"
				>
					<span className="text-base md:text-lg">Okul Maliyet Endeksi</span>
				</Link>

				<nav className="hidden md:flex items-center gap-1">
					<NavLinks pathname={pathname} />
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<MenuIcon className="size-5" />
								<span className="sr-only">Menüyü aç</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-64">
							<SheetHeader>
								<SheetTitle>Menü</SheetTitle>
							</SheetHeader>
							<nav className="mt-6 flex flex-col gap-2">
								<NavLinks
									pathname={pathname}
									onLinkClick={() => setMobileOpen(false)}
								/>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}
