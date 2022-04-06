<template>
  <el-dialog
    :title="title"
    :visible.sync="reportdialog"
    width="50%"
    :append-to-body="false"
    @close="dialogfalse"
    :close-on-click-modal="false"
  >
    <div v-if="isShow">
      <el-table :data="tableData" border style="width: 100%;height:400px;overflow:auto">
        <el-table-column prop="reptUserName" label="上报人" align="center"></el-table-column>
        <el-table-column prop="reptUserMobile" label="上报人手机号" align="center"></el-table-column>
        <el-table-column prop="createTime" label="上报时间" align="center"></el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-table
        :data="tableDataTwo"
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
        <el-table-column prop="chemicalName" label="销售量" align="center">
          <template slot-scope="scope">
            <p
              v-for="(item,index) in scope.row.prodChemicalFlowList"
              :key="index"
              class="rowzidingyi"
            >{{ item.areaSales + '(' + item.unit + ')'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">
            <p
              class="rowzidingyi"
              v-for="(item,index) in scope.row.prodChemicalFlowList"
              :key="index"
            >
              <span>{{ item.provinceValue }}{{ item.cityValue }}{{ item.countryName }}</span>
              <!-- <span>{{ item.provinceValue || ''}}</span> -->
              <!-- <span>{{ item.cityValue || '' }}</span> -->
              <!-- <span>{{ item.countryName || ''}}</span> -->
            </p>
          </template>
        </el-table-column>
        <el-table-column label="销售金额(万元)" align="center">
          <template slot-scope="scope">
            <p
              class="rowzidingyi"
              v-for="(item,index) in scope.row.prodChemicalFlowList"
              :key="index"
            >{{ item.areaSalesMoney || ''}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="销售时间" align="center"></el-table-column>
        <el-table-column prop="reportingTime" label="上报时间" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.reportingTime || '----'}}</p>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="fotter" align="center" style="margin-top:10px">
        <el-button type="primary" @click="reportlist">上报</el-button>
      </div>
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
  </el-dialog>
</template>
<script>
import service from '../Authentication/api/service'

export default {
  props: {
    title: '',
    year: '',
    isShow: ''
  },
  data() {
    return {
      reportdialog: true,
      page: 1,
      limit: 10,
      tableData: [],
      tableDataTwo: [],
      dialogFormVisible: false,
      form: {
        reptUserName: '',
        reptUserMobile: ''
      },
      rules: {
        reptUserName: [
          { required: true, message: '请您输入上报人姓名', trigger: 'change' }
        ],
        reptUserMobile: [
          {
            required: true,
            message: '请您输入上报人手机号',
            trigger: 'change'
          },
          {
            pattern: /^((13\d)|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[0,1,3,5,7,8])|(18[0-9])|(19[8,9]))\d{8}/,
            message: '请输入正确的手机号',
            trigger: ['blur']
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 销售流向上报之前的表单功能接口
    reportContent(data) {
      this.$refs.form.validate(valid => {
        if (valid)
          service.getReportdata(this.form).then(res => {
            if (res.data.resp_code == 200) {
              // this.reportcallback()
              this.$message.success('上报成功')
              this.dialogFormVisible = false
              this.$parent.reportdialog = false
            } else {
              this.$message.error('上报失败')
              this.dialogFormVisible = false
              this.$parent.reportdialog = false
            }
          })
      })
    },
    reportlist() {
      this.dialogFormVisible = true
      this.$refs.form.resetFields()
    },
    // render 事件
    tableRowClassName({ row, rowIndex }) {
      return 'background:#ccc;color:#555;height: 40px;'
    },
    // 弹框关闭事件
    dialogfalse() {
      this.$parent.reportdialog = false
    },
    // 年度上报
    getRenderlistOne() {
      const param = {
        year: this.year,
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId
      }
      service.getRenderlistOne(param).then(res => {
        if (res && res.status == 200) {
          this.tableDataTwo = res.data.datas
        }
      })
    },
    getRenderlistTwo() {
      let _this = this
      const param = {
        page: this.page,
        limit: this.limit
      }
      service.getRenderlistTwo(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.data
        }
      })
    }
  },
  mounted() {},
  created() {}
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