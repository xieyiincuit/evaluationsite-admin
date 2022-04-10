import router from './index'
import { getToken } from '../utils/cookie'
import applicationUserManager from '../utils/applicationusermanager'

// 白名单列表
// const whiteList = ['/login']

// router.beforeEach((to, from, next) => {
//     if (getToken()) {
//         // 已登录且要跳转的是登录页
//         if (to.path === '/login') {
//             next({ path: '/' })
//         } else {
//             next()
//         }
//     } else {
//         // 在免登录白名单，直接进入
//         if (whiteList.includes(to.path)) {
//             next()
//         } else {
//             // 否则重定向到登录页
//             next(`/login?redirect=${to.fullPath}`)
//         }
//     }
// })

const whiteList = ['/callback', '/error-page/401']
router.beforeEach((to, from, next) => {
  if (getToken()) {
    next()
  } else {
    // 在免登录白名单，直接进入
    if (whiteList.includes(to.path)) {
      next()
    } else {
      applicationUserManager.login()
    }
  }
})
