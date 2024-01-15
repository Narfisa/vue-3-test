import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Favorites from '@/views/Favorites.vue'

import appModule from '@/store/app.ts'
import storeModule from '@store/store.ts'
import layoutModule from '@store/layout.ts'

import allBreeds from './allBreeds.json'

describe('Favorites', () => {
  test('computed свойство favoriteBreeds обновляется при изменении стора', async () => {
    // Создаем мок стора
    const store = createStore({
      modules: {
        app: appModule,
        layout: layoutModule,
        store: storeModule
      },
      namespaced: true,
    })

    // Передаем мок стора в компонент с помощью функции provide
    const wrapper = mount(Favorites, {
      global: {
        plugins: [store],
        mocks: {
          $store: store
        }
      }
    })

    store.commit('store/setBreeds', allBreeds)

    // Изменяем значение favoriteBreeds в моке стора
    store.commit('store/setFavoriteBreeds', ['bulldog', 'terrier'])
    expect(wrapper.vm.tableData).toEqual(['bulldog', 'terrier'])

    // Проверяем searchText
    wrapper.setData({ searchText: 'terrier' })
    const expectedResult = {
      bulldog: [
          "boston",
          "english",
          "french"
      ],
    }

    // Проверяем, что computed свойство favoriteBreeds обновилось
    expect(wrapper.vm.tableData).toEqual(newFavoriteBreeds)
  })
})
