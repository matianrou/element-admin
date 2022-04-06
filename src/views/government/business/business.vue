<template>
  <div class="contentContainer">
    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="form.startTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-d"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="企业名称" prop="corpName">
        <el-input v-model="form.corpName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="监管机构" prop="officeId">
        <el-cascader
          v-model="form.officeId"
          placeholder="请选择"
          :key="options.value"
          :props="{ value: 'id', checkStrictly: true }"
          :options="options"
          :show-all-levels="false"
          clearable
          ref="myCascader"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="审核类型">
        <el-select v-model="auditStatus" placeholder="请选择" @change="typechange">
          <el-option label="全部" value="0,1,2"></el-option>
          <el-option label="已审核企业" value="1,2"></el-option>
          <el-option label="未审核企业" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-checkbox-group v-model="form.isOwnOffice" @change="isOwnOffice">
          <el-checkbox label="本机构" name="0"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="alllist('0,1,2,3')">全部</el-button> -->
        <!-- <el-button @click="alllist('1,2')">已审核企业</el-button> -->
        <!-- <el-button @click="alllist('0')">未审核企业</el-button> -->
        <el-button type="primary" @click="searchentery(form)">查询</el-button>
        <el-button type="primary" @click="exportlist()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column fixed prop="corpName" label="企业名称" align="center">
        <template slot-scope="scope">
          <span
            @click="chechdetails(scope.row)"
            style="color: blue; cursor: pointer"
          >{{ scope.row.corpName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="officeName" label="监管机构" align="center"></el-table-column>
      <el-table-column prop="legalPerson" label="主要负责人" align="center"></el-table-column>
      <el-table-column prop="address" label="地址" align="center"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="auditStatus" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus == 0">未审核</span>
          <span v-if="scope.row.auditStatus == 1">已审核</span>
          <span v-if="scope.row.auditStatus == 2">审核未通过</span>
          <span v-if="scope.row.auditStatus == 3">企业信息待完善</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="auditlogin(scope.row)"
            :disabled="(scope.row.auditStatus == 1 || scope.row.auditStatus == 3) || loginOfficeid != scope.row.officeId"
          >{{ scope.row.auditStatus == 0 || scope.row.auditStatus == 3 ? '审核' : '已审核' }}</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" @click="writeOff(scope.$index, scope.row)">注销</el-button>
          <el-button size="small" @click="resetPassword(scope.$index, scope.row)">重置企业管理员密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 企业信息补充 -->
    <FirmEdit ref="firm" />
    <Publicdialog :rowdata="rowdata" :entershow="entershow" :isShow="0"  v-if="Publicdialogdialog" />
    <Pagination :total="total" />
    <el-dialog
      title="提示"
      :visible.sync="dialogshow"
      width="25%"
      height="100%"
      @close="dialogfalse"
      :close-on-click-modal="false"
    >
      <div class="copypas">
        当前帐号：{{ restUsername }}
        <i
          class="el-icon-copy-document"
          style="color:#0089ff;cursor:pointer;font-size:10px;margin-left:30px"
          @click="copy(0)"
        >点击复制帐号</i>
      </div>
      <div class="copypas">
        当前密码：{{ restPassword }}
        <i
          class="el-icon-copy-document"
          style="color:#0089ff;cursor:pointer;font-size:10px;margin-left:30px"
          @click="copy(1)"
        >点击复制密码</i>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import service from '@/views/Authentication/api/service'
import Publicdialog from '../current/publicdialog.vue'
import Pagination from '../current/pagination'
import FirmEdit from './firm-edit.vue'
import { exportToBlobXLSX } from '@/utils'

export default {
  components: {
    Publicdialog,
    Pagination,
    FirmEdit
  },
  computed: {
    changestatus: {
      get(val) {
        // this.value = val.tableData.forEach((item, index) => {
        //   if (item.auditStatus === 0) return true
        //   else return true
        // })
      },
      set(val) {
        return (val = !val)
      }
    }
  },
  data() {
    return {
      Publicdialogdialog: false,
      dialogshow: false,
      dialogfalse: false,
      value: true,
      loading: true,
      btnOfficeid: '',
      loginOfficeid: JSON.parse(this.$store.state.getUserMsg).datas.officeId,
      rowdata: '',
      restUsername: '----',
      restPassword: '----',
      tableData: [],
      chemical_type: [
        {
          label: '第一类',
          value: '1'
        },
        {
          label: '第二类',
          value: '2'
        },
        {
          label: '第三类',
          value: '3'
        }
      ],
      options: [],
      limit: 10,
      page: 1,
      total: 0,
      entershow: 0,
      form: {
        corpName: '',
        officeId: '',
        isOwnOffice: '',
        startTime: ''
      },
      Officetype: '1',
      auditStatus: '0,1,2'
    }
  },
  methods: {
    // 导出
    exportlist() {
      // console.log(this,'点击了导出按钮')
      const url =
        this.$URL.baseURL +
        '/api-precursor/corpbasicinfo/exportList'
      const params = {
        auditStatus: this.auditStatus || '',
        corpName: this.form.corpName || '',
        isOwnOffice: this.Officetype || '',
        startTime: this.form?.startTime ? this.form?.startTime[0] : '',
        endTime: this.form?.startTime ? this.form?.startTime[1] : '',
        officeId:
          this.form.officeId[this.form.officeId.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      exportToBlobXLSX(url, params, '生产经营统计报表.xlsx')
    },
    // 账号密码复制功能
    copy(val) {
      let text = '复制失败，请您稍后再试'
      if (val == 0) {
        text = this.restUsername
      } else {
        text = this.restPassword
      }
      let oInput = document.createElement('input')
      oInput.value = text
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      console.log(oInput.value)
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    isOwnOffice(val) {
      if (val) {
        this.Officetype = '0'
      } else {
        this.Officetype = '1'
      }
      this.getRenderlist()
    },
    // 帐号注销
    writeOff(index, row) {
      this.$confirm(`您确定要注销当前帐号吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          service.userswriteOff(row).then(response => {
            if (response.data.resp_code === 0) {
              this.getRenderlist()
              return this.$message.success(response.data.resp_msg)
            } else {
              this.$message.warning(response.data.resp_msg)
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 密码重置
    resetPassword(index, row) {
      const param = {
        corpId: row.id,
        creditCode: row.creditCode,
        officeId: row.officeId
      }
      this.$confirm(`您确定要重置当前用户帐号及密码吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          service.resetAdministrator(param).then(response => {
            if (response.status == 200) {
              this.$message.success('密码重置成功!')
              this.dialogshow = true
              this.restUsername = response.data.datas.username
              this.restPassword = response.data.datas.password
            } else {
              this.$message.warning('重置失败，请稍后尝试!')
            }
          })
        })
        .catch(() => {
          return false
        })
    },
    // 按钮查询企业
    typechange(val) {
      this.auditStatus = val
      this.getRenderlist()
    },
    // 查询当前企业
    searchentery(data) {
      this.btnOfficeid = this.form.officeId[this.form.officeId.length - 1]
      this.getRenderlist()
    },
    // 审核当前注册用户状态
    auditlogin(row) {
      this.$confirm('您确定要审核当前帐号并赋予权限吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.auditStatus = 1
        service.enteraudit(row).then(res => {
          if (res && res.status === 200) {
            this.$message({
              message: '审核成功',
              type: 'success'
            })
            this.getRenderlist()
          }
        })
      })
    },
    // 查看当前企业提交信息
    chechdetails(row) {
      this.entershow = 0
      this.rowdata = row
      this.Publicdialogdialog = !this.Publicdialogdialog
    },
    // 获取列表
    getRenderlist(val) {
      this.loading = true
      const param = {
        limit: this.limit,
        page: val || 1,
        officeId:
          this.form.officeId[this.form.officeId.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId,
        auditStatus: this.auditStatus,
        corpName: this.form.corpName || '',
        isOwnOffice: this.Officetype || '',
        startTime: this.form?.startTime ? this.form?.startTime[0] : '',
        endTime: this.form?.startTime ? this.form?.startTime[1] : '',
      }
      service.getenterInfo(param).then(res => {
        if (res && res.status == 200) {
          const data = res.data.data
          this.total = res.data.count
          this.tableData = data
          this.loading = false
        }
      })
    },
    // 补充企业信息
    handleEdit(idx, cur) {
      this.$refs.firm.init(cur);
    },
    gettreeselect() {
      service.getyeartree().then(res => {
        if (res) {
          this.options = res.data.datas
        }
      })
      // service.gettreeselect().then(res => {
      //   if (res.status == 200) {
      //     const data = res.data.datas
      //     this.options = data
      //   }
      // })
    }
  },
  mounted() {
    this.form.officeId =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
    // 组织机构查询
    this.gettreeselect()
  },
  created() {
    // 获取企业管理列表
    this.getRenderlist()
  }
}
</script>
<style scoped>
.copypas {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
}
</style>
