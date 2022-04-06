<template>
  <div class="contentContainer">
    <el-table v-loading="loading" :data="leaveList" @selection-change="handleSelectionChange">
      <el-table-column label="申请类型" align="center" prop="applyType">
        <template slot-scope="scope">
          <span
            style="color:blue;cursor:pointer"
            @click="auditInfoHandle(scope.row)"
          >{{typeFormat(scope.row,scope.row.applyType)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center">
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.substring(0, 19) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批机构" align="center" prop="officeName" />
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.state != 0">{{ stateFormat(scope.row) }}</div>
          <div v-else>{{ scope.row.taskName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="checkFlowNode(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="count"/>
    <el-dialog title="查看流程图" width="52%" :visible.sync="dialogImgVisible">
      <div style="background: #ffffff;height:600px;overflow:auto">
        <img :src="imgUrl" alt />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="modelVisible" title="进度查询" width="1680px" append-to-body>
      <div style="position:relative;height: 100%;">
        <iframe
          id="iframe"
          :src="modelerUrl"
          frameborder="0"
          width="100%"
          height="720px"
          scrolling="auto"
        ></iframe>
      </div>
    </el-dialog>
    <!-- 查看详细信息话框 -->
    <el-dialog :title="title" :visible.sync="open2" width="500px" append-to-body>
      <leaveHistoryForm :businessKey="businessKey" v-if="open2" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="open2 = !open2">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看当前流程节点 -->
    <el-dialog
      title="企业审批情况"
      :visible.sync="dialogshow"
      width="40%"
      height="80%"
      @close="closeRovalHandle"
      :close-on-click-modal="false"
    >
      <approval-node ref="appRoval" v-if="approvalNodedialog" :businessKey="businessKey" />
    </el-dialog>
    <Publicdialog v-if="Publicdialogdialog" :rowdata="rowdata" :isShow="isShow" />
  </div>
</template>

<script>
import {
  listLeave,
  getLeave,
  delLeave,
  addLeave,
  updateLeave,
  exportLeave
} from '@/api/workflow/leave'
// import {getUserProfile} from '@/api/system/user'
import ApprovalNode from '@/views/government/approval/approvalNode.vue'
import {
  getDefinitionsByInstanceId,
  getDefinitionsImgByInstanceId
} from '@/api/activiti/definition'
import service from '@/views/Authentication/api/service'
import { selectDictLabel } from '@/utils/index.js'
import leaveHistoryForm from './leaveHistoryForm'
import Publicdialog from '../../government/current/publicdialog.vue'
import Pagination from '../../government/current/pagination'
export default {
  name: 'Leave',
  components: { leaveHistoryForm, ApprovalNode, Publicdialog, Pagination},
  data() {
    return {
      dialogshow: false,
      approvalNodedialog:false,
      modelVisible: false,
      dialogImgVisible: false,
      Publicdialogdialog: false,
      isShow: 0,
      imgUrl: '',
      modelerUrl: '',
      userName: '',
      createName: '',
      businessKey: '',
      //用户信息
      user: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      count: 0,
      // 许可证表格数据
      leaveList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      open2: false,
      // 申请类型字典
      typeOptions: [],
      // 状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        type: null,
        title: null,
        reason: null,
        leaveStartTime: null,
        leaveEndTime: null,
        instanceId: null,
        state: null,
        createBy: null
      },
      // 表单参数
      form: {}
    }
  },
  watch: {
    Publicdialogdialog: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          // this.getSearchTabelList({ limit: this.limit, page: this.page })
        }
      }
    }
  },
  created() {
    this.getRenderlist(this.queryParams.page)
    service.getDictType({ type: 'activiti_apply_type' }).then(response => {
      this.typeOptions = response.data.datas
    })
    service.getDictType({ type: 'activiti_flow_type' }).then(response => {
      this.stateOptions = response.data.datas
    })
  },
  methods: {
    // 审批调用
    auditInfoHandle(row) {
      this.rowdata = row
      this.isShow = 1
      this.Publicdialogdialog = !this.Publicdialogdialog
    },
    /** 查询许可证列表 */
    getRenderlist(val) {
      this.queryParams.page = val || 1
      this.loading = true
      listLeave(this.queryParams).then(response => {
        this.leaveList = response.data.data
        this.count = response.data.count
        this.loading = false
      })
    },
    // 申请类型字典翻译
    typeFormat(row, column) {
      return selectDictLabel(this.typeOptions, row.applyType)
    },
    // 状态字典翻译
    stateFormat(row, column) {
      return selectDictLabel(this.stateOptions, row.state)
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        type: null,
        title: null,
        reason: null,
        leaveStartTime: null,
        leaveEndTime: null,
        instanceId: null,
        state: null,
        createBy: null,
        createTime: null,
        updateTime: null
      }
      // this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getRenderlist(this.queryParams.page)
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm('queryForm')
      this.reset()
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.createName = this.$store.getters.name
      if (this.$store.getters.name != 'admin') {
        this.reset()
        this.open = true
        this.title = '添加许可证'
      } else {
        this.$alert('管理员不能创建流程', '管理员不能创建流程', {
          confirmButtonText: '确定'
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      getLeave(row.id).then(response => {
        this.form = response.datas
        this.open = true
        this.title = '修改许可证'
      })
    },
    /** 审批详情 */
    historyFory(row) {
      this.businessKey = row.id
      this.open2 = true
      this.title = '审批详情'
    },
    /** 进度查看 */
    checkTheSchedule(row) {
      getDefinitionsImgByInstanceId({ instanceId: row.instanceId }).then(
        response => {
          const data = response.data.datas
          // this.url = '/bpmnjs/index.html?type=lookBpmn&deploymentFileUUID='+data.deploymentID+'&deploymentName='+ encodeURI(data.resourceName);
          this.imgUrl = 'data:image/svg+xml;base64,' + data
          // this.imgUrl = data;
          this.dialogImgVisible = true
        }
      )
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLeave(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getRenderlist(this.queryParams.page)
            })
          } else {
            addLeave(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getRenderlist(this.queryParams.page)
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除许可证编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delLeave(ids)
        })
        .then(() => {
          this.getRenderlist(this.queryParams.page)
          this.msgSuccess('删除成功')
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有许可证数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportLeave(queryParams)
        })
        .then(response => {
          this.download(response.msg)
        })
    },
    chooseMedicine() {
      this.form.title = this.createName + '的' + this.form.type + '申请'
    },
    /* 查看流程节点 */
    checkFlowNode(row) {
      this.businessKey = row.id
      this.dialogshow = true
      this.approvalNodedialog = true
    },
    closeRovalHandle() {
      this.dialogshow = false
      this.approvalNodedialog = false
      // this.businessKey = ''
    }
  }
}
</script>
