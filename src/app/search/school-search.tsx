'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { filterOutliers } from '@/lib/utils/statistics'

const SchoolMap = dynamic(
	() => import('@/components/map/school-map').then((m) => ({ default: m.SchoolMap })),
	{ ssr: false }
)

interface SchoolWithCosts {
	id: string
	name: string
	city: string
	district: string
	address: string | null
	latitude: number | null
	longitude: number | null
	type: string
	avg_tuition: number
	avg_total: number
	cost_count: number
}

const TYPE_LABELS: Record<string, string> = {
	kindergarten: 'Anaokulu',
	primary: 'İlkokul',
	middle: 'Ortaokul',
	high: 'Lise',
}

type ViewMode = 'list' | 'map'

export function SchoolSearch({ cities }: { cities: string[] }) {
	const [city, setCity] = useState('')
	const [district, setDistrict] = useState('')
	const [schoolName, setSchoolName] = useState('')
	const [districtOptions, setDistrictOptions] = useState<string[]>([])
	const [results, setResults] = useState<SchoolWithCosts[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [viewMode, setViewMode] = useState<ViewMode>('list')

	const supabase = createClient()

	useEffect(() => {
		if (!city) {
			setDistrictOptions([])
			setDistrict('')
			return
		}
		async function fetchDistricts() {
			const { data } = await supabase
				.from('schools')
				.select('district')
				.eq('city', city)
				.order('district')
			const unique = [...new Set((data ?? []).map((x) => x.district))]
			setDistrictOptions(unique)
			setDistrict('')
		}
		fetchDistricts()
	}, [city, supabase])

	async function handleSearch(e: React.FormEvent) {
		e.preventDefault()
		setIsLoading(true)

		const costQuery = supabase
			.from('costs')
			.select(
				`
				tuition_fee,
				food_fee,
				book_fee,
				uniform_fee,
				schools!inner(id, name, city, district, address, latitude, longitude, type)
			`
			)
			.eq('is_verified', true)

		const { data: costData } = await costQuery

		type SchoolInfo = {
			id: string
			name: string
			city: string
			district: string
			address: string | null
			latitude: number | null
			longitude: number | null
			type: string
		}
		type CostRow = {
			tuition_fee: number
			food_fee: number | null
			book_fee: number | null
			uniform_fee: number | null
			schools: SchoolInfo | SchoolInfo[] | null
		}

		const getSchool = (c: CostRow): SchoolInfo | null => {
			const s = c.schools
			if (!s) return null
			return Array.isArray(s) ? s[0] ?? null : s
		}

		let filtered: CostRow[] = (costData ?? []) as unknown as CostRow[]
		if (city) {
			filtered = filtered.filter((c) => getSchool(c)?.city === city)
		}
		if (district) {
			filtered = filtered.filter((c) => getSchool(c)?.district === district)
		}
		if (schoolName) {
			const lower = schoolName.toLowerCase()
			filtered = filtered.filter((c) =>
				getSchool(c)?.name.toLowerCase().includes(lower)
			)
		}

		// Aggregate by school
		const schoolsMap = new Map<
			string,
			{
				school: {
					id: string
					name: string
					city: string
					district: string
					address: string | null
					latitude: number | null
					longitude: number | null
					type: string
				}
				totals: number[]
				tuitions: number[]
			}
		>()

		for (const row of filtered) {
			const school = getSchool(row)
			if (!school) continue
			const total =
				row.tuition_fee +
				(row.food_fee ?? 0) +
				(row.book_fee ?? 0) +
				(row.uniform_fee ?? 0)
			const existing = schoolsMap.get(school.id)
			if (existing) {
				existing.totals.push(total)
				existing.tuitions.push(row.tuition_fee)
			} else {
				schoolsMap.set(school.id, {
					school,
					totals: [total],
					tuitions: [row.tuition_fee],
				})
			}
		}

		const aggregated: SchoolWithCosts[] = []
		for (const { school, totals, tuitions } of schoolsMap.values()) {
			if (totals.length === 0) continue
			const filteredTotals = filterOutliers(totals)
			const filteredTuitions = filterOutliers(tuitions)
			const avgTotal =
				filteredTotals.length > 0
					? filteredTotals.reduce((a, b) => a + b, 0) / filteredTotals.length
					: totals.reduce((a, b) => a + b, 0) / totals.length
			const avgTuition =
				filteredTuitions.length > 0
					? filteredTuitions.reduce((a, b) => a + b, 0) / filteredTuitions.length
					: tuitions.reduce((a, b) => a + b, 0) / tuitions.length
			aggregated.push({
				id: school.id,
				name: school.name,
				city: school.city,
				district: school.district,
				address: school.address ?? null,
				latitude: school.latitude ?? null,
				longitude: school.longitude ?? null,
				type: school.type,
				avg_tuition: Math.round(avgTuition),
				avg_total: Math.round(avgTotal),
				cost_count: filteredTotals.length || totals.length,
			})
		}

		aggregated.sort((a, b) => b.avg_total - a.avg_total)
		setResults(aggregated)
		setIsLoading(false)
	}

	return (
		<form onSubmit={handleSearch} className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-3">
				<div>
					<label htmlFor="city" className="block text-sm font-medium">
						İl
					</label>
					<select
						id="city"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						className="mt-1 w-full rounded border px-3 py-2"
					>
						<option value="">Tümü</option>
						{cities.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="district" className="block text-sm font-medium">
						İlçe
					</label>
					<select
						id="district"
						value={district}
						onChange={(e) => setDistrict(e.target.value)}
						className="mt-1 w-full rounded border px-3 py-2"
					>
						<option value="">Tümü</option>
						{districtOptions.map((d) => (
							<option key={d} value={d}>
								{d}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="school_name" className="block text-sm font-medium">
						Okul Adı
					</label>
					<input
						id="school_name"
						type="text"
						value={schoolName}
						onChange={(e) => setSchoolName(e.target.value)}
						placeholder="Ara..."
						className="mt-1 w-full rounded border px-3 py-2"
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
			>
				{isLoading ? 'Aranıyor...' : 'Ara'}
			</button>

			{results.length > 0 && (
				<div className="space-y-4">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<h2 className="text-lg font-semibold">Sonuçlar ({results.length})</h2>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setViewMode('list')}
								className={`rounded px-3 py-1 text-sm font-medium ${
									viewMode === 'list'
										? 'bg-blue-600 text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
								}`}
							>
								Liste
							</button>
							<button
								type="button"
								onClick={() => setViewMode('map')}
								className={`rounded px-3 py-1 text-sm font-medium ${
									viewMode === 'map'
										? 'bg-blue-600 text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
								}`}
							>
								Harita
							</button>
						</div>
					</div>
					{viewMode === 'map' && (
						<SchoolMap
							schools={results}
							className="mt-2"
						/>
					)}
					{viewMode === 'list' && (
					<div className="space-y-3">
						{results.map((s) => (
							<div
								key={s.id}
								className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
							>
								<div className="flex flex-wrap items-center justify-between gap-2">
									<div>
										<h3 className="font-medium">{s.name}</h3>
										<p className="text-sm text-gray-500">
											{s.district}, {s.city} · {TYPE_LABELS[s.type] ?? s.type}
										</p>
										{s.address && (
											<p className="mt-1 text-xs text-gray-400">{s.address}</p>
										)}
									</div>
									<div className="text-right">
										<p className="text-lg font-semibold">
											{s.avg_total.toLocaleString('tr-TR')} TL
										</p>
										<p className="text-xs text-gray-500">
											Ort. toplam ({s.cost_count} veri)
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
					)}
				</div>
			)}
		</form>
	)
}
