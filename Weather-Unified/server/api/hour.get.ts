import type {
  HourPageData,
  Observation,
  GraphDataPoint,
  RainDataPoint,
  WindDataPoint
} from '~/types/weather'

export default defineEventHandler(async (event): Promise<HourPageData> => {
  // Get time parameter from query (format: HH:mm or just HH)
  const query = getQuery(event)
  const timeParam = query.time as string

  // Parse hour from time parameter
  let hour: number
  if (timeParam) {
    // Extract hour from HH:mm format or just use HH
    const hourStr = timeParam.includes(':')
      ? timeParam.split(':')[0] ?? timeParam
      : timeParam
    hour = parseInt(hourStr, 10)
  } else {
    // Default to current hour
    hour = new Date().getHours()
  }

  // Fetch from WURequest API
  const backendUrl = process.env.WUREQUEST_API_URL || 'https://localhost:5001'

  try {
    // Fetch observations from backend API
    const response = await $fetch<Observation[]>(
      `${backendUrl}/api/observations/hourly/${hour}`
    )

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

    // Apply minimal sampling (every 1st record - no sampling for hourly)
    // This matches the Hour.cshtml which uses nStep = 1
    const nStep = 1
    const sampledObservations = backendObservations.filter(
      (_, i) => i % nStep === 0
    )

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

    const latest
      = backendObservations.length > 0
        ? backendObservations[backendObservations.length - 1]
        : undefined

    return {
      observations,
      rainData,
      windData,
      latest,
      count: backendObservations.length
    }
  } catch (error) {
    console.error('Error fetching from WURequest API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch weather data from backend API'
    })
  }
})
