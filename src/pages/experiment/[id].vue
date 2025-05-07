<script setup>
import {getAllPlantsOfExperiment, getTemperatureData, getExperimentById} from "@/scripts/api.js";
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import HeaderAppBar from '@/components/header-app-bar.vue'
import VideoJsPlayer from '@/components/videoplayer.vue'

const route = useRoute()
const experimentId = route.params.id

const plantItems = ref([])
getAllPlantsOfExperiment(experimentId).then(response => {
  plantItems.value = response.map(plant => ({
    uid: plant.uid,
    plantType: plant.plantType,
    table: plant.tableId,
  }))
})


// Example data for tables
const germinationHeaders = [
  { text: 'Линия', value: 'line' },
  { text: '5x2', value: 'v1' },
  { text: '12x8', value: 'v2' },
  { text: '13x8', value: 'v3' },
  { text: 'Средн', value: 'avg' },
]
const germinationItems = [
  { line: 'Я-1293', v1: 237, v2: 16, v3: 37, avg: 4.3 },
  { line: 'Я-1293', v1: 262, v2: 16, v3: 23, avg: 6 },
  { line: 'Я-1293', v1: 159, v2: 3, v3: 24, avg: 4 },
  { line: 'Средн', v1: 237, v2: 16, v3: 37, avg: 4.3 },
]
const sowingHeaders = [
  { text: 'Линия', value: 'line' },
  { text: '5x2', value: 'v1' },
  { text: '12x8', value: 'v2' },
  { text: '13x8', value: 'v3' },
  { text: 'Средн', value: 'avg' },
]
const sowingItems = germinationItems



const infoPanels = ref([
  { title: 'Фотопериод', content: '16/8' },
  { title: 'Температура', content: 'День: 24°C, Ночь: 21°C' },
  { title: 'Влажность', content: 'День: 60%, Ночь: 50%' },
  { title: 'Полив', content: 'Автоматический' },
  { title: 'Освещение', content: 'LED' },
])

// Chart data

const tempData = ref({
  labels: [],
  datasets: [{
    label: 'Температура (°C)',
    data: [],
    borderColor: '#FF6384',
    tension: 0.4,
    fill: false
  }]
})

const formatTimeLabel = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const updateTemperatureData = async () => {
  try {
    const experiment = await getExperimentById(experimentId)
    const temperatureResponse = await getTemperatureData("belgorod", experiment.startDate, experiment.endDate)
    
    tempData.value = {
      labels: temperatureResponse.map(item => formatTimeLabel(item[0])),
      datasets: [{
        label: 'Температура (°C)',
        data: temperatureResponse.map(item => item[1]),
        borderColor: '#FF6384',
        tension: 0.4,
        fill: false
      }]
    }
  } catch (error) {
    console.error('Error fetching temperature data:', error)
  }
}

// Call the update function
updateTemperatureData()

import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)


// const tempData = {
//   labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
//   datasets: [
//     {
//       label: 'Температура (°C)',
//       data: [21, 22, 23, 24, 24, 23],
//       borderColor: '#FF6384',
//       tension: 0.4,
//       fill: false
//     }
//   ]
// }

const humidityData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  datasets: [
    {
      label: 'Влажность (%)',
      data: [50, 52, 55, 60, 58, 55],
      borderColor: '#36A2EB',
      tension: 0.4,
      fill: false
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    }
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
}
</script>

<template>
  <v-app>
    <HeaderAppBar title="Яровой рапс в условиях Speed Breeding" />

    <v-main class="px-15">
      <v-container fluid class="pa-0" >
        <v-row class="pt-6">
          <v-col cols="12" md="3">
            <v-sheet class="pa-4 mb-2" elevation="2">
              <div class="text-h6 mb-2">Фотопериод</div>
              <div>{{ infoPanels[0].content }}</div>
              <div class="text-h6 mb-2">Температура</div>
              <div>{{ infoPanels[1].content }}</div>
              <div class="text-h6 mb-2">Влажность</div>
              <div>{{ infoPanels[2].content }}</div>
              <div class="text-h6 mb-2">Полив</div>
              <div>{{ infoPanels[3].content }}</div>
              <div class="text-h6 mb-2">Освещение</div>
              <div>{{ infoPanels[4].content }}</div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="9">
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="mb-4">
                  <v-card-title>Температура</v-card-title>
                  <Line :data="tempData" :options="chartOptions" />
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="mb-4">
                  <v-card-title>Влажность</v-card-title>
                  <Line :data="humidityData" :options="chartOptions" />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="mt-4">
              <v-data-table :items="plantItems" :items-per-page="5" class="elevation-1" >
                <template #item.actions>
                  <v-btn icon size="small" class="elevation-0"><v-icon>mdi-eye</v-icon></v-btn>
                  <v-btn icon size="small" class="elevation-0"><v-icon>mdi-pencil</v-icon></v-btn>
                  <v-btn icon size="small" class="elevation-0"><v-icon>mdi-delete</v-icon></v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-card class="mt-6 mb-4">
          <v-card-title>Timelaps яровой рапс в условиях Speed Breeding</v-card-title>
          <v-card-text>
            <VideoJsPlayer />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-application {
  background: #8ec46e58;
}
</style>
