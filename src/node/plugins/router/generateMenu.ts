import { BaseRoute } from './getRouterConfig.js'

export interface MenuItem {
  type: 'item' | 'group' | 'cate'
  title: string
  order: number
  path: string
  id: number
  file?: string
  hidden?: boolean
  children?: MenuItem[]
  redirect?: string
}

function assign(target: object, ...args: object[]) {
  args.forEach((item) => {
    for (const [key, value] of Object.entries(item)) {
      if (value !== undefined && value !== null) {
        ;(target as any)[key] = value
      }
    }
  })
  return target
}

export function generateMenu(baseRoutes: BaseRoute[]) {
  let count = 0
  const categories: MenuItem[] = []

  baseRoutes.forEach((route) => {
    const {
      frontMatter: { nav, title, subtitle, order, group, hidden, redirect },
      segments,
      routePath,
      file,
    } = route

    // category
    const mergedNav = {
      title: (typeof nav === 'object' ? nav.title : nav) ?? segments[0],
      order: typeof nav === 'object' ? nav.order : undefined,
      hidden: typeof nav === 'object' ? nav.hidden : undefined,
      redirect: typeof nav === 'object' ? nav.redirect : undefined,
    }

    let category = categories.find((item) => item.title === mergedNav.title)
    let items: MenuItem[] = []
    if (!category) {
      category = {
        type: 'cate',
        ...mergedNav,
        order: mergedNav.order ?? 0,
        children: items,
        path: '',
        id: ++count,
        file: '@@/components/layout/Trunking.vue',
      }
      categories.push(category)
    } else {
      assign(category, mergedNav)
      items = category.children || []
    }

    // group
    let groupChildren: MenuItem[] | undefined
    if (group) {
      const mergedGroup = {
        title: typeof group === 'object' ? group.title : group,
        order: typeof group === 'object' ? group.order : undefined,
        hidden: typeof group === 'object' ? group.hidden : undefined,
        redirect: typeof group === 'object' ? group.redirect : undefined,
      }

      let itemGroup = items.find(
        (item) =>
          'type' in item &&
          item.type === 'group' &&
          item.title === mergedGroup.title,
      ) as MenuItem | undefined

      if (!itemGroup) {
        groupChildren = []
        itemGroup = {
          ...mergedGroup,
          order: mergedGroup.order ?? 0,
          type: 'group',
          path: '',
          children: groupChildren,
          id: ++count,
          file: '@@/components/layout/Trunking.vue',
        }
        items.push(itemGroup)
      } else {
        assign(itemGroup, mergedGroup)
        groupChildren = (itemGroup as MenuItem).children
      }
    }

    // menuItem
    const item: MenuItem = {
      type: 'item',
      title: `${title}${subtitle ? ` ${subtitle}` : ''}`,
      order: order ?? 0,
      path: routePath,
      hidden,
      id: ++count,
      file,
      redirect,
    }
    if (groupChildren) {
      groupChildren.push(item)
    } else {
      items.push(item)
    }
  })

  function recurseSort(array: MenuItem[]) {
    return [...array]
      .sort((a, b) =>
        (a.title as unknown as number) < (b.title as unknown as number)
          ? -1
          : 1,
      )
      .sort((a, b) => a.order - b.order)
      .map((item) => {
        const obj = {
          ...item,
        }
        if (obj.children) {
          obj.children = recurseSort(obj.children)
          const path = obj.children[0]?.path
          if (path) {
            obj.path = path
          }
        }
        return obj
      })
  }

  return recurseSort(categories) as MenuItem[]
}
