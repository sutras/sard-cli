<template>
  <slot :toggle="toggle" :open="open"></slot>
  <div class="sc-dropdown" :class="{ open }">
    <div v-for="item in options" :key="item.text" class="sc-dropdown-item">
      <a
        v-if="/^https?:/.test(item.link)"
        class="sc-dropdown-link"
        target="_blank"
        :href="item.link"
      >
        <div class="sc-dropdown-text">{{ item.text }}</div>
        <i class="sc-dropdown-arrow hsi hsi-arrow-up-right"></i>
      </a>
      <router-link v-else class="sc-dropdown-link" :to="item.link">
        <div class="sc-dropdown-text">{{ item.text }}</div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'

interface DropdownOption {
  text: string
  link: string
  items?: DropdownOption[]
}

export default defineComponent({
  name: 'SCDropdown',
  props: {
    options: {
      type: Array as PropType<DropdownOption[]>,
      default: () => [],
    },
  },
  setup() {
    const open = ref(false)

    const toggle = () => {
      if (window.innerWidth <= 768) {
        open.value = !open.value
      }
    }

    return {
      open,
      toggle,
    }
  },
})
</script>

<style lang="scss">
.sc-dropdown {
  position: absolute;
  top: calc(50% + 20px);
  right: 0;
  padding: 12px;
  min-width: 128px;
  border: 1px solid var(--sc-border-color);
  background-color: var(--sc-emphasis-bg);
  box-shadow: var(--sc-shadow-xl);
  border-radius: var(--sc-rounded);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.25s,
    visibility 0.25s,
    transform 0.25s;

  &-link {
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: var(--sc-rounded);
    font-size: var(--sc-text-sm);
    line-height: 32px;
    color: var(--sc-body-color);
    text-decoration: none;
    white-space: nowrap;
    transition:
      background-color 0.25s,
      color 0.25s;

    &:hover {
      color: var(--sc-primary);
      background-color: rgba(var(--sc-blue-rgb), 0.1);
      text-decoration: none;
    }
  }

  &-arrow {
    margin-left: 4px;
    font-size: var(--sc-text-xs);
    color: var(--sc-tertiary-color);
  }

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    padding: 0;
    box-shadow: none;
    border: none;
    opacity: 1;
    visibility: visible;
    display: none;

    &.open {
      display: block;
      margin-bottom: 6px;
    }

    &-link {
      padding: 0;

      &:hover {
        color: initial;
        background-color: initial;
      }

      &:active {
        opacity: 0.6;
      }
    }
  }
}
</style>
