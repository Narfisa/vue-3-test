<template>
    <router-link :to="to" :activeClass="'current'" class="tab">
      <span class="title"> {{ title }} </span>
      <div class="border" />
    </router-link>
</template>

<script lang="ts">
export default {
    props: {
        to: { type: String, required: true },
        title: { type: String }
    }
}
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
      color: #212529;
      font-family: 'IBM Plex Sans', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
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
      .border { width: 100%; }
    }
}
</style>
