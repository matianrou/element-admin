export default {
  // baseURL: 'http://192.168.110.180:9900', // 达宝
  // baseURL: 'http://10.17.113.121:9900', // 线上测试服务器
  baseURL: 'https://yzd.mem.gov.cn', // 线上正式服务器
  // baseURL: 'http://192.168.110.106:9900', // 朱建明
  // baseURL: 'http://192.168.110.109:9900', // yince 192.168.110.112
  // baseURL: 'http://192.168.110.142:9900', // 张槐
  // 国办单点登录地址
  singurl:
    'https://loginzwfw.mem.gov.cn:2443/uias/uias/isAgainAuth4Client.do?response_type=code&appCode=yzdhxpzhgl&scope=read,write&client_id=yzdhxpzhgl&redirect_uri=https://yzd.mem.gov.cn:443/dist/main&state=1213&gotoUrl=',
  Loginzwfw: 'https://loginzwfw.mem.gov.cn:2443/uias/', // 政务服务地址
  //测试环境  【不要删除】
  //部政务人员  登录
  //  geErsingurlLogin: 'https://isso.mem.gov.cn:9090/sso/login?service=http://127.0.0.1:8080',
  //部 政务人员  登出
  //  geErsingurlLogOut: 'https://isso.mem.gov.cn:9090/sso/logout?service=http://127.0.0.1:8080',
  //正式环境
  geErsingurlLogin:
    'https://isso.mem.gov.cn:443/sso/login?service=https://yzd.mem.gov.cn/dist/',
  //部 政务人员  登出
  geErsingurlLogOut:
    'https://isso.mem.gov.cn:443/sso/logout?service=https://yzd.mem.gov.cn/dist/'
}
