<template>
    <div :class="['checkbox-wrap', color, { inactive: isDisabled, active: isCheckedLocal || isActive }]" @click.stop="clicked">
        <div class="checkbox">
            <div v-if="icon" class="icon-wrap">
                <i :class="['icon', icon]" />
            </div>
        </div>
        <span v-if="label" class="label"> {{ label }} </span>
    </div>
</template>

<script>
export default {
    props: {
        isDisabled: {
            type: Boolean,
            default: false
        },
        isChecked: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'gray' // gray/blue
        },
        icon: {
            type: String,
            default: 'ci-check_m' // icomoon
        },
        label: {
            type: String,
            default: '' // showing text
        }
    },
    data: () => ({
        isCheckedLocal: false
    }),
    watch: {
        isChecked (newVal) {
            this.isCheckedLocal = !!newVal
        }
    },
    mounted () {
        this.isCheckedLocal = this.isChecked
    },
    methods: {
        clicked () {
            if (this.isDisabled) return
            this.isCheckedLocal = !this.isCheckedLocal
            this.$emit('update:isChecked', this.isCheckedLocal)
            this.$emit('clicked', this.isCheckedLocal)
        }
    }
}
</script>

<style lang="scss" scoped>
.checkbox-wrap {
  display: grid;
  grid-template-columns: 20px max-content;
  align-items: center;
  height: fit-content;
  width: fit-content;
  .label {
    padding-left: 8px;
    @include textStyle_text-16;
    color: $color_gray-60;
  }
  .checkbox {
    background: white;
    width: 20px;
    height: 20px;
    display: grid;
    align-items: center;
    justify-items: center;
    border-radius: 4px;
    .icon-wrap {
      width: 16px;
      height: 16px;
      .icon {
        font-size: 16px;
      }
    }
  }

  // COLORS
  &.gray {
    .checkbox {
      border: 1px solid $color_gray-10;
    }
  }
  &.blue {
    .checkbox {
      border: 1px solid $color_blue-100;
    }
  }

  &:hover:not(.inactive) {
    cursor: pointer;
    opacity: 0.7;
  }
  &.active {
    &.gray .checkbox {
      background: $color_gray-10;
    }
    &.blue .checkbox {
      background: $color_blue-100;
      .icon-wrap .icon { color: white }
    }
  }
  &.inactive:not(.active) {
    &.gray {
      .checkbox {
        background: $color_gray-10;
        border: none;
      }
    }
    &.blue {
      .checkbox {
        background: $color_blue-10;
        border: none;
      }
    }
    .label {
      color: $color_gray-20;
    }
  }
  &.inactive.active {
    &.gray {
      .checkbox {
        background: white;
        .icon-wrap .icon {
          color: $color_gray-20;
        }
        border: 1px solid $color_gray-20;
      }
    }
    &.blue {
      .checkbox {
        background: white;
        .icon-wrap .icon {
          color: $color_blue-20;
        }
        border: 1px solid $color_blue-20;
      }
    }
  }
}
</style>
