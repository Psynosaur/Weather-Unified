import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import * as am5radar from '@amcharts/amcharts5/radar'
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark'
import type { GraphDataPoint, WindDataPoint, RainDataPoint } from '~/types/weather'

interface XYChartConfig {
  id: string
  valueFields: string[]
  tooltipText: string[]
  strokeFillColors: string[]
  labelText: string
  min?: number
  max?: number
  bullets?: boolean
  connected?: boolean
  strokeWidth?: number
  fps?: number
}

interface PolarChartConfig {
  id: string
  valueYFields: string[]
  tooltipText: string[]
  strokeFillColors: string[]
  valueXFields: string[]
  min: number
  max: number
  data: RainDataPoint[] | WindDataPoint[]
  strokeWidth?: number
  fps?: number
  seriesNames?: string[]
  showLegend?: boolean
  labelText?: string
}

export const useAmCharts = () => {
  const chartRoots = new Map<string, am5.Root>()

  /**
   * Create an XY Line Chart with date-based X-axis
   */
  const createXYChart = (config: XYChartConfig, data: GraphDataPoint[]) => {
    const {
      id,
      valueFields,
      tooltipText,
      strokeFillColors,
      labelText,
      min,
      max,
      bullets = false,
      fps = 60
    } = config

    // Dispose existing chart if any
    if (chartRoots.has(id)) {
      chartRoots.get(id)?.dispose()
    }

    // Create root element
    const root = am5.Root.new(id)
    root.fps = fps
    chartRoots.set(id, root)

    // Set themes
    root.setThemes([am5themes_Dark.new(root)])

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        pinchZoomX: true
      })
    )

    // Add cursor
    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
      behavior: 'zoomX'
    }))
    cursor.lineY.set('visible', false)

    // Create X-axis (Date axis)
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
          timeUnit: 'minute',
          count: 5
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 60
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    )

    // Create Y-axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min,
        max,
        strictMinMax: min !== undefined || max !== undefined,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30,
          strokeWidth: 1.2
        })
      })
    )

    // Add label
    chart.children.unshift(
      am5.Label.new(root, {
        // text: labelText,
        fontSize: 18,
        textAlign: 'center',
        x: am5.percent(50),
        centerX: am5.percent(50)
      })
    )

    // Add series
    for (let i = 0; i < valueFields.length; i++) {
      const series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
          name: `Series${id}${i}`,
          xAxis,
          yAxis,
          valueYField: valueFields[i],
          valueXField: 'ot',
          tooltip: am5.Tooltip.new(root, {
            labelText: tooltipText[i],
            getFillFromObject: true
          }),
          fill: am5.color(strokeFillColors[i]),
          stroke: am5.color(strokeFillColors[i]),
          tension: 0.3
        })
      )

      // Add bullets if specified
      if (bullets) {
        series.bullets.push(() => {
          return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
              radius: 1.4,
              fill: am5.color(strokeFillColors[i])
            })
          })
        })
        series.strokes.template.setAll({
          strokeDasharray: [0, 1]
        })
      }

      series.data.setAll(data)
    }

    return root
  }

  /**
   * Create a Polar/Radar Chart (for roses)
   */
  const createPolarChart = (config: PolarChartConfig) => {
    const {
      id,
      valueYFields,
      tooltipText,
      strokeFillColors,
      valueXFields,
      min,
      max,
      data,
      strokeWidth = 0.5,
      fps = 60,
      seriesNames,
      showLegend = false,
      labelText
    } = config

    // Dispose existing chart if any
    if (chartRoots.has(id)) {
      chartRoots.get(id)?.dispose()
    }

    // Create root element
    const root = am5.Root.new(id)
    root.fps = fps
    chartRoots.set(id, root)

    // Set themes
    root.setThemes([am5themes_Dark.new(root)])

    // Create chart
    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout
      })
    )

    // Add label if provided
    if (labelText) {
      chart.children.unshift(
        am5.Label.new(root, {
          // text: labelText,
          fontSize: 16,
          fontWeight: '500',
          textAlign: 'center',
          x: am5.percent(50),
          centerX: am5.percent(50),
          paddingTop: 0,
          paddingBottom: 10
        })
      )
    }

    // Add cursor
    const cursor = chart.set('cursor', am5radar.RadarCursor.new(root, {
      behavior: 'none'
    }))
    cursor.lineY.set('visible', false)
    cursor.lineX.set('visible', false)

    // Create X-axis (circular)
    const xRenderer = am5radar.AxisRendererCircular.new(root, {
      minGridDistance: 40
    })
    xRenderer.labels.template.setAll({
      radius: 0,
      textAlign: 'center'
    })
    xRenderer.grid.template.setAll({
      location: 0,
      maxLabelPosition: 0.99
    })

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min,
        max,
        strictMinMax: true,
        renderer: xRenderer
      })
    )

    // Calculate Y-axis range from data
    let yMin = Infinity
    let yMax = -Infinity

    for (let i = 0; i < valueYFields.length; i++) {
      data.forEach((item) => {
        const value = item[valueYFields[i]]
        if (value != null) {
          yMin = Math.min(yMin, value)
          yMax = Math.max(yMax, value)
        }
      })
    }

    // Add padding (10% on each side)
    const yRange = yMax - yMin
    const yPadding = yRange * 0.1

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: yMin - yPadding,
        max: yMax + yPadding,
        strictMinMax: true,
        renderer: am5radar.AxisRendererRadial.new(root, {
          minGridDistance: 20
        })
      })
    )

    // Add series
    for (let i = 0; i < valueYFields.length; i++) {
      const series = chart.series.push(
        am5radar.RadarLineSeries.new(root, {
          name: seriesNames ? seriesNames[i] : `Series${id}${i}`,
          xAxis,
          yAxis,
          valueYField: valueYFields[i],
          valueXField: valueXFields[i],
          tooltip: am5.Tooltip.new(root, {
            labelText: tooltipText[i]
          }),
          connectEnds: false,
          sequencedInterpolation: true,
          sequencedInterpolationDelay: 10
        })
      )

      // Add bullets
      series.bullets.push(() => {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 4,
            fill: am5.color(strokeFillColors[i]),
            strokeWidth,
            stroke: root.interfaceColors.get('background')
          })
        })
      })

      // Configure strokes
      series.strokes.template.setAll({
        strokeDasharray: [0, 1],
        stroke: am5.color(strokeFillColors[i])
      })

      series.data.setAll(data)
    }

    // Add legend if specified
    if (showLegend) {
      const legend = chart.children.push(am5.Legend.new(root, {}))
      legend.data.setAll(chart.series.values)
    }

    xAxis.data.setAll(data)

    return root
  }

  /**
   * Dispose a specific chart
   */
  const disposeChart = (id: string) => {
    if (chartRoots.has(id)) {
      chartRoots.get(id)?.dispose()
      chartRoots.delete(id)
    }
  }

  /**
   * Dispose all charts
   */
  const disposeAllCharts = () => {
    chartRoots.forEach((root) => root.dispose())
    chartRoots.clear()
  }

  return {
    createXYChart,
    createPolarChart,
    disposeChart,
    disposeAllCharts
  }
}
