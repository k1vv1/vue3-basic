// 封装axios请求
import qs from 'qs'
import CryptoJS from 'crypto-js'
import { basePath } from '@/config/env'
import { Toast } from 'vant'
import router from '@/router/index'
import urls from '@/server/urls'
import { logFlag } from '@/config/env'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: basePath,
  timeout: 1000 * 10,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const post = async (url: string, params: any, headers = {}) => {
  const config = {
    headers: Object.assign(
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      headers,
    ),
  }
  return new Promise((resolve, reject) => {
    instance
      .post(
        url,
        JSON.stringify(headers) === '{}' ? qs.stringify(params) : params,
        config,
      )
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        const errRes = err.response
        handleHttpErr(errRes)
        reject(err)
      })
  })
}

const get = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        const errRes = err.response
        handleHttpErr(errRes)
        reject(err)
      })
  })
}

const del = (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, {
        params: params,
      })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        const errRes = err.response
        handleHttpErr(errRes)
        reject(err)
      })
  })
}

const patch = async (url: string, params: any) => {
  return new Promise((resolve, reject) => {
    instance
      .patch(url, qs.stringify(params))
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        const errRes = err.response
        handleHttpErr(errRes)
        reject(err)
      })
  })
}

const upload = async (url: string, params: any) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
  return new Promise((resolve, reject) => {
    instance
      .post(url, params, config)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        const errRes = err.response
        handleHttpErr(errRes)
        reject(err)
      })
  })
}

instance.interceptors.response.use(
  (config: AxiosResponse<any, any>) => {
    endLoading()
    return config
  },
  (error) => {
    endLoading()
    if (error.message.includes('timeout')) {
      Toast('网络超时')
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

instance.interceptors.request.use(async (config: AxiosRequestConfig<any>) => {
  startLoading()
  const url = (config.url && config.url.replace(basePath, '')) || ''
  const method = (config.method && config.method.toUpperCase()) || ''
  const withParamMethods = ['GET', 'DELETE']
  const methodFlag = withParamMethods.some((item) => item == method)
  let params = methodFlag ? config.params : qs.parse(config.data)
  const curTimeStamp = new Date().getTime() / 1000
  const curDate = formatDate(curTimeStamp, 'yyyy-MM-dd hh:mm:ss')
  if (
    config.headers &&
    (config.headers['Content-Type'] as string).indexOf('application/json') > -1
  )
    params = {}
  const authStr = (await _hamcShaV2(url, method, params, curDate)) || ''
  if (config.headers) {
    config.headers['X-Authorization'] = authStr
    config.headers['X-Authorization-Date'] = curDate
    config.headers['X-Client-Info'] = getClientInfo()
    config.headers['Client-Token'] =
      window.localStorage.getItem('client_token') || ''
    config.headers['Client-ID'] = window.localStorage.getItem('client_id') || ''
  }
  return config
})

export default () => {
  if (typeof window.$http == 'undefined') {
    window.$http = {
      post: post,
      get: get,
      patch: patch,
      delete: del,
      upload: upload,
    }
  }
}

function startLoading() {
  Toast.loading({
    loadingType: 'circular',
    message: '加载中…',
    forbidClick: true,
    duration: 0,
  })
}

function endLoading() {
  Toast.clear()
}

function toLogin() {
  localStorage.clear()
  setTimeout(() => {
    if (window.tool.isYuedong()) {
      window.APP.openPeNativeInt('login')
    } else {
      router.replace('/login')
    }
  }, 2000)
}

function getClientInfo() {
  const clientInfo = {
    ver: window.tool.version,
    package_name: logFlag.packageName,
    source: 'web',
    language: navigator.language.toLowerCase(),
    locale: navigator.language.toLowerCase(),
    timezone: String(new Date().getTimezoneOffset() / -60),
    now_timestamp: String(Math.round(new Date().getTime() / 1000)),
  }
  return JSON.stringify(clientInfo)
}

function formatDate(value: number, fmt: string) {
  if (!value) return ''
  const timeSc = new Date(value * 1000)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (timeSc.getFullYear() + '').substr(4 - RegExp.$1.length),
    )
  }
  const o: { [props: string]: number } = {
    'M+': timeSc.getMonth() + 1,
    'd+': timeSc.getDate(),
    'h+': timeSc.getHours(),
    'm+': timeSc.getMinutes(),
    's+': timeSc.getSeconds(),
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str),
      )
    }
  }

  function padLeftZero(str: string | any[]) {
    return ('00' + str).substr(str.length)
  }
  return fmt
}

function handleHttpErr(errRes: { data: any; config: AxiosRequestConfig<any> }) {
  const errData = errRes.data
  const codeFlag = errData.code
  const signErrArr = [10103, 10104, 10105]
  if (signErrArr.includes(codeFlag)) {
    localStorage.removeItem('authKey')
    localStorage.removeItem('authSecret')
    instance(errRes.config)
  } else if (codeFlag == 10122) {
    Toast('登录过期，请重新登录')
    toLogin()
  } else {
    const msg = codeFlag ? errData.message : '请求异常，请稍后重试'
    Toast(msg)
  }
}

function getAuthorizeInfo() {
  return axios({
    method: 'get',
    url: basePath + urls.auth,
    params: {
      source: 'web',
    },
  })
    .then(function (res) {
      return res
    })
    .catch((res) => {
      Toast('获取授权信息失败，请重新登录')
      toLogin()
    })
}
async function _hamcShaV2(
  path: string,
  method: string,
  params = {},
  datetime: string,
): Promise<string> {
  return new Promise(async (resolve) => {
    let key = localStorage.getItem('authKey') || ''
    let secret = localStorage.getItem('authSecret') || ''
    if (!key || !secret) {
      const authInfo: any = await getAuthorizeInfo()
      key = authInfo.data.business_key
      secret = authInfo.data.business_secret
      localStorage.setItem('authKey', key)
      localStorage.setItem('authSecret', secret)
    }
    const sortParamsEncode = decodeURIComponent(changeDataType(ksort(params)))
    const encryptStr =
      path +
      '|' +
      method.toUpperCase() +
      '|' +
      sortParamsEncode +
      '|' +
      datetime
    const digest = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(encryptStr, secret),
    )
    const authStr = `${key} ${digest}`
    resolve(authStr)
  })
}

function ksort(unordered: { [props: string]: any }) {
  const ordered = Object.keys(unordered)
    .sort()
    .reduce((obj: { [key: string]: string }, key: string) => {
      obj[key] = unordered[key]
      return obj
    }, {})
  return ordered
}
let nextStr = ''

function changeDataType(obj: { [props: string]: any }) {
  let str = ''
  if (typeof obj == 'object') {
    for (const i in obj) {
      if (typeof obj[i] != 'function' && typeof obj[i] != 'object') {
        str += i + '=' + obj[i] + '&'
      } else if (typeof obj[i] == 'object') {
        nextStr = ''
        str += changeSonType(i, obj[i])
      }
    }
  }
  return str.replace(/&$/g, '')
}

function changeSonType(objName: string, objValue: { [props: string]: any }) {
  if (typeof objValue == 'object') {
    for (const i in objValue) {
      if (typeof objValue[i] != 'object') {
        const value = objName + '[' + i + ']=' + objValue[i]
        nextStr += encodeURI(value) + '&'
      } else {
        changeSonType(objName + '[' + i + ']', objValue[i])
      }
    }
  }
  return nextStr
}
