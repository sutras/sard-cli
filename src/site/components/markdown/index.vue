<template>
  <div class="doc-content">
    <h1>
      {{ fm.title }} {{ fm.subtitle }}
      <sup v-if="fm.version">{{ fm.version }}</sup>
    </h1>
    <div v-html="content"></div>
  </div>
</template>

<script lang="ts">
import useCodeTool from '@@/components/code-tool/useCodeTool'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
    fm: {
      type: Object,
      required: true,
    },
  },
  setup() {
    useCodeTool()

    return {}
  },
})
</script>
