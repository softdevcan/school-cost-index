import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

interface BackLinkProps {
	href?: string
	label?: string
	className?: string
}

export function BackLink({
	href = ROUTES.HOME,
	label = 'Ana sayfa',
	className,
}: BackLinkProps) {
	return (
		<Link
			href={href}
			className={cn(
				'inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground',
				className
			)}
		>
			<ChevronLeft className="size-4" />
			{label}
		</Link>
	)
}
