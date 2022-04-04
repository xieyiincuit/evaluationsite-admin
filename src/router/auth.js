import router from './index'
import { getToken } from '../utils/cookie'
import { applicationUserManager } from '../utils/applicationusermanager'

// 白名单列表
const whiteList = ['']

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
