<script setup lang="ts">
import type { Forecasts } from '~/types/weather'
import type { Root } from '@amcharts/amcharts5'
import type { ColumnSeries, LineSeries, SmoothedXLineSeries } from '@amcharts/amcharts5/xy'

interface Props {
  forecast: Forecasts
}

interface ChartDataPoint {
  date: number
  dayName: string
  tempMax: number | null
  tempMin: number | null
  calendarTempMax: number | null
  calendarTempMin: number | null
  precipChanceDay: number | null
  precipChanceNight: number | null
  qpf: number | null
  cloudCoverDay: number | null
  cloudCoverNight: number | null
  humidityDay: number | null
  humidityNight: number | null
  sunriseTime: number
  sunsetTime: number
  sunriseTimeFormatted: string
  sunsetTimeFormatted: string
  moonPhaseDay: number | null
  moonPhase: string | null
  uvIndexDay: number | null
  uvIndexNight: number | null
  windSpeedDay: number | null
  windSpeedNight: number | null
  windDirDay: number | null
  windDirNight: number | null
  windDirCardinalDay: string | null
  windDirCardinalNight: string | null
  windPhraseDay: string | null
  windPhraseNight: string | null
}

const props = defineProps<Props>()

const { colorMode } = useAmCharts()
const chartRoots = new Map<string, Root>()
const chartSeriesMap = new Map<string, ColumnSeries | LineSeries | SmoothedXLineSeries>()
const signalR = useSignalR()
const isLiveUpdateActive = ref(false)

// Transform forecast data for charts
const transformForecastData = (forecastData: Forecasts) => {
  if (!forecastData) return []

  const getTimeAsDecimal = (timeString: string | undefined): number => {
    if (!timeString) return 0
    const date = new Date(timeString)
    return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600
  }

  const formatTime = (timeString: string | undefined): string => {
    if (!timeString) return '--:--:--'
    if (typeof window === 'undefined') return '--:--:--' // Skip during SSR
    return new Date(timeString).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return forecastData.dayOfWeek.map((day, i) => {
    const daypart = forecastData.daypart[0]
    return {
      date: forecastData.validTimeLocal[i] ? new Date(forecastData.validTimeLocal[i]).getTime() : 0,
      dayName: day,
      tempMax: forecastData.temperatureMax[i],
      tempMin: forecastData.temperatureMin[i],
      calendarTempMax: forecastData.calendarDayTemperatureMax[i],
      calendarTempMin: forecastData.calendarDayTemperatureMin[i],
      precipChanceDay: daypart?.precipChance[i * 2] ?? null,
      precipChanceNight: daypart?.precipChance[i * 2 + 1] ?? null,
      qpf: forecastData.qpf[i] ?? null,
      cloudCoverDay: daypart?.cloudCover[i * 2] ?? null,
      cloudCoverNight: daypart?.cloudCover[i * 2 + 1] ?? null,
      humidityDay: daypart?.relativeHumidity[i * 2] ?? null,
      humidityNight: daypart?.relativeHumidity[i * 2 + 1] ?? null,
      sunriseTime: getTimeAsDecimal(forecastData.sunriseTimeLocal[i]),
      sunsetTime: getTimeAsDecimal(forecastData.sunsetTimeLocal[i]),
      sunriseTimeFormatted: formatTime(forecastData.sunriseTimeLocal[i]),
      sunsetTimeFormatted: formatTime(forecastData.sunsetTimeLocal[i]),
      moonPhaseDay: forecastData.moonPhaseDay[i],
      moonPhase: forecastData.moonPhase[i],
      uvIndexDay: daypart?.uvIndex[i * 2] ?? null,
      uvIndexNight: daypart?.uvIndex[i * 2 + 1] ?? null,
      windSpeedDay: daypart?.windSpeed[i * 2] ?? null,
      windSpeedNight: daypart?.windSpeed[i * 2 + 1] ?? null,
      windDirDay: daypart?.windDirection[i * 2] ?? null,
      windDirNight: daypart?.windDirection[i * 2 + 1] ?? null,
      windDirCardinalDay: daypart?.windDirectionCardinal[i * 2] ?? null,
      windDirCardinalNight: daypart?.windDirectionCardinal[i * 2 + 1] ?? null,
      windPhraseDay: daypart?.windPhrase[i * 2] ?? null,
      windPhraseNight: daypart?.windPhrase[i * 2 + 1] ?? null
    }
  })
}

const chartData = computed(() => transformForecastData(props.forecast))

// Initialize charts
const initializeCharts = async () => {
  if (!chartData.value.length) return

  await createUnifiedChart()
  await createWindChart()
  await createCloudHumidityChart()
}

const createUnifiedChart = async () => {
  // Dynamic imports for client-side only
  const [am5, am5xy, am5themes_Dark, am5themes_Animated] = await Promise.all([
    import('@amcharts/amcharts5'),
    import('@amcharts/amcharts5/xy'),
    import('@amcharts/amcharts5/themes/Dark').then(m => m.default),
    import('@amcharts/amcharts5/themes/Animated').then(m => m.default)
  ])

  const id = 'unified-chart'

  if (chartRoots.has(id)) {
    chartRoots.get(id)?.dispose()
  }

  const root = am5.Root.new(id)
  root.fps = 60
  chartRoots.set(id, root)

  if (colorMode.value === 'dark') {
    root.setThemes([am5themes_Dark.new(root)])
  } else {
    root.setThemes([am5themes_Animated.new(root)])
  }

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: 'none',
      wheelY: 'none',
      layout: root.verticalLayout
    })
  )

  // Create X-axis (shared by all series)
  const xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: 'day', count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 50
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )

  // Y-axis for temperature (left side)
  const yAxisTemp = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    })
  )
  yAxisTemp.get('renderer').labels.template.setAll({
    fill: am5.color('#ff4343')
  })

  // Y-axis for percentages (right side) - for precipitation, humidity, cloud cover
  const yAxisPercent = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      renderer: am5xy.AxisRendererY.new(root, {
        opposite: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )
  yAxisPercent.get('renderer').labels.template.setAll({
    fill: am5.color('#4ECDC4')
  })

  // Y-axis for UV Index (right side, secondary)
  const yAxisUV = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {
        opposite: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )
  yAxisUV.get('renderer').labels.template.setAll({
    fill: am5.color('#ffdf43')
  })

  // Temperature series
  const maxTempSeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Max Temp (°C)',
      xAxis,
      yAxis: yAxisTemp,
      valueYField: 'tempMax',
      valueXField: 'date',
      stroke: am5.color('#ff4343'),
      fill: am5.color('#ff4343'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: '{tempMax}°C max'
      })
    })
  )
  maxTempSeries.strokes.template.setAll({ strokeWidth: 3 })
  maxTempSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 4,
        fill: am5.color('#ff4343')
      })
    })
  })

  const minTempSeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Min Temp (°C)',
      xAxis,
      yAxis: yAxisTemp,
      valueYField: 'tempMin',
      valueXField: 'date',
      stroke: am5.color('#0ec5fd'),
      fill: am5.color('#0ec5fd'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: '{tempMin}°C min'
      })
    })
  )
  minTempSeries.strokes.template.setAll({ strokeWidth: 3 })

  // UV Index series (column)
  const uvSeries = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: 'UV Index',
      xAxis,
      yAxis: yAxisUV,
      valueYField: 'uvIndexDay',
      valueXField: 'date',
      fill: am5.color('#ffdf43'),
      stroke: am5.color('#ffdf43'),
      tooltip: am5.Tooltip.new(root, {
        labelText: 'UV {uvIndexDay}'
      })
    })
  )
  uvSeries.columns.template.setAll({
    fillOpacity: 0.3,
    strokeOpacity: 0.5
  })

  // Add legend
  const legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.gridLayout
    })
  )

  // Set data for all series
  maxTempSeries.data.setAll(chartData.value)
  minTempSeries.data.setAll(chartData.value)
  uvSeries.data.setAll(chartData.value)

  // Store series references for incremental updates
  chartSeriesMap.set('maxTemp', maxTempSeries)
  chartSeriesMap.set('minTemp', minTempSeries)
  chartSeriesMap.set('uv', uvSeries)

  legend.data.setAll(chart.series.values)

  // Add cursor
  chart.set('cursor', am5xy.XYCursor.new(root, {
    behavior: 'none'
  }))
}

const createWindChart = async () => {
  // Dynamic imports for client-side only
  const [am5, am5xy, am5themes_Dark, am5themes_Animated] = await Promise.all([
    import('@amcharts/amcharts5'),
    import('@amcharts/amcharts5/xy'),
    import('@amcharts/amcharts5/themes/Dark').then(m => m.default),
    import('@amcharts/amcharts5/themes/Animated').then(m => m.default)
  ])

  const id = 'wind-chart'

  if (chartRoots.has(id)) {
    chartRoots.get(id)?.dispose()
  }

  const root = am5.Root.new(id)
  root.fps = 60
  chartRoots.set(id, root)

  if (colorMode.value === 'dark') {
    root.setThemes([am5themes_Dark.new(root)])
  } else {
    root.setThemes([am5themes_Animated.new(root)])
  }

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: 'none',
      wheelY: 'none',
      layout: root.verticalLayout
    })
  )

  // Create X-axis (shared by all series)
  const xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: 'day', count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 50
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )

  // Y-axis for wind speed (left side)
  const yAxisSpeed = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    })
  )
  yAxisSpeed.get('renderer').labels.template.setAll({
    fill: am5.color('#18af1f')
  })

  // Y-axis for wind direction (right side)
  const yAxisDirection = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 360,
      strictMinMax: true,
      renderer: am5xy.AxisRendererY.new(root, {
        opposite: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )
  yAxisDirection.get('renderer').labels.template.setAll({
    fill: am5.color('#838080')
  })

  // Wind Speed Day series
  const daySpeedSeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Day Wind Speed (km/h)',
      xAxis,
      yAxis: yAxisSpeed,
      valueYField: 'windSpeedDay',
      valueXField: 'date',
      stroke: am5.color('#18af1f'),
      fill: am5.color('#18af1f'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Day: {windSpeedDay} km/h {windDirCardinalDay}'
      })
    })
  )
  daySpeedSeries.strokes.template.setAll({ strokeWidth: 3 })
  daySpeedSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: am5.color('#18af1f')
      })
    })
  })

  // Wind Speed Night series
  const nightSpeedSeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Night Wind Speed (km/h)',
      xAxis,
      yAxis: yAxisSpeed,
      valueYField: 'windSpeedNight',
      valueXField: 'date',
      stroke: am5.color('#0e6c13'),
      fill: am5.color('#0e6c13'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Night: {windSpeedNight} km/h {windDirCardinalNight}'
      })
    })
  )
  nightSpeedSeries.strokes.template.setAll({ strokeWidth: 3 })
  nightSpeedSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: am5.color('#0e6c13')
      })
    })
  })

  // Wind Direction Day series (scatter with rotating arrows)
  const dayDirectionSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Day Wind Direction (°)',
      xAxis,
      yAxis: yAxisDirection,
      valueYField: 'windDirDay',
      valueXField: 'date',
      stroke: am5.color('#bcb8b8'),
      fill: am5.color('#bcb8b8'),
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Day: {windDirCardinalDay} ({windDirDay}°)\n{windPhraseDay}'
      })
    })
  )
  dayDirectionSeries.strokes.template.setAll({ strokeWidth: 1, strokeOpacity: 0.3 })
  dayDirectionSeries.bullets.push((root, series, dataItem) => {
    const windDir = (dataItem.dataContext as ChartDataPoint)?.windDirDay
    const graphics = am5.Graphics.new(root, {
      rotation: windDir !== null ? windDir + 180 : 0,
      centerX: am5.p50,
      centerY: am5.p50,
      fill: am5.color('#bcb8b8'),
      draw: (display) => {
        // Arrow pointing up (north when rotation = 0)
        display.moveTo(0, -10)
        display.lineTo(4, 8)
        display.lineTo(0, 4)
        display.lineTo(-4, 8)
        display.lineTo(0, -10)
      }
    })

    return am5.Bullet.new(root, {
      sprite: graphics
    })
  })

  // Wind Direction Night series
  const nightDirectionSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Night Wind Direction (°)',
      xAxis,
      yAxis: yAxisDirection,
      valueYField: 'windDirNight',
      valueXField: 'date',
      stroke: am5.color('#838080'),
      fill: am5.color('#838080'),
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Night: {windDirCardinalNight} ({windDirNight}°)\n{windPhraseNight}'
      })
    })
  )
  nightDirectionSeries.strokes.template.setAll({ strokeWidth: 1, strokeOpacity: 0.3 })
  nightDirectionSeries.bullets.push((root, series, dataItem) => {
    const windDir = (dataItem.dataContext as ChartDataPoint)?.windDirNight
    const graphics = am5.Graphics.new(root, {
      rotation: windDir !== null ? windDir + 180 : 0,
      centerX: am5.p50,
      centerY: am5.p50,
      fill: am5.color('#838080'),
      draw: (display) => {
        // Arrow pointing up (north when rotation = 0)
        display.moveTo(0, -10)
        display.lineTo(4, 8)
        display.lineTo(0, 4)
        display.lineTo(-4, 8)
        display.lineTo(0, -10)
      }
    })

    return am5.Bullet.new(root, {
      sprite: graphics
    })
  })

  // Set data for all series
  daySpeedSeries.data.setAll(chartData.value)
  nightSpeedSeries.data.setAll(chartData.value)
  dayDirectionSeries.data.setAll(chartData.value)
  nightDirectionSeries.data.setAll(chartData.value)

  // Store series references
  chartSeriesMap.set('windDaySpeed', daySpeedSeries)
  chartSeriesMap.set('windNightSpeed', nightSpeedSeries)
  chartSeriesMap.set('windDayDirection', dayDirectionSeries)
  chartSeriesMap.set('windNightDirection', nightDirectionSeries)

  // Add legend
  const legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.gridLayout
    })
  )
  legend.data.setAll(chart.series.values)

  // Add cursor
  chart.set('cursor', am5xy.XYCursor.new(root, {
    behavior: 'none'
  }))
}

const createCloudHumidityChart = async () => {
  // Dynamic imports for client-side only
  const [am5, am5xy, am5themes_Dark, am5themes_Animated] = await Promise.all([
    import('@amcharts/amcharts5'),
    import('@amcharts/amcharts5/xy'),
    import('@amcharts/amcharts5/themes/Dark').then(m => m.default),
    import('@amcharts/amcharts5/themes/Animated').then(m => m.default)
  ])

  const id = 'cloud-humidity-chart'

  if (chartRoots.has(id)) {
    chartRoots.get(id)?.dispose()
  }

  const root = am5.Root.new(id)
  root.fps = 60
  chartRoots.set(id, root)

  if (colorMode.value === 'dark') {
    root.setThemes([am5themes_Dark.new(root)])
  } else {
    root.setThemes([am5themes_Animated.new(root)])
  }

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: 'none',
      wheelY: 'none',
      layout: root.verticalLayout
    })
  )

  // Create X-axis (shared by all series)
  const xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: 'day', count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 50
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )

  // Y-axis for percentages (left side) - shared by all series
  const yAxisPercent = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      strictMinMax: true,
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    })
  )
  yAxisPercent.get('renderer').labels.template.setAll({
    fill: am5.color('#4db8ff')
  })

  // Precipitation Day series
  const dayPrecipSeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Day Precipitation (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'precipChanceDay',
      valueXField: 'date',
      stroke: am5.color('#e7ebef'),
      fill: am5.color('#e7ebef'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Day: {precipChanceDay}% precip'
      })
    })
  )
  dayPrecipSeries.strokes.template.setAll({
    strokeWidth: 4,
    strokeDasharray: [8, 4] // Dashed line: 8px dash, 4px gap
  })
  dayPrecipSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Triangle.new(root, {
        width: 12,
        height: 12,
        fill: am5.color('#e7ebef'),
        stroke: am5.color('#000000'),
        strokeWidth: 1
      })
    })
  })

  // Precipitation Night series
  const nightPrecipSeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Night Precipitation (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'precipChanceNight',
      valueXField: 'date',
      stroke: am5.color('#7b7b80'),
      fill: am5.color('#7b7b80'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Night: {precipChanceNight}% precip'
      })
    })
  )
  nightPrecipSeries.strokes.template.setAll({
    strokeWidth: 4,
    strokeDasharray: [8, 4] // Dashed line: 8px dash, 4px gap
  })
  nightPrecipSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Triangle.new(root, {
        width: 12,
        height: 12,
        fill: am5.color('#7b7b80'),
        stroke: am5.color('#000000'),
        strokeWidth: 1
      })
    })
  })

  // Cloud Cover Day series
  const dayCloudSeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Day Cloud Cover (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'cloudCoverDay',
      valueXField: 'date',
      stroke: am5.color('#4db8ff'),
      fill: am5.color('#4db8ff'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Day: {cloudCoverDay}% clouds'
      })
    })
  )
  dayCloudSeries.strokes.template.setAll({ strokeWidth: 3 })
  dayCloudSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: am5.color('#4db8ff')
      })
    })
  })

  // Cloud Cover Night series
  const nightCloudSeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Night Cloud Cover (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'cloudCoverNight',
      valueXField: 'date',
      stroke: am5.color('#80d0ff'),
      fill: am5.color('#80d0ff'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Night: {cloudCoverNight}% clouds'
      })
    })
  )
  nightCloudSeries.strokes.template.setAll({ strokeWidth: 3 })
  nightCloudSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: am5.color('#80d0ff')
      })
    })
  })

  // Humidity Day series
  const dayHumiditySeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Day Humidity (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'humidityDay',
      valueXField: 'date',
      stroke: am5.color('#64b5f6'),
      fill: am5.color('#64b5f6'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Day: {humidityDay}% humidity'
      })
    })
  )
  dayHumiditySeries.strokes.template.setAll({
    strokeWidth: 3,
    strokeDasharray: [2, 3] // Dotted line: 2px dot, 3px gap
  })
  dayHumiditySeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Rectangle.new(root, {
        width: 10,
        height: 10,
        fill: am5.color('#64b5f6'),
        stroke: am5.color('#000000'),
        strokeWidth: 1
      })
    })
  })

  // Humidity Night series
  const nightHumiditySeries = chart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Night Humidity (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'humidityNight',
      valueXField: 'date',
      stroke: am5.color('#90caf9'),
      fill: am5.color('#90caf9'),
      tension: 0.5,
      tooltip: am5.Tooltip.new(root, {
        labelText: 'Night: {humidityNight}% humidity'
      })
    })
  )
  nightHumiditySeries.strokes.template.setAll({
    strokeWidth: 3,
    strokeDasharray: [2, 3] // Dotted line: 2px dot, 3px gap
  })
  nightHumiditySeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Rectangle.new(root, {
        width: 10,
        height: 10,
        fill: am5.color('#90caf9'),
        stroke: am5.color('#000000'),
        strokeWidth: 1
      })
    })
  })

  // Set data for all series
  dayPrecipSeries.data.setAll(chartData.value)
  nightPrecipSeries.data.setAll(chartData.value)
  dayCloudSeries.data.setAll(chartData.value)
  nightCloudSeries.data.setAll(chartData.value)
  dayHumiditySeries.data.setAll(chartData.value)
  nightHumiditySeries.data.setAll(chartData.value)

  // Store series references
  chartSeriesMap.set('cloudPrecipDay', dayPrecipSeries)
  chartSeriesMap.set('cloudPrecipNight', nightPrecipSeries)
  chartSeriesMap.set('cloudDay', dayCloudSeries)
  chartSeriesMap.set('cloudNight', nightCloudSeries)
  chartSeriesMap.set('cloudHumidityDay', dayHumiditySeries)
  chartSeriesMap.set('cloudHumidityNight', nightHumiditySeries)

  // Add legend
  const legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.gridLayout
    })
  )
  legend.data.setAll(chart.series.values)

  // Add cursor
  chart.set('cursor', am5xy.XYCursor.new(root, {
    behavior: 'none'
  }))
}

// Function to append new data to existing series (no redraw)
const appendNewDataPoint = (newForecastData: Forecasts) => {
  const newData = transformForecastData(newForecastData)

  // Get the last data point from new data (most recent forecast)
  const latestPoint = newData[newData.length - 1]
  if (!latestPoint) return

  // Check if this data point already exists
  const maxTempSeries = chartSeriesMap.get('maxTemp')
  if (!maxTempSeries) return

  const existingData = maxTempSeries.data.values as Array<{ date: number }>
  const alreadyExists = existingData.some(d => d.date === latestPoint.date)

  if (alreadyExists) {
    console.log('Data point already exists, skipping')
    return
  }

  // Append to all series
  chartSeriesMap.get('maxTemp')?.data.push(latestPoint)
  chartSeriesMap.get('minTemp')?.data.push(latestPoint)
  chartSeriesMap.get('uv')?.data.push(latestPoint)

  // Wind chart series
  chartSeriesMap.get('windDaySpeed')?.data.push(latestPoint)
  chartSeriesMap.get('windNightSpeed')?.data.push(latestPoint)
  chartSeriesMap.get('windDayDirection')?.data.push(latestPoint)
  chartSeriesMap.get('windNightDirection')?.data.push(latestPoint)

  // Precipitation, Cloud & Humidity chart series
  chartSeriesMap.get('cloudPrecipDay')?.data.push(latestPoint)
  chartSeriesMap.get('cloudPrecipNight')?.data.push(latestPoint)
  chartSeriesMap.get('cloudDay')?.data.push(latestPoint)
  chartSeriesMap.get('cloudNight')?.data.push(latestPoint)
  chartSeriesMap.get('cloudHumidityDay')?.data.push(latestPoint)
  chartSeriesMap.get('cloudHumidityNight')?.data.push(latestPoint)

  console.log('✅ Appended new forecast data point:', latestPoint.dayName, new Date(latestPoint.date))
}

// Setup SignalR connection for real-time forecast updates
const setupSignalR = async () => {
  try {
    await signalR.connect(undefined, (newForecast: Forecasts) => {
      console.log('🔄 Received forecast update via SignalR')
      appendNewDataPoint(newForecast)
    })
    isLiveUpdateActive.value = true
  } catch (error) {
    console.error('Failed to connect to SignalR for forecast updates:', error)
    isLiveUpdateActive.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    if (chartData.value.length > 0) {
      initializeCharts()
      // Setup SignalR connection after charts are initialized
      setupSignalR()
    }
  })
})

watch(() => chartData.value, (newData) => {
  if (newData && newData.length > 0) {
    initializeCharts()
  }
})

watch(() => colorMode.value, () => {
  if (chartData.value && chartData.value.length > 0) {
    initializeCharts()
  }
})

onUnmounted(() => {
  // Close SignalR connection
  signalR.disconnect()
  isLiveUpdateActive.value = false

  chartRoots.forEach(root => root.dispose())
  chartRoots.clear()
  chartSeriesMap.clear()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Single Unified Chart -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">
          Temperature & UV Forecast
        </h2>
        <p class="text-sm text-muted mt-1">
          Temperature trends and UV index over 15 days
        </p>
      </template>
      <div
        id="unified-chart"
        class="h-[700px]"
      />
    </UCard>

    <!-- Wind Analysis Chart -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">
          Wind Forecast Analysis
        </h2>
        <p class="text-sm text-muted mt-1">
          Detailed wind speed and direction for day and night periods over 15 days
        </p>
      </template>
      <div
        id="wind-chart"
        class="h-[500px]"
      />
    </UCard>

    <!-- Cloud Cover & Humidity Chart -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">
          Cloud Cover & Humidity Analysis
        </h2>
        <p class="text-sm text-muted mt-1">
          Cloud cover and humidity levels for day and night periods over 15 days
        </p>
      </template>
      <div
        id="cloud-humidity-chart"
        class="h-[500px]"
      />
    </UCard>

    <!-- Link back to regular forecast page -->
    <div class="text-center py-8">
      <NuxtLink
        to="/forecast"
        class="text-primary hover:underline"
      >
        View detailed forecast →
      </NuxtLink>
    </div>
  </div>
</template>
