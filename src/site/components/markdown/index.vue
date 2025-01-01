<template>
  <div class="doc-content" @click="handleClick">
    <h1>
      {{ fm.title }} {{ fm.subtitle }}
      <sup v-if="fm.version">{{ fm.version }}</sup>
    </h1>
    <div v-html="content"></div>
  </div>
</template>

<script lang="ts">
import useCodeTool from '@@/components/code-tool/useCodeTool'
import { defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

    const route = useRoute()
    const router = useRouter()

    const scrollToHash = () => {
      if (route.hash) {
        const el = document.querySelector(route.hash)
        if (el) {
          window.scrollBy({
            top: el.getBoundingClientRect().top - 60 - 10,
            behavior: 'instant',
          })
        }
      }
    }

    onMounted(() => {
      scrollToHash()
    })

    const handleClick = (event: MouseEvent) => {
      let current = event.target as Node | null

      do {
        if (current && current instanceof HTMLAnchorElement) {
          const href = current.getAttribute('href')
          if (href && href.startsWith('.')) {
            event.preventDefault()
            router.push(href)
          }
          break
        }
      } while (current && (current = current.parentNode))
    }

    return {
      handleClick,
    }
  },
})
</script>
