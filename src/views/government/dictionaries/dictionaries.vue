<template>
  <div class="contentContainer">
    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="根据字典类型查询" label-width="200" prop="corpName">
        <el-input v-model="form.type" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="根据字典码查询" label-width="200" prop="corpName">
        <el-input v-model="form.value" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchentery(form)">查询</el-button>
        <el-button type="primary" @click="handleEdit('')">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="description" label="字典名称" align="center"></el-table-column>
      <el-table-column prop="type" label="字典类型" align="center"></el-table-column>
      <el-table-column prop="label" label="字典值" align="center"></el-table-column>
      <el-table-column prop="value" label="字典码" align="center"></el-table-column>
      <el-table-column prop="sort" label="排序号" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" align="center">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" />
    <Adddictionaries v-if="Adddictionaries" :rowdata="rowdata" />
  </div>
</template>
<script>
import echarts from 'echarts'
import Pagination from '../current/pagination.vue'
import Adddictionaries from './adddictionaries.vue'
import service from '../../Authentication/api/service'
export default {
  components: {
    Pagination,
    Adddictionaries
  },
  data() {
    return {
      form: {
        type: '',
        value: ''
      },
      Adddictionaries: false,
      total: 0,
      page: 1,
      limit: 10,
      rowdata: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    // 编辑、新添
    handleEdit(row) {
      this.rowdata = row
      this.Adddictionaries = !this.Adddictionaries
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('您确定删除当前数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          service.deleteDict(row.id).then(res => {
            if (res && res.status == 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getRenderlist()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 查询
    searchentery(data) {
      this.getRenderlist(this.page)
    },
    // 获取列表
    getRenderlist(val) {
      const param = {
        page: val || this.page,
        limit: this.limit,
        type: this.form.type,
        value: this.form.value
      }
      service.getDict(param).then(res => {
        this.total = res.data.count
        this.tableData = res.data.data
      })
    }
  },
  created() {
    this.getRenderlist()
  }
}
</script>
<style scoped>
</style>