<script setup>
  import { getAllPlantsOfExperiment, getExperimentById, getHumidityData, getIndicatorType, getTemperatureData, importPlantsFromExcel, start_service } from '@/scripts/api.js';
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
  const activeTab = ref(0)

  const indicatorTypes = ref([])
  const loading = ref(true)

  const getExperiment = async experimentId => {
    const response = await getExperimentById(experimentId)
    experiment.value = response
    await updateTemperatureData(experiment.value)
    await updateHumidityData(experiment.value)
    await getAllPlants()
  }

  getExperiment(experimentId)


  const getAllPlants = async () => {
    loading.value = true

    const response = await getAllPlantsOfExperiment(experimentId)
    plantItems.value = await Promise.all(response.map(async plant => ({
      uid: plant.uid,
      line: divideUID(plant.uid)[0],
      pot: divideUID(plant.uid)[1],
      plant: divideUID(plant.uid)[2],
      plantType: plant.plantType,
      table: plant.tableId,
    })
  ))
    indicatorTypes.value = await Promise.all(response[1].indicator.map(async indicator => {
      const response = await getIndicatorType(indicator.indicatorType)
      return response.name
    }))
    loading.value = false
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

  const phenotypingOptions = ref([
    {
      title: 'Счётчик бобов',
      description: 'Подсчёт количества бобов на фотографии',
      icon: 'mdi-seed', 
      service_types: [{
        name: 'Ручная отметка uid растений',
        description: 'Ручная отметка uid растений на фотографии',
        icon: 'mdi-pencil',
        route: `/service/bean-counter/${experimentId}/manual-annotation`,
        disabled: true,
      }, {
        name: 'Автоматическая отметка uid растений',
        description: 'Автоматическая отметка uid растений на фотографии',
        icon: 'mdi-robot',
        route: `/service/bean-counter/${experimentId}/automatic-annotation`,
        disabled: false,
      }],
    }
  ])

  const phenotypingDialog = ref(false)
  const selectedOption = ref(null)
  const selectedService = ref(null)
  const sourceImagesDialog = ref(false)
  const selectedImages = ref([])

  const openPhenotypingDialog = (option) => {
    selectedOption.value = option
    phenotypingDialog.value = true
  }

  const openSourceImagesDialog = (service) => {
    selectedService.value = service
    phenotypingDialog.value = false
    sourceImagesDialog.value = true
  }

  const handleImagesSelected = (files) => {
    selectedImages.value = files
    console.log(selectedImages.value)
  }

  const startAnalysis = () => {
    if (selectedService.value && selectedImages.value.length > 0) {
      console.log(start_service(selectedService.value.route, selectedImages.value))
    }
  }
</script>

<template>
  <v-app>
    <HeaderAppBar 
      :title="experiment.name" 
      :tabs="['Обзор', 'Цифровое фенотипирование']"
      v-model="activeTab"
    >
      <v-btn icon="mdi-database-import" @click="dialog = true" />
    </HeaderAppBar>

    <v-main class="px-15">
      <v-container class="pa-0" fluid>
        <!-- Overview Tab -->
        <template v-if="activeTab === 0">
          <v-row class="pt-6">
            <v-col cols="12" md="3">
              <v-card class="mb-4 pa-4" elevation="2">
                <v-card-title class="d-flex align-center">
                  <v-icon start color="primary" class="mr-2">mdi-flower</v-icon>
                  Показатели растений
                </v-card-title>
                
                <v-card-text>
                  <v-skeleton-loader
                    v-if="loading"
                    type="list-item-two-line"
                    :items="3"
                  ></v-skeleton-loader>
                  
                  <template v-else>
                    <v-list>
                      <v-list-item
                        v-for="(type, index) in indicatorTypes"
                        :key="index"
                        :title="type"
                        class="mb-2"
                      >
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-leaf</v-icon>
                        </template>
                      </v-list-item>
                    </v-list>
                  </template>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card class="mb-4">
                    <v-card-title>Температура</v-card-title>
                    <v-card-text>
                      <v-skeleton-loader
                        v-if="loading"
                        type="image"
                        height="300"
                      ></v-skeleton-loader>
                      <Line v-else :data="tempData" :options="chartOptions" />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card class="mb-4">
                    <v-card-title>Влажность</v-card-title>
                    <v-card-text>
                      <v-skeleton-loader
                        v-if="loading"
                        type="image"
                        height="300"
                      ></v-skeleton-loader>
                      <Line v-else :data="humidityData" :options="chartOptions" />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card class="mt-4">
                <v-data-table 
                  class="elevation-1" 
                  :items="plantItems" 
                  :items-per-page="10"
                  :loading="loading"
                  loading-text="Загрузка данных..."
                >
                  <template #item.actions>
                    <v-btn class="elevation-0" icon size="small"><v-icon>mdi-eye</v-icon></v-btn>
                    <v-btn class="elevation-0" icon size="small"><v-icon>mdi-pencil</v-icon></v-btn>
                    <v-btn class="elevation-0" icon size="small"><v-icon>mdi-delete</v-icon></v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
          <v-container>
            <v-card class="mt-6 mb-4">
              <v-card-title> Таймлапс {{ experiment.name }}</v-card-title>
              <v-card-text>
                <VideoJsPlayer />
              </v-card-text>
            </v-card>
          </v-container>
        </template>

        <!-- Digital Phenotyping Tab -->
        <template v-else-if="activeTab === 1">
          <v-container class="pt-6">
            <v-card class="pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon start color="primary" class="mr-2">mdi-chart-line</v-icon>
                Методы цифрового фенотипирования
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="(option, index) in phenotypingOptions"
                    :key="index"
                    :title="option.title"
                    :subtitle="option.description"
                    class="mb-2"
                  >
                    <template v-slot:prepend>
                      <v-icon :color="option.color">{{ option.icon }}</v-icon>
                    </template>
                    <template v-slot:append>
                      <v-btn
                        variant="text"
                        color="primary"
                        @click="openPhenotypingDialog(option)"
                      >
                        Начать анализ
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-container>
        </template>
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

  <!-- Phenotyping Options Dialog -->
  <v-dialog v-model="phenotypingDialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h5">
        {{ selectedOption?.title }}
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 mb-4">{{ selectedOption?.description }}</p>
        <v-list>
          <v-list-item
            v-for="(service, index) in selectedOption?.service_types"
            :key="index"
            :title="service.name"
            :subtitle="service.description"
            class="mb-2"
            :disabled="service.disabled"
          >
            <template v-slot:prepend>
              <v-icon :color="service.color">{{ service.icon }}</v-icon>
            </template>
            <template v-slot:append>
              <v-btn
                variant="text"
                color="primary"
                :disabled="service.disabled"
                @click="openSourceImagesDialog(service)"
              >
                Выбрать
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          @click="phenotypingDialog = false"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Source Images Selection Dialog -->
  <v-dialog v-model="sourceImagesDialog" max-width="800px">
    <v-card>
      <v-card-title class="text-h5">
        Выбор исходных изображений
      </v-card-title>

      <v-card-text>
        <p class="text-body-1 mb-4">
          Выберите изображения для {{ selectedService?.name }}
        </p>
        
        <v-file-input
          v-model="selectedImages"
          multiple
          accept="image/*"
          label="Выберите изображения"
          prepend-icon="mdi-camera"
          show-size
          counter
          @update:model-value="handleImagesSelected"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames.slice(0, 3)" :key="index">
              <v-chip
                size="small"
                label
                color="primary"
                class="me-2"
              >
                {{ fileName }}
              </v-chip>
            </template>
            <v-chip
              v-if="fileNames.length > 3"
              size="small"
              label
              color="primary"
              class="me-2"
            >
              +{{ fileNames.length - 3 }} ещё
            </v-chip>
          </template>
        </v-file-input>

        <v-alert
          v-if="selectedImages.length > 0"
          type="info"
          class="mt-4"
        >
          Выбрано изображений: {{ selectedImages.length }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          @click="sourceImagesDialog = false; selectedImages = []"
        >
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          :disabled="selectedImages.length === 0"
          @click="startAnalysis"
        >
          Начать анализ
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

.v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
