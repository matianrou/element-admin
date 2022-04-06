<template>
  <div class="contentContainer">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <!-- <el-form-item label="统计年度">
        <div class="block">
          <el-date-picker
            v-model="formInline.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          ></el-date-picker>
        </div>
      </el-form-item>-->
      <el-form-item label="选择时间">
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
      <el-form-item label="类别">
        <el-select v-model="formInline.chemicalType" placeholder="请选择">
          <el-option label="第一类" value="1"></el-option>
          <el-option label="第二类" value="2"></el-option>
          <el-option label="第三类" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监管机构" prop="officeName">
        <el-row>
          <el-col>
            <el-cascader
              v-model="formInline.officeName"
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
      <el-form-item>
        <!-- <el-button>本辖区</el-button> -->
        <!-- <el-button>下级上报</el-button> -->
        <el-button type="primary" @click="search(formInline)">查询</el-button>
        <el-button type="primary" @click="exportlist(formInline)">导出</el-button>
        <!-- <el-button type="primary" @click="fillIn">填写</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="yizhidudata" style="width: 100%;margin-top:20px">
      <el-table-column prop="chemicalName" label="品种名称" align="center"></el-table-column>
      <el-table-column prop="chemicalType" label="品种类别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.chemicalType == 1">第一类</span>
          <span v-if="scope.row.chemicalType == 2">第二类</span>
          <span v-if="scope.row.chemicalType == 3">第三类</span>
        </template>
      </el-table-column>
      <el-table-column label="生产" align="center">
        <el-table-column prop="prodLicensingNum" label="现有颁证数（份）" align="center">
          <template slot-scope="scope">
            <span
              @click="checkdetails(scope.row, '0')"
              style="color: blue; cursor: pointer"
            >{{ scope.row.prodLicensingNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="prodLicensingTotal" label="颁证载明总量（吨）" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="经营" align="center">
        <el-table-column prop="manageLicensingNum" label="现有颁证数（份）" align="center">
          <template slot-scope="scope">
            <span
              @click="checkdetails(scope.row, '1')"
              style="color: blue; cursor: pointer"
            >{{ scope.row.manageLicensingNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="manageLicensingTotal" label="颁证载明总量（吨）" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <contentdialog v-if="contentdialog" :rowdata="rowdata" />
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
import contentdialog from './contentdialog.vue'
import { exportToBlobXLSX } from '@/utils'

export default {
  name: 'quarterlyReport',
  components: {
    contentdialog
  },
  data() {
    return {
      yizhidudata: [],
      options: [],
      list: [],
      formInline: {
        officeName: '',
        year: '',
        startTime: '',
        quarter: ''
      },
      contentdialog: false,
      rowdata: ''
    }
  },
  methods: {
    // 生产，经营 现有颁证数弹框
    checkdetails(row, licenseType) {
      this.rowdata = row
      this.rowdata.newofficeId =
        this.formInline.officeName[this.formInline.officeName.length - 1] ||
        JSON.parse(this.$store.state.getUserMsg).datas.officeId
      this.rowdata.startTime = this.formInline.startTime[0]
      this.rowdata.endTime = this.formInline.startTime[1]
      this.rowdata.licenseType = licenseType
      this.contentdialog = !this.contentdialog
    },
    search(data) {
      this.getsheetreport()
    },
    getyeartree() {
      service.getyeartree().then(res => {
        this.options = res.data.datas
      })
    },
    getsheetreport() {
      const param = {
        officeId:
          this.formInline.officeName[this.formInline.officeName.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId,
        quarter: this.formInline.quarter || '',
        chemicalType: this.formInline?.chemicalType || '',
        startTime: this.formInline?.startTime ? this.formInline?.startTime[0] : '',
        endTime: this.formInline?.startTime ? this.formInline?.startTime[1] : '',
      }
      service.getsheetreport(param).then(res => {
        if (res) {
          if (res.status == 200) {
            this.yizhidudata = res.data.datas.quarterlyTwoList
          }
        }
      })
    },
    getTimes() {
      let myDate = new Date()
      this.formInline.year = myDate.getFullYear().toString() // 获取当前年
    },
    // 导出
    exportlist(data) {
      const url =
        this.$URL.baseURL +
        '/api-precursor/licensingquarterlytwo/licenseTwoCollectExport';
      const isNum = typeof this.formInline.officeName === 'number';
      const params = {
        token: sessionStorage.getItem('usertoken'),
        officeId: isNum ? this.formInline.officeName : +this.formInline.officeName.slice(-1),
        chemicalType: this.formInline?.chemicalType || '',
        startTime: this.formInline?.startTime ? this.formInline?.startTime[0] : '',
        endTime: this.formInline?.startTime ? this.formInline?.startTime[1] : '',
      }
      exportToBlobXLSX(url, params, '颁证化学品统计.xlsx')
    }
  },
  mounted() {
    this.formInline.officeName =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
    this.getTimes()
    this.getyeartree()
    this.getsheetreport()
  }
}
</script>