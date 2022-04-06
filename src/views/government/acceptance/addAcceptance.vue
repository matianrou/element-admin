<template>
  <el-dialog
    title="许可备案颁发"
    :visible.sync="dialogshow"
    width="50%"
    height="100%"
    @close="dialogfalse"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      :rules="rules"
      :inline="true"
      ref="form"
      label-width="150px"
      class="demo-form"
    >
      <el-form-item label="单位名称" prop="corpName">
        <el-input v-model="form.corpName" readonly></el-input>
      </el-form-item>
      <el-form-item label="发证机构" prop="officeName">
        <el-input v-model="form.officeName" readonly></el-input>
      </el-form-item>
      <el-form-item label="许可备案类型" prop="licenseChemicalTypeValue">
        <!-- <el-select v-model="form.licenseChemicalType" :disabled="true">
          <el-option label="第一类许可" value="1"></el-option>
          <el-option label="第二类备案" value="2"></el-option>
          <el-option label="第三类备案" value="3"></el-option>
        </el-select>-->
        <el-input v-model="form.licenseChemicalTypeValue" readonly></el-input>
      </el-form-item>
      <el-form-item label="发证日期" prop="issueTime">
        <el-date-picker
          v-model="form.issueTime"
          type="date"
          placeholder="请选择日期时间"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="有效期起始日期" prop="licenseExpireBegin">
        <el-date-picker
          v-model="form.licenseExpireBegin"
          type="date"
          placeholder="请选择日期时间"
          value-format="yyyy-MM-dd"
          @change="startTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="网上公布日期" prop="onlineAnnounceTime">
        <el-date-picker
          v-model="form.onlineAnnounceTime"
          type="date"
          placeholder="请选择日期时间"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="有效期截止日期" prop="licenseExpireEnd">
        <el-date-picker
          v-model.trim="form.licenseExpireEnd"
          type="date"
          placeholder="请选择日期时间"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="许可证编号">
        <el-input style="width: 200px;" v-model.trim="formlicenceNumber" readonly></el-input>&nbsp;-
        <el-form-item prop="licenseNo">
          <el-input style="width: 130px;" maxlength="5" v-model.trim="form.licenseNo"></el-input>
        </el-form-item>
      </el-form-item>
    </el-form>
    <el-card>
      <h2>生产经营许可备案信息</h2>
      <el-table
        :data="pageTableData"
        id="tableData"
        border
        style="width: 100%"
        :header-row-style="tableRowClassName"
        :row-class-name="rowtabledata"
      >
        <el-table-column prop="chemicalName" label="品种名称" align="center">
          <template slot-scope="scope">
            <p class>{{ scope.row.chemicalName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chemicalName" label="载明产量" align="center">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.output" disabled style="width: 120px;"></el-input>
            <!-- <p class>{{ scope.row.output + '(' + scope.row.unit + ')'}}</p> -->
          </template>
        </el-table-column>
        <el-table-column label="主要流向" align="center">
          <template slot-scope="scope">
            <p
              class="rowzidingyi"
              v-for="(item,index) in scope.row.chemicalMainFlowList"
              :key="index"
            >
              <span>{{ item.area || ''}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deletelist(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ul class="tabledata" v-if="false">
        <!-- 表头 -->
        <li class="title">
          <span>品种名称</span>
          <span>载明产量</span>
          <span>主要流向</span>
          <span>操作</span>
        </li>
        <!-- 列表项 -->
        <div class="datalist" v-if="pageTableData.length>0">
          <li v-for="(item, index) in pageTableData" :key="index" v-show="item.delFlag == '0'">
            <div
              class="dataname"
              :style="{
                lineHeight:
                  item.chemicalMainFlowList.length == 0
                    ? '55px'
                    : 55 * item.chemicalMainFlowList.length + 'px'
              }"
            >{{ item.chemicalName || '' }}</div>
            <div
              class="dataname"
              style="display:flex;padding-left:20px"
              :style="{
                height:
                  item.chemicalMainFlowList.length == 0
                    ? '55px'
                    : 55 * item.chemicalMainFlowList.length + 'px',paddingTop:55 * item.chemicalMainFlowList.length/2-30+'px'
              }"
            >
              <el-input
                v-model.trim="item.output"
                disabled
                @input="forceUpdate"
                style="width: 120px; height: 30px; position: relative; top: 10%"
              ></el-input>
              <span style="width:0;margin:5px 0 0 10px">({{item.unit}})</span>
            </div>
            <div class="contentbd">
              <div v-if="item.chemicalMainFlowList.length != 0">
                <span
                  v-for="(clditem, index) in item.chemicalMainFlowList"
                  :key="index"
                  :style="{ height: '55px' }"
                >{{ clditem.area }}</span>
              </div>
            </div>
            <div
              class="dataname"
              :style="{
                lineHeight:
                  item.chemicalMainFlowList.length == 0
                    ? '55px'
                    : 55 * item.chemicalMainFlowList.length + 'px',
                borderLeft: '1px solid #ebeef5'
              }"
            >
              <el-button size="small" type="danger" @click="deletelist(item, index)">删除</el-button>
            </div>
          </li>
        </div>

        <!-- 暂无数据 -->
        <li v-show="pageTableData.length <= 0">
          <div class="tabledata-mask">
            <span>暂无数据</span>
          </div>
        </li>
      </ul>
    </el-card>
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
    rowdata: ''
  },
  watch: {
    rowdata(val) {},
    deep: true
  },
  computed: {},
  data() {
    return {
      dialogshow: true,
      output: '',
      form: {
        corpName: '',
        officeName: '',
        licenseType: '',
        issueTime: '',
        licenseExpireBegin: '',
        onlineAnnounceTime: '',
        licenseExpireEnd: '',
        licenseNo: '',
        corpProdOperList: []
      },
      formlicenceNumber: '',
      pageTableData: [],
      rules: {
        corpName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        officeName: [
          { required: true, message: '请输入发证机构', trigger: 'blur' }
        ],
        licenseType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        issueTime: [
          { required: true, message: '请输入发证日期', trigger: 'blur' }
        ],
        licenseExpireBegin: [
          { required: true, message: '请输入有效期起始日期', trigger: 'blur' }
        ],
        onlineAnnounceTime: [
          { required: true, message: '请输入网上公布日期', trigger: 'blur' }
        ],
        licenseExpireEnd: [
          { required: true, message: '请输入有效期截止日期', trigger: 'blur' }
        ],
        licenseNo: [
          { required: true, message: '请输入五位数编号', trigger: 'blur' },
          {
            pattern: /^\d{5}$/,
            message: '请输入五位数编号'
          }
        ]
      }
    }
  },
  watch: {
    // 'this.form.licenseExpireBegin': {
    //   handler() {
    //     if (this.form.licenseExpireBegin != '') {
    //       this.form.licenseExpireEnd =
    //         this.form.licenseExpireEnd + 1000 * 60 * 60 * 24 * 365 * 3
    //     }
    //   }
    // }
  },
  methods: {
    rowtabledata(row, index) {
      if (row.row.delFlag == 1) {
        return 'hidden-row'
      }
      return ''
    },
    // 监听起始日期时间变化
    startTime() {
      if (this.form.licenseExpireBegin != '') {
        this.form.licenseExpireEnd =
          Number(this.form.licenseExpireBegin.substring(0, 4)) +
          3 +
          this.form.licenseExpireBegin.substring(
            4,
            this.form.licenseExpireBegin.length
          )
        var sdtime3 = new Date().setDate(new Date().getDate() - 1) //1天
        this.form.licenseExpireEnd = this.addDate(this.form.licenseExpireEnd, 1)
      }
    },
    // 时间减一天
    addDate(date, days) {
      var d = new Date(date)
      d.setDate(d.getDate() - days)
      var m = d.getMonth() + 1
      return d.getFullYear() + '-' + m + '-' + d.getDate()
    },
    // 关闭弹框 并刷新父级列表页
    dialogfalse() {
      this.$parent.addputdialog = false
      this.$parent.getRenderlist()
    },
    // 表单提交
    submit(data) {
      this.form.corpProdOperList = this.pageTableData
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogfalse()
          this.form.licenseNo = this.formlicenceNumber + this.form.licenseNo
          service.savelanguage(this.form).then(res => {
            if (res && res.status == 200) {
              this.$message({
                message: res.data.resp_msg,
                type: 'success'
              })
            }
          })
        }
      })
    },

    // 获取当前企业载明产量接口
    getrenderlist() {
      const param = {
        limit: 100000000,
        page: 1,
        licenseId: this.rowdata.id,
        corpId: this.rowdata.corpId
      }
      service.entersearch(param).then(res => {
        if (res && res.status === 200) {
          const data = res.data.data
          this.pageTableData = data
        }
      })
    },
    // 重置ipt输入规则
    forceUpdate(row, index) {
      this.$forceUpdate()
    },
    // 删除
    deletelist(item, index) {
      item.delFlag = '1'
      for (const k of item.chemicalMainFlowList) {
        k.delFlag = '1'
      }
    },
    // render 事件
    tableRowClassName({ row, rowIndex }) {
      return 'background:#ccc;color:#555;height: 40px;'
    },
    restfrom() {
      this.form = Object.assign({}, this.rowdata)
    },
    // 获取许可备案编号 后五位
    getLicenseNo() {
      if (this.rowdata.licenseNo) {
        let licenseNo = this.rowdata.licenseNo
        this.form.licenseNo = licenseNo.substring(
          licenseNo.length - 5,
          licenseNo.length
        )
        this.formlicenceNumber = licenseNo.slice(0, licenseNo.length - 5)
      } else {
        const param = {
          licenseType: this.form.licenseType,
          licenseChemicalType: this.form.licenseChemicalType
        }
        service.getLicenseNo(param).then(res => {
          if (res && res.status === 200) {
            const data = res.data.datas
            this.form.licenseNo = data.substring(data.length - 5, data.length)
            this.formlicenceNumber = data.slice(0, data.length - 5)
          }
        })
      }
    },
    // 获取许可证编号前8位
    licenceNumber() {
      const param = {
        licenseType: this.form.licenseType,
        licenseChemicalType: this.form.licenseChemicalType
      }
      service.licenceNumber(param).then(res => {
        if (res && res.status === 200) {
          const data = res.data.datas
          this.formlicenceNumber = data
        }
      })
    }
  },
  mounted() {
    this.restfrom()
    // this.licenceNumber()
    this.getLicenseNo()
  },
  created() {
    this.getrenderlist()
  }
}
</script>
<style lang="scss" scoped>
.tabledata {
  width: 100%;
  border: 1px solid #ebeef5;
  .title {
    display: flex;
    span {
      display: inline-block;
      width: 100%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border: 1px solid #ebeef5;
      background: #fafafa;
    }
  }
  .dataname {
    border-right: 1px solid #ebeef5;
    height: 100%;
    width: 100%;
  }
  .contentbd {
    width: 100%;
    span {
      border-bottom: 1px solid #ebeef5;
    }
  }
  .datalist {
    height: 190px;
    overflow: scroll;
  }
  li {
    width: 100%;
    text-align: center;
    line-height: 40px;
    display: flex;
    border-bottom: 1px solid #ebeef5;
    align-items: center;
    div {
      display: inline-block;
      width: 100%;
      text-align: center;
      // line-height: 40px;
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        // border-right: 1px solid #ebeef5;
        border-top: none;
      }
    }
  }
}
</style>
<style>
#tableData {
  border: 1px solid #ebeef5;
}
#tableData .cell {
  /* height: 41px; */
  line-height: 40px;
  padding: 0 !important;
}

.el-table .hidden-row {
  display: none;
}
#tableData .cell {
  padding: 0 !important;
}
#tableData .el-table__cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-right: 1px solid #ebeef5 !important;
  padding: 0;
}
.rowzidingyi {
  width: 100%;
  height: 70px !important;
  border-bottom: 1px solid #ebeef5;
  padding: 18px 0 0 0;
}
</style>