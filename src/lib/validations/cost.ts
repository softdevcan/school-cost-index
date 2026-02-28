import { z } from 'zod'

const schoolTypes = ['kindergarten', 'primary', 'middle', 'high'] as const

export const costEntrySchema = z.object({
	school_name: z.string().min(2, 'Okul adı en az 2 karakter olmalı'),
	city: z.string().min(2, 'İl girin'),
	district: z.string().min(2, 'İlçe girin'),
	school_type: z.enum(schoolTypes),
	academic_year: z.string().regex(/^\d{4}-\d{4}$/, 'Format: 2026-2027'),
	grade_level: z.number().min(0).max(12),
	tuition_fee: z.number().min(0, 'Eğitim ücreti 0 veya pozitif olmalı'),
	food_fee: z.number().min(0).optional().nullable(),
	book_fee: z.number().min(0).optional().nullable(),
	uniform_fee: z.number().min(0).optional().nullable(),
})

export type CostEntryInput = z.infer<typeof costEntrySchema>
