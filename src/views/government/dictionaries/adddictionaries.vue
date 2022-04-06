<template>
  <div id="zidianghuanli">
    <el-dialog
      title="字典管理"
      :visible.sync="dialogshow"
      height="100%"
      width="40%"
      @close="dialogfalse"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" label-width="80px" ref="form" class="demo-form">
        <el-form-item label="字典名称" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="字典码" prop="value">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="label">
          <el-input v-model="form.label"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="255"></el-input-number>
          <span>排序号范围在0-255之间</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogshow = false">取 消</el-button>
          <el-button type="primary" @click="save(form)">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
export default {
  props: {
    rowdata: ''
  },
  data() {
    return {
      form: {
        description: '',
        type: '',
        value: '',
        label: '',
        sort: ''
      },
      dialogshow: true,
      rules: {
        description: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
        value: [{ required: true, message: '请输入字典码', trigger: 'blur' }],
        label: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
      }
    }
  },
  methods: {
    save(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          service.saveDict(form).then(res => {
            if (res && res.status == 200) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.dialogfalse()
            }
          })
        }
      })
    },
    dialogfalse() {
      this.$parent.Adddictionaries = false
      this.$parent.getRenderlist()
    }
  },
  
  created() {
    this.form = Object.assign({}, this.rowdata)
  }
}
</script>
<style>
#zidianghuanli .el-input {
  width: 100%;
}
</style>