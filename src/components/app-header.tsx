'use client'

import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
	showBack?: boolean
	backHref?: string
	backLabel?: string
}

export function AppHeader({
	showBack = false,
	backHref = ROUTES.HOME,
	backLabel = 'Ana sayfa',
}: AppHeaderProps) {
	return (
		<header className="mb-6 flex items-center justify-between gap-4">
			{showBack ? (
				<Link href={backHref}>
					<Button variant="ghost" size="sm" className="gap-1 -ml-2">
						← {backLabel}
					</Button>
				</Link>
			) : (
				<div />
			)}
			<ThemeToggle />
		</header>
	)
}
