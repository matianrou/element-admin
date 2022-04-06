<template>
  <div>
    <el-dialog
      :visible.sync="DialogTip"
      width="25%"
      height="30%"
      :title="dialogTitle"
      v-if="DialogTip"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <!-- <ul class="ztree">
          <li v-for="(item, index) of treedata" :key="index">
            <label for="" 
              ><input type="checkbox" @change="inputchecked(item)" class="goods-checked" />{{ item.name }}</label
            >
          </li>
        </ul> -->
        <!-- <el-tree
        :data="treedata"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
      >
      </el-tree> -->
        <el-form-item style="margin: auto; display: block" align="center">
          <el-button type="primary" @click="onSubmit(form)">保存</el-button>
          <el-button @click="DialogTip = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
// import func from 'vue-editor-bridge';
import service from '../service'
export default {
  name: 'useraudit',
  props: {
    DialogTipShow: Boolean,
    rowdata: '',
    dialogTitle: ''
  },
  data() {
    return {
      form: {
        name: '',
        code: '',
        id: ''
      },
      DialogTip: false,
      treedata: '',
      checkFlag: [],
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    DialogTipShow(val) {
      this.DialogTip = true
    },
    rowdata(val) {
      if (val == '') {
        this.form = {
          name: '',
          code: '',
          id: ''
        }
        // this.$refs.form.resetFields()
      } else {
        for (let k in this.form) {
          this.form[k] = val[k] || ''
        }
      }
    },
    dialogTitle(val) {
      this.dialogTitle = val
    },
    deep: true
  },
  methods: {
    rest() {
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
        this.form.id = ''
      }
    },
    closeDialog() {
      this.DialogTip = false
      this.$emit('closeDialog', false)
    },
    getFindAlls() {
      service.getFindAlls().then((res) => {
        if (res.status == 200) {
          const data = res.data.data
          this.treedata = data
          // this.treedata.forEach(function (item, index) {
          //   item.label = item.name
          //   item.show = false
          // })
          console.log(this.treedata)
        }
      })
    },
    inputchecked(data) {
      data.show = !data.show
    },
    onSubmit(data) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (data.id == '') {
            service.saveRole(data).then((res) => {
              if (res.status == '200') {
                this.$parent.getRoleInfo()
                this.DialogTip = false
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              }
            })
          } else {
            service.saveRole(data).then((res) => {
              if (res.status == '200') {
                this.$parent.getRoleInfo()
                this.DialogTip = false
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
              }
            })
          }
        }
      })
      for (let k of this.treedata) {
        if (k.show) {
          k.roleId = data.id
          this.checkFlag.push(k)
        }
      }
      const param = this.checkFlag
      service.addrole(JSON.stringify(param)).then((res) => {
        if (res.status == '200') {
        }
      })
    }
  },
  created() {},
  mounted() {
    // 查询所有菜单
    this.getFindAlls()
  },
  computed: {}
}
</script>
<style scoped lang="less">
.ztree {
  width: 100%;
  height: 200px;
  display: block;
  margin: auto;
  padding: 0 0 0 20px;
  li {
    width: 200px;
    height: 30px;
    display: inline-block;
    float: left;
    line-height: 30px;
  }
}
</style>