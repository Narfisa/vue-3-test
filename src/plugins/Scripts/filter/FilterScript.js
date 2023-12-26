import hash from 'object-hash'

class FilterScript {
    $app

    constructor (app) {
        this.$app = app
        return this
    }

    onChangeCurrentPageParams () { // при изменении кастомных параметров страницы
        this.updatingUrlGetParams() // обновить get параметры
    }

    /*   APP ACTIONS   */
    async onFirstAppInit () {
        this.updatingStateFromUrlGetParams() // восстановить значения из get параметров
    }

    updatingUrlGetParams () {
        console.log(this.$app)
        const currentPage = this.$app.$store.state.app.currentPage
        const currentPageParams = this.$app.$store.getters[`app/${currentPage}/pageParams`]

        const encodedGetParams = {
            ps: btoa(
                JSON.stringify(
                    currentPage && currentPageParams ? { cp: currentPage, cpp: currentPageParams } : null
                )
            )
        }

        if (hash(encodedGetParams) === hash(this.$app.$route.query)) {
            return false
        }
        this.$app.$router.replace({
            path: this.$app.$route.path,
            query: { ...this.$app.$route.query, ...encodedGetParams }
        })
    }

    updatingStateFromUrlGetParams () {
        const urlParams = this.$app.$route.query
        const getParamKeys = [
            { key: 'ct', mutation: 'filter/chart/setChartType' },
            { key: 'u', mutation: 'filter/unit/setValue' },
            { key: 'u2', mutation: 'filter/unit/setValue2' },
            { key: 'tr', mutation: 'filter/TR/setCurrentTRSettings' },
            { key: 'mvs', mutation: 'filter/manufacture/setNewVirtualSelect' }
        ]
        for (const getPram of getParamKeys) {
            try {
                const keyValue =
                    getPram.key in urlParams
                        ? JSON.parse(atob(urlParams[getPram.key]))
                        : false // get value from url
                if (keyValue) this.$app.$store.commit(getPram.mutation, keyValue) // set value by mutation
            } catch (e) {
                //
            }
        }

        // page settings have dynamic commit path
        try {
            const getParamsValue = 'ps' in urlParams ? JSON.parse(atob(urlParams.ps)) : false
            if (getParamsValue.cp && getParamsValue.cpp) {
                this.$app.$store.commit(`app/${getParamsValue.cp}/setPageParams`, getParamsValue.cpp)
            }
        } catch (e) {
            //
        }
    }
}

export default FilterScript
