<template>
  
  <HeaderAppBar title="Эксперименты ВНИИСБ" >
    <v-btn icon="mdi-database-import" @click="dialog = true" />
  </HeaderAppBar>
  <v-container v-for="experiment in experiments" :key="experiment._id">
    <v-container class="ma-4">
      <v-row justify="center">
        <ExperimentChooser :end-date="experiment.endDate" :start-date="experiment.startDate" :title="experiment.name" :id="experiment._id" />
      </v-row>
    </v-container>
  </v-container>

  <!-- Import Dialog -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        Импорт экспериментов
      </v-card-title>

      <v-card-text>
        <v-file-input
          v-model="file"
          accept=".xlsx,.xls"
          label="Выберите Excel файл"
          prepend-icon="mdi-file-excel"
          :error-messages="errorMessage"
          @change="validateFile"
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
          :loading="loading"
          :disabled="!file || !!errorMessage"
        >
          Импортировать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
  import ExperimentChooser from '@/components/experiment-chooser.vue';
  import HeaderAppBar from '@/components/header-app-bar.vue';
  import { getAllExperiments } from '@/scripts/api.js';
  import { importExperiments } from '@/scripts/internal.js';
  import { ref } from 'vue';

  const experiments = ref([])

  const dialog = ref(false)
  
  getAllExperiments().then(response => {
    experiments.value = response
  })

  const importExperimentsComponent = () => {
    importExperiments()
  }
</script>

<style scoped>
.v-application {
  background: #8ec46e58;
}
</style>