<template>
  <SCBackdrop v-model:visible="innerVisible"></SCBackdrop>

  <div
    :class="[
      'sc-sideslip',
      `sc-sideslip-${side}`,
      {
        show: innerVisible,
      },
    ]"
  >
    <div class="sc-sideslip-header">
      <div class="sc-sideslip-title">{{ title }}</div>
      <div class="sc-sideslip-close" @click="innerVisible = false">
        <i class="hsi hsi-x-lg"></i>
      </div>
    </div>
    <div class="sc-sideslip-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useResize } from '../use/useResize'

export default defineComponent({
  name: 'SCSideslip',
  props: {
    title: String,
    visible: Boolean,
    side: {
      type: String,
      default: 'left',
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const innerVisible = computed({
      get() {
        return props.visible
      },
      set(visible) {
        emit('update:visible', visible)
      },
    })

    useResize(() => {
      if (innerVisible.value && window.innerWidth > 768) {
        innerVisible.value = false
      }
    })

    return {
      innerVisible,
    }
  },
})
</script>

<style lang="scss" scoped>
.sc-sideslip {
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1010;
    width: 320px;
    max-width: 80vw;
    height: 100vh;
    background-color: var(--sc-emphasis-bg);
    box-shadow: var(--sc-shadow-xl);
    transition: transform 300ms;

    &-left {
      right: 100vw;
      &.show {
        transform: translateX(100%);
      }
    }

    &-right {
      left: 100vw;
      &.show {
        transform: translateX(-100%);
      }
    }

    &-header {
      position: relative;
      display: flex;
      flex-direction: row;
      padding: 16px 24px;

      &::after {
        position: absolute;
        left: 24px;
        right: 24px;
        bottom: 0;
        content: '';
        border-bottom: 1px var(--sc-border-color) solid;
      }
    }

    &-title {
      font-size: var(--sc-text-base);
      font-weight: bold;
    }

    &-close {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: -16px -24px;
      margin-left: auto;
      padding: 16px 24px;
      font-size: var(--sc-text-base);
      cursor: pointer;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }

  @media (min-width: 769px) {
    display: flex;
    margin-left: auto;

    &-header {
      display: none;
    }

    &-body {
      display: flex;
    }
  }
}
</style>
