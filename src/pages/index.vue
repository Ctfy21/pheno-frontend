<template>

  <HeaderAppBar title="Эксперименты ВНИИСБ"/>
  <v-container v-for="experiment in experiments" :key="experiment._id">
    <v-container class="ma-4">
      <v-row justify="center">
        <ExperimentChooser :end-date="experiment.endDate" :start-date="experiment.startDate" :title="experiment.name" :id="experiment._id" />
      </v-row>
    </v-container>
  </v-container>

</template>

<script setup>
  import ExperimentChooser from '@/components/experiment-chooser.vue';
  import HeaderAppBar from '@/components/header-app-bar.vue';
  import { getAllExperiments } from '@/scripts/api.js';
  import { importExperiments } from '@/scripts/internal.js';
  import { ref } from 'vue';

  const experiments = ref([])
  const file = ref(null)
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
