<template>
  <div class="contentContainer">
    <el-card>
      <div style="display:flex">
        <div class="after_change_lt" v-if="this.$store.state.applicationStatus.units || this.$store.state.applicationStatus.principal">变更前</div>
        <div style="width:100%">
          <el-button type="primary" @click="checkCompInfoHandle" v-if="!this.$store.state.applicationStatus.units && !this.$store.state.applicationStatus.principal">企业信息完善</el-button>
          <el-descriptions direction="vertical" style="margin-top: 10px;" border>
            <el-descriptions-item label="企业名称">
              {{ form.corpName || '' }}
              <el-tag type="success" style="margin-left: 10px;" v-if="form.auditStatus == '1'">审核通过</el-tag>
              <el-tag
                type="danger"
                style="margin-left: 10px;"
                v-else-if="form.auditStatus == '0'"
              >未审核</el-tag>
              <el-tag
                type="danger"
                style="margin-left: 10px;"
                v-else-if="form.auditStatus == '2'"
              >审核未通过</el-tag>
              <el-tag type="danger" style="margin-left: 10px;" v-else-if="form.auditStatus == '3'">企业信息待完善</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="社会统一信用代码">
              {{
              form.creditCode
              }}
            </el-descriptions-item>
            <el-descriptions-item label="经济类型">
              {{
              dicTranslate(economicTypeList, form.economicType, 1)
              }}
            </el-descriptions-item>
            <el-descriptions-item label="主要负责人">{{ form.legalPerson }}</el-descriptions-item>
            <el-descriptions-item label="地址">
              {{
              form.address
              }}
            </el-descriptions-item>
            <el-descriptions-item label="成立日期">{{ form.establishTime }}</el-descriptions-item>
            <el-descriptions-item label="生产/经营类型">{{ dicTranslate(corpTypeList, form.corpType, 1) }}</el-descriptions-item>
            <el-descriptions-item label="从业人数">{{ form.workerNum }}</el-descriptions-item>
            <el-descriptions-item label="技术、销售管理人员人数">{{ form.management }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ form.mobile }}</el-descriptions-item>
            <el-descriptions-item label="监管机构">{{ form.officeName }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="企业信息完善"
      :visible.sync="checkdialog"
      width="60%"
      height="100%"
      :append-to-body="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="closeCompInfoHandle"
    >
      <enter-entry :form="form" ref="child" @close-handle="closeCompInfoHandle"></enter-entry>
    </el-dialog>
  </div>
</template>
<script>
import service from '../Authentication/api/service'
import EnterEntry from '../publicVue/enterEntry.vue'

export default {
  name: 'enterMsg',
  components: {
    EnterEntry
  },
  props: {
    units: '',
    principal: ''
  },
  watch: {
    'this.$store.state.applicationStatus.principal'(val) {
      // this.corpName = JSON.parse(val).datas.nickname
    },
    deep: true
  },
  data() {
    return {
      economicTypeList: [],
      corpTypeList: [],
      checkdialog: false,
      form: {
        establishTime: '', // 成立时间
        address: '', // 地址
        workerNum: '', // 从业人数
        corpName: '', // 企业名称
        management: '', // 技术、销售管理人员人数
        creditCode: '', // 社会统一信用代码
        legalPerson: '', // 主要负责人
        mobile: '', // 电话
        officeId: '',
        officeName: '', // 审核单位
        economicType: '', // 经济类型
        corpType: '' // 生产/经营类型
      }
    }
  },
  created() {
    this.getenterInfo()
    service.getEconomic_type().then(res => {
      if (res && res.status == 200) {
        const data = res.data.datas
        this.economicTypeList = data
      }
    })
    service.getcorp_type('corp_type').then(res => {
      if (res && res.status == 200) {
        const data = res.data.datas
        this.corpTypeList = data
      }
    })
  },
  methods: {
    checkCompInfoHandle() {
      this.checkdialog = true
    },
    closeCompInfoHandle() {
      this.checkdialog = false
      this.getenterInfo()
    },
    getenterInfo() {
      const param = {
        id:
          JSON.parse(this.$store.state.getUserMsg).datas.corpId ||
          JSON.parse(this.$store.state.getUserMsg).datas.id
      }
      service.searchmsg(param).then(res => {
        if (res && res.status == 200) {
          this.form = JSON.parse(JSON.stringify(res.data.datas?.basicInfo))
          
          sessionStorage.setItem('areaId', res.data.datas?.basicInfo.areaId)
        }
      })
    },
    dicTranslate(list = [], type = '', flag) {
      let item
      if (flag === 1) {
        item = list.find(item => item.value === type)
      } else {
        item = list.find(item => item.id.toString() === type)
      }
      if (!item) {
        return ''
      } else {
        return item.label
      }
    },
    assembleData() {
      const user = JSON.parse(this.$store.state.getUserMsg).datas.username
      return {
        createBy: user,
        updateBy: user,
        corpName: this.form.corpName || '',
        corpId: this.form.id,
        corpChargePerson: this.form.legalPerson, // 主要负责人
        corpAddress: this.form.address,
        licenseNo: this.form.licenseNo,
        licenseStatus: '0', // 初次申请状态
        officeName: this.form.officeName,
        officeId: this.form.officeId,
        creditCode: this.form.creditCode
      }
    }
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
<style>
.after_change_lt {
  width: 4%;
  text-align: center;
  writing-mode: vertical-lr;
  background: #536ff7;
  padding-left: 12px;
  font-size: 30px;
  letter-spacing: 16px;
  color: #fff;
  float: left;
  margin-right: 15px;
}
</style>