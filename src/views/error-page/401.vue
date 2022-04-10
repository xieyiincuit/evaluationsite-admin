<template>
  <div class="error-wrapper">
    <div class="error-content">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="pic-error">
            <img src="../../assets/img/error-images/401.png" alt="401">
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="bullshit">
            <div class="bullshit-oops">抱歉!</div>
            <div class="bullshit-headline">您没有操作权限...</div>
            <div class="bullshit-info">
              当前帐号没有操作权限,请更换账号重新操作！
            </div>
            <a class="bullshit-return-home" @click="logout()">重新登录</a>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import applicationUserManager from '@/utils/applicationusermanager'
import { removeToken } from '@/utils/cookie'

export default {
  name: 'Page401',
  methods: {
    logout() {
      removeToken()
      window.localStorage.removeItem('USER_NAME')
      window.localStorage.removeItem('USER_AVATAR')
      window.localStorage.removeItem('USER_PHONE')
      window.localStorage.removeItem('USER_EMAIL')
      window.localStorage.removeItem('USER_ROLE')
      applicationUserManager.logout()
    }
  }
}
</script>

<style lang="less">
@import "../../assets/less/error-page";
</style>
