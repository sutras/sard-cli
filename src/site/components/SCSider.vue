<template>
  <template v-if="sidebarRoutes.length > 0">
    <SCSideslip
      side="left"
      :title="sideslipTitle"
      v-model:visible="innerVisible"
    >
      <div
        :class="[
          'sc-sider',
          {
            show: innerVisible,
          },
        ]"
      >
        <nav class="sc-sidenav">
          <component :is="SiderItems"></component>
        </nav>
      </div>
    </SCSideslip>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, h, onMounted, VNode, watch } from 'vue'
import { useRoute, RouterLink, RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'SCSider',
  props: {
    visible: Boolean,
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const innerVisible = computed({
      get() {
        return props.visible
      },
      set(visible) {
        emit('update:visible', visible)
      },
    })

    const currentRoute = useRoute()

    const sidebarRoutes = computed(() => {
      return currentRoute.matched[1]?.children ?? []
    })

    const sideslipTitle = computed(() => {
      return (currentRoute.matched[1]?.meta?.title || '') as string
    })

    const renderLink = (item: RouteRecordRaw) => {
      const { path, meta: { title, version = '' } = {} } = item
      const versionNum = version.slice(0, -1).split('.').map(Number)
      const showVersion = versionNum[0] >= 1 && versionNum[1] > 6
      return h(
        RouterLink,
        {
          key: path,
          class: 'sc-sidenav-link',
          exactActiveClass: 'active',
          to: path,
          onClick() {
            innerVisible.value = false
          },
        },
        () => [
          h(
            'span',
            {
              class: 'sc-sidenav-link-title',
            },
            title as string,
          ),
          showVersion ? h('sup', null, version) : null,
        ],
      )
    }

    const renderItems = (items: RouteRecordRaw[]): VNode[] => {
      return items.map<VNode>((item, i): any => {
        if (item.meta!.type === 'group') {
          return [
            h(
              'div',
              {
                key: i,
                class: 'sc-sidenav-title',
              },
              item.meta!.title as string,
            ),
            Array.isArray(item.children) && item.children.length > 0
              ? renderItems(item.children)
              : null,
          ]
        }

        return renderLink(item)
      })
    }

    function SiderItems() {
      return sidebarRoutes.value.length > 0
        ? renderItems(sidebarRoutes.value)
        : null
    }

    function scrollIntoView() {
      const activeLink = document.querySelector('.sc-sidenav-link.active')
      if (activeLink) {
        activeLink.scrollIntoView({
          block: 'nearest',
          behavior: 'instant',
        })
      }
    }

    onMounted(() => {
      scrollIntoView()
    })

    watch(
      () => currentRoute.path,
      () => {
        setTimeout(() => {
          scrollIntoView()
        }, 150)
      },
    )

    return {
      SiderItems,
      sidebarRoutes,
      sideslipTitle,
      innerVisible,
    }
  },
})
</script>

<style lang="scss">
.sc-sider {
  box-sizing: border-box;
  height: calc(100vh - var(--sc-navbar-height));
  flex: none;
  padding: 16px 16px 32px;
  overflow: auto;
  background-color: var(--sc-emphasis-bg);

  @media (min-width: 769px) {
    position: sticky;
    left: 0;
    top: var(--sc-navbar-height);
    z-index: 1010;
    width: var(--sc-sider-width);
    padding: 8px 8px 32px;
    border-right: 1px solid var(--sc-border-color);

    &:not(:hover)::-webkit-scrollbar {
      display: none;
    }
  }
}

.sc-sidenav {
  display: flex;
  flex-direction: column;

  &-title {
    margin-top: 32px;
    margin-bottom: 10px;
    padding: 0 10px;
    font-size: var(--sc-text-xs);
    color: var(--sc-tertiary-color);
  }

  &-link {
    position: relative;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    margin: 5px 0 0;
    color: var(--sc-body-color);
    font-size: var(--sc-text-sm);
    line-height: 1.5;
    white-space: nowrap;
    text-decoration: none;
    border-radius: var(--sc-rounded);

    &:hover {
      text-decoration: none;
      background-color: rgba(var(--sc-blue-rgb), 0.1);
    }
    &.active {
      font-weight: 500;
      color: var(--sc-primary);
      background-color: rgba(var(--sc-blue-rgb), 0.1);
    }

    &-title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    sup {
      margin-left: 2px;
      padding: 2px;
      font-size: var(--sc-text-xs);
      line-height: 1;
      color: var(--sc-white);
      border-radius: var(--sc-rounded-sm);
      background-color: var(--sc-primary);
    }
  }
}
</style>
