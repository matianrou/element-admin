<template>
  <el-dialog
    title="添加销售流向"
    :visible.sync="dialogFormVisible"
    width="80%"
    :append-to-body="false"
    @close="dialogfalse"
    :close-on-click-modal="false"
  >
    <el-form
      id="addproduction"
      ref="form"
      :model="form"
      label-width="130px"
      class="demo-form-inline"
      :inline="true"
      :rules="rules"
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
      <el-form-item label="销售时间" prop="saleTime">
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="form.saleTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="销售总量">
        <el-input
          v-model="form.areaSales"
          disabled
          autocomplete="off"
          onchange="this.value=this.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^\./g, '').replace(/\D*(\d*)(\.?)(\d{0,3})\d*/,'$1$2$3')"
        ></el-input>
      </el-form-item>
      <el-form-item label="计量单位">
        <el-input v-model="form.unit" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item style="display: flex">
        <el-button type="primary" style="margin: 0 10px 10px 0" @click="areaflow">添加流向地区</el-button>
        <el-alert :closable="false" :title="areatitle" type="error"></el-alert>
      </el-form-item>
      <el-table :data="form.tableData" style="width: 100%" border :row-class-name="rowtabledata">
        <el-table-column label="地区" width="400" align="center" prop="country">
          <template slot-scope="scope">
            <el-form-item
              class="arealist"
              :rules="rules.country"
              :prop="'tableData.' + scope.$index + '.country'"
            >
              <el-cascader
                v-model="scope.row.country"
                :options="areaExportList"
                :key="caseKey"
                :props="{ value: 'id', label:'label'}"
                :show-all-levels="true"
                placeholder="请选择"
                ref="cascaderAddr"
                @change="selsctarea(scope.$index,scope)"
              ></el-cascader>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="流向单位类型" align="center" width="220" prop="flowDeptType">
          <template slot-scope="scope">
            <el-form-item
              :rules="rules.flowDeptType"
              :prop="'tableData.' + scope.$index + '.flowDeptType'"
            >
              <el-select v-model="scope.row.flowDeptType" placeholder="请选择">
                <el-option
                  v-for="item in flatTypelist"
                  :key="item.id"
                  :label="item.label"
                  :value="JSON.parse(item.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="流向单位名称" align="center" width="200" prop="flowDeptName">
          <template slot-scope="scope">
            <el-form-item
              :rules="rules.flowDeptName"
              :prop="'tableData.' + scope.$index + '.flowDeptName'"
            >
              <el-input v-model.trim="scope.row.flowDeptName"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="经办人" align="center" width="200" prop="purchaseHandler">
          <template slot-scope="scope">
            <el-form-item
              :rules="rules.purchaseHandler"
              :prop="'tableData.' + scope.$index + '.purchaseHandler'"
            >
              <el-input v-model.trim="scope.row.purchaseHandler"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="经办人身份证号" align="center" width="230" prop="purchaseHandlerIdcard">
          <template slot-scope="scope">
            <el-form-item
              :rules="rules.purchaseHandlerIdcard"
              :prop="'tableData.' + scope.$index + '.purchaseHandlerIdcard'"
            >
              <el-input v-model.trim="scope.row.purchaseHandlerIdcard"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="销售数量(吨)" align="center" width="200" prop="areaSales">
          <template slot-scope="scope">
            <el-form-item
              :rules="rules.areaSales"
              :prop="'tableData.' + scope.$index + '.areaSales'"
            >
              <el-input
                v-model.trim="scope.row.areaSales"
                maxlength="10"
                @blur="inputChange"
                onkeyup="this.value=this.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^\./g, '').replace(/\D*(\d*)(\.?)(\d{0,3})\d*/,'$1$2$3')"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="销售金额(万元)" align="center" width="200" prop="areaSalesMoney">
          <template slot-scope="scope">
            <el-form-item
              :rules="rules.areaSalesMoney"
              :prop="'tableData.' + scope.$index + '.areaSalesMoney'"
            >
              <el-input
                v-model.trim="scope.row.areaSalesMoney"
                maxlength="10"
                onkeyup="this.value=this.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="isShow" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div slot="footer" class="dialog-footer" v-show="isShow" align="center">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="restform">重置</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import service from '../Authentication/api/service'
// import mixins from '@/utils/mixins'

export default {
  // mixins: [mixins],
  props: {
    rowlist: '',
    isShow: '',
    year: {
      type: String,
      default: ''
    },
    credentialList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validateFixedNum = (rule, value, callback) => {
      if (!value) {
        callback('请输入正确数量')
      } else {
        const reg = /^-?\d{1,8}(?:\.\d{1,2})?$/
        if (reg.test(value)) {
          callback()
        } else {
          callback('请保留小数点后2位')
        }
      }
    }
    return {
      dialogFormVisible: true,
      caseKey: 0,
      chemicalType: [],
      entertype: [],
      chemicalNameList: [],
      areaExportList: [],
      pathname: '',
      areatitle: '温馨提醒：您备案的流向地区为：',
      form: {
        year: this.year, // 时间
        licenseType: '', // 企业经营类型
        chemicalType: '', // 备案许可类型
        chemicalName: '', // 品名
        purchaseVolume: '', // 购入量
        sales: '', // 销售量
        inventory: '', // 库存量
        unit: '', // 计量单位
        unitId: '', // 计量单位
        prodChemicalFlowList: [], // 流向地区
        corpId: '',
        areaSales: '',
        saleTime: ''
      },
      prodOperTypeList: [
        { label: '生产', value: '0' },
        { label: '经营', value: '1' }
      ], // 生产或经营列表
      chemicalTypeList: [], // 备案证书列表
      chemicalNameList: [], // 化学品名称列表
      flatTypelist: [], // 流向单位类型
      flatesessionlist: [],
      rules: {
        licenseType: [
          { required: true, message: '请选择企业类型', trigger: 'change' }
        ],
        chemicalName: [
          { required: true, message: '请选择品名', trigger: 'change' }
        ],
        chemicalType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        prodOperType: [
          { required: true, message: '请选择生产或经营类型', trigger: 'blur' }
        ],
        areaSales: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          }
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
        country: [{ required: true, message: '请选择地区', trigger: 'change' }],
        flowDeptType: [
          { required: true, message: '请选择流向单位', trigger: 'change' }
        ],
        flowDeptName: [
          { required: true, message: '请输入流向单位名称', trigger: 'blur' }
        ],
        areaSalesMoney: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ],
        purchaseVolume: [
          { required: true, validator: validateFixedNum, trigger: 'blur' }
        ],
        saleTime: [
          { required: true, message: '请选择销售时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    prodOperTypeListFilter: {
      get() {
        return this.prodOperTypeList.filter(item =>
          this.credentialList.some(s => s.licenseType === item.value)
        )
      }
    },
    chemicalTypeListFilter: {
      get() {
        return this.chemicalTypeList.filter(item =>
          this.credentialList.some(
            s =>
              s.licenseChemicalType === item.value &&
              this.form.prodOperType === s.licenseType
          )
        )
      }
    }
  },
  watch: {
    areaExportList() {
      ++this.caseKey
    },
    'form.sales': {
      handler: function(newVal, oldVal) {
        // 动态计算企业库存量
        if (newVal !== oldVal) {
          let pv = +Number(this.form.purchaseVolume).toPrecision()
          let nv = +Number(newVal).toPrecision()
          pv = +pv.toFixed(2)
          nv = +nv.toFixed(2)
          if (pv && nv) {
            let sum = +(pv - nv).toPrecision()
            if (sum < 0) sum = 0
            this.form.inventory = sum.toFixed(2)
          }
        }
      }
    },
    deep: true
  },
  methods: {
    rowtabledata(row, index) {
      if (row.row.delFlag == 1) {
        return 'hidden-row'
      }
      return ''
    },
    // 选择地区时同时赋值给流向列表
    selsctarea(rowindex, val) {
      // 出口  因为是手动push进去的数据所以干脆不进循环，拿出来单独伺候
      if (val.row.country[0] == '999999' || val.row.country[0] == '999998') {
        // this.form.tableData[rowindex].country = k.id
      }

      if (this.form.tableData[rowindex].country.length == 2) {
        this.form.tableData[rowindex].province = val.row.country[0]
        this.form.tableData[rowindex].country =
          val.row.country[val.row.country.length - 1]
      } else {
        this.form.tableData[rowindex].province = val.row.country[0]
        this.form.tableData[rowindex].city = val.row.country[1]
        this.form.tableData[rowindex].country =
          val.row.country[val.row.country.length - 1]
      }
      this.form.tableData[rowindex]
      // this.areaExportList.forEach((item, index) => {
      //   if (item.id == val.row.country[0]) {
      //     for (const k of item.children) {
      //       if (k.children) {
      //         for (const k of k.children) {
      //           if (this.form.tableData[rowindex].country.includes(k.id)) {
      //             this.form.tableData[rowindex].country = k.id
      //             return
      //           }
      //         }
      //       } else {
      //         if (this.form.tableData[rowindex].country.includes(k.id)) {
      //           this.form.tableData[rowindex].country = k.id
      //           return
      //         }
      //       }
      //     }
      //   }
      // })
    },
    // 企业类型change事件
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
        if (res && res.data?.datas.length) {
          this.chemicalType = res.data.datas
          let area = []
          this.chemicalType.forEach((item, index) => {
            for (let k of item.corpProdOperList) {
              if (k.chemicalName == this.rowlist.chemicalName) {
                for (let j of k.chemicalMainFlowList) {
                  area.push(j.area)
                }
              }
            }
          })
          this.areatitle =
            '温馨提醒：您申请的备案流向地区为：' +
            [...new Set([...area])].join()
        }
      })
    },
    // 品种名称选择事件
    corpTypeselsct(item) {
      this.rules.chemicalName[0].required = false
      this.form.chemicalName = item.chemicalName
      this.form.chemicalId = item.id
      this.form.unit = item.unit
      this.form.unitId = item?.id || ''
      const area = []
      for (let k of item.chemicalMainFlowList) {
        area.push(k.area)
      }
      this.areatitle =
        '温馨提醒：您申请的备案流向地区为：' + [...new Set([...area])].join()
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
    // 获取当前地区tree列表
    getArea() {
      const param = {
        id: '100000'
      }
      service.getArea(param).then(res => {
        if (res && res.status == 200) {
          this.areaExportList = res.data.datas
          this.$nextTick(() => {
            this.areaExportList.unshift(
              { label: '出口', id: 999999 },
              { label: '自用', id: 999998 }
            )
          })
          this.$forceUpdate()
        }
      })
    },
    // 企业类型改变方法
    prodOperTypeChangeHandle(val) {
      this.form.prodOperType = val
    },
    // 备案类型改变方法
    chemicalTypeChangeHandle() {
      this.form.chemicalName = null
    },
    inputChange() {
      // 动态计算企业销售量并保持小数点后两位
      // 动态计算企业销售量并保持小数点后两位
      let re = /([0-9]+\.[0-9]{2})[0-9]*/
      const reduceRes = this.form.tableData.reduce((acc, cur) => {
        if (cur.delFlag != 1) {
          return acc + Number(cur.areaSales)
        } else {
          return acc + 0
        }
      }, 0)
      this.$set(this.form, 'areaSales', reduceRes)
    },
    dialogfalse() {
      this.$parent.licensedialog = false
    },
    submit() {
      this.form.tableData.forEach((item, index) => {
        if (typeof item.country == 'string') {
          item.country = JSON.parse(item.country)
        } else if (typeof item.country == 'object' && item.country.length > 1) {
          item.country = JSON.stringify(item.country[item.country.length - 1])
        } else {
          item.country = item.country.toString()
        }
      })
      const data = {
        ...this.form,
        prodChemicalFlowList: this.form.tableData,
        corpId: JSON.parse(this.$store.state.getUserMsg).datas.corpId
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!data.tableData.length) {
            return this.$message.warning('请添加流向地区!')
          }
          // if (+this.form.sales > +this.form.purchaseVolume) {
          //   return this.$message.warning('当前销售量不能超出购入量!')
          // }
          service.productionFolwSave(data).then(res => {
            if (res && res.data.resp_code == 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$parent.licensedialog = false
              this.$parent.prodChemicalFlow()
            } else {
              return this.$message.error(res.data.resp_msg)
            }
          })
        }
      })
    },
    areaflow() {
      const param = {
        country: '',
        flowDeptType: '',
        flowDeptName: '',
        areaSales: '',
        areaSalesMoney: '',
        province: '',
        city: '',
        purchaseHandler: '',
        purchaseHandlerIdcard: '',
        delFlag: '0',
        show: true
      }
      this.form.tableData.push(param)
    },
    handleDelete(index, row) {
      // if(row?.show){
      //   this.form.tableData.splice(index, 1)
      // }
      const data = [
        row.counter,
        row.flowDeptName,
        row.areaSales,
        row.purchaseHandler,
        row.purchaseHandlerIdcard
      ]
      if (data.includes('') || row?.show) {
        this.form.tableData.splice(index, 1)
      } else {
        this.form.tableData[index].delFlag = 1
      }
      this.inputChange()
      // if 数值是空的话，就把当前数据移除，如果不是空的话，就把 delFlag 设为"1"后 把当前数据隐藏，向后台传输时把原数据还传到后台去
      // if (
      //   row.counter == '' ||
      //   row.flowDeptName == '' ||
      //   row.areaSales == '' ||
      //   row.purchaseHandler == '' ||
      //   row.purchaseHandlerIdcard == ''
      // ) {
      //   this.form.tableData.splice(index, 1)
      // }
      // this.form.tableData[index].delFlag = 1
    },
    restform() {
      this.$refs['form'].resetFields()
      this.$nextTick(() => {
        this.form.year = this.year // 时间
        this.form.prodOperType = null // 企业经营类型
        this.form.chemicalType = null // 备案许可类型
        this.form.chemicalName = null // 品名
        this.form.purchaseVolume = null // 购入量
        this.form.sales = null // 销售量
        this.form.inventory = null // 库存量
        this.form.unit = null // 计量单位
        this.form.areaSales = null // 计量单位
        this.form.prodChemicalFlowList = [] // 流向地区
        this.form.corpId = null
        this.form.tableData = []
      })
      this.$refs.form.clearValidate()
    },
    // async findByChemicalType() {
    //   return await service.findByChemicalType(this.form.chemicalType)
    // },
    // 获取流向单位类型
    getflatType() {
      service.getcorp_type('flow_dept_type').then(res => {
        if (res && res.status == 200) this.flatTypelist = res.data.datas
      })
    },
    // 获取当前类型
    getchemical_type() {
      service.getchemical_type().then(res => {
        if (res && res.status == 200) {
          this.chemicalType = res.data.datas
        }
      })
    },
    // 获取企业类型
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
            chemicalTypeValue: this.rowlist.chemicalTypeValue,
            chemicalType: this.rowlist.chemicalType
          })
          this.entertype.push({
            licenseTypeValue: this.rowlist.licenseTypeValue,
            licenseType: this.rowlist.licenseType
          })
        }
      })
    }
  },
  mounted() {
    if (this.rowlist == '') {
      this.form = this.form
      this.form.tableData = []
    } else {
      this.form = this.rowlist
      this.form.tableData = this.rowlist.prodChemicalFlowList
      this.flatesessionlist = this.rowlist.prodChemicalFlowList
    }
  },
  async created() {
    this.getchemical_type()
    this.getCorpTypeByLicenseCorpId()
    this.changeEntertype(this.rowlist.licenseType)
    this.getArea()
    this.getflatType()
    this.form = Object.assign({}, this.rowlist)
    this.$nextTick(() => {
      this.form.areaSales = this.rowlist.prodChemicalFlowList.reduce(
        (acc, cur) => {
          return acc + Number(cur.areaSales)
        },
        0
      )
    })
  }
}
</script>
<style scoped lang="scss">
#addproduction {
  .el-input {
    width: auto !important;
  }
}
</style>
<style>
.el-table .hidden-row {
  display: none;
}
.arealist .el-input {
  width: 350px;
}
</style>
