'use client'

import { useState } from 'react'
import { submitCostEntryForm } from './actions'

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
			<div className="mx-auto max-w-md rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
				<h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
					Veriniz kaydedildi
				</h2>
				<p className="mt-2 text-sm text-green-700 dark:text-green-300">
					Referans kodunuzu saklayın. Verinizi güncellemek için bu kodu kullanacaksınız.
				</p>
				<code className="mt-3 block rounded bg-green-100 px-3 py-2 font-mono text-sm dark:bg-green-900">
					{referenceCode}
				</code>
			</div>
		)
	}

	return (
		<form action={handleSubmit} className="mx-auto max-w-md space-y-4">
			<div>
				<label htmlFor="school_name" className="block text-sm font-medium">
					Okul Adı
				</label>
				<input
					id="school_name"
					name="school_name"
					type="text"
					required
					className="mt-1 w-full rounded border px-3 py-2"
					placeholder="Örn: Özel İstanbul Koleji"
				/>
				{errors.school_name && (
					<p className="mt-1 text-sm text-red-600">{errors.school_name[0]}</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="city" className="block text-sm font-medium">
						İl
					</label>
					<input
						id="city"
						name="city"
						type="text"
						required
						className="mt-1 w-full rounded border px-3 py-2"
						placeholder="İstanbul"
					/>
					{errors.city && (
						<p className="mt-1 text-sm text-red-600">{errors.city[0]}</p>
					)}
				</div>
				<div>
					<label htmlFor="district" className="block text-sm font-medium">
						İlçe
					</label>
					<input
						id="district"
						name="district"
						type="text"
						required
						className="mt-1 w-full rounded border px-3 py-2"
						placeholder="Kadıköy"
					/>
					{errors.district && (
						<p className="mt-1 text-sm text-red-600">{errors.district[0]}</p>
					)}
				</div>
			</div>

			<div>
				<label htmlFor="school_type" className="block text-sm font-medium">
					Okul Türü
				</label>
				<select
					id="school_type"
					name="school_type"
					required
					className="mt-1 w-full rounded border px-3 py-2"
				>
					{SCHOOL_TYPES.map((t) => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</select>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="academic_year" className="block text-sm font-medium">
						Eğitim Yılı
					</label>
					<input
						id="academic_year"
						name="academic_year"
						type="text"
						required
						defaultValue={ACADEMIC_YEAR}
						className="mt-1 w-full rounded border px-3 py-2"
						placeholder="2026-2027"
					/>
					{errors.academic_year && (
						<p className="mt-1 text-sm text-red-600">
							{errors.academic_year[0]}
						</p>
					)}
				</div>
				<div>
					<label htmlFor="grade_level" className="block text-sm font-medium">
						Sınıf
					</label>
					<input
						id="grade_level"
						name="grade_level"
						type="number"
						min={0}
						max={12}
						required
						className="mt-1 w-full rounded border px-3 py-2"
						placeholder="1"
					/>
					{errors.grade_level && (
						<p className="mt-1 text-sm text-red-600">
							{errors.grade_level[0]}
						</p>
					)}
				</div>
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
					className="mt-1 w-full rounded border px-3 py-2"
					placeholder="250000"
				/>
				{errors.tuition_fee && (
					<p className="mt-1 text-sm text-red-600">{errors.tuition_fee[0]}</p>
				)}
			</div>

			<div>
				<label htmlFor="food_fee" className="block text-sm font-medium">
					Yemek Ücreti (TL) - Opsiyonel
				</label>
				<input
					id="food_fee"
					name="food_fee"
					type="number"
					min={0}
					step={1000}
					className="mt-1 w-full rounded border px-3 py-2"
					placeholder="60000"
				/>
			</div>

			<div>
				<label htmlFor="book_fee" className="block text-sm font-medium">
					Kitap/Kırtasiye (TL) - Opsiyonel
				</label>
				<input
					id="book_fee"
					name="book_fee"
					type="number"
					min={0}
					step={1000}
					className="mt-1 w-full rounded border px-3 py-2"
					placeholder="40000"
				/>
			</div>

			<div>
				<label htmlFor="uniform_fee" className="block text-sm font-medium">
					Kıyafet Ücreti (TL) - Opsiyonel
				</label>
				<input
					id="uniform_fee"
					name="uniform_fee"
					type="number"
					min={0}
					step={1000}
					className="mt-1 w-full rounded border px-3 py-2"
					placeholder="15000"
				/>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
			>
				{isSubmitting ? 'Gönderiliyor...' : 'Anonim Olarak Paylaş'}
			</button>
		</form>
	)
}
