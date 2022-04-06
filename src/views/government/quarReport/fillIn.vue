<template>
  <div class="report-add-file">
    <el-dialog
      title="颁证季报查看"
      :close-on-click-modal="false"
      :visible.sync="DialogTip"
      width="60%"
      top="60px"
      height="100%"
      @close="dialogfalse"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="" name="first">
          <div style="height: 600px; overflow-y: auto">
            <h2>非药品类易制毒化学品生产、经营许可证和备案证明颁证季度报表</h2>
            <el-form
              :model="ruleForm"
              ref="ruleForm"
              label-width="170px"
              class="demo-ruleForm"
              :inline="true"
            >
              <el-table :data="tableData" style="width: 100%">
                <el-table-column label="颁证情况" prop="name" align="center" width="150"></el-table-column>
                <el-table-column label="生产" align="center">
                  <el-table-column label="现有颁证数（份）">
                    <template slot-scope="scope">
                      <span>{{scope.row.nowdata}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="上季度颁证数（份）">
                    <template slot-scope="scope">
                      <span>{{scope.row.prevdata}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="颁证企业名单网上公布数（户）">
                    <template slot-scope="scope">
                      <span>{{scope.row.showdata}}</span>
                      <!-- <span v-else>{{scope.row.name}}</span> -->
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="经营" align="center">
                  <el-table-column label="现有颁证数（份）">
                    <template slot-scope="scope">
                      <span>{{scope.row.jingdata}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="上季度颁证数（份）">
                    <template slot-scope="scope">
                      <span>{{scope.row.jingprev}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="颁证企业名单网上公布数（户）">
                    <template slot-scope="scope">
                      <span>{{scope.row.jingshow}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
              <el-table :data="newtableData" style="width: 100%;margin-top:10px">
                <el-table-column prop="name" label="持证情况" align="center"></el-table-column>
                <el-table-column label="生产" align="center">
                  <el-table-column label="同时具有第二类、第三类生产备案企业数量">
                    <template slot-scope="scope">
                      <span>{{scope.row.SConethree}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="同时具有生产许可、生产备案的企业数量">
                    <template slot-scope="scope">
                      <span>{{scope.row.SCxs}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="经营" align="center">
                  <el-table-column label="同时具有第二类、第三类经营备案企业数量">
                    <template slot-scope="scope">
                      <span>{{scope.row.JYonethree}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="同时具有经营许可、经营备案的企业数量">
                    <template slot-scope="scope">
                      <span>{{scope.row.JYxj}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="颁证季报项二" v-if="false" name="second">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="200px"
            class="demo-ruleForm"
            :inline="true"
          >
            <el-table
              ref="multipleTable"
              :data="twotabledata"
              tooltip-effect="dark"
              style="width: 100%"
              @select="selection"
            >
              <!-- <el-table-column type="selection"> </el-table-column> -->
              <el-table-column
                label="所属类别"
                prop="chemicalType"
                :formatter="typeFormat"
                align="center"
              ></el-table-column>
              <el-table-column prop="chemicalName" label="品名" align="center"></el-table-column>
              <el-table-column label="生产" align="center">
                <el-table-column prop="prodLicensingNum" label="现有颁证数（份）" align="center"></el-table-column>
                <el-table-column prop="prodLicensingTotal" label="颁证载明总量（吨）" align="center"></el-table-column>
              </el-table-column>
              <el-table-column label="经营" align="center">
                <el-table-column prop="manageLicensingNum" label="现有颁证数（份）" align="center"></el-table-column>
                <el-table-column prop="manageLicensingTotal" label="颁证载明总量（吨）" align="center"></el-table-column>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script >
// import { defineComponent } from '@vue/composition-api'
import service from '../../Authentication/api/service'
export default {
  props: {
    FillIndialog: Boolean,
    formInline: '',
    rowdata: ''
  },
  data() {
    return {
      twotabledata: [],
      rules: {
        chemicalType: [
          { required: true, message: '请选择所属类别', trigger: 'change' }
        ],
        chemicalName: [
          { required: true, message: '请选择品名', trigger: 'change' }
        ],
        prodLicensingNum: [
          { required: true, message: '请输入生产现有颁证数', trigger: 'blur' }
        ],
        prodLicensingTotal: [
          { required: true, message: '请输入生产颁证载明总量', trigger: 'blur' }
        ],
        manageLicensingNum: [
          { required: true, message: '请输入经营现有颁证数', trigger: 'blur' }
        ],
        manageLicensingTotal: [
          { required: true, message: '请输入经营颁证载明总量', trigger: 'blur' }
        ]
      },
      save: '保存',
      form: {
        chemicalName: '',
        chemicalType: '',
        createBy: '',
        createTime: '',
        delFlag: '',
        department: '',
        id: '',
        manageLicensingNum: '',
        manageLicensingTotal: '',
        name: '',
        officeId: '',
        officeName: '',
        prodLicensingNum: '',
        prodLicensingTotal: '',
        quarter: this.formInline.quarter,
        remarks: '',
        status: '',
        updateBy: '',
        updateTime: '',
        year: this.formInline.year
      },
      ruleForm: {
        id: '',
        department: '',
        mobilePhone: ''
      },
      list: [],
      tableData: [
        {
          name: '许可证',
          nowdata: '',
          prevdata: '',
          showdata: '',
          jingdata: '',
          jingprev: '',
          jingshow: ''
        },
        {
          name: '第二类备案证明',
          nowdata: '',
          prevdata: '',
          showdata: '',
          jingdata: '',
          jingprev: '',
          jingshow: ''
        },
        {
          name: '第三类备案证明',
          nowdata: '',
          prevdata: '',
          showdata: '',
          jingdata: '',
          jingprev: '',
          jingshow: ''
        }
      ],
      newtableData: [
        {
          name: '企业数量（户）',
          SConethree: '',
          SCxs: '',
          JYonethree: '',
          JYxj: '',
          JYshow: ''
        }
      ],
      DialogTip: true,
      activeName: 'first',
      limit: 2,
      page: 1,
      total: 0,
      currentPage: 1
    }
  },
  watch: {
    FillIndialog(val) {
      this.DialogTip = true
    },
    deep: true
  },
  methods: {
    dialogfalse() {
      this.$parent.FillIndialog = false
    },
    reportone() {},
    // 当前项目二查询列表
    async getRenderlist() {
      const param = {
        officeId: JSON.parse(this.$store.state.getUserMsg).datas.officeId,
        year: this.rowdata.year,
        quarter: this.rowdata.quarter
      }
      service.getnewfindLicensingOne(param).then(res => {
        if (res && res.status == 200) {
          this.newtableData[0].SConethree = res.data.datas.prodSecondThirdRecord
          this.newtableData[0].SCxs = res.data.datas.prodLicenseRecord
          this.newtableData[0].JYonethree =
            res.data.datas.manageSecondThirdRecord
          this.newtableData[0].JYxj = res.data.datas.manageLicenseRecord
        }
      })
      param.licenseType = '0'
      await service.getfindLicensingOne(param).then(res => {
        if (res && res.status == 200) {
          this.list.push(res.data.datas)
        }
      })
      param.licenseType = '1'
      await service.getfindLicensingOne(param).then(res => {
        if (res && res.status == 200) {
          this.list.push(res.data.datas)
        }
      })
      this.list[0].forEach((item, index) => {
        this.tableData[index].nowdata = item.prodLicenseNow
        this.tableData[index].prevdata = item.prodLicenseLastQuarter
        this.tableData[index].showdata = item.prodLicensePublishedOnline
      })
      this.list[1].forEach((item, index) => {
        this.tableData[index].jingdata = item.prodLicenseNow
        this.tableData[index].jingprev = item.prodLicenseLastQuarter
        this.tableData[index].jingshow = item.prodLicensePublishedOnline
      })
    },
    submitForm(data) {
      // service.savefindLicensingTwo(this.twotabledata).then(res => {})
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 列表查询
    getlicensingquarterlytwo() {
      const param = {
        page: this.page,
        limit: this.limit,
        year: this.rowdata.year,
        quarter: this.rowdata.quarter,
        officeId: JSON.parse(this.$store.state.getUserMsg).datas.officeId
      }
      service.getlicensingquarterlytwo(param).then(res => {
        const data = res.data
        this.twotabledata = data.datas
        this.total = data.count
      })
    },
    // 删除
    handleDelete(index, row) {
      const param = {
        id: row.id
      }
      service.deletelicensingquarterlytwo(param).then(res => {
        if (res && res.status == 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getlicensingquarterlytwo()
        }
      })
    },
    // 翻页
    handleSizeChange(val) {
      this.page = val
      this.getlicensingquarterlytwo()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getlicensingquarterlytwo()
    },
    // 单选框点击逻辑
    selection(action, row) {
      this.form = row
      this.$refs.multipleTable.clearSelection()
      if (action.length == 0) {
        this.save = '保存'
        this.$refs.form.resetFields()
        this.getlicensingquarterlytwo()
        return
      }
      this.save = '修改'
      this.$refs.multipleTable.toggleRowSelection(row, true)
    },
    typeFormat(row) {
      switch (row.chemicalType) {
        case '1':
          return '第一类'
        case '2':
          return '第二类'
        case '3':
          return '第三类'
      }
    }
  },
  created() {
    this.getlicensingquarterlytwo()
    this.getRenderlist()
  }
}
</script>
<style lang="less" scoped>
h2 {
  text-align: center;
  margin-bottom: 10px;
}
</style>
<style lang="less">
.report-add-file {
  .el-input {
    width: auto;
  }
}
</style>
