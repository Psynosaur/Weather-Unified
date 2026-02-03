import type {
  MonthPageData,
  Observation,
  GraphDataPoint,
  RainDataPoint,
  WindDataPoint,
} from "~/types/weather";

export default defineEventHandler(async (event): Promise<MonthPageData> => {
  const config = useRuntimeConfig();
  const backendUrl = config.public.WUREQUEST_API_URL;

  // Get date parameter from query (format: YYYY-MM-DD)
  const query = getQuery(event);
  const dateParam = query.date as string;

  try {
    // Fetch from WURequest API
    const response = await $fetch<Observation[]>(
      `${backendUrl}/api/observations/monthly?date=${dateParam}`,
    );

    // Convert backend response to our Observation type
    const backendObservations: Observation[] = response.map((o) => ({
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
      uv: o.uv,
    }));

    // Apply sampling (every 400th record for monthly view - more aggressive than weekly)
    const nStep = 400;
    const sampledObservations = backendObservations.filter(
      (_, i) => i % nStep === 0,
    );

    // Transform to graph data points
    const observations: GraphDataPoint[] = sampledObservations.map((o) => ({
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
      uv: o.uv,
    }));

    // Filter rain data (only records with rain)
    const rainData: RainDataPoint[] = backendObservations
      .filter((o) => o.rainRateCur > 0)
      .map((o) => ({
        ot: o.obsTime,
        wda: o.windDirAvg10,
        wdae: o.windDirAvg10Eng,
        rr: o.rainRateCur,
      }));

    // Filter wind data (only records with wind)
    const windData: WindDataPoint[] = sampledObservations
      .filter((o) => o.windSpeedCur > 0)
      .map((o) => ({
        wd: o.windDirCur,
        wdce: o.windDirCurEng,
        wg: o.windGust10 * 3.6,
        was: o.windAvgSpeedCur * 3.6,
        ws: o.windSpeedCur * 3.6,
      }));

    const latest =
      backendObservations.length > 0
        ? backendObservations[backendObservations.length - 1]
        : undefined;

    // Calculate date range in local time to match displayed observations
    const currentDate = new Date(dateParam);
    const now = new Date();
    const isCurrentMonth =
      (now.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) < 30;

    const firstObs = backendObservations[0];
    const lastObs = backendObservations[backendObservations.length - 1];

    const monthStart = firstObs
      ? new Date(firstObs.obsTime).toISOString().split("T")[0]
      : new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

    const monthEnd = lastObs
      ? new Date(lastObs.obsTime).toISOString().split("T")[0]
      : currentDate.toISOString().split("T")[0];

    return {
      observations,
      rainData,
      windData,
      latest,
      count: backendObservations.length,
      monthStart,
      monthEnd,
      currentDate: dateParam,
      isCurrentMonth,
    };
  } catch (error) {
    console.error("Error fetching from WURequest API:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch weather data from backend API",
    });
  }
});
