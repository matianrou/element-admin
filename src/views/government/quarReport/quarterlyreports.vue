<template>
  <div class="contentContainer">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="统计年度" v-show="false">
        <div class="block">
          <el-date-picker
            v-model="formInline.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="统计季度">
        <el-select v-model="formInline.quarter" @change="quarterchange" placeholder="请选择季度">
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
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="颁证情况" prop="name" align="center" width="150"></el-table-column>
      <el-table-column label="生产" align="center">
        <el-table-column label="本季度">
          <template slot-scope="scope">
            <span>{{ scope.row.nowdata }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上季度颁证数（份）">
          <template slot-scope="scope">
            <span>{{ scope.row.prevdata }}</span>
          </template>
        </el-table-column>
        <el-table-column label="颁证企业名单网上公布数（户）">
          <template slot-scope="scope">
            <span>{{ scope.row.showdata }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="经营" align="center">
        <el-table-column label="现有颁证数（份）">
          <template slot-scope="scope">
            <span>{{ scope.row.jingdata }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上季度颁证数（份）">
          <template slot-scope="scope">
            <span>{{ scope.row.jingprev }}</span>
          </template>
        </el-table-column>
        <el-table-column label="颁证企业名单网上公布数（户）">
          <template slot-scope="scope">
            <span>{{ scope.row.jingshow }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="newtableData" style="width: 100%;margin-top:10px">
      <el-table-column prop="name" label="持证情况" align="center"></el-table-column>
      <el-table-column label="生产" align="center">
        <el-table-column label="同时具有第二类、第三类生产备案企业数量">
          <template slot-scope="scope">
            <span>{{ scope.row.SConethree }}</span>
          </template>
        </el-table-column>
        <el-table-column label="同时具有生产许可、生产备案的企业数量">
          <template slot-scope="scope">
            <span>{{ scope.row.SCxs }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="经营" align="center">
        <el-table-column label="同时具有第二类、第三类经营备案企业数量">
          <template slot-scope="scope">
            <span>{{ scope.row.JYonethree }}</span>
          </template>
        </el-table-column>
        <el-table-column label="同时具有经营许可、经营备案的企业数量">
          <template slot-scope="scope">
            <span>{{ scope.row.JYxj }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
export default {
  name: 'quarterlyReport',
  data() {
    return {
      tableData: [
        {
          name: '许可证',
          nowdata: '',
          prevdata: '',
          showdata: '',
          jingdata: '',
          jingprev: '',
          jingshow: ''
        },
        {
          name: '第二类备案证明',
          nowdata: '',
          prevdata: '',
          showdata: '',
          jingdata: '',
          jingprev: '',
          jingshow: ''
        },
        {
          name: '第三类备案证明',
          nowdata: '',
          prevdata: '',
          showdata: '',
          jingdata: '',
          jingprev: '',
          jingshow: ''
        }
      ],
      newtableData: [
        {
          name: '企业数量（户）',
          SConethree: '',
          SCxs: '',
          JYonethree: '',
          JYxj: '',
          JYshow: ''
        }
      ],
      options: [],
      formInline: {
        officeName: ''
      }
    }
  },
  methods: {
    search() {
      this.getRenderlist()
    },
    getyeartree() {
      service.getyeartree().then(res => {
        this.options = res.data.datas
      })
    },
    // 季报汇总查询
    async getRenderlist() {
      const param = {
        officeId:
          this.formInline.officeName[this.formInline.officeName.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId,
        quarter: this.formInline.quarter || '',
        year: this.formInline.year || ''
      }
      service.getnewfindLicensingOne(param).then(res => {
        if (res && res.status == 200) {
          this.newtableData[0].SConethree =
            res.data.datas.prodSecondThirdRecord || 0
          this.newtableData[0].SCxs = res.data.datas.prodLicenseRecord || 0
          this.newtableData[0].JYonethree =
            res.data.datas.manageSecondThirdRecord || 0
          this.newtableData[0].JYxj = res.data.datas.manageLicenseRecord || 0
        }
      })
      Promise.all([
        this.getLicsList(0, param),
        this.getLicsList(1, param),
      ]).then((datas) => {
        datas[0].forEach((item, index) => {
          this.tableData[index].nowdata = item.prodLicenseNow || 0
          this.tableData[index].prevdata = item.prodLicenseLastQuarter || 0
          this.tableData[index].showdata = item.prodLicensePublishedOnline || 0
        })
        datas[1].forEach((item, index) => {
          this.tableData[index].jingdata = item.prodLicenseNow || 0
          this.tableData[index].jingprev = item.prodLicenseLastQuarter || 0
          this.tableData[index].jingshow = item.prodLicensePublishedOnline || 0
        })
      })
    },
    // 获取生产情况列表
    getLicsList(type, params) {
      return new Promise((resolve, reject) => {
        service.getfindLicensingOne({ licenseType: type, ...params })
          .then(({ status, data }) => {
            if (status == 200) resolve(data.datas);
          })
      })
    },
    getTimes() {
      let myDate = new Date()
      this.formInline.year = myDate.getFullYear().toString() // 获取当前年
      let currQuarter = new Date().getMonth() + 1
      this.formInline.quarter = JSON.stringify(
        (currQuarter = Math.floor(
          currQuarter % 3 == 0 ? currQuarter / 3 : currQuarter / 3 + 1
        ))
      ) // 获取当前季度
    },
    quarterchange(val) {
      this.formInline.quarter = val
      this.$forceUpdate()
    }
  },
  mounted() {
    this.getTimes()
    this.getyeartree()
    this.getRenderlist()
  },
  created() {
    this.formInline.officeName =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
  }
}
</script>
<style lang="scss" >
#quarterlyReport .is-bordered-label {
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