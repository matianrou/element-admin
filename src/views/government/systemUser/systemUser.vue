<template>
  <div class="contentContainer">
    <el-card>
      <el-form
        ref="searchform"
        :inline="true"
        :model="searchform"
        class="demo-form-inline"
      >
        <el-form-item label="用户名">
          <el-input v-model="searchform.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户组级别">
          <el-select v-model="searchform.region" placeholder="请选择">
            <el-option label="本级灾监用户组" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(searchform)"
            >查询</el-button
          >
          <el-button type="primary" @click="addRole">添加用户</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="真实姓名" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在区划" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.officeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.enabled ? '已审核' : '未审核'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="350px">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              :disabled="scope.row.enabled"
              >审核</el-button
            > -->
            <el-button size="mini" @click="auditrole(scope.$index, scope.row)"
              >编辑</el-button
            >
            <!-- <el-button size="mini" @click="roleallot(scope.$index, scope.row)"
              >角色分配</el-button
            > -->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="block" style="float: right; margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          background
          :page-size="5"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div> -->
    </el-card>
    <!-- <Useraudit
      :DialogTipShow="DialogTipShow"
      :rowdata="rowdata"
      @closeDialog="closeDialog"
      :dialogTitle="dialogTitle"
      ref="child"
    ></Useraudit>
    <Rolealloat
      :rowdata="rowdata"
      :RolealloatShow="RolealloatShow"
    ></Rolealloat> -->
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import service from '../../Authentication/api/service'
// import Useraudit from './api/useradmin/useraudit.vue'
// import Rolealloat from './api/useradmin/rolealloat.vue'
export default {
  name: 'User',
  components: {
    // Useraudit,
    // Rolealloat
  },
  data() {
    return {
      DialogTipShow: false,
      RolealloatShow: false,
      currentPage: 1,
      searchform: {
        region: '',
        nickname: ''
      },
      tableData: [],
      total: 0,
      rowdata: '',
      dialogTitle: '',
      page: 1,
      limit: 10
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page = val
      this.getUserInfo()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUserInfo()
    },
    closeDialog() {
      this.DialogTipShow = false
    },
    onSubmit(data) {
      const param = {
        limit: 10,
        page: 1,
        nickname: data.nickname
      }
      service.getUserInfo(param).then(res => {
        if (res && res.status == '200') {
          const data = res.data.data
          this.tableData = data
          this.total = res.data.count
        }
      })
    },
    handleEdit(index, row) {
      this.$confirm('您确定要审核当前用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const param = {
          id: row.id,
          enabled: !row.enabled
        }
        service.updateEnabled(param).then(res => {
          if (res && res.status == '200') {
            this.$message({
              type: 'success',
              message: '审核成功'
            })
            this.getUserInfo()
          }
        })
      })
      // this.DialogTipShow = !this.DialogTipShow;
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
      this.rowdata = ''
      this.$refs.child.rest()
      this.dialogTitle = '用户添加'
      this.DialogTipShow = !this.DialogTipShow
    },
    auditrole(index, row) {
      row.password = ''
      this.rowdata = row
      this.dialogTitle = '用户编辑'
      this.DialogTipShow = !this.DialogTipShow
    },
    roleallot(index, row) {
      this.rowdata = row
      this.RolealloatShow = !this.RolealloatShow
    },
    // 获取当前用户信息
    getUserInfo() {
      const param = {
        limit: this.limit,
        page: this.page,
        nickname: ''
      }
      service.getUserInfo(param).then(res => {
        if (res && res.status == '200') {
          const data = res.data.data
          this.tableData = data
          this.total = res.data.count
        }
      })
    },
    // 删除当前用户
    deleteUserInfo(param) {
      service.deleteUserInfo(param).then(res => {
        if (res && res.status == '200') {
          this.getUserInfo()
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
    resetForm() {
      this.form = {} //重置表格对象
    }
  },
  created() {},
  mounted() {
    this.closeDialog()
    // 获取用户管理列表
    this.getUserInfo()
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
// .dashboard-container {
//   width: 100%;
//   height: 100%;
//   padding: 20px 20px 20px 20px;
// }
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
