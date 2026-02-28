'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { PageContainer } from '@/components/page-container'
import { ROUTES } from '@/lib/constants/routes'

export default function SearchError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error('Search page error:', error)
	}, [error])

	return (
		<PageContainer>
			<Link
				href={ROUTES.HOME}
				className="mb-6 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
			>
				← Ana sayfa
			</Link>

			<div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
				<h1 className="text-lg font-semibold text-red-800 dark:text-red-200">
					Bir hata oluştu
				</h1>
				<p className="mt-2 text-sm text-red-700 dark:text-red-300">
					Okul arama sayfası yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
				</p>
				<button
					type="button"
					onClick={reset}
					className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
				>
					Tekrar Dene
				</button>
			</div>
		</PageContainer>
	)
}
