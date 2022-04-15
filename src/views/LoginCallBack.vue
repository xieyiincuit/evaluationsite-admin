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
  name: 'LogincallbackView',
  data() {
    return {}
  },
  async created() {
    await applicationUserManager.signinRedirectCallback()
    const user = await applicationUserManager.getUser()
    if (user.profile.role === 'administrator') {
      setToken(user.access_token)
      this.$store.commit('identity/saveUserInfo', user)
      window.localStorage.setItem('USER_NAME', user.profile.nickname)
      window.localStorage.setItem('USER_AVATAR', user.profile.avatar)
      window.localStorage.setItem('USER_PHONE', user.profile.phone_number)
      window.localStorage.setItem('USER_EMAIL', user.profile.email)
      window.localStorage.setItem('USER_ROLE', user.profile.role)
      this.$router.push({ name: 'Layout' })
    } else {
      this.$router.push({ name: 'Page401' })
    }
  }
}
</script>

<style>
</style>
