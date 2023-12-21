<script lang="ts">
import AppHeader from './components/AppHeader.vue'

import { defineComponent } from 'vue'

export default defineComponent({
    components: {
        AppHeader
    },
    mounted () {
        this.calcWindowType()
        window.addEventListener('resize', this.onResizeWindow.bind(this))
    },
    methods: {
        onResizeWindow () {
            this.calcWindowType()
        },
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

    <router-view />
</template>

<style lang="scss"></style>
