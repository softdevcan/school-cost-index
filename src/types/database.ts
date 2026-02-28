export type SchoolType = 'kindergarten' | 'primary' | 'middle' | 'high'

export interface School {
	id: string
	name: string
	city: string
	district: string
	address: string | null
	latitude: number | null
	longitude: number | null
	type: SchoolType
	created_at: string
}

export interface Cost {
	id: string
	school_id: string
	academic_year: string
	grade_level: number
	tuition_fee: number
	food_fee: number | null
	book_fee: number | null
	uniform_fee: number | null
	is_verified: boolean
	reference_code: string
	created_at: string
}

export interface CostWithSchool extends Cost {
	schools: School | null
}
