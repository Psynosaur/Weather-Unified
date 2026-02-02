import type { Forecasts } from '~/types/weather'

export default defineEventHandler(async (): Promise<Forecasts> => {
  // Fetch from WURequest API
  const backendUrl = process.env.WUREQUEST_API_URL || 'https://localhost:5001'

  try {
    const response = await $fetch<Forecasts>(`${backendUrl}/api/forecasts`)

    return response
  } catch (error) {
    console.error('Error fetching from WURequest API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch forecast data from backend API'
    })
  }
})
