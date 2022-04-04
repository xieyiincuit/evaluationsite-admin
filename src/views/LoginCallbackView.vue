<template>
  <div>
    <div desktop="12" tablet="8">
      <dl>
        <dt>Login successfully</dt>
        <dt>Your browser should be redirected soon</dt>
      </dl>
    </div>
  </div>
</template>

<script>
import applicationUserManager from '@/utils/applicationusermanager'
import { setToken } from '@/utils/cookie'
export default {
  name: 'logincallback-view',
  data() {
    return {}
  },
  async created() {
    try {
      await applicationUserManager.signinRedirectCallback()
      let user = await applicationUserManager.getUser()
      this.$store.commit('identity/saveUserInfo', user)
      setToken(user.access_token)
      Cookies.this.$router.push({ name: 'home' })
    } catch (e) {
      this.$message.error('系统出错，登录失败')
    }
  }
}
</script>

<style>
</style>