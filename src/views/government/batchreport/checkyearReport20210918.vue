<template>
  <div class="enteradd">
    <el-dialog
      title="企业详情填写222"
      :visible.sync="DialogTip"
      top="50px"
      width="50%"
      height="100%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="填报项目一" name="first">
          <h2>非药品类易制毒化学品经营单位年度报告表（2021年度）</h2>
          <el-form
            :model="formrules"
            ref="formrules"
            :rules="newrules"
            :inline="true"
            label-width="220px"
            class="demo-ruleForm"
          >
            <el-form-item label="全部销售收入" prop="generalIncome">
              <el-input v-model="formrules.generalIncome"></el-input>
            </el-form-item>
            <el-form-item
              label="易制毒化学品销售收入（万元）"
              prop="chemicalIncome"
            >
              <el-input v-model="formrules.chemicalIncome"></el-input>
            </el-form-item>
            <el-form-item label="主要负责人" prop="personInCharge">
              <el-input v-model="formrules.personInCharge"></el-input>
            </el-form-item>
            <el-form-item label="企业上报人" prop="reporter">
              <el-input v-model="formrules.reporter"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobilePhone">
              <el-input v-model="formrules.mobilePhone"></el-input>
            </el-form-item>
            <el-form-item label="传真">
              <el-input v-model="formrules.fax"></el-input>
            </el-form-item>
            <el-col :span="13">
              <el-form-item style="float: right">
                <el-button type="primary" @click="onSubmit(formrules)"
                  >保存</el-button
                >
              </el-form-item>
            </el-col>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="填报项目二" name="second">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="170px"
            class="demo-ruleForm"
            :inline="true"
          >
            <el-col :span="11">
              <el-form-item label="所属类别" prop="chemicalType">
                <el-select v-model="ruleForm.chemicalType" placeholder="请选择">
                  <el-option label="第一类" value="0"></el-option>
                  <el-option label="第二类" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="品名" prop="chemicalName">
                <el-select v-model="ruleForm.chemicalName" placeholder="请选择">
                  <el-option label="第一类" value="0"></el-option>
                  <el-option label="第二类" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="购入量（吨）" prop="purchaseVolume">
                <el-input
                  v-model="ruleForm.purchaseVolume"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="销售量（吨）" prop="sales">
                <el-input
                  v-model="ruleForm.sales"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="库存量（吨）" prop="inventory">
                <el-input
                  v-model="ruleForm.inventory"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
            </el-col>
            <span
              style="
                display: inline-block;
                border-bottom: 1px solid;
                width: 100%;
                font-size: 18px;
                line-height: 50px;
                margin-bottom: 10px;
              "
              >销售流向及数量（吨）</span
            >
            <!-- </el-col> -->
            <el-col :span="11">
              <el-form-item label="本市（地）" prop="thisCity">
                <el-input
                  v-model="ruleForm.thisCity"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="本省（市）" prop="thisProvince">
                <el-input
                  v-model="ruleForm.thisProvince"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="外省（市）" prop="otherProvinces">
                <el-input
                  v-model="ruleForm.otherProvinces"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="出口" prop="export">
                <el-input
                  v-model="ruleForm.export"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item style="display: block; float: right">
                <el-button
                  type="primary"
                  style="margin: auto"
                  @click="submitForm(ruleForm)"
                  >{{ save }}</el-button
                >
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                style="color: red; position: relative; left: 5%; width: 100%"
              >
                注-填报说明：<br />
                <span style="margin-right: 20px"
                  >1：无法填写的，请输入数字0，否则无法保存</span
                >
                2：本省（市）销售数量不包含本市（地）销售量
              </el-form-item>
            </el-col>
          </el-form>
          <el-table
            class="table-style"
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @select="selection"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="所属类别" align="center">
              <template slot-scope="scope">{{
                scope.row.chemicalType == 0 ? '第一类' : '第二类'
              }}</template>
            </el-table-column>
            <el-table-column prop="chemicalName" label="品名" align="center">
              <template slot-scope="scope">{{
                scope.row.chemicalName == 0 ? '第一类' : '第二类'
              }}</template>
            </el-table-column>
            <el-table-column
              prop="purchaseVolume"
              label="购入量（吨）"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column
              prop="sales"
              label="销售量（吨）"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column
              prop="inventory"
              label="库存量（吨）"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column label="销售流向及数量（吨）" align="center">
              <el-table-column
                prop="thisCity"
                label="本市（地）"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                prop="thisProvince"
                label="本省（市）"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                prop="otherProvinces"
                label="外省（市）"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                prop="export"
                label="出口"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <div class="block" style="float: right; margin-top: 20px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              background
              :page-size="2"
              layout="total, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script >
import service from '@/views/Authentication/api/service'
export default {
  props: {
    dialogvisbile: Boolean,
    fullyear: ''
  },
  data() {
    return {
      rowid: '',
      tableData: [],
      formrules: {
        generalIncome: '',
        chemicalIncome: '',
        personInCharge: '',
        reporter: '',
        fax: ''
      },
      ruleForm: {
        chemicalName: '',
        chemicalType: '',
        corpId: '',
        corpName: '',
        createBy: '',
        createTime: '',
        delFlag: '',
        export: '',
        id: '',
        inventory: '',
        name: '',
        otherProvinces: '',
        purchaseVolume: '',
        remarks: '',
        sales: '',
        status: '',
        thisCity: '',
        thisProvince: '',
        updateBy: '',
        updateTime: ''
      },
      newrules: {
        generalIncome: [
          { required: true, message: '请输入相关信息', trigger: 'blur' }
        ],
        chemicalIncome: [
          { required: true, message: '请输入相关信息', trigger: 'blur' }
        ],
        personInCharge: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        reporter: [
          { required: true, message: '请输入上报人', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      },
      rules: {
        chemicalType: [
          { required: true, message: '请选择所属类别', trigger: 'change' }
        ],
        chemicalName: [
          { required: true, message: '请选择品名', trigger: 'change' }
        ],
        purchaseVolume: [
          { required: true, message: '请输入购入量', trigger: 'blur' }
        ],
        sales: [{ required: true, message: '请输入销售量', trigger: 'blur' }],
        inventory: [
          { required: true, message: '请输入库存量', trigger: 'blur' }
        ],
        thisCity: [
          { required: true, message: '请输入本市销售量', trigger: 'blur' }
        ],
        thisProvince: [
          { required: true, message: '请输入本省销售量', trigger: 'blur' }
        ],
        otherProvinces: [
          { required: true, message: '请输入外省销售量', trigger: 'blur' }
        ],
        export: [{ required: true, message: '请输入出口量', trigger: 'blur' }]
      },
      DialogTip: true,
      activeName: 'first',
      limit: 2,
      page: 1,
      total: 0,
      currentPage: 1,
      save: '保存'
    }
  },
  watch: {
    dialogvisbile(val) {
      this.DialogTip = true
    },
    datalist(val) {
      if (val) {
        this.formrules = val
      }
    },
    deep: true
  },
  methods: {
    // 单选框点击逻辑
    selection(action, row) {
      this.ruleForm = row
      this.$refs.multipleTable.clearSelection()
      if (action.length == 0) {
        this.save = '保存'
        this.$refs.ruleForm.resetFields()
        this.annualreporttwo()
        return
      }
      this.save = '修改'
      this.$refs.multipleTable.toggleRowSelection(row, true)
    },
    // 填报一 提交
    onSubmit(data) {
      data.corpId = this.rowid
      data.year = this.fullyear
      this.$refs.formrules.validate((valid) => {
        if (valid) {
          service.enterprisesFillOne(data).then((res) => {
            if (res.status == 200) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.$parent.getInfodata(data)
            }
          })
        }
      })
    },
    // 填报二 提交
    submitForm(data) {
      data.corpId = this.rowid
      data.year = this.fullyear
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          service.addannualreporttwo(data).then((res) => {
            if (res.status == 200) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.annualreporttwo()
              this.$refs.ruleForm.resetFields()
              data.id = data.corpId
              this.$parent.getInfodata(data)
            }
          })
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 列表查询
    annualreporttwo() {
      const param = {
        page: this.page,
        limit: this.limit
      }
      service.annualreporttwo(param).then((res) => {
        const data = res.data
        this.tableData = data.data
        this.total = data.count
      })
    },
    // 删除
    handleDelete(index, row) {
      const param = {
        id: row.id
      }
      service.deleteannualreporttwo(param).then((res) => {
        if (res.status == 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.annualreporttwo()
          this.$parent.getInfodata(data)
        }
      })
    },
    // 翻页
    handleSizeChange(val) {
      this.page = val
      this.annualreporttwo()
    },
    handleCurrentChange(val) {
      this.page = val
      this.annualreporttwo()
    }
  },
  created() {
    this.rowid = localStorage.getItem('rowid')
    this.annualreporttwo()
  }
}
</script>
<style lang="less" scoped>
h2 {
  text-align: center;
  margin-bottom: 10px;
}
.table-style {
  .el-table-column--selection.is-leaf .el-checkbox {
    display: none;
  }
}
.enteradd {
  .el-form-item {
    // margin-bottom: 5px;
  }
}
</style>
