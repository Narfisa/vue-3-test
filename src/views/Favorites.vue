<template>
    <div :class="['favorites', theme]">
        <span class="desc">
            В справочнике пород можно добавлять породы в избранное. Наведите на строку и в её конце увидите иконочку-звездочку. <br/>
            Если она закрашена - значит, порода в избранном. Что это дает: <br/>
            &nbsp;&nbsp;&nbsp; 1. В справочнике пород избранные породы отображаются первыми в списке;  <br/>
            &nbsp;&nbsp;&nbsp; 2. В главной, когда выбираете породу, для которой вы хотите получить случайное изображение, 
            избранные породы отображаются первыми в списке.
        </span>
        <UIInput v-model="searchText" class="input" />
        <div class="table">
            <div v-for="breed in tableData" :key="breed.key" class="row">
                <span class="breed"> {{ breed.key }} </span>
                <div v-if="breed.subBreed.length > 0"  class="sub-breeds">
                    <div v-for="(subBreed, subBreedKey) in breed.subBreed" :key="subBreedKey" class="sub-breed">
                        {{ subBreed }}
                    </div>
                </div>
                <img :src="favoriteIconSrc[theme]" class="favorite-logo" @click.stop="switchBreedIsInFavorite(breed.key)" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import UIInput from '@/components/atoms/UIInput.vue'

import starSavedLightTheme from '@assets/icons/favorite_saved.svg'
import starSavedDarkTheme from '@assets/icons/favorite-light_saved.svg'

import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import tableData from '@typescript/breedTable'
export default defineComponent({
    components: { UIInput },
    setup () {
        // comp data
        const searchText = ref('')
        const favoriteIconSrc = ref({ dark: starSavedDarkTheme, light: starSavedLightTheme })

        // store data
        const store = useStore()
        const theme = computed(() => store.state.layout.theme)
        const favoriteBreeds = computed(() => store.state.store.favoriteBreeds)

        // calc data
        const breeds = computed(() => {
            const data = store.state.store.breeds
            const out: tableData[] = []
            Object.keys(data).map(breed => {
                if (favoriteBreeds.value.includes(breed)) {
                    out.push({
                        key: breed,
                        subBreed: data[breed]
                    })
                }
            })
            return out
        })
        const tableData = computed(() => {
            return breeds.value.filter((breed: tableData) => {
                return breed.key.toString().toLowerCase().includes(searchText.value.toLowerCase())
            })
        })

        const switchBreedIsInFavorite = (breed: string) => {
            const _favoriteBreeds = favoriteBreeds.value
            const favoriteBreedIndex = _favoriteBreeds.findIndex((favoriteBreed: string) => favoriteBreed === breed)
            _favoriteBreeds.splice(favoriteBreedIndex, 1)
            store.commit('store/setFavoriteBreeds', _favoriteBreeds)
        }

        onMounted (() => {
            store.commit('app/setCurrentPage', 'favorites')
        })

        return {
            favoriteIconSrc, searchText,
            theme, tableData,
            switchBreedIsInFavorite
        }
    }
})
</script>

<style scoped lang="scss">
.favorites {
  overflow: auto;
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  row-gap: 16px;
  @include defaultScroll;
  padding-top: 16px;
  padding-left: 16px;

  .desc {
    @include textStyle_text-16;
  }

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

  &.dark {
    .table {
      .row {
        &:hover { background: $dark_theme_40; }
      }
    }
  }
}</style>
