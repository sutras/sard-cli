<template>
  <div class="sc-layout-footer">
    <div>{{ site.copyright }}</div>
    <div v-if="mainRepository" class="sc-layout-link-list">
      <a :href="mainRepository.url" target="_blank" rel="noreferrer">
        {{ mainRepository.name }}
      </a>
      <a
        :href="`${mainRepository.url}/issues/new`"
        target="_blank"
        rel="noreferrer"
      >
        报告 Bug
      </a>
      <a
        :href="`${mainRepository.url}/discussions`"
        target="_blank"
        rel="noreferrer"
      >
        讨论区
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import type { MergedConfig } from '../../node/config-type'

export default defineComponent({
  name: 'SCFooter',
  setup() {
    const { site, git = [] } = inject<MergedConfig>('sardConfig')!
    const mainRepository = git.find((item) => item.main) || git[0]

    return {
      site,
      mainRepository,
    }
  },
})
</script>

<style lang="scss">
.sc-layout-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 20px;
  padding: 0 24px;
  text-align: center;
  font-size: var(--sc-text-sm);
  color: var(--sc-tertiary-color);

  @media (max-width: 768px) {
    & {
      padding: 0 16px;
    }
  }

  a {
    text-decoration: none;
    color: var(--sc-tertiary-color);
    &:hover {
      color: var(--sc-blue);
    }
  }
}

.sc-layout-link-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: 24px;
  gap: 8px;

  a {
    display: inline-flex;
    gap: 8px;
  }

  a:not(:last-child)::after {
    content: '|';
  }
}
</style>
