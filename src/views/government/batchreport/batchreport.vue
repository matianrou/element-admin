<template>
  <div class="contentContainer">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <!-- <el-form-item label="统计年度">
        <div class="block">
          <el-date-picker
            v-model="form.reportingYear"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
          ></el-date-picker>
        </div>
      </el-form-item> -->
      <el-form-item label="生产销售时间">
        <el-date-picker
          v-model="formInline.startTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-d"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="监管机构" v-if="ifType == 0" prop="officeId">
        <el-cascader
          v-model="formInline.officeId"
          placeholder="请选择"
          :key="options.value"
          :props="{ value: 'id', checkStrictly: true }"
          :options="options"
          :show-all-levels="false"
          ref="myCascader"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-checkbox-group v-model="formInline.isOwnOffice" @change="isOwnOffice">
          <el-checkbox label="本机构" name="0"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <!-- <el-table-column prop="year" label="年份" align="center"></el-table-column> -->
      <el-table-column prop="corpName" label="单位名称" align="center"></el-table-column>
      <el-table-column prop="corpManager" label="监管机构" align="center"></el-table-column>
      <el-table-column prop="corpTypeValue" label="企业类型" align="center"></el-table-column>
      <el-table-column prop="areaSalesMoney" label="易制毒销售金额(万元)" align="center"></el-table-column>
      <!-- <el-table-column prop="statusValue" label="状态" align="center"></el-table-column> -->
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <!-- <el-button size="small" @click="report(scope.row)" v-if="scope.row.status == 1 && ifType == 1">上报</el-button> -->
          <!-- <el-button size="small" @click="repeal(scope.row)" v-if="scope.row.isRevoke == 1">退回</el-button> -->
          <el-button size="small" @click="checkyearreport(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <CheckyearReport
      :year="formInline.year"
      v-if="checkyeardialog"
      :rowdata="rowdata"
      :ischeck="ischeck"
      :time="time"
    />
    <Publicdialog :rowdata="rowdata" :isShow="isShow" v-if="Publicdialogdialog" />
    <!-- <Pagination :total="total" /> -->
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
import CheckyearReport from './checkyearreport.vue' // 查看页面
import Publicdialog from '../current/publicdialog.vue' // 点击企业名称 查看公共组件
import Pagination from '../current/pagination' // 翻页
export default {
  components: {
    Publicdialog,
    Pagination,
    CheckyearReport
  },
  data() {
    return {
      formInline: {
        officeId: '',
        startTime:'',
        isOwnOffice:''
      },
      time:'',
      limit: 10,
      page: 1,
      total: 0,
      tableData: [],
      Publicdialogdialog: false,
      checkyeardialog: false,
      rowdata: '',
      ischeck: '',
      options: [],
      officeId: '',
      Officetype:'1',
      ifType: JSON.parse(this.$store.state.getUserMsg).datas.type //判断是企业用户还是政府用户，走不同的接口,0 为政府用户，1 是企业用户
    }
  },
  methods: {
    // 本机构查询条件
    isOwnOffice(val) {
      if (!val) {
        this.Officetype = '1'
      } else {
        this.Officetype = '0'
      }
      this.getRenderlist()
    },
    // 查看当前企业提交信息
    chechdetails(row) {
      this.rowdata = row
      this.Publicdialogdialog = !this.Publicdialogdialog
    },
    // 监管机构
    selectofficeId(data) {
      this.officeId = data[data.length - 1] || ''
    },
    // 获取列表
    getRenderlist(val) {
      // let url = ''
      // let status = ''
      // url = 'api-precursor/annualReportController/selectDeptShenChanInfo'
      // if (this.ifType == '1') {
      //   // 企业端年报上报接口
      //   status = this.rowdata.status
      //   url = 'api-precursor/annualReportController/selectRepThisYears'
      // } else {
      //   // 政府端年报上报接口
      //   status = '0'
      //   url = 'api-precursor/annualReportController/selectDeptShenChanInfo'
      // }
      const param = {
        limit: this.limit,
        page: val || this.page,
        isOwnOffice: this.Officetype,
        startTime: this.formInline?.startTime ? this.formInline?.startTime[0] : '',
        endTime: this.formInline?.startTime ? this.formInline?.startTime[1] : '',
        officeId:
          this.formInline.officeId[this.formInline.officeId.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      service.lineOperation(param).then(res => {
        if (res && res.status === 200) {
          const data = res.data
          this.total = data.count
          this.tableData = data
        }
      })
    },
    // 查看弹框
    checkyearreport(row) {
      this.rowdata = row
      this.time = this.formInline.startTime
      this.ischeck = true
      this.checkyeardialog = !this.checkyeardialog
    },
    // 上报弹框
    report(row) {
      this.ischeck = true
      this.rowdata = row
      this.checkyeardialog = !this.checkyeardialog
    },
    // 年报撤销
    repeal(row) {
      this.$confirm('此操作将撤销本年度已上报数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          year: this.formInline.year,
          corpId: row.corpId
        }
        service.repealyearreport(param).thne(res => {
          if (res.status == 200) {
            this.$message({
              message: res.resp_msg,
              type: 'info'
            })
            this.getRenderlist(1, 1)
          }
        })
      })
    },
    // 获取当前季度
    getTimes() {
      let myDate = new Date()
      this.formInline.year = myDate.getFullYear().toString() // 获取当前年
      let currQuarter = new Date().getMonth() + 1
      this.formInline.quarter = currQuarter = Math.floor(
        currQuarter % 3 == 0 ? currQuarter / 3 : currQuarter / 3 + 1
      ) // 获取当前季度
    },
    search() {
      this.getRenderlist(1, 1)
    },
    gettreeselect() {
      service.gettreeselect().then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.options = data
        }
      })
    }
  },
  mounted() {
    this.formInline.officeId =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
    this.getTimes()
    this.getRenderlist(1, 1)
    this.gettreeselect()
  }
}
</script>