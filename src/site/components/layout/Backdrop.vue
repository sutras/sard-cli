<template>
  <div
    :class="[
      `doc-backdrop`,
      {
        show: innerVisible,
      },
    ]"
    @click="innerVisible = false"
    @touchmove.stop.prevent
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    visible: Boolean,
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

    return {
      innerVisible,
    }
  },
})
</script>

<style lang="scss" scoped>
.doc-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 300ms;
  pointer-events: none;

  &.show {
    pointer-events: auto;
    opacity: 1;
  }
}
</style>
