<!-- 备案证明 正本 -->
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
        <li class="print-left-form-item" style="height: 2.12cm;">
          编号号号：&nbsp;
          <span>{{ printInfo.licenseNo || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 2.1cm;">
          单位名称：&nbsp;
          <span>{{ printInfo.corpName || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 2.08cm;">
          经济类型：&nbsp;
          <span>{{ economicTypeLabel || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 2.16cm;">
          主负责人：&nbsp;&nbsp;&nbsp;
          <span>{{ printInfo.corpChargePerson || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="height: 2.14cm;position: relative;left:-2%">
          单位地址：&nbsp;
          <span
            :style="{fontSize:FontAize.dansize + 'px'}"
          >{{ printInfo.corpAddress || '空' }}</span>
        </li>
        <li class="print-left-form-item" style="white-space: nowrap;">
          有效期期：&nbsp;
          <span>{{ printInfo.licenseExpireBegin || '空' }}</span>
          至
          <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ printInfo.licenseExpireEnd || '' }}</span>
        </li>
      </ul>
    </div>
    <div class="print-right-form" v-drag>
      <ul>
        <li class="print-right-form-item" style="height: 1.99cm;">
          品种类型：
          <span>
            {{
            `第${chemicalType[printInfo.licenseChemicalType]}类` || '空'
            }}
          </span>
        </li>
        <li class="print-right-form-item" style="height: 3.75cm;">
          经营品种、销售量(吨/年)：
          <span :style="{fontSize:FontAize.size + 'px'}">
            <br />
            {{ outputLabel }}
          </span>
        </li>
        <li class="print-right-form-item" style="height: 5.40cm;">
          主要流向：
          <br />
          <br />
          <span
            :style="{fontSize:FontAize.flowsize + 'px'}"
            class="flowshow"
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
    FontAize: ''
  },
  directives: {
    drag: draggable
  },
  data() {
    return {
      economicTypeList: [],
      chemicalType: ['零', '一', '二', '三'],
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
@import '@/views/printed/scss/print.scss';
.print-container-a3 {
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 0.46cm -0.15cm;
  font-family: SimHei;
  font-weight: bold;
  color: rgb(0, 0, 0) !important;
  @page {
    size: A3 landscape; // 打印A4 横版
  }
}
.licenseType0 {
  background-image: url('~@/assets/print/production-record-original.jpg');
  .print-qrcode-box {
    top: 4.7cm;
    right: 3.3cm;
  }
  .print-left-form {
    top: 11.76cm;
    left: 5.8cm;
  }
  .print-right-form {
    top: 11.82cm;
    right: 5.6cm;
  }
  .print-creditcode-box {
    top: 5.24cm;
    left: 9.4cm;
  }
}
.licenseType1 {
  background-image: url('~@/assets/print/management-record-original.jpg');
  .print-qrcode-box {
    top: 4.8cm;
    right: 3.25cm;
  }
  .print-left-form {
    top: 11.7cm;
    left: 6.2cm;
    ul li span {
      color: rgb(0, 0, 0) !important;
    }
    ul li:nth-child(5) span {
      display: block;
      position: absolute;
      left: 16%;
      top: 1%;
    }
  }
  .print-right-form {
    top: 11.76cm;
    right: 5.5cm;
    ul li span {
      color: rgb(0, 0, 0) !important;
    }
    ul li:nth-child(2) span {
      // color: yellowgreen;
      // right: 5cm;
      position: relative;
      left: 83px;
    }
    ul li:nth-child(3) span {
      // color: yellowgreen;
      // right: 5cm;
      position: relative;
      left: 83px;
    }
    ul li:nth-child(4) span {
      position: relative;
      top: -15px;
      left: 77px;
      display: block;
      width: 460px;
      // color: red;
      // top: 10cm;
    }
  }
  .print-creditcode-box {
    top: 5.18cm;
    left: 9.5cm;
    div span {
      color: rgb(0, 0, 0);
    }
  }
}
</style>
