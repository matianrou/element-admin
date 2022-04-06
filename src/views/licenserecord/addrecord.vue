<template>
  <div>
    <el-descriptions
      :title="licenseTypeValue"
      :column="1"
      :labelStyle="{ width: '20%' }"
      border
    >
      <el-descriptions-item label="企业名称">{{
        form.corpName
      }}</el-descriptions-item>
      <el-descriptions-item label="许可备案类型">{{
        form.licenseChemicalTypeValue
      }}</el-descriptions-item>
      <el-descriptions-item label="许可备案证号">{{
        form.licenseNo
      }}</el-descriptions-item>
      <el-descriptions-item label="发证机构">{{
        form.officeName
      }}</el-descriptions-item>
      <el-descriptions-item label="发证日期">{{
        form.issueTime
      }}</el-descriptions-item>
      <el-descriptions-item label="有效起始日期">{{
        form.licenseExpireBegin
      }}</el-descriptions-item>
      <el-descriptions-item label="有效截止日期">{{
        form.licenseExpireEnd
      }}</el-descriptions-item>
      <el-descriptions-item label="网上公布发布日期">{{
        form.onlineAnnounceTime
      }}</el-descriptions-item>
    </el-descriptions>
    <h3 style="margin-top: 20px; margin-bottom: 10px">
      载明生产经营化学品信息
    </h3>
    <ul class="tabledata">
      <!-- 表头 -->
      <li class="title">
        <span>品种名称</span>
        <span>载明产量</span>
        <span>主要流向</span>
        <span>销售数量</span>
      </li>
      <!-- 列表项 -->
      <li v-for="(item, index) in tableData" :key="index">
        <div
          class="dataname"
          :style="{
            lineHeight:
              item.chemicalMainFlowList.length != 0
                ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                : 40 + 'px'
          }"
        >
          {{ item.chemicalName || '' }}
        </div>
        <div
          class="dataname"
          :style="{
            lineHeight:
              item.chemicalMainFlowList.length != 0
                ? 40 * Number(item.chemicalMainFlowList.length) + 'px'
                : 40 + 'px'
          }"
        >
          {{ item.output + '(' + item.unit +')' || '' }}
        </div>
        <div class="contentbd">
          <div v-if="item.chemicalMainFlowList.length != 0">
            <span
              v-for="(clditem, index) in item.chemicalMainFlowList"
              :key="index"
              class="contentbd-text"
            >
              {{ clditem.area }}
            </span>
          </div>
          <div v-else style="height:40px">
            <span></span>
          </div>
        </div>
        <div class="contentbd">
          <div v-if="item.chemicalMainFlowList.length != 0">
            <span
              v-for="(clditem, index) in item.chemicalMainFlowList"
              :key="index"
              class="contentbd-text"
            >
              {{ clditem.areaSales + '(' + item.unit +')'}}
            </span>
          </div>
          <div v-else style="height:40px">
            <span></span>
          </div>
        </div>
      </li>
      <!-- 暂无数据 -->
      <li v-show="tableData.length <= 0">
        <div class="tabledata-mask">
          <span>暂无数据</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import service from '../Authentication/api/service'

export default {
  props: {
    rowform: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      licenseTypeValue:'非药品类易制毒化学品经营许可证信息',
      form: {
        id: '',
        licenseExpireBegin: '',
        licenseExpireEnd: '',
        licenseNo: '',
        licenseType: '',
        name: '',
        corpName:'',
        officeName: '',
        onlineAnnounceTime: ''
      },
      tableData: []
    }
  },
  mounted() {
    this.initForm()
    this.getInfoList()
  },
  methods: {
    getInfoList() {
      service.changeProductionInfo({ id: this.rowform.id }).then(res => {
        if (res && res.status == 200) this.tableData = res.data.datas.corpProdOperList
      })
    },
    initForm() {
      this.form = this.rowform
      this.form.name = JSON.parse(this.$store.state.getUserMsg).datas.nickname
      this.licenseTypeValue = '非药品类易制毒化学品'+this.form.licenseTypeValue+'许可证信息'
    }
  }
}
</script>
<style lang="scss" scoped>
.tabledata {
  width: 100%;
  border: 1px solid #ebeef5;
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
      line-height: 40px;
      float: left;
      .contentbd-text {
        display: inline-block;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-right: 1px solid #ebeef5;
        border-top: none;
      }
    }
  }
}
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
</style>
