import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import type {
  GraphDataPoint,
  WindDataPoint,
  RainDataPoint,
} from "~/types/weather";
import type { TimeframeConfig } from "./useTimeframeConfig";

interface XYChartConfig {
  id: string;
  valueFields: string[];
  tooltipText: string[];
  strokeFillColors: string[];
  labelText: string;
  min?: number;
  max?: number;
  bullets?: boolean;
  connected?: boolean;
  strokeWidth?: number;
  fps?: number;
  timeframeConfig?: TimeframeConfig;
}

interface PolarChartConfig {
  id: string;
  valueYFields: string[];
  tooltipText: string[];
  strokeFillColors: string[];
  valueXFields: string[];
  min: number;
  max: number;
  data: RainDataPoint[] | WindDataPoint[];
  strokeWidth?: number;
  fps?: number;
  seriesNames?: string[];
  showLegend?: boolean;
  labelText?: string;
}

export const useAmCharts = () => {
  const chartRoots = new Map<string, am5.Root>();
  const colorMode = useColorMode();

  /**
   * Create an XY Line Chart with date-based X-axis
   */
  const createXYChart = (config: XYChartConfig, data: GraphDataPoint[]) => {
    const {
      id,
      valueFields,
      tooltipText,
      strokeFillColors,
      // labelText,
      min,
      max,
      bullets = false,
      fps = 60,
      timeframeConfig,
    } = config;

    // Dispose existing chart if any
    if (chartRoots.has(id)) {
      chartRoots.get(id)?.dispose();
    }

    // Check if DOM element exists before creating chart
    if (typeof document !== "undefined") {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(
          `Element with id "${id}" not found, skipping chart creation`,
        );
        return;
      }
    }

    // Create root element
    const root = am5.Root.new(id);
    root.fps = fps;
    chartRoots.set(id, root);

    // Set themes based on color mode
    if (colorMode.value === "dark") {
      root.setThemes([am5themes_Dark.new(root)]);
    } else {
      root.setThemes([am5themes_Animated.new(root)]);
    }

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        pinchZoomX: true,
      }),
    );

    // Add cursor
    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX",
      }),
    );
    cursor.lineY.set("visible", false);

    // Prepare axis configuration based on timeframe
    const axisConfig: am5xy.IDateAxisSettings<am5xy.AxisRenderer> = {
      maxDeviation: 0.5,
      baseInterval: {
        timeUnit: timeframeConfig?.timeUnit ?? "minute",
        count: timeframeConfig?.baseIntervalCount ?? 5,
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 60,
      }),
      tooltip: am5.Tooltip.new(root, {}),
    };

    // Apply timeframe-specific settings if provided
    if (timeframeConfig) {
      axisConfig.baseInterval = {
        timeUnit: timeframeConfig.timeUnit,
        count: timeframeConfig.baseIntervalCount,
      };
      axisConfig.gridIntervals = [
        {
          timeUnit: timeframeConfig.timeUnit,
          count: timeframeConfig.gridCount,
        },
      ];
      // Apply date format to tooltip
      axisConfig.tooltipDateFormat = timeframeConfig.dateFormat;
    } else {
      // TODO: Determine if this is needed ?
      // Default settings (fallback to hour-based)
      axisConfig.baseInterval = {
        timeUnit: "hour",
        count: 1,
      };
    }

    // Create X-axis (Date axis)
    const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, axisConfig));

    // Create Y-axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min,
        max,
        strictMinMax: min !== undefined || max !== undefined,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30,
          strokeWidth: 1.2,
        }),
      }),
    );

    // Add label
    chart.children.unshift(
      am5.Label.new(root, {
        // text: labelText,
        fontSize: 18,
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
      }),
    );

    // Add series
    for (let i = 0; i < valueFields.length; i++) {
      const valueField = valueFields[i];
      const tooltip = tooltipText[i];
      const color = strokeFillColors[i];

      // Skip if required fields are undefined
      if (!valueField || !tooltip || !color) continue;

      const series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, {
          name: `Series${id}${i}`,
          xAxis,
          yAxis,
          valueYField: valueField,
          valueXField: "ot",
          tooltip: am5.Tooltip.new(root, {
            labelText: tooltip,
            getFillFromSprite: true,
          }),
          fill: am5.color(color),
          stroke: am5.color(color),
          tension: 0.3,
        }),
      );

      // Add bullets if specified
      if (bullets) {
        series.bullets.push(() => {
          return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
              radius: 2.8,
              fill: am5.color(color),
            }),
          });
        });
        series.strokes.template.setAll({
          strokeDasharray: [0, 1],
        });
      }

      series.strokes.template.setAll({
        strokeWidth: 2, // Adjust pixel thickness here
      });
      series.data.setAll(data);
    }

    return root;
  };

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
      labelText,
    } = config;

    // Dispose existing chart if any
    if (chartRoots.has(id)) {
      chartRoots.get(id)?.dispose();
    }

    // Check if DOM element exists before creating chart
    if (typeof document !== "undefined") {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(
          `Element with id "${id}" not found, skipping chart creation`,
        );
        return;
      }
    }

    // Create root element
    const root = am5.Root.new(id);
    root.fps = fps;
    chartRoots.set(id, root);

    // Set themes based on color mode
    if (colorMode.value === "dark") {
      root.setThemes([am5themes_Dark.new(root)]);
    } else {
      root.setThemes([am5themes_Animated.new(root)]);
    }

    // Create chart
    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
      }),
    );

    // Add label if provided
    if (labelText) {
      chart.children.unshift(
        am5.Label.new(root, {
          // text: labelText,
          fontSize: 16,
          fontWeight: "500",
          textAlign: "center",
          x: am5.percent(50),
          centerX: am5.percent(50),
          paddingTop: 0,
          paddingBottom: 10,
        }),
      );
    }

    // Add cursor
    const cursor = chart.set(
      "cursor",
      am5radar.RadarCursor.new(root, {
        behavior: "none",
      }),
    );
    cursor.lineY.set("visible", false);
    cursor.lineX.set("visible", false);

    // Create X-axis (circular)
    const xRenderer = am5radar.AxisRendererCircular.new(root, {
      minGridDistance: 40,
    });
    xRenderer.labels.template.setAll({
      radius: 0,
      textAlign: "center",
    });
    xRenderer.grid.template.setAll({
      location: 0,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min,
        max,
        strictMinMax: true,
        renderer: xRenderer,
      }),
    );
    
    // Hide the first label (0°) to prevent overlap with max value (360°)
    xAxis.get("renderer").labels.template.adapters.add("text", (text, target) => {
      const dataItem = target.dataItem as any;
      if (dataItem && dataItem.get) {
        const value = dataItem.get("value");
        // Hide the label if its value equals the minimum (0)
        if (value === min) {
          return "";
        }
      }
      return text;
    });

    // Calculate Y-axis range from data
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let i = 0; i < valueYFields.length; i++) {
      const field = valueYFields[i];

      // Skip if field is undefined
      if (!field) continue;

      data.forEach((item) => {
        const value = item[field as keyof typeof item];
        if (value != null && typeof value === "number") {
          yMin = Math.min(yMin, value);
          yMax = Math.max(yMax, value);
        }
      });
    }

    // Add padding (10% on each side)
    const yRange = yMax - yMin;
    const yPadding = yRange * 0.1;

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: yMin - yPadding,
        max: yMax + yPadding,
        strictMinMax: true,
        renderer: am5radar.AxisRendererRadial.new(root, {
          minGridDistance: 20,
        }),
      }),
    );

    // Add series
    for (let i = 0; i < valueYFields.length; i++) {
      const color = strokeFillColors[i];

      // Skip if required fields are undefined
      if (!color) continue;

      const series = chart.series.push(
        am5radar.RadarLineSeries.new(root, {
          name: seriesNames ? seriesNames[i] : `Series${id}${i}`,
          xAxis,
          yAxis,
          valueYField: valueYFields[i],
          valueXField: valueXFields[i],
          tooltip: am5.Tooltip.new(root, {
            labelText: tooltipText[i],
          }),
          connectEnds: false,
          sequencedInterpolation: true,
          sequencedDelay: 10,
        }),
      );

      // Add bullets
      series.bullets.push(() => {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 4,
            fill: am5.color(color),
            strokeWidth,
            stroke: root.interfaceColors.get("background"),
          }),
        });
      });

      // Configure strokes
      series.strokes.template.setAll({
        strokeDasharray: [0, 1],
        stroke: am5.color(color),
      });

      series.data.setAll(data);
    }

    // Add legend if specified
    if (showLegend) {
      const legend = chart.children.push(am5.Legend.new(root, {}));
      legend.data.setAll(chart.series.values);
    }

    xAxis.data.setAll(data);

    return root;
  };

  /**
   * Dispose a specific chart
   */
  const disposeChart = (id: string) => {
    if (chartRoots.has(id)) {
      chartRoots.get(id)?.dispose();
      chartRoots.delete(id);
    }
  };

  /**
   * Dispose all charts
   */
  const disposeAllCharts = () => {
    chartRoots.forEach((root) => root.dispose());
    chartRoots.clear();
  };

  return {
    createXYChart,
    createPolarChart,
    disposeChart,
    disposeAllCharts,
    colorMode,
  };
};
