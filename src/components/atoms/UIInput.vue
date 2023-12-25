<template>
    <div class="ui-input">
        <input v-model="__value" :placeholder="placeholder" :disabled="isDisabled">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'UIInput',
    emits: ['input', 'update:modelValue'],
    props: {
        modelValue: { default: '', type: [String, Number] },
        isDisabled: { type: Boolean, default: null },
        placeholder: { type: String, default: '' }
    },
    data: () => ({
        localValue: ''
    }),
    computed: {
        __value: {
            get() { return this.modelValue },
            set(newValue) {
                // const newValue = $event.target.value
                let outValue = newValue
                if (this.type === 'number') {
                    const floatValue = parseFloat(newValue)
                    outValue = floatValue !== null ? floatValue : newValue
                }
                this.$emit('update:modelValue', newValue)
                this.$emit('input', outValue)
            }
        }
    },
    watch: {
        localValue(newValue) {
            this.$emit('update:modelValue', newValue)
        },
        modelValue(newValue) {
            if (newValue !== this.modelValue) this.localValue = newValue
        }
    },
    mounted() {
        this.localValue = this.modelValue
    }
})
</script>

<style lang="scss" scoped>
.ui-input {
  width: 100%;
  display: grid;
  grid-template-rows: max-content max-content;
  justify-items: start;

  input {
    height: 40px;
    width: 100%;
    // max-width: 356px;
    padding: 10px 12px;

    @include textStyle_text-14;

    border: 1px solid $color_gray-20;
    border-radius: 8px;
    outline: 0;
    resize: none;
    background: white;
    color: $color_gray-100;

    &::placeholder {
      color: $color_gray-60;
    }

    &:focus {
      color: $color_gray-100;
      border-color: $color_blue-100;
    }

    &[disabled] {
      border: 1px solid $color_gray-10;

      &::placeholder {
        color: $color_gray-30;
      }
    }
  }
}
</style>
