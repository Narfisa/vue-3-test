<template>
    <div :class="['dropdown-search', type, { mobile: type === 'mobileSearch' }]">
        <div :class="['first-row', err?.border, type, { focus: isDropdownCardOpen || isFocused, unactive: isUnactive }]" @click="setIsShowDropdownCard">
            <i v-if="['mobileSearch', 'search'].includes(type)" class="icon-search ci-search" />

            <input
                v-if="['mobileSearch', 'search'].includes(type)"
                :value="displayingValue"
                :placeholder="placeholder"
                class="input"
                @input="input"
                @focus="!isUnactive ? isFocused = true : ''"
                @blur="isFocused = false"
            >
            <span v-else :class="['value', { placeholder: !selectedValue }]"> {{ selectedValue || placeholder }} </span>

            <div class="controls">
                <div v-show="isCanClear && ((searchText && searchText.length > 0) || selectedValue)" class="clear-input" @click.stop="!isUnactive ? clear() : ''">
                    &#10006;
                </div>
                <div v-if="type === 'select'" class="arrow-icon-wrap">
                    {{ isDropdownCardOpen ? '&#8593;' : '&#8595;' }}
                </div>
            </div>
        </div>
        <span v-if="err?.text" class="err"> {{ err.text }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        placeholder: {
            type: String,
            default: ''
        },
        selectedValue: {
            type: [String, Number],
            default: null
        },
        isUnactive: {
            type: Boolean,
            default: false
        },
        notNULL: {
            type: Boolean,
            default: true
        },
        isDropdownCardOpen: {
            type: Boolean,
            default: false
        },
        isShowError: {
            type: Boolean,
            default: true
        },
        isCanClear: {
            type: Boolean,
            default: true
        },
        status: {
            type: Object,
            default: () => {} // { border: 'green/red/other is default', text: 'text under search' }
        },
        type: {
            type: String,
            default: 'select' // select/search/mobileSearch
        }
    },
    emits: ['input', 'clear', 'setIsOpenCard'],
    data: () => ({
        searchText: '',
        isWasFocused: '',
        isFocused: false
    }),
    computed: {
        err () {
            if (this.isDropdownCardOpen) return false
            if (!this.isShowError && !this.isWasFocused) return false
            if (this.type !== 'select' || this.isDropdownCardOpen) return false
            // if (!this._.isEmpty(this.status)) return this.status
            if (this.notNULL && (!this.selectedValue && this.selectedValue !== 0)) return { border: 'red', text: this.$l.getp('noSelectedItem', 'components/smartDropdownCard') }
            return null
        },
        displayingValue () {
            if (this.isFocused) return this.searchText
            return (this.searchText || this.selectedValue) ?? this.placeholder
        }
    },
    watch: {
        isDropdownCardOpen (newVal, oldVal) {
            if (!newVal && oldVal) this.isWasFocused = true
        }
    },
    methods: {
        input (event) {
            this.searchText = event.target.value
            this.$emit('input', event.target.value)
        },
        clear () {
            if (this.type === 'select') {
                this.$emit('clear')
            } else {
                this.searchText = ''
                this.$emit('input', '')
            }
        },
        setIsShowDropdownCard () {
            if (this.isUnactive) return
            if (this.type === 'select') {
                this.$emit('setIsOpenCard', !this.isDropdownCardOpen)
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.dropdown-search {
  max-width: 100%;
  display: grid;
  grid-template-rows: max-content max-content;
  overflow: hidden;
  &.search {
    position: sticky;
    top: 0px;
  }
  .first-row {
    position: relative;
    padding: 8px 8px 8px 12px;
    width: 100%;

    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;

    background: white;
    border: 1px solid $color_gray-20;
    border-radius: 8px;
    overflow: hidden;

    >.icon-search {
        font-size: 24px;
        margin-right: 6px;
    }

    >input {
        background: white;
        max-width: 100%;
        @include textStyle_text-14;
        border: none;
        outline: 0;
        resize: none;
        text-overflow: ellipsis;
        overflow: hidden;
        &::placeholder {
            color: $color_gray-60;
        }
    }

    .value {
        @include textStyle_text-14;
        resize: none;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 100%;
        user-select: none;
        &.placeholder {
            color: $color_gray-60;
        }
    }

    &.mobileSearch {
        border: 1px solid $color_gray-20;
    }

    &.search {
        border: none;
        border-bottom: 1px solid $color_gray-20;
        border-radius: 0px;
    }

    .controls {
        grid-column: -1/-1;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        align-items: center;
        column-gap: 6px;
        padding-left: 6px;

        .clear-input, .arrow-icon-wrap {
            width: 24px;
            height: 24px;
            display: grid;
            align-items: center;
            justify-items: center;
        }
        .icon {
            font-size: 20px;
            cursor: pointer;
            &:hover { opacity: 0.7; }
        }
        .clear {
            color: $color_gray-60;
        }
    }

    &:hover:not(.unactive) {
        border-color: $color_gray-60;
    }
    &.unactive {
        background: $color_gray-2_5;
        .value {
            color: $color_gray-60;
        }
        input {
            color: $color_gray-60;
            background: $color_gray-2_5;
            cursor: default;
        }
        color: $color_gray-60;
    }

    &.green {
        border-color: $color_green-100;
        .err {
            color: $color_green-100;
        }
    }
    &.red {
        border-color: $color_red-100;
        .err {
            color: $color_red-100;
        }
    }

    &.focus:not(.red):not(.green) {
        border-color: $color_blue-100;
    }
    &:not(.search):not(.mobileSearch) {
        grid-template-columns: 1fr max-content;
    }
  }
  .err {
    padding-top: 4px;
    @include textStyle_text-12;
    color: $color_red-100;
    user-select: none;
  }
  &.mobile {
    width: 100%;
    max-width: 100%;
  }
}
</style>
