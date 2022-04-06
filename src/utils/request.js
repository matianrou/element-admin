/*
 * @Author: your name
 * @Date: 2021-10-11 10:15:47
 * @LastEditTime: 2021-10-12 08:24:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \element-admin\src\utils\request.js
 */
import axios from 'axios'
import { Message } from 'element-ui'
import config from '@/api/config.js'

const service = axios.create({
  timeout: 30000,
  baseURL: config.baseURL
})

service.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('usertoken')) {
      // 加入全局参数
      config.headers.Authorization =
        'Bearer ' + sessionStorage.getItem('usertoken')
    } else if (
      sessionStorage.getItem('usertoken') != '' &&
      localStorage.getItem('Newusertoken')
    ) {
      config.headers.Authorization =
        'Bearer ' + localStorage.getItem('Newusertoken')
    } else {
      config.headers.Authorization = 'Basic ' + window.btoa('webApp:webApp')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          Message({
            message: error.response.data.resp_msg,
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 401:
          Message({
            message: '未授权，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
          window.location.href = '/dist'
          break
        case 404:
          Message({
            message: '网络请求不存在',
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 500:
          Message({
            message: '系统繁忙，请稍后重试',
            type: 'error',
            duration: 5 * 1000
          })
          break
        default:
          Message({
            message: error.response.data.resp_msg,
            type: 'error',
            duration: 5 * 1000
          })
      }
      return Promise.reject(error.response)
    } else {
      Message({
        message: '连接服务器失败请稍后重试',
        type: 'error',
        duration: 5 * 1000
      })
    }
  }
)
export default service
