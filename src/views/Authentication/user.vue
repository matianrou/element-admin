<template>
  <div class="contentContainer">
    <!-- 头部信息 -->
    <el-card>
      <el-form ref="searchform" :inline="true" :model="searchform" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchform.nickname" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户组级别">
          <el-select v-model="searchform.region" placeholder="请选择">
            <el-option label="本级灾监用户组" value="shanghai"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="监管机构" prop="officeName" v-if="ifType == 0">
          <el-row>
            <el-col>
              <el-cascader
                v-model="searchform.officeName"
                placeholder="请选择"
                :key="options.value"
                :props="{ value: 'id', checkStrictly: true }"
                :options="options"
                :show-all-levels="false"
                ref="myCascader"
                filterable
              ></el-cascader>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="ifType == 0">
          <el-checkbox-group v-model="searchform.isOwnOffice" @change="isOwnOffice">
            <el-checkbox label="本机构" name="0"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(searchform)">查询</el-button>
          <el-button type="primary" @click="addRole">添加用户</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户帐号" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="监管机构" prop="officeName" align="center"></el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户角色" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.roles[0]?scope.row.roles[0].name:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" v-if="ifType == 0" prop="auditBy" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="350px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.auditType == 0"
              @click="auditrole(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              v-if="scope.row.auditType == 0 || scope.row.auditType == null"
              @click="accountaudit(scope.$index, scope.row)"
            >审核</el-button>
            <el-button size="mini" v-if="scope.row.auditType == 1" disabled>已审核</el-button>
            <el-button size="mini" @click="restPasswordHandle(scope.$index, scope.row)">重置密码</el-button>
            <span v-if="scope.row.roles!==[] && scope.row.roles[0]">
              <el-button
                size="mini"
                type="danger"
                :disabled="scope.row.roles[0].code == 'QYYH'"
                v-if="scope.row.type !== '2' "
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </span>
            <span v-else>
              <el-button
                size="mini"
                type="danger"
                disabled
                v-if="scope.row.type !== '2' "
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        layout="total, prev, pager, next"
        @pagination="handleChangePage"
      />
    </el-card>
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
        :polesList="allPolesTypeList"
        @closeDialog="closeDialog"
        @reflashList="getUserPageInfo"
        ref="userInfoModal"
      ></user-audit>
    </el-dialog>
  </div>
</template>

<script>
import service from './api/service'
import Pagination from '@/components/Pagination/index.vue'
import UserAudit from './api/useradmin/useraudit.vue'

export default {
  name: 'User',
  components: {
    Pagination,
    UserAudit
  },
  data() {
    return {
      RolealloatShow: false,
      isShow: true,
      visit: false, // 弹出框
      editFlag: false, // 编辑操作
      // 遮罩层
      loading: true,
      searchform: {
        region: '',
        nickname: '',
        officeName: '',
        isOwnOffice: ''
      },
      Officetype: '1',
      tableData: [],
      allPolesTypeList: [], // 岗位字典
      rowdata: {},
      dialogTitle: '',
      total: 0,
      page: 1,
      limit: 10,
      options: [],
      ifType: JSON.parse(this.$store.state.getUserMsg).datas.type //判断是企业用户还是政府用户，走不同的接口,0 为政府用户，1 是企业用户
    }
  },
  mounted() {
    this.getUserPageInfo()
    // 查询用户岗位字典
    service.getAllPoles_type().then(response => {
      if (response.data.resp_code === 0) {
        this.allPolesTypeList = response.data.datas
      }
    })
    this.getyeartree()
  },
  methods: {
    isOwnOffice(val) {
      if (val) {
        this.Officetype = '0'
      } else {
        this.Officetype = '1'
      }
      this.getUserPageInfo()
    },
    // 获取当前组织机构
    getyeartree() {
      service.getyeartree().then(res => {
        this.options = res.data.datas
      })
    },
    closeDialog() {
      this.visit = false
      this.rowdata = {}
      this.$refs['userInfoModal'].restForm()
    },
    handleChangePage() {
      this.getUserPageInfo(this.searchform.nickname)
    },
    onSubmit(data) {
      this.limit = 10
      this.page = 1
      this.getUserPageInfo(data.nickname)
    },
    getUserPageInfo(nickname = '') {
      const param = {
        limit: this.limit,
        page: this.page,
        nickname,
        isOwnOffice: this.Officetype || '',
        officeId:
          this.searchform.officeName[this.searchform.officeName.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      service.getUserInfo(param).then(res => {
        // console.log(param,'打印请求的param')
        if (res && res.status == '200') {
          const data = res.data.data
          this.tableData = data
          this.total = res.data.count
          this.loading = false
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('您确定要删除当前用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          const param = {
            id: row.id
          }
          this.deleteUserInfo(param)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addRole() {
      this.rowdata = {}
      this.dialogTitle = '用户添加'
      this.visit = !this.visit
      this.editFlag = false
    },
    auditrole(index, row) {
      this.isShow = true
      this.rowdata = row
      this.dialogTitle = '用户编辑'
      this.visit = !this.visit
      this.editFlag = true
    },
    // 删除当前用户
    deleteUserInfo(param) {
      service.deleteUserInfo(param).then(res => {
        if (res && res.status == '200') {
          this.getUserPageInfo()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '删除失败!'
          })
        }
      })
      return
    },
    // 重置密码默认初始值
    restPasswordHandle(_, row) {
      console.log(row)
      this.$confirm(
        `您确定要重置当前用户密码吗?
        （默认重置后密码为 "Yzd_13572468"）`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          if (!row.id) return
          service.resetUserPs(row).then(response => {
            if (response.data.resp_code === 0) {
              return this.$message.success('密码重置成功!')
            } else {
              this.$message.warning('重置失败，请稍后尝试!')
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 审核按钮
    accountaudit(index, item) {
      let param={
        id:item.id,
        auditType:1,
        type:item.type,
        openId:item.openId
      }
      this.$confirm('您确定要审核当前帐号并赋予权限吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.auditType = 1
        item.auditBy = JSON.parse(this.$store.state.getUserMsg).datas.id
        service.auditUser(param).then(res => {
          if (res && res.status == 200) {
            this.$message({
              type: 'success',
              message: '审核成功'
            })
            this.getUserPageInfo(this.searchform.nickname)
          }
        })
      })
    }
  },
  created() {
    this.searchform.identityCard
    this.searchform.officeName =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
  }
}
</script>

<style lang="scss" scoped>
.User {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
