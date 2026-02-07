<script setup lang="ts">
import type { Forecasts } from '~/types/weather'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

const { data: forecast, status, error } = await useFetch<Forecasts>('/api/forecast')

useHead({
  title: 'Forecast Charts',
  meta: [
    { name: 'description', content: '15-Day weather forecast visualizations' }
  ]
})

const colorMode = useColorMode()
const chartRoots = new Map<string, am5.Root>()
const chartSeriesMap = new Map<string, am5xy.XYSeries>()
let eventSource: EventSource | null = null

// Transform forecast data for charts
const transformForecastData = (forecastData: Forecasts) => {
  if (!forecastData) return []
  
  return forecastData.dayOfWeek.map((day, i) => ({
    date: new Date(forecastData.validTimeLocal[i]).getTime(),
    dayName: day,
    tempMax: forecastData.temperatureMax[i],
    tempMin: forecastData.temperatureMin[i],
    calendarTempMax: forecastData.calendarDayTemperatureMax[i],
    calendarTempMin: forecastData.calendarDayTemperatureMin[i],
    precipChanceDay: forecastData.daypart[0]?.precipChance[i * 2] ?? 0,
    precipChanceNight: forecastData.daypart[0]?.precipChance[i * 2 + 1] ?? 0,
    qpf: forecastData.qpf[i] ?? 0,
    cloudCoverDay: forecastData.daypart[0]?.cloudCover[i * 2] ?? 0,
    cloudCoverNight: forecastData.daypart[0]?.cloudCover[i * 2 + 1] ?? 0,
    humidityDay: forecastData.daypart[0]?.relativeHumidity[i * 2] ?? 0,
    humidityNight: forecastData.daypart[0]?.relativeHumidity[i * 2 + 1] ?? 0,
    sunriseTime: new Date(forecastData.sunriseTimeLocal[i]).getHours() + new Date(forecastData.sunriseTimeLocal[i]).getMinutes() / 60 + new Date(forecastData.sunriseTimeLocal[i]).getSeconds() / 3600,
    sunsetTime: new Date(forecastData.sunsetTimeLocal[i]).getHours() + new Date(forecastData.sunsetTimeLocal[i]).getMinutes() / 60 + new Date(forecastData.sunsetTimeLocal[i]).getSeconds() / 3600,
    sunriseTimeFormatted: new Date(forecastData.sunriseTimeLocal[i]).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    sunsetTimeFormatted: new Date(forecastData.sunsetTimeLocal[i]).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    moonPhaseDay: forecastData.moonPhaseDay[i],
    moonPhase: forecastData.moonPhase[i],
    uvIndexDay: forecastData.daypart[0]?.uvIndex[i * 2] ?? 0,
    uvIndexNight: forecastData.daypart[0]?.uvIndex[i * 2 + 1] ?? 0,
    windSpeedDay: forecastData.daypart[0]?.windSpeed[i * 2] ?? 0,
    windSpeedNight: forecastData.daypart[0]?.windSpeed[i * 2 + 1] ?? 0
  }))
}

const chartData = computed(() => transformForecastData(forecast.value!))

// Initialize charts
const initializeCharts = () => {
  if (!chartData.value.length) return

  createUnifiedChart()
}

const createUnifiedChart = () => {
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
    fill: am5.color('#5c8fff')
  })

  // Y-axis for wind speed (left side, secondary)
  const yAxisWind = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {
        opposite: false
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )
  yAxisWind.get('renderer').labels.template.setAll({
    fill: am5.color('#11ff1e')
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
    am5xy.LineSeries.new(root, {
      name: 'Max Temp (°C)',
      xAxis,
      yAxis: yAxisTemp,
      valueYField: 'tempMax',
      valueXField: 'date',
      stroke: am5.color('#ff4343'),
      fill: am5.color('#ff4343'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName}: {tempMax}°C max'
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
    am5xy.LineSeries.new(root, {
      name: 'Min Temp (°C)',
      xAxis,
      yAxis: yAxisTemp,
      valueYField: 'tempMin',
      valueXField: 'date',
      stroke: am5.color('#0ec5fd'),
      fill: am5.color('#0ec5fd'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName}: {tempMin}°C min'
      })
    })
  )
  minTempSeries.strokes.template.setAll({ strokeWidth: 3 })
  minTempSeries.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 4,
        fill: am5.color('#0ec5fd')
      })
    })
  })

  // Precipitation chance series
  const dayPrecipSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Day Precip (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'precipChanceDay',
      valueXField: 'date',
      stroke: am5.color('#5c8fff'),
      fill: am5.color('#5c8fff'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName} Day: {precipChanceDay}% precip'
      })
    })
  )
  dayPrecipSeries.strokes.template.setAll({ strokeWidth: 2, strokeDasharray: [3, 3] })

  const nightPrecipSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Night Precip (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'precipChanceNight',
      valueXField: 'date',
      stroke: am5.color('#87f7ff'),
      fill: am5.color('#87f7ff'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName} Night: {precipChanceNight}% precip'
      })
    })
  )
  nightPrecipSeries.strokes.template.setAll({ strokeWidth: 2, strokeDasharray: [3, 3] })

  // Humidity series
  const dayHumiditySeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Day Humidity (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'humidityDay',
      valueXField: 'date',
      stroke: am5.color('#9d6fff'),
      fill: am5.color('#9d6fff'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName} Day: {humidityDay}% humidity'
      })
    })
  )
  dayHumiditySeries.strokes.template.setAll({ strokeWidth: 2 })

  const nightHumiditySeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Night Humidity (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'humidityNight',
      valueXField: 'date',
      stroke: am5.color('#d19dff'),
      fill: am5.color('#d19dff'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName} Night: {humidityNight}% humidity'
      })
    })
  )
  nightHumiditySeries.strokes.template.setAll({ strokeWidth: 2 })

  // Cloud cover series
  const dayCloudSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Day Cloud (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'cloudCoverDay',
      valueXField: 'date',
      stroke: am5.color('#7fdfff'),
      fill: am5.color('#7fdfff'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName} Day: {cloudCoverDay}% clouds'
      })
    })
  )
  dayCloudSeries.strokes.template.setAll({ strokeWidth: 2, strokeDasharray: [5, 5] })

  const nightCloudSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Night Cloud (%)',
      xAxis,
      yAxis: yAxisPercent,
      valueYField: 'cloudCoverNight',
      valueXField: 'date',
      stroke: am5.color('#c5f5ff'),
      fill: am5.color('#c5f5ff'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName} Night: {cloudCoverNight}% clouds'
      })
    })
  )
  nightCloudSeries.strokes.template.setAll({ strokeWidth: 2, strokeDasharray: [5, 5] })

  // Wind speed series
  const dayWindSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Day Wind (km/h)',
      xAxis,
      yAxis: yAxisWind,
      valueYField: 'windSpeedDay',
      valueXField: 'date',
      stroke: am5.color('#11ff1e'),
      fill: am5.color('#11ff1e'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName} Day: {windSpeedDay} km/h'
      })
    })
  )
  dayWindSeries.strokes.template.setAll({ strokeWidth: 2 })

  const nightWindSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'Night Wind (km/h)',
      xAxis,
      yAxis: yAxisWind,
      valueYField: 'windSpeedNight',
      valueXField: 'date',
      stroke: am5.color('#7fff88'),
      fill: am5.color('#7fff88'),
      tooltip: am5.Tooltip.new(root, {
        labelText: '{dayName} Night: {windSpeedNight} km/h'
      })
    })
  )
  nightWindSeries.strokes.template.setAll({ strokeWidth: 2 })

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
        labelText: '{dayName}: UV {uvIndexDay}'
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
  dayPrecipSeries.data.setAll(chartData.value)
  nightPrecipSeries.data.setAll(chartData.value)
  dayHumiditySeries.data.setAll(chartData.value)
  nightHumiditySeries.data.setAll(chartData.value)
  dayCloudSeries.data.setAll(chartData.value)
  nightCloudSeries.data.setAll(chartData.value)
  dayWindSeries.data.setAll(chartData.value)
  nightWindSeries.data.setAll(chartData.value)
  uvSeries.data.setAll(chartData.value)
  
  // Store series references for incremental updates
  chartSeriesMap.set('maxTemp', maxTempSeries)
  chartSeriesMap.set('minTemp', minTempSeries)
  chartSeriesMap.set('dayPrecip', dayPrecipSeries)
  chartSeriesMap.set('nightPrecip', nightPrecipSeries)
  chartSeriesMap.set('dayHumidity', dayHumiditySeries)
  chartSeriesMap.set('nightHumidity', nightHumiditySeries)
  chartSeriesMap.set('dayCloud', dayCloudSeries)
  chartSeriesMap.set('nightCloud', nightCloudSeries)
  chartSeriesMap.set('dayWind', dayWindSeries)
  chartSeriesMap.set('nightWind', nightWindSeries)
  chartSeriesMap.set('uv', uvSeries)
  
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
  
  // Check if this data point already exists
  const maxTempSeries = chartSeriesMap.get('maxTemp')
  if (!maxTempSeries) return
  
  const existingData = maxTempSeries.data.values
  const alreadyExists = existingData.some((d: any) => d.date === latestPoint.date)
  
  if (alreadyExists) {
    console.log('Data point already exists, skipping')
    return
  }
  
  // Append to all series
  chartSeriesMap.get('maxTemp')?.data.push(latestPoint)
  chartSeriesMap.get('minTemp')?.data.push(latestPoint)
  chartSeriesMap.get('dayPrecip')?.data.push(latestPoint)
  chartSeriesMap.get('nightPrecip')?.data.push(latestPoint)
  chartSeriesMap.get('dayHumidity')?.data.push(latestPoint)
  chartSeriesMap.get('nightHumidity')?.data.push(latestPoint)
  chartSeriesMap.get('dayCloud')?.data.push(latestPoint)
  chartSeriesMap.get('nightCloud')?.data.push(latestPoint)
  chartSeriesMap.get('dayWind')?.data.push(latestPoint)
  chartSeriesMap.get('nightWind')?.data.push(latestPoint)
  chartSeriesMap.get('uv')?.data.push(latestPoint)
  
  console.log('✅ Appended new forecast data point:', latestPoint.dayName, new Date(latestPoint.date))
}

// Setup SSE connection for real-time updates
const setupSSE = () => {
  if (eventSource) {
    eventSource.close()
  }
  
  eventSource = new EventSource('/api/weather/stream')
  
  eventSource.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data)
      
      if (message.type === 'initial') {
        console.log('📡 Received initial forecast data')
        // Initial data already loaded, no action needed
      } else if (message.type === 'update') {
        console.log('🔄 Received forecast update:', message.timestamp)
        appendNewDataPoint(message.data)
      } else if (message.type === 'heartbeat') {
        console.log('💓 Heartbeat received')
      } else if (message.type === 'error') {
        console.error('❌ SSE Error:', message.message)
      }
    } catch (error) {
      console.error('Error parsing SSE message:', error)
    }
  }
  
  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error)
    eventSource?.close()
    
    // Reconnect after 10 seconds
    setTimeout(() => {
      console.log('Reconnecting SSE...')
      setupSSE()
    }, 10000)
  }
  
  console.log('✅ SSE connection established')
}


// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    if (chartData.value.length > 0) {
      initializeCharts()
      // Setup SSE connection after charts are initialized
      setupSSE()
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
  // Close SSE connection
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  
  chartRoots.forEach((root) => root.dispose())
  chartRoots.clear()
  chartSeriesMap.clear()
})
</script>

<template>
  <div class="container mx-auto px-4">
    <br>
    
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">
        15-Day Forecast Charts
      </h1>
      <p class="text-muted">
        Visual representation of weather forecast data
      </p>
    </div>

    <!-- Loading state -->
    <div
      v-if="status === 'pending'"
      class="text-center py-8"
    >
      <p>Loading forecast data...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-center py-8 text-red-500"
    >
      <p>Error loading forecast: {{ error.message }}</p>
    </div>

    <!-- Unified Chart -->
    <div
      v-else-if="forecast && chartData.length > 0"
      class="space-y-6"
    >
      <!-- Single Unified Chart -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            Complete Weather Forecast
          </h2>
          <p class="text-sm text-muted mt-1">
            All weather metrics in one view - Temperature, Precipitation, Humidity, Cloud Cover, Wind Speed, and UV Index
          </p>
        </template>
        <div
          id="unified-chart"
          class="h-[700px]"
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
  </div>
</template>
