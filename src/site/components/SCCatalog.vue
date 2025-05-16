<template>
  <div v-if="visible" class="sc-catalog">
    <ul v-html="finalDom"></ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useDom } from '../use/useDom'
import { useScrollSpy } from '../use/useScrollSpy'

export default defineComponent({
  name: 'SCCatalog',
  setup() {
    const dom = useDom()
    const index = useScrollSpy(dom)

    const finalDom = computed(() => {
      const item = dom.value[index.value]
      if (!item) {
        return ''
      }
      return dom.value
        .map((item, i) => {
          return i === index.value
            ? item.replace('sc-catalog-link', 'sc-catalog-link active')
            : item
        })
        .join('')
    })

    const visible = computed(() => {
      return dom.value.length > 0
    })

    return {
      finalDom,
      visible,
    }
  },
})
</script>

<style lang="scss">
$vertical-gap: 3px !default;
$indent-gap: 16px !default;

.sc-catalog {
  position: sticky;
  top: var(--sc-navbar-height);
  box-sizing: border-box;
  width: 200px;
  height: calc(100vh - var(--sc-navbar-height));
  padding: 24px 24px 24px 0;
  overflow-y: auto;

  ul {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    font-size: var(--sc-text-xs);

    ul {
      margin-top: $vertical-gap;
      padding-left: $indent-gap;
    }
  }

  li {
    margin-bottom: $vertical-gap;
    &[data-level='1'] {
      display: none;
      margin-bottom: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid var(--sc-border-color);
      font-size: var(--sc-text-base);
    }
    &[data-level='2'] {
      ~ [data-level='3'] {
        padding-left: 16px;
      }
      ~ [data-level='4'] {
        font-size: 12px;
        padding-left: 32px;
      }
    }
  }

  a {
    color: var(--sc-tertiary-color);
    text-decoration: none;
    word-break: break-all;

    &:hover {
      color: var(--sc-emphasis-color);
      text-decoration: underline;
    }

    &.active {
      color: var(--sc-primary);
    }
  }
}

@media (max-width: 1440px) {
  .sc-catalog {
    display: none;
  }
}
</style>
