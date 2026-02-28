'use client'

import dynamic from 'next/dynamic'
import type { SchoolDetailMapProps } from './school-detail-map'

export const SchoolDetailMapClient = dynamic<SchoolDetailMapProps>(
	() =>
		import('@/components/map/school-detail-map').then((m) => ({
			default: m.SchoolDetailMap,
		})),
	{ ssr: false }
)
