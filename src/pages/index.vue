<template>
  <HeaderAppBar title="Эксперименты ВНИИСБ" />

  <v-container class="ma-4">
    <v-row justify="center">
      <ExperimentChooser />
    </v-row>
  </v-container>

  <v-container class="ma-4">
    <v-row justify="center">
      <ExperimentChooser />
    </v-row>
  </v-container>

</template>

<script setup>
  //
  import ExperimentChooser from '@/components/experiment-chooser.vue';
  import HeaderAppBar from '@/components/header-app-bar.vue';
</script>
