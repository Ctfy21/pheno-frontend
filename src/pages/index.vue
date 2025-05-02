<template>
  <v-app-bar :elevation="2">
    <template #prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Эксперименты ВНИИСБ</v-app-bar-title>
    <template #append>
      <v-btn icon="mdi-magnify" />
      <v-btn icon="mdi-dots-vertical" />
    </template>
  </v-app-bar>

  <v-container class="justify-center align-center">
    <v-stepper :items="['Step 1', 'Step 2', 'Step 3']" max-width="800">

    </v-stepper>
  </v-container>

</template>

<script setup>
  //
</script>
