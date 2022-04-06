<template>
  <div class="login-container">
    <div class="bglogin">非药品类易制毒化学品综合管理信息系统</div>
    <div class="login_content">
      <div class="policyList">
        <span class="policyList_title">法律法规标准</span>
        <ul>
          <li v-for="(item, index) in policy" :key="index">
            <span @click="linkClick(item)">{{ item.name }}</span>
            <!-- <span>{{item.uploadtime}}</span> -->
          </li>
        </ul>
        <!-- <p class="moreeven">更多>></p> -->
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form formContent"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">欢迎登录</h3>
        </div>
        <el-form-item prop="username">
          <span class="login_users loginiconclass"></span>
          <el-input
            ref="username"
            v-model.trim="loginForm.username"
            placeholder="帐号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="off"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="login_code loginiconclass">
            <!-- <svg-icon icon-class="password" /> -->
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model.trim="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="off"
            @keyup.enter.native="keyuplogin"
          />
        </el-form-item>
        <el-form-item prop="validCode" style="width: 50%; float: left">
          <span class="login_verify loginiconclass"></span>
          <el-input
            :key="validCodewordType"
            ref="password"
            v-model.trim="loginForm.validCode"
            :type="validCodewordType"
            placeholder="请输入验证码"
            name="postcode"
            tabindex="2"
            auto-complete="off"
            @keyup.native.prevent="keyuplogin"
          />
        </el-form-item>
        <div @click="refreshCodeHandle">
          <img class="verify-code" :src="code" alt="网络或服务器错误" />
        </div>

        <!-- <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>-->
        <el-button
          :loading="loading"
          type="primary"
          class="loginbutton"
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <div class="zhucetitle">
          <span class="singleSignOn" @click="singleSignOn">企业法人登录</span>
          <span></span>
          <span class="singleSignOn" @click="geErSingleSignOn">政务人员登录</span>
          还没有帐号？
          <span @click="DialogTipShow = !DialogTipShow">点击注册</span>
        </div>
      </el-form>
    </div>
    <AddAccount v-if="DialogTipShow" :baseCodeUrl="baseCodeUrl"></AddAccount>
  </div>
</template>

<script>
import { getRandom, debounce } from '@/utils'
import interfaceService from '@/api/user'
import AddAccount from './AddAccount.vue'
import service from '@/views/Authentication/api/service'

export default {
  name: 'Login',
  components: {
    AddAccount
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入帐号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validCodeword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        validCode: ''
      },
      policy: [
        {
          name: '中共中央办公厅 国务院办公厅印发《关于全面加强危险化学品安全生产工作的意见》',
          url: ' https://www.mem.gov.cn/fw/flfgbz/fg/202002/t20200226_375879.shtml'
        },
        {
          name: '危险化学品安全管理条例（2013年修正本）',
          url: 'https://www.mem.gov.cn/fw/flfgbz/fg/201709/U020211013592859685561.pdf'
        },
        {
          name: '国家安全生产监督管理总局令',
          url: 'http://www.gov.cn/flfg/2006-04/18/content_256642.htm'
        },
        {
          name: '化学品物理危险性鉴定与分类管理办法',
          url: 'https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/gz11/201307/t20130710_405628.shtml'
        },
        {
          name: '危险化学品安全使用许可证实施办法',
          url: 'https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/gz11/201211/t20121116_405625.shtml'
        },
        {
          name: '危险化学品经营许可证管理办法',
          url: 'https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/gz11/201207/t20120717_405624.shtml'
        },
        {
          name: '危险化学品生产企业安全生产许可证实施办法',
          url: 'https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/gz11/201112/t20111201_405679.shtml'
        },
        {
          name: '非药品类易制毒化学品生产、经营许可办法',
          url: 'https://www.mem.gov.cn/gk/zfxxgkpt/fdzdgknr/gz11/200604/t20060405_405667.shtml'
        },
      ],
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        validCode: [
          { required: true, trigger: 'blur', validator: validCodeword }
        ]
      },
      loading: false,
      passwordType: 'password',
      validCodewordType: 'validCode',
      redirect: '',
      code: '',
      baseCodeUrl: '',
      deviceId: '',
      DialogTipShow: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    //部政务人员登录
    geErSingleSignOn() {
      let url = this.$URL.geErsingurlLogin
      window.location = url
    },
    // 统一认证登录
    singleSignOn() {
      let url = this.$URL.singurl
      window.location = url
    },
    // 回车登录事件
    keyuplogin(val) {
      if (val.keyCode == 13) {
        this.handleLogin()
      }
    },
    // 政务人员单点登录功能
    async initIdentification() {
      // window.location.search值即为?后面的参数值
      // 如http://127.0.0.1:3000/?ticket=ST-6001-kGR-gGuR-Ofz0n--npUtBdaWBH0-host-10-18-127-8#/home
      // 则window.location.search = ?ticket=ST-6001-kGR-gGuR-Ofz0n--npUtBdaWBH0-host-10-18-127-8
      // 因以“=”号分割字符串，故请避免传输的ticket中带有“=”
      //console.log('search', window.location.search)
      let search = window.location.search
      let stringList = search ? search.split('=') : []
      let ticket = stringList.length > 0 ? stringList[1] : ''
      if (ticket != null && ticket != '') {
        service
          .loginSso(ticket)
          .then(res => {
            if (res.data.resp_code == 0) {
              this.loading = !this.loading
              // 成功时跳转到企业用户首页
              sessionStorage.setItem(
                'usertoken',
                res.data.datas.datas.access_token
              )
              this.getusermsg()
            } else if (res.data.resp_code == 400) {
              this.$confirm(res.data.resp_msg, '提示', {
                type: 'warning',
                showConfirmButton: false,
                showCancelButton: false,
                closeOnClickModal: false,
                showClose: false
              })
            }
            if (res?.data && res.data?.user) {
              this.$message({
                message: '登录成功',
                type: 'success',
                duration: 700
              })
            }
          })
          .catch(err => { })
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.grant_type = 'password_code'
          this.loginForm.deviceId = this.deviceId
          const formdata = new FormData()
          Object.keys(this.loginForm).forEach(key => {
            formdata.append(key, this.loginForm[key])
          })
          interfaceService
            .login(formdata)
            .then(res => {
              if (res) {
                console.log(res)
                sessionStorage.setItem('usertoken', res.data.datas.access_token)
                localStorage.setItem(
                  'Newusertoken',
                  res.data.datas.access_token
                )
                this.getusermsg()
              } else {
                this.getCode()
              }
            })
            .catch(error => {
              this.getCode()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击标题进行跳转
    linkClick(item) {
      window.open(item.url, '_blank')
    },
    getcurrent(data) {
      if (data.type == 0 && data.auditType == 0) {
        this.$message({
          message: '当前账户未审核，请您联系相关管理部门审核后在重新登录',
          type: 'error',
          duration: 7 * 1000
        })
        return
      }
      if (data.type == 1) {
        // 当前进入企业用户
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({ name: 'EnterInformation' })
      } else {
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({ name: 'business' })
      }
    },
    // 获取当前账户权限,信息
    getusermsg() {
      interfaceService.getUsermsg().then(res => {
        if (res && res.status == '200') {
          const data = res.data.datas
          sessionStorage.setItem('getUserMsg', JSON.stringify(res.data))
          localStorage.setItem('NewgetUserMsg', JSON.stringify(res.data))
          this.$store.commit('getUserMsg', JSON.stringify(res.data))
          this.getcurrent(data)
        }
      })
    },
    getCode() {
      this.deviceId = getRandom(10)
      this.code = this.baseCodeUrl + this.deviceId
    },
    refreshCodeHandle: debounce(function () {
      this.getCode()
    })
  },
  created() {
    this.baseCodeUrl = interfaceService.code()
    localStorage.removeItem('Newusertoken')
    sessionStorage.removeItem('usertoken')
    this.getCode()
    this.initIdentification()
  }
}
</script>

<style lang="scss">
$bg: #f3f3f3;
$light_gray: #000;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login_content {
  height: 500px;
  width: 1000px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: -webkit-box;
  display: -ms-flexbox;
  background: #fff;
  .policyList {
    width: 50%;
    color: blue;
    float: left;
    background: #fff;
    padding: 20px 20px 20px 20px;
    background: url("../../assets/loginleft_bg.png") no-repeat;

    &_title {
      font-size: 18px;
    }

    ul {
      padding: 14px 20px;

      li {
        cursor: pointer;
        height: 35px;
        font-size: 16px;
        line-height: 35px;
        display: flex;
        margin: 10px 0;

        span:nth-child(1) {
          width: 100%;
          height: 35px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }
        span:nth-child(2) {
          width: 30%;
          height: 35px;
          text-align: right;
          vertical-align: top;
          display: inline-block;
        }
      }
    }
  }
  .moreeven {
    cursor: pointer;
    float: right;
  }
  .policyList_title::before {
    content: "";
    width: 5px;
    height: 20px;
    margin-right: 5px;
    display: inline-block;
    background: #e15a13;
    vertical-align: bottom;
  }
}
.login-form {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;
    text-indent: -12px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      position: absolute;
      left: -6px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    background: #f3f3f3;
    display: flex;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.bglogin {
  width: 100%;
  height: 56px;
  font-family: PingFangHK-Semibold;
  font-size: 38px;
  color: #ffffff;
  text-align: center;
  font-weight: 600;
  top: 10%;
  text-align: center;
  position: absolute;
}
.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background: url("../../assets/bg_top.png") no-repeat;
  background-size: 100% 100%;
  .login_users {
    background: url("../../assets/user.png") no-repeat;
  }
  .login_code {
    background: url("../../assets/block.png") no-repeat;
  }
  .login_verify {
    background: url("../../assets/yanzheng.png") no-repeat;
  }
  .loginiconclass {
    width: 30px;
    height: 49px;
    font-size: 22px;
    margin-left: 5px;
    display: inline-block;
    float: left;
    text-align: center;
    line-height: 49px;
    background-position: 2px;
  }
  .loginbutton {
    width: 408px;
    height: 60px;
    border-radius: 30px;
    margin: 35px 0 20px 14px;
    clear: both;
    font-size: 20px;
    letter-spacing: 5px;
    display: inherit;
  }
  .zhucetitle {
    text-align: right;
    display: inline-block;
    width: 100%;
    margin: 25px 0 0 0;
    font-family: FZLTXIHK--GBK1-0;
    .singleSignOn {
      border: solid 2px transparent;
      background-image: linear-gradient(#fff, #fff),
        linear-gradient(45deg, #56ecc7, #6067f3);
      background-origin: border-box;
      background-clip: content-box, border-box;
      text-align: center;
      line-height: 20px;
      color: #4174dd;
      display: inline-block;
      float: left;
      line-height: 20px;
      color: #4174dd;
      display: inline-block;
      float: left;
      width: 120px;
      height: 25px;
      margin-right: 10px;
    }
    span {
      font-size: 17px;
      color: #e15a13;
      font-weight: 400;
      cursor: pointer;
    }
  }
  .login-form {
    width: 477px;
    height: 485px;
    float: right;
    border-radius: 4px;
    padding: 30px 20px 0 20px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      height: 23px;
      font-family: FZLTXIHK--GBK1-0;
      font-size: 20px;
      color: #4174dd;
      font-weight: 404;
      margin-bottom: 30px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.verify-code {
  height: 55px;
  margin-left: 20px;
  width: 45%;
  line-height: 45px;
  text-align: center;
}
</style>
