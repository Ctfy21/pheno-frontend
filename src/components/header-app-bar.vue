<script setup>
  defineProps(['title'])
</script>

<template>
  <v-app-bar :elevation="2">
    <template #prepend>
      <v-app-bar-nav-icon />
    </template>
    <v-app-bar-title>{{ title }}</v-app-bar-title>
    <template #append>
      <v-btn icon="mdi-magnify" />
      <v-btn icon="mdi-dots-vertical" />
    </template>
  </v-app-bar>
</template>

<style scoped>

</style>
