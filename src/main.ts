import { createApp } from 'vue'

import './style.css'

import App from './App.vue'
import router from './router'
import store from './store'

import moment from 'moment'
import VueMoment from '@plugins/moment/moment.js'
moment.updateLocale('ru', {
    monthsShort: {
        format: 'янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек'.split(
            '_'
        ),
        standalone: 'янв_фев_мар_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split(
            '_'
        )
    }
})

import api from '@plugins/api'
import FilterScript from '@plugins/Scripts/filter'

const app = createApp(App)

app.use(store)
app.use(router)

app.use(VueMoment, { moment })
app.use(api)
app.use(FilterScript)

app.mount('#app')
