<!--
 * @Author: your name
 * @Date: 2021-10-11 15:40:26
 * @LastEditTime: 2021-10-12 08:44:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \element-admin\src\views\government\batchreport\annualreport.vue
-->
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
      <!-- <el-input v-model=""></el-input> -->
      <el-form-item>
        <el-button type="primary" @click="search(formInline)">查询</el-button>
      </el-form-item>
    </el-form>
    <h2 style="margin:10px auto;text-align:center;widyh:100%">生产企业年度生产销售情况</h2>
    <el-descriptions class="margin-top" border v-if="yieldlist.shenChanMap">
      <el-descriptions-item>
        <template slot="label">企业数量（户）</template>
        {{yieldlist.shenChanMap.num || '0'}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">全部销售收入（万元）</template>
        {{yieldlist.shenChanMap['generalIncome'] || '0'}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">易制毒化学品销售收入（万元）</template>
        {{yieldlist.shenChanMap['chemicalIncome'] || '0'}}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions class="margin-top" border v-else>
      <el-descriptions-item>
        <template slot="label">企业数量（户）</template>
        0
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">全部销售收入（万元）</template>
        0
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">易制毒化学品销售收入（万元）</template>
        0
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="yieldlist.shenChanList" style="width: 100%;margin-top:20px">
      <el-table-column label="所属类别" prop="chemicalType" :formatter="typeFormat" align="center"></el-table-column>
      <el-table-column label="品种名称" prop="chemicalName" align="center"></el-table-column>
      <el-table-column label="产量（吨）" prop="purchaseVolume" align="center"></el-table-column>
      <el-table-column label="销售量（吨）" prop="sales" align="center"></el-table-column>
      <!-- <el-table-column label="自用量（吨）" prop="oneself" align="center"></el-table-column> -->
      <el-table-column label="库存量（吨）" prop="inventory" align="center"></el-table-column>
      <el-table-column label="销售流向及数量（吨）" align="center">
        <el-table-column prop="flowTypeCity" label="本市（地）" align="center"></el-table-column>
        <el-table-column prop="flowTypeProvice" label="本省（市）" align="center"></el-table-column>
        <el-table-column prop="flowTypeWaiProvice" label="外省（市）" align="center"></el-table-column>
        <el-table-column prop="flowTypeChuKou" label="出口" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <h2 style="margin:10px auto;text-align:center;widyh:100%">经营企业年度生产销售情况</h2>
    <el-descriptions class="margin-top" border v-if="managelist.jinYingMap">
      <el-descriptions-item>
        <template slot="label">企业数量（户）</template>
        {{managelist.jinYingMap['num'] || '0'}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">全部销售收入（万元）</template>
        {{managelist.jinYingMap['generalIncome'] || '0'}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">易制毒化学品销售收入（万元）</template>
        {{managelist.jinYingMap['chemicalIncome'] || '0'}}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions class="margin-top" border v-else>
      <el-descriptions-item>
        <template slot="label">企业数量（户）</template>
        0
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">全部销售收入（万元）</template>
        0
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">易制毒化学品销售收入（万元）</template>
        0
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="managelist.jinYingList" style="width: 100%;margin-top:20px">
      <el-table-column label="所属类别" prop="chemicalType" :formatter="typeFormat" align="center"></el-table-column>
      <el-table-column label="品种名称" prop="chemicalName" align="center"></el-table-column>
      <el-table-column label="产量（吨）" prop="purchaseVolume" align="center"></el-table-column>
      <el-table-column label="销售量（吨）" prop="sales" align="center"></el-table-column>
      <!-- <el-table-column label="自用量（吨）" prop="oneself" align="center"></el-table-column> -->
      <el-table-column label="库存量（吨）" prop="inventory" align="center"></el-table-column>
      <el-table-column label="销售流向及数量（吨）" align="center">
        <el-table-column prop="flowTypeCity" label="本市（地）" align="center"></el-table-column>
        <el-table-column prop="flowTypeProvice" label="本省（市）" align="center"></el-table-column>
        <el-table-column prop="flowTypeWaiProvice" label="外省（市）" align="center"></el-table-column>
        <el-table-column prop="flowTypeChuKou" label="出口" align="center"></el-table-column>
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
      yieldlist: {},
      managelist: {},
      formInline: {
        year: '',
        officeName: ''
      }
    }
  },
  methods: {
    getyeartree() {
      service.getyeartree().then(res => {
        this.options = res.data.datas
      })
    },
    // 年报汇总表
    getYearreportlist() {
      const param = {
        year: this.formInline.year,
        officeId:
          this.formInline.officeName[this.formInline.officeName.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      service.getYearreportlist(param).then(res => {
        if (res && res.status == 200) {
          this.yieldlist = res.data.datas.shenChan || ''
          this.managelist = res.data.datas.jinYing || ''
        }
      })
    },

    getCheckAreaReportCity() {
      const param = {
        year: this.formInline.year,
        officeId:
          this.formInline.officeName[this.formInline.officeName.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      service.getCheckAreaReportCity(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.datas || []
        }
      })
    },
    search() {
      this.getYearreportlist()
      // this.getCheckAreaReportCity()
    },
    getTimes() {
      let myDate = new Date()
      this.formInline.year = myDate.getFullYear().toString() // 获取当前年
      let currQuarter = new Date().getMonth() + 1
    },
    typeFormat(row) {
      switch (row.chemicalType) {
        case '1':
          return '第一类'
        case '2':
          return '第二类'
        case '3':
          return '第三类'
      }
    }
  },
  mounted() {
    this.formInline.officeName =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
    this.getTimes()
    this.getyeartree()
    // this.getCheckAreaReportCity()
    this.getYearreportlist()
  }
}
</script>
<style lang="scss" >
#annualCollect .is-bordered-label {
  background-color: #f5f7fa;
  .my-label {
    background-color: #f5f7fa;
    color: #909399;
  }
  .my-content {
    background-color: #f5f7fa;
    color: #909399;
  }
}
</style>