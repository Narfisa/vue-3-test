<template>
    <div :class="['directory', theme]">
        <UIInput v-model="searchText" class="input" />
        <div class="table">
            <div v-for="(breed, breedKey) in tableData" :key="breedKey" class="row">
                <span class="breed"> {{ breedKey }} </span>
                <template v-if="breed.length > 0">
                    <div v-for="(subBreed, subBreedKey) in breed" :key="subBreedKey" class="sub-breed">
                        {{ subBreed }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import UIInput from '@/components/atoms/UIInput.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    components: { UIInput },
    data: () => ({
        openedRowIndex: -1,
        searchText: ''
    }),
    computed: {
        theme() { return this.$store.state.layout.theme },
        breeds() { return this.$store.state.store.breeds },
        tableData () {
            const searchText = this.searchText
            if (searchText.length === 0) return this.breeds || []

            // TO DO
            const out = {}
            Object.keys(this.breeds).map(breed => {
                if (breed.toString().toLowerCase().includes(searchText.toLowerCase())) {
                    out[breed] = this.breeds[breed]
                }
            })
            return out
        }
    }
})
</script>

<style scoped lang="scss">
.directory {
  overflow: auto;
  display: grid;
  grid-template-rows: max-content 1fr;
  row-gap: 16px;
  @include defaultScroll;
  padding-top: 16px;
  .table {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
    .row {
      padding: 16px;
      cursor: pointer;
      border-radius: 16px;
      &:hover {
          background: $color_gray-10;
      }
      .sub-breed {
        cursor: default;
        padding-top: 8px;
        padding-left: 16px;
      }
    }
  }
  .input {
    width: 332px;
  }
  &.dark .table .row:hover {
    background: $dark_theme_40;
  }
}
</style>
