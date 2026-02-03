/**
 * Composable for solar position calculations
 * Based on astronomical formulas from NOAA Solar Calculator
 * Reference: https://www.esrl.noaa.gov/gmd/grad/solcalc/calcdetails.html
 *
 * IMPORTANT: This uses SOLAR declination (Sun's position relative to Earth's equator),
 * which is completely different from MAGNETIC declination (compass correction).
 * Solar declination is calculated based on Earth's tilt and day of year, ranging from
 * -23.45° at winter solstice to +23.45° at summer solstice.
 */

/**
 * Calculate the day of year (1-365/366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

/**
 * Calculate solar declination angle for a given date
 * Solar declination is the angle between the Sun's rays and the plane of the Earth's equator
 * Ranges from -23.45° (winter solstice) to +23.45° (summer solstice)
 *
 * Uses a more accurate formula that accounts for Earth's orbital eccentricity
 *
 * @param date - The date for calculation
 * @returns Solar declination in radians
 */
function calculateSolarDeclination(date: Date): number {
  const dayOfYear = getDayOfYear(date)

  // More accurate formula using fractional year
  // Based on NOAA Solar Position Calculator
  const fractionalYear = (2 * Math.PI / 365) * (dayOfYear - 1)

  // Calculate solar declination using Fourier series approximation
  const declinationRadians
    = 0.006918
      - 0.399912 * Math.cos(fractionalYear)
      + 0.070257 * Math.sin(fractionalYear)
      - 0.006758 * Math.cos(2 * fractionalYear)
      + 0.000907 * Math.sin(2 * fractionalYear)
      - 0.002697 * Math.cos(3 * fractionalYear)
      + 0.00148 * Math.sin(3 * fractionalYear)

  return declinationRadians
}

/**
 * Calculate atmospheric refraction correction
 * Based on NOAA's approximation for different elevation angles
 *
 * @param elevationDegrees - Solar elevation angle in degrees
 * @returns Refraction correction in degrees
 */
function calculateAtmosphericRefraction(elevationDegrees: number): number {
  // No correction for high elevations (85° to 90°)
  if (elevationDegrees >= 85) {
    return 0
  }

  // For elevations 5° to 85°
  if (elevationDegrees >= 5) {
    const elevRad = elevationDegrees * Math.PI / 180
    const tanElev = Math.tan(elevRad)
    return (1 / 3600) * (
      58.1 / tanElev
      - 0.07 / Math.pow(tanElev, 3)
      + 0.000086 / Math.pow(tanElev, 5)
    )
  }

  // For elevations -0.575° to 5°
  if (elevationDegrees >= -0.575) {
    const h = elevationDegrees
    return (1 / 3600) * (
      1735
      - 518.2 * h
      + 103.4 * h * h
      - 12.79 * h * h * h
      + 0.711 * h * h * h * h
    )
  }

  // For very low elevations (< -0.575°)
  const elevRad = elevationDegrees * Math.PI / 180
  return (1 / 3600) * (-20.774 / Math.tan(elevRad))
}

/**
 * Calculate maximum solar elevation angle for a given date and latitude
 * This occurs at solar noon when the hour angle is 0
 *
 * Formula: sin(α) = sin(φ) × sin(δ) + cos(φ) × cos(δ) × cos(h)
 * At solar noon (h = 0): sin(α) = sin(φ) × sin(δ) + cos(φ) × cos(δ)
 *
 * @param date - The observation date
 * @param latitudeDegrees - Observer's latitude in degrees (negative for south)
 * @returns Maximum solar elevation angle in degrees (with atmospheric refraction)
 */
export function calculateMaxSolarElevation(date: Date, latitudeDegrees: number): number {
  // Calculate solar declination for this day
  const solarDeclination = calculateSolarDeclination(date)

  // Convert latitude to radians
  const latitudeRad = latitudeDegrees * Math.PI / 180

  // Calculate solar elevation at solar noon
  // sin(α) = sin(φ) × sin(δ) + cos(φ) × cos(δ)
  const sinElevation
    = Math.sin(latitudeRad) * Math.sin(solarDeclination)
      + Math.cos(latitudeRad) * Math.cos(solarDeclination)

  // Convert to degrees
  let elevation = Math.asin(sinElevation) * 180 / Math.PI

  // Apply atmospheric refraction correction
  const refraction = calculateAtmosphericRefraction(elevation)
  elevation += refraction

  // Round to 1 decimal place
  return Math.round(elevation * 10) / 10
}

/**
 * Calculate solar elevation angle at a specific time, date, and location
 *
 * Formula: sin(α) = sin(φ) × sin(δ) + cos(φ) × cos(δ) × cos(h)
 *
 * @param date - The observation date and time
 * @param latitudeDegrees - Observer's latitude in degrees (negative for south)
 * @param longitudeDegrees - Observer's longitude in degrees (negative for west)
 * @returns Solar elevation angle in degrees (with atmospheric refraction)
 */
export function calculateSolarElevation(
  date: Date,
  latitudeDegrees: number,
  longitudeDegrees: number
): number {
  // Calculate solar declination for this day
  const solarDeclination = calculateSolarDeclination(date)

  // Convert latitude to radians
  const latitudeRad = latitudeDegrees * Math.PI / 180

  // Calculate hour angle (h)
  // Hour angle is 0 at solar noon, -15° per hour before noon, +15° per hour after noon
  const solarNoon = 12 - (longitudeDegrees / 15) // Approximate solar noon in local time
  const currentHour = date.getHours() + date.getMinutes() / 60
  const hourAngleDegrees = (currentHour - solarNoon) * 15
  const hourAngleRad = hourAngleDegrees * Math.PI / 180

  // Calculate solar elevation
  // sin(α) = sin(φ) × sin(δ) + cos(φ) × cos(δ) × cos(h)
  const sinElevation
    = Math.sin(latitudeRad) * Math.sin(solarDeclination)
      + Math.cos(latitudeRad) * Math.cos(solarDeclination) * Math.cos(hourAngleRad)

  // Convert to degrees
  let elevation = Math.asin(sinElevation) * 180 / Math.PI

  // Apply atmospheric refraction correction
  const refraction = calculateAtmosphericRefraction(elevation)
  elevation += refraction

  // Round to 1 decimal place
  return Math.round(elevation * 10) / 10
}

/**
 * Calculate solar zenith angle (complement of elevation angle)
 *
 * @param date - The observation date and time
 * @param latitudeDegrees - Observer's latitude in degrees
 * @param longitudeDegrees - Observer's longitude in degrees
 * @returns Solar zenith angle in degrees
 */
export function calculateSolarZenith(
  date: Date,
  latitudeDegrees: number,
  longitudeDegrees: number
): number {
  const elevation = calculateSolarElevation(date, latitudeDegrees, longitudeDegrees)
  return 90 - elevation
}

/**
 * Composable export for use in Vue components
 */
export const useSolarCalculations = () => {
  return {
    calculateMaxSolarElevation,
    calculateSolarElevation,
    calculateSolarZenith
  }
}
