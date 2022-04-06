<template>
  <div id="userless">
    <el-dialog
      title="用户注册"
      :visible.sync="DialogTip"
      width="43%"
      @close="closeDialog"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="newform" :rules="rules" :inline="true" :model="newform" label-width="145px">
        <el-form-item label="用户类型" prop="type">
          <el-select v-model.trim="newform.type" placeholder="请选择用户类型">
            <el-option label="监管用户" value="0"></el-option>
            <el-option label="企业用户" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监管机构" prop="officeName">
          <el-row>
            <el-col :span="24">
              <el-cascader
                v-model="newform.officeName"
                placeholder="请选择"
                :key="options.value"
                :props="{ value: 'id', checkStrictly: newform.type == '1'?false:true }"
                :options="options"
                :show-all-levels="false"
                ref="myCascader"
                filterable
              ></el-cascader>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="单位名称" prop="corpName" autocomplete="off" v-if="newform.type == '1'">
          <el-input v-model.trim="newform.corpName" @blur="UnitVerify"></el-input>
        </el-form-item>
        <el-form-item label="帐号" prop="username">
          <el-input v-model.trim="newform.username" @blur="getuser"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.trim="newform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmpass">
          <el-input type="password" v-model.trim="newform.confirmpass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="newform.type == 0?'姓名':'法人姓名'" prop="nickname">
          <el-input v-model.trim="newform.nickname"></el-input>
        </el-form-item>
        <el-form-item :label="newform.type == 0?'手机号码':'法人手机号码'" prop="mobile">
          <el-input v-model.trim="newform.mobile"></el-input>
        </el-form-item>
        <el-form-item v-if="newform.type == '1'" label="证件类型">
          <el-select v-model="IDtype" placeholder="请选择" @change="IDchangetype">
            <el-option label="身份证号" value="0"></el-option>
            <el-option label="护照" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="newform.type == 0?'身份证号':'法人身份证号/护照'"
          v-if="newform.type == '1'"
          prop="identityCard"
        >
          <el-input v-model.trim="newform.identityCard"></el-input>
        </el-form-item>
        <el-form-item label="统一社会代码" v-if="newform.type == '1'" prop="creditCode">
          <el-input v-model.trim="newform.creditCode" @blur="verifyCreditCheck"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model.trim="newform.email"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model.trim="newform.fax"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="validCode">
          <el-row>
            <el-col :span="12">
              <el-input
                :key="validCodewordType"
                ref="password"
                v-model.trim="newform.validCode"
                :type="validCodewordType"
                placeholder="请输入验证码"
                name="postcode"
                tabindex="2"
                auto-complete="off"
              />
            </el-col>
            <el-col :span="12" style="height: 40px;width:45%">
              <img
                :src="code"
                alt="网络或服务器错误"
                :style="{
                  height: '40px',
                  width: '65%',
                  lineHeight: '45px',
                  textAlign: 'center',
                  marginLeft: '45px'
                }"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin: auto; display: block" align="center">
          <el-button type="primary" @click="onSubmit(newform)">保存</el-button>
          <el-button @click="closeDialog()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import service from '../Authentication/api/service'
import { getRandom } from '@/utils'

export default {
  props: {
    DialogTipShow: Boolean,
    baseCodeUrl: {
      type: String,
      required: true
    }
  },
  Component: {
    name: 'AddAccount'
  },
  data() {
    var validatePassword1 = (rule, value, callback) => {
      var newpsd = /^(?![0-9a-z]+$)(?![0-9A-Z]+$)(?![0-9\W]+$)(?![a-z\W]+$)(?![a-zA-Z]+$)(?![A-Z\W]+$)[a-zA-Z0-9\W_]+$/
      if (value.length > 15 || value.length < 9) {
        callback(new Error('密码长度要求10-16位!'))
      } else if (!newpsd.test(value)) {
        callback(new Error('密码格式要求包含(数字、字母、符号)'))
      } else {
        callback()
      }
    }
    var validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.newform.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validCodeword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      IDtype: '',
      DialogTip: true,
      options: [],
      validCodewordType: 'validCode',
      code: this.baseCodeUrl + getRandom(10),
      newform: {
        fax: '',
        nickname: '',
        username: '',
        corpName: '',
        password: '',
        creditCode: '',
        mobile: '',
        officeName: '',
        officeId: '',
        type: '',
        confirmpass: '',
        validCode: '',
        identityCard: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        // [\u-\u4e00\u9fa5-\uffff]+
        username: [
          {
            pattern: /^[^\u4e00-\u9fa5]*$/,
            required: true,
            message: '请输入帐号,帐号不能包含中文',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^((13\d)|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[0,1,3,5,7,8])|(18[0-9])|(19[8,9]))\d{8}/,
            message: '请输入正确的手机号码',
            trigger: ['blur', 'change']
          }
        ],
        officeName: [
          {
            type: 'array',
            required: true,
            message: '请选择机构',
            trigger: 'change'
          }
        ],
        type: [
          { required: true, message: '请选择企业类型', trigger: 'change' }
        ],
        corpName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        creditCode: [
          { required: true, message: '请输入统一社会代码', trigger: 'blur' },
          {
            pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
            message: '请输入正确的统一社会代码',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, validator: validatePassword1, trigger: 'blur' }
        ],
        fax: [
          { max: 11, message: '传真号码最大长度为 11 位', trigger: 'change' }
        ],
        confirmpass: [
          { required: true, validator: validatePassword2, trigger: 'blur' }
        ],
        validCode: [
          { required: true, validator: validCodeword, trigger: 'blur' }
        ],
        identityCard: [
          { required: true, message: '请输入身份证码', trigger: 'blur' },
          {
            // /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/
            pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
            message: '请输入正确的身份证码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确格式的邮箱地址',
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
    deep: true
  },
  methods: {
    // 证件类型切换事件
    IDchangetype(val) {
      if (val == '0') {
        this.rules.identityCard[1].message = this.rules.identityCard[0].message = '请输入正确的身份证码'
        this.rules.identityCard[1].pattern = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      } else {
        this.rules.identityCard[1].message = this.rules.identityCard[0].message = '请输入正确的护照'
        this.rules.identityCard[1].pattern = /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/
      }
    },
    // 验证单位名称
    UnitVerify() {
      if (this.newform?.corpName) {
        const param = {
          corpName: this.newform.corpName
        }
        service.UnitVerify(param).then(res => {
          if (res && res.data.datas) {
            this.$message({
              type: 'error',
              message: '当前名称已存在，请您进行更换'
            })
          }
        })
      }
    },
    // 验证帐号
    getuser() {
      const param = {
        username: this.newform.username
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
    closeDialog() {
      this.$parent.DialogTipShow = false
      this.$refs.newform.clearValidate()
      this.$refs.newform.resetFields()
    },
    onSubmit(data) {
      // 校验当前企业是否有注册
      this.$refs.newform.validate(valid => {
        if (valid) {
          this.getRegister(data)
        }
      })
    },
    getRegister(data) {
      const params = JSON.parse(JSON.stringify(data))
      params.officeId = params.officeName[params.officeName.length - 1]
      params.officeName = this.$refs.myCascader.getCheckedNodes()[0].pathLabels[
        params.officeName.length - 1
      ]
      service.getRegister(params).then(res => {
        if (res && res.status == '200') {
          this.DialogTip = false
          this.$message({
            type: 'success',
            message: res.data.resp_msg
          })
        }
      })
    },
    verifyCreditCheck(event) {
      if (event.target.value) {
        service
          .enterverify({ creditCode: event.target.value })
          .then(response => {
            if (response.data.datas) {
              this.$message.error('统一社会代码已存在!')
            }
          })
      }
    }
  },
  created() {
    service.gettreeselect().then(res => {
      if (res && res.status == 200) {
        const data = res.data.datas
        this.options = data
      }
    })
  }
}
</script>
<style>
#userless .el-input input {
  color: #000 !important;
}
</style>
