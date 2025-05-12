<script setup>
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  const props = defineProps(['title', 'isBackButton', 'tabs'])
  const emit = defineEmits(['update:modelValue'])

  const router = useRouter()
  const activeTab = ref(0)

  const canGoBack = ref(false)
  onMounted(() => {
    canGoBack.value = window.history.state.back !== null
  })

  const goBack = () => {
    if (canGoBack.value) {
      router.back()
    }
  }

  const handleTabChange = (tab) => {
    activeTab.value = tab
    emit('update:modelValue', tab)
  }
</script>

<template>
  <v-toolbar :elevation="2">
    <template #extension>
        <v-tabs v-if="tabs" v-model="activeTab" @update:model-value="handleTabChange">
          <v-tab v-for="tab in tabs" :key="tab" :text="tab"></v-tab>
        </v-tabs>
      </template>
    <template #prepend>
      <v-icon v-if="canGoBack" class="ma-2" @click="goBack">mdi-arrow-left</v-icon>
    </template>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <slot></slot>
  </v-toolbar>
</template>

<style scoped>

</style>
