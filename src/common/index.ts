// 全局注入
import injectHttp from './http'
import injectUtils from './utils'

export const injectCommon = () => {
  injectHttp()
  injectUtils()
}
