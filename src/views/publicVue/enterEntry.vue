<template>
  <div>
    <el-form v-loading="loading" ref="formFlag" :model="editForm" :inline="false" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="企业名称" prop="corpName" label-width="190px">
            <el-input v-model.trim="editForm.corpName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row v-if="iftype == 1">
        <el-col :span="24">
          <el-form-item label="法人姓名" prop="legalPerson" label-width="190px">
            <el-input v-model.trim="editForm.legalPerson"></el-input>
          </el-form-item>
        </el-col>
      </el-row>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="统一社会信用代码" prop="creditCode" label-width="190px">
            <el-input v-model.trim="editForm.creditCode" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="corpEmail" label-width="190px">
            <el-input v-model.trim="editForm.corpEmail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="经济类型" prop="economicType" label-width="190px">
            <el-select v-model.trim="editForm.economicType" placeholder="请选择">
              <el-option
                v-for="(item, index) in EconomicType"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮政编码" prop="zipCode" label-width="190px">
            <el-input v-model.trim="editForm.zipCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="地址" prop="areaId" label-width="190px">
            <el-cascader
              v-model.trim="editForm.areaId"
              placeholder="请选择地址"
              :key="areaExportList.value"
              :props="{ value: 'id', label: 'label' }"
              :options="areaExportList"
              ref="myCascader"
              filterable
              @change="addresChange"
            ></el-cascader>
            <!-- <el-cascader
                v-model="formInline.areaId"
                placeholder="请选择地址"
                :key="options.value"
                :props="{ value: 'id', checkStrictly: true }"
                :options="options"
                :show-all-levels="false"
                ref="myCascader"
            ></el-cascader>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="详细地址" prop="address" label-width="190px">
            <div>
              <!-- <el-cascader
                style="width:30%"
                v-model.trim="editForm.areaId"
                :options="areaExportList"
                :key="areaExportList.value"
                :props="{ value: 'id', label: 'label' }"
                disabled
              ></el-cascader>-->
              <el-input style="width:30%" v-model.trim="editForm.areaIdText" readonly></el-input>&nbsp;-
              <el-input style="width:calc(70% - 13px)" v-model.trim="editForm.address"></el-input>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="主要负责人" prop="legalPerson" label-width="190px">
            <el-input v-model.trim="editForm.legalPerson" :disabled="editForm.auditStatus == 1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="iftype == 0 ? '手机号' : '法人手机号'" prop="mobile" label-width="190px">
            <el-input v-model.trim="editForm.mobile" :disabled="editForm.auditStatus == 1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产/经营类型" prop="corpType" label-width="190px">
            <el-select
              v-model.trim="editForm.corpType"
              placeholder="请选择"
              :disabled="editForm.auditStatus === '1'"
            >
              <el-option
                v-for="(item, index) in corp_type"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立日期" label-width="190px" prop="establishTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model.trim="editForm.establishTime"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="技术、销售管理人员人数" prop="management" label-width="190px">
            <el-input
              v-model.trim="editForm.management"
              onkeyup="this.value=this.value.replace(/[^\d]/g,'')"
              maxlength="8"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业从业人数" prop="workerNum" label-width="190px">
            <el-input
              v-model.trim="editForm.workerNum"
              onkeyup="this.value=this.value.replace(/[^\d]/g,'')"
              maxlength="8"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上年固定资产净值（万元）" prop="yesteryearFixedAssets" label-width="190px">
            <el-input
              v-model.trim="editForm.yesteryearFixedAssets"
              @input="handleLimit2Input($event, 'yesteryearFixedAssets')"
              maxlength="8"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上年销售收入（万元）" prop="yesteryearGeneralIncome" label-width="190px">
            <el-input
              v-model.trim="editForm.yesteryearGeneralIncome"
              @input="handleLimit2Input($event, 'yesteryearGeneralIncome')"
              maxlength="8"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item align="center">
            <el-button
              type="primary"
              @click="onSubmit"
            >{{ editForm.auditStatus == 1 ? '提交' : '提交审核' }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import service from '../Authentication/api/service'
import { isMobile } from '@/utils/validate'

export default {
  props: {
    form: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('请输入正确的手机号格式'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      publicId: JSON.parse(this.$store.state.getUserMsg).datas.corpId,
      EconomicType: '',
      areaExportList: [],
      corp_type: '',
      iftype: JSON.parse(this.$store.state.getUserMsg).datas.type,
      editForm: {
        areaIdText: '',
        corpName: '',
        creditCode: '',
        corpEmail: '',
        economicType: '',
        legalPerson: '',
        address: '',
        areaId: '',
        establishTime: '',
        corpType: '',
        workerNum: '',
        management: '',
        mobile: '',
        zipCode: '',
        yesteryearFixedAssets: '',
        yesteryearGeneralIncome: ''
      },
      rules: {
        nickName: [
          { required: true, message: '请输入法人姓名', trigger: 'blur' }
        ],
        corpName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        creditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
        ],
        corpEmail: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确格式的邮箱地址',
            trigger: 'blur'
          }
        ],
        economicType: [
          { required: true, message: '请选择经济类型', trigger: 'change' }
        ],
        legalPerson: [
          { required: true, message: '请输入主要负责人', trigger: 'blur' }
        ],
        zipCode: [
          { message: '请输入邮政编码', trigger: 'blur' },
          {
            pattern: /^[0-9][0-9]{5}$/,
            message: '请输入正确的邮政编码',
            trigger: 'blur'
          }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        areaId: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        establishTime: [
          { required: true, message: '请选择成立日期', trigger: 'blur' }
        ],
        corpType: [
          { required: true, message: '请选择生产/经营类型', trigger: 'blur' }
        ],
        workerNum: [
          { required: true, message: '请输入企业从业人数', trigger: 'blur' }
        ],
        management: [
          {
            required: true,
            message: '请输入技术、销售管理人员人数',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    this.loading = true;
    await Promise.all([
      this.getArea(),
      this.getCurpType(),
      this.getEconomicType()
    ]).then(() => {
      this.loading = false;
    })
    this.editForm = JSON.parse(JSON.stringify(this.form))
    this.editForm.areaId = JSON.parse(this.editForm?.areaId)
  },
  watch: {
    'editForm.areaId'(nal, oal) {
      if (nal !== oal) {
        this.$nextTick(() => {
          // 监听数据回显详细地址拆分框，这里 presentText 只有触发选中时间才变更
          // console.log(this.$refs.myCascader.presentText)
          // console.log(this.$refs.myCascader.getCheckedNodes()[0].pathLabels)
          const areaText = this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join('');
          const address = this.editForm.address.replace(areaText, '');
          this.$set(this.editForm, 'address', address)
          this.$set(this.editForm, 'areaIdText', areaText);
        })
      }
    }
  },
  methods: {
    // 限制两位小数
    handleLimit2Input(val, attr) {
      let str = (val && val.split("")) || [];
      let reg1 = /\d/;
      let reg2 = /\./;
      // 第一个字符不能为小数点
      if (str[0] == ".") {
        this.editForm[attr] = "";
        return;
      }
      // 过滤掉除数字和小数点外的字符
      val = str.filter((e) => reg1.test(e) || reg2.test(e));
      // 匹配小数点后只能有两位小数
      let valJoin = val.join("");
      this.editForm[attr] = valJoin.match(/^\d*(\.?\d{0,2})/g)[0] || null;
    },
    // 获取当前地区tree列表
    getArea() {
      const param = {
        id: '100000'
      }
      return service.getArea(param).then(res => {
        if (res && res.status == 200) {
          this.areaExportList = res.data.datas
        }
      })
    },
      //  获取地址
      addresChange(v){
      //  console.log(v,'打印地址的选择')
      },
    // 基本信息保存
    onSubmit() {
      this.$refs['formFlag'].validate(valid => {
        if (valid) {
          const areaId = this.editForm.areaId[this.editForm.areaId.length - 1]
          const data = {
            ...JSON.parse(JSON.stringify(this.editForm)),
            id: this.publicId,
            areaId,
            address: this.editForm.areaIdText + this.editForm.address,
            auditStatus: this.form.auditStatus == 3 ? '0' : this.form.auditStatus,
            updateType: [] // 变更条件
          }
          service.addenterdata(data).then(res => {
            if (res && res.status === 200) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.$emit('close-handle')
            } else {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    getEconomicType() {
      return service.getEconomic_type().then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.EconomicType = data
        }
      })

    },
    getCurpType() {
      return service.getcorp_type('corp_type').then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.corp_type = data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-select {
  width: 100%;
}
.el-cascader {
  width: 100%;
}
/deep/ .el-input {
  width: 100%;
  display: inline-block;
}
</style>
