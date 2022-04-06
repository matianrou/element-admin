<template>
  <div class="contentContainer">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="corpName" label="单位名称" align="center">
        <template slot-scope="scope">
          <span
            @click="chechdetails(scope.row)"
            style="color: blue; cursor: pointer"
          >{{ scope.row.corpName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center"></el-table-column>
      <el-table-column prop="corpAddress" label="地址" align="center"></el-table-column>
      <el-table-column prop="operateCompleteTime" label="审批完成日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateCompleteTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="acceptdata(scope.row)">颁发</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddAcceptance :rowdata="rowdata" v-if="addputdialog" />
    <ApprovalNode v-if="ApprovalNodedialog" />
    <Publicdialog :rowdata="rowdata" :isShow="1" v-if="Publicdialogdialog" />
    <Pagination :total="total" />
  </div>
</template>
<script>
import AddAcceptance from './addAcceptance.vue'
import ApprovalNode from '../approval/approvalNode'
import Publicdialog from '../current/publicdialog.vue'
import Pagination from '../current/pagination'
import service from '../../Authentication/api/service'
export default {
  components: {
    ApprovalNode,
    Publicdialog,
    Pagination,
    AddAcceptance
  },
  data() {
    return {
      dialog: false,
      ApprovalNodedialog: false,
      Publicdialogdialog: false,
      addputdialog: false,
      isShow: 0,
      limit: 10,
      page: 1,
      total: 0,
      tableData: [],
      rowdata: ''
    }
  },
  methods: {
    // 查看当前企业提交信息
    chechdetails(row) {
      this.rowdata = row
      this.Publicdialogdialog = !this.Publicdialogdialog
    },
    // 获取列表
    getRenderlist(val) {
      const param = {
        limit: this.limit,
        page: val || this.page,
        licenseStatus: '1',
        reqType: '1'
      }
      service.getAnnualreportone(param).then(res => {
        if (res && res.status === 200) {
          const data = res.data
          this.total = data.count
          this.tableData = data.data
        }
      })
    },
    // 备案添加
    acceptdata(row) {
      this.rowdata = row
      this.addputdialog = !this.addputdialog
    },
    // 查看节点
    checkNode(row) {
      this.rowdata = row
      this.ApprovalNodedialog = !this.ApprovalNodedialog
    }
  },
  mounted() {
    this.getRenderlist()
  }
}
</script>