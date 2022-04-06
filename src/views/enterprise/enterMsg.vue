<template>
  <div class="container">
    <!-- <PublicContent :tabulated="tabulated"></PublicContent> -->

    <div class="rightcontent">
      <div style="margin-bottom: 10px">
        <el-form
          ref="searchform"
          :inline="true"
          :model="searchform"
          style="margin-top: 5px; border-bottom: 1px solid #ccc"
        >
          <el-form-item label="企业查询">
            <el-input v-model="searchform.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
            <el-button type="primary" @click="enterEntrymsg('')"
              >企业信息录入</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="entertabledata" border style="width: 100%">
        <el-table-column prop="corpName" label="企业名称" align="center">
        </el-table-column>
        <el-table-column
          prop="creditCode"
          label="统一社会信用代码"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="legalPerson" label="法定代表人" align="center">
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center">
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="small"
              >查看</el-button
            >
            <el-button size="small" @click="enterEntrymsg(scope.row)"
              >编辑</el-button
            >
            <!-- <el-button size="small">历史信息</el-button> -->
            <el-button type="danger" size="small" @click="deletemsg(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="float: right; margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          background
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <EnterEntry
      :DialogTipShow="DialogTipShow"
      :form="form"
      :ruleForm="ruleForm"
      :yiForm="yiForm"
      @enterEntrymsg="enterEntrymsg"
      :title="title"
      ref="child"
    ></EnterEntry>
    <Checkenter
      :form="form"
      :ruleForm="ruleForm"
      :yiForm="yiForm"
      :checkdialog="checkdialog"
    ></Checkenter>
  </div>
</template>
<script lang="ts">
import service from '../Authentication/api/service'
import PublicContent from '../publicVue/publiccontent.vue'
import EnterEntry from '../publicVue/enterEntry.vue'
import Checkenter from './checkenter.vue'
export default {
  name: 'enterMsg',
  components: {
    PublicContent,
    EnterEntry,
    Checkenter
  },
  data() {
    return {
      DialogTipShow: false,
      checkdialog: false,
      entertabledata: [],
      searchform: {
        name: ''
      },
      form: '',
      ruleForm: '',
      yiForm: '',
      page: '1',
      limit: '5',
      total: 0,
      currentPage: 1,
      tabulated: '',
      title: ''
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page = val
      this.getenterInfo()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getenterInfo()
    },
    enterEntrymsg(row) {
      if (row == '') {
        this.dataform('')
        // this.$refs.child.rest();
        // this.$refs.child["ruleForm"].resetFields();
        // this.$refs.child["yiForm"].resetFields();
        this.title = '企业信息录入'
      } else {
        this.dataform(row)
        this.title = '企业信息修改'
      }
      this.DialogTipShow = !this.DialogTipShow
    },
    getenterInfo() {
      const param = {
        limit: this.limit,
        page: this.page
      }
      service.getenterInfo(param).then((res) => {
        if (res.status == 200) {
          const data = res.data.data
          this.total = res.data.count
          this.entertabledata = data
        }
      })
    },
    handleClick(row) {
      this.dataform(row)
      this.checkdialog = !this.checkdialog
    },
    deletemsg(row) {
      this.$confirm("您确定删除当前角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(() => {
          this.deleteEvent(row);
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      
    },
    deleteEvent(row){
      const param = {
        id: row.id
      }
      service.deleteEnterdata(param).then((res) => {
        if (res.status == 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getenterInfo()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    dataform(row) {
      if (row == '') {
        this.form = {
          address: '',
          areaId: '',
          corpName: '',
          createBy: '',
          createTime: '',
          creditCode: '',
          delFlag: '',
          id: '',
          industryType: '',
          legalPerson: '',
          licenseExpireData: '',
          licenseNo: '',
          mobile: '',
          name: '',
          officeId: '',
          officeName: '',
          registeredCapital: '',
          remarks: '',
          status: '',
          updateBy: '',
          updateTime: '',
          workerNum: '',
          zipCode: ''
        }
        ;(this.ruleForm = {
          corpId: 0,
          corpName: '',
          createBy: '',
          createTime: '',
          delFlag: '',
          id: '',
          licenseExpireBegin: '',
          licenseExpireEnd: '',
          licenseNo: '',
          name: '',
          onlineAnnounceTime: '',
          remarks: '',
          status: '',
          updateBy: '',
          updateTime: ''
        }),
          (this.yiForm = {
            chemicalName: '',
            chemicalType: '',
            corpId: '',
            corpName: '',
            createBy: '',
            createTime: '',
            delFlag: '',
            id: row.id,
            mainFlow: '',
            name: '',
            output: '',
            remarks: '',
            status: '',
            updateBy: '',
            updateTime: ''
          })
      } else {
        const param = {
          id: row.id
        }
        // 基本信息编辑
        service.searchmsg(param).then((res) => {
          if (res.status == 200) {
            const data = res.data.datas
            this.form = data
            // if (data == null) {}
          }
        })
        // 许可备案信息编辑
        service.searchentery(param).then((res) => {
          if (res.status == 200) {
            const data = res.data.datas
            this.ruleForm = data
            if (data == null) {
              this.ruleForm = {
                corpId: 0,
                corpName: row.corpName,
                createBy: row.createBy,
                createTime: '',
                delFlag: row.delFlag,
                id: row.id,
                licenseExpireBegin: '',
                licenseExpireEnd: '',
                licenseNo: row.licenseNo,
                name: '',
                onlineAnnounceTime: '',
                remarks: row.remarks,
                status: row.status,
                updateBy: '',
                updateTime: ''
              }
            }
          }
        })
        // 易制毒
        service.searcadmin(param).then((res) => {
          if (res.status == 200) {
            const data = res.data.datas
            this.yiForm = data
            if (data == null) {
              this.yiForm = {
                chemicalName: '',
                chemicalType: '',
                corpId: '',
                corpName: '',
                createBy: '',
                createTime: '',
                delFlag: '',
                id: row.id,
                mainFlow: '',
                name: '',
                output: '',
                remarks: '',
                status: '',
                updateBy: '',
                updateTime: ''
              }
            }
          }
        })
      }
    }
  },
  created() {
    this.getenterInfo()
  }
}
</script>
<style lang="less" scoped>
.container {
  // display: flex;
  .leftcontent {
    width: 360px;
    height: 100%;
    padding: 5px 5px 5px 5px;
    border: 1px solid #ccc;
    .detailslist {
      width: 100%;
      height: calc(100vh - 155px);
      margin-top: 10px;
      overflow: auto;
      // border: 1px solid;
      li {
        width: 100%;
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid #ccc;
        text-indent: 20px;
        cursor: pointer;
      }
      .active {
        background: #e8e5e5;
      }
    }
  }
  .rightcontent {
    flex: 1;
    border: 1px solid #ccc;
    margin-left: 5px;
    padding: 5px 5px 5px 5px;
    li {
      font-size: 19px;
      width: 100%;
      color: #000;
      p {
        width: 50%;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        float: left;
        border-bottom: 1px solid #ccc;
        text-indent: 10px;
        span {
          display: inline-block;
          width: 100%;
        }
      }
    }
    .rightlist {
      margin-bottom: 10px;
    }
    .basetitle {
      width: 100%;
      height: 40px;
      color: #fff;
      font-size: 20px;
      clear: both;
      line-height: 40px;
      text-indent: 10px;
      background: #3a8ee6;
    }
  }
}
</style>