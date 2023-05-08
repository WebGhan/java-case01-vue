import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'
import Qs from 'qs'

let isRefreshing = false // 否正在刷新token
let retryRequests = [] // 刷新token后，承载需要重新请求的队列

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  paramsSerializer: (params) => {
    return Qs.stringify(params, { arrayFormat: 'repeat' })
  },
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // let each request carry token
    config.headers['token'] = getToken()

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code === 1) {
      return res
    } else if (res.msg === 'NOT_LOGIN') {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    } else {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  async error => {
    const response = error.response
    console.log(response)
    // 超时未返回的情况
    if (!response) {
      return Promise.reject(error)
    }
    if (response.status === 401) {
      // 401 token 失效
      if (!isRefreshing) {
        // 刷新 token
        isRefreshing = true
        try {
          const refreshRes = await store.dispatch('user/refresh')
          retryRequests.forEach(cb => cb(refreshRes.token))
          retryRequests = []
          return new Promise((resolve) => {
            response.config.headers.Authorization = 'Bearer ' + refreshRes.token
            response.config.baseURL = ''
            resolve(service(response.config))
          })
        } catch (error) {
          MessageBox.confirm('登录已过期，请重新登录', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        isRefreshing = false
      } else {
        // 等待刷新 token
        return new Promise((resolve) => {
          // 将 resolve 放进队列，用一个函数形式来保存，等token刷新后调用执行
          retryRequests.push((token) => {
            response.config.headers.Authorization = token
            response.config.baseURL = ''
            resolve(service({ ...response.config }))
          })
        })
      }
    } else if (response.status === 404) {
      // 404 请求一个不存在的资源
      router.push({ path: '/404' })
      Message({
        message: response.data.message || error.message || '您没有权限访问该页面',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: response.data.message || error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
