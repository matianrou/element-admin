<template>
  <div class="contentContainer">
    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="企业名称">
        <el-input v-model="form.corpName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm(form)">查询</el-button>
        <el-button type="primary" @click="printCheckInfo">打印</el-button>
        <!-- <el-button>设置打印格式</el-button> -->
        <el-button @click="complatePrintHandle">打印完毕</el-button>
      </el-form-item>
    </el-form>
    <el-table border highlight-current-row :data="tableData" style="width: 100%">
      <el-table-column label="#" width="55" center>
        <template slot-scope="scope">
          <el-radio
            v-model="rowIndex"
            class="radio"
            :label="scope.$index"
            @change.native="getCurrentRow(scope.$index)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="corpName" label="企业名称" align="center">
        <template slot-scope="scope">
          <span
            style="color: blue; cursor: pointer"
            @click="chechdetails(scope.row)"
          >{{ scope.row.corpName || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请日期" align="center"></el-table-column>
      <el-table-column prop="issueTime" label="发证日期" align="center">
        <template v-slot:default="{ row }">{{ row.issueTime || '--' }}</template>
      </el-table-column>
      <el-table-column prop="licenseExpireEnd" label="许可证有效截止日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.licenseExpireEnd || '--' }}</span>
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
    <Publicdialog :rowdata="rowdata" :isShow="1" v-if="showEpInfoModal" />
    <el-dialog
      title="打印预览"
      width="70%"
      height="100%"
      :close-on-click-modal="false"
      :visible.sync="printShowModal"
      fullscreen
    >
      <div style="text-align:center;">
        <div class="sizeposition">
          <span>
            经营品种、销售量字体大小调整：
            <b class="sizebtn" @click="FontAize.size++">+</b>
            <b class="sizebtn" @click="FontAize.size--">-</b>
          </span>
          <span>
            主要流向字体大小调整：
            <b class="sizebtn" @click="FontAize.flowsize++">+</b>
            <b class="sizebtn" @click="FontAize.flowsize--">-</b>
          </span>
          <span>
            单位地址字体大小调整：
            <b class="sizebtn" @click="FontAize.dansize++">+</b>
            <b class="sizebtn" @click="FontAize.dansize--">-</b>
          </span>
        </div>
      </div>
      <div ref="printEl">
        <!-- 备案证明 正本 -->
        <printe-original-record
          :FontAize="FontAize"
          v-if="!printLicenseType && cutPrinted"
          :printInfo="printInfo"
        />
        <!-- 许可证 正本 -->
        <printe-original-permit
          :FontAize="FontAize"
          v-if="printLicenseType && cutPrinted"
          :printInfo="printInfo"
        />
        <!-- 备案证明 副本 -->
        <printe-ectypal-record
          :FontAize="FontAize"
          v-if="!printLicenseType && !cutPrinted"
          :printInfo="printInfo"
        />
        <!-- 许可证 副本 -->
        <printe-ectypal-permit
          :FontAize="FontAize"
          v-if="printLicenseType && !cutPrinted"
          :printInfo="printInfo"
          :disabledDrag="disabledDrag"
        />
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" @click="printHandle">确定打印</el-button>
      </div>
    </el-dialog>
    <el-dialog title="打印选择" :close-on-click-modal="false" :visible.sync="selectPrintModal">
      <div>
        <el-form label-width="110px">
          <el-form-item label="证件类型：">
            <el-radio-group v-model="printLicenseType" :disabled="true">
            <!-- <el-radio-group v-model="printLicenseType" > -->
              <el-radio :label="true">许可证</el-radio>
              <el-radio :label="false">备案证明</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请选择：">
            <el-radio-group v-model="cutPrinted">
              <el-radio :label="true">正本</el-radio>
              <el-radio :label="false">副本</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" @click="selectPrintHandle(cutPrinted)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Publicdialog from '../current/publicdialog.vue'
import Pagination from '@/components/Pagination/index.vue'
import printeOriginalRecord from '@/views/printed/printeOriginalRecord.vue'
import printeOriginalPermit from '@/views/printed/printeOriginalPermit.vue'
import printeEctypalRecord from '@/views/printed/printeEctypalRecord.vue'
import printeEctypalPermit from '@/views/printed/printeEctypalPermit.vue'
import service from '@/views/Authentication/api/service.js'
import mixins from '@/utils/mixins'
import { dateTransformType } from '@/utils/index'
export default {
  mixins: [mixins],
  components: {
    printeOriginalRecord, // 正本备案证
    printeOriginalPermit, // 正本许可证
    printeEctypalRecord, // 副本备案证
    printeEctypalPermit, // 副本许可证
    Publicdialog,
    Pagination
  },
  data() {
    return {
      disabledDrag: false,
      showEpInfoModal: false,
      printShowModal: false,
      selectPrintModal: false, // 选择打印许可证或备案证明
      printLicenseType: true, // 备案或许可标记，true为许可，false为备案
      cutPrinted: true, // 正副本打印标记，true为正本，false为副本
      tableData: [],
      rowdata: {},
      rowIndex: '',
      form: { corpName: '' },
      printInfo: {},
      limit: 10,
      page: 1,
      total: 0,
      sizeShow: true,
      FontAize: {
        size: 22,
        flowsize: 22,
        dansize: 22
      },//此处修改无效。 详情方法selectPrintHandle()
      size: 22,
      flowsize: 22,
      dansize: 22
    }
  },
  created() {
    this.searchForm(this.form)
  },
  methods: {
    // 查看当前企业提交信息
    chechdetails(row) {
      this.rowdata = row
      this.showEpInfoModal = !this.showEpInfoModal
    },
    // 获取当前单选元素
    getCurrentRow(index) {
      this.rowdata = this.tableData[index]
    },
    handleChangePage(data) {
      this.rowdata = {}
      this.rowIndex = ''
      this.limit = data.limit
      this.page = data.page
      this.searchForm(this.form)
    },
    // 打印列表查询接口
    searchForm(data) {
      data['officeId'] = JSON.parse(this.$store.state.getUserMsg).datas.officeId
      // data['officeId'] = 1100000000
      data['limit'] = this.limit
      data['page'] = this.page
      // data['corpName'] = this.form.corpName
      data['licenseStatus'] = 1 // 默认查已审批生效的数据
      data['reqType'] = 2 // 默认查已审批生效的数据
      service.getGmLicensPrintList(data).then(response => {
        if (response.status === 200) {
          this.total = response.data.count
          this.tableData = response.data.data
        }
      })
    },
    // 打印查看
    printCheckInfo() {
      const { id } = this.rowdata
      // 判断是否已选择需要打印的项目，如果已经选择则
      if (!id) {
        return this.$message.error('请选择要打印的条目!')
      } else {
        this.selectPrintModal = true
        // 新增逻辑：按licenseChemicalType类型判断打印许可证或者备案证明，如果为1（第一类）则为许可证，如果为2（第二类）或3（第三类）时则为备案证明
        this.printLicenseType = this.rowdata.licenseChemicalType === '1'
      }
    },
    selectPrintHandle(cutPrinted) {
      if(cutPrinted){
         this.FontAize = {
        size: 24,
        flowsize: 24,
        dansize: 24
      }
      }else{
         this.FontAize = {
        size: 20,
        flowsize: 20,
        dansize: 20
      }
      }
     
      this.sizeShow = true
      // 选择打印许可证或备案证明后调取数据
      let id = this.rowdata.id
      service
        .getGmLicensPrintInfo({ id })
        .then(response => {
          // 处理有效期及发证日期为XXXX年XX月XX日格式
          response.data.datas.licenseExpireBegin = dateTransformType(
            response.data.datas.licenseExpireBegin
          )
          response.data.datas.licenseExpireEnd = dateTransformType(
            response.data.datas.licenseExpireEnd
          )
          response.data.datas.issueTime = dateTransformType(
            response.data.datas.issueTime
          )
          this.printInfo = response.data.datas
          this.printShowModal = true
        })
        .catch(err => {
          console.log('获取打印数据失败：', err)
          this.$message.error('获取打印数据失败，请重新选择打印！')
        })
    },
    // 打印
    printHandle() {
      this.$nextTick(() => {
        this.sizeShow = false
      })
      this.$print(this.$refs['printEl'])
      this.selectPrintModal = false
      this.printShowModal = false
    },
    // 完成打印
    complatePrintHandle() {
      if (this.rowdata && this.rowdata.id) {
        this.$confirm(
          `是否确定已完成 ${this.rowdata.corpName} 的许可备案打印？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            service
              .completeGmLicensPrint({ id: this.rowdata.id })
              .then(response => {
                if (response.status === 200) {
                  this.$message.success('操作成功!')
                  this.searchForm(this.form)
                }
              })
          })
          .catch(() => {})
      } else {
        this.$message.warning('请选择要完成打印的条目!')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* /deep/ .el-dialog__body {
  padding: 0px;
} */
@page {
  size: landscape;
  page-break-after: avoid; // 避免前后页面打印空白
  page-break-before: avoid; // 避免前后页面打印空白
  margin: 0; // 去掉边距
}
</style>
