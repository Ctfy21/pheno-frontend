<script setup>
  import { getAllPlantsOfExperiment, getExperimentById, getHumidityData, getIndicatorType, getTemperatureData } from '@/scripts/api.js';
  import { divideUID } from '@/scripts/internal.js';
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import HeaderAppBar from '@/components/header-app-bar.vue'
  import VideoJsPlayer from '@/components/videoplayer.vue'

  const route = useRoute()
  const experimentId = route.params.id

  const plantItems = ref([])
  const experiment = ref({})
  const dialog = ref(false)
  const file = ref(null)

  const getExperiment = async experimentId => {
    const response = await getExperimentById(experimentId)
    experiment.value = response
    await updateTemperatureData(experiment.value)
    await updateHumidityData(experiment.value)
    await getAllPlants()
  }

  getExperiment(experimentId)


  const getAllPlants = async () => {
    const response = await getAllPlantsOfExperiment(experimentId)
    plantItems.value = await Promise.all(response.map(async plant => ({
      uid: plant.uid,
      line: divideUID(plant.uid)[0],
      pot: divideUID(plant.uid)[1],
      plant: divideUID(plant.uid)[2],
      plantType: plant.plantType,
      table: plant.tableId,
      indicatorTypes:  String(await Promise.all(plant.indicator.map(async indicator => {
        const response = await getIndicatorType(indicator.indicatorType)
        return response.name
      }))),
    })))
  }


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
      fill: false,
    }],
  })

  const humidityData = ref({
    labels: [],
    datasets: [{
      label: 'Влажность (%)',
      data: [],
      borderColor: '#36A2EB',
      tension: 0.4,
      fill: false,
    }],
  })


  const formatTimeLabel = timestamp => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }


  const updateTemperatureData = async experiment => {
    try {
      const temperatureResponse = await getTemperatureData('belgorod', experiment.startDate, experiment.endDate)

      tempData.value = {
        labels: temperatureResponse.map(item => formatTimeLabel(item[0]).slice(0, 5)),
        datasets: [{
          label: 'Температура (°C)',
          data: temperatureResponse.map(item => item[1]),
          borderColor: '#FF6384',
          tension: 0.4,
          fill: false,
        }],
      }
    } catch (error) {
      console.error('Error fetching temperature data:', error)
    }
  }

  const updateHumidityData = async experiment => {
    try {
      const humidityResponse = await getHumidityData('belgorod', experiment.startDate, experiment.endDate)

      humidityData.value = {
        labels: humidityResponse.map(item => formatTimeLabel(item[0]).slice(0, 5)),
        datasets: [{
          label: 'Влажность (%)',
          data: humidityResponse.map(item => item[1]),
          borderColor: '#36A2EB',
          tension: 0.4,
          fill: false,
        }],
      }
    } catch (error) {
      console.error('Error fetching humidity data:', error)
    }
  }


  const handleImport = async () => {
    try {
      if (!file.value) {
      console.error('No file selected')
      return
    }
      const response = await importPlantsFromExcel(experimentId, file.value)
      console.log(response)
      dialog.value = false
      file.value = null
      await getAllPlants()

    } catch (error) {
      console.error('Error importing plants:', error)
    }
  }

  import { Line } from 'vue-chartjs'
  import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
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


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }
</script>

<template>
  <v-app>
    <HeaderAppBar :title="experiment.name" >
      <v-btn icon="mdi-database-import" @click="dialog = true" />
    </HeaderAppBar>

    <v-main class="px-15">
      <v-container class="pa-0" fluid>
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
              <v-data-table class="elevation-1" :items="plantItems" :items-per-page="10">
                <template #item.actions>
                  <v-btn class="elevation-0" icon size="small"><v-icon>mdi-eye</v-icon></v-btn>
                  <v-btn class="elevation-0" icon size="small"><v-icon>mdi-pencil</v-icon></v-btn>
                  <v-btn class="elevation-0" icon size="small"><v-icon>mdi-delete</v-icon></v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-card class="mt-6 mb-4">
          <v-card-title> Таймлапс {{ experiment.name }}</v-card-title>
          <v-card-text>
            <VideoJsPlayer />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

      <!-- Import Dialog -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        Импорт Растений
      </v-card-title>

      <v-card-text>
        <v-file-input
          v-model="file"
          accept=".xlsx,.xls"
          label="Выберите Excel файл"
          prepend-icon="mdi-file-excel"
        ></v-file-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="dialog = false">
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="handleImport"
          :disabled="!file || !!errorMessage"
        >
          Импортировать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-app>
</template>

<style scoped>
.v-application {
  background: #8ec46e58;
}
</style>
