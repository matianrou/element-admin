<!-- 备案证明 副本 -->
<template>
  <div
    :class="
      printInfo.licenseType === '0'
        ? 'print-container licenseType0'
        : 'print-container licenseType1'
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
        <li class="print-left-form-item" style="height: 1.42cm;">
          编号号号：&nbsp;
          <span>{{ printInfo.licenseNo || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 1.42cm;">
          单位名称：&nbsp;
          <span>{{ printInfo.corpName || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 1.41cm;">
          经济类型：&nbsp;
          <span>{{ economicTypeLabel || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 1.41cm;">
          主负责人：&nbsp;&nbsp;&nbsp;
          <span>{{ printInfo.corpChargePerson || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 1.41cm;position: relative;">
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
        <li class="print-right-form-item" style="height: 1.8cm;">
          品种类型：
          <span>
            {{
            printInfo.licenseChemicalType
            ? `第${chemicalType[printInfo.licenseChemicalType]}类`
            : '空'
            }}
          </span>
        </li>
        <li class="print-right-form-item" style="height: 3.70cm;">
          经营品种、销售量(吨/年)：
          <span :style="{fontSize:FontAize.size + 'px'}">
            <br />
            <br />
            {{ outputLabel }}
          </span>
        </li>
        <li class="print-right-form-item" style="height: 4.69cm;">
          主要流向：
          <br />
          <span
            class="flowshow"
            :style="{fontSize:FontAize.flowsize + 'px'}"
          >{{ areaFlowDirectionLabel }}</span>
        </li>
        <li class="print-right-form-item" style="height: 1.40cm;">
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
    FontAize: ''
  },
  directives: {
    drag: draggable
  },
  data() {
    return {
      economicTypeList: [],
      chemicalType: ['零', '一', '二', '三']
    }
  },
  watch: {
    // sizeShow(val) {
    //   this.$nextTick(() => {
    //     this.sizeShow = val
    //   })
    // },
    // deep: true
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
  methods: {
    getPrintElNode() {
      return document.querySelector('.print-container')
    }
  }
}
</script>
<style lang="scss" scoped>
$printFontSize: 20px;
@import '@/views/printed/scss/print.scss';
.print-container {
  background-repeat: no-repeat;
  background-size: 100%;
  font-family: SimHei;
  font-weight: bold;
  color: rgb(0, 0, 0) !important;
  @page {
    size: A4 landscape; // 打印A4 横版
  }
}
.licenseType0 {
  background-image: url('~@/assets/print/production-record-ectypal.jpg');
  background-position: -0.05cm 0.03cm;
  .print-left-form {
    top: 9.76cm;
    left: 3.18cm;
  }
  .print-right-form {
    top: 5.26cm;
    right: 3.1cm;
  }
  .print-qrcode-box {
    top: 2.54cm;
    right: 2.68cm;
  }
  .print-creditcode-box {
    top: 3.08cm;
    right: 2.8cm;
  }
}
.licenseType1 {
  background-image: url('~@/assets/print/management-record-ectypal.jpg');
  background-position: -0.05cm -0.03cm;
  .print-left-form {
    top: 9.76cm;
    left: 3.18cm;
    ul .print-left-form-item span {
      color: rgb(0, 0, 0) !important;
      font-size: $printFontSize;
    }
    ul li:nth-child(5) span {
      display: block;
      position: absolute;
      left: 18%;
      top: 2%;
    }
  }
  .print-right-form {
    top: 5.26cm;
    right: 2.8cm;
    ul li span {
      color: rgb(0, 0, 0) !important;
    }
    ul li:nth-child(1) span {
      font-size: $printFontSize;
    }
    ul li:nth-child(3) span {
      // color: yellowgreen;
      // right: 5cm;
      position: relative;
      width: 320px;
      left: 85px;
    }
    ul li:nth-child(4) span {
      position: relative;
      top: -15px;
      left: 77px;
      display: block;
      width: 330px;
      font-size: $printFontSize;
      // color: red;
      // top: 10cm;
    }
    ul li:nth-child(5) span {
      font-size: $printFontSize;
    }
  }
  .print-qrcode-box {
    top: 2.54cm;
    right: 2.68cm;
  }
  .print-creditcode-box {
    top: 3.08cm;
    right: 2.8cm;
    div span {
      color: rgb(0, 0, 0);
    }
  }
}
</style>
<style lang="scss">
.sizeposition {
  margin-left: 47px;
  span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    text-align: center;
    padding-left: 9px;
    border: 1px solid #000;
  }
  .sizebtn {
    width: 20px;
    height: 20px;
    color: #fff;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;
    text-align: center;
    background: #000;
    margin-right: 5px;
    font-size: 18px;
  }
}
</style>
