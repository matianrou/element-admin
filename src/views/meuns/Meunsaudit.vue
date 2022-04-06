<template>
  <div>
    <el-dialog
      :visible.sync="DialogTip"
      width="30%"
      height="50%"
      :title="dialogTitle"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序" prop="name">
          <el-input v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item style="margin: auto; display: block" align="center">
          <el-button type="primary" @click="onSubmit(ruleForm)">保存</el-button>
          <el-button @click="DialogTip = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import service from '../Authentication/api/service'
export default {
  name: 'Meunsaudit',
  props: {
    DialogTipShow: Boolean,
    dialogTitle: ''
  },
  data() {
    const validatename = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入帐号'))
      } else {
        callback()
      }
    }
    const validateurl = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入文件名称'))
      } else {
        callback()
      }
    }
    const validatesort = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入排序-请按照正序排列'))
      } else {
        callback()
      }
    }
    return {
      DialogTip: false,
      ruleForm: {
        name: '',
        url: '',
        sort: '',
        parentId: -1,
        subMenus: [],
        createTime: '',
        css: '',
        hidden: true,
        id: 0,
        menuIds: [],
        path: '',
        pathMethod: '',
        roleId: 0,
        type: 0,
        updateTime: ''
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
        sort: [
          {
            required: true,
            message: '请输入排序-请按照正序排列',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    DialogTipShow(val) {
      this.DialogTip = true
    },
    dialogTitle(val) {
      this.dialogTitle = val
    },
    deep: true
  },
  methods: {
    onSubmit(data) {
      this.$refs.ruleForm.validate((valid) => {
        service.addMenus(data).then((res) => {
          if (res.status == '200') {
            this.$message({
              type: 'success',
              message: '保存成功,请您到角色管理菜单勾选权限'
            })
            this.$parent.getMenusInfo()
            this.DialogTip = false
          }
        })
      })
    },
    rest() {
      this.ruleForm = {
        name: '',
        url: '',
        sort: '',
        parentId: -1,
        subMenus: [],
        createTime: '',
        css: '',
        hidden: true,
        id: 0,
        menuIds: [],
        path: '',
        pathMethod: '',
        roleId: 0,
        type: 0,
        updateTime: ''
      }
    }
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
