<template>
  <div class="contentContainer">
    <el-card>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="统计年度">
          <div class="block">
            <el-date-picker
              v-model="form.year"
              type="year"
              placeholder="按年份查询"
              value-format="yyyy"
            />
          </div>
        </el-form-item>
        <el-form-item label="许可备案类型">
          <el-select v-model="form.licenseType" @change="handleResetPage" placeholder="请选择">
            <el-option label="生产" value="0"></el-option>
            <el-option label="经营" value="1"></el-option>
            <el-option label="全部" value></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getProduce">查询</el-button>
          <el-button type="primary" @click="addlicense">添加</el-button>
        </el-form-item>
      </el-form>
      <ul class="tabledata">
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column label="许可备案类型" align="center" prop="licenseChemicalTypeValue"></el-table-column>
          <el-table-column label="品种类型" align="center" prop="chemicalTypeValue"></el-table-column>
          <el-table-column label="品种名称" prop="chemicalName" align="center"></el-table-column>
          <el-table-column label="生产量(吨)" prop="purchaseVolume" align="center"></el-table-column>
          <el-table-column label="生产时间" prop="prodPurchTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.prodPurchTime ? scope.row.prodPurchTime.substring(0, 10) : '----' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上报时间" prop="reportingTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.reportingTime || '----' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="350px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                :disabled="scope.row.status == 0"
                @click="auditrole(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                :disabled="scope.row.status == 0"
                @click="reportlist(scope.$index, scope.row)"
              >{{ scope.row.status == 0 ? '已上报' : '上报' }}</el-button>
              <el-button
                size="mini"
                type="danger"
                :disabled="scope.row.status == 0"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="float: right; margin: 20px 0;">
          <Pagination
            :total="total"
            :page.sync="page"
            :limit.sync="limit"
            layout="total, prev, pager, next"
            @pagination="handleChangePage"
          />
        </div>
      </ul>
    </el-card>
    <Addmanagement
      v-if="licensedialog"
      ref="child"
      :year="form.year"
      :rowdata="rowdata"
      :credentialList="credentialList"
    />
  </div>
</template>
<script>
import mixins from '@/utils/mixins'
import service from '../Authentication/api/service'
import Addmanagement from './addmanagement'
import Pagination from '@/components/Pagination/index.vue'

export default {
  components: {
    Addmanagement,
    Pagination
  },
  mixins: [mixins],
  props: {
    ischeck: false
  },
  data() {
    return {
      rowdata: '',
      limit: 10,
      total: 0,
      page: 1,
      form: {
        year: '',
        licenseType: ''
      },
      tableData: [],
      licensedialog: false,
      loading: false
    }
  },
  created() {
    this.form.year = new Date().getFullYear().toString()
    // if (!this.ischeck) {
    this.getProduce()
    // }
    const userInfo = JSON.parse(this.$store.state.getUserMsg).datas
    const params = {
      corpId: userInfo.corpId || '',
      officeId: userInfo.officeId || '',
      licenseType: ''
    }
    service.searchFirmCredential(params).then(response => {
      if (response.data.resp_code === 0) {
        this.credentialList = response.data.datas
      }
    })
  },
  methods: {
    // 删除
    handleDelete(index, row) {
      const param = { id: row.id }
      this.$confirm('是否确定删除此条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.deleteenteryizhidu(param).then(res => {
            if (res && res.status == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getProduce()
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    addlicense() {
      this.rowdata = ''
      this.licensedialog = !this.licensedialog
    },
    auditrole(index, row) {
      this.rowdata = row
      this.licensedialog = !this.licensedialog
    },
    getProduce() {
      const param = {
        page: this.page,
        limit: this.limit,
        year: this.form.year || '',
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId || '',
        licenseType: this.form.licenseType,
        productionType: 1,
      }
      service.getProduce(param).then(res => {
        if (res && res.status == 200) {
          const data = res.data.data
          this.tableData = data
          this.total = res.data.count
        }
      })
    },
    // 翻页
    handleChangePage(data) {
      this.limit = data.limit
      this.page = data.page
      this.getProduce()
    },
    // 重置分页信息
    handleResetPage() {
      this.page = 1;
      this.limit = 10;
    },
    // 生产购入管理上报
    reportlist(index, row) {
      const param = {
        id: row.id
      }
      this.$confirm('是否确定上报当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.reprotUpdate(param).then(res => {
            if (res && res.data.resp_code == 0) {
              this.$message.success(res.data.resp_msg)
              this.getProduce()
            } else {
              this.getProduce()
              this.$message.error(res.data.resp_msg)
            }
          })
        })
        .catch(() => {
          return false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.tabledata {
  width: 100%;
  border: 1px solid #ebeef5;
  .dataname {
    border-right: 1px solid #ebeef5;
    height: 100%;
    width: 100%;
  }
  .contentbd {
    width: 100%;
    span {
      border-bottom: 1px solid #ebeef5;
    }
  }
  li {
    width: 100%;
    text-align: center;
    line-height: 40px;
    display: flex;
    border-bottom: 1px solid #ebeef5;
    align-items: center;
    div {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
      float: left;
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-right: 1px solid #ebeef5;
        border-top: none;
      }
    }
  }
}
.title {
  display: flex;
  span {
    display: inline-block;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #ebeef5;
    background: #fafafa;
  }
}
</style>
