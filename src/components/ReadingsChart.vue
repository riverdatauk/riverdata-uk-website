<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ApexCharts from 'apexcharts';
import { toDateTimeString } from '../api-client/utils';
import { parseMeasureId } from '../api-client/measure';

type DataPoint = [ts: number, val: number];
type MultipleDataSeries = Record<string, DataPoint[]>;

const props = defineProps<{ readings?: MultipleDataSeries }>();

// const emit = defineEmits(['chart']);

const chartRefs = ref([]);

type ChartDataTypeOptions = Record<
  'flow' | 'level',
  {
    axisTitle: string;
    formatter: (value: number) => string;
    tooltip: {
      title: { formatter: () => string };
      formatter: (value: number) => string;
    };
  }
>;

interface ChartTypeOptionsOptions {
  title: string;
}

const chartTypeOptions: ChartDataTypeOptions = {
  flow: {
    axisTitle: 'm³/s',
    formatter: (value: number) => value.toFixed(0),
    tooltip: {
      title: { formatter: () => 'Flow' },
      formatter: (value: number) => value.toFixed(0) + ' m<sup>3</sup>/s',
    },
  },
  level: {
    axisTitle: 'm',
    formatter: (value: number) => value.toFixed(1),
    tooltip: {
      title: { formatter: () => 'Level' },
      formatter: (value: number) => value.toFixed(1) + ' m',
    },
  },
};

type ChartDataTypes = 'flow' | 'level';

const toolbar = {
  // show: true,
  // offsetX: 0,
  // offsetY: 0,
  tools: {
    // download: true,
    // selection: true,
    // zoom: true,
    // zoomin: true,
    // zoomout: true,
    // pan: true,
    // reset: true, // | '<img src="/static/icons/reset.png" width="20">',
    // customIcons: []
  },
  export: {
    csv: {
      // filename: undefined,
      // columnDelimiter: ',',
      // headerCategory: 'category',
      // headerValue: 'value',
      dateFormatter(timestamp: Date | number | string) {
        return new Date(timestamp).toISOString();
      },
    },
    // svg: { filename: undefined },
    // png: { filename: undefined },
  },
  // autoSelected: 'zoom',
};

const getTypeOptions = (
  type: ChartDataTypes,
  { title }: ChartTypeOptionsOptions
): Record<string, unknown> => {
  const typeOptions = chartTypeOptions[type];
  return {
    chart: {
      height: 360,
      zoom: { autoScaleYaxis: true },
      toolbar,
    },
    grid: { xaxis: { lines: { show: true } } },
    title: { text: title },
    tooltip: {
      x: { formatter: (value: number) => toDateTimeString(value) },
      y: typeOptions.tooltip,
    },
    xaxis: { type: 'datetime' },
    yaxis: {
      labels: { formatter: typeOptions.formatter },
      title: { text: typeOptions.axisTitle },
    },
  };
};

onMounted(() => {
  Object.entries(props.readings).forEach(([measureId, data], i) => {
    // const readings = Object.entries(props.readings);
    // const [measureId, data] = readings[1];
    const measure = parseMeasureId(measureId);
    // stationId,
    // qualifiedParameter,
    // parameter,
    // if (measure.parameter !== 'flow') return;
    const chartDataType = measure.parameter;
    const chartOptions = getTypeOptions(chartDataType, {
      title: measureId,
    });
    chartOptions.series = [{ name: measureId, data }];
    chartOptions.chart.id = measureId;
    chartOptions.chart.group = measure.stationId;
    const flow = new ApexCharts(chartRefs.value[i], chartOptions);
    flow.render();
  });

  // emit('chart', { chart: { flow, level } });
});
</script>

<template>
  <div
    v-for="measureId in Object.keys(readings)"
    ref="chartRefs"
    :key="measureId"
  ></div>
</template>
