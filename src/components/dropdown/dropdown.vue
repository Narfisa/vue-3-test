<template>
    <div :class="['dropdown', { unactive: isUnactive }]">
        <dropdown-search
            :type="'select'"
            :status="status"
            :placeholder="placeholder"
            :isUnactive="isUnactive"
            :selectedValue="selectedItems.length > 0 ? displayingValue : ''"
            :isDropdownCardOpen="isDropdownCardOpen"
            :isCanClear="isCanClear"
            :notNULL="notNULL"
            :isShowError="isShowError"
            @clear="clear"
            @setIsOpenCard="(data) => isDropdownCardOpen = data"
        />
        <dropdown-card
            v-if="isDropdownCardOpen"
            :type="type"
            :itemList="itemList"
            :parentRef="parentRef ?? $parent.$el"
            :dropdownRef="$el"
            :multipleSelect="multipleSelect"
            :searchText="searchText"
            :direction="direction"
            :selectedItems="selectedItems"
            :mobileTitle="mobileModalTitle || placeholder"
            @clear="clear"
            @select="(data) => $emit('select', data)"
            @close="isDropdownCardOpen = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import dropdownCard from './dropdownCard.vue'
import DropdownSearch from './dropdownSearch.vue'

export default defineComponent({
    components: { dropdownCard, DropdownSearch },
    props: {
        multipleSelect: {
            type: Boolean,
            default: false
        },
        isUseFilter: {
            type: Boolean,
            default: true
        },
        isCanClear: {
            type: Boolean,
            default: true
        },
        notNULL: {
            type: Boolean,
            default: false
        },
        isUnactive: {
            type: Boolean,
            default: false
        },
        isShowError: {
            type: Boolean,
            default: true
        },
        itemList: {
            type: Array,
            default: () => []
        },
        selectedItems: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: ''
        },
        mobileModalTitle: {
            type: String,
            default: ''
        },
        status: {
            type: Object,
            default: () => {} // { border: 'green/red/other is default', text: 'text under search' }
        },
        direction: {
            type: String,
            default: 'bottom' // enum['top', 'bottom', 'left', 'right']
        },
        parentRef: {
            type: HTMLDivElement,
            default: () => null
        }
    },
    data: () => ({
        isDropdownCardOpen: false,
        searchText: '',
        isInputFocused: false
    }),
    computed: {
        isMobile () { return this.$store.state.layout.page.windowType === 'mobile' },
        type () { return this.isUseFilter && this.itemList.length > 10 ? 'search' : 'select' },
        displayingValue () {
            if (this.selectedItems.length > 0 && this.itemList.length > 0) {
                if (this.multipleSelect) {
                    const out = this.selectedItems.map(item => item.title)
                    return out.join(', ')
                }
                const findItem = this.itemList.find(item => item.id === this.selectedItems[0].id)
                return findItem ? findItem.title : this.selectedItems[0].title
            } else {
                return this.placeholder
            }
        }
    },
    methods: {
        clear () {
            this.isDropdownCardOpen = false
            this.$emit('select', [])
        }
    }
})
</script>

<style lang="scss" scoped>
.dropdown {
    display: grid;
    position: relative;
    width: 282px;
    &:hover:not(.unactive) {
        cursor: pointer;
    }
}
</style>
