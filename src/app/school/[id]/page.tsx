import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { PageContainer } from '@/components/page-container'
import { BackLink } from '@/components/back-link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SchoolDetailMapClient } from '@/components/map/school-detail-map-wrapper'
import { filterOutliers } from '@/lib/utils/statistics'

const TYPE_LABELS: Record<string, string> = {
	kindergarten: 'Anaokulu',
	primary: 'İlkokul',
	middle: 'Ortaokul',
	high: 'Lise',
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const supabase = await createClient()
	const { data: school } = await supabase
		.from('schools')
		.select('name')
		.eq('id', id)
		.single()

	return {
		title: school ? `${school.name} | Okul Maliyet Endeksi` : 'Okul Detayı | Okul Maliyet Endeksi',
		description: 'Okul maliyet detayları ve karşılaştırma.',
	}
}

export const dynamic = 'force-dynamic'

export default async function SchoolDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const supabase = await createClient()

	const { data: school, error: schoolError } = await supabase
		.from('schools')
		.select('id, name, city, district, address, latitude, longitude, type')
		.eq('id', id)
		.single()

	if (schoolError || !school) {
		notFound()
	}

	const { data: costs } = await supabase
		.from('costs')
		.select('tuition_fee, food_fee, book_fee, uniform_fee, academic_year, grade_level')
		.eq('school_id', id)
		.eq('is_verified', true)

	const costRows = costs ?? []
	const tuitions = costRows.map((c) => c.tuition_fee)
	const foodFees = costRows.map((c) => c.food_fee ?? 0).filter((v) => v > 0)
	const bookFees = costRows.map((c) => c.book_fee ?? 0).filter((v) => v > 0)
	const uniformFees = costRows.map((c) => c.uniform_fee ?? 0).filter((v) => v > 0)
	const totals = costRows.map(
		(c) =>
			c.tuition_fee +
			(c.food_fee ?? 0) +
			(c.book_fee ?? 0) +
			(c.uniform_fee ?? 0)
	)

	const filteredTuitions = filterOutliers(tuitions)
	const filteredTotals = filterOutliers(totals)
	const avgTuition =
		filteredTuitions.length > 0
			? Math.round(
					filteredTuitions.reduce((a, b) => a + b, 0) / filteredTuitions.length
				)
			: tuitions.length > 0
				? Math.round(tuitions.reduce((a, b) => a + b, 0) / tuitions.length)
				: 0
	const avgTotal =
		filteredTotals.length > 0
			? Math.round(
					filteredTotals.reduce((a, b) => a + b, 0) / filteredTotals.length
				)
			: totals.length > 0
				? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
				: 0

	const avgFood =
		foodFees.length > 0
			? Math.round(foodFees.reduce((a, b) => a + b, 0) / foodFees.length)
			: null
	const avgBook =
		bookFees.length > 0
			? Math.round(bookFees.reduce((a, b) => a + b, 0) / bookFees.length)
			: null
	const avgUniform =
		uniformFees.length > 0
			? Math.round(uniformFees.reduce((a, b) => a + b, 0) / uniformFees.length)
			: null

	const costCount = costRows.length
	const academicYears = [...new Set(costRows.map((c) => c.academic_year))].sort()

	return (
		<PageContainer>
			<BackLink href={ROUTES.SEARCH} label="Okul Ara" className="mb-6 block" />

			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">{school.name}</h1>
					<p className="mt-1 text-muted-foreground">
						{school.district}, {school.city} · {TYPE_LABELS[school.type] ?? school.type}
					</p>
					{school.address && (
						<p className="mt-2 text-sm text-muted-foreground">{school.address}</p>
					)}
				</div>

				{school.latitude != null && school.longitude != null && (
					<Card>
						<CardHeader>
							<CardTitle>Konum</CardTitle>
						</CardHeader>
						<CardContent>
							<SchoolDetailMapClient
								latitude={school.latitude}
								longitude={school.longitude}
								name={school.name}
							/>
						</CardContent>
					</Card>
				)}

				<Card>
					<CardHeader>
						<CardTitle>Maliyet Özeti</CardTitle>
						<p className="text-sm text-muted-foreground">
							{costCount} doğrulanmış veri ·{' '}
							{academicYears.length > 0 ? academicYears.join(', ') : '-'}
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="text-sm text-muted-foreground">Ortalama Toplam</p>
								<p className="text-2xl font-bold">
									{avgTotal.toLocaleString('tr-TR')} TL
								</p>
							</div>
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="text-sm text-muted-foreground">Ortalama Eğitim Ücreti</p>
								<p className="text-2xl font-bold">
									{avgTuition.toLocaleString('tr-TR')} TL
								</p>
							</div>
						</div>

						{(avgFood ?? avgBook ?? avgUniform) && (
							<div className="space-y-2">
								<p className="text-sm font-medium">Diğer Kalemler (Ortalama)</p>
								<ul className="space-y-1 text-sm text-muted-foreground">
									{avgFood != null && (
										<li>Yemek: {avgFood.toLocaleString('tr-TR')} TL</li>
									)}
									{avgBook != null && (
										<li>Kitap/Kırtasiye: {avgBook.toLocaleString('tr-TR')} TL</li>
									)}
									{avgUniform != null && (
										<li>Kıyafet: {avgUniform.toLocaleString('tr-TR')} TL</li>
									)}
								</ul>
							</div>
						)}
					</CardContent>
				</Card>

				<p className="text-center text-sm text-muted-foreground">
					<Link href={ROUTES.SUBMIT} className="underline hover:text-foreground">
						Kendi maliyet verinizi paylaşın
					</Link>
					{' · '}
					<Link href={ROUTES.SEARCH} className="underline hover:text-foreground">
						Başka okul ara
					</Link>
				</p>
			</div>
		</PageContainer>
	)
}
