<template>
    <div :class="['dropdown-card', { mobile: isMobile }, position]">
        <template v-if="!isMobile">
            <dropdown-search
                v-if="_type === 'search'"
                :type="'search'"
                :isMobile="isMobile"
                class="fixed-search"
                @input="(data) => searchText = data"
            />
            <div v-if="filteredDataBySearchText?.length > 0" ref="list" class="list">
                <dropdown-item
                    v-for="(item, index) in filteredDataBySearchText"
                    :key="`node-${item.id}`"
                    :ref="`node-${item.id}`"
                    :isHoverStyle="index === 0 && searchText.length > 0 && !selectedItemsIds.includes(item.id)"
                    :isSelected="selectedItemsIds.includes(item.id)"
                    :borderStyle="calcBorderStyle(item, index)"
                    :multipleSelect="multipleSelect"
                    :searchText="searchText"
                    :item="item"
                    @select="select"
                />
            </div>
            <span v-if="itemList.length > 0 && filteredDataBySearchText.length === 0" class="no-found"> noFoundTitle </span>
            <span v-if="itemList.length === 0" class="empty"> empty </span>
        </template>

        <modal-form v-else :title="mobileTitle" height="dropdown" @close="$emit('close')">
            <div :class="['content', { 'with-search': _type === 'search' }]" @click.stop>
                <dropdown-search
                    v-if="_type === 'search'"
                    :type="'mobileSearch'"
                    :style="{ 'margin-bottom': '12px' }"
                    :isMobile="isMobile"
                    @input="(data) => searchText = data"
                />
                <div v-if="filteredDataBySearchText?.length > 0" ref="list" class="list">
                    <dropdown-item
                        v-for="(item, index) in filteredDataBySearchText"
                        :key="`node-${item.id}`"
                        :ref="`node-${item.id}`"
                        :isSelected="selectedItemsIds.includes(item.id)"
                        :borderStyle="calcBorderStyle(item, index)"
                        :multipleSelect="multipleSelect"
                        :searchText="searchText"
                        :item="item"
                        @select="select"
                    />
                </div>
                <span v-else-if="itemList.length > 0" class="no-found"> noFoundTitle </span>
                <span v-else class="empty"> empty </span>

                <div class="controls">
                    <UIButton :color="'blue'" :text="'apply'" :isUnactive="selectedItemsIds.length === 0" @clicked="confirm" />
                </div>
            </div>
        </modal-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'

import dropdownItem from './dropdownItem.vue'
import UIButton from '@components/atoms/UIButton.vue'
import ModalForm from '@components/modal/modalForm.vue'
import DropdownSearch from './dropdownSearch.vue'

export default defineComponent({
    components: { dropdownItem, ModalForm, UIButton, DropdownSearch },
    emits: ['select', 'close'],
    props: {
        itemList: {
            type: Array,
            default: () => []
        },
        multipleSelect: {
            type: Boolean,
            default: false
        },
        isInputFocused: {
            type: Boolean,
            default: false
        },
        selectedItems: {
            type: Array,
            default: () => []
        },
        mobileTitle: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: null
        },
        direction: {
            type: String,
            default: 'bottom' // or top
        },
        parentRef: {
            type: HTMLDivElement,
            default: () => null
        },
        dropdownRef: {
            type: HTMLDivElement,
            default: () => null
        }
    },
    data: () => ({
        localSelectedItems: [], // for mobile
        searchText: '', // for mobile
        position: 'bottom'
    }),
    computed: {
        _type () { return !this.type ? (this.itemList.length > 10 ? 'search' : 'select') : this.type },
        // на мобилке выбранные элементы сохраняются в локальный массив и не эмитятся до нажатия на кнопку подтвердить
        curSelectedItemsSource () { return this.isMobile ? this.localSelectedItems : this.selectedItems },
        selectedItemsIds () { return this.curSelectedItemsSource.map(item => item.id) },
        // фильтрация данных по поисковой строке
        filteredDataBySearchText () {
            const searchText = this.searchText
            if (searchText.length === 0) return this.itemList || []

            const out = this.itemList.filter(item => {
                return item.title.toString().toLowerCase().includes(searchText.toLowerCase()) || (item.secondValue ? item.secondValue.toString().toLowerCase().includes(searchText.toLowerCase()) : false)
            })
            return out
        },
        isMobile () { return this.$store.state.app.windowType === 'mobile' }
    },
    mounted () {
        console.log(getCurrentInstance().uid)
        this.localSelectedItems = [...this.selectedItems]
        if (this.selectedItems.length > 0) {
            const selectedItemsWithIndexes = []
            this.itemList.map((item, index) => {
                const selectedItemInItemsList = [...this.selectedItems].find(selItem => selItem.id === item.id)
                if (selectedItemInItemsList) selectedItemsWithIndexes.push({ ...item, index })
            })
            const itemToScroll = selectedItemsWithIndexes.sort((a, b) => {
                if (a.index <= b.index) return -1
                return 1
            })[0]
            this.$nextTick(() => this.scrollToElem(itemToScroll))
        }
    },
    methods: {
        confirm () { this.$emit('select', this.curSelectedItemsSource); this.$emit('close') },
        select (value, isSelected) {
            const selectedItems = [...this.curSelectedItemsSource]
            if (this.multipleSelect) {
                const index = selectedItems.findIndex(item => item.id === value.id)
                isSelected ? selectedItems.splice(index, 1) : selectedItems.push(value) // if clicked selected item - unselect else push it
            } else {
                !isSelected && selectedItems.length === 0 ? selectedItems.push(value) : selectedItems.splice(0, 1, value)
            }
            if (!this.isMobile) {
                this.$emit('select', selectedItems)
            } else {
                this.localSelectedItems = selectedItems
            }
            if (!this.multipleSelect && !this.isMobile) this.$emit('close')
        },
        clickOutside () {
            if (this.isMobile) return
            // если введенное в поиск совпадает с каким-то элемент - выбрать.
            // const itemsEqualToSearch = this.filteredDataBySearchText.filter(item => item.title.toString() === this.searchText)
            // if (itemsEqualToSearch.length === 1) {
            //     this.select(itemsEqualToSearch[0], this.selectedItemsIds.includes(itemsEqualToSearch[0].id))
            // }
            if (!this.isInputFocused) this.$emit('close')
        },
        scrollToElem (elemToScroll) {
            if (!elemToScroll || !this.$refs[`node-${elemToScroll.id}`]) return
            const elemToScrollRef = this.$refs[`node-${elemToScroll.id}`][0]?.$el
            elemToScrollRef.scrollIntoView({ behavior: 'smooth', block: 'center' })
        },
        calcBorderStyle (item, index) { // для мульти выбора, чтобы визуально объединять несколько подряд выделенных элементов
            if (!this.multipleSelect || !this.selectedItemsIds.includes(item.id) || this.selectedItemsIds.length < 2) return false

            const isPrevItemSelected = index === 0 ? false : this.selectedItemsIds.includes(this.filteredDataBySearchText[index - 1].id)
            const isNextItemSelected = index === this.filteredDataBySearchText.length - 1 ? false : this.selectedItemsIds.includes(this.filteredDataBySearchText[index + 1].id)
            // проверка на первый элемент группы - если прошлый элемент не выбран или это первый элемент И следующий выбран значит это первый элемент в группе
            if ((index === 0 || !isPrevItemSelected) && isNextItemSelected) return 'first'
            // проверка на последний элемент группы - если следующий элемент не выбран(или это последний элемент), при этот прошлый выбран, значит это последний элемент в группе
            if (isPrevItemSelected && (index === this.filteredDataBySearchText.length - 1 || !isNextItemSelected)) return 'last'
            // проверка на промежуточный элемент группы - если прошлый и следующий элемент выбраны - это промежуточный элемент в группе
            if (isPrevItemSelected && isNextItemSelected) return 'between'
            return false
        }
    }
})
</script>

<style lang="scss" scoped>
.content {
    display: grid;
    grid-template-rows: 1fr max-content;

    overflow: hidden;
    .list {
        display: grid;
        grid-auto-flow: row;
        grid-auto-rows: max-content;
        align-items: center;

        overflow: auto;
        overflow-x: hidden;
        @include defaultScroll;
    }
    &.with-search {
        grid-template-rows: max-content 1fr max-content;
    }
    .no-found, .empty { display: grid; @include textStyle_text-14; padding: 12px; color: $color_gray-60 }
    .controls {
        padding-top: 24px;
    }
}
.dropdown-card {
    position: absolute;

    max-width: 200%;
    min-width: 100%;
    max-height: 304px;

    cursor: initial;

    background: white;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    z-index: 10000;
    user-select: none;
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: minmax(36px, max-content);
    align-items: center;

    overflow: auto;
    overflow-x: hidden;
    @include defaultScroll;
    .no-found, .empty { display: grid; @include textStyle_text-14; padding: 12px; color: $color_gray-60 }
    &.mobile {
        display: none;
        height: 0px;
        padding: 0px;
    }
    .list {
        padding: 4px;
    }
    &:focus {
        outline: none;
        border: 1px solid $color_blue-100;
    }
    &.bottom {
        top: calc(100% + 8px);
    }
    &.top {
        bottom: calc(100% + 8px);
    }
    &.right {
        align-self: center;
        left: calc(100% + 8px)
    }
    &.left {
        align-self: center;
        right: calc(100% + 8px)
    }
}
</style>
