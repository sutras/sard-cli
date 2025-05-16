<template>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'vue'
import { frontMatterContextKey } from './frontMatterContext'
import { FrontMatter } from '../../common-type'

export default defineComponent({
  name: 'SCFrontMatterProvider',
  props: {
    frontMatter: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const fm = computed(() => JSON.parse(decodeURIComponent(props.frontMatter)))

    provide(frontMatterContextKey, fm as FrontMatter)
  },
})
</script>
