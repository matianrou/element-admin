<template>
  <el-dialog
    title="品种管理"
    :visible.sync="dialogshow"
    width="25%"
    height="100%"
    @close="dialogfalse"
    :close-on-click-modal="false"
  >
    <!-- <el-alert :closable="false" :type="type" style="margin-bottom:15px">{{dangerTypevalue}}</el-alert> -->
    <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-form">
      <el-form-item label="品种类别" prop="chemicalType">
        <el-select v-model="form.chemicalType" placeholder="请选择品种类别">
          <el-option
            v-for="(item, index) in chemical_type"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品种名称" prop="chemicalName">
        <el-input v-model.trim="form.chemicalName"></el-input>
      </el-form-item>
      <el-form-item label="计量单位" prop="unit">
        <el-select v-model.trim="form.unit" value-key="id" @change="changeunit" placeholder="请选择">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否为危险化学品" prop="status">
        <el-select v-model.trim="form.dangerType" placeholder="请选择">
          <el-option label="危险化学品" value="0"></el-option>
          <el-option label="非危险化学品" value="1"></el-option>
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
import service from '../../Authentication/api/service'
export default {
  props: {
    rowform: '',
    chemical_type: ''
  },
  watch: {
    rowform(val) {},
    deep: true
  },
  data() {
    return {
      dialogshow: true,
      options: [],
      chemicalNameList: [],
      type: 'success',
      dangerTypevalue: '',
      form: {
        chemicalType: '',
        chemicalName: '',
        unit: null,
        density: '',
        unitId: '',
        dangerType:''
      },
      rules: {
        chemicalType: [
          { required: true, message: '请输入品种类型', trigger: 'blur' }
        ],
        chemicalName: [
          { required: true, message: '请输入品种名称', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }],
        dangerType: [{ required: true, message: '请选择相关条件', trigger: 'change' }]
      }
    }
  },
  methods: {
    changeunit(val) {
      this.form.unit = val.label || ''
      this.form.unitId = val.id || ''
    },
    dialogfalse() {
      this.$parent.addAhemicaldialog = false
    },
    // 表单提交
    submit(data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          service.addchemicalInfo(data).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.dialogfalse()
              this.$parent.getRenderlist()
            }
          })
        }
      })
    },
    restfrom() {
      this.form = Object.assign({}, this.rowform)
    },
    measurement() {
      service.measurement().then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.options = data
        }
      })
    },
    // 获取危险化学品列表
    getchemicalNameList() {
      const param = {
        type: 'chemical_danger_type'
      }
      service.getDictType(param).then(res => {
        this.chemicalNameList = res.data.datas
      })
    }
  },
  mounted() {
    this.restfrom()
    this.measurement()
  },
  created() {
    this.getchemicalNameList()
  }
}
</script>