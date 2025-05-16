<template>
  <SCLayout>
    <SCHeader @sidebar-toggle="onSidebarToggle"></SCHeader>
    <template v-if="route.path === '/'">
      <router-view></router-view>
      <SCFooter></SCFooter>
    </template>
    <SCLayout v-else row>
      <SCSider v-model:visible="siderVisible"></SCSider>
      <SCContent>
        <SCMain>
          <router-view></router-view>
        </SCMain>
        <SCFooter></SCFooter>
      </SCContent>
      <SCMobile></SCMobile>
      <SCCatalog></SCCatalog>
    </SCLayout>
  </SCLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'SCBasicLayout',
  setup() {
    const siderVisible = ref(false)
    const route = useRoute()

    const onSidebarToggle = () => {
      siderVisible.value = true
    }

    return {
      siderVisible,
      onSidebarToggle,
      route,
    }
  },
})
</script>
