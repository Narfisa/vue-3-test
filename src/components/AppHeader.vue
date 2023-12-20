<template>
    <div class="head">
        <div class="logo">Cats</div>
        <div class="tabs">
            <tab
                v-for="menuItem in menu"
                :key="menuItem.key"
                :title="menuItem.title"
                :to="menuItem.path"
            />
        </div>
        <div class="theme">Theme</div>
    </div>
</template>

<script>
import tab from './atoms/tab.vue'

export default {
    components: { tab },
    computed: {
        menu() {
            return this.$store.state.layout.menu
        }
    }
}
</script>

<style lang="scss" scoped>
.head {
  background: $color_gray-5;
  box-shadow: 0px 0px 2px $color_gray-90;
  padding: 16px;

  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr;

  .tabs {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .logo {
  }
}
</style>
