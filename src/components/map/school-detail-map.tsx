'use client'

import { useEffect, useRef } from 'react'

export interface SchoolDetailMapProps {
	latitude: number
	longitude: number
	name: string
}

export function SchoolDetailMap({ latitude, longitude, name }: SchoolDetailMapProps) {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (typeof window === 'undefined' || !containerRef.current) return

		import('leaflet').then((L) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			delete (L.Icon.Default.prototype as any)._getIconUrl
			L.Icon.Default.mergeOptions({
				iconRetinaUrl:
					'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
				iconUrl:
					'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
				shadowUrl:
					'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
			})
			const map = L.map(containerRef.current!).setView([latitude, longitude], 15)
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(map)

			const escapeHtml = (s: string) =>
				s
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
			L.marker([latitude, longitude])
				.bindPopup(`<div class="p-2"><strong>${escapeHtml(name)}</strong></div>`)
				.addTo(map)

			return () => {
				map.remove()
			}
		})
	}, [latitude, longitude, name])

	return (
		<div
			ref={containerRef}
			className="h-64 w-full rounded-md border bg-muted"
			style={{ minHeight: 256 }}
		/>
	)
}
