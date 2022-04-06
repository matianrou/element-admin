<!-- 许可证 副本 -->
<template>
  <div
    :class="
      printInfo.licenseType === '0'
        ? 'print-container licenseType0'
        : 'print-container licenseType1'
    "
  >
    <div v-if="disabledDrag">
      <div class="print-qrcode-box">
        <!-- <img :src="`data:image/jpg;base64,${printInfo.qrCode}`" class="print-qrcode-img" alt="二维码" /> -->
      </div>
      <!-- 统一社会信用代码 -->
      <div class="print-creditcode-box">
        <div style="height: 0.78cm;">
          <span>{{ printInfo.licenseNo || '空' }}</span>
        </div>
        <div style="text-indent: 6em;">
          <span>{{ printInfo.creditCode || '空' }}</span>
        </div>
      </div>
      <div class="print-left-form">
        <ul>
          <li class="print-left-form-item" style="height: 1.69cm;">
            单位名称：&nbsp;
            <span>{{ printInfo.corpName || '空' }}</span>
          </li>
          <li class="print-left-form-item" style="height: 1.72cm;">
            经济类型：&nbsp;
            <span>{{ economicTypeLabel || '空' }}</span>
          </li>
          <li class="print-left-form-item" style="height: 1.70cm;">
            主负责人：&nbsp;&nbsp;&nbsp;
            <span>{{ printInfo.corpChargePerson || '空' }}</span>
          </li>
          <li class="print-left-form-item" style="height: 1.68cm;">
            单位地址：&nbsp;
            <span
              :style="{fontSize:FontAize.dansize + 'px'+!important}"
            >{{ printInfo.corpAddress || '空' }}</span>
          </li>
          <li class="print-left-form-item">
            有效期期：&nbsp;
            <span>{{ printInfo.licenseExpireBegin || '空' }}</span>
            至&nbsp;&nbsp;
            <span>{{ printInfo.licenseExpireEnd || '' }}</span>
          </li>
        </ul>
      </div>
      <div class="print-right-form">
        <ul>
          <li class="print-right-form-item" style="height: 3.45cm;">
            经营品种、销售量(吨/年)：
            <span :style="{fontSize:FontAize.size + 'px'}">
              <br />
              {{ outputLabel }}
            </span>
          </li>
          <li class="print-right-form-item" style="height: 6.1cm;">
            主要流向：
            <br />
            <br />
            <span
              :style="{fontSize:FontAize.flowsize + 'px'}"
              class="flowshow"
            >{{ areaFlowDirectionLabel }}</span>
          </li>
          <li class="print-right-form-item" style="height: 1.4cm;">
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
    <div v-else>
      <div class="print-qrcode-box" v-drag="false">
        <img :src="`data:image/jpg;base64,${printInfo.qrCode}`" class="print-qrcode-img" alt="二维码" />
      </div>
      <!-- 统一社会信用代码 -->
      <div class="print-creditcode-box" v-drag>
        <div style="height: 0.78cm;">
          <span>{{ printInfo.licenseNo || '空' }}</span>
        </div>
        <div style="text-indent: 6em;">
          <span>{{ printInfo.creditCode || '空' }}</span>
        </div>
      </div>
      <div class="print-left-form" v-drag>
        <ul>
          <li class="print-left-form-item" style="height: 1.69cm;">
            单位名称：&nbsp;
            <span>{{ printInfo.corpName || '空' }}</span>
          </li>
          <li class="print-left-form-item" style="height: 1.72cm;">
            经济类型：&nbsp;
            <span>{{ economicTypeLabel || '空' }}</span>
          </li>
          <li class="print-left-form-item" style="height: 1.70cm;">
            主负责人：&nbsp;&nbsp;&nbsp;
            <span>{{ printInfo.corpChargePerson || '空' }}</span>
          </li>
          <li class="print-left-form-item" style="height: 1.68cm;position: relative;">
            单位地址：&nbsp;
            <span
              :style="{fontSize:FontAize.dansize + 'px'}"
            >{{ printInfo.corpAddress || '空' }}</span>
          </li>
          <li class="print-left-form-item" style="white-space: nowrap;">
            有效期期：&nbsp;
            <span>{{ printInfo.licenseExpireBegin || '空' }}</span>
            至
            &nbsp;&nbsp;&nbsp;
            <span>{{ printInfo.licenseExpireEnd || '' }}</span>
          </li>
        </ul>
      </div>
      <div class="print-right-form" v-drag>
        <ul>
          <li class="print-right-form-item" style="height: 3.45cm;">
            经营品种、销售量(吨/年)：
            <span :style="{fontSize:FontAize.size + 'px'}" class="importantStyle">
              <br />
              {{ outputLabel }}
            </span>
          </li>
          <li class="print-right-form-item" style="height: 6.1cm;">
            主要流向：
            <span :style="{fontSize:FontAize.flowsize + 'px'}">{{ areaFlowDirectionLabel }}</span>
          </li>
          <li class="print-right-form-item" style="height: 1.4cm;">
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
  </div>
</template>
<script>
import service from '@/views/Authentication/api/service'
import draggable from '@/utils/draggable'

export default {
  props: {
    disabledDrag: '',
    printInfo: {
      type: Object,
      default: () => {}
    },
    FontAize: ''
  },
  directives: {
    drag: draggable
  },
  data() {
    return {
      economicTypeList: [],
      size: 22
    }
  },
  created() {
    service.getEconomic_type().then(res => {
      if (res && res.status === 200) {
        const data = res.data.datas
        this.economicTypeList = data
      }
    })
    console.log('printInfo', this.printInfo)
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
  methods: {
    getPrintElNode() {
      return document.querySelector('.print-container')
    }
  }
}
</script>
<style lang="scss" scoped>
//打印模板字体设置
$printFontSize: 20px;
@import '@/views/printed/scss/print.scss';
.print-container {
  background-repeat: no-repeat;
  background-size: 100%;
  font-family: SimHei;
  font-weight: bold;
  // color: rgb(0, 0, 0)!important;
  @page {
    size: A4 landscape; // 打印A4 横版
  }
}
.licenseType0 {
  background-image: url('~@/assets/print/production-permit-ectypal.jpg');
  background-position: -0.02cm -0.12cm;
  .print-left-form {
    top: 10cm;
    left: 3.2cm;
  }
  .print-right-form {
    top: 5.85cm;
    right: 3.1cm;
  }
  .print-qrcode-box {
    top: 2.5cm;
    right: 2.76cm;
  }
  .print-creditcode-box {
    top: 2.5cm;
    right: 5.1cm;
  }
}
.licenseType1 {
  background-image: url('~@/assets/print/management-permit-ectypal.jpg');
  background-position: -0.12cm -0.1cm;

  .print-left-form {
    top: 10.02cm;
    left: 3.16cm;
    // background-color: yellowgreen;

    ul .print-left-form-item span {
      color: rgb(0, 0, 0) !important;
      font-size: $printFontSize;
    }
    ul li:nth-child(4) span {
      // background-color: yellowgreen;
      display: block;
      position: absolute;
      left: 18%;
      top: 10%;
    }
  }
  .print-right-form {
    top: 5.9cm;
    right: 2.8cm;
    // ul li span{
    //   background-color: red;
    //   height: 60px;
    //   // display: block;
    // }
    ul li span {
      color: rgb(0, 0, 0) !important;
      font-size: $printFontSize;
    }
    ul li:nth-child(1) span {
      position: relative;
      top: 12px;
      // color: red;
      // top: 10cm;
    }
    ul li:nth-child(3) span {
      position: relative;
      top: -15px;
      left: 77px;
      display: block;
      width: 330px;
      font-size: $printFontSize;
      // color: red;
      // top: 10cm;
    }
    ul li:nth-child(4) span {
      font-size: $printFontSize;
    }
    // ul li:nth-child(5) span {
    //   font-size: $printFontSize;
    // }
    // ul li .importantStyle {
    //   color: yellowgreen;
    // }
  }
  .print-qrcode-box {
    top: 2.4cm;
    right: 2.6cm;
  }
  .print-creditcode-box {
    top: 2.55cm;
    right: 5.1cm;
    div span {
      color: rgb(0, 0, 0);
    }
  }
}
</style>
