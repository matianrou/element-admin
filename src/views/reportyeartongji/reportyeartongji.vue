<template>
  <div class="contentContainer">
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
    >
      <!-- <el-form-item label="统计年度">
        <div class="block">
          <el-date-picker
            v-model="formInline.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          ></el-date-picker>
        </div>
      </el-form-item> -->
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
      <el-form-item
        label="监管机构"
        prop="officeName"
      >
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
        <el-button
          type="primary"
          @click="search(formInline)"
        >查询</el-button>
        <el-button
          type="primary"
          @click="exportlist(formInline)"
        >导出</el-button>
        <!-- <el-button type="primary" @click="fillIn">填写</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="licenseChemicalTypeValue"
        label="许可备案类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="areaSales"
        label="销售量"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="areaSalesMoney"
        label="销售金额（万元）"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="purchaseVolume"
        label="购入量/生产量"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="sales"
        label="自用量"
        align="center"
      ></el-table-column>
      <!-- <el-table-column
        prop="purchaseVolume"
        label="库存量"
        align="center"
      ></el-table-column> -->
    </el-table>
  </div>
</template>
<script>
import service from '../Authentication/api/service'
import { exportToBlobXLSX } from '@/utils'

export default {
  components: {},
  data() {
    return {
      formInline: {
        year: '',
        officeName: '',
        startTime:''
      },
      options: [],
      tableData: []
    }
  },
  methods: {
    // 获取列表
    getRenderlist() {
      const param = {
        reportingOfficeId:
          this.formInline.officeName[this.formInline.officeName.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId,
        reportingYear: this.formInline.year || '',
        startTime: this.formInline?.startTime ? this.formInline?.startTime[0] : '',
        endTime: this.formInline?.startTime ? this.formInline?.startTime[1] : '',
      }
      service.getAllDeptYearReptinfo(param).then(res => {
        if (res && res.status === 200) {
          this.tableData = res.data.datas
        }
      })
    },
    getyeartree() {
      service.getyeartree().then(res => {
        this.options = res.data.datas
      })
    },
    search() {
      this.getRenderlist()
    },
    getTimes() {
      let myDate = new Date()
      this.formInline.year = myDate.getFullYear().toString() // 获取当前年
      let currQuarter = new Date().getMonth() + 1
    },
    // 导出
    exportlist() {
      const url =
        this.$URL.baseURL +
        '/api-precursor/pprodoper/deptYearReptExport'
      const params = {
        token: sessionStorage.getItem('usertoken'),
        reportingOfficeId: this.formInline.officeName,
        reportingYear: this.formInline.year,
        startTime: this.formInline?.startTime ? this.formInline?.startTime[0] : '',
        endTime: this.formInline?.startTime ? this.formInline?.startTime[1] : '',
      }
      exportToBlobXLSX(url, params, '生产经营统计报表.xlsx')
    }
  },
  mounted() {
    this.getRenderlist()
    this.getyeartree()
  },
  created() {
    this.getTimes()
    this.formInline.officeName =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
  }
}
</script>