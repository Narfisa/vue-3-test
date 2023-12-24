<template>
    <div class="main-page">
        <div class="control">
            <uiButton :text="'Случайное изображение'" />
        </div>
        <img v-if="randomCatSrc" :src="randomCatSrc" class="theme-logo" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import uiButton from '@components/atoms/UIButton.vue'
import mixin from '@/plugins/mixin/ActionMixin.js'

export default defineComponent({
    mixins: [mixin],
    components: { uiButton },
    data: () => ({
        randomCatSrc: null,
        selectedItems: []
    }),
    methods: {
        async getRandomCat() {
            const url = 'https://dog.ceo/api/breeds/image/random'

            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(error => console.log(error))

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

    display: grid;
    grid-template-rows: max-content 1fr;
    row-gap: 16px;

    .control {
        display: grid;
        grid-template-columns: max-content max-content max-content;
    }
}
</style>