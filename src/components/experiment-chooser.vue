<script setup>
  defineProps(['title', 'startDate', 'endDate']);
</script>

<template>
  <v-stepper width="800">
    <v-stepper-header>
      <v-stepper-item value="1">В ожидании</v-stepper-item>
      <v-divider />
      <v-stepper-item disabled value="2">В процессе</v-stepper-item>
      <v-divider />
      <v-stepper-item disabled value="3">Завершён</v-stepper-item>
    </v-stepper-header>
    <v-card class="ma-5" elevation="0">
      <v-container>
        <p class="text-h4">{{ title }}</p>
      </v-container>
      <v-container>
        <p>Дата начала эксперимента: {{ startDate }}</p>
        <p>Дата конца эксперимента: {{ endDate }}</p>
      </v-container>
    </v-card>
    <template #actions>
      <v-container>
        <v-row justify="end">
          <v-btn class="ma-5 justify-end" href="/experiment">Посмотреть</v-btn>
        </v-row>
      </v-container>
    </template>
  </v-stepper>
</template>

<style scoped>

</style>
