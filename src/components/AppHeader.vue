<template>
    <div :class="['head', theme]">
        <img :src="catLogoSrc" class="cat-logo" />
        <div class="tabs">
            <tab v-for="menuItem in menu" :key="menuItem.key" :title="menuItem.title" :to="menuItem.path" />
        </div>
        <img :src="themeLogo" class="theme-logo" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import tab from './atoms/tab.vue'

import cat from '@assets/icons/cat-logo.svg'
import darkTheme from '@assets/icons/dark-theme.svg'
import lightTheme from '@assets/icons/light-theme.svg'

import menuT from '@interface/store/layout/menu'

export default defineComponent({
    components: {
        tab
    },
    data: () => ({
        catLogoSrc: cat,
        darkThemeLogoSrc: darkTheme,
        lightThemeLogoSrc: lightTheme
    }),
    computed: {
        menu (): Array<menuT> { return this.$store.state.layout.menu },
        theme: {
            get (): string { return this.$store.state.layout.theme },
            set (value: String) { this.$store.commit('layout/setTheme', value) }
        },
        themeLogo () { return this.theme !== 'dark' ? this.darkThemeLogoSrc : this.lightThemeLogoSrc }
    },
    methods: {
        switchTheme () { this.theme = this.theme === 'dark' ? 'light' : 'dark' }
    }
})
</script>

<style lang="scss" scoped>
.head {
    background: $color_gray-5;
    box-shadow: 0px 0px 2px $color_gray-90;
    padding: 16px;

    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: 1fr 1fr 1fr;

    .tabs {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .cat-logo {
        justify-self: start;
        height: 32px;
        width: 32px;
    }

    .theme-logo {
        justify-self: end;
        height: 30px;
        width: 30px;
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
