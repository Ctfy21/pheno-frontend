<script setup>
import HeaderAppBar from '@/components/header-app-bar.vue';
</script>

<template>
  <HeaderAppBar title="Эксперимент не найден" />
  <v-container class="d-flex align-center justify-center" style="height: 80vh">
    <v-card class="text-center pa-6" width="500">
      <v-icon size="100" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <h1 class="text-h4 mb-4">Эксперимент не найден</h1>
      <p class="text-body-1 mb-6">Запрошенный эксперимент не существует или был удален.</p>
      <v-btn color="primary" href="/">
        Вернуться на главную
      </v-btn>
    </v-card>
  </v-container>
</template>

<style scoped>
</style>
