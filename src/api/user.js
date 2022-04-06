import config from './config.js'
import request from '@/utils/request'

export default {
  // 获取验证码
  code() {
    return request.defaults.baseURL + '/api-uaa/validata/code/'
  },
  // 登录接口
  login(param) {
    return request.post(`api-uaa/oauth/token`, param).then(response => response).catch(error => error);
  },
  // 获取左侧列表菜单
  getleftlist(param) {
    return request.get(`api-user/menus/current`).then(response => response).catch(error => error);
  },
  // 获取当前账号信息
  getUsermsg() {
    return request.get(`api-user/users/current`).then(response => response).catch(error => error);
  },
  // 退出移除后台token
  LoginoutToken(param) {
    return request.get(`api-uaa/oauth/remove/token`).then(response => response).catch(error => error);
  },
  // 单点登录接口
  cloudSSO(param) {
    return request.get(`api-sso/sys/ssoLogin?code=${param.code}&state=1213`).then(response => response).catch(error => error);
  },
  // 单点登录退出
  loginout(param) {
    return request.get(config.Loginzwfw + `/uias/shotOff?sessionId=${param.sessionId}&jsoncallback=?`).then(response => response).catch(error => error);
  },
  // 获取token
  gettokenloginout(param){
    return request.post(`api-user/users/ssoAddCorpAndUser`,param).then(response => response).catch(error => error);
  },
  // 政务人员退出
  zwlogoOut(){
    return request.get(config.geErsingurlLogOut).then(response => response).catch(error => error);
  }
}
