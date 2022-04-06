<template>
  <div class="contentContainer">
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="统计年度">
          <div class="block">
            <el-date-picker
              v-model="formInline.year"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(formInline)">查询</el-button>
          <el-button type="primary" @click="addlicense">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="year" label="年份" align="center"></el-table-column>
        <el-table-column prop="reportPerson" label="上报人" align="center"></el-table-column>
        <el-table-column prop="generalIncome" label="销售收入（万元）" align="center"></el-table-column>
        <el-table-column prop="chemicalIncome" label="易制毒销售收入" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="录入时间" align="center"></el-table-column>
        <el-table-column prop="licenseExpireEnd" label="状态" align="center">
          <template slot-scope="scope">{{ scope.row.status == 1 ? '未上报' : '已上报' }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220px">
          <template slot-scope="scope">
            <el-button size="mini" @click="checkHandle(scope.$index, scope.row)">查看</el-button>
            <el-button
              size="mini"
              @click="audit(scope.$index, scope.row)"
              :disabled="scope.row.status == '0'"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="scope.row.status == '0'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="float: right; margin: 20px 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          background
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <Addlicense
      :rowdata="rowdata"
      :check="check"
      v-if="licensedialog"
      :year="formInline.year"
      :ischeck="ischeck"
      ref="child"
    />
  </div>
</template>
<script>
import Addlicense from './addlicense'
import service from '../Authentication/api/service'
export default {
  components: {
    Addlicense
  },
  data() {
    return {
      check: false,
      rowdata: {},
      formInline: { year: '' },
      tableData: [],
      licensedialog: false,
      limit: 10,
      page: 1,
      total: 0,
      currentPage: 1,
      ischeck: true
    }
  },
  methods: {
    search(data) {
      this.getEnterpriseSales()
    },
    addlicense() {
      this.rowdata = {}
      this.formdata = {}
      this.ischeck = true
      this.licensedialog = !this.licensedialog
    },
    getEnterpriseSales() {
      const param = {
        limit: this.limit,
        page: this.page,
        year: this.formInline.year ? this.formInline.year : ''
      }
      service.enterpriseSales(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.data
          this.total = res.data.count
        }
      })
    },
    checkHandle(index, row) {
      this.rowdata = row
      this.ischeck = false
      this.licensedialog = !this.licensedialog
    },
    audit(index, row) {
      this.rowdata = row
      this.ischeck = true
      this.licensedialog = !this.licensedialog
    },
    // 删除
    handleDelete(index, row) {
      const param = {
        id: row.id
      }
      this.$confirm('是否确定删除此条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.deleteenterpriseSales(param).then(res => {
            if (res && res.status == 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getEnterpriseSales()
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 翻页
    handleSizeChange(val) {
      this.page = val
      this.getEnterpriseSales()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getEnterpriseSales()
    },
    // 获取当前季度
    getTimes() {
      let myDate = new Date()
      this.formInline.year = myDate.getFullYear().toString() // 获取当前年
    }
  },
  mounted() {
    this.getTimes()
    this.getEnterpriseSales()
  }
}
</script>
<style>
.el-input {
  width: 200px !important;
}
.el-button--mini {
  margin-left: 2px !important;
}
</style>
