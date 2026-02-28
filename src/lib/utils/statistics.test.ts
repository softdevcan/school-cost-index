import { describe, it, expect } from 'vitest'
import { filterOutliers, calculateStats } from './statistics'

describe('filterOutliers', () => {
	it('returns data as-is when length < 4', () => {
		expect(filterOutliers([1, 2, 3])).toEqual([1, 2, 3])
		expect(filterOutliers([])).toEqual([])
	})

	it('filters extreme outliers', () => {
		const data = [10, 12, 14, 16, 18, 20, 100]
		const result = filterOutliers(data)
		expect(result).not.toContain(100)
		expect(result.length).toBeLessThan(data.length)
	})

	it('keeps normal range values', () => {
		const data = [10, 12, 14, 16, 18, 20]
		const result = filterOutliers(data)
		expect(result).toHaveLength(data.length)
	})
})

describe('calculateStats', () => {
	it('returns zeros for empty array', () => {
		expect(calculateStats([])).toEqual({ mean: 0, median: 0, count: 0 })
	})

	it('calculates mean and median correctly', () => {
		const result = calculateStats([10, 20, 30, 40, 50])
		expect(result.mean).toBe(30)
		expect(result.median).toBe(30)
		expect(result.count).toBe(5)
	})
})
