import type { AppSettings } from '@/types/weather'

/**
 * Composable for accessing centralized application settings
 *
 * @returns AppSettings object with station configuration
 */
export const useAppSettings = () => {
  const config = useRuntimeConfig()

  const appSettings: AppSettings = {
    stationName: config.public.WEATHER_STATION,
    lat: -33.86454, // Cape Town, South Africa
    lon: 18.65963,
    // Magnetic declination: difference between magnetic north and true north
    // Used for correcting compass/wind direction readings if sensor reports magnetic bearings
    // Cape Town magnetic declination: ~-23.16° (West declination)
    // Note: Currently not applied to wind directions - verify if your sensor reports true or magnetic bearings
    magneticDeclination: -23.16
  }

  return appSettings
}
