'use server'

import { createClient } from '@/lib/supabase/server'
import { updateCostSchema } from '@/lib/validations/cost'

export interface CostForUpdate {
	id: string
	school_id: string
	academic_year: string
	grade_level: number
	tuition_fee: number
	food_fee: number | null
	book_fee: number | null
	uniform_fee: number | null
	school_name: string
	city: string
	district: string
	address: string | null
	latitude: number | null
	longitude: number | null
	school_type: string
}

export async function fetchCostByReference(
	referenceCode: string
): Promise<{ success: true; data: CostForUpdate } | { success: false; error: string }> {
	const trimmed = referenceCode.trim()
	if (!trimmed || trimmed.length < 10) {
		return { success: false, error: 'Geçersiz referans kodu.' }
	}

	const supabase = await createClient()
	const { data, error } = await supabase.rpc('get_cost_by_reference', {
		p_ref_code: trimmed,
	})

	if (error || !data) {
		return { success: false, error: 'Referans kodu bulunamadı.' }
	}

	return { success: true, data: data as unknown as CostForUpdate }
}

export async function updateCostByReference(
	referenceCode: string,
	updates: {
		tuition_fee: number
		food_fee: number | null
		book_fee: number | null
		uniform_fee: number | null
		address?: string | null
		latitude?: number | null
		longitude?: number | null
	}
): Promise<{ success: boolean; error?: string }> {
	const trimmed = referenceCode.trim()
	if (!trimmed || trimmed.length < 10) {
		return { success: false, error: 'Geçersiz referans kodu.' }
	}

	const parsed = updateCostSchema.safeParse(updates)
	if (!parsed.success) {
		const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0]
		return { success: false, error: firstError ?? 'Geçersiz veri.' }
	}

	const supabase = await createClient()
	const { tuition_fee, food_fee, book_fee, uniform_fee, address, latitude, longitude } =
		parsed.data

	const { data, error } = await supabase.rpc('update_cost_by_reference', {
		p_ref_code: trimmed,
		p_tuition_fee: tuition_fee,
		p_food_fee: food_fee ?? null,
		p_book_fee: book_fee ?? null,
		p_uniform_fee: uniform_fee ?? null,
		p_address: address ?? null,
		p_latitude: latitude ?? null,
		p_longitude: longitude ?? null,
	})

	if (error) {
		return { success: false, error: 'Güncelleme sırasında hata oluştu.' }
	}
	if (!data) {
		return { success: false, error: 'Referans kodu bulunamadı.' }
	}
	return { success: true }
}
