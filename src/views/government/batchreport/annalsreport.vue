<template>
  <div class="contentContainer">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <!-- <el-form-item label="统计年度">
        <div class="block">
          <el-date-picker
            v-model="form.reportingYear"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRenderlistOne()">查询</el-button>
      </el-form-item>-->
    </el-form>
    <el-table :data="tableDataTwo" id="tableData" style="width: 100%">
      <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center">
        <template slot-scope="scope">
          <p class>{{ scope.row.licenseChemicalTypeValue }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="chemicalTypeValue" label="品种类型" align="center">
        <template slot-scope="scope">
          <p class>{{ scope.row.chemicalTypeValue }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="chemicalTypeValue" label="品种名称" align="center">
        <template slot-scope="scope">
          <p class>{{ scope.row.chemicalName }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="chemicalName" label="销售量" align="center">
        <template slot-scope="scope">
          <p
            v-for="(item, index) in scope.row.prodChemicalFlowList"
            :key="index"
            class="rowzidingyi"
          >{{ item.areaSales + '(' + item.unit + ')' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <p
            class="rowzidingyi"
            v-for="(item, index) in scope.row.prodChemicalFlowList"
            :key="index"
          >
            <span>{{ item.provinceValue ? item.provinceValue + '/' : '' }}{{ item.cityValue ? item.cityValue + '/' : '' }}{{ item.countryName ? item.countryName : '' }}</span>
            <!-- <span>{{ item.cityValue }}</span> -->
            <!-- <span>{{ item.countryName }}</span> -->
          </p>
        </template>
      </el-table-column>
      <el-table-column label="销售金额(万元)" align="center">
        <template slot-scope="scope">
          <p
            class="rowzidingyi"
            v-for="(item, index) in scope.row.prodChemicalFlowList"
            :key="index"
          >{{ item.areaSalesMoney || '' }}</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="fotter" align="center" style="margin-top:10px">
      <el-button type="primary" @click="reportlist" v-if="reportastrict">上报</el-button>
    </div>
    <el-dialog
      width="25%"
      height="100%"
      title="上报内容填写"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="115px">
        <el-form-item label="上报人姓名" prop="reptUserName">
          <el-input v-model.trim="form.reptUserName"></el-input>
        </el-form-item>
        <el-form-item label="上报人手机号" prop="reptUserMobile">
          <el-input v-model.trim="form.reptUserMobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogfalse()">取 消</el-button>
        <el-button type="primary" @click="reportContent('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
import CheckyearReport from './checkyearreport.vue' // 查看页面
import Publicdialog from '../current/publicdialog.vue' // 点击企业名称 查看公共组件
import Pagination from '../current/pagination' // 翻页
export default {
  props: {},
  components: {
    Publicdialog,
    Pagination,
    CheckyearReport
  },
  data() {
    return {
      reportastrict: true,
      tableDataTwo: [],
      dialogFormVisible: false,
      form: {
        reportingYear: ''
      },
      rules: {
        reptUserName: [
          { required: true, message: '请您输入上报人姓名', trigger: 'change' }
        ],
        reptUserMobile: [
          {
            required: true,
            message: '请您输入上报人手机号',
            trigger: 'blur'
          },
          {
            pattern: /^((13\d)|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[0,1,3,5,7,8])|(18[0-9])|(19[8,9]))\d{8}/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 年度上报
    getRenderlistOne() {
      const param = {
        reportingYear: '',
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId || ''
      }
      service.yeartopreport(param).then(res => {
        if (res && res.status == 200) {
          this.tableDataTwo = res.data.datas
        }
      })
    },
    // 销售流向上报之前的表单功能接口
    reportContent(data) {
      this.$refs.form.validate(valid => {
        if (valid)
          service.getReportdata(this.form).then(res => {
            if (res.data.resp_code == 200) {
              this.$message.success(res.data.resp_msg)
            } else {
              this.$message.error(res.data.resp_msg)
            }
            this.dialogFormVisible = false
            this.$parent.reportdialog = false
          })
      })
    },
    reportlist() {
      if (this.tableDataTwo.length) {
        this.dialogFormVisible = true
      } else {
        this.$message.error('当前暂无可上报数据')
      }

      // this.$refs.form.resetFields()
    },
    getTimes() {
      let myDate = new Date()
      this.form.reportingYear = myDate.getFullYear().toString() // 获取当前年
      let currQuarter = new Date().getMonth() + 1
      if (currQuarter > 3) {
        this.reportastrict = false
      }
    },
    // 关闭弹框
    dialogfalse() {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
    }
  },
  mounted() {
    this.getTimes()
    this.getRenderlistOne()
  }
}
</script>
<style>
#tableData .cell {
  /* height: 41px; */
  line-height: 40px;
  padding: 0 !important;
}
.rowzidingyi {
  width: 100%;
  height: 70px !important;
  border-bottom: 1px solid #ebeef5;
  padding: 18px 0 0 0;
}
</style>