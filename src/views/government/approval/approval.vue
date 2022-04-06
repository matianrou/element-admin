<template>
  <div class="contentContainer">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="instanceName" label="企业名称" align="center"></el-table-column>
      <el-table-column prop="applyType" label="申请类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.applyType == 1 ">初次申请</span>
          <span v-if="scope.row.applyType == 2 ">变更申请</span>
          <span v-if="scope.row.applyType == 3 ">换证申请</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdDate" label="申请日期" align="center"></el-table-column>
      <el-table-column prop="name" label="当前审批节点" align="center">
        <template slot-scope="scope">
          <span
            @click="clickRovalHandle(scope.row)"
            style="color: blue; cursor: pointer"
          >{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="auditInfoHandle(scope.row)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      layout="total, prev, pager, next"
      @pagination="handleChangePage"
    />
    <el-dialog
      title="许可备案审批"
      :visible.sync="dialogshow"
      width="40%"
      height="80%"
      @close="closeRovalHandle"
      :close-on-click-modal="false"
    >
      <approval-node ref="appRoval" v-if="approvalNodedialog" :businessKey="businessKey" />
    </el-dialog>
    <Publicdialog v-if="Publicdialogdialog" :rowdata="rowdata" :isShow="isShow" :shenpi="true" />
  </div>
</template>
<script>
import service from '@/views/Authentication/api/service.js'
import Publicdialog from '../current/publicdialog.vue'
import ApprovalNode from './approvalNode'
import Pagination from '@/components/Pagination/index.vue'

export default {
  components: {
    ApprovalNode,
    Publicdialog,
    Pagination
  },
  data() {
    return {
      dialogshow: false,
      approvalNodedialog:false,
      Publicdialogdialog: false,
      ischeck: '0',
      tableData: [],
      applyTypeList: [],
      rowdata: '',
      businessKey: '', // 查询流程节点时参数条件
      isShow: 0, // 许可备案颁发审批时 需要传1，作显隐使用
      limit: 10,
      page: 1,
      total: 0
    }
  },
  created() {
    // 审批列表请求
    this.getSearchTabelList({ limit: this.limit, page: this.page })
    // 字典列表请求
    this.getDictType()
  },
  watch: {
    // Publicdialogdialog: {
    //   handler: function(newVal, oldVal) {
    //     if (newVal !== oldVal) {
    //       this.getSearchTabelList({ limit: this.limit, page: this.page })
    //     }
    //   }
    // }
  },
  methods: {
    getDictType() {
      service.getDictType({ type: 'activiti_apply_type' }).then(response => {
        if (response.data.resp_code === 0) {
          this.applyTypeList = response.data.datas
        }
      })
    },
    clickRovalHandle(row) {
      this.businessKey = row.businessKey
      this.dialogshow = true
      this.approvalNodedialog = true
    },
    closeRovalHandle() {
      this.dialogshow = false
      this.approvalNodedialog = false
      // this.businessKey = ''
    },
    handleChangePage(data) {
      this.limit = data.limit
      this.page = data.page
      this.getSearchTabelList({ limit: this.limit, page: this.page })
    },
    // 查询审批列表
    getSearchTabelList(params) {
      service.getGmLicenseRecordList(params).then(response => {
        if (response.status === 200) {
          this.total = response.data.count
          this.tableData = response.data.data
        }
      })
    },
    // 审批调用
    auditInfoHandle(row) {
      this.rowdata = row
      this.isShow = 1
      this.Publicdialogdialog = !this.Publicdialogdialog
    },
    // 字典翻译
    dicTranslate(list = [], type = '') {
      const item = list.find(item => item.value === type)
      if (!item) {
        return '--'
      } else {
        return item.label
      }
    }
  }
}
</script>
