<template>
    <div>
        <img v-if="randomCatSrc" :src="randomCatSrc" class="theme-logo" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import mixin from '@/plugins/mixin/ActionMixin.js'

export default defineComponent({
    mixins: [mixin],
    data: () => ({
        randomCatSrc: null
    }),
    methods: {
        async getRandomCat() {
            const params = 'width=500&height=500'
            await fetch(`https://cataas.com/cat/cute?${params}`)
                .then((res) => res.blob())
                .then((blob) => {
                    this.randomCatSrc = URL.createObjectURL(blob)
                })
        }
    },
    mounted () {
        this.getRandomCat()
    }
})
</script>
