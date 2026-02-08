/**
 * Timeframe configuration for chart axis settings
 * Based on the original site.js switch case logic
 */

export type Timeframe = 'day' | 'week' | 'month' | 'default'

export interface TimeframeConfig {
  timeUnit: 'second' | 'minute' | 'hour' | 'day'
  baseIntervalCount: number
  gridCount: number
  dateFormat: string
}

/**
 * Get the axis configuration for a specific timeframe
 * Matches the original site.js behavior:
 * - Day (case 1): minute intervals, 5-minute base, 210 grid points
 * - Week (case 2): hour intervals, 1-hour base, 24 grid points
 * - Month (case 3): hour intervals, 2-hour base, 120 grid points
 * - Default: second intervals, 30-second base, 600 grid points
 */
export const useTimeframeConfig = (timeframe: Timeframe): TimeframeConfig => {
  switch (timeframe) {
    case 'day':
      return {
        timeUnit: 'minute',
        baseIntervalCount: 5,
        gridCount: 210,
        dateFormat: 'HH:mm'
      }
    case 'week':
      return {
        timeUnit: 'hour',
        baseIntervalCount: 1,
        gridCount: 24,
        dateFormat: 'dd-MM HH:mm'
      }
    case 'month':
      return {
        timeUnit: 'hour',
        baseIntervalCount: 2,
        gridCount: 120,
        dateFormat: 'dd-MM HH:mm'
      }
    default:
      return {
        timeUnit: 'second',
        baseIntervalCount: 30,
        gridCount: 600,
        dateFormat: 'HH:mm'
      }
  }
}
