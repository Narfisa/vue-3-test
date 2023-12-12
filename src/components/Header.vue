<template>
  <div class="head">
    <div class="main">
      <span class="main-text"> Cats </span>
      <div class="main-border" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.head {
  background: #202020;
  padding: 16px;
  display: grid;
  align-items: center;
  justify-items: center;
  box-shadow: -1px 3px 15px -1px rgba(0,0,0,0.76);
  .main {
    display: grid;
    grid-template-rows: max-content max-content;
    row-gap: 4px;
    .main-text {
      color: white;
      font-family: Arial, sans-serif;
      letter-spacing: 3px;
      font-size: 22px;
    }
    .main-border {
      height: 2px;
      background: white;
    }
  }
}
</style>