<script setup>

  import HeaderAppBar from '@/components/header-app-bar.vue';
  import VideoJsPlayer from '@/components/videoplayer.vue';


</script>

<template>
  <HeaderAppBar title="Эксперимент #1" />
  <v-row>
    <v-col>
      <v-sheet class="ma-4 pa-3" elevation="4" width="100%">
        <v-card elevation="0">
          <v-card-title>Место выращивания:</v-card-title>
          <v-card-text>Лаборатория Гало, расположенная в ВНИИСБ</v-card-text>
        </v-card>
        <v-card elevation="0">
          <v-card-title>Фотопериод:</v-card-title>
          <v-card-text>
            Начало дня: 9:00<br>
            Продолжительность дня: 12:00
          </v-card-text>
        </v-card>
        <v-card elevation="0">
          <v-card-title>Температура:</v-card-title>
          <v-card-text>
            День: 24°C<br>
            Ночь: 21°C
          </v-card-text>
        </v-card>
        <v-card elevation="0">
          <v-card-title>Влажность:</v-card-title>
          <v-card-text>
            День: 60%<br>
            Ночь: 50%
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-col>
    <v-col>2</v-col>
    <v-col>3</v-col>
  </v-row>
  <v-row class="justify-center">
    <v-sheet class="w-66">
      <VideoJsPlayer />
    </v-sheet>
  </v-row>
  <v-row>
    <v-col>
      5
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
