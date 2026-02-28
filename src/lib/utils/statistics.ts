/**
 * IQR (Interquartile Range) outlier filter - Ortalama.net metodolojisi
 * Manipülasyonu engellemek için aşırı uçları temizler
 */
export function filterOutliers(data: number[]): number[] {
	if (data.length < 4) return data

	const sorted = [...data].sort((a, b) => a - b)
	const q1Index = Math.floor(sorted.length * 0.25)
	const q3Index = Math.floor(sorted.length * 0.75)
	const q1 = sorted[q1Index]
	const q3 = sorted[q3Index]
	const iqr = q3 - q1
	const lowerBound = q1 - 1.5 * iqr
	const upperBound = q3 + 1.5 * iqr

	return sorted.filter((val) => val >= lowerBound && val <= upperBound)
}

export function calculateStats(values: number[]) {
	const filtered = filterOutliers(values)
	if (filtered.length === 0) return { mean: 0, median: 0, count: 0 }

	const sum = filtered.reduce((a, b) => a + b, 0)
	const mean = sum / filtered.length
	const sorted = [...filtered].sort((a, b) => a - b)
	const mid = Math.floor(sorted.length / 2)
	const median =
		sorted.length % 2
			? sorted[mid]
			: (sorted[mid - 1] + sorted[mid]) / 2

	return { mean, median, count: filtered.length }
}
