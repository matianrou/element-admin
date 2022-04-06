<template>
  <div class="">
    <el-dialog
      title="企业信息查看"
      :visible.sync="DialogTip"
      width="50%"
      height="100%"
      :close-on-click-modal="false"
    >
      <div class="rightlist">
        <ul>
          <p class="basetitle">企业信息</p>
          <li>
            <el-descriptions class="margin-top" :column="3" border>
              <template slot="extra"> </template>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-user"></i>
                  企业名称
                </template>
                {{form.corpName}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-mobile-phone"></i>
                  全部销售收入（万元）
                </template>
                测试数据
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-location-outline"></i>
                  易制毒化学品销售收入（万元）
                </template>
                测试数据
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  其他情况
                </template>
                测试数据
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  法定代表人
                </template>
                {{form.legalPerson}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  企业报送人
                </template>
                测试数据
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  企业负责人
                </template>
                {{form.legalPerson}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <i class="el-icon-office-building"></i>
                  传真
                </template>
                测试数据
              </el-descriptions-item>
            </el-descriptions>
          </li>
        </ul>
      </div>
      <div class="rightlist">
        <p class="basetitle">许可备案信息</p>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="delFlag" label="类型" align="center">
          </el-table-column>
          <el-table-column prop="licenseNo" label="许可备案证号" align="center">
          </el-table-column>
          <el-table-column prop="corpName" label="发证机构" align="center">
          </el-table-column>
          <el-table-column prop="licenseExpireBegin" label="发证日期" align="center">
          </el-table-column>
          <el-table-column prop="licenseExpireBegin" label="有效起始日期" align="center">
          </el-table-column>
          <el-table-column prop="licenseExpireEnd" label="有效截止日期" align="center">
          </el-table-column>
          <el-table-column prop="onlineAnnounceTime" label="网上公布日期" align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="rightlist">
        <p class="basetitle">易制毒化学品生产经营其情况</p>
        <el-table :data="newData" style="width: 100%">
          <el-table-column prop="chemicalType" label="类型" align="center">
          </el-table-column>
          <el-table-column prop="chemicalName" label="品名" align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="销售量（吨、年）"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="mainFlow" label="主要流向" align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script >
import service from "../Authentication/api/service";
export default {
  props: {
    checkdialog: Boolean,
    form: '',
    ruleForm:'',
    yiForm:''
  },
  watch: {
    checkdialog(val){
      this.DialogTip = true;
    },
    form(val){
      this.getdata(val.id)
    },
    ruleForm(val){
      this.tableData = [val];
    },
    yiForm(val){
      this.newData = [val];
    },
    deep:true
  },
  data() {
    return {
      DialogTip: false,
      tableData: [],
      newData: [],
    };
  },
  methods: {
    getdata(id){
      const param = {
        id:id
      }
      service.entercheck(param).then((res)=>{
        if(res.status == 200){
          this.tableData = res.data.datas.licenseInfo,
          this.newData = res.data.datas.prodOper
        }
      })
    }
    // onSubmit(data) {
    //   service.addenterdata(data).then((res)=>{
    //     if (res.status === 200) {
    //       this.$message({
    //       })
    //     }
    //   })
    // },
    // handleClick(tab, event) {
    //   console.log(tab, event)
    // },
  },
};
</script>
<style lang="less" scoped>
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
</style>
