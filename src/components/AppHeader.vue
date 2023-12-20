<template>
    <div class="head">
        <img :src="catLogoSrc" class="cat-logo" />
        <div class="tabs">
            <tab v-for="menuItem in menu" :key="menuItem.key" :title="menuItem.title" :to="menuItem.path" />
        </div>
        <img :src="themeLogo" :class="['theme-logo', theme]" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import tab from './atoms/tab.vue'
import cat from '@assets/icons/cat-logo.svg'
import darkTheme from '@assets/icons/dark-theme.svg'
import lightTheme from '@assets/icons/light-theme.svg'

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
        menu() { return this.$store.state.layout.menu },
        theme() { return this.$store.state.layout.theme },
        themeLogo() { return this.theme !== 'dark' ? this.darkThemeLogoSrc : this.lightThemeLogoSrc }
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
        height: 32px;
        width: 32px;
        &.light {
            color: black;
        }
    }
}
</style>
