export interface Observation {
  obsTime: string
  tempOutCur: number
  tempInCur: number
  dewCur: number
  tmin: number
  tmax: number
  humOutCur: number
  humInCur: number
  pressCur: number
  windSpeedCur: number
  windAvgSpeedCur: number
  windDirCur: number
  windDirCurEng: string
  windGust10: number
  windDirAvg10: number
  windDirAvg10Eng: string
  windChillCur: number
  rainRateCur: number
  rainDay: number
  rainYest: number
  rainMonth: number
  rainYear: number
  solarRad: number
  uv: number
}

export interface GraphDataPoint {
  ot: number // Unix timestamp in milliseconds
  to: number // TempOutCur
  dc: number // DewCur
  tmn: number // Tmin
  tmx: number // Tmax
  ho: number // HumOutCur
  hi: number // HumInCur
  p: number // PressCur
  ws: number // WindSpeedCur (km/h)
  was: number // WindAvgSpeedCur (km/h)
  wd: number // WindDirCur
  wdce: string // WindDirCurEng
  wg: number // WindGust10 (km/h)
  wda: number // WindDirAvg10
  wdae: string // WindDirAvg10Eng
  rr: number // RainRateCur
  rd: number // RainDay
  sr: number // SolarRad
  uv: number // UV
}

export interface RainDataPoint {
  ot: string
  wda: number
  wdae: string
  rr: number
}

export interface WindDataPoint {
  wd: number
  wdce: string
  wg: number
  was: number
  ws: number
}

export interface DatePageData {
  observations: GraphDataPoint[]
  rainData: RainDataPoint[]
  windData: WindDataPoint[]
  latest: Observation | undefined
  count: number
  cloudiness: string
  standardDeviation: number
}

export interface SunlightInfo {
  sunrise: string | null
  sunset: string | null
  duration: string | null
  maxSolarElevation: number | null
}

export interface AppSettings {
  stationName: string
  lat: number
  lon: number
  magneticDeclination: number
}

export interface WeekPageData {
  observations: GraphDataPoint[]
  rainData: RainDataPoint[]
  windData: WindDataPoint[]
  latest: Observation | undefined
  count: number
  weekStart: string | undefined
  weekEnd: string | undefined
  currentDate: string | undefined
  isCurrentWeek: boolean
}
