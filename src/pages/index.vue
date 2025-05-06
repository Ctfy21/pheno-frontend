<template>
  <HeaderAppBar title="Эксперименты ВНИИСБ" />
  <v-container v-for="experiment in experiments.value" :key="experiment._id">
    <v-container class="ma-4">
      <v-row justify="center">
        <ExperimentChooser :end-date="experiment.endDate" :start-date="experiment.startDate" :title="experiment.title" />
      </v-row>
    </v-container>
  </v-container>

</template>

<script setup>
  import ExperimentChooser from '@/components/experiment-chooser.vue';
  import HeaderAppBar from '@/components/header-app-bar.vue';
  import { getAllExperiments } from '@/scripts/api.js';
  import { ref } from 'vue';

  const experiments = ref(await getAllExperiments())
  console.log(experiments)
</script>
