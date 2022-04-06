<template>
  <div class="contentContainer">
    <div>
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
        <!-- <el-form-item label="选择时间">
          <el-date-picker
            v-model="formInline.startTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-d"
            align="right"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="第" v-show="false">
          <el-select v-model="formInline.quarter" placeholder="请选择季度">
            <el-option label="第一季度" value="1"></el-option>
            <el-option label="第二季度" value="2"></el-option>
            <el-option label="第三季度" value="3"></el-option>
            <el-option label="第四季度" value="4"></el-option>
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
        <el-form-item v-if="ifType == 0">
          <el-checkbox-group v-model="formInline.isOwnOffice" @change="isOwnOffice">
            <el-checkbox label="本机构" name="0"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <!-- <el-button>本辖区</el-button> -->
          <!-- <el-button>下级上报</el-button> -->
          <el-button type="primary" @click="search(formInline)">查询</el-button>
          <el-button type="primary" @click="exportlist(formInline)">导出</el-button>
          <!-- <el-button type="primary" @click="fillIn">填写</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="entertitle">
      <!-- <h2>非药品类易制毒化学品生产、经营许可证和备案证明颁证季度报表</h2> -->
      <!-- <h2></h2> -->
    </div>
    <div>
      <el-table :data="tableData" show-summary v-loading="loading">
        <!-- <el-table-column label="报告期" prop="year" align="center"> </el-table-column> -->
        <el-table-column label="季度" prop="quarter" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.quarter == 1">第一季度</span>
            <span v-if="scope.row.quarter == 2">第二季度</span>
            <span v-if="scope.row.quarter == 3">第三季度</span>
            <span v-if="scope.row.quarter == 4">第四季度</span>
          </template>
        </el-table-column>
        <el-table-column label="生产" align="center">
          <el-table-column prop="prodLicensingNum" align="center" label="本季度"></el-table-column>
          <!-- <el-table-column
            prop="prodPublishedOnline"
            label="网上公布数"
            align="center"
          ></el-table-column>-->
          <el-table-column prop="prodLicensingTotal" label="颁证载明总量" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="经营" align="center">
          <el-table-column prop="manageLicensingNum" label="现有颁证数（份）" align="center"></el-table-column>
          <!-- <el-table-column
            prop="managePublishedOnline"
            label="网上公布数"
            align="center"
          ></el-table-column>-->
          <el-table-column prop="manageLicensingTotal" label="颁证载明总量" align="center"></el-table-column>
        </el-table-column>
        <!-- <el-table-column
          prop="manageLicensePublishedOnline"
          label="状态"
          align="center"
        >
        </el-table-column>-->
        <el-table-column prop="zip" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="fillIn(scope.row)">查看</el-button>
            <!-- <el-button size="small" @click="checklist"> 上报 </el-button>
            <el-button size="small" type="danger" @click="checklist">
              删除
            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <FillIn v-if="FillIndialog" :rowdata="rowdata" :formInline="formInline" />
  </div>
</template>
<script lang="ts">
import service from '../../Authentication/api/service'
import FillIn from './fillIn.vue'
import { exportToBlobXLSX } from '@/utils'

export default {
  name: 'quarReport',
  components: {
    FillIn
  },
  data() {
    return {
      FillIndialog: false,
      formInline: {
        year: '',
        quarter: '',
        officeName: '',
        isOwnOffice: '',
        startTime: ''
      },
      tableData: [],
      newData: [],
      enterlist: [],
      options: [],
      size: '',
      rowdata: '',
      ifType: JSON.parse(this.$store.state.getUserMsg).datas.type, //判断是企业用户还是政府用户，走不同的接口,0 为政府用户，1 是企业用户
      loading: true
    }
  },
  methods: {
    // 查询是否是本机构
    isOwnOffice(val) {
      if (val) {
       this.formInline.Officetype = '0'
      } else {
       this.formInline.Officetype = '1'
      }
      this.getRenderlist()
    },
    dateFormat(row, column) {
      return row.createTime.substring(0, 10)
    },
    updateTime(row, column) {
      return row.updateTime.substring(0, 10)
    },
    onSubmit() { },
    fillIn(row) {
      this.rowdata = row
      this.FillIndialog = !this.FillIndialog
    },
    // 导出
    exportlist() {
      const url =
        this.$URL.baseURL +
        '/api-precursor/licensingquarterlyone/findLicense/allListExport';
      const isNum = typeof this.formInline.officeName === 'number';
      const params = {
        token: sessionStorage.getItem('usertoken'),
        officeId: isNum ? this.formInline.officeName : +this.formInline.officeName.slice(-1),
        year: this.formInline.year || '',
        quarter: this.formInline.quarter || ''
      }
      exportToBlobXLSX(url, params, '颁证情况统计.xlsx')
    },
    search(data) {
      this.getRenderlist()
    },
    getRenderlist() {
     
      // 当前项目二查询列表
      const param = {
        officeId:this.formInline.officeName[this.formInline.officeName.length - 1] || JSON.parse(this.$store.state.getUserMsg).datas.officeId,
        quarter: this.formInline.quarter || '',
        year: this.formInline.year || '',
        isOwnOffice: this.formInline.Officetype || ''
      }
      service.getallList(param).then(res => {
        if (res.status == 200) {
          this.tableData = res.data.datas
          this.loading = false
        }
      })
    },
    getTimes() {
      let myDate = new Date()
      this.formInline.year = myDate.getFullYear().toString() // 获取当前年
      let currQuarter = new Date().getMonth() + 1
      this.getRenderlist()
    },
    getyeartree() {
      service.getyeartree().then(res => {
        this.options = res.data.datas
      })
    }
  },
  created() {
    this.formInline.officeName =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
    this.getTimes()
    this.getyeartree()
  }
}
</script>
<style lang="less" scoped>
.container {
  .entertitle {
    width: 100%;
    h2 {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
  }
}
</style>
