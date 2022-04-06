<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div>
      <span class="toptitle">非药品类易制毒化学品综合管理信息系统</span>
      <div class="right-menu">
        <dl class="loginName">
          <dt :title="corpName">{{corpName || 'system'}}</dt>
          <dd>{{type == '0'?'监管用户':'企业用户'}}</dd>
        </dl>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="el-icon-user titleiconclass"></div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item>
              <span style="display:block;" @click="logout">退出</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span style="display:block;" @click="Mycenter">个人中心</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
    <!-- 用户编辑页面 -->
    <el-dialog
      :visible.sync="visit"
      width="45%"
      height="30%"
      :title="dialogTitle"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <user-audit
        :visit="visit"
        :editFlag="editFlag"
        :rowdata="rowdata"
        :isShow="isShow"
        @closeDialog="closeDialog"
        ref="userInfoModal"
      ></user-audit>
    </el-dialog>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import UserAudit from '../views/Authentication/api/useradmin/useraudit.vue'
import interfaceService from '@/api/user'
import $ from 'jquery'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    UserAudit
  },
  data() {
    return {
      imgUrl: '',
      visit: false,
      editFlag: false,
      isShow: false,
      rowdata: '',
      dialogTitle: '个人信息修改',
      corpName: '',
      type: ''
    }
  },
  mixins: [ResizeMixin],
  watch: {
    '$store.state.getUserMsg'(val) {
      this.corpName = JSON.parse(val).datas.nickname
    },
    deep: true
  },
  computed: {
    sidebar() {
    
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    closeDialog() {
      this.visit = !this.visit
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出接口，移除当前token
    async logout() {
      const param = {
        token: localStorage.getItem('usertoken')
      }
      const sessionId = localStorage.getItem('sessionId') || ''
      $.ajax({
        // url:'https://loginzwfw.mem.gov.cn:2443/uias/logoutBack.do?sessionId=1111&jsoncallback=?',
        url:
          this.$URL.Loginzwfw +
          'uias/shotOff?sessionId=' +
          sessionId +
          '&jsoncallback=' +
          '?',
        dataType: 'jsonp',
        type: 'get',
        success: function(res) {}
      })
      $.ajax({
        url: this.$URL.geErsingurlLogOut,
        dataType: 'jsonp',
        type: 'get',
        success: function(res) {}
      })
      sessionStorage.setItem('usertoken', '')
      interfaceService.LoginoutToken(param).then(res => {})
      this.$router.push({ path: '/' })
    },
    Mycenter() {
      this.isShow = false
      this.visit = !this.visit
      this.editFlag = true
      this.rowdata = JSON.parse(this.$store.state.getUserMsg).datas
    }
  },
  created() {
    if (sessionStorage.getItem('usertoken')) {
      this.corpName = JSON.parse(
        sessionStorage.getItem('getUserMsg')
      ).datas.nickname
      this.type = JSON.parse(sessionStorage.getItem('getUserMsg')).datas.type
    } else if (
      sessionStorage.getItem('getUserMsg') != '' &&
      localStorage.getItem('NewgetUserMsg')
    ) {
      this.corpName = JSON.parse(
        localStorage.getItem('NewgetUserMsg')
      ).datas.nickname
      this.type = JSON.parse(localStorage.getItem('NewgetUserMsg')).datas.type
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
.user-dropdown span {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  display: inline-block;
}
.bglogin {
  position: absolute;
  top: 0;
  width: 50px;
  height: 50px;
}
.toptitle {
  height: 93px;
  width: 100%;
  font-size: 30px;
  background: #407ee0;
  font-weight: 800;
  text-align: center;
  position: absolute;
  top: 0;
  color: #fff;
  line-height: 93px;
  text-align: left;
  letter-spacing: 1px;
  text-indent: 30px;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
  display: flex;
  &:focus {
    outline: none;
  }
  .loginName {
    text-align: center;
    font-size: 17px;
    padding-top: 20px;
    width: 160px;
    z-index: 1;
    dd,
    dt {
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      // height: 30px;
      // color: #fff;
      // line-height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #fff;
      height: 33px;
      line-height: 33px;
    }
  }
  .titleiconclass {
    text-align: center;
    width: 50px;
    color: #fff;
    font-size: 38px;
    padding-top: 30px;
    cursor: pointer;
  }
  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 30px;
    .avatar-wrapper {
      margin-top: 30px;
      position: relative;
      font-size: 48px;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 125px;
        font-size: 12px;
      }
    }
  }
}
</style>
