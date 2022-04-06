<template>
  <div class="contentContainer">
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="企业名称" prop="chemicalType">
        <el-input v-model="form.corpName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="选择时间">
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
      <el-form-item label="发证机构" prop="officeId">
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
      <br />
      <el-form-item>
        <el-checkbox-group v-model="form.isOwnOffice" @change="isOwnOffice">
          <el-checkbox label="本机构" name="0"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-button @click="searchStatus('')">全部</el-button>
      <el-button @click="searchStatus(0)">已受理</el-button>
      <el-button @click="searchStatus(1)">已审批</el-button>
      <el-button @click="searchStatus(2)">已打印</el-button>
      <el-button @click="searchStatus(3)">已注销</el-button>
      <el-form-item>
        <el-button type="primary" @click="searchStatus()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="corpName" label="企业名称" align="center">
        <template slot-scope="scope">
          <span
            @click="chechdetails(scope.row)"
            style="color: blue; cursor: pointer"
          >{{ scope.row.corpName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center"></el-table-column>
      <el-table-column prop="officeName" label="发证机构" align="center"></el-table-column>
      <el-table-column prop="regulatorName" label="监管机构" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请日期" align="center"></el-table-column>
      <el-table-column prop="licenseStatus" label="许可证状态" :formatter="typeStatus" align="center">
        <!-- <template slot-scope="scope">
          <span >
            {{ scope.row.licenseStatus == 0 ? '生产' : '经营' }}
          </span>
        </template>-->
      </el-table-column>
      <el-table-column prop="logoffReason" label="注销原因" align="center"></el-table-column>
      <!-- <el-table-column prop="address" label="审批状态" align="center">
      </el-table-column>-->
      <el-table-column prop="address" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="checkdialog(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Publicdialog :rowdata="rowdata" :isShow="1" v-if="Publicdialogdialog" />
    <Pagination :total="total" />
    <el-dialog
      width="50%"
      height="100%"
      title="许可备案信息"
      :visible.sync="visit"
      @close="recordModalHandle"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <Addrecord :rowform="rowform" v-if="visit" />
    </el-dialog>
    <el-dialog
      title="企业审批情况"
      :visible.sync="dialogshow"
      width="40%"
      height="80%"
      @close="closeRovalHandle"
      :close-on-click-modal="false"
    >
      <Approvalnode ref="appRoval" v-if="dialogshow" :businessKey="businessKey" />
    </el-dialog>
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
import Publicdialog from '../current/publicdialog.vue'
import Pagination from '../current/pagination'
import Addrecord from '../../licenserecord/addrecord.vue'
import Approvalnode from '../../government/approval/approvalNode.vue'
export default {
  components: {
    Publicdialog,
    Pagination,
    Addrecord,
    Approvalnode
  },
  data() {
    return {
      form: {
        corpName: '',
        startTime: '',
        endTime: '',
        time: '',
        isOwnOffice: '',
        officeId: ''
      },
      visit: false,
      dialogshow: false,
      Publicdialogdialog: false,
      tableData: [],
      chemical_type: [],
      limit: 10,
      page: 1,
      total: 0,
      licenseStatus: '',
      rowform: '',
      businessKey: '',
      Officetype: '1',
      loading: true,
      options: []
    }
  },
  methods: {
    isOwnOffice(val) {
      if (val) {
        this.Officetype = '0'
      } else {
        this.Officetype = '1'
      }
      this.getRenderlist()
    },
    chemicalSelect() {
      service.findByChemicalType(this.form.chemicalType).then(res => {
        if (res && res.status == 200) {
          this.corp_type = res.data.datas
        }
      })
    },
    // 查看当前企业提交信息
    chechdetails(row) {
      this.rowdata = row
      this.Publicdialogdialog = !this.Publicdialogdialog
    },
    getRenderlist(val) {
      this.loading = true
      const param = {
        limit: this.limit,
        page: val || this.page,
        licenseStatus: this.licenseStatus || '',
        startTime: this.form?.startTime ? this.form?.startTime[0] : '',
        endTime: this.form?.startTime ? this.form?.startTime[1] : '',
        corpName: this.form.corpName || '',
        reqType: '3',
        isOwnOffice: this.Officetype,
        officeId:
          this.form.officeId[this.form.officeId.length - 1] ||
          JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      service.getrecord(param).then(res => {
        if (res && res.status == 200) {
          const data = res.data.data
          this.total = res.data.count
          this.tableData = data
          this.loading = false
        }
      })
    },
    getchemical_type() {
      service.getchemical_type().then(res => {
        if (res && res.status == 200) {
          this.chemical_type = res.data.datas
        }
      })
    },
    // 条件查询
    searchStatus(val) {
      this.form.startTime
      this.licenseStatus = val || ''
      this.getRenderlist()
    },
    // 列表许可证状态
    typeStatus(row) {
      switch (row.licenseStatus) {
        case '0':
          return '审批中'
        case '1':
          return '审批完毕'
        case '2':
          return '已打印'
        case '3':
          return '已注销'
        case '4':
          return '审核失败'
        case '5':
          return '颁发完毕'
        default:
          return '暂无数据'
      }
    },
    checkdialog(row) {
      // 许可证状态(0表示审核中，1审批完毕，2已打印，3已注销，4审核失败，5颁发完毕
      // const options = ['0','1','2','3','4','5']
      // 声明的这个变量最好不要注释，因为你不知道什么时候需求就变了 至12月1号此处需求变动 9 次了
      const options = []
      if (options.includes(row.licenseStatus)) {
        this.businessKey = row.businessKey
        this.dialogshow = !this.dialogshow
      } else {
        this.rowform = row
        this.visit = !this.visit
      }
    },
    recordModalHandle() {
      this.visit = false
    },
    closeRovalHandle() {
      this.dialogshow = false
    },
    gettreeselect() {
      service.getyeartree().then(res => {
        if (res && res.status == 200) {
          const data = res.data.datas
          this.options = data
        }
      })
    }
  },
  mounted() {},
  created() {
    this.form.officeId =
      JSON.parse(this.$store.state.getUserMsg).datas.officeId || ''
    this.getchemical_type()
    this.getRenderlist()
    this.gettreeselect()
  }
}
</script>
<style>
.el-date-range-picker__editors-wrap span:nth-child(2) {
  display: none;
}
</style>