<template>
  <!-- <div v-if="!item.hidden" class="menu-wrapper"> -->
  <div class="menu-wrapper" id="leftlist">
    <el-menu
      :default-active="getMeunActive"
      class="el-menu-vertical-demo"
      background-color="#F1EFF2"
      text-color="#000"
      active-text-color="#ffd04b"
    >

      <div v-for="item in list" :key="item.id.toString()">

        <template v-if="item.subMenus == null || item.subMenus.length == 0">
          <el-menu-item :index="item.id.toString()" @click="routerpath(item)">
            <i :class="item.css" class="icon"></i>
            {{ item.name }}
          </el-menu-item>
        </template>

        <el-submenu v-else :index="item.id.toString()">
          <div slot="title">
            <i :class="item.css" class="icon"></i>
            <span>{{ item.name }}</span>
          </div>
          <el-menu-item
            v-for="item in item.subMenus"
            :key="item.id.toString()"
            :index="item.id.toString()"
            @click="routerpath(item)"
          >{{ item.name }}</el-menu-item>
        </el-submenu>

      </div>
    </el-menu>
  </div>
</template>

<script>
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import interfaceService from '@/api/user'
import routerpath from '@/assets/path'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {},
  data() {
    this.onlyOneChild = null
    return {
      list: [],
      getMeunActive: this.$store.state.getMeunActive,
      username: true,
      changevalue: {
        principal: false, // 单位法定人或者主要负责人改变
        units: false, // 单位名称改变
        Permitflow: false, // 许可品种主要流向改变
        variety: false, //需要增加许可品种、数量
        importance: true, // 多余变量同样用来控制显隐
      }
    }
  },
  watch: {
    '$store.state.getMeunActive': {
      immediate: true,
      handler(val) {
        this.getMeunActive = val
      }
    }
  },
  computed: {},
  methods: {
    routerpath(item) {
      this.$store.commit('applicationStatus', this.changevalue)
      this.$router.push({ name: item.url })
    },
    getcurrent(data) {
      if (data.datas.type == 1 && data.datas.auditType == 1) {
        this.list = routerpath.enter
        return
      } else if (data.datas.type == 0 || data.datas.type == 2) {
        if (data.datas.username == 'superadmin') {
          routerpath.government[8].subMenus[2].show = true
          routerpath.government[8].subMenus[3].show = true
          // routerpath.government[8].subMenus.push(newlist[1])
        } else {
          routerpath.government[8].subMenus[2].show = false
          routerpath.government[8].subMenus[3].show = false
        }
        this.$nextTick(() => {
          this.list = routerpath.government
        })
        return
      }
      if (data.datas.auditType == 0 && data.datas.type == 1) {
        this.list = [routerpath.enter[0]]
      }
    },
    getleftlist() {
      interfaceService.getleftlist().then(res => {
        if (res && res.status == 200) {
          this.list = res.data
          this.$router.push({ name: this.list[0].url })
          this.$nextTick(() => {
            this.getMeunActive = this.list[0].id.toString()
          })
        }
      })
    },
    // 获取当前账户权限
    getusermsg() {
      interfaceService.getUsermsg().then(res => {
        if (res && res.status == '200') {
          const data = res.data
          this.getcurrent(data)
        }
      })
    }
  },
  created() {
    // 获取左侧菜单栏
    this.getleftlist()
    
    // 本地路由
    // this.getusermsg()
  }
}
</script>
<style>
.el-submenu__title {
  font-size: 16px;
}
.el-menu .el-menu-item-group__title {
  display: none;
}
.el-menu-item.is-active {
  background-color: #d2e6f8 !important;
  color: #407ee0 !important;
}
#leftlist .el-menu-item {
  font-size: 16px !important;
  padding-left: 20px !important;
}
::-webkit-scrollbar {
  width: 8px;
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: inherit;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #a8b1b8;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
</style>
<style lang="scss" scoped>
$iconurl: "../../../assets/systemIcon";
.icon {
  display: inline-block;
  width: 20px;
  height: 20px;
}
.business-management {
  background: url(#{$iconurl}/qiyeguanli.svg) no-repeat;
  background-size: 100%;
}

.chemical-management {
  background: url(#{$iconurl}/huaxuepin.svg) no-repeat;
  background-size: 100%;
}
.approval {
  background: url(#{$iconurl}/beianshenpi.svg) no-repeat;
  background-size: 100%;
}
.record-issued {
  background: url(#{$iconurl}/beianbanfa.svg) no-repeat;
  background-size: 100%;
}
.record-print {
  background: url(#{$iconurl}/dayin.svg) no-repeat;
  background-size: 100%;
}
.licensing-applications {
  background: url(#{$iconurl}/shenqing.svg) no-repeat;
  background-size: 100%;
}
.operational-report {
  background: url(#{$iconurl}/baogao.svg) no-repeat;
  background-size: 100%;
}
.record-management {
  background: url(#{$iconurl}/beianguanli.svg) no-repeat;
  background-size: 100%;
}
.system-management {
  background: url(#{$iconurl}/systemadmin.svg) no-repeat;
  background-size: 100%;
}
.flow-chart {
  background: url(#{$iconurl}/liuchengtu.svg) no-repeat;
  background-size: 100%;
}
.icon-company {
  background: url(#{$iconurl}/company.svg) no-repeat;
  background-size: 100%;
}
.icon-licence-apply {
  background: url(#{$iconurl}/licenceapply.svg) no-repeat;
  background-size: 100%;
}
.icon-licence-manage {
  background: url(#{$iconurl}/licencemanage.svg) no-repeat;
  background-size: 100%;
}
.icon-prod-manage {
  background: url(#{$iconurl}/prodmanage.svg) no-repeat;
  background-size: 100%;
}
.icon-record {
  background: url(#{$iconurl}/record.svg) no-repeat;
  background-size: 100%;
}
.icon-sales {
  background: url(#{$iconurl}/sales.svg) no-repeat;
  background-size: 100%;
}
.icon-user-manage {
  background: url(#{$iconurl}/usermanage.svg) no-repeat;
  background-size: 100%;
}
.icon-annals {
  background: url(#{$iconurl}/annals.svg) no-repeat;
  background-size: 100%;
}
.icon-proposer {
  background: url(#{$iconurl}/proposer.svg) no-repeat;
  background-size: 100%;
}
.system-summarySheet {
  background: url(#{$iconurl}/huizong.svg) no-repeat;
  background-size: 100%;
}
.annual-reports {
  background: url(#{$iconurl}/qiyenianbao.svg) no-repeat;
  background-size: 100%;
}
</style>
