<template>
  <div class="doc-layout-footer">
    <div>{{ site.copyright }}</div>
    <div v-if="primaryGit" class="doc-layout-link-list">
      <a :href="primaryGit.url" target="_blank" rel="noreferrer">
        {{ primaryGit.name }}
      </a>
      <a
        :href="`${primaryGit.url}/issues/new`"
        target="_blank"
        rel="noreferrer"
      >
        报告 Bug
      </a>
      <a
        :href="`${primaryGit.url}/discussions`"
        target="_blank"
        rel="noreferrer"
      >
        讨论区
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import type { MergedConfig } from '../../../node/config-type'

const { site, git } = inject<MergedConfig>('sardConfig')!
const primaryGit = git?.[0]
</script>

<style lang="scss">
.doc-layout-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 20px;
  padding: 0 24px;
  text-align: center;
  font-size: var(--doc-text-sm);
  color: var(--doc-tertiary-color);

  @media (max-width: 768px) {
    & {
      padding: 0 16px;
    }
  }

  a {
    text-decoration: none;
    color: var(--doc-tertiary-color);
    &:hover {
      color: var(--doc-blue);
    }
  }
}

.doc-layout-link-list {
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
