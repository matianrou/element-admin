<template>
  <div class="enteradd">
    <el-dialog
      :visible.sync="DialogTip"
      :close-on-click-modal="false"
      top="5%"
      width="50%"
      height="60%"
      @close="dialogfalse"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="生产购入情况表" v-if="ischeck" name="first">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="许可备案类型" align="center" prop="licenseChemicalTypeValue"></el-table-column>
            <el-table-column label="品种类型" align="center" prop="chemicalTypeValue"></el-table-column>
            <el-table-column label="品种名称" prop="chemicalName" align="center"></el-table-column>
            <el-table-column label="生产量(吨)" prop="purchaseVolume" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="销售情况表" name="second">
        <!-- <el-tab-pane label="销售情况表" name="second"> -->
          <el-table
            :data="pageTableData"
            id="tableData"
            style="width: 100%"
            :header-row-style="tableRowClassName"
          >
            <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.licenseChemicalTypeValue}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="chemicalTypeValue" label="品种类型" align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.chemicalTypeValue}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="chemicalName" label="品种名称" align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.chemicalName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="销售总量" align="center" width="100px">
              <template slot-scope="scope">
                <p>{{ scope.row.areaSales + '(吨)'}}</p>
              </template>
            </el-table-column>
            <el-table-column label="主要流向" align="center" width="300px">
              <template slot-scope="scope">
                <p
                  class="rowzidingyi"
                  v-for="(item,index) in scope.row.prodChemicalFlowList"
                  :key="index"
                >
                  <span>{{ item.countryName || ''}}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="chemicalName" label="销售量" align="center" width="100px">
              <template slot-scope="scope">
                <p
                  v-for="(item,index) in scope.row.prodChemicalFlowList"
                  :key="index"
                  class="rowzidingyi"
                >{{ item.areaSales + '(' + item.unit + ')'}}</p>
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script >
import service from '../../Authentication/api/service'
import Pagination from '../current/pagination' // 翻页
export default {
  props: {
    rowdata: '',
    year: '',
    ischeck: '',
    time:''
  },
  components: {
    Pagination
  },
  data() {
    return {
      pageTableData: [],
      tableData: [],
      query: {
        corpId: this.rowdata.corpId || '',
        year: this.year
      },
      DialogTip: true,
      activeName: 'first',
      limit: 2,
      page: 1,
      total: 0,
      ifType: JSON.parse(this.$store.state.getUserMsg).datas.type, //判断是企业用户还是政府用户，走不同的接口,0 为政府用户，1 是企业用户
      baseurl: '' //判断是企业用户还是政府用户，走不同的接口,0 为政府用户，1 是企业用户
    }
  },
  methods: {
    // render 事件
    tableRowClassName({ row, rowIndex }) {
      return 'background:#ccc;color:#555;height: 40px;'
    },
    dialogfalse() {
      this.$parent.checkyeardialog = false
    },
    renderonelist() {
      const param = {
        year: this.rowdata.reportingYear || this.rowdata.year,
        corpId: this.rowdata.corpId || this.rowdata.id
      }
      // 生产情况表
      service.getYearDeptShenChanInfo(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.datas
        }
      })
      // 销售流向表
      service.getYearDeptXiaoShaoInfo(param).then(res => {
        this.pageTableData = res.data.datas
      })
    },
    shengchanlist(){
      const param = {
        year: this.rowdata.reportingYear || this.rowdata.year,
        startTime:this.time[0],
        endTime:this.time[1],
        corpId: this.rowdata.corpId || this.rowdata.id
      }
      // 生产情况表
      service.newgetYearDeptShenChanInfo(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.datas
        }
      })
      // 销售流向表
      service.newgetYearDeptXiaoShaoInfo(param).then(res => {
        this.pageTableData = res.data.datas
      })
    }
  },
  created() {
    if(this.ischeck){
      this.activeName = 'first'; this.shengchanlist()
    }else {
      this.activeName = 'second'; this.renderonelist()
    }
    // 查询项目一 项目二数据
  }
}
</script>
<style lang="less" scoped>
.rowzidingyi {
  width: 100%;
  height: 70px !important;
  border-bottom: 1px solid #ebeef5;
  padding: 18px 0 0 0;
}
.xiaoshouliang {
  line-height: 90px;
}
h2 {
  margin-top: 10px;
}
.table-style {
  .el-table-column--selection.is-leaf .el-checkbox {
    display: none;
  }
}
.enteradd {
  .el-form-item {
    // margin-bottom: 5px;
  }
}
.pageTableData {
  width: 100%;
  // margin-top: 10px;
  .title {
    display: flex;
    span {
      display: inline-block;
      width: 100%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border: 1px solid #ebeef5;
      background: #fafafa;
    }
  }
  .dataname {
    border-right: 1px solid #ebeef5;
    height: 100%;
    width: 100%;
  }
  .contentbd {
    width: 100%;
    span {
      border-bottom: 1px solid #ebeef5;
    }
  }
  li {
    width: 100%;
    text-align: center;
    line-height: 40px;
    display: flex;
    border-bottom: 1px solid #ebeef5;
    align-items: center;
    div {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
      float: left;
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-right: 1px solid #ebeef5;
        border-top: none;
      }
    }
  }
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