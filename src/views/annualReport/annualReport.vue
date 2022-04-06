<template>
  <div class="container">
    <PublicContent :list="list" ref="child"></PublicContent>
    <div class="rightcontent">
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="统计年度">
            <div class="block">
              <el-date-picker
                v-model="formInline.year"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
            <el-button type="primary">导出Excel</el-button>
            <el-button type="primary" @click="fill">填写</el-button>
            <el-button type="primary" @click="report">上报</el-button>
            <!-- <el-button type="primary" @click="fillstate">填报状态</el-button> -->
            <el-button type="primary" @click="summary"
              >所在地级市安监局已报年报汇总表</el-button
            >
            <!-- <el-button type="primary" @click="batchreport">批量上报</el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <div class="entertitle">
        <h2>非药品类易制毒化学品经营单位年度报告表（{{ fullyear }}年度）</h2>
        <!-- <h2></h2> -->
      </div>
      <div>
        <ul>
          <el-descriptions class="margin-top" :column="3" border>
            <template slot="extra"> </template>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                企业名称
              </template>
              {{ enterlist.corpName }}
            </el-descriptions-item>
            <!-- <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                全部销售收入（万元）
              </template>
              31232
            </el-descriptions-item> -->
            <!-- <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-outline"></i>
                易制毒化学品销售收入（万元）
              </template>
              2134123
            </el-descriptions-item> -->
            <!-- <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                其他情况
              </template>
              测试视频
            </el-descriptions-item> -->
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                企业负责人
              </template>
              {{ enterlist.legalPerson }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                企业报送人
              </template>
              {{ enterlist.legalPerson }}
            </el-descriptions-item>
            <!-- <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                企业负责人
              </template>
              1300000000000
            </el-descriptions-item> -->
            <!-- <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                传真
              </template>
              测试视频
            </el-descriptions-item> -->
          </el-descriptions>
          <!-- <li class="otherdata">企业名称：测试数据</li>
              <li class="otherdata">全部销售收入（万元）：213</li>
              <li class="otherdata">易制毒化学品销售收入（万元）：324</li> -->
        </ul>
      </div>
      <div>
        <el-table
          class="table-style"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
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
          </el-table-column>
        </el-table>
      </div>
    </div>
    <Fillcontent
      :dialogvisbile="dialogvisbile"
      :fullyear="fullyear"
      :formrules="formrules"
      :id="rowid"
      @closedialog="closedialog"
    />
    <!-- <Fillstate
      :fillstatedialog="fillstatedialog"
      @closedialog="closefulldialog"
    /> -->
    <Filllist :fillNewialog="fillNewialog" @closedialog="closefulldialog" />
  </div>
</template>
<script lang="ts">
import PublicContent from '../publicVue/publiccontent.vue'
// import Fillcontent from '../government/batchreport/fill.vue'
// import Fillstate from './fillstate.vue'
import Filllist from './filllist.vue'
import service from '../Authentication/api/service'
export default {
  name: 'AnnualReport',
  components: {
    PublicContent,
    // Fillcontent,
    // Fillstate,
    Filllist
  },
  data() {
    return {
      list: '',
      Fillstatedialog: false,
      dialogvisbile: false,
      fillNewialog: false,
      formInline: {
        year: '',
        id: ''
      },
      rowid: '',
      fullyear: '',
      formrules: '',
      tableData: [],
      newData: [
        {
          type: '第三类',
          name: '测试数据',
          address: '300',
          xiang: '测试省'
        },
        {
          type: '第三类',
          name: '测试数据',
          address: '300',
          xiang: '测试省'
        },
        {
          type: '第三类',
          name: '测试数据',
          address: '300',
          xiang: '测试省'
        }
      ],
      enterlist: '',
      size: ''
    }
  },
  methods: {
    onSubmit() {},
    // batchreport() {},
    summary() {
      this.fillNewialog = !this.fillNewialog
    },
    fill() {
      this.dialogvisbile = !this.dialogvisbile
    },
    report() {},
    // fillstate() {
    //   this.Fillstatedialog = !this.Fillstatedialog
    // },
    closedialog() {
      this.dialogvisbile = false
    },
    closefulldialog() {},
    getTimes() {
      let myDate = new Date()
      this.fullyear = myDate.getFullYear().toString() // 获取当前年
      this.formInline.year = myDate.getFullYear().toString()
    },
    getInfodata(item) {
      const param = {
        id: item.id,
        year: this.formInline.year
      }

      service.getyearenter(param).then((res) => {
        if (res.status == 200) {
          if (res && res.data.datas.reportOne) {
            this.formrules = res.data.datas.reportOne
          } else {
            this.formrules = {
              chemicalIncome: '',
              corpId: '',
              corpName: '',
              createBy: '',
              createTime: '',
              delFlag: '',
              fax: '',
              generalIncome: '',
              id: '',
              mobilePhone: '',
              name: '',
              otherSituations: '',
              personInCharge: '',
              remarks: '',
              reporter: '',
              status: '',
              updateBy: '',
              updateTime: '',
              year: ''
            }
          }

          this.enterlist = res.data.datas.basicInfo
          this.tableData = res.data.datas.reportTwo
        }
      })
    },
    getInfoRender() {
      const param = {
        limit: 100000,
        page: 1
      }
      // getArea
      service.getenterInfo(param).then((res) => {
        this.list = res.data.data
      })
    }
  },
  created() {
    this.getTimes()
    this.getInfoRender()
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
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
    .entertitle {
      width: 100%;
      h2 {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
    }
    .otherdata {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-indent: 10px;
      border: 1px solid #ebeef5;
    }
  }
}
</style>
