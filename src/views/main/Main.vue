<template>
    <div class="main-page">
        <div class="control">
            <Dropdown v-if="false" />
            <uiButton :color="'blue'" :text="'Случайное изображение'" :isLoading="isLoading" @clicked="getRandomCat" />
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
        breeds () { return this.$store.state.store.breeds },
        breedsWithSubBreedsList () {
            const out: Array<object> = []
            Object.keys(this.breeds).map(breed => {
                if (this.breeds[breed].length > 0) {
                    this.breeds[breed].map((subBreed: string) => out.push({
                        id: `${breed}_${subBreed}`,
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
        async getRandomCat() {
            this.isLoading = true
            const r = await this._request('queries/getRandomDog')
            if (!r.isSuccess) {
                console.error(r)
            } else {
                this.randomDogSrc = r.data.message
            }
            this.isLoading = false
        }
    },
    mounted() {
        this.getRandomCat()
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
    }

    .random-image {
        max-height: 700px;
    }
}
</style>