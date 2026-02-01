import type { DatePageData, Observation, GraphDataPoint, RainDataPoint, WindDataPoint } from '~/types/weather'

export default defineEventHandler(async (event): Promise<DatePageData> => {
  // Get date parameter from query (format: YYYY-MM-DD)
  const query = getQuery(event)
  const dateParam = query.date as string

  // Fetch from WURequest API
  const backendUrl = process.env.WUREQUEST_API_URL || 'https://localhost:5001'
  
  try {
    // Fetch observations from backend API
    // For localhost with self-signed certificates, we need to disable TLS verification
    const fetchOptions: any = {}
    
    if (backendUrl.includes('localhost')) {
      // Disable TLS certificate validation for localhost development
      // This is required when the backend uses self-signed certificates
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
    
    const response = await $fetch<Observation[]>(`${backendUrl}/api/observations/date/${dateParam}`, fetchOptions)
    
    // Re-enable TLS verification after the request
    if (backendUrl.includes('localhost')) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1'
    }

    // Convert backend response to our Observation type
    const backendObservations: Observation[] = response.map(o => ({
      obsTime: o.obsTime,
      tempOutCur: o.tempOutCur,
      tempInCur: o.tempInCur,
      dewCur: o.dewCur,
      tmin: o.tmin,
      tmax: o.tmax,
      humOutCur: o.humOutCur,
      humInCur: o.humInCur,
      pressCur: o.pressCur,
      windSpeedCur: o.windSpeedCur,
      windAvgSpeedCur: o.windAvgSpeedCur,
      windDirCur: o.windDirCur,
      windDirCurEng: o.windDirCurEng,
      windGust10: o.windGust10,
      windDirAvg10: o.windDirAvg10,
      windDirAvg10Eng: o.windDirAvg10Eng,
      windChillCur: o.windChillCur,
      rainRateCur: o.rainRateCur,
      rainDay: o.rainDay,
      rainYest: o.rainYest,
      rainMonth: o.rainMonth,
      rainYear: o.rainYear,
      solarRad: o.solarRad,
      uv: o.uv
    }))

    // Apply sampling (every 17th record)
    const nStep = 17
    const sampledObservations = backendObservations.filter((_, i) => i % nStep === 0)

    // Transform to graph data points
    const observations: GraphDataPoint[] = sampledObservations.map(o => ({
      ot: new Date(o.obsTime).getTime(),
      to: o.tempOutCur,
      dc: o.dewCur,
      tmn: o.tmin,
      tmx: o.tmax,
      ho: o.humOutCur,
      hi: o.humInCur,
      p: o.pressCur,
      ws: o.windSpeedCur * 3.6, // Convert m/s to km/h
      was: o.windAvgSpeedCur * 3.6,
      wd: o.windDirCur,
      wdce: o.windDirCurEng,
      wg: o.windGust10 * 3.6,
      wda: o.windDirAvg10,
      wdae: o.windDirAvg10Eng,
      rr: o.rainRateCur,
      rd: o.rainDay,
      sr: o.solarRad,
      uv: o.uv
    }))

    // Filter rain data (only records with rain)
    const rainData: RainDataPoint[] = backendObservations
      .filter(o => o.rainRateCur > 0)
      .map(o => ({
        ot: o.obsTime,
        wda: o.windDirAvg10,
        wdae: o.windDirAvg10Eng,
        rr: o.rainRateCur
      }))

    // Filter wind data (only records with wind)
    const windData: WindDataPoint[] = sampledObservations
      .filter(o => o.windSpeedCur > 0)
      .map(o => ({
        wd: o.windDirCur,
        wdce: o.windDirCurEng,
        wg: o.windGust10 * 3.6,
        was: o.windAvgSpeedCur * 3.6,
        ws: o.windSpeedCur * 3.6
      }))

    // Calculate cloudiness based on solar radiation standard deviation
    const { cloudiness, standardDeviation } = calculateCloudiness(backendObservations)

    const latest = backendObservations.length > 0 ? backendObservations[backendObservations.length - 1] : undefined

    return {
      observations,
      rainData,
      windData,
      latest,
      count: backendObservations.length,
      cloudiness,
      standardDeviation
    }
  } catch (error) {
    // Re-enable TLS verification in case of error
    if (backendUrl.includes('localhost')) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1'
    }
    
    console.error('Error fetching from WURequest API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch weather data from backend API'
    })
  }
})


function calculateCloudiness(observations: Observation[]): { cloudiness: string; standardDeviation: number } {
  const daylightObs = observations.filter(o => o.solarRad > 0)

  if (daylightObs.length === 0) {
    return { cloudiness: '', standardDeviation: 0 }
  }

  const solarValues = daylightObs.map(o => o.solarRad)
  const avg = solarValues.reduce((sum, val) => sum + val, 0) / solarValues.length
  const sumOfSquares = solarValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0)
  const sd = Math.sqrt(sumOfSquares / solarValues.length)

  let cloudiness = ''
  if (sd >= 140) cloudiness = 'Sunny Day'
  else if (sd >= 125 && sd <= 140) cloudiness = 'Partly Cloudy Day'
  else if (sd >= 100 && sd <= 125) cloudiness = 'Cloudy Day'
  else if (sd <= 100) cloudiness = 'Very Cloudy Day'

  return { cloudiness, standardDeviation: sd }
}


