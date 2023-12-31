<script lang="ts">
import AppHeader from './components/AppHeader.vue'
import mixin from '@/plugins/mixin/ActionMixin.js'

import { defineComponent } from 'vue'
import hash from 'object-hash'

export default defineComponent({
    mixins: [mixin],
    components: {
        AppHeader
    },
    created() {
        this.$router.beforeEach((to, from, next) => { // only on route
            // SAVE QUERY PARAMS
            const queryToSave = ['ct', 'u', 'u2', 'tr', 'mvs', 'ps']
            let isNeedUpdate = false
            let redirectPath = false

            // REDIRECT
            if ('redirect' in from.query && from.query.redirect !== to.path && from.query.redirect !== '') {
                isNeedUpdate = true
                redirectPath = from.query.redirect
            }

            for (const queryKey in from.query) {
                if (queryToSave.includes(queryKey)) {
                    if (queryKey in to.query || !from.query[queryKey]) continue
                    isNeedUpdate = true
                    to.query[queryKey] = from.query[queryKey]
                }
            }
            if (isNeedUpdate) {
                if (redirectPath) return next({ path: redirectPath, query: to.query })
                return next(to)
            }
            return next()
        })
    },
    mounted () {
        this.getBreeds()
        this.calcWindowType()
        window.addEventListener('resize', this.onResizeWindow.bind(this))
    },
    computed: {
        currentPageParams () {
            const currentPage = this.$store.state.app.currentPage
            const currentPageParams = this.$store.getters[`app/${currentPage}/pageParams`]
            return currentPage && currentPageParams ? hash({ currentPage, currentPageParams }) : null
        },
        theme () { return this.$store.state.layout.theme }
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
    },
    watch: {
        $route () {
            this.$LivecycleScript.onFirstAppInit()
        },
        currentPageParams (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.$LivecycleScript.onChangeCurrentPageParams(newValue, oldValue)
            }
        }
    }
})
</script>

<template>
    <AppHeader />

    <div :class="['wrapper', theme]">
        <router-view />
    </div>
</template>

<style lang="scss">
#app {
    height: 100%;
    display: grid;
    grid-template-rows: max-content 1fr;
    overflow: hidden;

    .wrapper {
        height: 100%;
        width: 100%;
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        color: #212529;
        overflow: hidden;

        &.dark {
            background: $dark_theme-80;
            color: white;
        }
    }
}
</style>
