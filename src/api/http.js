import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, removeToken } from '../utils/cookie'
import { applicationUserManager } from '../utils/applicationusermanager'

axios.defaults.timeout = 100000
axios.defaults.baseURL = process.env.VUE_APP_BASE_API

// 自定义判断元素类型JS
function toType(obj) {
    return {}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

// request拦截器设置
axios.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 请求头设置自带 token
        }
        config.headers['Content-Type'] = 'application/json' // 请求的数据格式为 json
        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    }
)

// response 拦截器设置
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 未登录
                    removeToken()
                    applicationUserManager.login()
                    break
                case 403:
                    this.$router.push({ name: 'Page401' })
                    break
            }
        }
        const code = error.response.data.status
        if (!code) {
            Message({
                type: 'error',
                message: '接口请求失败'
            })
        }
        return Promise.reject(error)
    }
)

function apiAxios(method, url, params, success, failure) {
    if (params) {
        params = filterNull(params)
    }
    axios({
        method: method,
        url: url,
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        // `headers` 是即将被发送的自定义请求头
        withCredentials: false
    })
        .then(function (res) {
            success(res.data)
        })
        .catch(function (err) {
            if (err) {
                console.log('api error, HTTP message: ' + err)
                failure(err)
            }
        })
}

// 返回在vue模板中的调用接口
export default {
    get: function (url, params, success, failure) {
        return apiAxios('GET', url, params, success, failure)
    },
    post: function (url, params, success, failure) {
        return apiAxios('POST', url, params, success, failure)
    },
    put: function (url, params, success, failure) {
        return apiAxios('PUT', url, params, success, failure)
    },
    delete: function (url, params, success, failure) {
        return apiAxios('DELETE', url, params, success, failure)
    }
}
