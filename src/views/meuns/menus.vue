<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)">查询</el-button>
          <el-button type="primary" @click="addmenus">添加一级菜单</el-button>
          <!-- <el-button type="primary" @click="auditmenus">编辑菜单</el-button> -->
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        style="
          width: 100%;
          margin-bottom: 20px;
          height: 600px;
          overflow-y: scroll;
        "
        row-key="id"
        border
        :default-expand-all="false"
      >
        <el-table-column prop="name" label="菜单名称" sortable width="230">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center">
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center">
        </el-table-column>
        <el-table-column prop="url" label="文件名称" align="center">
        </el-table-column>
        <el-table-column label="删除" align="center">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >编辑</el-button> -->
            <el-button size="mini" @click="addmenus(scope.$index, scope.row)"
              >添加下级菜单</el-button
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
    </div>
    <Meunsaudit
      :DialogTipShow="DialogTipShow"
      :dialogTitle="dialogTitle"
      @closeDialog="closeDialog"
      ref="child"
    ></Meunsaudit>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import service from '../Authentication/api/service'
import Meunsaudit from './Meunsaudit.vue'
export default {
  name: 'User',
  components: {
    Meunsaudit
  },
  data() {
    return {
      DialogTipShow: false,
      currentPage4: 4,
      form: {
        region: '',
        name: ''
      },
      tableData: [],
      rowdata: '',
      dialogTitle: ''
    }
  },
  methods: {
    closeDialog() {
      this.DialogTipShow = false
    },
    onSubmit() {
      this.getMenusInfo()
    },
    handleEdit(index, row) {
      this.DialogTipShow = !this.DialogTipShow
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
          this.deleteMenus(param)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    addmenus() {
      this.dialogTitle = '添加菜单'
      this.$refs.child.rest()
      this.DialogTipShow = !this.DialogTipShow
    },
    auditmenus(index, row) {
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
          this.getMenusInfo()
        }
      })
    },
    getMenusInfo() {
      const param = {
        limit: 10000,
        page: 1,
        name: this.form.name
      }
      service.getFindAlls(param).then((res) => {
        if (res.status == '200') {
          const data = res.data.data
          this.tableData = data
        }
      })
    }
  },
  created() {},
  mounted() {
    this.closeDialog()
    // 获取用户管理列表
    this.getMenusInfo()
  },
  computed: {}
}
</script>
<style lang="less">
// .dashboard-text {
//   .el-table tr {
//     background: #aecbe0!important;
//   }
// }
</style>
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
