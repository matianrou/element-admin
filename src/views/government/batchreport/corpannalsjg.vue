<template>
  <div class="contentContainer">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="上报年度">
        <div class="block">
          <el-date-picker
            v-model="form.reportingYear"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="监管机构" prop="officeId">
        <el-cascader
          v-model="form.officeId"
          placeholder="请选择"
          :key="options.value"
          :props="{ value: 'id', checkStrictly: true }"
          :options="options"
          :show-all-levels="false"
          ref="myCascader"
        ></el-cascader>
      </el-form-item>
      <el-form-item label>
        <el-checkbox-group v-model="form.isOwnOffice" @change="isOwnOffice">
          <el-checkbox label="本机构" name="0"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRenderlist()">查询</el-button>
      </el-form-item>
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
    <!-- <Pagination :total="total" /> -->
    <checkyearreport :year="Year" v-if="checkyeardialog" :rowdata="rowdata" :ischeck="ischeck" />
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
import checkyearreport from './checkyearreport.vue' // 查看页面
import Publicdialog from '../current/publicdialog.vue' // 点击企业名称 查看公共组件
import Pagination from '../current/pagination' // 翻页
export default {
  components: {
    Publicdialog,
    Pagination,
    checkyearreport
  },
  data() {
    return {
      form: {
        reportingYear: '',
        isOwnOffice: '',
        officeId: ''
      },
      checkyeardialog: false,
      ifType: JSON.parse(this.$store.state.getUserMsg).datas.type, //判断是企业用户还是政府用户，走不同的接口,0 为政府用户，1 是企业用户
      limit: 10,
      page: 1,
      total: 0,
      tableData: [],
      options: [],
      Officetype: '1',
      Year: ''
    }
  },
  methods: {
    checkyearreport(row) {
      this.rowdata = row
      this.ischeck = false
      this.checkyeardialog = !this.checkyeardialog
      this.Year = row.year
    },
    // 本机构
    isOwnOffice(val) {
      if (val) {
        this.Officetype = '0'
      } else {
        this.Officetype = '1'
      }
      this.getRenderlist()
    },
    // 获取列表
    getRenderlist(val) {
      const param = {
        limit: this.limit,
        page: val || this.page,
        isOwnOffice: this.Officetype,
        reportingYear: this.form.reportingYear || '',
        officeId:
          this.form.officeId[this.form.officeId.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      service.selectCorpAnnalsReport(param).then(res => {
        if (res && res.status === 200) {
          const data = res.data
          this.total = data.count
          this.tableData = data
        }
      })
    },
    getTimes() {
      let myDate = new Date()
      this.form.reportingYear = myDate.getFullYear().toString() // 获取当前年
      let currQuarter = new Date().getMonth() + 1
    },
    gettreeselect() {
      service.getyeartree().then(res => {
        this.options = res.data.datas
      })
    }
  },
  mounted() {
    this.getRenderlist()
  },
  created() {
    this.form.officeId =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
    this.getTimes()
    this.gettreeselect()
  }
}
</script>