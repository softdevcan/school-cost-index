import { cn } from '@/lib/utils'

interface PageContainerProps {
	children: React.ReactNode
	className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
	return (
		<div className={cn('container flex-1 px-4 py-8 md:px-6 md:py-10', className)}>
			{children}
		</div>
	)
}
