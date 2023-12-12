<template>
    <router-link :to="to" :activeClass="'current'" class="tab">
      <span class="title"> {{ title }} </span>
      <div class="border" />
    </router-link>
</template>

<script>
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
    row-gap: 4px;
    text-decoration: none;
    .title {
      padding: 0px 2px;
      color: white;
      font-family: Arial, sans-serif;
      letter-spacing: 3px;
      font-size: 18px;
    }
    .border {
      width: 0%;
      height: 2px;
      background: white;
    }
    &:not(.current):not(:hover) {
      .border {
        visibility: hidden;
      }
    }
    &:hover:not(.current) {
      opacity: 0.8;
      .border {
        transition: width 0.5s ease;
        width: 100%;
      }
    }
    &.current {
      cursor: default;
      .border { width: 100%; }
    }
}
</style>
