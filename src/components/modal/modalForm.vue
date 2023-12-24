<template>
    <Teleport :to="to">
        <div class="modal-form-wrap" @mousedown.stop.self="$emit('close')">
            <div :class="['modal', height]" :style="styles">
                <div class="head">
                    <div class="title-section">
                        <div class="first-row row">
                            <span class="title"> {{ title?.firstRow?.firstValue ?? title }} </span>
                            <span v-if="title?.firstRow?.secondValue" class="second-value"> {{ title?.firstRow?.secondValue }} </span>
                        </div>
                        <div v-if="title?.secondRow" class="second-row row">
                            <span class="first-value"> {{ title?.secondRow?.firstValue }} </span>
                            <span v-if="title?.secondRow?.secondValue" class="second-value"> {{ title?.secondRow?.secondValue }} </span>
                        </div>
                    </div>
                    <UIButton :icon="'ci-close'" @clicked="$emit('close')" />
                </div>
                <slot name="default" />
            </div>
        </div>
    </Teleport>
</template>

<script>
import UIButton from '@components/atoms/UIButton.vue'
export default {
    components: { UIButton },
    props: {
        to: {
            type: String,
            default: '#app'
        },
        title: {
            type: [Object, String],
            default: () => {}
        },
        height: {
            type: String,
            default: 'full'
        },
        styles: {
            type: Object,
            default: () => {}
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-form-wrap {
  width: 100vw;
  height: 100vh;
  z-index: 1551;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(37, 41, 61, 0.5);

  display: grid;
  align-items: center;
  justify-items: center;

  overflow: hidden;

  .modal {
    height: 70%;
    width: 50%;

    background: white;
    border-radius: 12px;
    padding: 32px;
    overflow: hidden;

    display: grid;
    grid-template-rows: max-content 1fr;

    .head {
      display: grid;
      grid-template-columns: 1fr max-content;
      align-items: start;
      column-gap: 32px;
      padding-bottom: 28px;
      .title-section {
        display: grid;
        grid-template-rows: max-content max-content;
        .row {
          display: grid;
          grid-template-columns: minmax(auto, max-content) max-content;
          align-items: end;
          .title {
            @include textStyle_heading-5;
          }
          .second-value, .first-value {
            @include textStyle_text-16;
          }
          .second-value {
            padding-bottom: 2px;
            padding-left: 12px;
            color: $color_gray-60;
          }
        }
      }
    }
  }
  .modal.content {
    min-width: fit-content;
    width: fit-content;
    max-width: 100%;
    .head .title-section { max-width: 300px;}
  }

  @include showFor (phone) {
    .modal.full {
      max-width: 100vw;
      width: 100vw;

      min-height: 100%;
      height: 100% !important;
      max-height: 100%;
      padding: 12px 12px 24px 12px;

      position: fixed;
      top: 0;
      left: 0;

      border-radius: 0px;
    }
    .modal.content {
      width: 100%;
      max-width: 100%;
      min-height: 100%;
      height: 100%;
      max-height: 100%;

      border-radius: 0px;
      padding: 10px 16px 32px 16px;

      position: absolute;
      bottom: 0;
    }

    .modal.dropdown {
      width: 100%;
      max-width: 100%;
      min-height: initial;
      height: fit-content;
      max-height: calc(100% - 28px);

      border-radius: 12px 12px 0px 0px;
      padding: 10px 16px 32px 16px;

      position: absolute;
      bottom: 0;
      margin-top: 28px;
    }
    >.modal >.head >.title-section {
      max-width: none !important;
    }
  }

  @include showFor (tablet) {
    .modal {
      min-width: 60%;
      max-width: 80%;
    }
  }
}
</style>
