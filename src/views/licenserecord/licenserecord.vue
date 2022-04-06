<template>
  <div class="contentContainer">
    <el-card>
      <el-table :data="tableDataMapDate" style="width: 100%" border>
        <el-table-column width="50%">
          <template v-slot:default="{ row }">
            <span class="h-note-color" v-if="row.inDate <= 90 && row.inDate">H</span>
            <span class="g-note-color" v-if="row.inDate <= 0 && row.inDate">G</span>
          </template>
        </el-table-column>
        <el-table-column prop="licenseChemicalTypeValue" label="许可备案类型" align="center"></el-table-column>
        <el-table-column prop="licenseNo" label="许可备案证号" align="center">
          <template v-slot:default="{ row }">
            <span
              style="color:blue;cursor: pointer;"
              v-if="row.licenseNo"
              @click="checklicense(row)"
            >{{ row.licenseNo }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="officeName" label="发证机构" align="center"></el-table-column>
        <el-table-column prop="issueTime" label="发证日期" align="center"></el-table-column>
        <el-table-column prop="licenseExpireBegin" label="有效期起始日期" align="center"></el-table-column>
        <el-table-column prop="licenseExpireEnd" label="有效期截止日期" align="center"></el-table-column>
        <el-table-column prop="onlineAnnounceTime" label="网上公布日期" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot:default="{ row }">
            <!-- 2 || 5 且 inDate 小于等于90状态下 才显示；当前日期大于截止日期就全部隐藏
            刚申请的许可证操作处只有变更，距离当前日期还有3个月过期的时候，只显示换证，过期之后，操作处“变更”和”和换证“都不能显示。
            -->
            <el-button
              v-if="(row.licenseStatus === '2' || row.licenseStatus === '5') && row.inDate <= 90 && row.licenseChemicalType==1"
              size="mini"
              @click="renewal(row)"
            >换证</el-button>
            <!-- 审核中 0， 已审核 1， 已打印 2， 已注销 3， 审核失败 4, 颁证完毕 5；
              只有 2 跟 5 状态下显示
            -->
            <el-button v-if="(row.licenseChemicalType==='1')"
              size="mini"
              @click="changeCard(row)"
            >变更</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      width="65%"
      height="100%"
      title="许可备案信息"
      :visible.sync="visit"
      @close="recordModalHandle"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
    <div style="text-align:center;">
        <div class="sizeposition">
          <span>
            经营品种、销售量字体大小调整：
            <b class="sizebtn" @click="FontAize.size++">+</b>
            <b class="sizebtn" @click="FontAize.size--">-</b>
          </span>
          <span>
            主要流向字体大小调整：
            <b class="sizebtn" @click="FontAize.flowsize++">+</b>
            <b class="sizebtn" @click="FontAize.flowsize--">-</b>
          </span>
          <span>
            单位地址字体大小调整：
            <b class="sizebtn" @click="FontAize.dansize++">+</b>
            <b class="sizebtn" @click="FontAize.dansize--">-</b>
          </span>
        </div>
      </div>
      <!-- <addrecord :rowform="rowform" /> -->
      <!-- 许可证 副本 -->
      <printe-ectypal-permit :FontAize="FontAize" :printInfo="printInfo" :disabledDrag="disabledDrag" />
    </el-dialog>

    <el-dialog
      width="30%"
      height="100%"
      title="请选择变更条件"
      :visible.sync="changeEvent"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div class="changeradio">
        <div>
          <el-checkbox border v-model="changevalue.principal" label="单位法定人或者主要负责人改变"></el-checkbox>
          <el-checkbox border v-model="changevalue.units" label="单位名称改变"></el-checkbox>
          <el-checkbox border v-model="changevalue.Permitflow" label="许可品种主要流向改变"></el-checkbox>
          <el-checkbox border v-model="changevalue.variety" label="需要增加许可品种、数量"></el-checkbox>
        </div>
      </div>
      <el-row>
        <el-button type="primary" @click="routerapply">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import service from '../Authentication/api/service'
import Addrecord from './addrecord.vue'
import printeEctypalPermit from '@/views/printed/printeEctypalPermit.vue'
import { dateTransformType } from '@/utils/index'
export default {
  components: {
    Addrecord,
    printeEctypalPermit
  },
  data() {
    return {
      FontAize: {
        size: 22,
        flowsize: 22,
        dansize: 24
      },
      disabledDrag: true,
      visit: false,
      tableData: [],
      limit: 10,
      page: 1,
      rowform: {},
      printInfo: {},
      expirationTime: '',
      btnhuanzheng: '',
      changeEvent: false,
      principal: false,
      units: false,
      Permitflow: false,
      variety: false,
      changevalue: {
        principal: false, // 单位法定人或者主要负责人改变
        units: false, // 单位名称改变
        Permitflow: false, // 许可品种主要流向改变
        variety: false, //需要增加许可品种、数量
        importance: false // 多余变量同样用来控制显隐
      },
      rowid: ''
    }
  },
  computed: {
    tableDataMapDate: {
      get() {
        return this.tableData.map(item => {
          // 需要按照当前日期 - 结束日期
          const startDate = Date.parse(new Date().toLocaleDateString())
          const endDate = Date.parse(item.licenseExpireEnd)
          if (!startDate && !endDate) {
            item['inDate'] = ''
          } else {
            item['inDate'] = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
          }
          return item
        })
      }
    }
  },
  created() {
    this.getTime()
    this.getRenderList()
  },
  methods: {
    // 获取当前时间
    getTime() {
      let myDate = new Date()
      myDate.getFullYear() //获取完整的年份(4位,1970-????)
      myDate.getMonth() //获取当前月份(0-11,0代表1月)
      myDate.getDate()
      this.expirationTime =
        myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDate()
    },
    recordModalHandle() {
      this.visit = false
    },
    // 获取当前列表
    getRenderList() {
      const param = {
        limit: this.limit,
        page: this.page,
        reqType: '4',
        officeId: ''
      }
      service.getRecordManagementList(param).then(res => {
        if (res && res.status == 200) {
          this.tableData = res.data.data
        }
      })
    },
    // 换证
    renewal(row) {
      this.$router.push({
        name: 'applicationRecord',
        params: { status: '3', id: row.id }
      })
      this.$store.commit('getMeunActive', '6')
    },
    // 变更确定
    routerapply() {
      // principal: false, // 单位法定人或者主要负责人改变
      // units: false, // 单位名称改变
      // Permitflow: false, // 许可品种主要流向改变
      // variety: false //需要增加许可品种、数量
      const conditions = [
        this.changevalue.principal, // 单位法定人或者主要负责人改变
        this.changevalue.units, // 单位名称改变
        this.changevalue.Permitflow, // 许可品种主要流向改变
        this.changevalue.variety //需要增加许可品种、数量
      ]
      if (conditions.some(c => c)) {
        this.$router.push({
          name: 'applicationRecord',
          params: { status: '2', id: this.rowid, changevalue: this.changevalue }
        })
        this.$store.commit('applicationStatus', this.changevalue)
        this.$store.commit('getMeunActive', '6')
      } else {
        this.$alert('请您选择您所需的变更条件，支持多选', {
          confirmButtonText: '确定'
        })
      }
    },
    // 变更
    changeCard(row) {
      // if (row.licenseChemicalType == '1') {
      if (row.licenseChemicalType) {
        this.changeEvent = !this.changeEvent
        this.rowid = row.id
        sessionStorage.setItem('rowChangedata', JSON.stringify(row))
      }else{
        this.$alert('温馨提示：只有"生产第一类许可证"和"经营第一类许可证"允许变更', {
          confirmButtonText: '确定'
        })
      }
      // this.$router.push({
      //   name: 'applicationRecord',
      //   params: { status: '2', id: row.id }
      // })
      // this.$store.commit('getMeunActive', '6')
    },
    // 查看许可备案信息
    checklicense(row) {
      // this.rowform = row
      // this.visit = true
      // 选择打印许可证或备案证明后调取数据
      this.visit = !this.visit
      let id = row.id
      service
        .getGmLicensPrintInfo({ id })
        .then(response => {
          // 处理有效期及发证日期为XXXX年XX月XX日格式
          response.data.datas.licenseExpireBegin = dateTransformType(
            response.data.datas.licenseExpireBegin
          )
          response.data.datas.licenseExpireEnd = dateTransformType(
            response.data.datas.licenseExpireEnd
          )
          response.data.datas.issueTime = dateTransformType(
            response.data.datas.issueTime
          )
          this.printInfo = response.data.datas
        })
        .catch(err => {
          console.log('获取打印数据失败：', err)
          this.$message.error('获取数据失败！')
        })
    }
  }
}
</script>
<style scoped>
.h-note-color {
  background-color: #02a7f0;
}
.g-note-color {
  background-color: #d9001b;
}
.g-note-color,
.h-note-color {
  color: white;
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
<style lang="scss">
.changeradio {
  height: 245px;
  .el-checkbox {
    width: 80%;
    display: inline-block;
    color: #606266;
    font-weight: 500;
    cursor: pointer;
    float: left;
    margin-bottom: 20px;
    margin-left: 0 !important;
  }
}
</style>
