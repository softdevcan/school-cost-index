'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { fetchCostByReference, updateCostByReference } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const MapPicker = dynamic(
	() => import('@/components/map/map-picker').then((m) => ({ default: m.MapPicker })),
	{ ssr: false }
)

export function UpdateCostForm() {
	const [step, setStep] = useState<'code' | 'form' | 'success'>('code')
	const [referenceCode, setReferenceCode] = useState('')
	const [costData, setCostData] = useState<Awaited<
		ReturnType<typeof fetchCostByReference>
	> | null>(null)
	const [errors, setErrors] = useState<Record<string, string[]>>({})
	const [isLoading, setIsLoading] = useState(false)
	const [latitude, setLatitude] = useState<number | null>(null)
	const [longitude, setLongitude] = useState<number | null>(null)

	async function handleFetchCode(e: React.FormEvent) {
		e.preventDefault()
		if (!referenceCode.trim()) return
		setIsLoading(true)
		setErrors({})
		const result = await fetchCostByReference(referenceCode)
		if (result.success) {
			setCostData(result)
			setLatitude(result.data.latitude)
			setLongitude(result.data.longitude)
			setStep('form')
		} else {
			setErrors({ _form: [result.error] })
		}
		setIsLoading(false)
	}

	async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (!costData?.success) return
		setIsLoading(true)
		setErrors({})

		const form = e.currentTarget
		const getNum = (name: string) => {
			const el = form.elements.namedItem(name) as HTMLInputElement
			return el?.value ? parseFloat(el.value) : null
		}
		const getStr = (name: string) => {
			const el = form.elements.namedItem(name) as HTMLInputElement
			return el?.value?.trim() || null
		}
		const result = await updateCostByReference(referenceCode, {
			tuition_fee: getNum('tuition_fee') ?? 0,
			food_fee: getNum('food_fee'),
			book_fee: getNum('book_fee'),
			uniform_fee: getNum('uniform_fee'),
			address: getStr('address'),
			latitude,
			longitude,
		})

		if (result.success) {
			setStep('success')
		} else {
			setErrors({ _form: [result.error!] })
		}
		setIsLoading(false)
	}

	if (step === 'code') {
		return (
			<form onSubmit={handleFetchCode} className="mx-auto max-w-md space-y-4">
				<div className="space-y-2">
					<Label htmlFor="reference_code">Referans Kodu</Label>
					<Input
						id="reference_code"
						type="text"
						value={referenceCode}
						onChange={(e) => setReferenceCode(e.target.value)}
						placeholder="Veri paylaşımı sonrası aldığınız kod"
						required
						className="font-mono"
					/>
					{errors._form && (
						<p className="text-sm text-destructive">{errors._form[0]}</p>
					)}
				</div>
				<Button type="submit" disabled={isLoading} className="w-full" size="lg">
					{isLoading ? 'Kontrol ediliyor...' : 'Devam Et'}
				</Button>
			</form>
		)
	}

	if (step === 'success') {
		return (
			<Card className="mx-auto max-w-md border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
				<CardContent className="pt-6">
					<h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
						Veriniz güncellendi
					</h2>
					<p className="mt-2 text-sm text-green-700 dark:text-green-300">
						Değişiklikler kaydedildi.
					</p>
				</CardContent>
			</Card>
		)
	}

	if (step === 'form' && costData?.success) {
		const d = costData.data
		return (
			<form onSubmit={handleUpdate} className="mx-auto max-w-md space-y-4">
				<Card>
					<CardContent className="pt-6">
						<p className="font-medium">{d.school_name}</p>
						<p className="text-sm text-muted-foreground">
							{d.district}, {d.city} · {d.academic_year} (Sınıf {d.grade_level})
						</p>
					</CardContent>
				</Card>

				<div className="space-y-2">
					<Label htmlFor="tuition_fee">Eğitim Ücreti (TL)</Label>
					<Input
						id="tuition_fee"
						name="tuition_fee"
						type="number"
						min={0}
						step={1000}
						required
						defaultValue={d.tuition_fee}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="food_fee">Yemek Ücreti (TL)</Label>
					<Input
						id="food_fee"
						name="food_fee"
						type="number"
						min={0}
						step={1000}
						defaultValue={d.food_fee ?? ''}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="book_fee">Kitap/Kırtasiye (TL)</Label>
					<Input
						id="book_fee"
						name="book_fee"
						type="number"
						min={0}
						step={1000}
						defaultValue={d.book_fee ?? ''}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="uniform_fee">Kıyafet Ücreti (TL)</Label>
					<Input
						id="uniform_fee"
						name="uniform_fee"
						type="number"
						min={0}
						step={1000}
						defaultValue={d.uniform_fee ?? ''}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="address">Adres / Konum</Label>
					<Input
						id="address"
						name="address"
						type="text"
						defaultValue={d.address ?? ''}
						placeholder="Mahalle, sokak, bina no"
					/>
				</div>

				<div className="space-y-2">
					<Label>Haritadan Konum Güncelle</Label>
					<MapPicker
						latitude={latitude}
						longitude={longitude}
						onChange={(lat, lng) => {
							setLatitude(lat)
							setLongitude(lng)
						}}
						className="mt-1"
					/>
				</div>

				{errors._form && (
					<p className="text-sm text-destructive">{errors._form[0]}</p>
				)}

				<div className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => setStep('code')}
					>
						Geri
					</Button>
					<Button
						type="submit"
						disabled={isLoading}
						className="flex-1"
						size="lg"
					>
						{isLoading ? 'Güncelleniyor...' : 'Güncelle'}
					</Button>
				</div>
			</form>
		)
	}

	return null
}
