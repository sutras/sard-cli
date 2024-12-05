<template>
  <div class="doc-content">
    <h1>
      {{ fm.title }} {{ fm.subtitle }}
      <sup v-if="fm.version">{{ fm.version }}</sup>
    </h1>
    <div v-html="content"></div>
  </div>
</template>

<script setup lang="ts">
import useCodeTool from '@@/components/code-tool/useCodeTool'
import { FrontMatter } from '../../../common-type'

defineProps<{
  content: string
  fm: FrontMatter
}>()

useCodeTool()
</script>
