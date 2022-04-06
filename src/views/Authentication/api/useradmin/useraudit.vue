<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="nickname">
            <el-input v-model.trim="form.nickname" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户帐号" prop="username">
            <el-input
              v-model.trim="form.username"
              placeholder="请输入用户帐号"
              @blur="getuser"
              :disabled="editFlag"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model.trim="form.password"
              :placeholder="editFlag ? '若不修改，请留空' : '请输入密码'"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="newPassword">
            <el-input
              type="password"
              v-model.trim="form.newPassword"
              :placeholder="editFlag ? '若不修改，请留空' : '请输入密码'"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model.trim="form.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="form.type === '0' && isShow">
          <el-form-item label="用户角色" prop="roleIds">
            <!-- <el-select v-model="form.roleIds" placeholder="请选择" style="width:60%">
              <el-option
                v-for="item in rolelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>-->
            <el-cascader
              v-model="form.roleIds"
              placeholder="请选择"
              :key="form.value"
              :props="{ value: 'id',label:'name'}"
              :options="rolelist"
              :show-all-levels="false"
              ref="myCascader"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.type === '0'">
          <el-form-item label="所属机构" prop="officeId">
            <el-cascader
              v-model="form.officeId"
              placeholder="请选择"
              :key="form.value"
              :props="{ value: 'id', checkStrictly: true }"
              :options="options"
              :show-all-levels="false"
              ref="myCascader"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.type === '1'">
        <el-col :span="12" >
          <el-form-item :label="form.identityCard?form.identityCard.length==9?'护照':'身份证号':'身份证号'" prop="identityCard">
            <el-input style="width:100%" v-model.trim="form.identityCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.type === '0' && isShow">
        <el-col :span="24">
          <el-form-item label="岗位" prop="postIds">
            <el-select v-model="form.postIds" placeholder="请选择岗位" multiple>
              <el-option
                v-for="item in polesList"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item style="margin: auto; display: block" align="center">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="closeDialog">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import service from '../service'
import interfaceService from '@/api/user'
export default {
  props: {
    visit: {
      type: Boolean,
      required: true
    },
    editFlag: {
      type: Boolean,
      required: true
    },
    polesList: {
      type: Array,
      default: () => []
    },
    rowdata: {
      type: Object,
      default: () => {}
    },
    isShow: ''
  },
  data() {
    var validatePassword1 = (rule, value, callback) => {
      var newpsd = /^(?![0-9a-z]+$)(?![0-9A-Z]+$)(?![0-9\W]+$)(?![a-z\W]+$)(?![a-zA-Z]+$)(?![A-Z\W]+$)[a-zA-Z0-9\W_]+$/
      if (this.editFlag && !value) callback()
      if (value.length > 15 || value.length < 9) {
        callback(new Error('密码长度要求10-16位!'))
      } else if (!newpsd.test(value)) {
        callback(new Error('密码格式要求包含(数字、字母、符号)'))
      } else {
        callback()
      }
    }
    var validatePassword2 = (rule, value, callback) => {
      if (this.editFlag && !this.form.password) callback()
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      options: [],
      rolelist: [],
      huzhao:'',
      form: {
        nickname: '',
        username: '',
        officeName: '',
        officeId: '',
        mobile: '',
        password: '',
        newPassword: '',
        sex: '',
        type: '',
        postIds: [],
        id: '',
        corpId: '',
        identityCard: '',
        roleIds: ''
      },
      rules: {
        identityCard: [
          { required: true, message: '请输入身份证码', trigger: 'blur' },
          {
            pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
            message: '请输入正确的身份证码',
            trigger: 'blur'
          }
        ],
        roleIds: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ],
        officeId: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        nickname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        username: [
          {
            pattern: /^[^\u4e00-\u9fa5]*$/,
            required: true,
            message: '请输入帐号,帐号不能包含中文',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入用户密码',
            trigger: 'blur'
          },
          { validator: validatePassword1, trigger: 'blur' }
        ],
        newPassword: [
          {
            required: true,
            message: '请再次确认密码',
            trigger: 'blur'
          },
          { validator: validatePassword2, trigger: 'blur' }
        ],
        postIds: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^((13\d)|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[0,1,3,5,7,8])|(18[0-9])|(19[8,9]))\d{8}/,
            message: '请输入正确的手机号码',
            trigger: ['blur']
          }
        ],
        sex: [{ message: '请选择性别', trigger: 'change' }]
      }
    }
  },
  watch: {
    visit: {
      handler: function(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (this.editFlag) {
            this.rules.password[0].required = false
            this.rules.newPassword[0].required = false
          } else {
            this.rules.password[0].required = true
            this.rules.newPassword[0].required = true
          }
        }
      },
      immediate: true
    },
    rowdata: {
      handler: function(newVal) {
        for (const k in this.form) {
          this.form[k] = newVal[k] || null
          if (k === 'password') {
            this.form['encrypt'] = this.form[k]
            this.form[k] = ''
          }
        }
        this.form.type =
          JSON.parse(this.$store.state.getUserMsg).datas.type || '1'
      },
      immediate: true
    }
  },
  methods: {
    // 证件类型切换事件
    IDchangetype(val) {
      if (this.form?.identityCard?.length == '9') {
        this.rules.identityCard[1].message = this.rules.identityCard[0].message = '请输入正确的护照'
        this.rules.identityCard[1].pattern = /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/
      } else {
         this.rules.identityCard[1].message = this.rules.identityCard[0].message = '请输入正确的身份证码'
        this.rules.identityCard[1].pattern = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      }
    },
    // 验证帐号
    getuser() {
      const param = {
        username: this.form.username
      }
      service.getuser(param).then(res => {
        if (res && res.data.datas) {
          this.$message({
            type: 'error',
            message: res.data.resp_msg
          })
        }
      })
    },
    // 获取用户角色
    getRoleByType() {
      service.getRoleByType().then(res => {
        if (res && res.status == 200) {
          this.rolelist = res.data.datas
        }
      })
    },
    // 获取组织机构
    getyeartree() {
      // const param ={
      //   officeId:JSON.parse(this.$store.state.getUserMsg).datas.officeId
      // }
      service.getyeartree().then(res => {
        if (res && res.status == 200) {
          this.options = res.data.datas
        }
      })
    },
    restForm() {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.$refs['form'].clearValidate()
      })
    },
    closeDialog() {
      this.$emit('closeDialog', false)
      this.$emit('reflashList')
    },
    onSubmit() {
      // 此模式不能用
      // if (this.form.postIds??'' !== '') {
      // }
      this.form.corpId =
        JSON.parse(this.$store.state.getUserMsg).datas.corpId || ''
      if (this.form.postIds == null) {
        this.form.postIds = []
      }
      const data = this.form
      if (this.form?.officeId) {
        data.officeId = this.form.officeId?.length>=1?this.form.officeId[this.form.officeId.length - 1]:this.form.officeId
      } else {
        data.officeId =
          this.form.officeId ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      data.auditBy = JSON.parse(this.$store.state.getUserMsg).datas.id
      this.$refs.form.validate(valid => {
        if (valid) {
          data.officeName =
            JSON.parse(this.$store.state.getUserMsg).datas.officeName ||
            ''
          if (!this.rowdata.id) {
            // 新增
            this.saveInfoHandle(data)
          } else {
            // 编辑时未修改密码将原加密密码重新赋值
            if (!data.password) {
              data.password = data.encrypt
            }
            delete data.encrypt
            this.editInfoHandle(data)
          }
          this.$emit('reflashList')
        }
      })
    },
    saveInfoHandle(params = {}) {
      service.saveUser(params).then(res => {
        if (res && res.data.resp_code === 0) {
          this.closeDialog()
          this.$message({
            type: 'success',
            message: res.data.resp_msg
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.data.resp_msg
          })
        }
      })
    },
    editInfoHandle(params = {}) {
      service.auditUser(params).then(res => {
        if (res && res.data.resp_code === 0) {
          this.closeDialog()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getusermsg()
          if (this.isShow) {
            this.$parent.getUserPageInfo()
          }
        }
      })
    },
    // 重新刷新个人中心当前账户权限,信息。
    getusermsg() {
      interfaceService.getUsermsg().then(res => {
        if (res && res.status == '200') {
          const data = res.data.datas
          sessionStorage.setItem('getUserMsg', JSON.stringify(res.data))
          this.$store.commit('getUserMsg', JSON.stringify(res.data))
        }
      })
    }
  },
  created() {
    this.IDchangetype()
    this.getyeartree()
    this.getRoleByType()
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-select {
  width: 100%;
  & .el-input {
    width: 100%;
  }
}
</style>
