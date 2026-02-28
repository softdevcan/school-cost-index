'use client'

import Link from 'next/link'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { submitCostEntryForm } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const MapPicker = dynamic(
	() => import('@/components/map/map-picker').then((m) => ({ default: m.MapPicker })),
	{ ssr: false }
)

const SCHOOL_TYPES = [
	{ value: 'kindergarten', label: 'Anaokulu' },
	{ value: 'primary', label: 'İlkokul' },
	{ value: 'middle', label: 'Ortaokul' },
	{ value: 'high', label: 'Lise' },
] as const

const CURRENT_YEAR = new Date().getFullYear()
const ACADEMIC_YEAR = `${CURRENT_YEAR}-${CURRENT_YEAR + 1}`

export function CostEntryForm() {
	const [referenceCode, setReferenceCode] = useState<string | null>(null)
	const [errors, setErrors] = useState<Record<string, string[]>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [latitude, setLatitude] = useState<number | null>(null)
	const [longitude, setLongitude] = useState<number | null>(null)

	async function handleSubmit(formData: FormData) {
		setIsSubmitting(true)
		setErrors({})

		const result = await submitCostEntryForm(formData)

		if (result.success && result.referenceCode) {
			setReferenceCode(result.referenceCode)
		} else if (result.error) {
			setErrors(result.error as Record<string, string[]>)
		}
		setIsSubmitting(false)
	}

	if (referenceCode) {
		return (
			<Card className="mx-auto max-w-md border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
				<CardContent className="pt-6">
					<h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
						Veriniz kaydedildi
					</h2>
					<p className="mt-2 text-sm text-green-700 dark:text-green-300">
						Referans kodunuzu saklayın. Verinizi güncellemek için{' '}
						<Link href="/update" className="font-medium underline">
							Veri Güncelle
						</Link>{' '}
						sayfasını kullanın.
					</p>
					<code className="mt-3 block rounded-md bg-green-100 px-3 py-2 font-mono text-sm dark:bg-green-900">
						{referenceCode}
					</code>
				</CardContent>
			</Card>
		)
	}

	return (
		<form action={handleSubmit} className="mx-auto max-w-md space-y-4">
			<div className="space-y-2">
				<Label htmlFor="school_name">Okul Adı</Label>
				<Input
					id="school_name"
					name="school_name"
					type="text"
					required
					placeholder="Örn: Özel İstanbul Koleji"
				/>
				{errors.school_name && (
					<p className="text-sm text-destructive">{errors.school_name[0]}</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="city">İl</Label>
					<Input id="city" name="city" type="text" required placeholder="İstanbul" />
					{errors.city && (
						<p className="text-sm text-destructive">{errors.city[0]}</p>
					)}
				</div>
				<div className="space-y-2">
					<Label htmlFor="district">İlçe</Label>
					<Input id="district" name="district" type="text" required placeholder="Kadıköy" />
					{errors.district && (
						<p className="text-sm text-destructive">{errors.district[0]}</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="address">Adres / Konum (Opsiyonel)</Label>
				<Input
					id="address"
					name="address"
					type="text"
					placeholder="Mahalle, sokak, bina no"
				/>
				{errors.address && (
					<p className="text-sm text-destructive">{errors.address[0]}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label>Haritadan Konum Seç (Opsiyonel)</Label>
				<p className="text-xs text-muted-foreground">
					Haritada okulun konumuna tıklayın
				</p>
				<MapPicker
					latitude={latitude}
					longitude={longitude}
					onChange={(lat, lng) => {
						setLatitude(lat)
						setLongitude(lng)
					}}
					className="mt-1"
				/>
				<input type="hidden" name="latitude" value={latitude ?? ''} />
				<input type="hidden" name="longitude" value={longitude ?? ''} />
			</div>

			<div className="space-y-2">
				<Label htmlFor="school_type">Okul Türü</Label>
				<select
					id="school_type"
					name="school_type"
					required
					className="border-input bg-background h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<option value="">Seçin</option>
					{SCHOOL_TYPES.map((t) => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</select>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="academic_year">Eğitim Yılı</Label>
					<Input
						id="academic_year"
						name="academic_year"
						type="text"
						required
						defaultValue={ACADEMIC_YEAR}
						placeholder="2026-2027"
					/>
					{errors.academic_year && (
						<p className="text-sm text-destructive">
							{errors.academic_year[0]}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<Label htmlFor="grade_level">Sınıf</Label>
					<Input
						id="grade_level"
						name="grade_level"
						type="number"
						min={0}
						max={12}
						required
						placeholder="1"
					/>
					{errors.grade_level && (
						<p className="text-sm text-destructive">
							{errors.grade_level[0]}
						</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="tuition_fee">Eğitim Ücreti (TL)</Label>
				<Input
					id="tuition_fee"
					name="tuition_fee"
					type="number"
					min={0}
					step={1000}
					required
					placeholder="250000"
				/>
				{errors.tuition_fee && (
					<p className="text-sm text-destructive">{errors.tuition_fee[0]}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="food_fee">Yemek Ücreti (TL) - Opsiyonel</Label>
				<Input
					id="food_fee"
					name="food_fee"
					type="number"
					min={0}
					step={1000}
					placeholder="60000"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="book_fee">Kitap/Kırtasiye (TL) - Opsiyonel</Label>
				<Input
					id="book_fee"
					name="book_fee"
					type="number"
					min={0}
					step={1000}
					placeholder="40000"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="uniform_fee">Kıyafet Ücreti (TL) - Opsiyonel</Label>
				<Input
					id="uniform_fee"
					name="uniform_fee"
					type="number"
					min={0}
					step={1000}
					placeholder="15000"
				/>
			</div>

			<Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
				{isSubmitting ? 'Gönderiliyor...' : 'Paylaş'}
			</Button>
		</form>
	)
}
