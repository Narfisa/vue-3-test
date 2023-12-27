<template>
    <div :class="['directory', theme]">
        <template v-if="!breed">
            <UIInput v-model="searchText" class="input" />
            <div v-if="!breed" class="table">
                <div v-for="breed in tableData" :key="breed.key" class="row" @click="breedClicked(breed.key)">
                    <span class="breed"> {{ breed.key }} </span>
                    <div v-if="breed.subBreed.length > 0"  class="sub-breeds">
                        <div v-for="(subBreed, subBreedKey) in breed.subBreed" :key="subBreedKey" class="sub-breed">
                            {{ subBreed }}
                        </div>
                    </div>
                    <img :src="calcFavoriteIconSrc(breed.key)" class="favorite-logo" @click.stop="switchBreedIsInFavorite(breed.key)" />
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
import starSavedLightTheme from '@assets/icons/favorite_saved.svg'
import starUnsavedLightTheme from '@assets/icons/favorite_unsaved.svg'
import starSavedDarkTheme from '@assets/icons/favorite-light_saved.svg'
import starUnsavedDarkTheme from '@assets/icons/favorite-light_unsaved.svg'
import { defineComponent } from 'vue'

type tableData = {
    key: string;
    subBreed: string[];
};
export default defineComponent({
    mixins: [mixin],
    components: { UIInput },
    data: () => ({
        openedRowIndex: -1,
        searchText: '',
        breedImages: null,
        favoriteIconSrc: {
            dark: { saved: starSavedDarkTheme, unsaved: starUnsavedDarkTheme },
            light: { saved: starSavedLightTheme, unsaved: starUnsavedLightTheme }
        }
    }),
    computed: {
        theme() { return this.$store.state.layout.theme },
        favoriteBreeds () { return this.$store.state.store.favoriteBreeds },
        breed: {
            get () { return this.$store.state.app.directory.breed },
            set (value: string) { this.$store.commit('app/directory/setBreed', value) }
        },
        breeds() {
            const data = this.$store.state.store.breeds
            const out: tableData[] = []
            Object.keys(data).map(breed => {
                out.push({
                    key: breed,
                    subBreed: data[breed]
                })
            })
            return out
        },
        tableData() {
            const searchText = this.searchText
            const out: tableData[] = this.breeds.filter((breed: tableData) => {
                return breed.key.toString().toLowerCase().includes(searchText.toLowerCase())
            })
            return out.sort((a, b) => {
                const isAInFavorite = this.favoriteBreeds.includes(a.key)
                const isBInFavorite = this.favoriteBreeds.includes(b.key)
                return isAInFavorite && !isBInFavorite ? -1 : 1
            })
        }
    },
    mounted () {
        this.$store.commit('app/setCurrentPage', 'directory')
        if (this.breed) this.getImagesFromBreed()
    },
    methods: {
        calcFavoriteIconSrc (breed: string) {
            const favoriteIconObjFromTheme = this.favoriteIconSrc[this.theme]
            const isBreedInFavorite = this.favoriteBreeds.includes(breed)
            return favoriteIconObjFromTheme[isBreedInFavorite ? 'saved' : 'unsaved']
        },
        breedClicked (breed: string) {
            this.breed = breed
            this.getImagesFromBreed()
        },
        switchBreedIsInFavorite (breed: string) {
            const favoriteBreeds = this.favoriteBreeds
            const isBreedInFavorite = favoriteBreeds.includes(breed)
            if (isBreedInFavorite) {
                const favoriteBreedIndex = favoriteBreeds.findIndex((favoriteBreed: string) => favoriteBreed === breed)
                favoriteBreeds.splice(favoriteBreedIndex, 1)
            } else favoriteBreeds.push(breed)
            this.$store.commit('store/setFavoriteBreeds', favoriteBreeds)
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
      display: grid;
      grid-template-columns: 1fr max-content;
      grid-template-rows: max-content max-content;
      align-items: center;
      cursor: pointer;
      border-radius: 16px;

      &:hover {
        background: $color_gray-10;
        .favorite-logo { opacity: 1;}
      }
      .breed { grid-area: 1/1/1/1; }

      .sub-breeds {
        grid-area: 2/1/-1/-1;
        display: grid;
        grid-auto-flow: row;
        padding-top: 8px;
        row-gap: 4px;
        .sub-breed {
          padding-left: 16px;
        }
      }


      .favorite-logo {
        grid-area: 1/2/1/-1;
        height: 24px;
        width: 24px;
        opacity: 0;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }

  .input {
    width: 332px;
  }

  .control {
    display: grid;
    grid-template-columns: max-content min-content;
    align-items: center;
    width: fit-content;
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
