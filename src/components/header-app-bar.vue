<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  defineProps(['title', 'isBackButton'])

  const router = useRouter()

  const canGoBack = ref(false)
  onMounted(() => {
    canGoBack.value = window.history.state.back !== null
  })

  const goBack = () => {
    if (canGoBack.value) {
      router.back()
    }
  }
</script>

<template>
  <v-app-bar :elevation="2">
    <template #prepend>
      <v-icon v-if="canGoBack" class="ma-2" @click="goBack">mdi-arrow-left</v-icon>
    </template>
    <v-app-bar-title>{{ title }}</v-app-bar-title>
    <template #append>
      <slot></slot>
    </template>
  </v-app-bar>
</template>

<style scoped>

</style>
