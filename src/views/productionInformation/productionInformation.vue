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
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="prodChemicalFlow(formInline)">查询</el-button>
          <el-button type="primary" @click="addlicense">添加</el-button>
          <!-- <el-button type="primary" @click="yearlyReport">年度上报</el-button> -->
          <!-- <el-button type="primary" @click="yearReportrecord">年度上报历史记录</el-button> -->
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        id="tableData"
        style="width: 100%"
        :header-row-style="tableRowClassName"
      >
        <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center">
          <template slot-scope="scope">
            <p class>{{ scope.row.licenseChemicalTypeValue}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chemicalTypeValue" label="品种类型" align="center">
          <template slot-scope="scope">
            <p class>{{ scope.row.chemicalTypeValue}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chemicalName" label="品种名称" align="center">
          <template slot-scope="scope">
            <p class>{{ scope.row.chemicalName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chemicalName" label="销售总量" align="center">
          <template slot-scope="scope">
            <p class>{{ scope.row.areaSales + '(' + scope.row.unit + ')'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">
            <p
              class="rowzidingyi"
              v-for="(item,index) in scope.row.prodChemicalFlowList"
              :key="index"
            >
              <span>{{ item.provinceValue?item.provinceValue+ '/': '' }}{{ item.cityValue?item.cityValue + '/': ''}}{{ item.countryName?item.countryName:'' }}</span>
              <!-- <span>{{ item.cityValue }}</span> -->
              <!-- <span>{{ item.countryName }}</span> -->
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="chemicalName" label="销售量" align="center">
          <template slot-scope="scope">
            <p
              v-for="(item,index) in scope.row.prodChemicalFlowList"
              :key="index"
              class="rowzidingyi"
            >{{ item.areaSales + '(' + item.unit + ')'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="saleTime" label="销售时间" align="center"></el-table-column>
        <el-table-column prop="reportingTime" label="上报时间" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.reportingTime || '----'}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.status == '1' ? '未上报' : '已上报'}}</p>
          </template>
        </el-table-column>-->
        <el-table-column prop="state" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="auditlist(scope.row, scope.$index,false)">查看</el-button>
            <el-button
              size="mini"
              type="text"
              @click="auditlist(scope.row, scope.$index,true)"
              :disabled="scope.row.status == 0"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.status == 0"
              @click="reportlist(scope.$index,scope.row)"
            >{{scope.row.status== 0?'已上报':'上报'}}</el-button>
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.status == 0"
              @click="deletelist(scope.row, scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="float: right; margin: 20px 0;">
        <el-pagination
          :current-page="currentPage"
          background
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <Addproduction
      v-if="licensedialog"
      ref="child"
      :year="formInline.year"
      :rowlist="rowlist"
      :isShow="isShow"
      :credentialList="credentialList"
    />
    <ReportList
      v-if="reportdialog"
      :isShow="isShow"
      :year="formInline.year"
      :title="title"
      ref="reportpage"
    />
  </div>
</template>
<script>
import mixins from '@/utils/mixins'
import service from '../Authentication/api/service'
import Addproduction from './addproduction'
import ReportList from './reportList'

export default {
  components: {
    Addproduction,
    ReportList
  },
  mixins: [mixins],
  props: {
    ischeck: false
  },
  data() {
    return {
      reportdialog: false,
      rowlist: '',
      limit: 10,
      page: 1,
      total: 0,
      currentPage: 1,
      formInline: {
        year: ''
      },
      tableData: [],
      credentialList: [],
      licensedialog: false,
      isShow: true,
      spanArr: [],
      rowlist: '',
      storeTypespanArr: [],
      title: ''
    }
  },
  created() {
    this.formInline.year = new Date().getFullYear().toString()
    if (!this.ischeck) {
      this.prodChemicalFlow()
    }
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
    // render 事件
    tableRowClassName({ row, rowIndex }) {
      return 'background:#ccc;color:#555;height: 40px;'
    },
    // 添加
    addlicense() {
      this.isShow = true
      this.rowlist = ''
      this.licensedialog = !this.licensedialog
    },
    //数据 删除
    deletelist(row) {
      const param = {
        chemicalId: row.chemicalId,
        propUuid: row.propUuid,
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId
      }
      this.$confirm('是否确定删除当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.delProductionFolw(param).then(res => {
            if (res && res.status == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.prodChemicalFlow()
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 编辑
    auditlist(row, index, boo) {
      this.isShow = boo
      this.rowlist = JSON.parse(JSON.stringify(row))
      this.licensedialog = !this.licensedialog
    },

    dialogfalse() {
      this.dialogFormVisible = false
    },
    // 销售上报
    async reportlist(index, row) {
      const param = {
        chemicalId: row.chemicalId,
        propUuid: row.propUuid
      }
      this.$confirm('是否确定上报当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.salereprotlist(param).then(res => {
            if (res && res.data.resp_code == 200) {
              this.$message.success(res.data.resp_msg)
            } else {
              this.$message.error(res.data.resp_msg)
            }
            this.prodChemicalFlow()
          })
        })
        .catch(() => {
          return false
        })
    },
    reportcallback() {
      const param = {
        chemicalId: this.rowlist.chemicalId,
        propUuid: this.rowlist.propUuid
      }
      this.$confirm('是否确定上报当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.dialogFormVisible = false
          service.salereprotlist(param).then(res => {
            if (res && res.data.resp_code == 200) {
              this.$message.success(res.data.resp_msg)
            } else {
              this.$message.error(res.data.resp_msg)
            }
            this.prodChemicalFlow()
          })
        })
        .catch(() => {
          return false
        })
    },
    // 列表接口
    prodChemicalFlow() {
      const param = {
        limit: this.limit,
        page: this.page,
        year: this.formInline.year || '',
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId || ''
      }
      service.prodChemicalFlow(param).then(res => {
        if (res && res.status == 200) {
          const data = res.data.data
          // this.tableData = data
          this.total = res.data.count
          try {
            this.tableData = data.map(item => {
              if (item.prodChemicalFlowList.length) {
                item.prodChemicalFlowList = item.prodChemicalFlowList.map($ => {
                  $.areaId = this.interpretArea($.areaId, this.areaExportList)
                  return $
                })
              }
              return item
            })
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    // 翻页
    handleSizeChange(val) {
      this.page = val
      this.prodChemicalFlow()
    },
    handleCurrentChange(val) {
      this.page = val
      this.prodChemicalFlow()
    },
    // 年度上报
    yearlyReport() {
      let _this = this
      _this.isShow = false
      _this.title = '年度上报'
      _this.reportdialog = !this.reportdialog
      this.$nextTick(() => {
        _this.$refs.reportpage.getRenderlistOne()
      })
    },
    // 年度上报
    yearReportrecord() {
      this.isShow = true
      this.title = '年度上报历史记录'
      this.reportdialog = !this.reportdialog
      this.$nextTick(() => {
        this.$refs.reportpage.getRenderlistTwo()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.tabledata {
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  .caozuo {
    border-bottom: 1px solid #ccc;
  }
  width: 100%;
  // border: 1px solid #ebeef5;
  .dataname {
    height: 100%;
    width: 100%;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .contentbd {
    width: 100%;
    span {
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      // overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    b {
      font-weight: inherit;
    }
  }
  li {
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    div {
      display: inline-block;
      width: 100% !important;
      text-align: center;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      // white-space: nowrap;
      height: 40px;
      line-height: 40px;
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        text-align: center;
        // border-right: 1px solid #ebeef5;
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
    border: 1px solid #ccc;
    background: #fafafa;
  }
}
.rowzidingyi {
  width: 100%;
  height: 70px !important;
  border-bottom: 1px solid #ebeef5;
  padding: 18px 0 0 0;
}
.xiaoshouliang {
  line-height: 90px;
}
</style>
<style>
#tableData {
  border: 1px solid #ebeef5;
}
#tableData .cell {
  padding: 0 !important;
}
#tableData .el-table__cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-right: 1px solid #ebeef5 !important;
  padding: 0;
}
</style>
