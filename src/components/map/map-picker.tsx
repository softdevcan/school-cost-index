'use client'

import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'

const TURKEY_CENTER = [39.0, 35.0] as [number, number]

interface MapPickerProps {
	latitude: number | null
	longitude: number | null
	onChange: (lat: number, lng: number) => void
	className?: string
}

export function MapPicker({
	latitude,
	longitude,
	onChange,
	className = '',
}: MapPickerProps) {
	const mapRef = useRef<LeafletMap | null>(null)
	const markerRef = useRef<LeafletMarker | null>(null)
	const leafletRef = useRef<typeof import('leaflet') | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined' || !containerRef.current) return

		import('leaflet').then((L) => {
			// Fix default marker icon in Next.js
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			delete (L.Icon.Default.prototype as any)._getIconUrl
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
			})
			leafletRef.current = L
			const map = L.map(containerRef.current!).setView(
				latitude && longitude ? [latitude, longitude] : TURKEY_CENTER,
				6
			)
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(map)

			if (latitude && longitude) {
				const marker = L.marker([latitude, longitude]).addTo(map)
				markerRef.current = marker
			}

			map.on('click', (e: L.LeafletMouseEvent) => {
				const { lat, lng } = e.latlng
				markerRef.current?.remove()
				const marker = L.marker([lat, lng]).addTo(map)
				markerRef.current = marker
				onChange(lat, lng)
			})

			mapRef.current = map
			setIsLoaded(true)
		})

		return () => {
			mapRef.current?.remove()
			mapRef.current = null
			markerRef.current = null
			leafletRef.current = null
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- init once on mount
	}, [])

	useEffect(() => {
		if (!isLoaded || !mapRef.current || !leafletRef.current) return
		const L = leafletRef.current
		if (latitude && longitude) {
			markerRef.current?.remove()
			const marker = L.marker([latitude, longitude]).addTo(mapRef.current)
			markerRef.current = marker
			mapRef.current.setView([latitude, longitude], 14)
		}
	}, [latitude, longitude, isLoaded])

	return (
		<div
			ref={containerRef}
			className={`h-64 w-full rounded border bg-gray-100 ${className}`}
			style={{ minHeight: 256 }}
		/>
	)
}
