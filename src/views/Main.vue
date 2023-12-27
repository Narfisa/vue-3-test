<template>
    <div :class="[theme, 'main-page']">
        <div class="control">
            <Dropdown
                :itemList="breedsWithSubBreedsList"
                :selectedItems="selectedItems"
                placeholder="Выберите породу"
                @select="(data) => selectedItems = data"
            />
            <uiButton :color="'blue'" :text="uiButtonTitle" :isLoading="isLoading" @clicked="getRandomDog" />
        </div>
        <img v-if="randomDogSrc" :src="randomDogSrc" class="random-image" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import uiButton from '@components/atoms/UIButton.vue'
import { mixin } from '@/plugins/mixin/ActionMixin2.js'
import Dropdown from '@/components/dropdown/dropdown.vue'

export default defineComponent({
    components: { uiButton, Dropdown },
    setup() {
        // component data
        let randomDogSrc = ref(null)
        let isLoading = ref(false)
        let selectedItems = ref([])

        // store data
        const store = useStore()
        const theme = computed(() => store.state.layout.theme)
        const breeds = computed(() => store.state.store.breeds)
        const favoriteBreeds = computed(() => store.state.store.favoriteBreeds)

        // ui button
        const uiButtonTitle = computed(() => {
            const base = 'Случайное изображение'
            return selectedItems.value.length === 0
                ? base
                : `${base} с ${selectedItems.value[0].title}`
        })

        // dropdown data
        const breedsWithSubBreedsList = computed(() => {
            type BreedsList = {
                id: string,
                title: string,
                secondValue?: string
            }
            let out: BreedsList[] = []

            Object.keys(breeds.value).map(breed => {
                if (breeds.value[breed].length > 0) {
                    breeds.value[breed].map((subBreed: string) => out.push({
                        id: `${breed}-${subBreed}`,
                        title: `${subBreed} ${breed}`
                    }))
                } else {
                    out.push({ id: breed, title: breed })
                }
            })

            out = out.map(breed => {
                const obj = { ...breed }
                if (favoriteBreeds.value.includes(breed.id)) {
                    obj.secondValue = 'В избранном'
                }
                return obj
            })

            return out.sort((a, b) => {
                const isAInFavorite = favoriteBreeds.value.includes(a.id)
                const isBInFavorite = favoriteBreeds.value.includes(b.id)
                return isAInFavorite && !isBInFavorite ? -1 : 1
            })
        })

        // get data
        const $api = inject('$api') // plugin
        const { request } = mixin($api) // mixin
        const getRandomDog = async () => {
            isLoading.value = true
            const r = selectedItems.value.length > 0
                ? await request('queries/getRandomBreedDog', selectedItems.value[0].id.split('-').join('/'))
                : await request('queries/getRandomDog')
            if (!r.isSuccess) {
                console.error(r)
            } else {
                randomDogSrc.value = r.data.message
            }
            isLoading.value = false
        }

        onMounted(() => {
            store.commit('app/setCurrentPage', 'main')
            getRandomDog()
        })

        return {
            randomDogSrc, isLoading, selectedItems,
            theme, uiButtonTitle, breedsWithSubBreedsList,
            getRandomDog
        }
    }
})
</script>

<style scoped lang="scss">
.main-page {
    height: 100%;
    width: 100%;
    padding: 16px;
    position: relative;

    display: grid;
    grid-template-rows: max-content 1fr;
    row-gap: 16px;

    .control {
        display: grid;
        grid-template-columns: max-content max-content max-content;
        align-items: center;
        column-gap: 16px;
    }

    .random-image {
        max-height: 700px;
    }
}
</style>