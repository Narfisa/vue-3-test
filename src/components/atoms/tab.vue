<template>
    <router-link :to="to" :activeClass="'current'" :class="['tab', theme]">
        <span class="title"> {{ title }} </span>
        <div class="border" />
    </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        to: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    computed: {
        theme () { return this.$store.state.layout.theme }
    }
})
</script>

<style lang="scss" scoped>
.tab {
  display: grid;
  grid-template-rows: max-content max-content;
  justify-items: center;
  row-gap: 4px;
  text-decoration: none;
  .title {
    padding: 0px 2px;
    @include textStyle_heading-5;
  }
  .border {
    width: 0%;
    height: 2px;
    background: $color_gray-80;
    transition: width 0.3s;
  }
  &:hover:not(.current) {
    opacity: 0.8;
    .border {
      width: 60%;
    }
  }
  &.current {
    cursor: default;
    .border {
      width: 100%;
    }
  }

  &.dark {
    .title { color: white }
    .border { background: $dark_theme_20;}
  }
}
</style>
