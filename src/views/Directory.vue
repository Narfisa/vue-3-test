<template>
    <div :class="['directory', theme]">
        <template v-if="!breed">
            <UIInput v-model="searchText" class="input" />
            <div v-if="!breed" class="table">
                <div v-for="(breed, breedKey) in tableData" :key="breedKey" class="row" @click="breedClicked(breedKey)">
                    <span class="breed"> {{ breedKey }} </span>
                    <template v-if="breed.length > 0">
                        <div v-for="(subBreed, subBreedKey) in breed" :key="subBreedKey" class="sub-breed">
                            {{ subBreed }}
                        </div>
                    </template>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="control" @click="breed = null; breedImages = null">
                <span> &lt;&lt;&lt; </span>
                <span class="selected-breed"> {{ breed }} </span>
            </div>
            <div class="images-table">
                <img v-for="(img, imgI) in breedImages" :key="imgI" :src="img" class="breed-img">
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import UIInput from '@/components/atoms/UIInput.vue'
import mixin from '@/plugins/mixin/ActionMixin.js'
import { defineComponent } from 'vue'

export default defineComponent({
    mixins: [mixin],
    components: { UIInput },
    data: () => ({
        openedRowIndex: -1,
        searchText: '',
        breedImages: null
    }),
    computed: {
        theme() { return this.$store.state.layout.theme },
        breeds() { return this.$store.state.store.breeds },
        breed: {
            get () { return this.$store.state.app.directory.breed },
            set (value: string) { this.$store.commit('app/directory/setBreed', value) }
        },
        tableData() {
            const searchText = this.searchText
            if (searchText.length === 0) return this.breeds || []

            const out = {}
            Object.keys(this.breeds).map(breed => {
                if (breed.toString().toLowerCase().includes(searchText.toLowerCase())) {
                    out[breed] = this.breeds[breed]
                }
            })
            return out
        }
    },
    mounted () {
        console.log(this.breed)
        this.$store.commit('app/setCurrentPage', 'directory')
        if (this.breed) this.getImagesFromBreed()
    },
    methods: {
        breedClicked (breed: string) {
            this.breed = breed
            this.getImagesFromBreed()
        },
        async getImagesFromBreed () {
            const r = await this._request('queries/getImagesFromBreed', this.breed)
            if (!r.isSuccess) {
                console.error(r)
            } else {
                this.breedImages = r.data.message
            }
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
  padding-left: 16px;

  .table {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: max-content;

    .row {
      padding: 16px 8px;
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

  .control {
    display: grid;
    grid-template-columns: max-content max-content;
    align-items: center;
    @include textStyle_text-16;
    cursor: pointer;
    padding-bottom: 16px;
    color: $color_blue-100;
    .selected-breed {
      padding-left: 8px;
    }
    &:hover {
      opacity: 0.7;
    }
  }

  .images-table {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 10px;
    img {
      max-width: 100%;
      height: auto;
    }
  }

  &.dark {
    .table {
      .row {
        &:hover { background: $dark_theme_40; }
      }
    }
    .control {
      color: white
    }
  }
}</style>
