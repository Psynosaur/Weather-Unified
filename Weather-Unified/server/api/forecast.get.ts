import type { Forecasts } from '~/types/weather'

export default defineEventHandler(async (): Promise<Forecasts> => {
  try {
    // Fetch from WURequest API with authentication
    return await backendFetch<Forecasts>(`/api/forecasts`)
  } catch (error) {
    console.error('Error fetching from WURequest API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch forecast data from backend API'
    })
  }
})
