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
import { defineComponent } from 'vue'
import uiButton from '@components/atoms/UIButton.vue'
import mixin from '@/plugins/mixin/ActionMixin.js'
import Dropdown from '@/components/dropdown/dropdown.vue'

export default defineComponent({
    mixins: [mixin],
    components: { uiButton, Dropdown },
    data: () => ({
        randomDogSrc: null,
        isLoading: false,
        selectedItems: []
    }),
    computed: {
        theme () { return this.$store.state.layout.theme },
        breeds () { return this.$store.state.store.breeds },
        uiButtonTitle () {
            const base = 'Случайное изображение'
            return this.selectedItems.length === 0
                ? base
                : `${base} с ${this.selectedItems[0].title}`
        },
        breedsWithSubBreedsList () {
            const out: Array<object> = []
            Object.keys(this.breeds).map(breed => {
                if (this.breeds[breed].length > 0) {
                    this.breeds[breed].map((subBreed: string) => out.push({
                        id: `${breed}-${subBreed}`,
                        title: `${subBreed} ${breed}`
                    }))
                } else {
                    out.push({ id: breed, title: breed })
                }
            })
            return out
        }
    },
    methods: {
        async getRandomDog() {
            this.isLoading = true
            const r = this.selectedItems.length > 0
                ? await this._request('queries/getRandomBreedDog', this.selectedItems[0].id.split('-').join('/'))
                : await this._request('queries/getRandomDog')
            if (!r.isSuccess) {
                console.error(r)
            } else {
                this.randomDogSrc = r.data.message
            }
            this.isLoading = false
        }
    },
    mounted() {
        this.$store.commit('app/setCurrentPage', 'main')
        this.getRandomDog()
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