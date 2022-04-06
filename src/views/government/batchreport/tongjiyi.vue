<template>
  <div class="contentContainer">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="统计年度">
        <div class="block">
          <el-date-picker
            v-model="formInline.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          ></el-date-picker>
        </div>
      </el-form-item>
      <!-- <el-form-item label="地区" prop="area">
        <el-select v-model="formInline.area" placeholder="全国">
          <el-option
            v-for="(item, index) in areaExportList"
            :key="index"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="地区" prop="areaId">
        <el-cascader
          v-model="formInline.area"
          :options="areaExportList"
          :key="caseKey"
          :props="{ value: 'id', checkStrictly: true  }"
          :show-all-levels="false"
          placeholder="请选择"
          ref="cascaderAddr"
        ></el-cascader>
      </el-form-item>
      <!-- <el-form-item label="组织机构" prop="officeName">
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
            ></el-cascader>
          </el-col>
        </el-row>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="search(formInline)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%;margin-top:20px">
      <el-table-column label="项目" prop="areaName" align="center"></el-table-column>
      <el-table-column label="企业销售收入" align="center">
        <el-table-column label="全部销售收入（万元）" align="center">
          <el-table-column label="生产" align="center" prop="scQbXiaoShou"></el-table-column>
          <el-table-column label="经营" align="center" prop="jyQbXiaoShou"></el-table-column>
        </el-table-column>
        <el-table-column label="易制毒销售收入（万元）" align="center">
          <el-table-column label="生产" align="center" prop="scyzd"></el-table-column>
          <el-table-column label="经营" align="center" prop="jyyzd"></el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import mixins from '@/utils/mixins'
import service from '../../Authentication/api/service'
export default {
  name: 'annualCollect',
  mixins: [mixins],
  data() {
    return {
      tableData: [],
      options: [],
      areaExportList: [],
      caseKey:1,
      formInline: {
        year: '',
        area: ''
      }
    }
  },
  watch:{
    areaExportList(){
      ++this.caseKey
    }
  },
  methods: {
    getyeartree() {
      service.getyeartree().then(res => {
        this.options = res.data.datas
      })
    },
    // 获取当前地区id
    getThisArea() {
      const param = {
        id: ''
      }
      service.getThisArea(param).then(res => {
        if (res && res.status == 200) {
          this.formInline.area = res.data.datas
          this.getCheckAreaReportCity()
          this.getArea(res.data.datas)
        }
      })
    },
    // 年报汇总表
    getCheckAreaReportCity() {
      const param = {
        year: this.formInline.year,
        areaId: this.formInline.area
      }
      service.getCheckAreaReportCity(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.datas || []
        }
      })
    },
    search() {
      this.getCheckAreaReportCity()
    },
    getTimes() {
      let myDate = new Date()
      this.formInline.year = myDate.getFullYear().toString() // 获取当前年
      let currQuarter = new Date().getMonth() + 1
    },
    getArea(areaid) {
      const param ={
        id:areaid
      }
      service.getArea(param).then(res => {
        if (res && res.status == 200) {
          this.areaExportList = res.data.datas
        }
      })
    }
  },
  mounted() {
    this.getThisArea()
    this.getTimes()
    // this.getyeartree()
  }
}
</script>