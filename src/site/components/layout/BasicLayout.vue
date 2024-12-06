<template>
  <DocLayout>
    <DocHeader @sidebar-toggle="onSidebarToggle"></DocHeader>
    <DocLayout row>
      <DocSider v-model:visible="siderVisible"></DocSider>
      <DocContent>
        <DocMain>
          <router-view></router-view>
        </DocMain>
        <DocFooter></DocFooter>
      </DocContent>
      <DocMobile></DocMobile>
      <DocCatalog></DocCatalog>
    </DocLayout>
  </DocLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DocLayout from './Layout.vue'
import DocHeader from './Header.vue'
import DocSider from './Sider.vue'
import DocMain from './Main.vue'
import DocContent from './Content.vue'
import DocFooter from './Footer.vue'
import DocCatalog from '../catalog/index.vue'
import DocMobile from '../mobile/index.vue'

export default defineComponent({
  components: {
    DocLayout,
    DocHeader,
    DocSider,
    DocMain,
    DocContent,
    DocFooter,
    DocCatalog,
    DocMobile,
  },
  setup() {
    const siderVisible = ref(false)

    const onSidebarToggle = () => {
      siderVisible.value = true
    }

    return {
      siderVisible,
      onSidebarToggle,
    }
  },
})
</script>
