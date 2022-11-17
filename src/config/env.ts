// 环境配置
// todo: 注意要修改下面packageName为项目名称
const appId = 102 //sso登录服务的appid，传0表示走老的授权登录
const appVersion = 1 //sso登录服务的版本，默认为第一版
const logFlag = {
  dev: false, // 开发和测试环境是否上报log
  from: false, // 是否上传页面来源
  packageName: 'com.yuedong.web.vue3-app',
}

const basePath = 'https://test-org.51yund.com'
const ssoPath = 'https://sso.51yund.com' // 授权登录地址
const jumpPath = 'https://d.51yund.com' // 跳转登录地址
const localPath = 'https://51yund.com' // 获取定位地址
const logPath = 'https://api.51yund.com' // 上传日志地址
const filterErr = ['sskey过期'] //过滤掉某些错不上报

export {
  basePath,
  ssoPath,
  jumpPath,
  localPath,
  logPath,
  logFlag,
  appId,
  appVersion,
  filterErr,
}
