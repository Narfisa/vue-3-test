<template>
  <div class="head">
    <tab v-for="menuItem in menu" :key="menuItem.key" :title="menuItem.title" :to="menuItem.path" />
  </div>
</template>

<script>
import tab from './atoms/tab.vue'

export default {
    components: { tab },
    computed: {
        menu () { return this.$store.state.layout.menu }
    }
}
</script>

<style lang="scss" scoped>
.head {
  background: black;
  box-shadow: 0px 0px 6px black;
  padding: 16px;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-auto-flow: column;
}
</style>