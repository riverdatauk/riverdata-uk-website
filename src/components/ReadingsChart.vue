<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ApexCharts from 'apexcharts';

type DataPoint = [ts: number, val: number];
type MultipleDataSeries = Record<string, DataPoint[]>;

const props = withDefaults(defineProps<{ multipleReadings?: MultipleDataSeries }>(), {
});

const emit = defineEmits(['chart']);

const targetRef = ref();

onMounted(() => {
  const series = [];
  Object.entries(props.multipleReadings).forEach(([measureId, data]) => {
    console.log({ measureId });
    series.push({
      name: measureId,
      data,
    });
  });

  const chartOptions = {
    series,
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: 'Stock Price Movement',
      align: 'left',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        },
      },
      title: {
        text: 'Price',
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        },
      },
    },
  };

  console.log(targetRef.value);
  const chart = new ApexCharts(targetRef.value, chartOptions);
  chart.render();
  emit('chart', { chart: targetRef.value });
});
</script>

<template>
  <div ref="targetRef"></div>
  <div>{{ props.multipleReadings }}</div>
</template>
