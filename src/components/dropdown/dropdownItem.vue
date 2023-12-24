<template>
    <div :class="['dropdown-item', borderStyle, { selected: isSelected, multiple: multipleSelect, hoverStyle: isHoverStyle }]" @click.stop="$emit('select', item, isSelected)">
        <checkbox
            v-if="multipleSelect"
            :isChecked="isSelected"
            :icon="isSelected ? 'ci-check_s' : null"
            @clicked="$emit('select', item, isSelected)"
        />
        <span class="title" v-html="markFilteredText(item.title)" />
        <span class="bottom-value" v-html="markFilteredText(item.secondValue)" />
    </div>
</template>

<script>
import checkbox from '@components/atoms/checkbox.vue'

export default {
    name: 'DropdownItem',
    components: { checkbox },
    props: {
        item: {
            type: Object,
            default: () => {} // { title: '', secondValue: '' }
        },
        multipleSelect: {
            type: Boolean,
            default: false
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        borderStyle: {
            type: [String, Boolean],
            default: false
        },
        searchText: {
            type: String,
            default: ''
        },
        isHoverStyle: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        markFilteredText (text) {
            if (!text && ![0, '0'].includes(text)) return text
            text = text.toString()
            if (this.searchText.length === 0) return text

            const startIndex = text.toString().toLowerCase().indexOf(this.searchText.toLowerCase())
            if (startIndex < 0) return text
            const endIndex = startIndex + this.searchText.length
            return text.substr(0, startIndex) +
                '<span class="search-string">' + text.substr(startIndex, this.searchText.length) + '</span>' +
                this.markFilteredText(text.substr(endIndex, text.length - endIndex))
        }
    }
}
</script>

<style lang="scss" scoped>
.dropdown-item {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content max-content;
  user-select: none;
  padding: 8px;
  overflow: hidden;

  .checkbox-wrap { grid-area: 1/1/1/1; margin-right: 8px; }
  .title {
    grid-area: 1/2/1/2;
    @include textStyle_text-14;
    color: $color_gray-100;
  }
  .bottom-value {
    grid-area: 2/2/2/2;
    @include textStyle_text-12;
    color: $color_gray-60;
  }

  .title, .bottom-value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:deep(.search-string) {
      background: $color_blue-30;
    }
  }

  &:hover:not(.selected), &.hoverStyle {
    cursor: pointer;
    background: $color_gray-2_5;
  }
  &:hover.multiple {
    cursor: pointer;
    background: $color_gray-2_5;
  }
  &:hover, &.selected, &.hoverStyle {
    border-radius: 8px;
  }

  &.selected {
    background: $color_gray-5;
  }
  @include showFor(phone,tablet) {
    &.selected {
      background: $color_gray-5 !important;
    }
    &:not(.selected) {
      background: white !important;
    }
  }
  &.first {
    border-radius: 8px 8px 0px 0px;
  }
  &.between {
    border-radius: 0px;
  }
  &.last {
    border-radius: 0px 0px 8px 8px;
  }
}
</style>
