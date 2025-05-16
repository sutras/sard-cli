<template>
  <div class="sc-alert" :class="[`sc-alert-${type}`]">
    <div class="sc-alert-title">
      <i class="sc-alert-icon" :class="icon"></i>
      {{ mergedTile }}
    </div>
    <div class="sc-alert-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'

const mapTypeTitle = {
  success: '推荐',
  danger: '警告',
  warning: '注意',
  info: '提示',
}

type AlertType = 'success' | 'warning' | 'danger' | 'info'

const mapTypeIconName = {
  success: 'hsi hsi-hand-thumbs-up',
  danger: 'hsi hsi-exclamation-triangle',
  warning: 'hsi hsi-exclamation-circle',
  info: 'hsi hsi-chat-right-text',
}

export default defineComponent({
  name: 'SCAlert',
  props: {
    title: String,
    type: {
      type: String as PropType<AlertType>,
      validator(value: AlertType) {
        return ['success', 'warning', 'danger', 'info'].includes(value)
      },
      default: 'info',
    },
  },
  setup(props) {
    const mergedTile = computed(() => {
      return props.title || mapTypeTitle[props.type]
    })

    const icon = computed(() => {
      return mapTypeIconName[props.type]
    })

    return {
      mergedTile,
      icon,
    }
  },
})
</script>

<style lang="scss">
$border-opacity: 0.3;
$bg-opacity: 0.15;

.sc-alert {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: var(--sc-rounded);
  border: 1px solid var(--sc-border-color);

  &-title {
    font-weight: bold;
    margin-bottom: 10px;
  }

  &-icon {
    margin-right: 5px;
  }

  &-success {
    background-color: rgba(var(--sc-green-rgb), 0.05);

    .sc-alert-title {
      color: var(--sc-green-700);
    }
  }

  &-danger {
    background-color: rgba(var(--sc-red-rgb), 0.05);

    .sc-alert-title {
      color: var(--sc-red-700);
    }
  }

  &-warning {
    background-color: rgba(var(--sc-yellow-rgb), 0.05);

    .sc-alert-title {
      color: var(--sc-yellow-700);
    }
  }

  &-info {
    background-color: rgba(var(--sc-blue-rgb), 0.05);

    .sc-alert-title {
      color: var(--sc-blue-700);
    }
  }

  p:last-child {
    margin-bottom: 0;
  }
}
</style>
