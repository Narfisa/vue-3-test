<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <Header />
  
  <router-view />
</template>

<style lang="scss" scoped>
#app {
  height: 100%;
  width: 100%;
}
</style>
