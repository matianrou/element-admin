<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)">查询</el-button>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.createTime.substring(0,10) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.updateTime.substring(0,10) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色编码" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template slot-scope="scope">
            <el-button size="mini" @click="auditrole(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" @click="powerallot(scope.$index, scope.row)"
              >权限分配</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="float: right; margin-top: 20px">
        <!-- <el-pagination
    @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
    background
    :page-size="total"
    layout="total, prev, pager, next"
    :total="total">
    </el-pagination> -->
      </div>
    </div>
    <Roleaudit
      :DialogTipShow="DialogTipShow"
      :rowdata="rowdata"
      :dialogTitle="dialogTitle"
      @closeDialog="closeDialog"
    ></Roleaudit>
    <Allotrole
      :powerTipShow="powerTipShow"
      :datalist="datalist"
      @closeDialog="closeDialog"
    ></Allotrole>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import service from './api/service'
import Roleaudit from './api/useradmin/roleaudit.vue'
import Allotrole from './api/useradmin/allotrole.vue'
export default {
  name: 'User',
  components: {
    Roleaudit,
    Allotrole
  },
  data() {
    return {
      DialogTipShow: false,
      powerTipShow: false,
      currentPage4: 4,
      form: {
        region: '',
        name: ''
      },
      tableData: [],
      rowdata: '',
      dialogTitle: '',
      datalist: ''
    }
  },
  methods: {
    closeDialog() {
      this.DialogTipShow = false
    },
    onSubmit() {
      this.getRoleInfo()
    },
    handleEdit(index, row) {
      this.DialogTipShow = !this.DialogTipShow
    },
    powerallot(index, row) {
      this.datalist = row
      this.powerTipShow = !this.powerTipShow
    },
    handleDelete(index, row) {
      this.$confirm('您确定删除当前角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          const param = {
            id: row.id
          }
          this.deleteRole(param)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    addRole() {
      this.rowdata= ''
      this.dialogTitle = '添加角色'
      this.DialogTipShow = !this.DialogTipShow
    },
    auditrole(index, row) {
      this.rowdata = row
      this.dialogTitle = '编辑角色'
      this.DialogTipShow = !this.DialogTipShow
    },
    deleteRole(param) {
      service.deleteRole(param).then((res) => {
        if (res.status == '200') {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getRoleInfo()
        }
      })
    },
    getRoleInfo() {
      const param = {
        limit: 10000,
        page: 1,
        name: this.form.name
      }
      service.getRoleInfo(param).then((res) => {
        if (res.status == '200') {
          const data = res.data.datas
          this.tableData = data
        }
      })
    }
  },
  created() {},
  mounted() {
    this.closeDialog()
    // 获取用户管理列表
    this.getRoleInfo()
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  padding: 20px 20px 20px 20px;
}
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
