<template>
  <el-dialog
    title="企业销售信息录入"
    :visible.sync="dialogFormVisible"
    width="50%"
    :append-to-body="false"
    @close="dialogfalse"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formrules"
      :model="formrules"
      :rules="rules"
      label-width="180px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="全部销售收入（万元）" label-width="300px" prop="generalIncome">
            <el-input
              v-model="formrules.generalIncome"
              onkeyup="value=value.replace(/[^\d^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="其中：易制毒化学品销售收入（万元）"
            prop="chemicalIncome"
            label-width="300px"
          >
            <el-input
              v-model="formrules.chemicalIncome"
              onkeyup="value=value.replace(/[^\d^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="主要负责人" prop="responsibleUser">
            <el-input v-model="formrules.responsibleUser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业上报人" prop="reportPerson">
            <el-input v-model="formrules.reportPerson"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="formrules.mobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="传真" prop="fax">
            <el-input v-model="formrules.fax"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="其他情况" prop="otherInstructions">
            <el-input
              type="textarea"
              v-model="formrules.otherInstructions"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div align="center" v-show="ischeck">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit(formrules)">确 定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import service from '../Authentication/api/service'
import Vue from 'vue'
export default Vue.extend({
  props: {
    rowdata: Object,
    check: {
      type: Boolean,
      required: true
    },
    ischeck: Boolean,
    year: ''
  },
  data() {
    return {
      dialogFormVisible: true,
      mobile: JSON.parse(this.$store.state.getUserMsg).datas.mobile,
      nickname: JSON.parse(this.$store.state.getUserMsg).datas.nickname,
      creditCode: JSON.parse(this.$store.state.getUserMsg).datas.creditCode,
      formrules: {
        generalIncome: '',
        chemicalIncome: '',
        responsibleUser: '',
        reportPerson: '',
        fax: '',
        mobile: '',
        otherInstructions: '',
        year: this.year,
        id: ''
      },
      rules: {
        year: [{ required: true, message: '请选择年份', trigger: 'blur' }],
        generalIncome: [
          { required: true, message: '请输入当前年度销售收入', trigger: 'blur' }
        ],
        chemicalIncome: [
          {
            required: true,
            message: '请输入当前年度易制毒销售收入',
            trigger: 'blur'
          }
        ],
        fixedAssets: [
          {
            required: true,
            message: '请输入当前年度固定资产净值',
            trigger: 'blur'
          }
        ],
        responsibleUser: [
          {
            required: true,
            message: '请输入负责人姓名',
            trigger: 'blur'
          }
        ],
        reportPerson: [
          {
            required: true,
            message: '请输入上报人姓名',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    dialogfalse() {
      this.$parent.licensedialog = false
      // this.$parent.getEnterpriseSales()
    },
    submit(formrules) {
      this.$refs.formrules.validate(valid => {
        if (valid) {
          service.addenterpriseSales(formrules).then(res => {
            if (res && res.data.resp_code == 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$parent.getEnterpriseSales()
            } else {
              this.$message({
                message: res.data.resp_msg,
                type: 'error'
              })
            }
          })
          this.dialogfalse()
        }
      })
    }
  },
  created() {
    this.formrules = Object.assign({}, this.rowdata)
  }
})
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
/deep/.el-input {
  display: inline-block;
  width: 100% !important;
}
</style>
