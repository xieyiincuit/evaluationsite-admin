<template>
  <div class="user-center-wrapper clear-fix">
    <el-card shadow="always" :body-style="{ padding: '50px' }">
      <div class="user-avatar">
        <img :src="user.avatar" alt="avatar">
      </div>
      <ul class="user-info">
        <li>
          <label>角色：</label>
          <span>{{ user.role }}</span>
        </li>
        <li>
          <label>昵称：</label>
          <span>{{ user.nickname }}</span>
        </li>
        <li>
          <label>电话号码：</label>
          <span>{{ user.phone_number }}</span>
        </li>
        <li>
          <label>邮箱：</label>
          <span>{{ user.email }}</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserCenter',
  data() {
    return {
      user: {
        avatar:
          'http://zhousl.australiaeast.cloudapp.azure.com:9000/' +
          window.localStorage.getItem('USER_AVATAR'),
        role: window.localStorage.getItem('USER_ROLE'),
        nickname: window.localStorage.getItem('USER_NAME'),
        phone_number: window.localStorage.getItem('USER_PHONE'),
        email: window.localStorage.getItem('USER_EMAIL')
      }
    }
  }
}
</script>

<style lang="less">
.user-center-wrapper {
  .user-avatar {
    float: left;
    width: 150px;
    height: 150px;
  }
  .user-info {
    float: left;
    width: 800px;
    margin-left: 50px;
    margin-bottom: 50px;
    li {
      height: 34px;
      line-height: 34px;
      label,
      span {
        display: inline-block;
        vertical-align: middle;
      }
      label {
        width: 80px;
        margin-right: 12px;
        text-align: right;
      }
    }
  }
}
</style>
