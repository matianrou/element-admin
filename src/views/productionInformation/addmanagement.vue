<template>
  <el-dialog
    :title="isShow==1?'购入管理情况':'生产管理情况'"
    :visible.sync="dialogshow"
    width="40%"
    height="100%"
    @close="dialogfalse"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      :rules="rules"
      :inline="true"
      ref="form"
      label-width="120px"
      class="demo-form"
    >
      <el-form-item label="许可备案类型" prop="licenseType">
        <el-select
          v-model="form.licenseType"
          value-key="id"
          @change="changeEntertype"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in entertype"
            :key="index"
            :label="item.licenseTypeValue"
            :value="item.licenseType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品种类型" prop="chemicalType">
        <el-select
          v-model="form.chemicalType"
          value-key="id"
          @change="changeChemicalType"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in chemicalType"
            :key="index"
            :label="item.chemicalTypeValue"
            :value="item.chemicalType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品种名称" prop="chemicalName">
        <el-select
          v-model="form.chemicalName"
          value-key="id"
          placeholder="请选择"
          @change="corpTypeselsct"
        >
          <el-option
            v-for="(item, index) in chemicalNameList"
            :key="index"
            :label="item.chemicalName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="isShow==1?'购入时间':'生产时间'" prop="prodPurchTime">
        <el-form-item prop="date1">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="form.prodPurchTime"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item
        :label="isShow == 1?'购入量':'生产量'"
        prop="purchaseVolume"
        v-if="form.licenseType == 0"
      >
        <el-input
          v-model.trim="form.purchaseVolume"
          maxlength="10"
          onkeyup="this.value=this.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^\./g, '').replace(/\D*(\d*)(\.?)(\d{0,3})\d*/,'$1$2$3')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="isShow == 1?'购入量':'生产量'"
        prop="purchaseVolume"
        v-if="form.licenseType == 1"
      >
        <el-input
          v-model.trim="form.purchaseVolume"
          maxlength="10"
          onkeyup="this.value=this.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^\./g, '').replace(/\D*(\d*)(\.?)(\d{0,3})\d*/,'$1$2$3')"
        ></el-input>
      </el-form-item>
      <el-form-item label="购入来源" prop="purchaseSource" v-if="isShow==1">
        <el-input v-model.trim="form.purchaseSource"></el-input>
      </el-form-item>
      <el-form-item label="购入经办人" prop="purchaseHandler" v-if="isShow==1">
        <el-input v-model.trim="form.purchaseHandler"></el-input>
      </el-form-item>
      <el-form-item label="经办人身份证号" prop="purchaseHandlerIdcard" v-if="isShow==1">
        <el-input v-model.trim="form.purchaseHandlerIdcard"></el-input>
      </el-form-item>
      <el-form-item label="经办人单位" prop="purchaseHandlerCorp" v-if="isShow==1">
        <el-input v-model.trim="form.purchaseHandlerCorp"></el-input>
      </el-form-item>
      <el-form-item label="计量单位" prop="unit">
        <el-select v-model.trim="form.unit" :disabled="true" placeholder="请选择">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="dialogshow = false">取 消</el-button>
      <el-button type="primary" @click="submit(form)">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import service from '../Authentication/api/service'
export default {
  props: {
    rowdata: '',
    chemical_type: '',
    isShow: ''
  },
  watch: {
    rowdata(val) {},
    deep: true
  },
  data() {
    return {
      dialogshow: true,
      options: [],
      chemicalType: [],
      entertype: [],
      chemicalNameList: [],
      form: {
        licenseType: '', // 企业类型
        chemicalType: '', // 备案类型
        chemicalId: '', // 备案类型的id名称
        chemicalName: '', // 品种名称
        purchaseVolume: '', // 购入量、生产量
        unitId: '', // 计量单位的id
        unit: '', // 计量单位
        purchaseSource: '',
        purchaseHandler: '',
        purchaseHandlerIdcard: '',
        purchaseHandlerCorp: ''
      },
      rules: {
        prodPurchTime: [
          { required: true, message: '请选择生产购入时间', trigger: 'blur' }
        ],
        licenseType: [
          { required: true, message: '请选择企业类型', trigger: 'blur' }
        ],
        chemicalType: [
          { required: true, message: '请输入备案类型', trigger: 'blur' }
        ],
        chemicalName: [
          { required: true, message: '请选择品名', trigger: 'change' }
        ],
        purchaseVolume: [
          { required: true, message: '请输入相关数量', trigger: 'blur' }
        ],
        chemicalType: [
          { required: true, message: '请输入品种类型', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }],
        purchaseSource: [
          { required: true, message: '请输入购入来源', trigger: 'blur' }
        ],
        purchaseHandler: [
          { required: true, message: '请输入经办人', trigger: 'blur' }
        ],
        purchaseHandlerIdcard: [
          { required: true, message: '请输入经办人身份证号', trigger: 'blur' },
          {
            pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
            message: '请输入正确的身份证码',
            trigger: 'blur'
          }
        ],
        purchaseHandlerCorp: [
          { required: true, message: '请输入经办人单位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 许可备案类型change事件
    changeEntertype(type) {
      this.form.chemicalName = null
      this.form.chemicalType = null
      this.rules.chemicalType[0].required = true
      this.rules.chemicalName[0].required = true
      const userInfo = JSON.parse(this.$store.state.getUserMsg).datas
      const param = {
        corpId: userInfo.corpId || '',
        licenseType: type,
        officeId: ''
      }
      service.searchFirmCredential(param).then(res => {
        if (res && res.status == 200) {
          this.chemicalType = res.data.datas
          // this.chemicalNameList = res.data.datas.corpProdOperList
        }
      })
    },
    // 品种名称选择事件
    corpTypeselsct(item) {
      this.$nextTick(() => {
        this.$set(this.form, 'chemicalName', item.chemicalName)
      })
      this.rules.chemicalName[0].required = false
      this.form.chemicalId = item.id
      this.form.unit = item.unit
      this.form.unitId = item?.id || ''
      this.$forceUpdate()
    },
    // 品种类型事件
    changeChemicalType(item) {
      this.rules.chemicalType[0].required = false
      this.chemicalType.forEach((data, index) => {
        if (item == data.chemicalType) {
          this.chemicalNameList = data.corpProdOperList
        }
      })
    },
    dialogfalse() {
      this.$parent.licensedialog = false
    },
    // 表单提交
    submit(data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 1 的状态下为购入管理的保存
          if (this.isShow == 1) {
            data.productionType = 2
            service.purchaseSave(data).then(res => {
              if (res && res.status === 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogfalse()
                this.$parent.getProduce()
              }
            })
          } else {
            // 生产管理保存
            data.productionType = 1
            service.productionSave(data).then(res => {
              if (res && res.status === 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogfalse()
                this.$parent.getProduce()
              }
            })
          }
        }
      })
    },
    // 获取当前计量单位
    measurement() {
      service.measurement().then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.options = data
        }
      })
    },
    // 获取当前类型
    getchemical_type() {
      service.getchemical_type().then(res => {
        if (res && res.status == 200) {
          // this.chemicalType = res.data.datas
          // this.chemicalNameList = res.data.datas.chemicalNameList
        }
      })
    },
    // 获取许可备案类型
    getCorpTypeByLicenseCorpId() {
      const param = {
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId
      }
      service.getCorpTypeByLicenseCorpId(param).then(res => {
        if (res && res.data?.datas.length) {
          this.entertype = res.data.datas
        } else {
          this.chemicalType = []
          this.entertype = []
          this.chemicalType.push({
            chemicalTypeValue: this.rowdata.chemicalTypeValue,
            chemicalType: this.rowdata.chemicalType
          })
          this.entertype.push({
            licenseTypeValue: this.rowdata.licenseTypeValue,
            licenseType: this.rowdata.licenseType
          })
        }
      })
    }
  },

  mounted() {},
  created() {
    this.measurement()
    this.getchemical_type()
    this.getCorpTypeByLicenseCorpId()
    this.changeEntertype(this.rowdata.licenseType)
    this.form = Object.assign({}, this.rowdata)
  }
}
</script>