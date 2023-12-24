<script lang="ts">
import AppHeader from './components/AppHeader.vue'
import mixin from '@/plugins/mixin/ActionMixin.js'

import { defineComponent } from 'vue'

export default defineComponent({
    mixins: [mixin],
    components: {
        AppHeader
    },
    mounted () {
        this.getBreeds()
        this.calcWindowType()
        window.addEventListener('resize', this.onResizeWindow.bind(this))
    },
    methods: {
        async getBreeds () {
            const r = await this._request('queries/getAllBreeds')
            if (!r.isSuccess) {
                console.error(r)
            } else {
                this.$store.commit('store/setBreeds', r.data?.message)
            }
        },
        onResizeWindow () { this.calcWindowType() },
        calcWindowType () {
            const windowWidth = window.innerWidth
            if (windowWidth < 640) {
                this.setWindowType('mobile')
            } else if (windowWidth < 1025) {
                this.setWindowType('tablet')
            } else if (windowWidth < 1367) {
                this.setWindowType('laptop')
            } else if (windowWidth <= 1920) {
                this.setWindowType('desktop')
            } else {
                this.setWindowType('largeDesktop')
            }
        },
        setWindowType (type:string) {
            if (type !== this.$store.state.app.windowType) {
                this.$store.commit('app/setWindowType', type)
            }
        }
    }
})
</script>

<template>
    <AppHeader />

    <div class="wrapper">
        <router-view />
    </div>
</template>

<style lang="scss">
#app {
    height: 100%;
    display: grid;
    grid-template-rows: max-content 1fr;

    .wrapper {
        height: 100%;
        width: 100%;
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }
}
</style>
