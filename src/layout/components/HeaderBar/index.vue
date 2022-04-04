<template>
  <div class="header-bar clear-fix">
    <FoldSideMenu />
    <BreadCrumbs />
    <div class="header-right clear-fix">
      <FullScreen />
      <UserAvatar />
    </div>
  </div>
</template>

<script>
import FoldSideMenu from '@/components/FoldSideMenu/index.vue'
import BreadCrumbs from '@/components/BreadCrumbs/index.vue'
import FullScreen from '@/components/FullScreen/index.vue'
import UserAvatar from '@/components/UserAvatar/index.vue'

export default {
  components: {
    FoldSideMenu,
    BreadCrumbs,
    FullScreen,
    UserAvatar
  }
}
</script>

<style lang="less">
.header-bar {
  height: 32px;
  padding: 16px 20px;
  .header-right {
    float: right;
    width: 200px;
  }
}
</style>
