<template>
    <div
        :class="[
            'ui-button',
            color,
            size,
            {
                fill: fill, unactive: isUnactive || isLoading,
                loading: isLoading, iconOnly: icon && !text,
                hoverTitle: title && isUnactive
            }
        ]"
        :title="title"
        @click.stop="isUnactive || isLoading ? '' : $emit('clicked')"
    >
        <div class="button-content">
            <div v-if="icon" class="icon-wrap">
                <template v-if="icon === 'ci-close'"> X </template>
                <i v-else :class="[icon, 'icon']" />
            </div>
            <span v-if="text" class="text"> {{ text }} </span>
        </div>

        <div v-show="isLoading" class="loading">
            <div class="elipse" />
            <div class="elipse" />
            <div class="elipse" />
        </div>

        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        isLoading: {
            type: Boolean,
            default: false
        },
        isUnactive: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'white' // white/gray/blue/red
        },
        fill: {
            type: Boolean,
            default: true // fill or not
        },
        size: {
            type: String,
            default: 'medium' // small/medium/large/huge
        },
        icon: {
            type: String,
            default: '' // icomoon
        },
        text: {
            type: String,
            default: '' // showing text
        },
        title: {
            type: String,
            default: '' // hover title
        }
    },
    emits: ['clicked']
})
</script>

<style lang="scss" scoped>
.ui-button {
  position: relative;
  display: grid;
  align-items: center;
  justify-items: center;
  width: 100%;
  .button-content {
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: max-content max-content;
    grid-area: 1/1/1/1;
    .icon-wrap {
      display: grid;
      align-items: center;
      justify-items: center;
    }
  }
  &:not(.iconOnly) {
    .icon-wrap {
      padding-right: 6px;
    }
  }

  // SIZE
  &.small {
    height: 32px;
    padding: 6px 14px;
    border-radius: 6px;
    &.iconOnly {
      padding: 8px;
      width: 32px;
    }
    .text { @include textStyle_text-14; }
    .icon-wrap .icon {
      font-size: 16px;
    }
  }
  &.medium {
    height: 40px;
    padding: 7px 16px 9px 16px;
    border-radius: 8px;
    &.iconOnly {
      padding: 9px 10px 11px;
      width: 40px;
    }
    .text { @include textStyle_text-16; }
    .icon-wrap .icon {
      font-size: 20px;
    }
  }
  &.large {
    height: 48px;
    padding: 11px 18px 13px 18px;
    border-radius: 8px;
    &.iconOnly {
      padding: 12px;
      width: 48px;
    }
    .text { @include textStyle_text-18; }
    .icon-wrap .icon {
      font-size: 24px;
    }
  }
  &.huge {
    height: 70px;
    padding: 18px;
    border-radius: 10px;
    &.iconOnly {
      width: 70px;
    }
    .text { @include textStyle_heading-5; }
    .icon-wrap .icon {
      font-size: 32px;
    }
  }

  // COLORS
  &.white {
    background: white;
  }
  &.gray {
    background: $color_gray-5;
  }
  &.blue {
    &:not(.fill) {
      color: $color_blue-100;
      .icon-wrap .icon {
        color: $color_blue-100;
      }
    }
    &.fill {
      background: $color_blue-100;
      .icon-wrap .icon {
        color: white;
      }
      .text { color: white; }
    }
  }
  &.red {
      color: $color_red-100;
      &.fill {
        background: $color_red-100;
        color: white
      }
  }

  // HOVER
  &:hover:not(.unactive) {
    cursor: pointer;
    &.gray, &.white {
      background: $color_gray-10;
    }
    &.blue {
      background: $color_blue-5;
      &.fill { background: $color_blue-80; }
    }
    &.red {
      opacity: 0.7;
    }
  }

  // PRESSED
  &:active:not(.unactive) {
    &.gray, &.white {
      background: $color_gray-20;
    }
    &.blue {
      background: $color_blue-110 !important;
      .text { color: white }
      .icon-wrap .icon { color: white }
    }
    &.red { opacity: 0.8;}
  }

  // DISABLED
  &.unactive {
    .button-content .icon-wrap .icon { color: $color_gray-30 }
    &.gray, &.white {
      .text { color: $color_gray-30 }
    }
    &.blue {
      &.fill {
        background: $color_gray-5;
        .text { color: $color_gray-30 }
      }
      &:not(.fill) {
        background: white;
        .text { color: $color_gray-30 }
      }
    }
    &.red {
      color: $color_gray-60;
      &.fill {
        background: $color_red-10;
      }
    }
  }

  // loading
  &.loading {
    .loading {
      grid-area: 1/1/1/1;
    }
    .button-content {
      opacity: 0;
    }
  }
  &.white, &.gray {
    .loading .elipse {
      background: $color_gray-60;
      &:first-child {
        animation: elipsis_black 2s ease-in-out infinite;
      }
      &:nth-child(2) {
        animation: elipsis_black 2s ease-in-out infinite;
        animation-delay: .5s;
      }
      &:last-child {
        animation: elipsis_black 2s ease-in-out infinite;
        animation-delay: 1s;
      }
      @keyframes elipsis_black {
        0% {
          background: $color_gray-60;
        }
        1% {
          background: $color_gray-100;
        }
        50% {
          background: $color_gray-60;
        }
        100% {
          background: $color_gray-60;
        }
      }
    }
  }
  &.blue {
    &.fill {
      .loading .elipse {
        background: $color_blue-40;
        &:first-child {
          animation: elipsis_white 2s ease-in-out infinite;
        }
        &:nth-child(2) {
          animation: elipsis_white 2s ease-in-out infinite;
          animation-delay: .5s;
        }
        &:last-child {
          animation: elipsis_white 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes elipsis_white {
          0% {
            background: $color_blue-40;
          }
          1% {
            background: white;
          }
          50% {
            background: $color_blue-40;
          }
          100% {
            background: $color_blue-40;
          }
        }
      }
    }
    &:not(.fill) {
      .loading .elipse {
        background: $color_blue-40;
        &:first-child {
          animation: elipsis_blue 2s ease-in-out infinite;
        }
        &:nth-child(2) {
          animation: elipsis_blue 2s ease-in-out infinite;
          animation-delay: .5s;
        }
        &:last-child {
          animation: elipsis_blue 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes elipsis_blue {
          0% {
            background: $color_blue-40;
          }
          1% {
            background: $color_blue-100;
          }
          50% {
            background: $color_blue-40;
          }
          100% {
            background: $color_blue-40;
          }
        }
      }
    }
  }
  .loading {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    justify-items: center;
    column-gap: 6px;
    .elipse {
      display: block;
      height: 6px;
      width: 6px;
      border-radius: 4px;
    }
  }

  &.hoverTitle {
    cursor: help;
  }
}
</style>
