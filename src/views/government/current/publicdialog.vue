<template>
  <el-dialog
    title
    :close-on-click-modal="false"
    :visible.sync="dialogshow"
    width="80%"
    height="100%"
    @close="dialogfalse"
  >
    <h2 v-show="entershow !== 0" class="firm_title">许可备案类型 {{ titleValue }}</h2>
    <div v-loading="loading">
      <!-- is-before-change 1变更前，0变更后 -->
      <!-- has-changed 是否存在变更 -->
      <template>
        <!-- 企业信息 -->
        <FirmInfo
          v-if="form.originCorpName || form.originLegalPerson"
          :firm-info="form"
          :is-before-change="1"
          :has-changed="!!(form.originCorpName || form.originLegalPerson)"
        />
        <FirmInfo
          :firm-info="form"
          :is-before-change="0"
          :has-changed="!!(form.originCorpName || form.originLegalPerson)"
        />
      </template>
      <template>
        <!-- 流向信息 -->
        <FlowInfo
          v-if="form.oldCorpProdOperList && entershow != 0"
          :is-show="isShow"
          :is-before-change="1"
          :has-changed="!!(form.oldCorpProdOperList && form.oldCorpProdOperList.length)"
          :table-data="form.oldCorpProdOperList"
        />
        <FlowInfo
          v-if="pageTableData.length && entershow != 0"
          :is-show="isShow"
          :is-before-change="0"
          :has-changed="!!(form.oldCorpProdOperList && form.oldCorpProdOperList.length)"
          :table-data="pageTableData"
        />
      </template>
      <template>
        <!-- 备案材料 -->
        <FirmRecord
          v-if="form.oldMaterialList && isShow == 1"
          :is-before-change="1"
          :has-changed="!!(form.oldCorpProdOperList && form.oldCorpProdOperList.length)"
          :table-data="form.oldMaterialList"
          @change-record="changeRecord"
        />
        <FirmRecord
          v-if="tableData.length && isShow == 1"
          :is-before-change="0"
          :has-changed="!!(form.oldCorpProdOperList && form.oldCorpProdOperList.length)"
          :table-data="tableData"
          @change-record="changeRecord"
        />
      </template>
      <!-- 审批信息 -->
      <el-card v-if="isShow == 1 && shenpi">
        <h2>许可备案审批信息</h2>
        <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="100px">
          <el-form-item label="审查决定:" prop="controlValue">
            <el-radio-group v-model="auditForm.controlValue">
              <el-radio label="0">同意</el-radio>
              <el-radio label="1">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审查意见:">
            <el-input v-model="auditForm.controlLable" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(auditForm)">提交</el-button>
            <el-button @click="dialogfalse">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-dialog>
</template>
<script>
import service from '../../Authentication/api/service'
import FirmInfo from './components/firm-info.vue'
import FlowInfo from './components/flow-info.vue'
import FirmRecord from './components/firm-record.vue'

export default {
  components: {
    FirmInfo,
    FlowInfo,
    FirmRecord
  },
  props: {
    rowdata: '',
    isShow: '',
    shenpi: '',
    entershow: '' // 企业审核管理时 生产流向信息隐藏
  },
  data() {
    return {
      loading: false,
      dialogshow: true,
      titleValue: '',
      corpType: '',
      auditForm: {
        controlValue: '',
        controlLable: ''
      },
      auditRules: {
        controlValue: [
          { required: true, message: '请选择审核意见', trigger: 'blur' }
        ]
      },
      form: {
        establishTime: '', // 成立时间
        address: '', // 地址
        workerNum: '', // 从业人数
        corpName: '', // 企业名称
        management: '', // 技术、销售管理人员人数
        creditCode: '', // 社会统一信用代码
        legalPerson: '', // 主要负责人
        mobile: '', // 电话
        officeId: '',
        officeName: '', // 监管机构
        economicType: '', // 经济类型
        corpType: '' // 生产/经营类型
      },
      pageTableData: [], // 企业生产销售
      tableData: [], // 备案材料
      economicTypeList: [],
      corpTypeList: [],
      year: ''
    }
  },
  methods: {
    dialogfalse() {
      this.$parent.Publicdialogdialog = false
      // console.log(this.$parent,'打印父子组件')
      this.$parent.showEpInfoModal = false
    },
    dicTranslate(list = [], type = '', flag) {
      let item
      if (flag === 1) {
        item = list.find(item => item.value === type)
      } else {
        item = list.find(item => item.id.toString() === type)
      }
      if (!item) {
        return ''
      } else {
        return item.label
      }
    },
    getEnterMsg() {
      const param = {
        id: this.rowdata.corpId || this.rowdata.id,
        licenseId: this.rowdata.licenseId || this.rowdata.id
      }
      this.loading = true
      return service.getEnterMsg(param).then(res => {
        if (res && res.status == 200) {
          this.loading = false
          const data = res.data.datas
          this.form = data
          this.titleValue =data?.corpLicenseInfo?.licenseChemicalTypeValue || ''
          for (let k of data.corpFilingMaterialsList) {
            k.checkStatus = true
          }
          // 备案材料列表
          this.tableData = data.corpFilingMaterialsList || []
        }
      })
    },
    // 备案材料变更后需要用户查看后进行审核
    changeRecord(index) {
      this.$nextTick(() => {
        this.$set(this.tableData[index])
      })
    },
    // 查生产情况列表
    getPageTabelData() {
      const param = {
        corpId: this.rowdata.corpId || this.rowdata.id,
        year: this.rowdata.year,
        licenseId: this.rowdata.licenseId || this.rowdata.id
      }
      service.getfindPrdOperInfo(param).then(res => {
        if (res && res.status == 200) {
          this.pageTableData = res.data.datas
        }
      })
    },
    getType() {
      service.getEconomic_type().then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.economicTypeList = data
        }
      })
      service.getcorp_type('corp_type').then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.corpTypeList = data
        }
      })
    },
    onSubmit(data) {
      const pass = this.tableData.some(item => item.checkStatus)
      if (!pass) {
        this.$refs['auditForm'].validate(valid => {
          if (valid) {
            const taskId = this.rowdata.id
            data['controlId'] = 'FormProperty_3qipis2'
            data['controlIsParam'] = 'i'
            service.auditGmLicenseRecordInfo({ id: taskId, list: [{ ...data }] })
              .then(response => {
                if (response.status === 200) {
                  this.$message.success('审核成功!')
                  this.dialogfalse()
                  this.$parent.getSearchTabelList({ limit: 10, page: 1 })
                } else {
                  this.$message.error('审核失败')
                }
              })
          }
        })
      } else {
        this.$message({
          message: '您当前还有未查看的备案材料，请先查看且确认完后在进行审批',
          type: 'error'
        })
      }
    },
    // 获取当前季度
    getTimes() {
      let myDate = new Date()
      this.year = myDate.getFullYear().toString() // 获取当前年
    }
  },
  mounted() {
    this.getType()
    // 生产情况列表
    this.getPageTabelData()
  },
  async created() {
    this.getTimes()
    await this.getEnterMsg()
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  margin-bottom: 15px;
}
.firm_title {
  font-size: 22px;
  text-indent: 20px;
  background: #203f708c;
  height: 35px;
  line-height: 35px;
  color: #301f1f;
}
h2 {
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}
</style>
