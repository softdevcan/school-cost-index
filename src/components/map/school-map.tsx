'use client'

import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'

const TURKEY_CENTER = [39.0, 35.0] as [number, number]

export interface SchoolMapItem {
	id: string
	name: string
	city: string
	district: string
	latitude: number | null
	longitude: number | null
	avg_total: number
	cost_count: number
}

interface SchoolMapProps {
	schools: SchoolMapItem[]
	className?: string
}

export function SchoolMap({ schools, className = '' }: SchoolMapProps) {
	const mapRef = useRef<LeafletMap | null>(null)
	const markersRef = useRef<L.Marker[]>([])
	const containerRef = useRef<HTMLDivElement>(null)
	const [mapReady, setMapReady] = useState(false)

	const withCoords = schools.filter(
		(s): s is SchoolMapItem & { latitude: number; longitude: number } =>
			s.latitude != null && s.longitude != null
	)

	useEffect(() => {
		if (typeof window === 'undefined' || !containerRef.current) return

		import('leaflet').then((L) => {
			if (!containerRef.current) return
			// Fix default marker icon in Next.js
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
			const map = L.map(containerRef.current!).setView(TURKEY_CENTER, 6)
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(map)

			mapRef.current = map
			setMapReady(true)
		})

		return () => {
			markersRef.current.forEach((m) => m.remove())
			markersRef.current = []
			mapRef.current?.remove()
			mapRef.current = null
			setMapReady(false)
		}
	}, [])

	useEffect(() => {
		if (!mapRef.current || !mapReady) return

		const schoolsWithCoords = schools.filter(
			(s): s is SchoolMapItem & { latitude: number; longitude: number } =>
				s.latitude != null && s.longitude != null
		)

		markersRef.current.forEach((m) => m.remove())
		markersRef.current = []

		if (schoolsWithCoords.length === 0) return

		import('leaflet').then((L) => {
			if (!mapRef.current) return

			const bounds = L.latLngBounds(
				schoolsWithCoords.map((s) => [s.latitude, s.longitude] as [number, number])
			)

			const escapeHtml = (s: string) =>
				s
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')

			schoolsWithCoords.forEach((school) => {
				const detailUrl = `/school/${school.id}`
				const popup = L.popup().setContent(
					`<div class="p-2 min-w-[180px]">
						<strong class="block text-sm">${escapeHtml(school.name)}</strong>
						<p class="text-xs text-gray-500 mt-1">${escapeHtml(school.district)}, ${escapeHtml(school.city)}</p>
						<p class="text-sm font-semibold mt-2">${school.avg_total.toLocaleString('tr-TR')} TL</p>
						<p class="text-xs text-gray-400">${school.cost_count} veri</p>
						<a href="${detailUrl}" class="mt-2 block text-xs text-blue-600 hover:underline font-medium">Detay →</a>
					</div>`
				)
				const marker = L.marker([school.latitude, school.longitude], {
					title: school.name,
				})
					.bindPopup(popup)
					.addTo(mapRef.current!)
				markersRef.current.push(marker)
			})

			mapRef.current!.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
		})
	}, [schools, mapReady])

	if (withCoords.length === 0 && schools.length > 0) {
		return (
			<div
				className={`flex flex-col items-center justify-center gap-2 rounded border border-muted bg-muted/30 p-8 ${className}`}
				style={{ minHeight: 384 }}
			>
				<p className="text-sm text-muted-foreground text-center">
					Bu okulların konum bilgisi bulunmuyor. Haritada gösterilemez.
				</p>
				<p className="text-xs text-muted-foreground text-center">
					Veri paylaşırken haritadan konum seçerek ekleyebilirsiniz.
				</p>
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			className={`h-96 w-full rounded border bg-muted ${className}`}
			style={{ minHeight: 384 }}
		/>
	)
}
