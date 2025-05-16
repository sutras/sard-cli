<template>
  <div class="sc-markdown" @click="handleClick">
    <h1>
      {{ fm.title }} {{ fm.subtitle }}
      <sup v-if="fm.version">{{ fm.version }}</sup>
    </h1>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import useCodeTool from '@@/use/useCodeTool'
import { defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFrontMatter } from './frontMatterContext'

export default defineComponent({
  name: 'SCMarkdown',
  setup() {
    useCodeTool()

    const route = useRoute()
    const router = useRouter()

    const fm = useFrontMatter()

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
      fm,
    }
  },
})
</script>

<style lang="scss">
.sc-markdown {
  box-sizing: border-box;
  max-width: 920px;
  padding: 24px;
  margin-left: auto;
  margin-right: auto;

  h1 {
    margin: 24px 0 32px;
    font-size: var(--sc-text-2xl);
    font-weight: bold;

    sup {
      margin-left: 4px;
      padding: 2px 6px;
      font-size: var(--sc-text-sm);
      line-height: 1.2;
      color: var(--sc-white);
      border-radius: var(--sc-rounded);
      background-color: var(--sc-primary);
    }
  }

  h2 {
    margin: 40px 0 24px;
    font-size: var(--sc-text-xl);
    font-weight: bold;
  }

  h3 {
    margin: 32px 0 16px;
    font-size: var(--sc-text-lg);
    font-weight: bold;
  }

  h4 {
    margin: 24px 0 16px;
    font-size: 18px;
    font-weight: bold;
  }

  h1,
  h2,
  h3 {
    color: var(--sc-emphasis-color);
  }

  p {
    margin: 0 0 16px;
  }

  code:not([class*='language-']) {
    padding: 2px 5px;
    margin: 0;
    font-size: 85%;
    white-space: break-spaces;
    color: var(--sc-emphasis-color);
    background: var(--sc-code-bg);
    border-radius: var(--sc-rounded);
  }

  a {
    &:hover {
      text-decoration: underline;
    }

    code {
      color: var(--sc-primary) !important;
    }
  }

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
