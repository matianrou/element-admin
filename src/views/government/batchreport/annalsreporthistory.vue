<template>
  <div class="contentContainer">
    <el-table :data="tableData" border style="width: 100%;height:400px;overflow:auto">
      <el-table-column prop="reptUserName" label="上报人" align="center"></el-table-column>
      <el-table-column prop="reptUserMobile" label="上报人手机号" align="center"></el-table-column>
      <el-table-column prop="createTime" label="上报时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <!-- <el-button size="small" @click="report(scope.row)" v-if="scope.row.status == 1 && ifType == 1">上报</el-button> -->
          <!-- <el-button size="small" @click="repeal(scope.row)" v-if="scope.row.isRevoke == 1">退回</el-button> -->
          <el-button size="small" @click="checkyearreport(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" />
    <el-dialog
      title="年报历史记录查看"
      :visible.sync="checkdialog"
      width="60%"
      height="100%"
      :append-to-body="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="closeCompInfoHandle"
    >
      <el-table :data="tableDataTwo" id="tableData" style="width: 100%">
        <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center">
          <template slot-scope="scope">
            <p class>{{ scope.row.licenseChemicalTypeValue}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chemicalTypeValue" label="品种类型" align="center">
          <template slot-scope="scope">
            <p class>{{ scope.row.chemicalTypeValue}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chemicalTypeValue" label="品种名称" align="center">
          <template slot-scope="scope">
            <p class>{{ scope.row.chemicalName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chemicalName" label="销售量" align="center">
          <template slot-scope="scope">
            <p
              v-for="(item,index) in scope.row.prodChemicalFlowList"
              :key="index"
              class="rowzidingyi"
            >{{ item.areaSales + '(' + item.unit + ')'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">
            <p
              class="rowzidingyi"
              v-for="(item,index) in scope.row.prodChemicalFlowList"
              :key="index"
            >
              <span>{{ item.provinceValue?item.provinceValue+ '/': '' }}{{ item.cityValue?item.cityValue + '/': ''}}{{ item.countryName?item.countryName:'' }}</span>
              <!-- <span>{{ item.cityValue }}</span> -->
              <!-- <span>{{ item.countryName }}</span> -->
            </p>
          </template>
        </el-table-column>
        <el-table-column label="销售金额(万元)" align="center">
          <template slot-scope="scope">
            <p
              class="rowzidingyi"
              v-for="(item,index) in scope.row.prodChemicalFlowList"
              :key="index"
            >{{ item.areaSalesMoney || ''}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import service from '../../Authentication/api/service'
import annalsreport from './annalsreport.vue'
import Pagination from '../current/pagination' // 翻页
export default {
  components: {
    annalsreport,
    Pagination
  },
  props: {},
  data() {
    return {
      page: 1,
      limit: 10,
      tableData: [],
      tableDataTwo: [],
      checkdialog: false,
      total:''
    }
  },
  computed: {},
  watch: {},
  methods: {
    checkyearreport(row) {
      this.checkdialog = true
      const param = {
        reportingYear: row.year,
        corpId: row.corpId
      }
      service.getRenderlistOne(param).then(res => {
        if (res && res.status == 200) {
          this.tableDataTwo = res.data.datas
        }
      })
    },
    closeCompInfoHandle() {
      this.checkdialog = false
      JSON.stringify
    },
    getRenderlist() {
      let _this = this
      const param = {
        page: this.page,
        limit: this.limit
      }
      service.getRenderlistTwo(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.data
          this.total = res.data?.count
        }
      })
    }
  },
  mounted() {},
  created() {
    this.getRenderlist()
  }
}
</script>