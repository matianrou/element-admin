<!-- 许可证 正本 -->
<template>
  <div
    :class="
      printInfo.licenseType === '0'
        ? 'print-container-a3 licenseType0'
        : 'print-container-a3 licenseType1'
    "
  >
    <div class="print-qrcode-box" v-drag>
      <img :src="`data:image/jpg;base64,${printInfo.qrCode}`" class="print-qrcode-img" alt="二维码" />
    </div>
    <!-- 统一社会信用代码 -->
    <div class="print-creditcode-box" v-drag>
      <div>
        <span>{{ printInfo.creditCode || '空' }}</span>
      </div>
    </div>
    <div class="print-left-form" v-drag>
      <ul>
        <li class="print-left-form-item" style="height: 2.06cm;">
          编号号号：&nbsp;
          <span>{{ printInfo.licenseNo || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 2.06cm;">
          单位名称：&nbsp;
          <span>{{ printInfo.corpName || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 2.02cm;">
          经济类型：&nbsp;
          <span>{{ economicTypeLabel || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 2.08cm;">
          主负责人：&nbsp;&nbsp;&nbsp;
          <span>{{ printInfo.corpChargePerson || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 2.06cm;position: relative;">
          单位地址：&nbsp;
          <span
            :style="{fontSize:FontAize.dansize + 'px'}"
          >{{ printInfo.corpAddress || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="white-space: nowrap;">
          有效期期：&nbsp;&nbsp;
          <span>{{ printInfo.licenseExpireBegin || '空' }}</span>
          至
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ printInfo.licenseExpireEnd || '' }}</span>
        </li>
      </ul>
    </div>
    <div class="print-right-form" v-drag>
      <ul>
        <li class="print-right-form-item" style="height: 4.40cm;">
          经营品种、销售量(吨/年)：
          <span :style="{fontSize:FontAize.size + 'px'}">
            <br />
            {{ outputLabel }}
          </span>
        </li>
        <li class="print-right-form-item" style="height: 7.02cm;">
          主要流向：
          <br />
          <br />
          <span
            :style="{fontSize:FontAize.flowsize+ 'px'}"
            class="flowshow26"
          >{{ areaFlowDirectionLabel }}</span>
        </li>
        <li class="print-right-form-item" style="height: 1.68cm;">
          发证机关：
          <span>{{ printInfo.officeName || '空' }}</span>
        </li>
        <li class="print-right-form-item">
          发证日期：
          <span>{{ printInfo.issueTime || '空' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import service from '@/views/Authentication/api/service'
import draggable from '@/utils/draggable'

export default {
  props: {
    printInfo: {
      type: Object,
      default: () => {}
    },
    FontAize: {
      type: Object,
      default: () => {}
    }
  },
  directives: {
    drag: draggable
  },
  data() {
    return {
      economicTypeList: []
    }
  },
  created() {
    service.getEconomic_type().then(res => {
      if (res && res.status === 200) {
        const data = res.data.datas
        this.economicTypeList = data
      }
    })
  },
  computed: {
    outputLabel: {
      get() {
        if (this.printInfo?.corpProdOperList) {
          const list = []
          for (const item of this.printInfo.corpProdOperList) {
            list.push(item.chemicalName + item.output + item.unit + '/年')
          }
          return [...new Set(list)].join('、').replace(/、$/gi, '')
        }
      }
    },
    areaFlowDirectionLabel: {
      get() {
        if (this.printInfo?.corpProdOperList) {
          const list = []
          return this.printInfo.corpProdOperList.reduce((pre, next) => {
            for (const item of next.chemicalMainFlowList) {
              list.push(item.area)
            }
            return [...new Set(list)].join()
          }, '')
        } else return ''
      }
    },
    economicTypeLabel: {
      get() {
        const item = this.economicTypeList.find(
          item => item.value === this.printInfo.economicType
        )
        if (!item) {
          return '空'
        }
        return item.label
      }
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
//打印模板字体设置
$printFontSize: 24px;
@import '@/views/printed/scss/print.scss';
.print-container-a3 {
  background-repeat: no-repeat;
  background-size: 100%;
  font-family: SimHei;
  font-weight: bold;

  // color: red;
  @page {
    size: A3 landscape; // 打印A4 横版
  }
}
.licenseType0 {
  background-image: url('~@/assets/print/production-permit-original.jpg');
  background-position: 0.08cm -0.28cm;
  .print-qrcode-box {
    top: 4.58cm;
    right: 3.6cm;
  }
  .print-left-form {
    top: 11.82cm;
    left: 6cm;
  }
  .print-right-form {
    top: 11.38cm;
    right: 5.6cm;
  }
  .print-creditcode-box {
    top: 5.26cm;
    left: 9.4cm;
  }
}
.licenseType1 {
  background-image: url('~@/assets/print/management-permit-original.jpg');
  background-position: -0.2cm -0.06cm;
  .print-qrcode-box {
    top: 4.8cm;
    right: 3.35cm;
  }
  .print-left-form {
    top: 11.68cm;
    left: 5.8cm;
    ul .print-left-form-item span {
      color: rgb(0, 0, 0) !important;
      font-size: $printFontSize;
    }
    ul li:nth-child(5) span {
      display: block;
      position: absolute;
      left: 15%;
      top: 10%;
    }
  }
  .print-right-form {
    top: 11cm;
    right: 4cm;
    li span {
      color: rgb(0, 0, 0) !important;
    }
    li:nth-child(4) span {
      // color: red;
      // right: 10cm;
      position: relative;
      top: 0.6cm;
      // width: 500px;
      font-size: $printFontSize !important;
      right: 2cm;
    }
    li:nth-child(3) span {
      // color: red;
      // right: 10cm;
      position: relative;
      // width: 500px;
      top: 0.1cm;
      right: 0cm;
      font-size: $printFontSize !important;
      display: block;
      width: 460px;
    }

    ul li:nth-child(2) span {
      position: relative;
      // top: -15px;
      // left: 77px;
      display: block;
      width: 460px;
      top: -10px;
    }
    ul li:nth-child(1) span {
      position: relative;
      // top: -15px;
      // left: 77px;
      // display: block;
      // width: 460px;
      top: 0.1cm;
    }
  }
  .print-creditcode-box {
    top: 5.18cm;
    left: 9.4cm;
    div span {
      color: rgb(0, 0, 0);
      font-size: $printFontSize !important;
    }
  }
}
</style>
