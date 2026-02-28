'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { fetchCostByReference, updateCostByReference } from './actions'

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
				<div>
					<label htmlFor="reference_code" className="block text-sm font-medium">
						Referans Kodu
					</label>
					<input
						id="reference_code"
						type="text"
						value={referenceCode}
						onChange={(e) => setReferenceCode(e.target.value)}
						placeholder="Veri paylaşımı sonrası aldığınız kod"
						required
						className="mt-1 w-full rounded border px-3 py-2 font-mono"
					/>
					{errors._form && (
						<p className="mt-1 text-sm text-red-600">{errors._form[0]}</p>
					)}
				</div>
				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
				>
					{isLoading ? 'Kontrol ediliyor...' : 'Devam Et'}
				</button>
			</form>
		)
	}

	if (step === 'success') {
		return (
			<div className="mx-auto max-w-md rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
				<h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
					Veriniz güncellendi
				</h2>
				<p className="mt-2 text-sm text-green-700 dark:text-green-300">
					Değişiklikler kaydedildi.
				</p>
			</div>
		)
	}

	if (step === 'form' && costData?.success) {
		const d = costData.data
		return (
			<form onSubmit={handleUpdate} className="mx-auto max-w-md space-y-4">
				<div className="rounded bg-gray-100 p-3 text-sm dark:bg-gray-800">
					<p className="font-medium">{d.school_name}</p>
					<p className="text-gray-500">
						{d.district}, {d.city} · {d.academic_year} (Sınıf {d.grade_level})
					</p>
				</div>

				<div>
					<label htmlFor="tuition_fee" className="block text-sm font-medium">
						Eğitim Ücreti (TL)
					</label>
					<input
						id="tuition_fee"
						name="tuition_fee"
						type="number"
						min={0}
						step={1000}
						required
						defaultValue={d.tuition_fee}
						className="mt-1 w-full rounded border px-3 py-2"
					/>
				</div>

				<div>
					<label htmlFor="food_fee" className="block text-sm font-medium">
						Yemek Ücreti (TL)
					</label>
					<input
						id="food_fee"
						name="food_fee"
						type="number"
						min={0}
						step={1000}
						defaultValue={d.food_fee ?? ''}
						className="mt-1 w-full rounded border px-3 py-2"
					/>
				</div>

				<div>
					<label htmlFor="book_fee" className="block text-sm font-medium">
						Kitap/Kırtasiye (TL)
					</label>
					<input
						id="book_fee"
						name="book_fee"
						type="number"
						min={0}
						step={1000}
						defaultValue={d.book_fee ?? ''}
						className="mt-1 w-full rounded border px-3 py-2"
					/>
				</div>

				<div>
					<label htmlFor="uniform_fee" className="block text-sm font-medium">
						Kıyafet Ücreti (TL)
					</label>
					<input
						id="uniform_fee"
						name="uniform_fee"
						type="number"
						min={0}
						step={1000}
						defaultValue={d.uniform_fee ?? ''}
						className="mt-1 w-full rounded border px-3 py-2"
					/>
				</div>

				<div>
					<label htmlFor="address" className="block text-sm font-medium">
						Adres / Konum
					</label>
					<input
						id="address"
						name="address"
						type="text"
						defaultValue={d.address ?? ''}
						className="mt-1 w-full rounded border px-3 py-2"
						placeholder="Mahalle, sokak, bina no"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Haritadan Konum Güncelle
					</label>
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
					<p className="text-sm text-red-600">{errors._form[0]}</p>
				)}

				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setStep('code')}
						className="rounded-lg border px-4 py-2 font-medium"
					>
						Geri
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
					>
						{isLoading ? 'Güncelleniyor...' : 'Güncelle'}
					</button>
				</div>
			</form>
		)
	}

	return null
}
