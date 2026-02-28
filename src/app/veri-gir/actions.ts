'use server'

import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import { costEntrySchema, type CostEntryInput } from '@/lib/validations/cost'

function parseFormData(formData: FormData): CostEntryInput {
	return {
		school_name: formData.get('school_name') as string,
		city: formData.get('city') as string,
		district: formData.get('district') as string,
		school_type: formData.get('school_type') as CostEntryInput['school_type'],
		academic_year: formData.get('academic_year') as string,
		grade_level: parseInt(formData.get('grade_level') as string, 10),
		tuition_fee: parseFloat(formData.get('tuition_fee') as string),
		food_fee: formData.get('food_fee')
			? parseFloat(formData.get('food_fee') as string)
			: null,
		book_fee: formData.get('book_fee')
			? parseFloat(formData.get('book_fee') as string)
			: null,
		uniform_fee: formData.get('uniform_fee')
			? parseFloat(formData.get('uniform_fee') as string)
			: null,
	}
}

export async function submitCostEntry(data: CostEntryInput) {
	const parsed = costEntrySchema.safeParse(data)
	if (!parsed.success) {
		return { success: false, error: parsed.error.flatten().fieldErrors }
	}

	const supabase = await createClient()
	const { school_name, city, district, school_type, ...costData } = parsed.data

	// Find or create school
	const { data: existingSchool } = await supabase
		.from('schools')
		.select('id')
		.eq('name', school_name)
		.eq('city', city)
		.eq('district', district)
		.eq('type', school_type)
		.single()

	let schoolId: string

	if (existingSchool) {
		schoolId = existingSchool.id
	} else {
		const { data: newSchool, error: schoolError } = await supabase
			.from('schools')
			.insert({
				name: school_name,
				city,
				district,
				type: school_type,
			})
			.select('id')
			.single()

		if (schoolError || !newSchool) {
			return { success: false, error: { _form: ['Okul eklenirken hata oluştu.'] } }
		}
		schoolId = newSchool.id
	}

	const referenceCode = nanoid(12)

	const { error: costError } = await supabase.from('costs').insert({
		school_id: schoolId,
		academic_year: costData.academic_year,
		grade_level: costData.grade_level,
		tuition_fee: costData.tuition_fee,
		food_fee: costData.food_fee ?? null,
		book_fee: costData.book_fee ?? null,
		uniform_fee: costData.uniform_fee ?? null,
		is_verified: false,
		reference_code: referenceCode,
	})

	if (costError) {
		return { success: false, error: { _form: ['Veri kaydedilirken hata oluştu.'] } }
	}

	return { success: true, referenceCode }
}

export async function submitCostEntryForm(formData: FormData) {
	return submitCostEntry(parseFormData(formData))
}
